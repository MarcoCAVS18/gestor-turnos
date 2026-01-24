// src/hooks/useUtils.js

import ***REMOVED*** useCallback ***REMOVED*** from 'react';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../utils/time';

export const useUtils = () => ***REMOVED***
  
  // Currency formatting
  const formatCurrency = useCallback((amount, currency = '$') => ***REMOVED***
    return `$***REMOVED***currency***REMOVED***$***REMOVED***amount.toFixed(2)***REMOVED***`;
  ***REMOVED***, []);

  // Hours formatting
  const formatHours = useCallback((hours) => ***REMOVED***
    return `$***REMOVED***hours.toFixed(1)***REMOVED***h`;
  ***REMOVED***, []);

  // Date formatting
  const formatDate = useCallback((dateString, format = 'full') => ***REMOVED***
    const date = createSafeDate(dateString);
    
    switch (format) ***REMOVED***
      case 'short':
        return date.toLocaleDateString('en-US', ***REMOVED***
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        ***REMOVED***);
      case 'medium':
        return date.toLocaleDateString('en-US', ***REMOVED***
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        ***REMOVED***);
      case 'full':
        return date.toLocaleDateString('en-US', ***REMOVED***
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        ***REMOVED***);
      case 'weekday':
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
      default:
        return dateString;
    ***REMOVED***
  ***REMOVED***, []);

  // Check if a date is today
  const isToday = useCallback((dateString) => ***REMOVED***
    const date = createSafeDate(dateString);
    const today = new Date();
    
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  ***REMOVED***, []);

  // Check if a date is yesterday
  const isYesterday = useCallback((dateString) => ***REMOVED***
    const date = createSafeDate(dateString);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return date.getDate() === yesterday.getDate() &&
           date.getMonth() === yesterday.getMonth() &&
           date.getFullYear() === yesterday.getFullYear();
  ***REMOVED***, []);

  // Get relative date
  const getRelativeDate = useCallback((dateString) => ***REMOVED***
    if (isToday(dateString)) return 'Today';
    if (isYesterday(dateString)) return 'Yesterday';
    return formatDate(dateString, 'medium');
  ***REMOVED***, [isToday, isYesterday, formatDate]);

  // Generate unique ID
  const generateId = useCallback(() => ***REMOVED***
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  ***REMOVED***, []);

  // Debounce
  const debounce = useCallback((func, wait) => ***REMOVED***
    let timeout;
    return function executedFunction(...args) ***REMOVED***
      const later = () => ***REMOVED***
        clearTimeout(timeout);
        func(...args);
      ***REMOVED***;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    ***REMOVED***;
  ***REMOVED***, []);

  // Throttle  
  const throttle = useCallback((func, limit) => ***REMOVED***
    let inThrottle;
    return function(...args) ***REMOVED***
      if (!inThrottle) ***REMOVED***
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***, []);

  // Clamp number
  const clamp = useCallback((value, min, max) => ***REMOVED***
    return Math.min(Math.max(value, min), max);
  ***REMOVED***, []);

  // Get initials
  const getInitials = useCallback((name) => ***REMOVED***
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  ***REMOVED***, []);

  // Group items by key
  const groupBy = useCallback((array, key) => ***REMOVED***
    return array.reduce((result, item) => ***REMOVED***
      const group = typeof key === 'function' ? key(item) : item[key];
      if (!result[group]) ***REMOVED***
        result[group] = [];
      ***REMOVED***
      result[group].push(item);
      return result;
    ***REMOVED***, ***REMOVED******REMOVED***);
  ***REMOVED***, []);

  // Get unique values from an array
  const getUniqueValues = useCallback((array, key) => ***REMOVED***
    if (key) ***REMOVED***
      return [...new Set(array.map(item => item[key]))];
    ***REMOVED***
    return [...new Set(array)];
  ***REMOVED***, []);

  // Sort array by date descending  
  const sortByDateDesc = useCallback((array, dateKey = 'date') => ***REMOVED***
    return [...array].sort((a, b) => new Date(b[dateKey]) - new Date(a[dateKey]));
  ***REMOVED***, []);

  // Capitalize first letter
  const capitalize = useCallback((str) => ***REMOVED***
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  ***REMOVED***, []);

  // Truncate text
  const truncate = useCallback((str, length = 100) => ***REMOVED***
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  ***REMOVED***, []);

  return ***REMOVED***
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
  ***REMOVED***;
***REMOVED***;