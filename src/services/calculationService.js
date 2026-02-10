// src/services/calculationService.js

import { getShiftGrossEarnings } from '../utils/shiftUtils';
import { determineShiftType } from '../utils/shiftDetailsUtils';
import { createSafeDate } from '../utils/time';
import { getMonthRange } from '../utils/time';
import { DELIVERY_PLATFORMS_AUSTRALIA } from '../constants/delivery';
import { isHoliday } from './holidayService';



/**
 * Calculates hours worked between a start and end time.
 * @param {string} start - Start time (e.g., "08:00")
 * @param {string} end - End time (e.g., "16:00")
 * @returns {number} - Total hours
 */
export const calculateHours = (start, end) => {
  if (!start || !end) return 0;
  const [startHour, startMin] = start.split(':').map(n => parseInt(n));
  const [endHour, endMin] = end.split(':').map(n => parseInt(n));

  let startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;

  // If shift crosses midnight
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }

  return (endMinutes - startMinutes) / 60;
};

/**
 * Splits a shift into daily segments when it crosses midnight.
 * Each segment represents work done on a specific calendar day.
 * @param {Date} startDate - The start date of the shift
 * @param {number} startMinutes - Minutes from midnight for shift start (0-1439)
 * @param {number} endMinutes - Minutes from midnight for shift end (can be >1440 if crosses midnight)
 * @returns {Array} Array of segments with {date, startMinutes, endMinutes, durationMinutes}
 */
const splitShiftIntoSegments = (startDate, startMinutes, endMinutes) => {
  const segments = [];
  const MINUTES_IN_DAY = 24 * 60;

  let currentDate = new Date(startDate);
  let currentStartMinutes = startMinutes;
  let remainingMinutes = endMinutes - startMinutes;

  while (remainingMinutes > 0) {
    // Calculate how many minutes until midnight from current start
    const minutesUntilMidnight = MINUTES_IN_DAY - (currentStartMinutes % MINUTES_IN_DAY);

    // This segment ends either at midnight or at the shift end, whichever comes first
    const segmentDuration = Math.min(minutesUntilMidnight, remainingMinutes);
    const segmentEndMinutes = currentStartMinutes + segmentDuration;

    segments.push({
      date: new Date(currentDate),
      startMinutes: currentStartMinutes % MINUTES_IN_DAY,
      endMinutes: segmentEndMinutes % MINUTES_IN_DAY || MINUTES_IN_DAY,
      durationMinutes: segmentDuration
    });

    // Move to next day if there's remaining time
    remainingMinutes -= segmentDuration;
    if (remainingMinutes > 0) {
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
      currentStartMinutes = 0; // Next segment starts at midnight
    }
  }

  return segments;
};

/**
 * Calculates payment for a shift, considering time ranges, rates, and breaks.
 * NOW SUPPORTS SHIFTS THAT CROSS MIDNIGHT WITH DIFFERENT DAY TYPES.
 * @param {object} shift - The shift object.
 * @param {Array} allJobs - Array of all jobs (normal and delivery).
 * @param {object} shiftRanges - Configuration of time ranges.
 * @param {number} defaultDiscount - Default discount.
 * @param {boolean} smokoEnabled - Whether break (smoko) is enabled.
 * @param {number} smokoMinutes - Break duration in minutes.
 * @param {object} holidayConfig - Holiday configuration {country, region, useAutoHolidays}.
 * @returns {object} - Object with payment details.
 */
export const calculatePayment = (shift, allJobs, shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes, holidayConfig = {}) => {
  const work = allJobs.find(j => j.id === shift.workId);

  if (!work) return {
    total: 0,
    totalWithDiscount: 0,
    hours: 0,
    tips: 0,
    isDelivery: false,
    breakdown: { day: 0, afternoon: 0, night: 0, saturday: 0, sunday: 0, holiday: 0 },
    appliedRates: {}
  };

  // If it's a delivery shift, return total earnings directly
  if (shift.type === 'delivery' || !work.rates) {
    const hours = calculateHours(shift.startTime, shift.endTime);
    const grossEarnings = getShiftGrossEarnings(shift);
    return {
      total: grossEarnings,
      totalWithDiscount: grossEarnings,
      hours,
      tips: shift.tips || 0,
      isDelivery: true,
      breakdown: { delivery: grossEarnings },
      appliedRates: { 'delivery': shift.earningPerHour || (grossEarnings / hours) || 0 }
    };
  }

  const { startTime, endTime, startDate, crossesMidnight = false, hadBreak = true } = shift;

  // Prioritize shift-specific break, otherwise use global.
  const finalSmokoMinutes = shift.breakMinutes ?? smokoMinutes;

  if (!startTime || !endTime || !startDate) {
    return { total: 0, totalWithDiscount: 0, hours: 0, tips: 0, isDelivery: false, appliedRates: {} };
  }

  const [startHour, startMin] = startTime.split(':').map(n => parseInt(n));
  const [endHour, endMin] = endTime.split(':').map(n => parseInt(n));

  let startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;

  // Detect if shift crosses midnight
  const doesCrossMidnight = crossesMidnight || endMinutes <= startMinutes;
  if (doesCrossMidnight) {
    endMinutes += 24 * 60;
  }

  const totalMinutes = endMinutes - startMinutes;
  let workingMinutes = totalMinutes;
  if (smokoEnabled && hadBreak && totalMinutes > finalSmokoMinutes) {
    workingMinutes = totalMinutes - finalSmokoMinutes;
  }

  const hours = workingMinutes / 60;
  const { country, region, useAutoHolidays } = holidayConfig;

  // Split shift into daily segments if it crosses midnight
  const baseDate = createSafeDate(startDate);
  const segments = splitShiftIntoSegments(baseDate, startMinutes, endMinutes);

  let total = 0;
  let breakdown = { day: 0, afternoon: 0, night: 0, saturday: 0, sunday: 0, holiday: 0 };
  let appliedRates = {};
  let hasAnyHoliday = false;

  const ranges = shiftRanges || {
    dayStart: 6, dayEnd: 14,
    afternoonStart: 14, afternoonEnd: 20,
    nightStart: 20
  };

  const dayStartMin = ranges.dayStart * 60;
  const dayEndMin = ranges.dayEnd * 60;
  const afternoonStartMin = ranges.afternoonStart * 60;
  const afternoonEndMin = ranges.afternoonEnd * 60;

  // Process each segment (could be on different calendar days)
  segments.forEach(segment => {
    const segmentDate = segment.date;
    const dayOfWeek = segmentDate.getDay();
    const isHolidayDate = useAutoHolidays && country && isHoliday(segmentDate, country, region);

    if (isHolidayDate) hasAnyHoliday = true;

    // Calculate the proportion of working minutes in this segment
    const segmentWorkingMinutes = (segment.durationMinutes / totalMinutes) * workingMinutes;

    // Priority: Holiday > Sunday > Saturday > Weekday
    if (isHolidayDate && work.rates.holidays) {
      // Holiday has highest priority
      const segmentRate = work.rates.holidays;
      const segmentEarnings = (segmentWorkingMinutes / 60) * segmentRate;
      total += segmentEarnings;
      breakdown.holiday += segmentEarnings;
      appliedRates['holiday'] = segmentRate;
    } else if (dayOfWeek === 0) { // Sunday
      const segmentRate = work.rates.sunday;
      const segmentEarnings = (segmentWorkingMinutes / 60) * segmentRate;
      total += segmentEarnings;
      breakdown.sunday += segmentEarnings;
      appliedRates['sunday'] = segmentRate;
    } else if (dayOfWeek === 6) { // Saturday
      const segmentRate = work.rates.saturday;
      const segmentEarnings = (segmentWorkingMinutes / 60) * segmentRate;
      total += segmentEarnings;
      breakdown.saturday += segmentEarnings;
      appliedRates['saturday'] = segmentRate;
    } else {
      // Weekday: Apply day/afternoon/night rates based on time of day
      for (let minute = 0; minute < segmentWorkingMinutes; minute++) {
        // Calculate the actual minute in the day for this working minute
        const progressRatio = minute / segmentWorkingMinutes;
        const actualMinute = segment.startMinutes + (progressRatio * segment.durationMinutes);
        const currentMinuteInDay = Math.floor(actualMinute) % (24 * 60);

        let rate = work.baseRate;
        let rateType = 'night';

        if (currentMinuteInDay >= dayStartMin && currentMinuteInDay < dayEndMin) {
          rate = work.rates.day;
          rateType = 'day';
        } else if (currentMinuteInDay >= afternoonStartMin && currentMinuteInDay < afternoonEndMin) {
          rate = work.rates.afternoon;
          rateType = 'afternoon';
        } else {
          rate = work.rates.night;
          rateType = 'night';
        }

        if (rate > 0) appliedRates[rateType] = rate;

        const ratePerMinute = rate / 60;
        total += ratePerMinute;
        breakdown[rateType] += ratePerMinute;
      }
    }
  });

  const hoursBreakdown = {};
  Object.keys(breakdown).forEach(rateType => {
    if (breakdown[rateType] > 0 && appliedRates[rateType] > 0) {
      hoursBreakdown[rateType] = breakdown[rateType] / appliedRates[rateType];
    }
  });

  const totalWithDiscount = total * (1 - defaultDiscount / 100);

  return {
    total,
    totalWithDiscount,
    hours,
    tips: 0,
    isDelivery: false,
    breakdown,
    hoursBreakdown,
    appliedRates,
    isNightShift: doesCrossMidnight,
    isHoliday: hasAnyHoliday,
    smokoApplied: smokoEnabled && hadBreak && totalMinutes > finalSmokoMinutes,
    smokoMinutes: smokoEnabled && hadBreak ? finalSmokoMinutes : 0,
    totalMinutesWorked: workingMinutes,
    totalMinutesScheduled: totalMinutes
  };
};

/**
 * Calculates total hours and earnings for a set of daily shifts.
 * @param {Array} dailyShifts - Array of shifts for a day.
 * @param {Function} calculatePaymentFn - The function to calculate shift payment.
 * @returns {object} - Object with `hours` and `total`.
 */
export const calculateDailyTotal = (dailyShifts, calculatePaymentFn) => {
  return dailyShifts.reduce((total, shift) => {
    if (shift.type === 'delivery') {
      const grossEarnings = getShiftGrossEarnings(shift);
      const netEarnings = grossEarnings - (shift.fuelExpense || 0);
      return {
        hours: total.hours, // Delivery hours are calculated separately if needed
        total: total.total + netEarnings
      };
    } else {
      const result = calculatePaymentFn(shift);
      return {
        hours: total.hours + result.hours,
        total: total.total + result.total
      };
    }
  }, { hours: 0, total: 0 });
};

/**
 * Calculates monthly statistics based on shifts.
 * @param {number} year - Year.
 * @param {number} month - Month (0-11).
 * @param {Array} shifts - Array of traditional shifts.
 * @param {Array} deliveryShifts - Array of delivery shifts.
 * @param {Function} calculatePaymentFn - The function to calculate payment.
 * @returns {object} - Monthly statistics.
 */
export const calculateMonthlyStats = (year, month, shifts, deliveryShifts, calculatePaymentFn) => {
  const { start, end } = getMonthRange(year, month);
  const allShifts = [...shifts, ...deliveryShifts];

  const monthlyShifts = allShifts.filter(shift => {
    const shiftDate = shift.startDate || shift.date;
    return shiftDate >= start && shiftDate <= end;
  });

  let totalHours = 0;
  let totalEarnings = 0;
  let totalTips = 0;
  let totalDeliveries = 0;
  let totalKilometers = 0;
  let totalFuelCost = 0;

  monthlyShifts.forEach(shift => {
    if (shift.type === 'delivery') {
      totalEarnings += getShiftGrossEarnings(shift);
      totalTips += shift.tips || 0;
      totalDeliveries += shift.orderCount || 0;
      totalKilometers += shift.kilometers || 0;
      totalFuelCost += shift.fuelExpense || 0;
      totalHours += calculateHours(shift.startTime, shift.endTime);
    } else {
      const payment = calculatePaymentFn(shift);
      totalHours += payment.hours;
      totalEarnings += payment.total;
    }
  });

  return {
    totalHours,
    totalEarnings,
    totalTips,
    totalDeliveries,
    totalKilometers,
    totalFuelCost,
    netEarnings: totalEarnings - totalFuelCost,
    shiftsCount: monthlyShifts.length,
    averageHoursPerShift: monthlyShifts.length > 0 ? totalHours / monthlyShifts.length : 0,
    averageEarningsPerShift: monthlyShifts.length > 0 ? totalEarnings / monthlyShifts.length : 0,
    averageEarningsPerHour: totalHours > 0 ? totalEarnings / totalHours : 0
  };
};

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
  allWork,
  calculatePayment,
  shiftRanges,
  weekOffset = 0,
}) => {
  const traditionalShifts = Array.isArray(shifts) ? shifts : [];
  const validDeliveryShifts = Array.isArray(deliveryShifts) ? deliveryShifts : [];
  const allShifts = [...traditionalShifts, ...validDeliveryShifts];
  const validWorks = Array.isArray(allWork) ? allWork : [];

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
    weekStart: startDate,
    weekEnd: endDate,
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
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
    weekStart: startDate,
    weekEnd: endDate,
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

export const calculateDeliveryStats = ({ deliveryWork, deliveryShifts, period = 'month' }) => {
  const validDeliveryWork = Array.isArray(deliveryWork) ? deliveryWork : [];
  const validDeliveryShifts = Array.isArray(deliveryShifts) ? deliveryShifts : [];

  if (validDeliveryShifts.length === 0) {
    return {
      totalEarned: 0,
      totalTips: 0,
      totalOrders: 0,
      totalKilometers: 0,
      totalExpenses: 0,
      netEarnings: 0,
      averagePerOrder: 0,
      averagePerKilometer: 0,
      averagePerHour: 0,
      averageTipsPerOrder: 0,
      bestDay: null,
      bestShift: null,
      shiftsByPlatform: {},
      statsByVehicle: {},
      statsByDay: {},
      trend: 0,
      daysWorked: 0,
      shiftsCompleted: 0,
      totalHours: 0,
      fuelEfficiency: 0,
      costPerKilometer: 0
    };
  }

  const today = new Date();
  let startDate;

  switch (period) {
    case 'week':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1);
      break;
    case 'year':
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1);
      break;
    default:
      startDate = new Date(0);
  }

  const periodShifts = validDeliveryShifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    return shiftDate >= startDate;
  });

  let totalEarned = 0;
  let totalTips = 0;
  let totalOrders = 0;
  let totalKilometers = 0;
  let totalExpenses = 0;
  let totalHours = 0;

  const statsByDay = {};
  const shiftsByPlatform = {};
  const statsByVehicle = {};

  periodShifts.forEach(shift => {
    const work = validDeliveryWork.find(w => w.id === shift.workId);
    if (!work) {
      console.warn('Delivery work not found for shift:', shift.id);
      return;
    }

    const shiftEarnings = getShiftGrossEarnings(shift);
    const tips = shift.tips || 0;
    const orders = shift.orderCount || 0;
    const kilometers = shift.kilometers || 0;
    const expenses = shift.fuelExpense || 0;

    totalEarned += shiftEarnings;
    totalTips += tips;
    totalOrders += orders;
    totalKilometers += kilometers;
    totalExpenses += expenses;

    const [startHour, startMin] = shift.startTime.split(':').map(Number);
    const [endHour, endMin] = shift.endTime.split(':').map(Number);
    let hours = (endHour + endMin / 60) - (startHour + startMin / 60);
    if (hours < 0) hours += 24;
    totalHours += hours;

    if (!statsByDay[shift.date]) {
      statsByDay[shift.date] = {
        earnings: 0,
        tips: 0,
        orders: 0,
        kilometers: 0,
        expenses: 0,
        hours: 0,
        shifts: []
      };
    }

    statsByDay[shift.date].earnings += shiftEarnings;
    statsByDay[shift.date].tips += tips;
    statsByDay[shift.date].orders += orders;
    statsByDay[shift.date].kilometers += kilometers;
    statsByDay[shift.date].expenses += expenses;
    statsByDay[shift.date].hours += hours;
    statsByDay[shift.date].shifts.push({
      ...shift,
      work,
      hours
    });

    const platform = work.platform || work.name;
    if (!shiftsByPlatform[platform]) {
      const platformData = DELIVERY_PLATFORMS_AUSTRALIA.find(p => p.name === platform);
      shiftsByPlatform[platform] = {
        name: platform,
        color: platformData?.color || '#10B981',
        totalEarned: 0,
        totalOrders: 0,
        totalTips: 0,
        totalHours: 0,
        totalKilometers: 0,
        totalExpenses: 0,
        shifts: 0
      };
    }

    shiftsByPlatform[platform].totalEarned += shiftEarnings;
    shiftsByPlatform[platform].totalOrders += orders;
    shiftsByPlatform[platform].totalTips += tips;
    shiftsByPlatform[platform].totalHours += hours;
    shiftsByPlatform[platform].totalKilometers += kilometers;
    shiftsByPlatform[platform].totalExpenses += expenses;
    shiftsByPlatform[platform].shifts += 1;

    const vehicle = work.vehicle || 'Not specified';
    if (!statsByVehicle[vehicle]) {
      statsByVehicle[vehicle] = {
        name: vehicle,
        totalEarned: 0,
        totalOrders: 0,
        totalKilometers: 0,
        totalExpenses: 0,
        totalHours: 0,
        shifts: 0,
        efficiency: 0
      };
    }

    statsByVehicle[vehicle].totalEarned += shiftEarnings;
    statsByVehicle[vehicle].totalOrders += orders;
    statsByVehicle[vehicle].totalKilometers += kilometers;
    statsByVehicle[vehicle].totalExpenses += expenses;
    statsByVehicle[vehicle].totalHours += hours;
    statsByVehicle[vehicle].shifts += 1;
  });
  Object.values(statsByVehicle).forEach(vehicle => {
    if (vehicle.totalExpenses > 0) {
      vehicle.efficiency = vehicle.totalKilometers / vehicle.totalExpenses;
    }
  });

  let bestDay = null;
  let bestEarnings = 0;

  Object.entries(statsByDay).forEach(([date, stats]) => {
    const netEarnings = stats.earnings - stats.expenses;

    if (netEarnings > bestEarnings) {
      bestEarnings = netEarnings;
      bestDay = {
        date,
        earnings: stats.earnings,
        netEarnings,
        orders: stats.orders,
        hours: stats.hours,
        kilometers: stats.kilometers,
        expenses: stats.expenses
      };
    }
  });

  let bestShift = null;
  let bestShiftEarnings = 0;

  periodShifts.forEach(shift => {
    const grossEarnings = getShiftGrossEarnings(shift);
    const netEarnings = grossEarnings - (shift.fuelExpense || 0);
    if (netEarnings > bestShiftEarnings) {
      bestShiftEarnings = netEarnings;
      bestShift = {
        ...shift,
        netEarnings,
        work: validDeliveryWork.find(w => w.id === shift.workId)
      };
    }
  });

  const netEarnings = totalEarned - totalExpenses;
  const averagePerOrder = totalOrders > 0 ? totalEarned / totalOrders : 0;
  const averagePerKilometer = totalKilometers > 0 ? totalEarned / totalKilometers : 0;
  const averagePerHour = totalHours > 0 ? totalEarned / totalHours : 0;
  const averageTipsPerOrder = totalOrders > 0 ? totalTips / totalOrders : 0;
  const fuelEfficiency = totalExpenses > 0 ? totalKilometers / totalExpenses : 0;
  const costPerKilometer = totalKilometers > 0 ? totalExpenses / totalKilometers : 0;

  const result = {
    totalEarned,
    totalTips,
    totalOrders,
    totalKilometers,
    totalExpenses,
    netEarnings,
    totalHours,

    averagePerOrder,
    averagePerKilometer,
    averagePerHour,
    averageTipsPerOrder,
    fuelEfficiency,
    costPerKilometer,

    bestDay,
    bestShift,

    shiftsByPlatform,
    statsByVehicle,
    statsByDay,

    daysWorked: Object.keys(statsByDay).length,
    shiftsCompleted: periodShifts.length
  };

  return result;
}

export const calculateDeliveryHourlyStats = (shifts = []) => {
  // Time slots definition
  const slots = {
    morning: {
      id: 'morning',
      label: 'Morning (6-12)',
      start: 6,
      end: 11,
      earnings: 0,
      hours: 0,
      count: 0
    },
    midday: {
      id: 'midday',
      label: 'Midday (12-16)',
      start: 12,
      end: 15,
      earnings: 0,
      hours: 0,
      count: 0
    },
    afternoon: {
      id: 'afternoon',
      label: 'Afternoon (16-20)',
      start: 16,
      end: 19,
      earnings: 0,
      hours: 0,
      count: 0
    },
    night: {
      id: 'night',
      label: 'Night (20-6)',
      start: 20,
      end: 5,
      earnings: 0,
      hours: 0,
      count: 0
    },
  };

  const deliveryShifts = shifts.filter(s => s.type === 'delivery' || s.isDelivery || s.platform);

  deliveryShifts.forEach(shift => {
    if (!shift.startDate || !shift.endDate) return;

    const date = new Date(shift.startDate);
    const hour = date.getHours();

    let key = 'night';
    if (hour >= 6 && hour < 12) key = 'morning';
    else if (hour >= 12 && hour < 16) key = 'midday';
    else if (hour >= 16 && hour < 20) key = 'afternoon';

    // Calculate net earnings of the shift
    const shiftEarnings = (shift.earnings || shift.totalEarnings || 0) + (shift.tips || 0) - (shift.fuelExpense || 0);

    // Calculate real duration
    const startDateTime = new Date(`${shift.startDate}T${shift.startTime}:00`);
    let endDateTime = new Date(`${shift.endDate}T${shift.endTime}:00`);

    // If shift ends on the same calendar day as it starts,
    // but end time is numerically earlier than start time,
    // it implies shift crosses midnight into the next day.
    // This handles cases like 22:00 (Day 1) to 02:00 (Day 2)
    // where endDate and startDate might still be the same ('YYYY-MM-DD').
    if (endDateTime.getTime() <= startDateTime.getTime() && shift.endDate === shift.startDate) {
      endDateTime.setDate(endDateTime.getDate() + 1);
    }

    // Fallback if endDateTime is still <= startDateTime (e.g., malformed data)
    if (endDateTime.getTime() <= startDateTime.getTime()) {
      console.warn("Shift end time is not after start time, skipping duration calculation for shift:", shift);
      return; // Skip this shift as duration would be 0 or negative
    }

    const durationHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);

    if (durationHours > 0) {
      slots[key].earnings += shiftEarnings;
      slots[key].hours += durationHours;
      slots[key].count += 1;
    }
  });

  // Return array sorted by profitability
  return Object.values(slots)
    .map(s => ({
      ...s,
      averageHour: s.hours > 0 ? s.earnings / s.hours : 0
    }))
    .filter(s => s.count > 0)
    .sort((a, b) => b.averageHour - a.averageHour);
};

export const calculateWeeklyHourlyDeliveryStats = (shifts = []) => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const initialWeeklyData = daysOfWeek.map(day => ({
    day: day,
    hourlyData: Array.from({ length: 24 }, (_, hour) => ({
      hour: hour,
      totalProfit: 0,
      totalHours: 0,
      averageProfitPerHour: 0,
    }))
  }));

  const deliveryShifts = shifts.filter(s => s.type === 'delivery' || s.isDelivery || s.platform);

  deliveryShifts.forEach(shift => {
    if (!shift.startDate || !shift.startTime || !shift.endTime) return;

    const shiftStart = new Date(`${shift.startDate}T${shift.startTime}:00`);
    let shiftEnd = new Date(`${shift.startDate}T${shift.endTime}:00`);

    // Adjust shiftEnd if it crosses midnight
    if (shiftEnd.getTime() <= shiftStart.getTime()) {
      shiftEnd.setDate(shiftEnd.getDate() + 1);
    }

    const shiftEarnings = (shift.earnings || shift.totalEarnings || 0) + (shift.tips || 0) - (shift.fuelExpense || 0);

    let currentHour = shiftStart.getHours();
    let currentDay = shiftStart.getDay(); // 0 for Sunday, 1 for Monday, etc.
    let currentTime = shiftStart.getTime();

    while (currentTime < shiftEnd.getTime()) {
      const nextHourTime = new Date(currentTime);
      nextHourTime.setHours(currentHour + 1, 0, 0, 0);

      const intersectionEnd = Math.min(nextHourTime.getTime(), shiftEnd.getTime());
      const hoursInThisSegment = (intersectionEnd - currentTime) / (1000 * 60 * 60);

      if (hoursInThisSegment > 0) {
        const hourlyProfit = shiftEarnings * (hoursInThisSegment / ((shiftEnd.getTime() - shiftStart.getTime()) / (1000 * 60 * 60)));

        const dayIndex = currentDay;
        const hourIndex = currentHour;

        initialWeeklyData[dayIndex].hourlyData[hourIndex].totalProfit += hourlyProfit;
        initialWeeklyData[dayIndex].hourlyData[hourIndex].totalHours += hoursInThisSegment;
      }

      currentTime = nextHourTime.getTime();
      currentHour = nextHourTime.getHours();
      currentDay = nextHourTime.getDay();
    }
  });

  // Calculate averageProfitPerHour
  initialWeeklyData.forEach(dayData => {
    dayData.hourlyData.forEach(hourData => {
      if (hourData.totalHours > 0) {
        hourData.averageProfitPerHour = hourData.totalProfit / hourData.totalHours;
      }
    });
  });

  // Reorder days to start from Monday (1 for Monday, 0 for Sunday)
  const reorderedWeeklyData = [
    initialWeeklyData[1], // Monday
    initialWeeklyData[2], // Tuesday
    initialWeeklyData[3], // Wednesday
    initialWeeklyData[4], // Thursday
    initialWeeklyData[5], // Friday
    initialWeeklyData[6], // Saturday
    initialWeeklyData[0],  // Sunday
  ];

  return reorderedWeeklyData;
};