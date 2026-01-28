/**
 * Mathematical and Application Constants
 * 
 * High-precision mathematical constants and application configuration values.
 */

/**
 * Mathematical constants with 15+ significant digit accuracy
 */
export const MATH_CONSTANTS = {
  /** Pi (π) - ratio of circumference to diameter */
  PI: 3.141592653589793,
  
  /** Euler's number (e) - base of natural logarithm */
  E: 2.718281828459045,
  
  /** Golden ratio (φ) - (1 + √5) / 2 */
  PHI: 1.618033988749895,
  
  /** Tau (τ) - 2π, full circle in radians */
  TAU: 6.283185307179586,
  
  /** Square root of 2 */
  SQRT2: 1.4142135623730951,
  
  /** Square root of 3 */
  SQRT3: 1.7320508075688772,
  
  /** Natural logarithm of 2 */
  LN2: 0.6931471805599453,
  
  /** Natural logarithm of 10 */
  LN10: 2.302585092994046,
} as const;

/**
 * Default calculator settings
 */
export const DEFAULT_SETTINGS = {
  precision: 10,
  angleMode: 'radians' as const,
  decimalSeparator: '.' as const,
  thousandsSeparator: ',' as const,
  highContrast: false,
  onboardingComplete: false,
  currencyApiEnabled: false,
};

/**
 * Supported number bases for programmer mode
 */
export const NUMBER_BASES = {
  BINARY: 2,
  OCTAL: 8,
  DECIMAL: 10,
  HEXADECIMAL: 16,
} as const;

/**
 * Bit width options for programmer mode
 */
export const BIT_WIDTHS = [8, 16, 32, 64] as const;

/**
 * Maximum history entries to store
 */
export const MAX_HISTORY_ENTRIES = 100;

/**
 * Maximum named memory slots
 */
export const MAX_MEMORY_SLOTS = 10;

/**
 * Keyboard shortcut definitions
 */
export const KEYBOARD_SHORTCUTS = {
  EVALUATE: 'Enter',
  UNDO: 'z',
  REDO: 'y',
  TOGGLE_HISTORY: 'h',
  TOGGLE_GRAPH: 'g',
  TOGGLE_MEMORY: 'm',
  MODE_1: '1',
  MODE_2: '2',
  MODE_3: '3',
  MODE_4: '4',
  MODE_5: '5',
  MODE_6: '6',
  MODE_7: '7',
  MODE_8: '8',
  MODE_9: '9',
} as const;

/**
 * Responsive breakpoints (in pixels)
 */
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1280,
} as const;

/**
 * Minimum touch target size (in pixels) for accessibility
 */
export const MIN_TOUCH_TARGET = 44;

/**
 * Graph color palette for multiple series
 */
export const GRAPH_COLORS = [
  '#2563eb', // blue
  '#dc2626', // red
  '#16a34a', // green
  '#9333ea', // purple
  '#ea580c', // orange
  '#0891b2', // cyan
  '#be185d', // pink
  '#65a30d', // lime
] as const;

/**
 * Error codes for calculator errors
 */
export const ERROR_CODES = {
  // Parsing errors
  PARSE_UNBALANCED_PARENS: 'PARSE_UNBALANCED_PARENS',
  PARSE_INVALID_OPERATOR: 'PARSE_INVALID_OPERATOR',
  PARSE_UNKNOWN_FUNCTION: 'PARSE_UNKNOWN_FUNCTION',
  PARSE_INVALID_NUMBER: 'PARSE_INVALID_NUMBER',
  PARSE_MISSING_OPERAND: 'PARSE_MISSING_OPERAND',
  
  // Calculation errors
  CALC_DIV_ZERO: 'CALC_DIV_ZERO',
  CALC_OVERFLOW: 'CALC_OVERFLOW',
  CALC_UNDERFLOW: 'CALC_UNDERFLOW',
  CALC_DOMAIN: 'CALC_DOMAIN',
  CALC_FACTORIAL_NEG: 'CALC_FACTORIAL_NEG',
  
  // Matrix errors
  MATRIX_SINGULAR: 'MATRIX_SINGULAR',
  MATRIX_DIM_MISMATCH: 'MATRIX_DIM_MISMATCH',
  MATRIX_NOT_SQUARE: 'MATRIX_NOT_SQUARE',
  
  // Financial errors
  FIN_NEG_PERIODS: 'FIN_NEG_PERIODS',
  FIN_INVALID_RATE: 'FIN_INVALID_RATE',
  FIN_NO_SOLUTION: 'FIN_NO_SOLUTION',
  
  // Storage errors
  STORAGE_QUOTA: 'STORAGE_QUOTA',
  IMPORT_PARSE: 'IMPORT_PARSE',
  STORAGE_CORRUPT: 'STORAGE_CORRUPT',
} as const;
