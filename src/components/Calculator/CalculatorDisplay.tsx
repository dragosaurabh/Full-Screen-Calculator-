/**
 * CalculatorDisplay - LOCKED STRUCTURE
 * 
 * Clear separation:
 * 1. Expression (where you type) - editable, cursor visible
 * 2. Result (what you get) - visually dominant after calculation
 * 
 * No confusion. No ambiguity.
 */

import React, { useEffect, useRef } from 'react';
import type { CalculatorMode } from '../../types';

interface CalculatorDisplayProps {
  expression: string;
  result: string | null;
  error: string | null;
  isCalculating: boolean;
  mode: CalculatorMode;
  inputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement>;
  onExpressionChange: (value: string) => void;
  onSubmit: () => void;
}

const modePlaceholders: Record<CalculatorMode, string> = {
  basic: '2 + 2 × 3',
  scientific: 'sin(45) + log(100)',
  programmer: '0xFF AND 0b1010',
  graphing: 'y = x² + 2x - 1',
  matrix: '[[1,2],[3,4]] × [[5,6],[7,8]]',
  complex: '(3 + 4i) × (1 - 2i)',
  statistics: 'mean(1, 2, 3, 4, 5)',
  financial: 'PMT(0.05/12, 360, 200000)',
  converter: '100 km to miles',
};

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  result,
  error,
  isCalculating,
  mode,
  inputRef,
  onExpressionChange,
  onSubmit,
}) => {
  const resultRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const input = inputRef.current;
    if (input && 'style' in input) {
      input.style.height = 'auto';
      input.style.height = `${Math.min(input.scrollHeight, 80)}px`;
    }
  }, [expression, inputRef]);

  // Animate result
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.classList.remove('animate-result');
      void resultRef.current.offsetWidth;
      resultRef.current.classList.add('animate-result');
    }
  }, [result]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="calculator-display bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
      {/* EXPRESSION INPUT - Where you type */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Expression
          </label>
          <span className="text-xs text-slate-600">Type or use keypad below</span>
        </div>
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={expression}
          onChange={(e) => onExpressionChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={modePlaceholders[mode]}
          rows={1}
          className="w-full bg-slate-800 text-white text-2xl md:text-3xl font-mono 
                     placeholder:text-slate-600 border-2 border-slate-700 rounded-xl
                     px-4 py-3 outline-none resize-none
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                     leading-tight tracking-wide"
          aria-label="Calculator expression"
          autoComplete="off"
          spellCheck={false}
          autoFocus
        />
      </div>
      
      {/* RESULT OUTPUT - What you get */}
      <div className="px-4 pb-4 border-t border-slate-800">
        <div className="flex items-center justify-between py-2">
          <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Result
          </label>
          {isCalculating && (
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <div className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
              Calculating...
            </div>
          )}
        </div>
        
        <div ref={resultRef} className="min-h-[56px] flex items-center justify-end" role="status" aria-live="polite">
          {error ? (
            <div className="w-full flex items-center gap-2 text-red-400 bg-red-500/10 rounded-lg p-3 border border-red-500/20">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          ) : result !== null ? (
            <div className="flex items-center gap-3">
              <span className="text-slate-600 text-2xl">=</span>
              <span className="text-4xl md:text-5xl font-bold text-white font-mono tracking-tight select-all">
                {result}
              </span>
            </div>
          ) : (
            <span className="text-4xl md:text-5xl font-bold text-slate-700 font-mono">0</span>
          )}
        </div>
      </div>
    </div>
  );
};
