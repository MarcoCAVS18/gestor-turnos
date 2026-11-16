// src/utils/deliveryUtils.js
// Shared helpers for delivery works/shifts so the same logic isn't duplicated
// (and allowed to drift) across forms, modals, calculations and stats.

import { getShiftGrossEarnings } from './shiftUtils';

/**
 * Whether a delivery vehicle consumes fuel (so the fuel-expense field applies).
 * Accepts both the vehicle id ('motorbike', 'car', 'bicycle', 'on_foot') and a
 * display name in any language. Motorised vehicles (car / motorbike) need fuel;
 * bicycle and on-foot do not.
 *
 * NOTE: the vehicle selector stores the id ('motorbike'), so a check for
 * 'motorcycle' alone silently fails — that was the bug this helper replaces.
 *
 * @param {string} vehicle - vehicle id or display name
 * @returns {boolean}
 */
export const vehicleNeedsFuel = (vehicle) => {
  if (!vehicle) return false;
  const v = vehicle.toString().toLowerCase();
  return (
    v.includes('car') ||
    v.includes('auto') ||
    v.includes('moto') // covers motorbike / motorcycle / moto
  );
};

/**
 * Fuel expense for a delivery shift, tolerant of the legacy field name.
 * New shifts use `fuelExpense`; older ones used `expenses`.
 * @param {object} shift
 * @returns {number}
 */
export const getShiftFuelExpense = (shift) => {
  if (!shift) return 0;
  return parseFloat(shift.fuelExpense ?? shift.expenses) || 0;
};

/**
 * Net earnings for a delivery shift = gross (base + tips) − fuel expense.
 * When there is no fuel expense, this equals the gross. Used so the general
 * totals (weekly stats, dashboard) count delivery net of fuel.
 * @param {object} shift
 * @returns {number}
 */
export const getShiftNetEarnings = (shift) => {
  return getShiftGrossEarnings(shift) - getShiftFuelExpense(shift);
};
