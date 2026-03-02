// src/services/export/excel/ExcelSheets.js

import { styles, setColumnWidths, mergeCells, getRowStyle } from './ExcelStyles';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Creates a cell with value and style
 */
const createCell = (value, style, type = 's') => ({
  v: value,
  t: type,
  s: style
});

/** Round to 2 decimal places (currency) */
const r2 = (v) => Math.round((v || 0) * 100) / 100;

/** Round to 1 decimal place (hours) */
const r1 = (v) => Math.round((v || 0) * 10) / 10;

/**
 * Creates the Overview sheet with executive summary and branding header
 */
export const createOverviewSheet = (reportData) => {
  const ws = {};
  let row = 1;

  const { executive, weeklyStats, byWork, byShiftType, metadata, projections } = reportData;

  // ─── Brand Header (rows 1-2) ───
  const generatedStr = metadata.generatedAt.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  ws['A' + row] = createCell('Orary — Activity Report', styles.brandHeader);
  mergeCells(ws, `A${row}:E${row}`);
  ws['F' + row] = createCell(`Generated: ${generatedStr}`, styles.brandRight);
  row++;

  ws['A' + row] = createCell('orary.app — Professional Shift Management', styles.brandSubtitle);
  mergeCells(ws, `A${row}:F${row}`);
  row += 2;

  // ─── Executive Summary ───
  ws['A' + row] = createCell('EXECUTIVE SUMMARY', styles.sectionHeader);
  mergeCells(ws, `A${row}:F${row}`);
  row++;

  // KPI Row 1
  ws['A' + row] = createCell('Total Earned', styles.kpiLabel);
  ws['B' + row] = { v: r2(executive.totalEarned), t: 'n', s: styles.kpiValue, z: '$#,##0.00' };
  ws['C' + row] = createCell('Net Earnings', styles.kpiLabel);
  ws['D' + row] = { v: r2(executive.netEarnings), t: 'n', s: styles.kpiValue, z: '$#,##0.00' };
  ws['E' + row] = createCell('Total Expenses', styles.kpiLabel);
  ws['F' + row] = { v: r2(executive.totalExpenses), t: 'n', s: styles.kpiValue, z: '$#,##0.00' };
  row++;

  // KPI Row 2
  ws['A' + row] = createCell('Hours Worked', styles.kpiLabel);
  ws['B' + row] = { v: r1(executive.totalHours), t: 'n', s: styles.kpiValue, z: '#,##0.0' };
  ws['C' + row] = createCell('Total Shifts', styles.kpiLabel);
  ws['D' + row] = { v: executive.totalShifts, t: 'n', s: styles.kpiValue, z: '#,##0' };
  ws['E' + row] = createCell('Avg Per Hour', styles.kpiLabel);
  ws['F' + row] = { v: r2(executive.averagePerHour), t: 'n', s: styles.kpiValue, z: '$#,##0.00' };
  row += 2;

  // ─── This Week ───
  ws['A' + row] = createCell('THIS WEEK PERFORMANCE', styles.sectionHeaderBlue);
  mergeCells(ws, `A${row}:F${row}`);
  row++;

  const current = weeklyStats.current;
  const comparison = weeklyStats.comparison;

  ws['A' + row] = createCell('Earnings', styles.label);
  ws['B' + row] = { v: r2(current.earnings), t: 'n', s: styles.currencyBold, z: '$#,##0.00' };
  ws['C' + row] = createCell('vs Last Week', styles.label);
  const earningsChangeStyle = comparison.earningsChange >= 0 ? styles.changePositive : styles.changeNegative;
  ws['D' + row] = createCell(
    `${comparison.earningsChange >= 0 ? '+' : ''}${r1(comparison.earningsChange).toFixed(1)}%`,
    earningsChangeStyle
  );
  row++;

  ws['A' + row] = createCell('Hours', styles.label);
  ws['B' + row] = { v: r1(current.hours), t: 'n', s: styles.valueBold, z: '#,##0.0' };
  ws['C' + row] = createCell('Shifts', styles.label);
  ws['D' + row] = createCell(current.shifts, styles.valueBold, 'n');
  ws['E' + row] = createCell('Days Worked', styles.label);
  ws['F' + row] = createCell(current.daysWorked, styles.valueBold, 'n');
  row++;

  ws['A' + row] = createCell('Most Productive Day', styles.label);
  ws['B' + row] = createCell(current.mostProductiveDay?.day || 'N/A', styles.value);
  ws['C' + row] = createCell('Earnings', styles.label);
  ws['D' + row] = { v: r2(current.mostProductiveDay?.earnings || 0), t: 'n', s: styles.currencyBold, z: '$#,##0.00' };
  row += 2;

  // ─── Monthly Projection ───
  ws['A' + row] = createCell('MONTHLY PROJECTION', styles.sectionHeaderGreen);
  mergeCells(ws, `A${row}:F${row}`);
  row++;

  ws['A' + row] = createCell('Based on current 4-week pace', styles.small);
  mergeCells(ws, `A${row}:F${row}`);
  row++;

  ws['A' + row] = createCell('Projected Earnings', styles.label);
  ws['B' + row] = { v: r2(projections.monthlyProjection), t: 'n', s: styles.kpiValue, z: '$#,##0.00' };
  ws['C' + row] = createCell('Weekly Average', styles.label);
  ws['D' + row] = { v: r2(projections.weeklyAverage), t: 'n', s: styles.currencyBold, z: '$#,##0.00' };
  row += 2;

  // ─── Top Works ───
  ws['A' + row] = createCell('TOP WORKS BY EARNINGS', styles.sectionHeader);
  mergeCells(ws, `A${row}:F${row}`);
  row++;

  ws['A' + row] = createCell('#', styles.tableHeader);
  ws['B' + row] = createCell('Work Name', styles.tableHeader);
  ws['C' + row] = createCell('Earnings', styles.tableHeader);
  ws['D' + row] = createCell('Hours', styles.tableHeader);
  ws['E' + row] = createCell('Shifts', styles.tableHeader);
  ws['F' + row] = createCell('Avg / Hour', styles.tableHeader);
  row++;

  byWork.slice(0, 5).forEach((work, index) => {
    const rowStyle = getRowStyle(index);
    const currStyle = index % 2 === 0 ? styles.currencyEven : styles.currencyOdd;
    const hoursStyle = index % 2 === 0 ? styles.hoursEven : styles.hoursOdd;
    const intStyle = index % 2 === 0 ? styles.integerEven : styles.integerOdd;

    ws['A' + row] = createCell(index + 1, intStyle, 'n');
    ws['B' + row] = createCell(work.name, rowStyle);
    ws['C' + row] = { v: r2(work.earnings), t: 'n', s: currStyle, z: '$#,##0.00' };
    ws['D' + row] = { v: r1(work.hours), t: 'n', s: hoursStyle, z: '#,##0.0' };
    ws['E' + row] = createCell(work.shifts, intStyle, 'n');
    ws['F' + row] = { v: r2(work.averagePerHour), t: 'n', s: currStyle, z: '$#,##0.00' };
    row++;
  });
  row++;

  // ─── Shift Type Breakdown ───
  ws['A' + row] = createCell('SHIFT TYPE BREAKDOWN', styles.sectionHeaderBlue);
  mergeCells(ws, `A${row}:F${row}`);
  row++;

  ws['A' + row] = createCell('Type', styles.tableHeader);
  ws['B' + row] = createCell('Shifts', styles.tableHeader);
  ws['C' + row] = createCell('Hours', styles.tableHeader);
  ws['D' + row] = createCell('Earnings', styles.tableHeader);
  ws['E' + row] = createCell('Avg / Hour', styles.tableHeader);
  ws['F' + row] = createCell('%', styles.tableHeader);
  row++;

  byShiftType.forEach((type, index) => {
    const rowStyle = getRowStyle(index);
    const currStyle = index % 2 === 0 ? styles.currencyEven : styles.currencyOdd;
    const hoursStyle = index % 2 === 0 ? styles.hoursEven : styles.hoursOdd;
    const intStyle = index % 2 === 0 ? styles.integerEven : styles.integerOdd;
    const pctStyle = index % 2 === 0 ? styles.percentEven : styles.percentOdd;

    ws['A' + row] = createCell(type.name, rowStyle);
    ws['B' + row] = createCell(type.shifts, intStyle, 'n');
    ws['C' + row] = { v: r1(type.hours), t: 'n', s: hoursStyle, z: '#,##0.0' };
    ws['D' + row] = { v: r2(type.earnings), t: 'n', s: currStyle, z: '$#,##0.00' };
    ws['E' + row] = { v: r2(type.averagePerHour), t: 'n', s: currStyle, z: '$#,##0.00' };
    ws['F' + row] = { v: (type.percentage || 0) / 100, t: 'n', s: pctStyle, z: '0.0%' };
    row++;
  });

  // Set column widths
  setColumnWidths(ws, [18, 24, 15, 13, 10, 15]);

  // Set row heights for brand header
  ws['!rows'] = [{ hpx: 22 }, { hpx: 16 }];

  // Set range
  ws['!ref'] = `A1:F${row}`;

  return ws;
};

/**
 * Creates the Delivery Stats sheet
 */
export const createDeliverySheet = (reportData) => {
  const { delivery } = reportData;

  if (!delivery || !delivery.enabled) {
    return null;
  }

  const ws = {};
  let row = 1;

  // Brand header
  ws['A' + row] = createCell('Orary — Delivery Performance', styles.brandHeader);
  mergeCells(ws, `A${row}:H${row}`);
  row += 2;

  // Summary Section
  ws['A' + row] = createCell('DELIVERY SUMMARY', styles.sectionHeader);
  mergeCells(ws, `A${row}:H${row}`);
  row++;

  // KPI Row 1
  ws['A' + row] = createCell('Total Earned', styles.kpiLabel);
  ws['B' + row] = { v: r2(delivery.totalEarned), t: 'n', s: styles.kpiValue, z: '$#,##0.00' };
  ws['C' + row] = createCell('Net Earnings', styles.kpiLabel);
  ws['D' + row] = { v: r2(delivery.netEarnings), t: 'n', s: styles.kpiValue, z: '$#,##0.00' };
  ws['E' + row] = createCell('Total Tips', styles.kpiLabel);
  ws['F' + row] = { v: r2(delivery.totalTips), t: 'n', s: styles.kpiValue, z: '$#,##0.00' };
  ws['G' + row] = createCell('Total Orders', styles.kpiLabel);
  ws['H' + row] = createCell(delivery.totalOrders, styles.kpiValue, 'n');
  row++;

  // KPI Row 2
  ws['A' + row] = createCell('Total Km', styles.kpiLabel);
  ws['B' + row] = { v: r1(delivery.totalKilometers), t: 'n', s: styles.kpiValue, z: '#,##0.0' };
  ws['C' + row] = createCell('Fuel Expense', styles.kpiLabel);
  ws['D' + row] = { v: r2(delivery.totalExpenses), t: 'n', s: styles.kpiValue, z: '$#,##0.00' };
  ws['E' + row] = createCell('Avg / Order', styles.kpiLabel);
  ws['F' + row] = { v: r2(delivery.averagePerOrder), t: 'n', s: styles.kpiValue, z: '$#,##0.00' };
  ws['G' + row] = createCell('Avg / Hour', styles.kpiLabel);
  ws['H' + row] = { v: r2(delivery.averagePerHour), t: 'n', s: styles.kpiValue, z: '$#,##0.00' };
  row += 2;

  // By Platform
  ws['A' + row] = createCell('BY PLATFORM', styles.sectionHeaderBlue);
  mergeCells(ws, `A${row}:H${row}`);
  row++;

  ws['A' + row] = createCell('Platform', styles.tableHeader);
  ws['B' + row] = createCell('Earnings', styles.tableHeader);
  ws['C' + row] = createCell('Orders', styles.tableHeader);
  ws['D' + row] = createCell('Tips', styles.tableHeader);
  ws['E' + row] = createCell('Hours', styles.tableHeader);
  ws['F' + row] = createCell('Km', styles.tableHeader);
  ws['G' + row] = createCell('Expenses', styles.tableHeader);
  ws['H' + row] = createCell('Avg / Hr', styles.tableHeader);
  row++;

  (delivery.byPlatform || []).forEach((platform, index) => {
    const rowStyle = getRowStyle(index);
    const currStyle = index % 2 === 0 ? styles.currencyEven : styles.currencyOdd;
    const hoursStyle = index % 2 === 0 ? styles.hoursEven : styles.hoursOdd;
    const intStyle = index % 2 === 0 ? styles.integerEven : styles.integerOdd;

    ws['A' + row] = createCell(platform.name, rowStyle);
    ws['B' + row] = { v: r2(platform.earnings), t: 'n', s: currStyle, z: '$#,##0.00' };
    ws['C' + row] = createCell(platform.orders, intStyle, 'n');
    ws['D' + row] = { v: r2(platform.tips), t: 'n', s: currStyle, z: '$#,##0.00' };
    ws['E' + row] = { v: r1(platform.hours), t: 'n', s: hoursStyle, z: '#,##0.0' };
    ws['F' + row] = { v: r1(platform.kilometers), t: 'n', s: hoursStyle, z: '#,##0.0' };
    ws['G' + row] = { v: r2(platform.expenses), t: 'n', s: currStyle, z: '$#,##0.00' };
    ws['H' + row] = { v: r2(platform.averagePerHour), t: 'n', s: currStyle, z: '$#,##0.00' };
    row++;
  });
  row++;

  // By Vehicle
  ws['A' + row] = createCell('BY VEHICLE', styles.sectionHeader);
  mergeCells(ws, `A${row}:H${row}`);
  row++;

  ws['A' + row] = createCell('Vehicle', styles.tableHeader);
  ws['B' + row] = createCell('Earnings', styles.tableHeader);
  ws['C' + row] = createCell('Orders', styles.tableHeader);
  ws['D' + row] = createCell('Km', styles.tableHeader);
  ws['E' + row] = createCell('Expenses', styles.tableHeader);
  ws['F' + row] = createCell('Efficiency', styles.tableHeader);
  ws['G' + row] = createCell('Cost / Km', styles.tableHeader);
  ws['H' + row] = createCell('Shifts', styles.tableHeader);
  row++;

  (delivery.byVehicle || []).forEach((vehicle, index) => {
    const rowStyle = getRowStyle(index);
    const currStyle = index % 2 === 0 ? styles.currencyEven : styles.currencyOdd;
    const hoursStyle = index % 2 === 0 ? styles.hoursEven : styles.hoursOdd;
    const intStyle = index % 2 === 0 ? styles.integerEven : styles.integerOdd;

    ws['A' + row] = createCell(vehicle.name, rowStyle);
    ws['B' + row] = { v: r2(vehicle.earnings), t: 'n', s: currStyle, z: '$#,##0.00' };
    ws['C' + row] = createCell(vehicle.orders, intStyle, 'n');
    ws['D' + row] = { v: r1(vehicle.kilometers), t: 'n', s: hoursStyle, z: '#,##0.0' };
    ws['E' + row] = { v: r2(vehicle.expenses), t: 'n', s: currStyle, z: '$#,##0.00' };
    ws['F' + row] = { v: r1(vehicle.efficiency), t: 'n', s: hoursStyle, z: '#,##0.0' };
    ws['G' + row] = { v: r2(vehicle.costPerKm), t: 'n', s: currStyle, z: '$#,##0.00' };
    ws['H' + row] = createCell(vehicle.shifts, intStyle, 'n');
    row++;
  });

  setColumnWidths(ws, [18, 14, 10, 12, 10, 12, 12, 10]);
  ws['!ref'] = `A1:H${row}`;

  return ws;
};

/**
 * Creates a monthly data sheet
 */
export const createMonthlySheet = (monthData) => {
  const ws = {};
  let row = 1;

  const { monthYear, summary, traditionalShifts, deliveryShifts } = monthData;

  // Brand header
  ws['A' + row] = createCell(`Orary — ${monthYear}`, styles.brandHeader);
  mergeCells(ws, `A${row}:P${row}`);
  row += 2;

  // Summary Section
  ws['A' + row] = createCell('MONTH SUMMARY', styles.sectionHeader);
  mergeCells(ws, `A${row}:H${row}`);
  row++;

  // Summary Row 1
  ws['A' + row] = createCell('Total Shifts', styles.label);
  ws['B' + row] = createCell(summary.totalShifts, styles.valueBold, 'n');
  ws['C' + row] = createCell('Traditional', styles.label);
  ws['D' + row] = createCell(summary.traditionalShifts, styles.value, 'n');
  ws['E' + row] = createCell('Delivery', styles.label);
  ws['F' + row] = createCell(summary.deliveryShifts, styles.value, 'n');
  ws['G' + row] = createCell('Total Hours', styles.label);
  ws['H' + row] = { v: r1(summary.totalHours), t: 'n', s: styles.valueBold, z: '#,##0.0' };
  row++;

  // Summary Row 2
  ws['A' + row] = createCell('Total Earned', styles.label);
  ws['B' + row] = { v: r2(summary.totalEarned), t: 'n', s: styles.currencyBold, z: '$#,##0.00' };
  ws['C' + row] = createCell('Net Earnings', styles.label);
  ws['D' + row] = { v: r2(summary.netEarnings), t: 'n', s: styles.currencyBold, z: '$#,##0.00' };
  ws['E' + row] = createCell('Avg / Shift', styles.label);
  ws['F' + row] = { v: r2(summary.averagePerShift), t: 'n', s: styles.currencyBold, z: '$#,##0.00' };
  ws['G' + row] = createCell('Avg / Hour', styles.label);
  ws['H' + row] = { v: r2(summary.averagePerHour), t: 'n', s: styles.currencyBold, z: '$#,##0.00' };
  row += 2;

  // Traditional Shifts Section
  if (traditionalShifts && traditionalShifts.length > 0) {
    ws['A' + row] = createCell(`TRADITIONAL SHIFTS (${traditionalShifts.length})`, styles.sectionHeader);
    mergeCells(ws, `A${row}:P${row}`);
    row++;

    const headers = ['ID', 'Date', 'Day', 'Work', 'Start', 'End', 'Hours', 'Cross', 'Rate', 'Total', 'Day', 'Aftn', 'Night', 'Sat', 'Sun', 'Notes'];
    headers.forEach((header, index) => {
      const col = String.fromCharCode(65 + index);
      ws[col + row] = createCell(header, styles.tableHeader);
    });
    row++;

    traditionalShifts.forEach((shift, index) => {
      const rowStyle = getRowStyle(index);
      const currStyle = index % 2 === 0 ? styles.currencyEven : styles.currencyOdd;
      const hoursStyle = index % 2 === 0 ? styles.hoursEven : styles.hoursOdd;
      const dateStyle = index % 2 === 0 ? styles.dateEven : styles.dateOdd;
      const centerStyle = index % 2 === 0 ? styles.cellEvenCenter : styles.cellOddCenter;
      const notesStyle = index % 2 === 0 ? styles.notesEven : styles.notesOdd;

      ws['A' + row] = createCell(shift.id, centerStyle);
      ws['B' + row] = createCell(shift.date, dateStyle);
      ws['C' + row] = createCell(shift.weekday.substring(0, 3), centerStyle);
      ws['D' + row] = createCell(shift.workName, rowStyle);
      ws['E' + row] = createCell(shift.startTime, centerStyle);
      ws['F' + row] = createCell(shift.endTime, centerStyle);
      ws['G' + row] = { v: r1(shift.hoursWorked), t: 'n', s: hoursStyle, z: '#,##0.0' };
      ws['H' + row] = createCell(shift.crossesMidnight ? 'Yes' : 'No', centerStyle);
      ws['I' + row] = { v: r2(shift.rate), t: 'n', s: currStyle, z: '$#,##0.00' };
      ws['J' + row] = { v: r2(shift.earningsWithDiscount), t: 'n', s: currStyle, z: '$#,##0.00' };
      ws['K' + row] = { v: r2(shift.breakdown.day), t: 'n', s: currStyle, z: '$#,##0.00' };
      ws['L' + row] = { v: r2(shift.breakdown.afternoon), t: 'n', s: currStyle, z: '$#,##0.00' };
      ws['M' + row] = { v: r2(shift.breakdown.night), t: 'n', s: currStyle, z: '$#,##0.00' };
      ws['N' + row] = { v: r2(shift.breakdown.saturday), t: 'n', s: currStyle, z: '$#,##0.00' };
      ws['O' + row] = { v: r2(shift.breakdown.sunday), t: 'n', s: currStyle, z: '$#,##0.00' };
      ws['P' + row] = createCell(shift.notes || '', notesStyle);
      row++;
    });
    row++;
  }

  // Delivery Shifts Section
  if (deliveryShifts && deliveryShifts.length > 0) {
    ws['A' + row] = createCell(`DELIVERY SHIFTS (${deliveryShifts.length})`, styles.sectionHeaderGreen);
    mergeCells(ws, `A${row}:P${row}`);
    row++;

    const headers = ['ID', 'Date', 'Day', 'Work', 'Platform', 'Vehicle', 'Start', 'End', 'Hours', 'Orders', 'Base', 'Tips', 'Total', 'Km', 'Fuel', 'Net'];
    headers.forEach((header, index) => {
      const col = String.fromCharCode(65 + index);
      ws[col + row] = createCell(header, styles.tableHeaderGreen);
    });
    row++;

    deliveryShifts.forEach((shift, index) => {
      const rowStyle = getRowStyle(index);
      const currStyle = index % 2 === 0 ? styles.currencyEven : styles.currencyOdd;
      const hoursStyle = index % 2 === 0 ? styles.hoursEven : styles.hoursOdd;
      const intStyle = index % 2 === 0 ? styles.integerEven : styles.integerOdd;
      const dateStyle = index % 2 === 0 ? styles.dateEven : styles.dateOdd;
      const centerStyle = index % 2 === 0 ? styles.cellEvenCenter : styles.cellOddCenter;

      ws['A' + row] = createCell(shift.id, centerStyle);
      ws['B' + row] = createCell(shift.date, dateStyle);
      ws['C' + row] = createCell(shift.weekday.substring(0, 3), centerStyle);
      ws['D' + row] = createCell(shift.workName, rowStyle);
      ws['E' + row] = createCell(shift.platform, rowStyle);
      ws['F' + row] = createCell(shift.vehicle, centerStyle);
      ws['G' + row] = createCell(shift.startTime, centerStyle);
      ws['H' + row] = createCell(shift.endTime, centerStyle);
      ws['I' + row] = { v: r1(shift.hoursWorked), t: 'n', s: hoursStyle, z: '#,##0.0' };
      ws['J' + row] = createCell(shift.orderCount, intStyle, 'n');
      ws['K' + row] = { v: r2(shift.baseEarnings), t: 'n', s: currStyle, z: '$#,##0.00' };
      ws['L' + row] = { v: r2(shift.tips), t: 'n', s: currStyle, z: '$#,##0.00' };
      ws['M' + row] = { v: r2(shift.totalEarnings), t: 'n', s: currStyle, z: '$#,##0.00' };
      ws['N' + row] = { v: r1(shift.kilometers), t: 'n', s: hoursStyle, z: '#,##0.0' };
      ws['O' + row] = { v: r2(shift.fuelExpense), t: 'n', s: currStyle, z: '$#,##0.00' };
      ws['P' + row] = { v: r2(shift.netEarnings), t: 'n', s: currStyle, z: '$#,##0.00' };
      row++;
    });
  }

  setColumnWidths(ws, [10, 13, 6, 18, 13, 10, 7, 7, 8, 8, 10, 10, 10, 8, 10, 10]);
  ws['!ref'] = `A1:P${row}`;

  return ws;
};

/**
 * Creates all sheets for the workbook
 * Excel sheet names are limited to 31 characters
 */
export const createAllSheets = (reportData, options = {}) => {
  const sheets = {};

  // Overview sheet (always first)
  sheets['Overview'] = createOverviewSheet(reportData, options.logo);

  // Delivery stats sheet (if applicable)
  if (reportData.delivery && reportData.delivery.enabled) {
    const deliverySheet = createDeliverySheet(reportData);
    if (deliverySheet) {
      sheets['Delivery Stats'] = deliverySheet;
    }
  }

  // Monthly sheets — limit name to 31 chars (Excel limit), keep full year
  if (reportData.monthlyData && reportData.monthlyData.length > 0) {
    reportData.monthlyData.forEach(monthData => {
      const sheetName = monthData.monthYear.substring(0, 31);
      sheets[sheetName] = createMonthlySheet(monthData);
    });
  }

  return sheets;
};

const ExcelSheetsModule = {
  createOverviewSheet,
  createDeliverySheet,
  createMonthlySheet,
  createAllSheets
};

export default ExcelSheetsModule;
