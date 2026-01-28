# Free Online Graphing Calculator

Plot mathematical functions and visualize equations. Explore how functions behave, find intersections, and understand mathematical relationships through interactive graphs.

## How It Works

1. Enter a function using x as the variable (e.g., `x^2 - 4`)
2. The graph renders automatically
3. Pan and zoom to explore different regions
4. Add multiple functions to compare them

## Supported Function Types

### Polynomial Functions
- Linear: `2*x + 3`
- Quadratic: `x^2 - 4*x + 3`
- Cubic: `x^3 - 3*x`
- Higher degree: `x^4 - 2*x^2 + 1`

### Trigonometric Functions
- `sin(x)`, `cos(x)`, `tan(x)`
- `asin(x)`, `acos(x)`, `atan(x)`
- Combinations: `sin(x) * cos(2*x)`

### Exponential and Logarithmic
- `e^x`, `2^x`, `10^x`
- `ln(x)`, `log(x)`, `log2(x)`
- `x * e^(-x)`

### Rational Functions
- `1/x`
- `(x^2 - 1)/(x + 2)`
- `x/(x^2 + 1)`

### Root Functions
- `sqrt(x)`
- `x^(1/3)` (cube root)
- `sqrt(1 - x^2)` (semicircle)

## Real-World Examples

**Projectile motion:**
`-0.5 * 9.8 * x^2 + 20 * x`
Shows the path of an object thrown at 20 m/s.

**Population growth:**
`1000 * e^(0.05 * x)`
Models exponential growth starting at 1000 with 5% rate.

**Damped oscillation:**
`e^(-0.1 * x) * sin(x)`
Shows a wave that decreases in amplitude over time.

**Supply and demand curves:**
Supply: `2*x + 10`
Demand: `50 - 3*x`
Plot both to find equilibrium point.

## Graph Controls

| Action | Mouse | Keyboard |
|--------|-------|----------|
| Pan | Click and drag | Arrow keys |
| Zoom in | Scroll up | + key |
| Zoom out | Scroll down | - key |
| Reset view | Double-click | R key |

## Tips for Better Graphs

**Adjust the viewing window:**
If your function looks flat or cut off, zoom out or pan to see more of the curve.

**Use appropriate scale:**
For functions like `sin(x)`, the interesting behavior happens between -2π and 2π. For `e^x`, you might want x from -5 to 5.

**Compare functions:**
Add multiple functions to see how they relate. Use different colors to distinguish them.

**Find key points:**
Look for where the graph crosses the x-axis (roots), y-axis (y-intercept), and where it reaches maximum or minimum values.

## Common Mistakes to Avoid

**Forgetting multiplication signs:**
Write `2*x` not `2x`. The calculator needs explicit operators.

**Division by zero:**
Functions like `1/x` have vertical asymptotes where they're undefined. The graph will show a gap.

**Domain restrictions:**
`sqrt(x)` only works for x ≥ 0 in real numbers. The graph won't show anything for negative x.

**Expecting exact intersections:**
Due to pixel resolution, intersection points might not appear exactly where expected. Zoom in for precision.

## FAQ

**How many functions can I plot at once?**
You can add multiple functions. Each appears in a different color for easy comparison.

**Can I save or export my graph?**
Use your browser's screenshot function or right-click to save the graph image.

**Why does my function look like a straight line?**
You might be zoomed in too far or too far out. Try adjusting the viewing window to see the curve's shape.

**How do I graph a circle?**
A full circle isn't a function (fails vertical line test). Graph the top half with `sqrt(r^2 - x^2)` and bottom half with `-sqrt(r^2 - x^2)`.

**Can I plot parametric equations?**
The standard mode uses y = f(x) format. For parametric curves, you'd need to express them as explicit functions or use multiple plots.

**Why are there gaps in my graph?**
Gaps appear at discontinuities (like 1/x at x=0) or where the function is undefined (like sqrt(x) for negative x).
