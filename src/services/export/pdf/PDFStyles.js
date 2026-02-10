// src/services/export/pdf/PDFStyles.js

/**
 * Professional PDF styles and layout configuration
 */

// Color palette
export const COLORS = {
  // Brand colors
  primary: '#EC4899',
  primaryDark: '#DB2777',
  secondary: '#3B82F6',
  secondaryDark: '#2563EB',
  accent: '#10B981',

  // Neutral colors
  black: '#000000',
  darkGray: '#1F2937',
  gray: '#6B7280',
  lightGray: '#9CA3AF',
  veryLightGray: '#F3F4F6',
  white: '#FFFFFF',

  // Shift type colors
  day: '#FBBF24',
  afternoon: '#F97316',
  night: '#6366F1',
  saturday: '#10B981',
  sunday: '#EC4899',
  delivery: '#8B5CF6',

  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
};

// Font configuration
export const FONTS = {
  title: { size: 24, style: 'bold' },
  heading1: { size: 18, style: 'bold' },
  heading2: { size: 14, style: 'bold' },
  heading3: { size: 12, style: 'bold' },
  body: { size: 10, style: 'normal' },
  bodyBold: { size: 10, style: 'bold' },
  small: { size: 8, style: 'normal' },
  smallBold: { size: 8, style: 'bold' },
  kpi: { size: 20, style: 'bold' },
  kpiLabel: { size: 9, style: 'normal' }
};

// Layout configuration
export const LAYOUT = {
  pageWidth: 210,  // A4 width in mm
  pageHeight: 297, // A4 height in mm
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  },
  contentWidth: 170, // pageWidth - left margin - right margin

  // Spacing
  lineHeight: 5,
  sectionSpacing: 10,
  paragraphSpacing: 5,

  // Table configuration
  table: {
    headerHeight: 8,
    rowHeight: 6,
    cellPadding: 2,
    borderWidth: 0.5
  },

  // KPI card configuration
  kpiCard: {
    width: 40,
    height: 25,
    borderWidth: 2,
    spacing: 5
  }
};

/**
 * Sets up the PDF document with default styling
 * @param {jsPDF} doc - jsPDF document instance
 */
export const setupDocument = (doc) => {
  // Set default font
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONTS.body.size);
  doc.setTextColor(COLORS.darkGray);

  // Set line width for borders
  doc.setLineWidth(0.5);
};

/**
 * Adds a page header with logo and title
 * @param {jsPDF} doc - jsPDF document instance
 * @param {Object} logo - Logo data with base64 and dimensions
 * @param {string} title - Page title
 * @param {number} y - Y position
 * @returns {number} New Y position after header
 */
export const addPageHeader = (doc, logo, title, y = LAYOUT.margin.top) => {
  const x = LAYOUT.margin.left;

  // Add logo if available
  if (logo && logo.base64) {
    const logoSize = 15;
    doc.addImage(logo.base64, 'PNG', x, y, logoSize, logoSize);

    // Add title next to logo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(FONTS.heading2.size);
    doc.setTextColor(COLORS.darkGray);
    doc.text(title, x + logoSize + 5, y + 7);

    return y + logoSize + 5;
  } else {
    // Add title without logo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(FONTS.heading2.size);
    doc.setTextColor(COLORS.darkGray);
    doc.text(title, x, y);

    return y + FONTS.heading2.size / 2 + 5;
  }
};

/**
 * Adds a section header
 * @param {jsPDF} doc - jsPDF document instance
 * @param {string} text - Section title
 * @param {number} y - Y position
 * @param {string} color - Background color
 * @returns {number} New Y position
 */
export const addSectionHeader = (doc, text, y, color = COLORS.primary) => {
  const x = LAYOUT.margin.left;
  const width = LAYOUT.contentWidth;
  const height = 8;

  // Draw background
  doc.setFillColor(color);
  doc.rect(x, y, width, height, 'F');

  // Draw text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONTS.heading3.size);
  doc.setTextColor(COLORS.white);
  doc.text(text, x + 2, y + 5.5);

  // Reset text color
  doc.setTextColor(COLORS.darkGray);

  return y + height + 3;
};

/**
 * Draws a KPI card
 * @param {jsPDF} doc - jsPDF document instance
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {string} label - KPI label
 * @param {string} value - KPI value
 * @param {string} color - Border color
 */
export const drawKPICard = (doc, x, y, label, value, color = COLORS.primary) => {
  const { width, height, borderWidth } = LAYOUT.kpiCard;

  // Draw border
  doc.setDrawColor(color);
  doc.setLineWidth(borderWidth);
  doc.rect(x, y, width, height);

  // Draw value
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONTS.kpi.size);
  doc.setTextColor(color);
  const valueWidth = doc.getTextWidth(value);
  doc.text(value, x + (width - valueWidth) / 2, y + height / 2 + 2);

  // Draw label
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONTS.kpiLabel.size);
  doc.setTextColor(COLORS.gray);
  const labelWidth = doc.getTextWidth(label);
  doc.text(label, x + (width - labelWidth) / 2, y + height - 4);

  // Reset
  doc.setTextColor(COLORS.darkGray);
  doc.setLineWidth(0.5);
};

/**
 * Draws a comparison widget
 * @param {jsPDF} doc - jsPDF document instance
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {Object} data - { label, current, previous, format }
 * @param {string} color - Primary color
 */
export const drawComparisonWidget = (doc, x, y, data, color = COLORS.primary) => {
  const width = 45;
  const height = 25;
  const { label, current, previous, format = 'currency' } = data;

  // Calculate change
  const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  const isPositive = change >= 0;

  // Format values
  const formatValue = (v) => format === 'currency' ? `$${v.toFixed(2)}` : `${v.toFixed(1)}h`;

  // Draw border
  doc.setDrawColor(COLORS.lightGray);
  doc.setLineWidth(0.5);
  doc.rect(x, y, width, height);

  // Draw label
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONTS.small.size);
  doc.setTextColor(COLORS.gray);
  doc.text(label, x + 2, y + 4);

  // Draw current value
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(color);
  doc.text(formatValue(current), x + 2, y + 12);

  // Draw change
  const changeText = `${isPositive ? '+' : ''}${change.toFixed(1)}%`;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONTS.body.size);
  doc.setTextColor(isPositive ? COLORS.success : COLORS.error);
  doc.text(changeText, x + 2, y + 19);

  // Draw "vs prev" label
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONTS.small.size);
  doc.setTextColor(COLORS.lightGray);
  const changeWidth = doc.getTextWidth(changeText);
  doc.text('vs prev', x + 2 + changeWidth + 2, y + 19);

  // Reset
  doc.setTextColor(COLORS.darkGray);
};

/**
 * Draws a simple table
 * @param {jsPDF} doc - jsPDF document instance
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {Array} headers - Column headers
 * @param {Array} data - Table data (array of arrays)
 * @param {Array} columnWidths - Width for each column
 * @param {Object} options - Table options
 * @returns {number} New Y position after table
 */
export const drawTable = (doc, x, y, headers, data, columnWidths, options = {}) => {
  const {
    headerColor = COLORS.secondary,
    alternateRows = true,
    fontSize = FONTS.body.size
  } = options;

  let currentY = y;

  // Draw header
  doc.setFillColor(headerColor);
  doc.rect(x, currentY, columnWidths.reduce((a, b) => a + b, 0), LAYOUT.table.headerHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fontSize);
  doc.setTextColor(COLORS.white);

  let currentX = x;
  headers.forEach((header, i) => {
    const textWidth = doc.getTextWidth(header);
    const centerX = currentX + (columnWidths[i] - textWidth) / 2;
    doc.text(header, centerX, currentY + 5);
    currentX += columnWidths[i];
  });

  currentY += LAYOUT.table.headerHeight;

  // Draw rows
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLORS.darkGray);

  data.forEach((row, rowIndex) => {
    // Alternate row background
    if (alternateRows && rowIndex % 2 === 1) {
      doc.setFillColor(COLORS.veryLightGray);
      doc.rect(x, currentY, columnWidths.reduce((a, b) => a + b, 0), LAYOUT.table.rowHeight, 'F');
    }

    // Draw cells
    currentX = x;
    row.forEach((cell, cellIndex) => {
      const cellText = String(cell);
      const textWidth = doc.getTextWidth(cellText);
      const centerX = currentX + (columnWidths[cellIndex] - textWidth) / 2;
      doc.text(cellText, centerX, currentY + 4);
      currentX += columnWidths[cellIndex];
    });

    currentY += LAYOUT.table.rowHeight;

    // Check if we need a new page
    if (currentY > LAYOUT.pageHeight - LAYOUT.margin.bottom - 10) {
      doc.addPage();
      currentY = LAYOUT.margin.top;
    }
  });

  return currentY + 3;
};

/**
 * Adds a page footer with page number
 * @param {jsPDF} doc - jsPDF document instance
 * @param {number} pageNum - Current page number
 */
export const addPageFooter = (doc, pageNum) => {
  const y = LAYOUT.pageHeight - LAYOUT.margin.bottom + 5;
  const x = LAYOUT.pageWidth / 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONTS.small.size);
  doc.setTextColor(COLORS.gray);

  const text = `Page ${pageNum}`;
  const textWidth = doc.getTextWidth(text);
  doc.text(text, x - textWidth / 2, y);

  // Reset
  doc.setTextColor(COLORS.darkGray);
};

/**
 * Checks if there's enough space on current page
 * @param {jsPDF} doc - jsPDF document instance
 * @param {number} currentY - Current Y position
 * @param {number} requiredSpace - Required space in mm
 * @returns {boolean} True if enough space
 */
export const hasSpaceOnPage = (doc, currentY, requiredSpace) => {
  return (currentY + requiredSpace) < (LAYOUT.pageHeight - LAYOUT.margin.bottom);
};

/**
 * Adds a new page if needed
 * @param {jsPDF} doc - jsPDF document instance
 * @param {number} currentY - Current Y position
 * @param {number} requiredSpace - Required space in mm
 * @returns {number} New Y position (either same or top of new page)
 */
export const addPageIfNeeded = (doc, currentY, requiredSpace) => {
  if (!hasSpaceOnPage(doc, currentY, requiredSpace)) {
    doc.addPage();
    return LAYOUT.margin.top;
  }
  return currentY;
};

const PDFStylesModule = {
  COLORS,
  FONTS,
  LAYOUT,
  setupDocument,
  addPageHeader,
  addSectionHeader,
  drawKPICard,
  drawComparisonWidget,
  drawTable,
  addPageFooter,
  hasSpaceOnPage,
  addPageIfNeeded
};

export default PDFStylesModule;
