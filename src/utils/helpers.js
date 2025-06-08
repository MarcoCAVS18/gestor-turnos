// src/utils/helpers.js

// Formateo de moneda (usado en componentes)
export const formatCurrency = (amount, currency = '$') => ***REMOVED***
  return `$***REMOVED***currency***REMOVED***$***REMOVED***amount.toFixed(2)***REMOVED***`;
***REMOVED***;

// Formateo de horas (usado en componentes)
export const formatHours = (hours) => ***REMOVED***
  return `$***REMOVED***hours.toFixed(1)***REMOVED***h`;
***REMOVED***;

// Verificar si una fecha es hoy (usado en calendarios)
export const isToday = (dateString) => ***REMOVED***
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
***REMOVED***;

// Verificar si una fecha es ayer (usado en listas)
export const isYesterday = (dateString) => ***REMOVED***
  const date = new Date(dateString + 'T00:00:00');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return date.getDate() === yesterday.getDate() &&
         date.getMonth() === yesterday.getMonth() &&
         date.getFullYear() === yesterday.getFullYear();
***REMOVED***;

// Obtener fecha relativa (usado en múltiples lugares)
export const getRelativeDate = (dateString) => ***REMOVED***
  if (isToday(dateString)) return 'Hoy';
  if (isYesterday(dateString)) return 'Ayer';
  
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('es-ES', ***REMOVED***
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  ***REMOVED***);
***REMOVED***;

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