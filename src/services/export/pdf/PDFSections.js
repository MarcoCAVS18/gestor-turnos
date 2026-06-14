// src/services/export/pdf/PDFSections.js

import {
  COLORS,
  FONTS,
  LAYOUT,
  addPageHeader,
  addSectionHeader,
  drawKPICard,
  drawComparisonWidget,
  drawTable,
  addPageIfNeeded
} from './PDFStyles';
import i18n from '../../../i18n';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Round to 2 decimal places (currency) */
const r2 = (v) => Math.round((v || 0) * 100) / 100;

/** Round to 1 decimal place (hours, percentages) */
const r1 = (v) => Math.round((v || 0) * 10) / 10;

/** Format currency with 2 decimals */
const fCurrency = (v) => `$${r2(v).toFixed(2)}`;

/** Format hours with 1 decimal */
const fHours = (v) => `${r1(v).toFixed(1)}h`;

/** Convert hex color to jsPDF RGB args */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [31, 78, 121];
};

// ─── Cover Page ───────────────────────────────────────────────────────────────

/**
 * Adds a professional cover page with branding
 */
export const addCoverPage = (doc, logo, metadata) => {
  const centerX = LAYOUT.pageWidth / 2;
  const pageH = LAYOUT.pageHeight;

  // ── Top colored band ──
  doc.setFillColor(...hexToRgb(COLORS.primary));
  doc.rect(0, 0, LAYOUT.pageWidth, 70, 'F');

  // Logo (white version expected) centered in top band
  if (logo && logo.base64) {
    const logoSize = 30;
    doc.addImage(logo.base64, 'PNG', centerX - logoSize / 2, 18, logoSize, logoSize);
  }

  // App name "Orary" centered in band
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(COLORS.white);
  const appNameW = doc.getTextWidth(i18n.t('reports.brand'));
  doc.text(i18n.t('reports.brand'), centerX - appNameW / 2, 57);

  // ── White area below band ──

  // Report title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(COLORS.primary);
  const titleText = i18n.t('reports.activityReport');
  const titleW = doc.getTextWidth(titleText);
  doc.text(titleText, centerX - titleW / 2, 100);

  // Accent underline
  doc.setFillColor(...hexToRgb(COLORS.accent));
  doc.rect(centerX - 20, 104, 40, 1.5, 'F');

  // Date range
  const startDate = metadata.dateRange.start.toLocaleDateString(i18n.language || 'en', { month: 'long', year: 'numeric' });
  const endDate = metadata.dateRange.end.toLocaleDateString(i18n.language || 'en', { month: 'long', year: 'numeric' });
  const dateText = startDate === endDate ? startDate : `${startDate} – ${endDate}`;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(COLORS.gray);
  const dateW = doc.getTextWidth(dateText);
  doc.text(dateText, centerX - dateW / 2, 116);

  // ── Divider ──
  doc.setDrawColor('#E5E7EB');
  doc.setLineWidth(0.4);
  doc.line(LAYOUT.margin.left + 20, 130, LAYOUT.pageWidth - LAYOUT.margin.right - 20, 130);

  // ── Stats row ──
  const statsY = 148;
  const statCols = [
    { label: i18n.t('reports.kpi.totalShifts'), value: String(metadata.totalShiftsCount || 0) },
    { label: i18n.t('reports.kpi.totalWorks'), value: String(metadata.totalWorksCount || 0) },
    { label: i18n.t('reports.reportPeriod'), value: dateText.length > 25 ? startDate : dateText }
  ];
  const colW = LAYOUT.contentWidth / statCols.length;

  statCols.forEach((stat, i) => {
    const colX = LAYOUT.margin.left + colW * i + colW / 2;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(COLORS.primary);
    const valW = doc.getTextWidth(stat.value);
    doc.text(stat.value, colX - valW / 2, statsY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(FONTS.small.size);
    doc.setTextColor(COLORS.gray);
    const labelW = doc.getTextWidth(stat.label);
    doc.text(stat.label, colX - labelW / 2, statsY + 8);
  });

  // ── Bottom section ──
  const bottomY = pageH - 45;
  doc.setFillColor(247, 250, 252);
  doc.rect(0, bottomY, LAYOUT.pageWidth, 45, 'F');

  // Generation info
  const genDate = metadata.generatedAt.toLocaleDateString(i18n.language || 'en', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
  const genText = i18n.t('reports.generatedOn', { date: genDate });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONTS.body.size);
  doc.setTextColor(COLORS.lightGray);
  const genW = doc.getTextWidth(genText);
  doc.text(genText, centerX - genW / 2, bottomY + 14);

  // App URL
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONTS.body.size);
  doc.setTextColor(COLORS.primary);
  const urlText = i18n.t('reports.appUrl');
  const urlW = doc.getTextWidth(urlText);
  doc.text(urlText, centerX - urlW / 2, bottomY + 24);

  doc.setTextColor(COLORS.darkGray);
};

// ─── Executive Summary ────────────────────────────────────────────────────────

/**
 * Adds the executive summary page
 */
export const addExecutiveSummary = (doc, logo, reportData) => {
  let y = addPageHeader(doc, logo, i18n.t('reports.sections.executiveSummary'));
  y += 4;

  const { executive, weeklyStats, projections } = reportData;
  const x = LAYOUT.margin.left;

  // ── Key Metrics ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONTS.heading3.size);
  doc.setTextColor(COLORS.darkGray);
  doc.text(i18n.t('reports.keyMetrics'), x, y);
  y += 7;

  const cardSpacing = LAYOUT.kpiCard.spacing;
  const cardWidth = LAYOUT.kpiCard.width;

  drawKPICard(doc, x, y, i18n.t('reports.kpi.totalEarned'), fCurrency(executive.totalEarned), COLORS.primary);
  drawKPICard(doc, x + cardWidth + cardSpacing, y, i18n.t('reports.kpi.hoursWorked'), fHours(executive.totalHours), COLORS.secondary);
  drawKPICard(doc, x + (cardWidth + cardSpacing) * 2, y, i18n.t('reports.kpi.totalShifts'), String(executive.totalShifts), COLORS.primary);
  drawKPICard(doc, x + (cardWidth + cardSpacing) * 3, y, i18n.t('reports.kpi.avgPerHourLong'), fCurrency(executive.averagePerHour), COLORS.secondary);

  y += LAYOUT.kpiCard.height + 12;

  // ── This Week ──
  y = addSectionHeader(doc, i18n.t('reports.sections.thisWeek'), y, COLORS.primary);

  const current = weeklyStats.current;

  drawComparisonWidget(doc, x, y, {
    label: i18n.t('reports.table.earnings'),
    current: current.earnings,
    previous: weeklyStats.previous.earnings,
    format: 'currency'
  }, COLORS.primary);

  drawComparisonWidget(doc, x + 52, y, {
    label: i18n.t('reports.table.hours'),
    current: current.hours,
    previous: weeklyStats.previous.hours,
    format: 'hours'
  }, COLORS.secondary);

  drawComparisonWidget(doc, x + 104, y, {
    label: i18n.t('reports.table.shifts'),
    current: current.shifts,
    previous: weeklyStats.previous.shifts,
    format: 'number'
  }, COLORS.primary);

  y += 28;

  // Most productive day
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONTS.body.size);
  doc.setTextColor(COLORS.gray);
  doc.text(`${i18n.t('reports.kpi.mostProductiveDay')}:`, x, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.darkGray);
  const mpDay = current.mostProductiveDay;
  doc.text(
    `${mpDay?.day || i18n.t('reports.naValue')}  (${fCurrency(mpDay?.earnings || 0)})`,
    x + 38,
    y
  );

  y += 10;

  // ── Monthly Projection ──
  y = addPageIfNeeded(doc, y, 35);
  y = addSectionHeader(doc, i18n.t('reports.sections.monthlyProjection'), y, COLORS.secondary);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONTS.body.size);
  doc.setTextColor(COLORS.gray);
  doc.text(`${i18n.t('reports.projectionNote')}:`, x, y);
  y += 7;

  drawKPICard(doc, x, y, i18n.t('reports.kpi.projectedMonthly'), fCurrency(projections.monthlyProjection), COLORS.primary);
  drawKPICard(doc, x + cardWidth + cardSpacing, y, i18n.t('reports.kpi.weeklyAverage'), fCurrency(projections.weeklyAverage), COLORS.secondary);
  drawKPICard(doc, x + (cardWidth + cardSpacing) * 2, y, i18n.t('reports.kpi.hourlyRate'), fCurrency(projections.hourlyProjection), COLORS.primary);

  y += LAYOUT.kpiCard.height + 5;

  doc.setTextColor(COLORS.darkGray);
  return y;
};

// ─── Analytics Page ───────────────────────────────────────────────────────────

/**
 * Adds the analytics page with chart images
 */
export const addAnalyticsPage = (doc, logo, charts) => {
  let y = addPageHeader(doc, logo, i18n.t('reports.sections.analyticsCharts'));
  y += 4;

  const x = LAYOUT.margin.left;
  const chartWidth = 83;
  const chartHeight = 52;
  const spacing = 8;

  // Row 1: Weekly Evolution + Work Distribution
  if (charts.weeklyEvolution) {
    doc.addImage(charts.weeklyEvolution.base64, 'PNG', x, y, chartWidth, chartHeight);
  }
  if (charts.workDistribution) {
    doc.addImage(charts.workDistribution.base64, 'PNG', x + chartWidth + spacing, y, chartWidth, chartHeight);
  }
  y += chartHeight + spacing;

  // Row 2: Daily Earnings + Shift Types
  y = addPageIfNeeded(doc, y, chartHeight + 10);
  if (charts.dailyEarnings) {
    doc.addImage(charts.dailyEarnings.base64, 'PNG', x, y, chartWidth, chartHeight);
  }
  if (charts.shiftTypeDistribution) {
    doc.addImage(charts.shiftTypeDistribution.base64, 'PNG', x + chartWidth + spacing, y, chartWidth, chartHeight);
  }
  y += chartHeight + spacing;

  // Row 3: Monthly Trend (full width)
  y = addPageIfNeeded(doc, y, chartHeight + 10);
  if (charts.monthlyTrend) {
    const wideWidth = chartWidth * 2 + spacing;
    doc.addImage(charts.monthlyTrend.base64, 'PNG', x, y, wideWidth, chartHeight);
    y += chartHeight + 5;
  }

  return y;
};

// ─── Work Details Page ────────────────────────────────────────────────────────

/**
 * Adds the earnings by work page
 */
export const addWorkDetailsPage = (doc, logo, reportData) => {
  let y = addPageHeader(doc, logo, i18n.t('reports.sections.earningsByWork'));
  y += 4;

  const { byWork, byShiftType } = reportData;

  // Top Works table
  y = addSectionHeader(doc, i18n.t('reports.sections.topWorks'), y, COLORS.primary);

  const workHeaders = [i18n.t('reports.table.workName'), i18n.t('reports.table.earnings'), i18n.t('reports.table.hours'), i18n.t('reports.table.shifts'), i18n.t('reports.kpi.avgPerHr')];
  const workData = byWork.slice(0, 10).map(w => [
    w.name.substring(0, 22),
    fCurrency(w.earnings),
    fHours(w.hours),
    String(w.shifts),
    fCurrency(w.averagePerHour)
  ]);
  const workWidths = [62, 32, 22, 20, 32];

  y = drawTable(doc, LAYOUT.margin.left, y, workHeaders, workData, workWidths);
  y += 8;

  // Shift Type Breakdown
  y = addPageIfNeeded(doc, y, 40);
  y = addSectionHeader(doc, i18n.t('reports.sections.shiftTypeBreakdown'), y, COLORS.secondary);

  const typeHeaders = [i18n.t('reports.table.type'), i18n.t('reports.table.shifts'), i18n.t('reports.table.hours'), i18n.t('reports.table.earnings'), i18n.t('reports.kpi.avgPerHr'), '%'];
  const typeData = byShiftType.map(t => [
    t.name,
    String(t.shifts),
    fHours(t.hours),
    fCurrency(t.earnings),
    fCurrency(t.averagePerHour),
    `${r1(t.percentage).toFixed(1)}%`
  ]);
  const typeWidths = [36, 20, 22, 36, 32, 22];

  y = drawTable(doc, LAYOUT.margin.left, y, typeHeaders, typeData, typeWidths);

  return y;
};

// ─── Delivery Page ────────────────────────────────────────────────────────────

/**
 * Adds the delivery statistics page
 */
export const addDeliveryPage = (doc, logo, reportData, charts) => {
  const { delivery } = reportData;

  if (!delivery || !delivery.enabled) {
    return LAYOUT.margin.top;
  }

  let y = addPageHeader(doc, logo, i18n.t('reports.sections.deliveryPerformance'));
  y += 4;

  const x = LAYOUT.margin.left;
  const cardSpacing = LAYOUT.kpiCard.spacing;
  const cardWidth = LAYOUT.kpiCard.width;

  // KPI Row 1
  y = addSectionHeader(doc, i18n.t('reports.sections.summary'), y, COLORS.primary);

  drawKPICard(doc, x, y, i18n.t('reports.kpi.totalEarned'), fCurrency(delivery.totalEarned), COLORS.primary);
  drawKPICard(doc, x + cardWidth + cardSpacing, y, i18n.t('reports.kpi.netEarnings'), fCurrency(delivery.netEarnings), COLORS.secondary);
  drawKPICard(doc, x + (cardWidth + cardSpacing) * 2, y, i18n.t('reports.kpi.totalOrders'), String(delivery.totalOrders), COLORS.primary);
  drawKPICard(doc, x + (cardWidth + cardSpacing) * 3, y, i18n.t('reports.kpi.totalTips'), fCurrency(delivery.totalTips), COLORS.secondary);

  y += LAYOUT.kpiCard.height + 8;

  // KPI Row 2
  drawKPICard(doc, x, y, i18n.t('reports.kpi.totalKm'), `${Math.round(delivery.totalKilometers)} km`, COLORS.secondary);
  drawKPICard(doc, x + cardWidth + cardSpacing, y, i18n.t('reports.kpi.fuelExpense'), fCurrency(delivery.totalExpenses), COLORS.secondary);
  drawKPICard(doc, x + (cardWidth + cardSpacing) * 2, y, i18n.t('reports.kpi.avgPerOrder'), fCurrency(delivery.averagePerOrder), COLORS.primary);
  drawKPICard(doc, x + (cardWidth + cardSpacing) * 3, y, i18n.t('reports.kpi.avgPerHour'), fCurrency(delivery.averagePerHour), COLORS.primary);

  y += LAYOUT.kpiCard.height + 8;

  // KPI Row 3 — estimated tax deduction (only when a country mileage rate applied)
  if (delivery.mileageDeduction > 0) {
    drawKPICard(doc, x, y, i18n.t('stats.deliverySummary.mileageDeduction'), fCurrency(delivery.mileageDeduction), COLORS.secondary);
    y += LAYOUT.kpiCard.height + 8;
  }

  y += 6;

  // Platform chart
  if (charts && charts.platformComparison) {
    y = addPageIfNeeded(doc, y, 60);
    y = addSectionHeader(doc, i18n.t('reports.sections.platformComparison'), y, COLORS.secondary);
    const chartWidth = LAYOUT.contentWidth;
    const chartHeight = 44;
    doc.addImage(charts.platformComparison.base64, 'PNG', x, y, chartWidth, chartHeight);
    y += chartHeight + 8;
  }

  // Platform details table
  y = addPageIfNeeded(doc, y, 40);
  y = addSectionHeader(doc, i18n.t('reports.sections.byPlatform'), y, COLORS.primary);

  const platformHeaders = [i18n.t('reports.table.platform'), i18n.t('reports.table.earnings'), i18n.t('reports.table.orders'), i18n.t('reports.table.tips'), i18n.t('reports.table.hours'), i18n.t('reports.kpi.avgPerHr')];
  const platformData = (delivery.byPlatform || []).slice(0, 5).map(p => [
    p.name.substring(0, 16),
    fCurrency(p.earnings),
    String(p.orders),
    fCurrency(p.tips),
    fHours(p.hours),
    fCurrency(p.averagePerHour)
  ]);
  const platformWidths = [40, 28, 20, 28, 22, 30];

  y = drawTable(doc, x, y, platformHeaders, platformData, platformWidths);

  return y;
};

// ─── Monthly Detail Pages ─────────────────────────────────────────────────────

/**
 * Adds monthly detail pages — one page per month
 */
export const addMonthlyDetailPages = (doc, logo, monthlyData) => {
  monthlyData.forEach((monthData, index) => {
    if (index > 0) {
      doc.addPage();
    }

    let y = addPageHeader(doc, logo, monthData.monthYear.toUpperCase());
    y += 4;

    const { summary, traditionalShifts, deliveryShifts } = monthData;
    const x = LAYOUT.margin.left;

    // ── Month KPI summary ──
    y = addSectionHeader(doc, i18n.t('reports.sections.monthSummary'), y, COLORS.primary);

    const cardSpacing = LAYOUT.kpiCard.spacing;
    const cardWidth = LAYOUT.kpiCard.width;

    drawKPICard(doc, x, y, i18n.t('reports.kpi.totalEarned'), fCurrency(summary.totalEarned), COLORS.primary);
    drawKPICard(doc, x + cardWidth + cardSpacing, y, i18n.t('reports.kpi.netEarnings'), fCurrency(summary.netEarnings), COLORS.secondary);
    drawKPICard(doc, x + (cardWidth + cardSpacing) * 2, y, i18n.t('reports.kpi.totalHours'), fHours(summary.totalHours), COLORS.primary);
    drawKPICard(doc, x + (cardWidth + cardSpacing) * 3, y, i18n.t('reports.kpi.totalShifts'), String(summary.totalShifts), COLORS.secondary);

    y += LAYOUT.kpiCard.height + 8;

    // Additional stats row
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(FONTS.body.size);
    doc.setTextColor(COLORS.gray);

    const statsLine = [
      `${i18n.t('reports.traditional')}: ${summary.traditionalShifts}`,
      `${i18n.t('reports.delivery')}: ${summary.deliveryShifts}`,
      `${i18n.t('reports.kpi.avgPerShift')}: ${fCurrency(summary.averagePerShift)}`,
      `${i18n.t('reports.kpi.avgPerHour')}: ${fCurrency(summary.averagePerHour)}`
    ].join('   ·   ');
    doc.text(statsLine, x, y);

    y += 10;

    // ── Traditional Shifts ──
    if (traditionalShifts && traditionalShifts.length > 0) {
      y = addPageIfNeeded(doc, y, 30);
      y = addSectionHeader(doc, i18n.t('reports.countLabel', { label: i18n.t('reports.sections.traditionalShifts'), count: traditionalShifts.length }), y, COLORS.primary);

      const headers = [i18n.t('reports.table.date'), i18n.t('reports.table.work'), i18n.t('reports.table.hours'), i18n.t('reports.table.earnings'), i18n.t('filters.shiftTypes.day'), i18n.t('reports.shiftTypeAbbr.afternoon'), i18n.t('reports.shiftTypeAbbr.night'), i18n.t('reports.shiftTypeAbbr.saturday'), i18n.t('reports.shiftTypeAbbr.sunday')];
      const data = traditionalShifts.slice(0, 20).map(s => [
        s.date,
        s.workName.substring(0, 18),
        fHours(s.hoursWorked),
        fCurrency(s.earningsWithDiscount),
        fCurrency(s.breakdown.day),
        fCurrency(s.breakdown.afternoon),
        fCurrency(s.breakdown.night),
        fCurrency(s.breakdown.saturday),
        fCurrency(s.breakdown.sunday)
      ]);
      const widths = [26, 42, 16, 22, 16, 16, 16, 12, 12];

      y = drawTable(doc, x, y, headers, data, widths);

      if (traditionalShifts.length > 20) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(FONTS.small.size);
        doc.setTextColor(COLORS.lightGray);
        doc.text(i18n.t('reports.moreShiftsFull', { count: traditionalShifts.length - 20 }), x, y);
        y += 5;
      }
      doc.setTextColor(COLORS.darkGray);
    }

    y += 5;

    // ── Delivery Shifts ──
    if (deliveryShifts && deliveryShifts.length > 0) {
      y = addPageIfNeeded(doc, y, 30);
      y = addSectionHeader(doc, i18n.t('reports.countLabel', { label: i18n.t('reports.sections.deliveryShifts'), count: deliveryShifts.length }), y, COLORS.secondary);

      const headers = [i18n.t('reports.table.date'), i18n.t('reports.table.platform'), i18n.t('reports.table.orders'), i18n.t('reports.table.earnings'), i18n.t('reports.table.tips'), i18n.t('reports.table.net'), i18n.t('reports.table.hours')];
      const data = deliveryShifts.slice(0, 20).map(s => [
        s.date,
        s.platform.substring(0, 14),
        String(s.orderCount),
        fCurrency(s.totalEarnings),
        fCurrency(s.tips),
        fCurrency(s.netEarnings),
        fHours(s.hoursWorked)
      ]);
      const widths = [26, 36, 18, 26, 22, 26, 20];

      y = drawTable(doc, x, y, headers, data, widths);

      if (deliveryShifts.length > 20) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(FONTS.small.size);
        doc.setTextColor(COLORS.lightGray);
        doc.text(i18n.t('reports.moreShifts', { count: deliveryShifts.length - 20 }), x, y);
        doc.setTextColor(COLORS.darkGray);
      }
    }
  });
};

const PDFSectionsModule = {
  addCoverPage,
  addExecutiveSummary,
  addAnalyticsPage,
  addWorkDetailsPage,
  addDeliveryPage,
  addMonthlyDetailPages
};

export default PDFSectionsModule;
