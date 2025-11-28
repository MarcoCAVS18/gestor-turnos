// src/utils/arrayUtils.js
// Utilidades para trabajar con arrays

/**
 * Asegura que un valor sea un array válido
 * Si el valor es null, undefined o no es un array, devuelve un array vacío
 *
 * @param ***REMOVED***any***REMOVED*** value - Valor a validar
 * @returns ***REMOVED***Array***REMOVED*** - Array válido
 *
 * @example
 * ensureArray([1, 2, 3]) // [1, 2, 3]
 * ensureArray(null) // []
 * ensureArray(undefined) // []
 * ensureArray("not an array") // []
 */
export const ensureArray = (value) => ***REMOVED***
  return Array.isArray(value) ? value : [];
***REMOVED***;

/**
 * Suma los valores de una propiedad específica en un array de objetos
 *
 * @param ***REMOVED***Array***REMOVED*** array - Array de objetos
 * @param ***REMOVED***string***REMOVED*** key - Nombre de la propiedad a sumar
 * @returns ***REMOVED***number***REMOVED*** - Suma total
 *
 * @example
 * const datos = [***REMOVED*** total: 100 ***REMOVED***, ***REMOVED*** total: 200 ***REMOVED***, ***REMOVED*** total: 50 ***REMOVED***];
 * sumBy(datos, 'total') // 350
 */
export const sumBy = (array, key) => ***REMOVED***
  if (!Array.isArray(array)) return 0;
  return array.reduce((sum, item) => sum + (item[key] || 0), 0);
***REMOVED***;

/**
 * Agrupa un array de objetos por una propiedad específica
 *
 * @param ***REMOVED***Array***REMOVED*** array - Array de objetos
 * @param ***REMOVED***string|Function***REMOVED*** keyOrFn - Propiedad o función para agrupar
 * @returns ***REMOVED***Object***REMOVED*** - Objeto con items agrupados
 *
 * @example
 * const turnos = [
 *   ***REMOVED*** fecha: '2025-01-01', horas: 8 ***REMOVED***,
 *   ***REMOVED*** fecha: '2025-01-01', horas: 4 ***REMOVED***,
 *   ***REMOVED*** fecha: '2025-01-02', horas: 6 ***REMOVED***
 * ];
 * groupBy(turnos, 'fecha')
 * // ***REMOVED*** '2025-01-01': [...], '2025-01-02': [...] ***REMOVED***
 */
export const groupBy = (array, keyOrFn) => ***REMOVED***
  if (!Array.isArray(array)) return ***REMOVED******REMOVED***;

  return array.reduce((groups, item) => ***REMOVED***
    const key = typeof keyOrFn === 'function' ? keyOrFn(item) : item[keyOrFn];
    if (!groups[key]) ***REMOVED***
      groups[key] = [];
    ***REMOVED***
    groups[key].push(item);
    return groups;
  ***REMOVED***, ***REMOVED******REMOVED***);
***REMOVED***;

/**
 * Encuentra un objeto en un array por ID de forma segura
 *
 * @param ***REMOVED***Array***REMOVED*** array - Array de objetos
 * @param ***REMOVED***string|number***REMOVED*** id - ID a buscar
 * @param ***REMOVED***string***REMOVED*** idKey - Nombre de la propiedad ID (default: 'id')
 * @returns ***REMOVED***Object|null***REMOVED*** - Objeto encontrado o null
 *
 * @example
 * const trabajos = [***REMOVED*** id: '1', nombre: 'A' ***REMOVED***, ***REMOVED*** id: '2', nombre: 'B' ***REMOVED***];
 * findById(trabajos, '1') // ***REMOVED*** id: '1', nombre: 'A' ***REMOVED***
 * findById(trabajos, '999') // null
 */
export const findById = (array, id, idKey = 'id') => ***REMOVED***
  if (!Array.isArray(array) || !id) return null;
  return array.find(item => item[idKey] === id) || null;
***REMOVED***;

/**
 * Ordena un array de objetos por una propiedad de fecha de forma descendente
 *
 * @param ***REMOVED***Array***REMOVED*** array - Array de objetos
 * @param ***REMOVED***string***REMOVED*** dateKey - Nombre de la propiedad de fecha
 * @returns ***REMOVED***Array***REMOVED*** - Array ordenado (copia)
 *
 * @example
 * const turnos = [
 *   ***REMOVED*** fecha: '2025-01-01' ***REMOVED***,
 *   ***REMOVED*** fecha: '2025-01-03' ***REMOVED***,
 *   ***REMOVED*** fecha: '2025-01-02' ***REMOVED***
 * ];
 * sortByDateDesc(turnos, 'fecha')
 * // [***REMOVED*** fecha: '2025-01-03' ***REMOVED***, ***REMOVED*** fecha: '2025-01-02' ***REMOVED***, ***REMOVED*** fecha: '2025-01-01' ***REMOVED***]
 */
export const sortByDateDesc = (array, dateKey = 'fecha') => ***REMOVED***
  if (!Array.isArray(array)) return [];
  return [...array].sort((a, b) => ***REMOVED***
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);
    return dateB - dateA;
  ***REMOVED***);
***REMOVED***;
