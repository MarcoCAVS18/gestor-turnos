// src/utils/shiftDetailsUtils.js

import ***REMOVED*** createSafeDate ***REMOVED*** from './time';

// Función para detectar si un turno cruza medianoche
export function checkIfShiftCrossesMidnight(turno) ***REMOVED***
  if (!turno.horaInicio || !turno.horaFin) return false;
  
  // Si ya tiene la propiedad cruzaMedianoche, usarla
  if (turno.cruzaMedianoche !== undefined) ***REMOVED***
    return turno.cruzaMedianoche;
  ***REMOVED***
  
  // Si tiene fechaInicio y fechaFin diferentes, cruza medianoche
  if (turno.fechaInicio && turno.fechaFin && turno.fechaInicio !== turno.fechaFin) ***REMOVED***
    return true;
  ***REMOVED***
  
  // Calcular basándose en las horas
  const [horaInicio] = turno.horaInicio.split(':').map(Number);
  const [horaFin] = turno.horaFin.split(':').map(Number);
  
  return horaFin < horaInicio;
***REMOVED***

// Función para determinar tipo de turno por hora específica
export function getTipoTurnoByHour(hora, shiftRanges) ***REMOVED***
  const ranges = shiftRanges || ***REMOVED***
    dayStart: 6, dayEnd: 14,
    afternoonStart: 14, afternoonEnd: 20,
    nightStart: 20
  ***REMOVED***;

  if (hora >= ranges.dayStart && hora < ranges.dayEnd) ***REMOVED***
    return 'diurno';
  ***REMOVED*** else if (hora >= ranges.afternoonStart && hora < ranges.afternoonEnd) ***REMOVED***
    return 'tarde';
  ***REMOVED*** else ***REMOVED***
    return 'noche';
  ***REMOVED***
***REMOVED***

// Función principal para determinar el tipo de turno - ESTA ES LA ÚNICA QUE DEBES USAR
export function determinarTipoTurno(turno, shiftRanges) ***REMOVED***
  if (!turno) return 'noche';
  
  // Si es delivery, retornar delivery
  if (turno.tipo === 'delivery' || turno.type === 'delivery') ***REMOVED***
    return 'delivery';
  ***REMOVED***
  
  // Determinar por fecha (fin de semana)
  const fechaClave = turno.fechaInicio || turno.fecha;
  if (fechaClave) ***REMOVED***
    const [year, month, day] = fechaClave.split('-');
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0) return 'domingo';
    if (dayOfWeek === 6) return 'sabado';
  ***REMOVED***
  
  // Determinar por hora de inicio y fin para detectar turnos mixtos
  if (turno.horaInicio && turno.horaFin) ***REMOVED***
    const [horaInicio, minutoInicio] = turno.horaInicio.split(':').map(Number);
    const [horaFin, minutoFin] = turno.horaFin.split(':').map(Number);
    
    const inicioMinutos = horaInicio * 60 + minutoInicio;
    let finMinutos = horaFin * 60 + minutoFin;
    
    // Si cruza medianoche
    if (finMinutos <= inicioMinutos) ***REMOVED***
      finMinutos += 24 * 60;
    ***REMOVED***
    
    const tiposEncontrados = new Set();
    
    // Revisar cada hora del turno para ver si cambia de tipo
    for (let minutos = inicioMinutos; minutos < finMinutos; minutos += 60) ***REMOVED***
      const horaActual = Math.floor((minutos % (24 * 60)) / 60);
      const tipo = getTipoTurnoByHour(horaActual, shiftRanges);
      tiposEncontrados.add(tipo);
    ***REMOVED***
    
    // Si hay más de un tipo, es mixto
    if (tiposEncontrados.size > 1) ***REMOVED***
      return 'mixto';
    ***REMOVED***
    
    // Si solo hay un tipo, retornar ese tipo
    return Array.from(tiposEncontrados)[0] || 'noche';
  ***REMOVED***
  
  return 'noche';
***REMOVED***

// Función que devuelve la etiqueta legible
export function getTipoTurnoLabel(tipo) ***REMOVED***
  const labels = ***REMOVED***
    diurno: 'Diurno',
    tarde: 'Tarde', 
    noche: 'Noche',
    sabado: 'Sábado',
    domingo: 'Domingo',
    delivery: 'Delivery',
    mixto: 'Mixto'
  ***REMOVED***;
  
  return labels[tipo] || 'Noche';
***REMOVED***

// ✅ Nueva función para pluralizar "turnos"
export function formatTurnos(cantidad) ***REMOVED***
  return `$***REMOVED***cantidad***REMOVED*** $***REMOVED***cantidad === 1 ? 'TURNO' : 'TURNOS'***REMOVED***`;
***REMOVED***

// Función para generar los detalles del turno para el modal de eliminación
export function generateShiftDetails(turno, allJobs) ***REMOVED***
  if (!turno) return [];

  const trabajo = allJobs.find(t => t.id === turno.trabajoId);

  // Verificar si el turno cruza medianoche
  const cruzaMedianoche = checkIfShiftCrossesMidnight(turno);
  
  let fechaTexto = '';
  
  if (cruzaMedianoche) ***REMOVED***
    // Turno que cruza medianoche - mostrar ambas fechas
    let fechaInicio, fechaFin;
    
    if (turno.fechaInicio && turno.fechaFin && turno.fechaInicio !== turno.fechaFin) ***REMOVED***
      // Usar las fechas existentes si son diferentes
      fechaInicio = createSafeDate(turno.fechaInicio);
      fechaFin = createSafeDate(turno.fechaFin);
    ***REMOVED*** else ***REMOVED***
      // Calcular la fecha de fin basándose en la fecha de inicio
      const fechaBase = turno.fechaInicio || turno.fecha;
      fechaInicio = createSafeDate(fechaBase);
      fechaFin = createSafeDate(fechaBase); // Crear desde la fecha base
      fechaFin.setDate(fechaFin.getDate() + 1); // Sumar 1 día
    ***REMOVED***
    
    const fechaInicioStr = fechaInicio.toLocaleDateString('es-ES', ***REMOVED***
      weekday: 'long', 
      day: 'numeric', 
      month: 'long'
    ***REMOVED***);
    
    const fechaFinStr = fechaFin.toLocaleDateString('es-ES', ***REMOVED***
      weekday: 'long', 
      day: 'numeric', 
      month: 'long'
    ***REMOVED***);
    
    fechaTexto = `$***REMOVED***fechaInicioStr***REMOVED*** - $***REMOVED***fechaFinStr***REMOVED***`;
  ***REMOVED*** else ***REMOVED***
    // Turno normal en un solo día
    const fechaStr = turno.fechaInicio || turno.fecha;
    if (fechaStr) ***REMOVED***
      const fecha = createSafeDate(fechaStr);
      fechaTexto = fecha.toLocaleDateString('es-ES', ***REMOVED***
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      ***REMOVED***);
    ***REMOVED*** else ***REMOVED***
      fechaTexto = 'Fecha no disponible';
    ***REMOVED***
  ***REMOVED***

  const detalles = [
    trabajo?.nombre || 'Trabajo no encontrado',
    fechaTexto,
    `$***REMOVED***turno.horaInicio***REMOVED*** - $***REMOVED***turno.horaFin***REMOVED***`
  ];

  if (turno.tipo === 'delivery') ***REMOVED***
    detalles.push(`$***REMOVED***turno.numeroPedidos || 0***REMOVED*** pedidos`);
  ***REMOVED***

  return detalles;
***REMOVED***
