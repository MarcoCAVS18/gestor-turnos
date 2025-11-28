// src/utils/arrayUtils.js
// Utilidades para trabajar con arrays

/**
 * Asegura que un valor sea un array válido
 * Si el valor es null, undefined o no es un array, devuelve un array vacío
 *
 * @param {any} value - Valor a validar
 * @returns {Array} - Array válido
 *
 * @example
 * ensureArray([1, 2, 3]) // [1, 2, 3]
 * ensureArray(null) // []
 * ensureArray(undefined) // []
 * ensureArray("not an array") // []
 */
export const ensureArray = (value) => {
  return Array.isArray(value) ? value : [];
};

/**
 * Suma los valores de una propiedad específica en un array de objetos
 *
 * @param {Array} array - Array de objetos
 * @param {string} key - Nombre de la propiedad a sumar
 * @returns {number} - Suma total
 *
 * @example
 * const datos = [{ total: 100 }, { total: 200 }, { total: 50 }];
 * sumBy(datos, 'total') // 350
 */
export const sumBy = (array, key) => {
  if (!Array.isArray(array)) return 0;
  return array.reduce((sum, item) => sum + (item[key] || 0), 0);
};

/**
 * Agrupa un array de objetos por una propiedad específica
 *
 * @param {Array} array - Array de objetos
 * @param {string|Function} keyOrFn - Propiedad o función para agrupar
 * @returns {Object} - Objeto con items agrupados
 *
 * @example
 * const turnos = [
 *   { fecha: '2025-01-01', horas: 8 },
 *   { fecha: '2025-01-01', horas: 4 },
 *   { fecha: '2025-01-02', horas: 6 }
 * ];
 * groupBy(turnos, 'fecha')
 * // { '2025-01-01': [...], '2025-01-02': [...] }
 */
export const groupBy = (array, keyOrFn) => {
  if (!Array.isArray(array)) return {};

  return array.reduce((groups, item) => {
    const key = typeof keyOrFn === 'function' ? keyOrFn(item) : item[keyOrFn];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
};

/**
 * Encuentra un objeto en un array por ID de forma segura
 *
 * @param {Array} array - Array de objetos
 * @param {string|number} id - ID a buscar
 * @param {string} idKey - Nombre de la propiedad ID (default: 'id')
 * @returns {Object|null} - Objeto encontrado o null
 *
 * @example
 * const trabajos = [{ id: '1', nombre: 'A' }, { id: '2', nombre: 'B' }];
 * findById(trabajos, '1') // { id: '1', nombre: 'A' }
 * findById(trabajos, '999') // null
 */
export const findById = (array, id, idKey = 'id') => {
  if (!Array.isArray(array) || !id) return null;
  return array.find(item => item[idKey] === id) || null;
};

/**
 * Ordena un array de objetos por una propiedad de fecha de forma descendente
 *
 * @param {Array} array - Array de objetos
 * @param {string} dateKey - Nombre de la propiedad de fecha
 * @returns {Array} - Array ordenado (copia)
 *
 * @example
 * const turnos = [
 *   { fecha: '2025-01-01' },
 *   { fecha: '2025-01-03' },
 *   { fecha: '2025-01-02' }
 * ];
 * sortByDateDesc(turnos, 'fecha')
 * // [{ fecha: '2025-01-03' }, { fecha: '2025-01-02' }, { fecha: '2025-01-01' }]
 */
export const sortByDateDesc = (array, dateKey = 'fecha') => {
  if (!Array.isArray(array)) return [];
  return [...array].sort((a, b) => {
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);
    return dateB - dateA;
  });
};
