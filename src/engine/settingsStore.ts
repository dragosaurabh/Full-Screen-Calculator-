/**
 * Settings Store
 * 
 * Manages calculator settings with localStorage persistence.
 * Validates: Requirements 19.1, 19.2, 19.3, 19.4, 19.5, 19.7
 */

import type { CalculatorSettings, AngleMode } from '../types';
import { STORAGE_KEYS } from '../types';

export interface SettingsStore {
  // Getters
  getSettings(): CalculatorSettings;
  getPrecision(): number;
  getAngleMode(): AngleMode;
  getDecimalSeparator(): '.' | ',';
  getThousandsSeparator(): ',' | '.' | ' ' | '';
  isHighContrast(): boolean;
  isOnboardingComplete(): boolean;
  isCurrencyApiEnabled(): boolean;
  isArbitraryPrecisionEnabled(): boolean;
  
  // Setters
  setPrecision(precision: number): void;
  setAngleMode(mode: AngleMode): void;
  setDecimalSeparator(separator: '.' | ','): void;
  setThousandsSeparator(separator: ',' | '.' | ' ' | ''): void;
  setHighContrast(enabled: boolean): void;
  setOnboardingComplete(complete: boolean): void;
  setCurrencyApiEnabled(enabled: boolean): void;
  setArbitraryPrecisionEnabled(enabled: boolean): void;
  
  // Persistence
  persist(): void;
  restore(): void;
  reset(): void;
}

const DEFAULT_SETTINGS: CalculatorSettings = {
  precision: 10,
  angleMode: 'radians',
  decimalSeparator: '.',
  thousandsSeparator: ',',
  highContrast: false,
  onboardingComplete: false,
  currencyApiEnabled: false,
  arbitraryPrecisionEnabled: false
};

let settings: CalculatorSettings = { ...DEFAULT_SETTINGS };

/**
 * Create a settings store instance
 */
export function createSettingsStore(): SettingsStore {
  return {
    getSettings(): CalculatorSettings {
      return { ...settings };
    },
    
    getPrecision(): number {
      return settings.precision;
    },
    
    getAngleMode(): AngleMode {
      return settings.angleMode;
    },
    
    getDecimalSeparator(): '.' | ',' {
      return settings.decimalSeparator;
    },
    
    getThousandsSeparator(): ',' | '.' | ' ' | '' {
      return settings.thousandsSeparator;
    },
    
    isHighContrast(): boolean {
      return settings.highContrast;
    },
    
    isOnboardingComplete(): boolean {
      return settings.onboardingComplete;
    },
    
    isCurrencyApiEnabled(): boolean {
      return settings.currencyApiEnabled;
    },
    
    isArbitraryPrecisionEnabled(): boolean {
      return settings.arbitraryPrecisionEnabled;
    },
    
    setPrecision(precision: number): void {
      if (precision >= 1 && precision <= 100) {
        settings.precision = precision;
      }
    },
    
    setAngleMode(mode: AngleMode): void {
      settings.angleMode = mode;
    },
    
    setDecimalSeparator(separator: '.' | ','): void {
      settings.decimalSeparator = separator;
    },
    
    setThousandsSeparator(separator: ',' | '.' | ' ' | ''): void {
      settings.thousandsSeparator = separator;
    },
    
    setHighContrast(enabled: boolean): void {
      settings.highContrast = enabled;
      // Apply to document
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('high-contrast', enabled);
      }
    },
    
    setOnboardingComplete(complete: boolean): void {
      settings.onboardingComplete = complete;
    },
    
    setCurrencyApiEnabled(enabled: boolean): void {
      settings.currencyApiEnabled = enabled;
    },
    
    setArbitraryPrecisionEnabled(enabled: boolean): void {
      settings.arbitraryPrecisionEnabled = enabled;
    },
    
    persist(): void {
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      } catch {
        console.warn('Failed to persist settings');
      }
    },
    
    restore(): void {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<CalculatorSettings>;
          settings = { ...DEFAULT_SETTINGS, ...parsed };
          
          // Apply high contrast if enabled
          if (settings.highContrast && typeof document !== 'undefined') {
            document.documentElement.classList.add('high-contrast');
          }
        }
      } catch {
        console.warn('Failed to restore settings');
      }
    },
    
    reset(): void {
      settings = { ...DEFAULT_SETTINGS };
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('high-contrast');
      }
    }
  };
}

/**
 * Reset settings store (for testing)
 */
export function resetSettingsStore(): void {
  settings = { ...DEFAULT_SETTINGS };
}
