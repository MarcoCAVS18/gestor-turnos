// src/hooks/useWeeklyStats.js
import ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** calculateWeeklyStats ***REMOVED*** from '../utils/statsCalculations';

export const useWeeklyStats = (offsetSemanas = 0) => ***REMOVED***
  const ***REMOVED*** calculatePayment, todosLosTrabajos, turnos, turnosDelivery, shiftRanges ***REMOVED*** = useApp();

  return useMemo(() => ***REMOVED***
    return calculateWeeklyStats(***REMOVED***
      turnos,
      turnosDelivery,
      todosLosTrabajos,
      calculatePayment,
      shiftRanges,
      offsetSemanas,
    ***REMOVED***);
  ***REMOVED***, [todosLosTrabajos, turnos, turnosDelivery, offsetSemanas, calculatePayment, shiftRanges]);
***REMOVED***;