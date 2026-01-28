/**
 * HistoryPanel Component
 * 
 * Displays calculation history with timestamps, pinning, and clear functionality.
 * Validates: Requirements 13.1, 13.2, 13.3, 13.4
 */

import React from 'react';
import type { HistoryEntry } from '../../types';

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onEntryClick: (entry: HistoryEntry) => void;
  onTogglePin: (id: string) => void;
  onClear: () => void;
  onClearAll: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  entries,
  onEntryClick,
  onTogglePin,
  onClear,
  onClearAll
}) => {
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const pinnedEntries = entries.filter(e => e.pinned);
  const unpinnedEntries = entries.filter(e => !e.pinned);

  return (
    <div className="history-panel bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4" role="region" aria-label="Calculation History">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">History</h2>
        <div className="flex gap-2">
          <button
            onClick={onClear}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Clear unpinned history"
          >
            Clear
          </button>
          <button
            onClick={onClearAll}
            className="text-sm text-red-500 hover:text-red-700"
            aria-label="Clear all history"
          >
            Clear All
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No calculations yet
        </p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {/* Pinned entries */}
          {pinnedEntries.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                Pinned
              </h3>
              {pinnedEntries.map(entry => (
                <HistoryEntryItem
                  key={entry.id}
                  entry={entry}
                  onClick={() => onEntryClick(entry)}
                  onTogglePin={() => onTogglePin(entry.id)}
                  formatTimestamp={formatTimestamp}
                />
              ))}
            </div>
          )}

          {/* Recent entries */}
          {unpinnedEntries.length > 0 && (
            <div>
              {pinnedEntries.length > 0 && (
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Recent
                </h3>
              )}
              {unpinnedEntries.map(entry => (
                <HistoryEntryItem
                  key={entry.id}
                  entry={entry}
                  onClick={() => onEntryClick(entry)}
                  onTogglePin={() => onTogglePin(entry.id)}
                  formatTimestamp={formatTimestamp}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface HistoryEntryItemProps {
  entry: HistoryEntry;
  onClick: () => void;
  onTogglePin: () => void;
  formatTimestamp: (timestamp: number) => string;
}

const HistoryEntryItem: React.FC<HistoryEntryItemProps> = ({
  entry,
  onClick,
  onTogglePin,
  formatTimestamp
}) => {
  return (
    <div
      className={`
        p-3 rounded-lg cursor-pointer transition-colors
        ${entry.pinned 
          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
          : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
        }
      `}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`${entry.expression} equals ${entry.result.formatted}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {entry.expression}
          </p>
          <p className="text-lg font-medium text-gray-900 dark:text-white truncate">
            = {entry.result.formatted}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formatTimestamp(entry.timestamp)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            className={`
              p-1 rounded transition-colors
              ${entry.pinned 
                ? 'text-blue-500 hover:text-blue-700' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }
            `}
            aria-label={entry.pinned ? 'Unpin' : 'Pin'}
          >
            <svg className="w-4 h-4" fill={entry.pinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
        {entry.mode}
      </span>
    </div>
  );
};

export default HistoryPanel;
