// src/hooks/useShiftFilters.js

import { useMemo, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { determineShiftType } from '../utils/shiftDetailsUtils';
import { createSafeDate } from '../utils/time';

export const useShiftFilters = (shiftsByDate) => {
  const { works, deliveryWork, shiftRanges } = useApp();
  
  // Filter state
  const [filters, setFilters] = useState({
    work: 'all',
    weekDays: [],
    shiftType: 'all'
  });

  // Combine all works
  const allWorks = useMemo(() => [
    ...works,
    ...deliveryWork
  ], [works, deliveryWork]);

  // Function to get the day of the week from a date
  const getWeekDay = (dateStr) => {
    const date = createSafeDate(dateStr);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  };

  // Function to filter shifts
  const filterShifts = useMemo(() => {
    if (!shiftsByDate) return {};

    const filteredShifts = {};

    Object.entries(shiftsByDate).forEach(([date, shifts]) => {
      // Filter by day of the week
      if (filters.weekDays.length > 0) {
        const weekDay = getWeekDay(date);
        if (!filters.weekDays.includes(weekDay)) {
          return; // Skip this date
        }
      }

      // Filter shifts for this date
      const shiftsOfDayFiltered = shifts.filter(shift => {
        // Work filter
        if (filters.work !== 'all') {
          if (shift.workId !== filters.work) {
            return false;
          }
        }

        // Shift type filter
        if (filters.shiftType !== 'all') {
          const shiftType = determineShiftType(shift, shiftRanges);
          if (shiftType !== filters.shiftType) {
            return false;
          }
        }

        return true;
      });

      // Only add the date if it has shifts after filtering
      if (shiftsOfDayFiltered.length > 0) {
        filteredShifts[date] = shiftsOfDayFiltered;
      }
    });

    return filteredShifts;
  }, [shiftsByDate, filters, shiftRanges]);

  // Filter statistics
  const filterStats = useMemo(() => {
    const totalShifts = Object.values(shiftsByDate || {}).flat().length;
    const filteredShiftsCount = Object.values(filterShifts).flat().length;
    const daysShown = Object.keys(filterShifts).length;
    const totalDays = Object.keys(shiftsByDate || {}).length;

    return {
      totalShifts,
      filteredShiftsCount,
      daysShown,
      totalDays,
      filteredPercentage: totalShifts > 0 ? (filteredShiftsCount / totalShifts) * 100 : 0
    };
  }, [shiftsByDate, filterShifts]);

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    return filters.work !== 'all' || 
           filters.weekDays.length > 0 || 
           filters.shiftType !== 'all';
  }, [filters]);

  // Function to update filters
  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };

  // Function to clear filters
  const clearFilters = () => {
    setFilters({
      work: 'all',
      weekDays: [],
      shiftType: 'all'
    });
  };

  return {
    filters,
    updateFilters,
    clearFilters,
    filteredShifts: filterShifts,
    filterStats,
    hasActiveFilters,
    allWorks
  };
};