/**
 * Batch Calculator
 * 
 * Handles CSV import/export and batch calculation operations.
 * Validates: Requirements 12.1, 12.2, 12.3, 12.4
 */

import { evaluateExpression, createDefaultContext } from './evaluator';
import type { CalculationResult, CalculatorSettings } from '../types';

export interface BatchResult {
  expression: string;
  result: CalculationResult | null;
  error: string | null;
  rowIndex: number;
}

export interface BatchCalculationResult {
  results: BatchResult[];
  successCount: number;
  errorCount: number;
}

/**
 * Parse CSV content into rows
 */
export function parseCSV(content: string): string[][] {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  return lines.map(line => {
    // Simple CSV parsing - handles basic cases
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cells.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    cells.push(current.trim());
    
    return cells;
  });
}

/**
 * Evaluate a batch of expressions from CSV
 */
export function evaluateBatch(
  expressions: string[],
  settings?: Partial<CalculatorSettings>
): BatchCalculationResult {
  const results: BatchResult[] = [];
  let successCount = 0;
  let errorCount = 0;
  
  const context = createDefaultContext();
  context.angleMode = settings?.angleMode || 'radians';
  context.precision = settings?.precision || 10;
  
  for (let i = 0; i < expressions.length; i++) {
    const expression = expressions[i]?.trim() || '';
    
    if (!expression) {
      results.push({
        expression: '',
        result: null,
        error: 'Empty expression',
        rowIndex: i,
      });
      errorCount++;
      continue;
    }
    
    try {
      const result = evaluateExpression(expression, context);
      
      results.push({
        expression,
        result,
        error: null,
        rowIndex: i,
      });
      successCount++;
    } catch (err) {
      results.push({
        expression,
        result: null,
        error: err instanceof Error ? err.message : 'Evaluation error',
        rowIndex: i,
      });
      errorCount++;
    }
  }
  
  return { results, successCount, errorCount };
}

/**
 * Import CSV file and evaluate expressions
 */
export function importCSV(
  content: string,
  expressionColumn: number = 0,
  hasHeader: boolean = false,
  settings?: Partial<CalculatorSettings>
): BatchCalculationResult {
  const rows = parseCSV(content);
  
  // Skip header row if specified
  const dataRows = hasHeader ? rows.slice(1) : rows;
  
  // Extract expressions from specified column
  const expressions = dataRows.map(row => row[expressionColumn] || '');
  
  return evaluateBatch(expressions, settings);
}

/**
 * Export batch results to CSV format
 */
export function exportResultsToCSV(
  results: BatchResult[],
  includeErrors: boolean = true
): string {
  const header = 'Expression,Result,Error';
  const rows = results.map(r => {
    const expression = `"${r.expression.replace(/"/g, '""')}"`;
    const result = r.result ? `"${r.result.formatted}"` : '';
    const error = includeErrors && r.error ? `"${r.error.replace(/"/g, '""')}"` : '';
    return `${expression},${result},${error}`;
  });
  
  return [header, ...rows].join('\n');
}

/**
 * Export graph data to CSV format
 */
export function exportGraphDataToCSV(
  xValues: number[],
  yValues: number[],
  functionName: string = 'f(x)'
): string {
  const header = `x,${functionName}`;
  const rows = xValues.map((x, i) => `${x},${yValues[i]}`);
  
  return [header, ...rows].join('\n');
}

/**
 * Export all user data to JSON format
 */
export function exportUserData(): string {
  const data: Record<string, unknown> = {};
  
  // Collect all localStorage data
  const keys = ['calc_settings', 'calc_history', 'calc_memory', 'calc_variables', 'calc_functions'];
  
  for (const key of keys) {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        data[key] = JSON.parse(value);
      }
    } catch {
      // Skip invalid data
    }
  }
  
  return JSON.stringify(data, null, 2);
}

/**
 * Import user data from JSON format
 */
export function importUserData(jsonContent: string): boolean {
  try {
    const data = JSON.parse(jsonContent) as Record<string, unknown>;
    
    // Restore each key
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith('calc_') && value !== null) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
    
    return true;
  } catch {
    return false;
  }
}
