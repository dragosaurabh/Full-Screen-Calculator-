/**
 * Financial Calculator Mode
 * 
 * Implements time-value-of-money calculations and amortization.
 * Validates: Requirements 8.1, 8.2, 8.3
 */

import type { AmortizationEntry } from '../../types';

export interface FinancialEngine {
  futureValue(pv: number, rate: number, periods: number, pmt?: number): number;
  presentValue(fv: number, rate: number, periods: number, pmt?: number): number;
  payment(pv: number, rate: number, periods: number, fv?: number): number;
  periods(pv: number, fv: number, rate: number, pmt?: number): number;
  rate(pv: number, fv: number, periods: number, pmt?: number): number;
  amortizationSchedule(principal: number, rate: number, periods: number): AmortizationEntry[];
  effectiveRate(nominalRate: number, compoundingPeriods: number): number;
  nominalRate(effectiveRate: number, compoundingPeriods: number): number;
  npv(rate: number, cashFlows: number[]): number;
  irr(cashFlows: number[], guess?: number): number;
}

class FinancialError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'FinancialError';
  }
}

/**
 * Financial operations - full implementation
 */
export const financialOperations: FinancialEngine = {
  /**
   * Calculate Future Value
   * FV = PV * (1 + r)^n + PMT * ((1 + r)^n - 1) / r
   */
  futureValue: (pv: number, rate: number, periods: number, pmt: number = 0): number => {
    if (periods < 0) {
      throw new FinancialError('Periods must be non-negative', 'FIN_INVALID_PERIODS');
    }
    
    if (rate === 0) {
      return pv + pmt * periods;
    }
    
    const factor = Math.pow(1 + rate, periods);
    return pv * factor + pmt * (factor - 1) / rate;
  },

  /**
   * Calculate Present Value
   * PV = FV / (1 + r)^n - PMT * ((1 + r)^n - 1) / (r * (1 + r)^n)
   */
  presentValue: (fv: number, rate: number, periods: number, pmt: number = 0): number => {
    if (periods < 0) {
      throw new FinancialError('Periods must be non-negative', 'FIN_INVALID_PERIODS');
    }
    
    if (rate === 0) {
      return fv - pmt * periods;
    }
    
    const factor = Math.pow(1 + rate, periods);
    return fv / factor - pmt * (factor - 1) / (rate * factor);
  },

  /**
   * Calculate Payment
   * PMT = (PV * r * (1 + r)^n) / ((1 + r)^n - 1) for FV = 0
   */
  payment: (pv: number, rate: number, periods: number, fv: number = 0): number => {
    if (periods <= 0) {
      throw new FinancialError('Periods must be positive', 'FIN_INVALID_PERIODS');
    }
    
    if (rate === 0) {
      return -(pv + fv) / periods;
    }
    
    const factor = Math.pow(1 + rate, periods);
    return -(pv * rate * factor + fv * rate) / (factor - 1);
  },

  /**
   * Calculate Number of Periods
   * n = ln((PMT - FV * r) / (PMT + PV * r)) / ln(1 + r)
   */
  periods: (pv: number, fv: number, rate: number, pmt: number = 0): number => {
    if (rate === 0) {
      if (pmt === 0) {
        throw new FinancialError('Cannot calculate periods with zero rate and zero payment', 'FIN_NO_SOLUTION');
      }
      return -(pv + fv) / pmt;
    }
    
    const numerator = pmt - fv * rate;
    const denominator = pmt + pv * rate;
    
    if (numerator / denominator <= 0) {
      throw new FinancialError('No solution exists for given parameters', 'FIN_NO_SOLUTION');
    }
    
    return Math.log(numerator / denominator) / Math.log(1 + rate);
  },

  /**
   * Calculate Interest Rate using Newton-Raphson method
   */
  rate: (pv: number, fv: number, periods: number, pmt: number = 0): number => {
    if (periods <= 0) {
      throw new FinancialError('Periods must be positive', 'FIN_INVALID_PERIODS');
    }
    
    // Initial guess
    let rate = 0.1;
    const maxIterations = 100;
    const tolerance = 1e-10;
    
    for (let i = 0; i < maxIterations; i++) {
      const factor = Math.pow(1 + rate, periods);
      
      // f(r) = PV * (1+r)^n + PMT * ((1+r)^n - 1) / r + FV = 0
      let f: number;
      let fPrime: number;
      
      if (Math.abs(rate) < 1e-10) {
        f = pv + pmt * periods + fv;
        fPrime = pv * periods + pmt * periods * (periods - 1) / 2;
      } else {
        f = pv * factor + pmt * (factor - 1) / rate + fv;
        fPrime = pv * periods * Math.pow(1 + rate, periods - 1) +
                 pmt * (periods * Math.pow(1 + rate, periods - 1) * rate - (factor - 1)) / (rate * rate);
      }
      
      if (Math.abs(fPrime) < 1e-20) {
        throw new FinancialError('No solution exists for given parameters', 'FIN_NO_SOLUTION');
      }
      
      const newRate = rate - f / fPrime;
      
      if (Math.abs(newRate - rate) < tolerance) {
        return newRate;
      }
      
      rate = newRate;
      
      // Prevent divergence
      if (rate < -0.99) rate = -0.99;
      if (rate > 10) rate = 10;
    }
    
    throw new FinancialError('Rate calculation did not converge', 'FIN_NO_SOLUTION');
  },

  /**
   * Generate amortization schedule
   */
  amortizationSchedule: (principal: number, rate: number, periods: number): AmortizationEntry[] => {
    if (principal <= 0) {
      throw new FinancialError('Principal must be positive', 'FIN_INVALID_PARAM');
    }
    if (periods <= 0 || !Number.isInteger(periods)) {
      throw new FinancialError('Periods must be a positive integer', 'FIN_INVALID_PERIODS');
    }
    
    const payment = -financialOperations.payment(principal, rate, periods);
    const schedule: AmortizationEntry[] = [];
    let balance = principal;
    
    for (let period = 1; period <= periods; period++) {
      const interest = balance * rate;
      const principalPaid = payment - interest;
      balance -= principalPaid;
      
      // Handle floating point errors for final payment
      if (period === periods) {
        balance = 0;
      }
      
      schedule.push({
        period,
        payment,
        principal: principalPaid,
        interest,
        balance: Math.max(0, balance)
      });
    }
    
    return schedule;
  },

  /**
   * Calculate effective annual rate from nominal rate
   * EAR = (1 + r/n)^n - 1
   */
  effectiveRate: (nominalRate: number, compoundingPeriods: number): number => {
    if (compoundingPeriods <= 0) {
      throw new FinancialError('Compounding periods must be positive', 'FIN_INVALID_PARAM');
    }
    return Math.pow(1 + nominalRate / compoundingPeriods, compoundingPeriods) - 1;
  },

  /**
   * Calculate nominal rate from effective annual rate
   * r = n * ((1 + EAR)^(1/n) - 1)
   */
  nominalRate: (effectiveRate: number, compoundingPeriods: number): number => {
    if (compoundingPeriods <= 0) {
      throw new FinancialError('Compounding periods must be positive', 'FIN_INVALID_PARAM');
    }
    return compoundingPeriods * (Math.pow(1 + effectiveRate, 1 / compoundingPeriods) - 1);
  },

  /**
   * Calculate Net Present Value
   * NPV = sum(CF_t / (1 + r)^t)
   */
  npv: (rate: number, cashFlows: number[]): number => {
    if (cashFlows.length === 0) {
      throw new FinancialError('Cash flows array cannot be empty', 'FIN_INVALID_PARAM');
    }
    
    return cashFlows.reduce((npv, cf, t) => {
      return npv + cf / Math.pow(1 + rate, t);
    }, 0);
  },

  /**
   * Calculate Internal Rate of Return using Newton-Raphson method
   */
  irr: (cashFlows: number[], guess: number = 0.1): number => {
    if (cashFlows.length < 2) {
      throw new FinancialError('Need at least 2 cash flows', 'FIN_INVALID_PARAM');
    }
    
    let rate = guess;
    const maxIterations = 100;
    const tolerance = 1e-10;
    
    for (let i = 0; i < maxIterations; i++) {
      let npv = 0;
      let npvDerivative = 0;
      
      for (let t = 0; t < cashFlows.length; t++) {
        const cf = cashFlows[t]!;
        const factor = Math.pow(1 + rate, t);
        npv += cf / factor;
        if (t > 0) {
          npvDerivative -= t * cf / (factor * (1 + rate));
        }
      }
      
      if (Math.abs(npvDerivative) < 1e-20) {
        throw new FinancialError('IRR calculation did not converge', 'FIN_NO_SOLUTION');
      }
      
      const newRate = rate - npv / npvDerivative;
      
      if (Math.abs(newRate - rate) < tolerance) {
        return newRate;
      }
      
      rate = newRate;
      
      // Prevent divergence
      if (rate < -0.99) rate = -0.99;
      if (rate > 10) rate = 10;
    }
    
    throw new FinancialError('IRR calculation did not converge', 'FIN_NO_SOLUTION');
  }
};
