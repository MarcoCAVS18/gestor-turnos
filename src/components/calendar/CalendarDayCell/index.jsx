// src/components/calendar/CalendarDayCell/index.jsx

import React from 'react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';

const CalendarDayCell = ({
  day,
  isToday,
  isSelected,
  workColors,
  onClick
}) => {
  const colors = useThemeColors();

  return (
    <button
      onClick={onClick}
      className={`
        p-2 text-center relative 
        hover:bg-gray-50 
        flex flex-col justify-center items-center
        ${!day.currentMonth ? 'text-gray-400' : 'text-gray-800'}
      `}
      style={{
        backgroundColor: isSelected
          ? colors.transparent10
          : 'transparent'
      }}
    >
      {/* Circle for current day */}
      {isToday && (
        <div
          className="absolute inset-0 m-auto rounded-full w-10 h-10 animate-pulse"
          style={{
            border: `2px solid ${colors.primary}`
          }}
        />
      )}

      {/* Container for day number */}
      <Flex variant="center"
        className="rounded-full w-8 h-8 transition-all duration-200"
        style={{
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
            ? `0 4px 12px ${colors.transparent50}`
            : 'none'
        }}
      >
        <span>{day.number}</span>
      </Flex>

      {/* Simplified shift indicators */}
      {day.hasShifts && (
        <div className="absolute bottom-1 flex justify-center gap-0.5 w-full px-1">
          {/* Show indicators using work colors passed as props */}
          {workColors && workColors.length > 0 ? (
            <div className="flex gap-0.5">
              {workColors.length === 1 ? (
                <div
                  className="w-4 h-1 rounded"
                  style={{ backgroundColor: workColors[0] }}
                />
              ) : workColors.length === 2 ? (
                <>
                  <div
                    className="w-2 h-1 rounded"
                    style={{ backgroundColor: workColors[0] }}
                  />
                  <div
                    className="w-2 h-1 rounded"
                    style={{ backgroundColor: workColors[1] }}
                  />
                </>
              ) : (
                // 3 or more jobs
                workColors.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))
              )}
            </div>
          ) : (
            // Fallback: show generic indicator if no specific colors available
            <div
              className="w-2 h-1 rounded"
              style={{ backgroundColor: colors.primary }}
            />
          )}
        </div>
      )}
    </button>
  );
};

export default CalendarDayCell;