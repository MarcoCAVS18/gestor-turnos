// src/utils/calendarUtils.js - FULLY UPDATED VERSION

import { createSafeDate } from './time';

/**
 * Creates a local date avoiding timezone issues
 */
export const createLocalDate = (year, month, day) => new Date(year, month, day);

/**
 * Converts a local date to ISO string (YYYY-MM-DD)
 */
export const localDateToISO = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Checks if a date is today
 */
export const dateIsToday = (date, currentDate) => {
  return date.getDate() === currentDate.getDate() &&
         date.getMonth() === currentDate.getMonth() &&
         date.getFullYear() === currentDate.getFullYear();
};

/**
 * Gets shifts of the month considering night shifts
 */
export const getMonthShifts = (shifts, currentYear, currentMonth) => {
  const firstDay = createLocalDate(currentYear, currentMonth, 1);
  const lastDay = createLocalDate(currentYear, currentMonth + 1, 0);
  
  const firstDayStr = localDateToISO(firstDay);
  const lastDayStr = localDateToISO(lastDay);
  
  // Filter shifts occurring in the month (considering night shifts)
  return shifts.filter(shift => {
    // Main date of the shift
    const mainDate = shift.startDate || shift.date;
    
    if (mainDate >= firstDayStr && mainDate <= lastDayStr) {
      return true;
    }
    
    // If shift has different end date, check that too
    if (shift.endDate && shift.endDate !== mainDate) {
      return shift.endDate >= firstDayStr && shift.endDate <= lastDayStr;
    }
    
    return false;
  });
};

/**
 * Checks if there are shifts on a specific date
 */
export const checkShiftsOnDate = (date, shifts) => {
  const dateStr = localDateToISO(date);  
  return shifts.some(shift => {
    // Check main date
    const mainDate = shift.startDate || shift.date;
    if (mainDate === dateStr) {
      return true;
    }
    
    // Check end date for night shifts
    if (shift.endDate && shift.endDate !== mainDate && shift.endDate === dateStr) {
      return true;
    }
    
    return false;
  });
};

/**
 * Get shifts for a specific day (including night shifts)
 */
export const getShiftsOfDay = (date, shifts) => {
  const dateStr = localDateToISO(date);  
  return shifts.filter(shift => {
    // Check main date
    const mainDate = shift.startDate || shift.date;
    if (mainDate === dateStr) {
      return true;
    }
    
    // Check end date for night shifts
    if (shift.endDate && shift.endDate !== mainDate && shift.endDate === dateStr) {
      return true;
    }
    
    return false;
  });
};

/**
 * Get colors considering night shifts
 */
export const getShiftColors = (dayShifts, works) => {
  const uniqueColors = new Set();
  
  dayShifts.forEach(shift => {
    const work = works.find(w => w.id === shift.workId);
    if (work) {
      // For delivery works, use a specific color or the work color
      if (work.type === 'delivery' || shift.type === 'delivery') {
        uniqueColors.add(work.avatarColor || work.color || '#10B981');
      } else {
        uniqueColors.add(work.color);
      }
    }
  });
  
  return Array.from(uniqueColors).slice(0, 3);
};

/**
 * Determines the type of shift on a specific date
 */
export const getShiftTypeOnDate = (shift, dateStr) => {
  const mainDate = shift.startDate || shift.date;
  
  // If it is the main date of the shift
  if (mainDate === dateStr) {
    if (shift.crossesMidnight) {
      return 'start-night'; // Shift starting this day and ending the next
    }
    return 'normal'; // Full shift on this day
  }
  
  // If it is the end date of a night shift
  if (shift.endDate && shift.endDate !== mainDate && shift.endDate === dateStr && shift.crossesMidnight) {
    return 'end-night'; // Shift that started the previous day and ending this one
  }
  
  return 'normal';
};

/**
 * Formats shift info to display in the calendar
 */
export const formatShiftInfoForCalendar = (shift, dateStr, work) => {
  const shiftType = getShiftTypeOnDate(shift, dateStr);  
  let timeLabel = `${shift.startTime} - ${shift.endTime}`;
  let typeLabel = '';
  
  if (shiftType === 'start-night') {
    timeLabel = `${shift.startTime} ...`;
    typeLabel = '(starts)';
  } else if (shiftType === 'end-night') {
    timeLabel = `... - ${shift.endTime}`;
    typeLabel = '(ends)';
  }
  
  return {
    id: shift.id,
    work: work?.name || 'Work not found',
    timeLabel,
    typeLabel,
    shiftType,
    color: work?.color || work?.avatarColor || '#6B7280',
    isDelivery: shift.type === 'delivery' || work?.type === 'delivery'
  };
};

/**
 * Gets the days of the week in English
 */
export const getDaysOfWeek = () => {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
};

/**
 * Gets the months in English
 */
export const getMonths = () => {
  return [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
};

/**
 * Formats a date relatively (today, yesterday, etc.)
 */
export const formatRelativeDate = (dateStr) => {
  const date = createSafeDate(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }
};