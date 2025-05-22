// src/utils/colorUtils.js

/**
 * Convierte un color hex a valores RGB
 * @param ***REMOVED***string***REMOVED*** hex
 * @returns ***REMOVED***Object***REMOVED***
 */
export const hexToRgb = (hex) => ***REMOVED***
    const result = /^#?([a-f\d]***REMOVED***2***REMOVED***)([a-f\d]***REMOVED***2***REMOVED***)([a-f\d]***REMOVED***2***REMOVED***)$/i.exec(hex);
    return result ? ***REMOVED***
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    ***REMOVED*** : null;
  ***REMOVED***;
  
  /**
   * Convierte valores RGB a hex
   * @param ***REMOVED***number***REMOVED*** r 
   * @param ***REMOVED***number***REMOVED*** g 
   * @param ***REMOVED***number***REMOVED*** b 
   * @returns ***REMOVED***string***REMOVED***
   */
  export const rgbToHex = (r, g, b) => ***REMOVED***
    const toHex = (n) => ***REMOVED***
      const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    ***REMOVED***;
    return `#$***REMOVED***toHex(r)***REMOVED***$***REMOVED***toHex(g)***REMOVED***$***REMOVED***toHex(b)***REMOVED***`;
  ***REMOVED***;
  
  /**
   * Genera variaciones de un color base
   * @param ***REMOVED***string***REMOVED*** baseColor 
   * @returns ***REMOVED***Object***REMOVED***
   */
  export const generateColorVariations = (baseColor) => ***REMOVED***
    const rgb = hexToRgb(baseColor);
    if (!rgb) return null;
  
    const ***REMOVED*** r, g, b ***REMOVED*** = rgb;
  
    return ***REMOVED***
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
      
      // Variaciones con opacidad (para backgrounds)
      transparent10: `rgba($***REMOVED***r***REMOVED***, $***REMOVED***g***REMOVED***, $***REMOVED***b***REMOVED***, 0.1)`,
      transparent20: `rgba($***REMOVED***r***REMOVED***, $***REMOVED***g***REMOVED***, $***REMOVED***b***REMOVED***, 0.2)`,
      transparent50: `rgba($***REMOVED***r***REMOVED***, $***REMOVED***g***REMOVED***, $***REMOVED***b***REMOVED***, 0.5)`,
      
      // Color de texto contrastante
      textContrast: getContrastText(r, g, b),
      
      // Variación hover (un poco más oscura)
      hover: rgbToHex(
        Math.max(0, r - 20),
        Math.max(0, g - 20),
        Math.max(0, b - 20)
      ),
      
      // Variación active (más oscura)
      active: rgbToHex(
        Math.max(0, r - 60),
        Math.max(0, g - 60),
        Math.max(0, b - 60)
      )
    ***REMOVED***;
  ***REMOVED***;
  
  /**
   * Determina si usar texto blanco o negro basado en el color de fondo
   * @param ***REMOVED***number***REMOVED*** r
   * @param ***REMOVED***number***REMOVED*** g
   * @param ***REMOVED***number***REMOVED*** b
   * @returns ***REMOVED***string***REMOVED*** 
   */
  const getContrastText = (r, g, b) => ***REMOVED***
    // Calcular luminosidad usando la fórmula W3C
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  ***REMOVED***;
  
  /**
   * Hook personalizado para usar colores temáticos
   * @param ***REMOVED***string***REMOVED*** colorPrincipal 
   * @returns ***REMOVED***Object***REMOVED***
   */
  export const useThemeColors = (colorPrincipal) => ***REMOVED***
    return generateColorVariations(colorPrincipal);
  ***REMOVED***;