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

/**
 * Adds the cover page
 * @param {jsPDF} doc - jsPDF document instance
 * @param {Object} logo - Logo data
 * @param {Object} metadata - Report metadata
 */
export const addCoverPage = (doc, logo, metadata) => {
  const centerX = LAYOUT.pageWidth / 2;
  const centerY = LAYOUT.pageHeight / 2;

  // Add logo (large, centered)
  if (logo && logo.base64) {
    const logoSize = 60;
    doc.addImage(logo.base64, 'PNG', centerX - logoSize / 2, centerY - 50, logoSize, logoSize);
  }

  // Add title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(COLORS.darkGray);
  const titleText = 'ACTIVITY REPORT';
  const titleWidth = doc.getTextWidth(titleText);
  doc.text(titleText, centerX - titleWidth / 2, centerY + 30);

  // Add date range
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONTS.heading2.size);
  doc.setTextColor(COLORS.gray);
  const startDate = metadata.dateRange.start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const endDate = metadata.dateRange.end.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dateText = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
  const dateWidth = doc.getTextWidth(dateText);
  doc.text(dateText, centerX - dateWidth / 2, centerY + 45);

  // Add generation date
  doc.setFontSize(FONTS.body.size);
  const genText = `Generated on: ${metadata.generatedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  const genWidth = doc.getTextWidth(genText);
  doc.text(genText, centerX - genWidth / 2, centerY + 55);

  // Reset
  doc.setTextColor(COLORS.darkGray);
};

/**
 * Adds the executive summary page
 * @param {jsPDF} doc - jsPDF document instance
 * @param {Object} logo - Logo data
 * @param {Object} reportData - Complete report data
 * @returns {number} Final Y position
 */
export const addExecutiveSummary = (doc, logo, reportData) => {
  let y = addPageHeader(doc, logo, 'EXECUTIVE SUMMARY');
  y += 5;

  const { executive, weeklyStats, projections } = reportData;
  const x = LAYOUT.margin.left;

  // KPI Cards Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONTS.heading3.size);
  doc.text('Key Metrics', x, y);
  y += 8;

  // Row 1: Total Earned, Hours, Shifts, Avg/Hour
  const cardSpacing = LAYOUT.kpiCard.spacing;
  const cardWidth = LAYOUT.kpiCard.width;

  drawKPICard(doc, x, y, 'Total Earned', `$${executive.totalEarned.toFixed(0)}`, COLORS.primary);
  drawKPICard(doc, x + cardWidth + cardSpacing, y, 'Hours Worked', `${executive.totalHours.toFixed(0)}h`, COLORS.secondary);
  drawKPICard(doc, x + (cardWidth + cardSpacing) * 2, y, 'Total Shifts', `${executive.totalShifts}`, COLORS.accent);
  drawKPICard(doc, x + (cardWidth + cardSpacing) * 3, y, 'Avg Per Hour', `$${executive.averagePerHour.toFixed(2)}`, COLORS.primary);

  y += LAYOUT.kpiCard.height + 15;

  // This Week Section
  y = addSectionHeader(doc, 'THIS WEEK', y, COLORS.secondary);

  const current = weeklyStats.current;

  // Comparison widgets
  drawComparisonWidget(doc, x, y, {
    label: 'Earnings',
    current: current.earnings,
    previous: weeklyStats.previous.earnings,
    format: 'currency'
  }, COLORS.primary);

  drawComparisonWidget(doc, x + 50, y, {
    label: 'Hours',
    current: current.hours,
    previous: weeklyStats.previous.hours,
    format: 'hours'
  }, COLORS.secondary);

  drawComparisonWidget(doc, x + 100, y, {
    label: 'Shifts',
    current: current.shifts,
    previous: weeklyStats.previous.shifts,
    format: 'number'
  }, COLORS.accent);

  y += 30;

  // Most Productive Day
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONTS.body.size);
  doc.setTextColor(COLORS.gray);
  doc.text('Most Productive Day:', x, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.darkGray);
  doc.text(`${current.mostProductiveDay?.day || 'N/A'} ($${(current.mostProductiveDay?.earnings || 0).toFixed(2)})`, x + 40, y);

  y += 10;

  // Monthly Projection Section
  y = addPageIfNeeded(doc, y, 30);
  y = addSectionHeader(doc, 'MONTHLY PROJECTION', y, COLORS.accent);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONTS.body.size);
  doc.text('Based on current pace:', x, y);
  y += 8;

  // Projection KPIs
  drawKPICard(doc, x, y, 'Projected Earnings', `$${projections.monthlyProjection.toFixed(0)}`, COLORS.accent);
  drawKPICard(doc, x + cardWidth + cardSpacing, y, 'Weekly Average', `$${projections.weeklyAverage.toFixed(0)}`, COLORS.secondary);

  y += LAYOUT.kpiCard.height + 5;

  return y;
};

/**
 * Adds the analytics page with charts
 * @param {jsPDF} doc - jsPDF document instance
 * @param {Object} logo - Logo data
 * @param {Object} charts - Generated chart images
 * @returns {number} Final Y position
 */
export const addAnalyticsPage = (doc, logo, charts) => {
  let y = addPageHeader(doc, logo, 'ANALYTICS & VISUALIZATIONS');
  y += 5;

  const x = LAYOUT.margin.left;
  const chartWidth = 80;
  const chartHeight = 50;
  const spacing = 5;

  // Row 1: Weekly Evolution + Work Distribution
  if (charts.weeklyEvolution) {
    doc.addImage(charts.weeklyEvolution.base64, 'PNG', x, y, chartWidth, chartHeight);
  }

  if (charts.workDistribution) {
    doc.addImage(charts.workDistribution.base64, 'PNG', x + chartWidth + spacing, y, chartWidth, chartHeight);
  }

  y += chartHeight + spacing + 5;

  // Row 2: Daily Earnings + Shift Types
  if (charts.dailyEarnings) {
    doc.addImage(charts.dailyEarnings.base64, 'PNG', x, y, chartWidth, chartHeight);
  }

  if (charts.shiftTypeDistribution) {
    doc.addImage(charts.shiftTypeDistribution.base64, 'PNG', x + chartWidth + spacing, y, chartWidth, chartHeight);
  }

  y += chartHeight + spacing + 5;

  // Row 3: Monthly Trend (centered, wider)
  y = addPageIfNeeded(doc, y, chartHeight);
  if (charts.monthlyTrend) {
    const wideChartWidth = chartWidth * 2 + spacing;
    const centerX = LAYOUT.margin.left + (LAYOUT.contentWidth - wideChartWidth) / 2;
    doc.addImage(charts.monthlyTrend.base64, 'PNG', centerX, y, wideChartWidth, chartHeight);
    y += chartHeight + 5;
  }

  return y;
};

/**
 * Adds work details page
 * @param {jsPDF} doc - jsPDF document instance
 * @param {Object} logo - Logo data
 * @param {Object} reportData - Complete report data
 * @returns {number} Final Y position
 */
export const addWorkDetailsPage = (doc, logo, reportData) => {
  let y = addPageHeader(doc, logo, 'EARNINGS BY WORK');
  y += 5;

  const { byWork, byShiftType } = reportData;

  // By Work table
  y = addSectionHeader(doc, 'TOP WORKS', y, COLORS.primary);

  const workHeaders = ['Work Name', 'Earnings', 'Hours', 'Shifts', 'Avg/Hr'];
  const workData = byWork.slice(0, 10).map(w => [
    w.name.substring(0, 20),
    `$${w.earnings.toFixed(2)}`,
    `${w.hours.toFixed(1)}h`,
    w.shifts,
    `$${w.averagePerHour.toFixed(2)}`
  ]);
  const workWidths = [60, 30, 20, 20, 30];

  y = drawTable(doc, LAYOUT.margin.left, y, workHeaders, workData, workWidths);
  y += 10;

  // By Shift Type table
  y = addPageIfNeeded(doc, y, 40);
  y = addSectionHeader(doc, 'SHIFT TYPE BREAKDOWN', y, COLORS.secondary);

  const typeHeaders = ['Type', 'Shifts', 'Hours', 'Earnings', '%'];
  const typeData = byShiftType.map(t => [
    t.name,
    t.shifts,
    `${t.hours.toFixed(1)}h`,
    `$${t.earnings.toFixed(2)}`,
    `${t.percentage.toFixed(1)}%`
  ]);
  const typeWidths = [40, 25, 25, 40, 30];

  y = drawTable(doc, LAYOUT.margin.left, y, typeHeaders, typeData, typeWidths);

  return y;
};

/**
 * Adds delivery stats page
 * @param {jsPDF} doc - jsPDF document instance
 * @param {Object} logo - Logo data
 * @param {Object} reportData - Complete report data
 * @param {Object} charts - Generated chart images
 * @returns {number} Final Y position
 */
export const addDeliveryPage = (doc, logo, reportData, charts) => {
  const { delivery } = reportData;

  if (!delivery || !delivery.enabled) {
    return LAYOUT.margin.top;
  }

  let y = addPageHeader(doc, logo, 'DELIVERY PERFORMANCE');
  y += 5;

  const x = LAYOUT.margin.left;

  // Summary KPIs
  y = addSectionHeader(doc, 'SUMMARY', y, COLORS.accent);

  const cardSpacing = LAYOUT.kpiCard.spacing;
  const cardWidth = LAYOUT.kpiCard.width;

  // Row 1
  drawKPICard(doc, x, y, 'Total Earned', `$${delivery.totalEarned.toFixed(0)}`, COLORS.primary);
  drawKPICard(doc, x + cardWidth + cardSpacing, y, 'Net Earnings', `$${delivery.netEarnings.toFixed(0)}`, COLORS.accent);
  drawKPICard(doc, x + (cardWidth + cardSpacing) * 2, y, 'Total Orders', `${delivery.totalOrders}`, COLORS.secondary);
  drawKPICard(doc, x + (cardWidth + cardSpacing) * 3, y, 'Total Tips', `$${delivery.totalTips.toFixed(0)}`, COLORS.primary);

  y += LAYOUT.kpiCard.height + 10;

  // Row 2
  drawKPICard(doc, x, y, 'Total Km', `${delivery.totalKilometers.toFixed(0)}`, COLORS.secondary);
  drawKPICard(doc, x + cardWidth + cardSpacing, y, 'Fuel Expense', `$${delivery.totalExpenses.toFixed(0)}`, COLORS.error);
  drawKPICard(doc, x + (cardWidth + cardSpacing) * 2, y, 'Avg/Order', `$${delivery.averagePerOrder.toFixed(2)}`, COLORS.accent);
  drawKPICard(doc, x + (cardWidth + cardSpacing) * 3, y, 'Avg/Hour', `$${delivery.averagePerHour.toFixed(2)}`, COLORS.primary);

  y += LAYOUT.kpiCard.height + 15;

  // Platform chart
  if (charts.platformComparison) {
    y = addPageIfNeeded(doc, y, 60);
    y = addSectionHeader(doc, 'PLATFORM COMPARISON', y, COLORS.secondary);

    const chartWidth = LAYOUT.contentWidth;
    const chartHeight = 45;
    doc.addImage(charts.platformComparison.base64, 'PNG', x, y, chartWidth, chartHeight);
    y += chartHeight + 10;
  }

  // By Platform table
  y = addPageIfNeeded(doc, y, 40);
  y = addSectionHeader(doc, 'BY PLATFORM DETAILS', y, COLORS.primary);

  const platformHeaders = ['Platform', 'Earnings', 'Orders', 'Tips', 'Avg/Hr'];
  const platformData = (delivery.byPlatform || []).slice(0, 5).map(p => [
    p.name.substring(0, 15),
    `$${p.earnings.toFixed(2)}`,
    p.orders,
    `$${p.tips.toFixed(2)}`,
    `$${p.averagePerHour.toFixed(2)}`
  ]);
  const platformWidths = [45, 30, 25, 25, 35];

  y = drawTable(doc, x, y, platformHeaders, platformData, platformWidths);

  return y;
};

/**
 * Adds monthly detail pages
 * @param {jsPDF} doc - jsPDF document instance
 * @param {Object} logo - Logo data
 * @param {Array} monthlyData - Monthly data array
 */
export const addMonthlyDetailPages = (doc, logo, monthlyData) => {
  monthlyData.forEach((monthData, index) => {
    // Add new page for each month
    if (index > 0) {
      doc.addPage();
    }

    let y = addPageHeader(doc, logo, monthData.monthYear.toUpperCase());
    y += 5;

    const { summary, traditionalShifts, deliveryShifts } = monthData;
    const x = LAYOUT.margin.left;

    // Month summary
    y = addSectionHeader(doc, 'MONTH SUMMARY', y, COLORS.primary);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(FONTS.body.size);

    const summaryText = [
      `Total Shifts: ${summary.totalShifts} (Traditional: ${summary.traditionalShifts}, Delivery: ${summary.deliveryShifts})`,
      `Total Hours: ${summary.totalHours.toFixed(1)}h`,
      `Total Earned: $${summary.totalEarned.toFixed(2)} | Net: $${summary.netEarnings.toFixed(2)}`,
      `Avg/Shift: $${summary.averagePerShift.toFixed(2)} | Avg/Hour: $${summary.averagePerHour.toFixed(2)}`
    ];

    summaryText.forEach(text => {
      doc.text(text, x, y);
      y += 5;
    });

    y += 5;

    // Traditional shifts summary table (first 10)
    if (traditionalShifts && traditionalShifts.length > 0) {
      y = addPageIfNeeded(doc, y, 30);
      y = addSectionHeader(doc, `TRADITIONAL SHIFTS (${traditionalShifts.length})`, y, COLORS.secondary);

      const headers = ['Date', 'Work', 'Hours', 'Earnings'];
      const data = traditionalShifts.slice(0, 10).map(s => [
        s.date,
        s.workName.substring(0, 20),
        `${s.hoursWorked}h`,
        `$${s.earningsWithDiscount.toFixed(2)}`
      ]);
      const widths = [30, 70, 25, 35];

      y = drawTable(doc, x, y, headers, data, widths);

      if (traditionalShifts.length > 10) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(FONTS.small.size);
        doc.setTextColor(COLORS.gray);
        doc.text(`... and ${traditionalShifts.length - 10} more shifts`, x, y);
        y += 5;
        doc.setTextColor(COLORS.darkGray);
      }
    }

    y += 5;

    // Delivery shifts summary table (first 10)
    if (deliveryShifts && deliveryShifts.length > 0) {
      y = addPageIfNeeded(doc, y, 30);
      y = addSectionHeader(doc, `DELIVERY SHIFTS (${deliveryShifts.length})`, y, COLORS.accent);

      const headers = ['Date', 'Platform', 'Orders', 'Earnings', 'Net'];
      const data = deliveryShifts.slice(0, 10).map(s => [
        s.date,
        s.platform.substring(0, 12),
        s.orderCount,
        `$${s.totalEarnings.toFixed(2)}`,
        `$${s.netEarnings.toFixed(2)}`
      ]);
      const widths = [30, 45, 20, 30, 35];

      y = drawTable(doc, x, y, headers, data, widths);

      if (deliveryShifts.length > 10) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(FONTS.small.size);
        doc.setTextColor(COLORS.gray);
        doc.text(`... and ${deliveryShifts.length - 10} more shifts`, x, y);
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
