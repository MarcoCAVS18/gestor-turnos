// src/components/forms/TurnoForm.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Briefcase } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';

const TurnoForm = ({ turno, trabajoId, onSubmit, onCancel, onTrabajoChange }) => {
  const { trabajos, coloresTemáticos } = useApp();
  
  // Estados del formulario
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(trabajoId || '');
  const [notas, setNotas] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos si es edición
  useEffect(() => {
    if (turno) {
      setFecha(turno.fecha || '');
      setHoraInicio(turno.horaInicio || '');
      setHoraFin(turno.horaFin || '');
      setTrabajoSeleccionado(turno.trabajoId || '');
      setNotas(turno.notas || '');
    }
  }, [turno]);

  // Actualizar trabajo seleccionado si cambia el prop
  useEffect(() => {
    if (trabajoId && trabajoId !== trabajoSeleccionado) {
      setTrabajoSeleccionado(trabajoId);
    }
  }, [trabajoId, trabajoSeleccionado]);

  const handleTrabajoChange = (e) => {
    const nuevoTrabajoId = e.target.value;
    setTrabajoSeleccionado(nuevoTrabajoId);
    
    // Notificar al modal si el trabajo seleccionado es de delivery
    if (onTrabajoChange) {
      onTrabajoChange(nuevoTrabajoId);
    }
  };

  const validarFormulario = () => {
    if (!fecha) {
      setError('La fecha es requerida');
      return false;
    }
    if (!horaInicio || !horaFin) {
      setError('Las horas de inicio y fin son requeridas');
      return false;
    }
    if (!trabajoSeleccionado) {
      setError('Debes seleccionar un trabajo');
      return false;
    }
    
    // Validar que la hora de fin sea mayor que la de inicio
    const [horaI, minI] = horaInicio.split(':').map(Number);
    const [horaF, minF] = horaFin.split(':').map(Number);
    const minutosInicio = horaI * 60 + minI;
    const minutosFin = horaF * 60 + minF;
    
    if (minutosFin <= minutosInicio) {
      setError('La hora de fin debe ser posterior a la hora de inicio');
      return false;
    }
    
    return true;
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    setGuardando(true);
    setError('');

    try {
      const datosTurno = {
        fecha,
        horaInicio,
        horaFin,
        trabajoId: trabajoSeleccionado,
        notas: notas.trim()
      };

      await onSubmit(datosTurno);
    } catch (err) {
      setError(err.message || 'Error al guardar el turno');
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={manejarSubmit} className="space-y-4">
      {/* Selector de trabajo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Briefcase size={16} className="inline mr-1" />
          Trabajo
        </label>
        <select
          value={trabajoSeleccionado}
          onChange={handleTrabajoChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          style={{ 
            '--tw-ring-color': coloresTemáticos?.transparent20,
          }}
          required
          disabled={turno} // No permitir cambiar trabajo en edición
        >
          <option value="">Seleccionar trabajo</option>
          {trabajos.map(trabajo => (
            <option key={trabajo.id} value={trabajo.id}>
              {trabajo.nombre} {trabajo.tipo === 'delivery' && '(Delivery)'}
            </option>
          ))}
        </select>
        {trabajos.length === 0 && (
          <p className="text-sm text-gray-500 mt-1">
            No hay trabajos registrados. Crea uno primero.
          </p>
        )}
      </div>

      {/* Fecha */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Calendar size={16} className="inline mr-1" />
          Fecha
        </label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          style={{ 
            '--tw-ring-color': coloresTemáticos?.transparent20,
          }}
          required
        />
      </div>

      {/* Horario */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock size={16} className="inline mr-1" />
            Hora inicio
          </label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            style={{ 
              '--tw-ring-color': coloresTemáticos?.transparent20,
            }}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock size={16} className="inline mr-1" />
            Hora fin
          </label>
          <input
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            style={{ 
              '--tw-ring-color': coloresTemáticos?.transparent20,
            }}
            required
          />
        </div>
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas (opcional)
        </label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          style={{ 
            '--tw-ring-color': coloresTemáticos?.transparent20,
          }}
          rows="2"
          placeholder="Agregar notas sobre el turno..."
        />
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={guardando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={guardando}
          className="flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
          style={{ 
            backgroundColor: guardando ? '#9CA3AF' : coloresTemáticos?.base,
          }}
          onMouseEnter={(e) => {
            if (!guardando) e.target.style.backgroundColor = coloresTemáticos?.dark;
          }}
          onMouseLeave={(e) => {
            if (!guardando) e.target.style.backgroundColor = coloresTemáticos?.base;
          }}
        >
          {guardando ? 'Guardando...' : (turno ? 'Guardar Cambios' : 'Crear Turno')}
        </button>
      </div>
    </form>
  );
};

export default TurnoForm;