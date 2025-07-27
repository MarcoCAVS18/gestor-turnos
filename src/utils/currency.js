// src/utils/currency.js

/**
 * Formatea un número como moneda australiana
 * @param {number} amount - Cantidad a formatear
 * @param {object} options - Opciones adicionales de formateo
 * @returns {string} - Cantidad formateada como moneda
 */
export const formatCurrency = (amount, options = {}) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0';
  }

  const defaultOptions = {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };
  
  return new Intl.NumberFormat('en-AU', {
    ...defaultOptions,
    ...options
  }).format(amount);
};

/**
 * Formatea una cantidad con decimales para mostrar precisión
 * @param {number} amount - Cantidad a formatear
 * @returns {string} - Cantidad formateada con 2 decimales
 */
export const formatCurrencyPrecise = (amount) => {
  return formatCurrency(amount, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};