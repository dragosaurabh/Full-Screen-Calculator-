/**
 * Unit Converter Mode
 * 
 * Implements unit conversions for various categories.
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4
 */

import type { UnitInfo } from '../../types';

export interface UnitConverter {
  convert(value: number, fromUnit: string, toUnit: string): number;
  getCategories(): string[];
  getUnits(category: string): UnitInfo[];
  setExchangeRates(rates: Record<string, number>): void;
}

// Unit definitions with conversion factors to base unit
interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  category: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

// Length units (base: meter)
const lengthUnits: UnitDefinition[] = [
  { id: 'meter', name: 'Meter', symbol: 'm', category: 'length', toBase: v => v, fromBase: v => v },
  { id: 'kilometer', name: 'Kilometer', symbol: 'km', category: 'length', toBase: v => v * 1000, fromBase: v => v / 1000 },
  { id: 'centimeter', name: 'Centimeter', symbol: 'cm', category: 'length', toBase: v => v / 100, fromBase: v => v * 100 },
  { id: 'millimeter', name: 'Millimeter', symbol: 'mm', category: 'length', toBase: v => v / 1000, fromBase: v => v * 1000 },
  { id: 'mile', name: 'Mile', symbol: 'mi', category: 'length', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
  { id: 'yard', name: 'Yard', symbol: 'yd', category: 'length', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
  { id: 'foot', name: 'Foot', symbol: 'ft', category: 'length', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
  { id: 'inch', name: 'Inch', symbol: 'in', category: 'length', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
  { id: 'nautical_mile', name: 'Nautical Mile', symbol: 'nmi', category: 'length', toBase: v => v * 1852, fromBase: v => v / 1852 },
];

// Mass units (base: kilogram)
const massUnits: UnitDefinition[] = [
  { id: 'kilogram', name: 'Kilogram', symbol: 'kg', category: 'mass', toBase: v => v, fromBase: v => v },
  { id: 'gram', name: 'Gram', symbol: 'g', category: 'mass', toBase: v => v / 1000, fromBase: v => v * 1000 },
  { id: 'milligram', name: 'Milligram', symbol: 'mg', category: 'mass', toBase: v => v / 1000000, fromBase: v => v * 1000000 },
  { id: 'metric_ton', name: 'Metric Ton', symbol: 't', category: 'mass', toBase: v => v * 1000, fromBase: v => v / 1000 },
  { id: 'pound', name: 'Pound', symbol: 'lb', category: 'mass', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
  { id: 'ounce', name: 'Ounce', symbol: 'oz', category: 'mass', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
  { id: 'stone', name: 'Stone', symbol: 'st', category: 'mass', toBase: v => v * 6.35029, fromBase: v => v / 6.35029 },
];

// Time units (base: second)
const timeUnits: UnitDefinition[] = [
  { id: 'second', name: 'Second', symbol: 's', category: 'time', toBase: v => v, fromBase: v => v },
  { id: 'millisecond', name: 'Millisecond', symbol: 'ms', category: 'time', toBase: v => v / 1000, fromBase: v => v * 1000 },
  { id: 'minute', name: 'Minute', symbol: 'min', category: 'time', toBase: v => v * 60, fromBase: v => v / 60 },
  { id: 'hour', name: 'Hour', symbol: 'h', category: 'time', toBase: v => v * 3600, fromBase: v => v / 3600 },
  { id: 'day', name: 'Day', symbol: 'd', category: 'time', toBase: v => v * 86400, fromBase: v => v / 86400 },
  { id: 'week', name: 'Week', symbol: 'wk', category: 'time', toBase: v => v * 604800, fromBase: v => v / 604800 },
  { id: 'year', name: 'Year', symbol: 'yr', category: 'time', toBase: v => v * 31536000, fromBase: v => v / 31536000 },
];

// Temperature units (non-linear conversions)
const temperatureUnits: UnitDefinition[] = [
  { id: 'celsius', name: 'Celsius', symbol: '°C', category: 'temperature', toBase: v => v, fromBase: v => v },
  { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F', category: 'temperature', toBase: v => (v - 32) * 5/9, fromBase: v => v * 9/5 + 32 },
  { id: 'kelvin', name: 'Kelvin', symbol: 'K', category: 'temperature', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
];

// Data units (base: byte)
const dataUnits: UnitDefinition[] = [
  { id: 'byte', name: 'Byte', symbol: 'B', category: 'data', toBase: v => v, fromBase: v => v },
  { id: 'kilobyte', name: 'Kilobyte', symbol: 'KB', category: 'data', toBase: v => v * 1024, fromBase: v => v / 1024 },
  { id: 'megabyte', name: 'Megabyte', symbol: 'MB', category: 'data', toBase: v => v * 1048576, fromBase: v => v / 1048576 },
  { id: 'gigabyte', name: 'Gigabyte', symbol: 'GB', category: 'data', toBase: v => v * 1073741824, fromBase: v => v / 1073741824 },
  { id: 'terabyte', name: 'Terabyte', symbol: 'TB', category: 'data', toBase: v => v * 1099511627776, fromBase: v => v / 1099511627776 },
  { id: 'bit', name: 'Bit', symbol: 'b', category: 'data', toBase: v => v / 8, fromBase: v => v * 8 },
  { id: 'kilobit', name: 'Kilobit', symbol: 'Kb', category: 'data', toBase: v => v * 128, fromBase: v => v / 128 },
  { id: 'megabit', name: 'Megabit', symbol: 'Mb', category: 'data', toBase: v => v * 131072, fromBase: v => v / 131072 },
];

// Area units (base: square meter)
const areaUnits: UnitDefinition[] = [
  { id: 'square_meter', name: 'Square Meter', symbol: 'm²', category: 'area', toBase: v => v, fromBase: v => v },
  { id: 'square_kilometer', name: 'Square Kilometer', symbol: 'km²', category: 'area', toBase: v => v * 1000000, fromBase: v => v / 1000000 },
  { id: 'hectare', name: 'Hectare', symbol: 'ha', category: 'area', toBase: v => v * 10000, fromBase: v => v / 10000 },
  { id: 'acre', name: 'Acre', symbol: 'ac', category: 'area', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
  { id: 'square_foot', name: 'Square Foot', symbol: 'ft²', category: 'area', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
  { id: 'square_inch', name: 'Square Inch', symbol: 'in²', category: 'area', toBase: v => v * 0.00064516, fromBase: v => v / 0.00064516 },
];

// Volume units (base: liter)
const volumeUnits: UnitDefinition[] = [
  { id: 'liter', name: 'Liter', symbol: 'L', category: 'volume', toBase: v => v, fromBase: v => v },
  { id: 'milliliter', name: 'Milliliter', symbol: 'mL', category: 'volume', toBase: v => v / 1000, fromBase: v => v * 1000 },
  { id: 'cubic_meter', name: 'Cubic Meter', symbol: 'm³', category: 'volume', toBase: v => v * 1000, fromBase: v => v / 1000 },
  { id: 'gallon_us', name: 'Gallon (US)', symbol: 'gal', category: 'volume', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
  { id: 'gallon_uk', name: 'Gallon (UK)', symbol: 'gal (UK)', category: 'volume', toBase: v => v * 4.54609, fromBase: v => v / 4.54609 },
  { id: 'quart', name: 'Quart', symbol: 'qt', category: 'volume', toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
  { id: 'pint', name: 'Pint', symbol: 'pt', category: 'volume', toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
  { id: 'cup', name: 'Cup', symbol: 'cup', category: 'volume', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
  { id: 'fluid_ounce', name: 'Fluid Ounce', symbol: 'fl oz', category: 'volume', toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
];

// Speed units (base: meters per second)
const speedUnits: UnitDefinition[] = [
  { id: 'meters_per_second', name: 'Meters per Second', symbol: 'm/s', category: 'speed', toBase: v => v, fromBase: v => v },
  { id: 'kilometers_per_hour', name: 'Kilometers per Hour', symbol: 'km/h', category: 'speed', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
  { id: 'miles_per_hour', name: 'Miles per Hour', symbol: 'mph', category: 'speed', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
  { id: 'knot', name: 'Knot', symbol: 'kn', category: 'speed', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
  { id: 'feet_per_second', name: 'Feet per Second', symbol: 'ft/s', category: 'speed', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
];

// All units combined
const allUnits: UnitDefinition[] = [
  ...lengthUnits,
  ...massUnits,
  ...timeUnits,
  ...temperatureUnits,
  ...dataUnits,
  ...areaUnits,
  ...volumeUnits,
  ...speedUnits,
];

// Unit lookup map
const unitMap = new Map<string, UnitDefinition>();
allUnits.forEach(unit => {
  unitMap.set(unit.id, unit);
  unitMap.set(unit.symbol.toLowerCase(), unit);
  unitMap.set(unit.name.toLowerCase(), unit);
});

// Exchange rates (USD as base)
let exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110,
  CAD: 1.25,
  AUD: 1.35,
  CHF: 0.92,
  CNY: 6.45,
  INR: 74.5,
  MXN: 20.1,
};

class ConverterError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ConverterError';
  }
}

/**
 * Unit converter operations
 */
export const converterOperations: UnitConverter = {
  /**
   * Convert a value from one unit to another
   */
  convert: (value: number, fromUnit: string, toUnit: string): number => {
    const from = unitMap.get(fromUnit.toLowerCase());
    const to = unitMap.get(toUnit.toLowerCase());
    
    // Check for currency conversion
    const fromCurrency = exchangeRates[fromUnit.toUpperCase()];
    const toCurrency = exchangeRates[toUnit.toUpperCase()];
    
    if (fromCurrency !== undefined && toCurrency !== undefined) {
      // Currency conversion
      return value * toCurrency / fromCurrency;
    }
    
    if (!from) {
      throw new ConverterError(`Unknown unit: ${fromUnit}`, 'CONVERTER_UNKNOWN_UNIT');
    }
    if (!to) {
      throw new ConverterError(`Unknown unit: ${toUnit}`, 'CONVERTER_UNKNOWN_UNIT');
    }
    
    if (from.category !== to.category) {
      throw new ConverterError(
        `Cannot convert between ${from.category} and ${to.category}`,
        'CONVERTER_INCOMPATIBLE'
      );
    }
    
    // Convert: from -> base -> to
    const baseValue = from.toBase(value);
    return to.fromBase(baseValue);
  },

  /**
   * Get all available categories
   */
  getCategories: (): string[] => {
    const categories = new Set<string>();
    allUnits.forEach(unit => categories.add(unit.category));
    categories.add('currency');
    return Array.from(categories).sort();
  },

  /**
   * Get all units in a category
   */
  getUnits: (category: string): UnitInfo[] => {
    if (category === 'currency') {
      return Object.keys(exchangeRates).map(code => ({
        id: code,
        name: code,
        symbol: code,
        category: 'currency'
      }));
    }
    
    return allUnits
      .filter(unit => unit.category === category)
      .map(unit => ({
        id: unit.id,
        name: unit.name,
        symbol: unit.symbol,
        category: unit.category
      }));
  },

  /**
   * Set exchange rates for currency conversion
   */
  setExchangeRates: (rates: Record<string, number>): void => {
    exchangeRates = { ...rates };
  }
};
