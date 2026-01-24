// src/contexts/StatsContext.jsx

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useDataContext } from './DataContext';
import { useDeliveryContext } from './DeliveryContext';
import { useConfigContext } from './ConfigContext';
import * as calculationService from '../services/calculationService';
import { createSafeDate } from '../utils/time';

const StatsContext = createContext();

export const useStats = () => {
  return useContext(StatsContext);
};

export const StatsProvider = ({ children }) => {
  // Hooks from data and configuration contexts
  const { works, shifts, loading: dataLoading } = useDataContext();
  const { deliveryWork, deliveryShifts, loading: deliveryLoading } = useDeliveryContext();
  const { shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes, deliveryEnabled, weeklyHoursGoal, thematicColors, loading: configLoading } = useConfigContext();

  // State for week control
  const [weekOffset, setWeekOffset] = useState(0);

  // Combine all work and shifts
  const allWork = useMemo(() => [...works, ...deliveryWork], [works, deliveryWork]);
  const allShifts = useMemo(() => [...shifts, ...deliveryShifts], [shifts, deliveryShifts]);

  // Unified loading
  const loading = useMemo(() => dataLoading || deliveryLoading || configLoading, [dataLoading, deliveryLoading, configLoading]);

  // Create a pre-configured payment calculation function
  const calculatePayment = useCallback((shift) => {
    return calculationService.calculatePayment(
      shift,
      allWork,
      shiftRanges,
      defaultDiscount,
      smokoEnabled,
      smokoMinutes
    );
  }, [allWork, shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes]);

  // Calculate weekly statistics for the current and previous week
  const currentData = useMemo(() => {
    return calculationService.calculateWeeklyStats({
      shifts,
      deliveryShifts,
      allWork,
      calculatePayment,
      shiftRanges,
      weekOffset: weekOffset,
    });
  }, [shifts, deliveryShifts, allWork, calculatePayment, shiftRanges, weekOffset]);

  const previousData = useMemo(() => {
    return calculationService.calculateWeeklyStats({
      shifts,
      deliveryShifts,
      allWork,
      calculatePayment,
      shiftRanges,
      weekOffset: weekOffset - 1,
    });
  }, [shifts, deliveryShifts, allWork, calculatePayment, shiftRanges, weekOffset]);

  // Calculate delivery statistics
  const deliveryStats = useMemo(() => {
    return calculationService.calculateDeliveryStats({
      deliveryWork,
      deliveryShifts,
      period: 'month' // Hardcoded to 'month' as it was in Stats.jsx
    });
  }, [deliveryWork, deliveryShifts]);

  // NEW: Calculate data for weekly evolution chart
  const weeklyEvolutionData = useMemo(() => {
    const weekNames = ['This week', 'Last week', '2 weeks ago', '3 weeks ago'];
    return [0, -1, -2, -3].map((offset, index) => {
      const stats = calculationService.calculateWeeklyStats({
        shifts,
        deliveryShifts,
        allWork,
        calculatePayment,
        shiftRanges,
        weekOffset: offset,
      });
      return {
        week: weekNames[index],
        earnings: stats.totalEarned || 0
      };
    }).reverse(); // Reverse to have the oldest week first
  }, [shifts, deliveryShifts, allWork, calculatePayment, shiftRanges]);


  // Memoized `shiftsByDate` (existing logic)
  const shiftsByDate = useMemo(() => {
    const shiftsMap = {};
    allShifts.forEach(shift => {
      const mainDate = shift.startDate || shift.date;
      if (mainDate) {
        if (!shiftsMap[mainDate]) {
          shiftsMap[mainDate] = [];
        }
        shiftsMap[mainDate].push(shift);
      }

      const isNight = shift.crossesMidnight || (shift.startTime && shift.endTime && shift.startTime.split(':')[0] > shift.endTime.split(':')[0]);

      if (isNight && mainDate) {
        let endDate = shift.endDate;
        if (!endDate) {
          const startDateObj = createSafeDate(mainDate);
          const calculatedEndDate = new Date(startDateObj);
          calculatedEndDate.setDate(calculatedEndDate.getDate() + 1);
          endDate = calculatedEndDate.toISOString().split('T')[0];
        }
        if (endDate && endDate !== mainDate) {
          if (!shiftsMap[endDate]) {
            shiftsMap[endDate] = [];
          }
          if (!shiftsMap[endDate].some(s => s.id === shift.id)) {
            shiftsMap[endDate].push(shift);
          }
        }
      }
    });
    return shiftsMap;
  }, [allShifts]);
  
  // Memoized function to calculate monthly stats (existing logic)
  const calculateMonthlyStats = useCallback((year, month) => {
    return calculationService.calculateMonthlyStats(year, month, shifts, deliveryShifts, calculatePayment);
  }, [shifts, deliveryShifts, calculatePayment]);

  // Memoized value for current month's stats (existing logic)
  const currentMonthStats = useMemo(() => {
    const now = new Date();
    return calculateMonthlyStats(now.getFullYear(), now.getMonth());
  }, [calculateMonthlyStats]);

  const value = {
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
  };

  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  );
};