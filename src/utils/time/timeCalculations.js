// src/utils/time/timeCalculations.js
// Utilidades centralizadas para cálculos de tiempo

/**
 * Calcula las horas trabajadas entre dos tiempos
 * Maneja correctamente turnos que cruzan la medianoche
 *
 * @param ***REMOVED***string***REMOVED*** startTime - Hora de inicio en formato "HH:mm"
 * @param ***REMOVED***string***REMOVED*** endTime - Hora de fin en formato "HH:mm"
 * @returns ***REMOVED***number***REMOVED*** - Horas trabajadas (decimal)
 *
 * @example
 * calculateShiftHours("09:00", "17:00") // 8
 * calculateShiftHours("22:00", "02:00") // 4 (cruza medianoche)
 */
export const calculateShiftHours = (startTime, endTime) => ***REMOVED***
  if (!startTime || !endTime) return 0;

  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;

  // Si cruza medianoche (ej: 22:00 a 02:00)
  if (endMinutes <= startMinutes) ***REMOVED***
    endMinutes += 24 * 60;
  ***REMOVED***

  return (endMinutes - startMinutes) / 60;
***REMOVED***;

/**
 * Formatea la duración de un turno en formato legible
 *
 * @param ***REMOVED***string***REMOVED*** startTime - Hora de inicio
 * @param ***REMOVED***string***REMOVED*** endTime - Hora de fin
 * @returns ***REMOVED***string***REMOVED*** - Duración formateada (ej: "8h" o "7h 30min")
 *
 * @example
 * formatShiftDuration("09:00", "17:00") // "8h"
 * formatShiftDuration("09:00", "16:30") // "7h 30min"
 */
export const formatShiftDuration = (startTime, endTime) => ***REMOVED***
  const totalMinutes = calculateShiftHours(startTime, endTime) * 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  if (minutes === 0) return `$***REMOVED***hours***REMOVED***h`;
  return `$***REMOVED***hours***REMOVED***h $***REMOVED***minutes***REMOVED***min`;
***REMOVED***;

/**
 * Formatea horas decimales en formato legible
 *
 * @param ***REMOVED***number***REMOVED*** hours - Horas en formato decimal
 * @returns ***REMOVED***string***REMOVED*** - Duración formateada (ej: "8h" o "7h 30min" o "45min")
 *
 * @example
 * formatHoursDecimal(8) // "8h"
 * formatHoursDecimal(7.5) // "7h 30min"
 * formatHoursDecimal(0.75) // "45min"
 */
export const formatHoursDecimal = (hours) => ***REMOVED***
  if (hours === 0) return '0h';

  if (hours < 1) ***REMOVED***
    const minutes = Math.round(hours * 60);
    return `$***REMOVED***minutes***REMOVED***min`;
  ***REMOVED***

  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (minutes === 0) return `$***REMOVED***wholeHours***REMOVED***h`;
  return `$***REMOVED***wholeHours***REMOVED***h $***REMOVED***minutes***REMOVED***min`;
***REMOVED***;

/**
 * Calcula las horas totales de un array de turnos
 *
 * @param ***REMOVED***Array***REMOVED*** shifts - Array de turnos con horaInicio y horaFin
 * @returns ***REMOVED***number***REMOVED*** - Total de horas trabajadas
 *
 * @example
 * const shifts = [
 *   ***REMOVED*** horaInicio: "09:00", horaFin: "17:00" ***REMOVED***,
 *   ***REMOVED*** horaInicio: "10:00", horaFin: "14:00" ***REMOVED***
 * ];
 * calculateTotalHours(shifts) // 12
 */
export const calculateTotalHours = (shifts = []) => ***REMOVED***
  return shifts.reduce((total, shift) => ***REMOVED***
    return total + calculateShiftHours(shift.horaInicio, shift.horaFin);
  ***REMOVED***, 0);
***REMOVED***;

/**
 * Calcula las horas aplicando descuento de smoko (descanso)
 *
 * @param ***REMOVED***string***REMOVED*** startTime - Hora de inicio
 * @param ***REMOVED***string***REMOVED*** endTime - Hora de fin
 * @param ***REMOVED***number***REMOVED*** smokoMinutes - Minutos de descanso a descontar
 * @returns ***REMOVED***number***REMOVED*** - Horas trabajadas después del descuento
 *
 * @example
 * calculateHoursWithSmoko("09:00", "17:00", 30) // 7.5 (8h - 30min)
 */
export const calculateHoursWithSmoko = (startTime, endTime, smokoMinutes = 0) => ***REMOVED***
  const totalHours = calculateShiftHours(startTime, endTime);
  const smokoHours = smokoMinutes / 60;
  return Math.max(0, totalHours - smokoHours);
***REMOVED***;

/**
 * Convierte horas decimales a formato HH:mm
 *
 * @param ***REMOVED***number***REMOVED*** hours - Horas en formato decimal
 * @returns ***REMOVED***string***REMOVED*** - Tiempo en formato "HH:mm"
 *
 * @example
 * hoursToTimeString(7.5) // "07:30"
 * hoursToTimeString(8) // "08:00"
 */
export const hoursToTimeString = (hours) => ***REMOVED***
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `$***REMOVED***String(h).padStart(2, '0')***REMOVED***:$***REMOVED***String(m).padStart(2, '0')***REMOVED***`;
***REMOVED***;

/**
 * Verifica si un turno cruza la medianoche
 *
 * @param ***REMOVED***string***REMOVED*** startTime - Hora de inicio
 * @param ***REMOVED***string***REMOVED*** endTime - Hora de fin
 * @returns ***REMOVED***boolean***REMOVED*** - true si cruza medianoche
 *
 * @example
 * crossesMidnight("22:00", "02:00") // true
 * crossesMidnight("09:00", "17:00") // false
 */
export const crossesMidnight = (startTime, endTime) => ***REMOVED***
  if (!startTime || !endTime) return false;

  const [startHour] = startTime.split(':').map(Number);
  const [endHour] = endTime.split(':').map(Number);

  return endHour < startHour;
***REMOVED***;

/**
 * Obtiene el rango de fechas de una semana (lunes a domingo)
 *
 * @param ***REMOVED***number***REMOVED*** offset - Desplazamiento en semanas (0 = semana actual, -1 = semana anterior, 1 = semana siguiente)
 * @returns ***REMOVED***Object***REMOVED*** - ***REMOVED*** fechaInicio: Date, fechaFin: Date ***REMOVED***
 *
 * @example
 * getWeekDateRange(0)  // Esta semana
 * getWeekDateRange(-1) // Semana anterior
 * getWeekDateRange(1)  // Semana siguiente
 */
export const getWeekDateRange = (offset = 0) => ***REMOVED***
  const hoy = new Date();
  const diaSemana = hoy.getDay();

  // Calcular diferencia para llegar al lunes (0 = domingo, 1 = lunes, ...)
  const diffInicio = diaSemana === 0 ? 6 : diaSemana - 1;

  // Fecha de inicio (lunes)
  const fechaInicio = new Date(hoy);
  fechaInicio.setDate(hoy.getDate() - diffInicio + (offset * 7));
  fechaInicio.setHours(0, 0, 0, 0);

  // Fecha de fin (domingo)
  const fechaFin = new Date(fechaInicio);
  fechaFin.setDate(fechaInicio.getDate() + 6);
  fechaFin.setHours(23, 59, 59, 999);

  return ***REMOVED*** fechaInicio, fechaFin ***REMOVED***;
***REMOVED***;
