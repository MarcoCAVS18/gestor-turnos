// src/services/export/pdf/PDFExporter.js

import jsPDF from 'jspdf';
import { loadLogoForPDF } from '../utils/LogoLoader';
import { generateAllCharts } from '../utils/ChartRenderer';
import { setupDocument, addPageFooter, COLORS } from './PDFStyles';
import {
  addCoverPage,
  addExecutiveSummary,
  addAnalyticsPage,
  addWorkDetailsPage,
  addDeliveryPage,
  addMonthlyDetailPages
} from './PDFSections';
import logger from '../../../utils/logger';

/**
 * PDF Exporter - Generates professional PDF reports
 */
export class PDFExporter {
  constructor(reportData, options = {}) {
    this.reportData = reportData;
    this.options = {
      filename: options.filename || `report-${this.formatDate(new Date())}.pdf`,
      logoColor: options.logoColor || COLORS.primary,
      includeCharts: options.includeCharts !== false,
      includeCoverPage: options.includeCoverPage !== false,
      includeMonthlyDetails: options.includeMonthlyDetails !== false,
      chartColors: {
        primary: options.primaryColor || COLORS.primary,
        secondary: options.secondaryColor || COLORS.secondary
      },
      ...options
    };
    this.logo = null;
    this.charts = {};
    this.doc = null;
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
   * Loads resources needed for the report
   */
  async loadResources() {
    const promises = [];

    // Load logo
    promises.push(
      loadLogoForPDF(this.options.logoColor)
        .then(logo => { this.logo = logo; })
        .catch(err => {
          logger.warn('Could not load logo:', err);
          this.logo = null;
        })
    );

    // Generate charts if needed
    if (this.options.includeCharts) {
      promises.push(
        generateAllCharts(this.reportData.chartData, this.options.chartColors)
          .then(charts => { this.charts = charts; })
          .catch(err => {
            logger.warn('Could not generate charts:', err);
            this.charts = {};
          })
      );
    }

    await Promise.all(promises);
  }

  /**
   * Initializes the PDF document
   */
  initializeDocument() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    setupDocument(this.doc);
  }

  /**
   * Generates the complete PDF
   * @returns {jsPDF} The generated PDF document
   */
  async generate() {
    // Load resources
    await this.loadResources();

    // Initialize document
    this.initializeDocument();

    let pageNumber = 1;

    // Cover Page
    if (this.options.includeCoverPage) {
      addCoverPage(this.doc, this.logo, this.reportData.metadata);
      addPageFooter(this.doc, pageNumber++);
      this.doc.addPage();
    }

    // Executive Summary
    addExecutiveSummary(this.doc, this.logo, this.reportData);
    addPageFooter(this.doc, pageNumber++);

    // Analytics Page (if charts available)
    if (this.options.includeCharts && Object.keys(this.charts).length > 0) {
      this.doc.addPage();
      addAnalyticsPage(this.doc, this.logo, this.charts);
      addPageFooter(this.doc, pageNumber++);
    }

    // Work Details Page
    this.doc.addPage();
    addWorkDetailsPage(this.doc, this.logo, this.reportData);
    addPageFooter(this.doc, pageNumber++);

    // Delivery Page (if applicable)
    if (this.reportData.delivery && this.reportData.delivery.enabled) {
      this.doc.addPage();
      addDeliveryPage(this.doc, this.logo, this.reportData, this.charts);
      addPageFooter(this.doc, pageNumber++);
    }

    // Monthly Detail Pages
    if (this.options.includeMonthlyDetails && this.reportData.monthlyData && this.reportData.monthlyData.length > 0) {
      this.doc.addPage();
      addMonthlyDetailPages(this.doc, this.logo, this.reportData.monthlyData);

      // Add page numbers to monthly pages
      const totalPages = this.doc.getNumberOfPages();
      for (let i = pageNumber; i <= totalPages; i++) {
        this.doc.setPage(i);
        addPageFooter(this.doc, i);
      }
    }

    return this.doc;
  }

  /**
   * Generates and downloads the PDF
   * @returns {Promise<boolean>} Success status
   */
  async download() {
    try {
      const doc = await this.generate();
      doc.save(this.options.filename);
      return true;
    } catch (error) {
      logger.error('Error generating PDF:', error);
      throw error;
    }
  }

  /**
   * Generates and returns the PDF as a Blob
   * @returns {Promise<Blob>} PDF file blob
   */
  async toBlob() {
    const doc = await this.generate();
    return doc.output('blob');
  }

  /**
   * Generates and returns the PDF as a data URI
   * @returns {Promise<string>} PDF data URI
   */
  async toDataURI() {
    const doc = await this.generate();
    return doc.output('datauristring');
  }

  /**
   * Generates and opens the PDF in a new window
   * @returns {Promise<boolean>} Success status
   */
  async preview() {
    try {
      const doc = await this.generate();
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      return true;
    } catch (error) {
      logger.error('Error generating PDF preview:', error);
      throw error;
    }
  }
}

/**
 * Generates and downloads a professional PDF report
 * @param {Object} reportData - Complete report data from ReportDataBuilder
 * @param {Object} options - Export options
 * @returns {Promise<boolean>} Success status
 */
export const generatePDFReport = async (reportData, options = {}) => {
  const exporter = new PDFExporter(reportData, options);
  return exporter.download();
};

/**
 * Generates PDF report and returns as Blob
 * @param {Object} reportData - Complete report data
 * @param {Object} options - Export options
 * @returns {Promise<Blob>} PDF file blob
 */
export const generatePDFBlob = async (reportData, options = {}) => {
  const exporter = new PDFExporter(reportData, options);
  return exporter.toBlob();
};

/**
 * Generates PDF and opens preview in new window
 * @param {Object} reportData - Complete report data
 * @param {Object} options - Export options
 * @returns {Promise<boolean>} Success status
 */
export const previewPDF = async (reportData, options = {}) => {
  const exporter = new PDFExporter(reportData, options);
  return exporter.preview();
};

/**
 * Quick export function for backward compatibility
 * @param {Object} stats - Statistics object
 * @param {Array} shifts - All shifts
 * @param {Array} works - All works
 * @param {Function} calculatePayment - Payment calculation function
 * @param {Object} options - Export options
 */
export const quickPDFExport = async (stats, shifts, works, calculatePayment, options = {}) => {
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
  return generatePDFReport(reportData, options);
};

const PDFExporterModule = {
  PDFExporter,
  generatePDFReport,
  generatePDFBlob,
  previewPDF,
  quickPDFExport
};

export default PDFExporterModule;
