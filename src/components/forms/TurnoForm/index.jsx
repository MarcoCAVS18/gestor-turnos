// src/components/forms/TurnoForm/index.jsx - COMPLETAMENTE RESPONSIVO

import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, Calendar, Clock, ToggleLeft, ToggleRight } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';

const TurnoForm = ({
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
    cruzaMedianoche: false,
    fechaFin: ''
  });

  const [errors, setErrors] = useState({});

  // Inicializar formulario
  useEffect(() => {
    if (turno) {
      setFormData({
        trabajoId: turno.trabajoId || '',
        fechaInicio: turno.fechaInicio || turno.fecha || '',
        horaInicio: turno.horaInicio || '',
        horaFin: turno.horaFin || '',
        cruzaMedianoche: turno.cruzaMedianoche || false,
        fechaFin: turno.fechaFin || ''
      });
    } else if (fechaInicial) {
      const fechaStr = fechaInicial instanceof Date 
        ? fechaInicial.toISOString().split('T')[0] 
        : fechaInicial;
      setFormData(prev => ({ ...prev, fechaInicio: fechaStr }));
    }
  }, [turno, fechaInicial]);

  // Detectar turnos nocturnos automáticamente
  useEffect(() => {
    if (formData.horaInicio && formData.horaFin) {
      const [horaI] = formData.horaInicio.split(':').map(Number);
      const [horaF] = formData.horaFin.split(':').map(Number);
      
      const esNocturno = horaI > horaF;
      
      if (esNocturno !== formData.cruzaMedianoche) {
        setFormData(prev => ({
          ...prev,
          cruzaMedianoche: esNocturno,
          fechaFin: esNocturno && prev.fechaInicio 
            ? calcularFechaFin(prev.fechaInicio)
            : ''
        }));
      }
    }
  }, [formData.horaInicio, formData.horaFin, formData.fechaInicio, formData.cruzaMedianoche]);

  const calcularFechaFin = (fechaInicio) => {
    const fecha = new Date(fechaInicio + 'T00:00:00');
    fecha.setDate(fecha.getDate() + 1);
    return fecha.toISOString().split('T')[0];
  };

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      onSubmit(formData);
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

  return (
    <div 
      className={`w-full ${isMobile ? 'mobile-form' : ''}`}
      style={{ 
        maxWidth: '100%',
        overflowX: 'hidden'
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        {/* Selección de trabajo */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Briefcase size={16} className="inline mr-2" />
            Trabajo
          </label>
          <select
            value={formData.trabajoId}
            onChange={(e) => handleInputChange('trabajoId', e.target.value)}
            className={`${inputClasses} ${errors.trabajoId ? 'border-red-500' : 'border-gray-300'}`}
            style={{ '--tw-ring-color': colors.primary }}
            required
          >
            <option value="">Seleccionar trabajo</option>
            {trabajos.filter(t => t.tipo !== 'delivery').map(trabajo => (
              <option key={trabajo.id} value={trabajo.id}>
                {trabajo.nombre}
              </option>
            ))}
          </select>
          {errors.trabajoId && (
            <p className="text-red-500 text-xs mt-1">{errors.trabajoId}</p>
          )}
        </div>

        {/* CONTENEDOR DE FECHAS RESPONSIVO */}
        <div className="w-full">
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {/* Fecha de inicio */}
            <div className="w-full min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Fecha de inicio
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

            {/* Fecha de fin - solo mostrar si es nocturno */}
            {formData.cruzaMedianoche && (
              <div className="w-full min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Fecha de fin
                </label>
                <input
                  type="date"
                  value={formData.fechaFin || calcularFechaFin(formData.fechaInicio)}
                  onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                  className={`${inputClasses} border-gray-300`}
                  style={{ '--tw-ring-color': colors.primary }}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se calcula automáticamente para turnos nocturnos
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CONTENEDOR DE HORAS RESPONSIVO */}
        <div className="w-full">
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {/* Hora de inicio */}
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

            {/* Hora de fin */}
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

        {/* Toggle para turno nocturno */}
        {(formData.horaInicio && formData.horaFin) && (
          <div className="w-full">
            <div 
              className="p-3 rounded-lg border"
              style={{ backgroundColor: colors.transparent5, borderColor: colors.transparent20 }}
            >
              <button
                type="button"
                onClick={() => handleInputChange('cruzaMedianoche', !formData.cruzaMedianoche)}
                className="flex items-center w-full"
              >
                {formData.cruzaMedianoche ? (
                  <ToggleRight size={20} style={{ color: colors.primary }} />
                ) : (
                  <ToggleLeft size={20} className="text-gray-400" />
                )}
                <span className="ml-2 text-sm">
                  {formData.cruzaMedianoche ? (
                    <span style={{ color: colors.primary }}>
                      ✓ Turno nocturno (cruza medianoche)
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      Turno cruza medianoche
                    </span>
                  )}
                </span>
              </button>
              <p className="text-xs text-gray-500 ml-7 mt-1">
                Actívalo si el turno termina al día siguiente
              </p>
            </div>
          </div>
        )}

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
                <div 
                  className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                />
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
          .mobile-form select {
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

export default TurnoForm;