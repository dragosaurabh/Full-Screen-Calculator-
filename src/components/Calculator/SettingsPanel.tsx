/**
 * SettingsPanel Component
 * 
 * Provides controls for calculator settings including precision,
 * angle mode, locale, and accessibility options.
 * Validates: Requirements 19.1, 19.5, 19.6
 */

import React from 'react';
import type { CalculatorSettings, AngleMode } from '../../types';

interface SettingsPanelProps {
  settings: CalculatorSettings;
  onSettingsChange: (settings: Partial<CalculatorSettings>) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange
}) => {
  return (
    <div className="settings-panel bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4" role="region" aria-label="Calculator Settings">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Settings</h2>

      <div className="space-y-6">
        {/* Precision */}
        <div>
          <label htmlFor="precision" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Precision (significant digits)
          </label>
          <input
            type="range"
            id="precision"
            min="1"
            max="20"
            value={settings.precision}
            onChange={(e) => onSettingsChange({ precision: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>1</span>
            <span className="font-medium">{settings.precision}</span>
            <span>20</span>
          </div>
        </div>

        {/* Angle Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Angle Mode
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onSettingsChange({ angleMode: 'radians' as AngleMode })}
              className={`
                flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors
                ${settings.angleMode === 'radians'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
              aria-pressed={settings.angleMode === 'radians'}
            >
              Radians
            </button>
            <button
              onClick={() => onSettingsChange({ angleMode: 'degrees' as AngleMode })}
              className={`
                flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors
                ${settings.angleMode === 'degrees'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
              aria-pressed={settings.angleMode === 'degrees'}
            >
              Degrees
            </button>
          </div>
        </div>

        {/* Number Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Number Format
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="decimal-separator" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Decimal
              </label>
              <select
                id="decimal-separator"
                value={settings.decimalSeparator}
                onChange={(e) => onSettingsChange({ decimalSeparator: e.target.value as '.' | ',' })}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value=".">Period (.)</option>
                <option value=",">Comma (,)</option>
              </select>
            </div>
            <div>
              <label htmlFor="thousands-separator" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Thousands
              </label>
              <select
                id="thousands-separator"
                value={settings.thousandsSeparator}
                onChange={(e) => onSettingsChange({ thousandsSeparator: e.target.value as ',' | '.' | ' ' | '' })}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value=",">Comma (,)</option>
                <option value=".">Period (.)</option>
                <option value=" ">Space</option>
                <option value="">None</option>
              </select>
            </div>
          </div>
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="high-contrast" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              High Contrast Mode
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Improves visibility for accessibility
            </p>
          </div>
          <button
            id="high-contrast"
            role="switch"
            aria-checked={settings.highContrast}
            onClick={() => onSettingsChange({ highContrast: !settings.highContrast })}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${settings.highContrast ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${settings.highContrast ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>

        {/* Keyboard Shortcuts */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Keyboard Shortcuts
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Evaluate</span>
              <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">Enter</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Clear</span>
              <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">Esc</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Undo</span>
              <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">Ctrl+Z</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Redo</span>
              <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">Ctrl+Y</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Switch Mode</span>
              <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">Alt+1-9</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
