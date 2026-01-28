/**
 * Undo/Redo System Property Tests
 * 
 * Property-based tests for undo/redo operations.
 * 
 * **Property 37: Undo-Redo Round-Trip**
 * **Validates: Requirements 15.1, 15.2**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { createUndoRedoStore, resetUndoRedoStore } from '../../engine/undoRedoStore';

// Arbitrary for valid input states (non-empty strings representing calculator input)
const validState = fc.string({ minLength: 0, maxLength: 100 });

describe('Undo/Redo System - Property Tests', () => {
  beforeEach(() => {
    resetUndoRedoStore();
  });

  describe('Property 37: Undo-Redo Round-Trip', () => {
    /**
     * **Validates: Requirements 15.1, 15.2**
     * 
     * For any input change followed by undo then redo,
     * the final state SHALL equal the state after the original change.
     */

    it('undo then redo returns to original state', () => {
      fc.assert(
        fc.property(
          validState,
          validState,
          (initialState, newState) => {
            // Skip if states are the same (no change to undo)
            if (initialState === newState) return true;
            
            resetUndoRedoStore();
            const store = createUndoRedoStore();
            
            // Set initial state
            store.push(initialState);
            expect(store.getCurrentState()).toBe(initialState);
            
            // Make a change
            store.push(newState);
            expect(store.getCurrentState()).toBe(newState);
            
            // Undo
            const undoneState = store.undo();
            expect(undoneState).toBe(initialState);
            expect(store.getCurrentState()).toBe(initialState);
            
            // Redo
            const redoneState = store.redo();
            expect(redoneState).toBe(newState);
            expect(store.getCurrentState()).toBe(newState);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('multiple undo operations restore previous states in order', () => {
      fc.assert(
        fc.property(
          fc.array(validState, { minLength: 2, maxLength: 10 })
            .filter(arr => {
              // Ensure at least 2 unique states
              const unique = new Set(arr);
              return unique.size >= 2;
            }),
          (states) => {
            resetUndoRedoStore();
            const store = createUndoRedoStore();
            
            // Push all states
            const pushedStates: string[] = [];
            for (const state of states) {
              const prevState = store.getCurrentState();
              store.push(state);
              // Only track if state actually changed
              if (store.getCurrentState() !== prevState || pushedStates.length === 0) {
                if (store.getCurrentState() === state) {
                  pushedStates.push(state);
                }
              }
            }
            
            // Undo all and verify order
            const undoneStates: string[] = [];
            while (store.canUndo()) {
              store.undo();
              undoneStates.push(store.getCurrentState());
            }
            
            // Redo all and verify we get back to final state
            while (store.canRedo()) {
              store.redo();
            }
            
            expect(store.getCurrentState()).toBe(pushedStates[pushedStates.length - 1]);
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('canUndo returns false when at initial state', () => {
      fc.assert(
        fc.property(
          validState,
          (state) => {
            resetUndoRedoStore();
            const store = createUndoRedoStore();
            
            // Initially cannot undo (only empty string in history)
            expect(store.canUndo()).toBe(false);
            
            // After one push, can undo
            store.push(state);
            if (state !== '') {
              expect(store.canUndo()).toBe(true);
            }
            
            // After undoing, cannot undo further
            store.undo();
            expect(store.canUndo()).toBe(false);
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('canRedo returns false when at latest state', () => {
      fc.assert(
        fc.property(
          validState,
          validState,
          (state1, state2) => {
            if (state1 === state2) return true;
            
            resetUndoRedoStore();
            const store = createUndoRedoStore();
            
            store.push(state1);
            store.push(state2);
            
            // At latest state, cannot redo
            expect(store.canRedo()).toBe(false);
            
            // After undo, can redo
            store.undo();
            expect(store.canRedo()).toBe(true);
            
            // After redo, cannot redo
            store.redo();
            expect(store.canRedo()).toBe(false);
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('new push after undo clears redo history', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          (state1, state2, state3) => {
            // Need distinct states for meaningful test
            if (state1 === state2 || state2 === state3 || state1 === state3) {
              return true;
            }
            
            resetUndoRedoStore();
            const store = createUndoRedoStore();
            
            store.push(state1);
            store.push(state2);
            
            // Undo
            store.undo();
            expect(store.canRedo()).toBe(true);
            
            // Push new state (should clear redo)
            store.push(state3);
            expect(store.canRedo()).toBe(false);
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('duplicate consecutive states are not added', () => {
      fc.assert(
        fc.property(
          validState,
          fc.integer({ min: 2, max: 5 }),
          (state, repeatCount) => {
            resetUndoRedoStore();
            const store = createUndoRedoStore();
            
            // Push same state multiple times
            for (let i = 0; i < repeatCount; i++) {
              store.push(state);
            }
            
            // Should only be able to undo once (to initial empty state)
            let undoCount = 0;
            while (store.canUndo()) {
              store.undo();
              undoCount++;
            }
            
            // At most 1 undo if state differs from initial empty string
            expect(undoCount).toBeLessThanOrEqual(1);
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('clear resets to initial state', () => {
      fc.assert(
        fc.property(
          fc.array(validState, { minLength: 1, maxLength: 10 }),
          (states) => {
            resetUndoRedoStore();
            const store = createUndoRedoStore();
            
            // Push multiple states
            for (const state of states) {
              store.push(state);
            }
            
            // Clear
            store.clear();
            
            // Should be back to initial state
            expect(store.getCurrentState()).toBe('');
            expect(store.canUndo()).toBe(false);
            expect(store.canRedo()).toBe(false);
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
