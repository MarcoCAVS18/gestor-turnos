// src/utils/time/dateFormatters.js

/**
 * Creates a Date object safely from a date string
 * Adds 'T00:00:00' to avoid timezone issues
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Date in format "YYYY-MM-DD"
 * @returns ***REMOVED***Date***REMOVED*** - Date object
 *
 * @example
 * createSafeDate("2025-01-15") // Date object at midnight
 */
export const createSafeDate = (dateString) => ***REMOVED***
  if (!dateString) return new Date();
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) ***REMOVED***
    console.warn("createSafeDate received an unparseable dateString:", dateString);
    return new Date(); 
  ***REMOVED***
  return date;
***REMOVED***;

/**
 * Formats a date relatively (Today, Yesterday, Tomorrow)
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Date in format "YYYY-MM-DD"
 * @returns ***REMOVED***string***REMOVED*** - Formatted date
 *
 * @example
 * formatRelativeDate("2025-01-15") // "Today", "Yesterday", "Tomorrow" or "Jan 15th"
 */
export const formatRelativeDate = (dateString) => ***REMOVED***
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

  return date.toLocaleDateString('en-US', ***REMOVED***
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  ***REMOVED***);
***REMOVED***;

/**
 * Formats a full date
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Date in format "YYYY-MM-DD"
 * @returns ***REMOVED***string***REMOVED*** - Formatted date (ex: "Wednesday, 15th of January 2025")
 *
 * @example
 * formatFullDate("2025-01-15") // "Wednesday, 15th of January 2025"
 */
export const formatFullDate = (dateString) => ***REMOVED***
  return createSafeDate(dateString).toLocaleDateString('en-US', ***REMOVED***
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  ***REMOVED***);
***REMOVED***;

/**
 * Formats a date in short format
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Date in format "YYYY-MM-DD"
 * @returns ***REMOVED***string***REMOVED*** - Formatted date (ex: "Jan 15th")
 *
 * @example
 * formatShortDate("2025-01-15") // "Jan 15th"
 */
export const formatShortDate = (dateString) => ***REMOVED***
  return createSafeDate(dateString).toLocaleDateString('en-US', ***REMOVED***
    day: 'numeric',
    month: 'short'
  ***REMOVED***);
***REMOVED***;

/**
 * Formats a date in numeric format
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Date in format "YYYY-MM-DD"
 * @returns ***REMOVED***string***REMOVED*** - Formatted date (ex: "01/15/2025")
 *
 * @example
 * formatNumericDate("2025-01-15") // "01/15/2025"
 */
export const formatNumericDate = (dateString) => ***REMOVED***
  return createSafeDate(dateString).toLocaleDateString('en-US', ***REMOVED***
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  ***REMOVED***);
***REMOVED***;

/**
 * Gets the name of the day of the week
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Date in format "YYYY-MM-DD"
 * @returns ***REMOVED***string***REMOVED*** - Day name (ex: "Wednesday")
 *
 * @example
 * getDayName("2025-01-15") // "Wednesday"
 */
export const getDayName = (dateString) => ***REMOVED***
  return createSafeDate(dateString).toLocaleDateString('en-US', ***REMOVED***
    weekday: 'long'
  ***REMOVED***);
***REMOVED***;

/**
 * Gets the short name of the day of the week
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Date in format "YYYY-MM-DD"
 * @returns ***REMOVED***string***REMOVED*** - Short day name (ex: "Wed")
 *
 * @example
 * getShortDayName("2025-01-15") // "Wed"
 */
export const getShortDayName = (dateString) => ***REMOVED***
  return createSafeDate(dateString).toLocaleDateString('en-US', ***REMOVED***
    weekday: 'short'
  ***REMOVED***);
***REMOVED***;

/**
 * Gets the name of the month
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Date in format "YYYY-MM-DD"
 * @returns ***REMOVED***string***REMOVED*** - Month name (ex: "January")
 *
 * @example
 * getMonthName("2025-01-15") // "January"
 */
export const getMonthName = (dateString) => ***REMOVED***
  return createSafeDate(dateString).toLocaleDateString('en-US', ***REMOVED***
    month: 'long'
  ***REMOVED***);
***REMOVED***;

/**
 * Checks if a date is today
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Date in format "YYYY-MM-DD"
 * @returns ***REMOVED***boolean***REMOVED*** - true if it is today
 *
 * @example
 * isToday("2025-01-15") // true/false
 */
export const isToday = (dateString) => ***REMOVED***
  const date = createSafeDate(dateString);
  const today = new Date();

  return date.toDateString() === today.toDateString();
***REMOVED***;

/**
 * Checks if a date is in the past
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Date in format "YYYY-MM-DD"
 * @returns ***REMOVED***boolean***REMOVED*** - true if it is in the past
 *
 * @example
 * isPastDate("2025-01-15") // true/false
 */
export const isPastDate = (dateString) => ***REMOVED***
  const date = createSafeDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date < today;
***REMOVED***;

/**
 * Checks if a date is in the future
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Date in format "YYYY-MM-DD"
 * @returns ***REMOVED***boolean***REMOVED*** - true if it is in the future
 *
 * @example
 * isFutureDate("2025-01-15") // true/false
 */
export const isFutureDate = (dateString) => ***REMOVED***
  const date = createSafeDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date > today;
***REMOVED***;

/**
 * Gets the start and end date of a month
 *
 * @param ***REMOVED***number***REMOVED*** year - Year
 * @param ***REMOVED***number***REMOVED*** month - Month (0-11)
 * @returns ***REMOVED***Object***REMOVED*** - ***REMOVED*** start: Date, end: Date ***REMOVED***
 *
 * @example
 * getMonthRange(2025, 0) // ***REMOVED*** start: "2025-01-01", end: "2025-01-31" ***REMOVED***
 */
export const getMonthRange = (year, month) => ***REMOVED***
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const formatDate = (date) => ***REMOVED***
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `$***REMOVED***y***REMOVED***-$***REMOVED***m***REMOVED***-$***REMOVED***d***REMOVED***`;
  ***REMOVED***;

  return ***REMOVED***
    start: formatDate(start),
    end: formatDate(end)
  ***REMOVED***;
***REMOVED***;

/**
 * Gets current month and year in text format
 *
 * @returns ***REMOVED***string***REMOVED*** - Month and year (ex: "January 2025")
 *
 * @example
 * getCurrentMonthYear() // "January 2025"
 */
export const getCurrentMonthYear = () => ***REMOVED***
  const now = new Date();
  return now.toLocaleDateString('en-US', ***REMOVED***
    month: 'long',
    year: 'numeric'
  ***REMOVED***);
***REMOVED***;