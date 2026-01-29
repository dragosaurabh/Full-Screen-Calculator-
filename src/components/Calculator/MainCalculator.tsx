/**
 * MainCalculator - LOCKED STRUCTURE
 * 
 * THE CORE STACK (DO NOT CHANGE ORDER):
 * 1. Expression (input)
 * 2. Result (output)
 * 3. Keypad (primary interaction)
 * 
 * Keypad is ALWAYS visible. Never hidden.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { CalculatorMode, CalculationResult, KeypadInput, KeypadAction, GraphFunction } from '../../types';
import { CalculatorDisplay } from './CalculatorDisplay';
import { CalculatorKeypad } from './CalculatorKeypad';
import { evaluate, createDefaultContext, type EvaluationContext } from '../../engine/evaluator';
import { parse, validate } from '../../engine/parser';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { GraphCanvas } from '../Graph/GraphCanvas';

interface MainCalculatorProps {
  mode: CalculatorMode;
  onCalculation: (expression: string, result: CalculationResult) => void;
  viewMode?: 'normal' | 'maximized' | 'compact';
  isFullscreen?: boolean;
}

export const MainCalculator: React.FC<MainCalculatorProps> = ({
  mode,
  onCalculation,
  viewMode = 'normal',
  isFullscreen = false,
}) => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [context] = useState<EvaluationContext>(() => createDefaultContext());
  const [precision] = useLocalStorage('calc_precision', 10);
  const [angleMode] = useLocalStorage<'degrees' | 'radians'>('calc_angle_mode', 'radians');
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  // Graphing state
  const [graphFunctions, setGraphFunctions] = useState<GraphFunction[]>([]);
  const [xRange, setXRange] = useState<[number, number]>([-10, 10]);
  const [yRange, setYRange] = useState<[number, number]>([-10, 10]);

  useEffect(() => {
    context.precision = precision;
    context.angleMode = angleMode;
  }, [context, precision, angleMode]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [mode]);

  // Handle keypad input
  const handleInput = useCallback((input: KeypadInput) => {
    setError(null);
    switch (input.type) {
      case 'digit':
        setExpression(prev => prev + input.value);
        break;
      case 'operator':
        setExpression(prev => prev + ' ' + input.value + ' ');
        break;
      case 'function':
        setExpression(prev => prev + input.value + '(');
        break;
      case 'constant':
        setExpression(prev => prev + input.value);
        break;
      case 'parenthesis':
        setExpression(prev => prev + input.value);
        break;
    }
    inputRef.current?.focus();
  }, []);

  // Evaluate expression
  const evaluateExpression = useCallback(() => {
    if (!expression.trim()) return;
    
    if (mode === 'graphing') {
      const cleanExpr = expression.replace(/^y\s*=\s*/i, '').trim();
      if (cleanExpr) {
        const newFunc: GraphFunction = {
          id: Date.now().toString(),
          expression: cleanExpr,
          visible: true,
          type: 'cartesian',
        };
        setGraphFunctions(prev => [...prev, newFunc]);
        setExpression('');
        setResult(`Plotted: y = ${cleanExpr}`);
        return;
      }
    }
    
    const validation = validate(expression);
    if (!validation.valid) {
      setError(validation.errors[0]?.message || 'Invalid expression');
      return;
    }
    
    setIsCalculating(true);
    setError(null);
    
    try {
      const ast = parse(expression);
      const value = evaluate(ast, context);
      const formatted = typeof value === 'number' 
        ? Number.isInteger(value) ? value.toString() : value.toFixed(context.precision).replace(/\.?0+$/, '')
        : String(value);
      
      setResult(formatted);
      onCalculation(expression, { value, type: 'number', formatted, precision: context.precision });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation error');
    } finally {
      setIsCalculating(false);
    }
  }, [expression, context, onCalculation, mode]);

  // Handle keypad actions
  const handleAction = useCallback((action: KeypadAction) => {
    switch (action.type) {
      case 'evaluate':
        evaluateExpression();
        break;
      case 'clear':
        setExpression('');
        setResult(null);
        setError(null);
        if (mode === 'graphing') setGraphFunctions([]);
        break;
      case 'clearEntry':
        setExpression('');
        break;
      case 'backspace':
        setExpression(prev => prev.slice(0, -1).trimEnd());
        break;
    }
    inputRef.current?.focus();
  }, [evaluateExpression, mode]);

  const handleRangeChange = useCallback((newXRange: [number, number], newYRange: [number, number]) => {
    setXRange(newXRange);
    setYRange(newYRange);
  }, []);

  const removeFunction = useCallback((id: string) => {
    setGraphFunctions(prev => prev.filter(fn => fn.id !== id));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target === inputRef.current) {
        if (e.key === 'Enter') {
          e.preventDefault();
          evaluateExpression();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          handleAction({ type: 'clear' });
        }
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        evaluateExpression();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleAction({ type: 'clear' });
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleAction({ type: 'backspace' });
      } else if (/^[0-9.]$/.test(e.key)) {
        handleInput({ type: 'digit', value: e.key });
      } else if (/^[+\-*/^%]$/.test(e.key)) {
        handleInput({ type: 'operator', value: e.key });
      } else if (e.key === '(' || e.key === ')') {
        handleInput({ type: 'parenthesis', value: e.key });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [evaluateExpression, handleAction, handleInput]);

  // GRAPHING MODE - Still has keypad for numeric input
  if (mode === 'graphing') {
    return (
      <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
        {/* Function Input */}
        <div className="flex-shrink-0 bg-slate-900 rounded-xl p-3">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-lg font-mono">y =</span>
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && evaluateExpression()}
              placeholder="x^2 + 2*x - 1"
              className="flex-1 bg-slate-800 text-white text-xl font-mono 
                       placeholder:text-slate-500 border border-slate-700 rounded-lg
                       px-3 py-2 outline-none focus:border-blue-500"
            />
            <button
              onClick={evaluateExpression}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold"
            >
              Plot
            </button>
          </div>
          {error && <div className="mt-2 text-red-400 text-sm">{error}</div>}
        </div>

        {/* Graph Canvas */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden min-h-[250px]">
          {graphFunctions.length > 0 ? (
            <GraphCanvas functions={graphFunctions} xRange={xRange} yRange={yRange} onRangeChange={handleRangeChange} width="100%" height="100%" />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-4">
              <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="font-medium">Enter a function to plot</p>
              <p className="text-sm">Try: <code className="bg-slate-100 px-1.5 py-0.5 rounded">x^2</code> or <code className="bg-slate-100 px-1.5 py-0.5 rounded">sin(x)</code></p>
            </div>
          )}
        </div>

        {/* Function List */}
        {graphFunctions.length > 0 && (
          <div className="flex-shrink-0 bg-white rounded-xl border border-slate-200 p-2 flex flex-wrap gap-2">
            {graphFunctions.map((fn, i) => (
              <div key={fn.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c'][i % 5] }} />
                <span className="text-sm font-mono">y = {fn.expression}</span>
                <button onClick={() => removeFunction(fn.id)} className="p-1 hover:bg-red-100 rounded text-red-500">×</button>
              </div>
            ))}
            <button onClick={() => setGraphFunctions([])} className="text-xs text-red-500 px-2">Clear All</button>
          </div>
        )}
      </div>
    );
  }

  // STANDARD CALCULATOR - THE LOCKED STACK
  // 1. Expression (input)
  // 2. Result (output)  
  // 3. Keypad (ALWAYS VISIBLE)
  return (
    <div className={`flex flex-col
                    ${viewMode === 'compact' ? 'max-w-md mx-auto w-full' : ''}
                    ${isFullscreen 
                      ? 'h-full p-4 md:p-6 lg:p-8' 
                      : 'h-full p-3 overflow-y-auto'}`}>
      
      {/* DISPLAY: Expression + Result - Fixed height, never shrinks */}
      <div className={`flex-shrink-0 ${isFullscreen ? 'mb-4 md:mb-6' : 'mb-3'}`}>
        <CalculatorDisplay
          expression={expression}
          result={result}
          error={error}
          isCalculating={isCalculating}
          mode={mode}
          inputRef={inputRef}
          onExpressionChange={setExpression}
          onSubmit={evaluateExpression}
          isFullscreen={isFullscreen}
        />
      </div>
      
      {/* KEYPAD: Primary interaction - ALWAYS VISIBLE */}
      <div className="flex-shrink-0">
        <CalculatorKeypad
          mode={mode}
          onInput={handleInput}
          onAction={handleAction}
          disabled={isCalculating}
          isFullscreen={isFullscreen}
        />
      </div>
    </div>
  );
};
