// src/hooks/useUtils.js

import { useCallback } from 'react';
import { createSafeDate } from '../utils/time';

export const useUtils = () => {
  
  // Currency formatting
  const formatCurrency = useCallback((amount, currency = '$') => {
    return `${currency}${amount.toFixed(2)}`;
  }, []);

  // Hours formatting
  const formatHours = useCallback((hours) => {
    return `${hours.toFixed(1)}h`;
  }, []);

  // Date formatting
  const formatDate = useCallback((dateString, format = 'full') => {
    const date = createSafeDate(dateString);
    
    switch (format) {
      case 'short':
        return date.toLocaleDateString('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      case 'medium':
        return date.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      case 'full':
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      case 'weekday':
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
      default:
        return dateString;
    }
  }, []);

  // Check if a date is today
  const isToday = useCallback((dateString) => {
    const date = createSafeDate(dateString);
    const today = new Date();
    
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }, []);

  // Check if a date is yesterday
  const isYesterday = useCallback((dateString) => {
    const date = createSafeDate(dateString);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return date.getDate() === yesterday.getDate() &&
           date.getMonth() === yesterday.getMonth() &&
           date.getFullYear() === yesterday.getFullYear();
  }, []);

  // Get relative date
  const getRelativeDate = useCallback((dateString) => {
    if (isToday(dateString)) return 'Today';
    if (isYesterday(dateString)) return 'Yesterday';
    return formatDate(dateString, 'medium');
  }, [isToday, isYesterday, formatDate]);

  // Generate unique ID
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

  // Get initials
  const getInitials = useCallback((name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  // Group items by key
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

  // Get unique values from an array
  const getUniqueValues = useCallback((array, key) => {
    if (key) {
      return [...new Set(array.map(item => item[key]))];
    }
    return [...new Set(array)];
  }, []);

  // Sort array by date descending  
  const sortByDateDesc = useCallback((array, dateKey = 'date') => {
    return [...array].sort((a, b) => new Date(b[dateKey]) - new Date(a[dateKey]));
  }, []);

  // Capitalize first letter
  const capitalize = useCallback((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }, []);

  // Truncate text
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