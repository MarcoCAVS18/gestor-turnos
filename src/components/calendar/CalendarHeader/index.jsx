// src/components/calendar/CalendarHeader/index.jsx

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';

const CalendarHeader = ({ 
  currentMonth, 
  currentYear, 
  onChangeMonth, 
  onGoToToday
}) => {
  const colors = useThemeColors();
  
  const getMonthName = () => {
    return new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', { month: 'long' });
  };

  return (
    <div
      className="p-4 text-white flex justify-between items-center"
      style={{ backgroundColor: colors.primary }}
    >
      <button
        onClick={() => onChangeMonth(-1)}
        className="text-white p-2 rounded-full transition-colors hover:bg-black hover:bg-opacity-20"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold capitalize">
          {getMonthName()} {currentYear}
        </h3>
        <button
          onClick={onGoToToday}
          className="text-xs px-3 py-1 rounded-full mt-1 transition-colors bg-white bg-opacity-20 hover:bg-opacity-30"
        >
          Today
        </button>
      </div>
      
      <button
        onClick={() => onChangeMonth(1)}
        className="text-white p-2 rounded-full transition-colors hover:bg-black hover:bg-opacity-20"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default CalendarHeader;