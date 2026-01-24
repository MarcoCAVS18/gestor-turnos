// src/components/filters/WeekDayFilter/index.jsx

import React from 'react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';

const WeekDayFilter = ({ value, onChange }) => {
  const colors = useThemeColors();
  
  const weekDays = [
    { id: 'monday', label: 'M', name: 'Monday' },
    { id: 'tuesday', label: 'T', name: 'Tuesday' },
    { id: 'wednesday', label: 'W', name: 'Wednesday' },
    { id: 'thursday', label: 'T', name: 'Thursday' },
    { id: 'friday', label: 'F', name: 'Friday' },
    { id: 'saturday', label: 'S', name: 'Saturday' },
    { id: 'sunday', label: 'S', name: 'Sunday' }
  ];

  const handleDayToggle = (dayId) => {
    const newValue = value.includes(dayId)
      ? value.filter(d => d !== dayId)
      : [...value, dayId];
    onChange(newValue);
  };

  const selectAll = () => {
    onChange(weekDays.map(d => d.id));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div>
      <Flex variant="between" className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Days of the week
        </label>
        <div className="flex space-x-1">
          {value.length < weekDays.length && (
            <button
              onClick={selectAll}
              className="text-xs px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
              style={{ color: colors.primary }}
            >
              All
            </button>
          )}
          {value.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              None
            </button>
          )}
        </div>
      </Flex>
      
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => {
          const isSelected = value.includes(day.id);
          return (
            <button
              key={day.id}
              onClick={() => handleDayToggle(day.id)}
              className="w-8 h-8 rounded-lg text-xs font-medium transition-all hover:scale-105 flex items-center justify-center"
              style={{
                backgroundColor: isSelected 
                  ? colors.primary 
                  : 'transparent',
                color: isSelected 
                  ? 'white' 
                  : colors.primary,
                border: `1px solid ${isSelected 
                  ? colors.primary 
                  : colors.transparent30}`,
                boxShadow: isSelected 
                  ? `0 2px 4px ${colors.transparent30}` 
                  : 'none'
              }}
              title={day.name}
            >
              {day.label}
            </button>
          );
        })}
      </div>
      
      {/* Show selected days */}
      {value.length > 0 && (
        <div className="mt-2 text-xs text-gray-600">
          Selected: {value.length}/{weekDays.length}
        </div>
      )}
    </div>
  );
};

export default WeekDayFilter;