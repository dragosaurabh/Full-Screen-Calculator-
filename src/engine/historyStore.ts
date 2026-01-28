/**
 * History Store
 * 
 * Implements calculation history with timestamps, pinning,
 * and localStorage persistence.
 * Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5
 */

import type { HistoryEntry, CalculationResult, CalculatorMode } from '../types';
import { STORAGE_KEYS } from '../types';

export interface HistoryStore {
  // Entry management
  addEntry(expression: string, result: CalculationResult, mode: CalculatorMode): HistoryEntry;
  getEntry(id: string): HistoryEntry | undefined;
  getAllEntries(): HistoryEntry[];
  removeEntry(id: string): void;
  
  // Pinning
  togglePin(id: string): void;
  getPinnedEntries(): HistoryEntry[];
  
  // Clearing
  clear(): void; // Clears non-pinned entries
  clearAll(): void; // Clears all entries including pinned
  
  // Persistence
  persist(): void;
  restore(): void;
  
  // State
  getCount(): number;
}

let historyEntries: HistoryEntry[] = [];

/**
 * Generate a unique ID for history entries
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a history store instance
 */
export function createHistoryStore(): HistoryStore {
  return {
    /**
     * Add a new history entry
     */
    addEntry(expression: string, result: CalculationResult, mode: CalculatorMode): HistoryEntry {
      const entry: HistoryEntry = {
        id: generateId(),
        expression,
        result,
        mode,
        timestamp: Date.now(),
        pinned: false
      };
      
      // Add to beginning of array (most recent first)
      historyEntries.unshift(entry);
      
      // Limit history to 100 entries (keep pinned entries)
      if (historyEntries.length > 100) {
        const pinnedCount = historyEntries.filter(e => e.pinned).length;
        const maxUnpinned = 100 - pinnedCount;
        let unpinnedCount = 0;
        
        historyEntries = historyEntries.filter(e => {
          if (e.pinned) return true;
          unpinnedCount++;
          return unpinnedCount <= maxUnpinned;
        });
      }
      
      return entry;
    },
    
    /**
     * Get a specific history entry by ID
     */
    getEntry(id: string): HistoryEntry | undefined {
      return historyEntries.find(e => e.id === id);
    },
    
    /**
     * Get all history entries (most recent first)
     */
    getAllEntries(): HistoryEntry[] {
      return [...historyEntries];
    },
    
    /**
     * Remove a specific entry by ID
     */
    removeEntry(id: string): void {
      historyEntries = historyEntries.filter(e => e.id !== id);
    },
    
    /**
     * Toggle pin status of an entry
     */
    togglePin(id: string): void {
      const entry = historyEntries.find(e => e.id === id);
      if (entry) {
        entry.pinned = !entry.pinned;
      }
    },
    
    /**
     * Get only pinned entries
     */
    getPinnedEntries(): HistoryEntry[] {
      return historyEntries.filter(e => e.pinned);
    },
    
    /**
     * Clear non-pinned entries
     */
    clear(): void {
      historyEntries = historyEntries.filter(e => e.pinned);
    },
    
    /**
     * Clear all entries including pinned
     */
    clearAll(): void {
      historyEntries = [];
    },
    
    /**
     * Persist history to localStorage
     */
    persist(): void {
      try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyEntries));
      } catch {
        console.warn('Failed to persist history');
      }
    },
    
    /**
     * Restore history from localStorage
     */
    restore(): void {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
        if (stored) {
          const parsed = JSON.parse(stored) as HistoryEntry[];
          historyEntries = Array.isArray(parsed) ? parsed : [];
        }
      } catch {
        console.warn('Failed to restore history');
      }
    },
    
    /**
     * Get total entry count
     */
    getCount(): number {
      return historyEntries.length;
    }
  };
}

/**
 * Reset history store (for testing)
 */
export function resetHistoryStore(): void {
  historyEntries = [];
}
