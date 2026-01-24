// src/components/forms/shift/DeliveryShiftForm/index.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Truck, Calendar, Clock, DollarSign, Package, Navigation, Fuel, Heart } from 'lucide-react';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import BaseForm, { FormSection, FormGrid, FormField, FormLabel, FormError, getInputClasses } from '../../base/BaseForm';

const DeliveryShiftForm = ({
  id,
  shift,
  workId,
  works = [],
  onSubmit,
  onWorkChange,
  onDirtyChange,
  isMobile = false,
  initialDate
}) => {
  const colors = useThemeColors();

  const [initialFormData, setInitialFormData] = useState(null);
  const [formData, setFormData] = useState({
    workId: workId || '',
    startDate: '',
    startTime: '',
    endTime: '',
    baseEarnings: '',
    tips: '',
    orderCount: '',
    kilometers: '',
    fuelExpense: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!initialFormData || !onDirtyChange) return;

    if (shift) {
      const isDirty =
        formData.workId !== initialFormData.workId ||
        formData.startDate !== initialFormData.startDate ||
        formData.startTime !== initialFormData.startTime ||
        formData.endTime !== initialFormData.endTime ||
        String(formData.baseEarnings) !== String(initialFormData.baseEarnings) ||
        String(formData.tips) !== String(initialFormData.tips) ||
        String(formData.orderCount) !== String(initialFormData.orderCount) ||
        String(formData.kilometers) !== String(initialFormData.kilometers) ||
        String(formData.fuelExpense) !== String(initialFormData.fuelExpense) ||
        formData.notes !== initialFormData.notes;
      onDirtyChange(isDirty);
    } else {
      onDirtyChange(true);
    }
  }, [formData, initialFormData, onDirtyChange, shift]);

  const vehicleNeedsFuel = useCallback((vehicle) => {
    if (!vehicle) return false;
    const vehicleLower = vehicle.toLowerCase();
    return vehicleLower.includes('motorcycle') || 
           vehicleLower.includes('car') || 
           vehicleLower.includes('auto');
  }, []);

  const selectedWork = works.find(t => t.id === formData.workId);
  const showFuel = selectedWork ? vehicleNeedsFuel(selectedWork.vehicle) : true;

  useEffect(() => {
    let initialData;
    if (shift) {
      initialData = {
        workId: shift.workId || '',
        startDate: shift.startDate || shift.date || '',
        startTime: shift.startTime || '',
        endTime: shift.endTime || '',
        baseEarnings: (shift.baseEarnings ?? shift.totalEarnings)?.toString() || '',
        tips: shift.tips?.toString() || '',
        orderCount: shift.orderCount?.toString() || '',
        kilometers: shift.kilometers?.toString() || '',
        fuelExpense: shift.fuelExpense?.toString() || '',
        notes: shift.notes || ''
      };
    } else {
      const dateStr = initialDate instanceof Date 
        ? initialDate.toISOString().split('T')[0] 
        : initialDate;
      initialData = {
        workId: workId || '',
        startDate: dateStr,
        startTime: '',
        endTime: '',
        baseEarnings: '',
        tips: '',
        orderCount: '',
        kilometers: '',
        fuelExpense: '',
        notes: ''
      };
    }
    setFormData(initialData);
    setInitialFormData(initialData);
  }, [shift, workId, initialDate]);

  useEffect(() => {
    if (!showFuel && formData.fuelExpense) {
      setFormData(prev => ({ ...prev, fuelExpense: '' }));
    }
  }, [showFuel, formData.fuelExpense]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.workId) {
      newErrors.workId = 'Select a work';
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
    if (!formData.baseEarnings || parseFloat(formData.baseEarnings) <= 0) {
      newErrors.baseEarnings = 'Earnings (without tips) are required and must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        baseEarnings: parseFloat(formData.baseEarnings) || 0,
        tips: parseFloat(formData.tips) || 0,
        orderCount: parseInt(formData.orderCount) || 0,
        kilometers: parseFloat(formData.kilometers) || 0,
        fuelExpense: showFuel ? (parseFloat(formData.fuelExpense) || 0) : 0
      };
      onSubmit(dataToSubmit);
    }
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    if (field === 'workId') {
      onWorkChange?.(value);
    }
  }, [errors, onWorkChange]);

  const traditionalWorks = works.filter(t => t.type !== 'delivery');
  const deliveryWork = works.filter(t => t.type === 'delivery');

  return (
    <BaseForm
      id={id}
      onSubmit={handleSubmit}
      isMobile={isMobile}
    >
      <FormSection>
        <FormLabel icon={Truck}>Work</FormLabel>
        <select
          value={formData.workId}
          onChange={(e) => handleInputChange('workId', e.target.value)}
          className={getInputClasses(isMobile, errors.workId)}
          style={{ '--tw-ring-color': colors.primary }}
          required
        >
          <option value="">Select work</option>

          {deliveryWork.length > 0 && (
            <optgroup label="Delivery Works">
              {deliveryWork.map(work => (
                <option key={work.id} value={work.id}>
                  {work.name} {work.vehicle ? `(${work.vehicle})` : ''}
                </option>
              ))}
            </optgroup>
          )}

          {traditionalWorks.length > 0 && (
            <optgroup label="Traditional Works">
              {traditionalWorks.map(work => (
                <option key={work.id} value={work.id}>
                  {work.name}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <FormError error={errors.workId} />
      </FormSection>

      <FormSection>
        <FormLabel icon={Calendar}>Shift date</FormLabel>
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => handleInputChange('startDate', e.target.value)}
          className={getInputClasses(isMobile, errors.startDate)}
          style={{ '--tw-ring-color': colors.primary }}
          required
        />
        <FormError error={errors.startDate} />
      </FormSection>

      <FormGrid columns={2}>
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

      <FormGrid columns={2}>
        <FormField>
          <FormLabel icon={DollarSign}>Earnings (without tips)</FormLabel>
          <input
            type="number"
            step="0.01"
            value={formData.baseEarnings}
            onChange={(e) => handleInputChange('baseEarnings', e.target.value)}
            className={getInputClasses(isMobile, errors.baseEarnings)}
            style={{ '--tw-ring-color': colors.primary }}
            placeholder="0.00"
            required
          />
          <FormError error={errors.baseEarnings} />
        </FormField>

        <FormField>
          <FormLabel icon={Heart}>Tips</FormLabel>
          <input
            type="number"
            step="0.01"
            value={formData.tips}
            onChange={(e) => handleInputChange('tips', e.target.value)}
            className={getInputClasses(isMobile)}
            style={{ '--tw-ring-color': colors.primary }}
            placeholder="0.00"
          />
        </FormField>
      </FormGrid>

      <FormGrid columns={2}>
        <FormField>
          <FormLabel icon={Package}>Order count</FormLabel>
          <input
            type="number"
            value={formData.orderCount}
            onChange={(e) => handleInputChange('orderCount', e.target.value)}
            className={getInputClasses(isMobile)}
            style={{ '--tw-ring-color': colors.primary }}
            placeholder="0"
            min="0"
          />
        </FormField>

        <FormField>
          <FormLabel icon={Navigation}>Kilometers driven</FormLabel>
          <input
            type="number"
            step="0.1"
            value={formData.kilometers}
            onChange={(e) => handleInputChange('kilometers', e.target.value)}
            className={getInputClasses(isMobile)}
            style={{ '--tw-ring-color': colors.primary }}
            placeholder="0.0"
            min="0"
          />
        </FormField>
      </FormGrid>

      {showFuel && (
        <FormSection>
          <FormLabel icon={Fuel}>Fuel expenses</FormLabel>
          <input
            type="number"
            step="0.01"
            value={formData.fuelExpense}
            onChange={(e) => handleInputChange('fuelExpense', e.target.value)}
            className={getInputClasses(isMobile)}
            style={{ '--tw-ring-color': colors.primary }}
            placeholder="0.00"
            min="0"
          />
        </FormSection>
      )}

      <FormSection>
        <FormLabel>Notes (optional)</FormLabel>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          className={`${getInputClasses(isMobile)} resize-none border-gray-300`}
          style={{ '--tw-ring-color': colors.primary }}
          rows={isMobile ? "3" : "2"}
          placeholder="Additional notes about the shift..."
        />
      </FormSection>
    </BaseForm>
  );
};

export default DeliveryShiftForm;