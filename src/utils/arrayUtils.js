// src/utils/arrayUtils.js
// Utilities for working with arrays

/**
 * Ensures a value is a valid array
 * If value is null, undefined or not an array, returns empty array
 *
 * @param ***REMOVED***any***REMOVED*** value - Value to validate
 * @returns ***REMOVED***Array***REMOVED*** - Valid array
 *
 * @example
 * ensureArray([1, 2, 3]) // [1, 2, 3]
 * ensureArray(null) // []
 * ensureArray(undefined) // []
 * ensureArray("not an array") // []
 */
export const ensureArray = (value) => ***REMOVED***
  return Array.isArray(value) ? value : [];
***REMOVED***;

/**
 * Sums values of a specific property in an array of objects
 *
 * @param ***REMOVED***Array***REMOVED*** array - Array of objects
 * @param ***REMOVED***string***REMOVED*** key - Name of the property to sum
 * @returns ***REMOVED***number***REMOVED*** - Total sum
 *
 * @example
 * const data = [***REMOVED*** total: 100 ***REMOVED***, ***REMOVED*** total: 200 ***REMOVED***, ***REMOVED*** total: 50 ***REMOVED***];
 * sumBy(data, 'total') // 350
 */
export const sumBy = (array, key) => ***REMOVED***
  if (!Array.isArray(array)) return 0;
  return array.reduce((sum, item) => sum + (item[key] || 0), 0);
***REMOVED***;

/**
 * Groups an array of objects by a specific property
 *
 * @param ***REMOVED***Array***REMOVED*** array - Array of objects
 * @param ***REMOVED***string|Function***REMOVED*** keyOrFn - Property or function to group by
 * @returns ***REMOVED***Object***REMOVED*** - Object with grouped items
 *
 * @example
 * const shifts = [
 *   ***REMOVED*** date: '2025-01-01', hours: 8 ***REMOVED***,
 *   ***REMOVED*** date: '2025-01-01', hours: 4 ***REMOVED***,
 *   ***REMOVED*** date: '2025-01-02', hours: 6 ***REMOVED***
 * ];
 * groupBy(shifts, 'date')
 * // ***REMOVED*** '2025-01-01': [...], '2025-01-02': [...] ***REMOVED***
 */
export const groupBy = (array, keyOrFn) => ***REMOVED***
  if (!Array.isArray(array)) return ***REMOVED******REMOVED***;

  return array.reduce((groups, item) => ***REMOVED***
    const key = typeof keyOrFn === 'function' ? keyOrFn(item) : item[keyOrFn];
    if (!groups[key]) ***REMOVED***
      groups[key] = [];
    ***REMOVED***
    groups[key].push(item);
    return groups;
  ***REMOVED***, ***REMOVED******REMOVED***);
***REMOVED***;

/**
 * Finds an object in an array by ID safely
 *
 * @param ***REMOVED***Array***REMOVED*** array - Array of objects
 * @param ***REMOVED***string|number***REMOVED*** id - ID to find
 * @param ***REMOVED***string***REMOVED*** idKey - Name of the ID property (default: 'id')
 * @returns ***REMOVED***Object|null***REMOVED*** - Found object or null
 *
 * @example
 * const works = [***REMOVED*** id: '1', name: 'A' ***REMOVED***, ***REMOVED*** id: '2', name: 'B' ***REMOVED***];
 * findById(works, '1') // ***REMOVED*** id: '1', name: 'A' ***REMOVED***
 * findById(works, '999') // null
 */
export const findById = (array, id, idKey = 'id') => ***REMOVED***
  if (!Array.isArray(array) || !id) return null;
  return array.find(item => item[idKey] === id) || null;
***REMOVED***;

/**
 * Sorts an array of objects by a date property in descending order
 *
 * @param ***REMOVED***Array***REMOVED*** array - Array of objects
 * @param ***REMOVED***string***REMOVED*** dateKey - Name of the date property
 * @returns ***REMOVED***Array***REMOVED*** - Sorted array (copy)
 *
 * @example
 * const shifts = [
 *   ***REMOVED*** date: '2025-01-01' ***REMOVED***,
 *   ***REMOVED*** date: '2025-01-03' ***REMOVED***,
 *   ***REMOVED*** date: '2025-01-02' ***REMOVED***
 * ];
 * sortByDateDesc(shifts, 'date')
 * // [***REMOVED*** date: '2025-01-03' ***REMOVED***, ***REMOVED*** date: '2025-01-02' ***REMOVED***, ***REMOVED*** date: '2025-01-01' ***REMOVED***]
 */
export const sortByDateDesc = (array, dateKey = 'date') => ***REMOVED***
  if (!Array.isArray(array)) return [];
  return [...array].sort((a, b) => ***REMOVED***
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);
    return dateB - dateA;
  ***REMOVED***);
***REMOVED***;