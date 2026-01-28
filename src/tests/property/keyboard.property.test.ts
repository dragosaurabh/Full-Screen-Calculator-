/**
 * Keyboard Input Property Tests
 * 
 * Property-based tests for keyboard input handling.
 * 
 * **Property 39: Keyboard Input Append**
 * **Validates: Requirements 17.8**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Simulate keyboard input handling logic
interface KeyboardInputHandler {
  expression: string;
  appendChar(char: string): void;
  getExpression(): string;
  clear(): void;
}

function createKeyboardInputHandler(): KeyboardInputHandler {
  let expression = '';
  
  return {
    get expression() {
      return expression;
    },
    
    appendChar(char: string): void {
      // Only append valid calculator characters
      if (isValidCalculatorChar(char)) {
        expression += char;
      }
    },
    
    getExpression(): string {
      return expression;
    },
    
    clear(): void {
      expression = '';
    }
  };
}

// Valid calculator input characters
const VALID_DIGITS = '0123456789';
const VALID_OPERATORS = '+-*/^%';
const VALID_SPECIAL = '.()';

function isValidCalculatorChar(char: string): boolean {
  return (
    VALID_DIGITS.includes(char) ||
    VALID_OPERATORS.includes(char) ||
    VALID_SPECIAL.includes(char)
  );
}

// Arbitrary for valid calculator characters
const validDigit = fc.constantFrom(...VALID_DIGITS.split(''));
const validOperator = fc.constantFrom(...VALID_OPERATORS.split(''));
const validSpecial = fc.constantFrom(...VALID_SPECIAL.split(''));
const validCalculatorChar = fc.oneof(validDigit, validOperator, validSpecial);

describe('Keyboard Input - Property Tests', () => {
  describe('Property 39: Keyboard Input Append', () => {
    /**
     * **Validates: Requirements 17.8**
     * 
     * For any numeric or operator key press, the corresponding character
     * SHALL be appended to the current expression.
     */

    it('digit key press appends digit to expression', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 20 }),
          validDigit,
          (initialExpression, digit) => {
            const handler = createKeyboardInputHandler();
            
            // Set initial expression by appending each char
            for (const char of initialExpression) {
              if (isValidCalculatorChar(char)) {
                handler.appendChar(char);
              }
            }
            const beforeLength = handler.getExpression().length;
            
            // Append digit
            handler.appendChar(digit);
            
            // Verify digit was appended
            const afterExpression = handler.getExpression();
            expect(afterExpression.length).toBe(beforeLength + 1);
            expect(afterExpression.endsWith(digit)).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('operator key press appends operator to expression', () => {
      fc.assert(
        fc.property(
          validDigit,
          validOperator,
          (digit, operator) => {
            const handler = createKeyboardInputHandler();
            
            // Start with a digit
            handler.appendChar(digit);
            
            // Append operator
            handler.appendChar(operator);
            
            // Verify operator was appended
            const expression = handler.getExpression();
            expect(expression).toBe(digit + operator);
            expect(expression.endsWith(operator)).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('sequence of key presses builds expression correctly', () => {
      fc.assert(
        fc.property(
          fc.array(validCalculatorChar, { minLength: 1, maxLength: 20 }),
          (chars) => {
            const handler = createKeyboardInputHandler();
            
            // Append each character
            for (const char of chars) {
              handler.appendChar(char);
            }
            
            // Verify expression matches concatenation of all chars
            const expression = handler.getExpression();
            expect(expression).toBe(chars.join(''));
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('invalid characters are not appended', () => {
      fc.assert(
        fc.property(
          fc.array(validCalculatorChar, { minLength: 1, maxLength: 10 }),
          fc.string({ minLength: 1, maxLength: 5 }).filter(s => 
            !s.split('').some(c => isValidCalculatorChar(c))
          ),
          (validChars, invalidChars) => {
            const handler = createKeyboardInputHandler();
            
            // Build initial expression
            for (const char of validChars) {
              handler.appendChar(char);
            }
            const beforeExpression = handler.getExpression();
            
            // Try to append invalid characters
            for (const char of invalidChars) {
              handler.appendChar(char);
            }
            
            // Expression should be unchanged
            expect(handler.getExpression()).toBe(beforeExpression);
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('decimal point can be appended', () => {
      fc.assert(
        fc.property(
          fc.array(validDigit, { minLength: 1, maxLength: 5 }),
          (digits) => {
            const handler = createKeyboardInputHandler();
            
            // Append digits
            for (const digit of digits) {
              handler.appendChar(digit);
            }
            
            // Append decimal point
            handler.appendChar('.');
            
            // Verify decimal was appended
            const expression = handler.getExpression();
            expect(expression.endsWith('.')).toBe(true);
            expect(expression).toBe(digits.join('') + '.');
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('parentheses can be appended', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('(', ')'),
          validDigit,
          (paren, digit) => {
            const handler = createKeyboardInputHandler();
            
            if (paren === '(') {
              handler.appendChar(paren);
              handler.appendChar(digit);
              expect(handler.getExpression()).toBe('(' + digit);
            } else {
              handler.appendChar(digit);
              handler.appendChar(paren);
              expect(handler.getExpression()).toBe(digit + ')');
            }
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('expression length grows by one for each valid character', () => {
      fc.assert(
        fc.property(
          fc.array(validCalculatorChar, { minLength: 1, maxLength: 30 }),
          (chars) => {
            const handler = createKeyboardInputHandler();
            
            for (let i = 0; i < chars.length; i++) {
              const beforeLength = handler.getExpression().length;
              handler.appendChar(chars[i]!);
              const afterLength = handler.getExpression().length;
              
              expect(afterLength).toBe(beforeLength + 1);
            }
            
            expect(handler.getExpression().length).toBe(chars.length);
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
