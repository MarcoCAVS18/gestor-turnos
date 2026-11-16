// src/services/australia88Service.js
// Pure calculation logic for Australian Working Holiday Visa 88-day tracker.
// No React dependencies — safe to import anywhere.

import { calculateShiftHours } from '../utils/time';
import { createSafeDate } from '../utils/time';

// Official Home Affairs definitions: "three months" of specified work = 88
// calendar days (needed for a 2nd WHM visa, done during the 1st), and "six
// months" = 179 calendar days (needed for a 3rd visa, done during the 2nd).
// Single source of truth — never hardcode these numbers elsewhere.
export const YEAR1_TARGET_DAYS = 88;
export const YEAR2_TARGET_DAYS = 179;

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
 *   currentMilestone: 88 | 179 | 'complete'
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
  if (totalDays < YEAR1_TARGET_DAYS)      currentMilestone = YEAR1_TARGET_DAYS;
  else if (totalDays < YEAR2_TARGET_DAYS) currentMilestone = YEAR2_TARGET_DAYS;
  else                                    currentMilestone = 'complete';

  return { totalDays, weeklyBreakdown, currentMilestone };
};

/**
 * Formats a week's date range compactly for display, using the browser's
 * locale-aware month name.
 * Same month: "Nov 4–10". Different months: "Oct 28 – Nov 3".
 *
 * @param {Date} weekStart
 * @param {Date} weekEnd
 * @param {string} [locale] - BCP 47 locale tag (e.g. i18n.language). Defaults to 'en'.
 */
export const formatWeekRange = (weekStart, weekEnd, locale = 'en') => {
  const startMonth = weekStart.toLocaleDateString(locale, { month: 'short' });
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();

  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `${startMonth} ${startDay}–${endDay}`;
  }

  const endMonth = weekEnd.toLocaleDateString(locale, { month: 'short' });
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
};

/**
 * Aggregates a weekly breakdown (see calculateTotalVisaDays) into calendar months.
 * A week is attributed to the month its Monday falls in — the same week is never
 * split across two months, keeping the sum of monthly totals equal to the sum
 * of weekly totals.
 *
 * @param {Array} weeklyBreakdown - Output of calculateTotalVisaDays
 * @returns {Array<{ monthKey, monthStart, hours, visaDays }>} Chronological order
 */
export const getMonthlyBreakdown = (weeklyBreakdown) => {
  const monthMap = new Map();

  weeklyBreakdown.forEach((week) => {
    const monthStart = new Date(week.weekStart.getFullYear(), week.weekStart.getMonth(), 1);
    const monthKey = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}`;

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, { monthKey, monthStart, hours: 0, visaDays: 0 });
    }
    const entry = monthMap.get(monthKey);
    entry.hours += week.hours;
    entry.visaDays += week.visaDays;
  });

  return Array.from(monthMap.values()).sort((a, b) => a.monthStart - b.monthStart);
};
