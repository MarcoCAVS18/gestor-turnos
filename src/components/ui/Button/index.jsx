// src/components/ui/Button/index.jsx

import React from 'react';
import ***REMOVED*** motion, AnimatePresence ***REMOVED*** from 'framer-motion';

const Button = (***REMOVED***
  children,
  onClick,
  icon: Icon,
  className = '',
  style = ***REMOVED******REMOVED***,
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
***REMOVED***) => ***REMOVED***
  const isGhost = variant === 'ghost' || variant === 'ghost-animated';
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';

  const shouldAnimateIcon = animatedChevron || variant === 'ghost-animated';
  
  const heightMap = ***REMOVED*** sm: '32px', md: '44px', lg: '52px' ***REMOVED***;
  const fontSizeClasses = ***REMOVED*** sm: 'text-xs', md: 'text-sm', lg: 'text-base' ***REMOVED***;
  
  const currentHeight = heightMap[size] || heightMap.md;
  const currentFontSize = fontSizeClasses[size] || fontSizeClasses.md;
  const mainColor = themeColor || '#EC4899'; 

  let currentBgColor = mainColor;
  let currentTextColor = 'white';
  let currentBorder = 'none';

  if (isGhost) ***REMOVED***
    currentBgColor = 'transparent';
    currentTextColor = mainColor;
  ***REMOVED*** else if (isOutline) ***REMOVED***
    currentBgColor = 'transparent';
    currentTextColor = mainColor;
    currentBorder = `1px solid $***REMOVED***mainColor***REMOVED***`;
  ***REMOVED*** else if (isSecondary) ***REMOVED***
    currentBgColor = 'white';
    currentTextColor = '#4B5563';
    currentBorder = `1px solid #E5E7EB`;
  ***REMOVED***

  const dynamicStyles = ***REMOVED***
    ...style,
    height: currentHeight,
    backgroundColor: bgColor || currentBgColor,
    color: textColor || currentTextColor,
    border: currentBorder,
    minWidth: collapsed ? currentHeight : 'auto',
    padding: collapsed ? 0 : (size === 'sm' ? '0 0.75rem' : '0 1rem'),
    borderRadius: collapsed ? '9999px' : '12px',
  ***REMOVED***;

  const renderIcon = (isForLoading = false) => (
    <motion.div 
      layout 
      className="flex items-center justify-center"
      animate=***REMOVED***shouldAnimateIcon && !loading ? ***REMOVED*** x: [0, 3, 0] ***REMOVED*** : ***REMOVED******REMOVED******REMOVED***
      transition=***REMOVED***shouldAnimateIcon && !loading ? ***REMOVED*** 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "easeInOut",
        repeatDelay: 0.5 
      ***REMOVED*** : ***REMOVED******REMOVED******REMOVED***
    >
      ***REMOVED***isForLoading ? (
        <svg className="animate-spin" width=***REMOVED***size === 'sm' ? 14 : 20***REMOVED*** height=***REMOVED***size === 'sm' ? 14 : 20***REMOVED*** viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        Icon && <Icon size=***REMOVED***size === 'sm' ? 16 : 20***REMOVED*** strokeWidth=***REMOVED***2.5***REMOVED*** />
      )***REMOVED***
    </motion.div>
  );

  return (
    <motion.button
      layout
      onClick=***REMOVED***onClick***REMOVED***
      disabled=***REMOVED***disabled || loading***REMOVED***
      initial=***REMOVED***false***REMOVED***
      className=***REMOVED***`relative flex items-center justify-center overflow-hidden transition-all 
        $***REMOVED***currentFontSize***REMOVED*** font-medium
        $***REMOVED***isGhost ? 'hover:bg-gray-100/10' : 'shadow-sm hover:shadow-md'***REMOVED*** 
        $***REMOVED***disabled || loading ? 'opacity-50 cursor-not-allowed' : ''***REMOVED***
        $***REMOVED***className***REMOVED***`***REMOVED***
      style=***REMOVED***dynamicStyles***REMOVED***
      transition=***REMOVED******REMOVED*** layout: ***REMOVED*** duration: 0.4, type: "spring", bounce: 0, stiffness: 300, damping: 30 ***REMOVED*** ***REMOVED******REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      <motion.div 
        layout 
        className="flex items-center justify-center"
        style=***REMOVED******REMOVED*** gap: collapsed ? 0 : (size === 'sm' ? '0.25rem' : '0.5rem') ***REMOVED******REMOVED***
      >
        <AnimatePresence mode="wait">
          <motion.div
            key=***REMOVED***loading ? 'loading' : 'default'***REMOVED***
            initial=***REMOVED******REMOVED*** opacity: 0, y: -10 ***REMOVED******REMOVED***
            animate=***REMOVED******REMOVED*** opacity: 1, y: 0 ***REMOVED******REMOVED***
            exit=***REMOVED******REMOVED*** opacity: 0, y: 10 ***REMOVED******REMOVED***
            transition=***REMOVED******REMOVED*** duration: 0.2 ***REMOVED******REMOVED***
            className="flex items-center"
            style=***REMOVED******REMOVED*** gap: collapsed ? 0 : (size === 'sm' ? '0.25rem' : '0.5rem') ***REMOVED******REMOVED***
          >
            ***REMOVED***loading ? (
              <>
                ***REMOVED***renderIcon(true)***REMOVED***
                ***REMOVED***!collapsed && loadingText && (
                  <span className="whitespace-nowrap">***REMOVED***loadingText***REMOVED***</span>
                )***REMOVED***
              </>
            ) : (
              <>
                ***REMOVED***iconPosition === 'left' && Icon && renderIcon()***REMOVED***
                ***REMOVED***!collapsed && children && (
                  <span className="whitespace-nowrap">***REMOVED***children***REMOVED***</span>
                )***REMOVED***
                ***REMOVED***iconPosition === 'right' && Icon && renderIcon()***REMOVED***
              </>
            )***REMOVED***
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
***REMOVED***;

export default Button;