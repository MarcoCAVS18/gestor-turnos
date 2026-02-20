// src/services/export/png/PNGExporter.js

import { loadLogoForPDF } from '../utils/LogoLoader';
import { renderComponentToImage } from '../utils/ChartRenderer';
import { PNGDashboard } from './PNGDashboard';
import logger from '../../../utils/logger';

/**
 * PNG Exporter - Generates a beautiful, summarized dashboard image
 */
export class PNGExporter {
  constructor(reportData, options = {}) {
    this.reportData = reportData;
    this.options = {
      filename: options.filename || `dashboard-${this.formatDate(new Date())}.png`,
      logoColor: options.logoColor || '#EC4899',
      width: options.width || 1200,
      quality: options.quality || 1.0,
      userInfo: options.userInfo || null,
      ...options
    };
    this.logo = null;
  }

  formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  async loadResources() {
    try {
      this.logo = await loadLogoForPDF(this.options.logoColor);
    } catch (error) {
      logger.warn('Could not load logo:', error);
      this.logo = null;
    }
  }

  async generate() {
    await this.loadResources();

    const dashboardData = this.prepareDashboardData();

    const result = await renderComponentToImage(
      PNGDashboard,
      {
        data: dashboardData,
        logo: this.logo,
        width: this.options.width
      },
      {
        width: this.options.width,
        height: 800, // Min height, content will expand
        scale: 2,
        backgroundColor: '#FFFFFF'
      }
    );

    return result.base64;
  }

  /**
   * Prepares summarized data for the dashboard
   * Maps from ReportDataBuilder output to PNGDashboard expected format
   */
  prepareDashboardData() {
    const {
      executive = {},
      weeklyStats = {},
      byWork = [],
      byShiftType = [],
      delivery,
      projections = {},
      metadata = {}
    } = this.reportData;

    // Format date range for display
    const formatDate = (d) => {
      if (!d) return '';
      const date = d instanceof Date ? d : new Date(d);
      return date.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const dateRange = metadata.dateRange || {};

    // Top 5 works - byWork is already a sorted array
    const topWorks = byWork
      .slice(0, 5)
      .map(work => ({
        name: work.name || 'Unknown',
        earned: work.earnings || 0,
        hours: work.hours || 0,
        shifts: work.shifts || 0,
        color: work.color || '#EC4899'
      }));

    // Shift types - byShiftType is already a sorted array
    const shiftTypes = byShiftType.map(item => ({
      type: item.name || item.id || 'Unknown',
      hours: item.hours || 0,
      earned: item.earnings || 0,
      count: item.shifts || 0,
      color: item.color || '#3B82F6'
    }));

    // Week comparison from weeklyStats
    const current = weeklyStats.current || { earnings: 0 };
    const previous = weeklyStats.previous || { earnings: 0 };
    const weekComparison = {
      current: current.earnings || 0,
      previous: previous.earnings || 0,
      change: previous.earnings > 0
        ? ((current.earnings - previous.earnings) / previous.earnings) * 100
        : current.earnings > 0 ? 100 : 0
    };

    // Weekly evolution data - from weeklyStats.weeklyEvolution
    const weeklyData = (weeklyStats.weeklyEvolution || []).map(week => ({
      week: week.week || '',
      earnings: week.earnings || 0,
      hours: week.hours || 0
    }));

    return {
      metadata: {
        startDate: formatDate(dateRange.start),
        endDate: formatDate(dateRange.end),
        generatedDate: new Date().toLocaleDateString('en-AU', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        totalShifts: metadata.totalShiftsCount || 0,
        totalWorks: metadata.totalWorksCount || 0
      },
      userInfo: this.options.userInfo,
      kpis: {
        totalEarned: executive.totalEarned || 0,
        totalHours: executive.totalHours || 0,
        totalShifts: executive.totalShifts || 0,
        averagePerHour: executive.averagePerHour || 0,
        averagePerShift: executive.averagePerShift || 0,
        netEarnings: executive.netEarnings || executive.totalEarned || 0
      },
      weekComparison,
      weeklyData,
      topWorks,
      shiftTypes,
      delivery: delivery && delivery.enabled ? {
        totalEarned: delivery.totalEarned || 0,
        totalOrders: delivery.totalOrders || 0,
        averagePerOrder: delivery.averagePerOrder || 0,
        totalHours: delivery.totalHours || 0,
        totalKilometers: delivery.totalKilometers || 0,
        netEarnings: delivery.netEarnings || 0
      } : null,
      projections: {
        weeklyAverage: projections.weeklyAverage || 0,
        monthlyProjection: projections.monthlyProjection || 0,
        hourlyProjection: projections.hourlyProjection || 0
      }
    };
  }

  async download() {
    try {
      const base64 = await this.generate();
      const link = document.createElement('a');
      link.href = base64;
      link.download = this.options.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (error) {
      logger.error('Error generating PNG:', error);
      throw error;
    }
  }

  async toBlob() {
    const base64 = await this.generate();
    const response = await fetch(base64);
    return response.blob();
  }

  async preview() {
    try {
      const base64 = await this.generate();
      const win = window.open();
      win.document.write(`<img src="${base64}" style="max-width: 100%; height: auto;" />`);
      return true;
    } catch (error) {
      logger.error('Error generating PNG preview:', error);
      throw error;
    }
  }
}

export const generatePNGReport = async (reportData, options = {}) => {
  const exporter = new PNGExporter(reportData, options);
  return exporter.download();
};

export const generatePNGBlob = async (reportData, options = {}) => {
  const exporter = new PNGExporter(reportData, options);
  return exporter.toBlob();
};

export const previewPNG = async (reportData, options = {}) => {
  const exporter = new PNGExporter(reportData, options);
  return exporter.preview();
};

const PNGExporterModule = {
  PNGExporter,
  generatePNGReport,
  generatePNGBlob,
  previewPNG
};

export default PNGExporterModule;
