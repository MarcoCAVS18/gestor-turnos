// src/utils/statsCalculations.js

import { determineShiftType } from './shiftDetailsUtils';
import { createSafeDate } from './time';
import { formatCurrency } from './currency';
import { formatHoursDecimal as formatHours } from './time/timeCalculations';

/**
 * Formats a given number of minutes into a string like "1H 30M".
 * @param {number} minutes - The total minutes to format.
 * @returns {string} - The formatted time string.
 */
export const formatMinutesToHoursAndMinutes = (minutes) => {
  if (!minutes || minutes === 0) return '0 MIN';
  
  if (minutes < 60) {
    return `${minutes} MIN`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}H`;
  }
  
  return `${hours}H ${remainingMinutes}M`;
};

/**
 * Calculates a comprehensive set of weekly statistics based on shifts and other data.
 */
export const calculateWeeklyStats = ({
  shifts,
  deliveryShifts,
  allWorks,
  calculatePayment,
  shiftRanges,
  weekOffset = 0,
}) => {
  const traditionalShifts = Array.isArray(shifts) ? shifts : [];
  const validDeliveryShifts = Array.isArray(deliveryShifts) ? deliveryShifts : [];
  const allShifts = [...traditionalShifts, ...validDeliveryShifts];
  const validWorks = Array.isArray(allWorks) ? allWorks : [];

  const getWeekDates = (offset) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startDiff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - startDiff + (offset * 7));
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    return { startDate, endDate };
  };

  const { startDate, endDate } = getWeekDates(weekOffset);

  const weekShifts = allShifts.filter(shift => {
    const dateKey = shift.startDate || shift.date;
    if (!dateKey) return false;
    const shiftDate = createSafeDate(dateKey);
    return shiftDate >= startDate && shiftDate <= endDate;
  });

  const initialState = {
    startDate,
    endDate,
    totalEarned: 0,
    hoursWorked: 0,
    totalShifts: 0,
    earningsByDay: { "Monday": {}, "Tuesday": {}, "Wednesday": {}, "Thursday": {}, "Friday": {}, "Saturday": {}, "Sunday": {} },
    earningsByWork: [],
    shiftTypes: {},
    daysWorked: 0,
    averageHoursPerDay: 0,
    averagePerHour: 0,
    mostProductiveDay: { day: 'None', earnings: 0 }
  };

  if (weekShifts.length === 0) return initialState;

  const acc = {
    totalEarned: 0,
    hoursWorked: 0,
    earningsByDay: { "Monday": { earnings: 0, hours: 0, shifts: 0 }, "Tuesday": { earnings: 0, hours: 0, shifts: 0 }, "Wednesday": { earnings: 0, hours: 0, shifts: 0 }, "Thursday": { earnings: 0, hours: 0, shifts: 0 }, "Friday": { earnings: 0, hours: 0, shifts: 0 }, "Saturday": { earnings: 0, hours: 0, shifts: 0 }, "Sunday": { earnings: 0, hours: 0, shifts: 0 } },
    earningsByWork: {},
    shiftTypes: {}
  };

  weekShifts.forEach(shift => {
    const work = validWorks.find(w => w.id === shift.workId);
    if (!work) return;

    const result = calculatePayment(shift);
    const earnings = result.totalWithDiscount || 0;
    const hours = result.hours || 0;

    acc.totalEarned += earnings;
    acc.hoursWorked += hours;

    const shiftDate = createSafeDate(shift.startDate || shift.date);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[shiftDate.getDay()];
    
    acc.earningsByDay[dayName].earnings += earnings;
    acc.earningsByDay[dayName].hours += hours;
    acc.earningsByDay[dayName].shifts += 1;

    if (!acc.earningsByWork[work.id]) {
      acc.earningsByWork[work.id] = { id: work.id, name: work.name, color: work.color || work.avatarColor || '#EC4899', earnings: 0, hours: 0, shifts: 0, type: work.type || 'traditional' };
    }
    acc.earningsByWork[work.id].earnings += earnings;
    acc.earningsByWork[work.id].hours += hours;
    acc.earningsByWork[work.id].shifts += 1;

    let shiftType = 'mixed';
    if (shift.type === 'delivery' || work.type === 'delivery') shiftType = 'delivery';
    else if (shiftDate.getDay() === 6) shiftType = 'saturday';
    else if (shiftDate.getDay() === 0) shiftType = 'sunday';
    else if (shiftRanges) shiftType = determineShiftType(shift, shiftRanges);

    if (!acc.shiftTypes[shiftType]) {
      acc.shiftTypes[shiftType] = { shifts: 0, hours: 0, earnings: 0 };
    }
    acc.shiftTypes[shiftType].shifts += 1;
    acc.shiftTypes[shiftType].hours += hours;
    acc.shiftTypes[shiftType].earnings += earnings;
  });

  const daysWorked = Object.values(acc.earningsByDay).filter(day => day.shifts > 0).length;
  const averageHoursPerDay = daysWorked > 0 ? acc.hoursWorked / daysWorked : 0;
  const averagePerHour = acc.hoursWorked > 0 ? acc.totalEarned / acc.hoursWorked : 0;
  
  const mostProductiveDay = Object.entries(acc.earningsByDay).reduce(
    (max, [day, data]) => (data.earnings > max.earnings ? { day, ...data } : max),
    { day: 'None', earnings: 0 }
  );

  return {
    startDate,
    endDate,
    shifts: weekShifts,
    totalEarned: acc.totalEarned,
    hoursWorked: acc.hoursWorked,
    totalShifts: weekShifts.length,
    earningsByDay: acc.earningsByDay,
    earningsByWork: Object.values(acc.earningsByWork).sort((a, b) => b.earnings - a.earnings),
    shiftTypes: acc.shiftTypes, 
    daysWorked,
    averageHoursPerDay,
    averagePerHour,
    mostProductiveDay
  };
}

/**
 * Calculates duration of a shift in hours.
 * @param {object} shift - The shift object with horaInicio and horaFin.
 * @returns {number} - The duration in hours.
 */
export const calculateShiftHours = (turno) => {
  try {
    const [startHour, startMin] = turno.horaInicio.split(':').map(Number);
    const [endHour, endMin] = turno.horaFin.split(':').map(Number);

    const inicio = startHour + startMin / 60;
    let fin = endHour + endMin / 60;

    // Handle shifts that cross midnight
    if (fin < inicio) fin += 24;

    return Math.max(0, fin - inicio);
  } catch (error) {
    return 0;
  }
};

/**
 * Calculates earnings for a specific shift.
 * @param {object} turno - The shift object.
 * @param {array} trabajosValidos - Array of valid work objects to find matching job.
 * @returns {number} - The calculated earnings for shift.
 */
export const calculateShiftEarnings = (turno, trabajosValidos) => {
  try {
    const trabajo = trabajosValidos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return 0;

    const hours = calculateShiftHours(turno);
    const rate = trabajo.tarifaBase || trabajo.salary || 0;
    const discount = trabajo.descuento || 0;

    const baseEarnings = hours * rate;
    const discountAmount = baseEarnings * (discount / 100);

    return Math.max(0, baseEarnings - discountAmount);
  } catch (error) {
    return 0;
  }
};

/**
 * Calculates average earnings per order for a platform.
 * @param {object} platform - The platform object.
 * @returns {number} - Average earnings per order.
 */
export const calculateAveragePerOrder = (platform) => {
  return platform.totalOrders > 0 ? platform.totalEarned / platform.totalOrders : 0;
};

/**
 * Calculates average earnings per hour for a platform.
 * @param {object} platform - The platform object.
 * @returns {number} - Average earnings per hour.
 */
export const calculateAveragePerHour = (platform) => {
  return platform.totalHours > 0 ? platform.totalEarned / platform.totalHours : 0;
};

/**
 * Calculates net earnings for a platform.
 * @param {object} platform - The platform object.
 * @returns {number} - Net earnings.
 */
export const calculateNetEarnings = (platform) => {
  return platform.totalEarned - platform.totalExpenses;
};

/**
 * Sorts an array of platforms based on a specified key.
 * @param {array} platforms - Array of platform objects.
 * @param {string} sortBy - The key to sort by.
 * @returns {array} - Sorted array of platform objects.
 */
export const sortPlatforms = (platforms, sortBy) => {
  return [...platforms].sort((a, b) => b[sortBy] - a[sortBy]);
};

/**
 * Finds most efficient vehicle from a list.
 * @param {array} vehicles - Array of vehicle objects.
 * @returns {object|null} - The most efficient vehicle object, or null if array is empty.
 */
export const findMostEfficientVehicle = (vehicles) => {
  if (!vehicles || vehicles.length === 0) return null;
  return vehicles.reduce((best, current) => {
    return current.efficiency > best.efficiency ? current : best;
  }, vehicles[0]);
};

export { formatCurrency, formatHours };