/**
 * Matrix Property Tests
 * 
 * Property-based tests for matrix operations.
 * 
 * **Property 9: Matrix Creation Preservation**
 * **Property 10: Matrix Multiplication Associativity**
 * **Property 11: Matrix Inverse Identity**
 * **Property 12: Determinant Multiplicativity**
 * **Property 13: Linear System Solution Verification**
 * **Validates: Requirements 5.1, 5.2, 5.3, 5.5, 5.6**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { matrixOperations } from '../../engine/modes/matrix';

// Helper to generate a random matrix
const matrixArb = (rows: number, cols: number) =>
  fc.array(
    fc.array(fc.float({ min: -10, max: 10, noNaN: true, noDefaultInfinity: true }), { minLength: cols, maxLength: cols }),
    { minLength: rows, maxLength: rows }
  );

// Helper to check if two matrices are approximately equal
function matricesEqual(a: number[][], b: number[][], tolerance = 1e-6): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const aRow = a[i];
    const bRow = b[i];
    if (!aRow || !bRow || aRow.length !== bRow.length) return false;
    for (let j = 0; j < aRow.length; j++) {
      const aVal = aRow[j];
      const bVal = bRow[j];
      if (aVal === undefined || bVal === undefined || Math.abs(aVal - bVal) > tolerance) return false;
    }
  }
  return true;
}

describe('Matrix Properties', () => {
  describe('Property 9: Matrix Creation Preservation', () => {
    it('creating a matrix preserves all input values', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 4 }),
          fc.integer({ min: 1, max: 4 }),
          (rows, cols) => {
            const data: number[][] = [];
            for (let i = 0; i < rows; i++) {
              const row: number[] = [];
              for (let j = 0; j < cols; j++) {
                row[j] = Math.random() * 20 - 10;
              }
              data[i] = row;
            }
            
            const matrix = matrixOperations.create(rows, cols, data);
            expect(matrix.rows).toBe(rows);
            expect(matrix.cols).toBe(cols);
            expect(matricesEqual(matrix.data, data)).toBe(true);
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  describe('Property 10: Matrix Multiplication Associativity', () => {
    it('(A × B) × C = A × (B × C) within tolerance', () => {
      fc.assert(
        fc.property(
          matrixArb(2, 2),
          matrixArb(2, 2),
          matrixArb(2, 2),
          (aData, bData, cData) => {
            const A = matrixOperations.create(2, 2, aData);
            const B = matrixOperations.create(2, 2, bData);
            const C = matrixOperations.create(2, 2, cData);
            
            const AB = matrixOperations.multiply(A, B);
            const BC = matrixOperations.multiply(B, C);
            const left = matrixOperations.multiply(AB, C);
            const right = matrixOperations.multiply(A, BC);
            
            expect(matricesEqual(left.data, right.data, 1e-5)).toBe(true);
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  describe('Property 11: Matrix Inverse Identity', () => {
    it('A × A⁻¹ = I for invertible matrices', () => {
      // Test with known invertible matrices (diagonally dominant)
      for (let size = 2; size <= 3; size++) {
        const data: number[][] = [];
        for (let i = 0; i < size; i++) {
          const row: number[] = [];
          for (let j = 0; j < size; j++) {
            row[j] = i === j ? 10 + Math.random() * 5 : Math.random() * 2 - 1;
          }
          data[i] = row;
        }
        
        const A = matrixOperations.create(size, size, data);
        const AInv = matrixOperations.inverse(A);
        const product = matrixOperations.multiply(A, AInv);
        const identity = matrixOperations.identity(size);
        
        expect(matricesEqual(product.data, identity.data, 1e-6)).toBe(true);
      }
    });
  });

  describe('Property 12: Determinant Multiplicativity', () => {
    it('det(A × B) = det(A) × det(B)', () => {
      fc.assert(
        fc.property(
          matrixArb(2, 2),
          matrixArb(2, 2),
          (aData, bData) => {
            const A = matrixOperations.create(2, 2, aData);
            const B = matrixOperations.create(2, 2, bData);
            const AB = matrixOperations.multiply(A, B);
            
            const detA = matrixOperations.determinant(A);
            const detB = matrixOperations.determinant(B);
            const detAB = matrixOperations.determinant(AB);
            
            expect(detAB).toBeCloseTo(detA * detB, 4);
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  describe('Property 13: Linear System Solution Verification', () => {
    it('solution x satisfies Ax = b', () => {
      // Test with known solvable systems
      for (let size = 2; size <= 3; size++) {
        const data: number[][] = [];
        for (let i = 0; i < size; i++) {
          const row: number[] = [];
          for (let j = 0; j < size; j++) {
            row[j] = i === j ? 10 + Math.random() * 5 : Math.random() * 2 - 1;
          }
          data[i] = row;
        }
        
        const constants: number[] = [];
        for (let i = 0; i < size; i++) {
          constants[i] = Math.random() * 10 - 5;
        }
        
        const A = matrixOperations.create(size, size, data);
        const solution = matrixOperations.solve(A, constants);
        
        // Verify Ax = b
        for (let i = 0; i < size; i++) {
          let sum = 0;
          const row = data[i];
          if (!row) continue;
          for (let j = 0; j < size; j++) {
            const val = row[j];
            const sol = solution[j];
            if (val !== undefined && sol !== undefined) {
              sum += val * sol;
            }
          }
          const constant = constants[i];
          if (constant !== undefined) {
            expect(sum).toBeCloseTo(constant, 5);
          }
        }
      }
    });
  });
});
