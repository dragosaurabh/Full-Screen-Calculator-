/**
 * Property-based tests for Expression Evaluator
 * 
 * **Property 2: Basic Arithmetic Evaluation**
 * **Validates: Requirements 1.1, 1.2, 1.3**
 * 
 * **Property 25: Mathematical Constants Accuracy**
 * **Validates: Requirements 10.3**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { evaluate, createDefaultContext } from './evaluator';
import { parse } from './parser';

// Helper to evaluate an expression string
function evalExpr(expr: string): number {
  const ast = parse(expr);
  return evaluate(ast, createDefaultContext());
}

describe('Evaluator - Property Tests', () => {
  describe('Property 2: Basic Arithmetic Evaluation', () => {
    describe('addition properties', () => {
      it('should be commutative: a + b = b + a', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: -1000, max: 1000 }),
            fc.integer({ min: -1000, max: 1000 }),
            (a, b) => {
              expect(evalExpr(`${a} + ${b}`)).toBe(evalExpr(`${b} + ${a}`));
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should be associative: (a + b) + c = a + (b + c)', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: -100, max: 100 }),
            fc.integer({ min: -100, max: 100 }),
            fc.integer({ min: -100, max: 100 }),
            (a, b, c) => {
              const left = evalExpr(`(${a} + ${b}) + ${c}`);
              const right = evalExpr(`${a} + (${b} + ${c})`);
              expect(left).toBeCloseTo(right, 10);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should have identity element 0: a + 0 = a', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: -1000, max: 1000 }),
            (a) => {
              expect(evalExpr(`${a} + 0`)).toBe(a);
            }
          ),
          { numRuns: 100 }
        );
      });
    });

    describe('subtraction properties', () => {
      it('should satisfy: a - b + b = a', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: -1000, max: 1000 }),
            fc.integer({ min: -1000, max: 1000 }),
            (a, b) => {
              expect(evalExpr(`(${a} - ${b}) + ${b}`)).toBe(a);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should satisfy: a - a = 0', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: -1000, max: 1000 }),
            (a) => {
              expect(evalExpr(`${a} - ${a}`)).toBe(0);
            }
          ),
          { numRuns: 100 }
        );
      });
    });

    describe('multiplication properties', () => {
      it('should be commutative: a * b = b * a', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: -100, max: 100 }),
            fc.integer({ min: -100, max: 100 }),
            (a, b) => {
              expect(evalExpr(`${a} * ${b}`)).toBe(evalExpr(`${b} * ${a}`));
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should have identity element 1: a * 1 = a', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: -1000, max: 1000 }),
            (a) => {
              expect(evalExpr(`${a} * 1`)).toBe(a);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should have zero property: a * 0 = 0', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: -1000, max: 1000 }),
            (a) => {
              const result = evalExpr(`${a} * 0`);
              // Handle -0 case
              expect(result === 0 || Object.is(result, -0)).toBe(true);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should distribute over addition: a * (b + c) = a * b + a * c', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: -10, max: 10 }),
            fc.integer({ min: -10, max: 10 }),
            fc.integer({ min: -10, max: 10 }),
            (a, b, c) => {
              const left = evalExpr(`${a} * (${b} + ${c})`);
              const right = evalExpr(`${a} * ${b} + ${a} * ${c}`);
              expect(left).toBeCloseTo(right, 10);
            }
          ),
          { numRuns: 100 }
        );
      });
    });

    describe('division properties', () => {
      it('should satisfy: (a * b) / b = a for non-zero b', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: -100, max: 100 }),
            fc.integer({ min: 1, max: 100 }),
            (a, b) => {
              const result = evalExpr(`(${a} * ${b}) / ${b}`);
              expect(result).toBeCloseTo(a, 10);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should satisfy: a / 1 = a', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: -1000, max: 1000 }),
            (a) => {
              expect(evalExpr(`${a} / 1`)).toBe(a);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should satisfy: a / a = 1 for non-zero a', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 1, max: 1000 }),
            (a) => {
              expect(evalExpr(`${a} / ${a}`)).toBe(1);
            }
          ),
          { numRuns: 100 }
        );
      });
    });

    describe('operator precedence (PEMDAS)', () => {
      it('should evaluate multiplication before addition', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 1, max: 10 }),
            fc.integer({ min: 1, max: 10 }),
            fc.integer({ min: 1, max: 10 }),
            (a, b, c) => {
              const result = evalExpr(`${a} + ${b} * ${c}`);
              const expected = a + b * c;
              expect(result).toBe(expected);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should evaluate exponentiation before multiplication', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 1, max: 5 }),
            fc.integer({ min: 1, max: 3 }),
            fc.integer({ min: 1, max: 3 }),
            (a, b, c) => {
              const result = evalExpr(`${a} * ${b} ^ ${c}`);
              const expected = a * Math.pow(b, c);
              expect(result).toBeCloseTo(expected, 10);
            }
          ),
          { numRuns: 50 }
        );
      });

      it('should respect parentheses over precedence', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 1, max: 10 }),
            fc.integer({ min: 1, max: 10 }),
            fc.integer({ min: 1, max: 10 }),
            (a, b, c) => {
              const result = evalExpr(`(${a} + ${b}) * ${c}`);
              const expected = (a + b) * c;
              expect(result).toBe(expected);
            }
          ),
          { numRuns: 100 }
        );
      });
    });

    describe('exponentiation properties', () => {
      it('should satisfy: a^1 = a', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: -10, max: 10 }),
            (a) => {
              expect(evalExpr(`${a} ^ 1`)).toBe(a);
            }
          ),
          { numRuns: 50 }
        );
      });

      it('should satisfy: a^0 = 1 for non-zero a', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 1, max: 100 }),
            (a) => {
              expect(evalExpr(`${a} ^ 0`)).toBe(1);
            }
          ),
          { numRuns: 50 }
        );
      });

      it('should satisfy: a^m * a^n = a^(m+n)', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 2, max: 5 }),
            fc.integer({ min: 1, max: 3 }),
            fc.integer({ min: 1, max: 3 }),
            (a, m, n) => {
              const left = evalExpr(`${a} ^ ${m} * ${a} ^ ${n}`);
              const right = evalExpr(`${a} ^ (${m} + ${n})`);
              expect(left).toBeCloseTo(right, 10);
            }
          ),
          { numRuns: 50 }
        );
      });
    });
  });

  /**
   * **Property 4: Angle Mode Consistency**
   * **Validates: Requirements 2.7, 2.8**
   * 
   * For any trigonometric function call, WHEN angle mode is set to degrees,
   * the result SHALL equal the result of the same function called with the
   * input converted to radians.
   */
  describe('Property 4: Angle Mode Consistency', () => {
    // Helper to evaluate with specific angle mode
    function evalWithAngleMode(expr: string, angleMode: 'degrees' | 'radians'): number {
      const ast = parse(expr);
      const ctx = createDefaultContext();
      ctx.angleMode = angleMode;
      return evaluate(ast, ctx);
    }

    it('sin in degrees should equal sin in radians with converted input', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -360, max: 360, noNaN: true }),
          (degrees) => {
            const resultDegrees = evalWithAngleMode(`sin(${degrees})`, 'degrees');
            const radians = degrees * Math.PI / 180;
            const resultRadians = evalWithAngleMode(`sin(${radians})`, 'radians');
            expect(resultDegrees).toBeCloseTo(resultRadians, 10);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('cos in degrees should equal cos in radians with converted input', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -360, max: 360, noNaN: true }),
          (degrees) => {
            const resultDegrees = evalWithAngleMode(`cos(${degrees})`, 'degrees');
            const radians = degrees * Math.PI / 180;
            const resultRadians = evalWithAngleMode(`cos(${radians})`, 'radians');
            expect(resultDegrees).toBeCloseTo(resultRadians, 10);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('tan in degrees should equal tan in radians with converted input', () => {
      fc.assert(
        fc.property(
          // Avoid values near 90, 270 degrees where tan is undefined
          fc.float({ min: -80, max: 80, noNaN: true }),
          (degrees) => {
            const resultDegrees = evalWithAngleMode(`tan(${degrees})`, 'degrees');
            const radians = degrees * Math.PI / 180;
            const resultRadians = evalWithAngleMode(`tan(${radians})`, 'radians');
            expect(resultDegrees).toBeCloseTo(resultRadians, 10);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('asin output in degrees should be 180/pi times output in radians', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(-0.99), max: Math.fround(0.99), noNaN: true }),
          (x) => {
            const resultDegrees = evalWithAngleMode(`asin(${x})`, 'degrees');
            const resultRadians = evalWithAngleMode(`asin(${x})`, 'radians');
            expect(resultDegrees).toBeCloseTo(resultRadians * 180 / Math.PI, 10);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('acos output in degrees should be 180/pi times output in radians', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(-0.99), max: Math.fround(0.99), noNaN: true }),
          (x) => {
            const resultDegrees = evalWithAngleMode(`acos(${x})`, 'degrees');
            const resultRadians = evalWithAngleMode(`acos(${x})`, 'radians');
            expect(resultDegrees).toBeCloseTo(resultRadians * 180 / Math.PI, 10);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('atan output in degrees should be 180/pi times output in radians', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -100, max: 100, noNaN: true }),
          (x) => {
            const resultDegrees = evalWithAngleMode(`atan(${x})`, 'degrees');
            const resultRadians = evalWithAngleMode(`atan(${x})`, 'radians');
            expect(resultDegrees).toBeCloseTo(resultRadians * 180 / Math.PI, 10);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('sin(90 degrees) should equal sin(pi/2 radians) = 1', () => {
      const resultDegrees = evalWithAngleMode('sin(90)', 'degrees');
      const resultRadians = evalWithAngleMode(`sin(${Math.PI / 2})`, 'radians');
      expect(resultDegrees).toBeCloseTo(1, 10);
      expect(resultRadians).toBeCloseTo(1, 10);
    });

    it('cos(180 degrees) should equal cos(pi radians) = -1', () => {
      const resultDegrees = evalWithAngleMode('cos(180)', 'degrees');
      const resultRadians = evalWithAngleMode(`cos(${Math.PI})`, 'radians');
      expect(resultDegrees).toBeCloseTo(-1, 10);
      expect(resultRadians).toBeCloseTo(-1, 10);
    });
  });

  /**
   * **Property 3: Scientific Function Accuracy**
   * **Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6**
   * 
   * For any valid input to scientific functions, the Calculator_Engine SHALL
   * compute results that match the mathematical definition within the configured
   * precision tolerance.
   */
  describe('Property 3: Scientific Function Accuracy', () => {
    describe('hyperbolic functions', () => {
      it('sinh should satisfy sinh(x) = (e^x - e^(-x)) / 2', () => {
        fc.assert(
          fc.property(
            fc.float({ min: -10, max: 10, noNaN: true }),
            (x) => {
              const result = evalExpr(`sinh(${x})`);
              const expected = (Math.exp(x) - Math.exp(-x)) / 2;
              expect(result).toBeCloseTo(expected, 10);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('cosh should satisfy cosh(x) = (e^x + e^(-x)) / 2', () => {
        fc.assert(
          fc.property(
            fc.float({ min: -10, max: 10, noNaN: true }),
            (x) => {
              const result = evalExpr(`cosh(${x})`);
              const expected = (Math.exp(x) + Math.exp(-x)) / 2;
              expect(result).toBeCloseTo(expected, 10);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('tanh should satisfy tanh(x) = sinh(x) / cosh(x)', () => {
        fc.assert(
          fc.property(
            fc.float({ min: -10, max: 10, noNaN: true }),
            (x) => {
              const result = evalExpr(`tanh(${x})`);
              const expected = evalExpr(`sinh(${x})`) / evalExpr(`cosh(${x})`);
              expect(result).toBeCloseTo(expected, 10);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('cosh^2(x) - sinh^2(x) should equal 1 (hyperbolic identity)', () => {
        fc.assert(
          fc.property(
            fc.float({ min: -5, max: 5, noNaN: true }),
            (x) => {
              const coshX = evalExpr(`cosh(${x})`);
              const sinhX = evalExpr(`sinh(${x})`);
              expect(coshX * coshX - sinhX * sinhX).toBeCloseTo(1, 10);
            }
          ),
          { numRuns: 100 }
        );
      });
    });

    describe('exponential and logarithmic functions', () => {
      it('exp(ln(x)) should equal x for positive x', () => {
        fc.assert(
          fc.property(
            fc.float({ min: Math.fround(0.01), max: 100, noNaN: true }),
            (x) => {
              const result = evalExpr(`exp(ln(${x}))`);
              expect(result).toBeCloseTo(x, 10);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('ln(exp(x)) should equal x', () => {
        fc.assert(
          fc.property(
            fc.float({ min: -10, max: 10, noNaN: true }),
            (x) => {
              const result = evalExpr(`ln(exp(${x}))`);
              expect(result).toBeCloseTo(x, 10);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('log10(10^x) should equal x', () => {
        fc.assert(
          fc.property(
            fc.float({ min: -5, max: 5, noNaN: true }),
            (x) => {
              const result = evalExpr(`log10(10 ^ ${x})`);
              expect(result).toBeCloseTo(x, 10);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('log2(2^x) should equal x', () => {
        fc.assert(
          fc.property(
            fc.float({ min: -10, max: 10, noNaN: true }),
            (x) => {
              const result = evalExpr(`log2(2 ^ ${x})`);
              expect(result).toBeCloseTo(x, 10);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('ln(a * b) should equal ln(a) + ln(b) for positive a, b', () => {
        fc.assert(
          fc.property(
            fc.float({ min: Math.fround(0.1), max: 10, noNaN: true }),
            fc.float({ min: Math.fround(0.1), max: 10, noNaN: true }),
            (a, b) => {
              const result = evalExpr(`ln(${a} * ${b})`);
              const expected = evalExpr(`ln(${a})`) + evalExpr(`ln(${b})`);
              expect(result).toBeCloseTo(expected, 10);
            }
          ),
          { numRuns: 100 }
        );
      });
    });

    describe('power and root functions', () => {
      it('sqrt(x)^2 should equal x for non-negative x', () => {
        fc.assert(
          fc.property(
            fc.float({ min: 0, max: 1000, noNaN: true }),
            (x) => {
              const result = evalExpr(`sqrt(${x}) ^ 2`);
              expect(result).toBeCloseTo(x, 10);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('cbrt(x)^3 should equal x', () => {
        fc.assert(
          fc.property(
            fc.float({ min: -100, max: 100, noNaN: true }),
            (x) => {
              const result = evalExpr(`cbrt(${x}) ^ 3`);
              expect(result).toBeCloseTo(x, 8);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('root(x, n)^n should equal x for positive x and integer n > 0', () => {
        fc.assert(
          fc.property(
            fc.float({ min: Math.fround(0.1), max: 100, noNaN: true }),
            fc.integer({ min: 2, max: 5 }),
            (x, n) => {
              const result = evalExpr(`root(${x}, ${n}) ^ ${n}`);
              expect(result).toBeCloseTo(x, 8);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('pow(a, b) * pow(a, c) should equal pow(a, b + c)', () => {
        fc.assert(
          fc.property(
            fc.float({ min: 1, max: 5, noNaN: true }),
            fc.float({ min: -2, max: 2, noNaN: true }),
            fc.float({ min: -2, max: 2, noNaN: true }),
            (a, b, c) => {
              const result = evalExpr(`pow(${a}, ${b}) * pow(${a}, ${c})`);
              const expected = evalExpr(`pow(${a}, ${b} + ${c})`);
              expect(result).toBeCloseTo(expected, 8);
            }
          ),
          { numRuns: 100 }
        );
      });
    });

    describe('factorial function', () => {
      it('factorial(n) should equal n * factorial(n-1) for n > 0', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 1, max: 12 }),
            (n) => {
              const result = evalExpr(`factorial(${n})`);
              const expected = n * evalExpr(`factorial(${n - 1})`);
              expect(result).toBe(expected);
            }
          ),
          { numRuns: 12 }
        );
      });

      it('factorial(0) should equal 1', () => {
        expect(evalExpr('factorial(0)')).toBe(1);
      });

      it('factorial(n) should equal product of 1 to n', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 0, max: 10 }),
            (n) => {
              const result = evalExpr(`factorial(${n})`);
              let expected = 1;
              for (let i = 2; i <= n; i++) {
                expected *= i;
              }
              expect(result).toBe(expected);
            }
          ),
          { numRuns: 11 }
        );
      });
    });

    describe('gamma function', () => {
      it('gamma(n) should equal (n-1)! for positive integers', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 1, max: 10 }),
            (n) => {
              const result = evalExpr(`gamma(${n})`);
              const expected = evalExpr(`factorial(${n - 1})`);
              expect(result).toBeCloseTo(expected, 8);
            }
          ),
          { numRuns: 10 }
        );
      });

      it('gamma(x+1) should equal x * gamma(x) for positive x', () => {
        fc.assert(
          fc.property(
            fc.float({ min: 0.5, max: 5, noNaN: true }),
            (x) => {
              const result = evalExpr(`gamma(${x + 1})`);
              const expected = x * evalExpr(`gamma(${x})`);
              expect(result).toBeCloseTo(expected, 6);
            }
          ),
          { numRuns: 50 }
        );
      });

      it('gamma(0.5) should equal sqrt(pi)', () => {
        const result = evalExpr('gamma(0.5)');
        const expected = Math.sqrt(Math.PI);
        expect(result).toBeCloseTo(expected, 10);
      });
    });
  });

  describe('Property 25: Mathematical Constants Accuracy', () => {
    it('pi should be accurate to at least 15 significant digits', () => {
      const result = evalExpr('pi');
      const expected = 3.141592653589793;
      expect(Math.abs(result - expected)).toBeLessThan(1e-15);
    });

    it('e should be accurate to at least 15 significant digits', () => {
      const result = evalExpr('e');
      const expected = 2.718281828459045;
      expect(Math.abs(result - expected)).toBeLessThan(1e-15);
    });

    it('phi should be accurate to at least 15 significant digits', () => {
      const result = evalExpr('phi');
      const expected = (1 + Math.sqrt(5)) / 2;
      expect(Math.abs(result - expected)).toBeLessThan(1e-15);
    });

    it('tau should be accurate to at least 15 significant digits', () => {
      const result = evalExpr('tau');
      const expected = 2 * Math.PI;
      expect(Math.abs(result - expected)).toBeLessThan(1e-15);
    });

    it('constants should satisfy mathematical relationships', () => {
      // tau = 2 * pi
      expect(evalExpr('tau')).toBeCloseTo(evalExpr('2 * pi'), 14);
      
      // phi^2 = phi + 1 (golden ratio property)
      expect(evalExpr('phi ^ 2')).toBeCloseTo(evalExpr('phi + 1'), 14);
      
      // e^(i*pi) + 1 = 0 (Euler's identity - we test e^0 = 1 instead)
      expect(evalExpr('e ^ 0')).toBe(1);
    });
  });
});
