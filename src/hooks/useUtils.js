// src/hooks/useUtils.js

import { useCallback } from 'react';
import { createSafeDate } from '../utils/time';

export const useUtils = () => {
  
  // Formateo de moneda
  const formatCurrency = useCallback((amount, currency = '$') => {
    return `${currency}${amount.toFixed(2)}`;
  }, []);

  // Formateo de horas
  const formatHours = useCallback((hours) => {
    return `${hours.toFixed(1)}h`;
  }, []);

  // Formateo de fechas
  const formatDate = useCallback((dateString, format = 'full') => {
    const date = createSafeDate(dateString);
    
    switch (format) {
      case 'short':
        return date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      case 'medium':
        return date.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      case 'full':
        return date.toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      case 'weekday':
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return days[date.getDay()];
      default:
        return dateString;
    }
  }, []);

  // Verificar si una fecha es hoy
  const isToday = useCallback((dateString) => {
    const date = createSafeDate(dateString);
    const today = new Date();
    
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }, []);

  // Verificar si una fecha es ayer
  const isYesterday = useCallback((dateString) => {
    const date = createSafeDate(dateString);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return date.getDate() === yesterday.getDate() &&
           date.getMonth() === yesterday.getMonth() &&
           date.getFullYear() === yesterday.getFullYear();
  }, []);

  // Obtener fecha relativa
  const getRelativeDate = useCallback((dateString) => {
    if (isToday(dateString)) return 'Hoy';
    if (isYesterday(dateString)) return 'Ayer';
    return formatDate(dateString, 'medium');
  }, [isToday, isYesterday, formatDate]);

  // Generar ID único
  const generateId = useCallback(() => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }, []);

  // Debounce
  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  // Throttle  
  const throttle = useCallback((func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Clamp number
  const clamp = useCallback((value, min, max) => {
    return Math.min(Math.max(value, min), max);
  }, []);

  // Obtener iniciales
  const getInitials = useCallback((name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  // Agrupar elementos por clave
  const groupBy = useCallback((array, key) => {
    return array.reduce((result, item) => {
      const group = typeof key === 'function' ? key(item) : item[key];
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    }, {});
  }, []);

  // Obtener valores únicos de un array
  const getUniqueValues = useCallback((array, key) => {
    if (key) {
      return [...new Set(array.map(item => item[key]))];
    }
    return [...new Set(array)];
  }, []);

  // Ordenar array por fecha descendente  
  const sortByDateDesc = useCallback((array, dateKey = 'fecha') => {
    return [...array].sort((a, b) => new Date(b[dateKey]) - new Date(a[dateKey]));
  }, []);

  // Capitalizar primera letra
  const capitalize = useCallback((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }, []);

  // Truncar texto
  const truncate = useCallback((str, length = 100) => {
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  }, []);

  return {
    formatCurrency,
    formatHours,
    formatDate,
    isToday,
    isYesterday,
    getRelativeDate,
    generateId,
    debounce,
    throttle,
    clamp,
    getInitials,
    groupBy,
    getUniqueValues,
    sortByDateDesc,
    capitalize,
    truncate
  };
};