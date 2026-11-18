// src/hooks/useAustralia88.js
// React hook that bridges australia88Service with app contexts.
// All Australia 88 UI components consume this hook — do not duplicate logic elsewhere.

import { useMemo } from 'react';
import { useConfigContext } from '../contexts/ConfigContext';
import { useDataContext } from '../contexts/DataContext';
import {
  calculateTotalVisaDays,
  getMonthlyBreakdown,
  getVisaDaysFromWeeklyHours,
  getMondayOfWeek,
  YEAR1_TARGET_DAYS,
  YEAR2_TARGET_DAYS,
} from '../services/australia88Service';
import { calculateShiftHours } from '../utils/time';
import { createSafeDate } from '../utils/time';
import { isShiftCompleted } from '../utils/shiftUtils';

/**
 * Provides all Australia 88-day visa tracking data to UI components.
 *
 * @returns {{
 *   isAustraliaMode: boolean,        // holidayCountry === 'AU'
 *   hasEligibleWorks: boolean,       // At least one work with australia88Eligible === true
 *   totalVisaDays: number,           // Total visa days accumulated across all time
 *   currentWeekVisaDays: number,     // Visa days earned in the current Mon–Sun week
 *   milestone: 88 | 179 | 'complete',
 *   progressPercent: number,         // 0–100, relative to the current milestone
 *   weeklyBreakdown: Array,          // [{ weekKey, weekStart, weekEnd, hours, visaDays }] — full history
 *   monthlyBreakdown: Array,         // [{ monthKey, monthStart, hours, visaDays }] — full history
 *   year1WeeklyBreakdown: Array,     // weeklyBreakdown filtered to before the Year 2 cutover
 *   year2WeeklyBreakdown: Array,     // weeklyBreakdown filtered to the Year 2 cutover onward
 *   year1MonthlyBreakdown: Array,
 *   year2MonthlyBreakdown: Array,
 * }}
 */
export const useAustralia88 = () => {
  const { holidayCountry, australia88VisaYear, australia88ManualDays, australia88Year2StartDate } = useConfigContext();
  const { works, shifts } = useDataContext();

  // Australia mode is on when the user's location is set to Australia
  const isAustraliaMode = holidayCountry === 'AU';

  // The tracker activates as soon as any work is marked eligible —
  // not just when AU mode is on. This allows the UI to react to the
  // user's actual data rather than only to a settings flag.
  const hasEligibleWorks = useMemo(
    () => works.some(w => w.type === 'regular' && w.australia88Eligible === true),
    [works]
  );

  // Full calculation — memoized, only reruns when shifts or works change
  const visaData = useMemo(() => {
    if (!hasEligibleWorks) {
      return { totalDays: 0, weeklyBreakdown: [], currentMilestone: 88 };
    }
    return calculateTotalVisaDays(shifts, works);
  }, [hasEligibleWorks, shifts, works]);

  // Weekly data grouped into calendar months — for the /statistics/australia88 page
  const monthlyBreakdown = useMemo(
    () => getMonthlyBreakdown(visaData.weeklyBreakdown),
    [visaData.weeklyBreakdown]
  );

  // Hours worked for eligible works in the current calendar week (Mon–Sun)
  const currentWeekVisaDays = useMemo(() => {
    if (!hasEligibleWorks) return 0;

    const today = new Date();
    const monday = getMondayOfWeek(today);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const eligibleWorkIds = new Set(
      works
        .filter(w => w.type === 'regular' && w.australia88Eligible === true)
        .map(w => w.id)
    );

    const thisWeekHours = shifts
      .filter(s => {
        if (s.type !== 'regular' || !eligibleWorkIds.has(s.workId)) return false;
        if (!isShiftCompleted(s, today)) return false; // scheduled, not worked yet
        const d = createSafeDate(s.startDate || s.date);
        return d >= monday && d <= sunday;
      })
      .reduce((sum, s) => sum + calculateShiftHours(s.startTime, s.endTime), 0);

    return getVisaDaysFromWeeklyHours(thisWeekHours);
  }, [hasEligibleWorks, shifts, works]);

  // ── Split shifts between Year 1 and Year 2 ──────────────────────────────
  // Once Year 2 is declared (australia88VisaYear === 2), australia88Year2StartDate
  // holds the exact date that happened — recorded by the "Activate Year 2"
  // flow / Settings at the moment of the switch. Shifts logged BEFORE that
  // date count toward Year 1 (frozen from then on — Year 1 doesn't keep
  // accumulating once you've moved on); shifts from that date onward count
  // toward a fresh, independent Year 2 total. Without a cutover (still in
  // Year 1, or a Year 2 declared before this cutover-date tracking existed)
  // everything falls back to the full shift history, same as before.
  const hasCutover = australia88VisaYear === 2 && !!australia88Year2StartDate;

  // Weekly/monthly breakdown split by year — for the /statistics/australia88
  // page's Y1/Y2 toggle, so it isn't stuck showing the full cross-year
  // history when the user is actually asking to see "this year" only.
  // Without a cutover, Year 2 simply has no data yet.
  const year1WeeklyBreakdown = useMemo(() => {
    if (!hasCutover) return visaData.weeklyBreakdown;
    return visaData.weeklyBreakdown.filter(w => w.weekKey < australia88Year2StartDate);
  }, [hasCutover, australia88Year2StartDate, visaData.weeklyBreakdown]);

  const year2WeeklyBreakdown = useMemo(() => {
    if (!hasCutover) return [];
    return visaData.weeklyBreakdown.filter(w => w.weekKey >= australia88Year2StartDate);
  }, [hasCutover, australia88Year2StartDate, visaData.weeklyBreakdown]);

  const year1MonthlyBreakdown = useMemo(
    () => getMonthlyBreakdown(year1WeeklyBreakdown),
    [year1WeeklyBreakdown]
  );
  const year2MonthlyBreakdown = useMemo(
    () => getMonthlyBreakdown(year2WeeklyBreakdown),
    [year2WeeklyBreakdown]
  );

  const year1AppDays = useMemo(() => {
    if (!hasEligibleWorks) return 0;
    if (!hasCutover) return visaData.totalDays;
    const preCutoverShifts = shifts.filter(s => {
      const d = s.startDate || s.date;
      return d && d < australia88Year2StartDate;
    });
    return calculateTotalVisaDays(preCutoverShifts, works).totalDays;
  }, [hasEligibleWorks, hasCutover, australia88Year2StartDate, shifts, works, visaData.totalDays]);

  const year2AppDays = useMemo(() => {
    if (!hasEligibleWorks || australia88VisaYear !== 2) return 0;
    if (!hasCutover) return visaData.totalDays; // legacy fallback — no cutover recorded
    const postCutoverShifts = shifts.filter(s => {
      const d = s.startDate || s.date;
      return d && d >= australia88Year2StartDate;
    });
    return calculateTotalVisaDays(postCutoverShifts, works).totalDays;
  }, [hasEligibleWorks, australia88VisaYear, hasCutover, australia88Year2StartDate, shifts, works, visaData.totalDays]);

  // manualDays is contextual to whichever year is currently declared (see
  // Settings copy: "days before Orary" for Year 1 or Year 2 respectively).
  const year1ManualDays = australia88VisaYear === 1 ? (australia88ManualDays || 0) : 0;
  const year2ManualDays = australia88VisaYear === 2 ? (australia88ManualDays || 0) : 0;

  // totalVisaDays is Year 1's running total — kept under this name for
  // existing callers (e.g. y1Days = Math.min(totalVisaDays, 88)).
  const totalVisaDays = year1AppDays + year1ManualDays;

  // Year-based computed values. Per the official rules (see the app's own
  // "second/third-year application guide" blog post): a Year 2 extension
  // needs 88 days of specified work done during Year 1; a Year 3 extension
  // needs 6 months (179 calendar days per Home Affairs) done during
  // Year 2. So Year 1 and Year 2 have DIFFERENT goals, and Year 2 is a fresh,
  // independent count — it does not continue Year 1's total (Year 1 stays
  // locked at 88/88, it is not added on top).
  //
  // Year 1: first 88 days (0–88), capped — extra days beyond 88 stay shown as
  // Year 1 and do NOT auto-promote to a Year 2 view. Year 2 only activates
  // once the user explicitly declares it in Settings (australia88VisaYear
  // === 2, e.g. after their Year 2 visa is approved) — never automatically
  // just because totalVisaDays crossed 88. Once active, its counter resets
  // to 0 and counts up to YEAR2_TARGET_DAYS.
  const year1Complete = totalVisaDays >= YEAR1_TARGET_DAYS;
  const year2Active   = australia88VisaYear === 2;
  const year2Days     = year2Active ? Math.max(0, Math.min(YEAR2_TARGET_DAYS, year2AppDays + year2ManualDays)) : 0;
  const year2Complete = year2Active && year2Days >= YEAR2_TARGET_DAYS;

  // Progress percent relative to the active year's goal
  const progressPercent = useMemo(() => {
    if (year2Active) return Math.min(100, Math.round((year2Days / YEAR2_TARGET_DAYS) * 100));
    return Math.min(100, Math.round((totalVisaDays / YEAR1_TARGET_DAYS) * 100));
  }, [totalVisaDays, year2Active, year2Days]);

  // Milestone based on adjusted total
  const milestone = totalVisaDays < YEAR1_TARGET_DAYS
    ? YEAR1_TARGET_DAYS
    : totalVisaDays < YEAR2_TARGET_DAYS ? YEAR2_TARGET_DAYS : 'complete';

  return {
    isAustraliaMode,
    hasEligibleWorks,
    totalVisaDays,
    currentWeekVisaDays,
    milestone,
    progressPercent,
    weeklyBreakdown: visaData.weeklyBreakdown,
    monthlyBreakdown,
    year1WeeklyBreakdown,
    year2WeeklyBreakdown,
    year1MonthlyBreakdown,
    year2MonthlyBreakdown,
    // Year-based helpers
    year1Complete,
    year2Active,
    year2Complete,
    year2Days,
    // Settings
    australia88VisaYear,
    australia88ManualDays,
    australia88Year2StartDate,
  };
};
