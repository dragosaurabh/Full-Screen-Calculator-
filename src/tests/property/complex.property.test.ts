/**
 * Complex Number Property Tests
 * 
 * Property-based tests for complex number operations.
 * 
 * **Property 14: Complex Number Parsing Preservation**
 * **Property 15: Complex Arithmetic Correctness**
 * **Property 16: Complex Representation Round-Trip**
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.4**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { complexOperations } from '../../engine/modes/complex';

describe('Complex Number Properties', () => {
  describe('Property 14: Complex Number Parsing Preservation', () => {
    it('parsing preserves real and imaginary parts', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -100, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.float({ min: -100, max: 100, noNaN: true, noDefaultInfinity: true }),
          (real, imag) => {
            const c = complexOperations.create(real, imag);
            expect(c.real).toBe(real);
            expect(c.imag).toBe(imag);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('format then parse produces equivalent complex number', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -100, max: 100 }),
          fc.integer({ min: -100, max: 100 }),
          (real, imag) => {
            const original = complexOperations.create(real, imag);
            const formatted = complexOperations.format(original);
            const parsed = complexOperations.parse(formatted);
            
            expect(parsed.real).toBeCloseTo(original.real, 10);
            expect(parsed.imag).toBeCloseTo(original.imag, 10);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 15: Complex Arithmetic Correctness', () => {
    it('addition: (a+bi) + (c+di) = (a+c) + (b+d)i', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -100, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.float({ min: -100, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.float({ min: -100, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.float({ min: -100, max: 100, noNaN: true, noDefaultInfinity: true }),
          (a, b, c, d) => {
            const z1 = complexOperations.create(a, b);
            const z2 = complexOperations.create(c, d);
            const sum = complexOperations.add(z1, z2);
            
            expect(sum.real).toBeCloseTo(a + c, 10);
            expect(sum.imag).toBeCloseTo(b + d, 10);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('multiplication: (a+bi)(c+di) = (ac-bd) + (ad+bc)i', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -10, max: 10, noNaN: true, noDefaultInfinity: true }),
          fc.float({ min: -10, max: 10, noNaN: true, noDefaultInfinity: true }),
          fc.float({ min: -10, max: 10, noNaN: true, noDefaultInfinity: true }),
          fc.float({ min: -10, max: 10, noNaN: true, noDefaultInfinity: true }),
          (a, b, c, d) => {
            const z1 = complexOperations.create(a, b);
            const z2 = complexOperations.create(c, d);
            const product = complexOperations.multiply(z1, z2);
            
            expect(product.real).toBeCloseTo(a * c - b * d, 8);
            expect(product.imag).toBeCloseTo(a * d + b * c, 8);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('z * conjugate(z) = |z|²', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -10, max: 10, noNaN: true, noDefaultInfinity: true }),
          fc.float({ min: -10, max: 10, noNaN: true, noDefaultInfinity: true }),
          (a, b) => {
            const z = complexOperations.create(a, b);
            const conj = complexOperations.conjugate(z);
            const product = complexOperations.multiply(z, conj);
            const magSquared = a * a + b * b;
            
            expect(product.real).toBeCloseTo(magSquared, 8);
            expect(product.imag).toBeCloseTo(0, 8);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('division: z / z = 1 for non-zero z', () => {
      fc.assert(
        fc.property(
          fc.float({ min: 1, max: 10, noNaN: true, noDefaultInfinity: true }),
          fc.float({ min: -10, max: 10, noNaN: true, noDefaultInfinity: true }),
          (a, b) => {
            const z = complexOperations.create(a, b);
            const quotient = complexOperations.divide(z, z);
            
            expect(quotient.real).toBeCloseTo(1, 8);
            expect(quotient.imag).toBeCloseTo(0, 8);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 16: Complex Representation Round-Trip', () => {
    it('rectangular -> polar -> rectangular preserves value', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -10, max: 10, noNaN: true, noDefaultInfinity: true }),
          fc.float({ min: -10, max: 10, noNaN: true, noDefaultInfinity: true }),
          (a, b) => {
            const original = complexOperations.create(a, b);
            const polar = complexOperations.toPolar(original);
            const restored = complexOperations.fromPolar(polar.magnitude, polar.phase);
            
            expect(restored.real).toBeCloseTo(original.real, 8);
            expect(restored.imag).toBeCloseTo(original.imag, 8);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('magnitude is always non-negative', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -100, max: 100, noNaN: true, noDefaultInfinity: true }),
          fc.float({ min: -100, max: 100, noNaN: true, noDefaultInfinity: true }),
          (a, b) => {
            const z = complexOperations.create(a, b);
            const mag = complexOperations.magnitude(z);
            expect(mag).toBeGreaterThanOrEqual(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('magnitude equals sqrt(real² + imag²)', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -10, max: 10, noNaN: true, noDefaultInfinity: true }),
          fc.float({ min: -10, max: 10, noNaN: true, noDefaultInfinity: true }),
          (a, b) => {
            const z = complexOperations.create(a, b);
            const mag = complexOperations.magnitude(z);
            const expected = Math.sqrt(a * a + b * b);
            expect(mag).toBeCloseTo(expected, 10);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
