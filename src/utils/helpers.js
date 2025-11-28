// src/utils/helpers.js

// Re-exportar utilidades consolidadas para retrocompatibilidad
export ***REMOVED*** formatCurrency, formatCurrencyWithSymbol ***REMOVED*** from './currency';
export ***REMOVED*** isToday, isPastDate, isFutureDate, formatRelativeDate as getRelativeDate ***REMOVED*** from './time';

// Generar ID único (usado para keys en React)
export const generateId = () => ***REMOVED***
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
***REMOVED***;

// Obtener iniciales de nombre (usado en avatares)
export const getInitials = (name) => ***REMOVED***
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
***REMOVED***;

// Clamp para limitar valores (usado en cálculos)
export const clamp = (value, min, max) => ***REMOVED***
  return Math.min(Math.max(value, min), max);
***REMOVED***;