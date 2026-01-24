// src/hooks/useDashboardStats.js

import ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** formatRelativeDate ***REMOVED*** from '../utils/time';
import ***REMOVED*** calculateShiftHours ***REMOVED*** from '../utils/time/timeCalculations';

export const useDashboardStats = () => ***REMOVED***
  const ***REMOVED*** trabajos, deliveryWork, turnos, deliveryShifts, calculatePayment ***REMOVED*** = useApp();

  // Function to get dates of the current week (Monday to Sunday)
  const timeRanges = useMemo(() => ***REMOVED***
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

    return ***REMOVED*** weekStart, weekEnd, monthStart, monthEnd ***REMOVED***;
  ***REMOVED***, []);

  const stats = useMemo(() => ***REMOVED***
    // Defensive validation
    const validShifts = Array.isArray(turnos) ? turnos : [];
    const validDeliveryShifts = Array.isArray(deliveryShifts) ? deliveryShifts : [];
    const allWork = [...(trabajos || []), ...(deliveryWork || [])];
    const allShifts = [...validShifts, ...validDeliveryShifts];

    // Initial structure
    const defaultStats = ***REMOVED***
      totalEarned: 0,
      hoursWorked: 0,
      averagePerHour: 0,
      totalShifts: 0,
      mostProfitableWork: null,
      nextShift: null,
      weeklyTrend: 0,
      favoriteWork: [],
      monthlyProjection: 0,

      currentWeek: ***REMOVED***
        totalEarned: 0,
        hoursWorked: 0,
        totalShifts: 0,
        daysWorked: 0
      ***REMOVED***,
      currentMonth: ***REMOVED***
        totalEarned: 0,
        hoursWorked: 0,
        totalShifts: 0,
        daysWorked: 0
      ***REMOVED***,
      allWork,
      allShifts
    ***REMOVED***;

    if (allShifts.length === 0) return defaultStats;

    try ***REMOVED***
      let totalEarned = 0;
      let totalHours = 0;
      const earningsByWork = ***REMOVED******REMOVED***;
      
      // Temporary counters
      const weekCounters = ***REMOVED*** earnings: 0, hours: 0, shifts: 0, dates: new Set() ***REMOVED***;
      const monthCounters = ***REMOVED*** earnings: 0, hours: 0, shifts: 0, dates: new Set() ***REMOVED***;
      
      const ***REMOVED*** weekStart, weekEnd, monthStart, monthEnd ***REMOVED*** = timeRanges;

      allShifts.forEach(shift => ***REMOVED***
        const work = allWork.find(t => t.id === shift.workId);
        if (!work) return;

        // 1. Calculate Earnings
        let earnings = 0;
        if (shift.type === 'delivery' || work.type === 'delivery') ***REMOVED***
          earnings = parseFloat(shift.totalEarnings || shift.totalEarned || 0);
        ***REMOVED*** else if (typeof calculatePayment === 'function') ***REMOVED***
          const result = calculatePayment(shift);
          earnings = result.totalWithDiscount || result.totalConDescuento || 0;
        ***REMOVED***

        // 2. Calculate Hours (Using your utility)
        const hours = calculateShiftHours(shift.startTime, shift.endTime);

        // 3. Global Accumulators
        totalEarned += earnings;
        totalHours += hours;

        // 4. Work Statistics (for favorites/profitable)
        if (!earningsByWork[work.id]) ***REMOVED***
          earningsByWork[work.id] = ***REMOVED*** work, earnings: 0, hours: 0, shifts: 0 ***REMOVED***;
        ***REMOVED***
        earningsByWork[work.id].earnings += earnings;
        earningsByWork[work.id].hours += hours;
        earningsByWork[work.id].shifts += 1;

        // 5. Temporal Analysis (Week vs Month)
        const shiftDateStr = shift.startDate || shift.date;
        const shiftDate = new Date(`$***REMOVED***shiftDateStr***REMOVED***T00:00:00`);

        // --- Current Week ---
        if (shiftDate >= weekStart && shiftDate <= weekEnd) ***REMOVED***
          weekCounters.shifts++;
          weekCounters.earnings += earnings;
          weekCounters.hours += hours;
          weekCounters.dates.add(shiftDateStr);
        ***REMOVED***

        // --- Current Month ---
        if (shiftDate >= monthStart && shiftDate <= monthEnd) ***REMOVED***
          monthCounters.shifts++;
          monthCounters.earnings += earnings;
          monthCounters.hours += hours;
          monthCounters.dates.add(shiftDateStr);
        ***REMOVED***
      ***REMOVED***);

      // Derived calculations
      const mostProfitableWork = Object.values(earningsByWork)
        .sort((a, b) => b.earnings - a.earnings)[0] || null;

      const favoriteWork = Object.values(earningsByWork)
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

      return ***REMOVED***
        totalEarned,
        hoursWorked: totalHours,
        averagePerHour: totalHours > 0 ? totalEarned / totalHours : 0,
        totalShifts: allShifts.length,
        mostProfitableWork,
        nextShift,
        favoriteWork,
        monthlyProjection,

        currentWeek: ***REMOVED***
          totalEarned: weekCounters.earnings,
          hoursWorked: weekCounters.hours,
          totalShifts: weekCounters.shifts,
          daysWorked: weekCounters.dates.size
        ***REMOVED***,
        currentMonth: ***REMOVED***
          totalEarned: monthCounters.earnings,
          hoursWorked: monthCounters.hours,
          totalShifts: monthCounters.shifts,
          daysWorked: monthCounters.dates.size
        ***REMOVED***,
        allWork,
        allShifts
      ***REMOVED***;

    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error calculating statistics:', error);
      return defaultStats;
    ***REMOVED***
  ***REMOVED***, [trabajos, deliveryWork, turnos, deliveryShifts, calculatePayment, timeRanges]);

  const formatDate = useMemo(() => formatRelativeDate, []);

  return ***REMOVED*** ...stats, formatDate ***REMOVED***;
***REMOVED***;