/**
 * Memory System Property Tests
 * 
 * Property-based tests for memory operations and persistence.
 * 
 * **Property 34: Memory Operations Consistency**
 * **Validates: Requirements 14.1, 14.2, 14.3, 14.4**
 * 
 * **Property 35: Named Memory Slot Storage**
 * **Validates: Requirements 14.5**
 * 
 * **Property 36: Memory Persistence**
 * **Validates: Requirements 14.6**
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { createMemoryStore, resetMemoryStore } from '../../engine/memoryStore';

// Reserved names that exist on objects and should be avoided
const reservedNames = ['toString', 'valueOf', 'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', '__proto__', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__'];

// Helper to generate valid slot names
const validSlotName = fc.string({ minLength: 1, maxLength: 20 })
  .filter(s => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s))
  .filter(s => !reservedNames.includes(s));

const validSlotNameShort = fc.string({ minLength: 1, maxLength: 10 })
  .filter(s => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s))
  .filter(s => !reservedNames.includes(s));

describe('Memory System - Property Tests', () => {
  beforeEach(() => {
    resetMemoryStore();
  });

  afterEach(() => {
    resetMemoryStore();
  });

  describe('Property 34: Memory Operations Consistency', () => {
    /**
     * **Validates: Requirements 14.1, 14.2, 14.3, 14.4**
     * 
     * For any sequence of M+, M-, MR, MC operations,
     * the memory register SHALL maintain arithmetic consistency.
     */

    it('M+ adds value to memory register', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -1000, max: 1000, noNaN: true }),
          fc.float({ min: -1000, max: 1000, noNaN: true }),
          (initial, toAdd) => {
            resetMemoryStore();
            const store = createMemoryStore();
            
            // Set initial value
            store.add(initial);
            expect(store.recall()).toBeCloseTo(initial, 10);
            
            // Add another value
            store.add(toAdd);
            expect(store.recall()).toBeCloseTo(initial + toAdd, 10);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('M- subtracts value from memory register', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -1000, max: 1000, noNaN: true }),
          fc.float({ min: -1000, max: 1000, noNaN: true }),
          (initial, toSubtract) => {
            resetMemoryStore();
            const store = createMemoryStore();
            
            // Set initial value
            store.add(initial);
            
            // Subtract value
            store.subtract(toSubtract);
            expect(store.recall()).toBeCloseTo(initial - toSubtract, 10);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('MC clears memory register to zero', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -1000, max: 1000, noNaN: true }),
          (value) => {
            resetMemoryStore();
            const store = createMemoryStore();
            
            // Add some value
            store.add(value);
            expect(store.hasValue()).toBe(value !== 0);
            
            // Clear memory
            store.clear();
            expect(store.recall()).toBe(0);
            expect(store.hasValue()).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('MR returns current memory value without modifying it', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -1000, max: 1000, noNaN: true }),
          fc.integer({ min: 1, max: 10 }),
          (value, recallCount) => {
            resetMemoryStore();
            const store = createMemoryStore();
            
            store.add(value);
            
            // Multiple recalls should return the same value
            for (let i = 0; i < recallCount; i++) {
              expect(store.recall()).toBeCloseTo(value, 10);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('sequence of M+ and M- operations maintains arithmetic consistency', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              operation: fc.constantFrom('add', 'subtract'),
              value: fc.float({ min: -100, max: 100, noNaN: true })
            }),
            { minLength: 1, maxLength: 20 }
          ),
          (operations) => {
            resetMemoryStore();
            const store = createMemoryStore();
            
            let expected = 0;
            
            for (const op of operations) {
              if (op.operation === 'add') {
                store.add(op.value);
                expected += op.value;
              } else {
                store.subtract(op.value);
                expected -= op.value;
              }
            }
            
            expect(store.recall()).toBeCloseTo(expected, 8);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('hasValue returns true only when register is non-zero', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -1000, max: 1000, noNaN: true }),
          (value) => {
            resetMemoryStore();
            const store = createMemoryStore();
            
            expect(store.hasValue()).toBe(false);
            
            store.add(value);
            expect(store.hasValue()).toBe(value !== 0);
            
            store.clear();
            expect(store.hasValue()).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 35: Named Memory Slot Storage', () => {
    /**
     * **Validates: Requirements 14.5**
     * 
     * For any named memory slot, storing a value and retrieving it
     * SHALL return the same value.
     */

    it('setSlot and getSlot are consistent', () => {
      fc.assert(
        fc.property(
          validSlotName,
          fc.float({ min: -1000, max: 1000, noNaN: true }),
          (name, value) => {
            resetMemoryStore();
            const store = createMemoryStore();
            
            store.setSlot(name, value);
            expect(store.getSlot(name)).toBeCloseTo(value, 10);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('multiple named slots are independent', () => {
      fc.assert(
        fc.property(
          fc.uniqueArray(validSlotNameShort, { minLength: 2, maxLength: 5 }),
          fc.array(fc.float({ min: -100, max: 100, noNaN: true }), { minLength: 2, maxLength: 5 }),
          (names, values) => {
            resetMemoryStore();
            const store = createMemoryStore();
            
            // Set all slots
            const minLength = Math.min(names.length, values.length);
            for (let i = 0; i < minLength; i++) {
              store.setSlot(names[i]!, values[i]!);
            }
            
            // Verify all slots independently
            for (let i = 0; i < minLength; i++) {
              expect(store.getSlot(names[i]!)).toBeCloseTo(values[i]!, 10);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('deleteSlot removes only the specified slot', () => {
      fc.assert(
        fc.property(
          fc.uniqueArray(validSlotNameShort, { minLength: 2, maxLength: 5 }),
          fc.array(fc.float({ min: -100, max: 100, noNaN: true }), { minLength: 2, maxLength: 5 }),
          fc.integer({ min: 0, max: 4 }),
          (names, values, deleteIndex) => {
            resetMemoryStore();
            const store = createMemoryStore();
            
            const minLength = Math.min(names.length, values.length);
            if (minLength < 2) return true;
            
            const actualDeleteIndex = deleteIndex % minLength;
            
            // Set all slots
            for (let i = 0; i < minLength; i++) {
              store.setSlot(names[i]!, values[i]!);
            }
            
            // Delete one slot
            store.deleteSlot(names[actualDeleteIndex]!);
            
            // Verify deleted slot is gone
            expect(store.getSlot(names[actualDeleteIndex]!)).toBeUndefined();
            
            // Verify other slots are intact
            for (let i = 0; i < minLength; i++) {
              if (i !== actualDeleteIndex) {
                expect(store.getSlot(names[i]!)).toBeCloseTo(values[i]!, 10);
              }
            }
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('getAllSlots returns all stored slots', () => {
      fc.assert(
        fc.property(
          fc.uniqueArray(validSlotNameShort, { minLength: 1, maxLength: 5 }),
          fc.array(fc.float({ min: -100, max: 100, noNaN: true }), { minLength: 1, maxLength: 5 }),
          (names, values) => {
            resetMemoryStore();
            const store = createMemoryStore();
            
            const minLength = Math.min(names.length, values.length);
            
            // Set all slots
            for (let i = 0; i < minLength; i++) {
              store.setSlot(names[i]!, values[i]!);
            }
            
            // Get all slots
            const allSlots = store.getAllSlots();
            
            // Verify all slots are present
            expect(Object.keys(allSlots).length).toBe(minLength);
            for (let i = 0; i < minLength; i++) {
              expect(allSlots[names[i]!]).toBeCloseTo(values[i]!, 10);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('getSlot returns undefined for non-existent slots', () => {
      fc.assert(
        fc.property(
          validSlotName,
          (name) => {
            resetMemoryStore();
            const store = createMemoryStore();
            
            expect(store.getSlot(name)).toBeUndefined();
          }
        ),
        { numRuns: 50 }
      );
    });

    it('overwriting a slot updates its value', () => {
      fc.assert(
        fc.property(
          validSlotName,
          fc.float({ min: -1000, max: 1000, noNaN: true }),
          fc.float({ min: -1000, max: 1000, noNaN: true }),
          (name, value1, value2) => {
            resetMemoryStore();
            const store = createMemoryStore();
            
            store.setSlot(name, value1);
            expect(store.getSlot(name)).toBeCloseTo(value1, 10);
            
            store.setSlot(name, value2);
            expect(store.getSlot(name)).toBeCloseTo(value2, 10);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 36: Memory Persistence', () => {
    /**
     * **Validates: Requirements 14.6**
     * 
     * Memory state SHALL persist across page reloads via localStorage.
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

    it('persist and restore maintain register value', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -1000, max: 1000, noNaN: true }),
          (value) => {
            resetMemoryStore();
            const store1 = createMemoryStore();
            
            // Add value and persist
            store1.add(value);
            store1.persist();
            
            // Reset and restore
            resetMemoryStore();
            const store2 = createMemoryStore();
            store2.restore();
            
            expect(store2.recall()).toBeCloseTo(value, 10);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('persist and restore maintain named slots', () => {
      fc.assert(
        fc.property(
          fc.uniqueArray(validSlotNameShort, { minLength: 1, maxLength: 5 }),
          fc.array(fc.float({ min: -100, max: 100, noNaN: true }), { minLength: 1, maxLength: 5 }),
          (names, values) => {
            resetMemoryStore();
            const store1 = createMemoryStore();
            
            const minLength = Math.min(names.length, values.length);
            
            // Set slots and persist
            for (let i = 0; i < minLength; i++) {
              store1.setSlot(names[i]!, values[i]!);
            }
            store1.persist();
            
            // Reset and restore
            resetMemoryStore();
            const store2 = createMemoryStore();
            store2.restore();
            
            // Verify all slots are restored
            for (let i = 0; i < minLength; i++) {
              expect(store2.getSlot(names[i]!)).toBeCloseTo(values[i]!, 10);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('persist and restore maintain both register and slots', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -1000, max: 1000, noNaN: true }),
          validSlotNameShort,
          fc.float({ min: -1000, max: 1000, noNaN: true }),
          (registerValue, slotName, slotValue) => {
            resetMemoryStore();
            const store1 = createMemoryStore();
            
            // Set register and slot
            store1.add(registerValue);
            store1.setSlot(slotName, slotValue);
            store1.persist();
            
            // Reset and restore
            resetMemoryStore();
            const store2 = createMemoryStore();
            store2.restore();
            
            // Verify both are restored
            expect(store2.recall()).toBeCloseTo(registerValue, 10);
            expect(store2.getSlot(slotName)).toBeCloseTo(slotValue, 10);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('restore handles missing localStorage data gracefully', () => {
      resetMemoryStore();
      const store = createMemoryStore();
      
      // Restore with no stored data should not throw
      expect(() => store.restore()).not.toThrow();
      expect(store.recall()).toBe(0);
      expect(Object.keys(store.getAllSlots()).length).toBe(0);
    });

    it('restore handles invalid JSON gracefully', () => {
      mockStorage['calc_memory'] = 'invalid json {{{';
      
      resetMemoryStore();
      const store = createMemoryStore();
      
      // Restore with invalid JSON should not throw
      expect(() => store.restore()).not.toThrow();
      expect(store.recall()).toBe(0);
    });
  });
});
