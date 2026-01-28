/**
 * Basic Calculator Mode
 * 
 * Implements basic arithmetic operations: +, -, *, /, %
 */

/**
 * Basic arithmetic operations
 */
export const basicOperations = {
  add: (a: number, b: number): number => a + b,
  subtract: (a: number, b: number): number => a - b,
  multiply: (a: number, b: number): number => a * b,
  divide: (a: number, b: number): number => {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  },
  percent: (a: number): number => a / 100,
};
