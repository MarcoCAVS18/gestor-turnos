// src/hooks/useThemeColors.js

import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

/**
 * Hook que proporciona los colores temáticos de la aplicación
 * con valores de fallback consistentes
 * @returns ***REMOVED***object***REMOVED*** Objeto con colores temáticos y utilidades
 */
export const useThemeColors = () => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  
  // Color base principal
  const primary = thematicColors?.base || '#EC4899';
  
  // Derivar colores automáticamente si no están disponibles
  const primaryDark = thematicColors?.dark || darkenColor(primary, 20);
  
  return ***REMOVED***
    // Colores principales
    primary,
    primaryDark,
    
    // Transparencias
    transparent5: thematicColors?.transparent5 || `$***REMOVED***primary***REMOVED***0D`, // 5% opacity
    transparent10: thematicColors?.transparent10 || `$***REMOVED***primary***REMOVED***1A`, // 10% opacity
    transparent20: thematicColors?.transparent20 || `$***REMOVED***primary***REMOVED***33`, // 20% opacity
    transparent30: thematicColors?.transparent30 || `$***REMOVED***primary***REMOVED***4D`, // 30% opacity
    transparent50: thematicColors?.transparent50 || `$***REMOVED***primary***REMOVED***80`, // 50% opacity
    
    // Colores de texto
    textContrast: thematicColors?.textContrast || '#ffffff',
    
    // Utilidades
    getRingColor: () => primary,
    getHoverColor: () => primaryDark,
    getBorderColor: () => thematicColors?.transparent20 || `$***REMOVED***primary***REMOVED***33`,
  ***REMOVED***;
***REMOVED***;

/**
 * Función auxiliar para oscurecer un color hexadecimal
 * @param ***REMOVED***string***REMOVED*** hex - Color hexadecimal (ej: '#EC4899')
 * @param ***REMOVED***number***REMOVED*** percent - Porcentaje de oscurecimiento (0-100)
 * @returns ***REMOVED***string***REMOVED*** Color oscurecido
 */
function darkenColor(hex, percent) ***REMOVED***
  // Remover el # si está presente
  const color = hex.replace('#', '');
  
  // Convertir a RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Aplicar oscurecimiento
  const factor = (100 - percent) / 100;
  const newR = Math.round(r * factor);
  const newG = Math.round(g * factor);
  const newB = Math.round(b * factor);
  
  // Convertir de vuelta a hex
  return `#$***REMOVED***newR.toString(16).padStart(2, '0')***REMOVED***$***REMOVED***newG.toString(16).padStart(2, '0')***REMOVED***$***REMOVED***newB.toString(16).padStart(2, '0')***REMOVED***`;
***REMOVED***