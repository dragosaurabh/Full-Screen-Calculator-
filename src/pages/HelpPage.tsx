/**
 * HelpPage - Comprehensive help and documentation
 * 
 * Provides searchable help content organized by sections:
 * - Getting Started
 * - Keypad Usage
 * - Keyboard Shortcuts
 * - Calculator Modes
 * - Common Errors
 * - History & Pinning
 * - Layout Modes
 * - Privacy
 * - FAQs
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { STATIC_ROUTES, MODE_ROUTES } from '../router/routes';
import type { CalculatorMode } from '../types';

interface HelpSection {
  id: string;
  title: string;
  content: React.ReactNode;
  keywords: string[];
}

const modeLabels: Record<CalculatorMode, string> = {
  basic: 'Basic',
  scientific: 'Scientific',
  programmer: 'Programmer',
  graphing: 'Graphing',
  matrix: 'Matrix',
  complex: 'Complex Numbers',
  statistics: 'Statistics',
  financial: 'Financial',
  converter: 'Unit Converter',
};

const helpSections: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    keywords: ['start', 'begin', 'how to', 'introduction', 'basics'],
    content: (
      <div className="space-y-4">
        <p>Welcome to CalcPro! Here's how to get started:</p>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>Choose a calculator mode from the sidebar (Basic, Scientific, etc.)</li>
          <li>Enter your expression using the on-screen keypad or keyboard</li>
          <li>Press = or Enter to calculate</li>
          <li>View your result and access history in the right panel</li>
        </ol>
        <p className="text-slate-600">
          CalcPro automatically saves your calculation history and preferences, so you can pick up where you left off.
        </p>
      </div>
    ),
  },
  {
    id: 'keypad-usage',
    title: 'Keypad Usage',
    keywords: ['keypad', 'buttons', 'click', 'tap', 'input', 'numbers'],
    content: (
      <div className="space-y-4">
        <p>The on-screen keypad adapts to each calculator mode:</p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li><strong>Basic:</strong> Numbers 0-9, operators (+, -, ×, ÷), decimal point, parentheses</li>
          <li><strong>Scientific:</strong> Adds trigonometry (sin, cos, tan), logarithms, powers, constants (π, e)</li>
          <li><strong>Programmer:</strong> Adds hex digits (A-F), base conversion, bitwise operators</li>
          <li><strong>Graphing:</strong> Adds variable x for function plotting</li>
        </ul>
        <p className="text-slate-600">
          Click or tap any button to add it to your expression. The keypad is always visible and accessible.
        </p>
      </div>
    ),
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    keywords: ['keyboard', 'shortcuts', 'hotkeys', 'keys', 'typing'],
    content: (
      <div className="space-y-4">
        <p>Use your keyboard for faster input:</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Numbers & Operators</h4>
            <ul className="text-sm space-y-1">
              <li><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">0-9</kbd> Numbers</li>
              <li><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">+ - * /</kbd> Operators</li>
              <li><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">.</kbd> Decimal point</li>
              <li><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">( )</kbd> Parentheses</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Actions</h4>
            <ul className="text-sm space-y-1">
              <li><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">Enter</kbd> Calculate</li>
              <li><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">Escape</kbd> Clear</li>
              <li><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">Backspace</kbd> Delete</li>
              <li><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">Ctrl+Z</kbd> Undo</li>
            </ul>
          </div>
        </div>
        <p className="text-slate-600 text-sm">
          On Mac, use Ctrl instead of Alt for mode shortcuts.
        </p>
      </div>
    ),
  },
  {
    id: 'calculator-modes',
    title: 'Calculator Modes',
    keywords: ['modes', 'scientific', 'programmer', 'graphing', 'matrix', 'complex', 'statistics', 'financial', 'converter'],
    content: (
      <div className="space-y-4">
        <p>CalcPro offers 9 specialized calculator modes:</p>
        <div className="grid gap-3">
          {(Object.keys(modeLabels) as CalculatorMode[]).map((mode) => (
            <Link
              key={mode}
              to={MODE_ROUTES[mode].path}
              className="block p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <h4 className="font-medium text-blue-600">{modeLabels[mode]}</h4>
              <p className="text-sm text-slate-600">{MODE_ROUTES[mode].description}</p>
            </Link>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'common-errors',
    title: 'Common Errors',
    keywords: ['error', 'problem', 'issue', 'fix', 'troubleshoot', 'nan', 'infinity'],
    content: (
      <div className="space-y-4">
        <p>Understanding common calculation errors:</p>
        <dl className="space-y-3">
          <div>
            <dt className="font-medium text-red-600">Division by zero</dt>
            <dd className="text-sm text-slate-600 ml-4">Cannot divide by zero. Check your expression for /0.</dd>
          </div>
          <div>
            <dt className="font-medium text-red-600">Invalid expression</dt>
            <dd className="text-sm text-slate-600 ml-4">Check for missing operators or unmatched parentheses.</dd>
          </div>
          <div>
            <dt className="font-medium text-red-600">Domain error</dt>
            <dd className="text-sm text-slate-600 ml-4">Some functions have restricted inputs (e.g., sqrt of negative numbers in real mode).</dd>
          </div>
          <div>
            <dt className="font-medium text-red-600">Overflow</dt>
            <dd className="text-sm text-slate-600 ml-4">Result is too large to display. Try using scientific notation.</dd>
          </div>
        </dl>
      </div>
    ),
  },
  {
    id: 'history-pinning',
    title: 'History & Pinning',
    keywords: ['history', 'pin', 'save', 'bookmark', 'rerun', 'past', 'calculations'],
    content: (
      <div className="space-y-4">
        <p>Your calculation history is automatically saved:</p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li><strong>View history:</strong> Click the History button in the header</li>
          <li><strong>Re-run:</strong> Click any history entry to load it</li>
          <li><strong>Pin:</strong> Click the bookmark icon to pin important calculations</li>
          <li><strong>Search:</strong> Use the search box to find past calculations</li>
          <li><strong>Copy:</strong> Click the copy icon to copy a result</li>
          <li><strong>Delete:</strong> Click the X to remove an entry</li>
        </ul>
        <p className="text-slate-600">
          Pinned entries stay at the top and remain visible even when the history panel is collapsed.
        </p>
      </div>
    ),
  },
  {
    id: 'layout-modes',
    title: 'Layout Modes',
    keywords: ['layout', 'fullscreen', 'compact', 'maximize', 'view', 'display'],
    content: (
      <div className="space-y-4">
        <p>Customize your workspace with different view modes:</p>
        <dl className="space-y-3">
          <div>
            <dt className="font-medium">Compact</dt>
            <dd className="text-sm text-slate-600 ml-4">Calculator only, no sidebars. Perfect for quick calculations.</dd>
          </div>
          <div>
            <dt className="font-medium">Normal</dt>
            <dd className="text-sm text-slate-600 ml-4">Full layout with sidebar and history panel.</dd>
          </div>
          <div>
            <dt className="font-medium">Expand</dt>
            <dd className="text-sm text-slate-600 ml-4">Larger calculator with expanded panels.</dd>
          </div>
          <div>
            <dt className="font-medium">Fullscreen</dt>
            <dd className="text-sm text-slate-600 ml-4">Distraction-free mode. Press F11 or click the fullscreen button.</dd>
          </div>
        </dl>
      </div>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy',
    keywords: ['privacy', 'data', 'storage', 'local', 'security'],
    content: (
      <div className="space-y-4">
        <p>CalcPro respects your privacy:</p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>All calculations happen in your browser</li>
          <li>No data is sent to any server</li>
          <li>History is stored locally on your device</li>
          <li>You can clear all data at any time</li>
        </ul>
        <Link to="/privacy" className="text-blue-600 hover:underline">
          Read our full privacy policy →
        </Link>
      </div>
    ),
  },
  {
    id: 'faqs',
    title: 'FAQs',
    keywords: ['faq', 'question', 'answer', 'help', 'support'],
    content: (
      <div className="space-y-4">
        <dl className="space-y-4">
          <div>
            <dt className="font-medium">Is CalcPro free?</dt>
            <dd className="text-sm text-slate-600 ml-4">Yes, CalcPro is completely free to use with no ads.</dd>
          </div>
          <div>
            <dt className="font-medium">Does CalcPro work offline?</dt>
            <dd className="text-sm text-slate-600 ml-4">Yes, once loaded, CalcPro works without an internet connection.</dd>
          </div>
          <div>
            <dt className="font-medium">How accurate is CalcPro?</dt>
            <dd className="text-sm text-slate-600 ml-4">CalcPro uses high-precision arithmetic for accurate results.</dd>
          </div>
          <div>
            <dt className="font-medium">Can I use CalcPro on mobile?</dt>
            <dd className="text-sm text-slate-600 ml-4">Yes, CalcPro is responsive and works on all devices.</dd>
          </div>
        </dl>
      </div>
    ),
  },
];

export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('getting-started');

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return helpSections;
    const q = searchQuery.toLowerCase();
    return helpSections.filter(
      (section) =>
        section.title.toLowerCase().includes(q) ||
        section.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <>
      <Helmet>
        <title>{STATIC_ROUTES.help.title}</title>
        <meta name="description" content={STATIC_ROUTES.help.description} />
        <meta name="keywords" content={STATIC_ROUTES.help.keywords.join(', ')} />
        <link rel="canonical" href="https://calcpro.app/help" />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-bold text-slate-900">CalcPro</span>
              </Link>
              <span className="text-slate-300">/</span>
              <h1 className="font-semibold text-slate-700">Help</h1>
            </div>
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Back to Calculator
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search help topics..."
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
              />
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {filteredSections.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p>No help topics found for "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-blue-600 hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              filteredSections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedSection(expandedSection === section.id ? null : section.id)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <h2 className="font-semibold text-slate-900">{section.title}</h2>
                    <svg
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        expandedSection === section.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSection === section.id && (
                    <div className="px-6 pb-6 text-slate-700">{section.content}</div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Quick links to calculators */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h2 className="font-semibold text-slate-900 mb-4">Calculator Modes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.keys(modeLabels) as CalculatorMode[]).map((mode) => (
                <Link
                  key={mode}
                  to={MODE_ROUTES[mode].path}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                >
                  <span className="text-sm font-medium text-slate-700">{modeLabels[mode]}</span>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
