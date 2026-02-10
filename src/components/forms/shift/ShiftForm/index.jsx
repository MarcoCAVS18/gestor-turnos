// src/components/forms/shift/ShiftForm/index.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, Calendar, Clock, FileText, Coffee, Pencil, Check } from 'lucide-react';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { useApp } from '../../../../contexts/AppContext';
import { createSafeDate, calculateShiftHours } from '../../../../utils/time';
import BaseForm, { FormSection, FormGrid, FormField, FormLabel, FormError, getInputClasses } from '../../base/BaseForm';
import Flex from '../../../ui/Flex';
import BulkShiftOptions from '../BulkShiftOptions';

const ShiftForm = ({
  id,
  shift,
  workId,
  works = [],
  onSubmit,
  onWorkChange,
  onDirtyChange,
  onBulkToggle,
  isBulkEnabled = false,
  isMobile = false,
  initialDate
}) => {
  const colors = useThemeColors();
  const { smokoEnabled, smokoMinutes } = useApp(); // NEW

  const [initialFormData, setInitialFormData] = useState(null);
  const [formData, setFormData] = useState({
    workId: workId || '',
    startDate: '',
    startTime: '',
    endTime: '',
    crossesMidnight: false,
    endDate: '',
    hadBreak: true, // NEW - by default assumes break was taken
    breakMinutes: smokoMinutes, // NEW - editable
    notes: ''
  });

  const [isEditingBreak, setIsEditingBreak] = useState(false);
  const [errors, setErrors] = useState({});

  // Effect to detect if the form is "dirty" (modified)
  useEffect(() => {
    if (!initialFormData || !onDirtyChange) return;

    // Only considered dirty if it is an existing shift
    if (shift) {
      const isDirty =
        formData.workId !== initialFormData.workId ||
        formData.startDate !== initialFormData.startDate ||
        formData.startTime !== initialFormData.startTime ||
        formData.endTime !== initialFormData.endTime ||
        formData.hadBreak !== initialFormData.hadBreak ||
        Number(formData.breakMinutes) !== Number(initialFormData.breakMinutes) ||
        formData.notes !== initialFormData.notes;
      onDirtyChange(isDirty);
    } else {
      onDirtyChange(true); // For new shifts, the button is always active
    }
  }, [formData, initialFormData, onDirtyChange, shift]);


  // Function to calculate shift duration - USING CENTRALIZED UTILITY
  const calculateShiftDuration = useCallback(() => {
    if (!formData.startTime || !formData.endTime) return null;

    const totalHours = calculateShiftHours(formData.startTime, formData.endTime);
    const totalMinutes = Math.round(totalHours * 60);

    // Apply smoko discount if enabled
    let actualMinutes = totalMinutes;
    const breakDuration = formData.breakMinutes || 0;

    if (smokoEnabled && formData.hadBreak && totalMinutes > breakDuration) {
      actualMinutes = totalMinutes - breakDuration;
    }

    return {
      totalMinutes,
      actualMinutes,
      hours: Math.floor(actualMinutes / 60),
      minutes: actualMinutes % 60,
      smokoApplied: smokoEnabled && formData.hadBreak && totalMinutes > breakDuration,
      minutesDiscounted: breakDuration
    };
  }, [formData.startTime, formData.endTime, formData.hadBreak, smokoEnabled, formData.breakMinutes]);

  const duration = calculateShiftDuration();

  // Detect night shifts automatically
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const [startHour] = formData.startTime.split(':').map(Number);
      const [endHour] = formData.endTime.split(':').map(Number);
      
      const isNightShift = startHour > endHour;
      
      if (isNightShift !== formData.crossesMidnight) {
        setFormData(prev => ({
          ...prev,
          crossesMidnight: isNightShift,
          endDate: isNightShift && prev.startDate 
            ? calculateEndDate(prev.startDate)
            : ''
        }));
      }
    }
  }, [formData.startTime, formData.endTime, formData.startDate, formData.crossesMidnight]);

  const calculateEndDate = (startDate) => {
    const date = createSafeDate(startDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.workId) {
      newErrors.workId = 'Select a job';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Date is required';
    }
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // When enabling hadBreak and breakMinutes is 0, use the configured default
      if (field === 'hadBreak' && value === true && prev.breakMinutes === 0) {
        newData.breakMinutes = smokoMinutes;
      }

      return newData;
    });

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Notify parent component of work change
    if (field === 'workId') {
      onWorkChange?.(value);
    }
  }, [errors, onWorkChange, smokoMinutes]);

  // Initialize form - UPDATED
  useEffect(() => {
    let initialData;
    if (shift) {
      initialData = {
        workId: shift.workId || '',
        startDate: shift.startDate || shift.date || '',
        startTime: shift.startTime || '',
        endTime: shift.endTime || '',
        crossesMidnight: shift.crossesMidnight || false,
        endDate: shift.endDate || '',
        hadBreak: shift.hadBreak !== undefined ? shift.hadBreak : true,
        breakMinutes: shift.breakMinutes !== undefined ? shift.breakMinutes : smokoMinutes,
        notes: shift.notes || ''
      };
    } else {
      const dateStr = initialDate 
        ? (initialDate instanceof Date ? initialDate.toISOString().split('T')[0] : initialDate)
        : new Date().toISOString().split('T')[0];

      initialData = {
        workId: workId || '',
        startDate: dateStr,
        startTime: '',
        endTime: '',
        crossesMidnight: false,
        endDate: '',
        hadBreak: true,
        breakMinutes: smokoMinutes,
        notes: ''
      };
    }
    setFormData(initialData);
    setInitialFormData(initialData);
  }, [shift, workId, initialDate, smokoMinutes]);

  const traditionalWorks = works.filter(w => w.type !== 'delivery');
  const deliveryWork = works.filter(w => w.type === 'delivery');

  return (
    <BaseForm
      id={id}
      onSubmit={handleSubmit}
      isMobile={isMobile}
    >
      {/* Work selection */}
      <FormSection>
        <FormLabel icon={Briefcase}>Work</FormLabel>
        <select
          value={formData.workId}
          onChange={(e) => handleInputChange('workId', e.target.value)}
          className={getInputClasses(isMobile, errors.workId)}
          style={{ '--tw-ring-color': colors.primary }}
          required
        >
          <option value="">Select work</option>

          {traditionalWorks.length > 0 && (
            <optgroup label="Traditional Works">
              {traditionalWorks.map(work => (
                <option key={work.id} value={work.id}>
                  {work.name}
                </option>
              ))}
            </optgroup>
          )}

          {deliveryWork.length > 0 && (
            <optgroup label="Delivery Works">
              {deliveryWork.map(work => (
                <option key={work.id} value={work.id}>
                  {work.name}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <FormError error={errors.workId} />
      </FormSection>

      {/* RESPONSIVE DATE CONTAINER */}
      <FormGrid columns={2}>
        {/* Start date */}
        <FormField className={!formData.crossesMidnight ? 'col-span-2' : ''}>
          <FormLabel icon={Calendar}>Start date</FormLabel>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className={getInputClasses(isMobile, errors.startDate)}
            style={{ '--tw-ring-color': colors.primary }}
            required
          />
          <FormError error={errors.startDate} />
        </FormField>

        {/* End date - only show if it's a night shift */}
        {formData.crossesMidnight && (
          <FormField>
            <FormLabel icon={Calendar}>End date</FormLabel>
            <input
              type="date"
              value={formData.endDate || calculateEndDate(formData.startDate)}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className={getInputClasses(isMobile)}
              style={{ '--tw-ring-color': colors.primary }}
              disabled
            />
          </FormField>
        )}
      </FormGrid>

      {/* RESPONSIVE TIME CONTAINER */}
      <FormGrid columns={2}>
        {/* Start time */}
        <FormField>
          <FormLabel icon={Clock}>Start time</FormLabel>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
            className={getInputClasses(isMobile, errors.startTime)}
            style={{ '--tw-ring-color': colors.primary }}
            required
          />
          <FormError error={errors.startTime} />
        </FormField>

        {/* End time */}
        <FormField>
          <FormLabel icon={Clock}>End time</FormLabel>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
            className={getInputClasses(isMobile, errors.endTime)}
            style={{ '--tw-ring-color': colors.primary }}
            required
          />
          <FormError error={errors.endTime} />
        </FormField>
      </FormGrid>

{/* BREAK (SMOKO) SECTION - SIMPLIFIED */}
{smokoEnabled && duration && duration.totalMinutes > 0 && (
  <div className="w-full">
    <div
      className="rounded-lg border p-3"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border
      }}
    >
      {/* Header with toggle */}
      <Flex variant="between" className="mb-3">
        <div className="flex items-center gap-2">
          <Coffee
            size={16}
            style={{ color: colors.primary }}
          />
          <span className="text-sm font-medium" style={{ color: colors.text }}>
            Break
          </span>
        </div>

        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.hadBreak}
            onChange={(e) => handleInputChange('hadBreak', e.target.checked)}
            className="sr-only peer"
          />
          <div
            className="relative w-10 h-5 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all"
            style={{
              '--tw-ring-color': colors.primary,
              backgroundColor: formData.hadBreak ? colors.primary : colors.border,
              borderColor: colors.border
            }}
          />
        </label>
      </Flex>

      {/* Break configuration - Only show if enabled */}
      {formData.hadBreak && (
        <div className="space-y-2">
          {/* Break minutes editor */}
          <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: colors.surface2 }}>
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              Break duration:
            </span>
            {isEditingBreak ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.breakMinutes}
                  onChange={(e) => handleInputChange('breakMinutes', e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                  className="py-1 px-2 w-16 text-center text-xs font-semibold rounded border"
                  style={{
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border
                  }}
                  autoFocus
                  onBlur={() => setIsEditingBreak(false)}
                />
                <button
                  type="button"
                  onClick={() => setIsEditingBreak(false)}
                  style={{ color: colors.primary }}
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold" style={{ color: colors.text }}>
                  {formData.breakMinutes} min
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingBreak(true)}
                  style={{ color: colors.textSecondary }}
                  className="hover:opacity-70"
                >
                  <Pencil size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Paid time result */}
          <div className="flex items-center justify-between p-2 rounded border" style={{
            backgroundColor: colors.surface2,
            borderColor: colors.primary + '20'
          }}>
            <span className="text-xs font-medium" style={{ color: colors.primary }}>
              Paid time:
            </span>
            <span className="text-xs font-bold" style={{ color: colors.primary }}>
              {duration.hours}h {duration.minutes}min
            </span>
          </div>
        </div>
      )}
    </div>
  </div>
)}

      {/* Notes field */}
      <FormSection>
        <FormLabel icon={FileText}>Notes (optional)</FormLabel>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Add notes about this shift..."
          className={`${getInputClasses(isMobile)} border-gray-300 resize-none`}
          style={{ '--tw-ring-color': colors.primary }}
          rows={3}
        />
      </FormSection>

      {/* Bulk Shift Options - Only show for new shifts (not editing) */}
      {!shift && onBulkToggle && (
        <BulkShiftOptions
          isEnabled={isBulkEnabled}
          onToggle={onBulkToggle}
        />
      )}
    </BaseForm>
  );
};

export default ShiftForm;