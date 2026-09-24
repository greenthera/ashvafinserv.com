import { useEffect, useMemo, useRef, useState } from 'react';
import CalculatorShell from '../components/calculator/CalculatorShell.jsx';
import Field from '../components/calculator/Field.jsx';
import ProfileBar from '../components/calculator/ProfileBar.jsx';
import SummaryGrid from '../components/calculator/SummaryGrid.jsx';
import TableCard from '../components/calculator/TableCard.jsx';
import ChartCard from '../components/calculator/ChartCard.jsx';
import useLineChart from '../hooks/useLineChart.js';
import { computeSipSwp, money } from '../lib/financeMath.js';
import { blockInvalidNumberKeys, validateClientDetails } from '../lib/formUtils.js';
import { submitSipSwpLead } from '../lib/googleFormLead.js';

const SEO = {
  title: 'SIP & SWP Calculator | Ashva Finserv',
  description:
    'Plan your SIP investments and SWP withdrawals with year-wise projections and inflation-adjusted corpus values. Free SIP & SWP calculator by Ashva Finserv — download a detailed PDF report.',
};

export default function SipSwpCalculator() {
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
      submitSipSwpLead({ clientName, clientPhone, clientEmail });
    }, 800);

    return () => clearTimeout(timer);
  }, [clientName, clientPhone, clientEmail]);

  const [monthlySip, setMonthlySip] = useState(10000);
  const [sipIncrease, setSipIncrease] = useState(10);
  const [sipRoi, setSipRoi] = useState(15);
  const [dob, setDob] = useState('1991-03-25T00:00');
  const [today, setToday] = useState('2026-08-26T00:00');
  const [retirement, setRetirement] = useState(60);
  const [inflation, setInflation] = useState(6);

  const [swpAmount, setSwpAmount] = useState(300000);
  const [swpIncrease, setSwpIncrease] = useState(5);
  const [swpRoi, setSwpRoi] = useState(7);

  const result = useMemo(
    () =>
      computeSipSwp({
        monthlySip: Math.max(0, monthlySip || 0),
        sipIncrease: Math.max(0, sipIncrease || 0),
        sipRoi: Math.max(0, sipRoi || 0),
        dob,
        today,
        retirement: Math.max(0, retirement || 0),
        inflation: Math.max(0, inflation || 0),
        swpAmount: Math.max(0, swpAmount || 0),
        swpIncrease: Math.max(0, swpIncrease || 0),
        swpRoi: Math.max(0, swpRoi || 0),
      }),
    [monthlySip, sipIncrease, sipRoi, dob, today, retirement, inflation, swpAmount, swpIncrease, swpRoi],
  );

  const sipChartRef = useLineChart(result.sipPoints, '#1B6B2A');
  const swpChartRef = useLineChart(result.swpPoints, '#C8A951');

  const sipRows = result.sipRows.map((row) => [
    String(row.year),
    String(row.age),
    money.format(row.monthlyInvestment),
    money.format(row.corpus),
    money.format(row.inflationAdjustedCorpus),
  ]);

  const swpRows = result.swpRows.map((row) => [
    String(row.year),
    money.format(row.openingCorpus),
    money.format(row.monthlyWithdrawal),
    money.format(row.balance),
    money.format(row.inflationAdjusted),
  ]);

  const handleDownload = async () => {
    const errors = validateClientDetails({ clientName, clientPhone, clientEmail });
    setClientErrors(errors);
    if (Object.keys(errors).length > 0) {
      clientDetailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    // jsPDF pulls in a heavy dependency chain, so it's only fetched when needed.
    const { downloadPlannerPdf } = await import('../lib/pdfExport.js');
    await downloadPlannerPdf({
      client: { clientName, clientPhone, clientEmail },
      result,
      sipChartCanvas: sipChartRef.current,
      swpChartCanvas: swpChartRef.current,
      sipRows,
      swpRows,
    });
  };

  return (
    <CalculatorShell
      eyebrow="SIP & SWP calculator"
      title="Investment and withdrawal planner"
      intro="The highlighted Excel parameters are form inputs. All other entries calculate automatically."
      profile={<ProfileBar name={clientName} phone={clientPhone} email={clientEmail} />}
      formCard={
        <section className="bg-white border border-border rounded-[15px] shadow-[0_8px_30px_rgba(26,56,86,0.06)] p-[17px] sm:p-[25px]">
          <h2 className="text-lg">Parameters</h2>
          <p className="text-body-light text-[13px] my-[7px] mb-[22px]">Fill the highlighted values.</p>

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
            <h3 className="text-sm mb-[13px] text-primary-dark">SIP</h3>
            <Field
              id="monthlySip"
              label="Monthly SIP"
              unit="₹"
              type="number"
              inputMode="numeric"
              value={monthlySip}
              onChange={(e) => setMonthlySip(Number(e.target.value))}
              onKeyDown={blockInvalidNumberKeys}
            />
            <Field
              id="sipIncrease"
              label="Yearly Increment"
              unit="%"
              type="number"
              inputMode="decimal"
              value={sipIncrease}
              onChange={(e) => setSipIncrease(Number(e.target.value))}
              onKeyDown={blockInvalidNumberKeys}
            />
            <Field
              id="sipRoi"
              label="ROI"
              unit="%"
              type="number"
              inputMode="decimal"
              value={sipRoi}
              onChange={(e) => setSipRoi(Number(e.target.value))}
              onKeyDown={blockInvalidNumberKeys}
            />
            <Field
              id="dob"
              label="DOB"
              type="datetime-local"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            <Field
              id="today"
              label="Today's date"
              type="datetime-local"
              value={today}
              onChange={(e) => setToday(e.target.value)}
            />
            <Field
              id="retirement"
              label="Retirement"
              unit="age"
              type="number"
              inputMode="numeric"
              value={retirement}
              onChange={(e) => setRetirement(Number(e.target.value))}
              onKeyDown={blockInvalidNumberKeys}
            />
            <Field
              id="inflation"
              label="Inflation"
              unit="%"
              type="number"
              inputMode="decimal"
              value={inflation}
              onChange={(e) => setInflation(Number(e.target.value))}
              onKeyDown={blockInvalidNumberKeys}
            />
          </div>

          <div className="border-t border-border mt-[21px] pt-[19px]">
            <h3 className="text-sm mb-[13px] text-primary-dark">SWP</h3>
            <Field
              id="swpAmount"
              label="SWP Amount"
              unit="monthly ₹"
              type="number"
              inputMode="numeric"
              value={swpAmount}
              onChange={(e) => setSwpAmount(Number(e.target.value))}
              onKeyDown={blockInvalidNumberKeys}
            />
            <Field
              id="swpIncrease"
              label="Yearly Increment"
              unit="%"
              type="number"
              inputMode="decimal"
              value={swpIncrease}
              onChange={(e) => setSwpIncrease(Number(e.target.value))}
              onKeyDown={blockInvalidNumberKeys}
            />
            <Field
              id="swpRoi"
              label="ROI"
              unit="%"
              type="number"
              inputMode="decimal"
              value={swpRoi}
              onChange={(e) => setSwpRoi(Number(e.target.value))}
              onKeyDown={blockInvalidNumberKeys}
            />
          </div>

          <p className="bg-primary-lighter border-l-[3px] border-primary text-body text-xs leading-[1.45] px-[11px] py-[10px] mt-[22px] rounded-r-[7px]">
            SIP corpus at retirement automatically becomes the SWP starting corpus.
          </p>

          <button
            type="button"
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
              { label: 'Current age', value: `${result.currentAge} years` },
              { label: 'SIP corpus at retirement', value: money.format(result.corpus), variant: 'primary' },
              { label: 'Investment period', value: `${result.investmentYears} years`, variant: 'success' },
            ]}
          />

          <div className="grid gap-[18px]">
            <ChartCard
              title="SIP corpus growth"
              subtitle="Projected corpus through retirement"
              canvasRef={sipChartRef}
              ariaLabel="SIP corpus growth chart"
            />

            <TableCard
              title="SIP year-wise calculation"
              subtitleLabel="Total invested"
              subtitleValue={money.format(result.totalInvested)}
              badge="SIP"
              columns={['Year', 'Age', 'Monthly SIP', 'Corpus at year end', 'Inflation adjusted']}
              rows={sipRows}
              emptyMessage="Enter DOB, today's date and retirement age."
            />

            <SummaryGrid
              columns={2}
              metrics={[
                { label: 'SWP starting corpus', value: money.format(result.swpCorpus) },
                { label: 'Total withdrawal', value: money.format(result.totalWithdrawal), variant: 'primary' },
              ]}
            />

            <ChartCard
              title="SWP corpus balance"
              subtitle="Projected balance after withdrawals"
              canvasRef={swpChartRef}
              ariaLabel="SWP corpus balance chart"
            />

            <TableCard
              title="SWP year-wise calculation"
              subtitleText="Withdrawal increases every year."
              badge="SWP"
              columns={['Year', 'Opening corpus', 'Monthly SWP', 'Corpus at year end', 'Inflation adjusted']}
              rows={swpRows}
              emptyMessage="Your SIP corpus will appear here."
            />
          </div>
        </>
      }
    />
  );
}
