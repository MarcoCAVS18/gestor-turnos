// src/components/forms/TurnoDeliveryForm/index.jsx - SIN detección automática de medianoche

import React, { useState, useEffect, useCallback } from 'react';
import { Truck, Calendar, Clock, DollarSign, Package, Navigation, Fuel, Heart } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';

const TurnoDeliveryForm = ({
  turno,
  trabajoId,
  trabajos = [],
  onSubmit,
  onCancel,
  onTrabajoChange,
  isMobile = false,
  loading = false,
  fechaInicial
}) => {
  const colors = useThemeColors();

  // Estados del formulario
  const [formData, setFormData] = useState({
    trabajoId: trabajoId || '',
    fechaInicio: '',
    horaInicio: '',
    horaFin: '',
    gananciaTotal: '',
    propinas: '',
    numeroPedidos: '',
    kilometros: '',
    gastoCombustible: '',
    observaciones: ''
  });

  const [errors, setErrors] = useState({});

  // Función para determinar si el vehículo necesita combustible
  const vehiculoNecesitaCombustible = useCallback((vehiculo) => {
    if (!vehiculo) return false;
    const vehiculoLower = vehiculo.toLowerCase();
    return vehiculoLower.includes('moto') || 
           vehiculoLower.includes('auto') || 
           vehiculoLower.includes('carro') ||
           vehiculoLower.includes('coche');
  }, []);

  // Obtener el trabajo seleccionado y verificar si necesita combustible
  const trabajoSeleccionado = trabajos.find(t => t.id === formData.trabajoId);
  const mostrarCombustible = trabajoSeleccionado ? vehiculoNecesitaCombustible(trabajoSeleccionado.vehiculo) : true;

  // Inicializar formulario
  useEffect(() => {
    if (turno) {
      setFormData({
        trabajoId: turno.trabajoId || '',
        fechaInicio: turno.fechaInicio || turno.fecha || '',
        horaInicio: turno.horaInicio || '',
        horaFin: turno.horaFin || '',
        gananciaTotal: turno.gananciaTotal?.toString() || '',
        propinas: turno.propinas?.toString() || '',
        numeroPedidos: turno.numeroPedidos?.toString() || '',
        kilometros: turno.kilometros?.toString() || '',
        gastoCombustible: turno.gastoCombustible?.toString() || '',
        observaciones: turno.observaciones || ''
      });
    } else if (fechaInicial) {
      const fechaStr = fechaInicial instanceof Date 
        ? fechaInicial.toISOString().split('T')[0] 
        : fechaInicial;
      setFormData(prev => ({ ...prev, fechaInicio: fechaStr }));
    }
  }, [turno, fechaInicial]);

  // Limpiar gastos de combustible cuando se selecciona un vehículo que no lo necesita
  useEffect(() => {
    if (!mostrarCombustible && formData.gastoCombustible) {
      setFormData(prev => ({ ...prev, gastoCombustible: '' }));
    }
  }, [mostrarCombustible, formData.gastoCombustible]);

  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.trabajoId) {
      newErrors.trabajoId = 'Selecciona un trabajo';
    }
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha es requerida';
    }
    if (!formData.horaInicio) {
      newErrors.horaInicio = 'La hora de inicio es requerida';
    }
    if (!formData.horaFin) {
      newErrors.horaFin = 'La hora de fin es requerida';
    }
    if (!formData.gananciaTotal || parseFloat(formData.gananciaTotal) <= 0) {
      newErrors.gananciaTotal = 'La ganancia total es requerida y debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      // Convertir strings a números y asegurar que combustible sea 0 si no aplica
      const dataToSubmit = {
        ...formData,
        gananciaTotal: parseFloat(formData.gananciaTotal) || 0,
        propinas: parseFloat(formData.propinas) || 0,
        numeroPedidos: parseInt(formData.numeroPedidos) || 0,
        kilometros: parseFloat(formData.kilometros) || 0,
        gastoCombustible: mostrarCombustible ? (parseFloat(formData.gastoCombustible) || 0) : 0
      };
      onSubmit(dataToSubmit);
    }
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Notificar cambio de trabajo al componente padre
    if (field === 'trabajoId') {
      onTrabajoChange?.(value);
    }
  }, [errors, onTrabajoChange]);

  const inputClasses = `
    w-full px-3 py-3 border rounded-lg text-base transition-colors
    focus:outline-none focus:ring-2 focus:border-transparent
    ${isMobile ? 'text-base min-h-[44px]' : 'text-sm py-2'}
  `;

  // Filtrar solo trabajos de delivery
  const trabajosDelivery = trabajos.filter(t => t.tipo === 'delivery');

  return (
    <div 
      className={`w-full ${isMobile ? 'mobile-form' : ''}`}
      style={{ 
        maxWidth: '100%',
        overflowX: 'hidden'
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        {/* Selección de trabajo de delivery */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Truck size={16} className="inline mr-2" />
            Trabajo de Delivery
          </label>
          <select
            value={formData.trabajoId}
            onChange={(e) => handleInputChange('trabajoId', e.target.value)}
            className={`${inputClasses} ${errors.trabajoId ? 'border-red-500' : 'border-gray-300'}`}
            style={{ '--tw-ring-color': colors.primary }}
            required
          >
            <option value="">Seleccionar trabajo</option>
            {trabajosDelivery.map(trabajo => (
              <option key={trabajo.id} value={trabajo.id}>
                {trabajo.nombre} {trabajo.vehiculo ? `(${trabajo.vehiculo})` : ''}
              </option>
            ))}
          </select>
          {errors.trabajoId && (
            <p className="text-red-500 text-xs mt-1">{errors.trabajoId}</p>
          )}
        </div>

        {/* Fecha de trabajo */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} className="inline mr-2" />
            Fecha del turno
          </label>
          <input
            type="date"
            value={formData.fechaInicio}
            onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
            className={`${inputClasses} ${errors.fechaInicio ? 'border-red-500' : 'border-gray-300'}`}
            style={{ '--tw-ring-color': colors.primary }}
            required
          />
          {errors.fechaInicio && (
            <p className="text-red-500 text-xs mt-1">{errors.fechaInicio}</p>
          )}
        </div>

        {/* CONTENEDOR DE HORAS RESPONSIVO */}
        <div className="w-full">
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <div className="w-full min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                Hora de inicio
              </label>
              <input
                type="time"
                value={formData.horaInicio}
                onChange={(e) => handleInputChange('horaInicio', e.target.value)}
                className={`${inputClasses} ${errors.horaInicio ? 'border-red-500' : 'border-gray-300'}`}
                style={{ '--tw-ring-color': colors.primary }}
                required
              />
              {errors.horaInicio && (
                <p className="text-red-500 text-xs mt-1">{errors.horaInicio}</p>
              )}
            </div>

            <div className="w-full min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                Hora de fin
              </label>
              <input
                type="time"
                value={formData.horaFin}
                onChange={(e) => handleInputChange('horaFin', e.target.value)}
                className={`${inputClasses} ${errors.horaFin ? 'border-red-500' : 'border-gray-300'}`}
                style={{ '--tw-ring-color': colors.primary }}
                required
              />
              {errors.horaFin && (
                <p className="text-red-500 text-xs mt-1">{errors.horaFin}</p>
              )}
            </div>
          </div>
        </div>

        {/* GANANCIAS RESPONSIVAS */}
        <div className="w-full">
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <div className="w-full min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign size={16} className="inline mr-2" />
                Ganancia total *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.gananciaTotal}
                onChange={(e) => handleInputChange('gananciaTotal', e.target.value)}
                className={`${inputClasses} ${errors.gananciaTotal ? 'border-red-500' : 'border-gray-300'}`}
                style={{ '--tw-ring-color': colors.primary }}
                placeholder="0.00"
                required
              />
              {errors.gananciaTotal && (
                <p className="text-red-500 text-xs mt-1">{errors.gananciaTotal}</p>
              )}
            </div>

            <div className="w-full min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Heart size={16} className="inline mr-2" />
                Propinas
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.propinas}
                onChange={(e) => handleInputChange('propinas', e.target.value)}
                className={`${inputClasses} border-gray-300`}
                style={{ '--tw-ring-color': colors.primary }}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* DATOS ADICIONALES RESPONSIVOS */}
        <div className="w-full">
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <div className="w-full min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package size={16} className="inline mr-2" />
                Número de pedidos
              </label>
              <input
                type="number"
                value={formData.numeroPedidos}
                onChange={(e) => handleInputChange('numeroPedidos', e.target.value)}
                className={`${inputClasses} border-gray-300`}
                style={{ '--tw-ring-color': colors.primary }}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="w-full min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Navigation size={16} className="inline mr-2" />
                Kilómetros recorridos
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.kilometros}
                onChange={(e) => handleInputChange('kilometros', e.target.value)}
                className={`${inputClasses} border-gray-300`}
                style={{ '--tw-ring-color': colors.primary }}
                placeholder="0.0"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Gastos de combustible - SOLO SI EL VEHÍCULO LO REQUIERE */}
        {mostrarCombustible && (
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Fuel size={16} className="inline mr-2" />
              Gastos de combustible
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.gastoCombustible}
              onChange={(e) => handleInputChange('gastoCombustible', e.target.value)}
              className={`${inputClasses} border-gray-300`}
              style={{ '--tw-ring-color': colors.primary }}
              placeholder="0.00"
              min="0"
            />
          </div>
        )}

        {/* Observaciones */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas (opcional)
          </label>
          <textarea
            value={formData.observaciones}
            onChange={(e) => handleInputChange('observaciones', e.target.value)}
            className={`${inputClasses} resize-none border-gray-300`}
            style={{ '--tw-ring-color': colors.primary }}
            rows={isMobile ? "3" : "2"}
            placeholder="Notas adicionales sobre el turno..."
          />
        </div>

        {/* BOTONES COMPLETAMENTE RESPONSIVOS */}
        <div className={`
          w-full pt-6 
          ${isMobile ? 'flex flex-col space-y-4 px-0' : 'flex space-x-3'}
        `}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={`
              border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 
              text-sm font-medium rounded-lg transition-colors disabled:opacity-50
              ${isMobile ? 'py-4 px-4 w-full order-2' : 'flex-1 py-2 px-4'}
            `}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`
              text-white rounded-lg hover:opacity-90 text-sm font-medium 
              disabled:opacity-50 transition-colors
              ${isMobile ? 'py-4 px-4 w-full order-1' : 'flex-1 py-2 px-4'}
            `}
            style={{ backgroundColor: colors.primary }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = colors.primaryDark;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = colors.primary;
              }
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Guardando...</span>
              </div>
            ) : (
              turno ? 'Actualizar Turno' : 'Crear Turno'
            )}
          </button>
        </div>
      </form>

      {/* ESTILOS ADICIONALES PARA MÓVIL */}
      {isMobile && (
        <style jsx>{`
          .mobile-form input[type="date"],
          .mobile-form input[type="time"],
          .mobile-form input[type="number"],
          .mobile-form select,
          .mobile-form textarea {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: none;
            font-size: 16px !important; /* Prevenir zoom en iOS */
          }
          
          .mobile-form input[type="time"]::-webkit-calendar-picker-indicator {
            background: transparent;
            bottom: 0;
            color: transparent;
            cursor: pointer;
            height: auto;
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
            width: auto;
          }
        `}</style>
      )}
    </div>
  );
};

export default TurnoDeliveryForm;