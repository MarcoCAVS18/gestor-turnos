// src/services/exportService.js

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx-js-style';
import { getShiftGrossEarnings } from '../utils/shiftUtils';

// Function to format currency
const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`;
};

// Function to format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Function to format time
const formatTime = (time) => {
  return time || 'N/A';
};

// Function to calculate hours worked
const calculateHours = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;

  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const startInMinutes = startHour * 60 + startMin;
  const endInMinutes = endHour * 60 + endMin;

  const diffMinutes = endInMinutes - startInMinutes;
  return (diffMinutes / 60).toFixed(2);
};

/**
 * Generate report in PDF format
 */
export const generatePDFReport = async (stats, shifts, works) => {
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
  doc.text(`Generated on ${formatDate(new Date())}`, margin, yPosition);
  
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
    ['Hours Worked:', `${(stats.hoursWorked || 0).toFixed(1)}h`],
    ['Total Shifts:', stats.totalShifts || 0],
    ['Average per Hour:', formatCurrency(stats.averagePerHour || 0)]
  ];
  
  summaryData.forEach(([label, value]) => {
    doc.text(label, margin + 5, yPosition);
    doc.setFont(undefined, 'bold');
    doc.text(String(value), margin + 70, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 7;
  });
  
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
  
  weekData.forEach(([label, value]) => {
    doc.text(label, margin + 5, yPosition);
    doc.setFont(undefined, 'bold');
    doc.text(String(value), margin + 70, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 7;
  });
  
  yPosition += 8;
  
  // SECTION: Most Profitable Work
  if (stats.mostProfitableWork) {
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
    doc.text(`${stats.mostProfitableWork.shifts} shifts • ${stats.mostProfitableWork.hours.toFixed(1)}h`, margin + 5, yPosition);
    doc.setTextColor(...textColor);
    
    yPosition += 10;
  }
  
  // SECTION: Recent Shifts
  yPosition += 5;
  doc.setFontSize(16);
  doc.text('Recent Shifts', margin, yPosition);
  
  yPosition += 10;
  
  // Show last 5 shifts
  const recentShifts = shifts.slice(0, 5);
  
  doc.setFontSize(9);
  recentShifts.forEach((shift) => {
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
    doc.text(`${formatDate(date)} • ${shift.startTime} - ${shift.endTime}`, margin + 5, yPosition);
    doc.setTextColor(...textColor);
    
    yPosition += 8;
    
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
  });
  
  // Footer
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Download PDF
  doc.save(`report-${new Date().toISOString().split('T')[0]}.pdf`);
};

// Helper function to calculate correct earnings
const calculateCorrectEarnings = (shift, work, calculatePayment) => {
  if (!shift || !work) return 0;

  if (shift.type === 'delivery' || work.type === 'delivery') {
    return getShiftGrossEarnings(shift);
  }

  if (typeof calculatePayment === 'function') {
    const result = calculatePayment(shift);
    return result.totalWithDiscount || result.totalConDescuento || 0;
  }

  const hours = calculateHours(shift.startTime, shift.endTime);
  return hours * (work.baseRate || 0);
};

// Styles for Excel
const styles = {
  // Main header (section titles)
  mainHeader: {
    font: { bold: true, size: 14, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "EC4899" } }, // Pink
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  },

  // Table header
  tableHeader: {
    font: { bold: true, size: 11, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "4472C4" } }, // Blue
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  },

  // Subtitle (month summary)
  subtitle: {
    font: { bold: true, size: 12, color: { rgb: "1F2937" } },
    fill: { fgColor: { rgb: "E5E7EB" } }, // Light gray
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      bottom: { style: "thin", color: { rgb: "9CA3AF" } }
    }
  },

  // Normal cell (even row - white)
  normalEvenCell: {
    font: { size: 10, color: { rgb: "1F2937" } },
    fill: { fgColor: { rgb: "FFFFFF" } },
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "E5E7EB" } },
      bottom: { style: "thin", color: { rgb: "E5E7EB" } },
      left: { style: "thin", color: { rgb: "E5E7EB" } },
      right: { style: "thin", color: { rgb: "E5E7EB" } }
    }
  },

  // Normal cell (odd row - light gray)
  normalOddCell: {
    font: { size: 10, color: { rgb: "1F2937" } },
    fill: { fgColor: { rgb: "F9FAFB" } }, // Very light gray
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "E5E7EB" } },
      bottom: { style: "thin", color: { rgb: "E5E7EB" } },
      left: { style: "thin", color: { rgb: "E5E7EB" } },
      right: { style: "thin", color: { rgb: "E5E7EB" } }
    }
  },

  // Currency cell
  currencyCell: {
    numFmt: "$#,##0.00"
  },

  // Decimal number cell
  decimalCell: {
    numFmt: "0.00"
  },

  // Centered cell
  centeredCell: {
    alignment: { horizontal: "center", vertical: "center" }
  },

  // Label (for summary)
  label: {
    font: { bold: true, size: 11, color: { rgb: "374151" } },
    alignment: { horizontal: "left", vertical: "center" }
  },

  // Value (for summary)
  value: {
    font: { size: 11, color: { rgb: "1F2937" } },
    alignment: { horizontal: "right", vertical: "center" }
  }
};

// Function to apply style to a cell
const applyStyle = (worksheet, cell, style) => {
  if (!worksheet[cell]) {
    worksheet[cell] = { t: 's', v: '' };
  }
  worksheet[cell].s = style;
};

// Function to apply style to a range of cells
const applyStyleRange = (worksheet, rangeStart, rangeEnd, style) => {
  const startCol = rangeStart.charCodeAt(0);
  const endCol = rangeEnd.charCodeAt(0);
  const startRow = parseInt(rangeStart.substring(1));
  const endRow = parseInt(rangeEnd.substring(1));

  for (let col = startCol; col <= endCol; col++) {
    for (let row = startRow; row <= endRow; row++) {
      const cell = String.fromCharCode(col) + row;
      applyStyle(worksheet, cell, style);
    }
  }
};

// Function to merge cells
const mergeCells = (worksheet, range) => {
  if (!worksheet['!merges']) {
    worksheet['!merges'] = [];
  }

  const match = range.match(/([A-Z]+)(\d+):([A-Z]+)(\d+)/);
  if (match) {
    const [, colStart, rowStart, colEnd, rowEnd] = match;
    worksheet['!merges'].push({
      s: { c: colStart.charCodeAt(0) - 65, r: parseInt(rowStart) - 1 },
      e: { c: colEnd.charCodeAt(0) - 65, r: parseInt(rowEnd) - 1 }
    });
  }
};

/**
 * Generate report in XLSX format
 */
export const generateXLSXReport = async (stats, shifts, works, calculatePayment) => {
  const workbook = XLSX.utils.book_new();

  const summarySheet = [
    ['ACTIVITY REPORT'],
    [`Generated on ${formatDate(new Date())}`],
    [],
    ['GENERAL SUMMARY'],
    ['Total Earned', formatCurrency(stats.totalEarned || 0)],
    ['Hours Worked', `${(stats.hoursWorked || 0).toFixed(1)}h`],
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
      ['Hours', `${stats.mostProfitableWork.hours.toFixed(1)}h`]
    ] : [])
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summarySheet);

  wsSummary['A1'].s = {
    font: { bold: true, size: 16, color: { rgb: "EC4899" } },
    alignment: { horizontal: "center", vertical: "center" }
  };

  wsSummary['A2'].s = {
    font: { size: 10, color: { rgb: "6B7280" }, italic: true },
    alignment: { horizontal: "center", vertical: "center" }
  };

  ['A4', 'A10', 'A15'].forEach(cell => {
    if (wsSummary[cell]) {
      wsSummary[cell].s = styles.subtitle;
    }
  });

  [[5, 8], [11, 13], [16, 19]].forEach(([start, end]) => {
    for (let i = start; i <= end; i++) {
      const cellA = `A${i}`;
      const cellB = `B${i}`;
      if (wsSummary[cellA]) {
        wsSummary[cellA].s = styles.label;
      }
      if (wsSummary[cellB]) {
        wsSummary[cellB].s = styles.value;
      }
    }
  });

  wsSummary['!cols'] = [
    { wch: 25 },
    { wch: 20 }
  ];

  mergeCells(wsSummary, 'A1:B1');
  mergeCells(wsSummary, 'A2:B2');

  XLSX.utils.book_append_sheet(workbook, wsSummary, 'Summary');

  const shiftsByMonth = {};

  const formatFirebaseDate = (date) => {
    if (!date) return '';
    if (date.seconds) {
      return formatDate(new Date(date.seconds * 1000));
    }
    return formatDate(new Date(date));
  };

  shifts.forEach((shift) => {
    const work = works.find(w => w.id === shift.workId);
    if (!work) return;

    const date = new Date(shift.startDate || shift.date);
    const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    if (!shiftsByMonth[monthYear]) {
      shiftsByMonth[monthYear] = { traditional: [], delivery: [] };
    }

    const isDelivery = shift.type === 'delivery' || work.type === 'delivery';

    const earnings = calculateCorrectEarnings(shift, work, calculatePayment);
    let hours = 0;
    let breakdown = null;

    if (isDelivery) {
      hours = parseFloat(calculateHours(shift.startTime, shift.endTime));
    } else if (typeof calculatePayment === 'function') {
      const result = calculatePayment(shift);
      hours = result.hours || 0;
      breakdown = result.breakdown || null;
    } else {
      hours = parseFloat(calculateHours(shift.startTime, shift.endTime));
    }

    const shiftBase = {
      id: shift.id || '',
      date: formatDate(date),
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
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
    };

    if (isDelivery) {
      const deliveryShift = {
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
      };
      shiftsByMonth[monthYear].delivery.push(deliveryShift);
    } else {
      const traditionalShift = {
        ...shiftBase,
        rate: work.rate || work.baseRate || 0,
        breakdown: breakdown
      };
      shiftsByMonth[monthYear].traditional.push(traditionalShift);
    }
  });

  const sortedMonths = Object.keys(shiftsByMonth).sort((a, b) => {
    const [monthA, yearA] = a.split(' of ');
    const [monthB, yearB] = b.split(' of ');
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const dateA = new Date(parseInt(yearA), months.indexOf(monthA.toLowerCase()));
    const dateB = new Date(parseInt(yearB), months.indexOf(monthB.toLowerCase()));
    return dateB - dateA;
  });

  sortedMonths.forEach((monthYear) => {
    const { traditional, delivery } = shiftsByMonth[monthYear];
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
      ['Total Hours Worked', `${totalMonthHours.toFixed(2)}h`],
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

    if (traditional.length > 0) {
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

      traditional.forEach((shift) => {
        const breakdown = shift.breakdown || {};
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
      });

      monthData.push([]);
    }

    if (delivery.length > 0) {
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

      delivery.forEach((shift) => {
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
      });
    }

    const wsMonth = XLSX.utils.aoa_to_sheet(monthData);

    // Apply styles and merge cells
    applyStyle(wsMonth, 'A1', styles.mainHeader);
    mergeCells(wsMonth, 'A1:V1');

    let currentRow = 3; // Starts after title and space
    applyStyle(wsMonth, `A${currentRow}`, styles.subtitle);
    mergeCells(wsMonth, `A${currentRow}:D${currentRow}`);

    currentRow += 1;
    applyStyleRange(wsMonth, `A${currentRow}`, `B${currentRow + 6}`, styles.label);
    applyStyleRange(wsMonth, `C${currentRow}`, `D${currentRow + 6}`, styles.value);

    if (delivery.length > 0) {
      applyStyleRange(wsMonth, `A${currentRow + 7}`, `B${currentRow + 10}`, styles.label);
      applyStyleRange(wsMonth, `C${currentRow + 7}`, `D${currentRow + 10}`, styles.value);
      currentRow += 12;
    } else {
      currentRow += 8;
    }

    if (traditional.length > 0) {
      applyStyle(wsMonth, `A${currentRow}`, styles.mainHeader);
      mergeCells(wsMonth, `A${currentRow}:S${currentRow}`);
      currentRow += 2;
      applyStyleRange(wsMonth, `A${currentRow}`, `S${currentRow}`, styles.tableHeader);
      currentRow += traditional.length + 1;
    }

    if (delivery.length > 0) {
      if (traditional.length > 0) currentRow += 1;
      applyStyle(wsMonth, `A${currentRow}`, styles.mainHeader);
      mergeCells(wsMonth, `A${currentRow}:V${currentRow}`);
      currentRow += 2;
      applyStyleRange(wsMonth, `A${currentRow}`, `V${currentRow}`, styles.tableHeader);
    }
    
    wsMonth['!cols'] = [
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 10 },
      { wch: 15 },
      { wch: 12 },
      { wch: 10 },
      { wch: 12 },
      { wch: 12 },
      { wch: 10 },
      { wch: 12 },
      { wch: 12 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 }
    ];

    const sheetName = monthYear.substring(0, 31);
    XLSX.utils.book_append_sheet(workbook, wsMonth, sheetName);
  });

  XLSX.writeFile(workbook, `detailed-report-${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Generate report in TXT format
 */
export const generateTXTReport = async (stats, shifts, works) => {
  const date = new Date().toISOString().split('T')[0];
  let content = '';

  // Header
  content += '═'.repeat(80) + '\n';
  content += 'ACTIVITY REPORT\n';
  content += `Generated on ${formatDate(new Date())}\n`;
  content += '═'.repeat(80) + '\n\n';

  // General Summary
  content += 'GENERAL SUMMARY\n';
  content += '─'.repeat(80) + '\n';
  content += `Total Earned:           ${formatCurrency(stats.totalEarned || 0)}\n`;
  content += `Hours Worked:       ${(stats.hoursWorked || 0).toFixed(1)}h\n`;
  content += `Total Shifts:        ${stats.totalShifts || 0}\n`;
  content += `Average per Hour:      ${formatCurrency(stats.averagePerHour || 0)}\n\n`;

  // This Week
  content += 'THIS WEEK\n';
  content += '─'.repeat(80) + '\n';
  content += `Earnings:              ${formatCurrency(stats.earningsThisWeek || 0)}\n`;
  content += `Shifts:                 ${stats.shiftsThisWeek || 0}\n`;
  content += `Days Worked:        ${stats.daysWorked || 0}\n\n`;

  // Most Profitable Work
  if (stats.mostProfitableWork) {
    content += 'MOST PROFITABLE WORK\n';
    content += '─'.repeat(80) + '\n';
    content += `Name:                 ${stats.mostProfitableWork.work.name}\n`;
    content += `Earnings:               ${formatCurrency(stats.mostProfitableWork.earnings)}\n`;
    content += `Shifts:                 ${stats.mostProfitableWork.shifts}\n`;
    content += `Hours:                  ${stats.mostProfitableWork.hours.toFixed(1)}h\n\n`;
  }

  // Shift Details
  content += 'SHIFT DETAILS\n';
  content += '═'.repeat(80) + '\n';
  content += 'Date        Work                   Start   End      Hours    Earnings    \n';
  content += '─'.repeat(80) + '\n';

  shifts.forEach((shift) => {
    const work = works.find(w => w.id === shift.workId);
    if (!work) return;

    const dateFormat = formatDate(shift.startDate || shift.date);
    const hours = calculateHours(shift.startTime, shift.endTime);
    let earnings = 0;
    if (shift.type === 'delivery') {
      earnings = getShiftGrossEarnings(shift);
    } else {
      // For non-delivery shifts, we can't be sure without calculatePayment.
      // We'll use totalEarnings if it exists.
      earnings = shift.totalEarnings || 0;
    }

    const datePad = dateFormat.padEnd(12, ' ');
    const workPad = work.name.substring(0, 24).padEnd(25, ' ');
    const startPad = formatTime(shift.startTime).padEnd(8, ' ');
    const endPad = formatTime(shift.endTime).padEnd(8, ' ');
    const hoursPad = String(hours).padEnd(8, ' ');
    const earningsPad = formatCurrency(earnings).padEnd(12, ' ');

    content += `${datePad} ${workPad} ${startPad} ${endPad} ${hoursPad} ${earningsPad}\n`;
  });

  content += '═'.repeat(80) + '\n';

  // Create blob and download
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `report-${date}.txt`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Generate report in PNG format
 */
export const generatePNGReport = async (stats, shifts, works) => {
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
        <p style="color: #6B7280; font-size: 14px;">Generated on ${formatDate(new Date())}</p>
      </div>
      
      <div style="height: 2px; background: linear-gradient(to right, #EC4899, transparent); margin-bottom: 30px;"></div>
      
      <!-- General Summary -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">General Summary</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 5px;">Total Earned</p>
            <p style="color: #1F2937; font-size: 24px; font-weight: bold;">${formatCurrency(stats.totalEarned || 0)}</p>
          </div>
          <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 5px;">Hours Worked</p>
            <p style="color: #1F2937; font-size: 24px; font-weight: bold;">${(stats.hoursWorked || 0).toFixed(1)}h</p>
          </div>
          <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 5px;">Total Shifts</p>
            <p style="color: #1F2937; font-size: 24px; font-weight: bold;">${stats.totalShifts || 0}</p>
          </div>
          <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 5px;">Average/Hour</p>
            <p style="color: #1F2937; font-size: 24px; font-weight: bold;">${formatCurrency(stats.averagePerHour || 0)}</p>
          </div>
        </div>
      </div>
      
      <!-- This Week -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">This Week</h2>
        <div style="background: #FDF2F8; padding: 20px; border-radius: 8px; border-left: 4px solid #EC4899;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #6B7280;">Earnings:</span>
            <span style="color: #1F2937; font-weight: bold;">${formatCurrency(stats.earningsThisWeek || 0)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #6B7280;">Shifts:</span>
            <span style="color: #1F2937; font-weight: bold;">${stats.shiftsThisWeek || 0}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6B7280;">Days Worked:</span>
            <span style="color: #1F2937; font-weight: bold;">${stats.daysWorked || 0}</span>
          </div>
        </div>
      </div>
      
      <!-- Most Profitable Work -->
      ${stats.mostProfitableWork ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">Most Profitable Work</h2>
          <div style="background: #FFFBEB; padding: 20px; border-radius: 8px; border-left: 4px solid #F59E0B;">
            <p style="color: #1F2937; font-size: 18px; font-weight: bold; margin-bottom: 5px;">${stats.mostProfitableWork.work.name}</p>
            <p style="color: #F59E0B; font-size: 24px; font-weight: bold; margin-bottom: 5px;">${formatCurrency(stats.mostProfitableWork.earnings)}</p>
            <p style="color: #6B7280; font-size: 12px;">${stats.mostProfitableWork.shifts} shifts • ${stats.mostProfitableWork.hours.toFixed(1)}h</p>
          </div>
        </div>
      ` : ''}
      
      <!-- Recent Shifts -->
      <div>
        <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">Recent Shifts</h2>
        <div style="space-y: 10px;">
          ${shifts.slice(0, 5).map(shift => {
            const work = works.find(w => w.id === shift.workId);
            if (!work) return '';
            const date = shift.startDate || shift.date;
            return `
              <div style="background: #F9FAFB; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                <p style="color: #1F2937; font-weight: bold; margin-bottom: 5px;">${work.name}</p>
                <p style="color: #6B7280; font-size: 14px;">${formatDate(date)} • ${shift.startTime} - ${shift.endTime}</p>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(container);
  
  try {
    // Generate canvas from HTML
    const canvas = await html2canvas(container, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false
    });
    
    // Convert to image and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
      URL.revokeObjectURL(url);
    });
  } finally {
    // Clean up temporary element
    document.body.removeChild(container);
  }
};