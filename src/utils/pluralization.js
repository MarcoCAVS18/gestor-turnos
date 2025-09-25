// src/utils/pluralization.js - Utilidad completa para pluralización

/**
 * Pluraliza la palabra "turno" según la cantidad
 * @param ***REMOVED***number***REMOVED*** cantidad - Número de turnos
 * @param ***REMOVED***boolean***REMOVED*** uppercase - Si debe estar en mayúsculas (por defecto false)
 * @returns ***REMOVED***string***REMOVED*** "turno" o "turnos" según corresponda
 */
export const pluralizeTurnos = (cantidad, uppercase = false) => ***REMOVED***
  const word = cantidad === 1 ? 'turno' : 'turnos';
  return uppercase ? word.toUpperCase() : word;
***REMOVED***;

/**
 * Formatea cantidad + palabra pluralizada
 * @param ***REMOVED***number***REMOVED*** cantidad - Número de turnos
 * @param ***REMOVED***boolean***REMOVED*** uppercase - Si la palabra debe estar en mayúsculas
 * @returns ***REMOVED***string***REMOVED*** Ej: "1 turno", "5 turnos"
 */
export const formatTurnosCount = (cantidad, uppercase = false) => ***REMOVED***
  return `$***REMOVED***cantidad***REMOVED*** $***REMOVED***pluralizeTurnos(cantidad, uppercase)***REMOVED***`;
***REMOVED***;

/**
 * Genera títulos dinámicos basados en la cantidad de elementos
 * @param ***REMOVED***number***REMOVED*** totalCount - Cantidad total de elementos
 * @param ***REMOVED***string***REMOVED*** baseTitle - Título base (ej: "Tipos de")
 * @param ***REMOVED***string***REMOVED*** singular - Palabra en singular
 * @param ***REMOVED***string***REMOVED*** plural - Palabra en plural (opcional)
 * @returns ***REMOVED***string***REMOVED*** Título pluralizado
 */
export const getDynamicTitle = (totalCount, baseTitle, singular, plural = null) => ***REMOVED***
  const word = totalCount === 1 ? singular : (plural || `$***REMOVED***singular***REMOVED***s`);
  return `$***REMOVED***baseTitle***REMOVED*** $***REMOVED***word***REMOVED***`;
***REMOVED***;

/**
 * Pluraliza "tipo/tipos de turno" según cantidad
 * @param ***REMOVED***number***REMOVED*** totalTurnos - Cantidad total de turnos
 * @returns ***REMOVED***string***REMOVED*** "Tipo de turno" o "Tipos de turno"
 */
export const pluralizeTiposDeTurno = (totalTurnos) => ***REMOVED***
  return totalTurnos === 1 ? 'Tipo de turno' : 'Tipos de turno';
***REMOVED***;

/**
 * Pluraliza cualquier palabra según cantidad
 * @param ***REMOVED***number***REMOVED*** cantidad - Número de elementos
 * @param ***REMOVED***string***REMOVED*** singular - Forma singular de la palabra
 * @param ***REMOVED***string***REMOVED*** plural - Forma plural de la palabra (opcional, por defecto agrega 's')
 * @returns ***REMOVED***string***REMOVED*** La palabra en singular o plural
 */
export const pluralize = (cantidad, singular, plural = null) => ***REMOVED***
  if (cantidad === 1) return singular;
  return plural || `$***REMOVED***singular***REMOVED***s`;
***REMOVED***;

/**
 * Calcula el total de turnos desde un objeto de tipos de turno
 * @param ***REMOVED***Object***REMOVED*** tiposDeTurno - Objeto con tipos de turno
 * @returns ***REMOVED***number***REMOVED*** Total de turnos
 */
export const calculateTotalTurnos = (tiposDeTurno) => ***REMOVED***
  if (!tiposDeTurno || typeof tiposDeTurno !== 'object') return 0;
  
  return Object.values(tiposDeTurno).reduce((total, datos) => ***REMOVED***
    return total + (datos?.turnos || 0);
  ***REMOVED***, 0);
***REMOVED***;