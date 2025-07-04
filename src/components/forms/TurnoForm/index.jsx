// src/components/forms/TurnoForm/index.jsx

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Briefcase } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import ThemeInput from '../../ui/ThemeInput';
import Button from '../../ui/Button';

const TurnoForm = ({ 
  turno, 
  trabajoId, 
  trabajos, 
  onSubmit, 
  onCancel, 
  onTrabajoChange,
  thematicColors,
  isMobile,
  loading 
}) => {
  const { thematicColors: contextColors } = useApp();
  const coloresTemáticos = thematicColors || contextColors;
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    trabajoSeleccionado: trabajoId || '',
    notas: ''
  });
  
  const [error, setError] = useState('');

  // Filtrar trabajos tradicionales (no delivery)
  const trabajosTradicionales = trabajos.filter(t => t.type !== 'delivery');

  // Cargar datos si es edición
  useEffect(() => {
    if (turno) {
      setFormData({
        fecha: turno.fecha || '',
        horaInicio: turno.horaInicio || '',
        horaFin: turno.horaFin || '',
        trabajoSeleccionado: turno.trabajoId || '',
        notas: turno.notas || ''
      });
    }
  }, [turno]);

  // Actualizar trabajo seleccionado si cambia el prop
  useEffect(() => {
    if (trabajoId && trabajoId !== formData.trabajoSeleccionado) {
      setFormData(prev => ({
        ...prev,
        trabajoSeleccionado: trabajoId
      }));
    }
  }, [trabajoId, formData.trabajoSeleccionado]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // Limpiar error al cambiar datos
  };

  const handleTrabajoChange = (e) => {
    const nuevoTrabajoId = e.target.value;
    handleInputChange('trabajoSeleccionado', nuevoTrabajoId);
    
    // Notificar al modal si el trabajo seleccionado es de delivery
    if (onTrabajoChange) {
      onTrabajoChange(nuevoTrabajoId);
    }
  };

  const validarFormulario = () => {
    if (!formData.fecha) {
      setError('La fecha es requerida');
      return false;
    }
    if (!formData.horaInicio || !formData.horaFin) {
      setError('Las horas de inicio y fin son requeridas');
      return false;
    }
    if (!formData.trabajoSeleccionado) {
      setError('Debes seleccionar un trabajo');
      return false;
    }
    
    // Validar que la hora de fin sea mayor que la de inicio
    const [horaI, minI] = formData.horaInicio.split(':').map(Number);
    const [horaF, minF] = formData.horaFin.split(':').map(Number);
    const minutosInicio = horaI * 60 + minI;
    const minutosFin = horaF * 60 + minF;
    
    if (minutosFin <= minutosInicio) {
      setError('La hora de fin debe ser posterior a la hora de inicio');
      return false;
    }
    
    return true;
  };

  const calcularHoras = () => {
    if (!formData.horaInicio || !formData.horaFin) return 0;
    
    const [horaI, minI] = formData.horaInicio.split(':').map(Number);
    const [horaF, minF] = formData.horaFin.split(':').map(Number);
    const minutosInicio = horaI * 60 + minI;
    let minutosFin = horaF * 60 + minF;
    
    // Si el turno cruza medianoche
    if (minutosFin <= minutosInicio) {
      minutosFin += 24 * 60;
    }
    
    return ((minutosFin - minutosInicio) / 60).toFixed(1);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    const datosTurno = {
      fecha: formData.fecha,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      trabajoId: formData.trabajoSeleccionado,
      notas: formData.notas.trim()
    };

    await onSubmit(datosTurno);
  };

  const trabajoSeleccionadoInfo = trabajosTradicionales.find(t => t.id === formData.trabajoSeleccionado);
  const horasTrabajadas = calcularHoras();

  return (
    <form 
      onSubmit={manejarSubmit} 
      className={`space-y-6 ${isMobile ? 'mobile-form' : ''}`}
    >
      {/* Selector de trabajo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Briefcase size={16} className="inline mr-2" />
          Trabajo *
        </label>
        <select
          value={formData.trabajoSeleccionado}
          onChange={handleTrabajoChange}
          className={`
            w-full border rounded-lg transition-colors
            ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
            ${error && !formData.trabajoSeleccionado ? 'border-red-500' : 'border-gray-300'}
          `}
          style={{ 
            '--tw-ring-color': coloresTemáticos?.base || '#EC4899',
          }}
          required
          disabled={turno || loading} // No permitir cambiar trabajo en edición
        >
          <option value="">Seleccionar trabajo</option>
          {trabajosTradicionales.map(trabajo => (
            <option key={trabajo.id} value={trabajo.id}>
              {trabajo.nombre}
            </option>
          ))}
        </select>
        {trabajosTradicionales.length === 0 && (
          <p className="text-sm text-gray-500 mt-1">
            No hay trabajos registrados. Crea uno primero.
          </p>
        )}
      </div>

      {/* Fecha */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar size={16} className="inline mr-2" />
          Fecha *
        </label>
        <ThemeInput
          type="date"
          value={formData.fecha}
          onChange={(e) => handleInputChange('fecha', e.target.value)}
          className={`
            w-full border rounded-lg transition-colors
            ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
          `}
          required
          themeColor={coloresTemáticos?.base}
        />
      </div>

      {/* Horario */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'}`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock size={16} className="inline mr-2" />
            Hora inicio *
          </label>
          <ThemeInput
            type="time"
            value={formData.horaInicio}
            onChange={(e) => handleInputChange('horaInicio', e.target.value)}
            className={`
              w-full border rounded-lg transition-colors
              ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
            `}
            required
            themeColor={coloresTemáticos?.base}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock size={16} className="inline mr-2" />
            Hora fin *
          </label>
          <ThemeInput
            type="time"
            value={formData.horaFin}
            onChange={(e) => handleInputChange('horaFin', e.target.value)}
            className={`
              w-full border rounded-lg transition-colors
              ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
            `}
            required
            themeColor={coloresTemáticos?.base}
          />
        </div>
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas (opcional)
        </label>
        <textarea
          value={formData.notas}
          onChange={(e) => handleInputChange('notas', e.target.value)}
          placeholder="Agregar notas sobre el turno..."
          rows={isMobile ? 4 : 3}
          className={`
            w-full border border-gray-300 rounded-lg transition-colors resize-none
            ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
          `}
          style={{
            '--tw-ring-color': coloresTemáticos?.base || '#EC4899'
          }}
        />
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Botones */}
      <div className={`flex pt-4 ${isMobile ? 'flex-col space-y-3' : 'gap-3'}`}>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className={isMobile ? 'w-full py-3' : 'flex-1'}
          disabled={loading}
          themeColor={coloresTemáticos?.base}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className={isMobile ? 'w-full py-3' : 'flex-1'}
          loading={loading}
          themeColor={coloresTemáticos?.base}
        >
          {turno ? 'Guardar Cambios' : 'Crear Turno'}
        </Button>
      </div>

      {/* Vista previa del turno */}
      {formData.horaInicio && formData.horaFin && trabajoSeleccionadoInfo && (
        <div 
          className={`rounded-lg p-4 border-l-4 ${isMobile ? 'mt-4' : 'mt-2'}`}
          style={{ 
            borderLeftColor: trabajoSeleccionadoInfo.color || coloresTemáticos?.base || '#EC4899',
            backgroundColor: `${trabajoSeleccionadoInfo.color || coloresTemáticos?.base || '#EC4899'}10`
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: trabajoSeleccionadoInfo.color || coloresTemáticos?.base || '#EC4899' }}
              />
              <span className="text-sm font-medium text-gray-700">
                {trabajoSeleccionadoInfo.nombre}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Duración:</span>
              <span className="font-medium">{horasTrabajadas} horas</span>
            </div>
            {trabajoSeleccionadoInfo.tarifaBase && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Ganancia estimada:</span>
                <span style={{ color: trabajoSeleccionadoInfo.color || coloresTemáticos?.base || '#EC4899' }}>
                  ${(Number(horasTrabajadas) * trabajoSeleccionadoInfo.tarifaBase).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
};

export default TurnoForm;