/**
 * Arbitrary Precision Arithmetic Module
 * 
 * Provides high-precision calculations using decimal.js.
 * Validates: Requirements 11.1, 11.2, 11.3
 */

import Decimal from 'decimal.js';
import type { ASTNodeType, AngleMode } from '../types';
import { CONSTANTS, parse } from './parser';

// Configure decimal.js defaults
Decimal.set({
  precision: 50,  // Default precision (can be overridden)
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -9,
  toExpPos: 21
});

/**
 * Precision configuration
 */
export interface PrecisionConfig {
  precision: number;
  angleMode: AngleMode;
}

/**
 * Create a precision configuration with defaults
 */
export function createPrecisionConfig(precision: number = 50): PrecisionConfig {
  return {
    precision,
    angleMode: 'radians'
  };
}

/**
 * Set the global precision for decimal.js
 */
export function setPrecision(precision: number): void {
  if (precision >= 1 && precision <= 100) {
    Decimal.set({ precision });
  }
}

/**
 * Get the current precision setting
 */
export function getPrecision(): number {
  return Decimal.precision;
}


// High-precision mathematical constants
export const PRECISION_CONSTANTS: Record<string, () => Decimal> = {
  pi: () => Decimal.acos(-1),
  e: () => new Decimal(1).exp(),
  phi: () => new Decimal(1).plus(new Decimal(5).sqrt()).div(2),
  tau: () => Decimal.acos(-1).times(2)
};

/**
 * Precision arithmetic operations
 */
export const PrecisionOps = {
  // Basic arithmetic
  add: (a: Decimal, b: Decimal): Decimal => a.plus(b),
  subtract: (a: Decimal, b: Decimal): Decimal => a.minus(b),
  multiply: (a: Decimal, b: Decimal): Decimal => a.times(b),
  divide: (a: Decimal, b: Decimal): Decimal => {
    if (b.isZero()) {
      throw new Error('Cannot divide by zero');
    }
    return a.div(b);
  },
  modulo: (a: Decimal, b: Decimal): Decimal => {
    if (b.isZero()) {
      throw new Error('Cannot modulo by zero');
    }
    return a.mod(b);
  },
  power: (a: Decimal, b: Decimal): Decimal => a.pow(b),
  negate: (a: Decimal): Decimal => a.neg(),

  // Trigonometric functions
  sin: (x: Decimal): Decimal => Decimal.sin(x),
  cos: (x: Decimal): Decimal => Decimal.cos(x),
  tan: (x: Decimal): Decimal => Decimal.tan(x),
  asin: (x: Decimal): Decimal => Decimal.asin(x),
  acos: (x: Decimal): Decimal => Decimal.acos(x),
  atan: (x: Decimal): Decimal => Decimal.atan(x),

  // Hyperbolic functions
  sinh: (x: Decimal): Decimal => Decimal.sinh(x),
  cosh: (x: Decimal): Decimal => Decimal.cosh(x),
  tanh: (x: Decimal): Decimal => Decimal.tanh(x),

  // Exponential and logarithmic functions
  exp: (x: Decimal): Decimal => x.exp(),
  ln: (x: Decimal): Decimal => {
    if (x.lte(0)) {
      throw new Error('ln requires positive argument');
    }
    return Decimal.ln(x);
  },
  log10: (x: Decimal): Decimal => {
    if (x.lte(0)) {
      throw new Error('log10 requires positive argument');
    }
    return Decimal.log10(x);
  },
  log2: (x: Decimal): Decimal => {
    if (x.lte(0)) {
      throw new Error('log2 requires positive argument');
    }
    return Decimal.log2(x);
  },

  // Power and root functions
  sqrt: (x: Decimal): Decimal => {
    if (x.lt(0)) {
      throw new Error('sqrt requires non-negative argument');
    }
    return x.sqrt();
  },
  cbrt: (x: Decimal): Decimal => x.cbrt(),
  abs: (x: Decimal): Decimal => x.abs(),
  floor: (x: Decimal): Decimal => x.floor(),
  ceil: (x: Decimal): Decimal => x.ceil(),
  round: (x: Decimal): Decimal => x.round(),
};

/**
 * Get pi constant with high precision
 */
function getPi(): Decimal {
  const piFn = PRECISION_CONSTANTS['pi'];
  if (!piFn) throw new Error('Pi constant not found');
  return piFn();
}

/**
 * Convert degrees to radians using high precision
 */
export function degreesToRadiansPrecise(degrees: Decimal): Decimal {
  const pi = getPi();
  return degrees.times(pi).div(180);
}

/**
 * Convert radians to degrees using high precision
 */
export function radiansToDegreesPrecise(radians: Decimal): Decimal {
  const pi = getPi();
  return radians.times(180).div(pi);
}


/**
 * Precision evaluation context
 */
export interface PrecisionEvaluationContext {
  variables: Map<string, Decimal>;
  functions: Map<string, { params: string[]; body: ASTNodeType }>;
  angleMode: AngleMode;
  precision: number;
}

/**
 * Create a default precision evaluation context
 */
export function createPrecisionContext(precision: number = 50): PrecisionEvaluationContext {
  return {
    variables: new Map(),
    functions: new Map(),
    angleMode: 'radians',
    precision
  };
}

/**
 * Precision-aware built-in functions
 */
const PRECISION_BUILTIN_FUNCTIONS: Record<string, (args: Decimal[], ctx: PrecisionEvaluationContext) => Decimal> = {
  // Trigonometric functions with angle mode support
  sin: (args, ctx) => {
    const angle = ctx.angleMode === 'degrees' 
      ? degreesToRadiansPrecise(args[0] ?? new Decimal(0)) 
      : (args[0] ?? new Decimal(0));
    return PrecisionOps.sin(angle);
  },
  cos: (args, ctx) => {
    const angle = ctx.angleMode === 'degrees' 
      ? degreesToRadiansPrecise(args[0] ?? new Decimal(0)) 
      : (args[0] ?? new Decimal(0));
    return PrecisionOps.cos(angle);
  },
  tan: (args, ctx) => {
    const angle = ctx.angleMode === 'degrees' 
      ? degreesToRadiansPrecise(args[0] ?? new Decimal(0)) 
      : (args[0] ?? new Decimal(0));
    return PrecisionOps.tan(angle);
  },
  asin: (args, ctx) => {
    const result = PrecisionOps.asin(args[0] ?? new Decimal(0));
    return ctx.angleMode === 'degrees' ? radiansToDegreesPrecise(result) : result;
  },
  acos: (args, ctx) => {
    const result = PrecisionOps.acos(args[0] ?? new Decimal(0));
    return ctx.angleMode === 'degrees' ? radiansToDegreesPrecise(result) : result;
  },
  atan: (args, ctx) => {
    const result = PrecisionOps.atan(args[0] ?? new Decimal(0));
    return ctx.angleMode === 'degrees' ? radiansToDegreesPrecise(result) : result;
  },

  // Hyperbolic functions
  sinh: (args) => PrecisionOps.sinh(args[0] ?? new Decimal(0)),
  cosh: (args) => PrecisionOps.cosh(args[0] ?? new Decimal(0)),
  tanh: (args) => PrecisionOps.tanh(args[0] ?? new Decimal(0)),

  // Exponential and logarithmic functions
  exp: (args) => PrecisionOps.exp(args[0] ?? new Decimal(0)),
  ln: (args) => PrecisionOps.ln(args[0] ?? new Decimal(0)),
  log: (args) => PrecisionOps.log10(args[0] ?? new Decimal(0)),
  log10: (args) => PrecisionOps.log10(args[0] ?? new Decimal(0)),
  log2: (args) => PrecisionOps.log2(args[0] ?? new Decimal(0)),

  // Power and root functions
  sqrt: (args) => PrecisionOps.sqrt(args[0] ?? new Decimal(0)),
  cbrt: (args) => PrecisionOps.cbrt(args[0] ?? new Decimal(0)),
  pow: (args) => PrecisionOps.power(args[0] ?? new Decimal(0), args[1] ?? new Decimal(1)),
  root: (args) => {
    const x = args[0] ?? new Decimal(0);
    const n = args[1] ?? new Decimal(2);
    if (n.isZero()) {
      throw new Error('Root index cannot be zero');
    }
    if (x.lt(0) && n.mod(2).eq(0)) {
      throw new Error('Even root of negative number');
    }
    return x.lt(0) ? x.neg().pow(new Decimal(1).div(n)).neg() : x.pow(new Decimal(1).div(n));
  },

  // Other functions
  abs: (args) => PrecisionOps.abs(args[0] ?? new Decimal(0)),
  floor: (args) => PrecisionOps.floor(args[0] ?? new Decimal(0)),
  ceil: (args) => PrecisionOps.ceil(args[0] ?? new Decimal(0)),
  round: (args) => PrecisionOps.round(args[0] ?? new Decimal(0)),

  // Min/Max
  min: (args) => Decimal.min(...args),
  max: (args) => Decimal.max(...args),

  // Factorial (for non-negative integers)
  factorial: (args) => {
    const n = args[0] ?? new Decimal(0);
    if (n.lt(0)) {
      throw new Error('Factorial requires non-negative integer');
    }
    if (!n.isInteger()) {
      throw new Error('Factorial requires integer');
    }
    if (n.gt(170)) {
      throw new Error('Factorial overflow');
    }
    
    let result = new Decimal(1);
    for (let i = 2; i <= n.toNumber(); i++) {
      result = result.times(i);
    }
    return result;
  },

  // Gamma function (using Lanczos approximation)
  gamma: (args) => {
    const x = args[0] ?? new Decimal(0);
    if (x.lte(0) && x.isInteger()) {
      throw new Error('Gamma undefined for non-positive integers');
    }
    
    // For high precision, use the reflection formula and Lanczos approximation
    // This is a simplified version - for production, consider a more accurate implementation
    return new Decimal(gammaApprox(x.toNumber()));
  }
};

// Lanczos approximation for gamma function
function gammaApprox(x: number): number {
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
    return Math.PI / (Math.sin(Math.PI * x) * gammaApprox(1 - x));
  }
  
  const z = x - 1;
  let sum = c[0] ?? 0;
  for (let i = 1; i < g + 2; i++) {
    sum += (c[i] ?? 0) / (z + i);
  }
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * sum;
}


/**
 * Evaluate an AST node using arbitrary precision arithmetic
 */
export function evaluatePrecision(
  ast: ASTNodeType, 
  context: PrecisionEvaluationContext = createPrecisionContext()
): Decimal {
  // Set precision for this evaluation
  Decimal.set({ precision: context.precision });
  
  switch (ast.type) {
    case 'number':
      return new Decimal(ast.value);
    
    case 'constant': {
      const constantFn = PRECISION_CONSTANTS[ast.name];
      if (!constantFn) {
        // Fall back to standard constants
        const value = CONSTANTS[ast.name];
        if (value === undefined) {
          throw new Error(`Unknown constant: ${ast.name}`);
        }
        return new Decimal(value);
      }
      return constantFn();
    }
    
    case 'variable': {
      const value = context.variables.get(ast.name);
      if (value === undefined) {
        throw new Error(`Undefined variable: ${ast.name}`);
      }
      return value;
    }
    
    case 'unaryOp': {
      const operand = evaluatePrecision(ast.operand, context);
      switch (ast.operator) {
        case '+':
          return operand;
        case '-':
          return PrecisionOps.negate(operand);
        case '!': {
          const factorialFn = PRECISION_BUILTIN_FUNCTIONS['factorial'];
          if (!factorialFn) throw new Error('Factorial function not found');
          return factorialFn([operand], context);
        }
        default:
          throw new Error(`Unknown unary operator: ${(ast as { operator: string }).operator}`);
      }
    }

    case 'binaryOp': {
      const left = evaluatePrecision(ast.left, context);
      const right = evaluatePrecision(ast.right, context);
      
      switch (ast.operator) {
        case '+':
          return PrecisionOps.add(left, right);
        case '-':
          return PrecisionOps.subtract(left, right);
        case '*':
          return PrecisionOps.multiply(left, right);
        case '/':
          return PrecisionOps.divide(left, right);
        case '%':
          return PrecisionOps.modulo(left, right);
        case '^':
          return PrecisionOps.power(left, right);
        default:
          throw new Error(`Unknown operator: ${(ast as { operator: string }).operator}`);
      }
    }
    
    case 'functionCall': {
      const args = ast.args.map(arg => evaluatePrecision(arg, context));
      
      // Check for built-in function
      const builtinFn = PRECISION_BUILTIN_FUNCTIONS[ast.name];
      if (builtinFn) {
        return builtinFn(args, context);
      }
      
      // Check for user-defined function
      const userFn = context.functions.get(ast.name);
      if (userFn) {
        const fnContext: PrecisionEvaluationContext = {
          ...context,
          variables: new Map(context.variables)
        };
        
        userFn.params.forEach((param, i) => {
          fnContext.variables.set(param, args[i] ?? new Decimal(0));
        });
        
        return evaluatePrecision(userFn.body, fnContext);
      }
      
      throw new Error(`Unknown function: ${ast.name}`);
    }
    
    case 'matrix':
    case 'complex':
      throw new Error('Matrix and complex precision evaluation not yet implemented');
    
    default:
      throw new Error('Unknown AST node type');
  }
}


/**
 * Evaluate an expression string using arbitrary precision
 */
export function evaluateExpressionPrecision(
  expression: string,
  precision: number = 50,
  angleMode: AngleMode = 'radians'
): { value: Decimal; formatted: string } {
  const ast = parse(expression);
  const context = createPrecisionContext(precision);
  context.angleMode = angleMode;
  
  const value = evaluatePrecision(ast, context);
  const formatted = formatPrecisionResult(value, precision);
  
  return { value, formatted };
}

/**
 * Format a Decimal result to the specified number of significant digits
 */
export function formatPrecisionResult(value: Decimal, significantDigits: number): string {
  if (!value.isFinite()) {
    if (value.isNaN()) return 'NaN';
    return value.isPositive() ? '∞' : '-∞';
  }
  
  // Use toSignificantDigits for proper formatting
  return value.toSignificantDigits(significantDigits).toString();
}

/**
 * Check if arbitrary precision mode should be used
 * Returns true if precision > 15 (beyond standard JS number precision)
 */
export function shouldUsePrecisionMode(precision: number): boolean {
  return precision > 15;
}

// Re-export Decimal for external use
export { Decimal };
