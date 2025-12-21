// src/components/forms/shift/TurnoDeliveryForm/index.jsx

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
  onDirtyChange,
  isMobile = false,
  fechaInicial
}) => {
  const colors = useThemeColors();

  const [initialFormData, setInitialFormData] = useState(null);
  const [formData, setFormData] = useState({
    trabajoId: trabajoId || '',
    fechaInicio: '',
    horaInicio: '',
    horaFin: '',
    gananciaBase: '',
    propinas: '',
    numeroPedidos: '',
    kilometros: '',
    gastoCombustible: '',
    observaciones: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!initialFormData || !onDirtyChange) return;

    if (turno) {
      const isDirty =
        formData.trabajoId !== initialFormData.trabajoId ||
        formData.fechaInicio !== initialFormData.fechaInicio ||
        formData.horaInicio !== initialFormData.horaInicio ||
        formData.horaFin !== initialFormData.horaFin ||
        String(formData.gananciaBase) !== String(initialFormData.gananciaBase) ||
        String(formData.propinas) !== String(initialFormData.propinas) ||
        String(formData.numeroPedidos) !== String(initialFormData.numeroPedidos) ||
        String(formData.kilometros) !== String(initialFormData.kilometros) ||
        String(formData.gastoCombustible) !== String(initialFormData.gastoCombustible) ||
        formData.observaciones !== initialFormData.observaciones;
      onDirtyChange(isDirty);
    } else {
      onDirtyChange(true);
    }
  }, [formData, initialFormData, onDirtyChange, turno]);

  const vehiculoNecesitaCombustible = useCallback((vehiculo) => {
    if (!vehiculo) return false;
    const vehiculoLower = vehiculo.toLowerCase();
    return vehiculoLower.includes('moto') || 
           vehiculoLower.includes('auto') || 
           vehiculoLower.includes('carro') ||
           vehiculoLower.includes('coche');
  }, []);

  const trabajoSeleccionado = trabajos.find(t => t.id === formData.trabajoId);
  const mostrarCombustible = trabajoSeleccionado ? vehiculoNecesitaCombustible(trabajoSeleccionado.vehiculo) : true;

  useEffect(() => {
    let initialData;
    if (turno) {
      initialData = {
        trabajoId: turno.trabajoId || '',
        fechaInicio: turno.fechaInicio || turno.fecha || '',
        horaInicio: turno.horaInicio || '',
        horaFin: turno.horaFin || '',
        gananciaBase: (turno.gananciaBase ?? turno.gananciaTotal)?.toString() || '',
        propinas: turno.propinas?.toString() || '',
        numeroPedidos: turno.numeroPedidos?.toString() || '',
        kilometros: turno.kilometros?.toString() || '',
        gastoCombustible: turno.gastoCombustible?.toString() || '',
        observaciones: turno.observaciones || ''
      };
    } else {
      const fechaStr = fechaInicial instanceof Date 
        ? fechaInicial.toISOString().split('T')[0] 
        : fechaInicial;
      initialData = {
        trabajoId: trabajoId || '',
        fechaInicio: fechaStr,
        horaInicio: '',
        horaFin: '',
        gananciaBase: '',
        propinas: '',
        numeroPedidos: '',
        kilometros: '',
        gastoCombustible: '',
        observaciones: ''
      };
    }
    setFormData(initialData);
    setInitialFormData(initialData);
  }, [turno, trabajoId, fechaInicial]);

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
    if (!formData.gananciaBase || parseFloat(formData.gananciaBase) <= 0) {
      newErrors.gananciaBase = 'La ganancia (sin propinas) es requerida y debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      const dataToSubmit = {
        ...formData,
        gananciaBase: parseFloat(formData.gananciaBase) || 0,
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

    if (field === 'trabajoId') {
      onTrabajoChange?.(value);
    }
  }, [errors, onTrabajoChange]);

  const trabajosTradicionales = trabajos.filter(t => t.tipo !== 'delivery');
  const trabajosDelivery = trabajos.filter(t => t.tipo === 'delivery');

  return (
    <BaseForm
      id={id}
      onSubmit={handleSubmit}
      isMobile={isMobile}
    >
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

      <FormGrid columns={2}>
        <FormField>
          <FormLabel icon={DollarSign}>Ganancia (sin propinas)</FormLabel>
          <input
            type="number"
            step="0.01"
            value={formData.gananciaBase}
            onChange={(e) => handleInputChange('gananciaBase', e.target.value)}
            className={getInputClasses(isMobile, errors.gananciaBase)}
            style={{ '--tw-ring-color': colors.primary }}
            placeholder="0.00"
            required
          />
          <FormError error={errors.gananciaBase} />
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