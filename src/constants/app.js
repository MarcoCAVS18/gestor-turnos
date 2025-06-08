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

export const TURN_RANGES = {
  DIURNO: { start: 6, end: 14, label: 'Diurno' },
  TARDE: { start: 14, end: 20, label: 'Tarde' },
  NOCHE: { start: 20, end: 24, label: 'Nocturno' }
};

export const DAYS_OF_WEEK = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 
  'Jueves', 'Viernes', 'Sábado'
];

export const DAYS_ABBREV = [
  'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'
];

export const MONTHS_SPANISH = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];