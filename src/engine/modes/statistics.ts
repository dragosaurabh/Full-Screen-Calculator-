/**
 * Statistics and Probability Mode
 * 
 * Implements statistical calculations and probability distributions.
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4
 */

export interface StatisticsEngine {
  mean(data: number[]): number;
  median(data: number[]): number;
  mode(data: number[]): number[];
  variance(data: number[], population?: boolean): number;
  standardDeviation(data: number[], population?: boolean): number;
  sum(data: number[]): number;
  min(data: number[]): number;
  max(data: number[]): number;
  range(data: number[]): number;
  percentile(data: number[], p: number): number;
  quartiles(data: number[]): { q1: number; q2: number; q3: number };
  normalPdf(x: number, mean: number, stdDev: number): number;
  normalCdf(x: number, mean: number, stdDev: number): number;
  binomialPmf(k: number, n: number, p: number): number;
  binomialCdf(k: number, n: number, p: number): number;
  poissonPmf(k: number, lambda: number): number;
  poissonCdf(k: number, lambda: number): number;
  correlation(x: number[], y: number[]): number;
  linearRegression(x: number[], y: number[]): { slope: number; intercept: number; r2: number };
}

class StatisticsError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'StatisticsError';
  }
}

// Helper: factorial
function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Factorial requires non-negative integer');
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

// Helper: binomial coefficient
function binomialCoeff(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  return factorial(n) / (factorial(k) * factorial(n - k));
}

// Helper: error function approximation (for normal CDF)
function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

/**
 * Statistics operations - full implementation
 */
export const statisticsOperations: StatisticsEngine = {
  /**
   * Calculate arithmetic mean
   */
  mean: (data: number[]): number => {
    if (data.length === 0) {
      throw new StatisticsError('Cannot calculate mean of empty data set', 'STATS_EMPTY_DATA');
    }
    return data.reduce((sum, val) => sum + val, 0) / data.length;
  },

  /**
   * Calculate median
   */
  median: (data: number[]): number => {
    if (data.length === 0) {
      throw new StatisticsError('Cannot calculate median of empty data set', 'STATS_EMPTY_DATA');
    }
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 !== 0) {
      return sorted[mid]!;
    }
    return (sorted[mid - 1]! + sorted[mid]!) / 2;
  },

  /**
   * Calculate mode (most frequent values)
   */
  mode: (data: number[]): number[] => {
    if (data.length === 0) {
      throw new StatisticsError('Cannot calculate mode of empty data set', 'STATS_EMPTY_DATA');
    }
    const frequency = new Map<number, number>();
    let maxFreq = 0;
    
    for (const val of data) {
      const freq = (frequency.get(val) || 0) + 1;
      frequency.set(val, freq);
      maxFreq = Math.max(maxFreq, freq);
    }
    
    const modes: number[] = [];
    frequency.forEach((freq, val) => {
      if (freq === maxFreq) modes.push(val);
    });
    
    return modes.sort((a, b) => a - b);
  },

  /**
   * Calculate variance
   */
  variance: (data: number[], population: boolean = false): number => {
    if (data.length === 0) {
      throw new StatisticsError('Cannot calculate variance of empty data set', 'STATS_EMPTY_DATA');
    }
    if (data.length === 1 && !population) {
      throw new StatisticsError('Sample variance requires at least 2 data points', 'STATS_INSUFFICIENT_DATA');
    }
    
    const avg = statisticsOperations.mean(data);
    const squaredDiffs = data.map(val => Math.pow(val - avg, 2));
    const sumSquaredDiffs = squaredDiffs.reduce((sum, val) => sum + val, 0);
    
    return sumSquaredDiffs / (population ? data.length : data.length - 1);
  },

  /**
   * Calculate standard deviation
   */
  standardDeviation: (data: number[], population: boolean = false): number => {
    return Math.sqrt(statisticsOperations.variance(data, population));
  },

  /**
   * Calculate sum
   */
  sum: (data: number[]): number => {
    return data.reduce((sum, val) => sum + val, 0);
  },

  /**
   * Find minimum value
   */
  min: (data: number[]): number => {
    if (data.length === 0) {
      throw new StatisticsError('Cannot find min of empty data set', 'STATS_EMPTY_DATA');
    }
    return Math.min(...data);
  },

  /**
   * Find maximum value
   */
  max: (data: number[]): number => {
    if (data.length === 0) {
      throw new StatisticsError('Cannot find max of empty data set', 'STATS_EMPTY_DATA');
    }
    return Math.max(...data);
  },

  /**
   * Calculate range
   */
  range: (data: number[]): number => {
    return statisticsOperations.max(data) - statisticsOperations.min(data);
  },

  /**
   * Calculate percentile
   */
  percentile: (data: number[], p: number): number => {
    if (data.length === 0) {
      throw new StatisticsError('Cannot calculate percentile of empty data set', 'STATS_EMPTY_DATA');
    }
    if (p < 0 || p > 100) {
      throw new StatisticsError('Percentile must be between 0 and 100', 'STATS_INVALID_PARAM');
    }
    
    const sorted = [...data].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    
    if (lower === upper) return sorted[lower]!;
    
    const fraction = index - lower;
    return sorted[lower]! * (1 - fraction) + sorted[upper]! * fraction;
  },

  /**
   * Calculate quartiles
   */
  quartiles: (data: number[]): { q1: number; q2: number; q3: number } => {
    return {
      q1: statisticsOperations.percentile(data, 25),
      q2: statisticsOperations.percentile(data, 50),
      q3: statisticsOperations.percentile(data, 75),
    };
  },

  /**
   * Normal distribution probability density function
   */
  normalPdf: (x: number, mean: number, stdDev: number): number => {
    if (stdDev <= 0) {
      throw new StatisticsError('Standard deviation must be positive', 'STATS_INVALID_PARAM');
    }
    const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
    return coefficient * Math.exp(exponent);
  },

  /**
   * Normal distribution cumulative distribution function
   */
  normalCdf: (x: number, mean: number, stdDev: number): number => {
    if (stdDev <= 0) {
      throw new StatisticsError('Standard deviation must be positive', 'STATS_INVALID_PARAM');
    }
    const z = (x - mean) / (stdDev * Math.sqrt(2));
    return 0.5 * (1 + erf(z));
  },

  /**
   * Binomial distribution probability mass function
   */
  binomialPmf: (k: number, n: number, p: number): number => {
    if (k < 0 || k > n || !Number.isInteger(k) || !Number.isInteger(n)) {
      throw new StatisticsError('k must be integer between 0 and n', 'STATS_INVALID_PARAM');
    }
    if (p < 0 || p > 1) {
      throw new StatisticsError('Probability must be between 0 and 1', 'STATS_INVALID_PARAM');
    }
    return binomialCoeff(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  },

  /**
   * Binomial distribution cumulative distribution function
   */
  binomialCdf: (k: number, n: number, p: number): number => {
    let sum = 0;
    for (let i = 0; i <= k; i++) {
      sum += statisticsOperations.binomialPmf(i, n, p);
    }
    return sum;
  },

  /**
   * Poisson distribution probability mass function
   */
  poissonPmf: (k: number, lambda: number): number => {
    if (k < 0 || !Number.isInteger(k)) {
      throw new StatisticsError('k must be non-negative integer', 'STATS_INVALID_PARAM');
    }
    if (lambda <= 0) {
      throw new StatisticsError('Lambda must be positive', 'STATS_INVALID_PARAM');
    }
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
  },

  /**
   * Poisson distribution cumulative distribution function
   */
  poissonCdf: (k: number, lambda: number): number => {
    let sum = 0;
    for (let i = 0; i <= k; i++) {
      sum += statisticsOperations.poissonPmf(i, lambda);
    }
    return sum;
  },

  /**
   * Calculate Pearson correlation coefficient
   */
  correlation: (x: number[], y: number[]): number => {
    if (x.length !== y.length) {
      throw new StatisticsError('Arrays must have same length', 'STATS_DIM_MISMATCH');
    }
    if (x.length < 2) {
      throw new StatisticsError('Need at least 2 data points', 'STATS_INSUFFICIENT_DATA');
    }
    
    const n = x.length;
    const meanX = statisticsOperations.mean(x);
    const meanY = statisticsOperations.mean(y);
    
    let sumXY = 0, sumX2 = 0, sumY2 = 0;
    for (let i = 0; i < n; i++) {
      const dx = x[i]! - meanX;
      const dy = y[i]! - meanY;
      sumXY += dx * dy;
      sumX2 += dx * dx;
      sumY2 += dy * dy;
    }
    
    const denominator = Math.sqrt(sumX2 * sumY2);
    if (denominator === 0) return 0;
    
    return sumXY / denominator;
  },

  /**
   * Calculate linear regression (least squares)
   */
  linearRegression: (x: number[], y: number[]): { slope: number; intercept: number; r2: number } => {
    if (x.length !== y.length) {
      throw new StatisticsError('Arrays must have same length', 'STATS_DIM_MISMATCH');
    }
    if (x.length < 2) {
      throw new StatisticsError('Need at least 2 data points', 'STATS_INSUFFICIENT_DATA');
    }
    
    const n = x.length;
    const meanX = statisticsOperations.mean(x);
    const meanY = statisticsOperations.mean(y);
    
    let sumXY = 0, sumX2 = 0, sumY2 = 0;
    for (let i = 0; i < n; i++) {
      const dx = x[i]! - meanX;
      const dy = y[i]! - meanY;
      sumXY += dx * dy;
      sumX2 += dx * dx;
      sumY2 += dy * dy;
    }
    
    const slope = sumX2 === 0 ? 0 : sumXY / sumX2;
    const intercept = meanY - slope * meanX;
    
    // R-squared
    const ssRes = y.reduce((sum, yi, i) => {
      const predicted = slope * x[i]! + intercept;
      return sum + Math.pow(yi - predicted, 2);
    }, 0);
    const ssTot = sumY2;
    const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
    
    return { slope, intercept, r2 };
  },
};
