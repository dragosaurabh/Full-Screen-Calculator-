# Free Online Statistics Calculator

Calculate mean, median, mode, standard deviation, variance, and more. Analyze data sets, compute probabilities, and perform regression analysis.

## How It Works

1. Enter your data as comma-separated values
2. Select the calculation you need
3. View results instantly

Example input: `12, 15, 18, 22, 25, 28, 30`

## Descriptive Statistics

### Measures of Central Tendency

| Measure | Description | Example (data: 2, 4, 4, 5, 7) |
|---------|-------------|-------------------------------|
| Mean | Average of all values | (2+4+4+5+7)/5 = 4.4 |
| Median | Middle value when sorted | 4 |
| Mode | Most frequent value | 4 |

### Measures of Spread

| Measure | Description | Formula |
|---------|-------------|---------|
| Range | Max minus min | max - min |
| Variance | Average squared deviation | Σ(x - μ)² / n |
| Standard Deviation | Square root of variance | √variance |
| IQR | Interquartile range | Q3 - Q1 |

### Population vs Sample

| Statistic | Population | Sample |
|-----------|------------|--------|
| Variance | Divide by n | Divide by n-1 |
| Notation | σ² | s² |
| Use when | Data is entire population | Data is a sample |

## Probability Distributions

### Normal Distribution
The bell curve. Most natural phenomena follow this pattern.

- **PDF:** Probability density at a point
- **CDF:** Probability of being less than or equal to a value
- **Parameters:** Mean (μ) and standard deviation (σ)

**Example:** Heights of adults with μ=170cm, σ=10cm
- P(height < 180) = normalCdf(180, 170, 10) ≈ 0.841

### Binomial Distribution
For counting successes in fixed number of trials.

- **Parameters:** n (trials), p (success probability)
- **PMF:** Probability of exactly k successes
- **CDF:** Probability of k or fewer successes

**Example:** Flipping a coin 10 times
- P(exactly 6 heads) = binomialPmf(6, 10, 0.5) ≈ 0.205

### Poisson Distribution
For counting events in a fixed interval.

- **Parameter:** λ (average rate)
- **PMF:** Probability of exactly k events

**Example:** Average 3 calls per hour
- P(5 calls in an hour) = poissonPmf(5, 3) ≈ 0.101

## Regression Analysis

### Linear Regression
Find the best-fit line y = mx + b for your data.

**Output:**
- Slope (m): Change in y per unit change in x
- Intercept (b): y-value when x = 0
- R² (coefficient of determination): How well the line fits (0 to 1)

**Interpreting R²:**
| R² Value | Interpretation |
|----------|----------------|
| 0.9 - 1.0 | Excellent fit |
| 0.7 - 0.9 | Good fit |
| 0.5 - 0.7 | Moderate fit |
| < 0.5 | Weak fit |

### Correlation
Measures linear relationship between two variables.

| Correlation | Interpretation |
|-------------|----------------|
| +1 | Perfect positive |
| +0.7 to +1 | Strong positive |
| +0.3 to +0.7 | Moderate positive |
| -0.3 to +0.3 | Weak or none |
| -0.7 to -0.3 | Moderate negative |
| -1 to -0.7 | Strong negative |
| -1 | Perfect negative |

## Real-World Examples

**Test scores analysis:**
Data: 78, 82, 85, 88, 90, 92, 95
- Mean: 87.14
- Median: 88
- Std Dev: 5.87

**Quality control:**
If defect rate is 2%, probability of 0 defects in 100 items:
binomialPmf(0, 100, 0.02) ≈ 0.133

**Sales forecasting:**
With monthly sales data, linear regression gives trend line for predictions.

**A/B testing:**
Compare conversion rates using proportion tests and confidence intervals.

## Common Mistakes to Avoid

**Using population formulas for samples:**
If your data is a sample (not the entire population), divide by n-1 for variance, not n.

**Confusing correlation with causation:**
High correlation doesn't mean one variable causes the other.

**Ignoring outliers:**
Outliers heavily affect mean and standard deviation. Consider using median and IQR instead.

**Wrong distribution choice:**
- Use binomial for fixed trials with two outcomes
- Use Poisson for counting events over time/space
- Use normal for continuous measurements

## FAQ

**When should I use mean vs median?**
Use median when data has outliers or is skewed. Mean works best for symmetric distributions.

**What's the difference between standard deviation and variance?**
Variance is in squared units. Standard deviation is the square root, giving the same units as your data.

**How many data points do I need?**
More is better. For reliable statistics, aim for at least 30 data points. For regression, at least 10-20 per variable.

**Can I enter data with decimals?**
Yes. Enter values like `1.5, 2.7, 3.2, 4.8`.

**What if I have repeated values?**
Enter them all. Repeated values affect the mean and are essential for finding the mode.

**How do I calculate percentiles?**
Enter your data and specify the percentile (0-100). The 50th percentile equals the median.
