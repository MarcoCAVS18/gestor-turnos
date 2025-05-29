// src/utils/helpers.js
import ***REMOVED*** DAYS_OF_WEEK, MONTHS_SPANISH ***REMOVED*** from '../constants/app';

export const formatCurrency = (amount, currency = ') => ***REMOVED***
  return `$***REMOVED***currency***REMOVED***$***REMOVED***amount.toFixed(2)***REMOVED***`;
***REMOVED***;

export const formatHours = (hours) => ***REMOVED***
  return `$***REMOVED***hours.toFixed(1)***REMOVED***h`;
***REMOVED***;

export const formatDate = (dateString, format = 'full') => ***REMOVED***
  const date = new Date(dateString + 'T00:00:00');
  
  switch (format) ***REMOVED***
    case 'short':
      return date.toLocaleDateString('es-ES', ***REMOVED***
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      ***REMOVED***);
    case 'medium':
      return date.toLocaleDateString('es-ES', ***REMOVED***
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      ***REMOVED***);
    case 'full':
      return date.toLocaleDateString('es-ES', ***REMOVED***
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      ***REMOVED***);
    case 'weekday':
      return DAYS_OF_WEEK[date.getDay()];
    default:
      return dateString;
  ***REMOVED***
***REMOVED***;

export const isToday = (dateString) => ***REMOVED***
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
***REMOVED***;

export const isYesterday = (dateString) => ***REMOVED***
  const date = new Date(dateString + 'T00:00:00');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return date.getDate() === yesterday.getDate() &&
         date.getMonth() === yesterday.getMonth() &&
         date.getFullYear() === yesterday.getFullYear();
***REMOVED***;

export const getRelativeDate = (dateString) => ***REMOVED***
  if (isToday(dateString)) return 'Hoy';
  if (isYesterday(dateString)) return 'Ayer';
  return formatDate(dateString, 'medium');
***REMOVED***;

export const generateId = () => ***REMOVED***
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
***REMOVED***;

export const debounce = (func, wait) => ***REMOVED***
  let timeout;
  return function executedFunction(...args) ***REMOVED***
    const later = () => ***REMOVED***
      clearTimeout(timeout);
      func(...args);
    ***REMOVED***;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  ***REMOVED***;
***REMOVED***;

export const throttle = (func, limit) => ***REMOVED***
  let inThrottle;
  return function(...args) ***REMOVED***
    if (!inThrottle) ***REMOVED***
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    ***REMOVED***
  ***REMOVED***;
***REMOVED***;

export const clamp = (value, min, max) => ***REMOVED***
  return Math.min(Math.max(value, min), max);
***REMOVED***;

export const getInitials = (name) => ***REMOVED***
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
***REMOVED***;