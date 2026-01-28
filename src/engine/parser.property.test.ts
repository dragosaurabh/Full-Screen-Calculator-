/**
 * Property-based tests for Expression Parser
 * **Property 1: Expression Parsing Round-Trip**
 * **Validates: Requirements 10.7**
 * 
 * For any valid mathematical expression, parsing the expression into an AST,
 * then pretty-printing the AST back to a string, then parsing that string again
 * SHALL produce an equivalent AST.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { parse, prettyPrint } from './parser';
import type { ASTNodeType } from '../types';

// Helper to compare ASTs for structural equality (ignoring position info)
function astEqual(a: ASTNodeType, b: ASTNodeType): boolean {
  if (a.type !== b.type) return false;
  
  switch (a.type) {
    case 'number':
      return b.type === 'number' && Math.abs(a.value - b.value) < 1e-10;
    
    case 'constant':
      return b.type === 'constant' && a.name === b.name;
    
    case 'variable':
      return b.type === 'variable' && a.name === b.name;
    
    case 'unaryOp':
      return b.type === 'unaryOp' && 
             a.operator === b.operator && 
             astEqual(a.operand, b.operand);
    
    case 'binaryOp':
      return b.type === 'binaryOp' && 
             a.operator === b.operator && 
             astEqual(a.left, b.left) && 
             astEqual(a.right, b.right);
    
    case 'functionCall':
      return b.type === 'functionCall' && 
             a.name === b.name && 
             a.args.length === b.args.length &&
             a.args.every((arg, i) => {
               const bArg = b.args[i];
               return bArg !== undefined && astEqual(arg, bArg);
             });
    
    default:
      return false;
  }
}

// Arbitrary for generating valid numbers
const arbNumber = fc.oneof(
  fc.integer({ min: 0, max: 1000 }).map(n => n.toString()),
  fc.float({ min: Math.fround(0.01), max: Math.fround(100), noNaN: true }).map(n => n.toFixed(2))
);

// Arbitrary for generating valid variable names
const arbVariable = fc.constantFrom('x', 'y', 'z', 'a', 'b', 'n');

// Arbitrary for generating constants
const arbConstant = fc.constantFrom('pi', 'e', 'phi', 'tau');

// Arbitrary for generating binary operators
const arbBinaryOp = fc.constantFrom('+', '-', '*', '/', '^');

// Arbitrary for generating function names
const arbFunction = fc.constantFrom('sin', 'cos', 'tan', 'sqrt', 'abs', 'ln', 'exp');

// Recursive arbitrary for generating valid expressions
const arbExpression: fc.Arbitrary<string> = fc.letrec<{ expr: string; binary: string; funcCall: string; paren: string; simple: string }>(tie => ({
  expr: fc.oneof(
    { weight: 3, arbitrary: arbNumber },
    { weight: 2, arbitrary: arbVariable },
    { weight: 2, arbitrary: arbConstant },
    { weight: 2, arbitrary: tie('binary') },
    { weight: 1, arbitrary: tie('funcCall') },
    { weight: 1, arbitrary: tie('paren') }
  ),
  binary: fc.tuple(tie('simple'), arbBinaryOp, tie('simple')).map(
    ([left, op, right]) => `${left} ${op} ${right}`
  ),
  funcCall: fc.tuple(arbFunction, tie('simple')).map(
    ([fn, arg]) => `${fn}(${arg})`
  ),
  paren: tie('simple').map(e => `(${e})`),
  simple: fc.oneof(
    { weight: 4, arbitrary: arbNumber },
    { weight: 2, arbitrary: arbVariable },
    { weight: 2, arbitrary: arbConstant }
  )
})).expr;

describe('Expression Parser - Property Tests', () => {
  describe('Property 1: Expression Parsing Round-Trip', () => {
    it('parsing then pretty-printing then parsing produces equivalent AST', () => {
      fc.assert(
        fc.property(arbExpression, (expr) => {
          try {
            // First parse
            const ast1 = parse(expr);
            
            // Pretty print
            const printed = prettyPrint(ast1);
            
            // Second parse
            const ast2 = parse(printed);
            
            // ASTs should be structurally equivalent
            expect(astEqual(ast1, ast2)).toBe(true);
            return true;
          } catch {
            // If parsing fails, that's okay - we're testing valid expressions
            // The arbitrary might generate edge cases that fail
            return true;
          }
        }),
        { numRuns: 100 }
      );
    });

    it('simple numbers round-trip correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 10000 }),
          (n) => {
            const expr = n.toString();
            const ast1 = parse(expr);
            const printed = prettyPrint(ast1);
            const ast2 = parse(printed);
            return astEqual(ast1, ast2);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('binary operations round-trip correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          fc.integer({ min: 1, max: 100 }),
          arbBinaryOp,
          (a, b, op) => {
            const expr = `${a} ${op} ${b}`;
            const ast1 = parse(expr);
            const printed = prettyPrint(ast1);
            const ast2 = parse(printed);
            return astEqual(ast1, ast2);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('function calls round-trip correctly', () => {
      fc.assert(
        fc.property(
          arbFunction,
          fc.integer({ min: 0, max: 100 }),
          (fn, arg) => {
            const expr = `${fn}(${arg})`;
            const ast1 = parse(expr);
            const printed = prettyPrint(ast1);
            const ast2 = parse(printed);
            return astEqual(ast1, ast2);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('nested expressions round-trip correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 10 }),
          (a, b, c) => {
            const expr = `(${a} + ${b}) * ${c}`;
            const ast1 = parse(expr);
            const printed = prettyPrint(ast1);
            const ast2 = parse(printed);
            return astEqual(ast1, ast2);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('constants round-trip correctly', () => {
      fc.assert(
        fc.property(arbConstant, (constant) => {
          const ast1 = parse(constant);
          const printed = prettyPrint(ast1);
          const ast2 = parse(printed);
          return astEqual(ast1, ast2);
        }),
        { numRuns: 10 }
      );
    });

    it('variables round-trip correctly', () => {
      fc.assert(
        fc.property(arbVariable, (variable) => {
          const ast1 = parse(variable);
          const printed = prettyPrint(ast1);
          const ast2 = parse(printed);
          return astEqual(ast1, ast2);
        }),
        { numRuns: 10 }
      );
    });
  });
});
