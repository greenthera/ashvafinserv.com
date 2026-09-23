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

/** Loan amortization schedule, mirroring the original renderLoan. */
export function computeLoan({ loanAmount, loanRate, loanYears }) {
  const annualRate = loanRate / 100;
  const tenureMonths = Math.floor(loanYears * 12);
  const monthlyRate = annualRate / 12;
  const emi = tenureMonths
    ? monthlyRate
      ? (loanAmount * monthlyRate * (1 + monthlyRate) ** tenureMonths) / ((1 + monthlyRate) ** tenureMonths - 1)
      : loanAmount / tenureMonths
    : 0;

  let balance = loanAmount;
  let totalInterest = 0;
  const rows = [];
  const points = [];

  for (let month = 1; month <= tenureMonths; month += 1) {
    const interest = balance * monthlyRate;
    const principal = Math.min(balance, emi - interest);
    const payment = Math.min(emi, balance + interest);
    balance = Math.max(0, balance - principal);
    totalInterest += interest;
    points.push(balance);
    rows.push({ month, payment, interest, principal, balance });
  }

  return {
    tenureMonths,
    emi,
    totalInterest,
    totalPayable: loanAmount + totalInterest,
    rows,
    points,
  };
}
