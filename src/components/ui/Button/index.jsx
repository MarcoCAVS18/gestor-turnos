// src/components/ui/Button/index.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Premium button colors (imported inline to avoid circular deps)
const PREMIUM_BTN_COLORS = {
  primary: '#D4A000',
  light: '#F5C518',
  lighter: '#FFF3CD',
  text: '#1a1a1a',
};


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
  const isPremium = variant === 'premium';
  const isCancel = variant === 'cancel';

  const shouldAnimateIcon = animatedChevron || variant === 'ghost-animated';

  const heightMap = { sm: '32px', md: '44px', lg: '52px' };
  const fontSizeClasses = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  const currentHeight = heightMap[size] || heightMap.md;
  const currentFontSize = fontSizeClasses[size] || fontSizeClasses.md;
  const mainColor = themeColor || '#EC4899';

  let currentBgColor = mainColor;
  let currentTextColor = 'white';
  let currentBorder = 'none';
  let isPremiumGradient = false;

  if (isPremium) {
    // Premium variant with gold gradient
    isPremiumGradient = true;
    currentTextColor = PREMIUM_BTN_COLORS.text;
    currentBorder = 'none';
  } else if (isGhost) {
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
  } else if (isCancel) {
    // Cancel variant - transparent background, dark gray text (like ghost but gray)
    currentBgColor = 'transparent';
    currentTextColor = '#4B5563';
    currentBorder = 'none';
  }

  const dynamicStyles = {
    ...style,
    height: currentHeight,
    backgroundColor: isPremiumGradient ? undefined : (bgColor || currentBgColor),
    color: textColor || currentTextColor,
    border: currentBorder,
    minWidth: collapsed ? currentHeight : 'auto',
    padding: collapsed ? 0 : (size === 'sm' ? '0 0.75rem' : '0 1rem'),
    borderRadius: collapsed ? '9999px' : '12px',
    // Premium gradient styles (no animation - solid gradient)
    ...(isPremiumGradient && {
      background: `linear-gradient(
        135deg,
        ${PREMIUM_BTN_COLORS.primary} 0%,
        ${PREMIUM_BTN_COLORS.light} 50%,
        ${PREMIUM_BTN_COLORS.primary} 100%
      )`,
      boxShadow: '0 4px 14px rgba(212, 160, 0, 0.4)',
    }),
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
          ${(isGhost || isCancel) ? 'hover:bg-gray-500/10' : 'shadow-sm hover:shadow-md'}
          ${isPremium ? 'hover:scale-[1.02] hover:shadow-lg font-semibold' : ''}
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