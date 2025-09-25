// src/components/forms/TurnoForm/index.jsx - ACTUALIZADO CON SMOKO

import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, Calendar, Clock, FileText, Coffee } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useApp } from '../../../contexts/AppContext';

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
  const { smokoEnabled, smokoMinutes } = useApp(); // NUEVO

  // Estados del formulario - ACTUALIZADO
  const [formData, setFormData] = useState({
    trabajoId: trabajoId || '',
    fechaInicio: '',
    horaInicio: '',
    horaFin: '',
    cruzaMedianoche: false,
    fechaFin: '',
    tuvoDescanso: true, // NUEVO - por defecto asume que tuvo descanso
    notas: ''
  });

  const [errors, setErrors] = useState({});

  // Función para calcular duración del turno - ACTUALIZADA
  const calcularDuracionTurno = useCallback(() => {
    if (!formData.horaInicio || !formData.horaFin) return null;
    
    const [horaI, minI] = formData.horaInicio.split(':').map(Number);
    const [horaF, minF] = formData.horaFin.split(':').map(Number);
    
    let totalMinutos = (horaF * 60 + minF) - (horaI * 60 + minI);
    if (totalMinutos <= 0) totalMinutos += 24 * 60; // Turno nocturno
    
    // Aplicar descuento de smoko si está habilitado
    let minutosReales = totalMinutos;
    if (smokoEnabled && formData.tuvoDescanso && totalMinutos > smokoMinutes) {
      minutosReales = totalMinutos - smokoMinutes;
    }
    
    return {
      totalMinutos,
      minutosReales,
      horas: Math.floor(minutosReales / 60),
      minutos: minutosReales % 60,
      smokoAplicado: smokoEnabled && formData.tuvoDescanso && totalMinutos > smokoMinutes
    };
  }, [formData.horaInicio, formData.horaFin, formData.tuvoDescanso, smokoEnabled, smokoMinutes]);

  const duracion = calcularDuracionTurno();

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

  // Inicializar formulario - ACTUALIZADO
  useEffect(() => {
    if (turno) {
      setFormData({
        trabajoId: turno.trabajoId || '',
        fechaInicio: turno.fechaInicio || turno.fecha || '',
        horaInicio: turno.horaInicio || '',
        horaFin: turno.horaFin || '',
        cruzaMedianoche: turno.cruzaMedianoche || false,
        fechaFin: turno.fechaFin || '',
        tuvoDescanso: turno.tuvoDescanso !== undefined ? turno.tuvoDescanso : true, // NUEVO
        notas: turno.notas || ''
      });
    } else if (fechaInicial) {
      const fechaStr = fechaInicial instanceof Date 
        ? fechaInicial.toISOString().split('T')[0] 
        : fechaInicial;
      setFormData(prev => ({ 
        ...prev, 
        fechaInicio: fechaStr,
        tuvoDescanso: true // NUEVO - por defecto en turnos nuevos
      }));
    }
  }, [turno, fechaInicial]);

  // Resto del código igual hasta el JSX...

  const inputClasses = `
    w-full px-3 py-3 border rounded-lg text-base transition-colors
    focus:outline-none focus:ring-2 focus:border-transparent
    ${isMobile ? 'text-base min-h-[44px]' : 'text-sm py-2'}
  `;

  const trabajosTradicionales = trabajos.filter(t => t.tipo !== 'delivery');
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
            
            {trabajosTradicionales.length > 0 && (
              <optgroup label="Trabajos Tradicionales">
                {trabajosTradicionales.map(trabajo => (
                  <option key={trabajo.id} value={trabajo.id}>
                    {trabajo.nombre}
                  </option>
                ))}
              </optgroup>
            )}
            
            {trabajosDelivery.length > 0 && (
              <optgroup label="Trabajos de Delivery">
                {trabajosDelivery.map(trabajo => (
                  <option key={trabajo.id} value={trabajo.id}>
                    {trabajo.nombre}
                  </option>
                ))}
              </optgroup>
            )}
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

        {/* NUEVA SECCIÓN: DESCANSO (SMOKO) - Solo mostrar si está habilitado */}
        {smokoEnabled && duracion && duracion.totalMinutos > smokoMinutes && (
          <div className="w-full">
            <div 
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: colors.transparent5,
                borderColor: colors.transparent20 
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Coffee size={16} style={{ color: colors.primary }} className="mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    ¿Tuviste descanso?
                  </span>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tuvoDescanso}
                    onChange={(e) => handleInputChange('tuvoDescanso', e.target.checked)}
                    className="rounded w-4 h-4 mr-2"
                    style={{ accentColor: colors.primary }}
                  />
                  <span className="text-sm text-gray-600">
                    Sí, tuve descanso
                  </span>
                </label>
              </div>

              {/* Información del cálculo */}
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  • Tiempo programado: <strong>{Math.floor(duracion.totalMinutos / 60)}h {duracion.totalMinutos % 60}min</strong>
                </p>
                {formData.tuvoDescanso ? (
                  <>
                    <p>• Descanso configurado: <strong>{smokoMinutes} minutos</strong></p>
                    <p style={{ color: colors.primary }}>
                      • Tiempo pagado: <strong>{duracion.horas}h {duracion.minutos}min</strong>
                    </p>
                  </>
                ) : (
                  <p style={{ color: colors.primary }}>
                    • Tiempo pagado: <strong>{Math.floor(duracion.totalMinutos / 60)}h {duracion.totalMinutos % 60}min</strong> (sin descuento)
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mostrar duración del turno */}
        {duracion && (
          <div 
            className="p-3 rounded-lg text-sm"
            style={{ backgroundColor: colors.transparent10 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Duración del turno:</span>
              <div className="text-right">
                <span className="font-medium" style={{ color: colors.primary }}>
                  {duracion.horas}h {duracion.minutos}min
                </span>
                {duracion.smokoAplicado && (
                  <p className="text-xs text-gray-500">
                    (descontando {smokoMinutes}min de descanso)
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Campo de notas */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText size={16} className="inline mr-2" />
            Notas (opcional)
          </label>
          <textarea
            value={formData.notas}
            onChange={(e) => handleInputChange('notas', e.target.value)}
            placeholder="Agregar notas sobre este turno..."
            className={`${inputClasses} border-gray-300 resize-none`}
            style={{ '--tw-ring-color': colors.primary }}
            rows={3}
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
          .mobile-form select,
          .mobile-form textarea {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: none;
            font-size: 16px !important;
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