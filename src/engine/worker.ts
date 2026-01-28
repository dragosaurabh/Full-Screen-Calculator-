/**
 * Web Worker for heavy computations
 * 
 * Handles computations that exceed 100ms to keep UI responsive.
 * Validates: Requirements 21.3, 4.8
 */

import type { 
  WorkerRequest, 
  WorkerResponse, 
  EvaluatePayload, 
  MatrixPayload, 
  GraphPayload, 
  BatchPayload,
  EvaluateResult,
  MatrixResult,
  GraphResult,
  BatchResult,
  ProgressPayload,
  Matrix
} from '../types';
import { parse } from './parser';
import { evaluate, createDefaultContext } from './evaluator';
import { evaluatePrecision, createPrecisionContext, Decimal } from './precision';
import { matrixOperations } from './modes/matrix';

/**
 * Send a progress update to the main thread
 */
function sendProgress(id: string, current: number, total: number, message?: string): void {
  const response: WorkerResponse = {
    id,
    type: 'progress',
    payload: { current, total, message } as ProgressPayload
  };
  self.postMessage(response);
}

/**
 * Send a result to the main thread
 */
function sendResult(id: string, payload: unknown): void {
  const response: WorkerResponse = {
    id,
    type: 'result',
    payload
  };
  self.postMessage(response);
}

/**
 * Send an error to the main thread
 */
function sendError(id: string, error: string): void {
  const response: WorkerResponse = {
    id,
    type: 'error',
    payload: error
  };
  self.postMessage(response);
}

/**
 * Handle expression evaluation
 */
function handleEvaluate(id: string, payload: EvaluatePayload): void {
  const { expression, precision, angleMode, usePrecisionMode, variables } = payload;
  
  try {
    let value: number | string;
    let formatted: string;
    
    if (usePrecisionMode) {
      // Use arbitrary precision mode
      const context = createPrecisionContext(precision);
      context.angleMode = angleMode;
      
      // Add variables to context
      if (variables) {
        for (const [name, val] of Object.entries(variables)) {
          context.variables.set(name, new Decimal(val));
        }
      }
      
      const ast = parse(expression);
      const result = evaluatePrecision(ast, context);
      value = result.toString();
      formatted = result.toSignificantDigits(precision).toString();
    } else {
      // Use standard precision mode
      const context = createDefaultContext();
      context.angleMode = angleMode;
      context.precision = precision;
      
      // Add variables to context
      if (variables) {
        for (const [name, val] of Object.entries(variables)) {
          context.variables.set(name, val);
        }
      }
      
      const ast = parse(expression);
      value = evaluate(ast, context);
      formatted = formatNumber(value, precision);
    }
    
    const result: EvaluateResult = { value, formatted };
    sendResult(id, result);
  } catch (error) {
    sendError(id, error instanceof Error ? error.message : 'Evaluation error');
  }
}

/**
 * Format a number with the given precision
 */
function formatNumber(value: number, precision: number = 15): string {
  if (!Number.isFinite(value)) {
    if (Number.isNaN(value)) return 'NaN';
    return value > 0 ? '∞' : '-∞';
  }
  
  const formatted = value.toPrecision(precision);
  
  if (formatted.includes('.')) {
    return formatted.replace(/\.?0+$/, '').replace(/\.?0+e/, 'e');
  }
  
  return formatted;
}

/**
 * Handle matrix operations
 */
function handleMatrix(id: string, payload: MatrixPayload): void {
  const { operation, matrices, constants } = payload;
  
  try {
    let result: Matrix | number | number[];
    let type: 'matrix' | 'number' | 'array';
    
    switch (operation) {
      case 'multiply': {
        if (matrices.length < 2) {
          throw new Error('Matrix multiplication requires at least 2 matrices');
        }
        // Multiply all matrices in sequence
        let product = matrices[0]!;
        for (let i = 1; i < matrices.length; i++) {
          sendProgress(id, i, matrices.length - 1, `Multiplying matrix ${i + 1}`);
          product = matrixOperations.multiply(product, matrices[i]!);
        }
        result = product;
        type = 'matrix';
        break;
      }
      
      case 'inverse': {
        if (matrices.length < 1) {
          throw new Error('Matrix inverse requires a matrix');
        }
        result = matrixOperations.inverse(matrices[0]!);
        type = 'matrix';
        break;
      }
      
      case 'determinant': {
        if (matrices.length < 1) {
          throw new Error('Matrix determinant requires a matrix');
        }
        result = matrixOperations.determinant(matrices[0]!);
        type = 'number';
        break;
      }
      
      case 'solve': {
        if (matrices.length < 1 || !constants) {
          throw new Error('Linear system solve requires a coefficient matrix and constants');
        }
        result = matrixOperations.solve(matrices[0]!, constants);
        type = 'array';
        break;
      }
      
      case 'add': {
        if (matrices.length < 2) {
          throw new Error('Matrix addition requires at least 2 matrices');
        }
        let sum = matrices[0]!;
        for (let i = 1; i < matrices.length; i++) {
          sendProgress(id, i, matrices.length - 1, `Adding matrix ${i + 1}`);
          sum = matrixOperations.add(sum, matrices[i]!);
        }
        result = sum;
        type = 'matrix';
        break;
      }
      
      case 'subtract': {
        if (matrices.length < 2) {
          throw new Error('Matrix subtraction requires 2 matrices');
        }
        result = matrixOperations.subtract(matrices[0]!, matrices[1]!);
        type = 'matrix';
        break;
      }
      
      default:
        throw new Error(`Unknown matrix operation: ${operation}`);
    }
    
    const matrixResult: MatrixResult = { result, type };
    sendResult(id, matrixResult);
  } catch (error) {
    sendError(id, error instanceof Error ? error.message : 'Matrix operation error');
  }
}

/**
 * Handle graph data generation
 * Generates points for plotting a function y = f(x)
 */
function handleGraph(id: string, payload: GraphPayload): void {
  const { expression, xMin, xMax, numPoints, variables } = payload;
  
  try {
    const points: Array<{ x: number; y: number | null }> = [];
    let hasDiscontinuities = false;
    const step = (xMax - xMin) / (numPoints - 1);
    
    // Create evaluation context
    const context = createDefaultContext();
    context.angleMode = 'radians';
    
    // Add any additional variables
    if (variables) {
      for (const [name, val] of Object.entries(variables)) {
        context.variables.set(name, val);
      }
    }
    
    // Parse the expression once
    const ast = parse(expression);
    
    // Track previous y value for discontinuity detection
    let prevY: number | null = null;
    const discontinuityThreshold = 1000; // Large jump indicates discontinuity
    
    // Progress reporting interval
    const progressInterval = Math.max(1, Math.floor(numPoints / 20));
    
    for (let i = 0; i < numPoints; i++) {
      const x = xMin + i * step;
      
      // Report progress periodically
      if (i % progressInterval === 0) {
        sendProgress(id, i, numPoints, `Sampling point ${i + 1} of ${numPoints}`);
      }
      
      // Set x variable
      context.variables.set('x', x);
      
      try {
        const y = evaluate(ast, context);
        
        // Check for discontinuity
        if (prevY !== null && Math.abs(y - prevY) > discontinuityThreshold) {
          hasDiscontinuities = true;
          // Insert a null point to break the line
          points.push({ x, y: null });
        }
        
        // Check for valid y value
        if (Number.isFinite(y)) {
          points.push({ x, y });
          prevY = y;
        } else {
          points.push({ x, y: null });
          prevY = null;
          hasDiscontinuities = true;
        }
      } catch {
        // Point is undefined (e.g., division by zero, domain error)
        points.push({ x, y: null });
        prevY = null;
        hasDiscontinuities = true;
      }
    }
    
    const result: GraphResult = { points, hasDiscontinuities };
    sendResult(id, result);
  } catch (error) {
    sendError(id, error instanceof Error ? error.message : 'Graph generation error');
  }
}

/**
 * Handle batch calculation
 * Evaluates multiple expressions and returns all results
 */
function handleBatch(id: string, payload: BatchPayload): void {
  const { expressions, precision, angleMode, usePrecisionMode } = payload;
  
  try {
    const results: Array<{ value: number | string; formatted: string } | { error: string }> = [];
    
    for (let i = 0; i < expressions.length; i++) {
      // Report progress
      sendProgress(id, i + 1, expressions.length, `Evaluating expression ${i + 1} of ${expressions.length}`);
      
      const expression = expressions[i]!;
      
      try {
        let value: number | string;
        let formatted: string;
        
        if (usePrecisionMode) {
          const context = createPrecisionContext(precision);
          context.angleMode = angleMode;
          const ast = parse(expression);
          const result = evaluatePrecision(ast, context);
          value = result.toString();
          formatted = result.toSignificantDigits(precision).toString();
        } else {
          const context = createDefaultContext();
          context.angleMode = angleMode;
          context.precision = precision;
          const ast = parse(expression);
          value = evaluate(ast, context);
          formatted = formatNumber(value, precision);
        }
        
        results.push({ value, formatted });
      } catch (error) {
        results.push({ error: error instanceof Error ? error.message : 'Evaluation error' });
      }
    }
    
    const batchResult: BatchResult = { results };
    sendResult(id, batchResult);
  } catch (error) {
    sendError(id, error instanceof Error ? error.message : 'Batch calculation error');
  }
}

/**
 * Handle incoming worker messages
 */
self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { id, type, payload } = event.data;

  try {
    switch (type) {
      case 'evaluate':
        handleEvaluate(id, payload as EvaluatePayload);
        break;
      case 'graph':
        handleGraph(id, payload as GraphPayload);
        break;
      case 'matrix':
        handleMatrix(id, payload as MatrixPayload);
        break;
      case 'batch':
        handleBatch(id, payload as BatchPayload);
        break;
      default:
        sendError(id, `Unknown worker request type: ${type}`);
    }
  } catch (error) {
    sendError(id, error instanceof Error ? error.message : 'Unknown error');
  }
};

export {};
