// src/constants/validation.js

export const VALIDATION_RULES = ***REMOVED***
  required: (value) => !value || !value.toString().trim() ? 'This field is required' : '',
  
  email: (value) => ***REMOVED***
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value && !emailRegex.test(value) ? 'Invalid email' : '';
  ***REMOVED***,
  
  minLength: (min) => (value) => 
    value && value.length < min ? `Minimum $***REMOVED***min***REMOVED*** characters` : '',
  
  maxLength: (max) => (value) => 
    value && value.length > max ? `Maximum $***REMOVED***max***REMOVED*** characters` : '',
  
  positiveNumber: (value) => ***REMOVED***
    const num = parseFloat(value);
    return value && (isNaN(num) || num <= 0) ? 'Must be a number greater than 0' : '';
  ***REMOVED***,
  
  timeFormat: (value) => ***REMOVED***
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return value && !timeRegex.test(value) ? 'Invalid time format (HH:MM)' : '';
  ***REMOVED***,
  
  dateFormat: (value) => ***REMOVED***
    const dateRegex = /^\d***REMOVED***4***REMOVED***-\d***REMOVED***2***REMOVED***-\d***REMOVED***2***REMOVED***$/;
    return value && !dateRegex.test(value) ? 'Invalid date format' : '';
  ***REMOVED***,
  
  password: (value) => ***REMOVED***
    if (!value) return 'Password required';
    if (value.length < 6) return 'Minimum 6 characters';
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    
    if (!hasUpperCase && !hasLowerCase) return 'Must contain at least one letter';
    if (!hasNumber && !hasUpperCase && !hasLowerCase) return 'Password too weak';
    
    return '';
  ***REMOVED***
***REMOVED***;