// src/components/forms/shift/TurnoDeliveryForm/index.jsx

import React, ***REMOVED*** useState, useEffect, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** Truck, Calendar, Clock, DollarSign, Package, Navigation, Fuel, Heart ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';
import BaseForm, ***REMOVED*** FormSection, FormGrid, FormField, FormLabel, FormError, getInputClasses ***REMOVED*** from '../../base/BaseForm';

const TurnoDeliveryForm = (***REMOVED***
  id,
  turno,
  trabajoId,
  trabajos = [],
  onSubmit,
  onTrabajoChange,
  onDirtyChange,
  isMobile = false,
  fechaInicial
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  const [initialFormData, setInitialFormData] = useState(null);
  const [formData, setFormData] = useState(***REMOVED***
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
  ***REMOVED***);

  const [errors, setErrors] = useState(***REMOVED******REMOVED***);

  useEffect(() => ***REMOVED***
    if (!initialFormData || !onDirtyChange) return;

    if (turno) ***REMOVED***
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
    ***REMOVED*** else ***REMOVED***
      onDirtyChange(true);
    ***REMOVED***
  ***REMOVED***, [formData, initialFormData, onDirtyChange, turno]);

  const vehiculoNecesitaCombustible = useCallback((vehiculo) => ***REMOVED***
    if (!vehiculo) return false;
    const vehiculoLower = vehiculo.toLowerCase();
    return vehiculoLower.includes('moto') || 
           vehiculoLower.includes('auto') || 
           vehiculoLower.includes('carro') ||
           vehiculoLower.includes('coche');
  ***REMOVED***, []);

  const trabajoSeleccionado = trabajos.find(t => t.id === formData.trabajoId);
  const mostrarCombustible = trabajoSeleccionado ? vehiculoNecesitaCombustible(trabajoSeleccionado.vehiculo) : true;

  useEffect(() => ***REMOVED***
    let initialData;
    if (turno) ***REMOVED***
      initialData = ***REMOVED***
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
      ***REMOVED***;
    ***REMOVED*** else ***REMOVED***
      const fechaStr = fechaInicial instanceof Date 
        ? fechaInicial.toISOString().split('T')[0] 
        : fechaInicial;
      initialData = ***REMOVED***
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
      ***REMOVED***;
    ***REMOVED***
    setFormData(initialData);
    setInitialFormData(initialData);
  ***REMOVED***, [turno, trabajoId, fechaInicial]);

  useEffect(() => ***REMOVED***
    if (!mostrarCombustible && formData.gastoCombustible) ***REMOVED***
      setFormData(prev => (***REMOVED*** ...prev, gastoCombustible: '' ***REMOVED***));
    ***REMOVED***
  ***REMOVED***, [mostrarCombustible, formData.gastoCombustible]);

  const validarFormulario = () => ***REMOVED***
    const newErrors = ***REMOVED******REMOVED***;

    if (!formData.trabajoId) ***REMOVED***
      newErrors.trabajoId = 'Selecciona un trabajo';
    ***REMOVED***
    if (!formData.fechaInicio) ***REMOVED***
      newErrors.fechaInicio = 'La fecha es requerida';
    ***REMOVED***
    if (!formData.horaInicio) ***REMOVED***
      newErrors.horaInicio = 'La hora de inicio es requerida';
    ***REMOVED***
    if (!formData.horaFin) ***REMOVED***
      newErrors.horaFin = 'La hora de fin es requerida';
    ***REMOVED***
    if (!formData.gananciaBase || parseFloat(formData.gananciaBase) <= 0) ***REMOVED***
      newErrors.gananciaBase = 'La ganancia (sin propinas) es requerida y debe ser mayor a 0';
    ***REMOVED***

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  ***REMOVED***;

  const handleSubmit = (e) => ***REMOVED***
    e.preventDefault();
    if (validarFormulario()) ***REMOVED***
      const dataToSubmit = ***REMOVED***
        ...formData,
        gananciaBase: parseFloat(formData.gananciaBase) || 0,
        propinas: parseFloat(formData.propinas) || 0,
        numeroPedidos: parseInt(formData.numeroPedidos) || 0,
        kilometros: parseFloat(formData.kilometros) || 0,
        gastoCombustible: mostrarCombustible ? (parseFloat(formData.gastoCombustible) || 0) : 0
      ***REMOVED***;
      onSubmit(dataToSubmit);
    ***REMOVED***
  ***REMOVED***;

  const handleInputChange = useCallback((field, value) => ***REMOVED***
    setFormData(prev => (***REMOVED*** ...prev, [field]: value ***REMOVED***));
    if (errors[field]) ***REMOVED***
      setErrors(prev => (***REMOVED*** ...prev, [field]: undefined ***REMOVED***));
    ***REMOVED***

    if (field === 'trabajoId') ***REMOVED***
      onTrabajoChange?.(value);
    ***REMOVED***
  ***REMOVED***, [errors, onTrabajoChange]);

  const trabajosTradicionales = trabajos.filter(t => t.tipo !== 'delivery');
  const trabajosDelivery = trabajos.filter(t => t.tipo === 'delivery');

  return (
    <BaseForm
      id=***REMOVED***id***REMOVED***
      onSubmit=***REMOVED***handleSubmit***REMOVED***
      isMobile=***REMOVED***isMobile***REMOVED***
    >
      <FormSection>
        <FormLabel icon=***REMOVED***Truck***REMOVED***>Trabajo</FormLabel>
        <select
          value=***REMOVED***formData.trabajoId***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('trabajoId', e.target.value)***REMOVED***
          className=***REMOVED***getInputClasses(isMobile, errors.trabajoId)***REMOVED***
          style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
          required
        >
          <option value="">Seleccionar trabajo</option>

          ***REMOVED***trabajosDelivery.length > 0 && (
            <optgroup label="Trabajos de Delivery">
              ***REMOVED***trabajosDelivery.map(trabajo => (
                <option key=***REMOVED***trabajo.id***REMOVED*** value=***REMOVED***trabajo.id***REMOVED***>
                  ***REMOVED***trabajo.nombre***REMOVED*** ***REMOVED***trabajo.vehiculo ? `($***REMOVED***trabajo.vehiculo***REMOVED***)` : ''***REMOVED***
                </option>
              ))***REMOVED***
            </optgroup>
          )***REMOVED***

          ***REMOVED***trabajosTradicionales.length > 0 && (
            <optgroup label="Trabajos Tradicionales">
              ***REMOVED***trabajosTradicionales.map(trabajo => (
                <option key=***REMOVED***trabajo.id***REMOVED*** value=***REMOVED***trabajo.id***REMOVED***>
                  ***REMOVED***trabajo.nombre***REMOVED***
                </option>
              ))***REMOVED***
            </optgroup>
          )***REMOVED***
        </select>
        <FormError error=***REMOVED***errors.trabajoId***REMOVED*** />
      </FormSection>

      <FormSection>
        <FormLabel icon=***REMOVED***Calendar***REMOVED***>Fecha del turno</FormLabel>
        <input
          type="date"
          value=***REMOVED***formData.fechaInicio***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('fechaInicio', e.target.value)***REMOVED***
          className=***REMOVED***getInputClasses(isMobile, errors.fechaInicio)***REMOVED***
          style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
          required
        />
        <FormError error=***REMOVED***errors.fechaInicio***REMOVED*** />
      </FormSection>

      <FormGrid columns=***REMOVED***2***REMOVED***>
        <FormField>
          <FormLabel icon=***REMOVED***Clock***REMOVED***>Hora de inicio</FormLabel>
          <input
            type="time"
            value=***REMOVED***formData.horaInicio***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('horaInicio', e.target.value)***REMOVED***
            className=***REMOVED***getInputClasses(isMobile, errors.horaInicio)***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            required
          />
          <FormError error=***REMOVED***errors.horaInicio***REMOVED*** />
        </FormField>

        <FormField>
          <FormLabel icon=***REMOVED***Clock***REMOVED***>Hora de fin</FormLabel>
          <input
            type="time"
            value=***REMOVED***formData.horaFin***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('horaFin', e.target.value)***REMOVED***
            className=***REMOVED***getInputClasses(isMobile, errors.horaFin)***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            required
          />
          <FormError error=***REMOVED***errors.horaFin***REMOVED*** />
        </FormField>
      </FormGrid>

      <FormGrid columns=***REMOVED***2***REMOVED***>
        <FormField>
          <FormLabel icon=***REMOVED***DollarSign***REMOVED***>Ganancia (sin propinas)</FormLabel>
          <input
            type="number"
            step="0.01"
            value=***REMOVED***formData.gananciaBase***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('gananciaBase', e.target.value)***REMOVED***
            className=***REMOVED***getInputClasses(isMobile, errors.gananciaBase)***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            placeholder="0.00"
            required
          />
          <FormError error=***REMOVED***errors.gananciaBase***REMOVED*** />
        </FormField>

        <FormField>
          <FormLabel icon=***REMOVED***Heart***REMOVED***>Propinas</FormLabel>
          <input
            type="number"
            step="0.01"
            value=***REMOVED***formData.propinas***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('propinas', e.target.value)***REMOVED***
            className=***REMOVED***getInputClasses(isMobile)***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            placeholder="0.00"
          />
        </FormField>
      </FormGrid>

      <FormGrid columns=***REMOVED***2***REMOVED***>
        <FormField>
          <FormLabel icon=***REMOVED***Package***REMOVED***>Número de pedidos</FormLabel>
          <input
            type="number"
            value=***REMOVED***formData.numeroPedidos***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('numeroPedidos', e.target.value)***REMOVED***
            className=***REMOVED***getInputClasses(isMobile)***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            placeholder="0"
            min="0"
          />
        </FormField>

        <FormField>
          <FormLabel icon=***REMOVED***Navigation***REMOVED***>Kilómetros recorridos</FormLabel>
          <input
            type="number"
            step="0.1"
            value=***REMOVED***formData.kilometros***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('kilometros', e.target.value)***REMOVED***
            className=***REMOVED***getInputClasses(isMobile)***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            placeholder="0.0"
            min="0"
          />
        </FormField>
      </FormGrid>

      ***REMOVED***mostrarCombustible && (
        <FormSection>
          <FormLabel icon=***REMOVED***Fuel***REMOVED***>Gastos de combustible</FormLabel>
          <input
            type="number"
            step="0.01"
            value=***REMOVED***formData.gastoCombustible***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('gastoCombustible', e.target.value)***REMOVED***
            className=***REMOVED***getInputClasses(isMobile)***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            placeholder="0.00"
            min="0"
          />
        </FormSection>
      )***REMOVED***

      <FormSection>
        <FormLabel>Notas (opcional)</FormLabel>
        <textarea
          value=***REMOVED***formData.observaciones***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('observaciones', e.target.value)***REMOVED***
          className=***REMOVED***`$***REMOVED***getInputClasses(isMobile)***REMOVED*** resize-none border-gray-300`***REMOVED***
          style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
          rows=***REMOVED***isMobile ? "3" : "2"***REMOVED***
          placeholder="Notas adicionales sobre el turno..."
        />
      </FormSection>
    </BaseForm>
  );
***REMOVED***;

export default TurnoDeliveryForm;