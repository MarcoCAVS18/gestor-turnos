// src/contexts/StatsContext.jsx

import React, ***REMOVED*** createContext, useContext, useState, useMemo, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** useDataContext ***REMOVED*** from './DataContext';
import ***REMOVED*** useDeliveryContext ***REMOVED*** from './DeliveryContext';
import ***REMOVED*** useConfigContext ***REMOVED*** from './ConfigContext';
import * as calculationService from '../services/calculationService';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../utils/time';

const StatsContext = createContext();

export const useStats = () => ***REMOVED***
  return useContext(StatsContext);
***REMOVED***;

export const StatsProvider = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  // Hooks from data and configuration contexts
  const ***REMOVED*** trabajos, turnos, loading: dataLoading ***REMOVED*** = useDataContext();
  const ***REMOVED*** trabajosDelivery, turnosDelivery, loading: deliveryLoading ***REMOVED*** = useDeliveryContext();
  const ***REMOVED*** shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes, deliveryEnabled, weeklyHoursGoal, thematicColors, loading: configLoading ***REMOVED*** = useConfigContext();

  // State for week control
  const [weekOffset, setWeekOffset] = useState(0);

  // Combine all work and shifts
  const allWork = useMemo(() => [...trabajos, ...trabajosDelivery], [trabajos, trabajosDelivery]);
  const allShifts = useMemo(() => [...turnos, ...turnosDelivery], [turnos, turnosDelivery]);

  // Unified loading
  const loading = useMemo(() => dataLoading || deliveryLoading || configLoading, [dataLoading, deliveryLoading, configLoading]);

  // Create a pre-configured payment calculation function
  const calculatePayment = useCallback((shift) => ***REMOVED***
    return calculationService.calculatePayment(
      shift,
      allWork,
      shiftRanges,
      defaultDiscount,
      smokoEnabled,
      smokoMinutes
    );
  ***REMOVED***, [allWork, shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes]);

  // Calculate weekly statistics for the current and previous week
  const currentData = useMemo(() => ***REMOVED***
    return calculationService.calculateWeeklyStats(***REMOVED***
      turnos,
      turnosDelivery,
      allWork,
      calculatePayment,
      shiftRanges,
      weekOffset: weekOffset,
    ***REMOVED***);
  ***REMOVED***, [turnos, turnosDelivery, allWork, calculatePayment, shiftRanges, weekOffset]);

  const previousData = useMemo(() => ***REMOVED***
    return calculationService.calculateWeeklyStats(***REMOVED***
      turnos,
      turnosDelivery,
      allWork,
      calculatePayment,
      shiftRanges,
      weekOffset: weekOffset - 1,
    ***REMOVED***);
  ***REMOVED***, [turnos, turnosDelivery, allWork, calculatePayment, shiftRanges, weekOffset]);

  // Calculate delivery statistics
  const deliveryStats = useMemo(() => ***REMOVED***
    return calculationService.calculateDeliveryStats(***REMOVED***
      trabajosDelivery,
      turnosDelivery,
      period: 'month' // Hardcoded to 'month' as it was in Stats.jsx
    ***REMOVED***);
  ***REMOVED***, [trabajosDelivery, turnosDelivery]);

  // NEW: Calculate data for weekly evolution chart
  const weeklyEvolutionData = useMemo(() => ***REMOVED***
    const weekNames = ['This week', 'Last week', '2 weeks ago', '3 weeks ago'];
    return [0, -1, -2, -3].map((offset, index) => ***REMOVED***
      const stats = calculationService.calculateWeeklyStats(***REMOVED***
        turnos,
        turnosDelivery,
        allWork,
        calculatePayment,
        shiftRanges,
        weekOffset: offset,
      ***REMOVED***);
      return ***REMOVED***
        week: weekNames[index],
        earnings: stats.totalEarned || 0
      ***REMOVED***;
    ***REMOVED***).reverse(); // Reverse to have the oldest week first
  ***REMOVED***, [turnos, turnosDelivery, allWork, calculatePayment, shiftRanges]);


  // Memoized `shiftsByDate` (existing logic)
  const shiftsByDate = useMemo(() => ***REMOVED***
    const shiftsMap = ***REMOVED******REMOVED***;
    allShifts.forEach(shift => ***REMOVED***
      const mainDate = shift.startDate || shift.date;
      if (mainDate) ***REMOVED***
        if (!shiftsMap[mainDate]) ***REMOVED***
          shiftsMap[mainDate] = [];
        ***REMOVED***
        shiftsMap[mainDate].push(shift);
      ***REMOVED***

      const isNight = shift.crossesMidnight || (shift.startTime && shift.endTime && shift.startTime.split(':')[0] > shift.endTime.split(':')[0]);

      if (isNight && mainDate) ***REMOVED***
        let endDate = shift.endDate;
        if (!endDate) ***REMOVED***
          const startDateObj = createSafeDate(mainDate);
          const calculatedEndDate = new Date(startDateObj);
          calculatedEndDate.setDate(calculatedEndDate.getDate() + 1);
          endDate = calculatedEndDate.toISOString().split('T')[0];
        ***REMOVED***
        if (endDate && endDate !== mainDate) ***REMOVED***
          if (!shiftsMap[endDate]) ***REMOVED***
            shiftsMap[endDate] = [];
          ***REMOVED***
          if (!shiftsMap[endDate].some(s => s.id === shift.id)) ***REMOVED***
            shiftsMap[endDate].push(shift);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***);
    return shiftsMap;
  ***REMOVED***, [allShifts]);
  
  // Memoized function to calculate monthly stats (existing logic)
  const calculateMonthlyStats = useCallback((year, month) => ***REMOVED***
    return calculationService.calculateMonthlyStats(year, month, turnos, turnosDelivery, calculatePayment);
  ***REMOVED***, [turnos, turnosDelivery, calculatePayment]);

  // Memoized value for current month's stats (existing logic)
  const currentMonthStats = useMemo(() => ***REMOVED***
    const now = new Date();
    return calculateMonthlyStats(now.getFullYear(), now.getMonth());
  ***REMOVED***, [calculateMonthlyStats]);

  const value = ***REMOVED***
    // Loading state
    loading,
    
    // Existing data and functions
    allShifts,
    shiftsByDate,
    calculateMonthlyStats,
    currentMonthStats,

    // New data and functions for weekly statistics
    currentData,
    previousData,
    weekOffset,
    setWeekOffset,
    allWork,
    weeklyEvolutionData,
    
    // Delivery statistics
    deliveryStats,

    // Important configuration
    deliveryEnabled,
    weeklyHoursGoal,
    thematicColors,
    smokoEnabled,
    smokoMinutes,

    // To not break other dependencies that might use it directly
    calculatePayment, 
  ***REMOVED***;

  return (
    <StatsContext.Provider value=***REMOVED***value***REMOVED***>
      ***REMOVED***children***REMOVED***
    </StatsContext.Provider>
  );
***REMOVED***;