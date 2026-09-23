import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { money } from './financeMath.js';
import { slugifyFileName } from './formUtils.js';

const pdfBrand = {
  teal: [27, 107, 42],
  accent: [200, 169, 81],
  muted: [105, 120, 135],
  ink: [35, 49, 64],
  shivantra: [1, 1, 79],
};

// jsPDF's built-in fonts don't include the ₹ glyph, so it's swapped for "Rs." before drawing.
const pdfAmount = (text) => String(text).replaceAll('₹', 'Rs. ').replaceAll('•', '|');
const fmt = (value) => pdfAmount(money.format(Math.round(value)));

let bannerImagePromise;
function loadBannerImage() {
  if (!bannerImagePromise) {
    bannerImagePromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = `${import.meta.env.BASE_URL}images/ashva-finserv-banner.png`;
    });
  }
  return bannerImagePromise;
}

function drawPdfFooter(pdf, pageNumber, totalPages, tagline) {
  const brandName = 'Ashva Finserv';
  const taglinePrefix = tagline.slice(0, tagline.length - brandName.length);

  pdf.setDrawColor(220, 230, 229);
  pdf.setLineWidth(0.2);
  pdf.line(15, 286, 195, 286);

  pdf.setFontSize(8);

  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(...pdfBrand.muted);
  const taglinePrefixWidth = pdf.getTextWidth(taglinePrefix);
  pdf.text(taglinePrefix, 15, 291);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(...pdfBrand.teal);
  pdf.textWithLink(brandName, 15 + taglinePrefixWidth, 291, { url: 'https://www.ashvafinserv.com' });

  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(...pdfBrand.muted);
  pdf.text(`Page ${pageNumber} of ${totalPages}`, 105, 291, { align: 'center' });

  const devPrefix = 'Developed by ';
  const devName = 'Shivantra';
  pdf.setFont(undefined, 'normal');
  const devPrefixWidth = pdf.getTextWidth(devPrefix);
  pdf.setFont(undefined, 'bold');
  const devNameWidth = pdf.getTextWidth(devName);
  const devX = 195 - (devPrefixWidth + devNameWidth);

  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(...pdfBrand.muted);
  pdf.text(devPrefix, devX, 291);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(...pdfBrand.shivantra);
  pdf.textWithLink(devName, devX + devPrefixWidth, 291, {
    url: 'https://shivantra.com/?utm_source=ashvafinserv.com&utm_medium=referral&utm_campaign=client_pdf_footer',
  });

  pdf.setFont(undefined, 'normal');
}

function ensureSpace(pdf, cursorY, neededHeight, top = 20) {
  if (cursorY + neededHeight > 280) {
    pdf.addPage();
    return top;
  }
  return cursorY;
}

function addStatsRow(pdf, cursorY, stats) {
  cursorY = ensureSpace(pdf, cursorY, 22);

  autoTable(pdf, {
    startY: cursorY,
    head: [stats.map((stat) => stat.label)],
    body: [stats.map((stat) => stat.value)],
    theme: 'grid',
    styles: { halign: 'center', fontSize: 8, cellPadding: 3, textColor: pdfBrand.ink },
    headStyles: { fillColor: [244, 248, 247], textColor: pdfBrand.muted, fontStyle: 'normal', fontSize: 7 },
    bodyStyles: { fontStyle: 'bold', fontSize: 11, textColor: pdfBrand.teal },
  });

  return pdf.lastAutoTable.finalY + 10;
}

function addSectionTitle(pdf, cursorY, title, subtitle) {
  cursorY = ensureSpace(pdf, cursorY, 14);

  pdf.setTextColor(...pdfBrand.teal);
  pdf.setFontSize(14);
  pdf.text(title, 15, cursorY);
  cursorY += 5;
  pdf.setFontSize(8.5);
  pdf.setTextColor(...pdfBrand.muted);
  pdf.text(subtitle, 15, cursorY);

  return cursorY + 8;
}

function addChartImage(pdf, cursorY, canvas) {
  if (!canvas) return cursorY;

  const imgWidth = 180;
  const aspect = canvas.clientHeight / canvas.clientWidth;
  const imgHeight = imgWidth * aspect;

  cursorY = ensureSpace(pdf, cursorY, imgHeight);
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, cursorY, imgWidth, imgHeight);

  return cursorY + imgHeight + 10;
}

function addTableSection(pdf, cursorY, title, head, body) {
  cursorY = ensureSpace(pdf, cursorY, 24);

  pdf.setTextColor(...pdfBrand.teal);
  pdf.setFontSize(14);
  pdf.text(title, 15, cursorY);
  cursorY += 6;

  autoTable(pdf, {
    startY: cursorY,
    head: [head],
    body,
    theme: 'striped',
    styles: { fontSize: 7.5 },
    headStyles: { fillColor: pdfBrand.teal, fontSize: 8.5, halign: 'center' },
    margin: { left: 10, right: 10 },
  });

  return pdf.lastAutoTable.finalY + 10;
}

function addClientBox(pdf, cursorY, { clientName, clientPhone, clientEmail }) {
  if (!clientName && !clientPhone && !clientEmail) return cursorY;

  const boxTop = cursorY;
  const boxHeight = 18;
  pdf.setFillColor(244, 248, 247);
  pdf.setDrawColor(...pdfBrand.teal);
  pdf.roundedRect(15, boxTop, 180, boxHeight, 3, 3, 'FD');

  const cx = 15 + 11;
  const cy = boxTop + boxHeight / 2;
  pdf.setFillColor(...pdfBrand.teal);
  pdf.circle(cx, cy, 7, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.text((clientName || clientPhone || clientEmail).charAt(0).toUpperCase(), cx, cy + 1.2, { align: 'center' });

  pdf.setTextColor(...pdfBrand.ink);
  pdf.setFontSize(11);
  pdf.text(clientName || 'Client', 39, boxTop + 7.5);
  const contactLine = [clientPhone, clientEmail].filter(Boolean).join('   •   ');
  if (contactLine) {
    pdf.setFontSize(8.5);
    pdf.setTextColor(...pdfBrand.muted);
    pdf.text(contactLine, 39, boxTop + 13.5);
  }

  return boxTop + boxHeight + 10;
}

async function buildBasePdf({ title, client }) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });

  let bannerImage = null;
  try {
    bannerImage = await loadBannerImage();
  } catch {
    bannerImage = null;
  }

  let cursorY = 16;
  if (bannerImage) {
    const bannerHeight = 210 * (bannerImage.height / bannerImage.width);
    pdf.addImage(bannerImage, 'PNG', 0, 0, 210, bannerHeight);
    cursorY = bannerHeight + 10;
  }

  pdf.setTextColor(...pdfBrand.teal);
  pdf.setFontSize(17);
  pdf.text(title, 15, cursorY);
  cursorY += 6;
  pdf.setFontSize(9);
  pdf.setTextColor(...pdfBrand.muted);
  pdf.text(`Prepared on: ${new Date().toLocaleDateString('en-IN')}`, 15, cursorY);
  cursorY += 10;

  cursorY = addClientBox(pdf, cursorY, client);

  return { pdf, cursorY };
}

function finalizePdf(pdf, tagline, filenamePrefix, baseName) {
  const totalPages = pdf.internal.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    pdf.setPage(page);
    drawPdfFooter(pdf, page, totalPages, tagline);
  }

  pdf.save(`${filenamePrefix ? `${filenamePrefix}-` : ''}${baseName}.pdf`);
}

/** Downloads the branded Loan Repayment Report PDF. */
export async function downloadLoanPdf({ client, loan, chartCanvas, tableRows }) {
  const { pdf, cursorY: baseCursorY } = await buildBasePdf({ title: 'Loan Repayment Report', client });
  let cursorY = baseCursorY;

  autoTable(pdf, {
    startY: cursorY,
    head: [['Key projection', 'Amount']],
    body: [
      ['EMI', fmt(loan.emi)],
      ['Total interest', fmt(loan.totalInterest)],
      ['Total payable', fmt(loan.totalPayable)],
    ],
    theme: 'striped',
    styles: { fontSize: 9 },
    headStyles: { fillColor: pdfBrand.teal },
  });
  cursorY = pdf.lastAutoTable.finalY + 8;

  cursorY = addSectionTitle(pdf, cursorY + 6, 'Outstanding loan balance', 'Projection based on the entered calculator values');
  cursorY = addStatsRow(pdf, cursorY, [
    { label: 'Tenure (months)', value: String(loan.tenureMonths) },
    { label: 'EMI', value: fmt(loan.emi) },
    { label: 'Total interest', value: fmt(loan.totalInterest) },
  ]);
  cursorY = addChartImage(pdf, cursorY, chartCanvas);
  addTableSection(
    pdf,
    cursorY,
    'Monthly repayment schedule',
    ['No.', 'EMI', 'Interest', 'Principal', 'Balance O/S'],
    tableRows,
  );

  finalizePdf(pdf, 'Amortization Calculator by Ashva Finserv', slugifyFileName(client.clientName), 'loan-repayment-report');
}

/** Downloads the branded SIP & SWP Financial Plan PDF. */
export async function downloadPlannerPdf({ client, result, sipChartCanvas, swpChartCanvas, sipRows, swpRows }) {
  const { pdf, cursorY: baseCursorY } = await buildBasePdf({ title: 'SIP & SWP Financial Plan', client });
  let cursorY = baseCursorY;

  autoTable(pdf, {
    startY: cursorY,
    head: [['Key projection', 'Amount']],
    body: [
      ['SIP corpus at retirement', fmt(result.corpus)],
      ['Total SIP invested', fmt(result.totalInvested)],
      ['SWP total withdrawal', fmt(result.totalWithdrawal)],
    ],
    theme: 'striped',
    styles: { fontSize: 9 },
    headStyles: { fillColor: pdfBrand.teal },
  });
  cursorY = pdf.lastAutoTable.finalY + 8;

  cursorY = addSectionTitle(pdf, cursorY + 6, 'SIP corpus growth', 'Projection based on the entered calculator values');
  cursorY = addStatsRow(pdf, cursorY, [
    { label: 'Current age', value: `${result.currentAge} years` },
    { label: 'SIP corpus at retirement', value: fmt(result.corpus) },
    { label: 'Investment period', value: `${result.investmentYears} years` },
  ]);
  cursorY = addChartImage(pdf, cursorY, sipChartCanvas);
  cursorY = addTableSection(
    pdf,
    cursorY,
    'SIP year-wise projection',
    ['Year', 'Age', 'Monthly SIP', 'Corpus at year end', 'Inflation adjusted'],
    sipRows,
  );

  pdf.addPage();
  cursorY = addSectionTitle(pdf, 20, 'SWP corpus balance', 'Projection based on the entered calculator values');
  cursorY = addStatsRow(pdf, cursorY, [
    { label: 'SWP starting corpus', value: fmt(result.swpCorpus) },
    { label: 'Total withdrawal', value: fmt(result.totalWithdrawal) },
  ]);
  cursorY = addChartImage(pdf, cursorY, swpChartCanvas);
  addTableSection(
    pdf,
    cursorY,
    'SWP year-wise projection',
    ['Year', 'Opening corpus', 'Monthly SWP', 'Corpus at year end', 'Inflation adjusted'],
    swpRows,
  );

  finalizePdf(pdf, 'SIP & SWP Calculator by Ashva Finserv', slugifyFileName(client.clientName), 'sip-swp-financial-plan');
}
