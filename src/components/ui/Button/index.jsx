import React from 'react';
import ***REMOVED*** motion, AnimatePresence ***REMOVED*** from 'framer-motion';

const Button = (***REMOVED***
  children,
  onClick,
  icon: Icon,
  className = '',
  style = ***REMOVED******REMOVED***,
  themeColor,
  variant = 'primary', // 'primary' | 'ghost' | 'outline'
  size = 'md',         // 'sm' | 'md' | 'lg'
  collapsed = false,   // Controla la animación de colapso
  disabled = false,
  loading = false,
  ...props
***REMOVED***) => ***REMOVED***
  const isGhost = variant === 'ghost';
  const isOutline = variant === 'outline';
  
  // Mapa de alturas fijas
  const heightMap = ***REMOVED***
    sm: '32px',
    md: '44px',
    lg: '52px'
  ***REMOVED***;

  // Mapa de tamaños de fuente (RESTITUIDO)
  const fontSizeClasses = ***REMOVED***
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  ***REMOVED***;
  
  const currentHeight = heightMap[size] || heightMap.md;
  const currentFontSize = fontSizeClasses[size] || fontSizeClasses.md;
  const mainColor = themeColor || '#EC4899'; 

  const dynamicStyles = ***REMOVED***
    ...style,
    height: currentHeight,
    backgroundColor: (isGhost || isOutline) ? 'transparent' : mainColor,
    color: (isGhost || isOutline) ? mainColor : 'white',
    border: isOutline ? `1px solid $***REMOVED***mainColor***REMOVED***` : 'none',
    minWidth: collapsed ? currentHeight : 'auto',
    // Ajustamos padding para cuando es pequeño
    padding: collapsed ? 0 : (size === 'sm' ? '0 0.75rem' : '0 1rem'),
    borderRadius: collapsed ? '9999px' : '12px',
  ***REMOVED***;

  return (
    <motion.button
      layout
      onClick=***REMOVED***onClick***REMOVED***
      disabled=***REMOVED***disabled || loading***REMOVED***
      initial=***REMOVED***false***REMOVED***
      // Agregamos currentFontSize aquí para asegurar que se aplique la clase de texto
      className=***REMOVED***`relative flex items-center justify-center overflow-hidden transition-all 
        $***REMOVED***currentFontSize***REMOVED*** font-medium
        $***REMOVED***isGhost ? 'hover:bg-gray-100/10' : 'shadow-sm hover:shadow-md'***REMOVED*** 
        $***REMOVED***disabled ? 'opacity-50 cursor-not-allowed' : ''***REMOVED***
        $***REMOVED***className***REMOVED***`***REMOVED***
      style=***REMOVED***dynamicStyles***REMOVED***
      transition=***REMOVED******REMOVED***
        layout: ***REMOVED*** duration: 0.4, type: "spring", bounce: 0, stiffness: 300, damping: 30 ***REMOVED***
      ***REMOVED******REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      <motion.div 
        layout 
        className="flex items-center justify-center"
        // Redujimos el gap para el tamaño small
        style=***REMOVED******REMOVED*** gap: collapsed ? 0 : (size === 'sm' ? '0.25rem' : '0.5rem') ***REMOVED******REMOVED***
      >
        <AnimatePresence mode="popLayout" initial=***REMOVED***false***REMOVED***>
          ***REMOVED***!collapsed && children && (
            <motion.span
              layout="position"
              // Animación ajustada: entra desde la izquierda, SALE hacia la derecha (x: 10)
              initial=***REMOVED******REMOVED*** opacity: 0, width: 0, x: -10 ***REMOVED******REMOVED***
              animate=***REMOVED******REMOVED*** opacity: 1, width: "auto", x: 0 ***REMOVED******REMOVED***
              exit=***REMOVED******REMOVED*** opacity: 0, width: 0, x: 10 ***REMOVED******REMOVED*** 
              transition=***REMOVED******REMOVED***
                opacity: ***REMOVED*** duration: 0.2 ***REMOVED***,
                width: ***REMOVED*** duration: 0.3 ***REMOVED***
              ***REMOVED******REMOVED***
              className="whitespace-nowrap"
            >
              ***REMOVED***children***REMOVED***
            </motion.span>
          )***REMOVED***
        </AnimatePresence>

        ***REMOVED***(loading || Icon) && (
          <motion.div layout className="flex items-center justify-center">
            ***REMOVED***loading ? (
              <svg className="animate-spin" width=***REMOVED***size === 'sm' ? 14 : 20***REMOVED*** height=***REMOVED***size === 'sm' ? 14 : 20***REMOVED*** viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              // Icono ligeramente más pequeño para size="sm"
              <Icon size=***REMOVED***size === 'sm' ? 16 : 20***REMOVED*** strokeWidth=***REMOVED***2.5***REMOVED*** />
            )***REMOVED***
          </motion.div>
        )***REMOVED***
      </motion.div>
    </motion.button>
  );
***REMOVED***;

export default Button;