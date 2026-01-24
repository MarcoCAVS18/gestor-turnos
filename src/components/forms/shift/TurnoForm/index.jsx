// src/components/forms/shift/ShiftForm/index.jsx - REFACTORED WITH BaseForm

import React, ***REMOVED*** useState, useEffect, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** Briefcase, Calendar, Clock, FileText, Coffee, Pencil, Check ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';
import ***REMOVED*** useApp ***REMOVED*** from '../../../../contexts/AppContext';
import ***REMOVED*** createSafeDate, calculateShiftHours ***REMOVED*** from '../../../../utils/time';
import BaseForm, ***REMOVED*** FormSection, FormGrid, FormField, FormLabel, FormError, getInputClasses ***REMOVED*** from '../../base/BaseForm';
import Flex from '../../../ui/Flex';

const ShiftForm = (***REMOVED***
  id,
  shift,
  workId,
  works = [],
  onSubmit,
  onWorkChange,
  onDirtyChange, // New prop
  isMobile = false,
  initialDate
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const ***REMOVED*** smokoEnabled, smokoMinutes ***REMOVED*** = useApp(); // NEW

  const [initialFormData, setInitialFormData] = useState(null);
  const [formData, setFormData] = useState(***REMOVED***
    workId: workId || '',
    startDate: '',
    startTime: '',
    endTime: '',
    crossesMidnight: false,
    endDate: '',
    hadBreak: true, // NEW - by default assumes break was taken
    breakMinutes: smokoMinutes, // NEW - editable
    notes: ''
  ***REMOVED***);

  const [isEditingBreak, setIsEditingBreak] = useState(false);
  const [errors, setErrors] = useState(***REMOVED******REMOVED***);

  // Effect to detect if the form is "dirty" (modified)
  useEffect(() => ***REMOVED***
    if (!initialFormData || !onDirtyChange) return;

    // Only considered dirty if it is an existing shift
    if (shift) ***REMOVED***
      const isDirty =
        formData.workId !== initialFormData.workId ||
        formData.startDate !== initialFormData.startDate ||
        formData.startTime !== initialFormData.startTime ||
        formData.endTime !== initialFormData.endTime ||
        formData.hadBreak !== initialFormData.hadBreak ||
        Number(formData.breakMinutes) !== Number(initialFormData.breakMinutes) ||
        formData.notes !== initialFormData.notes;
      onDirtyChange(isDirty);
    ***REMOVED*** else ***REMOVED***
      onDirtyChange(true); // For new shifts, the button is always active
    ***REMOVED***
  ***REMOVED***, [formData, initialFormData, onDirtyChange, shift]);


  // Function to calculate shift duration - USING CENTRALIZED UTILITY
  const calculateShiftDuration = useCallback(() => ***REMOVED***
    if (!formData.startTime || !formData.endTime) return null;

    const totalHours = calculateShiftHours(formData.startTime, formData.endTime);
    const totalMinutes = Math.round(totalHours * 60);

    // Apply smoko discount if enabled
    let actualMinutes = totalMinutes;
    const breakDuration = formData.breakMinutes || 0;

    if (smokoEnabled && formData.hadBreak && totalMinutes > breakDuration) ***REMOVED***
      actualMinutes = totalMinutes - breakDuration;
    ***REMOVED***

    return ***REMOVED***
      totalMinutes,
      actualMinutes,
      hours: Math.floor(actualMinutes / 60),
      minutes: actualMinutes % 60,
      smokoApplied: smokoEnabled && formData.hadBreak && totalMinutes > breakDuration,
      minutesDiscounted: breakDuration
    ***REMOVED***;
  ***REMOVED***, [formData.startTime, formData.endTime, formData.hadBreak, smokoEnabled, formData.breakMinutes]);

  const duration = calculateShiftDuration();

  // Detect night shifts automatically
  useEffect(() => ***REMOVED***
    if (formData.startTime && formData.endTime) ***REMOVED***
      const [startHour] = formData.startTime.split(':').map(Number);
      const [endHour] = formData.endTime.split(':').map(Number);
      
      const isNightShift = startHour > endHour;
      
      if (isNightShift !== formData.crossesMidnight) ***REMOVED***
        setFormData(prev => (***REMOVED***
          ...prev,
          crossesMidnight: isNightShift,
          endDate: isNightShift && prev.startDate 
            ? calculateEndDate(prev.startDate)
            : ''
        ***REMOVED***));
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***, [formData.startTime, formData.endTime, formData.startDate, formData.crossesMidnight]);

  const calculateEndDate = (startDate) => ***REMOVED***
    const date = createSafeDate(startDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  ***REMOVED***;

  const validateForm = () => ***REMOVED***
    const newErrors = ***REMOVED******REMOVED***;

    if (!formData.workId) ***REMOVED***
      newErrors.workId = 'Select a job';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  ***REMOVED***;

  const handleSubmit = (e) => ***REMOVED***
    e.preventDefault();
    if (validateForm()) ***REMOVED***
      onSubmit(formData);
    ***REMOVED***
  ***REMOVED***;

  const handleInputChange = useCallback((field, value) => ***REMOVED***
    setFormData(prev => (***REMOVED*** ...prev, [field]: value ***REMOVED***));
    if (errors[field]) ***REMOVED***
      setErrors(prev => (***REMOVED*** ...prev, [field]: undefined ***REMOVED***));
    ***REMOVED***

    // Notify parent component of work change
    if (field === 'workId') ***REMOVED***
      onWorkChange?.(value);
    ***REMOVED***
  ***REMOVED***, [errors, onWorkChange]);

  // Initialize form - UPDATED
  useEffect(() => ***REMOVED***
    let initialData;
    if (shift) ***REMOVED***
      initialData = ***REMOVED***
        workId: shift.workId || '',
        startDate: shift.startDate || shift.date || '',
        startTime: shift.startTime || '',
        endTime: shift.endTime || '',
        crossesMidnight: shift.crossesMidnight || false,
        endDate: shift.endDate || '',
        hadBreak: shift.hadBreak !== undefined ? shift.hadBreak : true,
        breakMinutes: shift.breakMinutes !== undefined ? shift.breakMinutes : smokoMinutes,
        notes: shift.notes || ''
      ***REMOVED***;
    ***REMOVED*** else ***REMOVED***
      const dateStr = initialDate 
        ? (initialDate instanceof Date ? initialDate.toISOString().split('T')[0] : initialDate)
        : new Date().toISOString().split('T')[0];

      initialData = ***REMOVED***
        workId: workId || '',
        startDate: dateStr,
        startTime: '',
        endTime: '',
        crossesMidnight: false,
        endDate: '',
        hadBreak: true,
        breakMinutes: smokoMinutes,
        notes: ''
      ***REMOVED***;
    ***REMOVED***
    setFormData(initialData);
    setInitialFormData(initialData);
  ***REMOVED***, [shift, workId, initialDate, smokoMinutes]);

  const traditionalWorks = works.filter(w => w.type !== 'delivery');
  const deliveryWorks = works.filter(w => w.type === 'delivery');

  return (
    <BaseForm
      id=***REMOVED***id***REMOVED***
      onSubmit=***REMOVED***handleSubmit***REMOVED***
      isMobile=***REMOVED***isMobile***REMOVED***
    >
      ***REMOVED***/* Work selection */***REMOVED***
      <FormSection>
        <FormLabel icon=***REMOVED***Briefcase***REMOVED***>Work</FormLabel>
        <select
          value=***REMOVED***formData.workId***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('workId', e.target.value)***REMOVED***
          className=***REMOVED***getInputClasses(isMobile, errors.workId)***REMOVED***
          style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
          required
        >
          <option value="">Select work</option>

          ***REMOVED***traditionalWorks.length > 0 && (
            <optgroup label="Traditional Works">
              ***REMOVED***traditionalWorks.map(work => (
                <option key=***REMOVED***work.id***REMOVED*** value=***REMOVED***work.id***REMOVED***>
                  ***REMOVED***work.name***REMOVED***
                </option>
              ))***REMOVED***
            </optgroup>
          )***REMOVED***

          ***REMOVED***deliveryWorks.length > 0 && (
            <optgroup label="Delivery Works">
              ***REMOVED***deliveryWorks.map(work => (
                <option key=***REMOVED***work.id***REMOVED*** value=***REMOVED***work.id***REMOVED***>
                  ***REMOVED***work.name***REMOVED***
                </option>
              ))***REMOVED***
            </optgroup>
          )***REMOVED***
        </select>
        <FormError error=***REMOVED***errors.workId***REMOVED*** />
      </FormSection>

      ***REMOVED***/* RESPONSIVE DATE CONTAINER */***REMOVED***
      <FormGrid columns=***REMOVED***2***REMOVED***>
        ***REMOVED***/* Start date */***REMOVED***
        <FormField className=***REMOVED***!formData.crossesMidnight ? 'col-span-2' : ''***REMOVED***>
          <FormLabel icon=***REMOVED***Calendar***REMOVED***>Start date</FormLabel>
          <input
            type="date"
            value=***REMOVED***formData.startDate***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('startDate', e.target.value)***REMOVED***
            className=***REMOVED***getInputClasses(isMobile, errors.startDate)***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            required
          />
          <FormError error=***REMOVED***errors.startDate***REMOVED*** />
        </FormField>

        ***REMOVED***/* End date - only show if it's a night shift */***REMOVED***
        ***REMOVED***formData.crossesMidnight && (
          <FormField>
            <FormLabel icon=***REMOVED***Calendar***REMOVED***>End date</FormLabel>
            <input
              type="date"
              value=***REMOVED***formData.endDate || calculateEndDate(formData.startDate)***REMOVED***
              onChange=***REMOVED***(e) => handleInputChange('endDate', e.target.value)***REMOVED***
              className=***REMOVED***getInputClasses(isMobile)***REMOVED***
              style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Calculated automatically for night shifts
            </p>
          </FormField>
        )***REMOVED***
      </FormGrid>

      ***REMOVED***/* RESPONSIVE TIME CONTAINER */***REMOVED***
      <FormGrid columns=***REMOVED***2***REMOVED***>
        ***REMOVED***/* Start time */***REMOVED***
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

        ***REMOVED***/* End time */***REMOVED***
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

***REMOVED***/* NEW SECTION: BREAK (SMOKO) - OPTIMIZED FOR MOBILE */***REMOVED***
***REMOVED***smokoEnabled && duration && duration.totalMinutes > 0 && (
  <div className="w-full">
    <div 
      className=***REMOVED***`
        rounded-lg border
        $***REMOVED***isMobile ? 'p-4 space-y-4' : 'p-4 space-y-3'***REMOVED***
      `***REMOVED***
      style=***REMOVED******REMOVED*** 
        backgroundColor: colors.transparent5,
        borderColor: colors.transparent20 
      ***REMOVED******REMOVED***
    >
      ***REMOVED***/* Header with title and custom toggle */***REMOVED***
      <Flex variant="between" className=***REMOVED***`
        $***REMOVED***isMobile ? 'pb-2 border-b border-gray-200' : ''***REMOVED***
      `***REMOVED***>
        <div className="flex items-center flex-1">
          <Coffee 
            size=***REMOVED***isMobile ? 18 : 16***REMOVED*** 
            style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** 
            className="mr-2 flex-shrink-0" 
          />
          <span className=***REMOVED***`font-medium text-gray-700 $***REMOVED***isMobile ? 'text-base' : 'text-sm'***REMOVED***`***REMOVED***>
            Did you have a break?
          </span>
        </div>

        ***REMOVED***/* Custom Toggle Switch */***REMOVED***
        <label className="relative inline-flex items-center cursor-pointer">
          ***REMOVED***/* Hidden input */***REMOVED***
          <input
            type="checkbox"
            checked=***REMOVED***formData.hadBreak***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('hadBreak', e.target.checked)***REMOVED***
            className="sr-only peer"
          />
          
          ***REMOVED***/* Custom switch */***REMOVED***
          <div className=***REMOVED***`
            relative bg-gray-200 rounded-full peer 
            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2
            peer-checked:after:translate-x-full peer-checked:after:border-white 
            after:content-[''] after:absolute after:bg-white after:border-gray-300 
            after:border after:rounded-full after:transition-all
            $***REMOVED***isMobile 
              ? 'w-12 h-6 after:top-[2px] after:left-[2px] after:h-5 after:w-5' 
              : 'w-10 h-5 after:top-[1px] after:left-[1px] after:h-4 after:w-4'
            ***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED***
            '--tw-ring-color': colors.primary,
            backgroundColor: formData.hadBreak ? colors.primary : undefined
          ***REMOVED******REMOVED***
          />
          
          ***REMOVED***/* Toggle text */***REMOVED***
          <span className=***REMOVED***`
            ml-3 font-medium
            $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***
            $***REMOVED***formData.hadBreak ? 'text-green-700' : 'text-gray-600'***REMOVED***
          `***REMOVED***>
            ***REMOVED***formData.hadBreak ? 'Yes' : 'No'***REMOVED***
          </span>
        </label>
      </Flex>

      ***REMOVED***/* Calculation information - RESPONSIVE LAYOUT */***REMOVED***
      <div className=***REMOVED***`
        $***REMOVED***isMobile ? 'space-y-3' : 'space-y-2'***REMOVED***
        $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***
        text-gray-600
      `***REMOVED***>
        ***REMOVED***/* Scheduled time */***REMOVED***
        <Flex variant="between" className=***REMOVED***`
          p-2 rounded
          $***REMOVED***isMobile ? 'bg-blue-50' : 'bg-gray-50'***REMOVED***
        `***REMOVED***>
          <div className="flex items-center">
            <Flex variant="center" className=***REMOVED***`
              rounded-full mr-2
              $***REMOVED***isMobile ? 'w-6 h-6 text-xs' : 'w-5 h-5 text-xs'***REMOVED***
            `***REMOVED***
            style=***REMOVED******REMOVED*** backgroundColor: colors.transparent20, color: colors.primary ***REMOVED******REMOVED***>
              <Clock size=***REMOVED***isMobile ? 12 : 10***REMOVED*** />
            </Flex>
            <span className=***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***>Scheduled time:</span>
          </div>
          <span className=***REMOVED***`font-semibold $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***>
            ***REMOVED***Math.floor(duration.totalMinutes / 60)***REMOVED***h ***REMOVED***duration.totalMinutes % 60***REMOVED***min
          </span>
        </Flex>

        ***REMOVED***formData.hadBreak ? (
          <>
            ***REMOVED***/* Configured break (NOW EDITABLE WITH CLICK) */***REMOVED***
            <Flex variant="between" className=***REMOVED***`p-2 rounded items-center $***REMOVED***isMobile ? 'bg-orange-50' : 'bg-gray-50'***REMOVED***`***REMOVED***>
              <div className="flex items-center">
                <Flex variant="center" className=***REMOVED***`
                  rounded-full mr-2
                  $***REMOVED***isMobile ? 'w-6 h-6' : 'w-5 h-5'***REMOVED***
                `***REMOVED***
                style=***REMOVED******REMOVED*** backgroundColor: '#FED7AA', color: '#EA580C' ***REMOVED******REMOVED***>
                  <Coffee size=***REMOVED***isMobile ? 10 : 8***REMOVED*** />
                </Flex>
                <span className=***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***>Break:</span>
              </div>

              ***REMOVED***isEditingBreak ? (
                <div className="flex items-center">
                  <input
                    type="number"
                    value=***REMOVED***formData.breakMinutes***REMOVED***
                    onChange=***REMOVED***(e) => handleInputChange('breakMinutes', e.target.value === '' ? 0 : parseInt(e.target.value, 10))***REMOVED***
                    className=***REMOVED***`$***REMOVED***getInputClasses(isMobile)***REMOVED*** py-1 px-2 w-20 text-center font-semibold`***REMOVED***
                    style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
                    autoFocus
                    onBlur=***REMOVED***() => setIsEditingBreak(false)***REMOVED***
                  />
                  <button type="button" onClick=***REMOVED***() => setIsEditingBreak(false)***REMOVED*** className="ml-2 text-green-600">
                    <Check size=***REMOVED***18***REMOVED*** />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className=***REMOVED***`font-semibold $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***>
                    ***REMOVED***formData.breakMinutes***REMOVED*** minutes
                  </span>
                  <button type="button" onClick=***REMOVED***() => setIsEditingBreak(true)***REMOVED*** className="ml-2 text-gray-500 hover:text-gray-700">
                    <Pencil size=***REMOVED***14***REMOVED*** />
                  </button>
                </div>
              )***REMOVED***
            </Flex>

            ***REMOVED***/* Paid time */***REMOVED***
            <Flex variant="between" className=***REMOVED***`
              p-2 rounded border
              $***REMOVED***isMobile ? 'bg-green-50 border-green-200' : 'bg-gray-50'***REMOVED***
            `***REMOVED***
            style=***REMOVED******REMOVED*** 
              backgroundColor: isMobile ? colors.transparent10 : undefined,
              borderColor: isMobile ? colors.transparent30 : undefined
            ***REMOVED******REMOVED***>
              <Flex variant="center">
                <Flex variant="center" className=***REMOVED***`
                  rounded-full mr-2
                  $***REMOVED***isMobile ? 'w-6 h-6' : 'w-5 h-5'***REMOVED***
                `***REMOVED***
                style=***REMOVED******REMOVED*** backgroundColor: colors.primary, color: 'white' ***REMOVED******REMOVED***>
                  <span className=***REMOVED***`font-bold $***REMOVED***isMobile ? 'text-xs' : 'text-[10px]'***REMOVED***`***REMOVED***>$</span>
                </Flex>
                <span className=***REMOVED***`font-medium $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***
                      style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                  Paid time:
                </span>
              </Flex>
              <span className=***REMOVED***`font-bold $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***
                    style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                ***REMOVED***duration.hours***REMOVED***h ***REMOVED***duration.minutes***REMOVED***min
              </span>
            </Flex>
          </>
        ) : (
          /* No discount applied */
          <Flex variant="between" className=***REMOVED***`
            p-2 rounded border
            $***REMOVED***isMobile ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED*** 
            backgroundColor: isMobile ? colors.transparent10 : undefined,
            borderColor: isMobile ? colors.transparent30 : undefined
          ***REMOVED******REMOVED***>
            <Flex variant="center">
              <Flex variant="center" className=***REMOVED***`
                rounded-full mr-2
                $***REMOVED***isMobile ? 'w-6 h-6' : 'w-5 h-5'***REMOVED***
              `***REMOVED***
              style=***REMOVED******REMOVED*** backgroundColor: colors.primary, color: 'white' ***REMOVED******REMOVED***>
                <span className=***REMOVED***`font-bold $***REMOVED***isMobile ? 'text-xs' : 'text-[10px]'***REMOVED***`***REMOVED***>$</span>
              </Flex>
              <span className=***REMOVED***`font-medium $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***
                    style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                Paid time:
              </span>
            </Flex>
            <div className="text-right">
              <div className=***REMOVED***`font-bold $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***
                   style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                ***REMOVED***Math.floor(duration.totalMinutes / 60)***REMOVED***h ***REMOVED***duration.totalMinutes % 60***REMOVED***min
              </div>
              <div className=***REMOVED***`$***REMOVED***isMobile ? 'text-xs' : 'text-[10px]'***REMOVED*** text-gray-500`***REMOVED***>
                (no discount)
              </div>
            </div>
          </Flex>
        )***REMOVED***
      </div>
    </div>
  </div>
)***REMOVED***

      ***REMOVED***/* Notes field */***REMOVED***
      <FormSection>
        <FormLabel icon=***REMOVED***FileText***REMOVED***>Notes (optional)</FormLabel>
        <textarea
          value=***REMOVED***formData.notes***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('notes', e.target.value)***REMOVED***
          placeholder="Add notes about this shift..."
          className=***REMOVED***`$***REMOVED***getInputClasses(isMobile)***REMOVED*** border-gray-300 resize-none`***REMOVED***
          style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
          rows=***REMOVED***3***REMOVED***
        />
      </FormSection>
    </BaseForm>
  );
***REMOVED***;

export default ShiftForm;