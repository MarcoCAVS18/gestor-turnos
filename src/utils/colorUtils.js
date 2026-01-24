// src/utils/colorUtils.js

/**
 * Convierte un color hex a valores RGB
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
   * Convierte valores RGB a hex
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
   * Genera variaciones de un color base
   * @param {string} baseColor 
   * @returns {Object}
   */
  export const generateColorVariations = (baseColor) => {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return null;
  
    const { r, g, b } = rgb;
  
    return {
      base: baseColor,
      
      // Variaciones más claras
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
      
      // Variaciones más oscuras
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
      
      // Variaciones con opacidad
      transparent10: `rgba(${r}, ${g}, ${b}, 0.1)`,
      transparent20: `rgba(${r}, ${g}, ${b}, 0.2)`,
      transparent50: `rgba(${r}, ${g}, ${b}, 0.5)`,
      
      // Color de texto contrastante
      textContrast: getContrastText(r, g, b),
      
      // Variación hover
      hover: rgbToHex(
        Math.max(0, r - 20),
        Math.max(0, g - 20),
        Math.max(0, b - 20)
      ),
      
      // Variación active
      active: rgbToHex(
        Math.max(0, r - 60),
        Math.max(0, g - 60),
        Math.max(0, b - 60)
      )
    };
  };
  
  /**
   * Determina si usar texto blanco o negro basado en el color de fondo
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
   * Hook personalizado para usar colores temáticos
   * @param {string} colorPrincipal 
   * @returns {Object}
   */
  export const useThemeColors = (colorPrincipal) => {
    return generateColorVariations(colorPrincipal);
  };