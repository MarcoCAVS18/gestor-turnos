// src/services/export/index.js

/**
 * Main entry point for the professional export system
 *
 * Usage:
 *
 * import { exportReport } from '@/services/export';
 *
 * // Export Excel
 * await exportReport('excel', stats, shifts, works, calculatePayment);
 *
 * // Export PDF
 * await exportReport('pdf', stats, shifts, works, calculatePayment);
 *
 * // With options
 * await exportReport('excel', stats, shifts, works, calculatePayment, {
 *   filename: 'custom-report.xlsx',
 *   logoColor: '#4472C4',
 *   includeCharts: true
 * });
 */

// Main API
export {
  exportReport,
  exportExcel,
  exportPDF,
  exportPNG,
  preloadExportResources,
  default as ExportService
} from './ExportService';

// Advanced API - Direct access to exporters
export { ExcelExporter, generateExcelReport, generateExcelBlob } from './excel/ExcelExporter';
export { PDFExporter, generatePDFReport, generatePDFBlob, previewPDF } from './pdf/PDFExporter';
export { PNGExporter, generatePNGReport, generatePNGBlob, previewPNG } from './png/PNGExporter';

// Data builders
export { buildReportData, ReportDataBuilder } from './data/ReportDataBuilder';
export { processMonthlyData, getMonthData, getRecentMonths } from './data/MonthlyDataProcessor';

// Utilities
export { loadLogoWithColor, loadLogoForPDF, loadLogoForExcel, preloadLogos } from './utils/LogoLoader';
export { generateAllCharts, generateChart, generateChartsWithProgress } from './utils/ChartRenderer';

// Chart components (for custom exports)
export {
  WeeklyEvolutionChart,
  WorkDistributionChart,
  DailyEarningsChart,
  ShiftTypeChart,
  PlatformComparisonChart,
  MonthlyTrendChart
} from './utils/ExportCharts';

// Styles and configuration
export { COLORS as ExcelColors, styles as ExcelStyles } from './excel/ExcelStyles';
export { COLORS as PDFColors, FONTS as PDFFonts, LAYOUT as PDFLayout } from './pdf/PDFStyles';

/**
 * Version information
 */
export const VERSION = '2.0.0';
export const FEATURES = {
  excel: true,
  pdf: true,
  png: true,
  charts: true,
  monthlyBreakdown: true,
  deliveryStats: true,
  customColors: true
};

/**
 * Export format constants
 */
export const EXPORT_FORMATS = {
  EXCEL: 'excel',
  PDF: 'pdf',
  PNG: 'png',
  XLSX: 'xlsx'
};

/**
 * Default export options
 */
export const DEFAULT_OPTIONS = {
  excel: {
    logoColor: '#4472C4',
    includeCharts: true
  },
  pdf: {
    logoColor: '#EC4899',
    includeCharts: true,
    includeCoverPage: true,
    includeMonthlyDetails: true
  },
  png: {
    logoColor: '#EC4899',
    width: 1200,
    height: 1600,
    quality: 1.0
  }
};
