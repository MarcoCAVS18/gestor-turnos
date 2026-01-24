// src/components/forms/work/WorkForm/index.jsx

import React, { useState, useEffect } from 'react';
import { Briefcase, DollarSign, Palette, FileText, Clock } from 'lucide-react';
import { useFormValidation } from '../../../../hooks/useFormValidation';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { VALIDATION_RULES } from '../../../../constants/validation';
import { PREDEFINED_COLORS } from '../../../../constants/colors';
import ThemeInput from '../../../ui/ThemeInput';
import BaseForm, { FormSection, FormGrid, FormLabel, FormError } from '../../base/BaseForm';

const WorkForm = ({ 
  id,
  work, 
  onSubmit, 
  isMobile 
}) => {
  const colors = useThemeColors();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: colors.primary,
    baseRate: '',
    rates: {
      day: '',
      afternoon: '',
      night: '',
      saturday: '',
      sunday: '',
      holidays: ''
    }
  });

  const validationRules = {
    name: [VALIDATION_RULES.required, VALIDATION_RULES.minLength(2)],
    baseRate: [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'rates.day': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'rates.afternoon': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'rates.night': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'rates.saturday': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'rates.sunday': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'rates.holidays': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber]
  };

  const { errors, validateForm, handleFieldChange } = useFormValidation(validationRules);

  useEffect(() => {
    if (work) {
      setFormData({
        name: work.name || '',
        description: work.description || '',
        color: work.color || colors.primary,
        baseRate: work.baseRate?.toString() || '',
        rates: {
          day: work.rates?.day?.toString() || '',
          afternoon: work.rates?.afternoon?.toString() || '',
          night: work.rates?.night?.toString() || '',
          saturday: work.rates?.saturday?.toString() || '',
          sunday: work.rates?.sunday?.toString() || '',
          holidays: work.rates?.holidays?.toString() || ''
        }
      });
    } else {
      // For new jobs, use the default theme color
      setFormData(prev => ({
        ...prev,
        color: colors.primary
      }));
    }
  }, [work, colors.primary]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    handleFieldChange(field, value);
  };

  const handleRateChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      rates: {
        ...prev.rates,
        [type]: value
      }
    }));
    handleFieldChange(`rates.${type}`, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const flatFormData = {
      ...formData,
      'rates.day': formData.rates.day,
      'rates.afternoon': formData.rates.afternoon,
      'rates.night': formData.rates.night,
      'rates.saturday': formData.rates.saturday,
      'rates.sunday': formData.rates.sunday,
      'rates.holidays': formData.rates.holidays
    };

    if (!validateForm(flatFormData)) return;

    const completeData = {
      ...formData,
      baseRate: parseFloat(formData.baseRate),
      rates: {
        day: parseFloat(formData.rates.day),
        afternoon: parseFloat(formData.rates.afternoon),
        night: parseFloat(formData.rates.night),
        saturday: parseFloat(formData.rates.saturday),
        sunday: parseFloat(formData.rates.sunday),
        holidays: parseFloat(formData.rates.holidays)
      }
    };

    onSubmit(completeData);
  };

  return (
    <BaseForm
      id={id}
      onSubmit={handleSubmit}
      isMobile={isMobile}
    >
      {/* Company Name */}
      <FormSection>
        <FormLabel icon={Briefcase}>Company Name *</FormLabel>
        <ThemeInput
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`
            w-full border rounded-lg transition-colors
            ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
            ${errors.name ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="e.g., Tech Company Inc."
          required
        />
        <FormError error={errors.name} size="sm" />
      </FormSection>

      {/* Color */}
      <FormSection>
        <FormLabel icon={Palette}>Work Color</FormLabel>
        <div className="space-y-3">
          <div className={`flex flex-wrap ${isMobile ? 'gap-3' : 'gap-2'}`}>
            {PREDEFINED_COLORS.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleInputChange('color', color.value)}
                className={`
                  rounded-full border-2 transition-all transform hover:scale-110
                  ${isMobile ? 'w-10 h-10' : 'w-8 h-8'}
                  ${formData.color === color.value 
                    ? 'border-gray-800 scale-110 shadow-lg' 
                    : 'border-gray-300 hover:border-gray-500'
                  }
                `}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              className={`border border-gray-300 rounded cursor-pointer ${isMobile ? 'w-20 h-10' : 'w-16 h-8'}`}
            />
            <span className="text-sm text-gray-500">or choose a custom color</span>
          </div>
        </div>
      </FormSection>

      {/* Base rate */}
      <FormSection>
        <FormLabel icon={DollarSign}>Base hourly rate *</FormLabel>
        <ThemeInput
          type="number"
          value={formData.baseRate}
          onChange={(e) => handleInputChange('baseRate', e.target.value)}
          className={`
            w-full border rounded-lg transition-colors
            ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
            ${errors.baseRate ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="15.00"
          step="0.01"
          min="0"
          required
        />
        <FormError error={errors.baseRate} size="sm" />
      </FormSection>

      {/* Specific rates */}
      <FormSection>
        <FormLabel icon={Clock}>
          Rates by shift type *
        </FormLabel>
        <FormGrid columns={2}>
          {Object.entries({
            day: 'Day',
            afternoon: 'Afternoon',
            night: 'Night',
            saturday: 'Saturday',
            sunday: 'Sunday',
            holidays: 'Holidays'
          }).map(([type, label]) => (
            <div key={type}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <ThemeInput
                type="number"
                value={formData.rates[type]}
                onChange={(e) => handleRateChange(type, e.target.value)}
                className={`
                  w-full border rounded-lg transition-colors
                  ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
                  ${errors[`rates.${type}`] ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              {errors[`rates.${type}`] && (
                <p className="mt-1 text-xs text-red-600">{errors[`rates.${type}`]}</p>
              )}
            </div>
          ))}
        </FormGrid>
      </FormSection>

      {/* Description */}
      <FormSection>
        <FormLabel icon={FileText}>Description (optional)</FormLabel>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Additional details about this job..."
          rows={isMobile ? 4 : 3}
          className={`
            w-full border border-gray-300 rounded-lg transition-colors resize-none
            ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
          `}
          style={{
            '--tw-ring-color': colors.primary
          }}
        />
      </FormSection>
    </BaseForm>
  );
};

export default WorkForm;