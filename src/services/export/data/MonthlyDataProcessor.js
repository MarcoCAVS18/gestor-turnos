// src/services/export/data/MonthlyDataProcessor.js

import { createSafeDate } from '../../../utils/time';
import { getShiftGrossEarnings } from '../../../utils/shiftUtils';

/**
 * Groups shifts by month and year
 * @param {Array} shifts - Array of shifts
 * @returns {Object} Shifts grouped by month key (e.g., "2024-01")
 */
const groupShiftsByMonth = (shifts) => {
  const grouped = {};

  shifts.forEach(shift => {
    const date = createSafeDate(shift.startDate || shift.date);
    if (!date || isNaN(date.getTime())) return;

    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push(shift);
  });

  return grouped;
};

/**
 * Formats a month key to display string
 * @param {string} monthKey - Month key (e.g., "2024-01")
 * @returns {string} Formatted string (e.g., "January 2024")
 */
const formatMonthYear = (monthKey) => {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

/**
 * Gets the day name from a date
 * @param {Date} date - The date
 * @returns {string} Day name (e.g., "Monday")
 */
const getDayName = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

/**
 * Formats a date for display
 * @param {string|Date} dateInput - Date to format
 * @returns {string} Formatted date (e.g., "Feb 06, 2026")
 */
const formatDate = (dateInput) => {
  const date = createSafeDate(dateInput);
  if (!date || isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

/**
 * Formats a timestamp for display
 * @param {Object|Date|string} timestamp - Timestamp to format
 * @returns {string} Formatted timestamp
 */
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';

  let date;
  if (timestamp.seconds) {
    // Firebase timestamp
    date = new Date(timestamp.seconds * 1000);
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }

  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

/**
 * Calculates hours from start and end time
 * @param {string} startTime - Start time (HH:mm)
 * @param {string} endTime - End time (HH:mm)
 * @returns {number} Hours worked
 */
const calculateHours = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;

  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);

  let hours = (eh + em / 60) - (sh + sm / 60);
  if (hours < 0) hours += 24;

  return hours;
};

/**
 * Processes a traditional shift for export
 * @param {Object} shift - The shift object
 * @param {Object} work - The associated work
 * @param {Function} calculatePayment - Payment calculation function
 * @returns {Object} Processed shift data
 */
const processTraditionalShift = (shift, work, calculatePayment) => {
  const date = createSafeDate(shift.startDate || shift.date);
  const result = calculatePayment(shift);

  return {
    id: shift.id?.substring(0, 8) || 'N/A',
    fullId: shift.id,
    date: formatDate(shift.startDate || shift.date),
    rawDate: shift.startDate || shift.date,
    weekday: getDayName(date),
    workName: work?.name || 'Unknown',
    workColor: work?.color || '#EC4899',
    startTime: shift.startTime || 'N/A',
    endTime: shift.endTime || 'N/A',
    hoursWorked: Math.round((result.hours || 0) * 100) / 100,
    crossesMidnight: shift.crossesMidnight || false,
    endDate: shift.endDate ? formatDate(shift.endDate) : '',
    hadBreak: shift.hadBreak !== false,
    breakMinutes: shift.breakMinutes || 0,
    rate: work?.baseRate || 0,
    earnings: Math.round((result.total || 0) * 100) / 100,
    earningsWithDiscount: Math.round((result.totalWithDiscount || result.total || 0) * 100) / 100,
    breakdown: {
      day: Math.round((result.breakdown?.day || 0) * 100) / 100,
      afternoon: Math.round((result.breakdown?.afternoon || 0) * 100) / 100,
      night: Math.round((result.breakdown?.night || 0) * 100) / 100,
      saturday: Math.round((result.breakdown?.saturday || 0) * 100) / 100,
      sunday: Math.round((result.breakdown?.sunday || 0) * 100) / 100
    },
    hoursBreakdown: result.hoursBreakdown || {},
    appliedRates: result.appliedRates || {},
    notes: shift.notes || '',
    isLive: shift.isLive || false,
    createdAt: formatTimestamp(shift.createdAt),
    updatedAt: formatTimestamp(shift.updatedAt)
  };
};

/**
 * Processes a delivery shift for export
 * @param {Object} shift - The shift object
 * @param {Object} work - The associated work
 * @returns {Object} Processed shift data
 */
const processDeliveryShift = (shift, work) => {
  const date = createSafeDate(shift.startDate || shift.date);
  const hours = calculateHours(shift.startTime, shift.endTime);
  const grossEarnings = getShiftGrossEarnings(shift);
  const netEarnings = grossEarnings - (shift.fuelExpense || 0);

  return {
    id: shift.id?.substring(0, 8) || 'N/A',
    fullId: shift.id,
    date: formatDate(shift.startDate || shift.date),
    rawDate: shift.startDate || shift.date,
    weekday: getDayName(date),
    workName: work?.name || 'Unknown',
    platform: work?.platform || shift.platform || 'N/A',
    vehicle: work?.vehicle || shift.vehicle || 'N/A',
    startTime: shift.startTime || 'N/A',
    endTime: shift.endTime || 'N/A',
    hoursWorked: Math.round(hours * 100) / 100,
    orderCount: shift.orderCount || 0,
    baseEarnings: Math.round((shift.baseEarnings || shift.earnings || 0) * 100) / 100,
    tips: Math.round((shift.tips || 0) * 100) / 100,
    totalEarnings: Math.round(grossEarnings * 100) / 100,
    kilometers: Math.round((shift.kilometers || 0) * 100) / 100,
    fuelExpense: Math.round((shift.fuelExpense || 0) * 100) / 100,
    netEarnings: Math.round(netEarnings * 100) / 100,
    averagePerOrder: shift.orderCount > 0 ? Math.round((grossEarnings / shift.orderCount) * 100) / 100 : 0,
    averagePerHour: hours > 0 ? Math.round((grossEarnings / hours) * 100) / 100 : 0,
    notes: shift.notes || '',
    createdAt: formatTimestamp(shift.createdAt),
    updatedAt: formatTimestamp(shift.updatedAt)
  };
};

/**
 * Calculates summary statistics for a month
 * @param {Array} traditionalShifts - Traditional shifts for the month
 * @param {Array} deliveryShifts - Delivery shifts for the month
 * @returns {Object} Monthly summary
 */
const calculateMonthlySummary = (traditionalShifts, deliveryShifts) => {
  const totalShifts = traditionalShifts.length + deliveryShifts.length;
  const totalTraditional = traditionalShifts.length;
  const totalDelivery = deliveryShifts.length;

  let totalHours = 0;
  let totalEarned = 0;
  let totalOrders = 0;
  let totalTips = 0;
  let totalExpenses = 0;

  traditionalShifts.forEach(s => {
    totalHours += s.hoursWorked || 0;
    totalEarned += s.earningsWithDiscount || s.earnings || 0;
  });

  deliveryShifts.forEach(s => {
    totalHours += s.hoursWorked || 0;
    totalEarned += s.totalEarnings || 0;
    totalOrders += s.orderCount || 0;
    totalTips += s.tips || 0;
    totalExpenses += s.fuelExpense || 0;
  });

  const netEarnings = totalEarned - totalExpenses;

  return {
    totalShifts,
    traditionalShifts: totalTraditional,
    deliveryShifts: totalDelivery,
    totalHours: Math.round(totalHours * 100) / 100,
    totalEarned: Math.round(totalEarned * 100) / 100,
    totalOrders,
    totalTips: Math.round(totalTips * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    netEarnings: Math.round(netEarnings * 100) / 100,
    averagePerShift: totalShifts > 0 ? Math.round((totalEarned / totalShifts) * 100) / 100 : 0,
    averagePerHour: totalHours > 0 ? Math.round((totalEarned / totalHours) * 100) / 100 : 0
  };
};

/**
 * Processes all shifts and groups them by month with full details
 * @param {Object} params - Parameters
 * @returns {Array} Array of monthly data objects
 */
export const processMonthlyData = ({ shifts, deliveryShifts, works, deliveryWorks, calculatePayment }) => {
  const allWorks = [...(works || []), ...(deliveryWorks || [])];

  // Group shifts by month
  const groupedTraditional = groupShiftsByMonth(shifts || []);
  const groupedDelivery = groupShiftsByMonth(deliveryShifts || []);

  // Get all unique month keys and sort them
  const allMonthKeys = new Set([
    ...Object.keys(groupedTraditional),
    ...Object.keys(groupedDelivery)
  ]);
  const sortedMonthKeys = Array.from(allMonthKeys).sort();

  // Process each month
  return sortedMonthKeys.map(monthKey => {
    const traditionalRaw = groupedTraditional[monthKey] || [];
    const deliveryRaw = groupedDelivery[monthKey] || [];

    // Process traditional shifts
    const processedTraditional = traditionalRaw.map(shift => {
      const work = works?.find(w => w.id === shift.workId);
      return processTraditionalShift(shift, work, calculatePayment);
    }).sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));

    // Process delivery shifts
    const processedDelivery = deliveryRaw.map(shift => {
      const work = deliveryWorks?.find(w => w.id === shift.workId);
      return processDeliveryShift(shift, work);
    }).sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));

    // Calculate summary
    const summary = calculateMonthlySummary(processedTraditional, processedDelivery);

    return {
      monthKey,
      monthYear: formatMonthYear(monthKey),
      summary,
      traditionalShifts: processedTraditional,
      deliveryShifts: processedDelivery
    };
  });
};

/**
 * Gets statistics for a specific month
 * @param {string} monthKey - Month key (e.g., "2024-01")
 * @param {Array} monthlyData - Processed monthly data
 * @returns {Object|null} Month data or null if not found
 */
export const getMonthData = (monthKey, monthlyData) => {
  return monthlyData.find(m => m.monthKey === monthKey) || null;
};

/**
 * Gets the most recent N months of data
 * @param {Array} monthlyData - Processed monthly data
 * @param {number} count - Number of months to return
 * @returns {Array} Most recent months
 */
export const getRecentMonths = (monthlyData, count = 3) => {
  return monthlyData.slice(-count);
};

export default {
  processMonthlyData,
  getMonthData,
  getRecentMonths
};
