/**
 * Programmer Calculator Mode
 * 
 * Implements number base conversions and bitwise operations.
 * This module is lazy-loaded for performance.
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 */

export interface ProgrammerEngine {
  toBase(value: bigint, base: 2 | 8 | 10 | 16): string;
  fromBase(value: string, base: 2 | 8 | 10 | 16): bigint;
  bitwiseAnd(a: bigint, b: bigint): bigint;
  bitwiseOr(a: bigint, b: bigint): bigint;
  bitwiseXor(a: bigint, b: bigint): bigint;
  bitwiseNot(a: bigint, bits: number): bigint;
  leftShift(a: bigint, n: number): bigint;
  rightShift(a: bigint, n: number): bigint;
  toTwosComplement(value: bigint, bits: number): bigint;
  fromTwosComplement(value: bigint, bits: number): bigint;
  getAllBases(value: bigint): { bin: string; oct: string; dec: string; hex: string };
}

/**
 * Programmer operations - full implementation
 */
export const programmerOperations: ProgrammerEngine = {
  /**
   * Convert a bigint to a string in the specified base
   */
  toBase: (value: bigint, base: 2 | 8 | 10 | 16): string => {
    if (value < 0n) {
      return '-' + (-value).toString(base).toUpperCase();
    }
    return value.toString(base).toUpperCase();
  },
  
  /**
   * Convert a string in the specified base to a bigint
   */
  fromBase: (value: string, base: 2 | 8 | 10 | 16): bigint => {
    const cleanValue = value.trim().toUpperCase();
    const isNegative = cleanValue.startsWith('-');
    const absValue = isNegative ? cleanValue.slice(1) : cleanValue;
    
    // Validate characters for the base
    const validChars: Record<number, RegExp> = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9A-F]+$/
    };
    
    const validator = validChars[base];
    if (!validator || !validator.test(absValue)) {
      throw new Error(`Invalid characters for base ${base}: ${value}`);
    }
    
    // Parse correctly
    let parsed = 0n;
    for (const char of absValue) {
      const digit = parseInt(char, base);
      parsed = parsed * BigInt(base) + BigInt(digit);
    }
    
    return isNegative ? -parsed : parsed;
  },
  
  /**
   * Bitwise AND operation
   */
  bitwiseAnd: (a: bigint, b: bigint): bigint => a & b,
  
  /**
   * Bitwise OR operation
   */
  bitwiseOr: (a: bigint, b: bigint): bigint => a | b,
  
  /**
   * Bitwise XOR operation
   */
  bitwiseXor: (a: bigint, b: bigint): bigint => a ^ b,
  
  /**
   * Bitwise NOT operation with specified bit width
   */
  bitwiseNot: (a: bigint, bits: number): bigint => {
    if (bits <= 0 || bits > 64) {
      throw new Error('Bit width must be between 1 and 64');
    }
    const mask = (1n << BigInt(bits)) - 1n;
    return ~a & mask;
  },
  
  /**
   * Left shift operation
   */
  leftShift: (a: bigint, n: number): bigint => {
    if (n < 0) {
      throw new Error('Shift amount must be non-negative');
    }
    return a << BigInt(n);
  },
  
  /**
   * Right shift operation (arithmetic shift for signed values)
   */
  rightShift: (a: bigint, n: number): bigint => {
    if (n < 0) {
      throw new Error('Shift amount must be non-negative');
    }
    return a >> BigInt(n);
  },
  
  /**
   * Convert a signed value to two's complement representation
   */
  toTwosComplement: (value: bigint, bits: number): bigint => {
    if (bits <= 0 || bits > 64) {
      throw new Error('Bit width must be between 1 and 64');
    }
    
    const maxPositive = (1n << BigInt(bits - 1)) - 1n;
    const minNegative = -(1n << BigInt(bits - 1));
    
    if (value > maxPositive || value < minNegative) {
      throw new Error(`Value ${value} out of range for ${bits}-bit two's complement`);
    }
    
    if (value >= 0n) {
      return value;
    }
    
    // For negative values: 2^bits + value
    return (1n << BigInt(bits)) + value;
  },
  
  /**
   * Convert a two's complement representation back to signed value
   */
  fromTwosComplement: (value: bigint, bits: number): bigint => {
    if (bits <= 0 || bits > 64) {
      throw new Error('Bit width must be between 1 and 64');
    }
    
    const mask = (1n << BigInt(bits)) - 1n;
    const signBit = 1n << BigInt(bits - 1);
    
    // Ensure value is within range
    const maskedValue = value & mask;
    
    // Check if sign bit is set (negative number)
    if (maskedValue & signBit) {
      // Negative: subtract 2^bits
      return maskedValue - (1n << BigInt(bits));
    }
    
    return maskedValue;
  },
  
  /**
   * Get all base representations of a value
   */
  getAllBases: (value: bigint): { bin: string; oct: string; dec: string; hex: string } => {
    const absValue = value < 0n ? -value : value;
    const prefix = value < 0n ? '-' : '';
    
    return {
      bin: prefix + absValue.toString(2),
      oct: prefix + absValue.toString(8),
      dec: prefix + absValue.toString(10),
      hex: prefix + absValue.toString(16).toUpperCase()
    };
  }
};
