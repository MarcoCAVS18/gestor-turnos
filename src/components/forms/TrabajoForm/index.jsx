// src/components/forms/TrabajoForm/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Briefcase, DollarSign, Palette, FileText ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useFormValidation ***REMOVED*** from '../../../hooks/useFormValidation';
import ***REMOVED*** VALIDATION_RULES ***REMOVED*** from '../../../constants/validation';
import ***REMOVED*** PREDEFINED_COLORS ***REMOVED*** from '../../../constants/colors';
import ThemeInput from '../../ui/ThemeInput';
import Button from '../../ui/Button';

const TrabajoForm = (***REMOVED*** 
  trabajo, 
  onSubmit, 
  onCancel, 
  loading, 
  thematicColors, 
  isMobile 
***REMOVED***) => ***REMOVED***
  const [formData, setFormData] = useState(***REMOVED***
    nombre: '',
    descripcion: '',
    color: '#EC4899',
    tarifaBase: '',
    tarifas: ***REMOVED***
      diurno: '',
      tarde: '',
      noche: '',
      sabado: '',
      domingo: ''
    ***REMOVED***
  ***REMOVED***);

  const validationRules = ***REMOVED***
    nombre: [VALIDATION_RULES.required, VALIDATION_RULES.minLength(2)],
    tarifaBase: [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.diurno': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.tarde': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.noche': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.sabado': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber],
    'tarifas.domingo': [VALIDATION_RULES.required, VALIDATION_RULES.positiveNumber]
  ***REMOVED***;

  const ***REMOVED*** errors, validateForm, handleFieldChange ***REMOVED*** = useFormValidation(validationRules);

  useEffect(() => ***REMOVED***
    if (trabajo) ***REMOVED***
      setFormData(***REMOVED***
        nombre: trabajo.nombre || '',
        descripcion: trabajo.descripcion || '',
        color: trabajo.color || thematicColors?.base || '#EC4899',
        tarifaBase: trabajo.tarifaBase?.toString() || '',
        tarifas: ***REMOVED***
          diurno: trabajo.tarifas?.diurno?.toString() || '',
          tarde: trabajo.tarifas?.tarde?.toString() || '',
          noche: trabajo.tarifas?.noche?.toString() || '',
          sabado: trabajo.tarifas?.sabado?.toString() || '',
          domingo: trabajo.tarifas?.domingo?.toString() || ''
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED*** else ***REMOVED***
      // Para nuevos trabajos, usar el color temático por defecto
      setFormData(prev => (***REMOVED***
        ...prev,
        color: thematicColors?.base || '#EC4899'
      ***REMOVED***));
    ***REMOVED***
  ***REMOVED***, [trabajo, thematicColors]);

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
      'tarifas.domingo': formData.tarifas.domingo
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
        domingo: parseFloat(formData.tarifas.domingo)
      ***REMOVED***
    ***REMOVED***;

    onSubmit(datosCompletos);
  ***REMOVED***;

  return (
    <form 
      onSubmit=***REMOVED***handleSubmit***REMOVED*** 
      className=***REMOVED***`space-y-6 $***REMOVED***isMobile ? 'mobile-form' : ''***REMOVED***`***REMOVED***
    >
      ***REMOVED***/* Nombre de la empresa */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Briefcase size=***REMOVED***16***REMOVED*** className="inline mr-2" />
          Nombre de la empresa *
        </label>
        <ThemeInput
          type="text"
          value=***REMOVED***formData.nombre***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('nombre', e.target.value)***REMOVED***
          className=***REMOVED***`
            w-full border rounded-lg transition-colors
            $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
            $***REMOVED***errors.nombre ? 'border-red-500' : 'border-gray-300'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED***
            '--tw-ring-color': thematicColors?.base || '#EC4899'
          ***REMOVED******REMOVED***
          placeholder="Ej: Tech Company Inc."
          required
          themeColor=***REMOVED***thematicColors?.base***REMOVED***
        />
        ***REMOVED***errors.nombre && (
          <p className="mt-1 text-sm text-red-600">***REMOVED***errors.nombre***REMOVED***</p>
        )***REMOVED***
      </div>

      ***REMOVED***/* Color */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Palette size=***REMOVED***16***REMOVED*** className="inline mr-2" />
          Color del trabajo
        </label>
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
      </div>

      ***REMOVED***/* Tarifa base */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign size=***REMOVED***16***REMOVED*** className="inline mr-2" />
          Tarifa base por hora *
        </label>
        <ThemeInput
          type="number"
          value=***REMOVED***formData.tarifaBase***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('tarifaBase', e.target.value)***REMOVED***
          className=***REMOVED***`
            w-full border rounded-lg transition-colors
            $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
            $***REMOVED***errors.tarifaBase ? 'border-red-500' : 'border-gray-300'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED***
            '--tw-ring-color': thematicColors?.base || '#EC4899'
          ***REMOVED******REMOVED***
          placeholder="15.00"
          step="0.01"
          min="0"
          required
          themeColor=***REMOVED***thematicColors?.base***REMOVED***
        />
        ***REMOVED***errors.tarifaBase && (
          <p className="mt-1 text-sm text-red-600">***REMOVED***errors.tarifaBase***REMOVED***</p>
        )***REMOVED***
      </div>

      ***REMOVED***/* Tarifas específicas */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tarifas por tipo de turno *
        </label>
        <div className=***REMOVED***`grid $***REMOVED***isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'***REMOVED***`***REMOVED***>
          ***REMOVED***Object.entries(***REMOVED***
            diurno: 'Diurno',
            tarde: 'Tarde', 
            noche: 'Nocturno',
            sabado: 'Sábado',
            domingo: 'Domingo'
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
                style=***REMOVED******REMOVED***
                  '--tw-ring-color': thematicColors?.base || '#EC4899'
                ***REMOVED******REMOVED***
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                themeColor=***REMOVED***thematicColors?.base***REMOVED***
              />
              ***REMOVED***errors[`tarifas.$***REMOVED***tipo***REMOVED***`] && (
                <p className="mt-1 text-xs text-red-600">***REMOVED***errors[`tarifas.$***REMOVED***tipo***REMOVED***`]***REMOVED***</p>
              )***REMOVED***
            </div>
          ))***REMOVED***
        </div>
      </div>

      ***REMOVED***/* Descripción */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText size=***REMOVED***16***REMOVED*** className="inline mr-2" />
          Descripción (opcional)
        </label>
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
            '--tw-ring-color': thematicColors?.base || '#EC4899'
          ***REMOVED******REMOVED***
        />
      </div>

      ***REMOVED***/* Botones */***REMOVED***
      <div className=***REMOVED***`flex pt-4 $***REMOVED***isMobile ? 'flex-col space-y-3' : 'gap-3'***REMOVED***`***REMOVED***>
        <Button
          type="button"
          onClick=***REMOVED***onCancel***REMOVED***
          variant="outline"
          className=***REMOVED***isMobile ? 'w-full py-3' : 'flex-1'***REMOVED***
          disabled=***REMOVED***loading***REMOVED***
          themeColor=***REMOVED***thematicColors?.base***REMOVED***
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className=***REMOVED***isMobile ? 'w-full py-3' : 'flex-1'***REMOVED***
          loading=***REMOVED***loading***REMOVED***
          themeColor=***REMOVED***thematicColors?.base***REMOVED***
        >
          ***REMOVED***trabajo ? 'Guardar Cambios' : 'Crear Trabajo'***REMOVED***
        </Button>
      </div>

      ***REMOVED***/* Vista previa del color seleccionado */***REMOVED***
      ***REMOVED***formData.color && (
        <div 
          className=***REMOVED***`rounded-lg p-4 border-l-4 $***REMOVED***isMobile ? 'mt-4' : 'mt-2'***REMOVED***`***REMOVED***
          style=***REMOVED******REMOVED*** 
            borderLeftColor: formData.color,
            backgroundColor: `$***REMOVED***formData.color***REMOVED***10`
          ***REMOVED******REMOVED***
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full"
              style=***REMOVED******REMOVED*** backgroundColor: formData.color ***REMOVED******REMOVED***
            />
            <span className="text-sm text-gray-700">
              Vista previa: ***REMOVED***formData.nombre || 'Nuevo trabajo'***REMOVED*** con este color
            </span>
          </div>
        </div>
      )***REMOVED***
    </form>
  );
***REMOVED***;

export default TrabajoForm;