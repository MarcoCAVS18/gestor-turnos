// src/utils/time/dateFormatters.js
// Utilidades centralizadas para formateo de fechas

/**
 * Crea un objeto Date de forma segura desde un string de fecha
 * Agrega 'T00:00:00' para evitar problemas de zona horaria
 *
 * @param {string} dateString - Fecha en formato "YYYY-MM-DD"
 * @returns {Date} - Objeto Date
 *
 * @example
 * createSafeDate("2025-01-15") // Date object at midnight
 */
export const createSafeDate = (dateString) => {
  if (!dateString) return new Date();
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) {
    console.warn("createSafeDate received an unparseable dateString:", dateString);
    return new Date(); 
  }
  return date;
};

/**
 * Formatea una fecha de forma relativa (Hoy, Ayer, Mañana)
 *
 * @param {string} dateString - Fecha en formato "YYYY-MM-DD"
 * @returns {string} - Fecha formateada
 *
 * @example
 * formatRelativeDate("2025-01-15") // "Hoy", "Ayer", "Mañana" o "mié 15 ene"
 */
export const formatRelativeDate = (dateString) => {
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

  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
};

/**
 * Formatea una fecha completa
 *
 * @param {string} dateString - Fecha en formato "YYYY-MM-DD"
 * @returns {string} - Fecha formateada (ej: "miércoles, 15 de enero de 2025")
 *
 * @example
 * formatFullDate("2025-01-15") // "miércoles, 15 de enero de 2025"
 */
export const formatFullDate = (dateString) => {
  return createSafeDate(dateString).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Formatea una fecha en formato corto
 *
 * @param {string} dateString - Fecha en formato "YYYY-MM-DD"
 * @returns {string} - Fecha formateada (ej: "15 ene")
 *
 * @example
 * formatShortDate("2025-01-15") // "15 ene"
 */
export const formatShortDate = (dateString) => {
  return createSafeDate(dateString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  });
};

/**
 * Formatea una fecha en formato numérico
 *
 * @param {string} dateString - Fecha en formato "YYYY-MM-DD"
 * @returns {string} - Fecha formateada (ej: "15/01/2025")
 *
 * @example
 * formatNumericDate("2025-01-15") // "15/01/2025"
 */
export const formatNumericDate = (dateString) => {
  return createSafeDate(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Obtiene el nombre del día de la semana
 *
 * @param {string} dateString - Fecha en formato "YYYY-MM-DD"
 * @returns {string} - Nombre del día (ej: "Miércoles")
 *
 * @example
 * getDayName("2025-01-15") // "Miércoles"
 */
export const getDayName = (dateString) => {
  return createSafeDate(dateString).toLocaleDateString('es-ES', {
    weekday: 'long'
  });
};

/**
 * Obtiene el nombre corto del día de la semana
 *
 * @param {string} dateString - Fecha en formato "YYYY-MM-DD"
 * @returns {string} - Nombre corto del día (ej: "mié")
 *
 * @example
 * getShortDayName("2025-01-15") // "mié"
 */
export const getShortDayName = (dateString) => {
  return createSafeDate(dateString).toLocaleDateString('es-ES', {
    weekday: 'short'
  });
};

/**
 * Obtiene el nombre del mes
 *
 * @param {string} dateString - Fecha en formato "YYYY-MM-DD"
 * @returns {string} - Nombre del mes (ej: "Enero")
 *
 * @example
 * getMonthName("2025-01-15") // "Enero"
 */
export const getMonthName = (dateString) => {
  return createSafeDate(dateString).toLocaleDateString('es-ES', {
    month: 'long'
  });
};

/**
 * Verifica si una fecha es hoy
 *
 * @param {string} dateString - Fecha en formato "YYYY-MM-DD"
 * @returns {boolean} - true si es hoy
 *
 * @example
 * isToday("2025-01-15") // true/false
 */
export const isToday = (dateString) => {
  const date = createSafeDate(dateString);
  const today = new Date();

  return date.toDateString() === today.toDateString();
};

/**
 * Verifica si una fecha está en el pasado
 *
 * @param {string} dateString - Fecha en formato "YYYY-MM-DD"
 * @returns {boolean} - true si está en el pasado
 *
 * @example
 * isPastDate("2025-01-15") // true/false
 */
export const isPastDate = (dateString) => {
  const date = createSafeDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date < today;
};

/**
 * Verifica si una fecha está en el futuro
 *
 * @param {string} dateString - Fecha en formato "YYYY-MM-DD"
 * @returns {boolean} - true si está en el futuro
 *
 * @example
 * isFutureDate("2025-01-15") // true/false
 */
export const isFutureDate = (dateString) => {
  const date = createSafeDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date > today;
};

/**
 * Obtiene la fecha de inicio y fin de un mes
 *
 * @param {number} year - Año
 * @param {number} month - Mes (0-11)
 * @returns {Object} - { start: Date, end: Date }
 *
 * @example
 * getMonthRange(2025, 0) // { start: "2025-01-01", end: "2025-01-31" }
 */
export const getMonthRange = (year, month) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return {
    start: formatDate(start),
    end: formatDate(end)
  };
};

/**
 * Obtiene el mes y año actual en formato texto
 *
 * @returns {string} - Mes y año (ej: "Enero 2025")
 *
 * @example
 * getCurrentMonthYear() // "Enero 2025"
 */
export const getCurrentMonthYear = () => {
  const now = new Date();
  return now.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric'
  });
};
