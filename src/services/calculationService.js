// src/services/calculationService.js

import ***REMOVED*** getShiftGrossEarnings ***REMOVED*** from '../utils/shiftUtils';
import ***REMOVED*** determineShiftType ***REMOVED*** from '../utils/shiftDetailsUtils';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../utils/time';
import ***REMOVED*** getMonthRange ***REMOVED*** from '../utils/time';
import ***REMOVED*** DELIVERY_PLATFORMS_AUSTRALIA ***REMOVED*** from '../constants/delivery';



/**
 * Calculates hours worked between a start and end time.
 * @param ***REMOVED***string***REMOVED*** start - Start time (e.g., "08:00")
 * @param ***REMOVED***string***REMOVED*** end - End time (e.g., "16:00")
 * @returns ***REMOVED***number***REMOVED*** - Total hours
 */
export const calculateHours = (start, end) => ***REMOVED***
  if (!start || !end) return 0;
  const [startHour, startMin] = start.split(':').map(n => parseInt(n));
  const [endHour, endMin] = end.split(':').map(n => parseInt(n));

  let startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;

  // If shift crosses midnight
  if (endMinutes <= startMinutes) ***REMOVED***
    endMinutes += 24 * 60;
  ***REMOVED***

  return (endMinutes - startMinutes) / 60;
***REMOVED***;

/**
 * Calculates payment for a shift, considering time ranges, rates, and breaks.
 * @param ***REMOVED***object***REMOVED*** shift - The shift object.
 * @param ***REMOVED***Array***REMOVED*** allJobs - Array of all jobs (normal and delivery).
 * @param ***REMOVED***object***REMOVED*** shiftRanges - Configuration of time ranges.
 * @param ***REMOVED***number***REMOVED*** defaultDiscount - Default discount.
 * @param ***REMOVED***boolean***REMOVED*** smokoEnabled - Whether break (smoko) is enabled.
 * @param ***REMOVED***number***REMOVED*** smokoMinutes - Break duration in minutes.
 * @returns ***REMOVED***object***REMOVED*** - Object with payment details.
 */
export const calculatePayment = (shift, allJobs, shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes) => ***REMOVED***
  const work = allJobs.find(j => j.id === shift.workId);

  if (!work) return ***REMOVED***
    total: 0,
    totalWithDiscount: 0,
    hours: 0,
    tips: 0,
    isDelivery: false,
    breakdown: ***REMOVED*** day: 0, afternoon: 0, night: 0, saturday: 0, sunday: 0 ***REMOVED***,
    appliedRates: ***REMOVED******REMOVED***
  ***REMOVED***;

  // If it's a delivery shift, return total earnings directly
  if (shift.type === 'delivery') ***REMOVED***
    const hours = calculateHours(shift.startTime, shift.endTime);
    const grossEarnings = getShiftGrossEarnings(shift);
    return ***REMOVED***
      total: grossEarnings,
      totalWithDiscount: grossEarnings,
      hours,
      tips: shift.tips || 0,
      isDelivery: true,
      breakdown: ***REMOVED*** delivery: grossEarnings ***REMOVED***,
      appliedRates: ***REMOVED*** 'delivery': shift.earningPerHour || (grossEarnings / hours) || 0 ***REMOVED***
    ***REMOVED***;
  ***REMOVED***

  const ***REMOVED*** startTime, endTime, startDate, crossesMidnight = false, hadBreak = true ***REMOVED*** = shift;

  // Prioritize shift-specific break, otherwise use global.
  const finalSmokoMinutes = shift.breakMinutes ?? smokoMinutes;

  if (!startTime || !endTime || !startDate) ***REMOVED***
    return ***REMOVED*** total: 0, totalWithDiscount: 0, hours: 0, tips: 0, isDelivery: false, appliedRates: ***REMOVED******REMOVED*** ***REMOVED***;
  ***REMOVED***

  const [startHour, startMin] = startTime.split(':').map(n => parseInt(n));
  const [endHour, endMin] = endTime.split(':').map(n => parseInt(n));

  let startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;

  if (crossesMidnight) ***REMOVED***
    endMinutes += 24 * 60;
  ***REMOVED*** else if (endMinutes <= startMinutes) ***REMOVED***
    endMinutes += 24 * 60;
  ***REMOVED***

  const totalMinutes = endMinutes - startMinutes;
  let workingMinutes = totalMinutes;
  if (smokoEnabled && hadBreak && totalMinutes > finalSmokoMinutes) ***REMOVED***
    workingMinutes = totalMinutes - finalSmokoMinutes;
  ***REMOVED***

  const hours = workingMinutes / 60;

  const date = createSafeDate(startDate);
  const dayOfWeek = date.getDay();

  let total = 0;
  let breakdown = ***REMOVED*** day: 0, afternoon: 0, night: 0, saturday: 0, sunday: 0 ***REMOVED***;
  let appliedRates = ***REMOVED******REMOVED***;

  if (dayOfWeek === 0) ***REMOVED*** // Sunday
    total = hours * work.rates.sunday;
    breakdown.sunday = total;
    appliedRates['sunday'] = work.rates.sunday;
  ***REMOVED*** else if (dayOfWeek === 6) ***REMOVED*** // Saturday
    total = hours * work.rates.saturday;
    breakdown.saturday = total;
    appliedRates['saturday'] = work.rates.saturday;
  ***REMOVED*** else ***REMOVED***
    const ranges = shiftRanges || ***REMOVED***
      dayStart: 6, dayEnd: 14,
      afternoonStart: 14, afternoonEnd: 20,
      nightStart: 20
    ***REMOVED***;

    const dayStartMin = ranges.dayStart * 60;
    const dayEndMin = ranges.dayEnd * 60;
    const afternoonStartMin = ranges.afternoonStart * 60;
    const afternoonEndMin = ranges.afternoonEnd * 60;

    const minutesToProcess = Math.min(workingMinutes, totalMinutes);

    for (let minute = 0; minute < minutesToProcess; minute++) ***REMOVED***
      const actualMinute = startMinutes + (minute * totalMinutes / workingMinutes);
      const currentMinuteInDay = Math.floor(actualMinute) % (24 * 60);
      let rate = work.baseRate;
      let rateType = 'night';

      if (currentMinuteInDay >= dayStartMin && currentMinuteInDay < dayEndMin) ***REMOVED***
        rate = work.rates.day;
        rateType = 'day';
      ***REMOVED*** else if (currentMinuteInDay >= afternoonStartMin && currentMinuteInDay < afternoonEndMin) ***REMOVED***
        rate = work.rates.afternoon;
        rateType = 'afternoon';
      ***REMOVED*** else ***REMOVED***
        rate = work.rates.night;
        rateType = 'night';
      ***REMOVED***
      
      if(rate > 0) appliedRates[rateType] = rate;

      const ratePerMinute = rate / 60;
      total += ratePerMinute;
      breakdown[rateType] += ratePerMinute;
    ***REMOVED***
  ***REMOVED***

  const hoursBreakdown = ***REMOVED******REMOVED***;
  Object.keys(breakdown).forEach(rateType => ***REMOVED***
    if (breakdown[rateType] > 0 && appliedRates[rateType] > 0) ***REMOVED***
      hoursBreakdown[rateType] = breakdown[rateType] / appliedRates[rateType];
    ***REMOVED***
  ***REMOVED***);

  const totalWithDiscount = total * (1 - defaultDiscount / 100);

  return ***REMOVED***
    total,
    totalWithDiscount,
    hours,
    tips: 0,
    isDelivery: false,
    breakdown,
    hoursBreakdown,
    appliedRates,
    isNightShift: crossesMidnight || false,
    smokoApplied: smokoEnabled && hadBreak && totalMinutes > finalSmokoMinutes,
    smokoMinutes: smokoEnabled && hadBreak ? finalSmokoMinutes : 0,
    totalMinutesWorked: workingMinutes,
    totalMinutesScheduled: totalMinutes
  ***REMOVED***;
***REMOVED***;

/**
 * Calculates total hours and earnings for a set of daily shifts.
 * @param ***REMOVED***Array***REMOVED*** dailyShifts - Array of shifts for a day.
 * @param ***REMOVED***Function***REMOVED*** calculatePaymentFn - The function to calculate shift payment.
 * @returns ***REMOVED***object***REMOVED*** - Object with `hours` and `total`.
 */
export const calculateDailyTotal = (dailyShifts, calculatePaymentFn) => ***REMOVED***
  return dailyShifts.reduce((total, shift) => ***REMOVED***
    if (shift.type === 'delivery') ***REMOVED***
      const grossEarnings = getShiftGrossEarnings(shift);
      const netEarnings = grossEarnings - (shift.fuelExpense || 0);
      return ***REMOVED***
        hours: total.hours, // Delivery hours are calculated separately if needed
        total: total.total + netEarnings
      ***REMOVED***;
    ***REMOVED*** else ***REMOVED***
      const result = calculatePaymentFn(shift);
      return ***REMOVED***
        hours: total.hours + result.hours,
        total: total.total + result.total
      ***REMOVED***;
    ***REMOVED***
  ***REMOVED***, ***REMOVED*** hours: 0, total: 0 ***REMOVED***);
***REMOVED***;

/**
 * Calculates monthly statistics based on shifts.
 * @param ***REMOVED***number***REMOVED*** year - Year.
 * @param ***REMOVED***number***REMOVED*** month - Month (0-11).
 * @param ***REMOVED***Array***REMOVED*** shifts - Array of traditional shifts.
 * @param ***REMOVED***Array***REMOVED*** deliveryShifts - Array of delivery shifts.
 * @param ***REMOVED***Function***REMOVED*** calculatePaymentFn - The function to calculate payment.
 * @returns ***REMOVED***object***REMOVED*** - Monthly statistics.
 */
export const calculateMonthlyStats = (year, month, shifts, deliveryShifts, calculatePaymentFn) => ***REMOVED***
  const ***REMOVED*** start, end ***REMOVED*** = getMonthRange(year, month);
  const allShifts = [...shifts, ...deliveryShifts];

  const monthlyShifts = allShifts.filter(shift => ***REMOVED***
    const shiftDate = shift.startDate || shift.date;
    return shiftDate >= start && shiftDate <= end;
  ***REMOVED***);

  let totalHours = 0;
  let totalEarnings = 0;
  let totalTips = 0;
  let totalDeliveries = 0;
  let totalKilometers = 0;
  let totalFuelCost = 0;

  monthlyShifts.forEach(shift => ***REMOVED***
    if (shift.type === 'delivery' || shift.tipo === 'delivery') ***REMOVED***
      totalEarnings += getShiftGrossEarnings(shift);
      totalTips += shift.tips || 0;
      totalDeliveries += shift.orderCount || 0;
      totalKilometers += shift.kilometers || 0;
      totalFuelCost += shift.fuelExpense || 0;
      totalHours += calculateHours(shift.startTime, shift.endTime);
    ***REMOVED*** else ***REMOVED***
      const payment = calculatePaymentFn(shift);
      totalHours += payment.hours;
      totalEarnings += payment.total;
    ***REMOVED***
  ***REMOVED***);

  return ***REMOVED***
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
  ***REMOVED***;
***REMOVED***;

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
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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

export const calculateDeliveryStats = (***REMOVED*** deliveryWork, deliveryShifts, period = 'month' ***REMOVED***) => ***REMOVED***
    const validDeliveryWork = Array.isArray(deliveryWork) ? deliveryWork : [];
    const validDeliveryShifts = Array.isArray(deliveryShifts) ? deliveryShifts : [];
    
    if (validDeliveryShifts.length === 0) ***REMOVED***
      return ***REMOVED***
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
        shiftsByPlatform: ***REMOVED******REMOVED***,
        statsByVehicle: ***REMOVED******REMOVED***,
        statsByDay: ***REMOVED******REMOVED***,
        trend: 0,
        daysWorked: 0,
        shiftsCompleted: 0,
        totalHours: 0,
        fuelEfficiency: 0,
        costPerKilometer: 0
      ***REMOVED***;
    ***REMOVED***
    
    const today = new Date();
    let startDate;
    
    switch (period) ***REMOVED***
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
    ***REMOVED***
    
    const periodShifts = validDeliveryShifts.filter(shift => ***REMOVED***
      const shiftDate = new Date(shift.date);
      return shiftDate >= startDate;
    ***REMOVED***);
        
    let totalEarned = 0;
    let totalTips = 0;
    let totalOrders = 0;
    let totalKilometers = 0;
    let totalExpenses = 0;
    let totalHours = 0;
    
    const statsByDay = ***REMOVED******REMOVED***;
    const shiftsByPlatform = ***REMOVED******REMOVED***;
    const statsByVehicle = ***REMOVED******REMOVED***;
    
    periodShifts.forEach(shift => ***REMOVED***
      const work = validDeliveryWork.find(w => w.id === shift.workId);
      if (!work) ***REMOVED***
        console.warn('⚠️ Delivery work not found for shift:', shift.id);
        return;
      ***REMOVED***
      
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
            let hours = (endHour + endMin/60) - (startHour + startMin/60);
            if (hours < 0) hours += 24;
            totalHours += hours;
            
            if (!statsByDay[shift.date]) ***REMOVED***
              statsByDay[shift.date] = ***REMOVED***
                earnings: 0,
                tips: 0,
                orders: 0,
                kilometers: 0,
                expenses: 0,
                hours: 0,
                shifts: []
              ***REMOVED***;
            ***REMOVED***
            
            statsByDay[shift.date].earnings += shiftEarnings;
            statsByDay[shift.date].tips += tips;
            statsByDay[shift.date].orders += orders;
            statsByDay[shift.date].kilometers += kilometers;
            statsByDay[shift.date].expenses += expenses;
            statsByDay[shift.date].hours += hours;
            statsByDay[shift.date].shifts.push(***REMOVED***
              ...shift,
              work,
              hours
            ***REMOVED***);
            
            const platform = work.platform || work.name;
            if (!shiftsByPlatform[platform]) ***REMOVED***
              const platformData = DELIVERY_PLATFORMS_AUSTRALIA.find(p => p.name === platform);
              shiftsByPlatform[platform] = ***REMOVED***
                name: platform,
                color: platformData?.color || '#10B981',
                totalEarned: 0,
                totalOrders: 0,
                totalTips: 0,
                totalHours: 0,
                totalKilometers: 0,
                totalExpenses: 0,
                shifts: 0
              ***REMOVED***;
            ***REMOVED***
            
            shiftsByPlatform[platform].totalEarned += shiftEarnings;
            shiftsByPlatform[platform].totalOrders += orders;
            shiftsByPlatform[platform].totalTips += tips;
            shiftsByPlatform[platform].totalHours += hours;
            shiftsByPlatform[platform].totalKilometers += kilometers;
            shiftsByPlatform[platform].totalExpenses += expenses;
            shiftsByPlatform[platform].shifts += 1;
            
            const vehicle = work.vehicle || 'Not specified';
            if (!statsByVehicle[vehicle]) ***REMOVED***
              statsByVehicle[vehicle] = ***REMOVED***
                name: vehicle,
                totalEarned: 0,
                totalOrders: 0,
                totalKilometers: 0,
                totalExpenses: 0,
                totalHours: 0,
                shifts: 0,
                efficiency: 0 
              ***REMOVED***;
            ***REMOVED***
            
            statsByVehicle[vehicle].totalEarned += shiftEarnings;
            statsByVehicle[vehicle].totalOrders += orders;
            statsByVehicle[vehicle].totalKilometers += kilometers;
            statsByVehicle[vehicle].totalExpenses += expenses;
            statsByVehicle[vehicle].totalHours += hours;
            statsByVehicle[vehicle].shifts += 1;
          ***REMOVED***);    
    Object.values(statsByVehicle).forEach(vehicle => ***REMOVED***
      if (vehicle.totalExpenses > 0) ***REMOVED***
        vehicle.efficiency = vehicle.totalKilometers / vehicle.totalExpenses;
      ***REMOVED***
    ***REMOVED***);
    
    let bestDay = null;
    let bestEarnings = 0;
    
    Object.entries(statsByDay).forEach(([date, stats]) => ***REMOVED***
      const netEarnings = stats.earnings - stats.expenses;
      
      if (netEarnings > bestEarnings) ***REMOVED***
        bestEarnings = netEarnings;
        bestDay = ***REMOVED***
          date,
          earnings: stats.earnings,
          netEarnings,
          orders: stats.orders,
          hours: stats.hours,
          kilometers: stats.kilometers,
          expenses: stats.expenses
        ***REMOVED***;
      ***REMOVED***
    ***REMOVED***);
    
    let bestShift = null;
    let bestShiftEarnings = 0;
    
    periodShifts.forEach(shift => ***REMOVED***
      const grossEarnings = getShiftGrossEarnings(shift);
      const netEarnings = grossEarnings - (shift.fuelExpense || 0);
      if (netEarnings > bestShiftEarnings) ***REMOVED***
        bestShiftEarnings = netEarnings;
        bestShift = ***REMOVED***
          ...shift,
          netEarnings,
          work: validDeliveryWork.find(w => w.id === shift.workId)
        ***REMOVED***;
      ***REMOVED***
    ***REMOVED***);
    
    const netEarnings = totalEarned - totalExpenses;
    const averagePerOrder = totalOrders > 0 ? totalEarned / totalOrders : 0;
    const averagePerKilometer = totalKilometers > 0 ? totalEarned / totalKilometers : 0;
    const averagePerHour = totalHours > 0 ? totalEarned / totalHours : 0;
    const averageTipsPerOrder = totalOrders > 0 ? totalTips / totalOrders : 0;
    const fuelEfficiency = totalExpenses > 0 ? totalKilometers / totalExpenses : 0;
    const costPerKilometer = totalKilometers > 0 ? totalExpenses / totalKilometers : 0;
    
    const result = ***REMOVED***
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
    ***REMOVED***;

    return result;
***REMOVED***

export const calculateDeliveryHourlyStats = (shifts = []) => ***REMOVED***
  // Time slots definition
  const slots = ***REMOVED***
    morning: ***REMOVED*** 
      id: 'morning', 
      label: 'Morning (6-12)', 
      start: 6, 
      end: 11, 
      earnings: 0, 
      hours: 0, 
      count: 0 
    ***REMOVED***,
    midday: ***REMOVED*** 
      id: 'midday', 
      label: 'Midday (12-16)', 
      start: 12, 
      end: 15, 
      earnings: 0, 
      hours: 0, 
      count: 0 
    ***REMOVED***,
    afternoon: ***REMOVED*** 
      id: 'afternoon', 
      label: 'Afternoon (16-20)', 
      start: 16, 
      end: 19, 
      earnings: 0, 
      hours: 0, 
      count: 0 
    ***REMOVED***,
    night: ***REMOVED*** 
      id: 'night', 
      label: 'Night (20-6)', 
      start: 20, 
      end: 5, 
      earnings: 0, 
      hours: 0, 
      count: 0 
    ***REMOVED***,
  ***REMOVED***;

  const deliveryShifts = shifts.filter(s => s.type === 'delivery' || s.isDelivery || s.platform);

  deliveryShifts.forEach(shift => ***REMOVED***
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
    const startDateTime = new Date(`$***REMOVED***shift.startDate***REMOVED***T$***REMOVED***shift.startTime***REMOVED***:00`);
    let endDateTime = new Date(`$***REMOVED***shift.endDate***REMOVED***T$***REMOVED***shift.endTime***REMOVED***:00`);

    // If shift ends on the same calendar day as it starts,
    // but end time is numerically earlier than start time,
    // it implies shift crosses midnight into the next day.
    // This handles cases like 22:00 (Day 1) to 02:00 (Day 2)
    // where endDate and startDate might still be the same ('YYYY-MM-DD').
    if (endDateTime.getTime() <= startDateTime.getTime() && shift.endDate === shift.startDate) ***REMOVED***
        endDateTime.setDate(endDateTime.getDate() + 1);
    ***REMOVED***
    
    // Fallback if endDateTime is still <= startDateTime (e.g., malformed data)
    if (endDateTime.getTime() <= startDateTime.getTime()) ***REMOVED***
      console.warn("Shift end time is not after start time, skipping duration calculation for shift:", shift);
      return; // Skip this shift as duration would be 0 or negative
    ***REMOVED***

    const durationHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);

    if (durationHours > 0) ***REMOVED***
      slots[key].earnings += shiftEarnings;
      slots[key].hours += durationHours;
      slots[key].count += 1;
    ***REMOVED***
  ***REMOVED***);

  // Return array sorted by profitability
  return Object.values(slots)
    .map(s => (***REMOVED***
      ...s,
      averageHour: s.hours > 0 ? s.earnings / s.hours : 0
    ***REMOVED***))
    .filter(s => s.count > 0)
    .sort((a, b) => b.averageHour - a.averageHour);
***REMOVED***;

export const calculateWeeklyHourlyDeliveryStats = (shifts = []) => ***REMOVED***
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const initialWeeklyData = daysOfWeek.map(day => (***REMOVED***
    day: day,
    hourlyData: Array.from(***REMOVED*** length: 24 ***REMOVED***, (_, hour) => (***REMOVED***
      hour: hour,
      totalProfit: 0,
      totalHours: 0,
      averageProfitPerHour: 0,
    ***REMOVED***))
  ***REMOVED***));

  const deliveryShifts = shifts.filter(s => s.type === 'delivery' || s.isDelivery || s.platform);

  deliveryShifts.forEach(shift => ***REMOVED***
    if (!shift.startDate || !shift.startTime || !shift.endTime) return;

    const shiftStart = new Date(`$***REMOVED***shift.startDate***REMOVED***T$***REMOVED***shift.startTime***REMOVED***:00`);
    let shiftEnd = new Date(`$***REMOVED***shift.startDate***REMOVED***T$***REMOVED***shift.endTime***REMOVED***:00`);

    // Adjust shiftEnd if it crosses midnight
    if (shiftEnd.getTime() <= shiftStart.getTime()) ***REMOVED***
      shiftEnd.setDate(shiftEnd.getDate() + 1);
    ***REMOVED***
    
    const shiftEarnings = (shift.earnings || shift.totalEarnings || 0) + (shift.tips || 0) - (shift.fuelExpense || 0);

    let currentHour = shiftStart.getHours();
    let currentDay = shiftStart.getDay(); // 0 for Sunday, 1 for Monday, etc.
    let currentTime = shiftStart.getTime();

    while (currentTime < shiftEnd.getTime()) ***REMOVED***
      const nextHourTime = new Date(currentTime);
      nextHourTime.setHours(currentHour + 1, 0, 0, 0);

      const intersectionEnd = Math.min(nextHourTime.getTime(), shiftEnd.getTime());
      const hoursInThisSegment = (intersectionEnd - currentTime) / (1000 * 60 * 60);

      if (hoursInThisSegment > 0) ***REMOVED***
        const hourlyProfit = shiftEarnings * (hoursInThisSegment / ((shiftEnd.getTime() - shiftStart.getTime()) / (1000 * 60 * 60)));
        
        const dayIndex = currentDay;
        const hourIndex = currentHour;

        initialWeeklyData[dayIndex].hourlyData[hourIndex].totalProfit += hourlyProfit;
        initialWeeklyData[dayIndex].hourlyData[hourIndex].totalHours += hoursInThisSegment;
      ***REMOVED***

      currentTime = nextHourTime.getTime();
      currentHour = nextHourTime.getHours();
      currentDay = nextHourTime.getDay();
    ***REMOVED***
  ***REMOVED***);

  // Calculate averageProfitPerHour
  initialWeeklyData.forEach(dayData => ***REMOVED***
    dayData.hourlyData.forEach(hourData => ***REMOVED***
      if (hourData.totalHours > 0) ***REMOVED***
        hourData.averageProfitPerHour = hourData.totalProfit / hourData.totalHours;
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***);

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
***REMOVED***;