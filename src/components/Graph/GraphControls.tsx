/**
 * GraphControls Component
 * 
 * Controls for managing graph functions and range.
 * Expression input with validation, series visibility toggles.
 * 
 * Validates: Requirements 4.1, 4.6
 */

import React, { useState, useCallback } from 'react';
import type { GraphFunction } from '../../types';
import { IconButton } from '../Shared';

export interface GraphControlsProps {
  functions: GraphFunction[];
  onAddFunction: (expr: string) => void;
  onRemoveFunction: (id: string) => void;
  onToggleFunction: (id: string) => void;
  xRange: [number, number];
  yRange: [number, number];
  onRangeChange: (xRange: [number, number], yRange: [number, number]) => void;
}

// Generate unique ID for functions
let functionIdCounter = 0;
export function generateFunctionId(): string {
  return `fn_${++functionIdCounter}_${Date.now()}`;
}

export function GraphControls({
  functions,
  onAddFunction,
  onRemoveFunction,
  onToggleFunction,
  xRange,
  yRange,
  onRangeChange,
}: GraphControlsProps): React.ReactElement {
  const [newExpression, setNewExpression] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddFunction = useCallback(() => {
    const expr = newExpression.trim();
    if (!expr) {
      setError('Please enter an expression');
      return;
    }
    
    // Basic validation - try to evaluate at x=0
    try {
      const testExpr = expr
        .replace(/\bx\b/g, '(0)')
        .replace(/\bsin\b/g, 'Math.sin')
        .replace(/\bcos\b/g, 'Math.cos')
        .replace(/\btan\b/g, 'Math.tan')
        .replace(/\bsqrt\b/g, 'Math.sqrt')
        .replace(/\babs\b/g, 'Math.abs')
        .replace(/\bexp\b/g, 'Math.exp')
        .replace(/\blog\b/g, 'Math.log')
        .replace(/\bln\b/g, 'Math.log')
        .replace(/\bpi\b/gi, 'Math.PI')
        .replace(/\be\b/g, 'Math.E')
        .replace(/\^/g, '**');
      
      // eslint-disable-next-line no-eval
      const result = eval(testExpr);
      if (typeof result !== 'number') {
        setError('Invalid expression');
        return;
      }
    } catch {
      setError('Invalid expression syntax');
      return;
    }
    
    setError(null);
    onAddFunction(expr);
    setNewExpression('');
  }, [newExpression, onAddFunction]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddFunction();
    }
  }, [handleAddFunction]);

  const handleXRangeChange = useCallback((index: 0 | 1, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      const newRange: [number, number] = [...xRange] as [number, number];
      newRange[index] = num;
      if (newRange[0] < newRange[1]) {
        onRangeChange(newRange, yRange);
      }
    }
  }, [xRange, yRange, onRangeChange]);

  const handleYRangeChange = useCallback((index: 0 | 1, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      const newRange: [number, number] = [...yRange] as [number, number];
      newRange[index] = num;
      if (newRange[0] < newRange[1]) {
        onRangeChange(xRange, newRange);
      }
    }
  }, [xRange, yRange, onRangeChange]);

  const handleAutoRange = useCallback(() => {
    onRangeChange([-10, 10], [-10, 10]);
  }, [onRangeChange]);

  return (
    <div className="graph-controls p-4 bg-gray-50 rounded-lg space-y-4">
      {/* Expression Input */}
      <div className="space-y-2">
        <label htmlFor="expression-input" className="block text-sm font-medium text-gray-700">
          Add Function
        </label>
        <div className="flex gap-2">
          <input
            id="expression-input"
            type="text"
            value={newExpression}
            onChange={(e) => setNewExpression(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., sin(x), x^2, 2*x + 1"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-describedby={error ? 'expression-error' : undefined}
          />
          <button
            onClick={handleAddFunction}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Add function"
          >
            Add
          </button>
        </div>
        {error && (
          <p id="expression-error" className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Function List */}
      {functions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Functions</h3>
          <ul className="space-y-1" role="list" aria-label="Graph functions">
            {functions.map((fn) => (
              <li
                key={fn.id}
                className="flex items-center gap-2 p-2 bg-white rounded border"
              >
                <button
                  onClick={() => onToggleFunction(fn.id)}
                  className={`w-4 h-4 rounded border-2 ${
                    fn.visible ? 'bg-current' : 'bg-white'
                  }`}
                  style={{ borderColor: fn.color, backgroundColor: fn.visible ? fn.color : 'white' }}
                  aria-label={`${fn.visible ? 'Hide' : 'Show'} ${fn.expression}`}
                  aria-pressed={fn.visible}
                />
                <span className="flex-1 font-mono text-sm truncate" title={fn.expression}>
                  y = {fn.expression}
                </span>
                <IconButton
                  icon={<span aria-hidden="true">×</span>}
                  aria-label={`Remove ${fn.expression}`}
                  onClick={() => onRemoveFunction(fn.id)}
                  variant="ghost"
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Range Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">X Range</label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={xRange[0]}
              onChange={(e) => handleXRangeChange(0, e.target.value)}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              aria-label="X minimum"
            />
            <span>to</span>
            <input
              type="number"
              value={xRange[1]}
              onChange={(e) => handleXRangeChange(1, e.target.value)}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              aria-label="X maximum"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Y Range</label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={yRange[0]}
              onChange={(e) => handleYRangeChange(0, e.target.value)}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              aria-label="Y minimum"
            />
            <span>to</span>
            <input
              type="number"
              value={yRange[1]}
              onChange={(e) => handleYRangeChange(1, e.target.value)}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              aria-label="Y maximum"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleAutoRange}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        Reset to default range
      </button>
    </div>
  );
}

export default GraphControls;
