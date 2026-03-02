// src/services/export/pdf/PDFStyles.js

/**
 * Professional PDF styles and layout configuration
 */

// Color palette — limited to 2-3 accent colors for a polished look
export const COLORS = {
  // Primary brand color (dark navy — professional and readable)
  primary: '#1F4E79',
  primaryMid: '#2E75B6',
  primaryLight: '#BDD7EE',

  // Accent (used sparingly for highlights)
  accent: '#EC4899',

  // Secondary (muted blue for alternates)
  secondary: '#2E75B6',
  secondaryDark: '#1F4E79',

  // Neutral colors
  black: '#000000',
  darkGray: '#111827',
  gray: '#6B7280',
  lightGray: '#9CA3AF',
  veryLightGray: '#F3F4F6',
  white: '#FFFFFF',

  // Status colors
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626'
};

// Font configuration
export const FONTS = {
  title: { size: 26, style: 'bold' },
  heading1: { size: 18, style: 'bold' },
  heading2: { size: 13, style: 'bold' },
  heading3: { size: 11, style: 'bold' },
  body: { size: 9, style: 'normal' },
  bodyBold: { size: 9, style: 'bold' },
  small: { size: 8, style: 'normal' },
  smallBold: { size: 8, style: 'bold' },
  kpi: { size: 18, style: 'bold' },
  kpiLabel: { size: 8, style: 'normal' }
};

// Layout configuration
export const LAYOUT = {
  pageWidth: 210,   // A4 width mm
  pageHeight: 297,  // A4 height mm
  margin: {
    top: 22,
    right: 18,
    bottom: 22,
    left: 18
  },
  contentWidth: 174, // 210 - 18 - 18

  // Spacing
  lineHeight: 5,
  sectionSpacing: 10,
  paragraphSpacing: 4,

  // Table
  table: {
    headerHeight: 8,
    rowHeight: 6,
    cellPadding: 2,
    borderWidth: 0.3
  },

  // KPI card
  kpiCard: {
    width: 40,
    height: 26,
    borderWidth: 0,   // No border — use fill instead
    spacing: 4
  }
};

/**
 * Sets up the PDF document with default styling
 */
export const setupDocument = (doc) => {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONTS.body.size);
  doc.setTextColor(COLORS.darkGray);
  doc.setLineWidth(0.3);
};

/**
 * Adds a page header with logo, app name and page title
 * Returns the Y position after the header
 */
export const addPageHeader = (doc, logo, title, y = LAYOUT.margin.top) => {
  const x = LAYOUT.margin.left;
  const logoSize = 12;

  // Draw a thin rule above the header
  doc.setDrawColor(COLORS.primaryLight.replace('#', ''));
  doc.setLineWidth(0.3);

  if (logo && logo.base64) {
    doc.addImage(logo.base64, 'PNG', x, y, logoSize, logoSize);

    // App name "Orary" next to logo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(FONTS.heading3.size);
    doc.setTextColor(COLORS.primary);
    doc.text('Orary', x + logoSize + 4, y + 5);

    // Separator dot
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(FONTS.body.size);
    doc.setTextColor(COLORS.lightGray);
    const appNameWidth = doc.getTextWidth('Orary');
    doc.text('·', x + logoSize + 4 + appNameWidth + 3, y + 5);

    // Page title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(FONTS.heading3.size);
    doc.setTextColor(COLORS.darkGray);
    const sepWidth = doc.getTextWidth('·');
    doc.text(title, x + logoSize + 4 + appNameWidth + 3 + sepWidth + 3, y + 5);

    // Horizontal rule below header
    const headerBottom = y + logoSize + 3;
    doc.setDrawColor('#E5E7EB');
    doc.setLineWidth(0.3);
    doc.line(x, headerBottom, x + LAYOUT.contentWidth, headerBottom);

    doc.setTextColor(COLORS.darkGray);
    return headerBottom + 5;
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(FONTS.heading2.size);
    doc.setTextColor(COLORS.primary);
    doc.text(`Orary · ${title}`, x, y + 5);

    const headerBottom = y + 10;
    doc.setDrawColor('#E5E7EB');
    doc.setLineWidth(0.3);
    doc.line(x, headerBottom, x + LAYOUT.contentWidth, headerBottom);

    doc.setTextColor(COLORS.darkGray);
    return headerBottom + 5;
  }
};

/**
 * Adds a section header band
 */
export const addSectionHeader = (doc, text, y, color = COLORS.primary) => {
  const x = LAYOUT.margin.left;
  const width = LAYOUT.contentWidth;
  const height = 7;

  // Convert hex to RGB for jsPDF
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 31, g: 78, b: 121 };
  };

  const rgb = hexToRgb(color);
  doc.setFillColor(rgb.r, rgb.g, rgb.b);
  doc.rect(x, y, width, height, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONTS.heading3.size);
  doc.setTextColor(COLORS.white);
  doc.text(text, x + 3, y + 5);

  doc.setTextColor(COLORS.darkGray);

  return y + height + 3;
};

/**
 * Draws a KPI card with filled background
 */
export const drawKPICard = (doc, x, y, label, value, color = COLORS.primary) => {
  const { width, height } = LAYOUT.kpiCard;

  // Subtle light fill
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 31, g: 78, b: 121 };
  };

  const rgb = hexToRgb(color);

  // Light background
  doc.setFillColor(246, 249, 252);
  doc.roundedRect(x, y, width, height, 2, 2, 'F');

  // Left accent bar
  doc.setFillColor(rgb.r, rgb.g, rgb.b);
  doc.rect(x, y, 2, height, 'F');

  // Value
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONTS.kpi.size);
  doc.setTextColor(rgb.r, rgb.g, rgb.b);
  const valueWidth = doc.getTextWidth(value);
  const valueX = x + 2 + (width - 2 - valueWidth) / 2;
  doc.text(value, valueX, y + height / 2 + 1);

  // Label
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONTS.kpiLabel.size);
  doc.setTextColor(COLORS.gray);
  const labelWidth = doc.getTextWidth(label);
  doc.text(label, x + 2 + (width - 2 - labelWidth) / 2, y + height - 3);

  doc.setTextColor(COLORS.darkGray);
  doc.setLineWidth(0.3);
};

/**
 * Draws a comparison widget
 */
export const drawComparisonWidget = (doc, x, y, data, color = COLORS.primary) => {
  const width = 47;
  const height = 24;
  const { label, current, previous, format = 'currency' } = data;

  const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  const isPositive = change >= 0;

  const formatValue = (v) => format === 'currency'
    ? `$${(Math.round(v * 100) / 100).toFixed(2)}`
    : `${(Math.round(v * 10) / 10).toFixed(1)}h`;

  // Background
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(x, y, width, height, 1.5, 1.5, 'F');

  // Label
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONTS.small.size);
  doc.setTextColor(COLORS.lightGray);
  doc.text(label.toUpperCase(), x + 3, y + 5);

  // Current value
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(COLORS.primary);
  doc.text(formatValue(current), x + 3, y + 13);

  // Change
  const changeText = `${isPositive ? '+' : ''}${(Math.round(change * 10) / 10).toFixed(1)}%`;
  doc.setFontSize(FONTS.body.size);
  doc.setTextColor(isPositive ? COLORS.success : COLORS.error);
  doc.text(changeText, x + 3, y + 19);

  // "vs prev" label
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONTS.small.size);
  doc.setTextColor(COLORS.lightGray);
  const changeWidth = doc.getTextWidth(changeText);
  doc.text('vs prev', x + 3 + changeWidth + 2, y + 19);

  doc.setTextColor(COLORS.darkGray);
};

/**
 * Draws a professional table with alternating rows and borders
 */
export const drawTable = (doc, x, y, headers, data, columnWidths, options = {}) => {
  const {
    headerColor = COLORS.primary,
    alternateRows = true,
    fontSize = FONTS.body.size
  } = options;

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 31, g: 78, b: 121 };
  };

  const totalWidth = columnWidths.reduce((a, b) => a + b, 0);
  let currentY = y;

  // Header row
  const hRgb = hexToRgb(headerColor);
  doc.setFillColor(hRgb.r, hRgb.g, hRgb.b);
  doc.rect(x, currentY, totalWidth, LAYOUT.table.headerHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fontSize);
  doc.setTextColor(COLORS.white);

  let currentX = x;
  headers.forEach((header, i) => {
    const textWidth = doc.getTextWidth(header);
    const centerX = currentX + (columnWidths[i] - textWidth) / 2;
    doc.text(header, centerX, currentY + 5.5);
    currentX += columnWidths[i];
  });

  currentY += LAYOUT.table.headerHeight;

  // Data rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize);
  doc.setTextColor(COLORS.darkGray);

  data.forEach((row, rowIndex) => {
    // Alternate fill
    if (alternateRows && rowIndex % 2 === 1) {
      doc.setFillColor(246, 249, 252);
      doc.rect(x, currentY, totalWidth, LAYOUT.table.rowHeight, 'F');
    }

    // Bottom border
    doc.setDrawColor('#E5E7EB');
    doc.setLineWidth(0.2);
    doc.line(x, currentY + LAYOUT.table.rowHeight, x + totalWidth, currentY + LAYOUT.table.rowHeight);

    // Cells
    currentX = x;
    row.forEach((cell, cellIndex) => {
      const cellText = String(cell);
      const textWidth = doc.getTextWidth(cellText);
      const centerX = currentX + (columnWidths[cellIndex] - textWidth) / 2;
      doc.text(cellText, centerX, currentY + 4.2);
      currentX += columnWidths[cellIndex];
    });

    currentY += LAYOUT.table.rowHeight;

    // New page check
    if (currentY > LAYOUT.pageHeight - LAYOUT.margin.bottom - 12) {
      doc.addPage();
      currentY = LAYOUT.margin.top;
    }
  });

  return currentY + 4;
};

/**
 * Adds a professional footer with app name, page number and date
 */
export const addPageFooter = (doc, pageNum, generatedDate) => {
  const y = LAYOUT.pageHeight - LAYOUT.margin.bottom + 6;
  const x = LAYOUT.margin.left;
  const rightX = LAYOUT.margin.left + LAYOUT.contentWidth;

  // Thin top rule
  doc.setDrawColor('#E5E7EB');
  doc.setLineWidth(0.3);
  doc.line(x, y - 3, rightX, y - 3);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONTS.small.size);
  doc.setTextColor(COLORS.lightGray);

  // Left: app name
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.gray);
  doc.text('Orary', x, y);

  // Separator
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLORS.lightGray);
  const oryWidth = doc.getTextWidth('Orary');
  doc.text(' · orary.app', x + oryWidth, y);

  // Center: page number
  const pageText = `Page ${pageNum}`;
  const pageWidth = doc.getTextWidth(pageText);
  const centerX = x + LAYOUT.contentWidth / 2 - pageWidth / 2;
  doc.text(pageText, centerX, y);

  // Right: generation date
  if (generatedDate) {
    const dateText = `Generated ${generatedDate}`;
    const dateWidth = doc.getTextWidth(dateText);
    doc.text(dateText, rightX - dateWidth, y);
  }

  doc.setTextColor(COLORS.darkGray);
};

/**
 * Checks if there is enough space on the current page
 */
export const hasSpaceOnPage = (doc, currentY, requiredSpace) => {
  return (currentY + requiredSpace) < (LAYOUT.pageHeight - LAYOUT.margin.bottom - 10);
};

/**
 * Adds a new page if needed, returns new Y position
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
