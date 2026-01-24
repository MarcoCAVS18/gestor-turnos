// src/utils/calendarUtils.js - FULLY UPDATED VERSION

import ***REMOVED*** createSafeDate ***REMOVED*** from './time';

/**
 * Creates a local date avoiding timezone issues
 */
export const createLocalDate = (year, month, day) => new Date(year, month, day);

/**
 * Converts a local date to ISO string (YYYY-MM-DD)
 */
export const localDateToISO = (date) => ***REMOVED***
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `$***REMOVED***year***REMOVED***-$***REMOVED***month***REMOVED***-$***REMOVED***day***REMOVED***`;
***REMOVED***;

/**
 * Checks if a date is today
 */
export const dateIsToday = (date, currentDate) => ***REMOVED***
  return date.getDate() === currentDate.getDate() &&
         date.getMonth() === currentDate.getMonth() &&
         date.getFullYear() === currentDate.getFullYear();
***REMOVED***;

/**
 * Gets shifts of the month considering night shifts
 */
export const getMonthShifts = (shifts, currentYear, currentMonth) => ***REMOVED***
  const firstDay = createLocalDate(currentYear, currentMonth, 1);
  const lastDay = createLocalDate(currentYear, currentMonth + 1, 0);
  
  const firstDayStr = localDateToISO(firstDay);
  const lastDayStr = localDateToISO(lastDay);
  
  // Filter shifts occurring in the month (considering night shifts)
  return shifts.filter(shift => ***REMOVED***
    // Main date of the shift
    const mainDate = shift.startDate || shift.date;
    
    if (mainDate >= firstDayStr && mainDate <= lastDayStr) ***REMOVED***
      return true;
    ***REMOVED***
    
    // If shift has different end date, check that too
    if (shift.endDate && shift.endDate !== mainDate) ***REMOVED***
      return shift.endDate >= firstDayStr && shift.endDate <= lastDayStr;
    ***REMOVED***
    
    return false;
  ***REMOVED***);
***REMOVED***;

/**
 * Checks if there are shifts on a specific date
 */
export const checkShiftsOnDate = (date, shifts) => ***REMOVED***
  const dateStr = localDateToISO(date);  
  return shifts.some(shift => ***REMOVED***
    // Check main date
    const mainDate = shift.startDate || shift.date;
    if (mainDate === dateStr) ***REMOVED***
      return true;
    ***REMOVED***
    
    // Check end date for night shifts
    if (shift.endDate && shift.endDate !== mainDate && shift.endDate === dateStr) ***REMOVED***
      return true;
    ***REMOVED***
    
    return false;
  ***REMOVED***);
***REMOVED***;

/**
 * Get shifts for a specific day (including night shifts)
 */
export const getShiftsOfDay = (date, shifts) => ***REMOVED***
  const dateStr = localDateToISO(date);  
  return shifts.filter(shift => ***REMOVED***
    // Check main date
    const mainDate = shift.startDate || shift.date;
    if (mainDate === dateStr) ***REMOVED***
      return true;
    ***REMOVED***
    
    // Check end date for night shifts
    if (shift.endDate && shift.endDate !== mainDate && shift.endDate === dateStr) ***REMOVED***
      return true;
    ***REMOVED***
    
    return false;
  ***REMOVED***);
***REMOVED***;

/**
 * Get colors considering night shifts
 */
export const getShiftColors = (dayShifts, works) => ***REMOVED***
  const uniqueColors = new Set();
  
  dayShifts.forEach(shift => ***REMOVED***
    const work = works.find(w => w.id === shift.workId);
    if (work) ***REMOVED***
      // For delivery works, use a specific color or the work color
      if (work.type === 'delivery' || shift.type === 'delivery') ***REMOVED***
        uniqueColors.add(work.avatarColor || work.color || '#10B981');
      ***REMOVED*** else ***REMOVED***
        uniqueColors.add(work.color);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);
  
  return Array.from(uniqueColors).slice(0, 3);
***REMOVED***;

/**
 * Determines the type of shift on a specific date
 */
export const getShiftTypeOnDate = (shift, dateStr) => ***REMOVED***
  const mainDate = shift.startDate || shift.date;
  
  // If it is the main date of the shift
  if (mainDate === dateStr) ***REMOVED***
    if (shift.crossesMidnight) ***REMOVED***
      return 'start-night'; // Shift starting this day and ending the next
    ***REMOVED***
    return 'normal'; // Full shift on this day
  ***REMOVED***
  
  // If it is the end date of a night shift
  if (shift.endDate && shift.endDate !== mainDate && shift.endDate === dateStr && shift.crossesMidnight) ***REMOVED***
    return 'end-night'; // Shift that started the previous day and ending this one
  ***REMOVED***
  
  return 'normal';
***REMOVED***;

/**
 * Formats shift info to display in the calendar
 */
export const formatShiftInfoForCalendar = (shift, dateStr, work) => ***REMOVED***
  const shiftType = getShiftTypeOnDate(shift, dateStr);  
  let timeLabel = `$***REMOVED***shift.startTime***REMOVED*** - $***REMOVED***shift.endTime***REMOVED***`;
  let typeLabel = '';
  
  if (shiftType === 'start-night') ***REMOVED***
    timeLabel = `$***REMOVED***shift.startTime***REMOVED*** ...`;
    typeLabel = '(starts)';
  ***REMOVED*** else if (shiftType === 'end-night') ***REMOVED***
    timeLabel = `... - $***REMOVED***shift.endTime***REMOVED***`;
    typeLabel = '(ends)';
  ***REMOVED***
  
  return ***REMOVED***
    id: shift.id,
    work: work?.name || 'Work not found',
    timeLabel,
    typeLabel,
    shiftType,
    color: work?.color || work?.avatarColor || '#6B7280',
    isDelivery: shift.type === 'delivery' || work?.type === 'delivery'
  ***REMOVED***;
***REMOVED***;

/**
 * Gets the days of the week in English
 */
export const getDaysOfWeek = () => ***REMOVED***
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
***REMOVED***;

/**
 * Gets the months in English
 */
export const getMonths = () => ***REMOVED***
  return [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
***REMOVED***;

/**
 * Formats a date relatively (today, yesterday, etc.)
 */
export const formatRelativeDate = (dateStr) => ***REMOVED***
  const date = createSafeDate(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) ***REMOVED***
    return 'Today';
  ***REMOVED*** else if (date.toDateString() === yesterday.toDateString()) ***REMOVED***
    return 'Yesterday';
  ***REMOVED*** else if (date.toDateString() === tomorrow.toDateString()) ***REMOVED***
    return 'Tomorrow';
  ***REMOVED*** else ***REMOVED***
    return date.toLocaleDateString('en-US', ***REMOVED***
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    ***REMOVED***);
  ***REMOVED***
***REMOVED***;