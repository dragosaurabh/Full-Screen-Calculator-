# Free Online Scientific Calculator

Solve advanced math problems with trigonometry, logarithms, exponents, and more. Ideal for students, engineers, and anyone working with complex calculations.

## How It Works

Enter expressions using standard mathematical notation. The calculator supports:

- Trigonometric functions (sin, cos, tan and their inverses)
- Hyperbolic functions (sinh, cosh, tanh)
- Logarithms (natural log, log base 10, log base 2)
- Exponential functions
- Powers and roots
- Factorials
- Mathematical constants (π, e)

Switch between degrees and radians for angle calculations using the mode toggle.

## Supported Functions

### Trigonometry
| Function | Description | Example |
|----------|-------------|---------|
| sin(x) | Sine | sin(30) = 0.5 (in degrees) |
| cos(x) | Cosine | cos(60) = 0.5 (in degrees) |
| tan(x) | Tangent | tan(45) = 1 (in degrees) |
| asin(x) | Inverse sine | asin(0.5) = 30° |
| acos(x) | Inverse cosine | acos(0.5) = 60° |
| atan(x) | Inverse tangent | atan(1) = 45° |

### Logarithms and Exponentials
| Function | Description | Example |
|----------|-------------|---------|
| ln(x) | Natural logarithm | ln(e) = 1 |
| log(x) | Log base 10 | log(100) = 2 |
| log2(x) | Log base 2 | log2(8) = 3 |
| exp(x) | e raised to x | exp(1) = 2.718... |

### Powers and Roots
| Function | Description | Example |
|----------|-------------|---------|
| x^y | Power | 2^10 = 1024 |
| sqrt(x) | Square root | sqrt(144) = 12 |
| nthRoot(x, n) | Nth root | nthRoot(27, 3) = 3 |

### Other Functions
| Function | Description | Example |
|----------|-------------|---------|
| n! | Factorial | 5! = 120 |
| abs(x) | Absolute value | abs(-5) = 5 |
| π | Pi constant | π = 3.14159... |
| e | Euler's number | e = 2.71828... |

## Real-World Examples

**Finding the height of a building using angle of elevation:**
If you stand 50 meters from a building and measure a 60° angle to the top:
`50 * tan(60)` = 86.6 meters

**Calculating compound interest growth factor:**
For 5% annual interest over 10 years:
`e^(0.05 * 10)` = 1.6487 (continuous compounding)

**Decibel calculation:**
Sound intensity ratio of 1000:
`10 * log(1000)` = 30 dB

**Half-life calculation:**
Time for a substance to decay to 25% (two half-lives):
`ln(0.25) / ln(0.5)` = 2

## Degrees vs Radians

The calculator supports both angle modes:

- **Degrees:** A full circle is 360°. Most everyday applications use degrees.
- **Radians:** A full circle is 2π radians. Used in calculus and physics.

Toggle between modes using the DEG/RAD button. The current mode is displayed on screen.

**Quick conversions:**
- 180° = π radians
- 90° = π/2 radians
- 45° = π/4 radians

## Common Mistakes to Avoid

**Wrong angle mode:**
`sin(90)` in radians gives -0.894, not 1. Check your angle mode before calculating.

**Domain errors:**
- `sqrt(-1)` is undefined in real numbers (use Complex mode)
- `ln(0)` is undefined
- `asin(2)` is undefined (input must be between -1 and 1)

**Forgetting parentheses:**
`sin 30 + 5` might not parse as expected. Use `sin(30) + 5`.

## FAQ

**How do I switch between degrees and radians?**
Click the DEG/RAD toggle button on the keypad. The current mode is shown in the display.

**What's the maximum factorial I can calculate?**
Factorials grow extremely fast. The calculator handles up to about 170! before reaching infinity.

**Can I use nested functions?**
Yes. Expressions like `sin(cos(45))` or `ln(sqrt(e))` work correctly.

**How do I enter pi or e?**
Use the π and e buttons on the keypad, or type "pi" and "e" on your keyboard.

**Why does sin(π) not equal exactly zero?**
Floating-point arithmetic has tiny rounding errors. The result is extremely close to zero (around 10^-16).
