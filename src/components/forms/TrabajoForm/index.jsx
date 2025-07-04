// src/components/forms/TrabajoForm/index.jsx

import React, { useState, useEffect } from 'react';
import { Briefcase, DollarSign, Palette, FileText } from 'lucide-react';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { VALIDATION_RULES } from '../../../constants/validation';
import { PREDEFINED_COLORS } from '../../../constants/colors';
import ThemeInput from '../../ui/ThemeInput';
import Button from '../../ui/Button';

const TrabajoForm = ({ 
  trabajo, 
  onSubmit, 
  onCancel, 
  loading, 
  thematicColors, 
  isMobile 
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    color: '#EC4899',
    tarifaBase: '',
    tarifas: {
      diurno: '',
      tarde: '',
      noche: '',
      sabado: '',
      domingo: ''
    }
  });

  const validationRules = {
    nombre: [VALIDATION_RULES.required, VALIDATION_RULES.minLength(2)],
    tarifaBase: [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.diurno': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.tarde': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.noche': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.sabado': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.domingo': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber]
  };

  const { errors, validateForm, handleFieldChange } = useFormValidation(validationRules);

  useEffect(() => {
    if (trabajo) {
      setFormData({
        nombre: trabajo.nombre || '',
        descripcion: trabajo.descripcion || '',
        color: trabajo.color || thematicColors?.base || '#EC4899',
        tarifaBase: trabajo.tarifaBase?.toString() || '',
        tarifas: {
          diurno: trabajo.tarifas?.diurno?.toString() || '',
          tarde: trabajo.tarifas?.tarde?.toString() || '',
          noche: trabajo.tarifas?.noche?.toString() || '',
          sabado: trabajo.tarifas?.sabado?.toString() || '',
          domingo: trabajo.tarifas?.domingo?.toString() || ''
        }
      });
    } else {
      // Para nuevos trabajos, usar el color temático por defecto
      setFormData(prev => ({
        ...prev,
        color: thematicColors?.base || '#EC4899'
      }));
    }
  }, [trabajo, thematicColors]);

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
      'tarifas.domingo': formData.tarifas.domingo
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
        domingo: parseFloat(formData.tarifas.domingo)
      }
    };

    onSubmit(datosCompletos);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`space-y-6 ${isMobile ? 'mobile-form' : ''}`}
    >
      {/* Nombre de la empresa */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Briefcase size={16} className="inline mr-2" />
          Nombre de la empresa *
        </label>
        <ThemeInput
          type="text"
          value={formData.nombre}
          onChange={(e) => handleInputChange('nombre', e.target.value)}
          className={`
            w-full border rounded-lg transition-colors
            ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
            ${errors.nombre ? 'border-red-500' : 'border-gray-300'}
          `}
          style={{
            '--tw-ring-color': thematicColors?.base || '#EC4899'
          }}
          placeholder="Ej: Tech Company Inc."
          required
          themeColor={thematicColors?.base}
        />
        {errors.nombre && (
          <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
        )}
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Palette size={16} className="inline mr-2" />
          Color del trabajo
        </label>
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
      </div>

      {/* Tarifa base */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign size={16} className="inline mr-2" />
          Tarifa base por hora *
        </label>
        <ThemeInput
          type="number"
          value={formData.tarifaBase}
          onChange={(e) => handleInputChange('tarifaBase', e.target.value)}
          className={`
            w-full border rounded-lg transition-colors
            ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
            ${errors.tarifaBase ? 'border-red-500' : 'border-gray-300'}
          `}
          style={{
            '--tw-ring-color': thematicColors?.base || '#EC4899'
          }}
          placeholder="15.00"
          step="0.01"
          min="0"
          required
          themeColor={thematicColors?.base}
        />
        {errors.tarifaBase && (
          <p className="mt-1 text-sm text-red-600">{errors.tarifaBase}</p>
        )}
      </div>

      {/* Tarifas específicas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tarifas por tipo de turno *
        </label>
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'}`}>
          {Object.entries({
            diurno: 'Diurno',
            tarde: 'Tarde', 
            noche: 'Nocturno',
            sabado: 'Sábado',
            domingo: 'Domingo'
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
                style={{
                  '--tw-ring-color': thematicColors?.base || '#EC4899'
                }}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                themeColor={thematicColors?.base}
              />
              {errors[`tarifas.${tipo}`] && (
                <p className="mt-1 text-xs text-red-600">{errors[`tarifas.${tipo}`]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText size={16} className="inline mr-2" />
          Descripción (opcional)
        </label>
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
            '--tw-ring-color': thematicColors?.base || '#EC4899'
          }}
        />
      </div>

      {/* Botones */}
      <div className={`flex pt-4 ${isMobile ? 'flex-col space-y-3' : 'gap-3'}`}>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className={isMobile ? 'w-full py-3' : 'flex-1'}
          disabled={loading}
          themeColor={thematicColors?.base}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className={isMobile ? 'w-full py-3' : 'flex-1'}
          loading={loading}
          themeColor={thematicColors?.base}
        >
          {trabajo ? 'Guardar Cambios' : 'Crear Trabajo'}
        </Button>
      </div>

      {/* Vista previa del color seleccionado */}
      {formData.color && (
        <div 
          className={`rounded-lg p-4 border-l-4 ${isMobile ? 'mt-4' : 'mt-2'}`}
          style={{ 
            borderLeftColor: formData.color,
            backgroundColor: `${formData.color}10`
          }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: formData.color }}
            />
            <span className="text-sm text-gray-700">
              Vista previa: {formData.nombre || 'Nuevo trabajo'} con este color
            </span>
          </div>
        </div>
      )}
    </form>
  );
};

export default TrabajoForm;