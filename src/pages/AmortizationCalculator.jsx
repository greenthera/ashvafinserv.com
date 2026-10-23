import { useEffect, useMemo, useRef, useState } from 'react';
import CalculatorShell from '../components/calculator/CalculatorShell.jsx';
import Field from '../components/calculator/Field.jsx';
import ProfileBar from '../components/calculator/ProfileBar.jsx';
import SummaryGrid from '../components/calculator/SummaryGrid.jsx';
import TableCard from '../components/calculator/TableCard.jsx';
import ChartCard from '../components/calculator/ChartCard.jsx';
import useLineChart from '../hooks/useLineChart.js';
import { computeLoan, money } from '../lib/financeMath.js';
import { blockInvalidNumberKeys, validateClientDetails } from '../lib/formUtils.js';
import { submitAmortizationLead } from '../lib/googleFormLead.js';

const SEO = {
  title: 'Amortization Calculator | Ashva Finserv',
  description:
    'Calculate your home loan EMI, total interest payable, and full month-by-month repayment schedule instantly. Free online loan calculator by Ashva Finserv — download a detailed PDF report.',
};

export default function AmortizationCalculator() {
  useEffect(() => {
    document.title = SEO.title;
  }, []);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientErrors, setClientErrors] = useState({});
  const clientDetailsRef = useRef(null);
  const lastSubmittedLeadRef = useRef('');

  // Silently logs "Your details" as a lead once it's valid — no submit
  // button, debounced so it only fires after the user pauses typing.
  useEffect(() => {
    if (Object.keys(validateClientDetails({ clientName, clientPhone, clientEmail })).length > 0) return undefined;

    const timer = setTimeout(() => {
      const signature = `${clientName}|${clientPhone}|${clientEmail}`;
      if (lastSubmittedLeadRef.current === signature) return;
      lastSubmittedLeadRef.current = signature;
      submitAmortizationLead({ clientName, clientPhone, clientEmail });
    }, 800);

    return () => clearTimeout(timer);
  }, [clientName, clientPhone, clientEmail]);

  const [loanAmount, setLoanAmount] = useState(2700000);
  const [loanRate, setLoanRate] = useState(7.5);
  const [loanYears, setLoanYears] = useState(15);
  // Set once the user drives the calculator from the "Tenure (EMI)" field
  // instead of "Tenure (Years)". While active, the schedule is simulated
  // from this literal EMI rather than a formula-derived one, so the EMI
  // column always shows exactly what was typed.
  const [emiOverride, setEmiOverride] = useState(null);

  const loan = useMemo(
    () =>
      computeLoan({
        loanAmount: Math.max(0, loanAmount || 0),
        loanRate: Math.max(0, loanRate || 0),
        loanYears: Math.max(0, loanYears || 0),
        fixedEmi: emiOverride,
      }),
    [loanAmount, loanRate, loanYears, emiOverride],
  );

  // Keep a draft while editing EMI; otherwise display the years-derived EMI.
  const [emiInput, setEmiInput] = useState(null);
  const [emiError, setEmiError] = useState(null);

  const updateEmiInput = (value) => {
    setEmiInput(value);
    const emiValue = Number(value);
    if (!Number.isFinite(emiValue) || emiValue <= 0) {
      setEmiError(value.trim() ? 'Enter an EMI greater than 0.' : null);
      return;
    }

    setEmiError(null);
    setEmiOverride(emiValue);
  };

  const cannotRepay = loan.tenureMonths === null;
  const repaymentError = cannotRepay
    ? `This EMI cannot repay the loan. Enter more than ${money.format(Math.max(0, loanAmount) * Math.max(0, loanRate) / 1200)} to cover monthly interest and reduce the balance.`
    : null;

  // Derive the display directly so EMI changes cannot race a syncing effect.
  const displayedYears = emiOverride == null
    ? loanYears
    : cannotRepay ? '' : Math.round((loan.tenureMonths / 12) * 100) / 100;

  const chartRef = useLineChart(loan.points, '#1B6B2A', 12);
  // True when the EMI doesn't even cover the interest, so the balance grows
  // instead of shrinking (only reachable via a very low "Tenure (EMI)" entry).
  const isNegativelyAmortizing = loan.rows.length > 0 && loan.rows.at(-1).balance >= loan.rows[0].balance;

  const tableRows = loan.rows.map((row) => [
    String(row.month),
    money.format(row.payment),
    money.format(row.interest),
    money.format(row.principal),
    money.format(row.balance),
  ]);

  const handleDownload = async () => {
    if (cannotRepay) return;
    const errors = validateClientDetails({ clientName, clientPhone, clientEmail });
    setClientErrors(errors);
    if (Object.keys(errors).length > 0) {
      clientDetailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    // jsPDF pulls in a heavy dependency chain, so it's only fetched when needed.
    const { downloadLoanPdf } = await import('../lib/pdfExport.js');
    await downloadLoanPdf({
      client: { clientName, clientPhone, clientEmail },
      loan,
      chartCanvas: chartRef.current,
      tableRows,
    });
  };

  return (
    <CalculatorShell
      eyebrow="Amortization calculator"
      title="Loan Calculator"
      intro="Highlighted workbook fields are inputs; the schedule and outputs update automatically."
      profile={<ProfileBar name={clientName} phone={clientPhone} email={clientEmail} />}
      formCard={
        <section className="bg-white border border-border rounded-[15px] shadow-[0_8px_30px_rgba(26,56,86,0.06)] p-[17px] sm:p-[25px]">
          <h2 className="text-lg">Loan parameters</h2>
          <p className="text-body-light text-[13px] my-[7px] mb-[22px]">Enter the values from your Excel sheet.</p>

          <div ref={clientDetailsRef} className="border-t-0 mt-0 pt-0 scroll-mt-[100px]">
            <h3 className="text-sm mb-[13px] text-primary-dark">Your details</h3>
            <Field
              id="clientName"
              label="Full name"
              type="text"
              placeholder="e.g. Ananya Sharma"
              autoComplete="name"
              required
              error={clientErrors.clientName}
              value={clientName}
              onChange={(e) => {
                setClientName(e.target.value);
                setClientErrors((prev) => ({ ...prev, clientName: undefined }));
              }}
            />
            <Field
              id="clientPhone"
              label="Phone"
              type="tel"
              inputMode="tel"
              placeholder="9876543210"
              autoComplete="tel"
              required
              error={clientErrors.clientPhone}
              hint="Accepts a 10-digit mobile number, with or without spaces, dashes, or a +91 prefix."
              value={clientPhone}
              onChange={(e) => {
                setClientPhone(e.target.value);
                setClientErrors((prev) => ({ ...prev, clientPhone: undefined }));
              }}
            />
            <Field
              id="clientEmail"
              label="Email"
              type="email"
              inputMode="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              error={clientErrors.clientEmail}
              hint="Accepts any valid email address, e.g. name@example.com."
              value={clientEmail}
              onChange={(e) => {
                setClientEmail(e.target.value);
                setClientErrors((prev) => ({ ...prev, clientEmail: undefined }));
              }}
            />
          </div>

          <div className="border-t border-border mt-[21px] pt-[19px]">
            <h3 className="text-sm mb-[13px] text-primary-dark">Loan</h3>
            <Field
              id="loanAmount"
              label="Loan amount"
              unit="₹"
              type="number"
              inputMode="numeric"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              onKeyDown={blockInvalidNumberKeys}
            />
            <Field
              id="loanRate"
              label="Rate of Interest"
              unit="% yearly"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={loanRate}
              onChange={(e) => setLoanRate(Number(e.target.value))}
              onKeyDown={blockInvalidNumberKeys}
            />
            <Field
              id="loanEmiInput"
              label="Tenure (EMI)"
              unit="₹"
              type="number"
              inputMode="numeric"
              error={emiError || repaymentError}
              hint="Type a target EMI to solve for the tenure needed to hit it."
              value={emiInput ?? (loan.emi ? String(Math.round(loan.emi)) : '')}
              onChange={(e) => {
                updateEmiInput(e.target.value);
              }}
              onKeyDown={(e) => {
                blockInvalidNumberKeys(e);
                if (e.key === 'Enter') e.target.blur();
              }}
            />
            <Field
              id="loanYears"
              label="Tenure (Years)"
              unit="years"
              type="number"
              inputMode="decimal"
              step="any"
              value={displayedYears}
              onChange={(e) => {
                setLoanYears(Number(e.target.value));
                setEmiOverride(null);
                setEmiInput(null);
                setEmiError(null);
              }}
              onKeyDown={blockInvalidNumberKeys}
            />
            <Field
              id="loanMonthsInput"
              label="Tenure (Months)"
              unit="calculated"
              type="number"
              inputMode="numeric"
              readOnly
              value={loan.tenureMonths ?? ''}
            />
          </div>

          <p className="bg-primary-lighter border-l-[3px] border-primary text-body text-xs leading-[1.45] px-[11px] py-[10px] mt-[22px] rounded-r-[7px]">
            EMI uses the workbook&rsquo;s monthly PMT calculation.
          </p>

          <button
            type="button"
            disabled={cannotRepay}
            onClick={handleDownload}
            className="w-full justify-center mt-[18px] inline-flex items-center gap-2 bg-primary text-white rounded-full px-7 py-3 font-semibold text-[0.95rem] transition-all hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(27,107,42,0.3)]"
          >
            <i className="fas fa-download" /> Download Report
          </button>
        </section>
      }
      results={
        <>
          <SummaryGrid
            metrics={[
              { label: 'Tenure (months)', value: cannotRepay ? 'No finite tenure' : `${loan.tenureMonths} months` },
              { label: 'EMI', value: money.format(loan.emi), variant: 'primary' },
              { label: 'Total interest', value: cannotRepay ? '—' : money.format(loan.totalInterest), variant: 'success' },
            ]}
          />

          <TableCard
            className="mb-[18px]"
            title="Loan repayment schedule"
            subtitleLabel="Total payable"
            subtitleValue={cannotRepay ? '—' : money.format(loan.totalPayable)}
            columns={['No.', 'EMI', 'Interest', 'Principal', 'Balance O/S']}
            rows={tableRows}
            emptyMessage={repaymentError || "Enter a loan tenure."}
          />

          <ChartCard
            className="mt-5"
            title="Outstanding loan balance"
            subtitle={cannotRepay ? repaymentError : isNegativelyAmortizing ? "This EMI doesn't cover the interest, so the balance grows" : 'Balance reduces with every EMI'}
            canvasRef={chartRef}
            ariaLabel="Loan balance chart"
          />
        </>
      }
    />
  );
}
