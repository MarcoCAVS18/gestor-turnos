// src/services/australia88Service.js
// Pure calculation logic for Australian Working Holiday Visa 88-day tracker.
// No React dependencies — safe to import anywhere.

import { calculateShiftHours } from '../utils/time';
import { createSafeDate, toLocalDateKey } from '../utils/time';
import { isShiftCompleted } from '../utils/shiftUtils';

// Official Home Affairs definitions: "three months" of specified work = 88
// calendar days (needed for a 2nd WHM visa, done during the 1st), and "six
// months" = 179 calendar days (needed for a 3rd visa, done during the 2nd).
// Single source of truth — never hardcode these numbers elsewhere.
export const YEAR1_TARGET_DAYS = 88;
export const YEAR2_TARGET_DAYS = 179;

// ── How visa days are counted ────────────────────────────────────────────────
// Home Affairs asks for "the same number of normal work days or shifts as a
// full-time employee in that role and industry would normally work" in the
// 88 (or 179) calendar-day period. In practice:
//   • A full-time week (5+ days and the industry's full-time hours) counts all
//     7 calendar days, weekend included.
//   • Otherwise only days actually worked count, and one calendar day never
//     counts as more than one day, however long it was.
//   • Part-time days count pro rata: half a standard day is half a day.
// Until 2026-11 Orary used an hours→days table that ignored the number of
// days worked (one 7.5 h shift = 2 days, four 9 h shifts = 7 days). It
// overcounted and was replaced by the method below (audit item V88-1).
// Thresholds are per job (industries differ) with these defaults.
export const DEFAULT_FULL_TIME_WEEKLY_HOURS = 38;
export const DEFAULT_STANDARD_DAY_HOURS = 7.6;
export const FULL_TIME_MIN_DAYS = 5;
export const FULL_TIME_WEEK_VISA_DAYS = 7;

/** Rounds a day count to one decimal, the precision shown in the UI. */
export const roundVisaDays = (n) => Math.round((Number(n) || 0) * 10) / 10;

/** Per-job thresholds, falling back to the defaults for missing/invalid values. */
export const getWorkVisaThresholds = (work) => {
  const ft = Number(work?.australia88FullTimeHours);
  const day = Number(work?.australia88StandardDayHours);
  return {
    fullTimeWeeklyHours: ft > 0 ? ft : DEFAULT_FULL_TIME_WEEKLY_HOURS,
    standardDayHours: day > 0 ? day : DEFAULT_STANDARD_DAY_HOURS,
  };
};

/**
 * Visa days earned in one Monday–Sunday week.
 *
 * @param {Array<{ date: string, hours: number, fullTimeWeeklyHours?: number, standardDayHours?: number }>} entries
 *   One entry per shift (several shifts or employers on the same date are fine).
 * @returns {{ visaDays: number, daysWorked: number, isFullTime: boolean }}
 */
export const getVisaDaysForWeek = (entries = []) => {
  const dayFraction = new Map(); // date -> sum of hours / standard day
  let fullTimeFraction = 0;      // sum of hours / full-time week

  entries.forEach(({ date, hours, fullTimeWeeklyHours = DEFAULT_FULL_TIME_WEEKLY_HOURS, standardDayHours = DEFAULT_STANDARD_DAY_HOURS }) => {
    if (!date || !(hours > 0)) return;
    dayFraction.set(date, (dayFraction.get(date) || 0) + hours / standardDayHours);
    fullTimeFraction += hours / fullTimeWeeklyHours;
  });

  const daysWorked = dayFraction.size;
  if (daysWorked >= FULL_TIME_MIN_DAYS && fullTimeFraction >= 1 - 1e-9) {
    return { visaDays: FULL_TIME_WEEK_VISA_DAYS, daysWorked, isFullTime: true };
  }

  let visaDays = 0;
  dayFraction.forEach((fraction) => { visaDays += Math.min(1, fraction); });
  return { visaDays: roundVisaDays(visaDays), daysWorked, isFullTime: false };
};

/**
 * Estimate for a week known only by totals (the public calculator), assuming
 * the hours are spread evenly over the days worked.
 * @param {number} daysWorked
 * @param {number} hours
 */
export const estimateVisaDaysFromWeekTotals = (daysWorked, hours, {
  fullTimeWeeklyHours = DEFAULT_FULL_TIME_WEEKLY_HOURS,
  standardDayHours = DEFAULT_STANDARD_DAY_HOURS,
} = {}) => {
  const days = Math.min(7, Math.max(0, Math.floor(Number(daysWorked) || 0)));
  const h = Math.max(0, Number(hours) || 0);
  if (days === 0 || h === 0) return 0;
  if (days >= FULL_TIME_MIN_DAYS && h >= fullTimeWeeklyHours) return FULL_TIME_WEEK_VISA_DAYS;
  return roundVisaDays(Math.min(days, h / standardDayHours));
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
  return toLocalDateKey(monday);
};

/**
 * Calculates total visa days accumulated across all eligible works and their shifts.
 *
 * Only works with type 'regular' and australia88Eligible === true are counted.
 * Shifts are grouped by week (Mon–Sun) and each week is counted with
 * getVisaDaysForWeek. Days from all weeks are summed.
 *
 * Only shifts already worked (ended by `now`) count: a rostered shift for next
 * week is not a visa day yet.
 *
 * @param {Array} shifts - All traditional shifts from DataContext
 * @param {Array} works  - All traditional works from DataContext
 * @param {Date}  [now]  - Reference time, defaults to the current time
 * @param {Function} [getShiftHours] - Hours that count for a shift. The app passes
 *   paid hours (breaks and Live Mode pauses deducted); defaults to start→end.
 * @returns {{
 *   totalDays: number,
 *   weeklyBreakdown: Array<{ weekKey, weekStart, weekEnd, hours, visaDays, daysWorked, isFullTime }>,
 *   currentMilestone: 88 | 179 | 'complete'
 * }}
 */
const rawShiftHours = (s) => calculateShiftHours(s.startTime, s.endTime);

export const calculateTotalVisaDays = (shifts, works, now = new Date(), getShiftHours = rawShiftHours) => {
  const eligibleWorks = new Map(
    works
      .filter(w => w.type === 'regular' && w.australia88Eligible === true)
      .map(w => [w.id, w])
  );
  const eligibleWorkIds = new Set(eligibleWorks.keys());

  if (eligibleWorkIds.size === 0) {
    return { totalDays: 0, weeklyBreakdown: [], currentMilestone: 88 };
  }

  const eligibleShifts = shifts.filter(
    s => s.type === 'regular' && eligibleWorkIds.has(s.workId) && isShiftCompleted(s, now)
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

    const entries = weekShifts.map((s) => ({
      date: s.startDate || s.date,
      hours: getShiftHours(s) || 0,
      ...getWorkVisaThresholds(eligibleWorks.get(s.workId)),
    }));
    const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
    const { visaDays, daysWorked, isFullTime } = getVisaDaysForWeek(entries);

    weeklyBreakdown.push({
      weekKey,
      weekStart,
      weekEnd,
      hours: totalHours,
      visaDays,
      daysWorked,
      isFullTime,
    });
  });

  // Chronological order for display
  weeklyBreakdown.sort((a, b) => a.weekStart - b.weekStart);

  const totalDays = roundVisaDays(weeklyBreakdown.reduce((sum, w) => sum + w.visaDays, 0));

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
    entry.visaDays = roundVisaDays(entry.visaDays + week.visaDays);
  });

  return Array.from(monthMap.values()).sort((a, b) => a.monthStart - b.monthStart);
};
