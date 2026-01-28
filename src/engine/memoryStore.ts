/**
 * Memory Store
 * 
 * Implements calculator memory operations (M+, M-, MR, MC)
 * and named memory slots with localStorage persistence.
 * Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5, 14.6
 */

import { STORAGE_KEYS } from '../types';

export interface MemoryStore {
  // Basic memory operations
  add(value: number): void;
  subtract(value: number): void;
  recall(): number;
  clear(): void;
  
  // Named slots
  setSlot(name: string, value: number): void;
  getSlot(name: string): number | undefined;
  deleteSlot(name: string): void;
  getAllSlots(): Record<string, number>;
  
  // Persistence
  persist(): void;
  restore(): void;
  
  // State
  getRegister(): number;
  hasValue(): boolean;
}

interface MemoryState {
  register: number;
  namedSlots: Record<string, number>;
}

let memoryState: MemoryState = {
  register: 0,
  namedSlots: {}
};

/**
 * Create a memory store instance
 */
export function createMemoryStore(): MemoryStore {
  return {
    /**
     * Add value to memory register (M+)
     */
    add(value: number): void {
      memoryState.register += value;
    },
    
    /**
     * Subtract value from memory register (M-)
     */
    subtract(value: number): void {
      memoryState.register -= value;
    },
    
    /**
     * Recall memory register value (MR)
     */
    recall(): number {
      return memoryState.register;
    },
    
    /**
     * Clear memory register (MC)
     */
    clear(): void {
      memoryState.register = 0;
    },
    
    /**
     * Set a named memory slot
     */
    setSlot(name: string, value: number): void {
      memoryState.namedSlots[name] = value;
    },
    
    /**
     * Get a named memory slot value
     */
    getSlot(name: string): number | undefined {
      return memoryState.namedSlots[name];
    },
    
    /**
     * Delete a named memory slot
     */
    deleteSlot(name: string): void {
      delete memoryState.namedSlots[name];
    },
    
    /**
     * Get all named memory slots
     */
    getAllSlots(): Record<string, number> {
      return { ...memoryState.namedSlots };
    },
    
    /**
     * Persist memory state to localStorage
     */
    persist(): void {
      try {
        localStorage.setItem(STORAGE_KEYS.MEMORY, JSON.stringify(memoryState));
      } catch {
        // localStorage might be unavailable or full
        console.warn('Failed to persist memory state');
      }
    },
    
    /**
     * Restore memory state from localStorage
     */
    restore(): void {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.MEMORY);
        if (stored) {
          const parsed = JSON.parse(stored) as MemoryState;
          memoryState = {
            register: parsed.register ?? 0,
            namedSlots: parsed.namedSlots ?? {}
          };
        }
      } catch {
        // Invalid JSON or localStorage unavailable
        console.warn('Failed to restore memory state');
      }
    },
    
    /**
     * Get current register value
     */
    getRegister(): number {
      return memoryState.register;
    },
    
    /**
     * Check if memory has a non-zero value
     */
    hasValue(): boolean {
      return memoryState.register !== 0;
    }
  };
}

/**
 * Reset memory store (for testing)
 */
export function resetMemoryStore(): void {
  memoryState = {
    register: 0,
    namedSlots: {}
  };
}
