// src/services/australia88Service.js
// Pure calculation logic for Australian Working Holiday Visa 88-day tracker.
// No React dependencies — safe to import anywhere.

import { calculateShiftHours } from '../utils/time';
import { createSafeDate } from '../utils/time';

/**
 * Maps weekly hours worked to visa days earned.
 * Based on unofficial reference table for WHV extension calculation.
 *
 * @param {number} hours - Total hours worked in a week
 * @returns {number} - Visa days earned (0–7)
 */
export const getVisaDaysFromWeeklyHours = (hours) => {
  if (hours >= 35.25) return 7;
  if (hours >= 28.25) return 5;
  if (hours >= 21.25) return 4;
  if (hours >= 14.25) return 3;
  if (hours >= 7.25)  return 2;
  if (hours >= 4)     return 1;
  return 0;
};

/**
 * Returns the Monday (start of week) for any given date.
 * Australia uses Monday as the first day of the working week.
 *
 * @param {Date} date
 * @returns {Date} - Midnight of the Monday of that week
 */
export const getMondayOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Returns a string key "YYYY-MM-DD" representing the Monday of the week.
 * Used to group shifts by week.
 */
const getWeekKey = (date) => {
  const monday = getMondayOfWeek(date);
  return monday.toISOString().split('T')[0];
};

/**
 * Calculates total visa days accumulated across all eligible works and their shifts.
 *
 * Only works with type 'regular' and australia88Eligible === true are counted.
 * Shifts are grouped by week (Mon–Sun). Each week's total hours maps to visa days
 * via getVisaDaysFromWeeklyHours. Days from all weeks are summed.
 *
 * @param {Array} shifts - All traditional shifts from DataContext
 * @param {Array} works  - All traditional works from DataContext
 * @returns {{
 *   totalDays: number,
 *   weeklyBreakdown: Array<{ weekKey, weekStart, weekEnd, hours, visaDays }>,
 *   currentMilestone: 88 | 176 | 'complete'
 * }}
 */
export const calculateTotalVisaDays = (shifts, works) => {
  const eligibleWorkIds = new Set(
    works
      .filter(w => w.type === 'regular' && w.australia88Eligible === true)
      .map(w => w.id)
  );

  if (eligibleWorkIds.size === 0) {
    return { totalDays: 0, weeklyBreakdown: [], currentMilestone: 88 };
  }

  const eligibleShifts = shifts.filter(
    s => s.type === 'regular' && eligibleWorkIds.has(s.workId)
  );

  // Group eligible shifts by week key (Monday's date)
  const weekMap = new Map();
  eligibleShifts.forEach(shift => {
    const dateStr = shift.startDate || shift.date;
    if (!dateStr) return;
    const key = getWeekKey(createSafeDate(dateStr));
    if (!weekMap.has(key)) weekMap.set(key, []);
    weekMap.get(key).push(shift);
  });

  // Build breakdown: one entry per week with hours worked and visa days earned
  const weeklyBreakdown = [];
  weekMap.forEach((weekShifts, weekKey) => {
    const weekStart = createSafeDate(weekKey);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const totalHours = weekShifts.reduce(
      (sum, s) => sum + calculateShiftHours(s.startTime, s.endTime),
      0
    );

    weeklyBreakdown.push({
      weekKey,
      weekStart,
      weekEnd,
      hours: totalHours,
      visaDays: getVisaDaysFromWeeklyHours(totalHours),
    });
  });

  // Chronological order for display
  weeklyBreakdown.sort((a, b) => a.weekStart - b.weekStart);

  const totalDays = weeklyBreakdown.reduce((sum, w) => sum + w.visaDays, 0);

  let currentMilestone;
  if (totalDays < 88)       currentMilestone = 88;
  else if (totalDays < 176) currentMilestone = 176;
  else                      currentMilestone = 'complete';

  return { totalDays, weeklyBreakdown, currentMilestone };
};
