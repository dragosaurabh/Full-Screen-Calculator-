/**
 * Content Index
 * 
 * SEO-optimized content for CalcPro calculator pages.
 * Content is stored as markdown and can be rendered in React components.
 */

export const CONTENT_PATHS = {
  // Main pages
  home: 'pages/home.md',
  help: 'pages/help.md',
  privacy: 'pages/privacy.md',
  
  // Feature explanations
  history: 'pages/history-feature.md',
  
  // Calculator mode pages
  basic: 'pages/basic-calculator.md',
  scientific: 'pages/scientific-calculator.md',
  programmer: 'pages/programmer-calculator.md',
  graphing: 'pages/graphing-calculator.md',
  matrix: 'pages/matrix-calculator.md',
  complex: 'pages/complex-number-calculator.md',
  statistics: 'pages/statistics-calculator.md',
  financial: 'pages/financial-calculator.md',
  converter: 'pages/unit-converter.md',
} as const;

export type ContentPage = keyof typeof CONTENT_PATHS;
