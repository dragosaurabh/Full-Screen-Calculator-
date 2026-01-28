/**
 * Variable Store
 * 
 * Manages variable assignment and storage with localStorage persistence.
 * Validates: Requirements 10.4
 */

import { STORAGE_KEYS } from '../types';

export interface VariableStore {
  variables: Map<string, number>;
  setVariable: (name: string, value: number) => void;
  getVariable: (name: string) => number | undefined;
  deleteVariable: (name: string) => boolean;
  getAllVariables: () => Map<string, number>;
  clear: () => void;
  persist: () => void;
  restore: () => void;
}

/**
 * Create a variable store with localStorage persistence
 */
export function createVariableStore(): VariableStore {
  const variables = new Map<string, number>();

  const setVariable = (name: string, value: number): void => {
    // Validate variable name (must start with letter, contain only alphanumeric and underscore)
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
      throw new Error(`Invalid variable name: ${name}`);
    }
    // Don't allow overwriting built-in constants
    const reservedNames = ['pi', 'e', 'phi', 'tau'];
    if (reservedNames.includes(name.toLowerCase())) {
      throw new Error(`Cannot overwrite built-in constant: ${name}`);
    }
    variables.set(name, value);
  };

  const getVariable = (name: string): number | undefined => {
    return variables.get(name);
  };

  const deleteVariable = (name: string): boolean => {
    return variables.delete(name);
  };

  const getAllVariables = (): Map<string, number> => {
    return new Map(variables);
  };

  const clear = (): void => {
    variables.clear();
  };

  const persist = (): void => {
    try {
      const data = Object.fromEntries(variables);
      localStorage.setItem(STORAGE_KEYS.VARIABLES, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to persist variables:', error);
    }
  };

  const restore = (): void => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.VARIABLES);
      if (stored) {
        const data = JSON.parse(stored) as Record<string, number>;
        variables.clear();
        Object.entries(data).forEach(([name, value]) => {
          variables.set(name, value);
        });
      }
    } catch (error) {
      console.warn('Failed to restore variables:', error);
    }
  };

  return {
    variables,
    setVariable,
    getVariable,
    deleteVariable,
    getAllVariables,
    clear,
    persist,
    restore
  };
}

/**
 * Singleton variable store instance
 */
let globalVariableStore: VariableStore | null = null;

export function getVariableStore(): VariableStore {
  if (!globalVariableStore) {
    globalVariableStore = createVariableStore();
    globalVariableStore.restore();
  }
  return globalVariableStore;
}

export function resetVariableStore(): void {
  globalVariableStore = null;
}
