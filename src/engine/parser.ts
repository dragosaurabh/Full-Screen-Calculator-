/**
 * Expression Parser
 * 
 * Handles tokenization and parsing of mathematical expressions into AST.
 * Validates: Requirements 10.1, 10.2, 10.7
 */

import type { Token, TokenType, ASTNodeType, ValidationResult, ValidationError, Position } from '../types';

// Known functions
const FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
  'exp', 'ln', 'log', 'log10', 'log2',
  'sqrt', 'cbrt', 'abs', 'floor', 'ceil', 'round',
  'factorial', 'gamma',
  'min', 'max', 'pow', 'root'
]);

// Known constants
const CONSTANTS: Record<string, number> = {
  'pi': Math.PI,
  'e': Math.E,
  'phi': (1 + Math.sqrt(5)) / 2, // Golden ratio
  'tau': 2 * Math.PI
};

// Operator precedence
const PRECEDENCE: Record<string, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '%': 2,
  '^': 3
};

/**
 * Tokenize an expression string into tokens
 * Handles implicit multiplication (e.g., "2x" → "2 * x", "3(4)" → "3 * (4)")
 */
export function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  
  const addToken = (type: TokenType, value: string, position: number) => {
    tokens.push({ type, value, position });
  };
  
  const shouldInsertMultiplication = (): boolean => {
    if (tokens.length === 0) return false;
    const lastToken = tokens[tokens.length - 1];
    if (!lastToken) return false;
    return lastToken.type === 'number' || 
           lastToken.type === 'rparen' || 
           lastToken.type === 'variable' ||
           lastToken.type === 'constant';
  };
  
  while (i < expression.length) {
    const char = expression[i];
    
    // Skip whitespace
    if (char === undefined || /\s/.test(char)) {
      i++;
      continue;
    }
    
    // Numbers (including decimals and scientific notation)
    if (/[0-9.]/.test(char)) {
      const start = i;
      let numStr = '';
      
      // Integer or decimal part
      while (i < expression.length && /[0-9.]/.test(expression[i] ?? '')) {
        numStr += expression[i];
        i++;
      }
      
      // Scientific notation
      if (i < expression.length && /[eE]/.test(expression[i] ?? '')) {
        numStr += expression[i];
        i++;
        if (i < expression.length && /[+-]/.test(expression[i] ?? '')) {
          numStr += expression[i];
          i++;
        }
        while (i < expression.length && /[0-9]/.test(expression[i] ?? '')) {
          numStr += expression[i];
          i++;
        }
      }
      
      addToken('number', numStr, start);
      continue;
    }
    
    // Operators
    if (/[+\-*/%^]/.test(char)) {
      addToken('operator', char, i);
      i++;
      continue;
    }
    
    // Parentheses
    if (char === '(') {
      // Insert implicit multiplication before opening paren
      if (shouldInsertMultiplication()) {
        addToken('operator', '*', i);
      }
      addToken('lparen', '(', i);
      i++;
      continue;
    }
    
    if (char === ')') {
      addToken('rparen', ')', i);
      i++;
      continue;
    }
    
    // Comma
    if (char === ',') {
      addToken('comma', ',', i);
      i++;
      continue;
    }
    
    // Identifiers (functions, variables, constants)
    if (/[a-zA-Z_]/.test(char)) {
      const start = i;
      let identifier = '';
      
      while (i < expression.length && /[a-zA-Z0-9_]/.test(expression[i] ?? '')) {
        identifier += expression[i];
        i++;
      }
      
      const lowerIdentifier = identifier.toLowerCase();
      
      // Check if it's a function
      if (FUNCTIONS.has(lowerIdentifier)) {
        // Insert implicit multiplication before function
        if (shouldInsertMultiplication()) {
          addToken('operator', '*', start);
        }
        addToken('function', lowerIdentifier, start);
      }
      // Check if it's a constant
      else if (lowerIdentifier in CONSTANTS) {
        // Insert implicit multiplication before constant
        if (shouldInsertMultiplication()) {
          addToken('operator', '*', start);
        }
        addToken('constant', lowerIdentifier, start);
      }
      // Otherwise it's a variable
      else {
        // Insert implicit multiplication before variable
        if (shouldInsertMultiplication()) {
          addToken('operator', '*', start);
        }
        addToken('variable', identifier, start);
      }
      continue;
    }
    
    // Unknown character - skip it
    i++;
  }
  
  return tokens;
}

/**
 * Parser class for converting tokens to AST
 */
class Parser {
  private tokens: Token[];
  private pos: number;
  
  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.pos = 0;
  }
  
  private current(): Token | undefined {
    return this.tokens[this.pos];
  }
  
  private advance(): Token | undefined {
    return this.tokens[this.pos++];
  }
  
  private expect(type: TokenType): Token {
    const token = this.current();
    if (!token || token.type !== type) {
      throw new Error(`Expected ${type} but got ${token?.type ?? 'end of input'}`);
    }
    this.advance();
    return token;
  }
  
  /**
   * Parse the expression
   * Grammar:
   *   expression = term (('+' | '-') term)*
   *   term = factor (('*' | '/' | '%') factor)*
   *   factor = base ('^' factor)?
   *   base = unary | primary
   *   unary = ('+' | '-') unary | primary
   *   primary = number | constant | variable | function_call | '(' expression ')'
   */
  parse(): ASTNodeType {
    const result = this.parseExpression();
    if (this.current()) {
      throw new Error(`Unexpected token: ${this.current()?.value}`);
    }
    return result;
  }
  
  private parseExpression(): ASTNodeType {
    let left = this.parseTerm();
    
    while (this.current()?.type === 'operator' && 
           (this.current()?.value === '+' || this.current()?.value === '-')) {
      const op = this.advance()!;
      const right = this.parseTerm();
      const position: Position = { start: (left as { position: Position }).position.start, end: (right as { position: Position }).position.end };
      left = {
        type: 'binaryOp',
        operator: op.value as '+' | '-',
        left,
        right,
        position
      };
    }
    
    return left;
  }
  
  private parseTerm(): ASTNodeType {
    let left = this.parseFactor();
    
    while (this.current()?.type === 'operator' && 
           (this.current()?.value === '*' || this.current()?.value === '/' || this.current()?.value === '%')) {
      const op = this.advance()!;
      const right = this.parseFactor();
      const position: Position = { start: (left as { position: Position }).position.start, end: (right as { position: Position }).position.end };
      left = {
        type: 'binaryOp',
        operator: op.value as '*' | '/' | '%',
        left,
        right,
        position
      };
    }
    
    return left;
  }
  
  private parseFactor(): ASTNodeType {
    const base = this.parseUnary();
    
    if (this.current()?.type === 'operator' && this.current()?.value === '^') {
      this.advance();
      const exponent = this.parseFactor(); // Right associative
      const position: Position = { start: (base as { position: Position }).position.start, end: (exponent as { position: Position }).position.end };
      return {
        type: 'binaryOp',
        operator: '^',
        left: base,
        right: exponent,
        position
      };
    }
    
    return base;
  }
  
  private parseUnary(): ASTNodeType {
    if (this.current()?.type === 'operator' && 
        (this.current()?.value === '+' || this.current()?.value === '-')) {
      const op = this.advance()!;
      const operand = this.parseUnary();
      const position: Position = { start: op.position, end: (operand as { position: Position }).position.end };
      return {
        type: 'unaryOp',
        operator: op.value as '+' | '-',
        operand,
        position
      };
    }
    
    return this.parsePrimary();
  }
  
  private parsePrimary(): ASTNodeType {
    const token = this.current();
    
    if (!token) {
      throw new Error('Unexpected end of expression');
    }
    
    // Number
    if (token.type === 'number') {
      this.advance();
      return {
        type: 'number',
        value: parseFloat(token.value),
        raw: token.value,
        position: { start: token.position, end: token.position + token.value.length }
      };
    }
    
    // Constant
    if (token.type === 'constant') {
      this.advance();
      const constantValue = CONSTANTS[token.value];
      if (constantValue === undefined) {
        throw new Error(`Unknown constant: ${token.value}`);
      }
      return {
        type: 'constant',
        name: token.value as 'pi' | 'e' | 'phi' | 'tau',
        value: constantValue,
        position: { start: token.position, end: token.position + token.value.length }
      };
    }
    
    // Variable
    if (token.type === 'variable') {
      this.advance();
      return {
        type: 'variable',
        name: token.value,
        position: { start: token.position, end: token.position + token.value.length }
      };
    }
    
    // Function call
    if (token.type === 'function') {
      this.advance();
      this.expect('lparen');
      
      const args: ASTNodeType[] = [];
      
      if (this.current()?.type !== 'rparen') {
        args.push(this.parseExpression());
        
        while (this.current()?.type === 'comma') {
          this.advance();
          args.push(this.parseExpression());
        }
      }
      
      const endToken = this.expect('rparen');
      
      return {
        type: 'functionCall',
        name: token.value,
        args,
        position: { start: token.position, end: endToken.position + 1 }
      };
    }
    
    // Parenthesized expression
    if (token.type === 'lparen') {
      const startPos = token.position;
      this.advance();
      const expr = this.parseExpression();
      const endToken = this.expect('rparen');
      // Update position to include parentheses
      (expr as { position: Position }).position = { start: startPos, end: endToken.position + 1 };
      return expr;
    }
    
    throw new Error(`Unexpected token: ${token.value}`);
  }
}

/**
 * Parse an expression string into an Abstract Syntax Tree
 */
export function parse(expression: string): ASTNodeType {
  const tokens = tokenize(expression);
  if (tokens.length === 0) {
    throw new Error('Empty expression');
  }
  const parser = new Parser(tokens);
  return parser.parse();
}

/**
 * Convert an AST back to a string representation
 * Preserves operator precedence with minimal parentheses
 */
export function prettyPrint(ast: ASTNodeType): string {
  const needsParens = (node: ASTNodeType, parentOp: string, isRight: boolean): boolean => {
    if (node.type !== 'binaryOp') return false;
    
    const nodePrecedence = PRECEDENCE[node.operator] ?? 0;
    const parentPrecedence = PRECEDENCE[parentOp] ?? 0;
    
    if (nodePrecedence < parentPrecedence) return true;
    if (nodePrecedence === parentPrecedence && isRight && (parentOp === '-' || parentOp === '/')) return true;
    
    return false;
  };
  
  const print = (node: ASTNodeType, parentOp?: string, isRight?: boolean): string => {
    switch (node.type) {
      case 'number':
        return node.raw;
      
      case 'constant':
        return node.name;
      
      case 'variable':
        return node.name;
      
      case 'unaryOp':
        const operand = print(node.operand);
        if (node.operand.type === 'binaryOp') {
          return `${node.operator}(${operand})`;
        }
        return `${node.operator}${operand}`;
      
      case 'binaryOp': {
        const left = print(node.left, node.operator, false);
        const right = print(node.right, node.operator, true);
        
        let result = `${left} ${node.operator} ${right}`;
        
        if (parentOp && needsParens(node, parentOp, isRight ?? false)) {
          result = `(${result})`;
        }
        
        return result;
      }
      
      case 'functionCall':
        const args = node.args.map(arg => print(arg)).join(', ');
        return `${node.name}(${args})`;
      
      case 'matrix':
        return '[matrix]';
      
      case 'complex':
        return '[complex]';
      
      default:
        return '';
    }
  };
  
  return print(ast);
}

/**
 * Validate an expression and return any errors
 */
export function validate(expression: string): ValidationResult {
  const errors: ValidationError[] = [];
  
  if (!expression.trim()) {
    return { valid: false, errors: [{ message: 'Empty expression', position: { start: 0, end: 0 } }] };
  }
  
  // Check for balanced parentheses
  let parenCount = 0;
  let lastOpenParen = -1;
  
  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === '(') {
      parenCount++;
      lastOpenParen = i;
    } else if (expression[i] === ')') {
      parenCount--;
      if (parenCount < 0) {
        errors.push({
          message: 'Unmatched closing parenthesis',
          position: { start: i, end: i + 1 }
        });
        parenCount = 0;
      }
    }
  }
  
  if (parenCount > 0) {
    errors.push({
      message: 'Unmatched opening parenthesis',
      position: { start: lastOpenParen, end: lastOpenParen + 1 }
    });
  }
  
  // Try to parse and catch any errors
  if (errors.length === 0) {
    try {
      parse(expression);
    } catch (e) {
      errors.push({
        message: e instanceof Error ? e.message : 'Parse error',
        position: { start: 0, end: expression.length }
      });
    }
  }
  
  return { valid: errors.length === 0, errors };
}

// Export constants for use in evaluator
export { CONSTANTS, FUNCTIONS };
