/**
 * useKeyboardShortcuts Hook
 * 
 * Handles keyboard shortcuts for calculator operations.
 */

import { useEffect, useCallback } from 'react';
import type { KeyboardShortcut } from '../types';

/**
 * Hook to register and handle keyboard shortcuts
 * 
 * @param shortcuts - Array of keyboard shortcut definitions
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const modifiersMatch =
          (!shortcut.modifiers || shortcut.modifiers.length === 0) ||
          shortcut.modifiers.every((mod) => {
            switch (mod) {
              case 'ctrl':
                return event.ctrlKey;
              case 'alt':
                return event.altKey;
              case 'shift':
                return event.shiftKey;
              case 'meta':
                return event.metaKey;
              default:
                return false;
            }
          });

        if (modifiersMatch && event.key.toLowerCase() === shortcut.key.toLowerCase()) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

export default useKeyboardShortcuts;
