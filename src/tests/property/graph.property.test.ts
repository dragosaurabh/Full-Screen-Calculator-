/**
 * Graph System Property Tests
 * 
 * Property-based tests for graph functionality.
 * 
 * **Property 8: Graph Series Color Uniqueness**
 * **Validates: Requirements 4.2**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { GraphFunction } from '../../types';

// Series colors from GraphCanvas
const SERIES_COLORS = [
  '#2563eb', // blue
  '#dc2626', // red
  '#16a34a', // green
  '#9333ea', // purple
  '#ea580c', // orange
  '#0891b2', // cyan
  '#be185d', // pink
  '#65a30d', // lime
  '#7c3aed', // violet
  '#0d9488', // teal
];

// Function to assign colors to graph functions (mirrors GraphCanvas logic)
function assignColors(functions: GraphFunction[]): string[] {
  return functions.map((fn, index) => 
    fn.color || SERIES_COLORS[index % SERIES_COLORS.length] || '#2563eb'
  );
}

// Arbitrary for valid function expressions
const validExpression = fc.constantFrom(
  'x',
  'x^2',
  'sin(x)',
  'cos(x)',
  '2*x + 1',
  'x^3 - x',
  'sqrt(abs(x))',
  'exp(-x^2)',
  'log(abs(x) + 1)',
  'tan(x)'
);

// Helper to generate hex color
const hexChar = fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');
const hexColor = fc.tuple(hexChar, hexChar, hexChar, hexChar, hexChar, hexChar)
  .map(chars => `#${chars.join('')}`);

// Arbitrary for graph function - use oneof to either include or omit color
const graphFunctionWithColor = fc.record({
  id: fc.uuid(),
  expression: validExpression,
  color: hexColor,
  visible: fc.boolean(),
  type: fc.constant('cartesian' as const),
});

const graphFunctionWithoutColor = fc.record({
  id: fc.uuid(),
  expression: validExpression,
  visible: fc.boolean(),
  type: fc.constant('cartesian' as const),
});

const graphFunction = fc.oneof(graphFunctionWithColor, graphFunctionWithoutColor) as fc.Arbitrary<GraphFunction>;

describe('Graph System - Property Tests', () => {
  describe('Property 8: Graph Series Color Uniqueness', () => {
    /**
     * **Validates: Requirements 4.2**
     * 
     * For any set of graph functions added to the Graph_Canvas,
     * each function SHALL be assigned a distinct color that differs
     * from all other functions in the set.
     */

    it('functions without custom colors get unique colors (up to palette size)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: SERIES_COLORS.length }),
          (count) => {
            // Create functions without custom colors (omit color property)
            const functions: GraphFunction[] = Array.from({ length: count }, (_, i) => ({
              id: `fn_${i}`,
              expression: `x^${i + 1}`,
              visible: true,
              type: 'cartesian' as const,
            }));
            
            const colors = assignColors(functions);
            const uniqueColors = new Set(colors);
            
            // All colors should be unique when count <= palette size
            expect(uniqueColors.size).toBe(count);
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('custom colors are preserved', () => {
      fc.assert(
        fc.property(
          hexColor,
          validExpression,
          (customColor, expression) => {
            const functions: GraphFunction[] = [{
              id: 'fn_1',
              expression,
              color: customColor,
              visible: true,
              type: 'cartesian' as const,
            }];
            
            const colors = assignColors(functions);
            
            expect(colors[0]).toBe(customColor);
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('mixed custom and auto colors work correctly', () => {
      fc.assert(
        fc.property(
          fc.array(graphFunction, { minLength: 2, maxLength: 8 }),
          (functions) => {
            const colors = assignColors(functions);
            
            // Each function should have a color
            expect(colors.length).toBe(functions.length);
            
            // Custom colors should be preserved
            functions.forEach((fn, i) => {
              if (fn.color) {
                expect(colors[i]).toBe(fn.color);
              }
            });
            
            // All colors should be valid hex colors
            colors.forEach(color => {
              expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
            });
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('colors cycle when more functions than palette colors', () => {
      const count = SERIES_COLORS.length + 3;
      // Create functions without custom colors (omit color property)
      const functions: GraphFunction[] = Array.from({ length: count }, (_, i) => ({
        id: `fn_${i}`,
        expression: `x^${i + 1}`,
        visible: true,
        type: 'cartesian' as const,
      }));
      
      const colors = assignColors(functions);
      
      // Colors should cycle
      expect(colors[0]).toBe(colors[SERIES_COLORS.length]);
      expect(colors[1]).toBe(colors[SERIES_COLORS.length + 1]);
      expect(colors[2]).toBe(colors[SERIES_COLORS.length + 2]);
    });

    it('empty function list returns empty colors', () => {
      const functions: GraphFunction[] = [];
      const colors = assignColors(functions);
      
      expect(colors).toEqual([]);
    });

    it('all palette colors are valid hex colors', () => {
      SERIES_COLORS.forEach(color => {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    it('palette has at least 5 distinct colors', () => {
      const uniqueColors = new Set(SERIES_COLORS);
      expect(uniqueColors.size).toBeGreaterThanOrEqual(5);
    });
  });
});
