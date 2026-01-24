// src/components/calendar/Calendar/index.jsx

import React from 'react';
import { useApp } from '../../../contexts/AppContext';
import { useCalendarState } from '../../../hooks/useCalendarState';
import Card from '../../ui/Card';
import CalendarHeader from '../CalendarHeader';
import CalendarGrid from '../CalendarGrid';

const Calendar = ({ onDaySelected }) => {
  const { shiftsByDate, allJobs, thematicColors } = useApp();
  
  // Get all combined shifts from context
  const allShifts = React.useMemo(() => {
    if (!shiftsByDate) return [];
    
    const shifts = [];
    Object.entries(shiftsByDate).forEach(([date, dayShifts]) => {
      if (Array.isArray(dayShifts)) {
        shifts.push(...dayShifts);
      }
    });
    
    return shifts;
  }, [shiftsByDate]);
  
  const {
    currentDate,
    currentMonth,
    currentYear,
    currentSelectedDay,
    getDaysOfMonth,
    changeMonth,
    goToToday,
    goToDay
  } = useCalendarState(allShifts, onDaySelected);

  const days = getDaysOfMonth();

  return (
    <Card className="overflow-hidden">
      <CalendarHeader
        currentMonth={currentMonth}
        currentYear={currentYear}
        onChangeMonth={changeMonth}
        onGoToToday={goToToday}
        thematicColors={thematicColors}
      />

      <CalendarGrid
        days={days}
        currentDate={currentDate}
        currentSelectedDay={currentSelectedDay}
        jobs={allJobs || []}
        thematicColors={thematicColors}
        onDayClick={goToDay}
      />
    </Card>
  );
};

export default Calendar;