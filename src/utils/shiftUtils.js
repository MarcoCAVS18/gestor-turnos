// src/utils/shiftUtils.js

import { addDaysToDateKey } from './time';

/**
 * Whether a shift crosses midnight: flagged so, or ending at an earlier hour
 * than it starts (e.g. 22:00 → 02:00).
 * @param {object} shift
 * @returns {boolean}
 */
export const shiftCrossesMidnight = (shift) =>
  !!shift.crossesMidnight ||
  !!(shift.startTime && shift.endTime && shift.startTime.split(':')[0] > shift.endTime.split(':')[0]);

/**
 * End date to store for a new shift: an explicit one if given, the day after
 * the start for overnight shifts, otherwise the start date itself.
 * @param {object} shift
 * @param {boolean} crossesMidnight
 * @returns {string} "YYYY-MM-DD"
 */
export const resolveShiftEndDate = (shift, crossesMidnight) => {
  const start = shift.startDate || shift.date;
  if (shift.endDate) return shift.endDate;
  return crossesMidnight && start ? addDaysToDateKey(start, 1) : start;
};

/**
 * Repairs a shift as it is read from Firestore. Until 2026-11 the overnight end
 * date was derived with toISOString() (UTC), so for users ahead of UTC
 * (Australia, NZ, Europe) overnight shifts were stored with endDate === startDate.
 * Anything reading endDate (calendar, hourly stats, the ICS feed) then saw a
 * shift ending before it started. Stored documents are left untouched; the
 * corrected value is applied in memory and written back the next time the
 * shift is saved.
 * @param {object} shift
 * @returns {object} the same shift, or a copy with endDate fixed
 */
export const normalizeShiftDates = (shift) => {
  const start = shift.startDate || shift.date;
  if (start && shiftCrossesMidnight(shift) && (!shift.endDate || shift.endDate <= start)) {
    return { ...shift, endDate: addDaysToDateKey(start, 1) };
  }
  return shift;
};

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