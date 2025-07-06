// src/hooks/useShiftsData.js

import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';

export function useShiftsData() {
  const { turnosPorFecha, trabajos, trabajosDelivery } = useApp();

  const allJobs = useMemo(() => [...trabajos, ...trabajosDelivery], [trabajos, trabajosDelivery]);

  const sortedDays = useMemo(() => {
    return Object.entries(turnosPorFecha).sort(([a], [b]) => new Date(b) - new Date(a));
  }, [turnosPorFecha]);

  const shiftsData = (daysShown) => {
    const daysToShow = sortedDays.slice(0, daysShown);
    const hasMoreDays = sortedDays.length > daysShown;
    const remainingDays = sortedDays.length - daysShown;
    const hasShifts = sortedDays.length > 0;

    return {
      sortedDays,
      daysToShow,
      hasMoreDays,
      remainingDays,
      hasShifts,
      allJobs
    };
  };

  return { shiftsData };
}