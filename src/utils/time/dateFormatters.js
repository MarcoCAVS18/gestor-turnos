// src/utils/time/dateFormatters.js
// Utilidades centralizadas para formateo de fechas

/**
 * Crea un objeto Date de forma segura desde un string de fecha
 * Agrega 'T00:00:00' para evitar problemas de zona horaria
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Fecha en formato "YYYY-MM-DD"
 * @returns ***REMOVED***Date***REMOVED*** - Objeto Date
 *
 * @example
 * createSafeDate("2025-01-15") // Date object at midnight
 */
export const createSafeDate = (dateString) => ***REMOVED***
  if (!dateString) return new Date();
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) ***REMOVED***
    console.warn("createSafeDate received an unparseable dateString:", dateString);
    return new Date(); 
  ***REMOVED***
  return date;
***REMOVED***;

/**
 * Formatea una fecha de forma relativa (Hoy, Ayer, Mañana)
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Fecha en formato "YYYY-MM-DD"
 * @returns ***REMOVED***string***REMOVED*** - Fecha formateada
 *
 * @example
 * formatRelativeDate("2025-01-15") // "Hoy", "Ayer", "Mañana" o "mié 15 ene"
 */
export const formatRelativeDate = (dateString) => ***REMOVED***
  const date = createSafeDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  if (targetDate.getTime() === today.getTime()) return 'Hoy';
  if (targetDate.getTime() === yesterday.getTime()) return 'Ayer';
  if (targetDate.getTime() === tomorrow.getTime()) return 'Mañana';

  return date.toLocaleDateString('es-ES', ***REMOVED***
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  ***REMOVED***);
***REMOVED***;

/**
 * Formatea una fecha completa
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Fecha en formato "YYYY-MM-DD"
 * @returns ***REMOVED***string***REMOVED*** - Fecha formateada (ej: "miércoles, 15 de enero de 2025")
 *
 * @example
 * formatFullDate("2025-01-15") // "miércoles, 15 de enero de 2025"
 */
export const formatFullDate = (dateString) => ***REMOVED***
  return createSafeDate(dateString).toLocaleDateString('es-ES', ***REMOVED***
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  ***REMOVED***);
***REMOVED***;

/**
 * Formatea una fecha en formato corto
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Fecha en formato "YYYY-MM-DD"
 * @returns ***REMOVED***string***REMOVED*** - Fecha formateada (ej: "15 ene")
 *
 * @example
 * formatShortDate("2025-01-15") // "15 ene"
 */
export const formatShortDate = (dateString) => ***REMOVED***
  return createSafeDate(dateString).toLocaleDateString('es-ES', ***REMOVED***
    day: 'numeric',
    month: 'short'
  ***REMOVED***);
***REMOVED***;

/**
 * Formatea una fecha en formato numérico
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Fecha en formato "YYYY-MM-DD"
 * @returns ***REMOVED***string***REMOVED*** - Fecha formateada (ej: "15/01/2025")
 *
 * @example
 * formatNumericDate("2025-01-15") // "15/01/2025"
 */
export const formatNumericDate = (dateString) => ***REMOVED***
  return createSafeDate(dateString).toLocaleDateString('es-ES', ***REMOVED***
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  ***REMOVED***);
***REMOVED***;

/**
 * Obtiene el nombre del día de la semana
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Fecha en formato "YYYY-MM-DD"
 * @returns ***REMOVED***string***REMOVED*** - Nombre del día (ej: "Miércoles")
 *
 * @example
 * getDayName("2025-01-15") // "Miércoles"
 */
export const getDayName = (dateString) => ***REMOVED***
  return createSafeDate(dateString).toLocaleDateString('es-ES', ***REMOVED***
    weekday: 'long'
  ***REMOVED***);
***REMOVED***;

/**
 * Obtiene el nombre corto del día de la semana
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Fecha en formato "YYYY-MM-DD"
 * @returns ***REMOVED***string***REMOVED*** - Nombre corto del día (ej: "mié")
 *
 * @example
 * getShortDayName("2025-01-15") // "mié"
 */
export const getShortDayName = (dateString) => ***REMOVED***
  return createSafeDate(dateString).toLocaleDateString('es-ES', ***REMOVED***
    weekday: 'short'
  ***REMOVED***);
***REMOVED***;

/**
 * Obtiene el nombre del mes
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Fecha en formato "YYYY-MM-DD"
 * @returns ***REMOVED***string***REMOVED*** - Nombre del mes (ej: "Enero")
 *
 * @example
 * getMonthName("2025-01-15") // "Enero"
 */
export const getMonthName = (dateString) => ***REMOVED***
  return createSafeDate(dateString).toLocaleDateString('es-ES', ***REMOVED***
    month: 'long'
  ***REMOVED***);
***REMOVED***;

/**
 * Verifica si una fecha es hoy
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Fecha en formato "YYYY-MM-DD"
 * @returns ***REMOVED***boolean***REMOVED*** - true si es hoy
 *
 * @example
 * isToday("2025-01-15") // true/false
 */
export const isToday = (dateString) => ***REMOVED***
  const date = createSafeDate(dateString);
  const today = new Date();

  return date.toDateString() === today.toDateString();
***REMOVED***;

/**
 * Verifica si una fecha está en el pasado
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Fecha en formato "YYYY-MM-DD"
 * @returns ***REMOVED***boolean***REMOVED*** - true si está en el pasado
 *
 * @example
 * isPastDate("2025-01-15") // true/false
 */
export const isPastDate = (dateString) => ***REMOVED***
  const date = createSafeDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date < today;
***REMOVED***;

/**
 * Verifica si una fecha está en el futuro
 *
 * @param ***REMOVED***string***REMOVED*** dateString - Fecha en formato "YYYY-MM-DD"
 * @returns ***REMOVED***boolean***REMOVED*** - true si está en el futuro
 *
 * @example
 * isFutureDate("2025-01-15") // true/false
 */
export const isFutureDate = (dateString) => ***REMOVED***
  const date = createSafeDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date > today;
***REMOVED***;

/**
 * Obtiene la fecha de inicio y fin de un mes
 *
 * @param ***REMOVED***number***REMOVED*** year - Año
 * @param ***REMOVED***number***REMOVED*** month - Mes (0-11)
 * @returns ***REMOVED***Object***REMOVED*** - ***REMOVED*** start: Date, end: Date ***REMOVED***
 *
 * @example
 * getMonthRange(2025, 0) // ***REMOVED*** start: "2025-01-01", end: "2025-01-31" ***REMOVED***
 */
export const getMonthRange = (year, month) => ***REMOVED***
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const formatDate = (date) => ***REMOVED***
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `$***REMOVED***y***REMOVED***-$***REMOVED***m***REMOVED***-$***REMOVED***d***REMOVED***`;
  ***REMOVED***;

  return ***REMOVED***
    start: formatDate(start),
    end: formatDate(end)
  ***REMOVED***;
***REMOVED***;

/**
 * Obtiene el mes y año actual en formato texto
 *
 * @returns ***REMOVED***string***REMOVED*** - Mes y año (ej: "Enero 2025")
 *
 * @example
 * getCurrentMonthYear() // "Enero 2025"
 */
export const getCurrentMonthYear = () => ***REMOVED***
  const now = new Date();
  return now.toLocaleDateString('es-ES', ***REMOVED***
    month: 'long',
    year: 'numeric'
  ***REMOVED***);
***REMOVED***;
