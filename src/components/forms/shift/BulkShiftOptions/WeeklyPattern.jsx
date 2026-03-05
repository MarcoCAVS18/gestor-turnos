// src/components/forms/shift/BulkShiftOptions/WeeklyPattern.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { FormLabel } from '../../base/BaseForm';

const WeeklyPattern = ({ selectedDays, weeks, onSelectedDaysChange, onWeeksChange }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  const daysOfWeek = [
    { value: 1, label: t('forms.shift.bulk.dayLabels.Mon'), fullName: t('stats.daysFull.Monday') },
    { value: 2, label: t('forms.shift.bulk.dayLabels.Tue'), fullName: t('stats.daysFull.Tuesday') },
    { value: 3, label: t('forms.shift.bulk.dayLabels.Wed'), fullName: t('stats.daysFull.Wednesday') },
    { value: 4, label: t('forms.shift.bulk.dayLabels.Thu'), fullName: t('stats.daysFull.Thursday') },
    { value: 5, label: t('forms.shift.bulk.dayLabels.Fri'), fullName: t('stats.daysFull.Friday') },
    { value: 6, label: t('forms.shift.bulk.dayLabels.Sat'), fullName: t('stats.daysFull.Saturday') },
    { value: 0, label: t('forms.shift.bulk.dayLabels.Sun'), fullName: t('stats.daysFull.Sunday') }
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
        <FormLabel>{t('forms.shift.bulk.selectDays')}</FormLabel>
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
            {t('forms.shift.bulk.selectAtLeastOne')}
          </p>
        )}
      </div>

      {/* Weeks Selection */}
      <div>
        <FormLabel htmlFor="weeks-input">{t('forms.shift.bulk.repeatFor')}</FormLabel>
        <div className="flex items-center gap-2 mt-2">
          <input
            id="weeks-input"
            type="number"
            min="1"
            value={weeks}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val >= 1) onWeeksChange(val);
              else if (e.target.value === '') onWeeksChange('');
            }}
            onBlur={(e) => {
              const val = parseInt(e.target.value);
              if (isNaN(val) || val < 1) onWeeksChange(1);
            }}
            className="px-3 py-2 rounded-lg border w-20 text-center font-medium"
            style={{
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border
            }}
          />
          <span style={{ color: colors.text }}>
            {weeks > 1 ? t('forms.shift.bulk.weeks') : t('forms.shift.bulk.week')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPattern;
