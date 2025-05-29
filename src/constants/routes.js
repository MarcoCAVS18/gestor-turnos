// src/constants/routes.js
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  TRABAJOS: '/trabajos',
  TURNOS: '/turnos',
  ESTADISTICAS: '/estadisticas',
  CALENDARIO: '/calendario',
  AJUSTES: '/ajustes',
  COMPARTIR: '/compartir/:token'
};

export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD
];

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.TRABAJOS,
  ROUTES.TURNOS,
  ROUTES.ESTADISTICAS,
  ROUTES.CALENDARIO,
  ROUTES.AJUSTES
];