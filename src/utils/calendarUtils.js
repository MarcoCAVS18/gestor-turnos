// src/utils/calendarUtils.js - VERSIÓN ACTUALIZADA COMPLETA

import ***REMOVED*** createSafeDate ***REMOVED*** from './time';

/**
 * Crea una fecha local evitando problemas de zona horaria
 */
export const crearFechaLocal = (year, month, day) => new Date(year, month, day);

/**
 * Convierte una fecha local a formato ISO string (YYYY-MM-DD)
 */
export const fechaLocalAISO = (fecha) => ***REMOVED***
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `$***REMOVED***year***REMOVED***-$***REMOVED***month***REMOVED***-$***REMOVED***day***REMOVED***`;
***REMOVED***;

/**
 * Verifica si una fecha es hoy
 */
export const fechaEsHoy = (fecha, fechaActual) => ***REMOVED***
  return fecha.getDate() === fechaActual.getDate() &&
         fecha.getMonth() === fechaActual.getMonth() &&
         fecha.getFullYear() === fechaActual.getFullYear();
***REMOVED***;

/**
 * Obtiene los turnos del mes considerando turnos nocturnos
 */
export const obtenerTurnosMes = (turnos, anioActual, mesActual) => ***REMOVED***
  const primerDia = crearFechaLocal(anioActual, mesActual, 1);
  const ultimoDia = crearFechaLocal(anioActual, mesActual + 1, 0);
  
  const primerDiaStr = fechaLocalAISO(primerDia);
  const ultimoDiaStr = fechaLocalAISO(ultimoDia);
  
  // Filtrar turnos que ocurren en el mes (considerando turnos nocturnos)
  return turnos.filter(turno => ***REMOVED***
    // Fecha principal del turno
    const fechaPrincipal = turno.fechaInicio || turno.fecha;
    
    if (fechaPrincipal >= primerDiaStr && fechaPrincipal <= ultimoDiaStr) ***REMOVED***
      return true;
    ***REMOVED***
    
    // Si el turno tiene fechaFin diferente, verificar también esa fecha
    if (turno.fechaFin && turno.fechaFin !== fechaPrincipal) ***REMOVED***
      return turno.fechaFin >= primerDiaStr && turno.fechaFin <= ultimoDiaStr;
    ***REMOVED***
    
    return false;
  ***REMOVED***);
***REMOVED***;

/**
 * Verifica si hay turnos en una fecha específica
 */
export const verificarTurnosEnFecha = (fecha, turnos) => ***REMOVED***
  const fechaStr = fechaLocalAISO(fecha);
  
  return turnos.some(turno => ***REMOVED***
    // Verificar fecha principal
    const fechaPrincipal = turno.fechaInicio || turno.fecha;
    if (fechaPrincipal === fechaStr) ***REMOVED***
      return true;
    ***REMOVED***
    
    // Verificar fecha de fin para turnos nocturnos
    if (turno.fechaFin && turno.fechaFin !== fechaPrincipal && turno.fechaFin === fechaStr) ***REMOVED***
      return true;
    ***REMOVED***
    
    return false;
  ***REMOVED***);
***REMOVED***;

/**
 * Obtener turnos de un día específico (incluyendo nocturnos)
 */
export const obtenerTurnosDelDia = (fecha, turnos) => ***REMOVED***
  const fechaStr = fechaLocalAISO(fecha);
  
  return turnos.filter(turno => ***REMOVED***
    // Verificar fecha principal
    const fechaPrincipal = turno.fechaInicio || turno.fecha;
    if (fechaPrincipal === fechaStr) ***REMOVED***
      return true;
    ***REMOVED***
    
    // Verificar fecha de fin para turnos nocturnos
    if (turno.fechaFin && turno.fechaFin !== fechaPrincipal && turno.fechaFin === fechaStr) ***REMOVED***
      return true;
    ***REMOVED***
    
    return false;
  ***REMOVED***);
***REMOVED***;

/**
 * Obtener colores considerando turnos nocturnos
 */
export const obtenerColoresTrabajos = (turnosDelDia, trabajos) => ***REMOVED***
  const coloresUnicos = new Set();
  
  turnosDelDia.forEach(turno => ***REMOVED***
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (trabajo) ***REMOVED***
      // Para trabajos de delivery, usar un color específico o el color del trabajo
      if (trabajo.tipo === 'delivery' || turno.tipo === 'delivery') ***REMOVED***
        coloresUnicos.add(trabajo.colorAvatar || trabajo.color || '#10B981');
      ***REMOVED*** else ***REMOVED***
        coloresUnicos.add(trabajo.color);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);
  
  return Array.from(coloresUnicos).slice(0, 3);
***REMOVED***;

/**
 * Determinar el tipo de turno en una fecha específica
 */
export const obtenerTipoTurnoEnFecha = (turno, fechaStr) => ***REMOVED***
  const fechaPrincipal = turno.fechaInicio || turno.fecha;
  
  // Si es la fecha principal del turno
  if (fechaPrincipal === fechaStr) ***REMOVED***
    if (turno.cruzaMedianoche) ***REMOVED***
      return 'inicio-nocturno'; // Turno que empieza este día y termina al siguiente
    ***REMOVED***
    return 'normal'; // Turno completo en este día
  ***REMOVED***
  
  // Si es la fecha de fin de un turno nocturno
  if (turno.fechaFin && turno.fechaFin === fechaStr && turno.cruzaMedianoche) ***REMOVED***
    return 'fin-nocturno'; // Turno que empezó el día anterior y termina este día
  ***REMOVED***
  
  return 'normal';
***REMOVED***;

/**
 * Formatear la información del turno para mostrar en el calendario
 */
export const formatearInfoTurnoParaCalendario = (turno, fechaStr, trabajo) => ***REMOVED***
  const tipoTurno = obtenerTipoTurnoEnFecha(turno, fechaStr);
  
  let etiquetaHora = `$***REMOVED***turno.horaInicio***REMOVED*** - $***REMOVED***turno.horaFin***REMOVED***`;
  let etiquetaTipo = '';
  
  if (tipoTurno === 'inicio-nocturno') ***REMOVED***
    etiquetaHora = `$***REMOVED***turno.horaInicio***REMOVED*** - ...`;
    etiquetaTipo = ' (inicia)';
  ***REMOVED*** else if (tipoTurno === 'fin-nocturno') ***REMOVED***
    etiquetaHora = `... - $***REMOVED***turno.horaFin***REMOVED***`;
    etiquetaTipo = ' (termina)';
  ***REMOVED***
  
  return ***REMOVED***
    id: turno.id,
    trabajo: trabajo?.nombre || 'Trabajo no encontrado',
    etiquetaHora,
    etiquetaTipo,
    tipoTurno,
    color: trabajo?.color || trabajo?.colorAvatar || '#6B7280',
    esDelivery: turno.tipo === 'delivery' || trabajo?.tipo === 'delivery'
  ***REMOVED***;
***REMOVED***;

/**
 * Obtiene los días de la semana en español
 */
export const getDiasSemana = () => ***REMOVED***
  return ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
***REMOVED***;

/**
 * Obtiene los meses en español
 */
export const getMeses = () => ***REMOVED***
  return [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
***REMOVED***;

/**
 * Formatea una fecha relativa (hoy, ayer, etc.)
 */
export const formatearFechaRelativa = (fechaStr) => ***REMOVED***
  const fecha = createSafeDate(fechaStr);
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);
  const mañana = new Date(hoy);
  mañana.setDate(hoy.getDate() + 1);

  if (fecha.toDateString() === hoy.toDateString()) ***REMOVED***
    return 'Hoy';
  ***REMOVED*** else if (fecha.toDateString() === ayer.toDateString()) ***REMOVED***
    return 'Ayer';
  ***REMOVED*** else if (fecha.toDateString() === mañana.toDateString()) ***REMOVED***
    return 'Mañana';
  ***REMOVED*** else ***REMOVED***
    return fecha.toLocaleDateString('es-ES', ***REMOVED***
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    ***REMOVED***);
  ***REMOVED***
***REMOVED***;