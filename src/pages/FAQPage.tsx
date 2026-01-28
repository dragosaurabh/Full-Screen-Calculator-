/**
 * FAQPage - Frequently Asked Questions
 * 
 * SEO-optimized FAQ page with schema-friendly structure.
 * Real questions, clear answers.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // General
  {
    category: 'General',
    question: 'Is CalcPro free to use?',
    answer: 'Yes, CalcPro is completely free with no ads, no premium tiers, and no feature restrictions. All calculator modes are available to everyone.'
  },
  {
    category: 'General',
    question: 'Does CalcPro work offline?',
    answer: 'Yes. Once you load CalcPro in your browser, it works without an internet connection. Your calculations and history are stored locally on your device.'
  },
  {
    category: 'General',
    question: 'Do I need to create an account?',
    answer: 'No. CalcPro requires no sign-up, no login, and no personal information. Just open the calculator and start using it.'
  },
  {
    category: 'General',
    question: 'What browsers does CalcPro support?',
    answer: 'CalcPro works in all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, keep your browser updated to the latest version.'
  },
  
  // Calculations
  {
    category: 'Calculations',
    question: 'Does CalcPro follow order of operations (PEMDAS)?',
    answer: 'Yes. CalcPro evaluates expressions using standard mathematical order: Parentheses first, then Exponents, then Multiplication and Division (left to right), then Addition and Subtraction (left to right).'
  },
  {
    category: 'Calculations',
    question: 'How accurate are the calculations?',
    answer: 'CalcPro uses high-precision arithmetic with at least 15 significant digits of accuracy. This is suitable for most scientific, financial, and engineering calculations.'
  },
  {
    category: 'Calculations',
    question: 'Why does sin(90) give a wrong answer?',
    answer: 'Check your angle mode. If you\'re in radians mode, sin(90) calculates the sine of 90 radians, not 90 degrees. Switch to degrees mode using the DEG/RAD toggle, or use sin(π/2) in radians mode.'
  },
  {
    category: 'Calculations',
    question: 'What does "Domain error" mean?',
    answer: 'A domain error occurs when you try to calculate something mathematically undefined. For example, sqrt(-1) in real number mode, ln(0), or asin(2). Check that your input is within the valid range for the function.'
  },
  
  // History
  {
    category: 'History',
    question: 'How do I save a calculation for later?',
    answer: 'Click the bookmark icon on any history entry to pin it. Pinned calculations stay at the top of your history and won\'t be automatically removed.'
  },
  {
    category: 'History',
    question: 'How long is my history saved?',
    answer: 'Your calculation history is saved in your browser\'s local storage and persists until you clear it manually or clear your browser data. There\'s no automatic expiration.'
  },
  {
    category: 'History',
    question: 'Can I search my calculation history?',
    answer: 'Yes. Use the search box at the top of the history panel to find past calculations by expression, result, or calculator mode.'
  },
  {
    category: 'History',
    question: 'How do I clear my history?',
    answer: 'Click the trash icon in the history panel header to clear all history, or click the X on individual entries to delete them one at a time.'
  },
  
  // Privacy
  {
    category: 'Privacy',
    question: 'Are my calculations sent to a server?',
    answer: 'No. All calculations happen entirely in your browser. Nothing is sent to any server. CalcPro works completely offline after the initial page load.'
  },
  {
    category: 'Privacy',
    question: 'Does CalcPro track what I calculate?',
    answer: 'No. CalcPro has no analytics on your calculations. We have no way to see what you\'re calculating. Your data stays on your device.'
  },
  {
    category: 'Privacy',
    question: 'Where is my data stored?',
    answer: 'Your calculation history and settings are stored in your browser\'s local storage on your device. This data is never uploaded anywhere.'
  },
  
  // Features
  {
    category: 'Features',
    question: 'Can I use my keyboard instead of clicking buttons?',
    answer: 'Yes. Type numbers and operators directly on your keyboard. Press Enter to calculate, Escape to clear, and Backspace to delete. Most keyboard shortcuts work without clicking first.'
  },
  {
    category: 'Features',
    question: 'How do I enter scientific functions?',
    answer: 'Type the function name followed by parentheses: sin(45), log(100), sqrt(16). Or use the function buttons in Scientific mode.'
  },
  {
    category: 'Features',
    question: 'What\'s the difference between Compact, Normal, and Expand modes?',
    answer: 'Compact shows only the calculator. Normal includes the sidebar and history panel. Expand gives you a larger calculator with more space. Choose based on your screen size and preference.'
  },
  {
    category: 'Features',
    question: 'How do I use fullscreen mode?',
    answer: 'Click the Fullscreen button in the header or press F11. This gives you a distraction-free calculator that fills your entire screen. Press Escape or F11 again to exit.'
  },
];

const categories = [...new Set(faqs.map(f => f.category))];

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(f => f.category === activeCategory);

  // Schema.org FAQ structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>FAQ - Frequently Asked Questions | CalcPro</title>
        <meta name="description" content="Find answers to common questions about CalcPro calculator. Learn about features, privacy, calculations, and troubleshooting." />
        <meta name="keywords" content="calculator FAQ, CalcPro help, calculator questions, how to use calculator" />
        <link rel="canonical" href="https://calcpro.app/faq" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
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
              <h1 className="font-semibold text-slate-700">FAQ</h1>
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
          {/* Intro */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-slate-600">
              Quick answers to common questions about CalcPro. Can't find what you're looking for? 
              Check our <Link to="/help" className="text-blue-600 hover:underline">Help Center</Link> for detailed guides.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                        ${activeCategory === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
            >
              All ({faqs.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                          ${activeCategory === cat 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
              >
                {cat} ({faqs.filter(f => f.category === cat).length})
              </button>
            ))}
          </div>

          {/* FAQ list */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => {
              const globalIndex = faqs.indexOf(faq);
              const isOpen = openIndex === globalIndex;
              
              return (
                <div
                  key={globalIndex}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                    className="w-full px-5 py-4 flex items-start justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1 pr-4">
                      <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                        {faq.category}
                      </span>
                      <h3 className="font-semibold text-slate-900 mt-1">{faq.question}</h3>
                    </div>
                    <svg
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 mt-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-slate-600 border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Still need help */}
          <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">Still have questions?</h3>
            <p className="text-blue-700 text-sm mb-4">
              Our Help Center has detailed guides for every feature and calculator mode.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/help"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Visit Help Center
              </Link>
              <Link
                to="/privacy"
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium border border-blue-200"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
