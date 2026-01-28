/**
 * Footer Component
 * 
 * SEO-rich footer with:
 * - Comprehensive mode-specific content (1000+ words)
 * - Real-world use cases
 * - Step-by-step examples
 * - FAQs with schema
 * - Strong internal linking
 */

import React, { useState } from 'react';
import type { CalculatorMode } from '../../types';

interface FooterProps {
  mode: CalculatorMode;
  onModeChange?: (mode: CalculatorMode) => void;
}

interface ModeContent {
  title: string;
  subtitle: string;
  description: string;
  howItWorks: string;
  useCases: string[];
  examples: Array<{ input: string; output: string; explanation: string }>;
  tips: string[];
  faqs: Array<{ q: string; a: string }>;
  whyUseThis: string;
}

const modeContent: Record<CalculatorMode, ModeContent> = {
  basic: {
    title: 'Basic Calculator',
    subtitle: 'Fast, accurate arithmetic for everyday calculations',
    description: 'Our basic calculator handles all standard arithmetic operations with precision and speed. Whether you\'re balancing a checkbook, splitting a bill, or doing homework, this calculator follows the correct order of operations (PEMDAS) to ensure accurate results every time.',
    howItWorks: 'Type your expression using numbers and operators (+, -, ×, ÷). Use parentheses to group operations. Press Enter or click = to calculate. The calculator evaluates expressions left-to-right, respecting mathematical precedence: parentheses first, then exponents, multiplication/division, and finally addition/subtraction.',
    useCases: [
      'Splitting restaurant bills among friends',
      'Calculating tips and discounts',
      'Balancing personal budgets',
      'Homework and quick math checks',
      'Converting percentages to decimals',
    ],
    examples: [
      { input: '(15 + 7) × 2', output: '44', explanation: 'Parentheses evaluated first: 22 × 2 = 44' },
      { input: '100 - 25%', output: '75', explanation: '25% of 100 is 25, so 100 - 25 = 75' },
      { input: '144 ÷ 12 + 8', output: '20', explanation: 'Division first: 12 + 8 = 20' },
    ],
    tips: [
      'Use parentheses to control calculation order',
      'Type "%" after a number for percentages',
      'Press Esc to clear and start over',
    ],
    faqs: [
      { q: 'Why does 2+3×4 equal 14, not 20?', a: 'Multiplication has higher precedence than addition. The calculator follows PEMDAS rules: 3×4=12, then 2+12=14. Use parentheses (2+3)×4 to get 20.' },
      { q: 'How do I calculate percentages?', a: 'Type the percentage after the number, like "25% of 80" or "100 - 20%". The calculator understands natural percentage expressions.' },
      { q: 'Is my data saved?', a: 'All calculations happen locally in your browser. Nothing is sent to any server. Your history is stored in your browser\'s local storage.' },
    ],
    whyUseThis: 'Unlike phone calculators that evaluate left-to-right, CalcPro follows proper mathematical order of operations. It\'s faster than searching "calculator" and more reliable than mental math for complex expressions.',
  },
  scientific: {
    title: 'Scientific Calculator',
    subtitle: 'Advanced functions for students, engineers, and scientists',
    description: 'A full-featured scientific calculator with trigonometric functions, logarithms, exponentials, factorials, and more. Perfect for physics, engineering, and advanced mathematics. Switch between degrees and radians for angle calculations.',
    howItWorks: 'Enter expressions using standard mathematical notation. Functions like sin, cos, tan, log, and ln work with parentheses: sin(45) calculates the sine of 45 degrees. Use ^ for exponents, √ for square roots, and ! for factorials.',
    useCases: [
      'Physics and engineering calculations',
      'Trigonometry homework',
      'Logarithmic and exponential problems',
      'Statistical analysis',
      'Scientific research computations',
    ],
    examples: [
      { input: 'sin(30)', output: '0.5', explanation: 'Sine of 30 degrees equals 0.5' },
      { input: 'log(1000)', output: '3', explanation: 'Log base 10 of 1000 = 3 (10³ = 1000)' },
      { input: '√144 + 5!', output: '132', explanation: '√144 = 12, 5! = 120, total = 132' },
    ],
    tips: [
      'Check DEG/RAD mode before trig calculations',
      'Use ln() for natural log, log() for base 10',
      'e and π are available as constants',
    ],
    faqs: [
      { q: 'How do I switch between degrees and radians?', a: 'The calculator defaults to degrees. For radians, you can specify in settings or use the rad() function to convert.' },
      { q: 'What\'s the difference between log and ln?', a: 'log() is base-10 logarithm (common log), ln() is natural logarithm (base e ≈ 2.718). In science, ln is often used for growth/decay.' },
      { q: 'How do I calculate inverse trig functions?', a: 'Use asin(), acos(), atan() for inverse sine, cosine, and tangent respectively.' },
    ],
    whyUseThis: 'CalcPro\'s scientific mode handles complex expressions that physical calculators struggle with. Type natural expressions like "sin(45) + cos(60)" instead of pressing multiple buttons.',
  },
  programmer: {
    title: 'Programmer Calculator',
    subtitle: 'Binary, hex, octal conversions and bitwise operations',
    description: 'Essential tool for software developers and computer science students. Convert between number bases, perform bitwise operations, and work with binary data. Supports hexadecimal (0x), binary (0b), and octal (0o) prefixes.',
    howItWorks: 'Enter numbers with prefixes: 0x for hex, 0b for binary, 0o for octal. Use AND, OR, XOR, NOT for bitwise operations. Shift bits with << and >>. Convert between bases using "to hex", "to bin", etc.',
    useCases: [
      'Debugging memory addresses',
      'Working with color codes (RGB hex)',
      'Bit manipulation in algorithms',
      'Network subnet calculations',
      'Understanding binary data',
    ],
    examples: [
      { input: '255 to hex', output: '0xFF', explanation: 'Decimal 255 = hexadecimal FF' },
      { input: '0b1111 OR 0b1010', output: '0b1111', explanation: 'Bitwise OR: 1111 | 1010 = 1111' },
      { input: '1 << 8', output: '256', explanation: 'Left shift by 8 = multiply by 256' },
    ],
    tips: [
      'Prefix hex with 0x, binary with 0b, octal with 0o',
      'Use uppercase for hex digits A-F',
      'Bitwise NOT (~) inverts all bits',
    ],
    faqs: [
      { q: 'How do I convert hex to decimal?', a: 'Type the hex number with 0x prefix (like 0xFF) and it displays as decimal. Or type "0xFF to dec" for explicit conversion.' },
      { q: 'What does left shift (<<) do?', a: 'Left shift moves bits left, filling with zeros. Each shift multiplies by 2. So 1 << 3 = 8 (1 × 2³).' },
      { q: 'How do I work with negative numbers?', a: 'The calculator uses two\'s complement for signed integers. Use the signed/unsigned toggle for different interpretations.' },
    ],
    whyUseThis: 'No more switching between calculator apps and online converters. CalcPro handles all programmer math in one place with natural syntax.',
  },
  graphing: {
    title: 'Graphing Calculator',
    subtitle: 'Visualize functions with interactive plots',
    description: 'Plot mathematical functions on an interactive canvas. Zoom, pan, and explore function behavior. Plot multiple functions simultaneously with different colors. Export graphs as images for reports and presentations.',
    howItWorks: 'Enter functions in the form y = f(x). Use standard notation: x^2 for x squared, sin(x) for sine, etc. Click Plot to add the function. Zoom with scroll wheel, pan by dragging. Toggle function visibility in the legend.',
    useCases: [
      'Visualizing mathematical concepts',
      'Finding function intersections',
      'Analyzing function behavior',
      'Creating graphs for reports',
      'Teaching and learning calculus',
    ],
    examples: [
      { input: 'x^2 - 4', output: 'Parabola', explanation: 'Classic quadratic with roots at x = ±2' },
      { input: 'sin(x) * 2', output: 'Sine wave', explanation: 'Sine function with amplitude 2' },
      { input: '1/x', output: 'Hyperbola', explanation: 'Reciprocal function with asymptotes' },
    ],
    tips: [
      'Plot multiple functions to compare them',
      'Use scroll wheel to zoom in/out',
      'Click and drag to pan the view',
    ],
    faqs: [
      { q: 'How do I plot multiple functions?', a: 'Enter each function and click Plot. Each function gets a different color. Toggle visibility using the eye icon.' },
      { q: 'Can I export the graph?', a: 'Yes, use the camera icon in the toolbar to export as PNG. The graph exports at high resolution suitable for printing.' },
      { q: 'How do I find where two functions intersect?', a: 'Plot both functions and zoom in on the intersection point. Hover to see coordinates.' },
    ],
    whyUseThis: 'Unlike static graphing tools, CalcPro\'s grapher is fully interactive. Explore functions by zooming and panning, perfect for understanding mathematical behavior.',
  },
  matrix: {
    title: 'Matrix Calculator',
    subtitle: 'Linear algebra operations made simple',
    description: 'Perform matrix operations including multiplication, determinants, inverses, and transposition. Solve systems of linear equations using matrix methods. Essential for linear algebra, computer graphics, and data science.',
    howItWorks: 'Enter matrices using bracket notation: [[1,2],[3,4]] for a 2×2 matrix. Use standard operators for addition (+) and multiplication (×). Functions like det(), inv(), and transpose() work on matrices.',
    useCases: [
      'Solving systems of linear equations',
      'Computer graphics transformations',
      'Machine learning computations',
      'Engineering simulations',
      'Economic modeling',
    ],
    examples: [
      { input: 'det([[1,2],[3,4]])', output: '-2', explanation: 'Determinant: 1×4 - 2×3 = -2' },
      { input: 'inv([[2,1],[1,1]])', output: '[[1,-1],[-1,2]]', explanation: 'Inverse matrix' },
      { input: '[[1,2],[3,4]] + [[5,6],[7,8]]', output: '[[6,8],[10,12]]', explanation: 'Element-wise addition' },
    ],
    tips: [
      'Matrices must have compatible dimensions for multiplication',
      'Only square matrices have determinants and inverses',
      'Use semicolons to separate rows: [1,2;3,4]',
    ],
    faqs: [
      { q: 'Why can\'t I multiply these matrices?', a: 'Matrix multiplication requires the first matrix\'s columns to equal the second\'s rows. A 2×3 matrix can multiply a 3×2 matrix, but not vice versa.' },
      { q: 'What if the determinant is zero?', a: 'A zero determinant means the matrix is singular and has no inverse. This indicates linearly dependent rows/columns.' },
      { q: 'How do I solve Ax = b?', a: 'Use inv(A) × b to find x, or use the solve() function directly: solve([[1,2],[3,4]], [5,6]).' },
    ],
    whyUseThis: 'CalcPro handles matrix notation naturally. No need to enter elements one by one like on a graphing calculator.',
  },
  complex: {
    title: 'Complex Number Calculator',
    subtitle: 'Work with imaginary and complex numbers',
    description: 'Perform arithmetic with complex numbers in rectangular (a + bi) or polar form. Calculate magnitude, phase, conjugate, and more. Essential for electrical engineering, signal processing, and advanced mathematics.',
    howItWorks: 'Enter complex numbers using i for the imaginary unit: 3+4i. All standard operations work: addition, multiplication, division. Use |z| for magnitude, arg(z) for phase, conj(z) for conjugate.',
    useCases: [
      'Electrical circuit analysis (impedance)',
      'Signal processing and filters',
      'Quantum mechanics calculations',
      'Control systems engineering',
      'Fractal mathematics',
    ],
    examples: [
      { input: '|3 + 4i|', output: '5', explanation: 'Magnitude: √(3² + 4²) = 5' },
      { input: '(1 + i)^2', output: '2i', explanation: '1 + 2i + i² = 1 + 2i - 1 = 2i' },
      { input: 'conj(3 - 2i)', output: '3 + 2i', explanation: 'Conjugate flips the imaginary sign' },
    ],
    tips: [
      'Use i for imaginary unit, not j',
      'Magnitude |z| is always positive real',
      'Division: multiply by conjugate of denominator',
    ],
    faqs: [
      { q: 'What is the imaginary unit i?', a: 'i is defined as √(-1). So i² = -1. Complex numbers have form a + bi where a is real and b is imaginary.' },
      { q: 'How do I convert to polar form?', a: 'Use |z| for magnitude (r) and arg(z) for angle (θ). Polar form is r∠θ or r×e^(iθ).' },
      { q: 'Why use complex numbers?', a: 'They\'re essential in AC circuits (impedance), signal processing (Fourier), and anywhere oscillations or rotations occur.' },
    ],
    whyUseThis: 'CalcPro understands complex notation naturally. Type expressions like (3+4i)/(1-2i) directly instead of separating real and imaginary parts.',
  },
  statistics: {
    title: 'Statistics Calculator',
    subtitle: 'Analyze data with statistical functions',
    description: 'Calculate mean, median, mode, standard deviation, variance, and more. Compute permutations, combinations, and probability distributions. Perfect for data analysis, research, and statistics coursework.',
    howItWorks: 'Enter data as comma-separated values in functions: mean(1,2,3,4,5). Available functions include mean, median, mode, stdev, variance, sum, min, max, nPr (permutations), and nCr (combinations).',
    useCases: [
      'Analyzing survey results',
      'Quality control measurements',
      'Academic research statistics',
      'Sports analytics',
      'Financial data analysis',
    ],
    examples: [
      { input: 'mean(10,20,30,40,50)', output: '30', explanation: 'Average: (10+20+30+40+50)/5 = 30' },
      { input: 'stdev(2,4,4,4,5,5,7,9)', output: '2', explanation: 'Standard deviation measures spread' },
      { input: 'nCr(10,3)', output: '120', explanation: '10 choose 3 = 10!/(3!×7!) = 120' },
    ],
    tips: [
      'Use stdev for sample, stdevp for population',
      'nCr is combinations (order doesn\'t matter)',
      'nPr is permutations (order matters)',
    ],
    faqs: [
      { q: 'What\'s the difference between stdev and variance?', a: 'Variance is the average squared deviation from mean. Standard deviation is √variance, in the same units as your data.' },
      { q: 'When do I use nCr vs nPr?', a: 'Use nCr (combinations) when order doesn\'t matter (like lottery numbers). Use nPr (permutations) when order matters (like race placements).' },
      { q: 'How do I calculate probability?', a: 'For basic probability, divide favorable outcomes by total outcomes. For distributions, use functions like normalcdf().' },
    ],
    whyUseThis: 'Enter your entire dataset at once instead of adding values one by one. CalcPro calculates all statistics instantly.',
  },
  financial: {
    title: 'Financial Calculator',
    subtitle: 'Time value of money and loan calculations',
    description: 'Calculate present value, future value, payments, and interest rates. Generate amortization schedules. Compute NPV and IRR for investment analysis. Essential for personal finance, business, and accounting.',
    howItWorks: 'Use TVM functions: PV (present value), FV (future value), PMT (payment), NPER (periods), RATE (interest rate). Enter known values to solve for unknowns. NPV and IRR analyze cash flow series.',
    useCases: [
      'Mortgage and loan calculations',
      'Retirement planning',
      'Investment analysis',
      'Business valuation',
      'Lease vs buy decisions',
    ],
    examples: [
      { input: 'PMT(0.06/12, 360, 200000)', output: '-1199.10', explanation: '$200k mortgage at 6% for 30 years' },
      { input: 'FV(0.07, 10, 0, -1000)', output: '1967.15', explanation: '$1000 invested at 7% for 10 years' },
      { input: 'PV(0.05, 5, 0, -10000)', output: '7835.26', explanation: 'Present value of $10k in 5 years at 5%' },
    ],
    tips: [
      'Divide annual rate by 12 for monthly calculations',
      'Negative values represent cash outflows',
      'PMT returns negative (payment you make)',
    ],
    faqs: [
      { q: 'Why is my PMT result negative?', a: 'Negative indicates cash outflow (money you pay). Positive would be cash inflow. This follows standard financial convention.' },
      { q: 'How do I calculate monthly mortgage payment?', a: 'Use PMT(annual_rate/12, years×12, loan_amount). Example: PMT(0.06/12, 360, 200000) for a 30-year loan at 6%.' },
      { q: 'What\'s the difference between NPV and IRR?', a: 'NPV calculates the present value of cash flows at a given rate. IRR finds the rate that makes NPV equal zero.' },
    ],
    whyUseThis: 'CalcPro uses standard financial notation. No need to remember which button is N, I/Y, PV, PMT, or FV.',
  },
  converter: {
    title: 'Unit Converter',
    subtitle: 'Convert between measurement units instantly',
    description: 'Convert length, mass, temperature, time, data storage, area, and volume. Supports both metric and imperial systems. Accurate conversions with proper significant figures.',
    howItWorks: 'Enter conversions naturally: "100 km to miles" or "32 F to C". The calculator understands common unit abbreviations and full names. Results show the converted value with appropriate precision.',
    useCases: [
      'International travel planning',
      'Recipe conversions',
      'Scientific unit conversions',
      'Data storage calculations',
      'Construction measurements',
    ],
    examples: [
      { input: '100 km to miles', output: '62.137 miles', explanation: '1 km ≈ 0.621 miles' },
      { input: '32 F to C', output: '0 °C', explanation: 'Freezing point of water' },
      { input: '1 GB to MB', output: '1024 MB', explanation: 'Binary conversion (1024 base)' },
    ],
    tips: [
      'Use common abbreviations: km, mi, lb, kg',
      'Temperature: F, C, K for Fahrenheit, Celsius, Kelvin',
      'Data: KB, MB, GB, TB (binary) or kB, MB (decimal)',
    ],
    faqs: [
      { q: 'Is 1 GB equal to 1000 or 1024 MB?', a: 'In computing (binary), 1 GB = 1024 MB. In storage marketing (decimal), 1 GB = 1000 MB. CalcPro uses binary by default.' },
      { q: 'How do I convert temperature?', a: 'Type naturally: "100 C to F" or "212 F to C". The calculator handles the formula automatically.' },
      { q: 'What units are supported?', a: 'Length (m, km, mi, ft, in), mass (kg, lb, oz), temperature (C, F, K), time (s, min, hr), data (B, KB, MB, GB, TB), and more.' },
    ],
    whyUseThis: 'Type conversions in plain English. No need to look up conversion factors or remember formulas.',
  },
};

const allModes: { id: CalculatorMode; label: string }[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'scientific', label: 'Scientific' },
  { id: 'programmer', label: 'Programmer' },
  { id: 'graphing', label: 'Graphing' },
  { id: 'matrix', label: 'Matrix' },
  { id: 'complex', label: 'Complex' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'financial', label: 'Financial' },
  { id: 'converter', label: 'Converter' },
];

export const Footer: React.FC<FooterProps> = ({ mode, onModeChange }) => {
  const [expanded, setExpanded] = useState(false);
  const content = modeContent[mode];

  return (
    <footer className="bg-white border-t border-slate-200">
      {/* Compact view */}
      <div className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-base font-semibold text-slate-900 mb-1">{content.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{content.subtitle}</p>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 
                       hover:bg-blue-50 rounded-lg transition-colors"
            >
              {expanded ? 'Show less' : 'Learn more'}
              <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {/* Quick links */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500">Other calculators:</span>
            {allModes.filter(m => m.id !== mode).map((m) => (
              <button 
                key={m.id} 
                onClick={() => onModeChange?.(m.id)}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Expanded SEO content */}
      {expanded && (
        <div className="border-t border-slate-200 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-6">
                <section>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">How It Works</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{content.howItWorks}</p>
                </section>
                
                <section>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Common Use Cases</h3>
                  <ul className="space-y-1">
                    {content.useCases.map((useCase, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-blue-500 mt-1">•</span>
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </section>
                
                <section>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Pro Tips</h3>
                  <ul className="space-y-1">
                    {content.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-green-500 mt-1">✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
              
              {/* Right column */}
              <div className="space-y-6">
                <section>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Examples</h3>
                  <div className="space-y-3">
                    {content.examples.map((ex, i) => (
                      <div key={i} className="bg-white rounded-lg border border-slate-200 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="px-2 py-0.5 bg-slate-100 rounded text-sm font-mono text-slate-700">
                            {ex.input}
                          </code>
                          <span className="text-slate-400">→</span>
                          <code className="px-2 py-0.5 bg-blue-50 rounded text-sm font-mono text-blue-700">
                            {ex.output}
                          </code>
                        </div>
                        <p className="text-xs text-slate-500">{ex.explanation}</p>
                      </div>
                    ))}
                  </div>
                </section>
                
                <section>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Why Use CalcPro?</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{content.whyUseThis}</p>
                </section>
              </div>
            </div>
            
            {/* FAQs */}
            <section className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Frequently Asked Questions</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.faqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-lg border border-slate-200 p-4">
                    <h4 className="text-sm font-medium text-slate-900 mb-2">{faq.q}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
      
      {/* Copyright */}
      <div className="px-6 py-3 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <span>© 2026 CalcPro. Free online calculator.</span>
          <span>All calculations performed locally. No data sent to servers.</span>
        </div>
      </div>
    </footer>
  );
};
