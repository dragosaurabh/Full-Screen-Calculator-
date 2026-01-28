# CalcPro Help Center

Everything you need to use CalcPro effectively. This guide covers all features, explains how calculations work, and helps you troubleshoot any issues.

## Getting Started

CalcPro is a free online calculator that runs entirely in your browser. No account needed. No installation required.

### Quick Start
1. Choose a calculator mode from the sidebar
2. Enter your expression using the keypad or keyboard
3. Press `=` or hit `Enter` to calculate
4. View your result and access history in the right panel

### Calculator Modes

CalcPro includes nine specialized calculators:

| Mode | Best For |
|------|----------|
| **Basic** | Everyday arithmetic, budgeting, quick math |
| **Scientific** | Trigonometry, logarithms, exponents, physics |
| **Programmer** | Binary/hex conversion, bitwise operations |
| **Graphing** | Visualizing functions, finding intersections |
| **Matrix** | Linear algebra, solving systems of equations |
| **Complex** | Imaginary numbers, electrical engineering |
| **Statistics** | Data analysis, probability, regression |
| **Financial** | Loans, investments, time value of money |
| **Converter** | Unit conversions, metric/imperial |

Select a mode from the sidebar. Your choice persists between sessions.

## Using the Expression Input

### How to Enter Calculations

Type your expression naturally. CalcPro understands standard mathematical notation:

- Numbers: `123`, `3.14`, `-5`
- Operators: `+`, `-`, `*` (or `×`), `/` (or `÷`)
- Parentheses: `(2 + 3) * 4`
- Powers: `2^10` or `2**10`
- Functions: `sin(45)`, `sqrt(16)`, `log(100)`

### Expression Examples

| You Type | Result | Explanation |
|----------|--------|-------------|
| `2 + 3 * 4` | 14 | Multiplication before addition |
| `(2 + 3) * 4` | 20 | Parentheses first |
| `10 / 2 + 3` | 8 | Division before addition |
| `2^3^2` | 512 | Exponents right to left |
| `sin(90)` | 1 | Sine of 90 degrees |

### Live Preview

As you type, CalcPro shows a preview of your expression. This helps catch errors before you calculate.

## Keyboard Shortcuts

Type directly for faster input. CalcPro responds to your keyboard without needing to click first.

### Numbers and Operators
| Key | Action |
|-----|--------|
| `0-9` | Enter digits |
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `.` | Decimal point |
| `(` `)` | Parentheses |
| `^` | Exponent |

### Actions
| Key | Action |
|-----|--------|
| `Enter` | Calculate result |
| `Escape` | Clear all |
| `Backspace` | Delete last character |
| `Delete` | Clear current entry |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+C` | Copy result |

### Navigation
| Key | Action |
|-----|--------|
| `H` | Toggle history panel |
| `S` | Toggle sidebar |
| `F11` | Fullscreen mode |
| `Tab` | Move between inputs |

### Scientific Functions
Type function names directly:
- `sin(`, `cos(`, `tan(` — Trigonometry
- `log(`, `ln(` — Logarithms
- `sqrt(` — Square root
- `abs(` — Absolute value

## Using the Keypad

The on-screen keypad adapts to each calculator mode.

### Basic Mode Keypad
- Digits 0-9
- Operators: + − × ÷
- Decimal point
- Parentheses
- Clear (C) and Clear Entry (CE)
- Equals (=)

### Scientific Mode Additions
- Trigonometric functions (sin, cos, tan)
- Inverse trig (asin, acos, atan)
- Logarithms (log, ln)
- Powers and roots (x², √, xʸ)
- Constants (π, e)
- Factorial (n!)

### Programmer Mode Additions
- Hex digits (A-F)
- Base selectors (BIN, OCT, DEC, HEX)
- Bitwise operators (AND, OR, XOR, NOT)
- Shift operators (<<, >>)

Click or tap any button to add it to your expression.

## Understanding Results

### Result Display
After calculating, your result appears in the main display. The expression you entered stays visible above it for reference.

### Precision
CalcPro uses high-precision arithmetic. Results are accurate to at least 15 significant digits. You can adjust display precision in Settings.

### Special Values
| Display | Meaning |
|---------|---------|
| `Infinity` | Result is too large to represent |
| `-Infinity` | Result is too negative to represent |
| `NaN` | Not a Number (invalid operation) |
| `Error` | Expression couldn't be evaluated |

### Scientific Notation
Very large or very small numbers display in scientific notation:
- `1.5e10` means 1.5 × 10¹⁰ (15,000,000,000)
- `3.2e-8` means 3.2 × 10⁻⁸ (0.000000032)

## Order of Operations (PEMDAS)

CalcPro follows standard mathematical order:

1. **P**arentheses — Evaluated first, innermost to outermost
2. **E**xponents — Powers and roots, right to left
3. **M**ultiplication and **D**ivision — Left to right
4. **A**ddition and **S**ubtraction — Left to right

### Examples

| Expression | Steps | Result |
|------------|-------|--------|
| `2 + 3 * 4` | 3×4=12, then 2+12 | 14 |
| `(2 + 3) * 4` | 2+3=5, then 5×4 | 20 |
| `10 - 4 - 2` | 10-4=6, then 6-2 | 4 |
| `2^3^2` | 3²=9, then 2⁹ | 512 |
| `8 / 4 / 2` | 8÷4=2, then 2÷2 | 1 |

### When in Doubt, Use Parentheses
If you're unsure about order, add parentheses. They make your intent explicit and prevent mistakes.

## Common Errors and How to Fix Them

### "Division by zero"
**What happened:** You tried to divide by zero.
**How to fix:** Check your expression for `/0` or a denominator that evaluates to zero.

### "Invalid expression"
**What happened:** CalcPro couldn't parse your input.
**How to fix:** Check for:
- Missing operators between numbers (`52` instead of `5*2`)
- Unmatched parentheses
- Incomplete functions (`sin(` without closing `)`)
- Invalid characters

### "Domain error"
**What happened:** Input is outside the function's valid range.
**How to fix:**
- `sqrt(x)` requires x ≥ 0
- `ln(x)` requires x > 0
- `asin(x)` requires -1 ≤ x ≤ 1
- `log(x)` requires x > 0

### "Overflow"
**What happened:** Result is too large to represent.
**How to fix:** Break the calculation into smaller steps, or accept that the result is effectively infinite.

### "Syntax error"
**What happened:** Expression structure is invalid.
**How to fix:** Check for:
- Two operators in a row (`5 + * 3`)
- Empty parentheses `()`
- Missing operands (`5 +`)

### Unexpected Result
**What happened:** The answer isn't what you expected.
**How to fix:**
1. Check order of operations—use parentheses to be explicit
2. Verify angle mode (degrees vs radians) for trig functions
3. Confirm you're in the right calculator mode

## Troubleshooting

### Calculator Not Responding
1. Refresh the page
2. Clear browser cache
3. Try a different browser
4. Disable browser extensions

### History Not Saving
1. Ensure cookies/local storage are enabled
2. Exit private/incognito mode
3. Check available storage space

### Display Issues
1. Reset zoom to 100% (`Ctrl+0`)
2. Try a different browser
3. Disable browser extensions that modify pages

### Keyboard Shortcuts Not Working
1. Click inside the calculator area first
2. Ensure no text field has focus
3. Check that browser shortcuts aren't overriding

### Wrong Results in Scientific Mode
1. Check angle mode (DEG vs RAD)
2. Verify function syntax
3. Check for implicit multiplication issues

## Calculation History and Pinned Results

CalcPro automatically saves every calculation. History appears in the right panel and stays visible by default.

### Why History Stays Visible
- Reference previous results without extra clicks
- Compare related calculations easily
- Re-run calculations with one click

### Using History

| Action | How |
|--------|-----|
| Re-run a calculation | Click the entry |
| Copy result | Click the copy icon |
| Delete entry | Click the X |
| Search history | Type in the search box |

### Pinning Important Results
Click the bookmark icon on any entry to pin it. Pinned entries:
- Move to the top of the list
- Stay visible while you work
- Persist until you unpin them

### Hiding History
Click the history toggle to collapse the panel. Your preference is saved.

### History and Privacy
History is stored locally in your browser. It never leaves your device. Clear it anytime from Settings.

## Layout Modes

CalcPro offers four layout options to fit your workflow.

### Compact Mode
- Calculator only, no sidebars
- Maximum space for the keypad
- Best for quick calculations on small screens

### Normal Mode
- Full layout with sidebar and history
- Default view for most users
- Good balance of features and space

### Expanded Mode
- Larger calculator and panels
- More room for complex expressions
- Ideal for detailed work

### Fullscreen Mode
- Distraction-free, full-screen calculator
- Press `F11` or click the fullscreen button
- Press `Escape` to exit

Your layout preference is saved between sessions.

## Differences Between Calculator Modes

### Basic vs Scientific
Basic mode handles arithmetic. Scientific adds:
- Trigonometric functions (sin, cos, tan)
- Logarithms and exponentials
- Powers and roots
- Mathematical constants

### When to Use Programmer Mode
Use Programmer mode when you need:
- Binary, octal, or hexadecimal numbers
- Bitwise operations (AND, OR, XOR)
- Two's complement representation
- Base conversions

### When to Use Financial Mode
Use Financial mode for:
- Loan and mortgage calculations
- Investment growth projections
- Present and future value
- Amortization schedules

### Graphing vs Other Modes
Graphing mode is unique—it plots functions visually. Use it when you need to:
- See how a function behaves
- Find where functions intersect
- Understand mathematical relationships

## Memory Functions

Store and recall values during your session:

| Button | Action |
|--------|--------|
| `MC` | Memory Clear — Reset memory to zero |
| `MR` | Memory Recall — Insert stored value |
| `M+` | Memory Add — Add current result to memory |
| `M-` | Memory Subtract — Subtract current result from memory |
| `MS` | Memory Store — Save current result to memory |

Memory persists during your session but clears when you close the browser.

## Undo and Redo

Made a mistake? Undo and redo are available:

- **Undo:** `Ctrl+Z` or click the undo button
- **Redo:** `Ctrl+Y` or click the redo button

CalcPro remembers your recent actions so you can step backward and forward through your work.

## Settings and Preferences

### Precision
Control how many decimal places display:
- **Auto:** Shows significant digits, removes trailing zeros
- **Fixed:** Always shows specified decimal places (0-15)

### Angle Mode
For trigonometric functions:
- **Degrees:** Full circle = 360°
- **Radians:** Full circle = 2π

### Display Options
- **Thousands separator:** Comma, space, or none
- **Decimal separator:** Period or comma
- **High contrast mode:** Enhanced visibility

### Data Management
- **Clear history:** Remove all saved calculations
- **Clear all data:** Reset everything to defaults

## Privacy and Data

CalcPro runs entirely in your browser:

- All calculations happen locally
- Nothing is sent to servers
- History is stored on your device only
- No tracking or analytics on calculations

Clear your data anytime from Settings. For details, see our [Privacy Policy](/privacy).

## Accessibility

CalcPro is designed for everyone:

- **Keyboard navigation:** Full functionality without a mouse
- **Screen reader support:** ARIA labels on all controls
- **High contrast mode:** Available in Settings
- **Responsive design:** Works on all screen sizes
- **Focus indicators:** Clear visual feedback

## Browser Support

CalcPro works in all modern browsers:

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

For best performance, keep your browser updated.

## Offline Use

CalcPro works offline after initial load:

1. Visit CalcPro while online
2. The app caches automatically
3. Use it anytime, even without internet

Your history and settings are always available offline.

## Getting More Help

If this guide doesn't answer your question:

1. Check the FAQ section on each calculator mode page
2. Try the search function to find related topics
3. Contact us through the website

CalcPro is continuously improved based on user feedback.
