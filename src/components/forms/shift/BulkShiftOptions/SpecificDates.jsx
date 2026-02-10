// src/components/forms/shift/BulkShiftOptions/SpecificDates.jsx

import React, { useState } from 'react';
import { Calendar, X, Plus } from 'lucide-react';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { FormLabel } from '../../base/BaseForm';
import Button from '../../../ui/Button';

const SpecificDates = ({ selectedDates, onSelectedDatesChange, minDate }) => {
  const colors = useThemeColors();
  const [dateInput, setDateInput] = useState('');

  const handleAddDate = () => {
    if (!dateInput) return;

    // Avoid duplicates
    if (selectedDates.includes(dateInput)) {
      setDateInput('');
      return;
    }

    onSelectedDatesChange([...selectedDates, dateInput].sort());
    setDateInput('');
  };

  const handleRemoveDate = (dateToRemove) => {
    onSelectedDatesChange(selectedDates.filter(d => d !== dateToRemove));
  };

  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Date Picker */}
      <div>
        <FormLabel htmlFor="date-picker">Select dates</FormLabel>
        <div className="flex gap-2 mt-2">
          <input
            id="date-picker"
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            min={minDate}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddDate();
              }
            }}
            className="flex-1 px-3 py-2 rounded-lg border text-sm"
            style={{
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border
            }}
          />
          <Button
            onClick={handleAddDate}
            disabled={!dateInput}
            variant="secondary"
            icon={Plus}
            size="sm"
            themeColor={colors.primary}
          >
            Add
          </Button>
        </div>
        <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
          Press Enter or click Add to include each date
        </p>
      </div>

      {/* Selected Dates List */}
      {selectedDates.length > 0 ? (
        <div>
          <FormLabel>Selected dates ({selectedDates.length})</FormLabel>
          <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
            {selectedDates.map((date, index) => (
              <div
                key={date}
                className="flex items-center justify-between p-2 rounded-lg"
                style={{
                  backgroundColor: colors.surface2,
                  border: `1px solid ${colors.border}`
                }}
              >
                <div className="flex items-center gap-2">
                  <Calendar size={14} style={{ color: colors.primary }} />
                  <span className="text-sm" style={{ color: colors.text }}>
                    {formatDisplayDate(date)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDate(date)}
                  className="p-1 rounded hover:opacity-70 transition-opacity"
                  style={{ color: colors.error }}
                  title="Remove date"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="p-4 rounded-lg text-center"
          style={{
            backgroundColor: colors.surface2,
            border: `1px dashed ${colors.border}`
          }}
        >
          <Calendar size={24} style={{ color: colors.textSecondary }} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            No dates selected yet
          </p>
          <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
            Add dates above to create shifts
          </p>
        </div>
      )}
    </div>
  );
};

export default SpecificDates;
