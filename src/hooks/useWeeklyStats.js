// src/hooks/useWeeklyStats.js

import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { calculateWeeklyStats } from '../utils/statsCalculations';

export const useWeeklyStats = (weekOffset = 0) => {
  const { calculatePayment, allWorks, shifts, deliveryShifts, shiftRanges } = useApp();

  return useMemo(() => {
    return calculateWeeklyStats({
      shifts,
      deliveryShifts,
      allWorks,
      calculatePayment,
      shiftRanges,
      weekOffset,
    });
  }, [allWorks, shifts, deliveryShifts, weekOffset, calculatePayment, shiftRanges]);
};