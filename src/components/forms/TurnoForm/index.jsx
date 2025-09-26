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

{/* NUEVA SECCIÓN: DESCANSO (SMOKO) - OPTIMIZADA PARA MÓVIL */}
{smokoEnabled && duracion && duracion.totalMinutos > smokoMinutes && (
  <div className="w-full">
    <div 
      className={`
        rounded-lg border
        ${isMobile ? 'p-4 space-y-4' : 'p-4 space-y-3'}
      `}
      style={{ 
        backgroundColor: colors.transparent5,
        borderColor: colors.transparent20 
      }}
    >
      {/* Header con título y toggle customizado */}
      <div className={`
        flex items-center justify-between 
        ${isMobile ? 'pb-2 border-b border-gray-200' : ''}
      `}>
        <div className="flex items-center flex-1">
          <Coffee 
            size={isMobile ? 18 : 16} 
            style={{ color: colors.primary }} 
            className="mr-2 flex-shrink-0" 
          />
          <span className={`font-medium text-gray-700 ${isMobile ? 'text-base' : 'text-sm'}`}>
            ¿Tuviste descanso?
          </span>
        </div>

        {/* Toggle Switch Customizado */}
        <label className="relative inline-flex items-center cursor-pointer">
          {/* Input oculto */}
          <input
            type="checkbox"
            checked={formData.tuvoDescanso}
            onChange={(e) => handleInputChange('tuvoDescanso', e.target.checked)}
            className="sr-only peer"
          />
          
          {/* Switch personalizado */}
          <div className={`
            relative bg-gray-200 rounded-full peer 
            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2
            peer-checked:after:translate-x-full peer-checked:after:border-white 
            after:content-[''] after:absolute after:bg-white after:border-gray-300 
            after:border after:rounded-full after:transition-all
            ${isMobile 
              ? 'w-12 h-6 after:top-[2px] after:left-[2px] after:h-5 after:w-5' 
              : 'w-10 h-5 after:top-[1px] after:left-[1px] after:h-4 after:w-4'
            }
          `}
          style={{
            '--tw-ring-color': colors.primary,
            backgroundColor: formData.tuvoDescanso ? colors.primary : undefined
          }}
          />
          
          {/* Texto del toggle */}
          <span className={`
            ml-3 font-medium
            ${isMobile ? 'text-sm' : 'text-xs'}
            ${formData.tuvoDescanso ? 'text-green-700' : 'text-gray-600'}
          `}>
            {formData.tuvoDescanso ? 'Sí' : 'No'}
          </span>
        </label>
      </div>

      {/* Información del cálculo - LAYOUT RESPONSIVO */}
      <div className={`
        ${isMobile ? 'space-y-3' : 'space-y-2'}
        ${isMobile ? 'text-sm' : 'text-xs'}
        text-gray-600
      `}>
        {/* Tiempo programado */}
        <div className={`
          flex items-center justify-between p-2 rounded
          ${isMobile ? 'bg-blue-50' : 'bg-gray-50'}
        `}>
          <div className="flex items-center">
            <div className={`
              rounded-full flex items-center justify-center mr-2
              ${isMobile ? 'w-6 h-6 text-xs' : 'w-5 h-5 text-xs'}
            `}
            style={{ backgroundColor: colors.transparent20, color: colors.primary }}>
              <Clock size={isMobile ? 12 : 10} />
            </div>
            <span className={isMobile ? 'text-sm' : 'text-xs'}>Tiempo programado:</span>
          </div>
          <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-xs'}`}>
            {Math.floor(duracion.totalMinutos / 60)}h {duracion.totalMinutos % 60}min
          </span>
        </div>

        {formData.tuvoDescanso ? (
          <>
            {/* Descanso configurado */}
            <div className={`
              flex items-center justify-between p-2 rounded
              ${isMobile ? 'bg-orange-50' : 'bg-gray-50'}
            `}>
              <div className="flex items-center">
                <div className={`
                  rounded-full flex items-center justify-center mr-2
                  ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}
                `}
                style={{ backgroundColor: '#FED7AA', color: '#EA580C' }}>
                  <Coffee size={isMobile ? 10 : 8} />
                </div>
                <span className={isMobile ? 'text-sm' : 'text-xs'}>Descanso configurado:</span>
              </div>
              <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-xs'}`}>
                {smokoMinutes} minutos
              </span>
            </div>

            {/* Tiempo pagado */}
            <div className={`
              flex items-center justify-between p-2 rounded border
              ${isMobile ? 'bg-green-50 border-green-200' : 'bg-gray-50'}
            `}
            style={{ 
              backgroundColor: isMobile ? colors.transparent10 : undefined,
              borderColor: isMobile ? colors.transparent30 : undefined
            }}>
              <div className="flex items-center">
                <div className={`
                  rounded-full flex items-center justify-center mr-2
                  ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}
                `}
                style={{ backgroundColor: colors.primary, color: 'white' }}>
                  <span className={`font-bold ${isMobile ? 'text-xs' : 'text-[10px]'}`}>$</span>
                </div>
                <span className={`font-medium ${isMobile ? 'text-sm' : 'text-xs'}`}
                      style={{ color: colors.primary }}>
                  Tiempo pagado:
                </span>
              </div>
              <span className={`font-bold ${isMobile ? 'text-sm' : 'text-xs'}`}
                    style={{ color: colors.primary }}>
                {duracion.horas}h {duracion.minutos}min
              </span>
            </div>
          </>
        ) : (
          /* Sin descuento aplicado */
          <div className={`
            flex items-center justify-between p-2 rounded border
            ${isMobile ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}
          `}
          style={{ 
            backgroundColor: isMobile ? colors.transparent10 : undefined,
            borderColor: isMobile ? colors.transparent30 : undefined
          }}>
            <div className="flex items-center">
              <div className={`
                rounded-full flex items-center justify-center mr-2
                ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}
              `}
              style={{ backgroundColor: colors.primary, color: 'white' }}>
                <span className={`font-bold ${isMobile ? 'text-xs' : 'text-[10px]'}`}>$</span>
              </div>
              <span className={`font-medium ${isMobile ? 'text-sm' : 'text-xs'}`}
                    style={{ color: colors.primary }}>
                Tiempo pagado:
              </span>
            </div>
            <div className="text-right">
              <div className={`font-bold ${isMobile ? 'text-sm' : 'text-xs'}`}
                   style={{ color: colors.primary }}>
                {Math.floor(duracion.totalMinutos / 60)}h {duracion.totalMinutos % 60}min
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-[10px]'} text-gray-500`}>
                (sin descuento)
              </div>
            </div>
          </div>
        )}

        {/* Mensaje informativo en móvil */}
        {isMobile && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600 text-center">
            💡 El descuento se aplica automáticamente según tu configuración
          </div>
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