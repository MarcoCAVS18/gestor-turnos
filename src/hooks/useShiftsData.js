// src/hooks/useShiftsData.js

import ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

export function useShiftsData() ***REMOVED***
  const ***REMOVED*** shiftsByDate, works, deliveryWork ***REMOVED*** = useApp();

  const allJobs = useMemo(() => [...works, ...deliveryWork], [works, deliveryWork]);

  const sortedDays = useMemo(() => ***REMOVED***
    return Object.entries(shiftsByDate).sort(([a], [b]) => new Date(b) - new Date(a));
  ***REMOVED***, [shiftsByDate]);

  const shiftsData = (daysShown) => ***REMOVED***
    const daysToShow = sortedDays.slice(0, daysShown);
    const hasMoreDays = sortedDays.length > daysShown;
    const remainingDays = sortedDays.length - daysShown;
    const hasShifts = sortedDays.length > 0;

    return ***REMOVED***
      sortedDays,
      daysToShow,
      hasMoreDays,
      remainingDays,
      hasShifts,
      allJobs
    ***REMOVED***;
  ***REMOVED***;

  return ***REMOVED*** shiftsData ***REMOVED***;
***REMOVED***