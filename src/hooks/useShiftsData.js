// src/hooks/useShiftsData.js

import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';

export function useShiftsData() {
  const { shiftsByDate, works, deliveryWork } = useApp();

  const allJobs = useMemo(() => [...works, ...deliveryWork], [works, deliveryWork]);

  const sortedDays = useMemo(() => {
    return Object.entries(shiftsByDate).sort(([a], [b]) => new Date(b) - new Date(a));
  }, [shiftsByDate]);

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