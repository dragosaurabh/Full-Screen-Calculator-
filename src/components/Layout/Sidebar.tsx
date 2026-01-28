/**
 * Sidebar Component
 * 
 * From navigation to guidance:
 * - Contextual tips per mode
 * - Active mode explanation
 * - Keyboard shortcut hints
 * - Visual mode categories
 */

import React, { useState } from 'react';
import type { CalculatorMode } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  currentMode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
  onClose: () => void;
}

type ModeCategory = 'math' | 'data' | 'conversion';

interface ModeConfig {
  id: CalculatorMode;
  label: string;
  description: string;
  tip: string;
  category: ModeCategory;
  icon: React.ReactNode;
  shortcut: string;
  color: string;
}

const categoryLabels: Record<ModeCategory, { label: string; description: string }> = {
  math: { label: 'Mathematics', description: 'Core calculation modes' },
  data: { label: 'Data & Analysis', description: 'Work with datasets' },
  conversion: { label: 'Conversion', description: 'Transform values' },
};

const modes: ModeConfig[] = [
  {
    id: 'basic',
    label: 'Basic',
    description: 'Standard arithmetic',
    tip: 'Use parentheses to control order: (2+3)×4',
    category: 'math',
    shortcut: '1',
    color: 'slate',
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
    tip: 'Toggle DEG/RAD for angle mode',
    category: 'math',
    shortcut: '2',
    color: 'blue',
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
    tip: 'Prefix: 0x (hex), 0b (binary), 0o (octal)',
    category: 'math',
    shortcut: '3',
    color: 'purple',
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
    tip: 'Enter y = f(x) to plot. Zoom with scroll.',
    category: 'math',
    shortcut: '4',
    color: 'green',
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
    tip: 'Syntax: [[1,2],[3,4]] for 2x2 matrix',
    category: 'data',
    shortcut: '5',
    color: 'orange',
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
    tip: 'Use i for imaginary unit: 3+4i',
    category: 'math',
    shortcut: '6',
    color: 'pink',
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
    tip: 'Comma-separated: mean(1,2,3,4,5)',
    category: 'data',
    shortcut: '7',
    color: 'cyan',
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
    tip: 'PMT(rate, periods, principal)',
    category: 'data',
    shortcut: '8',
    color: 'emerald',
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
    tip: 'Format: 100 km to miles',
    category: 'conversion',
    shortcut: '9',
    color: 'amber',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
];

const colorClasses: Record<string, { bg: string; bgActive: string; text: string }> = {
  slate: { bg: 'bg-slate-100', bgActive: 'bg-slate-200', text: 'text-slate-700' },
  blue: { bg: 'bg-blue-100', bgActive: 'bg-blue-200', text: 'text-blue-700' },
  purple: { bg: 'bg-purple-100', bgActive: 'bg-purple-200', text: 'text-purple-700' },
  green: { bg: 'bg-green-100', bgActive: 'bg-green-200', text: 'text-green-700' },
  orange: { bg: 'bg-orange-100', bgActive: 'bg-orange-200', text: 'text-orange-700' },
  pink: { bg: 'bg-pink-100', bgActive: 'bg-pink-200', text: 'text-pink-700' },
  cyan: { bg: 'bg-cyan-100', bgActive: 'bg-cyan-200', text: 'text-cyan-700' },
  emerald: { bg: 'bg-emerald-100', bgActive: 'bg-emerald-200', text: 'text-emerald-700' },
  amber: { bg: 'bg-amber-100', bgActive: 'bg-amber-200', text: 'text-amber-700' },
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  currentMode,
  onModeChange,
  onClose,
}) => {
  const [showTips, setShowTips] = useState(true);
  const currentModeConfig = modes.find(m => m.id === currentMode);
  
  const mathModes = modes.filter(m => m.category === 'math');
  const dataModes = modes.filter(m => m.category === 'data');
  const conversionModes = modes.filter(m => m.category === 'conversion');

  const renderModeButton = (mode: ModeConfig) => {
    const isActive = currentMode === mode.id;
    const colors = colorClasses[mode.color] ?? colorClasses['slate'];
    
    return (
      <li key={mode.id}>
        <button
          onClick={() => {
            onModeChange(mode.id);
            if (window.innerWidth < 1024) onClose();
          }}
          className={`mode-button w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            ${isActive 
              ? `${colors?.bgActive ?? ''} ${colors?.text ?? ''} shadow-sm ring-1 ring-inset ring-black/5` 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-0.5'
            }`}
        >
          <span className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors
            ${isActive ? colors?.bg ?? '' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
            {mode.icon}
          </span>
          <div className="flex-1 text-left min-w-0">
            <div className="font-medium text-sm">{mode.label}</div>
            <div className={`text-xs truncate ${isActive ? `${colors?.text ?? ''} opacity-70` : 'text-slate-500'}`}>
              {mode.description}
            </div>
          </div>
          <kbd className={`hidden sm:block px-1.5 py-0.5 text-xs rounded font-mono
            ${isActive ? `${colors?.bg ?? ''} ${colors?.text ?? ''}` : 'bg-slate-100 text-slate-500'}`}>
            {mode.shortcut}
          </kbd>
        </button>
      </li>
    );
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={onClose} />
      )}
      
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200
        transform transition-transform duration-200 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:border-0 lg:overflow-hidden'}`}>
        
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200">
          <span className="font-semibold text-slate-900">Calculator Modes</span>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg" aria-label="Close sidebar">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {showTips && currentModeConfig && (
          <div className="hidden lg:block m-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-medium text-blue-700 mb-1">{currentModeConfig.label} Mode Tip</div>
                <p className="text-xs text-blue-600/80 leading-relaxed">{currentModeConfig.tip}</p>
              </div>
              <button onClick={() => setShowTips(false)} className="p-1 text-blue-400 hover:text-blue-600 rounded" title="Hide tips">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <div className="px-1 mb-2">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{categoryLabels.math.label}</h3>
              <p className="text-[10px] text-slate-400">{categoryLabels.math.description}</p>
            </div>
            <ul className="space-y-1">{mathModes.map(renderModeButton)}</ul>
          </div>
          
          <div>
            <div className="px-1 mb-2">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{categoryLabels.data.label}</h3>
              <p className="text-[10px] text-slate-400">{categoryLabels.data.description}</p>
            </div>
            <ul className="space-y-1">{dataModes.map(renderModeButton)}</ul>
          </div>
          
          <div>
            <div className="px-1 mb-2">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{categoryLabels.conversion.label}</h3>
              <p className="text-[10px] text-slate-400">{categoryLabels.conversion.description}</p>
            </div>
            <ul className="space-y-1">{conversionModes.map(renderModeButton)}</ul>
          </div>
        </nav>
        
        <div className="hidden lg:block p-3 border-t border-slate-200 bg-slate-50/50">
          <div className="text-xs text-slate-500 mb-2 font-medium">Keyboard Shortcuts</div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[10px]">1-9</kbd>
              <span>Switch mode</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[10px]">Enter</kbd>
              <span>Calculate</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[10px]">Esc</kbd>
              <span>Clear</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[10px]">Del</kbd>
              <span>Delete</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
