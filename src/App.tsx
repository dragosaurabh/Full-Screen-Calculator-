/**
 * Advanced Calculator - Production Application
 * 
 * Desktop-first, full-viewport calculator with SEO content,
 * professional dashboard layout, and complete functionality.
 */

import { useState, useEffect } from 'react';
import { CalculatorLayout } from './components/Layout/CalculatorLayout';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { CalculatorMode } from './types';
import './App.css';

function App() {
  const [mode, setMode] = useLocalStorage<CalculatorMode>('calc_mode', 'basic');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(true);

  // Detect screen size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
        setHistoryOpen(false);
      } else {
        setSidebarOpen(true);
        setHistoryOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <CalculatorLayout
      mode={mode}
      onModeChange={setMode}
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      historyOpen={historyOpen}
      onHistoryToggle={() => setHistoryOpen(!historyOpen)}
    />
  );
}

export default App;
