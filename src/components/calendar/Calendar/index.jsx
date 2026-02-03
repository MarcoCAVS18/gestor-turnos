// src/components/calendar/Calendar/index.jsx

import React from 'react';
import { useApp } from '../../../contexts/AppContext';
import { useCalendarState } from '../../../hooks/useCalendarState';
import Card from '../../ui/Card';
import CalendarHeader from '../CalendarHeader';
import CalendarGrid from '../CalendarGrid';

const Calendar = ({ onSelectedDay }) => {
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
    selectedDay,
    getDaysOfMonth,
    changeMonth,
    goToToday,
    goToDay
  } = useCalendarState(allShifts, onSelectedDay);

  const days = getDaysOfMonth();

  return (
    <Card className="overflow-hidden">
      <CalendarHeader
        currentMonth={currentMonth}
        currentYear={currentYear}
        selectedDay={selectedDay}
        onChangeMonth={changeMonth}
        onGoToToday={goToToday}
        thematicColors={thematicColors}
      />

      <CalendarGrid
        days={days}
        currentDate={currentDate}
        currentSelectedDay={selectedDay}
        jobs={allJobs || []}
        thematicColors={thematicColors}
        onDayClick={goToDay}
      />
    </Card>
  );
};

export default Calendar;