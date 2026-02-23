// src/utils/helpers.js

// Re-export consolidated utilities for backward compatibility
export { formatCurrency, formatCurrencyWithSymbol } from './currency';
export { isToday, isPastDate, isFutureDate, formatRelativeDate as getRelativeDate } from './time';

// Generate a unique ID (used for React keys)
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
};

// Get name initials (used in avatars)
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Clamp a value between min and max
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};