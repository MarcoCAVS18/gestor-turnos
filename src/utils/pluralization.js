// src/utils/pluralization.js - Utilidad completa para pluralización

/**
 * Pluraliza la palabra "turno" según la cantidad
 * @param {number} cantidad - Número de turnos
 * @param {boolean} uppercase - Si debe estar en mayúsculas (por defecto false)
 * @returns {string} "turno" o "turnos" según corresponda
 */
export const pluralizeTurnos = (cantidad, uppercase = false) => {
  const word = cantidad === 1 ? 'turno' : 'turnos';
  return uppercase ? word.toUpperCase() : word;
};

/**
 * Formatea cantidad + palabra pluralizada
 * @param {number} cantidad - Número de turnos
 * @param {boolean} uppercase - Si la palabra debe estar en mayúsculas
 * @returns {string} Ej: "1 turno", "5 turnos"
 */
export const formatTurnosCount = (cantidad, uppercase = false) => {
  return `${cantidad} ${pluralizeTurnos(cantidad, uppercase)}`;
};

/**
 * Genera títulos dinámicos basados en la cantidad de elementos
 * @param {number} totalCount - Cantidad total de elementos
 * @param {string} baseTitle - Título base (ej: "Tipos de")
 * @param {string} singular - Palabra en singular
 * @param {string} plural - Palabra en plural (opcional)
 * @returns {string} Título pluralizado
 */
export const getDynamicTitle = (totalCount, baseTitle, singular, plural = null) => {
  const word = totalCount === 1 ? singular : (plural || `${singular}s`);
  return `${baseTitle} ${word}`;
};

/**
 * Pluraliza "tipo/tipos de turno" según cantidad
 * @param {number} totalTurnos - Cantidad total de turnos
 * @returns {string} "Tipo de turno" o "Tipos de turno"
 */
export const pluralizeTiposDeTurno = (totalTurnos) => {
  return totalTurnos === 1 ? 'Tipo de turno' : 'Tipos de turno';
};

/**
 * Pluraliza cualquier palabra según cantidad
 * @param {number} cantidad - Número de elementos
 * @param {string} singular - Forma singular de la palabra
 * @param {string} plural - Forma plural de la palabra (opcional, por defecto agrega 's')
 * @returns {string} La palabra en singular o plural
 */
export const pluralize = (cantidad, singular, plural = null) => {
  if (cantidad === 1) return singular;
  return plural || `${singular}s`;
};

/**
 * Calcula el total de turnos desde un objeto de tipos de turno
 * @param {Object} tiposDeTurno - Objeto con tipos de turno
 * @returns {number} Total de turnos
 */
export const calculateTotalTurnos = (tiposDeTurno) => {
  if (!tiposDeTurno || typeof tiposDeTurno !== 'object') return 0;
  
  return Object.values(tiposDeTurno).reduce((total, datos) => {
    return total + (datos?.turnos || 0);
  }, 0);
};