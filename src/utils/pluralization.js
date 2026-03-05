// src/utils/pluralization.js - Complete utility for pluralization

/**
 * Pluralizes the word "shift" according to the quantity
 * @param {number} quantity - Number of shifts
 * @param {boolean} uppercase - If it should be uppercase (default false)
 * @param {Function} t - Optional translation function
 * @returns {string} "shift" or "shifts" as appropriate
 */
export const pluralizeShifts = (quantity, uppercase = false, t) => {
  const word = t 
    ? t(quantity === 1 ? 'common.shift' : 'common.shifts')
    : (quantity === 1 ? 'shift' : 'shifts');
  return uppercase ? word.toUpperCase() : word;
};

/**
 * Formats quantity + pluralized word
 * @param {number} quantity - Number of shifts
 * @param {boolean} uppercase - If the word should be uppercase
 * @param {Function} t - Optional translation function
 * @returns {string} Ex: "1 shift", "5 shifts"
 */
export const formatShiftsCount = (quantity, uppercase = false, t) => {
  return `${quantity} ${pluralizeShifts(quantity, uppercase, t)}`;
};

/**
 * Generates dynamic titles based on the quantity of elements
 * @param {number} totalCount - Total number of elements
 * @param {string} baseTitle - Base title (ex: "Types of")
 * @param {string} singular - Singular word
 * @param {string} plural - Plural word (optional)
 * @returns {string} Pluralized title
 */
export const getDynamicTitle = (totalCount, baseTitle, singular, plural = null) => {
  const word = totalCount === 1 ? singular : (plural || `${singular}s`);
  return `${baseTitle} ${word}`;
};

/**
 * Pluralizes "type/types of shift" according to quantity
 * @param {number} totalShifts - Total number of shifts
 * @returns {string} "Shift type" or "Shift types"
 */
export const pluralizeShiftTypes = (totalShifts) => {
  return totalShifts === 1 ? 'Shift type' : 'Shift types';
};

/**
 * Pluralizes any word according to quantity
 * @param {number} quantity - Number of elements
 * @param {string} singular - Singular form of the word
 * @param {string} plural - Plural form of the word (optional, default adds 's')
 * @returns {string} The word in singular or plural
 */
export const pluralize = (quantity, singular, plural = null) => {
  if (quantity === 1) return singular;
  return plural || `${singular}s`;
};

/**
 * Calculates total shifts from a shift type object
 * @param {Object} shiftTypes - Object with shift types
 * @returns {number} - Total number of shifts
 */
export const calculateTotalShifts = (shiftTypes) => {
  if (!shiftTypes || typeof shiftTypes !== 'object') return 0;
  
  return Object.values(shiftTypes).reduce((total, data) => {
    return total + (data?.shifts || 0);
  }, 0);
};