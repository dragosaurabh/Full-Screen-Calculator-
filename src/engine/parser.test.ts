/**
 * Unit tests for Expression Parser
 * Validates: Requirements 10.1, 10.2, 10.7
 */

import { describe, it, expect } from 'vitest';
import { tokenize, parse, prettyPrint, validate } from './parser';

describe('Tokenizer', () => {
  describe('numbers', () => {
    it('should tokenize integers', () => {
      const tokens = tokenize('42');
      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toEqual({ type: 'number', value: '42', position: 0 });
    });

    it('should tokenize decimals', () => {
      const tokens = tokenize('3.14');
      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toEqual({ type: 'number', value: '3.14', position: 0 });
    });

    it('should tokenize scientific notation', () => {
      const tokens = tokenize('1.5e10');
      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toEqual({ type: 'number', value: '1.5e10', position: 0 });
    });

    it('should tokenize negative exponents', () => {
      const tokens = tokenize('2.5e-3');
      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toEqual({ type: 'number', value: '2.5e-3', position: 0 });
    });
  });

  describe('operators', () => {
    it('should tokenize basic operators', () => {
      const tokens = tokenize('2 + 3');
      expect(tokens).toHaveLength(3);
      expect(tokens[1]).toEqual({ type: 'operator', value: '+', position: 2 });
    });

    it('should tokenize all operators', () => {
      const tokens = tokenize('+-*/%^');
      expect(tokens).toHaveLength(6);
      expect(tokens.map(t => t.value)).toEqual(['+', '-', '*', '/', '%', '^']);
    });
  });

  describe('functions', () => {
    it('should tokenize known functions', () => {
      const tokens = tokenize('sin(x)');
      expect(tokens).toHaveLength(4);
      expect(tokens[0]).toEqual({ type: 'function', value: 'sin', position: 0 });
    });

    it('should be case-insensitive for functions', () => {
      const tokens = tokenize('SIN(x)');
      expect(tokens[0]?.type).toBe('function');
      expect(tokens[0]?.value).toBe('sin');
    });
  });

  describe('constants', () => {
    it('should tokenize pi', () => {
      const tokens = tokenize('pi');
      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toEqual({ type: 'constant', value: 'pi', position: 0 });
    });

    it('should tokenize e', () => {
      const tokens = tokenize('e');
      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toEqual({ type: 'constant', value: 'e', position: 0 });
    });
  });

  describe('variables', () => {
    it('should tokenize single letter variables', () => {
      const tokens = tokenize('x');
      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toEqual({ type: 'variable', value: 'x', position: 0 });
    });

    it('should tokenize multi-letter variables', () => {
      const tokens = tokenize('myVar');
      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toEqual({ type: 'variable', value: 'myVar', position: 0 });
    });
  });

  describe('implicit multiplication', () => {
    it('should insert multiplication between number and variable', () => {
      const tokens = tokenize('2x');
      expect(tokens).toHaveLength(3);
      expect(tokens[0]?.type).toBe('number');
      expect(tokens[1]?.type).toBe('operator');
      expect(tokens[1]?.value).toBe('*');
      expect(tokens[2]?.type).toBe('variable');
    });

    it('should insert multiplication between number and parenthesis', () => {
      const tokens = tokenize('3(4)');
      expect(tokens).toHaveLength(5);
      expect(tokens[1]?.type).toBe('operator');
      expect(tokens[1]?.value).toBe('*');
    });

    it('should insert multiplication between closing and opening parenthesis', () => {
      const tokens = tokenize('(2)(3)');
      expect(tokens).toHaveLength(7);
      expect(tokens[3]?.type).toBe('operator');
      expect(tokens[3]?.value).toBe('*');
    });

    it('should insert multiplication between number and function', () => {
      const tokens = tokenize('2sin(x)');
      expect(tokens).toHaveLength(6);
      expect(tokens[1]?.type).toBe('operator');
      expect(tokens[1]?.value).toBe('*');
    });

    it('should insert multiplication between number and constant', () => {
      const tokens = tokenize('2pi');
      expect(tokens).toHaveLength(3);
      expect(tokens[1]?.type).toBe('operator');
      expect(tokens[1]?.value).toBe('*');
    });
  });

  describe('parentheses', () => {
    it('should tokenize parentheses', () => {
      const tokens = tokenize('(1 + 2)');
      expect(tokens).toHaveLength(5);
      expect(tokens[0]?.type).toBe('lparen');
      expect(tokens[4]?.type).toBe('rparen');
    });
  });

  describe('commas', () => {
    it('should tokenize commas in function arguments', () => {
      const tokens = tokenize('max(1, 2)');
      expect(tokens).toHaveLength(6);
      expect(tokens[3]?.type).toBe('comma');
    });
  });
});

describe('Parser', () => {
  describe('numbers', () => {
    it('should parse integers', () => {
      const ast = parse('42');
      expect(ast.type).toBe('number');
      if (ast.type === 'number') {
        expect(ast.value).toBe(42);
      }
    });

    it('should parse decimals', () => {
      const ast = parse('3.14');
      expect(ast.type).toBe('number');
      if (ast.type === 'number') {
        expect(ast.value).toBeCloseTo(3.14);
      }
    });
  });

  describe('binary operations', () => {
    it('should parse addition', () => {
      const ast = parse('2 + 3');
      expect(ast.type).toBe('binaryOp');
      if (ast.type === 'binaryOp') {
        expect(ast.operator).toBe('+');
      }
    });

    it('should respect operator precedence', () => {
      const ast = parse('2 + 3 * 4');
      expect(ast.type).toBe('binaryOp');
      if (ast.type === 'binaryOp') {
        expect(ast.operator).toBe('+');
        expect(ast.right.type).toBe('binaryOp');
        if (ast.right.type === 'binaryOp') {
          expect(ast.right.operator).toBe('*');
        }
      }
    });

    it('should handle parentheses', () => {
      const ast = parse('(2 + 3) * 4');
      expect(ast.type).toBe('binaryOp');
      if (ast.type === 'binaryOp') {
        expect(ast.operator).toBe('*');
        expect(ast.left.type).toBe('binaryOp');
      }
    });

    it('should handle right-associative exponentiation', () => {
      const ast = parse('2 ^ 3 ^ 4');
      expect(ast.type).toBe('binaryOp');
      if (ast.type === 'binaryOp') {
        expect(ast.operator).toBe('^');
        expect(ast.right.type).toBe('binaryOp');
      }
    });
  });

  describe('unary operations', () => {
    it('should parse negative numbers', () => {
      const ast = parse('-5');
      expect(ast.type).toBe('unaryOp');
      if (ast.type === 'unaryOp') {
        expect(ast.operator).toBe('-');
      }
    });

    it('should parse positive sign', () => {
      const ast = parse('+5');
      expect(ast.type).toBe('unaryOp');
      if (ast.type === 'unaryOp') {
        expect(ast.operator).toBe('+');
      }
    });
  });

  describe('function calls', () => {
    it('should parse single argument functions', () => {
      const ast = parse('sin(0)');
      expect(ast.type).toBe('functionCall');
      if (ast.type === 'functionCall') {
        expect(ast.name).toBe('sin');
        expect(ast.args).toHaveLength(1);
      }
    });

    it('should parse multi-argument functions', () => {
      const ast = parse('max(1, 2, 3)');
      expect(ast.type).toBe('functionCall');
      if (ast.type === 'functionCall') {
        expect(ast.name).toBe('max');
        expect(ast.args).toHaveLength(3);
      }
    });

    it('should parse nested function calls', () => {
      const ast = parse('sin(cos(0))');
      expect(ast.type).toBe('functionCall');
      if (ast.type === 'functionCall') {
        expect(ast.args[0]?.type).toBe('functionCall');
      }
    });
  });

  describe('constants', () => {
    it('should parse pi', () => {
      const ast = parse('pi');
      expect(ast.type).toBe('constant');
      if (ast.type === 'constant') {
        expect(ast.name).toBe('pi');
        expect(ast.value).toBeCloseTo(Math.PI);
      }
    });
  });

  describe('variables', () => {
    it('should parse variables', () => {
      const ast = parse('x');
      expect(ast.type).toBe('variable');
      if (ast.type === 'variable') {
        expect(ast.name).toBe('x');
      }
    });
  });

  describe('complex expressions', () => {
    it('should parse complex expressions', () => {
      const ast = parse('2 * x + sin(pi / 2)');
      expect(ast.type).toBe('binaryOp');
    });

    it('should handle implicit multiplication', () => {
      const ast = parse('2x + 3y');
      expect(ast.type).toBe('binaryOp');
      if (ast.type === 'binaryOp') {
        expect(ast.operator).toBe('+');
      }
    });
  });

  describe('error handling', () => {
    it('should throw on empty expression', () => {
      expect(() => parse('')).toThrow('Empty expression');
    });

    it('should throw on unmatched parentheses', () => {
      expect(() => parse('(2 + 3')).toThrow();
    });

    it('should throw on unexpected tokens', () => {
      // '2 + + 3' is actually valid (2 + (+3)), so test a truly invalid case
      expect(() => parse('2 3')).toThrow(); // Missing operator
    });
  });
});

describe('Pretty Printer', () => {
  it('should print simple numbers', () => {
    const ast = parse('42');
    expect(prettyPrint(ast)).toBe('42');
  });

  it('should print binary operations', () => {
    const ast = parse('2 + 3');
    expect(prettyPrint(ast)).toBe('2 + 3');
  });

  it('should preserve precedence without unnecessary parentheses', () => {
    const ast = parse('2 + 3 * 4');
    expect(prettyPrint(ast)).toBe('2 + 3 * 4');
  });

  it('should add parentheses when needed', () => {
    const ast = parse('(2 + 3) * 4');
    expect(prettyPrint(ast)).toBe('(2 + 3) * 4');
  });

  it('should print function calls', () => {
    const ast = parse('sin(x)');
    expect(prettyPrint(ast)).toBe('sin(x)');
  });

  it('should print constants', () => {
    const ast = parse('pi');
    expect(prettyPrint(ast)).toBe('pi');
  });

  it('should print unary operators', () => {
    const ast = parse('-5');
    expect(prettyPrint(ast)).toBe('-5');
  });
});

describe('Validator', () => {
  it('should validate correct expressions', () => {
    const result = validate('2 + 3');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect empty expressions', () => {
    const result = validate('');
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.message).toBe('Empty expression');
  });

  it('should detect unmatched closing parenthesis', () => {
    const result = validate('2 + 3)');
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.message).toContain('parenthesis');
  });

  it('should detect unmatched opening parenthesis', () => {
    const result = validate('(2 + 3');
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.message).toContain('parenthesis');
  });

  it('should validate complex expressions', () => {
    const result = validate('sin(pi / 2) + cos(0)');
    expect(result.valid).toBe(true);
  });
});
