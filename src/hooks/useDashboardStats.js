// src/hooks/useDashboardStats.js

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';
import { formatRelativeDate, toLocalDateKey } from '../utils/time';
import { calculateShiftHours } from '../utils/time/timeCalculations';
import { getShiftNetEarnings } from '../utils/deliveryUtils';
import { isShiftCompleted } from '../utils/shiftUtils';
import logger from '../utils/logger';
import { getLocaleFromI18n } from '../utils/locale';

export const useDashboardStats = () => {
  const { t, i18n } = useTranslation();
  const locale = getLocaleFromI18n(i18n.language);
  const { works, deliveryWork, shifts, deliveryShifts, calculatePayment } = useApp();

  // Week (Monday to Sunday) and month ranges. Computed on every stats pass, not
  // memoized once: an app left open overnight must roll over to the new day.
  const getTimeRanges = (today) => {

    // --- WEEK ---
    const dayOfWeek = today.getDay();
    const startDiff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 
    
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - startDiff);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // --- MONTH ---
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    return { weekStart, weekEnd, monthStart, monthEnd };
  };

  const stats = useMemo(() => {
    // Defensive validation
    const validShifts = Array.isArray(shifts) ? shifts : [];
    const validDeliveryShifts = Array.isArray(deliveryShifts) ? deliveryShifts : [];
    const allWork = [...(works || []), ...(deliveryWork || [])];
    const allShifts = [...validShifts, ...validDeliveryShifts];

    // Initial structure
    const defaultStats = {
      totalEarned: 0,
      hoursWorked: 0,
      averagePerHour: 0,
      totalShifts: 0,
      mostProfitableWork: null,
      nextShift: null,
      weeklyTrend: 0,
      favoriteWorks: [],
      monthlyProjection: 0,
      monthlyHoursProjection: 0,

      currentWeek: {
        totalEarned: 0,
        hoursWorked: 0,
        totalShifts: 0,
        daysWorked: 0
      },
      currentMonth: {
        totalEarned: 0,
        hoursWorked: 0,
        totalShifts: 0,
        daysWorked: 0
      },
      allWork,
      allWorks: allWork, // Alias for compatibility
      allShifts
    };

    if (allShifts.length === 0) return defaultStats;

    // Earned money, hours and counts only include shifts already worked.
    // Rostered future shifts are still in allShifts (next shift, calendar).
    const now = new Date();
    const workedShifts = allShifts.filter((shift) => isShiftCompleted(shift, now));

    try {
      let totalEarned = 0;
      let totalHours = 0;
      const earningsByWork = {};
      
      // Temporary counters
      const weekCounters = { earnings: 0, hours: 0, shifts: 0, dates: new Set() };
      const monthCounters = { earnings: 0, hours: 0, shifts: 0, dates: new Set() };
      
      const { weekStart, weekEnd, monthStart, monthEnd } = getTimeRanges(now);

      workedShifts.forEach(shift => {
        const isDelivery = shift.type === 'delivery';
        const foundWork = allWork.find(t => t.id === shift.workId);
        // Delivery shifts carry their own earnings, so an orphaned one (deleted
        // work) still counts; traditional shifts need their work to be priced.
        if (!foundWork && !isDelivery) return;
        const work = foundWork || {
          id: shift.workId || 'deleted-delivery',
          name: shift.platform || 'Delivery',
          type: 'delivery',
          avatarColor: '#10B981',
        };

        // 1-2. Earnings and hours. Traditional shifts use calculatePayment so the
        // dashboard shows the same paid hours (breaks and Live Mode pauses
        // deducted) as the weekly summary.
        let earnings = 0;
        let hours = calculateShiftHours(shift.startTime, shift.endTime);
        if (isDelivery || work.type === 'delivery') {
          // Net of fuel, via gross helper (handles legacy tips correctly).
          earnings = getShiftNetEarnings(shift);
        } else if (typeof calculatePayment === 'function') {
          const result = calculatePayment(shift);
          earnings = result.totalWithDiscount || 0;
          hours = result.hours || 0;
        }

        // 3. Global Accumulators
        totalEarned += earnings;
        totalHours += hours;

        // 4. Work Statistics (for favorites/profitable)
        if (!earningsByWork[work.id]) {
          earningsByWork[work.id] = { work, earnings: 0, hours: 0, shifts: 0 };
        }
        earningsByWork[work.id].earnings += earnings;
        earningsByWork[work.id].hours += hours;
        earningsByWork[work.id].shifts += 1;

        // 5. Temporal Analysis (Week vs Month)
        const shiftDateStr = shift.startDate || shift.date;
        const shiftDate = new Date(`${shiftDateStr}T00:00:00`);

        // --- Current Week ---
        if (shiftDate >= weekStart && shiftDate <= weekEnd) {
          weekCounters.shifts++;
          weekCounters.earnings += earnings;
          weekCounters.hours += hours;
          weekCounters.dates.add(shiftDateStr);
        }

        // --- Current Month ---
        if (shiftDate >= monthStart && shiftDate <= monthEnd) {
          monthCounters.shifts++;
          monthCounters.earnings += earnings;
          monthCounters.hours += hours;
          monthCounters.dates.add(shiftDateStr);
        }
      });

      // Derived calculations
      const mostProfitableWork = Object.values(earningsByWork)
        .sort((a, b) => b.earnings - a.earnings)[0] || null;

      const favoriteWorks = Object.values(earningsByWork)
        .sort((a, b) => b.shifts - a.shifts)
        .slice(0, 3);

      const todayKey = toLocalDateKey();
      const nextShift = allShifts
        .filter(t => (t.startDate || t.date) >= todayKey)
        .sort((a, b) => (a.startDate || a.date).localeCompare(b.startDate || b.date))[0] || null;

      // Simple projection based on month progress (daily average * total days in month)
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const currentDay = now.getDate();
      const monthlyProjection = currentDay > 0 
        ? (monthCounters.earnings / currentDay) * daysInMonth 
        : 0;
      // Hours at the same pace (month-to-date hours, not all-time hours)
      const monthlyHoursProjection = currentDay > 0
        ? (monthCounters.hours / currentDay) * daysInMonth
        : 0;

      return {
        totalEarned,
        hoursWorked: totalHours,
        averagePerHour: totalHours > 0 ? totalEarned / totalHours : 0,
        totalShifts: workedShifts.length,
        mostProfitableWork,
        nextShift,
        favoriteWorks,
        monthlyProjection,
        monthlyHoursProjection,

        currentWeek: {
          totalEarned: weekCounters.earnings,
          hoursWorked: weekCounters.hours,
          totalShifts: weekCounters.shifts,
          daysWorked: weekCounters.dates.size
        },
        currentMonth: {
          totalEarned: monthCounters.earnings,
          hoursWorked: monthCounters.hours,
          totalShifts: monthCounters.shifts,
          daysWorked: monthCounters.dates.size
        },
        allWork,
        allWorks: allWork, // Alias for compatibility
        allShifts
      };

    } catch (error) {
      logger.error('Error calculating statistics:', error);
      return defaultStats;
    }
  }, [works, deliveryWork, shifts, deliveryShifts, calculatePayment]);

  const formatDate = useMemo(() => {
    return (dateString) => formatRelativeDate(dateString, locale, t);
  }, [locale, t]);

  return { ...stats, formatDate };
};
