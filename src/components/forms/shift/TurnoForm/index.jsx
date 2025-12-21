// src/components/forms/shift/TurnoForm/index.jsx - REFACTORIZADO CON BaseForm

import React, ***REMOVED*** useState, useEffect, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** Briefcase, Calendar, Clock, FileText, Coffee, Pencil, Check ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';
import ***REMOVED*** useApp ***REMOVED*** from '../../../../contexts/AppContext';
import ***REMOVED*** createSafeDate, calculateShiftHours ***REMOVED*** from '../../../../utils/time';
import BaseForm, ***REMOVED*** FormSection, FormGrid, FormField, FormLabel, FormError, getInputClasses ***REMOVED*** from '../../base/BaseForm';
import Flex from '../../../ui/Flex';

const TurnoForm = (***REMOVED***
  id,
  turno,
  trabajoId,
  trabajos = [],
  onSubmit,
  onTrabajoChange,
  onDirtyChange, // Nueva prop
  isMobile = false,
  fechaInicial
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const ***REMOVED*** smokoEnabled, smokoMinutes ***REMOVED*** = useApp(); // NUEVO

  const [initialFormData, setInitialFormData] = useState(null);
  const [formData, setFormData] = useState(***REMOVED***
    trabajoId: trabajoId || '',
    fechaInicio: '',
    horaInicio: '',
    horaFin: '',
    cruzaMedianoche: false,
    fechaFin: '',
    tuvoDescanso: true, // NUEVO - por defecto asume que tuvo descanso
    descansoMinutos: smokoMinutes, // NUEVO - editable
    notas: ''
  ***REMOVED***);

  const [isEditingDescanso, setIsEditingDescanso] = useState(false);
  const [errors, setErrors] = useState(***REMOVED******REMOVED***);

  // Efecto para detectar si el formulario está "sucio" (modificado)
  useEffect(() => ***REMOVED***
    if (!initialFormData || !onDirtyChange) return;

    // Solo se considera sucio si es un turno existente
    if (turno) ***REMOVED***
      const isDirty =
        formData.trabajoId !== initialFormData.trabajoId ||
        formData.fechaInicio !== initialFormData.fechaInicio ||
        formData.horaInicio !== initialFormData.horaInicio ||
        formData.horaFin !== initialFormData.horaFin ||
        formData.tuvoDescanso !== initialFormData.tuvoDescanso ||
        Number(formData.descansoMinutos) !== Number(initialFormData.descansoMinutos) ||
        formData.notas !== initialFormData.notas;
      onDirtyChange(isDirty);
    ***REMOVED*** else ***REMOVED***
      onDirtyChange(true); // Para nuevos turnos, el botón siempre está activo
    ***REMOVED***
  ***REMOVED***, [formData, initialFormData, onDirtyChange, turno]);


  // Función para calcular duración del turno - USANDO UTILIDAD CENTRALIZADA
  const calcularDuracionTurno = useCallback(() => ***REMOVED***
    if (!formData.horaInicio || !formData.horaFin) return null;

    const totalHoras = calculateShiftHours(formData.horaInicio, formData.horaFin);
    const totalMinutos = Math.round(totalHoras * 60);

    // Aplicar descuento de smoko si está habilitado
    let minutosReales = totalMinutos;
    const descanso = formData.descansoMinutos || 0;

    if (smokoEnabled && formData.tuvoDescanso && totalMinutos > descanso) ***REMOVED***
      minutosReales = totalMinutos - descanso;
    ***REMOVED***

    return ***REMOVED***
      totalMinutos,
      minutosReales,
      horas: Math.floor(minutosReales / 60),
      minutos: minutosReales % 60,
      smokoAplicado: smokoEnabled && formData.tuvoDescanso && totalMinutos > descanso,
      minutosDescontados: descanso
    ***REMOVED***;
  ***REMOVED***, [formData.horaInicio, formData.horaFin, formData.tuvoDescanso, smokoEnabled, formData.descansoMinutos]);

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
    const fecha = createSafeDate(fechaInicio);
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
    let initialData;
    if (turno) ***REMOVED***
      initialData = ***REMOVED***
        trabajoId: turno.trabajoId || '',
        fechaInicio: turno.fechaInicio || turno.fecha || '',
        horaInicio: turno.horaInicio || '',
        horaFin: turno.horaFin || '',
        cruzaMedianoche: turno.cruzaMedianoche || false,
        fechaFin: turno.fechaFin || '',
        tuvoDescanso: turno.tuvoDescanso !== undefined ? turno.tuvoDescanso : true,
        descansoMinutos: turno.descansoMinutos !== undefined ? turno.descansoMinutos : smokoMinutes,
        notas: turno.notas || ''
      ***REMOVED***;
    ***REMOVED*** else ***REMOVED***
      const fechaStr = fechaInicial 
        ? (fechaInicial instanceof Date ? fechaInicial.toISOString().split('T')[0] : fechaInicial)
        : new Date().toISOString().split('T')[0];

      initialData = ***REMOVED***
        trabajoId: trabajoId || '',
        fechaInicio: fechaStr,
        horaInicio: '',
        horaFin: '',
        cruzaMedianoche: false,
        fechaFin: '',
        tuvoDescanso: true,
        descansoMinutos: smokoMinutes,
        notas: ''
      ***REMOVED***;
    ***REMOVED***
    setFormData(initialData);
    setInitialFormData(initialData);
  ***REMOVED***, [turno, trabajoId, fechaInicial, smokoMinutes]);

  const trabajosTradicionales = trabajos.filter(t => t.tipo !== 'delivery');
  const trabajosDelivery = trabajos.filter(t => t.tipo === 'delivery');

  return (
    <BaseForm
      id=***REMOVED***id***REMOVED***
      onSubmit=***REMOVED***handleSubmit***REMOVED***
      isMobile=***REMOVED***isMobile***REMOVED***
    >
      ***REMOVED***/* Selección de trabajo */***REMOVED***
      <FormSection>
        <FormLabel icon=***REMOVED***Briefcase***REMOVED***>Trabajo</FormLabel>
        <select
          value=***REMOVED***formData.trabajoId***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('trabajoId', e.target.value)***REMOVED***
          className=***REMOVED***getInputClasses(isMobile, errors.trabajoId)***REMOVED***
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
        <FormError error=***REMOVED***errors.trabajoId***REMOVED*** />
      </FormSection>

      ***REMOVED***/* CONTENEDOR DE FECHAS RESPONSIVO */***REMOVED***
      <FormGrid columns=***REMOVED***2***REMOVED***>
        ***REMOVED***/* Fecha de inicio */***REMOVED***
        <FormField className=***REMOVED***!formData.cruzaMedianoche ? 'col-span-2' : ''***REMOVED***>
          <FormLabel icon=***REMOVED***Calendar***REMOVED***>Fecha de inicio</FormLabel>
          <input
            type="date"
            value=***REMOVED***formData.fechaInicio***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('fechaInicio', e.target.value)***REMOVED***
            className=***REMOVED***getInputClasses(isMobile, errors.fechaInicio)***REMOVED***
            style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
            required
          />
          <FormError error=***REMOVED***errors.fechaInicio***REMOVED*** />
        </FormField>

        ***REMOVED***/* Fecha de fin - solo mostrar si es nocturno */***REMOVED***
        ***REMOVED***formData.cruzaMedianoche && (
          <FormField>
            <FormLabel icon=***REMOVED***Calendar***REMOVED***>Fecha de fin</FormLabel>
            <input
              type="date"
              value=***REMOVED***formData.fechaFin || calcularFechaFin(formData.fechaInicio)***REMOVED***
              onChange=***REMOVED***(e) => handleInputChange('fechaFin', e.target.value)***REMOVED***
              className=***REMOVED***getInputClasses(isMobile)***REMOVED***
              style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Se calcula automáticamente para turnos nocturnos
            </p>
          </FormField>
        )***REMOVED***
      </FormGrid>

      ***REMOVED***/* CONTENEDOR DE HORAS RESPONSIVO */***REMOVED***
      <FormGrid columns=***REMOVED***2***REMOVED***>
        ***REMOVED***/* Hora de inicio */***REMOVED***
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

        ***REMOVED***/* Hora de fin */***REMOVED***
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

***REMOVED***/* NUEVA SECCIÓN: DESCANSO (SMOKO) - OPTIMIZADA PARA MÓVIL */***REMOVED***
***REMOVED***smokoEnabled && duracion && duracion.totalMinutos > 0 && (
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
      <Flex variant="between" className=***REMOVED***`
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
      </Flex>

      ***REMOVED***/* Información del cálculo - LAYOUT RESPONSIVO */***REMOVED***
      <div className=***REMOVED***`
        $***REMOVED***isMobile ? 'space-y-3' : 'space-y-2'***REMOVED***
        $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***
        text-gray-600
      `***REMOVED***>
        ***REMOVED***/* Tiempo programado */***REMOVED***
        <Flex variant="between" className=***REMOVED***`
          p-2 rounded
          $***REMOVED***isMobile ? 'bg-blue-50' : 'bg-gray-50'***REMOVED***
        `***REMOVED***>
          <div className="flex items-center">
            <Flex variant="center" className=***REMOVED***`
              rounded-full mr-2
              $***REMOVED***isMobile ? 'w-6 h-6 text-xs' : 'w-5 h-5 text-xs'***REMOVED***
            `***REMOVED***
            style=***REMOVED******REMOVED*** backgroundColor: colors.transparent20, color: colors.primary ***REMOVED******REMOVED***>
              <Clock size=***REMOVED***isMobile ? 12 : 10***REMOVED*** />
            </Flex>
            <span className=***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***>Tiempo programado:</span>
          </div>
          <span className=***REMOVED***`font-semibold $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***>
            ***REMOVED***Math.floor(duracion.totalMinutos / 60)***REMOVED***h ***REMOVED***duracion.totalMinutos % 60***REMOVED***min
          </span>
        </Flex>

        ***REMOVED***formData.tuvoDescanso ? (
          <>
            ***REMOVED***/* Descanso configurado (AHORA EDITABLE CON CLIC) */***REMOVED***
            <Flex variant="between" className=***REMOVED***`p-2 rounded items-center $***REMOVED***isMobile ? 'bg-orange-50' : 'bg-gray-50'***REMOVED***`***REMOVED***>
              <div className="flex items-center">
                <Flex variant="center" className=***REMOVED***`
                  rounded-full mr-2
                  $***REMOVED***isMobile ? 'w-6 h-6' : 'w-5 h-5'***REMOVED***
                `***REMOVED***
                style=***REMOVED******REMOVED*** backgroundColor: '#FED7AA', color: '#EA580C' ***REMOVED******REMOVED***>
                  <Coffee size=***REMOVED***isMobile ? 10 : 8***REMOVED*** />
                </Flex>
                <span className=***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***>Descanso:</span>
              </div>

              ***REMOVED***isEditingDescanso ? (
                <div className="flex items-center">
                  <input
                    type="number"
                    value=***REMOVED***formData.descansoMinutos***REMOVED***
                    onChange=***REMOVED***(e) => handleInputChange('descansoMinutos', e.target.value === '' ? 0 : parseInt(e.target.value, 10))***REMOVED***
                    className=***REMOVED***`$***REMOVED***getInputClasses(isMobile)***REMOVED*** py-1 px-2 w-20 text-center font-semibold`***REMOVED***
                    style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
                    autoFocus
                    onBlur=***REMOVED***() => setIsEditingDescanso(false)***REMOVED***
                  />
                  <button type="button" onClick=***REMOVED***() => setIsEditingDescanso(false)***REMOVED*** className="ml-2 text-green-600">
                    <Check size=***REMOVED***18***REMOVED*** />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className=***REMOVED***`font-semibold $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***>
                    ***REMOVED***formData.descansoMinutos***REMOVED*** minutos
                  </span>
                  <button type="button" onClick=***REMOVED***() => setIsEditingDescanso(true)***REMOVED*** className="ml-2 text-gray-500 hover:text-gray-700">
                    <Pencil size=***REMOVED***14***REMOVED*** />
                  </button>
                </div>
              )***REMOVED***
            </Flex>

            ***REMOVED***/* Tiempo pagado */***REMOVED***
            <Flex variant="between" className=***REMOVED***`
              p-2 rounded border
              $***REMOVED***isMobile ? 'bg-green-50 border-green-200' : 'bg-gray-50'***REMOVED***
            `***REMOVED***
            style=***REMOVED******REMOVED*** 
              backgroundColor: isMobile ? colors.transparent10 : undefined,
              borderColor: isMobile ? colors.transparent30 : undefined
            ***REMOVED******REMOVED***>
              <Flex variant="center">
                <Flex variant="center" className=***REMOVED***`
                  rounded-full mr-2
                  $***REMOVED***isMobile ? 'w-6 h-6' : 'w-5 h-5'***REMOVED***
                `***REMOVED***
                style=***REMOVED******REMOVED*** backgroundColor: colors.primary, color: 'white' ***REMOVED******REMOVED***>
                  <span className=***REMOVED***`font-bold $***REMOVED***isMobile ? 'text-xs' : 'text-[10px]'***REMOVED***`***REMOVED***>$</span>
                </Flex>
                <span className=***REMOVED***`font-medium $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***
                      style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                  Tiempo pagado:
                </span>
              </Flex>
              <span className=***REMOVED***`font-bold $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***
                    style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                ***REMOVED***duracion.horas***REMOVED***h ***REMOVED***duracion.minutos***REMOVED***min
              </span>
            </Flex>
          </>
        ) : (
          /* Sin descuento aplicado */
          <Flex variant="between" className=***REMOVED***`
            p-2 rounded border
            $***REMOVED***isMobile ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED*** 
            backgroundColor: isMobile ? colors.transparent10 : undefined,
            borderColor: isMobile ? colors.transparent30 : undefined
          ***REMOVED******REMOVED***>
            <Flex variant="center">
              <Flex variant="center" className=***REMOVED***`
                rounded-full mr-2
                $***REMOVED***isMobile ? 'w-6 h-6' : 'w-5 h-5'***REMOVED***
              `***REMOVED***
              style=***REMOVED******REMOVED*** backgroundColor: colors.primary, color: 'white' ***REMOVED******REMOVED***>
                <span className=***REMOVED***`font-bold $***REMOVED***isMobile ? 'text-xs' : 'text-[10px]'***REMOVED***`***REMOVED***>$</span>
              </Flex>
              <span className=***REMOVED***`font-medium $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***
                    style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                Tiempo pagado:
              </span>
            </Flex>
            <div className="text-right">
              <div className=***REMOVED***`font-bold $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED***`***REMOVED***
                   style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                ***REMOVED***Math.floor(duracion.totalMinutos / 60)***REMOVED***h ***REMOVED***duracion.totalMinutos % 60***REMOVED***min
              </div>
              <div className=***REMOVED***`$***REMOVED***isMobile ? 'text-xs' : 'text-[10px]'***REMOVED*** text-gray-500`***REMOVED***>
                (sin descuento)
              </div>
            </div>
          </Flex>
        )***REMOVED***
      </div>
    </div>
  </div>
)***REMOVED***

      ***REMOVED***/* Campo de notas */***REMOVED***
      <FormSection>
        <FormLabel icon=***REMOVED***FileText***REMOVED***>Notas (opcional)</FormLabel>
        <textarea
          value=***REMOVED***formData.notas***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('notas', e.target.value)***REMOVED***
          placeholder="Agregar notas sobre este turno..."
          className=***REMOVED***`$***REMOVED***getInputClasses(isMobile)***REMOVED*** border-gray-300 resize-none`***REMOVED***
          style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
          rows=***REMOVED***3***REMOVED***
        />
      </FormSection>
    </BaseForm>
  );
***REMOVED***;

export default TurnoForm;