// src/utils/helpers.js - LIMPIO Y OPTIMIZADO

// Formateo de moneda (usado en componentes)
export const formatCurrency = (amount, currency = '$') => {
  return `${currency}${amount.toFixed(2)}`;
};

// Formateo de horas (usado en componentes)
export const formatHours = (hours) => {
  return `${hours.toFixed(1)}h`;
};

// Verificar si una fecha es hoy (usado en calendarios)
export const isToday = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

// Verificar si una fecha es ayer (usado en listas)
export const isYesterday = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return date.getDate() === yesterday.getDate() &&
         date.getMonth() === yesterday.getMonth() &&
         date.getFullYear() === yesterday.getFullYear();
};

// Obtener fecha relativa (usado en múltiples lugares)
export const getRelativeDate = (dateString) => {
  if (isToday(dateString)) return 'Hoy';
  if (isYesterday(dateString)) return 'Ayer';
  
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

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