/**
 * Conversion Property Tests
 * 
 * Property-based tests for unit conversions and number base conversions.
 * 
 * **Property 5: Number Base Conversion Round-Trip**
 * **Property 22: Unit Conversion Round-Trip**
 * **Property 23: Temperature Conversion Accuracy**
 * **Validates: Requirements 3.1, 3.2, 9.2, 9.4**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { programmerOperations } from '../../engine/modes/programmer';
import { converterOperations } from '../../engine/modes/converter';

describe('Conversion Properties', () => {
  describe('Property 5: Number Base Conversion Round-Trip', () => {
    it('decimal -> binary -> decimal preserves value', () => {
      fc.assert(
        fc.property(
          fc.bigInt({ min: 0n, max: 1000000n }),
          (n) => {
            const binary = programmerOperations.toBase(n, 2);
            const restored = programmerOperations.fromBase(binary, 2);
            expect(restored).toBe(n);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('decimal -> octal -> decimal preserves value', () => {
      fc.assert(
        fc.property(
          fc.bigInt({ min: 0n, max: 1000000n }),
          (n) => {
            const octal = programmerOperations.toBase(n, 8);
            const restored = programmerOperations.fromBase(octal, 8);
            expect(restored).toBe(n);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('decimal -> hex -> decimal preserves value', () => {
      fc.assert(
        fc.property(
          fc.bigInt({ min: 0n, max: 1000000n }),
          (n) => {
            const hex = programmerOperations.toBase(n, 16);
            const restored = programmerOperations.fromBase(hex, 16);
            expect(restored).toBe(n);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 6: Bitwise Operation Correctness', () => {
    it('leftShift(x, n) = x * 2^n', () => {
      fc.assert(
        fc.property(
          fc.bigInt({ min: 0n, max: 1000n }),
          fc.integer({ min: 0, max: 10 }),
          (x, n) => {
            const shifted = programmerOperations.leftShift(x, n);
            const expected = x * (2n ** BigInt(n));
            expect(shifted).toBe(expected);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('AND with all 1s preserves value', () => {
      fc.assert(
        fc.property(
          fc.bigInt({ min: 0n, max: 255n }),
          (x) => {
            const result = programmerOperations.bitwiseAnd(x, 255n);
            expect(result).toBe(x);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('OR with 0 preserves value', () => {
      fc.assert(
        fc.property(
          fc.bigInt({ min: 0n, max: 1000000n }),
          (x) => {
            const result = programmerOperations.bitwiseOr(x, 0n);
            expect(result).toBe(x);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('XOR with self equals 0', () => {
      fc.assert(
        fc.property(
          fc.bigInt({ min: 0n, max: 1000000n }),
          (x) => {
            const result = programmerOperations.bitwiseXor(x, x);
            expect(result).toBe(0n);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 7: Two\'s Complement Consistency', () => {
    it('toTwosComplement -> fromTwosComplement preserves value', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -128, max: 127 }),
          (n) => {
            const twos = programmerOperations.toTwosComplement(BigInt(n), 8);
            const restored = programmerOperations.fromTwosComplement(twos, 8);
            expect(Number(restored)).toBe(n);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('positive numbers unchanged in two\'s complement', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 127 }),
          (n) => {
            const twos = programmerOperations.toTwosComplement(BigInt(n), 8);
            expect(Number(twos)).toBe(n);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 22: Unit Conversion Round-Trip', () => {
    it('meters -> feet -> meters preserves value', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.01), max: 1000, noNaN: true, noDefaultInfinity: true }),
          (meters) => {
            const feet = converterOperations.convert(meters, 'meter', 'foot');
            const restored = converterOperations.convert(feet, 'foot', 'meter');
            expect(restored).toBeCloseTo(meters, 6);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('kilograms -> pounds -> kilograms preserves value', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.01), max: 1000, noNaN: true, noDefaultInfinity: true }),
          (kg) => {
            const lb = converterOperations.convert(kg, 'kilogram', 'pound');
            const restored = converterOperations.convert(lb, 'pound', 'kilogram');
            expect(restored).toBeCloseTo(kg, 6);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('liters -> gallons -> liters preserves value', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.01), max: 1000, noNaN: true, noDefaultInfinity: true }),
          (liters) => {
            const gallons = converterOperations.convert(liters, 'liter', 'gallon_us');
            const restored = converterOperations.convert(gallons, 'gallon_us', 'liter');
            expect(restored).toBeCloseTo(liters, 6);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 23: Temperature Conversion Accuracy', () => {
    it('Celsius -> Fahrenheit -> Kelvin -> Celsius preserves value', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -100, max: 1000, noNaN: true, noDefaultInfinity: true }),
          (celsius) => {
            const fahrenheit = converterOperations.convert(celsius, 'celsius', 'fahrenheit');
            const kelvin = converterOperations.convert(fahrenheit, 'fahrenheit', 'kelvin');
            const restored = converterOperations.convert(kelvin, 'kelvin', 'celsius');
            expect(restored).toBeCloseTo(celsius, 6);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('0°C = 32°F', () => {
      const fahrenheit = converterOperations.convert(0, 'celsius', 'fahrenheit');
      expect(fahrenheit).toBeCloseTo(32, 10);
    });

    it('100°C = 212°F', () => {
      const fahrenheit = converterOperations.convert(100, 'celsius', 'fahrenheit');
      expect(fahrenheit).toBeCloseTo(212, 10);
    });

    it('0°C = 273.15K', () => {
      const kelvin = converterOperations.convert(0, 'celsius', 'kelvin');
      expect(kelvin).toBeCloseTo(273.15, 10);
    });
  });
});
