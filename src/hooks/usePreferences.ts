/**
 * usePreferences Hook
 * 
 * React hook for accessing and updating UI preferences.
 * Automatically syncs with LocalStorage and triggers re-renders on changes.
 */

import { useState, useEffect, useCallback } from 'react';
import { getPreferenceStore, type UIPreferences } from '../engine/preferenceStore';

/**
 * Hook to access all preferences with reactive updates
 */
export function usePreferences() {
  const store = getPreferenceStore();
  const [preferences, setPreferences] = useState<UIPreferences>(store.getAllPreferences());

  useEffect(() => {
    // Subscribe to preference changes
    const unsubscribe = store.subscribe((newPrefs) => {
      setPreferences(newPrefs);
    });
    return unsubscribe;
  }, [store]);

  const updatePreference = useCallback(<K extends keyof UIPreferences>(
    key: K,
    value: UIPreferences[K]
  ) => {
    store.setPreference(key, value);
  }, [store]);

  const updatePreferences = useCallback((newPrefs: Partial<UIPreferences>) => {
    store.setAllPreferences(newPrefs);
  }, [store]);

  const resetPreferences = useCallback(() => {
    store.reset();
  }, [store]);

  return {
    preferences,
    updatePreference,
    updatePreferences,
    resetPreferences,
    isStorageAvailable: store.isStorageAvailable()
  };
}

/**
 * Hook to access a single preference with reactive updates
 */
export function usePreference<K extends keyof UIPreferences>(key: K) {
  const store = getPreferenceStore();
  const [value, setValue] = useState<UIPreferences[K]>(store.getPreference(key));

  useEffect(() => {
    const unsubscribe = store.subscribe((newPrefs) => {
      setValue(newPrefs[key]);
    });
    return unsubscribe;
  }, [store, key]);

  const updateValue = useCallback((newValue: UIPreferences[K]) => {
    store.setPreference(key, newValue);
  }, [store, key]);

  return [value, updateValue] as const;
}

/**
 * Hook for guidance visibility specifically
 * CRITICAL: Guidance should NEVER auto-hide
 */
export function useGuidanceVisibility() {
  return usePreference('guidanceVisible');
}

/**
 * Hook for educational content visibility
 * CRITICAL: Educational content should NEVER auto-hide
 */
export function useEducationalContentVisibility() {
  return usePreference('educationalContentVisible');
}

/**
 * Hook for history panel state
 */
export function useHistoryPanelState() {
  return usePreference('historyPanelOpen');
}

/**
 * Hook for sidebar state
 */
export function useSidebarState() {
  return usePreference('sidebarOpen');
}

/**
 * Hook for view mode
 */
export function useViewMode() {
  return usePreference('viewMode');
}
