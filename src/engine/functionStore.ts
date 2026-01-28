/**
 * Function Store
 * 
 * Manages custom function definitions with localStorage persistence.
 * Validates: Requirements 10.5
 */

import { STORAGE_KEYS, type ASTNodeType } from '../types';
import { parse } from './parser';

export interface StoredFunction {
  name: string;
  params: string[];
  bodyExpr: string;
  body?: ASTNodeType;
}

export interface FunctionStore {
  functions: Map<string, StoredFunction>;
  defineFunction: (name: string, params: string[], bodyExpr: string) => void;
  getFunction: (name: string) => StoredFunction | undefined;
  deleteFunction: (name: string) => boolean;
  getAllFunctions: () => Map<string, StoredFunction>;
  clear: () => void;
  persist: () => void;
  restore: () => void;
}

/**
 * Create a function store with localStorage persistence
 */
export function createFunctionStore(): FunctionStore {
  const functions = new Map<string, StoredFunction>();

  const defineFunction = (name: string, params: string[], bodyExpr: string): void => {
    // Validate function name
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
      throw new Error(`Invalid function name: ${name}`);
    }
    
    // Don't allow overwriting built-in functions
    const builtinFunctions = [
      'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
      'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
      'exp', 'ln', 'log', 'log10', 'log2',
      'sqrt', 'cbrt', 'abs', 'floor', 'ceil', 'round',
      'factorial', 'gamma', 'min', 'max', 'pow', 'root'
    ];
    if (builtinFunctions.includes(name.toLowerCase())) {
      throw new Error(`Cannot overwrite built-in function: ${name}`);
    }

    // Validate parameter names
    for (const param of params) {
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(param)) {
        throw new Error(`Invalid parameter name: ${param}`);
      }
    }

    // Parse the body to validate it
    const body = parse(bodyExpr);

    functions.set(name, { name, params, bodyExpr, body });
  };

  const getFunction = (name: string): StoredFunction | undefined => {
    return functions.get(name);
  };

  const deleteFunction = (name: string): boolean => {
    return functions.delete(name);
  };

  const getAllFunctions = (): Map<string, StoredFunction> => {
    return new Map(functions);
  };

  const clear = (): void => {
    functions.clear();
  };

  const persist = (): void => {
    try {
      const data: Record<string, { name: string; params: string[]; bodyExpr: string }> = {};
      functions.forEach((fn, name) => {
        data[name] = { name: fn.name, params: fn.params, bodyExpr: fn.bodyExpr };
      });
      localStorage.setItem(STORAGE_KEYS.FUNCTIONS, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to persist functions:', error);
    }
  };

  const restore = (): void => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FUNCTIONS);
      if (stored) {
        const data = JSON.parse(stored) as Record<string, { name: string; params: string[]; bodyExpr: string }>;
        functions.clear();
        Object.values(data).forEach(({ name, params, bodyExpr }) => {
          try {
            const body = parse(bodyExpr);
            functions.set(name, { name, params, bodyExpr, body });
          } catch (error) {
            console.warn(`Failed to restore function ${name}:`, error);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to restore functions:', error);
    }
  };

  return {
    functions,
    defineFunction,
    getFunction,
    deleteFunction,
    getAllFunctions,
    clear,
    persist,
    restore
  };
}

/**
 * Singleton function store instance
 */
let globalFunctionStore: FunctionStore | null = null;

export function getFunctionStore(): FunctionStore {
  if (!globalFunctionStore) {
    globalFunctionStore = createFunctionStore();
    globalFunctionStore.restore();
  }
  return globalFunctionStore;
}

export function resetFunctionStore(): void {
  globalFunctionStore = null;
}
