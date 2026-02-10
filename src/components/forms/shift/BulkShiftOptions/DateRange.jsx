// src/components/forms/shift/BulkShiftOptions/DateRange.jsx

import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { FormLabel } from '../../base/BaseForm';
import Switch from '../../../ui/Switch';

const DateRange = ({
  fromDate,
  toDate,
  skipWeekends,
  onFromDateChange,
  onToDateChange,
  onSkipWeekendsChange,
  minDate
}) => {
  const colors = useThemeColors();

  const isValidRange = fromDate && toDate && new Date(fromDate) <= new Date(toDate);
  const dayCount = isValidRange ? calculateDayCount(fromDate, toDate, skipWeekends) : 0;

  return (
    <div className="space-y-4">
      {/* From Date */}
      <div>
        <FormLabel htmlFor="from-date">Start date</FormLabel>
        <div className="flex items-center gap-2 mt-2">
          <Calendar size={16} style={{ color: colors.primary }} />
          <input
            id="from-date"
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            min={minDate}
            max={toDate || undefined}
            className="flex-1 px-3 py-2 rounded-lg border text-sm"
            style={{
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border
            }}
          />
        </div>
      </div>

      {/* To Date */}
      <div>
        <FormLabel htmlFor="to-date">End date</FormLabel>
        <div className="flex items-center gap-2 mt-2">
          <Calendar size={16} style={{ color: colors.primary }} />
          <input
            id="to-date"
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            min={fromDate || minDate}
            className="flex-1 px-3 py-2 rounded-lg border text-sm"
            style={{
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border
            }}
          />
        </div>
      </div>

      {/* Skip Weekends Option */}
      <div
        className="p-3 rounded-lg"
        style={{
          backgroundColor: colors.surface2,
          border: `1px solid ${colors.border}`
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium" style={{ color: colors.text }}>
                Skip weekends
              </span>
            </div>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              Only create shifts on weekdays (Mon-Fri)
            </p>
          </div>
          <Switch
            id="skip-weekends"
            checked={skipWeekends}
            onChange={onSkipWeekendsChange}
          />
        </div>
      </div>

      {/* Range Summary */}
      {isValidRange ? (
        <div
          className="p-3 rounded-lg flex items-start gap-2"
          style={{
            backgroundColor: colors.surface2,
            border: `1px solid ${colors.primary}40`
          }}
        >
          <AlertCircle size={16} style={{ color: colors.primary }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium" style={{ color: colors.text }}>
              {dayCount} shift{dayCount !== 1 ? 's' : ''} will be created
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              From {formatDate(fromDate)} to {formatDate(toDate)}
              {skipWeekends && ' (weekdays only)'}
            </p>
          </div>
        </div>
      ) : (
        fromDate && toDate && (
          <div
            className="p-3 rounded-lg flex items-start gap-2"
            style={{
              backgroundColor: colors.surface2,
              border: `1px solid ${colors.error}40`
            }}
          >
            <AlertCircle size={16} style={{ color: colors.error }} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm" style={{ color: colors.error }}>
              End date must be after start date
            </p>
          </div>
        )
      )}
    </div>
  );
};

// Helper functions
const calculateDayCount = (fromDate, toDate, skipWeekends) => {
  const start = new Date(fromDate + 'T00:00:00');
  const end = new Date(toDate + 'T00:00:00');
  let count = 0;

  const current = new Date(start);
  while (current <= end) {
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (!skipWeekends || !isWeekend) {
      count++;
    }

    current.setDate(current.getDate() + 1);
  }

  return count;
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default DateRange;
