// src/hooks/useCombinedStats.js

import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { calculateWeeklyStats } from '../utils/statsCalculations';
import { getShiftGrossEarnings } from '../utils/shiftUtils';

export const useCombinedStats = ({
  period = 'month',
  weekOffset = 0,
  weeklyHoursGoal,
  previousData,
}) => {
  const {
    shifts,
    deliveryShifts,
    allWork,
    calculatePayment,
    shiftRanges,
    deliveryWork,
  } = useApp();

  const weeklyStats = useMemo(() => {
    return calculateWeeklyStats({
      shifts,
      deliveryShifts,
      allWork,
      calculatePayment,
      shiftRanges,
      weekOffset,
    });
  }, [
    shifts,
    deliveryShifts,
    allWork,
    calculatePayment,
    shiftRanges,
    weekOffset,
  ]);

  const deliveryStats = useMemo(() => {
    const validDeliveryWork = Array.isArray(deliveryWork)
      ? deliveryWork
      : [];
    const validDeliveryShifts = Array.isArray(deliveryShifts)
      ? deliveryShifts
      : [];

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
        costPerKilometer: 0,
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

    const periodShifts = validDeliveryShifts.filter((shift) => {
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

    periodShifts.forEach((shift) => {
      const work = validDeliveryWork.find(
        (t) => t.id === shift.workId
      );
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
      let hours = endHour + endMin / 60 - (startHour + startMin / 60);
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
          shifts: [],
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
        hours,
      });

      const platform = work.platform || work.name;
      if (!shiftsByPlatform[platform]) {
        shiftsByPlatform[platform] = {
          name: work.name,
          color: work.avatarColor || work.color || '#10B981',
          totalEarned: 0,
          totalOrders: 0,
          totalTips: 0,
          totalHours: 0,
          totalKilometers: 0,
          totalExpenses: 0,
          shifts: 0,
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
          efficiency: 0,
        };
      }

      statsByVehicle[vehicle].totalEarned += shiftEarnings;
      statsByVehicle[vehicle].totalOrders += orders;
      statsByVehicle[vehicle].totalKilometers += kilometers;
      statsByVehicle[vehicle].totalExpenses += expenses;
      statsByVehicle[vehicle].totalHours += hours;
      statsByVehicle[vehicle].shifts += 1;
    });

    Object.values(statsByVehicle).forEach((vehicle) => {
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
          expenses: stats.expenses,
        };
      }
    });

    let bestShift = null;
    let bestShiftEarnings = 0;

    periodShifts.forEach((shift) => {
      const grossEarnings = getShiftGrossEarnings(shift);
      const netEarnings = grossEarnings - (shift.fuelExpense || 0);
      if (netEarnings > bestShiftEarnings) {
        bestShiftEarnings = netEarnings;
        bestShift = {
          ...shift,
          netEarnings,
          work: validDeliveryWork.find(
            (t) => t.id === shift.workId
          ),
        };
      }
    });

    const netEarnings = totalEarned - totalExpenses;
    const averagePerOrder =
      totalOrders > 0 ? totalEarned / totalOrders : 0;
    const averagePerKilometer =
      totalKilometers > 0 ? totalEarned / totalKilometers : 0;
    const averagePerHour = totalHours > 0 ? totalEarned / totalHours : 0;
    const averageTipsPerOrder =
      totalOrders > 0 ? totalTips / totalOrders : 0;
    const fuelEfficiency =
      totalExpenses > 0 ? totalKilometers / totalExpenses : 0;
    const costPerKilometer =
      totalKilometers > 0 ? totalExpenses / totalKilometers : 0;

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
      shiftsCompleted: periodShifts.length,
    };

    return result;
  }, [deliveryWork, deliveryShifts, period]);

  return { weeklyStats, deliveryStats, weeklyHoursGoal, previousData };
};