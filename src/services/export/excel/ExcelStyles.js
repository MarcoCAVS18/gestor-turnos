// src/services/export/excel/ExcelStyles.js

/**
 * Professional Excel styles for export
 * Uses xlsx-js-style format for styling
 */

// Color definitions
export const COLORS = {
  // Primary brand colors
  primary: 'EC4899',      // Pink
  primaryDark: 'DB2777',  // Darker pink

  // Secondary colors
  secondary: '4472C4',    // Blue
  secondaryDark: '2F5496', // Darker blue

  // Accent colors
  accent: '10B981',       // Green
  warning: 'F59E0B',      // Orange
  error: 'EF4444',        // Red
  purple: '8B5CF6',       // Purple

  // Neutral colors
  white: 'FFFFFF',
  black: '000000',
  darkGray: '1F2937',
  gray: '6B7280',
  lightGray: '9CA3AF',
  veryLightGray: 'F3F4F6',
  backgroundGray: 'F9FAFB',

  // Shift type colors
  day: 'FBBF24',
  afternoon: 'F97316',
  night: '6366F1',
  saturday: '10B981',
  sunday: 'EC4899',
  delivery: '8B5CF6'
};

// Border definitions
const borders = {
  thin: {
    top: { style: 'thin', color: { rgb: 'D1D5DB' } },
    bottom: { style: 'thin', color: { rgb: 'D1D5DB' } },
    left: { style: 'thin', color: { rgb: 'D1D5DB' } },
    right: { style: 'thin', color: { rgb: 'D1D5DB' } }
  },
  medium: {
    top: { style: 'medium', color: { rgb: '9CA3AF' } },
    bottom: { style: 'medium', color: { rgb: '9CA3AF' } },
    left: { style: 'medium', color: { rgb: '9CA3AF' } },
    right: { style: 'medium', color: { rgb: '9CA3AF' } }
  },
  bottom: {
    bottom: { style: 'thin', color: { rgb: 'D1D5DB' } }
  },
  none: {}
};

// Font definitions
const fonts = {
  title: {
    name: 'Calibri',
    sz: 18,
    bold: true,
    color: { rgb: COLORS.darkGray }
  },
  subtitle: {
    name: 'Calibri',
    sz: 14,
    bold: true,
    color: { rgb: COLORS.gray }
  },
  sectionHeader: {
    name: 'Calibri',
    sz: 12,
    bold: true,
    color: { rgb: COLORS.white }
  },
  tableHeader: {
    name: 'Calibri',
    sz: 11,
    bold: true,
    color: { rgb: COLORS.white }
  },
  label: {
    name: 'Calibri',
    sz: 11,
    bold: true,
    color: { rgb: COLORS.gray }
  },
  value: {
    name: 'Calibri',
    sz: 11,
    color: { rgb: COLORS.darkGray }
  },
  valueBold: {
    name: 'Calibri',
    sz: 11,
    bold: true,
    color: { rgb: COLORS.darkGray }
  },
  small: {
    name: 'Calibri',
    sz: 10,
    color: { rgb: COLORS.gray }
  },
  kpiValue: {
    name: 'Calibri',
    sz: 16,
    bold: true,
    color: { rgb: COLORS.primary }
  },
  positive: {
    name: 'Calibri',
    sz: 11,
    bold: true,
    color: { rgb: COLORS.accent }
  },
  negative: {
    name: 'Calibri',
    sz: 11,
    bold: true,
    color: { rgb: COLORS.error }
  }
};

// Style definitions
export const styles = {
  // Title and headers
  title: {
    font: fonts.title,
    alignment: { horizontal: 'left', vertical: 'center' }
  },

  subtitle: {
    font: fonts.subtitle,
    alignment: { horizontal: 'left', vertical: 'center' }
  },

  // Section headers (main headers with background)
  sectionHeader: {
    font: fonts.sectionHeader,
    fill: { fgColor: { rgb: COLORS.primary } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borders.thin
  },

  sectionHeaderBlue: {
    font: fonts.sectionHeader,
    fill: { fgColor: { rgb: COLORS.secondary } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borders.thin
  },

  sectionHeaderGreen: {
    font: fonts.sectionHeader,
    fill: { fgColor: { rgb: COLORS.accent } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borders.thin
  },

  // Table headers
  tableHeader: {
    font: fonts.tableHeader,
    fill: { fgColor: { rgb: COLORS.secondary } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: borders.thin
  },

  tableHeaderPink: {
    font: fonts.tableHeader,
    fill: { fgColor: { rgb: COLORS.primary } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: borders.thin
  },

  tableHeaderGreen: {
    font: fonts.tableHeader,
    fill: { fgColor: { rgb: COLORS.accent } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: borders.thin
  },

  // Labels and values
  label: {
    font: fonts.label,
    alignment: { horizontal: 'left', vertical: 'center' },
    border: borders.thin
  },

  labelRight: {
    font: fonts.label,
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin
  },

  value: {
    font: fonts.value,
    alignment: { horizontal: 'left', vertical: 'center' },
    border: borders.thin
  },

  valueRight: {
    font: fonts.value,
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin
  },

  valueCenter: {
    font: fonts.value,
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borders.thin
  },

  valueBold: {
    font: fonts.valueBold,
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin
  },

  // KPI cells
  kpiValue: {
    font: fonts.kpiValue,
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borders.thin
  },

  kpiLabel: {
    font: fonts.small,
    alignment: { horizontal: 'center', vertical: 'center' },
    fill: { fgColor: { rgb: COLORS.veryLightGray } },
    border: borders.thin
  },

  // Table cells - even row
  cellEven: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.white } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: borders.thin
  },

  cellEvenRight: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.white } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin
  },

  cellEvenCenter: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.white } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borders.thin
  },

  // Table cells - odd row
  cellOdd: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.backgroundGray } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: borders.thin
  },

  cellOddRight: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.backgroundGray } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin
  },

  cellOddCenter: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.backgroundGray } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borders.thin
  },

  // Currency cells
  currencyEven: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.white } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin,
    numFmt: '$#,##0.00'
  },

  currencyOdd: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.backgroundGray } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin,
    numFmt: '$#,##0.00'
  },

  currencyBold: {
    font: fonts.valueBold,
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin,
    numFmt: '$#,##0.00'
  },

  // Number cells
  numberEven: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.white } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin,
    numFmt: '#,##0.00'
  },

  numberOdd: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.backgroundGray } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin,
    numFmt: '#,##0.00'
  },

  integerEven: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.white } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borders.thin,
    numFmt: '#,##0'
  },

  integerOdd: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.backgroundGray } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borders.thin,
    numFmt: '#,##0'
  },

  // Percentage cells
  percentEven: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.white } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin,
    numFmt: '0.0%'
  },

  percentOdd: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.backgroundGray } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin,
    numFmt: '0.0%'
  },

  // Positive/negative change
  changePositive: {
    font: fonts.positive,
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin
  },

  changeNegative: {
    font: fonts.negative,
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin
  },

  // Date cells
  dateEven: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.white } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borders.thin
  },

  dateOdd: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.backgroundGray } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borders.thin
  },

  // Notes cell
  notesEven: {
    font: fonts.small,
    fill: { fgColor: { rgb: COLORS.white } },
    alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
    border: borders.thin
  },

  notesOdd: {
    font: fonts.small,
    fill: { fgColor: { rgb: COLORS.backgroundGray } },
    alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
    border: borders.thin
  },

  // Empty cell
  empty: {
    border: borders.thin
  }
};

// Column width configurations
export const columnWidths = {
  id: 10,
  date: 12,
  weekday: 12,
  workName: 20,
  time: 8,
  hours: 10,
  currency: 14,
  number: 10,
  percent: 10,
  platform: 14,
  vehicle: 12,
  notes: 25,
  boolean: 8,
  wide: 30
};

/**
 * Applies a style to a cell
 * @param {Object} worksheet - The worksheet
 * @param {string} cellRef - Cell reference (e.g., 'A1')
 * @param {Object} style - Style object to apply
 */
export const applyStyle = (worksheet, cellRef, style) => {
  if (!worksheet[cellRef]) {
    worksheet[cellRef] = { v: '', t: 's' };
  }
  worksheet[cellRef].s = style;
};

/**
 * Applies a style to a range of cells
 * @param {Object} worksheet - The worksheet
 * @param {string} startCell - Start cell (e.g., 'A1')
 * @param {string} endCell - End cell (e.g., 'E1')
 * @param {Object} style - Style to apply
 */
export const applyStyleRange = (worksheet, startCell, endCell, style) => {
  const startMatch = startCell.match(/([A-Z]+)(\d+)/);
  const endMatch = endCell.match(/([A-Z]+)(\d+)/);

  if (!startMatch || !endMatch) return;

  const startCol = startMatch[1].charCodeAt(0);
  const endCol = endMatch[1].charCodeAt(0);
  const startRow = parseInt(startMatch[2]);
  const endRow = parseInt(endMatch[2]);

  for (let col = startCol; col <= endCol; col++) {
    for (let row = startRow; row <= endRow; row++) {
      const cellRef = String.fromCharCode(col) + row;
      applyStyle(worksheet, cellRef, style);
    }
  }
};

/**
 * Gets the alternating row style
 * @param {number} rowIndex - Row index (0-based)
 * @param {string} baseStyle - Base style name (e.g., 'cell', 'currency')
 * @returns {Object} The appropriate style
 */
export const getRowStyle = (rowIndex, baseStyle = 'cell') => {
  const isEven = rowIndex % 2 === 0;
  const styleName = `${baseStyle}${isEven ? 'Even' : 'Odd'}`;
  return styles[styleName] || styles.cellEven;
};

/**
 * Sets column widths for a worksheet
 * @param {Object} worksheet - The worksheet
 * @param {Array} widths - Array of column widths
 */
export const setColumnWidths = (worksheet, widths) => {
  worksheet['!cols'] = widths.map(w => ({ wch: w }));
};

/**
 * Merges cells in a worksheet
 * @param {Object} worksheet - The worksheet
 * @param {string} range - Range to merge (e.g., 'A1:E1')
 */
export const mergeCells = (worksheet, range) => {
  if (!worksheet['!merges']) {
    worksheet['!merges'] = [];
  }

  const parts = range.split(':');
  const startMatch = parts[0].match(/([A-Z]+)(\d+)/);
  const endMatch = parts[1].match(/([A-Z]+)(\d+)/);

  if (!startMatch || !endMatch) return;

  worksheet['!merges'].push({
    s: { c: startMatch[1].charCodeAt(0) - 65, r: parseInt(startMatch[2]) - 1 },
    e: { c: endMatch[1].charCodeAt(0) - 65, r: parseInt(endMatch[2]) - 1 }
  });
};

export default {
  COLORS,
  styles,
  columnWidths,
  applyStyle,
  applyStyleRange,
  getRowStyle,
  setColumnWidths,
  mergeCells
};
