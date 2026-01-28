# Implementation Plan: Advanced Calculator

## Overview

This implementation plan breaks down the advanced calculator into incremental coding tasks. Each task builds on previous work, ensuring no orphaned code. The plan prioritizes core functionality first, then adds advanced features. Property-based tests are placed close to their implementations to catch errors early.

## Tasks

- [x] 1. Project Setup and Core Infrastructure
  - [x] 1.1 Initialize Vite + React 18 + TypeScript project
    - Create project with `npm create vite@latest`
    - Configure TypeScript strict mode
    - Set up path aliases in tsconfig.json
    - _Requirements: 24.4_
  
  - [x] 1.2 Configure Tailwind CSS with CSS variables
    - Install and configure Tailwind CSS
    - Set up CSS variables for light theme
    - Configure high-contrast theme variant
    - _Requirements: 18.3, 19.5_
  
  - [x] 1.3 Set up testing infrastructure
    - Install Jest, React Testing Library, fast-check
    - Configure Jest for TypeScript
    - Set up test scripts in package.json
    - _Requirements: 23.1, 23.5_
  
  - [x] 1.4 Create project directory structure
    - Create src/components/, src/engine/, src/hooks/, src/utils/, src/tests/
    - Create placeholder index files
    - _Requirements: N/A (infrastructure)_

- [x] 2. Expression Parser Implementation
  - [x] 2.1 Implement tokenizer
    - Create Token and TokenType types
    - Implement tokenize() function for numbers, operators, functions, variables, constants
    - Handle implicit multiplication detection
    - _Requirements: 10.1, 10.2_
  
  - [x] 2.2 Implement AST parser
    - Create ASTNode types (NumberNode, BinaryOpNode, UnaryOpNode, FunctionCallNode, etc.)
    - Implement recursive descent parser with operator precedence
    - Handle parentheses grouping
    - _Requirements: 10.1, 1.2_
  
  - [x] 2.3 Implement pretty printer
    - Create prettyPrint() function to convert AST back to string
    - Preserve operator precedence in output
    - _Requirements: 10.7_
  
  - [x] 2.4 Write property test for expression parsing round-trip
    - **Property 1: Expression Parsing Round-Trip**
    - **Validates: Requirements 10.7**
  
  - [x] 2.5 Implement expression validator
    - Create validate() function returning ValidationResult
    - Detect unbalanced parentheses, invalid operators, unknown functions
    - _Requirements: 10.1_

- [x] 3. Basic Calculator Engine
  - [x] 3.1 Implement basic arithmetic evaluator
    - Create evaluate() function for +, -, *, /, %
    - Implement operator precedence (PEMDAS)
    - Handle parentheses grouping
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 3.2 Write property test for basic arithmetic
    - **Property 2: Basic Arithmetic Evaluation**
    - **Validates: Requirements 1.1, 1.2, 1.3**
  
  - [x] 3.3 Implement mathematical constants
    - Add π, e, φ (phi), τ (tau) constants
    - Ensure 15+ significant digit accuracy
    - _Requirements: 10.3_
  
  - [x] 3.4 Write property test for constants accuracy
    - **Property 25: Mathematical Constants Accuracy**
    - **Validates: Requirements 10.3**
  
  - [x] 3.5 Implement division by zero handling
    - Return appropriate error for division by zero
    - _Requirements: 1.4_

- [x] 4. Checkpoint - Core Parser and Basic Calculator
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Scientific Calculator Mode
  - [x] 5.1 Implement trigonometric functions
    - Add sin, cos, tan, asin, acos, atan
    - Implement angle mode (degrees/radians) conversion
    - _Requirements: 2.1, 2.7, 2.8_
  
  - [x] 5.2 Write property test for angle mode consistency
    - **Property 4: Angle Mode Consistency**
    - **Validates: Requirements 2.7, 2.8**
  
  - [x] 5.3 Implement hyperbolic functions
    - Add sinh, cosh, tanh
    - _Requirements: 2.2_
  
  - [x] 5.4 Implement exponential and logarithmic functions
    - Add exp, ln, log10, log2
    - _Requirements: 2.3_
  
  - [x] 5.5 Implement factorial and gamma functions
    - Add factorial for non-negative integers
    - Add gamma function using mathjs
    - _Requirements: 2.4, 2.6_
  
  - [x] 5.6 Implement power and root functions
    - Add power (^), sqrt, nth-root
    - _Requirements: 2.5_
  
  - [x] 5.7 Write property test for scientific functions
    - **Property 3: Scientific Function Accuracy**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6**

- [x] 6. Variable and Function System
  - [x] 6.1 Implement variable assignment and storage
    - Create variable storage Map
    - Implement setVariable() and getVariable()
    - Persist to localStorage
    - _Requirements: 10.4_
  
  - [x] 6.2 Write property test for variable persistence
    - **Property 26: Variable Assignment Persistence**
    - **Validates: Requirements 10.4**
  
  - [x] 6.3 Implement custom function definition
    - Create function storage with name, params, body
    - Implement defineFunction() and evaluateFunction()
    - Persist to localStorage
    - _Requirements: 10.5_
  
  - [x] 6.4 Write property test for custom functions
    - **Property 27: Custom Function Evaluation**
    - **Validates: Requirements 10.5**

- [x] 7. Checkpoint - Scientific Mode Complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Programmer Calculator Mode (Lazy-loaded)
  - [x] 8.1 Create lazy-loaded Programmer module
    - Set up dynamic import for programmer mode
    - Create ProgrammerEngine interface
    - _Requirements: 21.2_
  
  - [x] 8.2 Implement number base conversions
    - Add toBase() and fromBase() for binary, octal, decimal, hex
    - Support BigInt for large numbers
    - _Requirements: 3.1, 3.2_
  
  - [x] 8.3 Write property test for base conversion round-trip
    - **Property 5: Number Base Conversion Round-Trip**
    - **Validates: Requirements 3.1, 3.2**
  
  - [x] 8.4 Implement bitwise operations
    - Add AND, OR, XOR, NOT operations
    - Add left shift, right shift
    - _Requirements: 3.3, 3.4_
  
  - [x] 8.5 Write property test for bitwise operations
    - **Property 6: Bitwise Operation Correctness**
    - **Validates: Requirements 3.3, 3.4**
  
  - [x] 8.6 Implement two's complement support
    - Add toTwosComplement() and fromTwosComplement()
    - Support configurable bit width (8, 16, 32, 64)
    - _Requirements: 3.5_
  
  - [x] 8.7 Write property test for two's complement
    - **Property 7: Two's Complement Consistency**
    - **Validates: Requirements 3.5**

- [x] 9. Matrix and Linear Algebra Mode
  - [x] 9.1 Implement Matrix data structure
    - Create Matrix interface and factory function
    - Implement matrix creation with validation
    - _Requirements: 5.1_
  
  - [x] 9.2 Write property test for matrix creation
    - **Property 9: Matrix Creation Preservation**
    - **Validates: Requirements 5.1**
  
  - [x] 9.3 Implement matrix multiplication
    - Add multiply() with dimension validation
    - _Requirements: 5.2_
  
  - [x] 9.4 Write property test for matrix multiplication
    - **Property 10: Matrix Multiplication Associativity**
    - **Validates: Requirements 5.2**
  
  - [x] 9.5 Implement matrix inverse and determinant
    - Add inverse() with singularity check
    - Add determinant() calculation
    - _Requirements: 5.3, 5.5_
  
  - [x] 9.6 Write property tests for inverse and determinant
    - **Property 11: Matrix Inverse Identity**
    - **Property 12: Determinant Multiplicativity**
    - **Validates: Requirements 5.3, 5.5**
  
  - [x] 9.7 Implement linear system solver
    - Add solve() for Ax = b systems
    - Handle no-solution and infinite-solution cases
    - _Requirements: 5.6_
  
  - [x] 9.8 Write property test for linear system solver
    - **Property 13: Linear System Solution Verification**
    - **Validates: Requirements 5.6**

- [x] 10. Checkpoint - Programmer and Matrix Modes
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Complex Numbers Mode
  - [x] 11.1 Implement Complex number type
    - Create Complex interface with real and imag
    - Implement parsing for a + bi format
    - _Requirements: 6.1_
  
  - [x] 11.2 Write property test for complex parsing
    - **Property 14: Complex Number Parsing Preservation**
    - **Validates: Requirements 6.1**
  
  - [x] 11.3 Implement complex arithmetic
    - Add add(), subtract(), multiply(), divide()
    - Add conjugate(), magnitude(), phase()
    - _Requirements: 6.2_
  
  - [x] 11.4 Write property test for complex arithmetic
    - **Property 15: Complex Arithmetic Correctness**
    - **Validates: Requirements 6.2**
  
  - [x] 11.5 Implement polar/rectangular conversion
    - Add toPolar() and fromPolar()
    - _Requirements: 6.3, 6.4_
  
  - [x] 11.6 Write property test for complex representation
    - **Property 16: Complex Representation Round-Trip**
    - **Validates: Requirements 6.3, 6.4**

- [x] 12. Statistics and Probability Mode
  - [x] 12.1 Implement basic statistics
    - Add mean(), median(), mode()
    - Handle empty data set error
    - _Requirements: 7.1, 7.4_
  
  - [x] 12.2 Write property test for mean
    - **Property 17: Statistical Mean Definition**
    - **Validates: Requirements 7.1**
  
  - [x] 12.3 Implement variance and standard deviation
    - Add variance() and standardDeviation()
    - Support population and sample variants
    - _Requirements: 7.2_
  
  - [x] 12.4 Write property test for standard deviation
    - **Property 18: Standard Deviation Consistency**
    - **Validates: Requirements 7.2**
  
  - [x] 12.5 Implement probability distributions
    - Add normalPdf(), normalCdf()
    - Add binomialPmf(), poissonPmf()
    - _Requirements: 7.3_
  
  - [x] 12.6 Write property test for distributions
    - **Property 19: Probability Distribution Properties**
    - **Validates: Requirements 7.3**

- [x] 13. Financial Calculator Mode
  - [x] 13.1 Implement TVM calculations
    - Add futureValue(), presentValue(), payment()
    - Add periods(), rate() solvers
    - _Requirements: 8.1, 8.2_
  
  - [x] 13.2 Write property test for TVM consistency
    - **Property 20: TVM Calculation Consistency**
    - **Validates: Requirements 8.1, 8.2**
  
  - [x] 13.3 Implement amortization schedule
    - Generate payment breakdown table
    - Calculate principal, interest, balance per period
    - _Requirements: 8.3_
  
  - [x] 13.4 Write property test for amortization
    - **Property 21: Amortization Schedule Balance**
    - **Validates: Requirements 8.3**

- [x] 14. Unit Converter Mode
  - [x] 14.1 Implement unit conversion engine
    - Create unit definitions for length, mass, time, data
    - Implement convert() function
    - _Requirements: 9.1, 9.2_
  
  - [x] 14.2 Write property test for unit conversion
    - **Property 22: Unit Conversion Round-Trip**
    - **Validates: Requirements 9.2**
  
  - [x] 14.3 Implement temperature conversions
    - Handle non-linear C/F/K conversions
    - _Requirements: 9.4_
  
  - [x] 14.4 Write property test for temperature
    - **Property 23: Temperature Conversion Accuracy**
    - **Validates: Requirements 9.4**
  
  - [ ] 14.5 Implement optional currency conversion
    - Add offline exchange rates
    - Implement permission request for API
    - _Requirements: 9.3, 22.6_

- [x] 15. Checkpoint - All Calculator Modes Complete
  - All calculator mode engines implemented and tested
  - 230 tests passing
  - Build succeeds

- [x] 16. Arbitrary Precision Mode
  - [x] 16.1 Integrate decimal.js for high precision
    - Configure decimal.js with configurable precision
    - Wrap arithmetic operations for precision mode
    - _Requirements: 11.1, 11.2_
  
  - [x] 16.2 Write property test for precision
    - **Property 28: Arbitrary Precision Accuracy**
    - **Validates: Requirements 11.1, 11.2**
  
  - [x] 16.3 Implement precision display formatting
    - Format results to configured significant digits
    - _Requirements: 11.3_
  
  - [x] 16.4 Write property test for display precision
    - **Property 29: Display Precision Formatting**
    - **Validates: Requirements 11.3**

- [x] 17. Web Worker Integration
  - [x] 17.1 Create calculation Web Worker
    - Set up worker.ts with message handling
    - Implement WorkerRequest/WorkerResponse protocol
    - _Requirements: 21.3_
  
  - [x] 17.2 Offload heavy computations to worker
    - Route matrix operations to worker
    - Route graph sampling to worker
    - Add progress reporting for long operations
    - _Requirements: 21.3, 4.8_

- [x] 18. UI Components - Core Calculator
  - [x] 18.1 Implement CalculatorShell component
    - Create main container with two-column layout
    - Implement responsive breakpoints (desktop/tablet/mobile)
    - _Requirements: 16.1, 16.2, 16.3_
  
  - [x] 18.2 Implement Display component
    - Show expression and result
    - Add ARIA live region for screen reader announcements
    - Format numbers based on locale settings
    - _Requirements: 11.3, 18.1, 18.4_
  
  - [x] 18.3 Implement Keypad component
    - Create mode-specific button layouts
    - Ensure 44px minimum touch targets on mobile
    - Add ARIA roles and labels to all buttons
    - _Requirements: 16.4, 18.2_
  
  - [x] 18.4 Write property test for touch targets
    - **Property 38: Mobile Touch Target Size**
    - **Validates: Requirements 16.4**
  
  - [x] 18.5 Write property test for ARIA labels
    - **Property 40: ARIA Labels Completeness**
    - **Validates: Requirements 18.2**
  
  - [x] 18.6 Implement ModeSwitcher component
    - Create tab-based mode selection
    - Support Alt+1-9 keyboard shortcuts
    - _Requirements: 2.1, 17.7_

- [x] 19. UI Components - Panels
  - [x] 19.1 Implement HistoryPanel component
    - Display history entries with timestamps
    - Support pin/favorite functionality
    - Implement clear (preserving pinned)
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  
  - [x] 19.2 Implement SettingsPanel component
    - Add precision, angle mode, locale controls
    - Add high-contrast toggle
    - Display keyboard shortcuts help
    - _Requirements: 19.1, 19.5, 19.6_
  
  - [x] 19.3 Implement Modal and shared components
    - Create accessible Modal with focus trap
    - Create IconButton and Toggle components
    - _Requirements: 18.1_

- [x] 20. Checkpoint - Core UI Complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 21. Graphing Mode (Lazy-loaded)
  - [x] 21.1 Create lazy-loaded Graph module
    - Set up dynamic import for Plotly.js
    - Create GraphCanvas wrapper component
    - _Requirements: 21.1_
  
  - [x] 21.2 Implement function plotting
    - Parse y = f(x) expressions
    - Generate plot data via Web Worker
    - Render with Plotly.js
    - _Requirements: 4.1_
  
  - [x] 21.3 Implement multi-series support
    - Assign unique colors to each function
    - Add legend with toggle visibility
    - _Requirements: 4.2, 4.6_
  
  - [x] 21.4 Write property test for color uniqueness
    - **Property 8: Graph Series Color Uniqueness**
    - **Validates: Requirements 4.2**
  
  - [x] 21.5 Implement graph interactions
    - Add pan and zoom support
    - Add hover tooltips with coordinates
    - _Requirements: 4.3, 4.4_
  
  - [x] 21.6 Implement graph export
    - Export as PNG and SVG
    - Export data as CSV
    - _Requirements: 4.5, 12.3_
  
  - [x] 21.7 Implement parametric and complex plotting
    - Support parametric curves
    - Plot real/imaginary parts separately for complex functions
    - _Requirements: 4.7, 4.9_
  
  - [x] 21.8 Implement GraphControls component
    - Expression input with validation
    - Range controls (auto and manual)
    - Series management UI
    - _Requirements: 4.1, 4.6_

- [x] 22. Memory System
  - [x] 22.1 Implement Memory Manager
    - Add M+, M-, MR, MC operations
    - Implement named memory slots
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 22.2 Write property test for memory operations
    - **Property 34: Memory Operations Consistency**
    - **Validates: Requirements 14.1, 14.2, 14.3, 14.4**
  
  - [x] 22.3 Write property test for named slots
    - **Property 35: Named Memory Slot Storage**
    - **Validates: Requirements 14.5**
  
  - [x] 22.4 Implement memory persistence
    - Save to localStorage
    - Restore on page load
    - _Requirements: 14.6_
  
  - [x] 22.5 Write property test for memory persistence
    - **Property 36: Memory Persistence**
    - **Validates: Requirements 14.6**

- [x] 23. History System
  - [x] 23.1 Implement History Store
    - Create history entries with timestamps
    - Support pinning entries
    - _Requirements: 13.1, 13.2_
  
  - [x] 23.2 Write property test for history creation
    - **Property 31: History Entry Creation**
    - **Validates: Requirements 13.1**
  
  - [x] 23.3 Implement history clear
    - Clear non-pinned entries
    - _Requirements: 13.4_
  
  - [x] 23.4 Write property test for history clear
    - **Property 32: History Clear Preserves Pinned**
    - **Validates: Requirements 13.4**
  
  - [x] 23.5 Implement history persistence
    - Save to localStorage
    - Restore on page load
    - _Requirements: 13.5_
  
  - [x] 23.6 Write property test for history persistence
    - **Property 33: History Persistence**
    - **Validates: Requirements 13.5**

- [x] 24. Undo/Redo System
  - [x] 24.1 Implement undo/redo stack
    - Track input changes
    - Implement undo() and redo() functions
    - Handle empty stack states
    - _Requirements: 15.1, 15.2, 15.3, 15.4_
  
  - [x] 24.2 Write property test for undo/redo
    - **Property 37: Undo-Redo Round-Trip**
    - **Validates: Requirements 15.1, 15.2**

- [x] 25. Checkpoint - Features Complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 26. Keyboard Shortcuts
  - [x] 26.1 Implement useKeyboardShortcuts hook
    - Handle Enter for evaluate
    - Handle Ctrl/Cmd+Z/Y for undo/redo
    - Handle Ctrl/Cmd+H/G/M for panel toggles
    - Handle Alt+1-9 for mode switching
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7_
  
  - [x] 26.2 Implement keyboard input handling
    - Append digits and operators on keypress
    - _Requirements: 17.8_
  
  - [x] 26.3 Write property test for keyboard input
    - **Property 39: Keyboard Input Append**
    - **Validates: Requirements 17.8**

- [x] 27. Settings Persistence
  - [x] 27.1 Implement Settings Store
    - Create useLocalStorage hook
    - Store precision, angle mode, locale, high-contrast
    - _Requirements: 19.2, 19.3, 19.4, 19.7_
  
  - [x] 27.2 Write property test for settings application
    - **Property 43: Settings Application Immediacy**
    - **Validates: Requirements 19.2, 19.3, 19.4**
  
  - [x] 27.3 Write property test for settings persistence
    - **Property 44: Settings Persistence**
    - **Validates: Requirements 19.7**

- [x] 28. Batch Calculation and Import/Export
  - [x] 28.1 Implement CSV import
    - Parse CSV with expressions
    - Evaluate each expression
    - Handle invalid expressions with error reporting
    - _Requirements: 12.1, 12.4_
  
  - [x] 28.2 Write property test for batch calculation
    - **Property 30: Batch Calculation Completeness**
    - **Validates: Requirements 12.1**
  
  - [x] 28.3 Implement CSV export
    - Export calculation results
    - Export graph data
    - _Requirements: 12.2, 12.3_
  
  - [x] 28.4 Implement data export/import
    - Export all user data (settings, history, memory, variables)
    - Import and restore data
    - _Requirements: 22.4, 22.5_
  
  - [x] 28.5 Write property test for data import
    - **Property 47: Data Import Restoration**
    - **Validates: Requirements 22.5**

- [x] 29. Accessibility Compliance
  - [x] 29.1 Implement semantic HTML structure
    - Use appropriate heading levels
    - Use landmark regions
    - _Requirements: 18.1_
  
  - [x] 29.2 Implement WCAG AA contrast
    - Verify all text meets contrast requirements
    - Implement high-contrast mode styles
    - _Requirements: 18.3, 18.5_
  
  - [x] 29.3 Write property test for contrast
    - **Property 41: WCAG AA Contrast Compliance**
    - **Validates: Requirements 18.3**
  
  - [x] 29.4 Implement focus navigation
    - Ensure logical tab order
    - Add visible focus indicators
    - _Requirements: 18.6_
  
  - [x] 29.5 Write property test for focus navigation
    - **Property 42: Focus Navigation Order**
    - **Validates: Requirements 18.6**
  
  - [x] 29.6 Implement screen reader announcements
    - Add ARIA live regions for results
    - Announce errors and state changes
    - _Requirements: 18.4_

- [x] 30. Onboarding
  - [x] 30.1 Implement onboarding tooltips
    - Show tooltips for first-time users
    - Highlight key features
    - _Requirements: 20.1_
  
  - [x] 30.2 Implement onboarding persistence
    - Track completion in localStorage
    - Don't show again after dismissal
    - _Requirements: 20.2, 20.3_
  
  - [x] 30.3 Write property test for onboarding persistence
    - **Property 45: Onboarding State Persistence**
    - **Validates: Requirements 20.3**

- [x] 31. Checkpoint - All Features Complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 32. Privacy and Local Storage
  - [x] 32.1 Verify no external data transmission
    - Audit all network requests
    - Ensure only opt-in currency API makes requests
    - _Requirements: 22.1, 22.2_
  
  - [x] 32.2 Write property test for local storage
    - **Property 46: Local Data Storage Exclusivity**
    - **Validates: Requirements 22.3**

- [x] 33. Performance Optimization
  - [x] 33.1 Verify lazy loading
    - Confirm Graphing module is lazy-loaded
    - Confirm Programmer module is lazy-loaded
    - _Requirements: 21.1, 21.2_
  
  - [x] 33.2 Optimize bundle size
    - Analyze bundle with rollup-plugin-visualizer
    - Ensure initial bundle < 250KB gzipped
    - _Requirements: 21.4_
  
  - [x] 33.3 Run Lighthouse audit
    - Verify performance score ≥ 90
    - Address any performance issues
    - _Requirements: 21.5_

- [x] 34. End-to-End Tests
  - [x] 34.1 Set up Playwright
    - Install and configure Playwright
    - Create test fixtures
    - _Requirements: 23.6_
  
  - [x] 34.2 Write E2E tests for basic calculation flow
    - Test expression entry and evaluation
    - Test all basic operations
    - _Requirements: 23.6_
  
  - [x] 34.3 Write E2E tests for mode switching
    - Test switching between all modes
    - Verify mode-specific UI
    - _Requirements: 23.6_
  
  - [x] 34.4 Write E2E tests for history and settings
    - Test history operations
    - Test settings changes
    - _Requirements: 23.6_
  
  - [x] 34.5 Write E2E tests for graphing
    - Test function plotting
    - Test graph interactions
    - Test export
    - _Requirements: 23.6_
  
  - [x] 34.6 Write accessibility E2E tests
    - Integrate axe-core with Playwright
    - Scan all pages for violations
    - _Requirements: 23.7_

- [x] 35. CI/CD Setup
  - [x] 35.1 Create GitHub Actions workflow
    - Run unit tests on push
    - Run property tests on push
    - Run E2E tests on push
    - _Requirements: 24.1, 24.2_
  
  - [x] 35.2 Add build and deploy steps
    - Generate production build on test pass
    - Configure for Netlify/Vercel deployment
    - _Requirements: 24.3, 24.4_
  
  - [x] 35.3 Add bundle size check
    - Fail CI if bundle exceeds 250KB
    - _Requirements: 21.4, 23.8_

- [x] 36. Documentation
  - [x] 36.1 Create README.md
    - Add setup instructions
    - Add build instructions
    - Add test instructions
    - Add deployment instructions
    - _Requirements: 24.5_

- [x] 37. Final Checkpoint
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all requirements are implemented
  - Verify bundle size and performance targets met

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Lazy-loaded modules (Graphing, Programmer) are implemented in dedicated tasks
- Web Worker integration happens after core engine is complete
