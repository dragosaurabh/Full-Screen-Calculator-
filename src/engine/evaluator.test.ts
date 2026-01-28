/**
 * Unit tests for Expression Evaluator
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.1-2.8, 10.3
 */

import { describe, it, expect } from 'vitest';
import { evaluate, createDefaultContext, EvaluationError, formatNumber } from './evaluator';
import { parse } from './parser';
import type { EvaluationContext } from './evaluator';

// Helper to evaluate an expression string
function evalExpr(expr: string, context?: EvaluationContext): number {
  const ast = parse(expr);
  return evaluate(ast, context ?? createDefaultContext());
}

describe('Evaluator', () => {
  describe('basic arithmetic (Requirement 1.1)', () => {
    it('should evaluate addition', () => {
      expect(evalExpr('2 + 3')).toBe(5);
    });

    it('should evaluate subtraction', () => {
      expect(evalExpr('5 - 3')).toBe(2);
    });

    it('should evaluate multiplication', () => {
      expect(evalExpr('4 * 3')).toBe(12);
    });

    it('should evaluate division', () => {
      expect(evalExpr('10 / 2')).toBe(5);
    });

    it('should evaluate modulo', () => {
      expect(evalExpr('7 % 3')).toBe(1);
    });

    it('should evaluate exponentiation', () => {
      expect(evalExpr('2 ^ 3')).toBe(8);
    });
  });

  describe('operator precedence (Requirement 1.2)', () => {
    it('should respect PEMDAS: multiplication before addition', () => {
      expect(evalExpr('2 + 3 * 4')).toBe(14);
    });

    it('should respect PEMDAS: division before subtraction', () => {
      expect(evalExpr('10 - 6 / 2')).toBe(7);
    });

    it('should respect PEMDAS: exponentiation before multiplication', () => {
      expect(evalExpr('2 * 3 ^ 2')).toBe(18);
    });

    it('should handle parentheses correctly', () => {
      expect(evalExpr('(2 + 3) * 4')).toBe(20);
    });

    it('should handle nested parentheses', () => {
      expect(evalExpr('((2 + 3) * 4) - 5')).toBe(15);
    });
  });

  describe('percent operator (Requirement 1.3)', () => {
    it('should evaluate percent as modulo', () => {
      expect(evalExpr('10 % 3')).toBe(1);
    });
  });

  describe('division by zero (Requirement 1.4)', () => {
    it('should throw error for division by zero', () => {
      expect(() => evalExpr('5 / 0')).toThrow(EvaluationError);
      expect(() => evalExpr('5 / 0')).toThrow('Cannot divide by zero');
    });

    it('should throw error for modulo by zero', () => {
      expect(() => evalExpr('5 % 0')).toThrow(EvaluationError);
    });
  });

  describe('unary operators', () => {
    it('should evaluate negative numbers', () => {
      expect(evalExpr('-5')).toBe(-5);
    });

    it('should evaluate positive sign', () => {
      expect(evalExpr('+5')).toBe(5);
    });

    it('should handle double negation', () => {
      expect(evalExpr('--5')).toBe(5);
    });
  });

  describe('mathematical constants (Requirement 10.3)', () => {
    it('should evaluate pi with 15+ digit accuracy', () => {
      const result = evalExpr('pi');
      expect(result).toBeCloseTo(Math.PI, 14);
      expect(Math.abs(result - 3.141592653589793)).toBeLessThan(1e-15);
    });

    it('should evaluate e with 15+ digit accuracy', () => {
      const result = evalExpr('e');
      expect(result).toBeCloseTo(Math.E, 14);
      expect(Math.abs(result - 2.718281828459045)).toBeLessThan(1e-15);
    });

    it('should evaluate phi (golden ratio)', () => {
      const result = evalExpr('phi');
      expect(result).toBeCloseTo((1 + Math.sqrt(5)) / 2, 14);
    });

    it('should evaluate tau', () => {
      const result = evalExpr('tau');
      expect(result).toBeCloseTo(2 * Math.PI, 14);
    });
  });

  describe('trigonometric functions (Requirement 2.1)', () => {
    it('should evaluate sin', () => {
      expect(evalExpr('sin(0)')).toBeCloseTo(0, 10);
      expect(evalExpr('sin(pi / 2)')).toBeCloseTo(1, 10);
    });

    it('should evaluate cos', () => {
      expect(evalExpr('cos(0)')).toBeCloseTo(1, 10);
      expect(evalExpr('cos(pi)')).toBeCloseTo(-1, 10);
    });

    it('should evaluate tan', () => {
      expect(evalExpr('tan(0)')).toBeCloseTo(0, 10);
      expect(evalExpr('tan(pi / 4)')).toBeCloseTo(1, 10);
    });

    it('should evaluate inverse trig functions', () => {
      expect(evalExpr('asin(0)')).toBeCloseTo(0, 10);
      expect(evalExpr('acos(1)')).toBeCloseTo(0, 10);
      expect(evalExpr('atan(0)')).toBeCloseTo(0, 10);
    });
  });

  describe('angle mode (Requirements 2.7, 2.8)', () => {
    it('should use radians by default', () => {
      const ctx = createDefaultContext();
      ctx.angleMode = 'radians';
      expect(evalExpr('sin(pi / 2)', ctx)).toBeCloseTo(1, 10);
    });

    it('should convert degrees to radians when in degree mode', () => {
      const ctx = createDefaultContext();
      ctx.angleMode = 'degrees';
      expect(evalExpr('sin(90)', ctx)).toBeCloseTo(1, 10);
      expect(evalExpr('cos(180)', ctx)).toBeCloseTo(-1, 10);
    });

    it('should return degrees for inverse trig in degree mode', () => {
      const ctx = createDefaultContext();
      ctx.angleMode = 'degrees';
      expect(evalExpr('asin(1)', ctx)).toBeCloseTo(90, 10);
    });
  });

  describe('hyperbolic functions (Requirement 2.2)', () => {
    it('should evaluate sinh', () => {
      expect(evalExpr('sinh(0)')).toBeCloseTo(0, 10);
    });

    it('should evaluate cosh', () => {
      expect(evalExpr('cosh(0)')).toBeCloseTo(1, 10);
    });

    it('should evaluate tanh', () => {
      expect(evalExpr('tanh(0)')).toBeCloseTo(0, 10);
    });
  });

  describe('exponential and logarithmic functions (Requirement 2.3)', () => {
    it('should evaluate exp', () => {
      expect(evalExpr('exp(0)')).toBeCloseTo(1, 10);
      expect(evalExpr('exp(1)')).toBeCloseTo(Math.E, 10);
    });

    it('should evaluate ln', () => {
      expect(evalExpr('ln(1)')).toBeCloseTo(0, 10);
      expect(evalExpr('ln(e)')).toBeCloseTo(1, 10);
    });

    it('should evaluate log10', () => {
      expect(evalExpr('log10(10)')).toBeCloseTo(1, 10);
      expect(evalExpr('log10(100)')).toBeCloseTo(2, 10);
    });

    it('should evaluate log2', () => {
      expect(evalExpr('log2(2)')).toBeCloseTo(1, 10);
      expect(evalExpr('log2(8)')).toBeCloseTo(3, 10);
    });

    it('should throw for log of non-positive', () => {
      expect(() => evalExpr('ln(0)')).toThrow(EvaluationError);
      expect(() => evalExpr('ln(-1)')).toThrow(EvaluationError);
    });
  });

  describe('factorial (Requirement 2.4)', () => {
    it('should evaluate factorial of 0', () => {
      expect(evalExpr('factorial(0)')).toBe(1);
    });

    it('should evaluate factorial of positive integers', () => {
      expect(evalExpr('factorial(5)')).toBe(120);
      expect(evalExpr('factorial(10)')).toBe(3628800);
    });

    it('should throw for negative factorial', () => {
      expect(() => evalExpr('factorial(-1)')).toThrow(EvaluationError);
    });

    it('should throw for non-integer factorial', () => {
      expect(() => evalExpr('factorial(2.5)')).toThrow(EvaluationError);
    });
  });

  describe('power and root functions (Requirement 2.5)', () => {
    it('should evaluate sqrt', () => {
      expect(evalExpr('sqrt(4)')).toBe(2);
      expect(evalExpr('sqrt(2)')).toBeCloseTo(Math.SQRT2, 10);
    });

    it('should evaluate cbrt', () => {
      expect(evalExpr('cbrt(8)')).toBe(2);
      expect(evalExpr('cbrt(-8)')).toBe(-2);
    });

    it('should evaluate pow', () => {
      expect(evalExpr('pow(2, 3)')).toBe(8);
    });

    it('should evaluate root', () => {
      expect(evalExpr('root(8, 3)')).toBeCloseTo(2, 10);
    });

    it('should throw for sqrt of negative', () => {
      expect(() => evalExpr('sqrt(-1)')).toThrow(EvaluationError);
    });
  });

  describe('gamma function (Requirement 2.6)', () => {
    it('should evaluate gamma for positive integers (n-1)!', () => {
      expect(evalExpr('gamma(5)')).toBeCloseTo(24, 5); // (5-1)! = 24
      expect(evalExpr('gamma(6)')).toBeCloseTo(120, 5); // (6-1)! = 120
    });

    it('should evaluate gamma(0.5) = sqrt(pi)', () => {
      expect(evalExpr('gamma(0.5)')).toBeCloseTo(Math.sqrt(Math.PI), 5);
    });
  });

  describe('other functions', () => {
    it('should evaluate abs', () => {
      expect(evalExpr('abs(-5)')).toBe(5);
      expect(evalExpr('abs(5)')).toBe(5);
    });

    it('should evaluate floor', () => {
      expect(evalExpr('floor(3.7)')).toBe(3);
      expect(evalExpr('floor(-3.7)')).toBe(-4);
    });

    it('should evaluate ceil', () => {
      expect(evalExpr('ceil(3.2)')).toBe(4);
      expect(evalExpr('ceil(-3.2)')).toBe(-3);
    });

    it('should evaluate round', () => {
      expect(evalExpr('round(3.5)')).toBe(4);
      expect(evalExpr('round(3.4)')).toBe(3);
    });

    it('should evaluate min', () => {
      expect(evalExpr('min(1, 2, 3)')).toBe(1);
    });

    it('should evaluate max', () => {
      expect(evalExpr('max(1, 2, 3)')).toBe(3);
    });
  });

  describe('variables', () => {
    it('should evaluate variables from context', () => {
      const ctx = createDefaultContext();
      ctx.variables.set('x', 5);
      expect(evalExpr('x + 3', ctx)).toBe(8);
    });

    it('should throw for undefined variables', () => {
      expect(() => evalExpr('x')).toThrow(EvaluationError);
    });
  });

  describe('complex expressions', () => {
    it('should evaluate complex nested expressions', () => {
      expect(evalExpr('2 * sin(pi / 2) + 3')).toBeCloseTo(5, 10);
    });

    it('should evaluate expressions with multiple functions', () => {
      expect(evalExpr('sqrt(4) + pow(2, 3)')).toBe(10);
    });

    it('should handle implicit multiplication', () => {
      const ctx = createDefaultContext();
      ctx.variables.set('x', 3);
      expect(evalExpr('2x + 1', ctx)).toBe(7);
    });
  });
});

describe('formatNumber', () => {
  it('should format integers', () => {
    expect(formatNumber(42)).toBe('42');
  });

  it('should format decimals', () => {
    expect(formatNumber(3.14159, 5)).toBe('3.1416');
  });

  it('should handle infinity', () => {
    expect(formatNumber(Infinity)).toBe('∞');
    expect(formatNumber(-Infinity)).toBe('-∞');
  });

  it('should handle NaN', () => {
    expect(formatNumber(NaN)).toBe('NaN');
  });
});
