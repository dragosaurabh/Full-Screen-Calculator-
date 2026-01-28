/**
 * Display Component
 * 
 * Renders the current expression and result.
 * Handles number formatting based on precision and locale settings.
 * Announces results to screen readers via ARIA live regions.
 * Validates: Requirements 11.3, 18.1, 18.4
 */

import React from 'react';
import type { CalculationResult } from '../../types';

interface DisplayProps {
  expression: string;
  result: CalculationResult | null;
  error: string | null;
  isLoading: boolean;
  precision: number;
  locale: string;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  error,
  isLoading,
  precision,
  locale
}) => {
  // Format number based on locale and precision
  const formatResult = (value: CalculationResult['value']): string => {
    if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        return Number.isNaN(value) ? 'Error' : value > 0 ? '∞' : '-∞';
      }
      
      try {
        return new Intl.NumberFormat(locale, {
          maximumSignificantDigits: precision,
          useGrouping: true
        }).format(value);
      } catch {
        return value.toPrecision(precision);
      }
    }
    
    if (typeof value === 'bigint') {
      return value.toString();
    }
    
    if (typeof value === 'string') {
      return value;
    }
    
    // Complex or Matrix
    if ('real' in value && 'imag' in value) {
      const { real, imag } = value;
      if (imag === 0) return real.toString();
      if (real === 0) return `${imag}i`;
      const sign = imag >= 0 ? '+' : '';
      return `${real}${sign}${imag}i`;
    }
    
    // Matrix
    if ('rows' in value && 'cols' in value) {
      return `[${value.rows}×${value.cols} matrix]`;
    }
    
    return String(value);
  };

  return (
    <div 
      className="display bg-white dark:bg-gray-800 rounded-lg p-4 shadow-inner"
      role="region"
      aria-label="Calculator display"
    >
      {/* Expression */}
      <div 
        className="expression text-right text-gray-600 dark:text-gray-400 text-lg min-h-[1.75rem] font-mono overflow-x-auto"
        aria-label="Current expression"
      >
        {expression || '\u00A0'}
      </div>
      
      {/* Result */}
      <div 
        className="result text-right text-3xl font-bold min-h-[2.5rem] mt-2"
        aria-live="polite"
        aria-atomic="true"
      >
        {isLoading ? (
          <span className="text-gray-400 animate-pulse">Calculating...</span>
        ) : error ? (
          <span className="text-red-500" role="alert">{error}</span>
        ) : result ? (
          <span className="text-gray-900 dark:text-white">
            {formatResult(result.value)}
          </span>
        ) : (
          <span className="text-gray-400">0</span>
        )}
      </div>
      
      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="assertive">
        {result && !error && !isLoading && (
          `Result: ${formatResult(result.value)}`
        )}
        {error && `Error: ${error}`}
      </div>
    </div>
  );
};

export default Display;
