// src/utils/shiftUtils.js

/**
 * Calculates gross earnings for a shift, handling different data structures.
 * For delivery shifts, it ensures tips are included.
 * @param ***REMOVED***object***REMOVED*** shift - The shift object.
 * @returns ***REMOVED***number***REMOVED*** - The gross earnings.
 */
export const getShiftGrossEarnings = (shift) => ***REMOVED***
  if (shift.type !== 'delivery' && shift.tipo !== 'delivery') ***REMOVED***
    // For non-delivery shifts, we assume there's a 'total' field from a calculation
    // or we can just return 0 if it's not about earnings.
    // This function is primarily for delivery gross earnings.
    return shift.total || 0;
  ***REMOVED***

  // For new shifts, totalEarnings is already calculated as baseEarnings + tips.
  // So if baseEarnings exists, totalEarnings is correct.
  if (shift.baseEarnings !== undefined) ***REMOVED***
    return shift.totalEarnings || 0;
  ***REMOVED***

  // For old shifts, totalEarnings does NOT include tips.
  // So we have to add them.
  return (shift.totalEarnings || 0) + (shift.tips || 0);
***REMOVED***;


/**
 * Determines the label of a shift (Day, Afternoon, Night) based on start time.
 * @param ***REMOVED***string***REMOVED*** startTime - The start time in "HH:mm" format.
 * @param ***REMOVED***object***REMOVED*** shiftRanges - The user settings ranges object.
 * @returns ***REMOVED***string***REMOVED*** - The shift label ('Day', 'Afternoon', 'Night').
 */
export const getTagForShift = (startTime, shiftRanges) => ***REMOVED***
  const [hour] = startTime.split(':').map(Number);
  const ranges = shiftRanges || ***REMOVED***
    dayStart: 6,
    afternoonStart: 14,
    nightStart: 20
  ***REMOVED***;

  if (hour >= ranges.dayStart && hour < ranges.afternoonStart) ***REMOVED***
    return 'Day';
  ***REMOVED***
  if (hour >= ranges.afternoonStart && hour < ranges.nightStart) ***REMOVED***
    return 'Afternoon';
  ***REMOVED***
  return 'Night';
***REMOVED***;