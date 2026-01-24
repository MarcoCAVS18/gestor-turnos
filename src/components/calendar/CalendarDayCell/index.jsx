// src/components/calendar/CalendarDayCell/index.jsx

import React from 'react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';

const CalendarDayCell = (***REMOVED***
  day,
  isToday,
  isSelected,
  workColors,
  onClick
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  return (
    <button
      onClick=***REMOVED***onClick***REMOVED***
      className=***REMOVED***`
        p-2 text-center relative 
        hover:bg-gray-50 
        flex flex-col justify-center items-center
        $***REMOVED***!day.currentMonth ? 'text-gray-400' : 'text-gray-800'***REMOVED***
      `***REMOVED***
      style=***REMOVED******REMOVED***
        backgroundColor: isSelected
          ? colors.transparent10
          : 'transparent'
      ***REMOVED******REMOVED***
    >
      ***REMOVED***/* Circle for current day */***REMOVED***
      ***REMOVED***isToday && (
        <div
          className="absolute inset-0 m-auto rounded-full w-10 h-10 animate-pulse"
          style=***REMOVED******REMOVED***
            border: `2px solid $***REMOVED***colors.primary***REMOVED***`
          ***REMOVED******REMOVED***
        />
      )***REMOVED***

      ***REMOVED***/* Container for day number */***REMOVED***
      <Flex variant="center"
        className="rounded-full w-8 h-8 transition-all duration-200"
        style=***REMOVED******REMOVED***
          backgroundColor: isToday
            ? colors.primary
            : (isSelected && !isToday)
              ? colors.transparent20
              : 'transparent',
          color: isToday
            ? colors.textContrast
            : 'inherit',
          fontWeight: isToday ? 'bold' : 'normal',
          transform: isToday ? 'scale(1.1)' : 'scale(1)',
          boxShadow: isToday
            ? `0 4px 12px $***REMOVED***colors.transparent50***REMOVED***`
            : 'none'
        ***REMOVED******REMOVED***
      >
        <span>***REMOVED***day.number***REMOVED***</span>
      </Flex>

      ***REMOVED***/* Simplified shift indicators */***REMOVED***
      ***REMOVED***day.hasShifts && (
        <div className="absolute bottom-1 flex justify-center gap-0.5 w-full px-1">
          ***REMOVED***/* Show indicators using work colors passed as props */***REMOVED***
          ***REMOVED***workColors && workColors.length > 0 ? (
            <div className="flex gap-0.5">
              ***REMOVED***workColors.length === 1 ? (
                <div
                  className="w-4 h-1 rounded"
                  style=***REMOVED******REMOVED*** backgroundColor: workColors[0] ***REMOVED******REMOVED***
                />
              ) : workColors.length === 2 ? (
                <>
                  <div
                    className="w-2 h-1 rounded"
                    style=***REMOVED******REMOVED*** backgroundColor: workColors[0] ***REMOVED******REMOVED***
                  />
                  <div
                    className="w-2 h-1 rounded"
                    style=***REMOVED******REMOVED*** backgroundColor: workColors[1] ***REMOVED******REMOVED***
                  />
                </>
              ) : (
                // 3 or more jobs
                workColors.slice(0, 3).map((color, index) => (
                  <div
                    key=***REMOVED***index***REMOVED***
                    className="w-1 h-1 rounded-full"
                    style=***REMOVED******REMOVED*** backgroundColor: color ***REMOVED******REMOVED***
                  />
                ))
              )***REMOVED***
            </div>
          ) : (
            // Fallback: show generic indicator if no specific colors available
            <div
              className="w-2 h-1 rounded"
              style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
            />
          )***REMOVED***
        </div>
      )***REMOVED***
    </button>
  );
***REMOVED***;

export default CalendarDayCell;