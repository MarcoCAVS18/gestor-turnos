// src/services/export/data/ReportDataBuilder.js

import { calculateWeeklyStats, calculateDeliveryStats } from '../../calculationService';
import { processMonthlyData } from './MonthlyDataProcessor';
import { createSafeDate } from '../../../utils/time';
import { getShiftGrossEarnings } from '../../../utils/shiftUtils';

/**
 * Builds a comprehensive report data structure from shifts and works
 */
export class ReportDataBuilder {
  constructor({ shifts, deliveryShifts, works, deliveryWorks, calculatePayment, shiftRanges, userSettings }) {
    this.shifts = shifts || [];
    this.deliveryShifts = deliveryShifts || [];
    this.works = works || [];
    this.deliveryWorks = deliveryWorks || [];
    this.allWorks = [...this.works, ...this.deliveryWorks];
    this.allShifts = [...this.shifts, ...this.deliveryShifts];
    this.calculatePayment = calculatePayment;
    this.shiftRanges = shiftRanges;
    this.userSettings = userSettings || {};
  }

  /**
   * Builds the complete report data structure
   * @returns {Object} Complete report data
   */
  build() {
    const metadata = this.buildMetadata();
    const executive = this.buildExecutiveSummary();
    const weeklyStats = this.buildWeeklyStats();
    const byWork = this.buildByWork();
    const byShiftType = this.buildByShiftType();
    const delivery = this.buildDeliveryStats();
    const projections = this.buildProjections(weeklyStats);
    const monthlyData = processMonthlyData({
      shifts: this.shifts,
      deliveryShifts: this.deliveryShifts,
      works: this.works,
      deliveryWorks: this.deliveryWorks,
      calculatePayment: this.calculatePayment
    });
    const chartData = this.buildChartData(weeklyStats, byWork, byShiftType, delivery, monthlyData);

    return {
      metadata,
      executive,
      weeklyStats,
      byWork,
      byShiftType,
      delivery,
      projections,
      monthlyData,
      chartData
    };
  }

  /**
   * Build metadata section
   */
  buildMetadata() {
    const dates = this.allShifts.map(s => createSafeDate(s.startDate || s.date));
    const validDates = dates.filter(d => d && !isNaN(d.getTime()));

    return {
      generatedAt: new Date(),
      dateRange: {
        start: validDates.length > 0 ? new Date(Math.min(...validDates)) : new Date(),
        end: validDates.length > 0 ? new Date(Math.max(...validDates)) : new Date()
      },
      totalShiftsCount: this.allShifts.length,
      totalWorksCount: this.allWorks.length,
      hasDelivery: this.deliveryShifts.length > 0
    };
  }

  /**
   * Build executive summary
   */
  buildExecutiveSummary() {
    let totalEarned = 0;
    let totalHours = 0;
    let totalExpenses = 0;

    // Calculate traditional shifts
    this.shifts.forEach(shift => {
      const result = this.calculatePayment(shift);
      totalEarned += result.totalWithDiscount || result.total || 0;
      totalHours += result.hours || 0;
    });

    // Calculate delivery shifts
    this.deliveryShifts.forEach(shift => {
      const earnings = getShiftGrossEarnings(shift);
      totalEarned += earnings;
      totalExpenses += shift.fuelExpense || 0;

      // Calculate hours
      if (shift.startTime && shift.endTime) {
        const [sh, sm] = shift.startTime.split(':').map(Number);
        const [eh, em] = shift.endTime.split(':').map(Number);
        let hours = (eh + em / 60) - (sh + sm / 60);
        if (hours < 0) hours += 24;
        totalHours += hours;
      }
    });

    return {
      totalEarned,
      totalHours,
      totalShifts: this.allShifts.length,
      averagePerHour: totalHours > 0 ? totalEarned / totalHours : 0,
      averagePerShift: this.allShifts.length > 0 ? totalEarned / this.allShifts.length : 0,
      netEarnings: totalEarned - totalExpenses,
      totalExpenses
    };
  }

  /**
   * Build weekly statistics with comparison
   */
  buildWeeklyStats() {
    const current = calculateWeeklyStats({
      shifts: this.shifts,
      deliveryShifts: this.deliveryShifts,
      allWork: this.allWorks,
      calculatePayment: this.calculatePayment,
      shiftRanges: this.shiftRanges,
      weekOffset: 0
    });

    const previous = calculateWeeklyStats({
      shifts: this.shifts,
      deliveryShifts: this.deliveryShifts,
      allWork: this.allWorks,
      calculatePayment: this.calculatePayment,
      shiftRanges: this.shiftRanges,
      weekOffset: -1
    });

    // Calculate comparison
    const calcChange = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / prev) * 100;
    };

    const comparison = {
      earningsChange: calcChange(current.totalEarned, previous.totalEarned),
      hoursChange: calcChange(current.hoursWorked, previous.hoursWorked),
      shiftsChange: current.totalShifts - previous.totalShifts,
      trend: current.totalEarned > previous.totalEarned ? 'up' : current.totalEarned < previous.totalEarned ? 'down' : 'stable'
    };

    // Build weekly evolution (last 4 weeks)
    const weeklyEvolution = [];
    for (let i = 3; i >= 0; i--) {
      const weekStats = calculateWeeklyStats({
        shifts: this.shifts,
        deliveryShifts: this.deliveryShifts,
        allWork: this.allWorks,
        calculatePayment: this.calculatePayment,
        shiftRanges: this.shiftRanges,
        weekOffset: -i
      });

      const weekLabel = i === 0 ? 'This week' : i === 1 ? 'Last week' : `${i} weeks ago`;
      weeklyEvolution.push({
        week: weekLabel,
        earnings: weekStats.totalEarned,
        hours: weekStats.hoursWorked,
        shifts: weekStats.totalShifts
      });
    }

    return {
      current: {
        earnings: current.totalEarned,
        hours: current.hoursWorked,
        shifts: current.totalShifts,
        daysWorked: current.daysWorked,
        mostProductiveDay: current.mostProductiveDay,
        averagePerHour: current.averagePerHour,
        averageHoursPerDay: current.averageHoursPerDay,
        earningsByDay: current.earningsByDay
      },
      previous: {
        earnings: previous.totalEarned,
        hours: previous.hoursWorked,
        shifts: previous.totalShifts,
        daysWorked: previous.daysWorked
      },
      comparison,
      weeklyEvolution
    };
  }

  /**
   * Build earnings by work
   */
  buildByWork() {
    const workStats = {};

    // Process traditional shifts
    this.shifts.forEach(shift => {
      const work = this.works.find(w => w.id === shift.workId);
      if (!work) return;

      const result = this.calculatePayment(shift);
      const earnings = result.totalWithDiscount || result.total || 0;
      const hours = result.hours || 0;

      if (!workStats[work.id]) {
        workStats[work.id] = {
          id: work.id,
          name: work.name,
          color: work.color || '#EC4899',
          type: 'traditional',
          earnings: 0,
          hours: 0,
          shifts: 0
        };
      }

      workStats[work.id].earnings += earnings;
      workStats[work.id].hours += hours;
      workStats[work.id].shifts += 1;
    });

    // Process delivery shifts
    this.deliveryShifts.forEach(shift => {
      const work = this.deliveryWorks.find(w => w.id === shift.workId);
      if (!work) return;

      const earnings = getShiftGrossEarnings(shift);
      let hours = 0;
      if (shift.startTime && shift.endTime) {
        const [sh, sm] = shift.startTime.split(':').map(Number);
        const [eh, em] = shift.endTime.split(':').map(Number);
        hours = (eh + em / 60) - (sh + sm / 60);
        if (hours < 0) hours += 24;
      }

      if (!workStats[work.id]) {
        workStats[work.id] = {
          id: work.id,
          name: work.name,
          color: work.avatarColor || work.color || '#10B981',
          type: 'delivery',
          platform: work.platform,
          vehicle: work.vehicle,
          earnings: 0,
          hours: 0,
          shifts: 0
        };
      }

      workStats[work.id].earnings += earnings;
      workStats[work.id].hours += hours;
      workStats[work.id].shifts += 1;
    });

    // Calculate percentages and averages
    const totalEarnings = Object.values(workStats).reduce((sum, w) => sum + w.earnings, 0);

    return Object.values(workStats)
      .map(w => ({
        ...w,
        averagePerHour: w.hours > 0 ? w.earnings / w.hours : 0,
        averagePerShift: w.shifts > 0 ? w.earnings / w.shifts : 0,
        percentage: totalEarnings > 0 ? (w.earnings / totalEarnings) * 100 : 0
      }))
      .sort((a, b) => b.earnings - a.earnings);
  }

  /**
   * Build statistics by shift type
   */
  buildByShiftType() {
    const types = {
      day: { name: 'Day', shifts: 0, hours: 0, earnings: 0, color: '#FBBF24' },
      afternoon: { name: 'Afternoon', shifts: 0, hours: 0, earnings: 0, color: '#F97316' },
      night: { name: 'Night', shifts: 0, hours: 0, earnings: 0, color: '#6366F1' },
      saturday: { name: 'Saturday', shifts: 0, hours: 0, earnings: 0, color: '#10B981' },
      sunday: { name: 'Sunday', shifts: 0, hours: 0, earnings: 0, color: '#EC4899' },
      delivery: { name: 'Delivery', shifts: 0, hours: 0, earnings: 0, color: '#8B5CF6' }
    };

    // Process traditional shifts
    this.shifts.forEach(shift => {
      const result = this.calculatePayment(shift);
      const earnings = result.totalWithDiscount || result.total || 0;
      const hours = result.hours || 0;
      const shiftDate = createSafeDate(shift.startDate || shift.date);
      const dayOfWeek = shiftDate.getDay();

      let type = 'day';
      if (dayOfWeek === 0) type = 'sunday';
      else if (dayOfWeek === 6) type = 'saturday';
      else if (this.shiftRanges && shift.startTime) {
        const [hour] = shift.startTime.split(':').map(Number);
        if (hour >= 20 || hour < 6) type = 'night';
        else if (hour >= 14) type = 'afternoon';
        else type = 'day';
      }

      types[type].shifts += 1;
      types[type].hours += hours;
      types[type].earnings += earnings;
    });

    // Process delivery shifts
    this.deliveryShifts.forEach(shift => {
      const earnings = getShiftGrossEarnings(shift);
      let hours = 0;
      if (shift.startTime && shift.endTime) {
        const [sh, sm] = shift.startTime.split(':').map(Number);
        const [eh, em] = shift.endTime.split(':').map(Number);
        hours = (eh + em / 60) - (sh + sm / 60);
        if (hours < 0) hours += 24;
      }

      types.delivery.shifts += 1;
      types.delivery.hours += hours;
      types.delivery.earnings += earnings;
    });

    // Calculate percentages
    const totalEarnings = Object.values(types).reduce((sum, t) => sum + t.earnings, 0);

    return Object.entries(types)
      .filter(([_, data]) => data.shifts > 0)
      .map(([key, data]) => ({
        id: key,
        ...data,
        averagePerHour: data.hours > 0 ? data.earnings / data.hours : 0,
        percentage: totalEarnings > 0 ? (data.earnings / totalEarnings) * 100 : 0
      }))
      .sort((a, b) => b.earnings - a.earnings);
  }

  /**
   * Build delivery-specific statistics
   */
  buildDeliveryStats() {
    if (this.deliveryShifts.length === 0) {
      return { enabled: false };
    }

    const stats = calculateDeliveryStats({
      deliveryWork: this.deliveryWorks,
      deliveryShifts: this.deliveryShifts,
      period: 'year' // Get all data
    });

    // Process by platform
    const byPlatform = Object.values(stats.shiftsByPlatform || {}).map(p => ({
      name: p.name,
      color: p.color,
      earnings: p.totalEarned,
      orders: p.totalOrders,
      tips: p.totalTips,
      hours: p.totalHours,
      kilometers: p.totalKilometers,
      expenses: p.totalExpenses,
      shifts: p.shifts,
      averagePerHour: p.totalHours > 0 ? p.totalEarned / p.totalHours : 0,
      averagePerOrder: p.totalOrders > 0 ? p.totalEarned / p.totalOrders : 0,
      netEarnings: p.totalEarned - p.totalExpenses
    })).sort((a, b) => b.earnings - a.earnings);

    // Process by vehicle
    const byVehicle = Object.values(stats.statsByVehicle || {}).map(v => ({
      name: v.name,
      earnings: v.totalEarned,
      orders: v.totalOrders,
      kilometers: v.totalKilometers,
      expenses: v.totalExpenses,
      hours: v.totalHours,
      shifts: v.shifts,
      efficiency: v.efficiency,
      costPerKm: v.totalKilometers > 0 ? v.totalExpenses / v.totalKilometers : 0
    })).sort((a, b) => b.earnings - a.earnings);

    return {
      enabled: true,
      totalEarned: stats.totalEarned,
      totalOrders: stats.totalOrders,
      totalTips: stats.totalTips,
      totalKilometers: stats.totalKilometers,
      totalExpenses: stats.totalExpenses,
      netEarnings: stats.netEarnings,
      totalHours: stats.totalHours,
      averagePerOrder: stats.averagePerOrder,
      averagePerKilometer: stats.averagePerKilometer,
      averagePerHour: stats.averagePerHour,
      averageTipsPerOrder: stats.averageTipsPerOrder,
      fuelEfficiency: stats.fuelEfficiency,
      costPerKilometer: stats.costPerKilometer,
      bestDay: stats.bestDay,
      bestShift: stats.bestShift,
      byPlatform,
      byVehicle,
      daysWorked: stats.daysWorked,
      shiftsCompleted: stats.shiftsCompleted
    };
  }

  /**
   * Build projections
   */
  buildProjections(weeklyStats) {
    const weeklyAverage = weeklyStats.weeklyEvolution.reduce((sum, w) => sum + w.earnings, 0) / 4;
    const monthlyProjection = weeklyAverage * 4.33; // Average weeks per month
    const hourlyProjection = weeklyStats.current.hours > 0
      ? weeklyStats.current.earnings / weeklyStats.current.hours
      : 0;

    return {
      weeklyAverage,
      monthlyProjection,
      hourlyProjection,
      basedOnWeeks: 4
    };
  }

  /**
   * Build data for charts
   */
  buildChartData(weeklyStats, byWork, byShiftType, delivery, monthlyData) {
    // Weekly evolution for line chart
    const weeklyEvolution = weeklyStats.weeklyEvolution.map(w => ({
      name: w.week,
      earnings: Math.round(w.earnings * 100) / 100,
      hours: Math.round(w.hours * 100) / 100
    }));

    // Work distribution for pie chart
    const workDistribution = byWork.slice(0, 6).map(w => ({
      name: w.name,
      value: Math.round(w.earnings * 100) / 100,
      color: w.color
    }));

    // Daily earnings for bar chart
    const dailyEarnings = Object.entries(weeklyStats.current.earningsByDay || {}).map(([day, data]) => ({
      name: day.substring(0, 3),
      earnings: Math.round((data.earnings || 0) * 100) / 100,
      hours: Math.round((data.hours || 0) * 100) / 100
    }));

    // Shift type distribution
    const shiftTypeDistribution = byShiftType.map(t => ({
      name: t.name,
      value: Math.round(t.earnings * 100) / 100,
      color: t.color
    }));

    // Platform comparison (delivery)
    const platformComparison = delivery.enabled
      ? (delivery.byPlatform || []).map(p => ({
          name: p.name,
          earnings: Math.round(p.earnings * 100) / 100,
          orders: p.orders,
          color: p.color
        }))
      : [];

    // Monthly trend
    const monthlyTrend = monthlyData.slice(-6).map(m => ({
      name: m.monthYear.split(' ')[0].substring(0, 3),
      earnings: Math.round(m.summary.totalEarned * 100) / 100,
      hours: Math.round(m.summary.totalHours * 100) / 100
    }));

    return {
      weeklyEvolution,
      workDistribution,
      dailyEarnings,
      shiftTypeDistribution,
      platformComparison,
      monthlyTrend
    };
  }
}

/**
 * Creates a report data builder and builds the data
 * @param {Object} params - Parameters for building report
 * @returns {Object} Complete report data
 */
export const buildReportData = (params) => {
  const builder = new ReportDataBuilder(params);
  return builder.build();
};

export default ReportDataBuilder;
