// src/utils/pluralization.js - Complete utility for pluralization

/**
 * Pluralizes the word "shift" according to the quantity
 * @param ***REMOVED***number***REMOVED*** quantity - Number of shifts
 * @param ***REMOVED***boolean***REMOVED*** uppercase - If it should be uppercase (default false)
 * @returns ***REMOVED***string***REMOVED*** "shift" or "shifts" as appropriate
 */
export const pluralizeShifts = (quantity, uppercase = false) => ***REMOVED***
  const word = quantity === 1 ? 'shift' : 'shifts';
  return uppercase ? word.toUpperCase() : word;
***REMOVED***;

/**
 * Formats quantity + pluralized word
 * @param ***REMOVED***number***REMOVED*** quantity - Number of shifts
 * @param ***REMOVED***boolean***REMOVED*** uppercase - If the word should be uppercase
 * @returns ***REMOVED***string***REMOVED*** Ex: "1 shift", "5 shifts"
 */
export const formatShiftsCount = (quantity, uppercase = false) => ***REMOVED***
  return `$***REMOVED***quantity***REMOVED*** $***REMOVED***pluralizeShifts(quantity, uppercase)***REMOVED***`;
***REMOVED***;

/**
 * Generates dynamic titles based on the quantity of elements
 * @param ***REMOVED***number***REMOVED*** totalCount - Total number of elements
 * @param ***REMOVED***string***REMOVED*** baseTitle - Base title (ex: "Types of")
 * @param ***REMOVED***string***REMOVED*** singular - Singular word
 * @param ***REMOVED***string***REMOVED*** plural - Plural word (optional)
 * @returns ***REMOVED***string***REMOVED*** Pluralized title
 */
export const getDynamicTitle = (totalCount, baseTitle, singular, plural = null) => ***REMOVED***
  const word = totalCount === 1 ? singular : (plural || `$***REMOVED***singular***REMOVED***s`);
  return `$***REMOVED***baseTitle***REMOVED*** $***REMOVED***word***REMOVED***`;
***REMOVED***;

/**
 * Pluralizes "type/types of shift" according to quantity
 * @param ***REMOVED***number***REMOVED*** totalShifts - Total number of shifts
 * @returns ***REMOVED***string***REMOVED*** "Shift type" or "Shift types"
 */
export const pluralizeShiftTypes = (totalShifts) => ***REMOVED***
  return totalShifts === 1 ? 'Shift type' : 'Shift types';
***REMOVED***;

/**
 * Pluralizes any word according to quantity
 * @param ***REMOVED***number***REMOVED*** quantity - Number of elements
 * @param ***REMOVED***string***REMOVED*** singular - Singular form of the word
 * @param ***REMOVED***string***REMOVED*** plural - Plural form of the word (optional, default adds 's')
 * @returns ***REMOVED***string***REMOVED*** The word in singular or plural
 */
export const pluralize = (quantity, singular, plural = null) => ***REMOVED***
  if (quantity === 1) return singular;
  return plural || `$***REMOVED***singular***REMOVED***s`;
***REMOVED***;

/**
 * Calculates total shifts from a shift type object
 * @param ***REMOVED***Object***REMOVED*** shiftTypes - Object with shift types
 * @returns ***REMOVED***number***REMOVED*** - Total number of shifts
 */
export const calculateTotalShifts = (shiftTypes) => ***REMOVED***
  if (!shiftTypes || typeof shiftTypes !== 'object') return 0;
  
  return Object.values(shiftTypes).reduce((total, data) => ***REMOVED***
    return total + (data?.shifts || 0);
  ***REMOVED***, 0);
***REMOVED***;