// src/hooks/useWeeklyStats.js

import ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** calculateWeeklyStats ***REMOVED*** from '../utils/statsCalculations';

export const useWeeklyStats = (weekOffset = 0) => ***REMOVED***
  const ***REMOVED*** calculatePayment, allWorks, shifts, deliveryShifts, shiftRanges ***REMOVED*** = useApp();

  return useMemo(() => ***REMOVED***
    return calculateWeeklyStats(***REMOVED***
      shifts,
      deliveryShifts,
      allWorks,
      calculatePayment,
      shiftRanges,
      weekOffset,
    ***REMOVED***);
  ***REMOVED***, [allWorks, shifts, deliveryShifts, weekOffset, calculatePayment, shiftRanges]);
***REMOVED***;