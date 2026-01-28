/**
 * Undo/Redo Store
 * 
 * Implements undo/redo functionality for calculator input.
 * Validates: Requirements 15.1, 15.2, 15.3, 15.4
 */

export interface UndoRedoStore {
  // State management
  push(state: string): void;
  undo(): string | undefined;
  redo(): string | undefined;
  
  // State queries
  canUndo(): boolean;
  canRedo(): boolean;
  getCurrentState(): string;
  
  // Reset
  clear(): void;
}

interface UndoRedoState {
  history: string[];
  currentIndex: number;
}

let undoRedoState: UndoRedoState = {
  history: [''],
  currentIndex: 0
};

const MAX_HISTORY = 100;

/**
 * Create an undo/redo store instance
 */
export function createUndoRedoStore(): UndoRedoStore {
  return {
    /**
     * Push a new state onto the history stack
     * Clears any redo history
     */
    push(state: string): void {
      // Don't push if state is same as current
      if (undoRedoState.history[undoRedoState.currentIndex] === state) {
        return;
      }
      
      // Clear any redo history
      undoRedoState.history = undoRedoState.history.slice(0, undoRedoState.currentIndex + 1);
      
      // Add new state
      undoRedoState.history.push(state);
      undoRedoState.currentIndex = undoRedoState.history.length - 1;
      
      // Limit history size
      if (undoRedoState.history.length > MAX_HISTORY) {
        undoRedoState.history.shift();
        undoRedoState.currentIndex--;
      }
    },
    
    /**
     * Undo to previous state
     */
    undo(): string | undefined {
      if (undoRedoState.currentIndex > 0) {
        undoRedoState.currentIndex--;
        return undoRedoState.history[undoRedoState.currentIndex];
      }
      return undefined;
    },
    
    /**
     * Redo to next state
     */
    redo(): string | undefined {
      if (undoRedoState.currentIndex < undoRedoState.history.length - 1) {
        undoRedoState.currentIndex++;
        return undoRedoState.history[undoRedoState.currentIndex];
      }
      return undefined;
    },
    
    /**
     * Check if undo is available
     */
    canUndo(): boolean {
      return undoRedoState.currentIndex > 0;
    },
    
    /**
     * Check if redo is available
     */
    canRedo(): boolean {
      return undoRedoState.currentIndex < undoRedoState.history.length - 1;
    },
    
    /**
     * Get current state
     */
    getCurrentState(): string {
      return undoRedoState.history[undoRedoState.currentIndex] ?? '';
    },
    
    /**
     * Clear all history
     */
    clear(): void {
      undoRedoState = {
        history: [''],
        currentIndex: 0
      };
    }
  };
}

/**
 * Reset undo/redo store (for testing)
 */
export function resetUndoRedoStore(): void {
  undoRedoState = {
    history: [''],
    currentIndex: 0
  };
}
