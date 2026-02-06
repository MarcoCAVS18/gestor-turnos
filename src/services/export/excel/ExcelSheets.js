// src/services/export/excel/ExcelSheets.js

import * as XLSX from 'xlsx-js-style';
import { styles, columnWidths, applyStyle, setColumnWidths, mergeCells, getRowStyle, COLORS } from './ExcelStyles';

/**
 * Creates a cell with value and style
 * @param {*} value - Cell value
 * @param {Object} style - Cell style
 * @param {string} type - Cell type ('s' for string, 'n' for number)
 * @returns {Object} Cell object
 */
const createCell = (value, style, type = 's') => ({
  v: value,
  t: type,
  s: style
});

/**
 * Creates the Overview sheet with executive summary
 * @param {Object} reportData - Complete report data
 * @param {Object} logo - Logo data (optional)
 * @returns {Object} Worksheet
 */
export const createOverviewSheet = (reportData, logo = null) => {
  const ws = {};
  let row = 1;

  const { executive, weeklyStats, byWork, byShiftType, metadata, projections } = reportData;

  // Title Section
  ws['A' + row] = createCell('ACTIVITY REPORT', styles.title);
  mergeCells(ws, `A${row}:F${row}`);
  row++;

  ws['A' + row] = createCell(`Generated: ${metadata.generatedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, styles.subtitle);
  mergeCells(ws, `A${row}:F${row}`);
  row += 2;

  // Executive Summary Section
  ws['A' + row] = createCell('EXECUTIVE SUMMARY', styles.sectionHeader);
  mergeCells(ws, `A${row}:F${row}`);
  row++;

  // KPI Row 1
  ws['A' + row] = createCell('Total Earned', styles.kpiLabel);
  ws['B' + row] = createCell(executive.totalEarned, styles.kpiValue);
  ws['B' + row].z = '$#,##0.00';
  ws['C' + row] = createCell('Net Earnings', styles.kpiLabel);
  ws['D' + row] = createCell(executive.netEarnings, styles.kpiValue);
  ws['D' + row].z = '$#,##0.00';
  ws['E' + row] = createCell('Total Expenses', styles.kpiLabel);
  ws['F' + row] = createCell(executive.totalExpenses, styles.kpiValue);
  ws['F' + row].z = '$#,##0.00';
  row++;

  // KPI Row 2
  ws['A' + row] = createCell('Hours Worked', styles.kpiLabel);
  ws['B' + row] = createCell(`${executive.totalHours.toFixed(1)}h`, styles.kpiValue);
  ws['C' + row] = createCell('Total Shifts', styles.kpiLabel);
  ws['D' + row] = createCell(executive.totalShifts, styles.kpiValue);
  ws['E' + row] = createCell('Avg Per Hour', styles.kpiLabel);
  ws['F' + row] = createCell(executive.averagePerHour, styles.kpiValue);
  ws['F' + row].z = '$#,##0.00';
  row += 2;

  // This Week Section
  ws['A' + row] = createCell('THIS WEEK PERFORMANCE', styles.sectionHeaderBlue);
  mergeCells(ws, `A${row}:F${row}`);
  row++;

  const current = weeklyStats.current;
  const comparison = weeklyStats.comparison;

  // Week stats
  ws['A' + row] = createCell('Earnings', styles.label);
  ws['B' + row] = createCell(current.earnings, styles.currencyBold);
  ws['C' + row] = createCell('vs Last Week', styles.label);
  const earningsChangeStyle = comparison.earningsChange >= 0 ? styles.changePositive : styles.changeNegative;
  ws['D' + row] = createCell(`${comparison.earningsChange >= 0 ? '+' : ''}${comparison.earningsChange.toFixed(1)}%`, earningsChangeStyle);
  row++;

  ws['A' + row] = createCell('Hours', styles.label);
  ws['B' + row] = createCell(`${current.hours.toFixed(1)}h`, styles.valueBold);
  ws['C' + row] = createCell('Shifts', styles.label);
  ws['D' + row] = createCell(current.shifts, styles.valueBold);
  ws['E' + row] = createCell('Days Worked', styles.label);
  ws['F' + row] = createCell(current.daysWorked, styles.valueBold);
  row++;

  ws['A' + row] = createCell('Most Productive Day', styles.label);
  ws['B' + row] = createCell(current.mostProductiveDay?.day || 'N/A', styles.value);
  ws['C' + row] = createCell('Earnings', styles.label);
  ws['D' + row] = createCell(current.mostProductiveDay?.earnings || 0, styles.currencyBold);
  row += 2;

  // Monthly Projection Section
  ws['A' + row] = createCell('MONTHLY PROJECTION', styles.sectionHeaderGreen);
  mergeCells(ws, `A${row}:F${row}`);
  row++;

  ws['A' + row] = createCell('Based on current pace:', styles.small);
  mergeCells(ws, `A${row}:F${row}`);
  row++;

  ws['A' + row] = createCell('Projected Earnings', styles.label);
  ws['B' + row] = createCell(projections.monthlyProjection, styles.kpiValue);
  ws['B' + row].z = '$#,##0.00';
  ws['C' + row] = createCell('Weekly Average', styles.label);
  ws['D' + row] = createCell(projections.weeklyAverage, styles.currencyBold);
  row += 2;

  // Top Works Section
  ws['A' + row] = createCell('TOP WORKS BY EARNINGS', styles.sectionHeader);
  mergeCells(ws, `A${row}:F${row}`);
  row++;

  // Headers
  ws['A' + row] = createCell('#', styles.tableHeader);
  ws['B' + row] = createCell('Work Name', styles.tableHeader);
  ws['C' + row] = createCell('Earnings', styles.tableHeader);
  ws['D' + row] = createCell('Hours', styles.tableHeader);
  ws['E' + row] = createCell('Shifts', styles.tableHeader);
  ws['F' + row] = createCell('Avg/Hour', styles.tableHeader);
  row++;

  // Data rows (top 5)
  byWork.slice(0, 5).forEach((work, index) => {
    const rowStyle = getRowStyle(index);
    const currStyle = index % 2 === 0 ? styles.currencyEven : styles.currencyOdd;
    const numStyle = index % 2 === 0 ? styles.numberEven : styles.numberOdd;
    const intStyle = index % 2 === 0 ? styles.integerEven : styles.integerOdd;

    ws['A' + row] = createCell(index + 1, intStyle, 'n');
    ws['B' + row] = createCell(work.name, rowStyle);
    ws['C' + row] = createCell(work.earnings, currStyle, 'n');
    ws['D' + row] = createCell(work.hours, numStyle, 'n');
    ws['E' + row] = createCell(work.shifts, intStyle, 'n');
    ws['F' + row] = createCell(work.averagePerHour, currStyle, 'n');
    row++;
  });
  row++;

  // Shift Type Section
  ws['A' + row] = createCell('SHIFT TYPE BREAKDOWN', styles.sectionHeaderBlue);
  mergeCells(ws, `A${row}:F${row}`);
  row++;

  // Headers
  ws['A' + row] = createCell('Type', styles.tableHeader);
  ws['B' + row] = createCell('Shifts', styles.tableHeader);
  ws['C' + row] = createCell('Hours', styles.tableHeader);
  ws['D' + row] = createCell('Earnings', styles.tableHeader);
  ws['E' + row] = createCell('Avg/Hour', styles.tableHeader);
  ws['F' + row] = createCell('%', styles.tableHeader);
  row++;

  // Data rows
  byShiftType.forEach((type, index) => {
    const rowStyle = getRowStyle(index);
    const currStyle = index % 2 === 0 ? styles.currencyEven : styles.currencyOdd;
    const numStyle = index % 2 === 0 ? styles.numberEven : styles.numberOdd;
    const intStyle = index % 2 === 0 ? styles.integerEven : styles.integerOdd;
    const pctStyle = index % 2 === 0 ? styles.percentEven : styles.percentOdd;

    ws['A' + row] = createCell(type.name, rowStyle);
    ws['B' + row] = createCell(type.shifts, intStyle, 'n');
    ws['C' + row] = createCell(type.hours, numStyle, 'n');
    ws['D' + row] = createCell(type.earnings, currStyle, 'n');
    ws['E' + row] = createCell(type.averagePerHour, currStyle, 'n');
    ws['F' + row] = createCell(type.percentage / 100, pctStyle, 'n');
    row++;
  });

  // Set column widths
  setColumnWidths(ws, [15, 22, 14, 12, 10, 14]);

  // Set range
  ws['!ref'] = `A1:F${row}`;

  return ws;
};

/**
 * Creates the Delivery Stats sheet
 * @param {Object} reportData - Complete report data
 * @returns {Object|null} Worksheet or null if no delivery data
 */
export const createDeliverySheet = (reportData) => {
  const { delivery } = reportData;

  if (!delivery || !delivery.enabled) {
    return null;
  }

  const ws = {};
  let row = 1;

  // Title
  ws['A' + row] = createCell('DELIVERY PERFORMANCE', styles.title);
  mergeCells(ws, `A${row}:H${row}`);
  row += 2;

  // Summary Section
  ws['A' + row] = createCell('SUMMARY', styles.sectionHeaderGreen);
  mergeCells(ws, `A${row}:H${row}`);
  row++;

  // KPI Row 1
  ws['A' + row] = createCell('Total Earned', styles.kpiLabel);
  ws['B' + row] = createCell(delivery.totalEarned, styles.kpiValue);
  ws['B' + row].z = '$#,##0.00';
  ws['C' + row] = createCell('Net Earnings', styles.kpiLabel);
  ws['D' + row] = createCell(delivery.netEarnings, styles.kpiValue);
  ws['D' + row].z = '$#,##0.00';
  ws['E' + row] = createCell('Total Tips', styles.kpiLabel);
  ws['F' + row] = createCell(delivery.totalTips, styles.kpiValue);
  ws['F' + row].z = '$#,##0.00';
  ws['G' + row] = createCell('Total Orders', styles.kpiLabel);
  ws['H' + row] = createCell(delivery.totalOrders, styles.kpiValue);
  row++;

  // KPI Row 2
  ws['A' + row] = createCell('Total Km', styles.kpiLabel);
  ws['B' + row] = createCell(`${delivery.totalKilometers.toFixed(1)} km`, styles.kpiValue);
  ws['C' + row] = createCell('Fuel Expense', styles.kpiLabel);
  ws['D' + row] = createCell(delivery.totalExpenses, styles.kpiValue);
  ws['D' + row].z = '$#,##0.00';
  ws['E' + row] = createCell('Avg/Order', styles.kpiLabel);
  ws['F' + row] = createCell(delivery.averagePerOrder, styles.kpiValue);
  ws['F' + row].z = '$#,##0.00';
  ws['G' + row] = createCell('Avg/Hour', styles.kpiLabel);
  ws['H' + row] = createCell(delivery.averagePerHour, styles.kpiValue);
  ws['H' + row].z = '$#,##0.00';
  row += 2;

  // By Platform Section
  ws['A' + row] = createCell('BY PLATFORM', styles.sectionHeader);
  mergeCells(ws, `A${row}:H${row}`);
  row++;

  // Headers
  ws['A' + row] = createCell('Platform', styles.tableHeader);
  ws['B' + row] = createCell('Earnings', styles.tableHeader);
  ws['C' + row] = createCell('Orders', styles.tableHeader);
  ws['D' + row] = createCell('Tips', styles.tableHeader);
  ws['E' + row] = createCell('Hours', styles.tableHeader);
  ws['F' + row] = createCell('Km', styles.tableHeader);
  ws['G' + row] = createCell('Expenses', styles.tableHeader);
  ws['H' + row] = createCell('Avg/Hr', styles.tableHeader);
  row++;

  // Data rows
  (delivery.byPlatform || []).forEach((platform, index) => {
    const rowStyle = getRowStyle(index);
    const currStyle = index % 2 === 0 ? styles.currencyEven : styles.currencyOdd;
    const numStyle = index % 2 === 0 ? styles.numberEven : styles.numberOdd;
    const intStyle = index % 2 === 0 ? styles.integerEven : styles.integerOdd;

    ws['A' + row] = createCell(platform.name, rowStyle);
    ws['B' + row] = createCell(platform.earnings, currStyle, 'n');
    ws['C' + row] = createCell(platform.orders, intStyle, 'n');
    ws['D' + row] = createCell(platform.tips, currStyle, 'n');
    ws['E' + row] = createCell(platform.hours, numStyle, 'n');
    ws['F' + row] = createCell(platform.kilometers, numStyle, 'n');
    ws['G' + row] = createCell(platform.expenses, currStyle, 'n');
    ws['H' + row] = createCell(platform.averagePerHour, currStyle, 'n');
    row++;
  });
  row++;

  // By Vehicle Section
  ws['A' + row] = createCell('BY VEHICLE', styles.sectionHeaderBlue);
  mergeCells(ws, `A${row}:H${row}`);
  row++;

  // Headers
  ws['A' + row] = createCell('Vehicle', styles.tableHeader);
  ws['B' + row] = createCell('Earnings', styles.tableHeader);
  ws['C' + row] = createCell('Orders', styles.tableHeader);
  ws['D' + row] = createCell('Km', styles.tableHeader);
  ws['E' + row] = createCell('Expenses', styles.tableHeader);
  ws['F' + row] = createCell('Efficiency', styles.tableHeader);
  ws['G' + row] = createCell('Cost/Km', styles.tableHeader);
  ws['H' + row] = createCell('Shifts', styles.tableHeader);
  row++;

  // Data rows
  (delivery.byVehicle || []).forEach((vehicle, index) => {
    const rowStyle = getRowStyle(index);
    const currStyle = index % 2 === 0 ? styles.currencyEven : styles.currencyOdd;
    const numStyle = index % 2 === 0 ? styles.numberEven : styles.numberOdd;
    const intStyle = index % 2 === 0 ? styles.integerEven : styles.integerOdd;

    ws['A' + row] = createCell(vehicle.name, rowStyle);
    ws['B' + row] = createCell(vehicle.earnings, currStyle, 'n');
    ws['C' + row] = createCell(vehicle.orders, intStyle, 'n');
    ws['D' + row] = createCell(vehicle.kilometers, numStyle, 'n');
    ws['E' + row] = createCell(vehicle.expenses, currStyle, 'n');
    ws['F' + row] = createCell(vehicle.efficiency, numStyle, 'n');
    ws['G' + row] = createCell(vehicle.costPerKm, currStyle, 'n');
    ws['H' + row] = createCell(vehicle.shifts, intStyle, 'n');
    row++;
  });

  // Set column widths
  setColumnWidths(ws, [16, 14, 10, 12, 10, 12, 12, 10]);

  // Set range
  ws['!ref'] = `A1:H${row}`;

  return ws;
};

/**
 * Creates a monthly data sheet
 * @param {Object} monthData - Monthly data object
 * @returns {Object} Worksheet
 */
export const createMonthlySheet = (monthData) => {
  const ws = {};
  let row = 1;

  const { monthYear, summary, traditionalShifts, deliveryShifts } = monthData;

  // Title
  ws['A' + row] = createCell(monthYear.toUpperCase(), styles.title);
  mergeCells(ws, `A${row}:P${row}`);
  row += 2;

  // Summary Section
  ws['A' + row] = createCell('MONTH SUMMARY', styles.sectionHeader);
  mergeCells(ws, `A${row}:H${row}`);
  row++;

  // Summary Row 1
  ws['A' + row] = createCell('Total Shifts', styles.label);
  ws['B' + row] = createCell(summary.totalShifts, styles.valueBold);
  ws['C' + row] = createCell('Traditional', styles.label);
  ws['D' + row] = createCell(summary.traditionalShifts, styles.value);
  ws['E' + row] = createCell('Delivery', styles.label);
  ws['F' + row] = createCell(summary.deliveryShifts, styles.value);
  ws['G' + row] = createCell('Total Hours', styles.label);
  ws['H' + row] = createCell(`${summary.totalHours}h`, styles.valueBold);
  row++;

  // Summary Row 2
  ws['A' + row] = createCell('Total Earned', styles.label);
  ws['B' + row] = createCell(summary.totalEarned, styles.currencyBold);
  ws['C' + row] = createCell('Net Earnings', styles.label);
  ws['D' + row] = createCell(summary.netEarnings, styles.currencyBold);
  ws['E' + row] = createCell('Avg/Shift', styles.label);
  ws['F' + row] = createCell(summary.averagePerShift, styles.currencyBold);
  ws['G' + row] = createCell('Avg/Hour', styles.label);
  ws['H' + row] = createCell(summary.averagePerHour, styles.currencyBold);
  row += 2;

  // Traditional Shifts Section
  if (traditionalShifts && traditionalShifts.length > 0) {
    ws['A' + row] = createCell('TRADITIONAL SHIFTS', styles.sectionHeaderBlue);
    mergeCells(ws, `A${row}:P${row}`);
    row++;

    // Headers - Row 1
    const headers = ['ID', 'Date', 'Day', 'Work', 'Start', 'End', 'Hours', 'Cross', 'Rate', 'Total', 'Day', 'Aftn', 'Night', 'Sat', 'Sun', 'Notes'];
    headers.forEach((header, index) => {
      const col = String.fromCharCode(65 + index);
      ws[col + row] = createCell(header, styles.tableHeader);
    });
    row++;

    // Data rows
    traditionalShifts.forEach((shift, index) => {
      const rowStyle = getRowStyle(index);
      const currStyle = index % 2 === 0 ? styles.currencyEven : styles.currencyOdd;
      const numStyle = index % 2 === 0 ? styles.numberEven : styles.numberOdd;
      const dateStyle = index % 2 === 0 ? styles.dateEven : styles.dateOdd;
      const centerStyle = index % 2 === 0 ? styles.cellEvenCenter : styles.cellOddCenter;
      const notesStyle = index % 2 === 0 ? styles.notesEven : styles.notesOdd;

      ws['A' + row] = createCell(shift.id, centerStyle);
      ws['B' + row] = createCell(shift.date, dateStyle);
      ws['C' + row] = createCell(shift.weekday.substring(0, 3), centerStyle);
      ws['D' + row] = createCell(shift.workName, rowStyle);
      ws['E' + row] = createCell(shift.startTime, centerStyle);
      ws['F' + row] = createCell(shift.endTime, centerStyle);
      ws['G' + row] = createCell(shift.hoursWorked, numStyle, 'n');
      ws['H' + row] = createCell(shift.crossesMidnight ? 'Yes' : 'No', centerStyle);
      ws['I' + row] = createCell(shift.rate, currStyle, 'n');
      ws['J' + row] = createCell(shift.earningsWithDiscount, currStyle, 'n');
      ws['K' + row] = createCell(shift.breakdown.day, currStyle, 'n');
      ws['L' + row] = createCell(shift.breakdown.afternoon, currStyle, 'n');
      ws['M' + row] = createCell(shift.breakdown.night, currStyle, 'n');
      ws['N' + row] = createCell(shift.breakdown.saturday, currStyle, 'n');
      ws['O' + row] = createCell(shift.breakdown.sunday, currStyle, 'n');
      ws['P' + row] = createCell(shift.notes || '', notesStyle);
      row++;
    });
    row++;
  }

  // Delivery Shifts Section
  if (deliveryShifts && deliveryShifts.length > 0) {
    ws['A' + row] = createCell('DELIVERY SHIFTS', styles.sectionHeaderGreen);
    mergeCells(ws, `A${row}:P${row}`);
    row++;

    // Headers
    const headers = ['ID', 'Date', 'Day', 'Work', 'Platform', 'Vehicle', 'Start', 'End', 'Hours', 'Orders', 'Base', 'Tips', 'Total', 'Km', 'Fuel', 'Net'];
    headers.forEach((header, index) => {
      const col = String.fromCharCode(65 + index);
      ws[col + row] = createCell(header, styles.tableHeaderGreen);
    });
    row++;

    // Data rows
    deliveryShifts.forEach((shift, index) => {
      const rowStyle = getRowStyle(index);
      const currStyle = index % 2 === 0 ? styles.currencyEven : styles.currencyOdd;
      const numStyle = index % 2 === 0 ? styles.numberEven : styles.numberOdd;
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
      ws['I' + row] = createCell(shift.hoursWorked, numStyle, 'n');
      ws['J' + row] = createCell(shift.orderCount, intStyle, 'n');
      ws['K' + row] = createCell(shift.baseEarnings, currStyle, 'n');
      ws['L' + row] = createCell(shift.tips, currStyle, 'n');
      ws['M' + row] = createCell(shift.totalEarnings, currStyle, 'n');
      ws['N' + row] = createCell(shift.kilometers, numStyle, 'n');
      ws['O' + row] = createCell(shift.fuelExpense, currStyle, 'n');
      ws['P' + row] = createCell(shift.netEarnings, currStyle, 'n');
      row++;
    });
  }

  // Set column widths
  setColumnWidths(ws, [10, 12, 6, 18, 12, 10, 7, 7, 8, 8, 10, 10, 10, 8, 10, 10]);

  // Set range
  ws['!ref'] = `A1:P${row}`;

  return ws;
};

/**
 * Creates all sheets for the workbook
 * @param {Object} reportData - Complete report data
 * @param {Object} options - Options including logo
 * @returns {Object} Object containing all worksheets
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

  // Monthly sheets
  if (reportData.monthlyData && reportData.monthlyData.length > 0) {
    reportData.monthlyData.forEach(monthData => {
      const sheetName = monthData.monthYear.substring(0, 12); // Limit sheet name length
      sheets[sheetName] = createMonthlySheet(monthData);
    });
  }

  return sheets;
};

export default {
  createOverviewSheet,
  createDeliverySheet,
  createMonthlySheet,
  createAllSheets
};
