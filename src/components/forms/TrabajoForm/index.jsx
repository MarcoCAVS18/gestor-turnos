// src/components/forms/TrabajoForm/index.jsx (FORMULARIO SEPARADO)
import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Briefcase, DollarSign, Palette, FileText ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useFormValidation ***REMOVED*** from '../../../hooks/useFormValidation';
import ***REMOVED*** VALIDATION_RULES ***REMOVED*** from '../../../constants/validation';
import ***REMOVED*** PREDEFINED_COLORS ***REMOVED*** from '../../../constants/colors';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

const TrabajoForm = (***REMOVED*** trabajo, onSubmit, onCancel, loading ***REMOVED***) => ***REMOVED***
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
        color: trabajo.color || '#EC4899',
        tarifaBase: trabajo.tarifaBase?.toString() || '',
        tarifas: ***REMOVED***
          diurno: trabajo.tarifas?.diurno?.toString() || '',
          tarde: trabajo.tarifas?.tarde?.toString() || '',
          noche: trabajo.tarifas?.noche?.toString() || '',
          sabado: trabajo.tarifas?.sabado?.toString() || '',
          domingo: trabajo.tarifas?.domingo?.toString() || ''
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***, [trabajo]);

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
    <form onSubmit=***REMOVED***handleSubmit***REMOVED*** className="space-y-6">
      ***REMOVED***/* Nombre de la empresa */***REMOVED***
      <Input
        label="Nombre de la empresa"
        icon=***REMOVED***Briefcase***REMOVED***
        value=***REMOVED***formData.nombre***REMOVED***
        onChange=***REMOVED***(e) => handleInputChange('nombre', e.target.value)***REMOVED***
        placeholder="Ej: Tech Company Inc."
        error=***REMOVED***errors.nombre***REMOVED***
        required
      />

      ***REMOVED***/* Color */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Palette size=***REMOVED***16***REMOVED*** className="inline mr-2" />
          Color del trabajo
        </label>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            ***REMOVED***PREDEFINED_COLORS.map(color => (
              <button
                key=***REMOVED***color.value***REMOVED***
                type="button"
                onClick=***REMOVED***() => handleInputChange('color', color.value)***REMOVED***
                className=***REMOVED***`w-8 h-8 rounded-full border-2 transition-all $***REMOVED***
                  formData.color === color.value 
                    ? 'border-gray-800 scale-110' 
                    : 'border-gray-300'
                ***REMOVED***`***REMOVED***
                style=***REMOVED******REMOVED*** backgroundColor: color.value ***REMOVED******REMOVED***
                title=***REMOVED***color.name***REMOVED***
              />
            ))***REMOVED***
          </div>
          <input
            type="color"
            value=***REMOVED***formData.color***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('color', e.target.value)***REMOVED***
            className="w-16 h-8 border border-gray-300 rounded cursor-pointer"
          />
        </div>
      </div>

      ***REMOVED***/* Tarifa base */***REMOVED***
      <Input
        label="Tarifa base por hora"
        icon=***REMOVED***DollarSign***REMOVED***
        type="number"
        value=***REMOVED***formData.tarifaBase***REMOVED***
        onChange=***REMOVED***(e) => handleInputChange('tarifaBase', e.target.value)***REMOVED***
        placeholder="15.00"
        step="0.01"
        min="0"
        error=***REMOVED***errors.tarifaBase***REMOVED***
        required
      />

      ***REMOVED***/* Tarifas específicas */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tarifas por tipo de turno *
        </label>
        <div className="grid grid-cols-2 gap-4">
          ***REMOVED***Object.entries(***REMOVED***
            diurno: 'Diurno',
            tarde: 'Tarde', 
            noche: 'Nocturno',
            sabado: 'Sábado',
            domingo: 'Domingo'
          ***REMOVED***).map(([tipo, label]) => (
            <Input
              key=***REMOVED***tipo***REMOVED***
              label=***REMOVED***label***REMOVED***
              type="number"
              value=***REMOVED***formData.tarifas[tipo]***REMOVED***
              onChange=***REMOVED***(e) => handleTarifaChange(tipo, e.target.value)***REMOVED***
              placeholder="0.00"
              step="0.01"
              min="0"
              error=***REMOVED***errors[`tarifas.$***REMOVED***tipo***REMOVED***`]***REMOVED***
              required
            />
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
          rows=***REMOVED***3***REMOVED***
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors resize-none"
        />
      </div>

      ***REMOVED***/* Botones */***REMOVED***
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          onClick=***REMOVED***onCancel***REMOVED***
          variant="outline"
          className="flex-1"
          disabled=***REMOVED***loading***REMOVED***
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1"
          loading=***REMOVED***loading***REMOVED***
        >
          ***REMOVED***trabajo ? 'Guardar Cambios' : 'Crear Trabajo'***REMOVED***
        </Button>
      </div>
    </form>
  );
***REMOVED***;

export default TrabajoForm;