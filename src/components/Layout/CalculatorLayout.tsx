/**
 * CalculatorLayout - LOCKED STRUCTURE
 * 
 * THE CALCULATOR IS THE PAGE.
 * 
 * Structure (DO NOT CHANGE):
 * | Header (Brand + Mode + Window Controls)                    |
 * | Sidebar | Calculator (Expression → Result → Keypad) | History |
 * | Optional content (collapsed by default)                    |
 */

import React, { useState, useCallback, useEffect } from 'react';
import type { CalculatorMode, CalculationResult, HistoryEntry } from '../../types';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { HistoryPanel } from './HistoryPanel';
import { Footer } from './Footer';
import { MainCalculator } from '../Calculator/MainCalculator';
import { createHistoryStore } from '../../engine/historyStore';
import { useGuidanceVisibility, useEducationalContentVisibility } from '../../hooks/usePreferences';

interface CalculatorLayoutProps {
  mode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  historyOpen: boolean;
  onHistoryToggle: () => void;
}

type ViewMode = 'normal' | 'maximized' | 'compact';

export const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({
  mode,
  onModeChange,
  sidebarOpen,
  onSidebarToggle,
  historyOpen,
  onHistoryToggle,
}) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyStore] = useState(() => createHistoryStore());
  const [viewMode, setViewMode] = useState<ViewMode>('normal');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Persistent preferences - NEVER auto-hide
  const [guidanceVisible, setGuidanceVisible] = useGuidanceVisibility();
  const [educationalContentVisible, setEducationalContentVisible] = useEducationalContentVisibility();

  // Load history on mount
  useEffect(() => {
    historyStore.restore();
    setHistory(historyStore.getAllEntries());
  }, [historyStore]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen]);

  // History handlers
  const handleCalculation = useCallback((expression: string, result: CalculationResult) => {
    const entry = historyStore.addEntry(expression, result, mode);
    historyStore.persist();
    setHistory(historyStore.getAllEntries());
    return entry;
  }, [historyStore, mode]);

  const handleClearHistory = useCallback(() => {
    historyStore.clear();
    historyStore.persist();
    setHistory(historyStore.getAllEntries());
  }, [historyStore]);

  const handlePinEntry = useCallback((id: string) => {
    historyStore.togglePin(id);
    historyStore.persist();
    setHistory(historyStore.getAllEntries());
  }, [historyStore]);

  const handleDeleteEntry = useCallback((id: string) => {
    historyStore.removeEntry(id);
    historyStore.persist();
    setHistory(historyStore.getAllEntries());
  }, [historyStore]);

  const handleRerunEntry = useCallback((_expression: string, entryMode: CalculatorMode) => {
    if (entryMode !== mode) {
      onModeChange(entryMode);
    }
  }, [mode, onModeChange]);

  // View mode determines what's visible
  const showSidebar = viewMode !== 'compact' && sidebarOpen;
  const showHistory = viewMode !== 'compact' && historyOpen;

  return (
    <div className={`calculator-app flex flex-col overflow-hidden transition-colors
                    ${isFullscreen 
                      ? 'fixed inset-0 w-screen h-screen bg-slate-900 z-50' 
                      : 'h-screen bg-slate-100'}`}
         style={isFullscreen ? { width: '100vw', height: '100vh' } : undefined}>
      {/* Header - Compact, always visible */}
      <Header 
        mode={mode}
        onSidebarToggle={onSidebarToggle}
        onHistoryToggle={onHistoryToggle}
        historyOpen={historyOpen}
        sidebarOpen={sidebarOpen}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isFullscreen={isFullscreen}
        onFullscreenToggle={toggleFullscreen}
      />
      
      {/* Main Content - Calculator DOMINATES */}
      <div className={`flex-1 flex overflow-hidden
                      ${isFullscreen ? 'min-h-0' : 'min-h-0'}`}
           style={isFullscreen ? { height: 'calc(100vh - 52px)' } : undefined}>
        {/* Left Sidebar - Modes (supportive) */}
        {viewMode !== 'compact' && !isFullscreen && (
          <Sidebar 
            isOpen={showSidebar}
            currentMode={mode}
            onModeChange={onModeChange}
            onClose={onSidebarToggle}
          />
        )}
        
        {/* CALCULATOR - THE MAIN EVENT */}
        <main className={`flex-1 flex flex-col min-w-0 transition-all
                         ${isFullscreen ? 'h-full overflow-hidden' : 'overflow-hidden'}`}>
          {/* Calculator fills available space - FIXED HEIGHT IN FULLSCREEN */}
          <div className={`flex flex-col h-full
                          ${viewMode === 'maximized' || isFullscreen ? 'max-w-5xl w-full mx-auto' : ''}
                          ${viewMode === 'compact' ? 'max-w-lg mx-auto' : ''}`}
               style={isFullscreen ? { height: '100%', minHeight: '100%' } : undefined}>
            <MainCalculator 
              mode={mode}
              onCalculation={handleCalculation}
              viewMode={viewMode}
              isFullscreen={isFullscreen}
            />
          </div>
          
          {/* Learn More - User-controlled visibility, NEVER auto-hides */}
          {viewMode === 'normal' && !isFullscreen && (
            <div className="flex-shrink-0 border-t border-slate-200 bg-white">
              <button
                onClick={() => setEducationalContentVisible(!educationalContentVisible)}
                className="w-full px-4 py-2 text-sm text-slate-500 hover:text-slate-700 
                         hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
              >
                <span>{educationalContentVisible ? 'Hide' : 'Learn more about'} {mode} calculator</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${educationalContentVisible ? 'rotate-180' : ''}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {educationalContentVisible && (
                <div className="max-h-[35vh] overflow-y-auto">
                  <Footer mode={mode} onModeChange={onModeChange} />
                </div>
              )}
            </div>
          )}
        </main>
        
        {/* Right Panel - History (supportive) */}
        {viewMode !== 'compact' && !isFullscreen && (
          <HistoryPanel 
            isOpen={showHistory}
            entries={history}
            guidanceVisible={guidanceVisible}
            onGuidanceToggle={() => setGuidanceVisible(!guidanceVisible)}
            onClear={handleClearHistory}
            onPin={handlePinEntry}
            onClose={onHistoryToggle}
            onRerun={handleRerunEntry}
            onDelete={handleDeleteEntry}
          />
        )}
      </div>
    </div>
  );
};
