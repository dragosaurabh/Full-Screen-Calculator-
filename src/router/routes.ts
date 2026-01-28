/**
 * Route Configuration for CalcPro
 * 
 * Defines all routes with SEO metadata for each calculator mode,
 * help page, and privacy page.
 */

import type { CalculatorMode } from '../types';

export interface RouteConfig {
  path: string;
  mode?: CalculatorMode;
  title: string;
  description: string;
  keywords: string[];
}

export const MODE_ROUTES: Record<CalculatorMode, RouteConfig> = {
  basic: {
    path: '/basic-calculator',
    mode: 'basic',
    title: 'Basic Calculator - Free Online Calculator | CalcPro',
    description: 'Free basic calculator for everyday arithmetic. Add, subtract, multiply, divide with proper order of operations.',
    keywords: ['basic calculator', 'online calculator', 'free calculator', 'arithmetic', 'math calculator']
  },
  scientific: {
    path: '/scientific-calculator',
    mode: 'scientific',
    title: 'Scientific Calculator - Advanced Math Functions | CalcPro',
    description: 'Free scientific calculator with trigonometry, logarithms, exponents, and advanced mathematical functions.',
    keywords: ['scientific calculator', 'trig calculator', 'logarithm', 'exponent', 'sin cos tan']
  },
  programmer: {
    path: '/programmer-calculator',
    mode: 'programmer',
    title: 'Programmer Calculator - Binary, Hex, Octal | CalcPro',
    description: 'Programmer calculator for binary, hexadecimal, octal conversions and bitwise operations.',
    keywords: ['programmer calculator', 'binary calculator', 'hex calculator', 'bitwise', 'base conversion']
  },
  graphing: {
    path: '/graphing-calculator',
    mode: 'graphing',
    title: 'Graphing Calculator - Plot Functions Online | CalcPro',
    description: 'Free online graphing calculator. Plot mathematical functions, visualize equations, and explore graphs.',
    keywords: ['graphing calculator', 'plot functions', 'graph equations', 'function plotter', 'math graphs']
  },
  matrix: {
    path: '/matrix-calculator',
    mode: 'matrix',
    title: 'Matrix Calculator - Operations & Determinants | CalcPro',
    description: 'Matrix calculator for addition, multiplication, determinants, inverse, and transpose operations.',
    keywords: ['matrix calculator', 'matrix multiplication', 'determinant', 'inverse matrix', 'linear algebra']
  },
  complex: {
    path: '/complex-number-calculator',
    mode: 'complex',
    title: 'Complex Number Calculator - Imaginary Numbers | CalcPro',
    description: 'Complex number calculator for operations with imaginary numbers. Add, multiply, divide complex numbers.',
    keywords: ['complex number calculator', 'imaginary numbers', 'complex arithmetic', 'i calculator']
  },
  statistics: {
    path: '/statistics-calculator',
    mode: 'statistics',
    title: 'Statistics Calculator - Mean, Median, Std Dev | CalcPro',
    description: 'Statistics calculator for mean, median, mode, standard deviation, variance, and statistical analysis.',
    keywords: ['statistics calculator', 'mean calculator', 'standard deviation', 'variance', 'statistical analysis']
  },
  financial: {
    path: '/financial-calculator',
    mode: 'financial',
    title: 'Financial Calculator - Loans, Interest, NPV | CalcPro',
    description: 'Financial calculator for loan payments, compound interest, NPV, IRR, and investment calculations.',
    keywords: ['financial calculator', 'loan calculator', 'interest calculator', 'NPV', 'mortgage calculator']
  },
  converter: {
    path: '/unit-converter',
    mode: 'converter',
    title: 'Unit Converter - Length, Weight, Temperature | CalcPro',
    description: 'Free unit converter for length, weight, temperature, volume, and more. Convert between metric and imperial.',
    keywords: ['unit converter', 'metric converter', 'length converter', 'weight converter', 'temperature converter']
  }
};

export const STATIC_ROUTES = {
  home: {
    path: '/',
    title: 'CalcPro - Free Online Calculator',
    description: 'Free online calculator with basic, scientific, programmer, graphing, and more modes. Fast, accurate, and easy to use.',
    keywords: ['calculator', 'online calculator', 'free calculator', 'math calculator', 'CalcPro']
  },
  help: {
    path: '/help',
    title: 'Help & Documentation - CalcPro',
    description: 'Learn how to use CalcPro calculator features. Guides for all calculator modes, keyboard shortcuts, and tips.',
    keywords: ['calculator help', 'calculator guide', 'how to use calculator', 'calculator tutorial']
  },
  privacy: {
    path: '/privacy',
    title: 'Privacy Policy - CalcPro',
    description: 'CalcPro privacy policy. Learn how we handle your data and protect your privacy.',
    keywords: ['privacy policy', 'data protection', 'CalcPro privacy']
  }
};

// Get route config by path
export function getRouteByPath(path: string): RouteConfig | undefined {
  // Check static routes
  if (path === STATIC_ROUTES.home.path) return STATIC_ROUTES.home;
  if (path === STATIC_ROUTES.help.path) return STATIC_ROUTES.help;
  if (path === STATIC_ROUTES.privacy.path) return STATIC_ROUTES.privacy;
  
  // Check mode routes
  for (const mode of Object.keys(MODE_ROUTES) as CalculatorMode[]) {
    if (MODE_ROUTES[mode].path === path) {
      return MODE_ROUTES[mode];
    }
  }
  
  return undefined;
}

// Get mode from path
export function getModeFromPath(path: string): CalculatorMode | undefined {
  for (const mode of Object.keys(MODE_ROUTES) as CalculatorMode[]) {
    if (MODE_ROUTES[mode].path === path) {
      return mode;
    }
  }
  // Default to basic for home route
  if (path === '/') return 'basic';
  return undefined;
}

// Get path from mode
export function getPathFromMode(mode: CalculatorMode): string {
  return MODE_ROUTES[mode].path;
}
