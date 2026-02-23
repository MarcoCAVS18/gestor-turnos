// src/hooks/useAustralia88.js
// React hook that bridges australia88Service with app contexts.
// All Australia 88 UI components consume this hook — do not duplicate logic elsewhere.

import { useMemo } from 'react';
import { useConfigContext } from '../contexts/ConfigContext';
import { useDataContext } from '../contexts/DataContext';
import {
  calculateTotalVisaDays,
  getVisaDaysFromWeeklyHours,
  getMondayOfWeek,
} from '../services/australia88Service';
import { calculateShiftHours } from '../utils/time';
import { createSafeDate } from '../utils/time';

/**
 * Provides all Australia 88-day visa tracking data to UI components.
 *
 * @returns {{
 *   isAustraliaMode: boolean,        // holidayCountry === 'AU'
 *   hasEligibleWorks: boolean,       // At least one work with australia88Eligible === true
 *   totalVisaDays: number,           // Total visa days accumulated across all time
 *   currentWeekVisaDays: number,     // Visa days earned in the current Mon–Sun week
 *   milestone: 88 | 176 | 'complete',
 *   progressPercent: number,         // 0–100, relative to the current milestone
 *   weeklyBreakdown: Array,          // [{ weekKey, weekStart, weekEnd, hours, visaDays }]
 * }}
 */
export const useAustralia88 = () => {
  const { holidayCountry } = useConfigContext();
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
        const d = createSafeDate(s.startDate || s.date);
        return d >= monday && d <= sunday;
      })
      .reduce((sum, s) => sum + calculateShiftHours(s.startTime, s.endTime), 0);

    return getVisaDaysFromWeeklyHours(thisWeekHours);
  }, [hasEligibleWorks, shifts, works]);

  // Progress toward the current milestone (each milestone is 88 days)
  const progressPercent = useMemo(() => {
    const { totalDays, currentMilestone } = visaData;
    if (currentMilestone === 'complete') return 100;
    const base = currentMilestone === 176 ? 88 : 0;
    return Math.min(100, Math.round(((totalDays - base) / 88) * 100));
  }, [visaData]);

  return {
    isAustraliaMode,
    hasEligibleWorks,
    totalVisaDays: visaData.totalDays,
    currentWeekVisaDays,
    milestone: visaData.currentMilestone,
    progressPercent,
    weeklyBreakdown: visaData.weeklyBreakdown,
  };
};
