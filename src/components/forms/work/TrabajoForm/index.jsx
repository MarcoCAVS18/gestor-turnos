// src/components/forms/work/TrabajoForm/index.jsx - REFACTORIZADO CON BaseForm

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Briefcase, DollarSign, Palette, FileText, Clock ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useFormValidation ***REMOVED*** from '../../../../hooks/useFormValidation';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';
import ***REMOVED*** VALIDATION_RULES ***REMOVED*** from '../../../../constants/validation';
import ***REMOVED*** PREDEFINED_COLORS ***REMOVED*** from '../../../../constants/colors';
import ThemeInput from '../../../ui/ThemeInput';
import BaseForm, ***REMOVED*** FormSection, FormLabel, FormError ***REMOVED*** from '../../base/BaseForm';

const TrabajoForm = (***REMOVED*** 
  id,
  trabajo, 
  onSubmit, 
  isMobile 
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  
  const [formData, setFormData] = useState(***REMOVED***
    nombre: '',
    descripcion: '',
    color: colors.primary,
    tarifaBase: '',
    tarifas: ***REMOVED***
      diurno: '',
      tarde: '',
      noche: '',
      sabado: '',
      domingo: '',
      feriados: ''
    ***REMOVED***
  ***REMOVED***);

  const validationRules = ***REMOVED***
    nombre: [VALIDATION_RULES.required, VALIDATION_RULES.minLength(2)],
    tarifaBase: [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.diurno': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.tarde': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.noche': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.sabado': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.domingo': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.feriados': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber]
  ***REMOVED***;

  const ***REMOVED*** errors, validateForm, handleFieldChange ***REMOVED*** = useFormValidation(validationRules);

  useEffect(() => ***REMOVED***
    if (trabajo) ***REMOVED***
      setFormData(***REMOVED***
        nombre: trabajo.nombre || '',
        descripcion: trabajo.descripcion || '',
        color: trabajo.color || colors.primary,
        tarifaBase: trabajo.tarifaBase?.toString() || '',
        tarifas: ***REMOVED***
          diurno: trabajo.tarifas?.diurno?.toString() || '',
          tarde: trabajo.tarifas?.tarde?.toString() || '',
          noche: trabajo.tarifas?.noche?.toString() || '',
          sabado: trabajo.tarifas?.sabado?.toString() || '',
          domingo: trabajo.tarifas?.domingo?.toString() || '',
          feriados: trabajo.tarifas?.feriados?.toString() || ''
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED*** else ***REMOVED***
      // Para nuevos trabajos, usar el color temático por defecto
      setFormData(prev => (***REMOVED***
        ...prev,
        color: colors.primary
      ***REMOVED***));
    ***REMOVED***
  ***REMOVED***, [trabajo, colors.primary]);

  const handleInputChange = (field, value) => ***REMOVED***
    setFormData(prev => (***REMOVED***
      ...prev,
      [field]: value
    ***REMOVED***));
    handleFieldChange(field, value);
  ***REMOVED***;

  const handleTarifaChange = (tipo, value) => ***REMOVED***
    setFormData(prev => (***REMOVED***
      ...prev,
      tarifas: ***REMOVED***
        ...prev.tarifas,
        [tipo]: value
      ***REMOVED***
    ***REMOVED***));
    handleFieldChange(`tarifas.$***REMOVED***tipo***REMOVED***`, value);
  ***REMOVED***;

  const handleSubmit = (e) => ***REMOVED***
    e.preventDefault();
    
    const flatFormData = ***REMOVED***
      ...formData,
      'tarifas.diurno': formData.tarifas.diurno,
      'tarifas.tarde': formData.tarifas.tarde,
      'tarifas.noche': formData.tarifas.noche,
      'tarifas.sabado': formData.tarifas.sabado,
      'tarifas.domingo': formData.tarifas.domingo,
      'tarifas.feriados': formData.tarifas.feriados
    ***REMOVED***;

    if (!validateForm(flatFormData)) return;

    const datosCompletos = ***REMOVED***
      ...formData,
      tarifaBase: parseFloat(formData.tarifaBase),
      tarifas: ***REMOVED***
        diurno: parseFloat(formData.tarifas.diurno),
        tarde: parseFloat(formData.tarifas.tarde),
        noche: parseFloat(formData.tarifas.noche),
        sabado: parseFloat(formData.tarifas.sabado),
        domingo: parseFloat(formData.tarifas.domingo),
        feriados: parseFloat(formData.tarifas.feriados)
      ***REMOVED***
    ***REMOVED***;

    onSubmit(datosCompletos);
  ***REMOVED***;

  return (
    <BaseForm
      id=***REMOVED***id***REMOVED***
      onSubmit=***REMOVED***handleSubmit***REMOVED***
      isMobile=***REMOVED***isMobile***REMOVED***
    >
      ***REMOVED***/* Nombre de la empresa */***REMOVED***
      <FormSection>
        <FormLabel icon=***REMOVED***Briefcase***REMOVED***>Nombre de la empresa *</FormLabel>
        <ThemeInput
          type="text"
          value=***REMOVED***formData.nombre***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('nombre', e.target.value)***REMOVED***
          className=***REMOVED***`
            w-full border rounded-lg transition-colors
            $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
            $***REMOVED***errors.nombre ? 'border-red-500' : 'border-gray-300'***REMOVED***
          `***REMOVED***
          placeholder="Ej: Tech Company Inc."
          required
        />
        <FormError error=***REMOVED***errors.nombre***REMOVED*** size="sm" />
      </FormSection>

      ***REMOVED***/* Color */***REMOVED***
      <FormSection>
        <FormLabel icon=***REMOVED***Palette***REMOVED***>Color del trabajo</FormLabel>
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
            <span className="text-sm text-gray-500">o elige un color personalizado</span>
          </div>
        </div>
      </FormSection>

      ***REMOVED***/* Tarifa base */***REMOVED***
      <FormSection>
        <FormLabel icon=***REMOVED***DollarSign***REMOVED***>Tarifa base por hora *</FormLabel>
        <ThemeInput
          type="number"
          value=***REMOVED***formData.tarifaBase***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('tarifaBase', e.target.value)***REMOVED***
          className=***REMOVED***`
            w-full border rounded-lg transition-colors
            $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
            $***REMOVED***errors.tarifaBase ? 'border-red-500' : 'border-gray-300'***REMOVED***
          `***REMOVED***
          placeholder="15.00"
          step="0.01"
          min="0"
          required
        />
        <FormError error=***REMOVED***errors.tarifaBase***REMOVED*** size="sm" />
      </FormSection>

      ***REMOVED***/* Tarifas específicas */***REMOVED***
      <FormSection>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
          <Clock className="mr-2 h-4 w-4" />
          Tarifas por tipo de turno *
        </label>
        <div className=***REMOVED***`grid $***REMOVED***isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'***REMOVED***`***REMOVED***>
          ***REMOVED***Object.entries(***REMOVED***
            diurno: 'Diurno',
            tarde: 'Tarde',
            noche: 'Nocturno',
            sabado: 'Sábado',
            domingo: 'Domingo',
            feriados: 'Feriados'
          ***REMOVED***).map(([tipo, label]) => (
            <div key=***REMOVED***tipo***REMOVED***>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ***REMOVED***label***REMOVED***
              </label>
              <ThemeInput
                type="number"
                value=***REMOVED***formData.tarifas[tipo]***REMOVED***
                onChange=***REMOVED***(e) => handleTarifaChange(tipo, e.target.value)***REMOVED***
                className=***REMOVED***`
                  w-full border rounded-lg transition-colors
                  $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
                  $***REMOVED***errors[`tarifas.$***REMOVED***tipo***REMOVED***`] ? 'border-red-500' : 'border-gray-300'***REMOVED***
                `***REMOVED***
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              ***REMOVED***errors[`tarifas.$***REMOVED***tipo***REMOVED***`] && (
                <p className="mt-1 text-xs text-red-600">***REMOVED***errors[`tarifas.$***REMOVED***tipo***REMOVED***`]***REMOVED***</p>
              )***REMOVED***
            </div>
          ))***REMOVED***
        </div>
      </FormSection>

      ***REMOVED***/* Descripción */***REMOVED***
      <FormSection>
        <FormLabel icon=***REMOVED***FileText***REMOVED***>Descripción (opcional)</FormLabel>
        <textarea
          value=***REMOVED***formData.descripcion***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('descripcion', e.target.value)***REMOVED***
          placeholder="Detalles adicionales sobre este trabajo..."
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

export default TrabajoForm;