/**
 * Unit tests for basic math utilities
 * Validates: Requirements 1.1 (basic arithmetic operations)
 */

import { describe, it, expect } from 'vitest'
import { add, subtract, multiply, divide } from './math'

describe('Math Utilities', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5)
    })

    it('should add negative numbers', () => {
      expect(add(-2, -3)).toBe(-5)
    })

    it('should add zero', () => {
      expect(add(5, 0)).toBe(5)
    })
  })

  describe('subtract', () => {
    it('should subtract two numbers', () => {
      expect(subtract(5, 3)).toBe(2)
    })

    it('should handle negative results', () => {
      expect(subtract(3, 5)).toBe(-2)
    })
  })

  describe('multiply', () => {
    it('should multiply two numbers', () => {
      expect(multiply(4, 3)).toBe(12)
    })

    it('should handle zero', () => {
      expect(multiply(5, 0)).toBe(0)
    })

    it('should handle negative numbers', () => {
      expect(multiply(-2, 3)).toBe(-6)
    })
  })

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5)
    })

    it('should handle decimal results', () => {
      expect(divide(7, 2)).toBe(3.5)
    })

    it('should throw error when dividing by zero', () => {
      expect(() => divide(5, 0)).toThrow('Cannot divide by zero')
    })
  })
})
