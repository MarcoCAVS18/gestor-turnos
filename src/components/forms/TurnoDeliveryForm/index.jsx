// src/components/forms/TurnoDeliveryForm/index.jsx - SIN detección automática de medianoche

import React, ***REMOVED*** useState, useEffect, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** Truck, Calendar, Clock, DollarSign, Package, Navigation, Fuel, Heart ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';

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

  const inputClasses = `
    w-full px-3 py-3 border rounded-lg text-base transition-colors
    focus:outline-none focus:ring-2 focus:border-transparent
    $***REMOVED***isMobile ? 'text-base min-h-[44px]' : 'text-sm py-2'***REMOVED***
  `;

  // Filtrar solo trabajos de delivery
  const trabajosDelivery = trabajos.filter(t => t.tipo === 'delivery');

  return (
    <div 
      className=***REMOVED***`w-full $***REMOVED***isMobile ? 'mobile-form' : ''***REMOVED***`***REMOVED***
      style=***REMOVED******REMOVED*** 
        maxWidth: '100%',
        overflowX: 'hidden'
      ***REMOVED******REMOVED***
    >
      <form onSubmit=***REMOVED***handleSubmit***REMOVED*** className="space-y-4 w-full">
        ***REMOVED***/* Selección de trabajo de delivery */***REMOVED***
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Truck size=***REMOVED***16***REMOVED*** className="inline mr-2" />
            Trabajo de Delivery
          </label>
          <select
            value=***REMOVED***formData.trabajoId***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('trabajoId', e.target.value)***REMOVED***
            className=***REMOVED***`$***REMOVED***inputClasses***REMOVED*** $***REMOVED***errors.trabajoId ? 'border-red-500' : 'border-gray-300'***REMOVED***`***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            required
          >
            <option value="">Seleccionar trabajo</option>
            ***REMOVED***trabajosDelivery.map(trabajo => (
              <option key=***REMOVED***trabajo.id***REMOVED*** value=***REMOVED***trabajo.id***REMOVED***>
                ***REMOVED***trabajo.nombre***REMOVED*** ***REMOVED***trabajo.vehiculo ? `($***REMOVED***trabajo.vehiculo***REMOVED***)` : ''***REMOVED***
              </option>
            ))***REMOVED***
          </select>
          ***REMOVED***errors.trabajoId && (
            <p className="text-red-500 text-xs mt-1">***REMOVED***errors.trabajoId***REMOVED***</p>
          )***REMOVED***
        </div>

        ***REMOVED***/* Fecha de trabajo */***REMOVED***
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar size=***REMOVED***16***REMOVED*** className="inline mr-2" />
            Fecha del turno
          </label>
          <input
            type="date"
            value=***REMOVED***formData.fechaInicio***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('fechaInicio', e.target.value)***REMOVED***
            className=***REMOVED***`$***REMOVED***inputClasses***REMOVED*** $***REMOVED***errors.fechaInicio ? 'border-red-500' : 'border-gray-300'***REMOVED***`***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            required
          />
          ***REMOVED***errors.fechaInicio && (
            <p className="text-red-500 text-xs mt-1">***REMOVED***errors.fechaInicio***REMOVED***</p>
          )***REMOVED***
        </div>

        ***REMOVED***/* CONTENEDOR DE HORAS RESPONSIVO */***REMOVED***
        <div className="w-full">
          <div className=***REMOVED***`grid gap-4 $***REMOVED***isMobile ? 'grid-cols-1' : 'grid-cols-2'***REMOVED***`***REMOVED***>
            <div className="w-full min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                Hora de inicio
              </label>
              <input
                type="time"
                value=***REMOVED***formData.horaInicio***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('horaInicio', e.target.value)***REMOVED***
                className=***REMOVED***`$***REMOVED***inputClasses***REMOVED*** $***REMOVED***errors.horaInicio ? 'border-red-500' : 'border-gray-300'***REMOVED***`***REMOVED***
                style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
                required
              />
              ***REMOVED***errors.horaInicio && (
                <p className="text-red-500 text-xs mt-1">***REMOVED***errors.horaInicio***REMOVED***</p>
              )***REMOVED***
            </div>

            <div className="w-full min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                Hora de fin
              </label>
              <input
                type="time"
                value=***REMOVED***formData.horaFin***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('horaFin', e.target.value)***REMOVED***
                className=***REMOVED***`$***REMOVED***inputClasses***REMOVED*** $***REMOVED***errors.horaFin ? 'border-red-500' : 'border-gray-300'***REMOVED***`***REMOVED***
                style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
                required
              />
              ***REMOVED***errors.horaFin && (
                <p className="text-red-500 text-xs mt-1">***REMOVED***errors.horaFin***REMOVED***</p>
              )***REMOVED***
            </div>
          </div>
        </div>

        ***REMOVED***/* GANANCIAS RESPONSIVAS */***REMOVED***
        <div className="w-full">
          <div className=***REMOVED***`grid gap-4 $***REMOVED***isMobile ? 'grid-cols-1' : 'grid-cols-2'***REMOVED***`***REMOVED***>
            <div className="w-full min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                Ganancia total *
              </label>
              <input
                type="number"
                step="0.01"
                value=***REMOVED***formData.gananciaTotal***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('gananciaTotal', e.target.value)***REMOVED***
                className=***REMOVED***`$***REMOVED***inputClasses***REMOVED*** $***REMOVED***errors.gananciaTotal ? 'border-red-500' : 'border-gray-300'***REMOVED***`***REMOVED***
                style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
                placeholder="0.00"
                required
              />
              ***REMOVED***errors.gananciaTotal && (
                <p className="text-red-500 text-xs mt-1">***REMOVED***errors.gananciaTotal***REMOVED***</p>
              )***REMOVED***
            </div>

            <div className="w-full min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Heart size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                Propinas
              </label>
              <input
                type="number"
                step="0.01"
                value=***REMOVED***formData.propinas***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('propinas', e.target.value)***REMOVED***
                className=***REMOVED***`$***REMOVED***inputClasses***REMOVED*** border-gray-300`***REMOVED***
                style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        ***REMOVED***/* DATOS ADICIONALES RESPONSIVOS */***REMOVED***
        <div className="w-full">
          <div className=***REMOVED***`grid gap-4 $***REMOVED***isMobile ? 'grid-cols-1' : 'grid-cols-2'***REMOVED***`***REMOVED***>
            <div className="w-full min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                Número de pedidos
              </label>
              <input
                type="number"
                value=***REMOVED***formData.numeroPedidos***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('numeroPedidos', e.target.value)***REMOVED***
                className=***REMOVED***`$***REMOVED***inputClasses***REMOVED*** border-gray-300`***REMOVED***
                style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
                placeholder="0"
                min="0"
              />
            </div>

            <div className="w-full min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Navigation size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                Kilómetros recorridos
              </label>
              <input
                type="number"
                step="0.1"
                value=***REMOVED***formData.kilometros***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('kilometros', e.target.value)***REMOVED***
                className=***REMOVED***`$***REMOVED***inputClasses***REMOVED*** border-gray-300`***REMOVED***
                style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
                placeholder="0.0"
                min="0"
              />
            </div>
          </div>
        </div>

        ***REMOVED***/* Gastos de combustible - SOLO SI EL VEHÍCULO LO REQUIERE */***REMOVED***
        ***REMOVED***mostrarCombustible && (
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Fuel size=***REMOVED***16***REMOVED*** className="inline mr-2" />
              Gastos de combustible
            </label>
            <input
              type="number"
              step="0.01"
              value=***REMOVED***formData.gastoCombustible***REMOVED***
              onChange=***REMOVED***(e) => handleInputChange('gastoCombustible', e.target.value)***REMOVED***
              className=***REMOVED***`$***REMOVED***inputClasses***REMOVED*** border-gray-300`***REMOVED***
              style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
              placeholder="0.00"
              min="0"
            />
          </div>
        )***REMOVED***

        ***REMOVED***/* Observaciones */***REMOVED***
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas (opcional)
          </label>
          <textarea
            value=***REMOVED***formData.observaciones***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('observaciones', e.target.value)***REMOVED***
            className=***REMOVED***`$***REMOVED***inputClasses***REMOVED*** resize-none border-gray-300`***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            rows=***REMOVED***isMobile ? "3" : "2"***REMOVED***
            placeholder="Notas adicionales sobre el turno..."
          />
        </div>

        ***REMOVED***/* BOTONES COMPLETAMENTE RESPONSIVOS */***REMOVED***
        <div className=***REMOVED***`
          w-full pt-6 
          $***REMOVED***isMobile ? 'flex flex-col space-y-4 px-0' : 'flex space-x-3'***REMOVED***
        `***REMOVED***>
          <button
            type="button"
            onClick=***REMOVED***onCancel***REMOVED***
            disabled=***REMOVED***loading***REMOVED***
            className=***REMOVED***`
              border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 
              text-sm font-medium rounded-lg transition-colors disabled:opacity-50
              $***REMOVED***isMobile ? 'py-4 px-4 w-full order-2' : 'flex-1 py-2 px-4'***REMOVED***
            `***REMOVED***
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled=***REMOVED***loading***REMOVED***
            className=***REMOVED***`
              text-white rounded-lg hover:opacity-90 text-sm font-medium 
              disabled:opacity-50 transition-colors
              $***REMOVED***isMobile ? 'py-4 px-4 w-full order-1' : 'flex-1 py-2 px-4'***REMOVED***
            `***REMOVED***
            style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
            onMouseEnter=***REMOVED***(e) => ***REMOVED***
              if (!loading) ***REMOVED***
                e.target.style.backgroundColor = colors.primaryDark;
              ***REMOVED***
            ***REMOVED******REMOVED***
            onMouseLeave=***REMOVED***(e) => ***REMOVED***
              if (!loading) ***REMOVED***
                e.target.style.backgroundColor = colors.primary;
              ***REMOVED***
            ***REMOVED******REMOVED***
          >
            ***REMOVED***loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Guardando...</span>
              </div>
            ) : (
              turno ? 'Actualizar Turno' : 'Crear Turno'
            )***REMOVED***
          </button>
        </div>
      </form>

      ***REMOVED***/* ESTILOS ADICIONALES PARA MÓVIL */***REMOVED***
      ***REMOVED***isMobile && (
        <style jsx>***REMOVED***`
          .mobile-form input[type="date"],
          .mobile-form input[type="time"],
          .mobile-form input[type="number"],
          .mobile-form select,
          .mobile-form textarea ***REMOVED***
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: none;
            font-size: 16px !important; /* Prevenir zoom en iOS */
          ***REMOVED***
          
          .mobile-form input[type="time"]::-webkit-calendar-picker-indicator ***REMOVED***
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
          ***REMOVED***
        `***REMOVED***</style>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default TurnoDeliveryForm;