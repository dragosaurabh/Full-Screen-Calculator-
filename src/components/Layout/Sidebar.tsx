/**
 * Sidebar Component
 * 
 * Left panel with calculator mode selection.
 * Collapsible on mobile, always visible on desktop.
 */

import React from 'react';
import type { CalculatorMode } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  currentMode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
  onClose: () => void;
}

interface ModeConfig {
  id: CalculatorMode;
  label: string;
  description: string;
  icon: React.ReactNode;
  shortcut: string;
}

const modes: ModeConfig[] = [
  {
    id: 'basic',
    label: 'Basic',
    description: 'Standard arithmetic',
    shortcut: '1',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'scientific',
    label: 'Scientific',
    description: 'Trig, log, powers',
    shortcut: '2',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'programmer',
    label: 'Programmer',
    description: 'Hex, binary, bitwise',
    shortcut: '3',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: 'graphing',
    label: 'Graphing',
    description: 'Plot functions',
    shortcut: '4',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
  {
    id: 'matrix',
    label: 'Matrix',
    description: 'Linear algebra',
    shortcut: '5',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: 'complex',
    label: 'Complex',
    description: 'Imaginary numbers',
    shortcut: '6',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'statistics',
    label: 'Statistics',
    description: 'Mean, std dev, prob',
    shortcut: '7',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'financial',
    label: 'Financial',
    description: 'TVM, loans, interest',
    shortcut: '8',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'converter',
    label: 'Converter',
    description: 'Units & currencies',
    shortcut: '9',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  currentMode,
  onModeChange,
  onClose,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-slate-200
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:border-0 lg:overflow-hidden'}
          flex flex-col
        `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200">
          <span className="font-semibold text-slate-900">Calculator Modes</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Mode list */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {modes.map((mode) => (
              <li key={mode.id}>
                <button
                  onClick={() => {
                    onModeChange(mode.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-150
                    ${currentMode === mode.id 
                      ? 'bg-blue-50 text-blue-700 shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <span className={`
                    flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
                    ${currentMode === mode.id ? 'bg-blue-100' : 'bg-slate-100'}
                  `}>
                    {mode.icon}
                  </span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{mode.label}</div>
                    <div className="text-xs text-slate-500">{mode.description}</div>
                  </div>
                  <kbd className="hidden sm:block px-1.5 py-0.5 text-xs bg-slate-100 text-slate-500 rounded font-mono">
                    {mode.shortcut}
                  </kbd>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Bottom section */}
        <div className="p-3 border-t border-slate-200">
          <div className="text-xs text-slate-500 text-center">
            Press number keys to switch modes
          </div>
        </div>
      </aside>
    </>
  );
};
