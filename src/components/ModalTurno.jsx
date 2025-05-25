// src/components/ModalTurno.jsx 

import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, FileText } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import DynamicButton from './DynamicButton';

const ModalTurno = ({ visible, onClose, turnoSeleccionado, fechaInicial }) => {
  const { trabajos, agregarTurno, editarTurno, coloresTemáticos } = useApp();
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    trabajoId: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    notas: ''
  });
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Efecto para cargar datos del turno seleccionado o fecha inicial
  useEffect(() => {
    if (turnoSeleccionado) {
      // Editando turno existente
      setFormData({
        trabajoId: turnoSeleccionado.trabajoId || '',
        fecha: turnoSeleccionado.fecha || '',
        horaInicio: turnoSeleccionado.horaInicio || '',
        horaFin: turnoSeleccionado.horaFin || '',
        notas: turnoSeleccionado.notas || ''
      });
    } else {
      // Nuevo turno - usar fecha inicial si está disponible
      setFormData({
        trabajoId: '',
        fecha: fechaInicial || '',
        horaInicio: '',
        horaFin: '',
        notas: ''
      });
    }
    setError('');
  }, [turnoSeleccionado, fechaInicial, visible]);

  // Manejar cambios en inputs
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  // Validar formulario
  const validarFormulario = () => {
    if (!formData.trabajoId.trim()) {
      setError('Selecciona un trabajo');
      return false;
    }
    if (!formData.fecha) {
      setError('Selecciona una fecha');
      return false;
    }
    if (!formData.horaInicio) {
      setError('Ingresa la hora de inicio');
      return false;
    }
    if (!formData.horaFin) {
      setError('Ingresa la hora de fin');
      return false;
    }
    
    // Validar que la hora de fin sea después de la hora de inicio (considerando turnos nocturnos)
    const [horaIni, minIni] = formData.horaInicio.split(':').map(Number);
    const [horaFin, minFin] = formData.horaFin.split(':').map(Number);
    
    const inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFin * 60 + minFin;
    
    // Si el turno cruza medianoche, está bien
    if (finMinutos <= inicioMinutos) {
      // Solo validar que no sean exactamente iguales
      if (finMinutos === inicioMinutos) {
        setError('La hora de fin debe ser diferente a la hora de inicio');
        return false;
      }
    }
    
    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setCargando(true);
    setError('');
    
    try {
      if (turnoSeleccionado) {
        await editarTurno(turnoSeleccionado.id, formData);
      } else {
        await agregarTurno(formData);
      }
      
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el turno');
    } finally {
      setCargando(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-xl border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {turnoSeleccionado ? 'Editar Turno' : 'Nuevo Turno'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Selección de trabajo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trabajo *
            </label>
            <select
              value={formData.trabajoId}
              onChange={(e) => handleInputChange('trabajoId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors"
              style={{ 
                focusRingColor: coloresTemáticos?.base || '#EC4899',
                borderColor: formData.trabajoId ? coloresTemáticos?.base || '#EC4899' : undefined
              }}
              required
            >
              <option value="">Selecciona un trabajo</option>
              {trabajos.map(trabajo => (
                <option key={trabajo.id} value={trabajo.id}>
                  {trabajo.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-2" />
              Fecha *
            </label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => handleInputChange('fecha', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors"
              style={{ 
                focusRingColor: coloresTemáticos?.base || '#EC4899',
                borderColor: formData.fecha ? coloresTemáticos?.base || '#EC4899' : undefined
              }}
              required
            />
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                Hora Inicio *
              </label>
              <input
                type="time"
                value={formData.horaInicio}
                onChange={(e) => handleInputChange('horaInicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors"
                style={{ 
                  focusRingColor: coloresTemáticos?.base || '#EC4899',
                  borderColor: formData.horaInicio ? coloresTemáticos?.base || '#EC4899' : undefined
                }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                Hora Fin *
              </label>
              <input
                type="time"
                value={formData.horaFin}
                onChange={(e) => handleInputChange('horaFin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors"
                style={{ 
                  focusRingColor: coloresTemáticos?.base || '#EC4899',
                  borderColor: formData.horaFin ? coloresTemáticos?.base || '#EC4899' : undefined
                }}
                required
              />
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-2" />
              Notas (opcional)
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => handleInputChange('notas', e.target.value)}
              placeholder="Agrega notas adicionales sobre este turno..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors resize-none"
              style={{ 
                focusRingColor: coloresTemáticos?.base || '#EC4899',
                borderColor: formData.notas ? coloresTemáticos?.base || '#EC4899' : undefined
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <DynamicButton
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={cargando}
            >
              Cancelar
            </DynamicButton>
            <DynamicButton
              type="submit"
              className="flex-1"
              disabled={cargando}
            >
              {cargando 
                ? (turnoSeleccionado ? 'Guardando...' : 'Creando...') 
                : (turnoSeleccionado ? 'Guardar Cambios' : 'Crear Turno')
              }
            </DynamicButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTurno;