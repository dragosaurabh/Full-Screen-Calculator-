/**
 * Persistence Property Tests
 * 
 * Property-based tests for data persistence.
 * 
 * **Property 26: Variable Assignment Persistence**
 * **Validates: Requirements 10.4**
 * 
 * **Property 27: Custom Function Evaluation**
 * **Validates: Requirements 10.5**
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { createVariableStore, resetVariableStore } from '../../engine/variableStore';
import { createFunctionStore, resetFunctionStore } from '../../engine/functionStore';
import { evaluate, createDefaultContext } from '../../engine/evaluator';
import { parse } from '../../engine/parser';

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('Persistence Properties', () => {
  beforeEach(() => {
    localStorageMock.clear();
    resetVariableStore();
    resetFunctionStore();
  });

  afterEach(() => {
    localStorageMock.clear();
    resetVariableStore();
    resetFunctionStore();
  });

  describe('Property 26: Variable Assignment Persistence', () => {
    it('variables can be stored and retrieved', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 10 }).filter(s => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s) && !['pi', 'e', 'phi', 'tau'].includes(s.toLowerCase())),
          fc.float({ min: -1000, max: 1000, noNaN: true, noDefaultInfinity: true }),
          (name, value) => {
            const store = createVariableStore();
            store.setVariable(name, value);
            expect(store.getVariable(name)).toBe(value);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('variables persist to localStorage and can be restored', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 10 }).filter(s => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s) && !['pi', 'e', 'phi', 'tau'].includes(s.toLowerCase())),
          fc.float({ min: -1000, max: 1000, noNaN: true, noDefaultInfinity: true }),
          (name, value) => {
            // Create store, set variable, persist
            const store1 = createVariableStore();
            store1.setVariable(name, value);
            store1.persist();

            // Create new store, restore from localStorage
            const store2 = createVariableStore();
            store2.restore();
            
            // Handle -0 vs 0 case
            const restored = store2.getVariable(name);
            if (value === 0) {
              expect(restored === 0 || Object.is(restored, -0)).toBe(true);
            } else {
              expect(restored).toBe(value);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('multiple variables persist correctly', () => {
      const store1 = createVariableStore();
      store1.setVariable('x', 10);
      store1.setVariable('y', 20);
      store1.setVariable('z', 30);
      store1.persist();

      const store2 = createVariableStore();
      store2.restore();
      
      expect(store2.getVariable('x')).toBe(10);
      expect(store2.getVariable('y')).toBe(20);
      expect(store2.getVariable('z')).toBe(30);
    });

    it('variables can be used in expressions after assignment', () => {
      const store = createVariableStore();
      store.setVariable('x', 5);
      store.setVariable('y', 3);

      const ctx = createDefaultContext();
      ctx.variables = store.getAllVariables();

      const ast = parse('x + y * 2');
      const result = evaluate(ast, ctx);
      
      expect(result).toBe(11); // 5 + 3 * 2 = 11
    });
  });

  describe('Property 27: Custom Function Evaluation', () => {
    it('custom functions can be defined and retrieved', () => {
      const store = createFunctionStore();
      store.defineFunction('double', ['x'], 'x * 2');
      
      const fn = store.getFunction('double');
      expect(fn).toBeDefined();
      expect(fn?.name).toBe('double');
      expect(fn?.params).toEqual(['x']);
      expect(fn?.bodyExpr).toBe('x * 2');
    });

    it('custom functions persist to localStorage and can be restored', () => {
      const store1 = createFunctionStore();
      store1.defineFunction('square', ['n'], 'n * n');
      store1.persist();

      const store2 = createFunctionStore();
      store2.restore();
      
      const fn = store2.getFunction('square');
      expect(fn).toBeDefined();
      expect(fn?.name).toBe('square');
      expect(fn?.params).toEqual(['n']);
      expect(fn?.bodyExpr).toBe('n * n');
    });

    it('custom functions evaluate correctly with arguments', () => {
      const store = createFunctionStore();
      store.defineFunction('add', ['a', 'b'], 'a + b');
      
      const fn = store.getFunction('add');
      expect(fn).toBeDefined();
      
      // Evaluate the function body with substituted parameters
      const ctx = createDefaultContext();
      ctx.variables.set('a', 10);
      ctx.variables.set('b', 5);
      
      const result = evaluate(fn!.body!, ctx);
      expect(result).toBe(15);
    });

    it('multiple custom functions persist correctly', () => {
      const store1 = createFunctionStore();
      store1.defineFunction('f', ['x'], 'x + 1');
      store1.defineFunction('g', ['x'], 'x * 2');
      store1.defineFunction('h', ['x', 'y'], 'x + y');
      store1.persist();

      const store2 = createFunctionStore();
      store2.restore();
      
      expect(store2.getFunction('f')).toBeDefined();
      expect(store2.getFunction('g')).toBeDefined();
      expect(store2.getFunction('h')).toBeDefined();
      expect(store2.getFunction('h')?.params).toEqual(['x', 'y']);
    });
  });

  describe('Property 33: History Persistence', () => {
    it.todo('history can be reconstructed after page reload');
  });

  describe('Property 36: Memory Persistence', () => {
    it.todo('memory can be reconstructed after page reload');
  });

  describe('Property 44: Settings Persistence', () => {
    it.todo('settings can be reconstructed after page reload');
  });

  describe('Property 47: Data Import Restoration', () => {
    it.todo('imported data restores all state');
  });
});
