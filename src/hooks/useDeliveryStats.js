// src/hooks/useDeliveryStats.js

import ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** getShiftGrossEarnings ***REMOVED*** from '../utils/shiftUtils';

export const useDeliveryStats = (period = 'month') => ***REMOVED***
  const ***REMOVED*** deliveryWork, deliveryShifts ***REMOVED*** = useApp();
  
  return useMemo(() => ***REMOVED***
    // Use specific delivery data from context
    const validDeliveryWork = Array.isArray(deliveryWork) ? deliveryWork : [];
    const validDeliveryShifts = Array.isArray(deliveryShifts) ? deliveryShifts : [];
    
    // If no data, return empty structure
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
    
    // Calculate dates based on period
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
    
    // Filter shifts by period
    const periodShifts = validDeliveryShifts.filter(shift => ***REMOVED***
      const shiftDate = new Date(shift.date);
      return shiftDate >= startDate;
    ***REMOVED***);
        
    // Calculate basic statistics
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
      const work = validDeliveryWork.find(t => t.id === shift.workId);
      if (!work) ***REMOVED***
        console.warn('Delivery work not found for shift:', shift.id);
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
      
      // Calculate hours worked
      const [startHour, startMin] = shift.startTime.split(':').map(Number);
      const [endHour, endMin] = shift.endTime.split(':').map(Number);
      let hours = (endHour + endMin/60) - (startHour + startMin/60);
      if (hours < 0) hours += 24;
      totalHours += hours;
      
      // Statistics by day
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
      
      // Statistics by platform
      const platform = work.platform || work.name;
      if (!shiftsByPlatform[platform]) ***REMOVED***
        shiftsByPlatform[platform] = ***REMOVED***
          name: work.name,
          color: work.avatarColor || work.color || '#10B981',
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
      
      // Statistics by vehicle
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
    
    // Calculate efficiency for each vehicle
    Object.values(statsByVehicle).forEach(vehicle => ***REMOVED***
      if (vehicle.totalExpenses > 0) ***REMOVED***
        vehicle.efficiency = vehicle.totalKilometers / vehicle.totalExpenses;
      ***REMOVED***
    ***REMOVED***);
    
    // Find best day
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
    
    // Find best individual shift
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
          work: validDeliveryWork.find(t => t.id === shift.workId)
        ***REMOVED***;
      ***REMOVED***
    ***REMOVED***);
    
    // Calculate averages and final totals
    const netEarnings = totalEarned - totalExpenses;
    const averagePerOrder = totalOrders > 0 ? totalEarned / totalOrders : 0;
    const averagePerKilometer = totalKilometers > 0 ? totalEarned / totalKilometers : 0;
    const averagePerHour = totalHours > 0 ? totalEarned / totalHours : 0;
    const averageTipsPerOrder = totalOrders > 0 ? totalTips / totalOrders : 0;
    const fuelEfficiency = totalExpenses > 0 ? totalKilometers / totalExpenses : 0;
    const costPerKilometer = totalKilometers > 0 ? totalExpenses / totalKilometers : 0;
    
    const result = ***REMOVED***
      // Totals
      totalEarned,
      totalTips,
      totalOrders,
      totalKilometers,
      totalExpenses,
      netEarnings,
      totalHours,
      
      // Averages
      averagePerOrder,
      averagePerKilometer,
      averagePerHour,
      averageTipsPerOrder,
      fuelEfficiency,
      costPerKilometer,
      
      // Best/Worst
      bestDay,
      bestShift,
      
      // By category
      shiftsByPlatform,
      statsByVehicle,
      statsByDay,
      
      // Metadata
      daysWorked: Object.keys(statsByDay).length,
      shiftsCompleted: periodShifts.length
    ***REMOVED***;

    return result;
  ***REMOVED***, [deliveryWork, deliveryShifts, period]);
***REMOVED***;