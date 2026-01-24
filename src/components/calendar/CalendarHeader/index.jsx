// src/components/calendar/CalendarHeader/index.jsx

import React from 'react';
import ***REMOVED*** ChevronLeft, ChevronRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';

const CalendarHeader = (***REMOVED*** 
  currentMonth, 
  currentYear, 
  onChangeMonth, 
  onGoToToday
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  
  const getMonthName = () => ***REMOVED***
    return new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', ***REMOVED*** month: 'long' ***REMOVED***);
  ***REMOVED***;

  return (
    <div
      className="p-4 text-white flex justify-between items-center"
      style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
    >
      <button
        onClick=***REMOVED***() => onChangeMonth(-1)***REMOVED***
        className="text-white p-2 rounded-full transition-colors hover:bg-black hover:bg-opacity-20"
      >
        <ChevronLeft size=***REMOVED***20***REMOVED*** />
      </button>
      
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold capitalize">
          ***REMOVED***getMonthName()***REMOVED*** ***REMOVED***currentYear***REMOVED***
        </h3>
        <button
          onClick=***REMOVED***onGoToToday***REMOVED***
          className="text-xs px-3 py-1 rounded-full mt-1 transition-colors bg-white bg-opacity-20 hover:bg-opacity-30"
        >
          Today
        </button>
      </div>
      
      <button
        onClick=***REMOVED***() => onChangeMonth(1)***REMOVED***
        className="text-white p-2 rounded-full transition-colors hover:bg-black hover:bg-opacity-20"
      >
        <ChevronRight size=***REMOVED***20***REMOVED*** />
      </button>
    </div>
  );
***REMOVED***;

export default CalendarHeader;