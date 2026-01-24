// src/utils/statsCalculations.js

import ***REMOVED*** determineShiftType ***REMOVED*** from './shiftDetailsUtils';
import ***REMOVED*** createSafeDate ***REMOVED*** from './time';
import ***REMOVED*** formatCurrency ***REMOVED*** from './currency';
import ***REMOVED*** formatHoursDecimal as formatHours ***REMOVED*** from './time/timeCalculations';

/**
 * Formats a given number of minutes into a string like "1H 30M".
 * @param ***REMOVED***number***REMOVED*** minutes - The total minutes to format.
 * @returns ***REMOVED***string***REMOVED*** - The formatted time string.
 */
export const formatMinutesToHoursAndMinutes = (minutes) => ***REMOVED***
  if (!minutes || minutes === 0) return '0 MIN';
  
  if (minutes < 60) ***REMOVED***
    return `$***REMOVED***minutes***REMOVED*** MIN`;
  ***REMOVED***
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) ***REMOVED***
    return `$***REMOVED***hours***REMOVED***H`;
  ***REMOVED***
  
  return `$***REMOVED***hours***REMOVED***H $***REMOVED***remainingMinutes***REMOVED***M`;
***REMOVED***;

/**
 * Calculates a comprehensive set of weekly statistics based on shifts and other data.
 */
export const calculateWeeklyStats = (***REMOVED***
  shifts,
  deliveryShifts,
  allWorks,
  calculatePayment,
  shiftRanges,
  weekOffset = 0,
***REMOVED***) => ***REMOVED***
  const traditionalShifts = Array.isArray(shifts) ? shifts : [];
  const validDeliveryShifts = Array.isArray(deliveryShifts) ? deliveryShifts : [];
  const allShifts = [...traditionalShifts, ...validDeliveryShifts];
  const validWorks = Array.isArray(allWorks) ? allWorks : [];

  const getWeekDates = (offset) => ***REMOVED***
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startDiff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - startDiff + (offset * 7));
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    return ***REMOVED*** startDate, endDate ***REMOVED***;
  ***REMOVED***;

  const ***REMOVED*** startDate, endDate ***REMOVED*** = getWeekDates(weekOffset);

  const weekShifts = allShifts.filter(shift => ***REMOVED***
    const dateKey = shift.startDate || shift.date;
    if (!dateKey) return false;
    const shiftDate = createSafeDate(dateKey);
    return shiftDate >= startDate && shiftDate <= endDate;
  ***REMOVED***);

  const initialState = ***REMOVED***
    startDate,
    endDate,
    totalEarned: 0,
    hoursWorked: 0,
    totalShifts: 0,
    earningsByDay: ***REMOVED*** "Monday": ***REMOVED******REMOVED***, "Tuesday": ***REMOVED******REMOVED***, "Wednesday": ***REMOVED******REMOVED***, "Thursday": ***REMOVED******REMOVED***, "Friday": ***REMOVED******REMOVED***, "Saturday": ***REMOVED******REMOVED***, "Sunday": ***REMOVED******REMOVED*** ***REMOVED***,
    earningsByWork: [],
    shiftTypes: ***REMOVED******REMOVED***,
    daysWorked: 0,
    averageHoursPerDay: 0,
    averagePerHour: 0,
    mostProductiveDay: ***REMOVED*** day: 'None', earnings: 0 ***REMOVED***
  ***REMOVED***;

  if (weekShifts.length === 0) return initialState;

  const acc = ***REMOVED***
    totalEarned: 0,
    hoursWorked: 0,
    earningsByDay: ***REMOVED*** "Monday": ***REMOVED*** earnings: 0, hours: 0, shifts: 0 ***REMOVED***, "Tuesday": ***REMOVED*** earnings: 0, hours: 0, shifts: 0 ***REMOVED***, "Wednesday": ***REMOVED*** earnings: 0, hours: 0, shifts: 0 ***REMOVED***, "Thursday": ***REMOVED*** earnings: 0, hours: 0, shifts: 0 ***REMOVED***, "Friday": ***REMOVED*** earnings: 0, hours: 0, shifts: 0 ***REMOVED***, "Saturday": ***REMOVED*** earnings: 0, hours: 0, shifts: 0 ***REMOVED***, "Sunday": ***REMOVED*** earnings: 0, hours: 0, shifts: 0 ***REMOVED*** ***REMOVED***,
    earningsByWork: ***REMOVED******REMOVED***,
    shiftTypes: ***REMOVED******REMOVED***
  ***REMOVED***;

  weekShifts.forEach(shift => ***REMOVED***
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

    if (!acc.earningsByWork[work.id]) ***REMOVED***
      acc.earningsByWork[work.id] = ***REMOVED*** id: work.id, name: work.name, color: work.color || work.avatarColor || '#EC4899', earnings: 0, hours: 0, shifts: 0, type: work.type || 'traditional' ***REMOVED***;
    ***REMOVED***
    acc.earningsByWork[work.id].earnings += earnings;
    acc.earningsByWork[work.id].hours += hours;
    acc.earningsByWork[work.id].shifts += 1;

    let shiftType = 'mixed';
    if (shift.type === 'delivery' || work.type === 'delivery') shiftType = 'delivery';
    else if (shiftDate.getDay() === 6) shiftType = 'saturday';
    else if (shiftDate.getDay() === 0) shiftType = 'sunday';
    else if (shiftRanges) shiftType = determineShiftType(shift, shiftRanges);

    if (!acc.shiftTypes[shiftType]) ***REMOVED***
      acc.shiftTypes[shiftType] = ***REMOVED*** shifts: 0, hours: 0, earnings: 0 ***REMOVED***;
    ***REMOVED***
    acc.shiftTypes[shiftType].shifts += 1;
    acc.shiftTypes[shiftType].hours += hours;
    acc.shiftTypes[shiftType].earnings += earnings;
  ***REMOVED***);

  const daysWorked = Object.values(acc.earningsByDay).filter(day => day.shifts > 0).length;
  const averageHoursPerDay = daysWorked > 0 ? acc.hoursWorked / daysWorked : 0;
  const averagePerHour = acc.hoursWorked > 0 ? acc.totalEarned / acc.hoursWorked : 0;
  
  const mostProductiveDay = Object.entries(acc.earningsByDay).reduce(
    (max, [day, data]) => (data.earnings > max.earnings ? ***REMOVED*** day, ...data ***REMOVED*** : max),
    ***REMOVED*** day: 'None', earnings: 0 ***REMOVED***
  );

  return ***REMOVED***
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
  ***REMOVED***;
***REMOVED***

/**
 * Calculates duration of a shift in hours.
 * @param ***REMOVED***object***REMOVED*** shift - The shift object with horaInicio and horaFin.
 * @returns ***REMOVED***number***REMOVED*** - The duration in hours.
 */
export const calculateShiftHours = (turno) => ***REMOVED***
  try ***REMOVED***
    const [startHour, startMin] = turno.horaInicio.split(':').map(Number);
    const [endHour, endMin] = turno.horaFin.split(':').map(Number);

    const inicio = startHour + startMin / 60;
    let fin = endHour + endMin / 60;

    // Handle shifts that cross midnight
    if (fin < inicio) fin += 24;

    return Math.max(0, fin - inicio);
  ***REMOVED*** catch (error) ***REMOVED***
    return 0;
  ***REMOVED***
***REMOVED***;

/**
 * Calculates earnings for a specific shift.
 * @param ***REMOVED***object***REMOVED*** turno - The shift object.
 * @param ***REMOVED***array***REMOVED*** trabajosValidos - Array of valid work objects to find matching job.
 * @returns ***REMOVED***number***REMOVED*** - The calculated earnings for shift.
 */
export const calculateShiftEarnings = (turno, trabajosValidos) => ***REMOVED***
  try ***REMOVED***
    const trabajo = trabajosValidos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return 0;

    const hours = calculateShiftHours(turno);
    const rate = trabajo.tarifaBase || trabajo.salary || 0;
    const discount = trabajo.descuento || 0;

    const baseEarnings = hours * rate;
    const discountAmount = baseEarnings * (discount / 100);

    return Math.max(0, baseEarnings - discountAmount);
  ***REMOVED*** catch (error) ***REMOVED***
    return 0;
  ***REMOVED***
***REMOVED***;

/**
 * Calculates average earnings per order for a platform.
 * @param ***REMOVED***object***REMOVED*** platform - The platform object.
 * @returns ***REMOVED***number***REMOVED*** - Average earnings per order.
 */
export const calculateAveragePerOrder = (platform) => ***REMOVED***
  return platform.totalOrders > 0 ? platform.totalEarned / platform.totalOrders : 0;
***REMOVED***;

/**
 * Calculates average earnings per hour for a platform.
 * @param ***REMOVED***object***REMOVED*** platform - The platform object.
 * @returns ***REMOVED***number***REMOVED*** - Average earnings per hour.
 */
export const calculateAveragePerHour = (platform) => ***REMOVED***
  return platform.totalHours > 0 ? platform.totalEarned / platform.totalHours : 0;
***REMOVED***;

/**
 * Calculates net earnings for a platform.
 * @param ***REMOVED***object***REMOVED*** platform - The platform object.
 * @returns ***REMOVED***number***REMOVED*** - Net earnings.
 */
export const calculateNetEarnings = (platform) => ***REMOVED***
  return platform.totalEarned - platform.totalExpenses;
***REMOVED***;

/**
 * Sorts an array of platforms based on a specified key.
 * @param ***REMOVED***array***REMOVED*** platforms - Array of platform objects.
 * @param ***REMOVED***string***REMOVED*** sortBy - The key to sort by.
 * @returns ***REMOVED***array***REMOVED*** - Sorted array of platform objects.
 */
export const sortPlatforms = (platforms, sortBy) => ***REMOVED***
  return [...platforms].sort((a, b) => b[sortBy] - a[sortBy]);
***REMOVED***;

/**
 * Finds most efficient vehicle from a list.
 * @param ***REMOVED***array***REMOVED*** vehicles - Array of vehicle objects.
 * @returns ***REMOVED***object|null***REMOVED*** - The most efficient vehicle object, or null if array is empty.
 */
export const findMostEfficientVehicle = (vehicles) => ***REMOVED***
  if (!vehicles || vehicles.length === 0) return null;
  return vehicles.reduce((best, current) => ***REMOVED***
    return current.efficiency > best.efficiency ? current : best;
  ***REMOVED***, vehicles[0]);
***REMOVED***;

export ***REMOVED*** formatCurrency, formatHours ***REMOVED***;