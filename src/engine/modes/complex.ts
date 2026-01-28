/**
 * Complex Numbers Mode
 * 
 * Implements complex number operations including arithmetic,
 * polar/rectangular conversion, and complex functions.
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4
 */

import type { Complex } from '../../types';

export interface ComplexEngine {
  create(real: number, imag: number): Complex;
  fromPolar(magnitude: number, phase: number): Complex;
  parse(str: string): Complex;
  format(c: Complex): string;
  add(a: Complex, b: Complex): Complex;
  subtract(a: Complex, b: Complex): Complex;
  multiply(a: Complex, b: Complex): Complex;
  divide(a: Complex, b: Complex): Complex;
  conjugate(c: Complex): Complex;
  magnitude(c: Complex): number;
  phase(c: Complex): number;
  toPolar(c: Complex): { magnitude: number; phase: number };
  exp(c: Complex): Complex;
  ln(c: Complex): Complex;
  pow(base: Complex, exponent: Complex): Complex;
  sqrt(c: Complex): Complex;
  sin(c: Complex): Complex;
  cos(c: Complex): Complex;
  equals(a: Complex, b: Complex, tolerance?: number): boolean;
}

/**
 * Complex number operations - full implementation
 */
export const complexOperations: ComplexEngine = {
  /**
   * Create a complex number from real and imaginary parts
   */
  create: (real: number, imag: number): Complex => ({ real, imag }),
  
  /**
   * Create a complex number from polar coordinates
   */
  fromPolar: (magnitude: number, phase: number): Complex => ({
    real: magnitude * Math.cos(phase),
    imag: magnitude * Math.sin(phase),
  }),
  
  /**
   * Parse a complex number from string (e.g., "3+4i", "2-3i", "5i", "7")
   */
  parse: (str: string): Complex => {
    const cleaned = str.replace(/\s/g, '').toLowerCase();
    
    // Pure imaginary: "5i" or "-3i"
    if (/^[+-]?[\d.]+i$/.test(cleaned)) {
      const imag = parseFloat(cleaned.replace('i', '')) || (cleaned.includes('-') ? -1 : 1);
      return { real: 0, imag };
    }
    
    // Just "i" or "-i"
    if (cleaned === 'i') return { real: 0, imag: 1 };
    if (cleaned === '-i') return { real: 0, imag: -1 };
    
    // Pure real: "5" or "-3.14"
    if (/^[+-]?[\d.]+$/.test(cleaned)) {
      return { real: parseFloat(cleaned), imag: 0 };
    }
    
    // Full complex: "3+4i" or "2-3i"
    const match = cleaned.match(/^([+-]?[\d.]+)([+-][\d.]*)?i$/);
    if (match) {
      const real = parseFloat(match[1] ?? '0');
      let imagStr = match[2] ?? '+1';
      if (imagStr === '+' || imagStr === '-') imagStr += '1';
      const imag = parseFloat(imagStr);
      return { real, imag };
    }
    
    throw new Error(`Cannot parse complex number: ${str}`);
  },
  
  /**
   * Format a complex number as a string
   */
  format: (c: Complex): string => {
    if (c.imag === 0) return c.real.toString();
    if (c.real === 0) {
      if (c.imag === 1) return 'i';
      if (c.imag === -1) return '-i';
      return `${c.imag}i`;
    }
    const sign = c.imag >= 0 ? '+' : '';
    if (c.imag === 1) return `${c.real}+i`;
    if (c.imag === -1) return `${c.real}-i`;
    return `${c.real}${sign}${c.imag}i`;
  },
  
  /**
   * Add two complex numbers
   */
  add: (a: Complex, b: Complex): Complex => ({
    real: a.real + b.real,
    imag: a.imag + b.imag,
  }),
  
  /**
   * Subtract two complex numbers
   */
  subtract: (a: Complex, b: Complex): Complex => ({
    real: a.real - b.real,
    imag: a.imag - b.imag,
  }),
  
  /**
   * Multiply two complex numbers
   */
  multiply: (a: Complex, b: Complex): Complex => ({
    real: a.real * b.real - a.imag * b.imag,
    imag: a.real * b.imag + a.imag * b.real,
  }),
  
  /**
   * Divide two complex numbers
   */
  divide: (a: Complex, b: Complex): Complex => {
    const denominator = b.real * b.real + b.imag * b.imag;
    if (denominator === 0) {
      throw new Error('Cannot divide by zero');
    }
    return {
      real: (a.real * b.real + a.imag * b.imag) / denominator,
      imag: (a.imag * b.real - a.real * b.imag) / denominator,
    };
  },
  
  /**
   * Get the complex conjugate
   */
  conjugate: (c: Complex): Complex => ({
    real: c.real,
    imag: -c.imag,
  }),
  
  /**
   * Get the magnitude (absolute value)
   */
  magnitude: (c: Complex): number => Math.sqrt(c.real * c.real + c.imag * c.imag),
  
  /**
   * Get the phase (argument) in radians
   */
  phase: (c: Complex): number => Math.atan2(c.imag, c.real),
  
  /**
   * Convert to polar coordinates
   */
  toPolar: (c: Complex): { magnitude: number; phase: number } => ({
    magnitude: Math.sqrt(c.real * c.real + c.imag * c.imag),
    phase: Math.atan2(c.imag, c.real),
  }),
  
  /**
   * Complex exponential: e^(a+bi) = e^a * (cos(b) + i*sin(b))
   */
  exp: (c: Complex): Complex => {
    const expReal = Math.exp(c.real);
    return {
      real: expReal * Math.cos(c.imag),
      imag: expReal * Math.sin(c.imag),
    };
  },
  
  /**
   * Complex natural logarithm: ln(z) = ln|z| + i*arg(z)
   */
  ln: (c: Complex): Complex => {
    const mag = Math.sqrt(c.real * c.real + c.imag * c.imag);
    if (mag === 0) {
      throw new Error('Cannot take logarithm of zero');
    }
    return {
      real: Math.log(mag),
      imag: Math.atan2(c.imag, c.real),
    };
  },
  
  /**
   * Complex power: a^b = e^(b * ln(a))
   */
  pow: (base: Complex, exponent: Complex): Complex => {
    if (base.real === 0 && base.imag === 0) {
      if (exponent.real > 0) return { real: 0, imag: 0 };
      throw new Error('0^0 or 0^negative is undefined');
    }
    const lnBase = complexOperations.ln(base);
    const product = complexOperations.multiply(exponent, lnBase);
    return complexOperations.exp(product);
  },
  
  /**
   * Complex square root (principal value)
   */
  sqrt: (c: Complex): Complex => {
    const mag = Math.sqrt(c.real * c.real + c.imag * c.imag);
    const phase = Math.atan2(c.imag, c.real);
    return {
      real: Math.sqrt(mag) * Math.cos(phase / 2),
      imag: Math.sqrt(mag) * Math.sin(phase / 2),
    };
  },
  
  /**
   * Complex sine: sin(z) = (e^(iz) - e^(-iz)) / (2i)
   */
  sin: (c: Complex): Complex => {
    return {
      real: Math.sin(c.real) * Math.cosh(c.imag),
      imag: Math.cos(c.real) * Math.sinh(c.imag),
    };
  },
  
  /**
   * Complex cosine: cos(z) = (e^(iz) + e^(-iz)) / 2
   */
  cos: (c: Complex): Complex => {
    return {
      real: Math.cos(c.real) * Math.cosh(c.imag),
      imag: -Math.sin(c.real) * Math.sinh(c.imag),
    };
  },
  
  /**
   * Check if two complex numbers are equal within tolerance
   */
  equals: (a: Complex, b: Complex, tolerance: number = 1e-10): boolean => {
    return Math.abs(a.real - b.real) < tolerance && Math.abs(a.imag - b.imag) < tolerance;
  },
};
