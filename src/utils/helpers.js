// src/utils/helpers.js

// Re-exportar utilidades consolidadas para retrocompatibilidad
export { formatCurrency, formatCurrencyWithSymbol } from './currency';
export { isToday, isPastDate, isFutureDate, formatRelativeDate as getRelativeDate } from './time';

// Generar ID único (usado para keys en React)
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Obtener iniciales de nombre (usado en avatares)
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Clamp para limitar valores (usado en cálculos)
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};