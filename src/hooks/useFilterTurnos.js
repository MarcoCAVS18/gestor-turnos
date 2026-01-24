// src/hooks/useShiftFilters.js

import ***REMOVED*** useMemo, useState ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** determineShiftType ***REMOVED*** from '../utils/shiftDetailsUtils';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../utils/time';

export const useShiftFilters = (shiftsByDate) => ***REMOVED***
  const ***REMOVED*** works, deliveryWorks, shiftRanges ***REMOVED*** = useApp();
  
  // Filter state
  const [filters, setFilters] = useState(***REMOVED***
    work: 'all',
    weekDays: [],
    shiftType: 'all'
  ***REMOVED***);

  // Combine all works
  const allWorks = useMemo(() => [
    ...works,
    ...deliveryWorks
  ], [works, deliveryWorks]);

  // Function to get the day of the week from a date
  const getWeekDay = (dateStr) => ***REMOVED***
    const date = createSafeDate(dateStr);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  ***REMOVED***;

  // Function to filter shifts
  const filterShifts = useMemo(() => ***REMOVED***
    if (!shiftsByDate) return ***REMOVED******REMOVED***;

    const filteredShifts = ***REMOVED******REMOVED***;

    Object.entries(shiftsByDate).forEach(([date, shifts]) => ***REMOVED***
      // Filter by day of the week
      if (filters.weekDays.length > 0) ***REMOVED***
        const weekDay = getWeekDay(date);
        if (!filters.weekDays.includes(weekDay)) ***REMOVED***
          return; // Skip this date
        ***REMOVED***
      ***REMOVED***

      // Filter shifts for this date
      const shiftsOfDayFiltered = shifts.filter(shift => ***REMOVED***
        // Work filter
        if (filters.work !== 'all') ***REMOVED***
          if (shift.workId !== filters.work) ***REMOVED***
            return false;
          ***REMOVED***
        ***REMOVED***

        // Shift type filter
        if (filters.shiftType !== 'all') ***REMOVED***
          const shiftType = determineShiftType(shift, shiftRanges);
          if (shiftType !== filters.shiftType) ***REMOVED***
            return false;
          ***REMOVED***
        ***REMOVED***

        return true;
      ***REMOVED***);

      // Only add the date if it has shifts after filtering
      if (shiftsOfDayFiltered.length > 0) ***REMOVED***
        filteredShifts[date] = shiftsOfDayFiltered;
      ***REMOVED***
    ***REMOVED***);

    return filteredShifts;
  ***REMOVED***, [shiftsByDate, filters, shiftRanges]);

  // Filter statistics
  const filterStats = useMemo(() => ***REMOVED***
    const totalShifts = Object.values(shiftsByDate || ***REMOVED******REMOVED***).flat().length;
    const filteredShiftsCount = Object.values(filterShifts).flat().length;
    const daysShown = Object.keys(filterShifts).length;
    const totalDays = Object.keys(shiftsByDate || ***REMOVED******REMOVED***).length;

    return ***REMOVED***
      totalShifts,
      filteredShiftsCount,
      daysShown,
      totalDays,
      filteredPercentage: totalShifts > 0 ? (filteredShiftsCount / totalShifts) * 100 : 0
    ***REMOVED***;
  ***REMOVED***, [shiftsByDate, filterShifts]);

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => ***REMOVED***
    return filters.work !== 'all' || 
           filters.weekDays.length > 0 || 
           filters.shiftType !== 'all';
  ***REMOVED***, [filters]);

  // Function to update filters
  const updateFilters = (newFilters) => ***REMOVED***
    setFilters(newFilters);
  ***REMOVED***;

  // Function to clear filters
  const clearFilters = () => ***REMOVED***
    setFilters(***REMOVED***
      work: 'all',
      weekDays: [],
      shiftType: 'all'
    ***REMOVED***);
  ***REMOVED***;

  return ***REMOVED***
    filters,
    updateFilters,
    clearFilters,
    filteredShifts: filterShifts,
    filterStats,
    hasActiveFilters,
    allWorks
  ***REMOVED***;
***REMOVED***;