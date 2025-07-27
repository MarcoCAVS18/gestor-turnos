// src/hooks/useThemeColors.js

import { useApp } from '../contexts/AppContext';

/**
 * Hook que proporciona los colores temáticos de la aplicación
 * con valores de fallback consistentes
 * @returns {object} Objeto con colores temáticos y utilidades
 */
export const useThemeColors = () => {
  const { thematicColors } = useApp();
  
  // Color base principal
  const primary = thematicColors?.base || '#EC4899';
  
  // Derivar colores automáticamente si no están disponibles
  const primaryDark = thematicColors?.dark || darkenColor(primary, 20);
  
  return {
    // Colores principales
    primary,
    primaryDark,
    
    // Transparencias
    transparent5: thematicColors?.transparent5 || `${primary}0D`, // 5% opacity
    transparent10: thematicColors?.transparent10 || `${primary}1A`, // 10% opacity
    transparent20: thematicColors?.transparent20 || `${primary}33`, // 20% opacity
    transparent30: thematicColors?.transparent30 || `${primary}4D`, // 30% opacity
    transparent50: thematicColors?.transparent50 || `${primary}80`, // 50% opacity
    
    // Colores de texto
    textContrast: thematicColors?.textContrast || '#ffffff',
    
    // Utilidades
    getRingColor: () => primary,
    getHoverColor: () => primaryDark,
    getBorderColor: () => thematicColors?.transparent20 || `${primary}33`,
  };
};

/**
 * Función auxiliar para oscurecer un color hexadecimal
 * @param {string} hex - Color hexadecimal (ej: '#EC4899')
 * @param {number} percent - Porcentaje de oscurecimiento (0-100)
 * @returns {string} Color oscurecido
 */
function darkenColor(hex, percent) {
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
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}