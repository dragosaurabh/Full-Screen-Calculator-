/**
 * Core TypeScript types for the Advanced Calculator application
 */

// Calculator modes
export type CalculatorMode =
  | 'basic'
  | 'scientific'
  | 'programmer'
  | 'graphing'
  | 'matrix'
  | 'complex'
  | 'statistics'
  | 'financial'
  | 'converter';

// Angle mode for trigonometric functions
export type AngleMode = 'degrees' | 'radians';

// Complex number representation
export interface Complex {
  real: number;
  imag: number;
}

// Matrix representation
export interface Matrix {
  rows: number;
  cols: number;
  data: number[][];
}

// Calculation result
export interface CalculationResult {
  value: number | bigint | Complex | Matrix | string;
  type: 'number' | 'bigint' | 'complex' | 'matrix' | 'string';
  formatted: string;
  precision: number;
}

// History entry
export interface HistoryEntry {
  id: string;
  expression: string;
  result: CalculationResult;
  mode: CalculatorMode;
  timestamp: number;
  pinned: boolean;
}

// Graph function
export interface GraphFunction {
  id: string;
  expression: string;
  color?: string;
  visible: boolean;
  type: 'cartesian' | 'parametric';
  parametricVar?: string;
}

// Calculator settings
export interface CalculatorSettings {
  precision: number;
  angleMode: AngleMode;
  decimalSeparator: '.' | ',';
  arbitraryPrecisionEnabled: boolean;
  thousandsSeparator: ',' | '.' | ' ' | '';
  highContrast: boolean;
  onboardingComplete: boolean;
  currencyApiEnabled: boolean;
}

// Memory state
export interface MemoryState {
  register: number;
  namedSlots: Record<string, number>;
}

// Custom function definition
export interface CustomFunction {
  name: string;
  params: string[];
  body: string;
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  message: string;
  position: { start: number; end: number };
}

// Token types for expression parsing
export type TokenType =
  | 'number'
  | 'operator'
  | 'function'
  | 'variable'
  | 'constant'
  | 'lparen'
  | 'rparen'
  | 'comma';

export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

// Position in source expression
export interface Position {
  start: number;
  end: number;
}

// AST Node types
export interface NumberNode {
  type: 'number';
  value: number;
  raw: string;
  position: Position;
}

export interface BinaryOpNode {
  type: 'binaryOp';
  operator: '+' | '-' | '*' | '/' | '^' | '%';
  left: ASTNodeType;
  right: ASTNodeType;
  position: Position;
}

export interface UnaryOpNode {
  type: 'unaryOp';
  operator: '-' | '+' | '!';
  operand: ASTNodeType;
  position: Position;
}

export interface FunctionCallNode {
  type: 'functionCall';
  name: string;
  args: ASTNodeType[];
  position: Position;
}

export interface VariableNode {
  type: 'variable';
  name: string;
  position: Position;
}

export interface ConstantNode {
  type: 'constant';
  name: 'pi' | 'e' | 'phi' | 'tau';
  value: number;
  position: Position;
}

export interface MatrixNode {
  type: 'matrix';
  rows: ASTNodeType[][];
  position: Position;
}

export interface ComplexNode {
  type: 'complex';
  real: ASTNodeType;
  imag: ASTNodeType;
  position: Position;
}

export type ASTNodeType =
  | NumberNode
  | BinaryOpNode
  | UnaryOpNode
  | FunctionCallNode
  | VariableNode
  | ConstantNode
  | MatrixNode
  | ComplexNode;

// Keypad input types
export type KeypadInput =
  | { type: 'digit'; value: string }
  | { type: 'operator'; value: string }
  | { type: 'function'; value: string }
  | { type: 'constant'; value: string }
  | { type: 'parenthesis'; value: '(' | ')' };

export type KeypadAction =
  | { type: 'evaluate' }
  | { type: 'clear' }
  | { type: 'clearEntry' }
  | { type: 'backspace' }
  | { type: 'memoryAdd' }
  | { type: 'memorySubtract' }
  | { type: 'memoryRecall' }
  | { type: 'memoryClear' }
  | { type: 'undo' }
  | { type: 'redo' };

// Web Worker message types
export interface WorkerRequest {
  id: string;
  type: 'evaluate' | 'graph' | 'matrix' | 'batch';
  payload: unknown;
}

export interface WorkerResponse {
  id: string;
  type: 'result' | 'error' | 'progress';
  payload: unknown;
}

// Specific worker request payloads
export interface EvaluatePayload {
  expression: string;
  precision: number;
  angleMode: AngleMode;
  usePrecisionMode: boolean;
  variables?: Record<string, number>;
}

export interface MatrixPayload {
  operation: 'multiply' | 'inverse' | 'determinant' | 'solve' | 'add' | 'subtract';
  matrices: Matrix[];
  constants?: number[]; // For solve operation
}

export interface GraphPayload {
  expression: string;
  xMin: number;
  xMax: number;
  numPoints: number;
  variables?: Record<string, number>;
}

export interface BatchPayload {
  expressions: string[];
  precision: number;
  angleMode: AngleMode;
  usePrecisionMode: boolean;
}

// Worker result types
export interface EvaluateResult {
  value: number | string;
  formatted: string;
}

export interface MatrixResult {
  result: Matrix | number | number[];
  type: 'matrix' | 'number' | 'array';
}

export interface GraphResult {
  points: Array<{ x: number; y: number | null }>;
  hasDiscontinuities: boolean;
}

export interface BatchResult {
  results: Array<{ value: number | string; formatted: string } | { error: string }>;
}

export interface ProgressPayload {
  current: number;
  total: number;
  message?: string;
}

// Keyboard shortcut definition
export interface KeyboardShortcut {
  key: string;
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  action: () => void;
  description: string;
}

// Unit converter types
export interface UnitInfo {
  id: string;
  name: string;
  symbol: string;
  category: string;
}

// Financial calculator types
export interface AmortizationEntry {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

// localStorage keys
export const STORAGE_KEYS = {
  SETTINGS: 'calc_settings',
  HISTORY: 'calc_history',
  MEMORY: 'calc_memory',
  VARIABLES: 'calc_variables',
  FUNCTIONS: 'calc_functions',
  ONBOARDING: 'calc_onboarding',
} as const;
