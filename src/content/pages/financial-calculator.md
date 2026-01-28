# Free Online Financial Calculator

Calculate loan payments, compound interest, present value, future value, NPV, IRR, and amortization schedules. Make informed financial decisions with accurate calculations.

## How It Works

Select a calculation type, enter your values, and get instant results. The calculator handles:

- Time value of money (TVM)
- Loan and mortgage payments
- Investment returns
- Business valuation metrics

## Time Value of Money

### The Five TVM Variables

| Variable | Symbol | Description |
|----------|--------|-------------|
| Present Value | PV | Amount today |
| Future Value | FV | Amount at end |
| Payment | PMT | Periodic payment |
| Interest Rate | r | Rate per period |
| Periods | n | Number of periods |

Given any four, calculate the fifth.

### Future Value
How much will your money grow?

**Formula:** FV = PV × (1 + r)ⁿ

**Example:** $10,000 at 5% for 10 years
FV = 10000 × (1.05)¹⁰ = $16,288.95

### Present Value
What's a future amount worth today?

**Formula:** PV = FV / (1 + r)ⁿ

**Example:** $20,000 in 5 years at 6% discount rate
PV = 20000 / (1.06)⁵ = $14,945.16

### Payment Calculation
What's the periodic payment for a loan?

**Example:** $200,000 mortgage, 6% annual rate, 30 years
- Monthly rate: 0.06/12 = 0.005
- Periods: 30 × 12 = 360
- Payment: $1,199.10/month

## Loan Calculations

### Amortization Schedule
See how each payment splits between principal and interest.

**Example:** $10,000 loan at 8% for 3 years (monthly)

| Year | Principal Paid | Interest Paid | Balance |
|------|----------------|---------------|---------|
| 1 | $3,156 | $680 | $6,844 |
| 2 | $3,416 | $420 | $3,428 |
| 3 | $3,428 | $156 | $0 |

Early payments are mostly interest. Later payments are mostly principal.

### Effective vs Nominal Rate

**Nominal rate:** Stated annual rate
**Effective rate:** Actual annual rate after compounding

**Formula:** Effective = (1 + nominal/n)ⁿ - 1

**Example:** 12% nominal, monthly compounding
Effective = (1 + 0.12/12)¹² - 1 = 12.68%

## Investment Analysis

### Net Present Value (NPV)
Is an investment worth it? NPV > 0 means yes.

**Formula:** NPV = Σ(CFₜ / (1 + r)ᵗ)

**Example:** Initial cost $50,000, returns $15,000/year for 5 years, 10% discount rate
NPV = -50000 + 15000/1.1 + 15000/1.1² + ... = $6,861.80

Positive NPV: Investment adds value.

### Internal Rate of Return (IRR)
What return rate makes NPV = 0?

**Example:** Invest $100,000, receive $30,000/year for 5 years
IRR ≈ 15.24%

Compare IRR to your required return rate. If IRR > required rate, consider the investment.

## Real-World Examples

**Saving for retirement:**
Save $500/month for 30 years at 7% average return:
FV = $566,764

**Car loan comparison:**
$25,000 car, 5 years:
- At 4%: $460.41/month, total interest $2,625
- At 7%: $495.03/month, total interest $4,702

**Mortgage refinancing:**
Current: $300,000 at 6%, 25 years remaining = $1,932/month
Refinance: $300,000 at 4%, 25 years = $1,584/month
Savings: $348/month = $104,400 over loan life

**Business investment:**
Equipment costs $50,000, saves $12,000/year for 6 years
NPV at 8%: $5,453 (worth it)
IRR: 11.8%

## Common Mistakes to Avoid

**Mismatching periods and rates:**
If payments are monthly, use monthly rate (annual/12) and monthly periods (years×12).

**Forgetting the sign convention:**
Cash out (investments, payments) is negative. Cash in (returns, loans received) is positive.

**Ignoring compounding frequency:**
Monthly compounding yields more than annual compounding at the same nominal rate.

**Comparing nominal rates directly:**
Always convert to effective rates when comparing loans with different compounding frequencies.

## FAQ

**What's the difference between APR and APY?**
APR is the nominal annual rate. APY (Annual Percentage Yield) is the effective rate including compounding. APY is always ≥ APR.

**Should I use beginning or end of period payments?**
Most loans use end-of-period (ordinary annuity). Leases often use beginning-of-period (annuity due). This calculator uses end-of-period by default.

**How do I calculate mortgage payments?**
Enter the loan amount as PV, annual rate divided by 12 as the rate, years times 12 as periods, and 0 as FV. Solve for PMT.

**What discount rate should I use for NPV?**
Use your required rate of return, cost of capital, or opportunity cost. Common choices: 8-12% for business investments, inflation rate for personal decisions.

**Why is my IRR calculation failing?**
IRR requires at least one sign change in cash flows (investment followed by returns). Multiple sign changes can cause multiple IRRs or no solution.

**How accurate are these calculations?**
Results are accurate to at least 10 decimal places. For official financial documents, verify with your institution's calculations.
