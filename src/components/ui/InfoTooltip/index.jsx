// src/components/ui/InfoTooltip/index.jsx - REFACTORIZADO

import React, ***REMOVED*** useState, useRef, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Info ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';

const InfoTooltip = (***REMOVED*** 
  content, 
  position = 'top',
  size = 'sm',
  className = '' 
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => ***REMOVED***
    const checkMobile = () => ***REMOVED***
      setIsMobile(window.innerWidth < 768);
    ***REMOVED***;
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  ***REMOVED***, []);

  const handleMouseEnter = () => ***REMOVED***
    if (!isMobile) ***REMOVED***
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsVisible(true);
    ***REMOVED***
  ***REMOVED***;

  const handleMouseLeave = () => ***REMOVED***
    if (!isMobile) ***REMOVED***
      timeoutRef.current = setTimeout(() => ***REMOVED***
        setIsVisible(false);
      ***REMOVED***, 200);
    ***REMOVED***
  ***REMOVED***;

  const handleClick = () => ***REMOVED***
    if (isMobile) ***REMOVED***
      setIsVisible(!isVisible);
    ***REMOVED***
  ***REMOVED***;

  const handleTooltipMouseEnter = () => ***REMOVED***
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  ***REMOVED***;

  const handleTooltipMouseLeave = () => ***REMOVED***
    if (!isMobile) ***REMOVED***
      setIsVisible(false);
    ***REMOVED***
  ***REMOVED***;

  const getSizeClasses = () => ***REMOVED***
    const sizes = ***REMOVED***
      xs: 'w-3 h-3',
      sm: 'w-4 h-4', 
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    ***REMOVED***;
    return sizes[size] || sizes.sm;
  ***REMOVED***;

  const getPositionClasses = () => ***REMOVED***
    const positions = ***REMOVED***
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    ***REMOVED***;
    return positions[position] || positions.top;
  ***REMOVED***;

  const getArrowClasses = () => ***REMOVED***
    const arrows = ***REMOVED***
      top: 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800',
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800',
      left: 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800',
      right: 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800'
    ***REMOVED***;
    return arrows[position] || arrows.top;
  ***REMOVED***;

  return (
    <div className=***REMOVED***`relative inline-block $***REMOVED***className***REMOVED***`***REMOVED***>
      ***REMOVED***/* Botón/Icono trigger */***REMOVED***
      <button
        type="button"
        className=***REMOVED***`$***REMOVED***getSizeClasses()***REMOVED*** rounded-full flex items-center justify-center transition-colors hover:bg-opacity-20`***REMOVED***
        style=***REMOVED******REMOVED*** 
          backgroundColor: colors.transparent10,
          color: colors.primary
        ***REMOVED******REMOVED***
        onClick=***REMOVED***handleClick***REMOVED***
        onMouseEnter=***REMOVED***handleMouseEnter***REMOVED***
        onMouseLeave=***REMOVED***handleMouseLeave***REMOVED***
      >
        <Info size=***REMOVED***size === 'xs' ? 10 : size === 'sm' ? 12 : size === 'md' ? 16 : 20***REMOVED*** />
      </button>

      ***REMOVED***/* Tooltip */***REMOVED***
      ***REMOVED***isVisible && (
        <>
          <div 
            className=***REMOVED***`absolute z-50 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg shadow-lg max-w-xs whitespace-normal $***REMOVED***getPositionClasses()***REMOVED***`***REMOVED***
            onMouseEnter=***REMOVED***handleTooltipMouseEnter***REMOVED***
            onMouseLeave=***REMOVED***handleTooltipMouseLeave***REMOVED***
          >
            ***REMOVED***content***REMOVED***
            ***REMOVED***/* Flecha del tooltip */***REMOVED***
            <div className=***REMOVED***`absolute w-0 h-0 $***REMOVED***getArrowClasses()***REMOVED***`***REMOVED*** />
          </div>
          ***REMOVED***/* Overlay para móvil - solo se muestra en móvil */***REMOVED***
          ***REMOVED***isMobile && (
            <div 
              className="fixed inset-0 z-40"
              onClick=***REMOVED***() => setIsVisible(false)***REMOVED***
            />
          )***REMOVED***
        </>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default InfoTooltip;