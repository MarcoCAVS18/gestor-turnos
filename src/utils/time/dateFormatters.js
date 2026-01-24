// src/utils/time/dateFormatters.js

/**
 * Creates a Date object safely from a date string
 * Adds 'T00:00:00' to avoid timezone issues
 *
 * @param {string} dateString - Date in format "YYYY-MM-DD"
 * @returns {Date} - Date object
 *
 * @example
 * createSafeDate("2025-01-15") // Date object at midnight
 */
export const createSafeDate = (dateString) => {
  if (!dateString) return new Date();
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) {
    console.warn("createSafeDate received an unparseable dateString:", dateString);
    return new Date(); 
  }
  return date;
};

/**
 * Formats a date relatively (Today, Yesterday, Tomorrow)
 *
 * @param {string} dateString - Date in format "YYYY-MM-DD"
 * @returns {string} - Formatted date
 *
 * @example
 * formatRelativeDate("2025-01-15") // "Today", "Yesterday", "Tomorrow" or "Jan 15th"
 */
export const formatRelativeDate = (dateString) => {
  const date = createSafeDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);

  if (targetDate.getTime() === today.getTime()) return 'Today';
  if (targetDate.getTime() === yesterday.getTime()) return 'Yesterday';
  if (targetDate.getTime() === tomorrow.getTime()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
};

/**
 * Formats a full date
 *
 * @param {string} dateString - Date in format "YYYY-MM-DD"
 * @returns {string} - Formatted date (ex: "Wednesday, 15th of January 2025")
 *
 * @example
 * formatFullDate("2025-01-15") // "Wednesday, 15th of January 2025"
 */
export const formatFullDate = (dateString) => {
  return createSafeDate(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Formats a date in short format
 *
 * @param {string} dateString - Date in format "YYYY-MM-DD"
 * @returns {string} - Formatted date (ex: "Jan 15th")
 *
 * @example
 * formatShortDate("2025-01-15") // "Jan 15th"
 */
export const formatShortDate = (dateString) => {
  return createSafeDate(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short'
  });
};

/**
 * Formats a date in numeric format
 *
 * @param {string} dateString - Date in format "YYYY-MM-DD"
 * @returns {string} - Formatted date (ex: "01/15/2025")
 *
 * @example
 * formatNumericDate("2025-01-15") // "01/15/2025"
 */
export const formatNumericDate = (dateString) => {
  return createSafeDate(dateString).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Gets the name of the day of the week
 *
 * @param {string} dateString - Date in format "YYYY-MM-DD"
 * @returns {string} - Day name (ex: "Wednesday")
 *
 * @example
 * getDayName("2025-01-15") // "Wednesday"
 */
export const getDayName = (dateString) => {
  return createSafeDate(dateString).toLocaleDateString('en-US', {
    weekday: 'long'
  });
};

/**
 * Gets the short name of the day of the week
 *
 * @param {string} dateString - Date in format "YYYY-MM-DD"
 * @returns {string} - Short day name (ex: "Wed")
 *
 * @example
 * getShortDayName("2025-01-15") // "Wed"
 */
export const getShortDayName = (dateString) => {
  return createSafeDate(dateString).toLocaleDateString('en-US', {
    weekday: 'short'
  });
};

/**
 * Gets the name of the month
 *
 * @param {string} dateString - Date in format "YYYY-MM-DD"
 * @returns {string} - Month name (ex: "January")
 *
 * @example
 * getMonthName("2025-01-15") // "January"
 */
export const getMonthName = (dateString) => {
  return createSafeDate(dateString).toLocaleDateString('en-US', {
    month: 'long'
  });
};

/**
 * Checks if a date is today
 *
 * @param {string} dateString - Date in format "YYYY-MM-DD"
 * @returns {boolean} - true if it is today
 *
 * @example
 * isToday("2025-01-15") // true/false
 */
export const isToday = (dateString) => {
  const date = createSafeDate(dateString);
  const today = new Date();

  return date.toDateString() === today.toDateString();
};

/**
 * Checks if a date is in the past
 *
 * @param {string} dateString - Date in format "YYYY-MM-DD"
 * @returns {boolean} - true if it is in the past
 *
 * @example
 * isPastDate("2025-01-15") // true/false
 */
export const isPastDate = (dateString) => {
  const date = createSafeDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date < today;
};

/**
 * Checks if a date is in the future
 *
 * @param {string} dateString - Date in format "YYYY-MM-DD"
 * @returns {boolean} - true if it is in the future
 *
 * @example
 * isFutureDate("2025-01-15") // true/false
 */
export const isFutureDate = (dateString) => {
  const date = createSafeDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date > today;
};

/**
 * Gets the start and end date of a month
 *
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @returns {Object} - { start: Date, end: Date }
 *
 * @example
 * getMonthRange(2025, 0) // { start: "2025-01-01", end: "2025-01-31" }
 */
export const getMonthRange = (year, month) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return {
    start: formatDate(start),
    end: formatDate(end)
  };
};

/**
 * Gets current month and year in text format
 *
 * @returns {string} - Month and year (ex: "January 2025")
 *
 * @example
 * getCurrentMonthYear() // "January 2025"
 */
export const getCurrentMonthYear = () => {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
};