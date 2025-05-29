// src/components/forms/TrabajoForm/index.jsx (FORMULARIO SEPARADO)
import React, { useState, useEffect } from 'react';
import { Briefcase, DollarSign, Palette, FileText } from 'lucide-react';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { VALIDATION_RULES } from '../../../constants/validation';
import { PREDEFINED_COLORS } from '../../../constants/colors';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

const TrabajoForm = ({ trabajo, onSubmit, onCancel, loading }) => {
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
        color: trabajo.color || '#EC4899',
        tarifaBase: trabajo.tarifaBase?.toString() || '',
        tarifas: {
          diurno: trabajo.tarifas?.diurno?.toString() || '',
          tarde: trabajo.tarifas?.tarde?.toString() || '',
          noche: trabajo.tarifas?.noche?.toString() || '',
          sabado: trabajo.tarifas?.sabado?.toString() || '',
          domingo: trabajo.tarifas?.domingo?.toString() || ''
        }
      });
    }
  }, [trabajo]);

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre de la empresa */}
      <Input
        label="Nombre de la empresa"
        icon={Briefcase}
        value={formData.nombre}
        onChange={(e) => handleInputChange('nombre', e.target.value)}
        placeholder="Ej: Tech Company Inc."
        error={errors.nombre}
        required
      />

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Palette size={16} className="inline mr-2" />
          Color del trabajo
        </label>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_COLORS.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleInputChange('color', color.value)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  formData.color === color.value 
                    ? 'border-gray-800 scale-110' 
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
          <input
            type="color"
            value={formData.color}
            onChange={(e) => handleInputChange('color', e.target.value)}
            className="w-16 h-8 border border-gray-300 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Tarifa base */}
      <Input
        label="Tarifa base por hora"
        icon={DollarSign}
        type="number"
        value={formData.tarifaBase}
        onChange={(e) => handleInputChange('tarifaBase', e.target.value)}
        placeholder="15.00"
        step="0.01"
        min="0"
        error={errors.tarifaBase}
        required
      />

      {/* Tarifas específicas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tarifas por tipo de turno *
        </label>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries({
            diurno: 'Diurno',
            tarde: 'Tarde', 
            noche: 'Nocturno',
            sabado: 'Sábado',
            domingo: 'Domingo'
          }).map(([tipo, label]) => (
            <Input
              key={tipo}
              label={label}
              type="number"
              value={formData.tarifas[tipo]}
              onChange={(e) => handleTarifaChange(tipo, e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              error={errors[`tarifas.${tipo}`]}
              required
            />
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
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors resize-none"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1"
          loading={loading}
        >
          {trabajo ? 'Guardar Cambios' : 'Crear Trabajo'}
        </Button>
      </div>
    </form>
  );
};

export default TrabajoForm;