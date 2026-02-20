// src/services/export/excel/ExcelExporter.js

import * as XLSX from 'xlsx-js-style';
import { createAllSheets } from './ExcelSheets';
import { loadLogoForExcel } from '../utils/LogoLoader';
import logger from '../../../utils/logger';

/**
 * Excel Exporter - Generates professional Excel reports
 */
export class ExcelExporter {
  constructor(reportData, options = {}) {
    this.reportData = reportData;
    this.options = {
      filename: options.filename || `detailed-report-${this.formatDate(new Date())}.xlsx`,
      logoColor: options.logoColor || '#4472C4',
      includeCharts: options.includeCharts !== false,
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
   * Loads the logo for the report
   */
  async loadLogo() {
    try {
      this.logo = await loadLogoForExcel(this.options.logoColor);
    } catch (error) {
      logger.warn('Could not load logo for Excel:', error);
      this.logo = null;
    }
  }

  /**
   * Generates the Excel workbook
   * @returns {Object} XLSX Workbook
   */
  async generate() {
    // Load logo if needed
    if (this.options.includeCharts) {
      await this.loadLogo();
    }

    // Create all sheets
    const sheets = createAllSheets(this.reportData, {
      logo: this.logo
    });

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Add sheets to workbook in order
    Object.entries(sheets).forEach(([sheetName, worksheet]) => {
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    // Set workbook properties
    workbook.Props = {
      Title: 'Activity Report',
      Subject: 'Shift Management Report',
      Author: 'Shift Tracker',
      CreatedDate: new Date()
    };

    return workbook;
  }

  /**
   * Generates and downloads the Excel file
   */
  async download() {
    try {
      const workbook = await this.generate();

      // Generate buffer
      const buffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
        cellStyles: true
      });

      // Create blob and download
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.options.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      logger.error('Error generating Excel:', error);
      throw error;
    }
  }

  /**
   * Generates and returns the Excel as a Blob
   * @returns {Blob} Excel file blob
   */
  async toBlob() {
    const workbook = await this.generate();

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true
    });

    return new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  }

  /**
   * Generates and returns the Excel as a base64 string
   * @returns {string} Base64 encoded Excel file
   */
  async toBase64() {
    const workbook = await this.generate();

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'base64',
      cellStyles: true
    });

    return buffer;
  }
}

/**
 * Generates and downloads a professional Excel report
 * @param {Object} reportData - Complete report data from ReportDataBuilder
 * @param {Object} options - Export options
 * @returns {Promise<boolean>} Success status
 */
export const generateExcelReport = async (reportData, options = {}) => {
  const exporter = new ExcelExporter(reportData, options);
  return exporter.download();
};

/**
 * Generates Excel report and returns as Blob
 * @param {Object} reportData - Complete report data
 * @param {Object} options - Export options
 * @returns {Promise<Blob>} Excel file blob
 */
export const generateExcelBlob = async (reportData, options = {}) => {
  const exporter = new ExcelExporter(reportData, options);
  return exporter.toBlob();
};

/**
 * Quick export function for backward compatibility
 * @param {Object} stats - Statistics object
 * @param {Array} shifts - All shifts
 * @param {Array} works - All works
 * @param {Function} calculatePayment - Payment calculation function
 * @param {Object} options - Export options
 */
export const quickExcelExport = async (stats, shifts, works, calculatePayment, options = {}) => {
  const { buildReportData } = await import('../data/ReportDataBuilder');

  // Separate shifts and works by type
  const traditionalShifts = shifts.filter(s => s.type !== 'delivery');
  const deliveryShifts = shifts.filter(s => s.type === 'delivery');
  const regularWorks = works.filter(w => w.type !== 'delivery');
  const deliveryWorks = works.filter(w => w.type === 'delivery');

  // Build report data
  const reportData = buildReportData({
    shifts: traditionalShifts,
    deliveryShifts,
    works: regularWorks,
    deliveryWorks,
    calculatePayment,
    shiftRanges: options.shiftRanges,
    userSettings: options.userSettings
  });

  // Generate and download
  return generateExcelReport(reportData, options);
};

const ExcelExporterModule = {
  ExcelExporter,
  generateExcelReport,
  generateExcelBlob,
  quickExcelExport
};

export default ExcelExporterModule;
