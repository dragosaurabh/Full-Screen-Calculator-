/**
 * PreferenceStore - UI Preferences Persistence
 * 
 * Manages user preferences for UI visibility and state.
 * All preferences are persisted to LocalStorage.
 * 
 * CRITICAL UX RULE: If the user didn't hide it, do not hide it.
 * All UI elements default to VISIBLE.
 */

import type { CalculatorMode } from '../types';

export interface UIPreferences {
  // Panel visibility
  guidanceVisible: boolean;
  educationalContentVisible: boolean;
  historyPanelOpen: boolean;
  sidebarOpen: boolean;
  helpTipsVisible: boolean;
  
  // Calculator state
  currentMode: CalculatorMode;
  viewMode: 'normal' | 'maximized' | 'compact';
  
  // Timestamps for debugging
  lastUpdated: number;
}

const STORAGE_KEY = 'calcpro_preferences';

// Default preferences - everything VISIBLE by default
const DEFAULT_PREFERENCES: UIPreferences = {
  guidanceVisible: true,
  educationalContentVisible: true,
  historyPanelOpen: true,
  sidebarOpen: true,
  helpTipsVisible: true,
  currentMode: 'basic',
  viewMode: 'normal',
  lastUpdated: Date.now()
};

type PreferenceListener = (prefs: UIPreferences) => void;

/**
 * Safe LocalStorage read with error handling
 */
function safeGetFromStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultValue;
    }
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    return JSON.parse(stored) as T;
  } catch (error) {
    console.warn(`Failed to read ${key} from localStorage, using default:`, error);
    return defaultValue;
  }
}

/**
 * Safe LocalStorage write with error handling
 */
function safeSetToStorage(key: string, value: unknown): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Failed to write ${key} to localStorage:`, error);
    return false;
  }
}

/**
 * Creates a preference store instance
 */
export function createPreferenceStore() {
  let preferences: UIPreferences = { ...DEFAULT_PREFERENCES };
  const listeners: Set<PreferenceListener> = new Set();

  // Notify all listeners of preference changes
  function notifyListeners() {
    listeners.forEach(listener => listener(preferences));
  }

  return {
    /**
     * Get a single preference value
     */
    getPreference<K extends keyof UIPreferences>(key: K): UIPreferences[K] {
      return preferences[key];
    },

    /**
     * Get all preferences
     */
    getAllPreferences(): UIPreferences {
      return { ...preferences };
    },

    /**
     * Set a single preference value
     * Automatically persists to LocalStorage
     */
    setPreference<K extends keyof UIPreferences>(key: K, value: UIPreferences[K]): void {
      preferences = {
        ...preferences,
        [key]: value,
        lastUpdated: Date.now()
      };
      this.persist();
      notifyListeners();
    },

    /**
     * Set multiple preferences at once
     */
    setAllPreferences(newPrefs: Partial<UIPreferences>): void {
      preferences = {
        ...preferences,
        ...newPrefs,
        lastUpdated: Date.now()
      };
      this.persist();
      notifyListeners();
    },

    /**
     * Persist preferences to LocalStorage
     */
    persist(): boolean {
      return safeSetToStorage(STORAGE_KEY, preferences);
    },

    /**
     * Restore preferences from LocalStorage
     */
    restore(): void {
      const stored = safeGetFromStorage<Partial<UIPreferences>>(STORAGE_KEY, {});
      preferences = {
        ...DEFAULT_PREFERENCES,
        ...stored,
        lastUpdated: stored.lastUpdated || Date.now()
      };
    },

    /**
     * Reset preferences to defaults
     */
    reset(): void {
      preferences = { ...DEFAULT_PREFERENCES, lastUpdated: Date.now() };
      this.persist();
      notifyListeners();
    },

    /**
     * Subscribe to preference changes
     * Returns unsubscribe function
     */
    subscribe(callback: PreferenceListener): () => void {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },

    /**
     * Check if LocalStorage is available
     */
    isStorageAvailable(): boolean {
      try {
        if (typeof window === 'undefined' || !window.localStorage) {
          return false;
        }
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
      } catch {
        return false;
      }
    }
  };
}

// Singleton instance for app-wide use
let preferenceStoreInstance: ReturnType<typeof createPreferenceStore> | null = null;

export function getPreferenceStore() {
  if (!preferenceStoreInstance) {
    preferenceStoreInstance = createPreferenceStore();
    preferenceStoreInstance.restore();
  }
  return preferenceStoreInstance;
}

// Export utilities for direct use
export { safeGetFromStorage, safeSetToStorage, DEFAULT_PREFERENCES };
