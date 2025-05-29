import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Calendar, Clock, FileText ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useFormValidation ***REMOVED*** from '../../../hooks/useFormValidation';
import ***REMOVED*** VALIDATION_RULES ***REMOVED*** from '../../../constants/validation';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

const TurnoForm = (***REMOVED*** turno, fechaInicial, onSubmit, onCancel, loading ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** trabajos ***REMOVED*** = useApp();
  
  const [formData, setFormData] = useState(***REMOVED***
    trabajoId: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    notas: ''
  ***REMOVED***);

  const validationRules = ***REMOVED***
    trabajoId: [VALIDATION_RULES.required],
    fecha: [VALIDATION_RULES.required, VALIDATION_RULES.dateFormat],
    horaInicio: [VALIDATION_RULES.required, VALIDATION_RULES.timeFormat],
    horaFin: [VALIDATION_RULES.required, VALIDATION_RULES.timeFormat]
  ***REMOVED***;

  const ***REMOVED*** errors, validateForm, handleFieldChange ***REMOVED*** = useFormValidation(validationRules);

  useEffect(() => ***REMOVED***
    if (turno) ***REMOVED***
      setFormData(***REMOVED***
        trabajoId: turno.trabajoId || '',
        fecha: turno.fecha || '',
        horaInicio: turno.horaInicio || '',
        horaFin: turno.horaFin || '',
        notas: turno.notas || ''
      ***REMOVED***);
    ***REMOVED*** else ***REMOVED***
      setFormData(***REMOVED***
        trabajoId: '',
        fecha: fechaInicial || '',
        horaInicio: '',
        horaFin: '',
        notas: ''
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***, [turno, fechaInicial]);

  const handleInputChange = (field, value) => ***REMOVED***
    setFormData(prev => (***REMOVED***
      ...prev,
      [field]: value
    ***REMOVED***));
    handleFieldChange(field, value);
  ***REMOVED***;

  const handleSubmit = (e) => ***REMOVED***
    e.preventDefault();
    
    if (!validateForm(formData)) return;

    // Validación adicional de horarios
    const [horaIni, minIni] = formData.horaInicio.split(':').map(Number);
    const [horaFin, minFin] = formData.horaFin.split(':').map(Number);
    
    const inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFin * 60 + minFin;
    
    if (finMinutos <= inicioMinutos) ***REMOVED***
      if (finMinutos === inicioMinutos) ***REMOVED***
        // Error: horas iguales
        return;
      ***REMOVED***
      // OK: turno nocturno que cruza medianoche
    ***REMOVED***
    
    onSubmit(formData);
  ***REMOVED***;

  return (
    <form onSubmit=***REMOVED***handleSubmit***REMOVED*** className="space-y-6">
      ***REMOVED***/* Selección de trabajo */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trabajo *
        </label>
        <select
          value=***REMOVED***formData.trabajoId***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('trabajoId', e.target.value)***REMOVED***
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors"
          required
        >
          <option value="">Selecciona un trabajo</option>
          ***REMOVED***trabajos.map(trabajo => (
            <option key=***REMOVED***trabajo.id***REMOVED*** value=***REMOVED***trabajo.id***REMOVED***>
              ***REMOVED***trabajo.nombre***REMOVED***
            </option>
          ))***REMOVED***
        </select>
        ***REMOVED***errors.trabajoId && (
          <p className="mt-1 text-sm text-red-600">***REMOVED***errors.trabajoId***REMOVED***</p>
        )***REMOVED***
      </div>

      ***REMOVED***/* Fecha */***REMOVED***
      <Input
        label="Fecha"
        icon=***REMOVED***Calendar***REMOVED***
        type="date"
        value=***REMOVED***formData.fecha***REMOVED***
        onChange=***REMOVED***(e) => handleInputChange('fecha', e.target.value)***REMOVED***
        error=***REMOVED***errors.fecha***REMOVED***
        required
      />

      ***REMOVED***/* Horarios */***REMOVED***
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Hora Inicio"
          icon=***REMOVED***Clock***REMOVED***
          type="time"
          value=***REMOVED***formData.horaInicio***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('horaInicio', e.target.value)***REMOVED***
          error=***REMOVED***errors.horaInicio***REMOVED***
          required
        />

        <Input
          label="Hora Fin"
          icon=***REMOVED***Clock***REMOVED***
          type="time"
          value=***REMOVED***formData.horaFin***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('horaFin', e.target.value)***REMOVED***
          error=***REMOVED***errors.horaFin***REMOVED***
          required
        />
      </div>

      ***REMOVED***/* Notas */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText size=***REMOVED***16***REMOVED*** className="inline mr-2" />
          Notas (opcional)
        </label>
        <textarea
          value=***REMOVED***formData.notas***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('notas', e.target.value)***REMOVED***
          placeholder="Agrega notas adicionales sobre este turno..."
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
          ***REMOVED***turno ? 'Guardar Cambios' : 'Crear Turno'***REMOVED***
        </Button>
      </div>
    </form>
  );
***REMOVED***;

export default TurnoForm;
