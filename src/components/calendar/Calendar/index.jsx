// src/components/calendar/Calendar/index.jsx

import React from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useCalendarState ***REMOVED*** from '../../../hooks/useCalendarState';
import Card from '../../ui/Card';
import CalendarHeader from '../CalendarHeader';
import CalendarGrid from '../CalendarGrid';

const Calendar = (***REMOVED*** onDaySelected ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** shiftsByDate, allJobs, thematicColors ***REMOVED*** = useApp();
  
  // Get all combined shifts from context
  const allShifts = React.useMemo(() => ***REMOVED***
    if (!shiftsByDate) return [];
    
    const shifts = [];
    Object.entries(shiftsByDate).forEach(([date, dayShifts]) => ***REMOVED***
      if (Array.isArray(dayShifts)) ***REMOVED***
        shifts.push(...dayShifts);
      ***REMOVED***
    ***REMOVED***);
    
    return shifts;
  ***REMOVED***, [shiftsByDate]);
  
  const ***REMOVED***
    currentDate,
    currentMonth,
    currentYear,
    currentSelectedDay,
    getDaysOfMonth,
    changeMonth,
    goToToday,
    goToDay
  ***REMOVED*** = useCalendarState(allShifts, onDaySelected);

  const days = getDaysOfMonth();

  return (
    <Card className="overflow-hidden">
      <CalendarHeader
        currentMonth=***REMOVED***currentMonth***REMOVED***
        currentYear=***REMOVED***currentYear***REMOVED***
        onChangeMonth=***REMOVED***changeMonth***REMOVED***
        onGoToToday=***REMOVED***goToToday***REMOVED***
        thematicColors=***REMOVED***thematicColors***REMOVED***
      />

      <CalendarGrid
        days=***REMOVED***days***REMOVED***
        currentDate=***REMOVED***currentDate***REMOVED***
        currentSelectedDay=***REMOVED***currentSelectedDay***REMOVED***
        jobs=***REMOVED***allJobs || []***REMOVED***
        thematicColors=***REMOVED***thematicColors***REMOVED***
        onDayClick=***REMOVED***goToDay***REMOVED***
      />
    </Card>
  );
***REMOVED***;

export default Calendar;