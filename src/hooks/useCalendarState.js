// src/hooks/useCalendarState.js

import ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED***
  createLocalDate,
  localDateToISO,
  dateIsToday
***REMOVED*** from '../utils/calendarUtils';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../utils/time';

export const useCalendarState = (shifts, onSelectedDay) => ***REMOVED***
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

  // Update current date every minute
  useEffect(() => ***REMOVED***
    const interval = setInterval(() => ***REMOVED***
      const newDate = new Date();
      setCurrentDate(newDate);
      
      if (newDate.getDate() !== currentDate.getDate()) ***REMOVED***
        setCurrentMonth(newDate.getMonth());
        setCurrentYear(newDate.getFullYear());
      ***REMOVED***
    ***REMOVED***, 60000);

    return () => clearInterval(interval);
  ***REMOVED***, [currentDate]);

  // Get shifts of the day considering night shifts
  const getShiftsOfDay = (date, allShifts) => ***REMOVED***
    const dateStr = localDateToISO(date);
    
    return allShifts.filter(shift => ***REMOVED***
      // Check main date
      const mainDate = shift.startDate || shift.date;
      if (mainDate === dateStr) ***REMOVED***
        return true;
      ***REMOVED***
      
      // Check if it is a night shift ending on this date
      const isNightShift = shift.crossesMidnight || 
        (shift.startTime && shift.endTime && 
         shift.startTime.split(':')[0] > shift.endTime.split(':')[0]);
      
      if (isNightShift) ***REMOVED***
        // If it has explicit endDate, use it
        if (shift.endDate && shift.endDate === dateStr) ***REMOVED***
          return true;
        ***REMOVED***
        
        // If it doesn't have endDate but is night shift, calculate if it ends today
        if (!shift.endDate && mainDate) ***REMOVED***
          const startDateObj = createSafeDate(mainDate);
          const calculatedEndDate = new Date(startDateObj);
          calculatedEndDate.setDate(calculatedEndDate.getDate() + 1);
          const endDateStr = calculatedEndDate.toISOString().split('T')[0];
          
          if (endDateStr === dateStr) ***REMOVED***
            return true;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
      
      return false;
    ***REMOVED***);
  ***REMOVED***;

  // Get days of the month considering night shifts
  const getDaysOfMonth = () => ***REMOVED***
    const firstDay = createLocalDate(currentYear, currentMonth, 1);
    const lastDay = createLocalDate(currentYear, currentMonth + 1, 0);

    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6;

    const days = [];

    // Days from previous month
    for (let i = startDay; i > 0; i--) ***REMOVED***
      const date = createLocalDate(currentYear, currentMonth, -i + 1);
      const shiftsOfDay = getShiftsOfDay(date, shifts);
      days.push(***REMOVED***
        date,
        day: date.getDate(),
        currentMonth: false,
        hasShifts: shiftsOfDay.length > 0,
        shiftsOfDay
      ***REMOVED***);
    ***REMOVED***

    // Days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) ***REMOVED***
      const date = createLocalDate(currentYear, currentMonth, i);
      const shiftsOfDay = getShiftsOfDay(date, shifts);
      days.push(***REMOVED***
        date,
        day: i,
        currentMonth: true,
        hasShifts: shiftsOfDay.length > 0,
        shiftsOfDay,
        isToday: dateIsToday(date, currentDate)
      ***REMOVED***);
    ***REMOVED***

    // Complete the last week
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) ***REMOVED***
      const date = createLocalDate(currentYear, currentMonth + 1, i);
      const shiftsOfDay = getShiftsOfDay(date, shifts);
      days.push(***REMOVED***
        date,
        day: i,
        currentMonth: false,
        hasShifts: shiftsOfDay.length > 0,
        shiftsOfDay
      ***REMOVED***);
    ***REMOVED***

    return days;
  ***REMOVED***;

  // Handlers
  const changeMonth = (increment) => ***REMOVED***
    let newMonth = currentMonth + increment;
    let newYear = currentYear;

    if (newMonth < 0) ***REMOVED***
      newMonth = 11;
      newYear--;
    ***REMOVED*** else if (newMonth > 11) ***REMOVED***
      newMonth = 0;
      newYear++;
    ***REMOVED***

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  ***REMOVED***;

  const goToToday = () => ***REMOVED***
    const today = new Date();
    setCurrentDate(today);
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    
    const dateStr = localDateToISO(today);
    setSelectedDay(dateStr);
    
    if (onSelectedDay) ***REMOVED***
      onSelectedDay(today);
    ***REMOVED***
  ***REMOVED***;

  const goToDay = (date) => ***REMOVED***
    const dateStr = localDateToISO(date);
    setSelectedDay(dateStr);
    
    if (onSelectedDay) ***REMOVED***
      onSelectedDay(date);
    ***REMOVED***
  ***REMOVED***;

  return ***REMOVED***
    currentDate,
    currentMonth,
    currentYear,
    selectedDay,
    getDaysOfMonth,
    changeMonth,
    goToToday,
    goToDay
  ***REMOVED***;
***REMOVED***;