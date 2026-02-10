// src/services/export/utils/LogoLoader.js

/**
 * Logo loader utility with dynamic color support
 * Loads SVG logo and converts to base64 with customizable colors
 */

// Cache for loaded logos
const logoCache = new Map();

/**
 * Fetches the SVG logo and applies a custom fill color
 * @param {string} color - The color to apply to the logo (hex or rgb)
 * @returns {Promise<string>} - Base64 encoded PNG
 */
export const loadLogoWithColor = async (color = '#EC4899') => {
  const cacheKey = `logo-${color}`;

  if (logoCache.has(cacheKey)) {
    return logoCache.get(cacheKey);
  }

  try {
    // Fetch the SVG
    const response = await fetch('/assets/SVG/logo.svg');
    if (!response.ok) {
      throw new Error('Failed to load logo SVG');
    }

    let svgText = await response.text();

    // Apply color to all paths
    svgText = svgText.replace(/<path/g, `<path fill="${color}"`);

    // Convert SVG to base64 PNG
    const base64 = await svgToBase64PNG(svgText, color);

    logoCache.set(cacheKey, base64);
    return base64;
  } catch (error) {
    console.warn('Could not load logo:', error);
    return null;
  }
};

/**
 * Converts SVG text to base64 PNG
 * @param {string} svgText - The SVG content
 * @param {string} color - Fill color for the logo
 * @returns {Promise<string>} - Base64 encoded PNG
 */
const svgToBase64PNG = (svgText) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Set canvas size for high quality
    const size = 200;
    canvas.width = size;
    canvas.height = size;

    const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Draw the image centered and scaled
      const scale = Math.min(size / img.width, size / img.height) * 0.9;
      const x = (size - img.width * scale) / 2;
      const y = (size - img.height * scale) / 2;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    img.src = url;
  });
};

/**
 * Loads logo optimized for PDF (larger size)
 * @param {string} color - The color to apply
 * @returns {Promise<{base64: string, width: number, height: number}>}
 */
export const loadLogoForPDF = async (color = '#EC4899') => {
  const cacheKey = `logo-pdf-${color}`;

  if (logoCache.has(cacheKey)) {
    return logoCache.get(cacheKey);
  }

  try {
    const response = await fetch('/assets/SVG/logo.svg');
    if (!response.ok) throw new Error('Failed to load logo');

    let svgText = await response.text();
    svgText = svgText.replace(/<path/g, `<path fill="${color}"`);

    const result = await svgToBase64PNGWithSize(svgText, 300);
    logoCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('Could not load logo for PDF:', error);
    return null;
  }
};

/**
 * Loads logo optimized for Excel headers (smaller size)
 * @param {string} color - The color to apply
 * @returns {Promise<{base64: string, width: number, height: number}>}
 */
export const loadLogoForExcel = async (color = '#4472C4') => {
  const cacheKey = `logo-excel-${color}`;

  if (logoCache.has(cacheKey)) {
    return logoCache.get(cacheKey);
  }

  try {
    const response = await fetch('/assets/SVG/logo.svg');
    if (!response.ok) throw new Error('Failed to load logo');

    let svgText = await response.text();
    svgText = svgText.replace(/<path/g, `<path fill="${color}"`);

    const result = await svgToBase64PNGWithSize(svgText, 100);
    logoCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('Could not load logo for Excel:', error);
    return null;
  }
};

/**
 * Converts SVG to base64 PNG with specific size
 * @param {string} svgText - The SVG content
 * @param {number} size - Target size in pixels
 * @returns {Promise<{base64: string, width: number, height: number}>}
 */
const svgToBase64PNGWithSize = (svgText, size) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = size;
    canvas.height = size;

    const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.clearRect(0, 0, size, size);

      const scale = Math.min(size / img.width, size / img.height) * 0.9;
      const x = (size - img.width * scale) / 2;
      const y = (size - img.height * scale) / 2;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      URL.revokeObjectURL(url);
      resolve({
        base64: canvas.toDataURL('image/png'),
        width: size,
        height: size
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    img.src = url;
  });
};

/**
 * Preloads logos for both PDF and Excel with common colors
 * Call this early to have logos ready when needed
 */
export const preloadLogos = async () => {
  const colors = {
    pdf: '#EC4899',      // Pink for PDF
    excel: '#4472C4',    // Blue for Excel
    dark: '#1F2937',     // Dark for light backgrounds
    light: '#FFFFFF'     // White for dark backgrounds
  };

  await Promise.all([
    loadLogoForPDF(colors.pdf),
    loadLogoForExcel(colors.excel),
    loadLogoForPDF(colors.dark),
    loadLogoForExcel(colors.light)
  ]);
};

/**
 * Clears the logo cache
 */
export const clearLogoCache = () => {
  logoCache.clear();
};

const LogoLoaderModule = {
  loadLogoWithColor,
  loadLogoForPDF,
  loadLogoForExcel,
  preloadLogos,
  clearLogoCache
};

export default LogoLoaderModule;
