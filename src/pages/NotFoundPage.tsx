/**
 * NotFoundPage - 404 error page
 * 
 * Displayed when a user navigates to an invalid route.
 * Provides navigation options to valid pages.
 */

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MODE_ROUTES } from '../router/routes';
import type { CalculatorMode } from '../types';

const popularModes: CalculatorMode[] = ['basic', 'scientific', 'graphing', 'programmer'];

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found - CalcPro</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-bold text-slate-900">CalcPro</span>
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            {/* 404 illustration */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-4">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-6xl font-bold text-slate-300 mb-2">404</h1>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Page Not Found</h2>
              <p className="text-slate-600">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Link
                to="/"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Calculator
              </Link>

              <div className="flex gap-2">
                <Link
                  to="/help"
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
                >
                  Help
                </Link>
                <Link
                  to="/privacy"
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
                >
                  Privacy
                </Link>
              </div>
            </div>

            {/* Popular calculators */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-4">Or try one of these calculators:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularModes.map((mode) => (
                  <Link
                    key={mode}
                    to={MODE_ROUTES[mode].path}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm text-slate-700"
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
