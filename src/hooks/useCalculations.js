// src/hooks/useCalculations.js

import { useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { calculateShiftHours } from '../utils/time';

export const useCalculations = () => {
  const { works, shiftRanges, defaultDiscount } = useApp();

  // Use centralized utility
  const calculateHours = useCallback((start, end) => {
    return calculateShiftHours(start, end);
  }, []);

  const calculatePayment = useCallback((shift) => {
    const work = works.find(t => t.id === shift.workId);
    if (!work) return { total: 0, totalWithDiscount: 0, hours: 0 };

    const { startTime, endTime } = shift;

    // Use centralized utility
    const hours = calculateShiftHours(startTime, endTime);

    const [startHour, startMin] = startTime.split(':').map(n => parseInt(n));
    const [endHour, endMin] = endTime.split(':').map(n => parseInt(n));

    let startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;

    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60;
    }

    const [year, month, day] = shift.date.split('-');
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();

    let total = 0;

    if (dayOfWeek === 0) {
      total = hours * work.rates.sunday;
    } else if (dayOfWeek === 6) {
      total = hours * work.rates.saturday;
    } else {
      const ranges = shiftRanges || {
        dayStart: 6, dayEnd: 14,
        afternoonStart: 14, afternoonEnd: 20,
        nightStart: 20
      };

      const dayStartMin = ranges.dayStart * 60;
      const dayEndMin = ranges.dayEnd * 60;
      const afternoonStartMin = ranges.afternoonStart * 60;
      const afternoonEndMin = ranges.afternoonEnd * 60;

      for (let minute = startMinutes; minute < endMinutes; minute++) {
        const currentHour = minute % (24 * 60);
        let rate = work.baseRate;

        if (currentHour >= dayStartMin && currentHour < dayEndMin) {
          rate = work.rates.day;
        } else if (currentHour >= afternoonStartMin && currentHour < afternoonEndMin) {
          rate = work.rates.afternoon;
        } else {
          rate = work.rates.night;
        }

        total += rate / 60;
      }
    }

    const totalWithDiscount = total * (1 - defaultDiscount / 100);

    return {
      total,
      totalWithDiscount,
      hours
    };
  }, [works, shiftRanges, defaultDiscount]);

  const calculateDayTotal = useCallback((dayShifts) => {
    return dayShifts.reduce((total, shift) => {
      const { totalWithDiscount } = calculatePayment(shift);
      return total + totalWithDiscount;
    }, 0);
  }, [calculatePayment]);

  return {
    calculateHours,
    calculatePayment,
    calculateDayTotal
  };
};