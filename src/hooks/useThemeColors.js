// hooks/useThemeColors.js
export const useThemeColors = () => {
  const { thematicColors } = useApp();
  
  return {
    primary: thematicColors?.base || '#EC4899',
    primaryDark: thematicColors?.dark || '#BE185D',
    transparent10: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)',
    transparent20: thematicColors?.transparent20 || 'rgba(236, 72, 153, 0.2)',
    // ... otros colores comunes
  };
};