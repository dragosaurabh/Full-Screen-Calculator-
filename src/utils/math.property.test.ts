/**
 * Property-based tests for basic math utilities
 * Uses fast-check to verify mathematical properties hold for all inputs
 * Validates: Requirements 1.1 (basic arithmetic operations)
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { add, subtract, multiply, divide } from './math'

describe('Math Utilities - Property Tests', () => {
  describe('add', () => {
    it('should be commutative: a + b = b + a', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), (a, b) => {
          expect(add(a, b)).toBe(add(b, a))
        })
      )
    })

    it('should be associative: (a + b) + c = a + (b + c)', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), fc.integer(), (a, b, c) => {
          expect(add(add(a, b), c)).toBe(add(a, add(b, c)))
        })
      )
    })

    it('should have identity element 0: a + 0 = a', () => {
      fc.assert(
        fc.property(fc.integer(), (a) => {
          expect(add(a, 0)).toBe(a)
        })
      )
    })
  })

  describe('subtract', () => {
    it('should satisfy: a - b + b = a', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), (a, b) => {
          expect(add(subtract(a, b), b)).toBe(a)
        })
      )
    })

    it('should satisfy: a - a = 0', () => {
      fc.assert(
        fc.property(fc.integer(), (a) => {
          expect(subtract(a, a)).toBe(0)
        })
      )
    })
  })

  describe('multiply', () => {
    it('should be commutative: a * b = b * a', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), (a, b) => {
          expect(multiply(a, b)).toBe(multiply(b, a))
        })
      )
    })

    it('should have identity element 1: a * 1 = a', () => {
      fc.assert(
        fc.property(fc.integer(), (a) => {
          expect(multiply(a, 1)).toBe(a)
        })
      )
    })

    it('should have zero property: a * 0 = 0', () => {
      fc.assert(
        fc.property(fc.integer(), (a) => {
          // Use Object.is to handle -0 vs +0 correctly
          const result = multiply(a, 0)
          expect(result === 0 || Object.is(result, -0)).toBe(true)
        })
      )
    })
  })

  describe('divide', () => {
    it('should satisfy: (a * b) / b ≈ a for non-zero b (within floating-point tolerance)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -1000, max: 1000 }),
          fc.integer({ min: 1, max: 1000 }),
          (a, b) => {
            const result = divide(multiply(a, b), b)
            // Use approximate equality for floating-point
            expect(Math.abs(result - a)).toBeLessThan(1e-10)
          }
        )
      )
    })

    it('should satisfy: a / 1 = a', () => {
      fc.assert(
        fc.property(fc.integer(), (a) => {
          expect(divide(a, 1)).toBe(a)
        })
      )
    })

    it('should throw for division by zero', () => {
      fc.assert(
        fc.property(fc.integer(), (a) => {
          expect(() => divide(a, 0)).toThrow('Cannot divide by zero')
        })
      )
    })
  })
})
