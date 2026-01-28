/**
 * CalculatorPage - Wrapper for calculator mode pages
 * 
 * Renders the CalculatorLayout with the specified mode,
 * handles URL sync on mode changes, and provides SEO metadata.
 */

import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CalculatorLayout } from '../components/Layout/CalculatorLayout';
import { MODE_ROUTES, getPathFromMode } from '../router/routes';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { CalculatorMode } from '../types';

interface CalculatorPageProps {
  mode: CalculatorMode;
}

export function CalculatorPage({ mode: initialMode }: CalculatorPageProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<CalculatorMode>(initialMode);
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('calcpro_sidebar_open', true);
  const [historyOpen, setHistoryOpen] = useLocalStorage('calcpro_history_open', true);

  // Sync mode with route
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Handle mode change - update URL
  const handleModeChange = useCallback((newMode: CalculatorMode) => {
    setMode(newMode);
    navigate(getPathFromMode(newMode));
  }, [navigate]);

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
        setHistoryOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen, setHistoryOpen]);

  const routeConfig = MODE_ROUTES[mode];
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: routeConfig.title.split(' - ')[0],
    description: routeConfig.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };

  return (
    <>
      <Helmet>
        <title>{routeConfig.title}</title>
        <meta name="description" content={routeConfig.description} />
        <meta name="keywords" content={routeConfig.keywords.join(', ')} />
        <link rel="canonical" href={`https://calcpro.app${routeConfig.path}`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <CalculatorLayout
        mode={mode}
        onModeChange={handleModeChange}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        historyOpen={historyOpen}
        onHistoryToggle={() => setHistoryOpen(!historyOpen)}
      />
    </>
  );
}
