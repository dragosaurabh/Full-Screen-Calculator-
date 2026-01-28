/**
 * Expression Evaluator
 * 
 * Evaluates parsed AST nodes to produce numerical results.
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.1-2.8, 10.3, 10.4, 10.5
 */

import type { ASTNodeType, AngleMode, CalculationResult } from '../types';
import { CONSTANTS, parse } from './parser';

// Error types
export class EvaluationError extends Error {
  constructor(
    message: string,
    public code: string,
    public position?: { start: number; end: number }
  ) {
    super(message);
    this.name = 'EvaluationError';
  }
}

// Evaluation context
export interface EvaluationContext {
  variables: Map<string, number>;
  functions: Map<string, { params: string[]; body: ASTNodeType }>;
  angleMode: AngleMode;
  precision: number;
}

// Default context
export function createDefaultContext(): EvaluationContext {
  return {
    variables: new Map(),
    functions: new Map(),
    angleMode: 'radians',
    precision: 15
  };
}

// Convert degrees to radians
function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Convert radians to degrees
function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

// Built-in functions
const BUILTIN_FUNCTIONS: Record<string, (args: number[], ctx: EvaluationContext) => number> = {
  // Trigonometric functions
  sin: (args, ctx) => {
    const angle = ctx.angleMode === 'degrees' ? degreesToRadians(args[0] ?? 0) : (args[0] ?? 0);
    return Math.sin(angle);
  },
  cos: (args, ctx) => {
    const angle = ctx.angleMode === 'degrees' ? degreesToRadians(args[0] ?? 0) : (args[0] ?? 0);
    return Math.cos(angle);
  },
  tan: (args, ctx) => {
    const angle = ctx.angleMode === 'degrees' ? degreesToRadians(args[0] ?? 0) : (args[0] ?? 0);
    return Math.tan(angle);
  },
  asin: (args, ctx) => {
    const result = Math.asin(args[0] ?? 0);
    return ctx.angleMode === 'degrees' ? radiansToDegrees(result) : result;
  },
  acos: (args, ctx) => {
    const result = Math.acos(args[0] ?? 0);
    return ctx.angleMode === 'degrees' ? radiansToDegrees(result) : result;
  },
  atan: (args, ctx) => {
    const result = Math.atan(args[0] ?? 0);
    return ctx.angleMode === 'degrees' ? radiansToDegrees(result) : result;
  },
  
  // Hyperbolic functions
  sinh: (args) => Math.sinh(args[0] ?? 0),
  cosh: (args) => Math.cosh(args[0] ?? 0),
  tanh: (args) => Math.tanh(args[0] ?? 0),
  asinh: (args) => Math.asinh(args[0] ?? 0),
  acosh: (args) => Math.acosh(args[0] ?? 0),
  atanh: (args) => Math.atanh(args[0] ?? 0),
  
  // Exponential and logarithmic functions
  exp: (args) => Math.exp(args[0] ?? 0),
  ln: (args) => {
    const x = args[0] ?? 0;
    if (x <= 0) throw new EvaluationError('ln requires positive argument', 'CALC_DOMAIN');
    return Math.log(x);
  },
  log: (args) => {
    const x = args[0] ?? 0;
    if (x <= 0) throw new EvaluationError('log requires positive argument', 'CALC_DOMAIN');
    return Math.log10(x);
  },
  log10: (args) => {
    const x = args[0] ?? 0;
    if (x <= 0) throw new EvaluationError('log10 requires positive argument', 'CALC_DOMAIN');
    return Math.log10(x);
  },
  log2: (args) => {
    const x = args[0] ?? 0;
    if (x <= 0) throw new EvaluationError('log2 requires positive argument', 'CALC_DOMAIN');
    return Math.log2(x);
  },
  
  // Power and root functions
  sqrt: (args) => {
    const x = args[0] ?? 0;
    if (x < 0) throw new EvaluationError('sqrt requires non-negative argument', 'CALC_DOMAIN');
    return Math.sqrt(x);
  },
  cbrt: (args) => Math.cbrt(args[0] ?? 0),
  pow: (args) => Math.pow(args[0] ?? 0, args[1] ?? 1),
  root: (args) => {
    const x = args[0] ?? 0;
    const n = args[1] ?? 2;
    if (n === 0) throw new EvaluationError('Root index cannot be zero', 'CALC_DOMAIN');
    if (x < 0 && n % 2 === 0) throw new EvaluationError('Even root of negative number', 'CALC_DOMAIN');
    return x < 0 ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n);
  },
  
  // Other functions
  abs: (args) => Math.abs(args[0] ?? 0),
  floor: (args) => Math.floor(args[0] ?? 0),
  ceil: (args) => Math.ceil(args[0] ?? 0),
  round: (args) => Math.round(args[0] ?? 0),
  
  // Min/Max
  min: (args) => Math.min(...args),
  max: (args) => Math.max(...args),
  
  // Factorial (for non-negative integers)
  factorial: (args) => {
    const n = args[0] ?? 0;
    if (n < 0) throw new EvaluationError('Factorial requires non-negative integer', 'CALC_FACTORIAL_NEG');
    if (!Number.isInteger(n)) throw new EvaluationError('Factorial requires integer', 'CALC_DOMAIN');
    if (n > 170) throw new EvaluationError('Factorial overflow', 'CALC_OVERFLOW');
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  },
  
  // Gamma function (using Lanczos approximation)
  gamma: (args) => {
    const x = args[0] ?? 0;
    if (x <= 0 && Number.isInteger(x)) {
      throw new EvaluationError('Gamma undefined for non-positive integers', 'CALC_DOMAIN');
    }
    
    // Lanczos approximation coefficients
    const g = 7;
    const c = [
      0.99999999999980993,
      676.5203681218851,
      -1259.1392167224028,
      771.32342877765313,
      -176.61502916214059,
      12.507343278686905,
      -0.13857109526572012,
      9.9843695780195716e-6,
      1.5056327351493116e-7
    ];
    
    if (x < 0.5) {
      // Reflection formula
      return Math.PI / (Math.sin(Math.PI * x) * gammaLanczos(1 - x, g, c));
    }
    
    return gammaLanczos(x, g, c);
  }
};

function gammaLanczos(x: number, g: number, c: number[]): number {
  const z = x - 1;
  let sum = c[0] ?? 0;
  for (let i = 1; i < g + 2; i++) {
    sum += (c[i] ?? 0) / (z + i);
  }
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * sum;
}

/**
 * Evaluate an AST node to produce a numerical result
 */
export function evaluate(ast: ASTNodeType, context: EvaluationContext = createDefaultContext()): number {
  switch (ast.type) {
    case 'number':
      return ast.value;
    
    case 'constant': {
      const value = CONSTANTS[ast.name];
      if (value === undefined) {
        throw new EvaluationError(`Unknown constant: ${ast.name}`, 'EVAL_UNKNOWN_CONSTANT');
      }
      return value;
    }
    
    case 'variable': {
      const value = context.variables.get(ast.name);
      if (value === undefined) {
        throw new EvaluationError(`Undefined variable: ${ast.name}`, 'EVAL_UNDEFINED_VAR');
      }
      return value;
    }
    
    case 'unaryOp': {
      const operand = evaluate(ast.operand, context);
      switch (ast.operator) {
        case '+':
          return operand;
        case '-':
          return -operand;
        case '!': {
          // Factorial as postfix operator
          const factorialFn = BUILTIN_FUNCTIONS['factorial'];
          if (!factorialFn) throw new EvaluationError('Factorial function not found', 'EVAL_UNKNOWN_OP');
          return factorialFn([operand], context);
        }
        default:
          throw new EvaluationError(`Unknown unary operator: ${(ast as { operator: string }).operator}`, 'EVAL_UNKNOWN_OP');
      }
    }
    
    case 'binaryOp': {
      const left = evaluate(ast.left, context);
      const right = evaluate(ast.right, context);
      
      switch (ast.operator) {
        case '+':
          return left + right;
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/':
          if (right === 0) {
            throw new EvaluationError('Cannot divide by zero', 'CALC_DIV_ZERO');
          }
          return left / right;
        case '%':
          if (right === 0) {
            throw new EvaluationError('Cannot modulo by zero', 'CALC_DIV_ZERO');
          }
          return left % right;
        case '^':
          return Math.pow(left, right);
        default:
          throw new EvaluationError(`Unknown operator: ${(ast as { operator: string }).operator}`, 'EVAL_UNKNOWN_OP');
      }
    }
    
    case 'functionCall': {
      const args = ast.args.map(arg => evaluate(arg, context));
      
      // Check for built-in function
      const builtinFn = BUILTIN_FUNCTIONS[ast.name];
      if (builtinFn) {
        return builtinFn(args, context);
      }
      
      // Check for user-defined function
      const userFn = context.functions.get(ast.name);
      if (userFn) {
        // Create new context with function parameters
        const fnContext: EvaluationContext = {
          ...context,
          variables: new Map(context.variables)
        };
        
        userFn.params.forEach((param, i) => {
          fnContext.variables.set(param, args[i] ?? 0);
        });
        
        return evaluate(userFn.body, fnContext);
      }
      
      throw new EvaluationError(`Unknown function: ${ast.name}`, 'PARSE_UNKNOWN_FUNCTION');
    }
    
    case 'matrix':
    case 'complex':
      throw new EvaluationError('Matrix and complex evaluation not yet implemented', 'EVAL_NOT_IMPLEMENTED');
    
    default:
      throw new EvaluationError('Unknown AST node type', 'EVAL_UNKNOWN_NODE');
  }
}

/**
 * Evaluate an expression string and return a formatted result
 */
export function evaluateExpression(
  expression: string,
  context: EvaluationContext = createDefaultContext()
): CalculationResult {
  const ast = parse(expression);
  const value = evaluate(ast, context);
  
  // Format the result
  const formatted = formatNumber(value, context.precision);
  
  return {
    value,
    type: 'number',
    formatted,
    precision: context.precision
  };
}

/**
 * Format a number with the given precision
 */
export function formatNumber(value: number, precision: number = 15): string {
  if (!Number.isFinite(value)) {
    if (Number.isNaN(value)) return 'NaN';
    return value > 0 ? '∞' : '-∞';
  }
  
  // Use toPrecision for significant digits, then clean up
  const formatted = value.toPrecision(precision);
  
  // Remove trailing zeros after decimal point
  if (formatted.includes('.')) {
    return formatted.replace(/\.?0+$/, '').replace(/\.?0+e/, 'e');
  }
  
  return formatted;
}

/**
 * Set a variable in the context
 */
export function setVariable(context: EvaluationContext, name: string, value: number): void {
  context.variables.set(name, value);
}

/**
 * Define a custom function in the context
 */
export function defineFunction(
  context: EvaluationContext,
  name: string,
  params: string[],
  body: ASTNodeType
): void {
  context.functions.set(name, { params, body });
}
