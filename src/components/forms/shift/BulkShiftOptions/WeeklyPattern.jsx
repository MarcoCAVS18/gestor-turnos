// src/components/forms/shift/BulkShiftOptions/WeeklyPattern.jsx

import React from 'react';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { FormLabel } from '../../base/BaseForm';

const WeeklyPattern = ({ selectedDays, weeks, onSelectedDaysChange, onWeeksChange }) => {
  const colors = useThemeColors();

  const daysOfWeek = [
    { value: 1, label: 'Mon', fullName: 'Monday' },
    { value: 2, label: 'Tue', fullName: 'Tuesday' },
    { value: 3, label: 'Wed', fullName: 'Wednesday' },
    { value: 4, label: 'Thu', fullName: 'Thursday' },
    { value: 5, label: 'Fri', fullName: 'Friday' },
    { value: 6, label: 'Sat', fullName: 'Saturday' },
    { value: 0, label: 'Sun', fullName: 'Sunday' }
  ];

  const toggleDay = (dayValue) => {
    if (selectedDays.includes(dayValue)) {
      onSelectedDaysChange(selectedDays.filter(d => d !== dayValue));
    } else {
      onSelectedDaysChange([...selectedDays, dayValue].sort());
    }
  };

  const getDayButtonStyle = (isSelected) => {
    if (isSelected) {
      return {
        backgroundColor: colors.primary,
        color: '#FFFFFF',
        borderColor: colors.primary
      };
    }
    return {
      backgroundColor: colors.surface,
      color: colors.text,
      borderColor: colors.border
    };
  };

  return (
    <div className="space-y-4">
      {/* Day Selection */}
      <div>
        <FormLabel>Select days of the week</FormLabel>
        <div className="flex flex-wrap gap-2 mt-2">
          {daysOfWeek.map(day => {
            const isSelected = selectedDays.includes(day.value);
            return (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className="px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 hover:opacity-80 min-w-[60px]"
                style={getDayButtonStyle(isSelected)}
                title={day.fullName}
              >
                {day.label}
              </button>
            );
          })}
        </div>
        {selectedDays.length === 0 && (
          <p className="text-sm mt-2" style={{ color: colors.error }}>
            Select at least one day
          </p>
        )}
      </div>

      {/* Weeks Selection */}
      <div>
        <FormLabel htmlFor="weeks-input">Repeat for</FormLabel>
        <div className="flex items-center gap-2 mt-2">
          <input
            id="weeks-input"
            type="number"
            min="1"
            max="52"
            value={weeks}
            onChange={(e) => onWeeksChange(parseInt(e.target.value) || 1)}
            className="px-3 py-2 rounded-lg border w-20 text-center font-medium"
            style={{
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border
            }}
          />
          <span style={{ color: colors.text }}>
            week{weeks > 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
          Maximum 52 weeks
        </p>
      </div>
    </div>
  );
};

export default WeeklyPattern;
