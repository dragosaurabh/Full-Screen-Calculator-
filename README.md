# Advanced Calculator

A production-ready, web-based calculator with multiple modes, graphing capabilities, and full accessibility support.

## Features

- **Multiple Calculator Modes**: Basic, Scientific, Programmer, Graphing, Matrix, Complex, Statistics, Financial, Unit Converter
- **Graphing**: Plot functions with pan, zoom, and export capabilities
- **Arbitrary Precision**: High-precision calculations using decimal.js
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support
- **Offline-First**: All calculations run locally, no data sent to servers
- **Keyboard Shortcuts**: Full keyboard navigation and shortcuts

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run unit and property tests |
| `npm run test:e2e` | Run E2E tests with Playwright |
| `npm run test:coverage` | Run tests with coverage |

## Tech Stack

- React 18 + TypeScript
- Vite for bundling
- Tailwind CSS for styling
- Vitest + fast-check for testing
- Playwright for E2E tests
- Plotly.js for graphing (lazy-loaded)

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Evaluate expression |
| `Escape` | Clear |
| `Backspace` | Delete last character |
| `Alt+1-9` | Switch calculator modes |
| `Ctrl/Cmd+Z` | Undo |
| `Ctrl/Cmd+Y` | Redo |

## Project Structure

```
src/
├── components/     # React components
│   ├── Calculator/ # Main calculator UI
│   ├── Graph/      # Graphing components
│   └── Shared/     # Reusable components
├── engine/         # Calculation engine
│   ├── modes/      # Mode-specific logic
│   ├── parser.ts   # Expression parser
│   └── evaluator.ts# Expression evaluator
├── hooks/          # Custom React hooks
├── tests/          # Test files
│   ├── property/   # Property-based tests
│   ├── unit/       # Unit tests
│   └── e2e/        # E2E tests
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Deployment

The app is configured for deployment to GitHub Pages or any static hosting:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## License

MIT
