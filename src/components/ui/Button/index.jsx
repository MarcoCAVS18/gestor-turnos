// src/components/ui/Button/index.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  expandedWidth,
  disabled = false,
  loading = false,
  loadingText,
  iconPosition = 'right',
  animatedChevron = false,
  bgColor,
  textColor,
  iconSize,
  ...props
}) => {
  const isGhost = variant === 'ghost' || variant === 'ghost-animated';
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';
  const isPremium = variant === 'premium';
  const isCancel = variant === 'cancel';

  const shouldAnimateIcon = animatedChevron || variant === 'ghost-animated';

  const heightMap = { sm: '2rem', md: '2.75rem', lg: '3.25rem' };
  const fontSizeClasses = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  const currentHeight = heightMap[size] || heightMap.md;
  const currentFontSize = fontSizeClasses[size] || fontSizeClasses.md;
  const mainColor = themeColor || '#EC4899';

  let currentBgColor = mainColor;
  let currentTextColor = 'white';
  let currentBorder = 'none';
  let isPremiumGradient = false;

  if (isPremium) {
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
    currentBgColor = 'transparent';
    currentTextColor = '#4B5563';
    currentBorder = 'none';
  }

  const pad = size === 'sm' ? '0 0.75rem' : '0 1rem';
  const padPx = size === 'sm' ? 12 : 16;
  const gap = size === 'sm' ? '0.25rem' : '0.5rem';

  // When expandedWidth is provided, we animate width/padding directly (no FLIP distortion).
  // Otherwise, fall back to legacy layout="size" behaviour for non-collapsing buttons.
  const useExplicitWidth = Boolean(expandedWidth);

  const staticStyles = {
    ...style,
    height: currentHeight,
    backgroundColor: isPremiumGradient ? undefined : (bgColor || currentBgColor),
    color: textColor || currentTextColor,
    border: currentBorder,
    overflow: useExplicitWidth ? 'hidden' : undefined,
    // Legacy path: instant padding/minWidth via style prop
    ...(useExplicitWidth ? {} : {
      padding: collapsed ? 0 : pad,
      minWidth: collapsed ? currentHeight : undefined,
    }),
    ...(isPremiumGradient && {
      background: `linear-gradient(135deg, ${PREMIUM_BTN_COLORS.primary} 0%, ${PREMIUM_BTN_COLORS.light} 50%, ${PREMIUM_BTN_COLORS.primary} 100%)`,
      boxShadow: '0 4px 14px rgba(212, 160, 0, 0.4)',
    }),
  };

  const collapseEase = [0.4, 0, 0.2, 1];
  const collapseDuration = 0.26;

  const animateProps = {
    borderRadius: collapsed ? '9999px' : '0.75rem',
    ...(useExplicitWidth && {
      width: collapsed ? currentHeight : expandedWidth,
      paddingLeft: collapsed ? 0 : padPx,
      paddingRight: collapsed ? 0 : padPx,
    }),
  };

  const transitionProps = useExplicitWidth
    ? {
        // Small delay on collapse so text fades before button shrinks
        width:        { type: 'tween', duration: collapseDuration, ease: collapseEase, delay: collapsed ? 0.1 : 0 },
        paddingLeft:  { type: 'tween', duration: collapseDuration, ease: collapseEase, delay: collapsed ? 0.1 : 0 },
        paddingRight: { type: 'tween', duration: collapseDuration, ease: collapseEase, delay: collapsed ? 0.1 : 0 },
        borderRadius: { type: 'tween', duration: collapseDuration, ease: collapseEase, delay: collapsed ? 0.1 : 0 },
      }
    : {
        layout: { type: 'spring', stiffness: 280, damping: 32 },
        borderRadius: { delay: collapsed ? 0.2 : 0, duration: 0.3, ease: collapseEase },
      };

  const renderIcon = (isForLoading = false) => (
    <motion.div
      className="flex items-center justify-center flex-shrink-0"
      animate={shouldAnimateIcon && !loading ? { x: [0, 3, 0] } : {}}
      transition={shouldAnimateIcon && !loading ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.5 } : {}}
    >
      {isForLoading ? (
        <svg className="animate-spin" width={size === 'sm' ? 14 : 20} height={size === 'sm' ? 14 : 20} viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        Icon && <Icon size={iconSize ?? (size === 'sm' ? 16 : 20)} strokeWidth={2.5} />
      )}
    </motion.div>
  );

  return (
    <motion.button
      layout={useExplicitWidth ? false : 'size'}
      onClick={onClick}
      disabled={disabled || loading}
      initial={false}
      animate={animateProps}
      transition={transitionProps}
      className={`relative flex items-center justify-center overflow-hidden
        ${currentFontSize} font-medium
        ${(isGhost || isCancel) ? 'hover:bg-gray-500/10' : 'shadow-sm hover:shadow-md'}
        ${isPremium ? 'hover:scale-[1.02] hover:shadow-lg font-semibold' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}`}
      style={staticStyles}
      {...props}
    >
      <div className="flex items-center justify-center" style={{ gap }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={loading ? 'loading' : 'default'}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="flex items-center"
            style={{ gap }}
          >
            {loading ? (
              <>
                {renderIcon(true)}
                {!collapsed && loadingText && <span className="whitespace-nowrap">{loadingText}</span>}
              </>
            ) : (
              <>
                {iconPosition === 'left' && Icon && renderIcon()}
                <AnimatePresence>
                  {!collapsed && children && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.18,
                        // On expand, wait for button to open before fading text in
                        delay: useExplicitWidth ? 0.14 : 0,
                      }}
                      className="whitespace-nowrap"
                    >
                      {children}
                    </motion.span>
                  )}
                </AnimatePresence>
                {iconPosition === 'right' && Icon && renderIcon()}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

export default Button;
