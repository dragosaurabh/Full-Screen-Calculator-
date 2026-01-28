/**
 * CalculatorShell Component
 * 
 * Main container component that orchestrates all calculator functionality.
 * Manages mode switching, panel visibility, and keyboard shortcuts.
 * Validates: Requirements 16.1, 16.2, 16.3
 */

import React, { useState, useCallback, useEffect } from 'react';
import type { CalculatorMode, CalculationResult, KeypadInput, KeypadAction } from '../../types';
import { Display } from './Display';
import { Keypad } from './Keypad';
import { ModeSwitcher } from './ModeSwitcher';
import { evaluate, createDefaultContext, type EvaluationContext } from '../../engine/evaluator';
import { parse, validate } from '../../engine/parser';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface CalculatorShellProps {
  initialMode?: CalculatorMode;
}

export const CalculatorShell: React.FC<CalculatorShellProps> = ({
  initialMode = 'basic'
}) => {
  // State
  const [mode, setMode] = useLocalStorage<CalculatorMode>('calc_mode', initialMode);
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [context] = useState<EvaluationContext>(() => createDefaultContext());
  const [precision] = useLocalStorage('calc_precision', 10);
  const [angleMode] = useLocalStorage<'degrees' | 'radians'>('calc_angle_mode', 'radians');
  
  // Update context when settings change
  useEffect(() => {
    context.precision = precision;
    context.angleMode = angleMode;
  }, [context, precision, angleMode]);

  // Handle input from keypad
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
  }, []);

  // Handle actions from keypad
  const handleAction = useCallback((action: KeypadAction) => {
    switch (action.type) {
      case 'evaluate':
        if (!expression.trim()) return;
        
        // Validate first
        const validation = validate(expression);
        if (!validation.valid) {
          setError(validation.errors[0]?.message || 'Invalid expression');
          return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
          const ast = parse(expression);
          const value = evaluate(ast, context);
          
          setResult({
            value,
            type: 'number',
            formatted: value.toString(),
            precision: context.precision
          });
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Calculation error');
        } finally {
          setIsLoading(false);
        }
        break;
        
      case 'clear':
        setExpression('');
        setResult(null);
        setError(null);
        break;
        
      case 'clearEntry':
        setExpression('');
        break;
        
      case 'backspace':
        setExpression(prev => prev.slice(0, -1).trimEnd());
        break;
        
      case 'undo':
        // TODO: Implement undo
        break;
        
      case 'redo':
        // TODO: Implement redo
        break;
        
      default:
        break;
    }
  }, [expression, context]);

  // Detect if user is on Mac
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Mode switching with Alt+1-9 (Windows/Linux) or Ctrl+1-9 (Mac)
      // Using Ctrl on Mac because Cmd+number is reserved by browser
      const modifierKey = isMac ? e.ctrlKey : e.altKey;
      if (modifierKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const modeIndex = parseInt(e.key) - 1;
        const modes: CalculatorMode[] = [
          'basic', 'scientific', 'programmer', 'graphing', 'matrix',
          'complex', 'statistics', 'financial', 'converter'
        ];
        if (modes[modeIndex]) {
          setMode(modes[modeIndex]);
        }
        return;
      }
      
      // Enter to evaluate
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAction({ type: 'evaluate' });
        return;
      }
      
      // Escape to clear
      if (e.key === 'Escape') {
        e.preventDefault();
        handleAction({ type: 'clear' });
        return;
      }
      
      // Backspace
      if (e.key === 'Backspace') {
        e.preventDefault();
        handleAction({ type: 'backspace' });
        return;
      }
      
      // Number and operator keys
      if (/^[0-9.]$/.test(e.key)) {
        handleInput({ type: 'digit', value: e.key });
      } else if (/^[+\-*/^%]$/.test(e.key)) {
        handleInput({ type: 'operator', value: e.key });
      } else if (e.key === '(' || e.key === ')') {
        handleInput({ type: 'parenthesis', value: e.key });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAction, handleInput, setMode]);

  return (
    <main 
      className="calculator-shell max-w-md mx-auto p-4"
      role="application"
      aria-label="Calculator"
    >
      {/* Mode Switcher */}
      <nav className="mb-4" aria-label="Calculator modes">
        <ModeSwitcher currentMode={mode} onModeChange={setMode} />
      </nav>
      
      {/* Display */}
      <section className="mb-4" aria-label="Calculator display">
        <Display
          expression={expression}
          result={result}
          error={error}
          isLoading={isLoading}
          precision={precision}
          locale="en-US"
        />
      </section>
      
      {/* Keypad */}
      <section aria-label="Calculator keypad">
        <Keypad
          mode={mode}
          onInput={handleInput}
          onAction={handleAction}
          disabled={isLoading}
        />
      </section>
    </main>
  );
};

export default CalculatorShell;
