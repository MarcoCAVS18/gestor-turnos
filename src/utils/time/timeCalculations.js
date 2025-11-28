// src/utils/time/timeCalculations.js
// Utilidades centralizadas para cálculos de tiempo

/**
 * Calcula las horas trabajadas entre dos tiempos
 * Maneja correctamente turnos que cruzan la medianoche
 *
 * @param {string} startTime - Hora de inicio en formato "HH:mm"
 * @param {string} endTime - Hora de fin en formato "HH:mm"
 * @returns {number} - Horas trabajadas (decimal)
 *
 * @example
 * calculateShiftHours("09:00", "17:00") // 8
 * calculateShiftHours("22:00", "02:00") // 4 (cruza medianoche)
 */
export const calculateShiftHours = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;

  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;

  // Si cruza medianoche (ej: 22:00 a 02:00)
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }

  return (endMinutes - startMinutes) / 60;
};

/**
 * Formatea la duración de un turno en formato legible
 *
 * @param {string} startTime - Hora de inicio
 * @param {string} endTime - Hora de fin
 * @returns {string} - Duración formateada (ej: "8h" o "7h 30min")
 *
 * @example
 * formatShiftDuration("09:00", "17:00") // "8h"
 * formatShiftDuration("09:00", "16:30") // "7h 30min"
 */
export const formatShiftDuration = (startTime, endTime) => {
  const totalMinutes = calculateShiftHours(startTime, endTime) * 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}min`;
};

/**
 * Formatea horas decimales en formato legible
 *
 * @param {number} hours - Horas en formato decimal
 * @returns {string} - Duración formateada (ej: "8h" o "7h 30min" o "45min")
 *
 * @example
 * formatHoursDecimal(8) // "8h"
 * formatHoursDecimal(7.5) // "7h 30min"
 * formatHoursDecimal(0.75) // "45min"
 */
export const formatHoursDecimal = (hours) => {
  if (hours === 0) return '0h';

  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes}min`;
  }

  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (minutes === 0) return `${wholeHours}h`;
  return `${wholeHours}h ${minutes}min`;
};

/**
 * Calcula las horas totales de un array de turnos
 *
 * @param {Array} shifts - Array de turnos con horaInicio y horaFin
 * @returns {number} - Total de horas trabajadas
 *
 * @example
 * const shifts = [
 *   { horaInicio: "09:00", horaFin: "17:00" },
 *   { horaInicio: "10:00", horaFin: "14:00" }
 * ];
 * calculateTotalHours(shifts) // 12
 */
export const calculateTotalHours = (shifts = []) => {
  return shifts.reduce((total, shift) => {
    return total + calculateShiftHours(shift.horaInicio, shift.horaFin);
  }, 0);
};

/**
 * Calcula las horas aplicando descuento de smoko (descanso)
 *
 * @param {string} startTime - Hora de inicio
 * @param {string} endTime - Hora de fin
 * @param {number} smokoMinutes - Minutos de descanso a descontar
 * @returns {number} - Horas trabajadas después del descuento
 *
 * @example
 * calculateHoursWithSmoko("09:00", "17:00", 30) // 7.5 (8h - 30min)
 */
export const calculateHoursWithSmoko = (startTime, endTime, smokoMinutes = 0) => {
  const totalHours = calculateShiftHours(startTime, endTime);
  const smokoHours = smokoMinutes / 60;
  return Math.max(0, totalHours - smokoHours);
};

/**
 * Convierte horas decimales a formato HH:mm
 *
 * @param {number} hours - Horas en formato decimal
 * @returns {string} - Tiempo en formato "HH:mm"
 *
 * @example
 * hoursToTimeString(7.5) // "07:30"
 * hoursToTimeString(8) // "08:00"
 */
export const hoursToTimeString = (hours) => {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

/**
 * Verifica si un turno cruza la medianoche
 *
 * @param {string} startTime - Hora de inicio
 * @param {string} endTime - Hora de fin
 * @returns {boolean} - true si cruza medianoche
 *
 * @example
 * crossesMidnight("22:00", "02:00") // true
 * crossesMidnight("09:00", "17:00") // false
 */
export const crossesMidnight = (startTime, endTime) => {
  if (!startTime || !endTime) return false;

  const [startHour] = startTime.split(':').map(Number);
  const [endHour] = endTime.split(':').map(Number);

  return endHour < startHour;
};

/**
 * Obtiene el rango de fechas de una semana (lunes a domingo)
 *
 * @param {number} offset - Desplazamiento en semanas (0 = semana actual, -1 = semana anterior, 1 = semana siguiente)
 * @returns {Object} - { fechaInicio: Date, fechaFin: Date }
 *
 * @example
 * getWeekDateRange(0)  // Esta semana
 * getWeekDateRange(-1) // Semana anterior
 * getWeekDateRange(1)  // Semana siguiente
 */
export const getWeekDateRange = (offset = 0) => {
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

  return { fechaInicio, fechaFin };
};
