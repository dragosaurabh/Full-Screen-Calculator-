/**
 * Number and Result Formatters
 * 
 * Utilities for formatting calculation results based on precision and locale settings.
 * Validates: Requirements 11.3
 */

import type { CalculationResult, CalculatorSettings, Complex, Matrix } from '../types';
import { Decimal } from 'decimal.js';

/**
 * Format a number according to locale and precision settings
 */
export function formatNumber(
  value: number,
  precision: number,
  decimalSeparator: '.' | ',' = '.',
  thousandsSeparator: ',' | '.' | ' ' | '' = ','
): string {
  // Handle special values
  if (!Number.isFinite(value)) {
    if (Number.isNaN(value)) return 'NaN';
    return value > 0 ? '∞' : '-∞';
  }

  // Format with precision
  const formatted = value.toPrecision(precision);
  
  // Apply locale separators
  const [intPart, decPart] = formatted.split('.');
  
  // Add thousands separator
  const intWithSeparator = thousandsSeparator && intPart
    ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator)
    : intPart ?? '';
  
  // Combine with decimal separator
  return decPart ? `${intWithSeparator}${decimalSeparator}${decPart}` : intWithSeparator;
}

/**
 * Format a complex number
 */
export function formatComplex(value: Complex, precision: number): string {
  const realStr = formatNumber(value.real, precision);
  const imagStr = formatNumber(Math.abs(value.imag), precision);
  const sign = value.imag >= 0 ? '+' : '-';
  
  if (value.imag === 0) return realStr;
  if (value.real === 0) return `${value.imag >= 0 ? '' : '-'}${imagStr}i`;
  
  return `${realStr} ${sign} ${imagStr}i`;
}

/**
 * Format a matrix
 */
export function formatMatrix(value: Matrix, precision: number): string {
  const rows = value.data.map(row =>
    row.map(cell => formatNumber(cell, precision)).join(', ')
  );
  return `[${rows.map(r => `[${r}]`).join(', ')}]`;
}

/**
 * Format a calculation result
 */
export function formatResult(
  result: CalculationResult,
  settings: Pick<CalculatorSettings, 'precision' | 'decimalSeparator' | 'thousandsSeparator'>
): string {
  const { precision, decimalSeparator, thousandsSeparator } = settings;
  
  switch (result.type) {
    case 'number':
      return formatNumber(result.value as number, precision, decimalSeparator, thousandsSeparator);
    case 'bigint':
      return (result.value as bigint).toString();
    case 'complex':
      return formatComplex(result.value as Complex, precision);
    case 'matrix':
      return formatMatrix(result.value as Matrix, precision);
    case 'string':
      return result.value as string;
    default:
      return String(result.value);
  }
}

/**
 * Format a number in scientific notation
 */
export function formatScientific(value: number, precision: number): string {
  return value.toExponential(precision - 1);
}

/**
 * Format a number in engineering notation (exponent is multiple of 3)
 */
export function formatEngineering(value: number, precision: number): string {
  if (value === 0) return '0';
  
  const exp = Math.floor(Math.log10(Math.abs(value)));
  const engExp = Math.floor(exp / 3) * 3;
  const mantissa = value / Math.pow(10, engExp);
  
  return `${mantissa.toPrecision(precision)}e${engExp >= 0 ? '+' : ''}${engExp}`;
}

/**
 * Format a number to a specific number of significant digits
 * Validates: Requirements 11.3
 */
export function formatToSignificantDigits(
  value: number | Decimal,
  significantDigits: number,
  decimalSeparator: '.' | ',' = '.',
  thousandsSeparator: ',' | '.' | ' ' | '' = ','
): string {
  // Convert to Decimal for consistent handling
  const decimal = value instanceof Decimal ? value : new Decimal(value);
  
  // Handle special values
  if (!decimal.isFinite()) {
    if (decimal.isNaN()) return 'NaN';
    return decimal.isPositive() ? '∞' : '-∞';
  }
  
  // Handle zero
  if (decimal.isZero()) return '0';
  
  // Format to significant digits
  const formatted = decimal.toSignificantDigits(significantDigits).toString();
  
  // Apply locale separators if needed
  return applyLocaleSeparators(formatted, decimalSeparator, thousandsSeparator);
}

/**
 * Apply locale-specific separators to a formatted number string
 */
export function applyLocaleSeparators(
  formatted: string,
  decimalSeparator: '.' | ',' = '.',
  thousandsSeparator: ',' | '.' | ' ' | '' = ','
): string {
  // Handle scientific notation
  const eIndex = formatted.toLowerCase().indexOf('e');
  let mantissa = formatted;
  let exponent = '';
  
  if (eIndex !== -1) {
    mantissa = formatted.substring(0, eIndex);
    exponent = formatted.substring(eIndex);
  }
  
  // Split into integer and decimal parts
  const [intPart, decPart] = mantissa.split('.');
  
  // Add thousands separator to integer part
  let intWithSeparator = intPart ?? '';
  if (thousandsSeparator && intPart) {
    // Handle negative sign
    const isNegative = intPart.startsWith('-');
    const absInt = isNegative ? intPart.substring(1) : intPart;
    const formatted = absInt.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    intWithSeparator = isNegative ? `-${formatted}` : formatted;
  }
  
  // Combine with decimal separator
  let result = decPart ? `${intWithSeparator}${decimalSeparator}${decPart}` : intWithSeparator;
  
  // Add back exponent if present
  if (exponent) {
    result += exponent;
  }
  
  return result;
}

/**
 * Format a Decimal value for display with precision settings
 * Validates: Requirements 11.3
 */
export function formatPrecisionDisplay(
  value: Decimal,
  settings: Pick<CalculatorSettings, 'precision' | 'decimalSeparator' | 'thousandsSeparator'>
): string {
  return formatToSignificantDigits(
    value,
    settings.precision,
    settings.decimalSeparator,
    settings.thousandsSeparator
  );
}

/**
 * Determine if a number should be displayed in scientific notation
 * based on its magnitude and the display width
 */
export function shouldUseScientificNotation(
  value: number | Decimal,
  maxDisplayDigits: number = 15
): boolean {
  const decimal = value instanceof Decimal ? value : new Decimal(value);
  
  if (!decimal.isFinite() || decimal.isZero()) return false;
  
  const absValue = decimal.abs();
  const exponent = absValue.log(10).floor().toNumber();
  
  // Use scientific notation for very large or very small numbers
  return exponent >= maxDisplayDigits || exponent < -4;
}

/**
 * Format a number with automatic notation selection
 * Uses scientific notation for very large/small numbers
 */
export function formatAutoNotation(
  value: number | Decimal,
  precision: number,
  decimalSeparator: '.' | ',' = '.',
  thousandsSeparator: ',' | '.' | ' ' | '' = ','
): string {
  const decimal = value instanceof Decimal ? value : new Decimal(value);
  
  if (!decimal.isFinite()) {
    if (decimal.isNaN()) return 'NaN';
    return decimal.isPositive() ? '∞' : '-∞';
  }
  
  if (decimal.isZero()) return '0';
  
  if (shouldUseScientificNotation(decimal, precision)) {
    // Use scientific notation
    return decimal.toExponential(precision - 1);
  }
  
  // Use standard notation
  return formatToSignificantDigits(decimal, precision, decimalSeparator, thousandsSeparator);
}
