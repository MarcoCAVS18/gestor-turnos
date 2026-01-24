// src/components/forms/work/WorkForm/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Briefcase, DollarSign, Palette, FileText, Clock ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useFormValidation ***REMOVED*** from '../../../../hooks/useFormValidation';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';
import ***REMOVED*** VALIDATION_RULES ***REMOVED*** from '../../../../constants/validation';
import ***REMOVED*** PREDEFINED_COLORS ***REMOVED*** from '../../../../constants/colors';
import ThemeInput from '../../../ui/ThemeInput';
import BaseForm, ***REMOVED*** FormSection, FormGrid, FormLabel, FormError ***REMOVED*** from '../../base/BaseForm';

const WorkForm = (***REMOVED*** 
  id,
  work, 
  onSubmit, 
  isMobile 
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  
  const [formData, setFormData] = useState(***REMOVED***
    name: '',
    description: '',
    color: colors.primary,
    baseRate: '',
    rates: ***REMOVED***
      day: '',
      afternoon: '',
      night: '',
      saturday: '',
      sunday: '',
      holidays: ''
    ***REMOVED***
  ***REMOVED***);

  const validationRules = ***REMOVED***
    name: [VALIDATION_RULES.required, VALIDATION_RULES.minLength(2)],
    baseRate: [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'rates.day': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'rates.afternoon': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'rates.night': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'rates.saturday': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'rates.sunday': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'rates.holidays': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber]
  ***REMOVED***;

  const ***REMOVED*** errors, validateForm, handleFieldChange ***REMOVED*** = useFormValidation(validationRules);

  useEffect(() => ***REMOVED***
    if (work) ***REMOVED***
      setFormData(***REMOVED***
        name: work.name || '',
        description: work.description || '',
        color: work.color || colors.primary,
        baseRate: work.baseRate?.toString() || '',
        rates: ***REMOVED***
          day: work.rates?.day?.toString() || '',
          afternoon: work.rates?.afternoon?.toString() || '',
          night: work.rates?.night?.toString() || '',
          saturday: work.rates?.saturday?.toString() || '',
          sunday: work.rates?.sunday?.toString() || '',
          holidays: work.rates?.holidays?.toString() || ''
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED*** else ***REMOVED***
      // For new jobs, use the default theme color
      setFormData(prev => (***REMOVED***
        ...prev,
        color: colors.primary
      ***REMOVED***));
    ***REMOVED***
  ***REMOVED***, [work, colors.primary]);

  const handleInputChange = (field, value) => ***REMOVED***
    setFormData(prev => (***REMOVED***
      ...prev,
      [field]: value
    ***REMOVED***));
    handleFieldChange(field, value);
  ***REMOVED***;

  const handleRateChange = (type, value) => ***REMOVED***
    setFormData(prev => (***REMOVED***
      ...prev,
      rates: ***REMOVED***
        ...prev.rates,
        [type]: value
      ***REMOVED***
    ***REMOVED***));
    handleFieldChange(`rates.$***REMOVED***type***REMOVED***`, value);
  ***REMOVED***;

  const handleSubmit = (e) => ***REMOVED***
    e.preventDefault();
    
    const flatFormData = ***REMOVED***
      ...formData,
      'rates.day': formData.rates.day,
      'rates.afternoon': formData.rates.afternoon,
      'rates.night': formData.rates.night,
      'rates.saturday': formData.rates.saturday,
      'rates.sunday': formData.rates.sunday,
      'rates.holidays': formData.rates.holidays
    ***REMOVED***;

    if (!validateForm(flatFormData)) return;

    const completeData = ***REMOVED***
      ...formData,
      baseRate: parseFloat(formData.baseRate),
      rates: ***REMOVED***
        day: parseFloat(formData.rates.day),
        afternoon: parseFloat(formData.rates.afternoon),
        night: parseFloat(formData.rates.night),
        saturday: parseFloat(formData.rates.saturday),
        sunday: parseFloat(formData.rates.sunday),
        holidays: parseFloat(formData.rates.holidays)
      ***REMOVED***
    ***REMOVED***;

    onSubmit(completeData);
  ***REMOVED***;

  return (
    <BaseForm
      id=***REMOVED***id***REMOVED***
      onSubmit=***REMOVED***handleSubmit***REMOVED***
      isMobile=***REMOVED***isMobile***REMOVED***
    >
      ***REMOVED***/* Company Name */***REMOVED***
      <FormSection>
        <FormLabel icon=***REMOVED***Briefcase***REMOVED***>Company Name *</FormLabel>
        <ThemeInput
          type="text"
          value=***REMOVED***formData.name***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('name', e.target.value)***REMOVED***
          className=***REMOVED***`
            w-full border rounded-lg transition-colors
            $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
            $***REMOVED***errors.name ? 'border-red-500' : 'border-gray-300'***REMOVED***
          `***REMOVED***
          placeholder="e.g., Tech Company Inc."
          required
        />
        <FormError error=***REMOVED***errors.name***REMOVED*** size="sm" />
      </FormSection>

      ***REMOVED***/* Color */***REMOVED***
      <FormSection>
        <FormLabel icon=***REMOVED***Palette***REMOVED***>Work Color</FormLabel>
        <div className="space-y-3">
          <div className=***REMOVED***`flex flex-wrap $***REMOVED***isMobile ? 'gap-3' : 'gap-2'***REMOVED***`***REMOVED***>
            ***REMOVED***PREDEFINED_COLORS.map(color => (
              <button
                key=***REMOVED***color.value***REMOVED***
                type="button"
                onClick=***REMOVED***() => handleInputChange('color', color.value)***REMOVED***
                className=***REMOVED***`
                  rounded-full border-2 transition-all transform hover:scale-110
                  $***REMOVED***isMobile ? 'w-10 h-10' : 'w-8 h-8'***REMOVED***
                  $***REMOVED***formData.color === color.value 
                    ? 'border-gray-800 scale-110 shadow-lg' 
                    : 'border-gray-300 hover:border-gray-500'
                  ***REMOVED***
                `***REMOVED***
                style=***REMOVED******REMOVED*** backgroundColor: color.value ***REMOVED******REMOVED***
                title=***REMOVED***color.name***REMOVED***
              />
            ))***REMOVED***
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value=***REMOVED***formData.color***REMOVED***
              onChange=***REMOVED***(e) => handleInputChange('color', e.target.value)***REMOVED***
              className=***REMOVED***`border border-gray-300 rounded cursor-pointer $***REMOVED***isMobile ? 'w-20 h-10' : 'w-16 h-8'***REMOVED***`***REMOVED***
            />
            <span className="text-sm text-gray-500">or choose a custom color</span>
          </div>
        </div>
      </FormSection>

      ***REMOVED***/* Base rate */***REMOVED***
      <FormSection>
        <FormLabel icon=***REMOVED***DollarSign***REMOVED***>Base hourly rate *</FormLabel>
        <ThemeInput
          type="number"
          value=***REMOVED***formData.baseRate***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('baseRate', e.target.value)***REMOVED***
          className=***REMOVED***`
            w-full border rounded-lg transition-colors
            $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
            $***REMOVED***errors.baseRate ? 'border-red-500' : 'border-gray-300'***REMOVED***
          `***REMOVED***
          placeholder="15.00"
          step="0.01"
          min="0"
          required
        />
        <FormError error=***REMOVED***errors.baseRate***REMOVED*** size="sm" />
      </FormSection>

      ***REMOVED***/* Specific rates */***REMOVED***
      <FormSection>
        <FormLabel icon=***REMOVED***Clock***REMOVED***>
          Rates by shift type *
        </FormLabel>
        <FormGrid columns=***REMOVED***2***REMOVED***>
          ***REMOVED***Object.entries(***REMOVED***
            day: 'Day',
            afternoon: 'Afternoon',
            night: 'Night',
            saturday: 'Saturday',
            sunday: 'Sunday',
            holidays: 'Holidays'
          ***REMOVED***).map(([type, label]) => (
            <div key=***REMOVED***type***REMOVED***>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ***REMOVED***label***REMOVED***
              </label>
              <ThemeInput
                type="number"
                value=***REMOVED***formData.rates[type]***REMOVED***
                onChange=***REMOVED***(e) => handleRateChange(type, e.target.value)***REMOVED***
                className=***REMOVED***`
                  w-full border rounded-lg transition-colors
                  $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
                  $***REMOVED***errors[`rates.$***REMOVED***type***REMOVED***`] ? 'border-red-500' : 'border-gray-300'***REMOVED***
                `***REMOVED***
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              ***REMOVED***errors[`rates.$***REMOVED***type***REMOVED***`] && (
                <p className="mt-1 text-xs text-red-600">***REMOVED***errors[`rates.$***REMOVED***type***REMOVED***`]***REMOVED***</p>
              )***REMOVED***
            </div>
          ))***REMOVED***
        </FormGrid>
      </FormSection>

      ***REMOVED***/* Description */***REMOVED***
      <FormSection>
        <FormLabel icon=***REMOVED***FileText***REMOVED***>Description (optional)</FormLabel>
        <textarea
          value=***REMOVED***formData.description***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('description', e.target.value)***REMOVED***
          placeholder="Additional details about this job..."
          rows=***REMOVED***isMobile ? 4 : 3***REMOVED***
          className=***REMOVED***`
            w-full border border-gray-300 rounded-lg transition-colors resize-none
            $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED***
            '--tw-ring-color': colors.primary
          ***REMOVED******REMOVED***
        />
      </FormSection>
    </BaseForm>
  );
***REMOVED***;

export default WorkForm;