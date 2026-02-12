// src/services/export/ExportService.js

import { buildReportData } from './data/ReportDataBuilder';
import { generateExcelReport } from './excel/ExcelExporter';
import { generatePDFReport } from './pdf/PDFExporter';
import { generatePNGReport } from './png/PNGExporter';
import { preloadLogos } from './utils/LogoLoader';

/**
 * Main Export Service
 * Orchestrates the generation of professional reports
 */
export class ExportService {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initializes the export service (preloads logos)
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      await preloadLogos();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Could not preload logos:', error);
      // Continue anyway
      this.isInitialized = true;
    }
  }

  /**
   * Exports a report in the specified format
   * @param {string} format - Export format ('excel', 'pdf', 'png')
   * @param {Object} data - Data for export
   * @param {Object} options - Export options
   * @returns {Promise<boolean>} Success status
   */
  async export(format, data, options = {}) {
    // Ensure initialized
    await this.initialize();

    // Validate data
    if (!data || !data.shifts || !data.works || !data.calculatePayment) {
      throw new Error('Invalid export data: missing required fields');
    }

    // Build report data
    const reportData = this.buildReportDataFromLegacyFormat(data);

    // Export based on format
    switch (format.toLowerCase()) {
      case 'excel':
      case 'xlsx':
        return this.exportExcel(reportData, options);

      case 'pdf':
        return this.exportPDF(reportData, options);

      case 'png':
        return this.exportPNG(reportData, options);

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Builds report data from legacy format (Dashboard stats)
   * @param {Object} data - Legacy data format
   * @returns {Object} Report data
   */
  buildReportDataFromLegacyFormat(data) {
    const {
      shifts = [],
      works = [],
      deliveryShifts = [],
      deliveryWorks = [],
      calculatePayment,
      shiftRanges,
      userSettings
    } = data;

    // Separate by type if not already separated
    const traditionalShifts = shifts.filter ? shifts.filter(s => s.type !== 'delivery') : shifts;
    const delivery = deliveryShifts.length > 0 ? deliveryShifts : shifts.filter(s => s.type === 'delivery');
    const regularWorks = works.filter ? works.filter(w => w.type !== 'delivery') : works;
    const deliveryWork = deliveryWorks.length > 0 ? deliveryWorks : works.filter(w => w.type === 'delivery');

    return buildReportData({
      shifts: traditionalShifts,
      deliveryShifts: delivery,
      works: regularWorks,
      deliveryWorks: deliveryWork,
      calculatePayment,
      shiftRanges,
      userSettings
    });
  }

  /**
   * Exports Excel report
   * @param {Object} reportData - Report data
   * @param {Object} options - Export options
   * @returns {Promise<boolean>} Success status
   */
  async exportExcel(reportData, options = {}) {
    try {
      await generateExcelReport(reportData, {
        filename: options.filename || `detailed-report-${this.formatDate(new Date())}.xlsx`,
        logoColor: options.logoColor || '#4472C4',
        includeCharts: options.includeCharts !== false,
        ...options
      });
      return true;
    } catch (error) {
      console.error('Error exporting Excel:', error);
      throw error;
    }
  }

  /**
   * Exports PDF report
   * @param {Object} reportData - Report data
   * @param {Object} options - Export options
   * @returns {Promise<boolean>} Success status
   */
  async exportPDF(reportData, options = {}) {
    try {
      await generatePDFReport(reportData, {
        filename: options.filename || `report-${this.formatDate(new Date())}.pdf`,
        logoColor: options.logoColor || '#EC4899',
        includeCharts: options.includeCharts !== false,
        includeCoverPage: options.includeCoverPage !== false,
        includeMonthlyDetails: options.includeMonthlyDetails !== false,
        ...options
      });
      return true;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw error;
    }
  }

  /**
   * Exports PNG report - Summarized dashboard image
   * @param {Object} reportData - Report data
   * @param {Object} options - Export options
   * @returns {Promise<boolean>} Success status
   */
  async exportPNG(reportData, options = {}) {
    try {
      await generatePNGReport(reportData, {
        filename: options.filename || `dashboard-${this.formatDate(new Date())}.png`,
        logoColor: options.logoColor || '#EC4899',
        width: options.width || 1200,
        userInfo: options.userInfo || null,
        ...options
      });
      return true;
    } catch (error) {
      console.error('Error exporting PNG:', error);
      throw error;
    }
  }

  /**
   * Formats date for filename
   * @param {Date} date - Date to format
   * @returns {string} Formatted date (YYYY-MM-DD)
   */
  formatDate(date) {
    return date.toISOString().split('T')[0];
  }
}

// Create singleton instance
const exportService = new ExportService();

/**
 * Main export function - simplified API
 * @param {string} format - Export format ('excel', 'pdf')
 * @param {Object} stats - Dashboard statistics
 * @param {Array} shifts - All shifts
 * @param {Array} works - All works
 * @param {Function} calculatePayment - Payment calculation function
 * @param {Object} options - Additional options
 * @returns {Promise<boolean>} Success status
 */
export const exportReport = async (format, stats, shifts, works, calculatePayment, options = {}) => {
  return exportService.export(format, {
    shifts,
    works,
    calculatePayment,
    shiftRanges: options.shiftRanges,
    userSettings: options.userSettings,
    deliveryShifts: options.deliveryShifts || [],
    deliveryWorks: options.deliveryWorks || []
  }, options);
};

/**
 * Exports Excel report
 */
export const exportExcel = async (stats, shifts, works, calculatePayment, options = {}) => {
  return exportReport('excel', stats, shifts, works, calculatePayment, options);
};

/**
 * Exports PDF report
 */
export const exportPDF = async (stats, shifts, works, calculatePayment, options = {}) => {
  return exportReport('pdf', stats, shifts, works, calculatePayment, options);
};

/**
 * Exports PNG report - Summarized dashboard
 */
export const exportPNG = async (stats, shifts, works, calculatePayment, options = {}) => {
  return exportReport('png', stats, shifts, works, calculatePayment, options);
};

/**
 * Preloads export resources (logos, etc.)
 */
export const preloadExportResources = async () => {
  return exportService.initialize();
};

export default exportService;
