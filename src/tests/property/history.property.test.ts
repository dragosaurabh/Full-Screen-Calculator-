/**
 * History System Property Tests
 * 
 * Property-based tests for history operations and persistence.
 * 
 * **Property 31: History Entry Creation**
 * **Validates: Requirements 13.1**
 * 
 * **Property 32: History Clear Preserves Pinned**
 * **Validates: Requirements 13.4**
 * 
 * **Property 33: History Persistence**
 * **Validates: Requirements 13.5**
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { createHistoryStore, resetHistoryStore } from '../../engine/historyStore';
import type { CalculationResult, CalculatorMode } from '../../types';

// Helper to create a valid calculation result
function createResult(value: number): CalculationResult {
  return {
    value,
    type: 'number',
    formatted: String(value),
    precision: 10
  };
}

// Arbitrary for calculator modes
const calculatorMode = fc.constantFrom<CalculatorMode>(
  'basic', 'scientific', 'programmer', 'graphing', 'matrix',
  'complex', 'statistics', 'financial', 'converter'
);

// Arbitrary for valid expressions
const validExpression = fc.string({ minLength: 1, maxLength: 50 })
  .filter(s => s.trim().length > 0);

describe('History System - Property Tests', () => {
  beforeEach(() => {
    resetHistoryStore();
  });

  afterEach(() => {
    resetHistoryStore();
  });

  describe('Property 31: History Entry Creation', () => {
    /**
     * **Validates: Requirements 13.1**
     * 
     * For any calculation, adding it to history SHALL create an entry
     * with the correct expression, result, mode, and timestamp.
     */

    it('addEntry creates entry with correct data', () => {
      fc.assert(
        fc.property(
          validExpression,
          fc.float({ min: -1000, max: 1000, noNaN: true }),
          calculatorMode,
          (expression, value, mode) => {
            resetHistoryStore();
            const store = createHistoryStore();
            
            const beforeTime = Date.now();
            const result = createResult(value);
            const entry = store.addEntry(expression, result, mode);
            const afterTime = Date.now();
            
            // Verify entry data
            expect(entry.expression).toBe(expression);
            expect(entry.result.value).toBe(value);
            expect(entry.mode).toBe(mode);
            expect(entry.pinned).toBe(false);
            expect(entry.timestamp).toBeGreaterThanOrEqual(beforeTime);
            expect(entry.timestamp).toBeLessThanOrEqual(afterTime);
            expect(entry.id).toBeTruthy();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('entries are retrievable by ID', () => {
      fc.assert(
        fc.property(
          validExpression,
          fc.float({ min: -1000, max: 1000, noNaN: true }),
          calculatorMode,
          (expression, value, mode) => {
            resetHistoryStore();
            const store = createHistoryStore();
            
            const result = createResult(value);
            const entry = store.addEntry(expression, result, mode);
            
            const retrieved = store.getEntry(entry.id);
            expect(retrieved).toBeDefined();
            expect(retrieved?.id).toBe(entry.id);
            expect(retrieved?.expression).toBe(expression);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('entries are ordered most recent first', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              expression: validExpression,
              value: fc.float({ min: -100, max: 100, noNaN: true }),
              mode: calculatorMode
            }),
            { minLength: 2, maxLength: 10 }
          ),
          (entries) => {
            resetHistoryStore();
            const store = createHistoryStore();
            
            // Add entries
            const entryIds: string[] = [];
            for (const e of entries) {
              const entry = store.addEntry(e.expression, createResult(e.value), e.mode);
              entryIds.push(entry.id);
            }
            
            // Get all entries
            const allEntries = store.getAllEntries();
            
            // Verify order (most recent first)
            expect(allEntries.length).toBe(entries.length);
            for (let i = 0; i < allEntries.length - 1; i++) {
              expect(allEntries[i]!.timestamp).toBeGreaterThanOrEqual(allEntries[i + 1]!.timestamp);
            }
            
            // First entry should be the last added
            expect(allEntries[0]!.id).toBe(entryIds[entryIds.length - 1]);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('each entry has a unique ID', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 2, max: 20 }),
          (count) => {
            resetHistoryStore();
            const store = createHistoryStore();
            
            const ids = new Set<string>();
            
            for (let i = 0; i < count; i++) {
              const entry = store.addEntry(`expr${i}`, createResult(i), 'basic');
              expect(ids.has(entry.id)).toBe(false);
              ids.add(entry.id);
            }
            
            expect(ids.size).toBe(count);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('getCount returns correct number of entries', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 20 }),
          (count) => {
            resetHistoryStore();
            const store = createHistoryStore();
            
            for (let i = 0; i < count; i++) {
              store.addEntry(`expr${i}`, createResult(i), 'basic');
            }
            
            expect(store.getCount()).toBe(count);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 32: History Clear Preserves Pinned', () => {
    /**
     * **Validates: Requirements 13.4**
     * 
     * When clearing history, pinned entries SHALL be preserved
     * while non-pinned entries are removed.
     */

    it('clear removes only non-pinned entries', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              expression: validExpression,
              value: fc.float({ min: -100, max: 100, noNaN: true }),
              pinned: fc.boolean()
            }),
            { minLength: 1, maxLength: 20 }
          ),
          (entries) => {
            resetHistoryStore();
            const store = createHistoryStore();
            
            // Add entries and pin some
            for (const e of entries) {
              const entry = store.addEntry(e.expression, createResult(e.value), 'basic');
              if (e.pinned) {
                store.togglePin(entry.id);
              }
            }
            
            const pinnedCount = entries.filter(e => e.pinned).length;
            
            // Clear non-pinned
            store.clear();
            
            // Verify only pinned remain
            const remaining = store.getAllEntries();
            expect(remaining.length).toBe(pinnedCount);
            
            // All remaining should be pinned
            for (const entry of remaining) {
              expect(entry.pinned).toBe(true);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('clearAll removes all entries including pinned', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              expression: validExpression,
              value: fc.float({ min: -100, max: 100, noNaN: true }),
              pinned: fc.boolean()
            }),
            { minLength: 1, maxLength: 20 }
          ),
          (entries) => {
            resetHistoryStore();
            const store = createHistoryStore();
            
            // Add entries and pin some
            for (const e of entries) {
              const entry = store.addEntry(e.expression, createResult(e.value), 'basic');
              if (e.pinned) {
                store.togglePin(entry.id);
              }
            }
            
            // Clear all
            store.clearAll();
            
            // Verify all are removed
            expect(store.getAllEntries().length).toBe(0);
            expect(store.getCount()).toBe(0);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('togglePin correctly toggles pin status', () => {
      fc.assert(
        fc.property(
          validExpression,
          fc.float({ min: -100, max: 100, noNaN: true }),
          fc.integer({ min: 1, max: 10 }),
          (expression, value, toggleCount) => {
            resetHistoryStore();
            const store = createHistoryStore();
            
            const entry = store.addEntry(expression, createResult(value), 'basic');
            expect(entry.pinned).toBe(false);
            
            // Toggle multiple times
            for (let i = 0; i < toggleCount; i++) {
              store.togglePin(entry.id);
              const retrieved = store.getEntry(entry.id);
              expect(retrieved?.pinned).toBe(i % 2 === 0);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('getPinnedEntries returns only pinned entries', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              expression: validExpression,
              value: fc.float({ min: -100, max: 100, noNaN: true }),
              pinned: fc.boolean()
            }),
            { minLength: 1, maxLength: 20 }
          ),
          (entries) => {
            resetHistoryStore();
            const store = createHistoryStore();
            
            // Add entries and pin some
            for (const e of entries) {
              const entry = store.addEntry(e.expression, createResult(e.value), 'basic');
              if (e.pinned) {
                store.togglePin(entry.id);
              }
            }
            
            const pinnedCount = entries.filter(e => e.pinned).length;
            const pinnedEntries = store.getPinnedEntries();
            
            expect(pinnedEntries.length).toBe(pinnedCount);
            for (const entry of pinnedEntries) {
              expect(entry.pinned).toBe(true);
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 33: History Persistence', () => {
    /**
     * **Validates: Requirements 13.5**
     * 
     * History state SHALL persist across page reloads via localStorage.
     */

    // Mock localStorage for persistence tests
    let mockStorage: Record<string, string> = {};

    beforeEach(() => {
      mockStorage = {};
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
        mockStorage[key] = value;
      });
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
        return mockStorage[key] ?? null;
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('persist and restore maintain all entries', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              expression: validExpression,
              value: fc.float({ min: -100, max: 100, noNaN: true }),
              mode: calculatorMode
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (entries) => {
            resetHistoryStore();
            const store1 = createHistoryStore();
            
            // Add entries
            const addedEntries = entries.map(e => 
              store1.addEntry(e.expression, createResult(e.value), e.mode)
            );
            
            // Persist
            store1.persist();
            
            // Reset and restore
            resetHistoryStore();
            const store2 = createHistoryStore();
            store2.restore();
            
            // Verify all entries are restored
            const restored = store2.getAllEntries();
            expect(restored.length).toBe(entries.length);
            
            // Verify each entry
            for (const original of addedEntries) {
              const found = restored.find(e => e.id === original.id);
              expect(found).toBeDefined();
              expect(found?.expression).toBe(original.expression);
              expect(found?.mode).toBe(original.mode);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('persist and restore maintain pin status', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              expression: validExpression,
              value: fc.float({ min: -100, max: 100, noNaN: true }),
              pinned: fc.boolean()
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (entries) => {
            resetHistoryStore();
            const store1 = createHistoryStore();
            
            // Add entries and pin some
            const addedEntries = entries.map(e => {
              const entry = store1.addEntry(e.expression, createResult(e.value), 'basic');
              if (e.pinned) {
                store1.togglePin(entry.id);
              }
              return { id: entry.id, pinned: e.pinned };
            });
            
            // Persist
            store1.persist();
            
            // Reset and restore
            resetHistoryStore();
            const store2 = createHistoryStore();
            store2.restore();
            
            // Verify pin status is preserved
            for (const original of addedEntries) {
              const found = store2.getEntry(original.id);
              expect(found?.pinned).toBe(original.pinned);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('restore handles missing localStorage data gracefully', () => {
      resetHistoryStore();
      const store = createHistoryStore();
      
      // Restore with no stored data should not throw
      expect(() => store.restore()).not.toThrow();
      expect(store.getAllEntries().length).toBe(0);
    });

    it('restore handles invalid JSON gracefully', () => {
      mockStorage['calc_history'] = 'invalid json {{{';
      
      resetHistoryStore();
      const store = createHistoryStore();
      
      // Restore with invalid JSON should not throw
      expect(() => store.restore()).not.toThrow();
      expect(store.getAllEntries().length).toBe(0);
    });

    it('restore handles non-array data gracefully', () => {
      mockStorage['calc_history'] = JSON.stringify({ not: 'an array' });
      
      resetHistoryStore();
      const store = createHistoryStore();
      
      // Restore with non-array should not throw
      expect(() => store.restore()).not.toThrow();
      expect(store.getAllEntries().length).toBe(0);
    });
  });
});
