// src/components/forms/TurnoForm/index.jsx - ACTUALIZADO PARA MOSTRAR TODOS LOS TRABAJOS

import React, ***REMOVED*** useState, useEffect, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** Briefcase, Calendar, Clock, FileText ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';

const TurnoForm = (***REMOVED***
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
    cruzaMedianoche: false,
    fechaFin: '',
    notas: ''
  ***REMOVED***);

  const [errors, setErrors] = useState(***REMOVED******REMOVED***);

  // Inicializar formulario
  useEffect(() => ***REMOVED***
    if (turno) ***REMOVED***
      setFormData(***REMOVED***
        trabajoId: turno.trabajoId || '',
        fechaInicio: turno.fechaInicio || turno.fecha || '',
        horaInicio: turno.horaInicio || '',
        horaFin: turno.horaFin || '',
        cruzaMedianoche: turno.cruzaMedianoche || false,
        fechaFin: turno.fechaFin || '',
        notas: turno.notas || ''
      ***REMOVED***);
    ***REMOVED*** else if (fechaInicial) ***REMOVED***
      const fechaStr = fechaInicial instanceof Date 
        ? fechaInicial.toISOString().split('T')[0] 
        : fechaInicial;
      setFormData(prev => (***REMOVED*** ...prev, fechaInicio: fechaStr ***REMOVED***));
    ***REMOVED***
  ***REMOVED***, [turno, fechaInicial]);

  // Detectar turnos nocturnos automáticamente
  useEffect(() => ***REMOVED***
    if (formData.horaInicio && formData.horaFin) ***REMOVED***
      const [horaI] = formData.horaInicio.split(':').map(Number);
      const [horaF] = formData.horaFin.split(':').map(Number);
      
      const esNocturno = horaI > horaF;
      
      if (esNocturno !== formData.cruzaMedianoche) ***REMOVED***
        setFormData(prev => (***REMOVED***
          ...prev,
          cruzaMedianoche: esNocturno,
          fechaFin: esNocturno && prev.fechaInicio 
            ? calcularFechaFin(prev.fechaInicio)
            : ''
        ***REMOVED***));
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***, [formData.horaInicio, formData.horaFin, formData.fechaInicio, formData.cruzaMedianoche]);

  const calcularFechaFin = (fechaInicio) => ***REMOVED***
    const fecha = new Date(fechaInicio + 'T00:00:00');
    fecha.setDate(fecha.getDate() + 1);
    return fecha.toISOString().split('T')[0];
  ***REMOVED***;

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  ***REMOVED***;

  const handleSubmit = (e) => ***REMOVED***
    e.preventDefault();
    if (validarFormulario()) ***REMOVED***
      onSubmit(formData);
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

  // Separar trabajos por tipo para mostrarlos organizados
  const trabajosTradicionales = trabajos.filter(t => t.tipo !== 'delivery');
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
        ***REMOVED***/* Selección de trabajo - ACTUALIZADO */***REMOVED***
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Briefcase size=***REMOVED***16***REMOVED*** className="inline mr-2" />
            Trabajo
          </label>
          <select
            value=***REMOVED***formData.trabajoId***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('trabajoId', e.target.value)***REMOVED***
            className=***REMOVED***`$***REMOVED***inputClasses***REMOVED*** $***REMOVED***errors.trabajoId ? 'border-red-500' : 'border-gray-300'***REMOVED***`***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            required
          >
            <option value="">Seleccionar trabajo</option>
            
            ***REMOVED***/* Trabajos tradicionales */***REMOVED***
            ***REMOVED***trabajosTradicionales.length > 0 && (
              <optgroup label="Trabajos Tradicionales">
                ***REMOVED***trabajosTradicionales.map(trabajo => (
                  <option key=***REMOVED***trabajo.id***REMOVED*** value=***REMOVED***trabajo.id***REMOVED***>
                    ***REMOVED***trabajo.nombre***REMOVED***
                  </option>
                ))***REMOVED***
              </optgroup>
            )***REMOVED***
            
            ***REMOVED***/* Trabajos de delivery */***REMOVED***
            ***REMOVED***trabajosDelivery.length > 0 && (
              <optgroup label="Trabajos de Delivery">
                ***REMOVED***trabajosDelivery.map(trabajo => (
                  <option key=***REMOVED***trabajo.id***REMOVED*** value=***REMOVED***trabajo.id***REMOVED***>
                    ***REMOVED***trabajo.nombre***REMOVED***
                  </option>
                ))***REMOVED***
              </optgroup>
            )***REMOVED***
          </select>
          ***REMOVED***errors.trabajoId && (
            <p className="text-red-500 text-xs mt-1">***REMOVED***errors.trabajoId***REMOVED***</p>
          )***REMOVED***
        </div>

        ***REMOVED***/* CONTENEDOR DE FECHAS RESPONSIVO */***REMOVED***
        <div className="w-full">
          <div className=***REMOVED***`grid gap-4 $***REMOVED***isMobile ? 'grid-cols-1' : 'grid-cols-2'***REMOVED***`***REMOVED***>
            ***REMOVED***/* Fecha de inicio */***REMOVED***
            <div className="w-full min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                Fecha de inicio
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

            ***REMOVED***/* Fecha de fin - solo mostrar si es nocturno */***REMOVED***
            ***REMOVED***formData.cruzaMedianoche && (
              <div className="w-full min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                  Fecha de fin
                </label>
                <input
                  type="date"
                  value=***REMOVED***formData.fechaFin || calcularFechaFin(formData.fechaInicio)***REMOVED***
                  onChange=***REMOVED***(e) => handleInputChange('fechaFin', e.target.value)***REMOVED***
                  className=***REMOVED***`$***REMOVED***inputClasses***REMOVED*** border-gray-300`***REMOVED***
                  style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se calcula automáticamente para turnos nocturnos
                </p>
              </div>
            )***REMOVED***
          </div>
        </div>

        ***REMOVED***/* CONTENEDOR DE HORAS RESPONSIVO */***REMOVED***
        <div className="w-full">
          <div className=***REMOVED***`grid gap-4 $***REMOVED***isMobile ? 'grid-cols-1' : 'grid-cols-2'***REMOVED***`***REMOVED***>
            ***REMOVED***/* Hora de inicio */***REMOVED***
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

            ***REMOVED***/* Hora de fin */***REMOVED***
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

        ***REMOVED***/* Campo de notas */***REMOVED***
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText size=***REMOVED***16***REMOVED*** className="inline mr-2" />
            Notas (opcional)
          </label>
          <textarea
            value=***REMOVED***formData.notas***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('notas', e.target.value)***REMOVED***
            placeholder="Agregar notas sobre este turno..."
            className=***REMOVED***`$***REMOVED***inputClasses***REMOVED*** border-gray-300 resize-none`***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            rows=***REMOVED***3***REMOVED***
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
                <div 
                  className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                />
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

export default TurnoForm;