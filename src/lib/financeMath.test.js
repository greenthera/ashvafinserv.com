import { describe, expect, it } from 'vitest';
import { computeLoan, computeSipSwp, futureValue, getAge } from './financeMath.js';

describe('futureValue', () => {
  it('accumulates with zero interest as plain sum of payments', () => {
    // 12 payments of 1000 at 0% growth should just be -12000.
    expect(futureValue(0, 12, -1000)).toBeCloseTo(12000, 6);
  });

  it('matches a known compound-interest result at a non-zero rate', () => {
    // Single lump sum of 100000 for 12 periods at 1%/period, no payments.
    // FV = -(100000 * 1.01^12) ≈ -112682.50
    const result = futureValue(0.01, 12, 0, -100000);
    expect(result).toBeCloseTo(112682.5, 0);
  });

  it('matches a known SIP-style monthly contribution series (annuity-due)', () => {
    // 12 monthly contributions of 1000 at 1%/month, due at the start of each
    // period — the same annuity-due convention used throughout this module.
    const result = futureValue(0.01, 12, -1000, 0, 1);
    expect(result).toBeCloseTo(12809.33, 1);
  });
});

describe('getAge', () => {
  it('returns 0 when either date is missing', () => {
    expect(getAge('', '2026-01-01')).toBe(0);
    expect(getAge('1990-01-01', '')).toBe(0);
  });

  it('counts a full year once the birthday has passed this year', () => {
    expect(getAge('1991-03-25', '2026-08-26')).toBe(35);
  });

  it('does not count the year yet if the birthday has not happened this year', () => {
    expect(getAge('1991-09-25', '2026-08-26')).toBe(34);
  });

  it('counts the birthday itself as the new age', () => {
    expect(getAge('1991-03-25', '2026-03-25')).toBe(35);
  });
});

describe('computeLoan — Amortization Calculator regression baseline', () => {
  // These are the calculator's own default field values (loanAmount, loanRate,
  // loanYears). If this test ever fails, either the amortization math changed
  // or these numbers need to be re-derived — never "fixed" to make it pass.
  const defaults = { loanAmount: 2700000, loanRate: 7.5, loanYears: 15 };

  it('produces the exact EMI, tenure, and totals shown in the UI for the default inputs', () => {
    const loan = computeLoan(defaults);

    expect(loan.tenureMonths).toBe(180);
    expect(Math.round(loan.emi)).toBe(25029);
    expect(Math.round(loan.totalInterest)).toBe(1805280);
    expect(Math.round(loan.totalPayable)).toBe(4505280);
    expect(loan.rows).toHaveLength(180);
    expect(loan.points).toHaveLength(180);
  });

  it('fully amortizes: the final month leaves (near) zero balance', () => {
    const loan = computeLoan(defaults);
    expect(loan.rows.at(-1).balance).toBeLessThan(1);
  });

  it('balance strictly decreases every month (no negative amortization)', () => {
    const loan = computeLoan(defaults);
    for (let i = 1; i < loan.rows.length; i += 1) {
      expect(loan.rows[i].balance).toBeLessThanOrEqual(loan.rows[i - 1].balance);
    }
  });

  it('interest + principal reconstructs the EMI for every row', () => {
    const loan = computeLoan(defaults);
    loan.rows.forEach((row) => {
      expect(row.interest + row.principal).toBeCloseTo(row.payment, 6);
    });
  });

  it('handles a zero interest rate as straight-line amortization', () => {
    const loan = computeLoan({ loanAmount: 120000, loanRate: 0, loanYears: 1 });
    expect(loan.tenureMonths).toBe(12);
    expect(loan.emi).toBeCloseTo(10000, 6);
    expect(loan.totalInterest).toBeCloseTo(0, 6);
  });

  it('handles a zero tenure without producing NaN or a crash', () => {
    const loan = computeLoan({ loanAmount: 500000, loanRate: 7.5, loanYears: 0 });
    expect(loan.tenureMonths).toBe(0);
    expect(loan.emi).toBe(0);
    expect(loan.rows).toHaveLength(0);
  });
});

describe('computeSipSwp — SIP & SWP Calculator regression baseline', () => {
  // These are the calculator's own default field values.
  const defaults = {
    monthlySip: 10000,
    sipIncrease: 10,
    sipRoi: 15,
    dob: '1991-03-25T00:00',
    today: '2026-08-26T00:00',
    retirement: 60,
    inflation: 6,
    swpAmount: 300000,
    swpIncrease: 5,
    swpRoi: 7,
  };

  it('produces the exact age, investment period, and corpus shown in the UI for the default inputs', () => {
    const result = computeSipSwp(defaults);

    expect(result.currentAge).toBe(35);
    expect(result.investmentYears).toBe(25);
    expect(result.sipRows).toHaveLength(25);
    expect(Math.round(result.corpus)).toBe(57216697);
    expect(result.swpCorpus).toBe(result.corpus);
  });

  it('SIP corpus grows monotonically year over year', () => {
    const result = computeSipSwp(defaults);
    for (let i = 1; i < result.sipRows.length; i += 1) {
      expect(result.sipRows[i].corpus).toBeGreaterThan(result.sipRows[i - 1].corpus);
    }
  });

  it('SIP monthly investment increases by the yearly increment rate each year', () => {
    const result = computeSipSwp(defaults);
    const [first, second] = result.sipRows;
    expect(second.monthlyInvestment).toBeCloseTo(first.monthlyInvestment * 1.1, 6);
  });

  it('SWP schedule stops once the corpus is depleted (balance never goes negative)', () => {
    const result = computeSipSwp(defaults);
    result.swpRows.forEach((row) => {
      expect(row.balance).toBeGreaterThanOrEqual(0);
    });
    // The loop is capped at 35 years even if the corpus outlives that window.
    expect(result.swpRows.length).toBeLessThanOrEqual(35);
  });

  it('clamps investment years to 0 when retirement age is already reached', () => {
    const result = computeSipSwp({ ...defaults, retirement: 30 });
    expect(result.investmentYears).toBe(0);
    expect(result.corpus).toBe(0);
    expect(result.sipRows).toHaveLength(0);
  });

  it('caps investment years at 60 for an extreme retirement age', () => {
    const result = computeSipSwp({ ...defaults, dob: '2020-01-01T00:00', today: '2026-01-01T00:00', retirement: 90 });
    expect(result.investmentYears).toBe(60);
  });
});
