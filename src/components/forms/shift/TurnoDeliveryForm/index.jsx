// src/components/forms/shift/TurnoDeliveryForm/index.jsx - REFACTORIZADO CON BaseForm

import React, { useState, useEffect, useCallback } from 'react';
import { Truck, Calendar, Clock, DollarSign, Package, Navigation, Fuel, Heart } from 'lucide-react';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import BaseForm, { FormSection, FormGrid, FormField, FormLabel, FormError, getInputClasses } from '../../base/BaseForm';

const TurnoDeliveryForm = ({
  id,
  turno,
  trabajoId,
  trabajos = [],
  onSubmit,
  onTrabajoChange,
  isMobile = false,
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

  // Filtrar y agrupar trabajos para el selector
  const trabajosTradicionales = trabajos.filter(t => t.tipo !== 'delivery');
  const trabajosDelivery = trabajos.filter(t => t.tipo === 'delivery');

  return (
    <BaseForm
      id={id}
      onSubmit={handleSubmit}
      isMobile={isMobile}
    >
      {/* Selección de trabajo (unificada) */}
      <FormSection>
        <FormLabel icon={Truck}>Trabajo</FormLabel>
        <select
          value={formData.trabajoId}
          onChange={(e) => handleInputChange('trabajoId', e.target.value)}
          className={getInputClasses(isMobile, errors.trabajoId)}
          style={{ '--tw-ring-color': colors.primary }}
          required
        >
          <option value="">Seleccionar trabajo</option>

          {trabajosDelivery.length > 0 && (
            <optgroup label="Trabajos de Delivery">
              {trabajosDelivery.map(trabajo => (
                <option key={trabajo.id} value={trabajo.id}>
                  {trabajo.nombre} {trabajo.vehiculo ? `(${trabajo.vehiculo})` : ''}
                </option>
              ))}
            </optgroup>
          )}

          {trabajosTradicionales.length > 0 && (
            <optgroup label="Trabajos Tradicionales">
              {trabajosTradicionales.map(trabajo => (
                <option key={trabajo.id} value={trabajo.id}>
                  {trabajo.nombre}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <FormError error={errors.trabajoId} />
      </FormSection>

      {/* Fecha de trabajo */}
      <FormSection>
        <FormLabel icon={Calendar}>Fecha del turno</FormLabel>
        <input
          type="date"
          value={formData.fechaInicio}
          onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
          className={getInputClasses(isMobile, errors.fechaInicio)}
          style={{ '--tw-ring-color': colors.primary }}
          required
        />
        <FormError error={errors.fechaInicio} />
      </FormSection>

      {/* CONTENEDOR DE HORAS RESPONSIVO */}
      <FormGrid columns={2}>
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

      {/* GANANCIAS RESPONSIVAS */}
      <FormGrid columns={2}>
        <FormField>
          <FormLabel icon={DollarSign}>Ganancia total *</FormLabel>
          <input
            type="number"
            step="0.01"
            value={formData.gananciaTotal}
            onChange={(e) => handleInputChange('gananciaTotal', e.target.value)}
            className={getInputClasses(isMobile, errors.gananciaTotal)}
            style={{ '--tw-ring-color': colors.primary }}
            placeholder="0.00"
            required
          />
          <FormError error={errors.gananciaTotal} />
        </FormField>

        <FormField>
          <FormLabel icon={Heart}>Propinas</FormLabel>
          <input
            type="number"
            step="0.01"
            value={formData.propinas}
            onChange={(e) => handleInputChange('propinas', e.target.value)}
            className={getInputClasses(isMobile)}
            style={{ '--tw-ring-color': colors.primary }}
            placeholder="0.00"
          />
        </FormField>
      </FormGrid>

      {/* DATOS ADICIONALES RESPONSIVOS */}
      <FormGrid columns={2}>
        <FormField>
          <FormLabel icon={Package}>Número de pedidos</FormLabel>
          <input
            type="number"
            value={formData.numeroPedidos}
            onChange={(e) => handleInputChange('numeroPedidos', e.target.value)}
            className={getInputClasses(isMobile)}
            style={{ '--tw-ring-color': colors.primary }}
            placeholder="0"
            min="0"
          />
        </FormField>

        <FormField>
          <FormLabel icon={Navigation}>Kilómetros recorridos</FormLabel>
          <input
            type="number"
            step="0.1"
            value={formData.kilometros}
            onChange={(e) => handleInputChange('kilometros', e.target.value)}
            className={getInputClasses(isMobile)}
            style={{ '--tw-ring-color': colors.primary }}
            placeholder="0.0"
            min="0"
          />
        </FormField>
      </FormGrid>

      {/* Gastos de combustible - SOLO SI EL VEHÍCULO LO REQUIERE */}
      {mostrarCombustible && (
        <FormSection>
          <FormLabel icon={Fuel}>Gastos de combustible</FormLabel>
          <input
            type="number"
            step="0.01"
            value={formData.gastoCombustible}
            onChange={(e) => handleInputChange('gastoCombustible', e.target.value)}
            className={getInputClasses(isMobile)}
            style={{ '--tw-ring-color': colors.primary }}
            placeholder="0.00"
            min="0"
          />
        </FormSection>
      )}

      {/* Observaciones */}
      <FormSection>
        <FormLabel>Notas (opcional)</FormLabel>
        <textarea
          value={formData.observaciones}
          onChange={(e) => handleInputChange('observaciones', e.target.value)}
          className={`${getInputClasses(isMobile)} resize-none border-gray-300`}
          style={{ '--tw-ring-color': colors.primary }}
          rows={isMobile ? "3" : "2"}
          placeholder="Notas adicionales sobre el turno..."
        />
      </FormSection>
    </BaseForm>
  );
};

export default TurnoDeliveryForm;