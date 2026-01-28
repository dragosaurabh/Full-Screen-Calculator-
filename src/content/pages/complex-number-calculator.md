# Free Online Complex Number Calculator

Perform arithmetic with complex and imaginary numbers. Add, subtract, multiply, divide, and find powers and roots of complex numbers.

## How It Works

Enter complex numbers in the form `a + bi` where:
- `a` is the real part
- `b` is the imaginary part
- `i` is the imaginary unit (√-1)

Examples: `3 + 4i`, `2 - 5i`, `7i`, `-3`

## Supported Operations

### Basic Arithmetic
| Operation | Example | Result |
|-----------|---------|--------|
| Addition | (3 + 4i) + (1 + 2i) | 4 + 6i |
| Subtraction | (5 + 3i) - (2 + i) | 3 + 2i |
| Multiplication | (2 + 3i) × (1 + 4i) | -10 + 11i |
| Division | (3 + 4i) ÷ (1 + 2i) | 2.2 - 0.4i |

### Advanced Operations
| Operation | Description | Example |
|-----------|-------------|---------|
| Conjugate | Flip sign of imaginary part | conj(3 + 4i) = 3 - 4i |
| Magnitude | Distance from origin | \|3 + 4i\| = 5 |
| Argument | Angle from positive real axis | arg(1 + i) = 45° |
| Power | Raise to integer power | (1 + i)² = 2i |
| Square root | Principal square root | √(3 + 4i) = 2 + i |

## Representations

### Rectangular Form
Standard form: `a + bi`
- Real part: a
- Imaginary part: b

### Polar Form
`r(cos θ + i sin θ)` or `r∠θ`
- r = magnitude = √(a² + b²)
- θ = argument = atan2(b, a)

### Euler Form
`re^(iθ)`
Uses Euler's formula: e^(iθ) = cos θ + i sin θ

**Conversion example:**
3 + 4i in polar form:
- r = √(9 + 16) = 5
- θ = atan(4/3) ≈ 53.13°
- Polar: 5∠53.13° or 5(cos 53.13° + i sin 53.13°)

## Real-World Examples

**AC circuit impedance:**
Resistor (100Ω) in series with capacitor (50Ω reactive):
`100 - 50i` ohms

Total impedance of parallel components:
`1 / (1/(100) + 1/(-50i))`

**Signal processing:**
Fourier coefficient representing amplitude and phase:
`3 + 4i` means amplitude 5, phase shift 53.13°

**Quantum mechanics:**
Wave function coefficient:
`(1 + i) / sqrt(2)` normalized state

**Control systems:**
Pole location in s-plane:
`-2 + 3i` indicates damped oscillation

## Key Formulas

**Multiplication:**
(a + bi)(c + di) = (ac - bd) + (ad + bc)i

**Division:**
(a + bi)/(c + di) = [(ac + bd) + (bc - ad)i] / (c² + d²)

**De Moivre's Theorem:**
(r∠θ)ⁿ = rⁿ∠(nθ)

**Roots:**
The n-th roots of z are evenly spaced around a circle:
z^(1/n) = r^(1/n) ∠(θ/n + 360°k/n) for k = 0, 1, ..., n-1

## Common Mistakes to Avoid

**Forgetting i² = -1:**
When multiplying, remember that i × i = -1, not 1 or i.

**Wrong conjugate in division:**
To divide, multiply numerator and denominator by the conjugate of the denominator.

**Magnitude is always positive:**
|z| ≥ 0 for all complex numbers. The magnitude of -3 - 4i is still 5.

**Multiple roots:**
Every non-zero complex number has exactly n distinct n-th roots. Don't forget the other solutions.

## FAQ

**What is i?**
The imaginary unit i is defined as √-1. It's not a real number but extends the number system to solve equations like x² + 1 = 0.

**Can I take the square root of a negative number?**
Yes. √-9 = 3i. In general, √-n = i√n for positive n.

**What's the difference between 3i and i3?**
They're the same: 3 times i. Write it as 3i by convention.

**How do I enter just an imaginary number?**
Type `0 + 5i` or just `5i` for a purely imaginary number.

**Why are there two square roots?**
Every non-zero number has two square roots. The calculator shows the principal root. The other root is its negative.

**What does "principal" root mean?**
The principal root is the one with the smallest non-negative argument (angle). For real positive numbers, it's the positive root.
