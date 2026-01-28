/**
 * Router Configuration for CalcPro
 * 
 * Sets up React Router with all calculator mode routes,
 * help page, privacy page, and 404 handling.
 */

import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CalculatorPage } from '../pages/CalculatorPage';
import { HelpPage } from '../pages/HelpPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { MODE_ROUTES, STATIC_ROUTES, getRouteByPath } from './routes';
import type { CalculatorMode } from '../types';

// Document title updater component
function TitleUpdater() {
  const location = useLocation();
  
  useEffect(() => {
    const route = getRouteByPath(location.pathname);
    if (route) {
      document.title = route.title;
    }
  }, [location.pathname]);
  
  return <Outlet />;
}

// Create router with all routes
export const router = createBrowserRouter([
  {
    element: <TitleUpdater />,
    errorElement: <NotFoundPage />,
    children: [
      // Home route - defaults to basic calculator
      {
        path: '/',
        element: <CalculatorPage mode="basic" />,
      },
      // Calculator mode routes
      ...Object.entries(MODE_ROUTES).map(([mode, config]) => ({
        path: config.path,
        element: <CalculatorPage mode={mode as CalculatorMode} />,
      })),
      // Help page
      {
        path: STATIC_ROUTES.help.path,
        element: <HelpPage />,
      },
      // Privacy page
      {
        path: STATIC_ROUTES.privacy.path,
        element: <PrivacyPage />,
      },
      // 404 catch-all
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

// Router provider component with error boundary
export function AppRouter() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export { MODE_ROUTES, STATIC_ROUTES, getRouteByPath, getModeFromPath, getPathFromMode } from './routes';
