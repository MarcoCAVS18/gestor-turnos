// src/constants/validation.js
export const VALIDATION_RULES = {
  required: (value) => !value || !value.toString().trim() ? 'Este campo es requerido' : '',
  
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value && !emailRegex.test(value) ? 'Email inválido' : '';
  },
  
  minLength: (min) => (value) => 
    value && value.length < min ? `Mínimo ${min} caracteres` : '',
  
  maxLength: (max) => (value) => 
    value && value.length > max ? `Máximo ${max} caracteres` : '',
  
  positiveNumber: (value) => {
    const num = parseFloat(value);
    return value && (isNaN(num) || num <= 0) ? 'Debe ser un número mayor a 0' : '';
  },
  
  timeFormat: (value) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return value && !timeRegex.test(value) ? 'Formato de hora inválido (HH:MM)' : '';
  },
  
  dateFormat: (value) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return value && !dateRegex.test(value) ? 'Formato de fecha inválido' : '';
  },
  
  password: (value) => {
    if (!value) return 'Contraseña requerida';
    if (value.length < 6) return 'Mínimo 6 caracteres';
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    
    if (!hasUpperCase && !hasLowerCase) return 'Debe contener al menos una letra';
    if (!hasNumber && !hasUpperCase && !hasLowerCase) return 'Contraseña muy débil';
    
    return '';
  }
};