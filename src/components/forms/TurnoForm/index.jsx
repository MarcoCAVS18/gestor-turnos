// src/components/forms/TurnoForm/index.jsx - ACTUALIZADO CON SMOKO

import React, ***REMOVED*** useState, useEffect, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** Briefcase, Calendar, Clock, FileText, Coffee ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

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
  const ***REMOVED*** smokoEnabled, smokoMinutes ***REMOVED*** = useApp(); // NUEVO

  // Estados del formulario - ACTUALIZADO
  const [formData, setFormData] = useState(***REMOVED***
    trabajoId: trabajoId || '',
    fechaInicio: '',
    horaInicio: '',
    horaFin: '',
    cruzaMedianoche: false,
    fechaFin: '',
    tuvoDescanso: true, // NUEVO - por defecto asume que tuvo descanso
    notas: ''
  ***REMOVED***);

  const [errors, setErrors] = useState(***REMOVED******REMOVED***);

  // Función para calcular duración del turno - ACTUALIZADA
  const calcularDuracionTurno = useCallback(() => ***REMOVED***
    if (!formData.horaInicio || !formData.horaFin) return null;
    
    const [horaI, minI] = formData.horaInicio.split(':').map(Number);
    const [horaF, minF] = formData.horaFin.split(':').map(Number);
    
    let totalMinutos = (horaF * 60 + minF) - (horaI * 60 + minI);
    if (totalMinutos <= 0) totalMinutos += 24 * 60; // Turno nocturno
    
    // Aplicar descuento de smoko si está habilitado
    let minutosReales = totalMinutos;
    if (smokoEnabled && formData.tuvoDescanso && totalMinutos > smokoMinutes) ***REMOVED***
      minutosReales = totalMinutos - smokoMinutes;
    ***REMOVED***
    
    return ***REMOVED***
      totalMinutos,
      minutosReales,
      horas: Math.floor(minutosReales / 60),
      minutos: minutosReales % 60,
      smokoAplicado: smokoEnabled && formData.tuvoDescanso && totalMinutos > smokoMinutes
    ***REMOVED***;
  ***REMOVED***, [formData.horaInicio, formData.horaFin, formData.tuvoDescanso, smokoEnabled, smokoMinutes]);

  const duracion = calcularDuracionTurno();

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

  // Inicializar formulario - ACTUALIZADO
  useEffect(() => ***REMOVED***
    if (turno) ***REMOVED***
      setFormData(***REMOVED***
        trabajoId: turno.trabajoId || '',
        fechaInicio: turno.fechaInicio || turno.fecha || '',
        horaInicio: turno.horaInicio || '',
        horaFin: turno.horaFin || '',
        cruzaMedianoche: turno.cruzaMedianoche || false,
        fechaFin: turno.fechaFin || '',
        tuvoDescanso: turno.tuvoDescanso !== undefined ? turno.tuvoDescanso : true, // NUEVO
        notas: turno.notas || ''
      ***REMOVED***);
    ***REMOVED*** else if (fechaInicial) ***REMOVED***
      const fechaStr = fechaInicial instanceof Date 
        ? fechaInicial.toISOString().split('T')[0] 
        : fechaInicial;
      setFormData(prev => (***REMOVED*** 
        ...prev, 
        fechaInicio: fechaStr,
        tuvoDescanso: true // NUEVO - por defecto en turnos nuevos
      ***REMOVED***));
    ***REMOVED***
  ***REMOVED***, [turno, fechaInicial]);

  // Resto del código igual hasta el JSX...

  const inputClasses = `
    w-full px-3 py-3 border rounded-lg text-base transition-colors
    focus:outline-none focus:ring-2 focus:border-transparent
    $***REMOVED***isMobile ? 'text-base min-h-[44px]' : 'text-sm py-2'***REMOVED***
  `;

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
        ***REMOVED***/* Selección de trabajo */***REMOVED***
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
            
            ***REMOVED***trabajosTradicionales.length > 0 && (
              <optgroup label="Trabajos Tradicionales">
                ***REMOVED***trabajosTradicionales.map(trabajo => (
                  <option key=***REMOVED***trabajo.id***REMOVED*** value=***REMOVED***trabajo.id***REMOVED***>
                    ***REMOVED***trabajo.nombre***REMOVED***
                  </option>
                ))***REMOVED***
              </optgroup>
            )***REMOVED***
            
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

***REMOVED***/* NUEVA SECCIÓN: DESCANSO (SMOKO) - OPTIMIZADA PARA MÓVIL */***REMOVED***
***REMOVED***smokoEnabled && duracion && duracion.totalMinutos > smokoMinutes && (
  <div className="w-full">
    <div 
      className=***REMOVED***`
        rounded-lg border
        $***REMOVED***isMobile ? 'p-4 space-y-4' : 'p-4 space-y-3'***REMOVED***
      `***REMOVED***
      style=***REMOVED******REMOVED*** 
        backgroundColor: colors.transparent5,
        borderColor: colors.transparent20 
      ***REMOVED******REMOVED***
    >
      ***REMOVED***/* Header con título y toggle customizado */***REMOVED***
      <div className=***REMOVED***`
        flex items-center justify-between 
        $***REMOVED***isMobile ? 'pb-2 border-b border-gray-200' : ''***REMOVED***
      `***REMOVED***>
        <div className="flex items-center flex-1">
          <Coffee 
            size=***REMOVED***isMobile ? 18 : 16***REMOVED*** 
            style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** 
            className="mr-2 flex-shrink-0" 
          />
          <span className=***REMOVED***`font-medium text-gray-700 $***REMOVED***isMobile ? 'text-base' : 'text-sm'***REMOVED***`***REMOVED***>
            ¿Tuviste descanso?
          </span>
        </div>

        ***REMOVED***/* Toggle Switch Customizado */***REMOVED***
        <label className="relative inline-flex items-center cursor-pointer">
          ***REMOVED***/* Input oculto */***REMOVED***
          <input
            type="checkbox"
            checked=***REMOVED***formData.tuvoDescanso***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('tuvoDescanso', e.target.checked)***REMOVED***
            className="sr-only peer"
          />
          
          ***REMOVED***/* Switch personalizado */***REMOVED***
          <div className=***REMOVED***`
            relative bg-gray-200 rounded-full peer 
            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2
            peer-checked:after:translate-x-full peer-checked:after:border-white 
            after:content-[''] after:absolute after:bg-white after:border-gray-300 
            after:border after:rounded-full after:transition-all
            $***REMOVED***isMobile 
              ? 'w-12 h-6 after:top-[2px] after:left-[2px] after:h-5 after:w-5' 
              : 'w-10 h-5 after:top-[1px] after:left-[1px] after:h-4 after:w-4'
            ***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED***
            '--tw-ring-color': colors.primary,
            backgroundColor: formData.tuvoDescanso ? colors.primary : undefined
          ***REMOVED******REMOVED***
          />
          
          ***REMOVED***/* Texto del toggle */***REMOVED***
          <span className=***REMOVED***`
            ml-3 font-medium
            $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***
            $***REMOVED***formData.tuvoDescanso ? 'text-green-700' : 'text-gray-600'***REMOVED***
          `***REMOVED***>
            ***REMOVED***formData.tuvoDescanso ? 'Sí' : 'No'***REMOVED***
          </span>
        </label>
      </div>

      ***REMOVED***/* Información del cálculo - LAYOUT RESPONSIVO */***REMOVED***
      <div className=***REMOVED***`
        $***REMOVED***isMobile ? 'space-y-3' : 'space-y-2'***REMOVED***
        $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***
        text-gray-600
      `***REMOVED***>
        ***REMOVED***/* Tiempo programado */***REMOVED***
        <div className=***REMOVED***`
          flex items-center justify-between p-2 rounded
          $***REMOVED***isMobile ? 'bg-blue-50' : 'bg-gray-50'***REMOVED***
        `***REMOVED***>
          <div className="flex items-center">
            <div className=***REMOVED***`
              rounded-full flex items-center justify-center mr-2
              $***REMOVED***isMobile ? 'w-6 h-6 text-xs' : 'w-5 h-5 text-xs'***REMOVED***
            `***REMOVED***
            style=***REMOVED******REMOVED*** backgroundColor: colors.transparent20, color: colors.primary ***REMOVED******REMOVED***>
              <Clock size=***REMOVED***isMobile ? 12 : 10***REMOVED*** />
            </div>
            <span className=***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***>Tiempo programado:</span>
          </div>
          <span className=***REMOVED***`font-semibold $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***>
            ***REMOVED***Math.floor(duracion.totalMinutos / 60)***REMOVED***h ***REMOVED***duracion.totalMinutos % 60***REMOVED***min
          </span>
        </div>

        ***REMOVED***formData.tuvoDescanso ? (
          <>
            ***REMOVED***/* Descanso configurado */***REMOVED***
            <div className=***REMOVED***`
              flex items-center justify-between p-2 rounded
              $***REMOVED***isMobile ? 'bg-orange-50' : 'bg-gray-50'***REMOVED***
            `***REMOVED***>
              <div className="flex items-center">
                <div className=***REMOVED***`
                  rounded-full flex items-center justify-center mr-2
                  $***REMOVED***isMobile ? 'w-6 h-6' : 'w-5 h-5'***REMOVED***
                `***REMOVED***
                style=***REMOVED******REMOVED*** backgroundColor: '#FED7AA', color: '#EA580C' ***REMOVED******REMOVED***>
                  <Coffee size=***REMOVED***isMobile ? 10 : 8***REMOVED*** />
                </div>
                <span className=***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***>Descanso configurado:</span>
              </div>
              <span className=***REMOVED***`font-semibold $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***>
                ***REMOVED***smokoMinutes***REMOVED*** minutos
              </span>
            </div>

            ***REMOVED***/* Tiempo pagado */***REMOVED***
            <div className=***REMOVED***`
              flex items-center justify-between p-2 rounded border
              $***REMOVED***isMobile ? 'bg-green-50 border-green-200' : 'bg-gray-50'***REMOVED***
            `***REMOVED***
            style=***REMOVED******REMOVED*** 
              backgroundColor: isMobile ? colors.transparent10 : undefined,
              borderColor: isMobile ? colors.transparent30 : undefined
            ***REMOVED******REMOVED***>
              <div className="flex items-center">
                <div className=***REMOVED***`
                  rounded-full flex items-center justify-center mr-2
                  $***REMOVED***isMobile ? 'w-6 h-6' : 'w-5 h-5'***REMOVED***
                `***REMOVED***
                style=***REMOVED******REMOVED*** backgroundColor: colors.primary, color: 'white' ***REMOVED******REMOVED***>
                  <span className=***REMOVED***`font-bold $***REMOVED***isMobile ? 'text-xs' : 'text-[10px]'***REMOVED***`***REMOVED***>$</span>
                </div>
                <span className=***REMOVED***`font-medium $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***
                      style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                  Tiempo pagado:
                </span>
              </div>
              <span className=***REMOVED***`font-bold $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***
                    style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                ***REMOVED***duracion.horas***REMOVED***h ***REMOVED***duracion.minutos***REMOVED***min
              </span>
            </div>
          </>
        ) : (
          /* Sin descuento aplicado */
          <div className=***REMOVED***`
            flex items-center justify-between p-2 rounded border
            $***REMOVED***isMobile ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED*** 
            backgroundColor: isMobile ? colors.transparent10 : undefined,
            borderColor: isMobile ? colors.transparent30 : undefined
          ***REMOVED******REMOVED***>
            <div className="flex items-center">
              <div className=***REMOVED***`
                rounded-full flex items-center justify-center mr-2
                $***REMOVED***isMobile ? 'w-6 h-6' : 'w-5 h-5'***REMOVED***
              `***REMOVED***
              style=***REMOVED******REMOVED*** backgroundColor: colors.primary, color: 'white' ***REMOVED******REMOVED***>
                <span className=***REMOVED***`font-bold $***REMOVED***isMobile ? 'text-xs' : 'text-[10px]'***REMOVED***`***REMOVED***>$</span>
              </div>
              <span className=***REMOVED***`font-medium $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***
                    style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                Tiempo pagado:
              </span>
            </div>
            <div className="text-right">
              <div className=***REMOVED***`font-bold $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***
                   style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                ***REMOVED***Math.floor(duracion.totalMinutos / 60)***REMOVED***h ***REMOVED***duracion.totalMinutos % 60***REMOVED***min
              </div>
              <div className=***REMOVED***`$***REMOVED***isMobile ? 'text-xs' : 'text-[10px]'***REMOVED*** text-gray-500`***REMOVED***>
                (sin descuento)
              </div>
            </div>
          </div>
        )***REMOVED***

        ***REMOVED***/* Mensaje informativo en móvil */***REMOVED***
        ***REMOVED***isMobile && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600 text-center">
            💡 El descuento se aplica automáticamente según tu configuración
          </div>
        )***REMOVED***
      </div>
    </div>
  </div>
)***REMOVED***

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
            font-size: 16px !important;
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