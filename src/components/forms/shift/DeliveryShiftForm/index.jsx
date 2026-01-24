// src/components/forms/shift/DeliveryShiftForm/index.jsx

import React, ***REMOVED*** useState, useEffect, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** Truck, Calendar, Clock, DollarSign, Package, Navigation, Fuel, Heart ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';
import BaseForm, ***REMOVED*** FormSection, FormGrid, FormField, FormLabel, FormError, getInputClasses ***REMOVED*** from '../../base/BaseForm';

const DeliveryShiftForm = (***REMOVED***
  id,
  shift,
  workId,
  works = [],
  onSubmit,
  onWorkChange,
  onDirtyChange,
  isMobile = false,
  initialDate
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  const [initialFormData, setInitialFormData] = useState(null);
  const [formData, setFormData] = useState(***REMOVED***
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
  ***REMOVED***);

  const [errors, setErrors] = useState(***REMOVED******REMOVED***);

  useEffect(() => ***REMOVED***
    if (!initialFormData || !onDirtyChange) return;

    if (shift) ***REMOVED***
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
    ***REMOVED*** else ***REMOVED***
      onDirtyChange(true);
    ***REMOVED***
  ***REMOVED***, [formData, initialFormData, onDirtyChange, shift]);

  const vehicleNeedsFuel = useCallback((vehicle) => ***REMOVED***
    if (!vehicle) return false;
    const vehicleLower = vehicle.toLowerCase();
    return vehicleLower.includes('motorcycle') || 
           vehicleLower.includes('car') || 
           vehicleLower.includes('auto');
  ***REMOVED***, []);

  const selectedWork = works.find(t => t.id === formData.workId);
  const showFuel = selectedWork ? vehicleNeedsFuel(selectedWork.vehicle) : true;

  useEffect(() => ***REMOVED***
    let initialData;
    if (shift) ***REMOVED***
      initialData = ***REMOVED***
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
      ***REMOVED***;
    ***REMOVED*** else ***REMOVED***
      const dateStr = initialDate instanceof Date 
        ? initialDate.toISOString().split('T')[0] 
        : initialDate;
      initialData = ***REMOVED***
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
      ***REMOVED***;
    ***REMOVED***
    setFormData(initialData);
    setInitialFormData(initialData);
  ***REMOVED***, [shift, workId, initialDate]);

  useEffect(() => ***REMOVED***
    if (!showFuel && formData.fuelExpense) ***REMOVED***
      setFormData(prev => (***REMOVED*** ...prev, fuelExpense: '' ***REMOVED***));
    ***REMOVED***
  ***REMOVED***, [showFuel, formData.fuelExpense]);

  const validateForm = () => ***REMOVED***
    const newErrors = ***REMOVED******REMOVED***;

    if (!formData.workId) ***REMOVED***
      newErrors.workId = 'Select a work';
    ***REMOVED***
    if (!formData.startDate) ***REMOVED***
      newErrors.startDate = 'Date is required';
    ***REMOVED***
    if (!formData.startTime) ***REMOVED***
      newErrors.startTime = 'Start time is required';
    ***REMOVED***
    if (!formData.endTime) ***REMOVED***
      newErrors.endTime = 'End time is required';
    ***REMOVED***
    if (!formData.baseEarnings || parseFloat(formData.baseEarnings) <= 0) ***REMOVED***
      newErrors.baseEarnings = 'Earnings (without tips) are required and must be greater than 0';
    ***REMOVED***

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  ***REMOVED***;

  const handleSubmit = (e) => ***REMOVED***
    e.preventDefault();
    if (validateForm()) ***REMOVED***
      const dataToSubmit = ***REMOVED***
        ...formData,
        baseEarnings: parseFloat(formData.baseEarnings) || 0,
        tips: parseFloat(formData.tips) || 0,
        orderCount: parseInt(formData.orderCount) || 0,
        kilometers: parseFloat(formData.kilometers) || 0,
        fuelExpense: showFuel ? (parseFloat(formData.fuelExpense) || 0) : 0
      ***REMOVED***;
      onSubmit(dataToSubmit);
    ***REMOVED***
  ***REMOVED***;

  const handleInputChange = useCallback((field, value) => ***REMOVED***
    setFormData(prev => (***REMOVED*** ...prev, [field]: value ***REMOVED***));
    if (errors[field]) ***REMOVED***
      setErrors(prev => (***REMOVED*** ...prev, [field]: undefined ***REMOVED***));
    ***REMOVED***

    if (field === 'workId') ***REMOVED***
      onWorkChange?.(value);
    ***REMOVED***
  ***REMOVED***, [errors, onWorkChange]);

  const traditionalWorks = works.filter(t => t.type !== 'delivery');
  const deliveryWorks = works.filter(t => t.type === 'delivery');

  return (
    <BaseForm
      id=***REMOVED***id***REMOVED***
      onSubmit=***REMOVED***handleSubmit***REMOVED***
      isMobile=***REMOVED***isMobile***REMOVED***
    >
      <FormSection>
        <FormLabel icon=***REMOVED***Truck***REMOVED***>Work</FormLabel>
        <select
          value=***REMOVED***formData.workId***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('workId', e.target.value)***REMOVED***
          className=***REMOVED***getInputClasses(isMobile, errors.workId)***REMOVED***
          style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
          required
        >
          <option value="">Select work</option>

          ***REMOVED***deliveryWorks.length > 0 && (
            <optgroup label="Delivery Works">
              ***REMOVED***deliveryWorks.map(work => (
                <option key=***REMOVED***work.id***REMOVED*** value=***REMOVED***work.id***REMOVED***>
                  ***REMOVED***work.name***REMOVED*** ***REMOVED***work.vehicle ? `($***REMOVED***work.vehicle***REMOVED***)` : ''***REMOVED***
                </option>
              ))***REMOVED***
            </optgroup>
          )***REMOVED***

          ***REMOVED***traditionalWorks.length > 0 && (
            <optgroup label="Traditional Works">
              ***REMOVED***traditionalWorks.map(work => (
                <option key=***REMOVED***work.id***REMOVED*** value=***REMOVED***work.id***REMOVED***>
                  ***REMOVED***work.name***REMOVED***
                </option>
              ))***REMOVED***
            </optgroup>
          )***REMOVED***
        </select>
        <FormError error=***REMOVED***errors.workId***REMOVED*** />
      </FormSection>

      <FormSection>
        <FormLabel icon=***REMOVED***Calendar***REMOVED***>Shift date</FormLabel>
        <input
          type="date"
          value=***REMOVED***formData.startDate***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('startDate', e.target.value)***REMOVED***
          className=***REMOVED***getInputClasses(isMobile, errors.startDate)***REMOVED***
          style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
          required
        />
        <FormError error=***REMOVED***errors.startDate***REMOVED*** />
      </FormSection>

      <FormGrid columns=***REMOVED***2***REMOVED***>
        <FormField>
          <FormLabel icon=***REMOVED***Clock***REMOVED***>Start time</FormLabel>
          <input
            type="time"
            value=***REMOVED***formData.startTime***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('startTime', e.target.value)***REMOVED***
            className=***REMOVED***getInputClasses(isMobile, errors.startTime)***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            required
          />
          <FormError error=***REMOVED***errors.startTime***REMOVED*** />
        </FormField>

        <FormField>
          <FormLabel icon=***REMOVED***Clock***REMOVED***>End time</FormLabel>
          <input
            type="time"
            value=***REMOVED***formData.endTime***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('endTime', e.target.value)***REMOVED***
            className=***REMOVED***getInputClasses(isMobile, errors.endTime)***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            required
          />
          <FormError error=***REMOVED***errors.endTime***REMOVED*** />
        </FormField>
      </FormGrid>

      <FormGrid columns=***REMOVED***2***REMOVED***>
        <FormField>
          <FormLabel icon=***REMOVED***DollarSign***REMOVED***>Earnings (without tips)</FormLabel>
          <input
            type="number"
            step="0.01"
            value=***REMOVED***formData.baseEarnings***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('baseEarnings', e.target.value)***REMOVED***
            className=***REMOVED***getInputClasses(isMobile, errors.baseEarnings)***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            placeholder="0.00"
            required
          />
          <FormError error=***REMOVED***errors.baseEarnings***REMOVED*** />
        </FormField>

        <FormField>
          <FormLabel icon=***REMOVED***Heart***REMOVED***>Tips</FormLabel>
          <input
            type="number"
            step="0.01"
            value=***REMOVED***formData.tips***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('tips', e.target.value)***REMOVED***
            className=***REMOVED***getInputClasses(isMobile)***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            placeholder="0.00"
          />
        </FormField>
      </FormGrid>

      <FormGrid columns=***REMOVED***2***REMOVED***>
        <FormField>
          <FormLabel icon=***REMOVED***Package***REMOVED***>Order count</FormLabel>
          <input
            type="number"
            value=***REMOVED***formData.orderCount***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('orderCount', e.target.value)***REMOVED***
            className=***REMOVED***getInputClasses(isMobile)***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            placeholder="0"
            min="0"
          />
        </FormField>

        <FormField>
          <FormLabel icon=***REMOVED***Navigation***REMOVED***>Kilometers driven</FormLabel>
          <input
            type="number"
            step="0.1"
            value=***REMOVED***formData.kilometers***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('kilometers', e.target.value)***REMOVED***
            className=***REMOVED***getInputClasses(isMobile)***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            placeholder="0.0"
            min="0"
          />
        </FormField>
      </FormGrid>

      ***REMOVED***showFuel && (
        <FormSection>
          <FormLabel icon=***REMOVED***Fuel***REMOVED***>Fuel expenses</FormLabel>
          <input
            type="number"
            step="0.01"
            value=***REMOVED***formData.fuelExpense***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('fuelExpense', e.target.value)***REMOVED***
            className=***REMOVED***getInputClasses(isMobile)***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            placeholder="0.00"
            min="0"
          />
        </FormSection>
      )***REMOVED***

      <FormSection>
        <FormLabel>Notes (optional)</FormLabel>
        <textarea
          value=***REMOVED***formData.notes***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('notes', e.target.value)***REMOVED***
          className=***REMOVED***`$***REMOVED***getInputClasses(isMobile)***REMOVED*** resize-none border-gray-300`***REMOVED***
          style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
          rows=***REMOVED***isMobile ? "3" : "2"***REMOVED***
          placeholder="Additional notes about the shift..."
        />
      </FormSection>
    </BaseForm>
  );
***REMOVED***;

export default DeliveryShiftForm;