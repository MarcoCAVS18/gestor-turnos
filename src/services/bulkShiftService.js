// src/services/bulkShiftService.js
// Service for bulk shift creation

import { createSafeDate } from '../utils/time';

/**
 * Generates an array of shifts based on a pattern
 * @param {Object} baseShift - The base shift configuration
 * @param {Object} pattern - The pattern configuration
 * @returns {Array} Array of shift objects to create
 */
export const generateBulkShifts = (baseShift, pattern) => {
  const { type } = pattern;

  switch (type) {
    case 'weekly':
      return generateWeeklyPattern(baseShift, pattern);
    case 'dates':
      return generateFromSpecificDates(baseShift, pattern);
    case 'range':
      return generateFromDateRange(baseShift, pattern);
    default:
      return [];
  }
};

/**
 * Generates shifts based on weekly pattern (e.g., every Mon, Wed, Fri for 4 weeks)
 */
const generateWeeklyPattern = (baseShift, pattern) => {
  const { selectedDays, weeks, startDate } = pattern;
  const shifts = [];

  if (!selectedDays || selectedDays.length === 0 || !weeks || weeks < 1) {
    return shifts;
  }

  const start = createSafeDate(startDate || baseShift.startDate);

  // Generate shifts for the specified number of weeks
  for (let week = 0; week < weeks; week++) {
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + (week * 7) + dayOffset);

      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      // Check if this day is selected
      if (selectedDays.includes(dayOfWeek)) {
        shifts.push(createShiftForDate(baseShift, currentDate));
      }
    }
  }

  return shifts;
};

/**
 * Generates shifts for specific dates
 */
const generateFromSpecificDates = (baseShift, pattern) => {
  const { dates } = pattern;

  if (!dates || dates.length === 0) {
    return [];
  }

  return dates.map(dateStr => {
    const date = createSafeDate(dateStr);
    return createShiftForDate(baseShift, date);
  });
};

/**
 * Generates shifts for a date range
 */
const generateFromDateRange = (baseShift, pattern) => {
  const { fromDate, toDate, skipWeekends = false } = pattern;
  const shifts = [];

  if (!fromDate || !toDate) {
    return shifts;
  }

  const start = createSafeDate(fromDate);
  const end = createSafeDate(toDate);

  // Ensure start is before end
  if (start > end) {
    return shifts;
  }

  const currentDate = new Date(start);

  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday

    if (!skipWeekends || !isWeekend) {
      shifts.push(createShiftForDate(baseShift, new Date(currentDate)));
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return shifts;
};

/**
 * Creates a shift object for a specific date based on the base shift
 */
const createShiftForDate = (baseShift, date) => {
  const dateStr = formatDateForShift(date);

  // Calculate end date if shift crosses midnight
  let endDate = dateStr;
  if (baseShift.crossesMidnight) {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    endDate = formatDateForShift(nextDay);
  }

  const shiftData = {
    workId: baseShift.workId,
    startDate: dateStr,
    startTime: baseShift.startTime,
    endTime: baseShift.endTime,
    crossesMidnight: baseShift.crossesMidnight || false,
    endDate: baseShift.crossesMidnight ? endDate : '',
    hadBreak: baseShift.hadBreak !== undefined ? baseShift.hadBreak : true,
    breakMinutes: baseShift.breakMinutes || 0,
    notes: baseShift.notes || '',
    createdWith: 'bulk'
  };

  return shiftData;
};

/**
 * Formats a Date object to YYYY-MM-DD string
 */
const formatDateForShift = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Detects duplicate shifts based on existing shifts
 * @param {Array} newShifts - Shifts to be created
 * @param {Array} existingShifts - Already existing shifts
 * @returns {Object} { duplicates: Array, unique: Array }
 */
export const detectDuplicates = (newShifts, existingShifts) => {
  const duplicates = [];
  const unique = [];

  newShifts.forEach(newShift => {
    const isDuplicate = existingShifts.some(existing =>
      existing.workId === newShift.workId &&
      existing.startDate === newShift.startDate &&
      existing.startTime === newShift.startTime &&
      existing.endTime === newShift.endTime
    );

    if (isDuplicate) {
      duplicates.push(newShift);
    } else {
      unique.push(newShift);
    }
  });

  return { duplicates, unique };
};

/**
 * Gets a human-readable summary of the pattern
 */
export const getPatternSummary = (pattern) => {
  const { type } = pattern;

  switch (type) {
    case 'weekly': {
      const { selectedDays, weeks } = pattern;
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const selectedDayNames = selectedDays.map(day => dayNames[day]).join(', ');
      return `Every ${selectedDayNames} for ${weeks} week${weeks > 1 ? 's' : ''}`;
    }
    case 'dates': {
      const { dates } = pattern;
      return `${dates.length} specific date${dates.length > 1 ? 's' : ''}`;
    }
    case 'range': {
      const { fromDate, toDate, skipWeekends } = pattern;
      const suffix = skipWeekends ? ' (weekdays only)' : '';
      return `From ${fromDate} to ${toDate}${suffix}`;
    }
    default:
      return '';
  }
};
