// src/utils/time/timeCalculations.js

/**
 * Calculates worked hours between two times
 * Correctly handles shifts that cross midnight
 *
 * @param {string} startTime - Start time in format "HH:mm"
 * @param {string} endTime - End time in format "HH:mm"
 * @returns {number} - Worked hours (decimal)
 *
 * @example
 * calculateShiftHours("09:00", "17:00") // 8
 * calculateShiftHours("22:00", "02:00") // 4 (crosses midnight)
 */
export const calculateShiftHours = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;

  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;

  // If crosses midnight (e.g: 22:00 to 02:00)
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }

  return (endMinutes - startMinutes) / 60;
};

/**
 * Formats the duration of a shift in a readable format
 *
 * @param {string} startTime - Start time
 * @param {string} endTime - End time
 * @returns {string} - Formatted duration (ex: "8h" or "7h 30min")
 *
 * @example
 * formatShiftDuration("09:00", "17:00") // "8h"
 * formatShiftDuration("09:00", "16:30") // "7h 30min"
 */
export const formatShiftDuration = (startTime, endTime) => {
  const totalMinutes = calculateShiftHours(startTime, endTime) * 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}min`;
};

/**
 * Formats decimal hours in a readable format
 *
 * @param {number} hours - Hours in decimal format
 * @returns {string} - Formatted duration (ex: "8h", "7h 30min" or "45min")
 *
 * @example
 * formatHoursDecimal(8) // "8h"
 * formatHoursDecimal(7.5) // "7h 30min"
 * formatHoursDecimal(0.75) // "45min"
 */
export const formatHoursDecimal = (hours) => {
  if (hours === 0) return '0h';

  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes}min`;
  }

  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (minutes === 0) return `${wholeHours}h`;
  return `${wholeHours}h ${minutes}min`;
};

/**
 * Calculates total hours for an array of shifts
 *
 * @param {Array} shifts - Array of shifts with startTime and endTime
 * @returns {number} - Total worked hours
 *
 * @example
 * const shifts = [
 *   { startTime: "09:00", endTime: "17:00" },
 *   { startTime: "10:00", endTime: "14:00" }
 * ];
 * calculateTotalHours(shifts) // 12
 */
export const calculateTotalHours = (shifts = []) => {
  return shifts.reduce((total, shift) => {
    return total + calculateShiftHours(shift.startTime, shift.endTime);
  }, 0);
};

/**
 * Calculates hours applying smoko discount (break)
 *
 * @param {string} startTime - Start time
 * @param {string} endTime - End time
 * @param {number} smokoMinutes - Minutes of break to subtract
 * @returns {number} - Worked hours after discount
 *
 * @example
 * calculateHoursWithSmoko("09:00", "17:00", 30) // 7.5 (8h - 30min)
 */
export const calculateHoursWithSmoko = (startTime, endTime, smokoMinutes = 0) => {
  const totalHours = calculateShiftHours(startTime, endTime);
  const smokoHours = smokoMinutes / 60;
  return Math.max(0, totalHours - smokoHours);
};

/**
 * Converts decimal hours to HH:mm format
 *
 * @param {number} hours - Hours in decimal format
 * @returns {string} - Time in format "HH:mm"
 *
 * @example
 * hoursToTimeString(7.5) // "07:30"
 * hoursToTimeString(8) // "08:00"
 */
export const hoursToTimeString = (hours) => {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

/**
 * Checks if a shift crosses midnight
 *
 * @param {string} startTime - Start time
 * @param {string} endTime - End time
 * @returns {boolean} - true if crosses midnight
 *
 * @example
 * crossesMidnight("22:00", "02:00") // true
 * crossesMidnight("09:00", "17:00") // false
 */
export const crossesMidnight = (startTime, endTime) => {
  if (!startTime || !endTime) return false;

  const [startHour] = startTime.split(':').map(Number);
  const [endHour] = endTime.split(':').map(Number);

  return endHour < startHour;
};

/**
 * Gets the date range of a week (Monday to Sunday)
 *
 * @param {number} offset - Displacement in weeks (0 = current week, -1 = previous week, 1 = next week)
 * @returns {Object} - { startDate: Date, endDate: Date }
 *
 * @example
 * getWeekDateRange(0) // Current week
 * getWeekDateRange(-1) // Previous week
 * getWeekDateRange(1) // Next week
 */
export const getWeekDateRange = (offset = 0) => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Calculate difference to reach Monday (0 = Sunday, 1 = Monday, ...)
  const startDiff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  // Start date (Monday)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - startDiff + (offset * 7));
  startDate.setHours(0, 0, 0, 0);

  // End date (Sunday)
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
};