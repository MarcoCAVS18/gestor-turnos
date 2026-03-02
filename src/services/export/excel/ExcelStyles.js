// src/services/export/excel/ExcelStyles.js

/**
 * Professional Excel styles for export
 * Uses xlsx-js-style format for styling
 */

// Color definitions
export const COLORS = {
  // Brand / primary palette
  primary: 'EC4899',       // Pink (accent only)
  primaryDark: 'DB2777',

  // Professional navy palette (used for all headers)
  navy: '1F4E79',          // Dark navy — main section headers
  navyMid: '2E75B6',       // Mid navy — table headers
  navyLight: 'BDD7EE',     // Light navy — subtle highlights

  // Secondary (kept for compatibility)
  secondary: '2E75B6',     // Same as navyMid
  secondaryDark: '1F4E79',

  // Accent (delivery only)
  accent: '10B981',
  warning: 'D97706',
  error: 'DC2626',

  // Neutral colors
  white: 'FFFFFF',
  black: '000000',
  darkGray: '111827',
  gray: '6B7280',
  lightGray: '9CA3AF',
  veryLightGray: 'F3F4F6',
  backgroundGray: 'F8FAFC',
  borderGray: 'E5E7EB'
};

// Border definitions
const borders = {
  thin: {
    top: { style: 'thin', color: { rgb: 'E5E7EB' } },
    bottom: { style: 'thin', color: { rgb: 'E5E7EB' } },
    left: { style: 'thin', color: { rgb: 'E5E7EB' } },
    right: { style: 'thin', color: { rgb: 'E5E7EB' } }
  },
  medium: {
    top: { style: 'medium', color: { rgb: '9CA3AF' } },
    bottom: { style: 'medium', color: { rgb: '9CA3AF' } },
    left: { style: 'medium', color: { rgb: '9CA3AF' } },
    right: { style: 'medium', color: { rgb: '9CA3AF' } }
  },
  bottom: {
    bottom: { style: 'thin', color: { rgb: 'E5E7EB' } }
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
    sz: 12,
    color: { rgb: COLORS.gray }
  },
  sectionHeader: {
    name: 'Calibri',
    sz: 11,
    bold: true,
    color: { rgb: COLORS.white }
  },
  tableHeader: {
    name: 'Calibri',
    sz: 10,
    bold: true,
    color: { rgb: COLORS.white }
  },
  label: {
    name: 'Calibri',
    sz: 10,
    bold: true,
    color: { rgb: COLORS.gray }
  },
  value: {
    name: 'Calibri',
    sz: 10,
    color: { rgb: COLORS.darkGray }
  },
  valueBold: {
    name: 'Calibri',
    sz: 10,
    bold: true,
    color: { rgb: COLORS.darkGray }
  },
  small: {
    name: 'Calibri',
    sz: 9,
    color: { rgb: COLORS.gray }
  },
  kpiValue: {
    name: 'Calibri',
    sz: 15,
    bold: true,
    color: { rgb: COLORS.navy }     // Navy instead of pink
  },
  positive: {
    name: 'Calibri',
    sz: 10,
    bold: true,
    color: { rgb: COLORS.accent }
  },
  negative: {
    name: 'Calibri',
    sz: 10,
    bold: true,
    color: { rgb: COLORS.error }
  }
};

// Style definitions
export const styles = {
  // Title and headers
  title: {
    font: { ...fonts.title },
    alignment: { horizontal: 'left', vertical: 'center' }
  },

  subtitle: {
    font: { ...fonts.subtitle },
    alignment: { horizontal: 'left', vertical: 'center' }
  },

  // Section headers — unified dark navy
  sectionHeader: {
    font: fonts.sectionHeader,
    fill: { fgColor: { rgb: COLORS.navy } },
    alignment: { horizontal: 'left', vertical: 'center', indent: 1 },
    border: borders.thin
  },

  sectionHeaderBlue: {
    font: fonts.sectionHeader,
    fill: { fgColor: { rgb: COLORS.navy } },
    alignment: { horizontal: 'left', vertical: 'center', indent: 1 },
    border: borders.thin
  },

  sectionHeaderGreen: {
    font: fonts.sectionHeader,
    fill: { fgColor: { rgb: COLORS.navyMid } },
    alignment: { horizontal: 'left', vertical: 'center', indent: 1 },
    border: borders.thin
  },

  // Table headers — mid navy
  tableHeader: {
    font: fonts.tableHeader,
    fill: { fgColor: { rgb: COLORS.navyMid } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: borders.thin
  },

  tableHeaderPink: {
    font: fonts.tableHeader,
    fill: { fgColor: { rgb: COLORS.navyMid } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: borders.thin
  },

  tableHeaderGreen: {
    font: fonts.tableHeader,
    fill: { fgColor: { rgb: COLORS.navyMid } },
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
    fill: { fgColor: { rgb: COLORS.backgroundGray } },
    border: borders.thin
  },

  // Table cells - even row (white)
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

  // Table cells - odd row (very light gray)
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

  // Currency cells ($#,##0.00 — 2 decimal places)
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

  // Hours cells (#,##0.0 — 1 decimal place)
  hoursEven: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.white } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin,
    numFmt: '#,##0.0'
  },

  hoursOdd: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.backgroundGray } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin,
    numFmt: '#,##0.0'
  },

  // Generic number cells (#,##0.00)
  numberEven: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.white } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin,
    numFmt: '#,##0.0'
  },

  numberOdd: {
    font: fonts.value,
    fill: { fgColor: { rgb: COLORS.backgroundGray } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: borders.thin,
    numFmt: '#,##0.0'
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

  // Percentage cells (0.0%)
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

  // Empty / filler cell
  empty: {
    border: borders.thin
  },

  // Small text
  small: {
    font: fonts.small,
    alignment: { horizontal: 'left', vertical: 'center' }
  },

  // Brand header cell (for the top branding row)
  brandHeader: {
    font: { name: 'Calibri', sz: 14, bold: true, color: { rgb: COLORS.white } },
    fill: { fgColor: { rgb: COLORS.navy } },
    alignment: { horizontal: 'left', vertical: 'center', indent: 1 }
  },

  brandSubtitle: {
    font: { name: 'Calibri', sz: 10, color: { rgb: 'BDD7EE' } },
    fill: { fgColor: { rgb: COLORS.navy } },
    alignment: { horizontal: 'left', vertical: 'center', indent: 1 }
  },

  brandRight: {
    font: { name: 'Calibri', sz: 9, color: { rgb: 'BDD7EE' } },
    fill: { fgColor: { rgb: COLORS.navy } },
    alignment: { horizontal: 'right', vertical: 'center', indent: 1 }
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
 */
export const applyStyle = (worksheet, cellRef, style) => {
  if (!worksheet[cellRef]) {
    worksheet[cellRef] = { v: '', t: 's' };
  }
  worksheet[cellRef].s = style;
};

/**
 * Applies a style to a range of cells
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
 */
export const getRowStyle = (rowIndex, baseStyle = 'cell') => {
  const isEven = rowIndex % 2 === 0;
  const styleName = `${baseStyle}${isEven ? 'Even' : 'Odd'}`;
  return styles[styleName] || styles.cellEven;
};

/**
 * Sets column widths for a worksheet
 */
export const setColumnWidths = (worksheet, widths) => {
  worksheet['!cols'] = widths.map(w => ({ wch: w }));
};

/**
 * Merges cells in a worksheet
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

const ExcelStylesModule = {
  COLORS,
  styles,
  columnWidths,
  applyStyle,
  applyStyleRange,
  getRowStyle,
  setColumnWidths,
  mergeCells
};

export default ExcelStylesModule;
