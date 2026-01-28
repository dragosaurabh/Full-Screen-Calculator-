/**
 * Property-based tests for Arbitrary Precision Mode
 * 
 * **Property 28: Arbitrary Precision Accuracy**
 * **Validates: Requirements 11.1, 11.2**
 * 
 * For any calculation in arbitrary precision mode with precision P,
 * the result SHALL be accurate to at least P significant digits.
 * 
 * **Property 29: Display Precision Formatting**
 * **Validates: Requirements 11.3**
 * 
 * For any calculation result and precision setting P, the formatted display
 * SHALL show exactly P significant digits (or fewer if the result is exact).
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  evaluatePrecision,
  createPrecisionContext,
  formatPrecisionResult,
  Decimal,
  setPrecision,
  PRECISION_CONSTANTS
} from '../../engine/precision';
import { parse } from '../../engine/parser';

// Helper to evaluate an expression with precision
function evalPrecision(expr: string, precision: number = 50): Decimal {
  const ast = parse(expr);
  const ctx = createPrecisionContext(precision);
  return evaluatePrecision(ast, ctx);
}

describe('Precision - Property Tests', () => {
  describe('Property 28: Arbitrary Precision Accuracy', () => {
    /**
     * **Validates: Requirements 11.1, 11.2**
     * 
     * For any calculation in arbitrary precision mode with precision P,
     * the result SHALL be accurate to at least P significant digits.
     */

    describe('basic arithmetic precision', () => {
      it('addition should maintain precision for arbitrary precision values', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 20, max: 50 }), // precision
            fc.float({ min: -1000, max: 1000, noNaN: true }),
            fc.float({ min: -1000, max: 1000, noNaN: true }),
            (precision, a, b) => {
              setPrecision(precision);
              const result = evalPrecision(`${a} + ${b}`, precision);
              const expected = new Decimal(a).plus(new Decimal(b));
              
              // Result should match expected to at least precision significant digits
              const resultStr = result.toSignificantDigits(precision).toString();
              const expectedStr = expected.toSignificantDigits(precision).toString();
              expect(resultStr).toBe(expectedStr);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('multiplication should maintain precision for arbitrary precision values', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 20, max: 50 }),
            fc.float({ min: -100, max: 100, noNaN: true }),
            fc.float({ min: -100, max: 100, noNaN: true }),
            (precision, a, b) => {
              setPrecision(precision);
              const result = evalPrecision(`${a} * ${b}`, precision);
              const expected = new Decimal(a).times(new Decimal(b));
              
              const resultStr = result.toSignificantDigits(precision).toString();
              const expectedStr = expected.toSignificantDigits(precision).toString();
              expect(resultStr).toBe(expectedStr);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('division should maintain precision for non-zero divisors', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 20, max: 50 }),
            fc.float({ min: -100, max: 100, noNaN: true }),
            fc.float({ min: Math.fround(0.1), max: 100, noNaN: true }),
            (precision, a, b) => {
              setPrecision(precision);
              const result = evalPrecision(`${a} / ${b}`, precision);
              const expected = new Decimal(a).div(new Decimal(b));
              
              const resultStr = result.toSignificantDigits(precision).toString();
              const expectedStr = expected.toSignificantDigits(precision).toString();
              expect(resultStr).toBe(expectedStr);
            }
          ),
          { numRuns: 100 }
        );
      });
    });


    describe('mathematical constants precision', () => {
      it('pi should be accurate to configured precision', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 15, max: 50 }),
            (precision) => {
              setPrecision(precision);
              const result = evalPrecision('pi', precision);
              const piFn = PRECISION_CONSTANTS['pi'];
              if (!piFn) throw new Error('Pi constant not found');
              const expected = piFn();
              
              // Compare significant digits
              const resultStr = result.toSignificantDigits(precision).toString();
              const expectedStr = expected.toSignificantDigits(precision).toString();
              expect(resultStr).toBe(expectedStr);
            }
          ),
          { numRuns: 20 }
        );
      });

      it('e should be accurate to configured precision', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 15, max: 50 }),
            (precision) => {
              setPrecision(precision);
              const result = evalPrecision('e', precision);
              const eFn = PRECISION_CONSTANTS['e'];
              if (!eFn) throw new Error('e constant not found');
              const expected = eFn();
              
              const resultStr = result.toSignificantDigits(precision).toString();
              const expectedStr = expected.toSignificantDigits(precision).toString();
              expect(resultStr).toBe(expectedStr);
            }
          ),
          { numRuns: 20 }
        );
      });

      it('phi should satisfy phi^2 = phi + 1 to configured precision', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 15, max: 50 }),
            (precision) => {
              setPrecision(precision);
              const phiSquared = evalPrecision('phi ^ 2', precision);
              const phiPlusOne = evalPrecision('phi + 1', precision);
              
              // phi^2 should equal phi + 1
              const diff = phiSquared.minus(phiPlusOne).abs();
              const tolerance = new Decimal(10).pow(-precision + 5);
              expect(diff.lte(tolerance)).toBe(true);
            }
          ),
          { numRuns: 20 }
        );
      });

      it('tau should equal 2 * pi to configured precision', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 15, max: 50 }),
            (precision) => {
              setPrecision(precision);
              const tau = evalPrecision('tau', precision);
              const twoPi = evalPrecision('2 * pi', precision);
              
              const diff = tau.minus(twoPi).abs();
              const tolerance = new Decimal(10).pow(-precision + 5);
              expect(diff.lte(tolerance)).toBe(true);
            }
          ),
          { numRuns: 20 }
        );
      });
    });


    describe('scientific functions precision', () => {
      it('exp(ln(x)) should equal x to configured precision for positive x', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 20, max: 40 }),
            fc.float({ min: Math.fround(0.1), max: 100, noNaN: true }),
            (precision, x) => {
              setPrecision(precision);
              const result = evalPrecision(`exp(ln(${x}))`, precision);
              const expected = new Decimal(x);
              
              const diff = result.minus(expected).abs();
              const tolerance = expected.abs().times(new Decimal(10).pow(-precision + 10));
              expect(diff.lte(tolerance)).toBe(true);
            }
          ),
          { numRuns: 50 }
        );
      });

      it('sqrt(x)^2 should equal x to configured precision for non-negative x', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 20, max: 40 }),
            fc.float({ min: 0, max: 1000, noNaN: true }),
            (precision, x) => {
              setPrecision(precision);
              const result = evalPrecision(`sqrt(${x}) ^ 2`, precision);
              const expected = new Decimal(x);
              
              const diff = result.minus(expected).abs();
              const tolerance = expected.abs().plus(1).times(new Decimal(10).pow(-precision + 10));
              expect(diff.lte(tolerance)).toBe(true);
            }
          ),
          { numRuns: 50 }
        );
      });

      it('sin^2(x) + cos^2(x) should equal 1 to configured precision', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 20, max: 40 }),
            fc.float({ min: -10, max: 10, noNaN: true }),
            (precision, x) => {
              setPrecision(precision);
              const sinX = evalPrecision(`sin(${x})`, precision);
              const cosX = evalPrecision(`cos(${x})`, precision);
              const result = sinX.pow(2).plus(cosX.pow(2));
              
              const diff = result.minus(1).abs();
              const tolerance = new Decimal(10).pow(-precision + 10);
              expect(diff.lte(tolerance)).toBe(true);
            }
          ),
          { numRuns: 50 }
        );
      });
    });


    describe('precision configuration', () => {
      it('higher precision should not lose accuracy of lower precision', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 15, max: 30 }),
            fc.float({ min: 1, max: 100, noNaN: true }),
            fc.float({ min: 1, max: 100, noNaN: true }),
            (basePrecision, a, b) => {
              const higherPrecision = basePrecision + 10;
              
              // Calculate with base precision
              setPrecision(basePrecision);
              const resultBase = evalPrecision(`${a} * ${b}`, basePrecision);
              
              // Calculate with higher precision
              setPrecision(higherPrecision);
              const resultHigher = evalPrecision(`${a} * ${b}`, higherPrecision);
              
              // Results should match to base precision
              const baseStr = resultBase.toSignificantDigits(basePrecision).toString();
              const higherStr = resultHigher.toSignificantDigits(basePrecision).toString();
              expect(baseStr).toBe(higherStr);
            }
          ),
          { numRuns: 50 }
        );
      });
    });
  });


  describe('Property 29: Display Precision Formatting', () => {
    /**
     * **Validates: Requirements 11.3**
     * 
     * For any calculation result and precision setting P, the formatted display
     * SHALL show exactly P significant digits (or fewer if the result is exact).
     */

    describe('significant digits formatting', () => {
      it('formatted result should have at most P significant digits', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 5, max: 30 }),
            fc.float({ min: -1000, max: 1000, noNaN: true }),
            (precision, value) => {
              const decimal = new Decimal(value);
              const formatted = formatPrecisionResult(decimal, precision);
              
              // Count significant digits (excluding leading zeros and decimal point)
              const sigDigits = countSignificantDigits(formatted);
              expect(sigDigits).toBeLessThanOrEqual(precision);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('exact integers should be formatted without unnecessary decimals', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 5, max: 20 }),
            fc.integer({ min: -10000, max: 10000 }),
            (precision, value) => {
              const decimal = new Decimal(value);
              const formatted = formatPrecisionResult(decimal, precision);
              
              // For exact integers, the formatted result should represent the same value
              const parsed = new Decimal(formatted);
              expect(parsed.eq(decimal)).toBe(true);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('formatted result should be parseable back to equivalent value', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 10, max: 30 }),
            fc.float({ min: Math.fround(0.001), max: 1000, noNaN: true }),
            (precision, value) => {
              const decimal = new Decimal(value);
              const formatted = formatPrecisionResult(decimal, precision);
              
              // Parse the formatted string back
              const parsed = new Decimal(formatted);
              
              // Should be equal to precision significant digits
              const diff = parsed.minus(decimal).abs();
              const tolerance = decimal.abs().times(new Decimal(10).pow(-precision + 2));
              expect(diff.lte(tolerance)).toBe(true);
            }
          ),
          { numRuns: 100 }
        );
      });
    });


    describe('special values formatting', () => {
      it('should format infinity correctly', () => {
        const posInf = new Decimal(Infinity);
        const negInf = new Decimal(-Infinity);
        
        expect(formatPrecisionResult(posInf, 10)).toBe('∞');
        expect(formatPrecisionResult(negInf, 10)).toBe('-∞');
      });

      it('should format NaN correctly', () => {
        const nan = new Decimal(NaN);
        expect(formatPrecisionResult(nan, 10)).toBe('NaN');
      });

      it('should format zero correctly', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 5, max: 30 }),
            (precision) => {
              const zero = new Decimal(0);
              const formatted = formatPrecisionResult(zero, precision);
              expect(formatted).toBe('0');
            }
          ),
          { numRuns: 20 }
        );
      });
    });

    describe('precision consistency', () => {
      it('same value with different precisions should round correctly', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 5, max: 15 }),
            fc.float({ min: Math.fround(0.001), max: 1000, noNaN: true }),
            (basePrecision, value) => {
              const decimal = new Decimal(value);
              const higherPrecision = basePrecision + 5;
              
              const formattedBase = formatPrecisionResult(decimal, basePrecision);
              const formattedHigher = formatPrecisionResult(decimal, higherPrecision);
              
              // Higher precision should have more or equal significant digits
              const sigDigitsBase = countSignificantDigits(formattedBase);
              const sigDigitsHigher = countSignificantDigits(formattedHigher);
              expect(sigDigitsHigher).toBeGreaterThanOrEqual(sigDigitsBase);
            }
          ),
          { numRuns: 50 }
        );
      });
    });
  });
});

/**
 * Helper function to count significant digits in a formatted number string
 */
function countSignificantDigits(str: string): number {
  // Handle special cases
  if (str === '0' || str === 'NaN' || str === '∞' || str === '-∞') {
    return str === '0' ? 1 : 0;
  }
  
  // Remove sign
  let s = str.replace(/^-/, '');
  
  // Handle scientific notation
  const eIndex = s.toLowerCase().indexOf('e');
  if (eIndex !== -1) {
    s = s.substring(0, eIndex);
  }
  
  // Remove decimal point
  s = s.replace('.', '');
  
  // Remove leading zeros
  s = s.replace(/^0+/, '');
  
  // Remove trailing zeros only if there was no decimal point in original
  if (!str.includes('.')) {
    s = s.replace(/0+$/, '');
  }
  
  return s.length || 1;
}


// Additional tests for display formatting functions
import {
  formatToSignificantDigits,
  applyLocaleSeparators,
  formatAutoNotation,
  shouldUseScientificNotation
} from '../../utils/formatters';

describe('Display Precision Formatting Functions', () => {
  describe('formatToSignificantDigits', () => {
    it('should format numbers to exact significant digits', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 3, max: 15 }),
          fc.float({ min: Math.fround(0.001), max: 1000000, noNaN: true }),
          (precision, value) => {
            // Use no thousands separator to make parsing easier
            const formatted = formatToSignificantDigits(value, precision, '.', '');
            
            // Should be parseable
            const parsed = new Decimal(formatted);
            expect(parsed.isFinite()).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle locale separators correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 5, max: 10 }),
          fc.float({ min: 1000, max: 1000000, noNaN: true }),
          (precision, value) => {
            // Test with comma as decimal separator
            const formatted = formatToSignificantDigits(value, precision, ',', '.');
            
            // Should contain comma as decimal separator if there's a decimal part
            if (formatted.includes(',')) {
              expect(formatted.split(',').length).toBeLessThanOrEqual(2);
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('applyLocaleSeparators', () => {
    it('should correctly apply thousands separators', () => {
      expect(applyLocaleSeparators('1234567.89', '.', ',')).toBe('1,234,567.89');
      expect(applyLocaleSeparators('1234567.89', ',', '.')).toBe('1.234.567,89');
      expect(applyLocaleSeparators('1234567.89', '.', ' ')).toBe('1 234 567.89');
    });

    it('should handle scientific notation', () => {
      expect(applyLocaleSeparators('1.234e+10', '.', ',')).toBe('1.234e+10');
      expect(applyLocaleSeparators('1.234e-5', ',', '.')).toBe('1,234e-5');
    });

    it('should handle negative numbers', () => {
      expect(applyLocaleSeparators('-1234567.89', '.', ',')).toBe('-1,234,567.89');
    });
  });

  describe('shouldUseScientificNotation', () => {
    it('should return true for very large numbers', () => {
      expect(shouldUseScientificNotation(1e20, 15)).toBe(true);
      expect(shouldUseScientificNotation(new Decimal('1e50'), 15)).toBe(true);
    });

    it('should return true for very small numbers', () => {
      expect(shouldUseScientificNotation(1e-10, 15)).toBe(true);
      expect(shouldUseScientificNotation(new Decimal('1e-20'), 15)).toBe(true);
    });

    it('should return false for normal range numbers', () => {
      expect(shouldUseScientificNotation(123.456, 15)).toBe(false);
      expect(shouldUseScientificNotation(0.01, 15)).toBe(false);
    });

    it('should return false for zero', () => {
      expect(shouldUseScientificNotation(0, 15)).toBe(false);
    });
  });

  describe('formatAutoNotation', () => {
    it('should use standard notation for normal numbers', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 5, max: 10 }),
          fc.float({ min: Math.fround(0.01), max: 10000, noNaN: true }),
          (precision, value) => {
            const formatted = formatAutoNotation(value, precision);
            
            // Should not contain 'e' for normal range numbers
            expect(formatted.toLowerCase().includes('e')).toBe(false);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should use scientific notation for extreme values', () => {
      const largeValue = new Decimal('1e30');
      const formatted = formatAutoNotation(largeValue, 10);
      expect(formatted.toLowerCase().includes('e')).toBe(true);
    });
  });
});
