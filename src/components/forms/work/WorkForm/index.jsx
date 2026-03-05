// src/components/forms/work/WorkForm/index.jsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, DollarSign, Palette, FileText, Clock, Check, ExternalLink, Calendar } from 'lucide-react';
import { useFormValidation } from '../../../../hooks/useFormValidation';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { useConfigContext } from '../../../../contexts/ConfigContext';
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
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { holidayCountry } = useConfigContext();
  const isAustraliaMode = holidayCountry === 'AU';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: colors.primary,
    baseRate: '',
    australia88Eligible: false,
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
        australia88Eligible: work.australia88Eligible || false,
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

  // Normalize comma decimal separator to dot for parseFloat compatibility
  const parseDecimal = (value) => parseFloat(value?.toString().replace(',', '.'));

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-fill all empty rate fields when baseRate is typed
      if (field === 'baseRate' && value) {
        updated.rates = Object.fromEntries(
          Object.entries(prev.rates).map(([k, v]) => [k, (v === '' || v === prev.baseRate) ? value : v])
        );
      }
      return updated;
    });
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
      baseRate: parseDecimal(formData.baseRate),
      rates: {
        day: parseDecimal(formData.rates.day),
        afternoon: parseDecimal(formData.rates.afternoon),
        night: parseDecimal(formData.rates.night),
        saturday: parseDecimal(formData.rates.saturday),
        sunday: parseDecimal(formData.rates.sunday),
        holidays: parseDecimal(formData.rates.holidays)
      }
    };

    onSubmit(completeData);
  };

  // Rate type labels with translation
  const rateTypes = [
    { key: 'day', label: t('stats.deliveryHourlyAnalysis.insights.periods.morning').split(' ')[0] },
    { key: 'afternoon', label: t('stats.deliveryHourlyAnalysis.insights.periods.afternoon').split(' ')[0] },
    { key: 'night', label: t('forms.work.rates.night') },
    { key: 'saturday', label: t('forms.work.rates.saturday') },
    { key: 'sunday', label: t('forms.work.rates.sunday') },
    { key: 'holidays', label: t('forms.work.rates.holiday') }
  ];

  return (
    <BaseForm
      id={id}
      onSubmit={handleSubmit}
      isMobile={isMobile}
    >
      {/* Company Name */}
      <FormSection>
        <FormLabel icon={Briefcase}>{t('forms.work.companyName')} *</FormLabel>
        <ThemeInput
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`
            w-full border rounded-lg transition-colors
            ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
            ${errors.name ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder={t('forms.work.namePlaceholder')}
          required
        />
        <FormError error={errors.name} size="sm" />
      </FormSection>

      {/* Color */}
      <FormSection>
        <FormLabel icon={Palette}>{t('forms.work.workColor')}</FormLabel>
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
            <span className="text-sm text-gray-500">{t('forms.work.customColor')}</span>
          </div>
        </div>
      </FormSection>

      {/* Base rate */}
      <FormSection>
        <FormLabel icon={DollarSign}>{t('forms.work.baseHourlyRate')} *</FormLabel>
        <ThemeInput
          type="text"
          inputMode="decimal"
          value={formData.baseRate}
          onChange={(e) => handleInputChange('baseRate', e.target.value)}
          className={`
            w-full border rounded-lg transition-colors
            ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
            ${errors.baseRate ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder={t('forms.work.baseRatePlaceholder')}
          required
        />
        <FormError error={errors.baseRate} size="sm" />
      </FormSection>

      {/* Specific rates */}
      <FormSection>
        <FormLabel icon={Clock}>
          {t('forms.work.ratesByShiftType')} *
        </FormLabel>
        <FormGrid columns={2}>
          {rateTypes.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <ThemeInput
                type="text"
                inputMode="decimal"
                value={formData.rates[key]}
                onChange={(e) => handleRateChange(key, e.target.value)}
                className={`
                  w-full border rounded-lg transition-colors
                  ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
                  ${errors[`rates.${key}`] ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder={t('forms.work.baseRatePlaceholder')}
                required
              />
              {errors[`rates.${key}`] && (
                <p className="mt-1 text-xs text-red-600">{errors[`rates.${key}`]}</p>
              )}
            </div>
          ))}
        </FormGrid>
      </FormSection>

      {/* Description */}
      <FormSection>
        <FormLabel icon={FileText}>{t('forms.work.descriptionOptional')}</FormLabel>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder={t('forms.work.descriptionPlaceholder')}
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

      {/* Working Holiday Visa — only visible in Australia mode */}
      {isAustraliaMode && (
        <FormSection>
          <FormLabel icon={Calendar}>{t('australia88.formLabel')}</FormLabel>

          {/* Selectable card */}
          <button
            type="button"
            onClick={() => handleInputChange('australia88Eligible', !formData.australia88Eligible)}
            className={`
              w-full text-left rounded-xl border-2 transition-all duration-200
              ${isMobile ? 'p-4' : 'p-3'}
              ${formData.australia88Eligible
                ? 'border-current bg-opacity-5'
                : 'border-gray-200 dark:border-gray-700 bg-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
            style={formData.australia88Eligible ? {
              borderColor: colors.primary,
              backgroundColor: colors.transparent5
            } : {}}
          >
            <div className="flex items-center gap-3">
              {/* Custom checkbox indicator */}
              <div
                className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all duration-200"
                style={formData.australia88Eligible
                  ? { borderColor: colors.primary, backgroundColor: colors.primary }
                  : { borderColor: '#d1d5db' }
                }
              >
                {formData.australia88Eligible && <Check size={12} className="text-white" strokeWidth={3} />}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-gray-800 dark:text-gray-100 ${isMobile ? 'text-base' : 'text-sm'}`}>
                  {t('australia88.qualifiesDescription')}
                </p>
                <p className={`text-gray-500 dark:text-gray-400 mt-0.5 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                  {t('australia88.regionalWork')}
                </p>
              </div>

              {/* AU flag pill */}
              <span className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                🇦🇺 88 {t('australia88.daysUnit')}
              </span>
            </div>
          </button>

          {/* Home Affairs link */}
          <p className={`mt-2 text-gray-500 dark:text-gray-400 ${isMobile ? 'text-sm' : 'text-xs'}`}>
            {t('australia88.notSure')}{' '}
            <a
              href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417/specified-work"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium hover:underline"
              style={{ color: colors.primary }}
              onClick={(e) => e.stopPropagation()}
            >
              {t('australia88.checkHomeAffairs')}
              <ExternalLink size={11} />
            </a>
          </p>
        </FormSection>
      )}
    </BaseForm>
  );
};

export default WorkForm;
