/**
 * ModeSwitcher Component
 * 
 * Tab-based mode selection component.
 * Supports keyboard navigation (Alt + 1-9).
 * Validates: Requirements 2.1, 17.7
 */

import React from 'react';
import type { CalculatorMode } from '../../types';

interface ModeSwitcherProps {
  currentMode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
}

interface ModeConfig {
  id: CalculatorMode;
  label: string;
  shortcut: string;
  icon: string;
}

const modes: ModeConfig[] = [
  { id: 'basic', label: 'Basic', shortcut: '1', icon: '🔢' },
  { id: 'scientific', label: 'Scientific', shortcut: '2', icon: '📐' },
  { id: 'programmer', label: 'Programmer', shortcut: '3', icon: '💻' },
  { id: 'graphing', label: 'Graphing', shortcut: '4', icon: '📈' },
  { id: 'matrix', label: 'Matrix', shortcut: '5', icon: '🔲' },
  { id: 'complex', label: 'Complex', shortcut: '6', icon: '🔄' },
  { id: 'statistics', label: 'Statistics', shortcut: '7', icon: '📊' },
  { id: 'financial', label: 'Financial', shortcut: '8', icon: '💰' },
  { id: 'converter', label: 'Converter', shortcut: '9', icon: '⚖️' },
];

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  currentMode,
  onModeChange
}) => {
  return (
    <div 
      className="mode-switcher"
      role="tablist"
      aria-label="Calculator modes"
    >
      <div className="flex flex-wrap gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {modes.map((mode) => (
          <button
            key={mode.id}
            role="tab"
            aria-selected={currentMode === mode.id}
            aria-controls={`${mode.id}-panel`}
            onClick={() => onModeChange(mode.id)}
            className={`
              flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium
              transition-colors duration-150 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              ${currentMode === mode.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }
            `}
            title={`${mode.label} (Alt+${mode.shortcut})`}
          >
            <span className="hidden sm:inline" aria-hidden="true">{mode.icon}</span>
            <span>{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModeSwitcher;
