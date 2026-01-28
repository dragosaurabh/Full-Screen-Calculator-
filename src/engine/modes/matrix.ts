/**
 * Matrix and Linear Algebra Mode
 * 
 * Implements matrix operations including multiplication, inverse,
 * determinant, and linear system solving.
 * Validates: Requirements 5.1, 5.2, 5.3, 5.5, 5.6
 */

import type { Matrix, Complex } from '../../types';

export interface MatrixEngine {
  create(rows: number, cols: number, data?: number[][]): Matrix;
  add(a: Matrix, b: Matrix): Matrix;
  subtract(a: Matrix, b: Matrix): Matrix;
  multiply(a: Matrix, b: Matrix): Matrix;
  scalarMultiply(m: Matrix, scalar: number): Matrix;
  inverse(m: Matrix): Matrix;
  determinant(m: Matrix): number;
  transpose(m: Matrix): Matrix;
  solve(coefficients: Matrix, constants: number[]): number[];
  identity(size: number): Matrix;
  isSquare(m: Matrix): boolean;
  eigenvalues(m: Matrix): Complex[];
}

class MatrixError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'MatrixError';
  }
}

/**
 * Matrix operations - full implementation
 */
export const matrixOperations: MatrixEngine = {
  /**
   * Create a matrix with given dimensions and optional data
   */
  create: (rows: number, cols: number, data?: number[][]): Matrix => {
    if (rows <= 0 || cols <= 0) {
      throw new MatrixError('Matrix dimensions must be positive', 'MATRIX_INVALID_DIM');
    }
    
    if (data) {
      if (data.length !== rows) {
        throw new MatrixError(`Expected ${rows} rows, got ${data.length}`, 'MATRIX_DIM_MISMATCH');
      }
      for (let i = 0; i < rows; i++) {
        const row = data[i];
        if (!row || row.length !== cols) {
          throw new MatrixError(`Row ${i} has ${row?.length ?? 0} columns, expected ${cols}`, 'MATRIX_DIM_MISMATCH');
        }
      }
      return { rows, cols, data: data.map(row => [...row]) };
    }
    
    // Create zero matrix
    const zeroData = Array(rows).fill(null).map(() => Array(cols).fill(0) as number[]);
    return { rows, cols, data: zeroData };
  },
  
  /**
   * Add two matrices
   */
  add: (a: Matrix, b: Matrix): Matrix => {
    if (a.rows !== b.rows || a.cols !== b.cols) {
      throw new MatrixError('Matrix dimensions must match for addition', 'MATRIX_DIM_MISMATCH');
    }
    
    const result: number[][] = [];
    for (let i = 0; i < a.rows; i++) {
      result[i] = [];
      for (let j = 0; j < a.cols; j++) {
        result[i]![j] = a.data[i]![j]! + b.data[i]![j]!;
      }
    }
    return { rows: a.rows, cols: a.cols, data: result };
  },
  
  /**
   * Subtract two matrices
   */
  subtract: (a: Matrix, b: Matrix): Matrix => {
    if (a.rows !== b.rows || a.cols !== b.cols) {
      throw new MatrixError('Matrix dimensions must match for subtraction', 'MATRIX_DIM_MISMATCH');
    }
    
    const result: number[][] = [];
    for (let i = 0; i < a.rows; i++) {
      result[i] = [];
      for (let j = 0; j < a.cols; j++) {
        result[i]![j] = a.data[i]![j]! - b.data[i]![j]!;
      }
    }
    return { rows: a.rows, cols: a.cols, data: result };
  },
  
  /**
   * Multiply two matrices
   */
  multiply: (a: Matrix, b: Matrix): Matrix => {
    if (a.cols !== b.rows) {
      throw new MatrixError(
        `Cannot multiply ${a.rows}x${a.cols} matrix by ${b.rows}x${b.cols} matrix`,
        'MATRIX_DIM_MISMATCH'
      );
    }
    
    const result: number[][] = [];
    for (let i = 0; i < a.rows; i++) {
      result[i] = [];
      for (let j = 0; j < b.cols; j++) {
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i]![k]! * b.data[k]![j]!;
        }
        result[i]![j] = sum;
      }
    }
    return { rows: a.rows, cols: b.cols, data: result };
  },
  
  /**
   * Multiply matrix by scalar
   */
  scalarMultiply: (m: Matrix, scalar: number): Matrix => {
    const result: number[][] = [];
    for (let i = 0; i < m.rows; i++) {
      result[i] = [];
      for (let j = 0; j < m.cols; j++) {
        result[i]![j] = m.data[i]![j]! * scalar;
      }
    }
    return { rows: m.rows, cols: m.cols, data: result };
  },
  
  /**
   * Calculate matrix inverse using Gauss-Jordan elimination
   */
  inverse: (m: Matrix): Matrix => {
    if (m.rows !== m.cols) {
      throw new MatrixError('Matrix must be square for inverse', 'MATRIX_NOT_SQUARE');
    }
    
    const n = m.rows;
    
    // Create augmented matrix [A|I]
    const aug: number[][] = [];
    for (let i = 0; i < n; i++) {
      aug[i] = [...m.data[i]!];
      for (let j = 0; j < n; j++) {
        aug[i]!.push(i === j ? 1 : 0);
      }
    }
    
    // Gauss-Jordan elimination
    for (let col = 0; col < n; col++) {
      // Find pivot
      let maxRow = col;
      for (let row = col + 1; row < n; row++) {
        if (Math.abs(aug[row]![col]!) > Math.abs(aug[maxRow]![col]!)) {
          maxRow = row;
        }
      }
      
      // Swap rows
      const temp = aug[col]!;
      aug[col] = aug[maxRow]!;
      aug[maxRow] = temp;
      
      // Check for singular matrix
      if (Math.abs(aug[col]![col]!) < 1e-10) {
        throw new MatrixError('Matrix is singular (no inverse)', 'MATRIX_SINGULAR');
      }
      
      // Scale pivot row
      const pivot = aug[col]![col]!;
      for (let j = 0; j < 2 * n; j++) {
        aug[col]![j]! /= pivot;
      }
      
      // Eliminate column
      for (let row = 0; row < n; row++) {
        if (row !== col) {
          const factor = aug[row]![col]!;
          for (let j = 0; j < 2 * n; j++) {
            aug[row]![j]! -= factor * aug[col]![j]!;
          }
        }
      }
    }
    
    // Extract inverse from augmented matrix
    const result: number[][] = [];
    for (let i = 0; i < n; i++) {
      result[i] = aug[i]!.slice(n);
    }
    
    return { rows: n, cols: n, data: result };
  },
  
  /**
   * Calculate matrix determinant using LU decomposition
   */
  determinant: (m: Matrix): number => {
    if (m.rows !== m.cols) {
      throw new MatrixError('Matrix must be square for determinant', 'MATRIX_NOT_SQUARE');
    }
    
    const n = m.rows;
    
    // Special cases
    if (n === 1) return m.data[0]![0]!;
    if (n === 2) return m.data[0]![0]! * m.data[1]![1]! - m.data[0]![1]! * m.data[1]![0]!;
    
    // LU decomposition with partial pivoting
    const a: number[][] = m.data.map(row => [...row]);
    let det = 1;
    
    for (let col = 0; col < n; col++) {
      // Find pivot
      let maxRow = col;
      for (let row = col + 1; row < n; row++) {
        if (Math.abs(a[row]![col]!) > Math.abs(a[maxRow]![col]!)) {
          maxRow = row;
        }
      }
      
      // Swap rows (changes sign of determinant)
      if (maxRow !== col) {
        const temp = a[col]!;
        a[col] = a[maxRow]!;
        a[maxRow] = temp;
        det *= -1;
      }
      
      // Check for zero pivot
      if (Math.abs(a[col]![col]!) < 1e-10) {
        return 0;
      }
      
      det *= a[col]![col]!;
      
      // Eliminate below pivot
      for (let row = col + 1; row < n; row++) {
        const factor = a[row]![col]! / a[col]![col]!;
        for (let j = col; j < n; j++) {
          a[row]![j]! -= factor * a[col]![j]!;
        }
      }
    }
    
    return det;
  },
  
  /**
   * Transpose a matrix
   */
  transpose: (m: Matrix): Matrix => {
    const result: number[][] = [];
    for (let j = 0; j < m.cols; j++) {
      result[j] = [];
      for (let i = 0; i < m.rows; i++) {
        result[j]![i] = m.data[i]![j]!;
      }
    }
    return { rows: m.cols, cols: m.rows, data: result };
  },
  
  /**
   * Solve linear system Ax = b using Gaussian elimination
   */
  solve: (coefficients: Matrix, constants: number[]): number[] => {
    if (coefficients.rows !== coefficients.cols) {
      throw new MatrixError('Coefficient matrix must be square', 'MATRIX_NOT_SQUARE');
    }
    if (coefficients.rows !== constants.length) {
      throw new MatrixError('Constants vector length must match matrix rows', 'MATRIX_DIM_MISMATCH');
    }
    
    const n = coefficients.rows;
    
    // Create augmented matrix [A|b]
    const aug: number[][] = [];
    for (let i = 0; i < n; i++) {
      aug[i] = [...coefficients.data[i]!, constants[i]!];
    }
    
    // Forward elimination with partial pivoting
    for (let col = 0; col < n; col++) {
      // Find pivot
      let maxRow = col;
      for (let row = col + 1; row < n; row++) {
        if (Math.abs(aug[row]![col]!) > Math.abs(aug[maxRow]![col]!)) {
          maxRow = row;
        }
      }
      
      // Swap rows
      const temp = aug[col]!;
      aug[col] = aug[maxRow]!;
      aug[maxRow] = temp;
      
      // Check for zero pivot (no unique solution)
      if (Math.abs(aug[col]![col]!) < 1e-10) {
        throw new MatrixError('System has no unique solution', 'MATRIX_SINGULAR');
      }
      
      // Eliminate below pivot
      for (let row = col + 1; row < n; row++) {
        const factor = aug[row]![col]! / aug[col]![col]!;
        for (let j = col; j <= n; j++) {
          aug[row]![j]! -= factor * aug[col]![j]!;
        }
      }
    }
    
    // Back substitution
    const solution: number[] = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
      let sum = aug[i]![n]!;
      for (let j = i + 1; j < n; j++) {
        sum -= aug[i]![j]! * solution[j]!;
      }
      solution[i] = sum / aug[i]![i]!;
    }
    
    return solution;
  },
  
  /**
   * Create identity matrix
   */
  identity: (size: number): Matrix => {
    const data: number[][] = [];
    for (let i = 0; i < size; i++) {
      data[i] = [];
      for (let j = 0; j < size; j++) {
        data[i]![j] = i === j ? 1 : 0;
      }
    }
    return { rows: size, cols: size, data };
  },
  
  /**
   * Check if matrix is square
   */
  isSquare: (m: Matrix): boolean => m.rows === m.cols,
  
  /**
   * Calculate eigenvalues (simplified - only for 2x2 matrices)
   */
  eigenvalues: (m: Matrix): Complex[] => {
    if (m.rows !== m.cols) {
      throw new MatrixError('Matrix must be square for eigenvalues', 'MATRIX_NOT_SQUARE');
    }
    
    if (m.rows === 2) {
      // For 2x2 matrix, use quadratic formula
      const a = m.data[0]![0]!;
      const b = m.data[0]![1]!;
      const c = m.data[1]![0]!;
      const d = m.data[1]![1]!;
      
      const trace = a + d;
      const det = a * d - b * c;
      const discriminant = trace * trace - 4 * det;
      
      if (discriminant >= 0) {
        const sqrtDisc = Math.sqrt(discriminant);
        return [
          { real: (trace + sqrtDisc) / 2, imag: 0 },
          { real: (trace - sqrtDisc) / 2, imag: 0 }
        ];
      } else {
        const sqrtDisc = Math.sqrt(-discriminant);
        return [
          { real: trace / 2, imag: sqrtDisc / 2 },
          { real: trace / 2, imag: -sqrtDisc / 2 }
        ];
      }
    }
    
    throw new MatrixError('Eigenvalue calculation only supported for 2x2 matrices', 'MATRIX_NOT_SUPPORTED');
  }
};
