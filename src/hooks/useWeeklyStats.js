// src/hooks/useWeeklyStats.js
import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { calculateWeeklyStats } from '../utils/statsCalculations';

export const useWeeklyStats = (offsetSemanas = 0) => {
  const { calculatePayment, todosLosTrabajos, turnos, turnosDelivery, shiftRanges } = useApp();

  return useMemo(() => {
    return calculateWeeklyStats({
      turnos,
      turnosDelivery,
      todosLosTrabajos,
      calculatePayment,
      shiftRanges,
      offsetSemanas,
    });
  }, [todosLosTrabajos, turnos, turnosDelivery, offsetSemanas, calculatePayment, shiftRanges]);
};