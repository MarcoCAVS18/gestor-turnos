// src/components/forms/shift/TurnoForm/index.jsx - REFACTORIZADO CON BaseForm

import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, Calendar, Clock, FileText, Coffee } from 'lucide-react';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { useApp } from '../../../../contexts/AppContext';
import { createSafeDate, calculateShiftHours } from '../../../../utils/time';
import BaseForm, { FormSection, FormGrid, FormField, FormLabel, FormError, getInputClasses } from '../../base/BaseForm';
import Flex from '../../../ui/Flex';

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

  // Función para calcular duración del turno - USANDO UTILIDAD CENTRALIZADA
  const calcularDuracionTurno = useCallback(() => {
    if (!formData.horaInicio || !formData.horaFin) return null;

    const totalHoras = calculateShiftHours(formData.horaInicio, formData.horaFin);
    const totalMinutos = Math.round(totalHoras * 60);

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
    const fecha = createSafeDate(fechaInicio);
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

  const trabajosTradicionales = trabajos.filter(t => t.tipo !== 'delivery');
  const trabajosDelivery = trabajos.filter(t => t.tipo === 'delivery');

  return (
    <BaseForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      loading={loading}
      isMobile={isMobile}
      isEditing={!!turno}
      submitText={turno ? 'Actualizar Turno' : 'Crear Turno'}
    >
      {/* Selección de trabajo */}
      <FormSection>
        <FormLabel icon={Briefcase}>Trabajo</FormLabel>
        <select
          value={formData.trabajoId}
          onChange={(e) => handleInputChange('trabajoId', e.target.value)}
          className={getInputClasses(isMobile, errors.trabajoId)}
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
        <FormError error={errors.trabajoId} />
      </FormSection>

      {/* CONTENEDOR DE FECHAS RESPONSIVO */}
      <FormGrid columns={2} isMobile={isMobile}>
        {/* Fecha de inicio */}
        <FormField>
          <FormLabel icon={Calendar}>Fecha de inicio</FormLabel>
          <input
            type="date"
            value={formData.fechaInicio}
            onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
            className={getInputClasses(isMobile, errors.fechaInicio)}
            style={{ '--tw-ring-color': colors.primary }}
            required
          />
          <FormError error={errors.fechaInicio} />
        </FormField>

        {/* Fecha de fin - solo mostrar si es nocturno */}
        {formData.cruzaMedianoche && (
          <FormField>
            <FormLabel icon={Calendar}>Fecha de fin</FormLabel>
            <input
              type="date"
              value={formData.fechaFin || calcularFechaFin(formData.fechaInicio)}
              onChange={(e) => handleInputChange('fechaFin', e.target.value)}
              className={getInputClasses(isMobile)}
              style={{ '--tw-ring-color': colors.primary }}
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Se calcula automáticamente para turnos nocturnos
            </p>
          </FormField>
        )}
      </FormGrid>

      {/* CONTENEDOR DE HORAS RESPONSIVO */}
      <FormGrid columns={2} isMobile={isMobile}>
        {/* Hora de inicio */}
        <FormField>
          <FormLabel icon={Clock}>Hora de inicio</FormLabel>
          <input
            type="time"
            value={formData.horaInicio}
            onChange={(e) => handleInputChange('horaInicio', e.target.value)}
            className={getInputClasses(isMobile, errors.horaInicio)}
            style={{ '--tw-ring-color': colors.primary }}
            required
          />
          <FormError error={errors.horaInicio} />
        </FormField>

        {/* Hora de fin */}
        <FormField>
          <FormLabel icon={Clock}>Hora de fin</FormLabel>
          <input
            type="time"
            value={formData.horaFin}
            onChange={(e) => handleInputChange('horaFin', e.target.value)}
            className={getInputClasses(isMobile, errors.horaFin)}
            style={{ '--tw-ring-color': colors.primary }}
            required
          />
          <FormError error={errors.horaFin} />
        </FormField>
      </FormGrid>

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
      <Flex variant="between" className={`
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
      </Flex>

      {/* Información del cálculo - LAYOUT RESPONSIVO */}
      <div className={`
        ${isMobile ? 'space-y-3' : 'space-y-2'}
        ${isMobile ? 'text-sm' : 'text-xs'}
        text-gray-600
      `}>
        {/* Tiempo programado */}
        <Flex variant="between" className={`
          p-2 rounded
          ${isMobile ? 'bg-blue-50' : 'bg-gray-50'}
        `}>
          <div className="flex items-center">
            <Flex variant="center" className={`
              rounded-full mr-2
              ${isMobile ? 'w-6 h-6 text-xs' : 'w-5 h-5 text-xs'}
            `}
            style={{ backgroundColor: colors.transparent20, color: colors.primary }}>
              <Clock size={isMobile ? 12 : 10} />
            </Flex>
            <span className={isMobile ? 'text-sm' : 'text-xs'}>Tiempo programado:</span>
          </div>
          <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-xs'}`}>
            {Math.floor(duracion.totalMinutos / 60)}h {duracion.totalMinutos % 60}min
          </span>
        </Flex>

        {formData.tuvoDescanso ? (
          <>
            {/* Descanso configurado */}
            <Flex variant="between" className={`
              p-2 rounded
              ${isMobile ? 'bg-orange-50' : 'bg-gray-50'}
            `}>
              <div className="flex items-center">
                <Flex variant="center" className={`
                  rounded-full mr-2
                  ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}
                `}
                style={{ backgroundColor: '#FED7AA', color: '#EA580C' }}>
                  <Coffee size={isMobile ? 10 : 8} />
                </Flex>
                <span className={isMobile ? 'text-sm' : 'text-xs'}>Descanso configurado:</span>
              </div>
              <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-xs'}`}>
                {smokoMinutes} minutos
              </span>
            </Flex>

            {/* Tiempo pagado */}
            <Flex variant="between" className={`
              p-2 rounded border
              ${isMobile ? 'bg-green-50 border-green-200' : 'bg-gray-50'}
            `}
            style={{ 
              backgroundColor: isMobile ? colors.transparent10 : undefined,
              borderColor: isMobile ? colors.transparent30 : undefined
            }}>
              <Flex variant="center">
                <Flex variant="center" className={`
                  rounded-full mr-2
                  ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}
                `}
                style={{ backgroundColor: colors.primary, color: 'white' }}>
                  <span className={`font-bold ${isMobile ? 'text-xs' : 'text-[10px]'}`}>$</span>
                </Flex>
                <span className={`font-medium ${isMobile ? 'text-sm' : 'text-xs'}`}
                      style={{ color: colors.primary }}>
                  Tiempo pagado:
                </span>
              </Flex>
              <span className={`font-bold ${isMobile ? 'text-sm' : 'text-xs'}`}
                    style={{ color: colors.primary }}>
                {duracion.horas}h {duracion.minutos}min
              </span>
            </Flex>
          </>
        ) : (
          /* Sin descuento aplicado */
          <Flex variant="between" className={`
            p-2 rounded border
            ${isMobile ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}
          `}
          style={{ 
            backgroundColor: isMobile ? colors.transparent10 : undefined,
            borderColor: isMobile ? colors.transparent30 : undefined
          }}>
            <Flex variant="center">
              <Flex variant="center" className={`
                rounded-full mr-2
                ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}
              `}
              style={{ backgroundColor: colors.primary, color: 'white' }}>
                <span className={`font-bold ${isMobile ? 'text-xs' : 'text-[10px]'}`}>$</span>
              </Flex>
              <span className={`font-medium ${isMobile ? 'text-sm' : 'text-xs'}`}
                    style={{ color: colors.primary }}>
                Tiempo pagado:
              </span>
            </Flex>
            <div className="text-right">
              <div className={`font-bold ${isMobile ? 'text-sm' : 'text-xs'}`}
                   style={{ color: colors.primary }}>
                {Math.floor(duracion.totalMinutos / 60)}h {duracion.totalMinutos % 60}min
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-[10px]'} text-gray-500`}>
                (sin descuento)
              </div>
            </div>
          </Flex>
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
      <FormSection>
        <FormLabel icon={FileText}>Notas (opcional)</FormLabel>
        <textarea
          value={formData.notas}
          onChange={(e) => handleInputChange('notas', e.target.value)}
          placeholder="Agregar notas sobre este turno..."
          className={`${getInputClasses(isMobile)} border-gray-300 resize-none`}
          style={{ '--tw-ring-color': colors.primary }}
          rows={3}
        />
      </FormSection>
    </BaseForm>
  );
};

export default TurnoForm;