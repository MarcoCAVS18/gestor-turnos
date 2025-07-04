// src/components/forms/TurnoForm/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Calendar, Clock, Briefcase ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ThemeInput from '../../ui/ThemeInput';
import Button from '../../ui/Button';

const TurnoForm = (***REMOVED*** 
  turno, 
  trabajoId, 
  trabajos, 
  onSubmit, 
  onCancel, 
  onTrabajoChange,
  thematicColors,
  isMobile,
  loading 
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors: contextColors ***REMOVED*** = useApp();
  const coloresTemáticos = thematicColors || contextColors;
  
  // Estados del formulario
  const [formData, setFormData] = useState(***REMOVED***
    fecha: '',
    horaInicio: '',
    horaFin: '',
    trabajoSeleccionado: trabajoId || '',
    notas: ''
  ***REMOVED***);
  
  const [error, setError] = useState('');

  // Filtrar trabajos tradicionales (no delivery)
  const trabajosTradicionales = trabajos.filter(t => t.type !== 'delivery');

  // Cargar datos si es edición
  useEffect(() => ***REMOVED***
    if (turno) ***REMOVED***
      setFormData(***REMOVED***
        fecha: turno.fecha || '',
        horaInicio: turno.horaInicio || '',
        horaFin: turno.horaFin || '',
        trabajoSeleccionado: turno.trabajoId || '',
        notas: turno.notas || ''
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***, [turno]);

  // Actualizar trabajo seleccionado si cambia el prop
  useEffect(() => ***REMOVED***
    if (trabajoId && trabajoId !== formData.trabajoSeleccionado) ***REMOVED***
      setFormData(prev => (***REMOVED***
        ...prev,
        trabajoSeleccionado: trabajoId
      ***REMOVED***));
    ***REMOVED***
  ***REMOVED***, [trabajoId, formData.trabajoSeleccionado]);

  const handleInputChange = (field, value) => ***REMOVED***
    setFormData(prev => (***REMOVED***
      ...prev,
      [field]: value
    ***REMOVED***));
    setError(''); // Limpiar error al cambiar datos
  ***REMOVED***;

  const handleTrabajoChange = (e) => ***REMOVED***
    const nuevoTrabajoId = e.target.value;
    handleInputChange('trabajoSeleccionado', nuevoTrabajoId);
    
    // Notificar al modal si el trabajo seleccionado es de delivery
    if (onTrabajoChange) ***REMOVED***
      onTrabajoChange(nuevoTrabajoId);
    ***REMOVED***
  ***REMOVED***;

  const validarFormulario = () => ***REMOVED***
    if (!formData.fecha) ***REMOVED***
      setError('La fecha es requerida');
      return false;
    ***REMOVED***
    if (!formData.horaInicio || !formData.horaFin) ***REMOVED***
      setError('Las horas de inicio y fin son requeridas');
      return false;
    ***REMOVED***
    if (!formData.trabajoSeleccionado) ***REMOVED***
      setError('Debes seleccionar un trabajo');
      return false;
    ***REMOVED***
    
    // Validar que la hora de fin sea mayor que la de inicio
    const [horaI, minI] = formData.horaInicio.split(':').map(Number);
    const [horaF, minF] = formData.horaFin.split(':').map(Number);
    const minutosInicio = horaI * 60 + minI;
    const minutosFin = horaF * 60 + minF;
    
    if (minutosFin <= minutosInicio) ***REMOVED***
      setError('La hora de fin debe ser posterior a la hora de inicio');
      return false;
    ***REMOVED***
    
    return true;
  ***REMOVED***;

  const calcularHoras = () => ***REMOVED***
    if (!formData.horaInicio || !formData.horaFin) return 0;
    
    const [horaI, minI] = formData.horaInicio.split(':').map(Number);
    const [horaF, minF] = formData.horaFin.split(':').map(Number);
    const minutosInicio = horaI * 60 + minI;
    let minutosFin = horaF * 60 + minF;
    
    // Si el turno cruza medianoche
    if (minutosFin <= minutosInicio) ***REMOVED***
      minutosFin += 24 * 60;
    ***REMOVED***
    
    return ((minutosFin - minutosInicio) / 60).toFixed(1);
  ***REMOVED***;

  const manejarSubmit = async (e) => ***REMOVED***
    e.preventDefault();
    
    if (!validarFormulario()) return;

    const datosTurno = ***REMOVED***
      fecha: formData.fecha,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      trabajoId: formData.trabajoSeleccionado,
      notas: formData.notas.trim()
    ***REMOVED***;

    await onSubmit(datosTurno);
  ***REMOVED***;

  const trabajoSeleccionadoInfo = trabajosTradicionales.find(t => t.id === formData.trabajoSeleccionado);
  const horasTrabajadas = calcularHoras();

  return (
    <form 
      onSubmit=***REMOVED***manejarSubmit***REMOVED*** 
      className=***REMOVED***`space-y-6 $***REMOVED***isMobile ? 'mobile-form' : ''***REMOVED***`***REMOVED***
    >
      ***REMOVED***/* Selector de trabajo */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Briefcase size=***REMOVED***16***REMOVED*** className="inline mr-2" />
          Trabajo *
        </label>
        <select
          value=***REMOVED***formData.trabajoSeleccionado***REMOVED***
          onChange=***REMOVED***handleTrabajoChange***REMOVED***
          className=***REMOVED***`
            w-full border rounded-lg transition-colors
            $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
            $***REMOVED***error && !formData.trabajoSeleccionado ? 'border-red-500' : 'border-gray-300'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED*** 
            '--tw-ring-color': coloresTemáticos?.base || '#EC4899',
          ***REMOVED******REMOVED***
          required
          disabled=***REMOVED***turno || loading***REMOVED*** // No permitir cambiar trabajo en edición
        >
          <option value="">Seleccionar trabajo</option>
          ***REMOVED***trabajosTradicionales.map(trabajo => (
            <option key=***REMOVED***trabajo.id***REMOVED*** value=***REMOVED***trabajo.id***REMOVED***>
              ***REMOVED***trabajo.nombre***REMOVED***
            </option>
          ))***REMOVED***
        </select>
        ***REMOVED***trabajosTradicionales.length === 0 && (
          <p className="text-sm text-gray-500 mt-1">
            No hay trabajos registrados. Crea uno primero.
          </p>
        )***REMOVED***
      </div>

      ***REMOVED***/* Fecha */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar size=***REMOVED***16***REMOVED*** className="inline mr-2" />
          Fecha *
        </label>
        <ThemeInput
          type="date"
          value=***REMOVED***formData.fecha***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('fecha', e.target.value)***REMOVED***
          className=***REMOVED***`
            w-full border rounded-lg transition-colors
            $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
          `***REMOVED***
          required
          themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
        />
      </div>

      ***REMOVED***/* Horario */***REMOVED***
      <div className=***REMOVED***`grid $***REMOVED***isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'***REMOVED***`***REMOVED***>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock size=***REMOVED***16***REMOVED*** className="inline mr-2" />
            Hora inicio *
          </label>
          <ThemeInput
            type="time"
            value=***REMOVED***formData.horaInicio***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('horaInicio', e.target.value)***REMOVED***
            className=***REMOVED***`
              w-full border rounded-lg transition-colors
              $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
            `***REMOVED***
            required
            themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock size=***REMOVED***16***REMOVED*** className="inline mr-2" />
            Hora fin *
          </label>
          <ThemeInput
            type="time"
            value=***REMOVED***formData.horaFin***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('horaFin', e.target.value)***REMOVED***
            className=***REMOVED***`
              w-full border rounded-lg transition-colors
              $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
            `***REMOVED***
            required
            themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
          />
        </div>
      </div>

      ***REMOVED***/* Notas */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas (opcional)
        </label>
        <textarea
          value=***REMOVED***formData.notas***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('notas', e.target.value)***REMOVED***
          placeholder="Agregar notas sobre el turno..."
          rows=***REMOVED***isMobile ? 4 : 3***REMOVED***
          className=***REMOVED***`
            w-full border border-gray-300 rounded-lg transition-colors resize-none
            $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED***
            '--tw-ring-color': coloresTemáticos?.base || '#EC4899'
          ***REMOVED******REMOVED***
        />
      </div>

      ***REMOVED***/* Mensajes de error */***REMOVED***
      ***REMOVED***error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">***REMOVED***error***REMOVED***</p>
        </div>
      )***REMOVED***

      ***REMOVED***/* Botones */***REMOVED***
      <div className=***REMOVED***`flex pt-4 $***REMOVED***isMobile ? 'flex-col space-y-3' : 'gap-3'***REMOVED***`***REMOVED***>
        <Button
          type="button"
          onClick=***REMOVED***onCancel***REMOVED***
          variant="outline"
          className=***REMOVED***isMobile ? 'w-full py-3' : 'flex-1'***REMOVED***
          disabled=***REMOVED***loading***REMOVED***
          themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className=***REMOVED***isMobile ? 'w-full py-3' : 'flex-1'***REMOVED***
          loading=***REMOVED***loading***REMOVED***
          themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
        >
          ***REMOVED***turno ? 'Guardar Cambios' : 'Crear Turno'***REMOVED***
        </Button>
      </div>

      ***REMOVED***/* Vista previa del turno */***REMOVED***
      ***REMOVED***formData.horaInicio && formData.horaFin && trabajoSeleccionadoInfo && (
        <div 
          className=***REMOVED***`rounded-lg p-4 border-l-4 $***REMOVED***isMobile ? 'mt-4' : 'mt-2'***REMOVED***`***REMOVED***
          style=***REMOVED******REMOVED*** 
            borderLeftColor: trabajoSeleccionadoInfo.color || coloresTemáticos?.base || '#EC4899',
            backgroundColor: `$***REMOVED***trabajoSeleccionadoInfo.color || coloresTemáticos?.base || '#EC4899'***REMOVED***10`
          ***REMOVED******REMOVED***
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style=***REMOVED******REMOVED*** backgroundColor: trabajoSeleccionadoInfo.color || coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
              />
              <span className="text-sm font-medium text-gray-700">
                ***REMOVED***trabajoSeleccionadoInfo.nombre***REMOVED***
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Duración:</span>
              <span className="font-medium">***REMOVED***horasTrabajadas***REMOVED*** horas</span>
            </div>
            ***REMOVED***trabajoSeleccionadoInfo.tarifaBase && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Ganancia estimada:</span>
                <span style=***REMOVED******REMOVED*** color: trabajoSeleccionadoInfo.color || coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***>
                  $***REMOVED***(Number(horasTrabajadas) * trabajoSeleccionadoInfo.tarifaBase).toFixed(2)***REMOVED***
                </span>
              </div>
            )***REMOVED***
          </div>
        </div>
      )***REMOVED***
    </form>
  );
***REMOVED***;

export default TurnoForm;