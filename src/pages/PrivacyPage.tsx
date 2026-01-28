/**
 * PrivacyPage - Privacy policy page
 * 
 * Explains how CalcPro handles user data and privacy.
 */

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { STATIC_ROUTES } from '../router/routes';

export function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>{STATIC_ROUTES.privacy.title}</title>
        <meta name="description" content={STATIC_ROUTES.privacy.description} />
        <meta name="keywords" content={STATIC_ROUTES.privacy.keywords.join(', ')} />
        <link rel="canonical" href="https://calcpro.app/privacy" />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
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
              <h1 className="font-semibold text-slate-700">Privacy Policy</h1>
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
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 mb-6">
                Last updated: January 2026
              </p>

              <section className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">Overview</h2>
                <p className="text-slate-700">
                  CalcPro is designed with privacy as a core principle. We believe your calculations 
                  are your business, and we've built our calculator to respect that.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">Data Collection</h2>
                <p className="text-slate-700 mb-4">
                  <strong>We do not collect any personal data.</strong> CalcPro operates entirely 
                  in your browser with no server-side processing.
                </p>
                <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
                  <li>No account required</li>
                  <li>No tracking or analytics</li>
                  <li>No cookies for advertising</li>
                  <li>No data sent to external servers</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">Local Storage</h2>
                <p className="text-slate-700 mb-4">
                  CalcPro uses your browser's local storage to save:
                </p>
                <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
                  <li>Calculation history</li>
                  <li>Pinned calculations</li>
                  <li>UI preferences (sidebar state, view mode, etc.)</li>
                  <li>Calculator settings</li>
                </ul>
                <p className="text-slate-700 mt-4">
                  This data never leaves your device. You can clear it at any time using the 
                  "Clear History" button or by clearing your browser's local storage.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">Third-Party Services</h2>
                <p className="text-slate-700">
                  CalcPro does not integrate with any third-party services that could track 
                  your activity. The application is self-contained and operates independently.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">Your Rights</h2>
                <p className="text-slate-700 mb-4">
                  Since we don't collect any data, there's nothing to request, modify, or delete 
                  from our servers. Your data stays on your device, under your control.
                </p>
                <p className="text-slate-700">
                  To clear all locally stored data:
                </p>
                <ol className="list-decimal list-inside text-slate-700 space-y-2 ml-4 mt-2">
                  <li>Open your browser's developer tools (F12)</li>
                  <li>Go to Application → Local Storage</li>
                  <li>Clear the entries for this site</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">Changes to This Policy</h2>
                <p className="text-slate-700">
                  If we ever change our privacy practices, we will update this page. Our 
                  commitment to not collecting personal data will remain unchanged.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-slate-900 mb-3">Contact</h2>
                <p className="text-slate-700">
                  If you have questions about this privacy policy, please visit our{' '}
                  <Link to="/help" className="text-blue-600 hover:underline">
                    Help page
                  </Link>
                  .
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
