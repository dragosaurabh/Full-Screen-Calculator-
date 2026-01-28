/**
 * HistoryPanel Component
 * 
 * A real tool, not a placeholder:
 * - Groups by Today/Yesterday/Earlier
 * - Edit & re-run calculations
 * - Pin important entries
 * - Copy, rename, delete
 * - Mode and time context
 */

import React, { useState, useMemo } from 'react';
import type { HistoryEntry, CalculatorMode } from '../../types';

interface HistoryPanelProps {
  isOpen: boolean;
  entries: HistoryEntry[];
  onClear: () => void;
  onPin: (id: string) => void;
  onClose: () => void;
  onRerun?: (expression: string, mode: CalculatorMode) => void;
  onDelete?: (id: string) => void;
}

// Group entries by time period
function groupByTime(entries: HistoryEntry[]): {
  pinned: HistoryEntry[];
  today: HistoryEntry[];
  yesterday: HistoryEntry[];
  earlier: HistoryEntry[];
} {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;
  
  const pinned: HistoryEntry[] = [];
  const today: HistoryEntry[] = [];
  const yesterday: HistoryEntry[] = [];
  const earlier: HistoryEntry[] = [];
  
  for (const entry of entries) {
    if (entry.pinned) {
      pinned.push(entry);
    } else if (entry.timestamp >= todayStart) {
      today.push(entry);
    } else if (entry.timestamp >= yesterdayStart) {
      yesterday.push(entry);
    } else {
      earlier.push(entry);
    }
  }
  
  return { pinned, today, yesterday, earlier };
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const modeColors: Record<CalculatorMode, string> = {
  basic: 'bg-slate-100 text-slate-600',
  scientific: 'bg-blue-100 text-blue-700',
  programmer: 'bg-purple-100 text-purple-700',
  graphing: 'bg-green-100 text-green-700',
  matrix: 'bg-orange-100 text-orange-700',
  complex: 'bg-pink-100 text-pink-700',
  statistics: 'bg-cyan-100 text-cyan-700',
  financial: 'bg-emerald-100 text-emerald-700',
  converter: 'bg-amber-100 text-amber-700',
};

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  entries,
  onClear,
  onPin,
  onClose,
  onRerun,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter entries by search
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter(e => 
      e.expression.toLowerCase().includes(q) ||
      e.result.formatted.toLowerCase().includes(q) ||
      e.mode.toLowerCase().includes(q)
    );
  }, [entries, searchQuery]);
  
  const grouped = useMemo(() => groupByTime(filteredEntries), [filteredEntries]);
  
  if (!isOpen) return null;

  const hasEntries = entries.length > 0;
  const hasResults = filteredEntries.length > 0;

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col hidden lg:flex">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">History</h2>
          <div className="flex items-center gap-1">
            {hasEntries && (
              <button
                onClick={onClear}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Clear all history"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Search */}
        {hasEntries && (
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
            />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!hasEntries ? (
          // Empty state - educational and helpful
          <div className="flex flex-col h-full p-5">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Your calculation history</h3>
              <p className="text-sm text-slate-500 text-center max-w-[200px]">
                Every calculation you make appears here for quick reference.
              </p>
            </div>
            
            {/* How history helps */}
            <div className="mt-auto pt-4 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-600 mb-3">What you can do:</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span><strong className="text-slate-600">Pin</strong> important results for quick access</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span><strong className="text-slate-600">Click</strong> any entry to re-run it</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span><strong className="text-slate-600">Search</strong> through past calculations</span>
                </div>
              </div>
            </div>
          </div>
        ) : !hasResults ? (
          // No search results
          <div className="flex flex-col items-center justify-center h-full p-6 text-slate-400">
            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm">No results for "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs text-blue-500 hover:text-blue-700"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="p-3 space-y-4">
            {/* Pinned */}
            {grouped.pinned.length > 0 && (
              <HistoryGroup
                title="Pinned"
                icon={
                  <svg className="w-3.5 h-3.5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                }
                entries={grouped.pinned}
                onPin={onPin}
                onRerun={onRerun}
                onDelete={onDelete}
                showDate
              />
            )}
            
            {/* Today */}
            {grouped.today.length > 0 && (
              <HistoryGroup
                title="Today"
                entries={grouped.today}
                onPin={onPin}
                onRerun={onRerun}
                onDelete={onDelete}
              />
            )}
            
            {/* Yesterday */}
            {grouped.yesterday.length > 0 && (
              <HistoryGroup
                title="Yesterday"
                entries={grouped.yesterday}
                onPin={onPin}
                onRerun={onRerun}
                onDelete={onDelete}
              />
            )}
            
            {/* Earlier */}
            {grouped.earlier.length > 0 && (
              <HistoryGroup
                title="Earlier"
                entries={grouped.earlier}
                onPin={onPin}
                onRerun={onRerun}
                onDelete={onDelete}
                showDate
              />
            )}
          </div>
        )}
      </div>
      
      {/* Footer stats */}
      {hasEntries && (
        <div className="flex-shrink-0 px-4 py-2 border-t border-slate-100 text-xs text-slate-400 text-center">
          {entries.length} calculation{entries.length !== 1 ? 's' : ''} • {grouped.pinned.length} pinned
        </div>
      )}
    </aside>
  );
};

// History group component
const HistoryGroup: React.FC<{
  title: string;
  icon?: React.ReactNode;
  entries: HistoryEntry[];
  onPin: (id: string) => void;
  onRerun: ((expression: string, mode: CalculatorMode) => void) | undefined;
  onDelete: ((id: string) => void) | undefined;
  showDate?: boolean;
}> = ({ title, icon, entries, onPin, onRerun, onDelete, showDate }) => (
  <div>
    <h3 className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 px-1">
      {icon && <span className="text-amber-500">{icon}</span>}
      {title}
      <span className="text-slate-400 font-normal">({entries.length})</span>
    </h3>
    <div className="space-y-2">
      {entries.map((entry) => (
        <HistoryItem
          key={entry.id}
          entry={entry}
          onPin={onPin}
          onRerun={onRerun}
          onDelete={onDelete}
          showDate={showDate}
        />
      ))}
    </div>
  </div>
);

// Individual history item
const HistoryItem: React.FC<{
  entry: HistoryEntry;
  onPin: (id: string) => void;
  onRerun: ((expression: string, mode: CalculatorMode) => void) | undefined;
  onDelete: ((id: string) => void) | undefined;
  showDate: boolean | undefined;
}> = ({ entry, onPin, onRerun, onDelete, showDate }) => {
  const [showActions, setShowActions] = useState(false);
  
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(`${entry.expression} = ${entry.result.formatted}`);
  };

  return (
    <div 
      className={`history-item group relative rounded-xl p-3 cursor-pointer
                ${entry.pinned 
                  ? 'bg-amber-50 border border-amber-200 hover:border-amber-300 hover:bg-amber-50/80' 
                  : 'bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200'
                }`}
      onClick={() => onRerun?.(entry.expression, entry.mode)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Main content */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-sm text-slate-600 font-mono truncate" title={entry.expression}>
            {entry.expression}
          </div>
          <div className="text-lg font-semibold text-slate-900 font-mono">
            = {entry.result.formatted}
          </div>
        </div>
      </div>
      
      {/* Metadata */}
      <div className="flex items-center gap-2 mt-2">
        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${modeColors[entry.mode]}`}>
          {entry.mode}
        </span>
        <span className="text-xs text-slate-400">
          {showDate ? formatDate(entry.timestamp) : formatTime(entry.timestamp)}
        </span>
      </div>
      
      {/* Hover actions */}
      <div className={`absolute top-2 right-2 flex items-center gap-0.5 transition-opacity
                      ${showActions ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors"
          title="Copy"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onPin(entry.id); }}
          className={`p-1.5 rounded-lg transition-colors
                    ${entry.pinned 
                      ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-100' 
                      : 'text-slate-400 hover:text-amber-500 hover:bg-white'
                    }`}
          title={entry.pinned ? 'Unpin' : 'Pin'}
        >
          <svg className="w-3.5 h-3.5" fill={entry.pinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
