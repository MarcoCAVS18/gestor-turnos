// src/constants/validation.js

export const VALIDATION_RULES = ***REMOVED***
  required: (value) => !value || !value.toString().trim() ? 'Este campo es requerido' : '',
  
  email: (value) => ***REMOVED***
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value && !emailRegex.test(value) ? 'Email inválido' : '';
  ***REMOVED***,
  
  minLength: (min) => (value) => 
    value && value.length < min ? `Mínimo $***REMOVED***min***REMOVED*** caracteres` : '',
  
  maxLength: (max) => (value) => 
    value && value.length > max ? `Máximo $***REMOVED***max***REMOVED*** caracteres` : '',
  
  positiveNumber: (value) => ***REMOVED***
    const num = parseFloat(value);
    return value && (isNaN(num) || num <= 0) ? 'Debe ser un número mayor a 0' : '';
  ***REMOVED***,
  
  timeFormat: (value) => ***REMOVED***
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return value && !timeRegex.test(value) ? 'Formato de hora inválido (HH:MM)' : '';
  ***REMOVED***,
  
  dateFormat: (value) => ***REMOVED***
    const dateRegex = /^\d***REMOVED***4***REMOVED***-\d***REMOVED***2***REMOVED***-\d***REMOVED***2***REMOVED***$/;
    return value && !dateRegex.test(value) ? 'Formato de fecha inválido' : '';
  ***REMOVED***,
  
  password: (value) => ***REMOVED***
    if (!value) return 'Contraseña requerida';
    if (value.length < 6) return 'Mínimo 6 caracteres';
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    
    if (!hasUpperCase && !hasLowerCase) return 'Debe contener al menos una letra';
    if (!hasNumber && !hasUpperCase && !hasLowerCase) return 'Contraseña muy débil';
    
    return '';
  ***REMOVED***
***REMOVED***;