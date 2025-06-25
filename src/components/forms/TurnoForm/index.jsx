// src/components/forms/TurnoForm/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Calendar, Clock, Briefcase ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const TurnoForm = (***REMOVED*** turno, trabajoId, trabajos, onSubmit, onCancel, onTrabajoChange ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();
  
  // Estados del formulario
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(trabajoId || '');
  const [notas, setNotas] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos si es edición
  useEffect(() => ***REMOVED***
    if (turno) ***REMOVED***
      setFecha(turno.fecha || '');
      setHoraInicio(turno.horaInicio || '');
      setHoraFin(turno.horaFin || '');
      setTrabajoSeleccionado(turno.trabajoId || '');
      setNotas(turno.notas || '');
    ***REMOVED***
  ***REMOVED***, [turno]);

  // Actualizar trabajo seleccionado si cambia el prop
  useEffect(() => ***REMOVED***
    if (trabajoId && trabajoId !== trabajoSeleccionado) ***REMOVED***
      setTrabajoSeleccionado(trabajoId);
    ***REMOVED***
  ***REMOVED***, [trabajoId, trabajoSeleccionado]);

  const handleTrabajoChange = (e) => ***REMOVED***
    const nuevoTrabajoId = e.target.value;
    setTrabajoSeleccionado(nuevoTrabajoId);
    
    // Notificar al modal si el trabajo seleccionado es de delivery
    if (onTrabajoChange) ***REMOVED***
      onTrabajoChange(nuevoTrabajoId);
    ***REMOVED***
  ***REMOVED***;

  const validarFormulario = () => ***REMOVED***
    if (!fecha) ***REMOVED***
      setError('La fecha es requerida');
      return false;
    ***REMOVED***
    if (!horaInicio || !horaFin) ***REMOVED***
      setError('Las horas de inicio y fin son requeridas');
      return false;
    ***REMOVED***
    if (!trabajoSeleccionado) ***REMOVED***
      setError('Debes seleccionar un trabajo');
      return false;
    ***REMOVED***
    
    // Validar que la hora de fin sea mayor que la de inicio
    const [horaI, minI] = horaInicio.split(':').map(Number);
    const [horaF, minF] = horaFin.split(':').map(Number);
    const minutosInicio = horaI * 60 + minI;
    const minutosFin = horaF * 60 + minF;
    
    if (minutosFin <= minutosInicio) ***REMOVED***
      setError('La hora de fin debe ser posterior a la hora de inicio');
      return false;
    ***REMOVED***
    
    return true;
  ***REMOVED***;

  const manejarSubmit = async (e) => ***REMOVED***
    e.preventDefault();
    
    if (!validarFormulario()) return;

    setGuardando(true);
    setError('');

    try ***REMOVED***
      const datosTurno = ***REMOVED***
        fecha,
        horaInicio,
        horaFin,
        trabajoId: trabajoSeleccionado,
        notas: notas.trim()
      ***REMOVED***;

      await onSubmit(datosTurno);
    ***REMOVED*** catch (err) ***REMOVED***
      setError(err.message || 'Error al guardar el turno');
      setGuardando(false);
    ***REMOVED***
  ***REMOVED***;

  return (
    <form onSubmit=***REMOVED***manejarSubmit***REMOVED*** className="space-y-4">
      ***REMOVED***/* Selector de trabajo */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Briefcase size=***REMOVED***16***REMOVED*** className="inline mr-1" />
          Trabajo
        </label>
        <select
          value=***REMOVED***trabajoSeleccionado***REMOVED***
          onChange=***REMOVED***handleTrabajoChange***REMOVED***
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          style=***REMOVED******REMOVED*** 
            '--tw-ring-color': coloresTemáticos?.base || '#EC4899',
          ***REMOVED******REMOVED***
          required
          disabled=***REMOVED***turno***REMOVED*** // No permitir cambiar trabajo en edición
        >
          <option value="">Seleccionar trabajo</option>
          ***REMOVED***trabajos.map(trabajo => (
            <option key=***REMOVED***trabajo.id***REMOVED*** value=***REMOVED***trabajo.id***REMOVED***>
              ***REMOVED***trabajo.nombre***REMOVED*** ***REMOVED***trabajo.tipo === 'delivery' ? '(Delivery)' : ''***REMOVED***
            </option>
          ))***REMOVED***
        </select>
        ***REMOVED***trabajos.length === 0 && (
          <p className="text-sm text-gray-500 mt-1">
            No hay trabajos registrados. Crea uno primero.
          </p>
        )***REMOVED***
      </div>

      ***REMOVED***/* Fecha */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Calendar size=***REMOVED***16***REMOVED*** className="inline mr-1" />
          Fecha
        </label>
        <input
          type="date"
          value=***REMOVED***fecha***REMOVED***
          onChange=***REMOVED***(e) => setFecha(e.target.value)***REMOVED***
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          style=***REMOVED******REMOVED*** 
            '--tw-ring-color': coloresTemáticos?.base || '#EC4899',
          ***REMOVED******REMOVED***
          required
        />
      </div>

      ***REMOVED***/* Horario */***REMOVED***
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock size=***REMOVED***16***REMOVED*** className="inline mr-1" />
            Hora inicio
          </label>
          <input
            type="time"
            value=***REMOVED***horaInicio***REMOVED***
            onChange=***REMOVED***(e) => setHoraInicio(e.target.value)***REMOVED***
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            style=***REMOVED******REMOVED*** 
              '--tw-ring-color': coloresTemáticos?.base || '#EC4899',
            ***REMOVED******REMOVED***
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock size=***REMOVED***16***REMOVED*** className="inline mr-1" />
            Hora fin
          </label>
          <input
            type="time"
            value=***REMOVED***horaFin***REMOVED***
            onChange=***REMOVED***(e) => setHoraFin(e.target.value)***REMOVED***
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            style=***REMOVED******REMOVED*** 
              '--tw-ring-color': coloresTemáticos?.base || '#EC4899',
            ***REMOVED******REMOVED***
            required
          />
        </div>
      </div>

      ***REMOVED***/* Notas */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas (opcional)
        </label>
        <textarea
          value=***REMOVED***notas***REMOVED***
          onChange=***REMOVED***(e) => setNotas(e.target.value)***REMOVED***
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          style=***REMOVED******REMOVED*** 
            '--tw-ring-color': coloresTemáticos?.base || '#EC4899',
          ***REMOVED******REMOVED***
          rows="2"
          placeholder="Agregar notas sobre el turno..."
        />
      </div>

      ***REMOVED***/* Mensajes de error */***REMOVED***
      ***REMOVED***error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">***REMOVED***error***REMOVED***</p>
        </div>
      )***REMOVED***

      ***REMOVED***/* Botones */***REMOVED***
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick=***REMOVED***onCancel***REMOVED***
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled=***REMOVED***guardando***REMOVED***
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled=***REMOVED***guardando***REMOVED***
          className="flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
          style=***REMOVED******REMOVED*** 
            backgroundColor: guardando ? '#9CA3AF' : coloresTemáticos?.base || '#EC4899',
          ***REMOVED******REMOVED***
          onMouseEnter=***REMOVED***(e) => ***REMOVED***
            if (!guardando && coloresTemáticos?.dark) ***REMOVED***
              e.target.style.backgroundColor = coloresTemáticos.dark;
            ***REMOVED***
          ***REMOVED******REMOVED***
          onMouseLeave=***REMOVED***(e) => ***REMOVED***
            if (!guardando) ***REMOVED***
              e.target.style.backgroundColor = coloresTemáticos?.base || '#EC4899';
            ***REMOVED***
          ***REMOVED******REMOVED***
        >
          ***REMOVED***guardando ? 'Guardando...' : (turno ? 'Guardar Cambios' : 'Crear Turno')***REMOVED***
        </button>
      </div>
    </form>
  );
***REMOVED***;

export default TurnoForm;