// src/services/export/png/PNGExporter.js

import { loadLogoForPDF } from '../utils/LogoLoader';
import { renderComponentToImage } from '../utils/ChartRenderer';
import { PNGDashboard } from './PNGDashboard';

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
      height: options.height || 1600,
      quality: options.quality || 1.0,
      ...options
    };
    this.logo = null;
  }

  /**
   * Formats date for filename
   * @param {Date} date - Date to format
   * @returns {string} Formatted date (YYYY-MM-DD)
   */
  formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  /**
   * Loads resources needed for the export
   */
  async loadResources() {
    try {
      this.logo = await loadLogoForPDF(this.options.logoColor);
    } catch (error) {
      console.warn('Could not load logo:', error);
      this.logo = null;
    }
  }

  /**
   * Generates the PNG image
   * @returns {Promise<string>} Base64 PNG data
   */
  async generate() {
    // Load resources
    await this.loadResources();

    // Prepare dashboard data (summarized)
    const dashboardData = this.prepareDashboardData();

    // Render dashboard component to image
    const result = await renderComponentToImage(
      PNGDashboard,
      {
        data: dashboardData,
        logo: this.logo,
        width: this.options.width,
        height: this.options.height
      },
      {
        width: this.options.width,
        height: this.options.height,
        scale: 2, // Higher quality
        backgroundColor: '#FFFFFF'
      }
    );

    return result.base64;
  }

  /**
   * Prepares summarized data for the dashboard
   * @returns {Object} Summarized dashboard data
   */
  prepareDashboardData() {
    const { executive = {}, weeklyStats = {}, byWork = {}, byShiftType = {}, delivery, projections = {}, metadata = {} } = this.reportData;

    // Top 5 works only
    const topWorks = (byWork.details || [])
      .sort((a, b) => (b.totalEarned || 0) - (a.totalEarned || 0))
      .slice(0, 5)
      .map(work => ({
        name: work.name || 'Unknown',
        earned: work.totalEarned || 0,
        hours: work.totalHours || 0
      }));

    // Simplified shift types
    const shiftTypes = Object.entries(byShiftType.byType || {}).map(([type, data]) => ({
      type: this.formatShiftType(type),
      hours: data.hours || 0,
      earned: data.earned || 0,
      count: data.count || 0
    }));

    // Week comparison
    const current = weeklyStats.current || { earnings: 0 };
    const previous = weeklyStats.previous || { earnings: 0 };
    const weekComparison = {
      current: current.earnings,
      previous: previous.earnings,
      change: previous.earnings > 0
        ? ((current.earnings - previous.earnings) / previous.earnings) * 100
        : 0
    };

    // Simple chart data - last 4 weeks
    const weeklyData = (weeklyStats.evolution || []).slice(-4).map((week, index) => ({
      week: `W${index + 1}`,
      earnings: week.earnings || 0,
      hours: week.hours || 0
    }));

    return {
      metadata,
      kpis: {
        totalEarned: executive.totalEarned || 0,
        totalHours: executive.totalHours || 0,
        totalShifts: executive.totalShifts || 0,
        averagePerHour: executive.averagePerHour || 0
      },
      weekComparison,
      weeklyData,
      topWorks,
      shiftTypes,
      delivery: delivery && delivery.enabled ? {
        totalEarned: delivery.totalEarned || 0,
        totalOrders: delivery.totalOrders || 0,
        averagePerOrder: delivery.averagePerOrder || 0
      } : null,
      projections: {
        monthlyProjected: projections.monthlyProjected || 0,
        daysInMonth: projections.daysInMonth || 0,
        daysRemaining: projections.daysRemaining || 0
      }
    };
  }

  /**
   * Formats shift type for display
   * @param {string} type - Shift type
   * @returns {string} Formatted type
   */
  formatShiftType(type) {
    const types = {
      day: 'Day',
      afternoon: 'Afternoon',
      night: 'Night',
      saturday: 'Saturday',
      sunday: 'Sunday',
      delivery: 'Delivery'
    };
    return types[type] || type;
  }

  /**
   * Generates and downloads the PNG
   * @returns {Promise<boolean>} Success status
   */
  async download() {
    try {
      const base64 = await this.generate();

      // Create download link
      const link = document.createElement('a');
      link.href = base64;
      link.download = this.options.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return true;
    } catch (error) {
      console.error('Error generating PNG:', error);
      throw error;
    }
  }

  /**
   * Generates and returns the PNG as a Blob
   * @returns {Promise<Blob>} PNG file blob
   */
  async toBlob() {
    const base64 = await this.generate();
    const response = await fetch(base64);
    return response.blob();
  }

  /**
   * Generates and opens the PNG in a new window
   * @returns {Promise<boolean>} Success status
   */
  async preview() {
    try {
      const base64 = await this.generate();
      const win = window.open();
      win.document.write(`<img src="${base64}" style="max-width: 100%; height: auto;" />`);
      return true;
    } catch (error) {
      console.error('Error generating PNG preview:', error);
      throw error;
    }
  }
}

/**
 * Generates and downloads a PNG dashboard
 * @param {Object} reportData - Complete report data from ReportDataBuilder
 * @param {Object} options - Export options
 * @returns {Promise<boolean>} Success status
 */
export const generatePNGReport = async (reportData, options = {}) => {
  const exporter = new PNGExporter(reportData, options);
  return exporter.download();
};

/**
 * Generates PNG and returns as Blob
 * @param {Object} reportData - Complete report data
 * @param {Object} options - Export options
 * @returns {Promise<Blob>} PNG file blob
 */
export const generatePNGBlob = async (reportData, options = {}) => {
  const exporter = new PNGExporter(reportData, options);
  return exporter.toBlob();
};

/**
 * Generates PNG and opens preview in new window
 * @param {Object} reportData - Complete report data
 * @param {Object} options - Export options
 * @returns {Promise<boolean>} Success status
 */
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
