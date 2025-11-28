// src/components/forms/shift/TurnoDeliveryForm/index.jsx - REFACTORIZADO CON BaseForm

import React, ***REMOVED*** useState, useEffect, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** Truck, Calendar, Clock, DollarSign, Package, Navigation, Fuel, Heart ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';
import BaseForm, ***REMOVED*** FormSection, FormGrid, FormField, FormLabel, FormError, getInputClasses ***REMOVED*** from '../../base/BaseForm';

const TurnoDeliveryForm = (***REMOVED***
  turno,
  trabajoId,
  trabajos = [],
  onSubmit,
  onCancel,
  onTrabajoChange,
  isMobile = false,
  loading = false,
  fechaInicial
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  // Estados del formulario
  const [formData, setFormData] = useState(***REMOVED***
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
  ***REMOVED***);

  const [errors, setErrors] = useState(***REMOVED******REMOVED***);

  // Función para determinar si el vehículo necesita combustible
  const vehiculoNecesitaCombustible = useCallback((vehiculo) => ***REMOVED***
    if (!vehiculo) return false;
    const vehiculoLower = vehiculo.toLowerCase();
    return vehiculoLower.includes('moto') || 
           vehiculoLower.includes('auto') || 
           vehiculoLower.includes('carro') ||
           vehiculoLower.includes('coche');
  ***REMOVED***, []);

  // Obtener el trabajo seleccionado y verificar si necesita combustible
  const trabajoSeleccionado = trabajos.find(t => t.id === formData.trabajoId);
  const mostrarCombustible = trabajoSeleccionado ? vehiculoNecesitaCombustible(trabajoSeleccionado.vehiculo) : true;

  // Inicializar formulario
  useEffect(() => ***REMOVED***
    if (turno) ***REMOVED***
      setFormData(***REMOVED***
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
      ***REMOVED***);
    ***REMOVED*** else if (fechaInicial) ***REMOVED***
      const fechaStr = fechaInicial instanceof Date 
        ? fechaInicial.toISOString().split('T')[0] 
        : fechaInicial;
      setFormData(prev => (***REMOVED*** ...prev, fechaInicio: fechaStr ***REMOVED***));
    ***REMOVED***
  ***REMOVED***, [turno, fechaInicial]);

  // Limpiar gastos de combustible cuando se selecciona un vehículo que no lo necesita
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
    if (!formData.gananciaTotal || parseFloat(formData.gananciaTotal) <= 0) ***REMOVED***
      newErrors.gananciaTotal = 'La ganancia total es requerida y debe ser mayor a 0';
    ***REMOVED***

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  ***REMOVED***;

  const handleSubmit = (e) => ***REMOVED***
    e.preventDefault();
    if (validarFormulario()) ***REMOVED***
      // Convertir strings a números y asegurar que combustible sea 0 si no aplica
      const dataToSubmit = ***REMOVED***
        ...formData,
        gananciaTotal: parseFloat(formData.gananciaTotal) || 0,
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

    // Notificar cambio de trabajo al componente padre
    if (field === 'trabajoId') ***REMOVED***
      onTrabajoChange?.(value);
    ***REMOVED***
  ***REMOVED***, [errors, onTrabajoChange]);

  // Filtrar y agrupar trabajos para el selector
  const trabajosTradicionales = trabajos.filter(t => t.tipo !== 'delivery');
  const trabajosDelivery = trabajos.filter(t => t.tipo === 'delivery');

  return (
    <BaseForm
      onSubmit=***REMOVED***handleSubmit***REMOVED***
      onCancel=***REMOVED***onCancel***REMOVED***
      loading=***REMOVED***loading***REMOVED***
      isMobile=***REMOVED***isMobile***REMOVED***
      isEditing=***REMOVED***!!turno***REMOVED***
      submitText=***REMOVED***turno ? 'Actualizar Turno' : 'Crear Turno'***REMOVED***
    >
      ***REMOVED***/* Selección de trabajo (unificada) */***REMOVED***
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

      ***REMOVED***/* Fecha de trabajo */***REMOVED***
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

      ***REMOVED***/* CONTENEDOR DE HORAS RESPONSIVO */***REMOVED***
      <FormGrid columns=***REMOVED***2***REMOVED*** isMobile=***REMOVED***isMobile***REMOVED***>
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

      ***REMOVED***/* GANANCIAS RESPONSIVAS */***REMOVED***
      <FormGrid columns=***REMOVED***2***REMOVED*** isMobile=***REMOVED***isMobile***REMOVED***>
        <FormField>
          <FormLabel icon=***REMOVED***DollarSign***REMOVED***>Ganancia total *</FormLabel>
          <input
            type="number"
            step="0.01"
            value=***REMOVED***formData.gananciaTotal***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('gananciaTotal', e.target.value)***REMOVED***
            className=***REMOVED***getInputClasses(isMobile, errors.gananciaTotal)***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            placeholder="0.00"
            required
          />
          <FormError error=***REMOVED***errors.gananciaTotal***REMOVED*** />
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

      ***REMOVED***/* DATOS ADICIONALES RESPONSIVOS */***REMOVED***
      <FormGrid columns=***REMOVED***2***REMOVED*** isMobile=***REMOVED***isMobile***REMOVED***>
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

      ***REMOVED***/* Gastos de combustible - SOLO SI EL VEHÍCULO LO REQUIERE */***REMOVED***
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

      ***REMOVED***/* Observaciones */***REMOVED***
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