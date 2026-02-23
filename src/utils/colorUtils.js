// src/utils/colorUtils.js

/**
 * Converts a hex color to RGB values
 * @param {string} hex
 * @returns {Object}
 */
export const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  /**
   * Converts RGB values to hex
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @returns {string}
   */
  export const rgbToHex = (r, g, b) => {
    const toHex = (n) => {
      const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  
  /**
   * Generates variations of a base color
   * @param {string} baseColor
   * @returns {Object}
   */
  export const generateColorVariations = (baseColor) => {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return null;
  
    const { r, g, b } = rgb;
  
    return {
      base: baseColor,
      
      // Lighter variations
      light: rgbToHex(
        Math.min(255, r + 30),
        Math.min(255, g + 30),
        Math.min(255, b + 30)
      ),
      
      lighter: rgbToHex(
        Math.min(255, r + 60),
        Math.min(255, g + 60),
        Math.min(255, b + 60)
      ),
      
      // Darker variations
      dark: rgbToHex(
        Math.max(0, r - 40),
        Math.max(0, g - 40),
        Math.max(0, b - 40)
      ),
      
      darker: rgbToHex(
        Math.max(0, r - 80),
        Math.max(0, g - 80),
        Math.max(0, b - 80)
      ),
      
      // Opacity variations
      transparent5: `rgba(${r}, ${g}, ${b}, 0.05)`,
      transparent10: `rgba(${r}, ${g}, ${b}, 0.1)`,
      transparent20: `rgba(${r}, ${g}, ${b}, 0.2)`,
      transparent30: `rgba(${r}, ${g}, ${b}, 0.3)`,
      transparent50: `rgba(${r}, ${g}, ${b}, 0.5)`,

      // Contrasting text color
      textContrast: getContrastText(r, g, b),

      // Hover variation
      hover: rgbToHex(
        Math.max(0, r - 20),
        Math.max(0, g - 20),
        Math.max(0, b - 20)
      ),

      // Active variation
      active: rgbToHex(
        Math.max(0, r - 60),
        Math.max(0, g - 60),
        Math.max(0, b - 60)
      ),

      // Surface colors for better contrast in Dark Mode
      surface: 'rgba(255, 255, 255, 0.05)',      // Light overlay on dark backgrounds
      surface2: 'rgba(255, 255, 255, 0.08)',     // Slightly more prominent
      surface3: 'rgba(255, 255, 255, 0.12)',     // Even more prominent
      surfaceHover: 'rgba(255, 255, 255, 0.15)', // For hover states
    };
  };
  
  /**
   * Determines whether to use white or black text based on background luminance
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @returns {string}
   */
  const getContrastText = (r, g, b) => {
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };
  
  /**
   * Custom hook for theme color variations
   * @param {string} primaryColor
   * @returns {Object}
   */
  export const useThemeColors = (colorPrincipal) => {
    return generateColorVariations(colorPrincipal);
  };