/**
 * Web Worker Tests
 * 
 * Tests for the calculation Web Worker functionality.
 * Note: These tests run the worker logic directly since Web Workers
 * are not available in the test environment.
 */

import { describe, it, expect } from 'vitest';
import type {
  EvaluatePayload,
  MatrixPayload,
  GraphPayload,
  BatchPayload,
  Matrix
} from '../types';
import { parse } from './parser';
import { evaluate, createDefaultContext } from './evaluator';
import { evaluatePrecision, createPrecisionContext, Decimal } from './precision';
import { matrixOperations } from './modes/matrix';

// Helper function to format numbers (same as in worker)
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

// Simulate worker evaluate handler
function handleEvaluate(payload: EvaluatePayload): { value: number | string; formatted: string } {
  const { expression, precision, angleMode, usePrecisionMode, variables } = payload;
  
  let value: number | string;
  let formatted: string;
  
  if (usePrecisionMode) {
    const context = createPrecisionContext(precision);
    context.angleMode = angleMode;
    
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
    const context = createDefaultContext();
    context.angleMode = angleMode;
    context.precision = precision;
    
    if (variables) {
      for (const [name, val] of Object.entries(variables)) {
        context.variables.set(name, val);
      }
    }
    
    const ast = parse(expression);
    value = evaluate(ast, context);
    formatted = formatNumber(value, precision);
  }
  
  return { value, formatted };
}

// Simulate worker matrix handler
function handleMatrix(payload: MatrixPayload): { result: Matrix | number | number[]; type: 'matrix' | 'number' | 'array' } {
  const { operation, matrices, constants } = payload;
  
  let result: Matrix | number | number[];
  let type: 'matrix' | 'number' | 'array';
  
  switch (operation) {
    case 'multiply': {
      let product = matrices[0]!;
      for (let i = 1; i < matrices.length; i++) {
        product = matrixOperations.multiply(product, matrices[i]!);
      }
      result = product;
      type = 'matrix';
      break;
    }
    
    case 'inverse': {
      result = matrixOperations.inverse(matrices[0]!);
      type = 'matrix';
      break;
    }
    
    case 'determinant': {
      result = matrixOperations.determinant(matrices[0]!);
      type = 'number';
      break;
    }
    
    case 'solve': {
      result = matrixOperations.solve(matrices[0]!, constants!);
      type = 'array';
      break;
    }
    
    case 'add': {
      let sum = matrices[0]!;
      for (let i = 1; i < matrices.length; i++) {
        sum = matrixOperations.add(sum, matrices[i]!);
      }
      result = sum;
      type = 'matrix';
      break;
    }
    
    case 'subtract': {
      result = matrixOperations.subtract(matrices[0]!, matrices[1]!);
      type = 'matrix';
      break;
    }
    
    default:
      throw new Error(`Unknown matrix operation: ${operation}`);
  }
  
  return { result, type };
}

// Simulate worker graph handler
function handleGraph(payload: GraphPayload): { points: Array<{ x: number; y: number | null }>; hasDiscontinuities: boolean } {
  const { expression, xMin, xMax, numPoints, variables } = payload;
  
  const points: Array<{ x: number; y: number | null }> = [];
  let hasDiscontinuities = false;
  const step = (xMax - xMin) / (numPoints - 1);
  
  const context = createDefaultContext();
  context.angleMode = 'radians';
  
  if (variables) {
    for (const [name, val] of Object.entries(variables)) {
      context.variables.set(name, val);
    }
  }
  
  const ast = parse(expression);
  let prevY: number | null = null;
  const discontinuityThreshold = 1000;
  
  for (let i = 0; i < numPoints; i++) {
    const x = xMin + i * step;
    context.variables.set('x', x);
    
    try {
      const y = evaluate(ast, context);
      
      if (prevY !== null && Math.abs(y - prevY) > discontinuityThreshold) {
        hasDiscontinuities = true;
        points.push({ x, y: null });
      }
      
      if (Number.isFinite(y)) {
        points.push({ x, y });
        prevY = y;
      } else {
        points.push({ x, y: null });
        prevY = null;
        hasDiscontinuities = true;
      }
    } catch {
      points.push({ x, y: null });
      prevY = null;
      hasDiscontinuities = true;
    }
  }
  
  return { points, hasDiscontinuities };
}

// Simulate worker batch handler
function handleBatch(payload: BatchPayload): { results: Array<{ value: number | string; formatted: string } | { error: string }> } {
  const { expressions, precision, angleMode, usePrecisionMode } = payload;
  
  const results: Array<{ value: number | string; formatted: string } | { error: string }> = [];
  
  for (const expression of expressions) {
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
  
  return { results };
}

describe('Worker: Expression Evaluation', () => {
  it('should evaluate basic arithmetic expressions', () => {
    const result = handleEvaluate({
      expression: '2 + 3 * 4',
      precision: 15,
      angleMode: 'radians',
      usePrecisionMode: false
    });
    
    expect(result.value).toBe(14);
    expect(result.formatted).toBe('14');
  });

  it('should evaluate expressions with variables', () => {
    const result = handleEvaluate({
      expression: 'x * 2 + y',
      precision: 15,
      angleMode: 'radians',
      usePrecisionMode: false,
      variables: { x: 5, y: 3 }
    });
    
    expect(result.value).toBe(13);
  });

  it('should evaluate trigonometric functions in degrees mode', () => {
    const result = handleEvaluate({
      expression: 'sin(90)',
      precision: 15,
      angleMode: 'degrees',
      usePrecisionMode: false
    });
    
    expect(result.value).toBeCloseTo(1, 10);
  });

  it('should evaluate trigonometric functions in radians mode', () => {
    const result = handleEvaluate({
      expression: 'sin(pi/2)',
      precision: 15,
      angleMode: 'radians',
      usePrecisionMode: false
    });
    
    expect(result.value).toBeCloseTo(1, 10);
  });

  it('should use arbitrary precision mode when enabled', () => {
    const result = handleEvaluate({
      expression: '1/3',
      precision: 30,
      angleMode: 'radians',
      usePrecisionMode: true
    });
    
    expect(typeof result.value).toBe('string');
    expect(result.value.toString()).toContain('0.333333333333333333333333333333');
  });

  it('should handle scientific functions', () => {
    const result = handleEvaluate({
      expression: 'sqrt(16) + ln(e)',
      precision: 15,
      angleMode: 'radians',
      usePrecisionMode: false
    });
    
    expect(result.value).toBeCloseTo(5, 10);
  });
});

describe('Worker: Matrix Operations', () => {
  it('should multiply two matrices', () => {
    const matrixA: Matrix = {
      rows: 2,
      cols: 2,
      data: [[1, 2], [3, 4]]
    };
    const matrixB: Matrix = {
      rows: 2,
      cols: 2,
      data: [[5, 6], [7, 8]]
    };
    
    const result = handleMatrix({
      operation: 'multiply',
      matrices: [matrixA, matrixB]
    });
    
    expect(result.type).toBe('matrix');
    const matrix = result.result as Matrix;
    expect(matrix.data[0]![0]).toBe(19);
    expect(matrix.data[0]![1]).toBe(22);
    expect(matrix.data[1]![0]).toBe(43);
    expect(matrix.data[1]![1]).toBe(50);
  });

  it('should calculate matrix inverse', () => {
    const matrix: Matrix = {
      rows: 2,
      cols: 2,
      data: [[4, 7], [2, 6]]
    };
    
    const result = handleMatrix({
      operation: 'inverse',
      matrices: [matrix]
    });
    
    expect(result.type).toBe('matrix');
    const inverse = result.result as Matrix;
    expect(inverse.data[0]![0]).toBeCloseTo(0.6, 10);
    expect(inverse.data[0]![1]).toBeCloseTo(-0.7, 10);
    expect(inverse.data[1]![0]).toBeCloseTo(-0.2, 10);
    expect(inverse.data[1]![1]).toBeCloseTo(0.4, 10);
  });

  it('should calculate matrix determinant', () => {
    const matrix: Matrix = {
      rows: 2,
      cols: 2,
      data: [[4, 7], [2, 6]]
    };
    
    const result = handleMatrix({
      operation: 'determinant',
      matrices: [matrix]
    });
    
    expect(result.type).toBe('number');
    expect(result.result).toBeCloseTo(10, 10);
  });

  it('should solve linear system', () => {
    // System: 2x + y = 5, x + 3y = 10
    // Solution: x = 1, y = 3
    const coefficients: Matrix = {
      rows: 2,
      cols: 2,
      data: [[2, 1], [1, 3]]
    };
    
    const result = handleMatrix({
      operation: 'solve',
      matrices: [coefficients],
      constants: [5, 10]
    });
    
    expect(result.type).toBe('array');
    const solution = result.result as number[];
    expect(solution[0]).toBeCloseTo(1, 10);
    expect(solution[1]).toBeCloseTo(3, 10);
  });

  it('should add matrices', () => {
    const matrixA: Matrix = {
      rows: 2,
      cols: 2,
      data: [[1, 2], [3, 4]]
    };
    const matrixB: Matrix = {
      rows: 2,
      cols: 2,
      data: [[5, 6], [7, 8]]
    };
    
    const result = handleMatrix({
      operation: 'add',
      matrices: [matrixA, matrixB]
    });
    
    expect(result.type).toBe('matrix');
    const matrix = result.result as Matrix;
    expect(matrix.data[0]![0]).toBe(6);
    expect(matrix.data[0]![1]).toBe(8);
    expect(matrix.data[1]![0]).toBe(10);
    expect(matrix.data[1]![1]).toBe(12);
  });

  it('should subtract matrices', () => {
    const matrixA: Matrix = {
      rows: 2,
      cols: 2,
      data: [[5, 6], [7, 8]]
    };
    const matrixB: Matrix = {
      rows: 2,
      cols: 2,
      data: [[1, 2], [3, 4]]
    };
    
    const result = handleMatrix({
      operation: 'subtract',
      matrices: [matrixA, matrixB]
    });
    
    expect(result.type).toBe('matrix');
    const matrix = result.result as Matrix;
    expect(matrix.data[0]![0]).toBe(4);
    expect(matrix.data[0]![1]).toBe(4);
    expect(matrix.data[1]![0]).toBe(4);
    expect(matrix.data[1]![1]).toBe(4);
  });
});

describe('Worker: Graph Data Generation', () => {
  it('should generate points for a linear function', () => {
    const result = handleGraph({
      expression: 'x',
      xMin: 0,
      xMax: 10,
      numPoints: 11
    });
    
    expect(result.points.length).toBe(11);
    expect(result.hasDiscontinuities).toBe(false);
    
    // Check first and last points
    expect(result.points[0]!.x).toBe(0);
    expect(result.points[0]!.y).toBe(0);
    expect(result.points[10]!.x).toBe(10);
    expect(result.points[10]!.y).toBe(10);
  });

  it('should generate points for a quadratic function', () => {
    const result = handleGraph({
      expression: 'x^2',
      xMin: -2,
      xMax: 2,
      numPoints: 5
    });
    
    expect(result.points.length).toBe(5);
    expect(result.hasDiscontinuities).toBe(false);
    
    // Check vertex
    expect(result.points[2]!.x).toBe(0);
    expect(result.points[2]!.y).toBe(0);
  });

  it('should detect discontinuities in 1/x', () => {
    const result = handleGraph({
      expression: '1/x',
      xMin: -1,
      xMax: 1,
      numPoints: 21
    });
    
    expect(result.hasDiscontinuities).toBe(true);
    
    // Should have null points near x=0
    const nullPoints = result.points.filter(p => p.y === null);
    expect(nullPoints.length).toBeGreaterThan(0);
  });

  it('should handle trigonometric functions', () => {
    const result = handleGraph({
      expression: 'sin(x)',
      xMin: 0,
      xMax: 2 * Math.PI,
      numPoints: 100
    });
    
    expect(result.points.length).toBe(100);
    expect(result.hasDiscontinuities).toBe(false);
    
    // All y values should be between -1 and 1
    for (const point of result.points) {
      if (point.y !== null) {
        expect(point.y).toBeGreaterThanOrEqual(-1.001);
        expect(point.y).toBeLessThanOrEqual(1.001);
      }
    }
  });

  it('should use additional variables', () => {
    const result = handleGraph({
      expression: 'a * x + b',
      xMin: 0,
      xMax: 10,
      numPoints: 11,
      variables: { a: 2, b: 5 }
    });
    
    expect(result.points.length).toBe(11);
    expect(result.hasDiscontinuities).toBe(false);
    
    // y = 2x + 5, so at x=0, y=5 and at x=10, y=25
    expect(result.points[0]!.y).toBe(5);
    expect(result.points[10]!.y).toBe(25);
  });
});

describe('Worker: Batch Calculation', () => {
  it('should evaluate multiple expressions', () => {
    const result = handleBatch({
      expressions: ['1 + 1', '2 * 3', '10 / 2'],
      precision: 15,
      angleMode: 'radians',
      usePrecisionMode: false
    });
    
    expect(result.results.length).toBe(3);
    expect((result.results[0] as { value: number }).value).toBe(2);
    expect((result.results[1] as { value: number }).value).toBe(6);
    expect((result.results[2] as { value: number }).value).toBe(5);
  });

  it('should handle errors in individual expressions', () => {
    const result = handleBatch({
      expressions: ['1 + 1', 'invalid()', '2 * 3'],
      precision: 15,
      angleMode: 'radians',
      usePrecisionMode: false
    });
    
    expect(result.results.length).toBe(3);
    expect((result.results[0] as { value: number }).value).toBe(2);
    expect('error' in result.results[1]!).toBe(true);
    expect((result.results[2] as { value: number }).value).toBe(6);
  });

  it('should use precision mode for all expressions', () => {
    const result = handleBatch({
      expressions: ['1/3', '1/7'],
      precision: 20,
      angleMode: 'radians',
      usePrecisionMode: true
    });
    
    expect(result.results.length).toBe(2);
    expect(typeof (result.results[0] as { value: string }).value).toBe('string');
    expect((result.results[0] as { value: string }).value).toContain('0.33333333333333333333');
  });

  it('should handle empty expression list', () => {
    const result = handleBatch({
      expressions: [],
      precision: 15,
      angleMode: 'radians',
      usePrecisionMode: false
    });
    
    expect(result.results.length).toBe(0);
  });
});

describe('Worker: Error Handling', () => {
  it('should handle division by zero', () => {
    expect(() => handleEvaluate({
      expression: '1/0',
      precision: 15,
      angleMode: 'radians',
      usePrecisionMode: false
    })).toThrow('Cannot divide by zero');
  });

  it('should handle invalid expressions', () => {
    expect(() => handleEvaluate({
      expression: '1 + * 2',
      precision: 15,
      angleMode: 'radians',
      usePrecisionMode: false
    })).toThrow();
  });

  it('should handle singular matrix inverse', () => {
    const singularMatrix: Matrix = {
      rows: 2,
      cols: 2,
      data: [[1, 2], [2, 4]] // Rows are linearly dependent
    };
    
    expect(() => handleMatrix({
      operation: 'inverse',
      matrices: [singularMatrix]
    })).toThrow('singular');
  });

  it('should handle matrix dimension mismatch', () => {
    const matrixA: Matrix = {
      rows: 2,
      cols: 3,
      data: [[1, 2, 3], [4, 5, 6]]
    };
    const matrixB: Matrix = {
      rows: 2,
      cols: 2,
      data: [[1, 2], [3, 4]]
    };
    
    expect(() => handleMatrix({
      operation: 'multiply',
      matrices: [matrixA, matrixB]
    })).toThrow();
  });
});
