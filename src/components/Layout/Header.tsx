/**
 * Header Component - LOCKED STRUCTURE
 * 
 * Compact header with:
 * - Brand + Mode indicator
 * - Window controls WITH LABELS
 * - Help and Privacy links
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { CalculatorMode } from '../../types';

interface HeaderProps {
  mode: CalculatorMode;
  onSidebarToggle: () => void;
  onHistoryToggle: () => void;
  historyOpen: boolean;
  sidebarOpen: boolean;
  viewMode: 'normal' | 'maximized' | 'compact';
  onViewModeChange: (mode: 'normal' | 'maximized' | 'compact') => void;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
}

const modeLabels: Record<CalculatorMode, string> = {
  basic: 'Basic',
  scientific: 'Scientific',
  programmer: 'Programmer',
  graphing: 'Graphing',
  matrix: 'Matrix',
  complex: 'Complex',
  statistics: 'Statistics',
  financial: 'Financial',
  converter: 'Converter',
};

export const Header: React.FC<HeaderProps> = ({
  mode,
  onSidebarToggle,
  onHistoryToggle,
  historyOpen,
  sidebarOpen,
  viewMode,
  onViewModeChange,
  isFullscreen,
  onFullscreenToggle,
}) => {
  const location = useLocation();
  const isHelpPage = location.pathname === '/help';
  const isPrivacyPage = location.pathname === '/privacy';

  return (
    <header className="bg-white border-b border-slate-200 px-3 py-2 flex items-center justify-between flex-shrink-0">
      {/* Left: Sidebar Toggle + Brand + Mode */}
      <div className="flex items-center gap-2">
        {/* Sidebar Toggle with label */}
        <button
          onClick={onSidebarToggle}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors text-sm font-medium
                     ${sidebarOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-600'}`}
          aria-label="Toggle calculator modes"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="hidden sm:inline">Modes</span>
        </button>

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 px-2 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-bold text-slate-900 hidden md:inline">CalcPro</span>
        </Link>
        
        {/* Current Mode Badge */}
        <div className="px-3 py-1 bg-slate-800 text-white rounded-lg text-sm font-medium">
          {modeLabels[mode]}
        </div>
      </div>
      
      {/* Right: Navigation + Window Controls */}
      <div className="flex items-center gap-1">
        {/* Help Link */}
        <Link
          to="/help"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors text-sm font-medium
                     ${isHelpPage ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-600'}`}
          aria-label="Help"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="hidden sm:inline">Help</span>
        </Link>

        {/* Privacy Link */}
        <Link
          to="/privacy"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors text-sm font-medium
                     ${isPrivacyPage ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-600'}`}
          aria-label="Privacy"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="hidden md:inline">Privacy</span>
        </Link>
        
        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

        {/* History Toggle */}
        <button
          onClick={onHistoryToggle}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors text-sm font-medium
                     ${historyOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-600'}`}
          aria-label="Toggle history panel"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="hidden sm:inline">History</span>
        </button>
        
        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />
        
        {/* View Mode Controls - WITH LABELS */}
        <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => onViewModeChange('compact')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors
                       ${viewMode === 'compact' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            title="Compact view - Calculator only"
          >
            Compact
          </button>
          <button
            onClick={() => onViewModeChange('normal')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors
                       ${viewMode === 'normal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            title="Normal view - With panels"
          >
            Normal
          </button>
          <button
            onClick={() => onViewModeChange('maximized')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors
                       ${viewMode === 'maximized' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            title="Maximized - Expanded calculator"
          >
            Expand
          </button>
        </div>
        
        {/* Fullscreen - WITH LABEL */}
        <button
          onClick={onFullscreenToggle}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors text-sm font-medium
                     ${isFullscreen ? 'bg-purple-50 text-purple-600' : 'hover:bg-slate-100 text-slate-600'}`}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen calculator'}
        >
          {isFullscreen ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          )}
          <span className="hidden md:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
        </button>
      </div>
    </header>
  );
};
