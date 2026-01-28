# Free Online Matrix Calculator

Perform matrix operations including addition, multiplication, determinants, inverses, and more. Essential for linear algebra, computer graphics, and data science.

## How It Works

1. Enter your matrix dimensions (rows × columns)
2. Fill in the matrix values
3. Select an operation
4. View the result instantly

For operations involving two matrices, enter both before selecting the operation.

## Supported Operations

### Basic Operations
| Operation | Description | Requirements |
|-----------|-------------|--------------|
| Addition | Add corresponding elements | Same dimensions |
| Subtraction | Subtract corresponding elements | Same dimensions |
| Scalar Multiply | Multiply all elements by a number | Any matrix |
| Transpose | Flip rows and columns | Any matrix |

### Matrix Multiplication
Multiply matrix A (m × n) by matrix B (n × p) to get result (m × p).

**Requirement:** Number of columns in A must equal number of rows in B.

Example:
```
[1 2]   [5 6]   [1×5+2×7  1×6+2×8]   [19 22]
[3 4] × [7 8] = [3×5+4×7  3×6+4×8] = [43 50]
```

### Determinant
Calculate the determinant of a square matrix.

- 2×2: `ad - bc` for matrix [[a,b],[c,d]]
- 3×3 and larger: Expansion by minors

**Requirement:** Matrix must be square (same rows and columns).

### Inverse
Find the inverse matrix A⁻¹ such that A × A⁻¹ = I (identity matrix).

**Requirements:**
- Matrix must be square
- Determinant must be non-zero

### Solve Linear Systems
Solve Ax = b for x, where A is a coefficient matrix and b is a constants vector.

Example: Solve the system:
```
2x + 3y = 8
4x + 5y = 14
```

Enter A = [[2,3],[4,5]] and b = [8,14] to get x = [1,2].

## Real-World Examples

**3D rotation matrix (around z-axis by θ):**
```
[cos(θ)  -sin(θ)  0]
[sin(θ)   cos(θ)  0]
[  0        0     1]
```

**Image transformation:**
Scale by 2x horizontally, 1.5x vertically:
```
[2   0]
[0 1.5]
```

**Markov chain transition:**
```
[0.7 0.3]   State probabilities after
[0.4 0.6]   one transition
```

**Least squares regression:**
For data fitting, compute (AᵀA)⁻¹Aᵀb.

## Matrix Properties

### Determinant Meanings
| Determinant | Meaning |
|-------------|---------|
| det = 0 | Singular matrix, no inverse exists |
| det > 0 | Preserves orientation |
| det < 0 | Reverses orientation |
| \|det\| = 1 | Preserves area/volume |

### Special Matrices
- **Identity:** Diagonal of 1s, zeros elsewhere. A × I = A
- **Diagonal:** Non-zero only on main diagonal
- **Symmetric:** A = Aᵀ (equals its transpose)
- **Orthogonal:** A⁻¹ = Aᵀ (inverse equals transpose)

## Common Mistakes to Avoid

**Dimension mismatch in multiplication:**
A (2×3) times B (2×3) doesn't work. B needs 3 rows to match A's 3 columns.

**Assuming multiplication is commutative:**
A × B ≠ B × A in general. Matrix multiplication order matters.

**Inverting a singular matrix:**
If the determinant is zero, no inverse exists. Check the determinant first.

**Confusing rows and columns:**
A 2×3 matrix has 2 rows and 3 columns, not the other way around.

## FAQ

**What's the largest matrix I can work with?**
The calculator handles matrices up to 10×10 efficiently. Larger matrices may be slower.

**Why can't I find the inverse?**
The matrix is singular (determinant = 0). This happens when rows or columns are linearly dependent.

**How do I enter a matrix?**
Click each cell and type the value. Use Tab to move between cells. Negative numbers and decimals are supported.

**Can I use fractions?**
Enter fractions as decimals (1/3 = 0.333...) or calculate them first. Results display as decimals.

**What does "linearly dependent" mean?**
One row (or column) can be expressed as a combination of others. Example: [2,4,6] = 2×[1,2,3].

**How do I multiply a matrix by a vector?**
Treat the vector as a single-column matrix. A (3×3) times v (3×1) gives a (3×1) result.
