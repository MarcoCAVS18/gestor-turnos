// src/hooks/useCalendarState.js

import { useState, useEffect } from 'react';
import {
  createLocalDate,
  localDateToISO,
  dateIsToday
} from '../utils/calendarUtils';
import { createSafeDate } from '../utils/time';

export const useCalendarState = (shifts, onSelectedDay) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

  // Update current date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = new Date();
      setCurrentDate(newDate);
      
      if (newDate.getDate() !== currentDate.getDate()) {
        setCurrentMonth(newDate.getMonth());
        setCurrentYear(newDate.getFullYear());
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [currentDate]);

  // Get shifts of the day considering night shifts
  const getShiftsOfDay = (date, allShifts) => {
    const dateStr = localDateToISO(date);
    
    return allShifts.filter(shift => {
      // Check main date
      const mainDate = shift.startDate || shift.date;
      if (mainDate === dateStr) {
        return true;
      }
      
      // Check if it is a night shift ending on this date
      const isNightShift = shift.crossesMidnight || 
        (shift.startTime && shift.endTime && 
         shift.startTime.split(':')[0] > shift.endTime.split(':')[0]);
      
      if (isNightShift) {
        // If it has explicit endDate, use it
        if (shift.endDate && shift.endDate === dateStr) {
          return true;
        }
        
        // If it doesn't have endDate but is night shift, calculate if it ends today
        if (!shift.endDate && mainDate) {
          const startDateObj = createSafeDate(mainDate);
          const calculatedEndDate = new Date(startDateObj);
          calculatedEndDate.setDate(calculatedEndDate.getDate() + 1);
          const endDateStr = calculatedEndDate.toISOString().split('T')[0];
          
          if (endDateStr === dateStr) {
            return true;
          }
        }
      }
      
      return false;
    });
  };

  // Get days of the month considering night shifts
  const getDaysOfMonth = () => {
    const firstDay = createLocalDate(currentYear, currentMonth, 1);
    const lastDay = createLocalDate(currentYear, currentMonth + 1, 0);

    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6;

    const days = [];

    // Days from previous month
    for (let i = startDay; i > 0; i--) {
      const date = createLocalDate(currentYear, currentMonth, -i + 1);
      const shiftsOfDay = getShiftsOfDay(date, shifts);
      days.push({
        date,
        day: date.getDate(),
        currentMonth: false,
        hasShifts: shiftsOfDay.length > 0,
        shiftsOfDay
      });
    }

    // Days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = createLocalDate(currentYear, currentMonth, i);
      const shiftsOfDay = getShiftsOfDay(date, shifts);
      days.push({
        date,
        day: i,
        currentMonth: true,
        hasShifts: shiftsOfDay.length > 0,
        shiftsOfDay,
        isToday: dateIsToday(date, currentDate)
      });
    }

    // Complete the last week
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = createLocalDate(currentYear, currentMonth + 1, i);
      const shiftsOfDay = getShiftsOfDay(date, shifts);
      days.push({
        date,
        day: i,
        currentMonth: false,
        hasShifts: shiftsOfDay.length > 0,
        shiftsOfDay
      });
    }

    return days;
  };

  // Handlers
  const changeMonth = (increment) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    
    const dateStr = localDateToISO(today);
    setSelectedDay(dateStr);
    
    if (onSelectedDay) {
      onSelectedDay(today);
    }
  };

  const goToDay = (date) => {
    const dateStr = localDateToISO(date);
    setSelectedDay(dateStr);
    
    if (onSelectedDay) {
      onSelectedDay(date);
    }
  };

  return {
    currentDate,
    currentMonth,
    currentYear,
    selectedDay,
    getDaysOfMonth,
    changeMonth,
    goToToday,
    goToDay
  };
};