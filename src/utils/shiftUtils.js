// src/utils/shiftUtils.js

/**
 * Calculates gross earnings for a shift, handling different data structures.
 * For delivery shifts, it ensures tips are included.
 * @param {object} shift - The shift object.
 * @returns {number} - The gross earnings.
 */
export const getShiftGrossEarnings = (shift) => {
  if (shift.type !== 'delivery') {
    // For non-delivery shifts, we assume there's a 'total' field from a calculation
    // or we can just return 0 if it's not about earnings.
    // This function is primarily for delivery gross earnings.
    return shift.total || 0;
  }

  // For new shifts, totalEarnings is already calculated as baseEarnings + tips.
  // So if baseEarnings exists, totalEarnings is correct.
  if (shift.baseEarnings !== undefined) {
    return shift.totalEarnings || 0;
  }

  // For old shifts, totalEarnings does NOT include tips.
  // So we have to add them.
  return (shift.totalEarnings || 0) + (shift.tips || 0);
};


/**
 * Determines the label of a shift (Day, Afternoon, Night) based on start time.
 * @param {string} startTime - The start time in "HH:mm" format.
 * @param {object} shiftRanges - The user settings ranges object.
 * @returns {string} - The shift label ('Day', 'Afternoon', 'Night').
 */
export const getTagForShift = (startTime, shiftRanges) => {
  const [hour] = startTime.split(':').map(Number);
  const ranges = shiftRanges || {
    dayStart: 6,
    afternoonStart: 14,
    nightStart: 20
  };

  if (hour >= ranges.dayStart && hour < ranges.afternoonStart) {
    return 'Day';
  }
  if (hour >= ranges.afternoonStart && hour < ranges.nightStart) {
    return 'Afternoon';
  }
  return 'Night';
};