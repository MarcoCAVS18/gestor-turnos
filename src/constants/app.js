// src/constants/app.js

export const DEFAULT_USER_SETTINGS = {
  colorPrincipal: '#EC4899',
  emojiUsuario: '😊',
  descuentoDefault: 15,
  rangosTurnos: {
    diurnoInicio: 6,
    diurnoFin: 14,
    tardeInicio: 14,
    tardeFin: 20,
    nocheInicio: 20
  }
};

export const COMMON_EMOJIS = [
  '😊', '😎', '🚀', '💼', '⭐', '🔥', 
  '💻', '📊', '🎯', '💪', '🌟', '⚡'
];

export const SHIFT_RANGES = {
  DIURNO: { start: 6, end: 14, label: 'Morning Shift' },
  TARDE: { start: 14, end: 20, label: 'Afternoon Shift' },
  NOCHE: { start: 20, end: 24, label: 'Night Shift' }
};

export const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
  'Thursday', 'Friday', 'Saturday'
];

export const DAYS_ABBREV = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
];

export const MONTHS_ENGLISH = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];