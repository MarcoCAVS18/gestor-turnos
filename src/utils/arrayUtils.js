// src/utils/arrayUtils.js
// Utilities for working with arrays

/**
 * Ensures a value is a valid array
 * If value is null, undefined or not an array, returns empty array
 *
 * @param {any} value - Value to validate
 * @returns {Array} - Valid array
 *
 * @example
 * ensureArray([1, 2, 3]) // [1, 2, 3]
 * ensureArray(null) // []
 * ensureArray(undefined) // []
 * ensureArray("not an array") // []
 */
export const ensureArray = (value) => {
  return Array.isArray(value) ? value : [];
};

/**
 * Sums values of a specific property in an array of objects
 *
 * @param {Array} array - Array of objects
 * @param {string} key - Name of the property to sum
 * @returns {number} - Total sum
 *
 * @example
 * const data = [{ total: 100 }, { total: 200 }, { total: 50 }];
 * sumBy(data, 'total') // 350
 */
export const sumBy = (array, key) => {
  if (!Array.isArray(array)) return 0;
  return array.reduce((sum, item) => sum + (item[key] || 0), 0);
};

/**
 * Groups an array of objects by a specific property
 *
 * @param {Array} array - Array of objects
 * @param {string|Function} keyOrFn - Property or function to group by
 * @returns {Object} - Object with grouped items
 *
 * @example
 * const shifts = [
 *   { date: '2025-01-01', hours: 8 },
 *   { date: '2025-01-01', hours: 4 },
 *   { date: '2025-01-02', hours: 6 }
 * ];
 * groupBy(shifts, 'date')
 * // { '2025-01-01': [...], '2025-01-02': [...] }
 */
export const groupBy = (array, keyOrFn) => {
  if (!Array.isArray(array)) return {};

  return array.reduce((groups, item) => {
    const key = typeof keyOrFn === 'function' ? keyOrFn(item) : item[keyOrFn];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
};

/**
 * Finds an object in an array by ID safely
 *
 * @param {Array} array - Array of objects
 * @param {string|number} id - ID to find
 * @param {string} idKey - Name of the ID property (default: 'id')
 * @returns {Object|null} - Found object or null
 *
 * @example
 * const works = [{ id: '1', name: 'A' }, { id: '2', name: 'B' }];
 * findById(works, '1') // { id: '1', name: 'A' }
 * findById(works, '999') // null
 */
export const findById = (array, id, idKey = 'id') => {
  if (!Array.isArray(array) || !id) return null;
  return array.find(item => item[idKey] === id) || null;
};

/**
 * Sorts an array of objects by a date property in descending order
 *
 * @param {Array} array - Array of objects
 * @param {string} dateKey - Name of the date property
 * @returns {Array} - Sorted array (copy)
 *
 * @example
 * const shifts = [
 *   { date: '2025-01-01' },
 *   { date: '2025-01-03' },
 *   { date: '2025-01-02' }
 * ];
 * sortByDateDesc(shifts, 'date')
 * // [{ date: '2025-01-03' }, { date: '2025-01-02' }, { date: '2025-01-01' }]
 */
export const sortByDateDesc = (array, dateKey = 'date') => {
  if (!Array.isArray(array)) return [];
  return [...array].sort((a, b) => {
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);
    return dateB - dateA;
  });
};