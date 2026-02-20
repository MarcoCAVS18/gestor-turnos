// src/hooks/useDashboardStats.js

import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { formatRelativeDate } from '../utils/time';
import { calculateShiftHours } from '../utils/time/timeCalculations';
import logger from '../utils/logger';

export const useDashboardStats = () => {
  const { works, deliveryWork, shifts, deliveryShifts, calculatePayment } = useApp();

  // Function to get dates of the current week (Monday to Sunday)
  const timeRanges = useMemo(() => {
    const today = new Date();
    
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
  }, []);

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

    try {
      let totalEarned = 0;
      let totalHours = 0;
      const earningsByWork = {};
      
      // Temporary counters
      const weekCounters = { earnings: 0, hours: 0, shifts: 0, dates: new Set() };
      const monthCounters = { earnings: 0, hours: 0, shifts: 0, dates: new Set() };
      
      const { weekStart, weekEnd, monthStart, monthEnd } = timeRanges;

      allShifts.forEach(shift => {
        const work = allWork.find(t => t.id === shift.workId);
        if (!work) return;

        // 1. Calculate Earnings
        let earnings = 0;
        if (shift.type === 'delivery' || work.type === 'delivery') {
          earnings = parseFloat(shift.totalEarnings || 0);
        } else if (typeof calculatePayment === 'function') {
          const result = calculatePayment(shift);
          earnings = result.totalWithDiscount || 0;
        }

        // 2. Calculate Hours (Using your utility)
        const hours = calculateShiftHours(shift.startTime, shift.endTime);

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

      const nextShift = allShifts
        .filter(t => (t.startDate || t.date) >= new Date().toISOString().split('T')[0])
        .sort((a, b) => (a.startDate || a.date).localeCompare(b.startDate || b.date))[0] || null;

      // Simple projection based on month progress (daily average * total days in month)
      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      const currentDay = new Date().getDate();
      const monthlyProjection = currentDay > 0 
        ? (monthCounters.earnings / currentDay) * daysInMonth 
        : 0;

      return {
        totalEarned,
        hoursWorked: totalHours,
        averagePerHour: totalHours > 0 ? totalEarned / totalHours : 0,
        totalShifts: allShifts.length,
        mostProfitableWork,
        nextShift,
        favoriteWorks,
        monthlyProjection,

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
  }, [works, deliveryWork, shifts, deliveryShifts, calculatePayment, timeRanges]);

  const formatDate = useMemo(() => formatRelativeDate, []);

  return { ...stats, formatDate };
};