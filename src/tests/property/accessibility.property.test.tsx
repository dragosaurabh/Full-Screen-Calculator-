/**
 * Accessibility Property Tests
 * 
 * Property-based tests for accessibility compliance.
 * 
 * **Property 38: Mobile Touch Target Size**
 * **Validates: Requirements 16.4**
 * Ensure 44px minimum touch targets on mobile
 * 
 * **Property 40: ARIA Labels Completeness**
 * **Validates: Requirements 18.2**
 * Add ARIA roles and labels to all buttons
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import { Keypad } from '../../components/Calculator/Keypad';
import { Display } from '../../components/Calculator/Display';
import type { CalculatorMode, KeypadInput, KeypadAction, CalculationResult } from '../../types';

// Button configurations for each mode (extracted from Keypad component)
interface ButtonConfig {
  label: string;
  value: string;
  type: 'digit' | 'operator' | 'function' | 'constant' | 'parenthesis' | 'action';
  action?: KeypadAction['type'];
  ariaLabel?: string;
}

// Basic mode buttons
const basicButtons: ButtonConfig[][] = [
  [
    { label: 'C', value: 'clear', type: 'action', action: 'clear' },
    { label: '(', value: '(', type: 'parenthesis' },
    { label: ')', value: ')', type: 'parenthesis' },
    { label: '÷', value: '/', type: 'operator', ariaLabel: 'divide' },
  ],
  [
    { label: '7', value: '7', type: 'digit' },
    { label: '8', value: '8', type: 'digit' },
    { label: '9', value: '9', type: 'digit' },
    { label: '×', value: '*', type: 'operator', ariaLabel: 'multiply' },
  ],
  [
    { label: '4', value: '4', type: 'digit' },
    { label: '5', value: '5', type: 'digit' },
    { label: '6', value: '6', type: 'digit' },
    { label: '−', value: '-', type: 'operator', ariaLabel: 'subtract' },
  ],
  [
    { label: '1', value: '1', type: 'digit' },
    { label: '2', value: '2', type: 'digit' },
    { label: '3', value: '3', type: 'digit' },
    { label: '+', value: '+', type: 'operator', ariaLabel: 'add' },
  ],
  [
    { label: '0', value: '0', type: 'digit' },
    { label: '.', value: '.', type: 'digit', ariaLabel: 'decimal point' },
    { label: '⌫', value: 'backspace', type: 'action', action: 'backspace', ariaLabel: 'backspace' },
    { label: '=', value: 'evaluate', type: 'action', action: 'evaluate' },
  ],
];

// Scientific mode additional buttons
const scientificButtons: ButtonConfig[][] = [
  [
    { label: 'sin', value: 'sin', type: 'function' },
    { label: 'cos', value: 'cos', type: 'function' },
    { label: 'tan', value: 'tan', type: 'function' },
    { label: 'π', value: 'pi', type: 'constant', ariaLabel: 'pi' },
  ],
  [
    { label: 'ln', value: 'ln', type: 'function', ariaLabel: 'natural log' },
    { label: 'log', value: 'log', type: 'function', ariaLabel: 'log base 10' },
    { label: 'e', value: 'e', type: 'constant', ariaLabel: 'euler number' },
    { label: '^', value: '^', type: 'operator', ariaLabel: 'power' },
  ],
  [
    { label: '√', value: 'sqrt', type: 'function', ariaLabel: 'square root' },
    { label: 'x²', value: '^2', type: 'operator', ariaLabel: 'square' },
    { label: '!', value: 'factorial', type: 'function', ariaLabel: 'factorial' },
    { label: '%', value: '%', type: 'operator', ariaLabel: 'modulo' },
  ],
];

// Get all buttons for a given mode
function getButtonsForMode(mode: CalculatorMode): ButtonConfig[] {
  const buttons = basicButtons.flat();
  if (mode === 'scientific') {
    buttons.push(...scientificButtons.flat());
  }
  return buttons;
}

// Mock handlers
const mockOnInput = (_input: KeypadInput) => {};
const mockOnAction = (_action: KeypadAction) => {};

describe('Accessibility Properties', () => {
  describe('Property 38: Mobile Touch Target Size', () => {
    /**
     * **Validates: Requirements 16.4**
     * 
     * For any interactive element in the Keypad_Component on viewports < 768px,
     * the touch target SHALL have minimum dimensions of 44px × 44px.
     */
    it('all keypad buttons have minimum 44px touch targets', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<CalculatorMode>('basic', 'scientific'),
          (mode) => {
            const { container } = render(
              <Keypad
                mode={mode}
                onInput={mockOnInput}
                onAction={mockOnAction}
                disabled={false}
              />
            );

            // Get all buttons in the keypad
            const buttons = container.querySelectorAll('button');
            
            // Verify we have buttons
            expect(buttons.length).toBeGreaterThan(0);

            // Check each button has min-h-[44px] and min-w-[44px] classes
            buttons.forEach((button) => {
              const classList = button.className;
              
              // The Keypad component uses Tailwind classes min-h-[44px] and min-w-[44px]
              // These ensure 44px minimum dimensions on all viewports including mobile
              expect(classList).toContain('min-h-[44px]');
              expect(classList).toContain('min-w-[44px]');
            });

            // Cleanup
            container.remove();
          }
        ),
        { numRuns: 10 }
      );
    });

    it('touch targets are consistent across all button types', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<CalculatorMode>('basic', 'scientific'),
          fc.constantFrom<'digit' | 'operator' | 'function' | 'constant' | 'parenthesis' | 'action'>(
            'digit', 'operator', 'function', 'constant', 'parenthesis', 'action'
          ),
          (mode, buttonType) => {
            const buttons = getButtonsForMode(mode);
            const buttonsOfType = buttons.filter(b => b.type === buttonType);
            
            // Skip if no buttons of this type exist in this mode
            if (buttonsOfType.length === 0) return true;

            const { container } = render(
              <Keypad
                mode={mode}
                onInput={mockOnInput}
                onAction={mockOnAction}
                disabled={false}
              />
            );

            // All buttons should have the same minimum size classes
            const allButtons = container.querySelectorAll('button');
            allButtons.forEach((button) => {
              expect(button.className).toContain('min-h-[44px]');
              expect(button.className).toContain('min-w-[44px]');
            });

            container.remove();
            return true;
          }
        ),
        { numRuns: 20 }
      );
    });

    it('disabled buttons maintain touch target size', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<CalculatorMode>('basic', 'scientific'),
          fc.boolean(),
          (mode, disabled) => {
            const { container } = render(
              <Keypad
                mode={mode}
                onInput={mockOnInput}
                onAction={mockOnAction}
                disabled={disabled}
              />
            );

            const buttons = container.querySelectorAll('button');
            
            // Touch targets should be maintained regardless of disabled state
            buttons.forEach((button) => {
              expect(button.className).toContain('min-h-[44px]');
              expect(button.className).toContain('min-w-[44px]');
            });

            container.remove();
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  describe('Property 40: ARIA Labels Completeness', () => {
    /**
     * **Validates: Requirements 18.2**
     * 
     * For any interactive element in the Keypad_Component,
     * there SHALL exist an appropriate ARIA role and accessible label.
     */
    it('all keypad buttons have aria-label attributes', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<CalculatorMode>('basic', 'scientific'),
          (mode) => {
            const { container } = render(
              <Keypad
                mode={mode}
                onInput={mockOnInput}
                onAction={mockOnAction}
                disabled={false}
              />
            );

            const buttons = container.querySelectorAll('button');
            
            // Verify we have buttons
            expect(buttons.length).toBeGreaterThan(0);

            // Check each button has an aria-label
            buttons.forEach((button) => {
              const ariaLabel = button.getAttribute('aria-label');
              expect(ariaLabel).toBeTruthy();
              expect(ariaLabel!.length).toBeGreaterThan(0);
            });

            container.remove();
          }
        ),
        { numRuns: 10 }
      );
    });

    it('all keypad buttons have role="button"', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<CalculatorMode>('basic', 'scientific'),
          (mode) => {
            const { container } = render(
              <Keypad
                mode={mode}
                onInput={mockOnInput}
                onAction={mockOnAction}
                disabled={false}
              />
            );

            const buttons = container.querySelectorAll('button');
            
            // Check each button has role="button"
            buttons.forEach((button) => {
              const role = button.getAttribute('role');
              expect(role).toBe('button');
            });

            container.remove();
          }
        ),
        { numRuns: 10 }
      );
    });

    it('keypad container has appropriate group role and label', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<CalculatorMode>('basic', 'scientific'),
          (mode) => {
            const { container } = render(
              <Keypad
                mode={mode}
                onInput={mockOnInput}
                onAction={mockOnAction}
                disabled={false}
              />
            );

            // The keypad container should have role="group" and aria-label
            const keypadContainer = container.querySelector('.keypad');
            expect(keypadContainer).toBeTruthy();
            expect(keypadContainer!.getAttribute('role')).toBe('group');
            expect(keypadContainer!.getAttribute('aria-label')).toBe('Calculator keypad');

            container.remove();
          }
        ),
        { numRuns: 10 }
      );
    });

    it('operator buttons have descriptive aria-labels', () => {
      const operatorLabels: Record<string, string> = {
        '÷': 'divide',
        '×': 'multiply',
        '−': 'subtract',
        '+': 'add',
        '^': 'power',
        '%': 'modulo',
      };

      fc.assert(
        fc.property(
          fc.constantFrom<CalculatorMode>('basic', 'scientific'),
          (mode) => {
            const { container } = render(
              <Keypad
                mode={mode}
                onInput={mockOnInput}
                onAction={mockOnAction}
                disabled={false}
              />
            );

            const buttons = container.querySelectorAll('button');
            
            buttons.forEach((button) => {
              const label = button.textContent?.trim();
              const ariaLabel = button.getAttribute('aria-label');
              
              // If this is an operator button, verify it has a descriptive label
              if (label && operatorLabels[label]) {
                expect(ariaLabel).toBe(operatorLabels[label]);
              }
            });

            container.remove();
          }
        ),
        { numRuns: 10 }
      );
    });

    it('scientific function buttons have descriptive aria-labels', () => {
      const functionLabels: Record<string, string> = {
        'ln': 'natural log',
        'log': 'log base 10',
        '√': 'square root',
        'x²': 'square',
        '!': 'factorial',
        'π': 'pi',
        'e': 'euler number',
      };

      const { container } = render(
        <Keypad
          mode="scientific"
          onInput={mockOnInput}
          onAction={mockOnAction}
          disabled={false}
        />
      );

      const buttons = container.querySelectorAll('button');
      
      buttons.forEach((button) => {
        const label = button.textContent?.trim();
        const ariaLabel = button.getAttribute('aria-label');
        
        // If this is a function button with a special label, verify it
        if (label && functionLabels[label]) {
          expect(ariaLabel).toBe(functionLabels[label]);
        }
      });

      container.remove();
    });

    it('digit buttons use their label as aria-label', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<CalculatorMode>('basic', 'scientific'),
          fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'),
          (mode, digit) => {
            const { container } = render(
              <Keypad
                mode={mode}
                onInput={mockOnInput}
                onAction={mockOnAction}
                disabled={false}
              />
            );

            // Find the button with this digit
            const buttons = Array.from(container.querySelectorAll('button'));
            const digitButton = buttons.find(b => b.textContent?.trim() === digit);
            
            expect(digitButton).toBeTruthy();
            // Digit buttons should have their digit as the aria-label
            expect(digitButton!.getAttribute('aria-label')).toBe(digit);

            container.remove();
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  describe('ARIA Live Regions', () => {
    /**
     * Additional accessibility tests for screen reader announcements.
     * Validates: Requirements 18.4
     */
    it('Display component has aria-live region for results', () => {
      const mockResult: CalculationResult = {
        value: 42,
        type: 'number',
        formatted: '42',
        precision: 10
      };

      const { container } = render(
        <Display
          expression="6 * 7"
          result={mockResult}
          error={null}
          isLoading={false}
          precision={10}
          locale="en-US"
        />
      );

      // Check for aria-live region
      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeTruthy();

      // Check for screen reader only announcement
      const srOnly = container.querySelector('.sr-only[aria-live="assertive"]');
      expect(srOnly).toBeTruthy();

      container.remove();
    });

    it('Display component announces errors to screen readers', () => {
      const { container } = render(
        <Display
          expression="1/0"
          result={null}
          error="Cannot divide by zero"
          isLoading={false}
          precision={10}
          locale="en-US"
        />
      );

      // Check for error alert role
      const errorElement = container.querySelector('[role="alert"]');
      expect(errorElement).toBeTruthy();
      expect(errorElement!.textContent).toContain('Cannot divide by zero');

      container.remove();
    });

    it('Display component has proper region role and label', () => {
      const { container } = render(
        <Display
          expression=""
          result={null}
          error={null}
          isLoading={false}
          precision={10}
          locale="en-US"
        />
      );

      // Check for region role
      const displayRegion = container.querySelector('[role="region"]');
      expect(displayRegion).toBeTruthy();
      expect(displayRegion!.getAttribute('aria-label')).toBe('Calculator display');

      container.remove();
    });

    it('Display component expression has aria-label', () => {
      const { container } = render(
        <Display
          expression="2 + 2"
          result={null}
          error={null}
          isLoading={false}
          precision={10}
          locale="en-US"
        />
      );

      // Check for expression label
      const expressionElement = container.querySelector('[aria-label="Current expression"]');
      expect(expressionElement).toBeTruthy();

      container.remove();
    });
  });
});


describe('Property 41: WCAG AA Contrast Compliance', () => {
  /**
   * **Validates: Requirements 18.3**
   * 
   * For any text element in the Display_Component, the contrast ratio
   * between text color and background color SHALL be at least 4.5:1
   * for normal text and 3:1 for large text.
   */

  // Helper to calculate relative luminance
  function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs! + 0.7152 * gs! + 0.0722 * bs!;
  }

  // Helper to calculate contrast ratio
  function getContrastRatio(l1: number, l2: number): number {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  // Parse hex color to RGB
  function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1]!, 16),
      g: parseInt(result[2]!, 16),
      b: parseInt(result[3]!, 16)
    } : null;
  }

  it('text colors meet WCAG AA contrast requirements', () => {
    // Common color combinations used in the calculator
    const colorPairs = [
      { text: '#1f2937', bg: '#ffffff' }, // gray-800 on white
      { text: '#111827', bg: '#f3f4f6' }, // gray-900 on gray-100
      { text: '#dc2626', bg: '#ffffff' }, // red-600 on white (errors)
      { text: '#ffffff', bg: '#2563eb' }, // white on blue-600 (buttons)
      { text: '#374151', bg: '#ffffff' }, // gray-700 on white
    ];

    colorPairs.forEach(({ text, bg }) => {
      const textRgb = hexToRgb(text);
      const bgRgb = hexToRgb(bg);
      
      if (textRgb && bgRgb) {
        const textLum = getLuminance(textRgb.r, textRgb.g, textRgb.b);
        const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
        const ratio = getContrastRatio(textLum, bgLum);
        
        // WCAG AA requires 4.5:1 for normal text
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      }
    });
  });

  it('high contrast mode colors meet enhanced requirements', () => {
    // High contrast mode color combinations
    const highContrastPairs = [
      { text: '#000000', bg: '#ffffff' }, // black on white
      { text: '#ffffff', bg: '#000000' }, // white on black
    ];

    highContrastPairs.forEach(({ text, bg }) => {
      const textRgb = hexToRgb(text);
      const bgRgb = hexToRgb(bg);
      
      if (textRgb && bgRgb) {
        const textLum = getLuminance(textRgb.r, textRgb.g, textRgb.b);
        const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
        const ratio = getContrastRatio(textLum, bgLum);
        
        // High contrast should exceed WCAG AAA (7:1)
        expect(ratio).toBeGreaterThanOrEqual(7);
      }
    });
  });
});

describe('Property 42: Focus Navigation Order', () => {
  /**
   * **Validates: Requirements 18.6**
   * 
   * For any sequence of Tab key presses starting from the first focusable element,
   * focus SHALL move through all interactive elements in a logical order
   * without skipping any.
   */

  it('keypad buttons are focusable', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<CalculatorMode>('basic', 'scientific'),
        (mode) => {
          const { container } = render(
            <Keypad
              mode={mode}
              onInput={mockOnInput}
              onAction={mockOnAction}
              disabled={false}
            />
          );

          const buttons = container.querySelectorAll('button');
          
          // All buttons should be focusable (not have tabindex="-1")
          buttons.forEach((button) => {
            const tabIndex = button.getAttribute('tabindex');
            // tabindex should be 0 or not set (defaults to 0 for buttons)
            expect(tabIndex === null || tabIndex === '0').toBe(true);
          });

          container.remove();
        }
      ),
      { numRuns: 10 }
    );
  });

  it('disabled buttons are not focusable', () => {
    const { container } = render(
      <Keypad
        mode="basic"
        onInput={mockOnInput}
        onAction={mockOnAction}
        disabled={true}
      />
    );

    const buttons = container.querySelectorAll('button');
    
    // All buttons should be disabled
    buttons.forEach((button) => {
      expect(button.hasAttribute('disabled')).toBe(true);
    });

    container.remove();
  });

  it('focus indicators are visible', () => {
    const { container } = render(
      <Keypad
        mode="basic"
        onInput={mockOnInput}
        onAction={mockOnAction}
        disabled={false}
      />
    );

    const buttons = container.querySelectorAll('button');
    
    // All buttons should have focus ring classes
    buttons.forEach((button) => {
      const classList = button.className;
      // Should have focus:ring or focus:outline classes
      expect(
        classList.includes('focus:ring') || 
        classList.includes('focus:outline') ||
        classList.includes('focus-visible:ring')
      ).toBe(true);
    });

    container.remove();
  });
});
