/**
 * Scientific Calculator Mode
 * 
 * Implements trigonometric, hyperbolic, exponential, logarithmic,
 * factorial, power, and gamma functions.
 */

import type { AngleMode } from '../../types';

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Scientific operations - placeholder implementations
 * Will be fully implemented in Task 5.x
 */
export const scientificOperations = {
  // Trigonometric functions
  sin: (x: number, angleMode: AngleMode = 'radians'): number => {
    const radians = angleMode === 'degrees' ? degreesToRadians(x) : x;
    return Math.sin(radians);
  },
  cos: (x: number, angleMode: AngleMode = 'radians'): number => {
    const radians = angleMode === 'degrees' ? degreesToRadians(x) : x;
    return Math.cos(radians);
  },
  tan: (x: number, angleMode: AngleMode = 'radians'): number => {
    const radians = angleMode === 'degrees' ? degreesToRadians(x) : x;
    return Math.tan(radians);
  },
  
  // Inverse trigonometric functions
  asin: (x: number): number => Math.asin(x),
  acos: (x: number): number => Math.acos(x),
  atan: (x: number): number => Math.atan(x),
  
  // Hyperbolic functions
  sinh: (x: number): number => Math.sinh(x),
  cosh: (x: number): number => Math.cosh(x),
  tanh: (x: number): number => Math.tanh(x),
  
  // Exponential and logarithmic
  exp: (x: number): number => Math.exp(x),
  ln: (x: number): number => Math.log(x),
  log10: (x: number): number => Math.log10(x),
  log2: (x: number): number => Math.log2(x),
  
  // Power and root
  pow: (base: number, exponent: number): number => Math.pow(base, exponent),
  sqrt: (x: number): number => Math.sqrt(x),
  nthRoot: (x: number, n: number): number => Math.pow(x, 1 / n),
  
  // Factorial (placeholder - will use mathjs in Task 5.5)
  factorial: (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) {
      throw new Error('Factorial requires non-negative integer');
    }
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  },
  
  // Gamma function (placeholder - will use mathjs in Task 5.5)
  gamma: (_x: number): number => {
    throw new Error('Gamma function not yet implemented');
  },
};
