// src/utils/helpers.js
import { DAYS_OF_WEEK, MONTHS_SPANISH } from '../constants/app';

export const formatCurrency = (amount, currency = ') => {
  return `${currency}${amount.toFixed(2)}`;
};

export const formatHours = (hours) => {
  return `${hours.toFixed(1)}h`;
};

export const formatDate = (dateString, format = 'full') => {
  const date = new Date(dateString + 'T00:00:00');
  
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
      return DAYS_OF_WEEK[date.getDay()];
    default:
      return dateString;
  }
};

export const isToday = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

export const isYesterday = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return date.getDate() === yesterday.getDate() &&
         date.getMonth() === yesterday.getMonth() &&
         date.getFullYear() === yesterday.getFullYear();
};

export const getRelativeDate = (dateString) => {
  if (isToday(dateString)) return 'Hoy';
  if (isYesterday(dateString)) return 'Ayer';
  return formatDate(dateString, 'medium');
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};