// src/components/ui/Button/index.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Button = ({
  children,
  onClick,
  icon: Icon,
  className = '',
  style = {},
  themeColor,
  variant = 'primary',
  size = 'md',
  collapsed = false,
  disabled = false,
  loading = false,
  loadingText,
  iconPosition = 'right',
  animatedChevron = false,
  bgColor,
  textColor,
  ...props
}) => {
  const isGhost = variant === 'ghost' || variant === 'ghost-animated';
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';

  const shouldAnimateIcon = animatedChevron || variant === 'ghost-animated';
  
  const heightMap = { sm: '32px', md: '44px', lg: '52px' };
  const fontSizeClasses = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };
  
  const currentHeight = heightMap[size] || heightMap.md;
  const currentFontSize = fontSizeClasses[size] || fontSizeClasses.md;
  const mainColor = themeColor || '#EC4899'; 

  let currentBgColor = mainColor;
  let currentTextColor = 'white';
  let currentBorder = 'none';

  if (isGhost) {
    currentBgColor = 'transparent';
    currentTextColor = mainColor;
  } else if (isOutline) {
    currentBgColor = 'transparent';
    currentTextColor = mainColor;
    currentBorder = `1px solid ${mainColor}`;
  } else if (isSecondary) {
    currentBgColor = 'white';
    currentTextColor = '#4B5563';
    currentBorder = `1px solid #E5E7EB`;
  }

  const dynamicStyles = {
    ...style,
    height: currentHeight,
    backgroundColor: bgColor || currentBgColor,
    color: textColor || currentTextColor,
    border: currentBorder,
    minWidth: collapsed ? currentHeight : 'auto',
    padding: collapsed ? 0 : (size === 'sm' ? '0 0.75rem' : '0 1rem'),
    borderRadius: collapsed ? '9999px' : '12px',
  };

  const renderIcon = (isForLoading = false) => (
    <motion.div 
      layout 
      className="flex items-center justify-center"
      animate={shouldAnimateIcon && !loading ? { x: [0, 3, 0] } : {}}
      transition={shouldAnimateIcon && !loading ? { 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "easeInOut",
        repeatDelay: 0.5 
      } : {}}
    >
      {isForLoading ? (
        <svg className="animate-spin" width={size === 'sm' ? 14 : 20} height={size === 'sm' ? 14 : 20} viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        Icon && <Icon size={size === 'sm' ? 16 : 20} strokeWidth={2.5} />
      )}
    </motion.div>
  );

  return (
    <motion.button
      layout
      onClick={onClick}
      disabled={disabled || loading}
      initial={false}
      className={`relative flex items-center justify-center overflow-hidden transition-all 
        ${currentFontSize} font-medium
        ${isGhost ? 'hover:bg-gray-100/10' : 'shadow-sm hover:shadow-md'} 
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}`}
      style={dynamicStyles}
      transition={{ layout: { duration: 0.4, type: "spring", bounce: 0, stiffness: 300, damping: 30 } }}
      {...props}
    >
      <motion.div 
        layout 
        className="flex items-center justify-center"
        style={{ gap: collapsed ? 0 : (size === 'sm' ? '0.25rem' : '0.5rem') }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={loading ? 'loading' : 'default'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
            style={{ gap: collapsed ? 0 : (size === 'sm' ? '0.25rem' : '0.5rem') }}
          >
            {loading ? (
              <>
                {renderIcon(true)}
                {!collapsed && loadingText && (
                  <span className="whitespace-nowrap">{loadingText}</span>
                )}
              </>
            ) : (
              <>
                {iconPosition === 'left' && Icon && renderIcon()}
                {!collapsed && children && (
                  <span className="whitespace-nowrap">{children}</span>
                )}
                {iconPosition === 'right' && Icon && renderIcon()}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
};

export default Button;