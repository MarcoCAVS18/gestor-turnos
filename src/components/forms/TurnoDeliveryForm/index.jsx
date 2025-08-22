// src/components/forms/TurnoDeliveryForm/index.jsx - REFACTORIZADO

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, Package, Car, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import ThemeInput from '../../ui/ThemeInput';
import Button from '../../ui/Button';

const TurnoDeliveryForm = ({ 
  turno, 
  trabajoId, 
  trabajos, 
  onSubmit, 
  onCancel, 
  onTrabajoChange,
  isMobile,
  loading,
  fechaInicial
}) => {
  const colors = useThemeColors();
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    trabajoSeleccionado: trabajoId || '',
    numeroPedidos: '',
    gananciaTotal: '',
    propinas: '',
    kilometros: '',
    gastoCombustible: '',
    notas: ''
  });
  
  const [error, setError] = useState('');

  // Mostrar TODOS los trabajos disponibles, no solo delivery
  const trabajosParaSelector = trabajos;

  // Detectar si el turno cruza medianoche
  const cruzaMedianoche = useMemo(() => {
    if (!formData.horaInicio || !formData.horaFin) return false;
    const [hInicio] = formData.horaInicio.split(':').map(Number);
    const [hFin] = formData.horaFin.split(':').map(Number);
    return hFin <= hInicio;
  }, [formData.horaInicio, formData.horaFin]);

  // Calcular fecha de fin automáticamente
  const fechaFin = useMemo(() => {
    if (!formData.fecha || !cruzaMedianoche) return formData.fecha;
    
    const fechaInicio = new Date(formData.fecha + 'T00:00:00');
    const fechaFinCalculada = new Date(fechaInicio);
    fechaFinCalculada.setDate(fechaFinCalculada.getDate() + 1);
    
    return fechaFinCalculada.toISOString().split('T')[0];
  }, [formData.fecha, cruzaMedianoche]);

  // Cargar datos si es edición
  useEffect(() => {
    if (turno) {
      setFormData({
        fecha: turno.fechaInicio || turno.fecha || '',
        horaInicio: turno.horaInicio || '',
        horaFin: turno.horaFin || '',
        trabajoSeleccionado: turno.trabajoId || '',
        numeroPedidos: turno.numeroPedidos?.toString() || '',
        gananciaTotal: turno.gananciaTotal?.toString() || '',
        propinas: turno.propinas?.toString() || '',
        kilometros: turno.kilometros?.toString() || '',
        gastoCombustible: turno.gastoCombustible?.toString() || '',
        notas: turno.notas || ''
      });
    } else if (fechaInicial) {
      let fechaStr;
      if (fechaInicial instanceof Date) {
        const year = fechaInicial.getFullYear();
        const month = String(fechaInicial.getMonth() + 1).padStart(2, '0');
        const day = String(fechaInicial.getDate()).padStart(2, '0');
        fechaStr = `${year}-${month}-${day}`;
      } else {
        fechaStr = fechaInicial;
      }
      
      setFormData(prev => ({
        ...prev,
        fecha: fechaStr
      }));
    }
  }, [turno, fechaInicial]);

  // Mantener el trabajoId cuando se pasa como prop
  useEffect(() => {
    if (trabajoId && trabajoId) {
      setFormData(prev => ({
        ...prev,
        trabajoSeleccionado: trabajoId
      }));
    }
  }, [trabajoId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleTrabajoChange = (e) => {
    const nuevoTrabajoId = e.target.value;
    handleInputChange('trabajoSeleccionado', nuevoTrabajoId);
    
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
    if (!formData.gananciaTotal || isNaN(Number(formData.gananciaTotal))) {
      setError('La ganancia total debe ser un número válido');
      return false;
    }
    
    return true;
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    // Crear datos del turno con fechas correctas
    const datosTurno = {
      fecha: formData.fecha,
      fechaInicio: formData.fecha,
      fechaFin: fechaFin,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      trabajoId: formData.trabajoSeleccionado,
      tipo: 'delivery',
      numeroPedidos: Number(formData.numeroPedidos) || 0,
      gananciaTotal: Number(formData.gananciaTotal) || 0,
      propinas: Number(formData.propinas) || 0,
      kilometros: Number(formData.kilometros) || 0,
      gastoCombustible: Number(formData.gastoCombustible) || 0,
      notas: formData.notas.trim(),
      cruzaMedianoche: cruzaMedianoche
    };

    await onSubmit(datosTurno);
  };

  // Determinar si mostrar advertencia
  const trabajoSeleccionadoInfo = trabajosParaSelector.find(t => t.id === formData.trabajoSeleccionado);
  const esTrabajoNoDelivery = trabajoSeleccionadoInfo && 
    trabajoSeleccionadoInfo.tipo !== 'delivery' && 
    trabajoSeleccionadoInfo.type !== 'delivery';

  return (
    <div className="modal-content">
      <form 
        onSubmit={manejarSubmit} 
        className={`space-y-4 ${isMobile ? 'mobile-form' : ''}`}
      >
        {/* Trabajo seleccionado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Package size={16} className="inline mr-2" />
            Trabajo *
          </label>
          <select
            value={formData.trabajoSeleccionado}
            onChange={handleTrabajoChange}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:border-transparent bg-white"
            style={{ 
              '--tw-ring-color': colors.primary,
            }}
            required
          >
            <option value="">Seleccionar trabajo</option>
            {trabajosParaSelector.map(trabajo => (
              <option key={trabajo.id} value={trabajo.id}>
                {trabajo.nombre}
                {trabajo.tipo === 'delivery' || trabajo.type === 'delivery' 
                  ? ' (Delivery)' 
                  : ''}
              </option>
            ))}
          </select>
          
          {/* Advertencia si se selecciona un trabajo no-delivery */}
          {esTrabajoNoDelivery && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Nota:</strong> Has seleccionado un trabajo tradicional. 
                Este turno se guardará como delivery con ganancias manuales.
              </p>
            </div>
          )}
          
          {trabajosParaSelector.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              No hay trabajos disponibles. Crea uno primero.
            </p>
          )}
        </div>

        {/* Fecha y horario*/}
        <div className="space-y-4">
          {/* Fecha - ancho limitado */}
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-2" />
              Fecha de inicio *
            </label>
            <ThemeInput
              type="date"
              value={formData.fecha}
              onChange={(e) => handleInputChange('fecha', e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          {/* Horarios - mismo ancho que los inputs de pedidos/kilómetros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                Hora inicio *
              </label>
              <ThemeInput
                type="time"
                value={formData.horaInicio}
                onChange={(e) => handleInputChange('horaInicio', e.target.value)}
                className="w-full"
                required
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
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Mostrar información del turno nocturno */}
          {cruzaMedianoche && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
              <AlertCircle size={16} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">Turno Nocturno Detectado</p>
                <p className="text-blue-700 mt-1">
                  Este turno finalizará el {" "}
                  {formData.fecha && (() => {
                    const fechaInicio = new Date(formData.fecha + 'T00:00:00');
                    const fechaFin = new Date(fechaInicio);
                    fechaFin.setDate(fechaFin.getDate() + 1);
                    return fechaFin.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric', 
                      month: 'long'
                    });
                  })()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Información de pedidos */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Información del turno</h3>
          
          {/* Grid limitado para inputs numéricos pequeños */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package size={16} className="inline mr-2" />
                Número de pedidos
              </label>
              <ThemeInput
                type="number"
                value={formData.numeroPedidos}
                onChange={(e) => handleInputChange('numeroPedidos', e.target.value)}
                className="w-full"
                placeholder="0"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Car size={16} className="inline mr-2" />
                Kilómetros recorridos
              </label>
              <ThemeInput
                type="number"
                value={formData.kilometros}
                onChange={(e) => handleInputChange('kilometros', e.target.value)}
                className="w-full"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Información financiera */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Ganancias *</h3>
          
          {/* Grid limitado para inputs de dinero */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign size={16} className="inline mr-2" />
                Ganancia total *
              </label>
              <ThemeInput
                type="number"
                value={formData.gananciaTotal}
                onChange={(e) => handleInputChange('gananciaTotal', e.target.value)}
                className="w-full"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp size={16} className="inline mr-2" />
                Propinas
              </label>
              <ThemeInput
                type="number"
                value={formData.propinas}
                onChange={(e) => handleInputChange('propinas', e.target.value)}
                className="w-full"
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>
          
          {/* Gasto combustible - ancho limitado */}
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gasto en combustible
            </label>
            <ThemeInput
              type="number"
              value={formData.gastoCombustible}
              onChange={(e) => handleInputChange('gastoCombustible', e.target.value)}
              className="w-full"
              placeholder="0.00"
              step="0.01"
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
            placeholder="ej: Día lluvioso, mucha demanda..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm transition-colors resize-none bg-white focus:outline-none focus:ring-2 focus:border-transparent"
            style={{
              '--tw-ring-color': colors.primary
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
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={loading}
            themeColor={colors.primary}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={loading}
            themeColor={colors.primary}
          >
            {turno ? 'Guardar Cambios' : 'Crear Turno'}
          </Button>
        </div>

        {/* Vista previa de ganancias */}
        {formData.gananciaTotal && (
          <div 
            className="rounded-lg p-4 border-l-4 mt-4"
            style={{ 
              borderLeftColor: colors.primary,
              backgroundColor: colors.transparent10
            }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Ganancia bruta:</span>
                <span className="font-medium">${formData.gananciaTotal}</span>
              </div>
              {formData.gastoCombustible && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Gasto combustible:</span>
                    <span className="text-red-600">-${formData.gastoCombustible}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium border-t pt-2">
                    <span>Ganancia neta:</span>
                    <span style={{ color: colors?.base || '#EC4899' }}>
                      ${(Number(formData.gananciaTotal) - Number(formData.gastoCombustible || 0)).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default TurnoDeliveryForm;