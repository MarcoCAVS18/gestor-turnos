// src/components/forms/work/TrabajoForm/index.jsx - REFACTORIZADO CON BaseForm

import React, { useState, useEffect } from 'react';
import { Briefcase, DollarSign, Palette, FileText, Clock } from 'lucide-react';
import { useFormValidation } from '../../../../hooks/useFormValidation';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { VALIDATION_RULES } from '../../../../constants/validation';
import { PREDEFINED_COLORS } from '../../../../constants/colors';
import ThemeInput from '../../../ui/ThemeInput';
import BaseForm, { FormSection, FormGrid, FormLabel, FormError } from '../../base/BaseForm';

const TrabajoForm = ({ 
  id,
  trabajo, 
  onSubmit, 
  isMobile 
}) => {
  const colors = useThemeColors();
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    color: colors.primary,
    tarifaBase: '',
    tarifas: {
      diurno: '',
      tarde: '',
      noche: '',
      sabado: '',
      domingo: '',
      feriados: ''
    }
  });

  const validationRules = {
    nombre: [VALIDATION_RULES.required, VALIDATION_RULES.minLength(2)],
    tarifaBase: [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.diurno': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.tarde': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.noche': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.sabado': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.domingo': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.feriados': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber]
  };

  const { errors, validateForm, handleFieldChange } = useFormValidation(validationRules);

  useEffect(() => {
    if (trabajo) {
      setFormData({
        nombre: trabajo.nombre || '',
        descripcion: trabajo.descripcion || '',
        color: trabajo.color || colors.primary,
        tarifaBase: trabajo.tarifaBase?.toString() || '',
        tarifas: {
          diurno: trabajo.tarifas?.diurno?.toString() || '',
          tarde: trabajo.tarifas?.tarde?.toString() || '',
          noche: trabajo.tarifas?.noche?.toString() || '',
          sabado: trabajo.tarifas?.sabado?.toString() || '',
          domingo: trabajo.tarifas?.domingo?.toString() || '',
          feriados: trabajo.tarifas?.feriados?.toString() || ''
        }
      });
    } else {
      // Para nuevos trabajos, usar el color temático por defecto
      setFormData(prev => ({
        ...prev,
        color: colors.primary
      }));
    }
  }, [trabajo, colors.primary]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    handleFieldChange(field, value);
  };

  const handleTarifaChange = (tipo, value) => {
    setFormData(prev => ({
      ...prev,
      tarifas: {
        ...prev.tarifas,
        [tipo]: value
      }
    }));
    handleFieldChange(`tarifas.${tipo}`, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const flatFormData = {
      ...formData,
      'tarifas.diurno': formData.tarifas.diurno,
      'tarifas.tarde': formData.tarifas.tarde,
      'tarifas.noche': formData.tarifas.noche,
      'tarifas.sabado': formData.tarifas.sabado,
      'tarifas.domingo': formData.tarifas.domingo,
      'tarifas.feriados': formData.tarifas.feriados
    };

    if (!validateForm(flatFormData)) return;

    const datosCompletos = {
      ...formData,
      tarifaBase: parseFloat(formData.tarifaBase),
      tarifas: {
        diurno: parseFloat(formData.tarifas.diurno),
        tarde: parseFloat(formData.tarifas.tarde),
        noche: parseFloat(formData.tarifas.noche),
        sabado: parseFloat(formData.tarifas.sabado),
        domingo: parseFloat(formData.tarifas.domingo),
        feriados: parseFloat(formData.tarifas.feriados)
      }
    };

    onSubmit(datosCompletos);
  };

  return (
    <BaseForm
      id={id}
      onSubmit={handleSubmit}
      isMobile={isMobile}
    >
      {/* Nombre de la empresa */}
      <FormSection>
        <FormLabel icon={Briefcase}>Nombre de la empresa *</FormLabel>
        <ThemeInput
          type="text"
          value={formData.nombre}
          onChange={(e) => handleInputChange('nombre', e.target.value)}
          className={`
            w-full border rounded-lg transition-colors
            ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
            ${errors.nombre ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="Ej: Tech Company Inc."
          required
        />
        <FormError error={errors.nombre} size="sm" />
      </FormSection>

      {/* Color */}
      <FormSection>
        <FormLabel icon={Palette}>Color del trabajo</FormLabel>
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
            <span className="text-sm text-gray-500">o elige un color personalizado</span>
          </div>
        </div>
      </FormSection>

      {/* Tarifa base */}
      <FormSection>
        <FormLabel icon={DollarSign}>Tarifa base por hora *</FormLabel>
        <ThemeInput
          type="number"
          value={formData.tarifaBase}
          onChange={(e) => handleInputChange('tarifaBase', e.target.value)}
          className={`
            w-full border rounded-lg transition-colors
            ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
            ${errors.tarifaBase ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="15.00"
          step="0.01"
          min="0"
          required
        />
        <FormError error={errors.tarifaBase} size="sm" />
      </FormSection>

      {/* Tarifas específicas */}
      <FormSection>
        <FormLabel icon={Clock}>
          Tarifas por tipo de turno *
        </FormLabel>
        <FormGrid columns={2}>
          {Object.entries({
            diurno: 'Diurno',
            tarde: 'Tarde',
            noche: 'Nocturno',
            sabado: 'Sábado',
            domingo: 'Domingo',
            feriados: 'Feriados'
          }).map(([tipo, label]) => (
            <div key={tipo}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <ThemeInput
                type="number"
                value={formData.tarifas[tipo]}
                onChange={(e) => handleTarifaChange(tipo, e.target.value)}
                className={`
                  w-full border rounded-lg transition-colors
                  ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
                  ${errors[`tarifas.${tipo}`] ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              {errors[`tarifas.${tipo}`] && (
                <p className="mt-1 text-xs text-red-600">{errors[`tarifas.${tipo}`]}</p>
              )}
            </div>
          ))}
        </FormGrid>
      </FormSection>

      {/* Descripción */}
      <FormSection>
        <FormLabel icon={FileText}>Descripción (opcional)</FormLabel>
        <textarea
          value={formData.descripcion}
          onChange={(e) => handleInputChange('descripcion', e.target.value)}
          placeholder="Detalles adicionales sobre este trabajo..."
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

export default TrabajoForm;