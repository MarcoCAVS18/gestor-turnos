// src/hooks/useCalculations.js

import ***REMOVED*** useCallback ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** calculateShiftHours ***REMOVED*** from '../utils/time';

export const useCalculations = () => ***REMOVED***
  const ***REMOVED*** works, shiftRanges, defaultDiscount ***REMOVED*** = useApp();

  // Use centralized utility
  const calculateHours = useCallback((start, end) => ***REMOVED***
    return calculateShiftHours(start, end);
  ***REMOVED***, []);

  const calculatePayment = useCallback((shift) => ***REMOVED***
    const work = works.find(t => t.id === shift.workId);
    if (!work) return ***REMOVED*** total: 0, totalWithDiscount: 0, hours: 0 ***REMOVED***;

    const ***REMOVED*** startTime, endTime ***REMOVED*** = shift;

    // Use centralized utility
    const hours = calculateShiftHours(startTime, endTime);

    const [startHour, startMin] = startTime.split(':').map(n => parseInt(n));
    const [endHour, endMin] = endTime.split(':').map(n => parseInt(n));

    let startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;

    if (endMinutes <= startMinutes) ***REMOVED***
      endMinutes += 24 * 60;
    ***REMOVED***

    const [year, month, day] = shift.date.split('-');
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();

    let total = 0;

    if (dayOfWeek === 0) ***REMOVED***
      total = hours * work.rates.sunday;
    ***REMOVED*** else if (dayOfWeek === 6) ***REMOVED***
      total = hours * work.rates.saturday;
    ***REMOVED*** else ***REMOVED***
      const ranges = shiftRanges || ***REMOVED***
        dayStart: 6, dayEnd: 14,
        afternoonStart: 14, afternoonEnd: 20,
        nightStart: 20
      ***REMOVED***;

      const dayStartMin = ranges.dayStart * 60;
      const dayEndMin = ranges.dayEnd * 60;
      const afternoonStartMin = ranges.afternoonStart * 60;
      const afternoonEndMin = ranges.afternoonEnd * 60;

      for (let minute = startMinutes; minute < endMinutes; minute++) ***REMOVED***
        const currentHour = minute % (24 * 60);
        let rate = work.baseRate;

        if (currentHour >= dayStartMin && currentHour < dayEndMin) ***REMOVED***
          rate = work.rates.day;
        ***REMOVED*** else if (currentHour >= afternoonStartMin && currentHour < afternoonEndMin) ***REMOVED***
          rate = work.rates.afternoon;
        ***REMOVED*** else ***REMOVED***
          rate = work.rates.night;
        ***REMOVED***

        total += rate / 60;
      ***REMOVED***
    ***REMOVED***

    const totalWithDiscount = total * (1 - defaultDiscount / 100);

    return ***REMOVED***
      total,
      totalWithDiscount,
      hours
    ***REMOVED***;
  ***REMOVED***, [works, shiftRanges, defaultDiscount]);

  const calculateDayTotal = useCallback((dayShifts) => ***REMOVED***
    return dayShifts.reduce((total, shift) => ***REMOVED***
      const ***REMOVED*** totalWithDiscount ***REMOVED*** = calculatePayment(shift);
      return total + totalWithDiscount;
    ***REMOVED***, 0);
  ***REMOVED***, [calculatePayment]);

  return ***REMOVED***
    calculateHours,
    calculatePayment,
    calculateDayTotal
  ***REMOVED***;
***REMOVED***;