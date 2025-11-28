// src/utils/currency.js

/**
 * Formatea un número como moneda australiana
 * @param ***REMOVED***number***REMOVED*** amount - Cantidad a formatear
 * @param ***REMOVED***object***REMOVED*** options - Opciones adicionales de formateo
 * @returns ***REMOVED***string***REMOVED*** - Cantidad formateada como moneda
 */
export const formatCurrency = (amount, options = ***REMOVED******REMOVED***) => ***REMOVED***
  if (amount === null || amount === undefined || isNaN(amount)) ***REMOVED***
    return '$0';
  ***REMOVED***

  const defaultOptions = ***REMOVED***
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  ***REMOVED***;
  
  return new Intl.NumberFormat('en-AU', ***REMOVED***
    ...defaultOptions,
    ...options
  ***REMOVED***).format(amount);
***REMOVED***;

/**
 * Formatea una cantidad con decimales para mostrar precisión
 * @param ***REMOVED***number***REMOVED*** amount - Cantidad a formatear
 * @returns ***REMOVED***string***REMOVED*** - Cantidad formateada con 2 decimales
 */
export const formatCurrencyPrecise = (amount) => ***REMOVED***
  return formatCurrency(amount, ***REMOVED***
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  ***REMOVED***);
***REMOVED***;

/**
 * Formatea una cantidad con símbolo personalizado (retrocompatibilidad)
 * @param ***REMOVED***number***REMOVED*** amount - Cantidad a formatear
 * @param ***REMOVED***string***REMOVED*** symbol - Símbolo de moneda (default: '$')
 * @returns ***REMOVED***string***REMOVED*** - Cantidad formateada
 */
export const formatCurrencyWithSymbol = (amount, symbol = '$') => ***REMOVED***
  if (amount === null || amount === undefined || isNaN(amount)) ***REMOVED***
    return `$***REMOVED***symbol***REMOVED***0.00`;
  ***REMOVED***
  return `$***REMOVED***symbol***REMOVED***$***REMOVED***Number(amount).toFixed(2)***REMOVED***`;
***REMOVED***;