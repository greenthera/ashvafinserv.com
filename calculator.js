const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const value = (id) => Math.max(0, Number(document.getElementById(id).value) || 0);
const setText = (id, text) => (document.getElementById(id).textContent = text);

function futureValue(rate, periods, payment, presentValue = 0, due = 1) {
  if (!rate) return -(presentValue + payment * periods);

  return -(
    presentValue * (1 + rate) ** periods +
    (payment * (1 + rate * due) * ((1 + rate) ** periods - 1)) / rate
  );
}

function getAge(dateOfBirth, todayDate) {
  if (!dateOfBirth || !todayDate) return 0;

  const today = new Date(todayDate);
  const birthDate = new Date(dateOfBirth);
  let years = today.getFullYear() - birthDate.getFullYear();

  if (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
    years -= 1;
  }

  return years;
}

function drawLineChart(canvasId, values, color, pointsPerYear = 1) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !values.length) return;

  const yearLabel = (index) => `Year ${Math.max(1, Math.ceil((index + 1) / pointsPerYear))}`;

  const context = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.scale(ratio, ratio);
  context.clearRect(0, 0, width, height);

  const padding = { top: 24, right: 18, bottom: 30, left: 94 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const maximum = Math.max(...values, 1);
  const minimum = Math.min(...values, 0);
  const range = maximum - minimum || 1;
  const point = (amount, index) => ({
    x: padding.left + (index / Math.max(values.length - 1, 1)) * plotWidth,
    y: padding.top + plotHeight - ((amount - minimum) / range) * plotHeight,
  });
  const graphValue = (amount) => money.format(Math.round(amount));

  context.strokeStyle = "#dce8f2";
  context.lineWidth = 1;
  context.font = "9px Inter, system-ui, sans-serif";
  context.fillStyle = "#6e7f91";
  context.textAlign = "right";
  context.textBaseline = "middle";
  for (let line = 0; line < 4; line += 1) {
    const y = padding.top + (plotHeight / 3) * line;
    const lineValue = maximum - (range / 3) * line;
    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(width - padding.right, y);
    context.stroke();
    context.fillText(graphValue(lineValue), padding.left - 7, y);
  }

  const points = values.map(point);
  const fill = context.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  fill.addColorStop(0, `${color}33`);
  fill.addColorStop(1, `${color}00`);
  context.beginPath();
  context.moveTo(points[0].x, height - padding.bottom);
  points.forEach(({ x, y }) => context.lineTo(x, y));
  context.lineTo(points.at(-1).x, height - padding.bottom);
  context.closePath();
  context.fillStyle = fill;
  context.fill();

  context.beginPath();
  points.forEach(({ x, y }, index) => (index ? context.lineTo(x, y) : context.moveTo(x, y)));
  context.strokeStyle = color;
  context.lineWidth = 2.5;
  context.stroke();
  context.fillStyle = color;
  [points[0], points.at(-1)].forEach(({ x, y }) => {
    context.beginPath();
    context.arc(x, y, 3.5, 0, Math.PI * 2);
    context.fill();
  });

  context.font = "10px Inter, system-ui, sans-serif";
  context.fillStyle = "#52677b";
  context.textBaseline = "middle";
  context.textAlign = "left";
  context.fillText(yearLabel(0), padding.left, height - 9);
  context.textAlign = "center";
  context.fillText(yearLabel(Math.floor(values.length / 2)), width / 2, height - 9);
  context.textAlign = "right";
  context.fillText(yearLabel(values.length - 1), width - padding.right, height - 9);
  context.fillStyle = color;
  context.font = "bold 10px Inter, system-ui, sans-serif";
  context.textAlign = "left";
  context.fillText(graphValue(values[0]), points[0].x + 6, Math.max(13, points[0].y - 10));
  const middlePoint = points[Math.floor(points.length / 2)];
  context.textAlign = "center";
  context.fillText(
    graphValue(values[Math.floor(values.length / 2)]),
    middlePoint.x,
    Math.max(13, middlePoint.y - 10),
  );
  context.textAlign = "right";
  context.fillText(graphValue(values.at(-1)), points.at(-1).x - 6, Math.max(13, points.at(-1).y - 10));
  context.textAlign = "left";
}

function renderPlanner() {
  const monthlySip = value("monthlySip");
  const sipIncrease = value("sipIncrease") / 100;
  const sipReturn = value("sipRoi") / 100;
  const inflation = value("inflation") / 100;
  const currentAge = getAge(
    document.getElementById("dob").value,
    document.getElementById("today").value,
  );
  const retirementAge = value("retirement");
  const investmentYears = Math.min(60, Math.max(0, retirementAge - currentAge));

  const monthlySipRate = (1 + sipReturn) ** (1 / 12) - 1;
  const monthlyRealRate = ((1 + sipReturn) / (1 + inflation)) ** (1 / 12) - 1;
  let totalInvested = 0;
  let corpus = 0;
  let inflationAdjustedCorpus = 0;
  let sipRows = "";
  const sipPoints = [];

  for (let year = 1; year <= investmentYears; year += 1) {
    const monthlyInvestment = monthlySip * (1 + sipIncrease) ** (year - 1);
    totalInvested += monthlyInvestment * 12;
    corpus = futureValue(monthlySipRate, 12, -monthlyInvestment, -corpus);
    inflationAdjustedCorpus = futureValue(
      monthlyRealRate,
      12,
      -monthlyInvestment,
      -inflationAdjustedCorpus,
    );
    sipPoints.push(corpus);

    sipRows += `<tr>
      <td>${year}</td>
      <td>${currentAge + year}</td>
      <td>${money.format(monthlyInvestment)}</td>
      <td>${money.format(corpus)}</td>
      <td>${money.format(inflationAdjustedCorpus)}</td>
    </tr>`;
  }

  setText("currentAge", `${currentAge} years`);
  setText("investYears", `${investmentYears} years`);
  setText("totalInvested", money.format(totalInvested));
  setText("futureValue", money.format(corpus));
  document.querySelector("#sipProjection tbody").innerHTML =
    sipRows ||
    '<tr><td colspan="5" class="empty">Enter DOB, today’s date and retirement age.</td></tr>';
  drawLineChart("sipChart", sipPoints, "#1677ff");

  renderSwp(corpus, inflation);
}

function renderSwp(startingCorpus, inflation) {
  const startingWithdrawal = value("swpAmount");
  const withdrawalIncrease = value("swpIncrease") / 100;
  const swpReturn = value("swpRoi") / 100;
  const monthlySwpRate = (1 + swpReturn) ** (1 / 12) - 1;
  const monthlyRealRate = ((1 + swpReturn) / (1 + inflation)) ** (1 / 12) - 1;
  let balance = startingCorpus;
  let totalWithdrawal = 0;
  let swpRows = "";
  const swpPoints = [];

  for (let year = 1; year <= 35 && balance > 0; year += 1) {
    const monthlyWithdrawal = startingWithdrawal * (1 + withdrawalIncrease) ** (year - 1);
    const openingCorpus = balance;
    const closingCorpus = futureValue(monthlySwpRate, 12, monthlyWithdrawal, -balance);

    totalWithdrawal += Math.min(monthlyWithdrawal * 12, openingCorpus);
    balance = Math.max(0, closingCorpus);
    swpPoints.push(balance);

    swpRows += `<tr>
      <td>${year}</td>
      <td>${money.format(openingCorpus)}</td>
      <td>${money.format(monthlyWithdrawal)}</td>
      <td>${money.format(balance)}</td>
      <td>${money.format(futureValue(monthlyRealRate, 12, monthlyWithdrawal, -openingCorpus))}</td>
    </tr>`;
  }

  setText("swpCorpus", money.format(startingCorpus));
  setText("totalWithdrawal", money.format(totalWithdrawal));
  document.querySelector("#swpProjection tbody").innerHTML =
    swpRows ||
    '<tr><td colspan="5" class="empty">Your SIP corpus will appear here.</td></tr>';
  drawLineChart("swpChart", swpPoints, "#10a879");
}

function renderLoan() {
  const loanAmount = value("loanAmount");
  const annualRate = value("loanRate") / 100;
  const tenureMonths = Math.floor(value("loanYears") * 12);
  const monthlyRate = annualRate / 12;
  const emi = tenureMonths
    ? monthlyRate
      ? (loanAmount * monthlyRate * (1 + monthlyRate) ** tenureMonths) /
        ((1 + monthlyRate) ** tenureMonths - 1)
      : loanAmount / tenureMonths
    : 0;

  let balance = loanAmount;
  let totalInterest = 0;
  let loanRows = "";
  const loanPoints = [];

  for (let month = 1; month <= tenureMonths; month += 1) {
    const interest = balance * monthlyRate;
    const principal = Math.min(balance, emi - interest);
    const payment = Math.min(emi, balance + interest);
    balance = Math.max(0, balance - principal);
    totalInterest += interest;
    loanPoints.push(balance);

    loanRows += `<tr>
      <td>${month}</td>
      <td>${money.format(payment)}</td>
      <td>${money.format(interest)}</td>
      <td>${money.format(principal)}</td>
      <td>${money.format(balance)}</td>
    </tr>`;
  }

  setText("loanMonths", `${tenureMonths} months`);
  const monthsInput = document.getElementById("loanMonthsInput");
  if (monthsInput) monthsInput.value = tenureMonths;

  setText("emi", money.format(emi));
  setText("loanInterest", money.format(totalInterest));
  setText("loanTotal", money.format(loanAmount + totalInterest));
  document.querySelector("#loanProjection tbody").innerHTML =
    loanRows || '<tr><td colspan="5" class="empty">Enter a loan tenure.</td></tr>';
  drawLineChart("loanChart", loanPoints, "#f59f00", 12);
}

const pdfAmount = (text) => String(text).replaceAll("₹", "Rs. ").replaceAll("•", "|");

function slugifyFileName(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDateTime(datetimeLocalValue) {
  if (!datetimeLocalValue) return "";

  return new Date(datetimeLocalValue).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function tableData(id) {
  return [...document.querySelectorAll(`#${id} tr`)].map((row) =>
    [...row.cells].map((cell) => pdfAmount(cell.textContent.trim())),
  );
}

const pdfBrand = {
  teal: [27, 107, 42],
  accent: [200, 169, 81],
  muted: [105, 120, 135],
  ink: [35, 49, 64],
  shivantra: [1, 1, 79],
};

let bannerImagePromise;
function loadBannerImage() {
  if (!bannerImagePromise) {
    bannerImagePromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = "images/ashva-finserv-banner.png";
    });
  }
  return bannerImagePromise;
}

function drawPdfFooter(pdf, pageNumber, totalPages, tagline) {
  const brandName = "Ashva Finserv";
  const taglinePrefix = tagline.slice(0, tagline.length - brandName.length);

  pdf.setDrawColor(220, 230, 229);
  pdf.setLineWidth(0.2);
  pdf.line(15, 286, 195, 286);

  pdf.setFontSize(8);

  // Left: tagline + brand name (width measured at its own normal weight,
  // not the bold weight the brand name switches to right after).
  pdf.setFont(undefined, "normal");
  pdf.setTextColor(...pdfBrand.muted);
  const taglinePrefixWidth = pdf.getTextWidth(taglinePrefix);
  pdf.text(taglinePrefix, 15, 291);
  pdf.setFont(undefined, "bold");
  pdf.setTextColor(...pdfBrand.teal);
  pdf.textWithLink(brandName, 15 + taglinePrefixWidth, 291, {
    url: "https://www.ashvafinserv.com",
  });

  // Center: page number
  pdf.setFont(undefined, "normal");
  pdf.setTextColor(...pdfBrand.muted);
  pdf.text(`Page ${pageNumber} of ${totalPages}`, 105, 291, { align: "center" });

  // Right: "Developed by Shivantra", right-aligned as a unit
  const devPrefix = "Developed by ";
  const devName = "Shivantra";
  pdf.setFont(undefined, "normal");
  const devPrefixWidth = pdf.getTextWidth(devPrefix);
  pdf.setFont(undefined, "bold");
  const devNameWidth = pdf.getTextWidth(devName);
  const devX = 195 - (devPrefixWidth + devNameWidth);

  pdf.setFont(undefined, "normal");
  pdf.setTextColor(...pdfBrand.muted);
  pdf.text(devPrefix, devX, 291);
  pdf.setFont(undefined, "bold");
  pdf.setTextColor(...pdfBrand.shivantra);
  pdf.textWithLink(devName, devX + devPrefixWidth, 291, { url: "https://shivantra.com/" });

  pdf.setFont(undefined, "normal");
}

function ensurePdfSpace(pdf, cursorY, neededHeight, top = 20) {
  if (cursorY + neededHeight > 280) {
    pdf.addPage();
    return top;
  }
  return cursorY;
}

function addPdfStatsRow(pdf, cursorY, stats) {
  cursorY = ensurePdfSpace(pdf, cursorY, 22);

  pdf.autoTable({
    startY: cursorY,
    head: [stats.map((stat) => stat.label)],
    body: [stats.map((stat) => pdfAmount(stat.value))],
    theme: "grid",
    styles: { halign: "center", fontSize: 8, cellPadding: 3, textColor: pdfBrand.ink },
    headStyles: {
      fillColor: [244, 248, 247],
      textColor: pdfBrand.muted,
      fontStyle: "normal",
      fontSize: 7,
    },
    bodyStyles: { fontStyle: "bold", fontSize: 11, textColor: pdfBrand.teal },
  });

  return pdf.lastAutoTable.finalY + 10;
}

function addPdfSectionTitle(pdf, cursorY, title, subtitle) {
  cursorY = ensurePdfSpace(pdf, cursorY, 14);

  pdf.setTextColor(...pdfBrand.teal);
  pdf.setFontSize(14);
  pdf.text(title, 15, cursorY);
  cursorY += 5;
  pdf.setFontSize(8.5);
  pdf.setTextColor(...pdfBrand.muted);
  pdf.text(subtitle, 15, cursorY);

  return cursorY + 8;
}

function addPdfChartImage(pdf, cursorY, canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return cursorY;

  const imgWidth = 180;
  const aspect = canvas.clientHeight / canvas.clientWidth;
  const imgHeight = imgWidth * aspect;

  cursorY = ensurePdfSpace(pdf, cursorY, imgHeight);
  pdf.addImage(canvas.toDataURL("image/png"), "PNG", 15, cursorY, imgWidth, imgHeight);

  return cursorY + imgHeight + 10;
}

function addPdfTableSection(pdf, cursorY, title, tableId) {
  cursorY = ensurePdfSpace(pdf, cursorY, 24);

  pdf.setTextColor(...pdfBrand.teal);
  pdf.setFontSize(14);
  pdf.text(title, 15, cursorY);
  cursorY += 6;

  const rows = tableData(tableId);
  pdf.autoTable({
    startY: cursorY,
    head: [rows[0]],
    body: rows.slice(1),
    theme: "striped",
    styles: { fontSize: 7.5 },
    headStyles: { fillColor: pdfBrand.teal, fontSize: 8.5 },
    margin: { left: 10, right: 10 },
  });

  return pdf.lastAutoTable.finalY + 10;
}

function installBasicPdfTable(pdf) {
  if (typeof pdf.autoTable === "function") return;

  pdf.autoTable = ({ startY, head, body, theme, styles = {}, headStyles = {}, bodyStyles = {}, margin }) => {
    const left = margin?.left ?? 15;
    const right = margin?.right ?? 15;
    const columns = head[0].length;
    const columnWidth = (210 - left - right) / columns;
    const pad = styles.cellPadding ?? 3;
    const align = styles.halign ?? "left";
    const headFontSize = headStyles.fontSize ?? styles.fontSize ?? 9;
    const bodyFontSize = bodyStyles.fontSize ?? styles.fontSize ?? 8;
    const headRowHeight = Math.max(7, headFontSize + 3);
    const bodyRowHeight = Math.max(7, bodyFontSize + 3);
    const bordered = theme !== "striped";
    let y = startY;
    let stripe = 0;

    const cellX = (x, cellAlign) => {
      if (cellAlign === "center") return x + columnWidth / 2;
      if (cellAlign === "right") return x + columnWidth - pad;
      return x + pad;
    };

    const drawRow = (cells, isHeader) => {
      const rowHeight = isHeader ? headRowHeight : bodyRowHeight;

      if (y + rowHeight > 280) {
        pdf.addPage();
        y = 20;
        if (!isHeader) drawRow(head[0], true);
      }

      const fill = isHeader
        ? headStyles.fillColor || pdfBrand.teal
        : theme === "striped" && stripe % 2 === 1
          ? [244, 248, 247]
          : [255, 255, 255];
      const textColor = isHeader
        ? headStyles.textColor || [255, 255, 255]
        : bodyStyles.textColor || styles.textColor || pdfBrand.ink;
      const fontSize = isHeader ? headFontSize : bodyFontSize;
      const fontStyle = isHeader ? headStyles.fontStyle ?? "bold" : bodyStyles.fontStyle ?? styles.fontStyle ?? "normal";
      // Column titles always sit centered in their box; body cells follow the requested alignment.
      const cellAlign = isHeader ? "center" : align;
      const textY = isHeader ? y + rowHeight / 2 + fontSize * 0.12 : y + rowHeight - pad;

      cells.forEach((cell, index) => {
        const x = left + index * columnWidth;
        pdf.setDrawColor(220, 230, 239);
        pdf.setFillColor(...fill);
        pdf.rect(x, y, columnWidth, rowHeight, bordered ? "FD" : "F");
        pdf.setFont(undefined, fontStyle);
        pdf.setFontSize(fontSize);
        pdf.setTextColor(...textColor);
        pdf.text(String(cell), cellX(x, cellAlign), textY, {
          maxWidth: columnWidth - pad * 2,
          align: cellAlign,
        });
      });
      pdf.setFont(undefined, "normal");
      y += rowHeight;
    };

    drawRow(head[0], true);
    body.forEach((row) => {
      drawRow(row, false);
      stripe += 1;
    });
    pdf.lastAutoTable = { finalY: y };
  };
}

function loadPdfLibrary() {
  if (window.jspdf) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function downloadPdfReport(kind) {
  if (!window.jspdf) {
    try {
      await loadPdfLibrary();
    } catch {
      alert("Unable to load the PDF library. Please check your internet connection and try again.");
      return;
    }
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  installBasicPdfTable(pdf);
  const isLoan = kind === "loan";

  const clientName = document.getElementById("clientName")?.value.trim();
  const clientPhone = document.getElementById("clientPhone")?.value.trim();
  const clientEmail = document.getElementById("clientEmail")?.value.trim();

  let bannerImage = null;
  try {
    bannerImage = await loadBannerImage();
  } catch {
    bannerImage = null;
  }

  let cursorY = 16;
  if (bannerImage) {
    const bannerHeight = 210 * (bannerImage.height / bannerImage.width);
    pdf.addImage(bannerImage, "PNG", 0, 0, 210, bannerHeight);
    cursorY = bannerHeight + 10;
  }

  pdf.setTextColor(...pdfBrand.teal);
  pdf.setFontSize(17);
  pdf.text(isLoan ? "Loan Repayment Report" : "SIP & SWP Financial Plan", 15, cursorY);
  cursorY += 6;
  pdf.setFontSize(9);
  pdf.setTextColor(...pdfBrand.muted);
  pdf.text(`Prepared on: ${new Date().toLocaleDateString("en-IN")}`, 15, cursorY);
  cursorY += 10;

  if (clientName || clientPhone || clientEmail) {
    const boxTop = cursorY;
    const boxHeight = 18;
    pdf.setFillColor(244, 248, 247);
    pdf.setDrawColor(...pdfBrand.teal);
    pdf.roundedRect(15, boxTop, 180, boxHeight, 3, 3, "FD");

    const cx = 15 + 11;
    const cy = boxTop + boxHeight / 2;
    pdf.setFillColor(...pdfBrand.teal);
    pdf.circle(cx, cy, 7, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.text((clientName || clientPhone || clientEmail).charAt(0).toUpperCase(), cx, cy + 1.2, {
      align: "center",
    });

    pdf.setTextColor(...pdfBrand.ink);
    pdf.setFontSize(11);
    pdf.text(clientName || "Client", 39, boxTop + 7.5);
    const contactLine = [clientPhone, clientEmail].filter(Boolean).join("   •   ");
    if (contactLine) {
      pdf.setFontSize(8.5);
      pdf.setTextColor(...pdfBrand.muted);
      pdf.text(contactLine, 39, boxTop + 13.5);
    }

    cursorY = boxTop + boxHeight + 10;
  }

  const summary = isLoan
    ? [
        ["EMI", pdfAmount(document.getElementById("emi").textContent)],
        ["Total interest", pdfAmount(document.getElementById("loanInterest").textContent)],
        ["Total payable", pdfAmount(document.getElementById("loanTotal").textContent)],
      ]
    : [
        ["SIP corpus at retirement", pdfAmount(document.getElementById("futureValue").textContent)],
        ["Total SIP invested", pdfAmount(document.getElementById("totalInvested").textContent)],
        ["SWP total withdrawal", pdfAmount(document.getElementById("totalWithdrawal").textContent)],
      ];

  pdf.autoTable({
    startY: cursorY,
    head: [["Key projection", "Amount"]],
    body: summary,
    theme: "striped",
    styles: { fontSize: 9 },
    headStyles: { fillColor: pdfBrand.teal },
  });
  cursorY = pdf.lastAutoTable.finalY + 8;

  if (isLoan) {
    cursorY = addPdfSectionTitle(
      pdf,
      cursorY + 6,
      "Outstanding loan balance",
      "Projection based on the entered calculator values",
    );
    cursorY = addPdfStatsRow(pdf, cursorY, [
      { label: "Tenure (months)", value: document.getElementById("loanMonths").textContent },
      { label: "EMI", value: document.getElementById("emi").textContent },
      { label: "Total interest", value: document.getElementById("loanInterest").textContent },
    ]);
    cursorY = addPdfChartImage(pdf, cursorY, "loanChart");
    cursorY = addPdfTableSection(pdf, cursorY, "Monthly repayment schedule", "loanProjection");
  } else {
    cursorY = addPdfSectionTitle(
      pdf,
      cursorY + 6,
      "SIP corpus growth",
      "Projection based on the entered calculator values",
    );
    cursorY = addPdfStatsRow(pdf, cursorY, [
      { label: "Current age", value: document.getElementById("currentAge").textContent },
      { label: "SIP corpus at retirement", value: document.getElementById("futureValue").textContent },
      { label: "Investment period", value: document.getElementById("investYears").textContent },
    ]);
    cursorY = addPdfChartImage(pdf, cursorY, "sipChart");
    cursorY = addPdfTableSection(pdf, cursorY, "SIP year-wise projection", "sipProjection");

    pdf.addPage();
    cursorY = addPdfSectionTitle(
      pdf,
      20,
      "SWP corpus balance",
      "Projection based on the entered calculator values",
    );
    cursorY = addPdfStatsRow(pdf, cursorY, [
      { label: "SWP starting corpus", value: document.getElementById("swpCorpus").textContent },
      { label: "Total withdrawal", value: document.getElementById("totalWithdrawal").textContent },
    ]);
    cursorY = addPdfChartImage(pdf, cursorY, "swpChart");
    cursorY = addPdfTableSection(pdf, cursorY, "SWP year-wise projection", "swpProjection");
  }

  const tagline = isLoan
    ? "Amortization Calculator by Ashva Finserv"
    : "SIP & SWP Calculator by Ashva Finserv";
  const totalPages = pdf.internal.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    pdf.setPage(page);
    drawPdfFooter(pdf, page, totalPages, tagline);
  }

  const baseName = isLoan ? "loan-repayment-report" : "sip-swp-financial-plan";
  const namePrefix = slugifyFileName(clientName || "");
  pdf.save(`${namePrefix ? `${namePrefix}-` : ""}${baseName}.pdf`);
}

function setMeta(id, value) {
  const el = document.getElementById(id);
  el.style.display = value ? "inline-flex" : "none";
  el.querySelector(".meta-text").textContent = value;
}

function renderProfile() {
  const bar = document.getElementById("profileBar");
  if (!bar) return;

  const name = document.getElementById("clientName").value.trim();
  const phone = document.getElementById("clientPhone").value.trim();
  const email = document.getElementById("clientEmail").value.trim();

  bar.hidden = !name && !phone && !email;
  setText("profileAvatar", (name || phone || email || "?").trim().charAt(0).toUpperCase());
  setText("profileName", name || "Welcome");
  setMeta("profilePhone", phone);
  setMeta("profileEmail", email);
}

const render = window.mode === "loan" ? renderLoan : renderPlanner;

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", render);
});

document.querySelectorAll('input[type="number"]').forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (["e", "E", "+", "-"].includes(event.key)) event.preventDefault();
  });
});

["clientName", "clientPhone", "clientEmail"].forEach((id) => {
  document.getElementById(id)?.addEventListener("input", renderProfile);
});

document.querySelector("[data-pdf]")?.addEventListener("click", (event) => {
  downloadPdfReport(event.currentTarget.dataset.pdf);
});

render();
renderProfile();
