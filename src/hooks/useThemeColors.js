// src/hooks/useThemeColors.js

import { useApp } from '../contexts/AppContext';

/**
 * Hook that provides the application's theme colors
 * with consistent fallback values
 * @returns {object} Object with theme colors and utilities
 */
export const useThemeColors = () => {
  const { thematicColors } = useApp();
  
  // Main base color
  const primary = thematicColors?.base || '#EC4899';
  
  // Automatically derive colors if not available
  const primaryDark = thematicColors?.dark || darkenColor(primary, 20);
  
  return {
    // Main colors
    primary,
    primaryDark,
    
    // Transparencies
    transparent5: thematicColors?.transparent5 || `${primary}0D`, // 5% opacity
    transparent10: thematicColors?.transparent10 || `${primary}1A`, // 10% opacity
    transparent20: thematicColors?.transparent20 || `${primary}33`, // 20% opacity
    transparent30: thematicColors?.transparent30 || `${primary}4D`, // 30% opacity
    transparent50: thematicColors?.transparent50 || `${primary}80`, // 50% opacity
    
    // Text colors
    textContrast: thematicColors?.textContrast || '#ffffff',
    
    // Utilities
    getRingColor: () => primary,
    getHoverColor: () => primaryDark,
    getBorderColor: () => thematicColors?.transparent20 || `${primary}33`,
  };
};

/**
 * Helper function to darken a hexadecimal color
 * @param {string} hex - Hexadecimal color (ex: '#EC4899')
 * @param {number} percent - Darkening percentage (0-100)
 * @returns {string} Darkened color
 */
function darkenColor(hex, percent) {
  // Remove the # if present
  const color = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Apply darkening
  const factor = (100 - percent) / 100;
  const newR = Math.round(r * factor);
  const newG = Math.round(g * factor);
  const newB = Math.round(b * factor);
  
  // Convert back to hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}