// src/utils/currency.js

/**
 * Formats a number as Australian currency
 * @param {number} amount
 * @param {object} options - Additional formatting options
 * @returns {string}
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
 * Formats an amount with 2 decimal places for precision display
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrencyPrecise = (amount) => {
  return formatCurrency(amount, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Formats an amount keeping cents when it has them: 28.5 -> "$28.50", 30 -> "$30".
 * Use for pay rates and per-shift amounts, where the user compares the figure
 * against a payslip or an award rate (e.g. $30.13/h must not read "$30/h").
 * formatCurrency, which rounds to whole dollars, stays for large totals.
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrencyExact = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return formatCurrency(0);
  }
  const hasCents = Math.round(Number(amount) * 100) % 100 !== 0;
  return hasCents ? formatCurrencyPrecise(amount) : formatCurrency(amount);
};

/**
 * Formats an amount with a custom symbol (backward compatibility)
 * @param {number} amount
 * @param {string} symbol - Currency symbol (default: '$')
 * @returns {string}
 */
export const formatCurrencyWithSymbol = (amount, symbol = '$') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${symbol}0.00`;
  }
  return `${symbol}${Number(amount).toFixed(2)}`;
};