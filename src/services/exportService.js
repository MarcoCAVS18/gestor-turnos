// src/services/exportService.js

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx-js-style';
import ***REMOVED*** getShiftGrossEarnings ***REMOVED*** from '../utils/shiftUtils';

// Function to format currency
const formatCurrency = (amount) => ***REMOVED***
  return `$$***REMOVED***amount.toFixed(2)***REMOVED***`;
***REMOVED***;

// Function to format date
const formatDate = (date) => ***REMOVED***
  return new Date(date).toLocaleDateString('en-US', ***REMOVED***
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  ***REMOVED***);
***REMOVED***;

// Function to format time
const formatTime = (time) => ***REMOVED***
  return time || 'N/A';
***REMOVED***;

// Function to calculate hours worked
const calculateHours = (startTime, endTime) => ***REMOVED***
  if (!startTime || !endTime) return 0;

  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const startInMinutes = startHour * 60 + startMin;
  const endInMinutes = endHour * 60 + endMin;

  const diffMinutes = endInMinutes - startInMinutes;
  return (diffMinutes / 60).toFixed(2);
***REMOVED***;

/**
 * Generate report in PDF format
 */
export const generatePDFReport = async (stats, shifts, works) => ***REMOVED***
  const doc = new jsPDF();
  
  // Font and color configuration
  const primaryColor = [236, 72, 153];
  const textColor = [50, 50, 50];
  const grayColor = [128, 128, 128];
  
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  
  // Main title
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.text('Activity Report', margin, yPosition);
  
  yPosition += 8;
  
  // Report date
  doc.setFontSize(10);
  doc.setTextColor(...grayColor);
  doc.text(`Generated on $***REMOVED***formatDate(new Date())***REMOVED***`, margin, yPosition);
  
  yPosition += 15;
  
  // Divider line
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  
  yPosition += 10;
  
  // SECTION: General Summary
  doc.setFontSize(16);
  doc.setTextColor(...textColor);
  doc.text('General Summary', margin, yPosition);
  
  yPosition += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(...textColor);
  
  const summaryData = [
    ['Total Earned:', formatCurrency(stats.totalEarned || 0)],
    ['Hours Worked:', `$***REMOVED***(stats.hoursWorked || 0).toFixed(1)***REMOVED***h`],
    ['Total Shifts:', stats.totalShifts || 0],
    ['Average per Hour:', formatCurrency(stats.averagePerHour || 0)]
  ];
  
  summaryData.forEach(([label, value]) => ***REMOVED***
    doc.text(label, margin + 5, yPosition);
    doc.setFont(undefined, 'bold');
    doc.text(String(value), margin + 70, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 7;
  ***REMOVED***);
  
  yPosition += 8;
  
  // SECTION: This Week
  doc.setFontSize(16);
  doc.text('This Week', margin, yPosition);
  
  yPosition += 10;
  
  doc.setFontSize(11);
  
  const weekData = [
    ['Earnings:', formatCurrency(stats.earningsThisWeek || 0)],
    ['Shifts:', stats.shiftsThisWeek || 0],
    ['Days Worked:', stats.daysWorked || 0]
  ];
  
  weekData.forEach(([label, value]) => ***REMOVED***
    doc.text(label, margin + 5, yPosition);
    doc.setFont(undefined, 'bold');
    doc.text(String(value), margin + 70, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 7;
  ***REMOVED***);
  
  yPosition += 8;
  
  // SECTION: Most Profitable Work
  if (stats.mostProfitableWork) ***REMOVED***
    doc.setFontSize(16);
    doc.text('Most Profitable Work', margin, yPosition);
    
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.text(stats.mostProfitableWork.work.name, margin + 5, yPosition);
    yPosition += 7;
    doc.setFont(undefined, 'bold');
    doc.text(formatCurrency(stats.mostProfitableWork.earnings), margin + 5, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 5;
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    doc.text(`$***REMOVED***stats.mostProfitableWork.shifts***REMOVED*** shifts • $***REMOVED***stats.mostProfitableWork.hours.toFixed(1)***REMOVED***h`, margin + 5, yPosition);
    doc.setTextColor(...textColor);
    
    yPosition += 10;
  ***REMOVED***
  
  // SECTION: Recent Shifts
  yPosition += 5;
  doc.setFontSize(16);
  doc.text('Recent Shifts', margin, yPosition);
  
  yPosition += 10;
  
  // Show last 5 shifts
  const recentShifts = shifts.slice(0, 5);
  
  doc.setFontSize(9);
  recentShifts.forEach((shift) => ***REMOVED***
    const work = works.find(w => w.id === shift.workId);
    if (!work) return;
    
    // Work name
    doc.setFont(undefined, 'bold');
    doc.text(work.name, margin + 5, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 5;
    
    // Shift details
    doc.setTextColor(...grayColor);
    const date = shift.startDate || shift.date;
    doc.text(`$***REMOVED***formatDate(date)***REMOVED*** • $***REMOVED***shift.startTime***REMOVED*** - $***REMOVED***shift.endTime***REMOVED***`, margin + 5, yPosition);
    doc.setTextColor(...textColor);
    
    yPosition += 8;
    
    // Check if we need a new page
    if (yPosition > 250) ***REMOVED***
      doc.addPage();
      yPosition = 20;
    ***REMOVED***
  ***REMOVED***);
  
  // Footer
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) ***REMOVED***
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text(
      `Page $***REMOVED***i***REMOVED*** of $***REMOVED***totalPages***REMOVED***`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      ***REMOVED*** align: 'center' ***REMOVED***
    );
  ***REMOVED***
  
  // Download PDF
  doc.save(`report-$***REMOVED***new Date().toISOString().split('T')[0]***REMOVED***.pdf`);
***REMOVED***;

// Helper function to calculate correct earnings
const calculateCorrectEarnings = (shift, work, calculatePayment) => ***REMOVED***
  if (!shift || !work) return 0;

  if (shift.type === 'delivery' || work.type === 'delivery') ***REMOVED***
    return getShiftGrossEarnings(shift);
  ***REMOVED***

  if (typeof calculatePayment === 'function') ***REMOVED***
    const result = calculatePayment(shift);
    return result.totalWithDiscount || result.totalConDescuento || 0;
  ***REMOVED***

  const hours = calculateHours(shift.startTime, shift.endTime);
  return hours * (work.baseRate || 0);
***REMOVED***;

// Styles for Excel
const styles = ***REMOVED***
  // Main header (section titles)
  mainHeader: ***REMOVED***
    font: ***REMOVED*** bold: true, size: 14, color: ***REMOVED*** rgb: "FFFFFF" ***REMOVED*** ***REMOVED***,
    fill: ***REMOVED*** fgColor: ***REMOVED*** rgb: "EC4899" ***REMOVED*** ***REMOVED***, // Pink
    alignment: ***REMOVED*** horizontal: "center", vertical: "center" ***REMOVED***,
    border: ***REMOVED***
      top: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "000000" ***REMOVED*** ***REMOVED***,
      bottom: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "000000" ***REMOVED*** ***REMOVED***,
      left: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "000000" ***REMOVED*** ***REMOVED***,
      right: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "000000" ***REMOVED*** ***REMOVED***
    ***REMOVED***
  ***REMOVED***,

  // Table header
  tableHeader: ***REMOVED***
    font: ***REMOVED*** bold: true, size: 11, color: ***REMOVED*** rgb: "FFFFFF" ***REMOVED*** ***REMOVED***,
    fill: ***REMOVED*** fgColor: ***REMOVED*** rgb: "4472C4" ***REMOVED*** ***REMOVED***, // Blue
    alignment: ***REMOVED*** horizontal: "center", vertical: "center", wrapText: true ***REMOVED***,
    border: ***REMOVED***
      top: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "000000" ***REMOVED*** ***REMOVED***,
      bottom: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "000000" ***REMOVED*** ***REMOVED***,
      left: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "000000" ***REMOVED*** ***REMOVED***,
      right: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "000000" ***REMOVED*** ***REMOVED***
    ***REMOVED***
  ***REMOVED***,

  // Subtitle (month summary)
  subtitle: ***REMOVED***
    font: ***REMOVED*** bold: true, size: 12, color: ***REMOVED*** rgb: "1F2937" ***REMOVED*** ***REMOVED***,
    fill: ***REMOVED*** fgColor: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***, // Light gray
    alignment: ***REMOVED*** horizontal: "left", vertical: "center" ***REMOVED***,
    border: ***REMOVED***
      bottom: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "9CA3AF" ***REMOVED*** ***REMOVED***
    ***REMOVED***
  ***REMOVED***,

  // Normal cell (even row - white)
  normalEvenCell: ***REMOVED***
    font: ***REMOVED*** size: 10, color: ***REMOVED*** rgb: "1F2937" ***REMOVED*** ***REMOVED***,
    fill: ***REMOVED*** fgColor: ***REMOVED*** rgb: "FFFFFF" ***REMOVED*** ***REMOVED***,
    alignment: ***REMOVED*** horizontal: "left", vertical: "center" ***REMOVED***,
    border: ***REMOVED***
      top: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***,
      bottom: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***,
      left: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***,
      right: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***
    ***REMOVED***
  ***REMOVED***,

  // Normal cell (odd row - light gray)
  normalOddCell: ***REMOVED***
    font: ***REMOVED*** size: 10, color: ***REMOVED*** rgb: "1F2937" ***REMOVED*** ***REMOVED***,
    fill: ***REMOVED*** fgColor: ***REMOVED*** rgb: "F9FAFB" ***REMOVED*** ***REMOVED***, // Very light gray
    alignment: ***REMOVED*** horizontal: "left", vertical: "center" ***REMOVED***,
    border: ***REMOVED***
      top: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***,
      bottom: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***,
      left: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***,
      right: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***
    ***REMOVED***
  ***REMOVED***,

  // Currency cell
  currencyCell: ***REMOVED***
    numFmt: "$#,##0.00"
  ***REMOVED***,

  // Decimal number cell
  decimalCell: ***REMOVED***
    numFmt: "0.00"
  ***REMOVED***,

  // Centered cell
  centeredCell: ***REMOVED***
    alignment: ***REMOVED*** horizontal: "center", vertical: "center" ***REMOVED***
  ***REMOVED***,

  // Label (for summary)
  label: ***REMOVED***
    font: ***REMOVED*** bold: true, size: 11, color: ***REMOVED*** rgb: "374151" ***REMOVED*** ***REMOVED***,
    alignment: ***REMOVED*** horizontal: "left", vertical: "center" ***REMOVED***
  ***REMOVED***,

  // Value (for summary)
  value: ***REMOVED***
    font: ***REMOVED*** size: 11, color: ***REMOVED*** rgb: "1F2937" ***REMOVED*** ***REMOVED***,
    alignment: ***REMOVED*** horizontal: "right", vertical: "center" ***REMOVED***
  ***REMOVED***
***REMOVED***;

// Function to apply style to a cell
const applyStyle = (worksheet, cell, style) => ***REMOVED***
  if (!worksheet[cell]) ***REMOVED***
    worksheet[cell] = ***REMOVED*** t: 's', v: '' ***REMOVED***;
  ***REMOVED***
  worksheet[cell].s = style;
***REMOVED***;

// Function to apply style to a range of cells
const applyStyleRange = (worksheet, rangeStart, rangeEnd, style) => ***REMOVED***
  const startCol = rangeStart.charCodeAt(0);
  const endCol = rangeEnd.charCodeAt(0);
  const startRow = parseInt(rangeStart.substring(1));
  const endRow = parseInt(rangeEnd.substring(1));

  for (let col = startCol; col <= endCol; col++) ***REMOVED***
    for (let row = startRow; row <= endRow; row++) ***REMOVED***
      const cell = String.fromCharCode(col) + row;
      applyStyle(worksheet, cell, style);
    ***REMOVED***
  ***REMOVED***
***REMOVED***;

// Function to merge cells
const mergeCells = (worksheet, range) => ***REMOVED***
  if (!worksheet['!merges']) ***REMOVED***
    worksheet['!merges'] = [];
  ***REMOVED***

  const match = range.match(/([A-Z]+)(\d+):([A-Z]+)(\d+)/);
  if (match) ***REMOVED***
    const [, colStart, rowStart, colEnd, rowEnd] = match;
    worksheet['!merges'].push(***REMOVED***
      s: ***REMOVED*** c: colStart.charCodeAt(0) - 65, r: parseInt(rowStart) - 1 ***REMOVED***,
      e: ***REMOVED*** c: colEnd.charCodeAt(0) - 65, r: parseInt(rowEnd) - 1 ***REMOVED***
    ***REMOVED***);
  ***REMOVED***
***REMOVED***;

/**
 * Generate report in XLSX format
 */
export const generateXLSXReport = async (stats, shifts, works, calculatePayment) => ***REMOVED***
  const workbook = XLSX.utils.book_new();

  const summarySheet = [
    ['ACTIVITY REPORT'],
    [`Generated on $***REMOVED***formatDate(new Date())***REMOVED***`],
    [],
    ['GENERAL SUMMARY'],
    ['Total Earned', formatCurrency(stats.totalEarned || 0)],
    ['Hours Worked', `$***REMOVED***(stats.hoursWorked || 0).toFixed(1)***REMOVED***h`],
    ['Total Shifts', stats.totalShifts || 0],
    ['Average per Hour', formatCurrency(stats.averagePerHour || 0)],
    [],
    ['THIS WEEK'],
    ['Earnings', formatCurrency(stats.earningsThisWeek || 0)],
    ['Shifts', stats.shiftsThisWeek || 0],
    ['Days Worked', stats.daysWorked || 0],
    [],
    ...(stats.mostProfitableWork ? [
      ['MOST PROFITABLE WORK'],
      ['Name', stats.mostProfitableWork.work.name],
      ['Earnings', formatCurrency(stats.mostProfitableWork.earnings)],
      ['Shifts', stats.mostProfitableWork.shifts],
      ['Hours', `$***REMOVED***stats.mostProfitableWork.hours.toFixed(1)***REMOVED***h`]
    ] : [])
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summarySheet);

  wsSummary['A1'].s = ***REMOVED***
    font: ***REMOVED*** bold: true, size: 16, color: ***REMOVED*** rgb: "EC4899" ***REMOVED*** ***REMOVED***,
    alignment: ***REMOVED*** horizontal: "center", vertical: "center" ***REMOVED***
  ***REMOVED***;

  wsSummary['A2'].s = ***REMOVED***
    font: ***REMOVED*** size: 10, color: ***REMOVED*** rgb: "6B7280" ***REMOVED***, italic: true ***REMOVED***,
    alignment: ***REMOVED*** horizontal: "center", vertical: "center" ***REMOVED***
  ***REMOVED***;

  ['A4', 'A10', 'A15'].forEach(cell => ***REMOVED***
    if (wsSummary[cell]) ***REMOVED***
      wsSummary[cell].s = styles.subtitle;
    ***REMOVED***
  ***REMOVED***);

  [[5, 8], [11, 13], [16, 19]].forEach(([start, end]) => ***REMOVED***
    for (let i = start; i <= end; i++) ***REMOVED***
      const cellA = `A$***REMOVED***i***REMOVED***`;
      const cellB = `B$***REMOVED***i***REMOVED***`;
      if (wsSummary[cellA]) ***REMOVED***
        wsSummary[cellA].s = styles.label;
      ***REMOVED***
      if (wsSummary[cellB]) ***REMOVED***
        wsSummary[cellB].s = styles.value;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);

  wsSummary['!cols'] = [
    ***REMOVED*** wch: 25 ***REMOVED***,
    ***REMOVED*** wch: 20 ***REMOVED***
  ];

  mergeCells(wsSummary, 'A1:B1');
  mergeCells(wsSummary, 'A2:B2');

  XLSX.utils.book_append_sheet(workbook, wsSummary, 'Summary');

  const shiftsByMonth = ***REMOVED******REMOVED***;

  const formatFirebaseDate = (date) => ***REMOVED***
    if (!date) return '';
    if (date.seconds) ***REMOVED***
      return formatDate(new Date(date.seconds * 1000));
    ***REMOVED***
    return formatDate(new Date(date));
  ***REMOVED***;

  shifts.forEach((shift) => ***REMOVED***
    const work = works.find(w => w.id === shift.workId);
    if (!work) return;

    const date = new Date(shift.startDate || shift.date);
    const monthYear = date.toLocaleDateString('en-US', ***REMOVED*** year: 'numeric', month: 'long' ***REMOVED***);

    if (!shiftsByMonth[monthYear]) ***REMOVED***
      shiftsByMonth[monthYear] = ***REMOVED*** traditional: [], delivery: [] ***REMOVED***;
    ***REMOVED***

    const isDelivery = shift.type === 'delivery' || work.type === 'delivery';

    const earnings = calculateCorrectEarnings(shift, work, calculatePayment);
    let hours = 0;
    let breakdown = null;

    if (isDelivery) ***REMOVED***
      hours = parseFloat(calculateHours(shift.startTime, shift.endTime));
    ***REMOVED*** else if (typeof calculatePayment === 'function') ***REMOVED***
      const result = calculatePayment(shift);
      hours = result.hours || 0;
      breakdown = result.breakdown || null;
    ***REMOVED*** else ***REMOVED***
      hours = parseFloat(calculateHours(shift.startTime, shift.endTime));
    ***REMOVED***

    const shiftBase = ***REMOVED***
      id: shift.id || '',
      date: formatDate(date),
      weekday: date.toLocaleDateString('en-US', ***REMOVED*** weekday: 'long' ***REMOVED***),
      company: work.name,
      startTime: formatTime(shift.startTime),
      endTime: formatTime(shift.endTime),
      hoursWorked: hours,
      crossesMidnight: shift.crossesMidnight ? 'Yes' : 'No',
      endDate: shift.endDate ? formatDate(new Date(shift.endDate)) : '',
      totalEarnings: earnings,
      observations: shift.observations || shift.notes || shift.description || '',
      createdAt: formatFirebaseDate(shift.createdAt),
      updatedAt: formatFirebaseDate(shift.updatedAt)
    ***REMOVED***;

    if (isDelivery) ***REMOVED***
      const deliveryShift = ***REMOVED***
        ...shiftBase,
        platform: work.platform || '',
        vehicle: work.vehicle || '',
        orderCount: shift.orderCount || 0,
        tips: shift.tips || 0,
        kilometers: shift.kilometers || 0,
        fuelExpense: shift.fuelExpense || 0,
        baseEarnings: shift.baseEarnings || 0,
        netEarnings: earnings - (shift.fuelExpense || 0),
        averagePerOrder: shift.orderCount > 0 ? earnings / shift.orderCount : 0
      ***REMOVED***;
      shiftsByMonth[monthYear].delivery.push(deliveryShift);
    ***REMOVED*** else ***REMOVED***
      const traditionalShift = ***REMOVED***
        ...shiftBase,
        rate: work.rate || work.baseRate || 0,
        breakdown: breakdown
      ***REMOVED***;
      shiftsByMonth[monthYear].traditional.push(traditionalShift);
    ***REMOVED***
  ***REMOVED***);

  const sortedMonths = Object.keys(shiftsByMonth).sort((a, b) => ***REMOVED***
    const [monthA, yearA] = a.split(' of ');
    const [monthB, yearB] = b.split(' of ');
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const dateA = new Date(parseInt(yearA), months.indexOf(monthA.toLowerCase()));
    const dateB = new Date(parseInt(yearB), months.indexOf(monthB.toLowerCase()));
    return dateB - dateA;
  ***REMOVED***);

  sortedMonths.forEach((monthYear) => ***REMOVED***
    const ***REMOVED*** traditional, delivery ***REMOVED*** = shiftsByMonth[monthYear];
    const allShifts = [...traditional, ...delivery];

    const totalMonthHours = allShifts.reduce((sum, t) => sum + t.hoursWorked, 0);
    const totalMonthEarnings = allShifts.reduce((sum, t) => sum + t.totalEarnings, 0);
    const totalOrders = delivery.reduce((sum, t) => sum + t.orderCount, 0);
    const totalTips = delivery.reduce((sum, t) => sum + t.tips, 0);
    const totalExpenses = delivery.reduce((sum, t) => sum + t.fuelExpense, 0);

    const monthData = [
      [monthYear.toUpperCase()],
      [],
      ['MONTH SUMMARY'],
      ['Total Shifts', allShifts.length],
      ['Traditional Shifts', traditional.length],
      ['Delivery Shifts', delivery.length],
      ['Total Hours Worked', `$***REMOVED***totalMonthHours.toFixed(2)***REMOVED***h`],
      ['Total Earned', formatCurrency(totalMonthEarnings)],
      ['Average per Shift', formatCurrency(allShifts.length > 0 ? totalMonthEarnings / allShifts.length : 0)],
      ['Average per Hour', formatCurrency(totalMonthHours > 0 ? totalMonthEarnings / totalMonthHours : 0)],
      ...(delivery.length > 0 ? [
        ['Total Orders', totalOrders],
        ['Total Tips', formatCurrency(totalTips)],
        ['Total Expenses', formatCurrency(totalExpenses)],
        ['Net Earnings', formatCurrency(totalMonthEarnings - totalExpenses)]
      ] : []),
      []
    ];

    if (traditional.length > 0) ***REMOVED***
      monthData.push(
        ['TRADITIONAL SHIFTS'],
        [],
        [
          'Shift ID',
          'Date',
          'Weekday',
          'Company',
          'Start Time',
          'End Time',
          'Hours Worked',
          'Crosses Midnight',
          'End Date',
          'Rate/Hour',
          'Total Earnings',
          'Day',
          'Afternoon',
          'Night',
          'Saturday',
          'Sunday',
          'Observations',
          'Created At',
          'Updated At'
        ]
      );

      traditional.forEach((shift) => ***REMOVED***
        const breakdown = shift.breakdown || ***REMOVED******REMOVED***;
        monthData.push([
          shift.id,
          shift.date,
          shift.weekday,
          shift.company,
          shift.startTime,
          shift.endTime,
          shift.hoursWorked,
          shift.crossesMidnight,
          shift.endDate,
          formatCurrency(shift.rate),
          formatCurrency(shift.totalEarnings),
          breakdown.day ? formatCurrency(breakdown.day) : '',
          breakdown.afternoon ? formatCurrency(breakdown.afternoon) : '',
          breakdown.night ? formatCurrency(breakdown.night) : '',
          breakdown.saturday ? formatCurrency(breakdown.saturday) : '',
          breakdown.sunday ? formatCurrency(breakdown.sunday) : '',
          shift.observations,
          shift.createdAt,
          shift.updatedAt
        ]);
      ***REMOVED***);

      monthData.push([]);
    ***REMOVED***

    if (delivery.length > 0) ***REMOVED***
      monthData.push(
        ['DELIVERY SHIFTS'],
        [],
        [
          'Shift ID',
          'Date',
          'Weekday',
          'Company',
          'Platform',
          'Vehicle',
          'Start Time',
          'End Time',
          'Hours Worked',
          'Crosses Midnight',
          'End Date',
          '# Orders',
          'Total Earnings',
          'Base Earnings',
          'Tips',
          'Kilometers',
          'Fuel Expense',
          'Net Earnings',
          'Avg/Order',
          'Observations',
          'Created At',
          'Updated At'
        ]
      );

      delivery.forEach((shift) => ***REMOVED***
        monthData.push([
          shift.id,
          shift.date,
          shift.weekday,
          shift.company,
          shift.platform,
          shift.vehicle,
          shift.startTime,
          shift.endTime,
          shift.hoursWorked,
          shift.crossesMidnight,
          shift.endDate,
          shift.orderCount,
          formatCurrency(shift.totalEarnings),
          formatCurrency(shift.baseEarnings),
          formatCurrency(shift.tips),
          shift.kilometers,
          formatCurrency(shift.fuelExpense),
          formatCurrency(shift.netEarnings),
          formatCurrency(shift.averagePerOrder),
          shift.observations,
          shift.createdAt,
          shift.updatedAt
        ]);
      ***REMOVED***);
    ***REMOVED***

    const wsMonth = XLSX.utils.aoa_to_sheet(monthData);

    // Apply styles and merge cells
    applyStyle(wsMonth, 'A1', styles.mainHeader);
    mergeCells(wsMonth, 'A1:V1');

    let currentRow = 3; // Starts after title and space
    applyStyle(wsMonth, `A$***REMOVED***currentRow***REMOVED***`, styles.subtitle);
    mergeCells(wsMonth, `A$***REMOVED***currentRow***REMOVED***:D$***REMOVED***currentRow***REMOVED***`);

    currentRow += 1;
    applyStyleRange(wsMonth, `A$***REMOVED***currentRow***REMOVED***`, `B$***REMOVED***currentRow + 6***REMOVED***`, styles.label);
    applyStyleRange(wsMonth, `C$***REMOVED***currentRow***REMOVED***`, `D$***REMOVED***currentRow + 6***REMOVED***`, styles.value);

    if (delivery.length > 0) ***REMOVED***
      applyStyleRange(wsMonth, `A$***REMOVED***currentRow + 7***REMOVED***`, `B$***REMOVED***currentRow + 10***REMOVED***`, styles.label);
      applyStyleRange(wsMonth, `C$***REMOVED***currentRow + 7***REMOVED***`, `D$***REMOVED***currentRow + 10***REMOVED***`, styles.value);
      currentRow += 12;
    ***REMOVED*** else ***REMOVED***
      currentRow += 8;
    ***REMOVED***

    if (traditional.length > 0) ***REMOVED***
      applyStyle(wsMonth, `A$***REMOVED***currentRow***REMOVED***`, styles.mainHeader);
      mergeCells(wsMonth, `A$***REMOVED***currentRow***REMOVED***:S$***REMOVED***currentRow***REMOVED***`);
      currentRow += 2;
      applyStyleRange(wsMonth, `A$***REMOVED***currentRow***REMOVED***`, `S$***REMOVED***currentRow***REMOVED***`, styles.tableHeader);
      currentRow += traditional.length + 1;
    ***REMOVED***

    if (delivery.length > 0) ***REMOVED***
      if (traditional.length > 0) currentRow += 1;
      applyStyle(wsMonth, `A$***REMOVED***currentRow***REMOVED***`, styles.mainHeader);
      mergeCells(wsMonth, `A$***REMOVED***currentRow***REMOVED***:V$***REMOVED***currentRow***REMOVED***`);
      currentRow += 2;
      applyStyleRange(wsMonth, `A$***REMOVED***currentRow***REMOVED***`, `V$***REMOVED***currentRow***REMOVED***`, styles.tableHeader);
    ***REMOVED***
    
    wsMonth['!cols'] = [
      ***REMOVED*** wch: 15 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 20 ***REMOVED***,
      ***REMOVED*** wch: 15 ***REMOVED***,
      ***REMOVED*** wch: 15 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 10 ***REMOVED***,
      ***REMOVED*** wch: 15 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 10 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 10 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 30 ***REMOVED***,
      ***REMOVED*** wch: 15 ***REMOVED***,
      ***REMOVED*** wch: 15 ***REMOVED***
    ];

    const sheetName = monthYear.substring(0, 31);
    XLSX.utils.book_append_sheet(workbook, wsMonth, sheetName);
  ***REMOVED***);

  XLSX.writeFile(workbook, `detailed-report-$***REMOVED***new Date().toISOString().split('T')[0]***REMOVED***.xlsx`);
***REMOVED***;

/**
 * Generate report in TXT format
 */
export const generateTXTReport = async (stats, shifts, works) => ***REMOVED***
  const date = new Date().toISOString().split('T')[0];
  let content = '';

  // Header
  content += '═'.repeat(80) + '\n';
  content += 'ACTIVITY REPORT\n';
  content += `Generated on $***REMOVED***formatDate(new Date())***REMOVED***\n`;
  content += '═'.repeat(80) + '\n\n';

  // General Summary
  content += 'GENERAL SUMMARY\n';
  content += '─'.repeat(80) + '\n';
  content += `Total Earned:           $***REMOVED***formatCurrency(stats.totalEarned || 0)***REMOVED***\n`;
  content += `Hours Worked:       $***REMOVED***(stats.hoursWorked || 0).toFixed(1)***REMOVED***h\n`;
  content += `Total Shifts:        $***REMOVED***stats.totalShifts || 0***REMOVED***\n`;
  content += `Average per Hour:      $***REMOVED***formatCurrency(stats.averagePerHour || 0)***REMOVED***\n\n`;

  // This Week
  content += 'THIS WEEK\n';
  content += '─'.repeat(80) + '\n';
  content += `Earnings:              $***REMOVED***formatCurrency(stats.earningsThisWeek || 0)***REMOVED***\n`;
  content += `Shifts:                 $***REMOVED***stats.shiftsThisWeek || 0***REMOVED***\n`;
  content += `Days Worked:        $***REMOVED***stats.daysWorked || 0***REMOVED***\n\n`;

  // Most Profitable Work
  if (stats.mostProfitableWork) ***REMOVED***
    content += 'MOST PROFITABLE WORK\n';
    content += '─'.repeat(80) + '\n';
    content += `Name:                 $***REMOVED***stats.mostProfitableWork.work.name***REMOVED***\n`;
    content += `Earnings:               $***REMOVED***formatCurrency(stats.mostProfitableWork.earnings)***REMOVED***\n`;
    content += `Shifts:                 $***REMOVED***stats.mostProfitableWork.shifts***REMOVED***\n`;
    content += `Hours:                  $***REMOVED***stats.mostProfitableWork.hours.toFixed(1)***REMOVED***h\n\n`;
  ***REMOVED***

  // Shift Details
  content += 'SHIFT DETAILS\n';
  content += '═'.repeat(80) + '\n';
  content += 'Date        Work                   Start   End      Hours    Earnings    \n';
  content += '─'.repeat(80) + '\n';

  shifts.forEach((shift) => ***REMOVED***
    const work = works.find(w => w.id === shift.workId);
    if (!work) return;

    const dateFormat = formatDate(shift.startDate || shift.date);
    const hours = calculateHours(shift.startTime, shift.endTime);
    let earnings = 0;
    if (shift.type === 'delivery') ***REMOVED***
      earnings = getShiftGrossEarnings(shift);
    ***REMOVED*** else ***REMOVED***
      // For non-delivery shifts, we can't be sure without calculatePayment.
      // We'll use totalEarnings if it exists.
      earnings = shift.totalEarnings || 0;
    ***REMOVED***

    const datePad = dateFormat.padEnd(12, ' ');
    const workPad = work.name.substring(0, 24).padEnd(25, ' ');
    const startPad = formatTime(shift.startTime).padEnd(8, ' ');
    const endPad = formatTime(shift.endTime).padEnd(8, ' ');
    const hoursPad = String(hours).padEnd(8, ' ');
    const earningsPad = formatCurrency(earnings).padEnd(12, ' ');

    content += `$***REMOVED***datePad***REMOVED*** $***REMOVED***workPad***REMOVED*** $***REMOVED***startPad***REMOVED*** $***REMOVED***endPad***REMOVED*** $***REMOVED***hoursPad***REMOVED*** $***REMOVED***earningsPad***REMOVED***\n`;
  ***REMOVED***);

  content += '═'.repeat(80) + '\n';

  // Create blob and download
  const blob = new Blob([content], ***REMOVED*** type: 'text/plain;charset=utf-8' ***REMOVED***);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `report-$***REMOVED***date***REMOVED***.txt`;
  link.click();
  URL.revokeObjectURL(url);
***REMOVED***;

/**
 * Generate report in PNG format
 */
export const generatePNGReport = async (stats, shifts, works) => ***REMOVED***
  // Create temporary element in DOM
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '800px';
  container.style.padding = '40px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  
  // HTML report content
  container.innerHTML = `
    <div style="max-width: 800px;">
      <!-- Header -->
      <div style="margin-bottom: 30px;">
        <h1 style="color: #EC4899; font-size: 32px; margin-bottom: 8px;">Activity Report</h1>
        <p style="color: #6B7280; font-size: 14px;">Generated on $***REMOVED***formatDate(new Date())***REMOVED***</p>
      </div>
      
      <div style="height: 2px; background: linear-gradient(to right, #EC4899, transparent); margin-bottom: 30px;"></div>
      
      <!-- General Summary -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">General Summary</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 5px;">Total Earned</p>
            <p style="color: #1F2937; font-size: 24px; font-weight: bold;">$***REMOVED***formatCurrency(stats.totalEarned || 0)***REMOVED***</p>
          </div>
          <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 5px;">Hours Worked</p>
            <p style="color: #1F2937; font-size: 24px; font-weight: bold;">$***REMOVED***(stats.hoursWorked || 0).toFixed(1)***REMOVED***h</p>
          </div>
          <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 5px;">Total Shifts</p>
            <p style="color: #1F2937; font-size: 24px; font-weight: bold;">$***REMOVED***stats.totalShifts || 0***REMOVED***</p>
          </div>
          <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 5px;">Average/Hour</p>
            <p style="color: #1F2937; font-size: 24px; font-weight: bold;">$***REMOVED***formatCurrency(stats.averagePerHour || 0)***REMOVED***</p>
          </div>
        </div>
      </div>
      
      <!-- This Week -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">This Week</h2>
        <div style="background: #FDF2F8; padding: 20px; border-radius: 8px; border-left: 4px solid #EC4899;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #6B7280;">Earnings:</span>
            <span style="color: #1F2937; font-weight: bold;">$***REMOVED***formatCurrency(stats.earningsThisWeek || 0)***REMOVED***</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #6B7280;">Shifts:</span>
            <span style="color: #1F2937; font-weight: bold;">$***REMOVED***stats.shiftsThisWeek || 0***REMOVED***</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6B7280;">Days Worked:</span>
            <span style="color: #1F2937; font-weight: bold;">$***REMOVED***stats.daysWorked || 0***REMOVED***</span>
          </div>
        </div>
      </div>
      
      <!-- Most Profitable Work -->
      $***REMOVED***stats.mostProfitableWork ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">Most Profitable Work</h2>
          <div style="background: #FFFBEB; padding: 20px; border-radius: 8px; border-left: 4px solid #F59E0B;">
            <p style="color: #1F2937; font-size: 18px; font-weight: bold; margin-bottom: 5px;">$***REMOVED***stats.mostProfitableWork.work.name***REMOVED***</p>
            <p style="color: #F59E0B; font-size: 24px; font-weight: bold; margin-bottom: 5px;">$***REMOVED***formatCurrency(stats.mostProfitableWork.earnings)***REMOVED***</p>
            <p style="color: #6B7280; font-size: 12px;">$***REMOVED***stats.mostProfitableWork.shifts***REMOVED*** shifts • $***REMOVED***stats.mostProfitableWork.hours.toFixed(1)***REMOVED***h</p>
          </div>
        </div>
      ` : ''***REMOVED***
      
      <!-- Recent Shifts -->
      <div>
        <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">Recent Shifts</h2>
        <div style="space-y: 10px;">
          $***REMOVED***shifts.slice(0, 5).map(shift => ***REMOVED***
            const work = works.find(w => w.id === shift.workId);
            if (!work) return '';
            const date = shift.startDate || shift.date;
            return `
              <div style="background: #F9FAFB; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                <p style="color: #1F2937; font-weight: bold; margin-bottom: 5px;">$***REMOVED***work.name***REMOVED***</p>
                <p style="color: #6B7280; font-size: 14px;">$***REMOVED***formatDate(date)***REMOVED*** • $***REMOVED***shift.startTime***REMOVED*** - $***REMOVED***shift.endTime***REMOVED***</p>
              </div>
            `;
          ***REMOVED***).join('')***REMOVED***
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(container);
  
  try ***REMOVED***
    // Generate canvas from HTML
    const canvas = await html2canvas(container, ***REMOVED***
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false
    ***REMOVED***);
    
    // Convert to image and download
    canvas.toBlob((blob) => ***REMOVED***
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-$***REMOVED***new Date().toISOString().split('T')[0]***REMOVED***.png`;
      link.click();
      URL.revokeObjectURL(url);
    ***REMOVED***);
  ***REMOVED*** finally ***REMOVED***
    // Clean up temporary element
    document.body.removeChild(container);
  ***REMOVED***
***REMOVED***;