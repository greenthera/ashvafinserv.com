export const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function futureValue(rate, periods, payment, presentValue = 0, due = 1) {
  if (!rate) return -(presentValue + payment * periods);

  return -(
    presentValue * (1 + rate) ** periods +
    (payment * (1 + rate * due) * ((1 + rate) ** periods - 1)) / rate
  );
}

export function getAge(dateOfBirth, todayDate) {
  if (!dateOfBirth || !todayDate) return 0;

  const today = new Date(todayDate);
  const birthDate = new Date(dateOfBirth);
  let years = today.getFullYear() - birthDate.getFullYear();

  if (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
    years -= 1;
  }

  return years;
}

/** SIP accumulation + SWP drawdown projection, mirroring the original renderPlanner/renderSwp. */
export function computeSipSwp({
  monthlySip,
  sipIncrease,
  sipRoi,
  dob,
  today,
  retirement,
  inflation,
  swpAmount,
  swpIncrease,
  swpRoi,
}) {
  const sipIncreaseRate = sipIncrease / 100;
  const sipReturn = sipRoi / 100;
  const inflationRate = inflation / 100;
  const currentAge = getAge(dob, today);
  const investmentYears = Math.min(60, Math.max(0, retirement - currentAge));

  const monthlySipRate = (1 + sipReturn) ** (1 / 12) - 1;
  const monthlyRealRate = ((1 + sipReturn) / (1 + inflationRate)) ** (1 / 12) - 1;

  let totalInvested = 0;
  let corpus = 0;
  let inflationAdjustedCorpus = 0;
  const sipRows = [];
  const sipPoints = [];

  for (let year = 1; year <= investmentYears; year += 1) {
    const monthlyInvestment = monthlySip * (1 + sipIncreaseRate) ** (year - 1);
    totalInvested += monthlyInvestment * 12;
    corpus = futureValue(monthlySipRate, 12, -monthlyInvestment, -corpus);
    inflationAdjustedCorpus = futureValue(monthlyRealRate, 12, -monthlyInvestment, -inflationAdjustedCorpus);
    sipPoints.push(corpus);
    sipRows.push({
      year,
      age: currentAge + year,
      monthlyInvestment,
      corpus,
      inflationAdjustedCorpus,
    });
  }

  // SWP: SIP corpus becomes the starting withdrawal corpus.
  const startingWithdrawal = swpAmount;
  const withdrawalIncreaseRate = swpIncrease / 100;
  const swpReturnRate = swpRoi / 100;
  const monthlySwpRate = (1 + swpReturnRate) ** (1 / 12) - 1;
  const swpMonthlyRealRate = ((1 + swpReturnRate) / (1 + inflationRate)) ** (1 / 12) - 1;

  let balance = corpus;
  let totalWithdrawal = 0;
  const swpRows = [];
  const swpPoints = [];

  for (let year = 1; year <= 35 && balance > 0; year += 1) {
    const monthlyWithdrawal = startingWithdrawal * (1 + withdrawalIncreaseRate) ** (year - 1);
    const openingCorpus = balance;
    const closingCorpus = futureValue(monthlySwpRate, 12, monthlyWithdrawal, -balance);

    totalWithdrawal += Math.min(monthlyWithdrawal * 12, openingCorpus);
    balance = Math.max(0, closingCorpus);
    swpPoints.push(balance);
    swpRows.push({
      year,
      openingCorpus,
      monthlyWithdrawal,
      balance,
      inflationAdjusted: futureValue(swpMonthlyRealRate, 12, monthlyWithdrawal, -openingCorpus),
    });
  }

  return {
    currentAge,
    investmentYears,
    totalInvested,
    corpus,
    sipRows,
    sipPoints,
    swpCorpus: corpus,
    totalWithdrawal,
    swpRows,
    swpPoints,
  };
}

// The longest schedule this calculator will ever render — real payoff
// lengths are used as-is up to this point. Beyond it (an EMI so close to the
// interest-only payment that payoff would take over a century, or one that
// never pays off at all), the schedule is capped to this preview window.
const MAX_SIMULATION_MONTHS = 100 * 12;

/**
 * Loan amortization schedule, mirroring the original renderLoan.
 *
 * Pass `fixedEmi` to drive the schedule from a literal monthly payment
 * (the "Tenure (EMI)" field) instead of deriving EMI from `loanYears` via
 * the standard formula. The exact number of months needed to clear the
 * balance at that EMI is solved up front (however long that actually is —
 * years and months always reflect the real payoff), and the simulation
 * fills in the month-by-month schedule for exactly that many months. If the
 * EMI doesn't even cover the monthly interest, there is no finite payoff —
 * the balance grows instead of shrinking (negative amortization), and the
 * schedule only previews a bounded window of that growth.
 */
export function computeLoan({ loanAmount, loanRate, loanYears, fixedEmi }) {
  const monthlyRate = loanRate / 100 / 12;
  const useFixedEmi = Boolean(fixedEmi);

  // An EMI at or below monthly interest never reduces the principal.
  // There is no repayment schedule or finite total to report in this case.
  if (useFixedEmi && loanAmount > 0 && fixedEmi <= loanAmount * monthlyRate) {
    return {
      tenureMonths: null,
      emi: fixedEmi,
      totalInterest: null,
      totalPayable: null,
      rows: [],
      points: [],
    };
  }

  let maxMonths;
  if (useFixedEmi) {
    if (!monthlyRate) {
      maxMonths = Math.min(MAX_SIMULATION_MONTHS, Math.ceil(loanAmount / fixedEmi));
    } else {
      const minEmi = loanAmount * monthlyRate;
      const exactMonths =
        fixedEmi > minEmi ? Math.ceil(Math.log(fixedEmi / (fixedEmi - minEmi)) / Math.log(1 + monthlyRate)) : Infinity;
      maxMonths = Math.min(MAX_SIMULATION_MONTHS, exactMonths);
    }
  } else {
    maxMonths = Math.floor(loanYears * 12);
  }

  const emi = useFixedEmi
    ? fixedEmi
    : maxMonths
      ? monthlyRate
        ? (loanAmount * monthlyRate * (1 + monthlyRate) ** maxMonths) / ((1 + monthlyRate) ** maxMonths - 1)
        : loanAmount / maxMonths
      : 0;

  let balance = loanAmount;
  let totalInterest = 0;
  const rows = [];
  const points = [];
  let month = 0;

  for (month = 1; month <= maxMonths; month += 1) {
    const interest = balance * monthlyRate;
    const principal = Math.min(balance, emi - interest);
    const payment = Math.min(emi, balance + interest);
    balance = Math.max(0, balance - principal);
    totalInterest += interest;
    points.push(balance);
    rows.push({ month, payment, interest, principal, balance });
    // Floating point can leave a fractional-paisa residual instead of
    // exactly 0, which would otherwise take one extra month to clear.
    if (useFixedEmi && balance < 0.01) break;
  }

  return {
    tenureMonths: useFixedEmi ? Math.min(month, maxMonths) : maxMonths,
    emi,
    totalInterest,
    totalPayable: loanAmount + totalInterest,
    rows,
    points,
  };
}
