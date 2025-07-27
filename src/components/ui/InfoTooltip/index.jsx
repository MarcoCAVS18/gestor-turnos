// src/components/ui/InfoTooltip/index.jsx - REFACTORIZADO

import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';

const InfoTooltip = ({ 
  content, 
  position = 'top',
  size = 'sm',
  className = '' 
}) => {
  const colors = useThemeColors();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 200);
    }
  };

  const handleClick = () => {
    if (isMobile) {
      setIsVisible(!isVisible);
    }
  };

  const handleTooltipMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleTooltipMouseLeave = () => {
    if (!isMobile) {
      setIsVisible(false);
    }
  };

  const getSizeClasses = () => {
    const sizes = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4', 
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };
    return sizes[size] || sizes.sm;
  };

  const getPositionClasses = () => {
    const positions = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };
    return positions[position] || positions.top;
  };

  const getArrowClasses = () => {
    const arrows = {
      top: 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800',
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800',
      left: 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800',
      right: 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800'
    };
    return arrows[position] || arrows.top;
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Botón/Icono trigger */}
      <button
        type="button"
        className={`${getSizeClasses()} rounded-full flex items-center justify-center transition-colors hover:bg-opacity-20`}
        style={{ 
          backgroundColor: colors.transparent10,
          color: colors.primary
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Info size={size === 'xs' ? 10 : size === 'sm' ? 12 : size === 'md' ? 16 : 20} />
      </button>

      {/* Tooltip */}
      {isVisible && (
        <>
          <div 
            className={`absolute z-50 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg shadow-lg max-w-xs whitespace-normal ${getPositionClasses()}`}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
          >
            {content}
            {/* Flecha del tooltip */}
            <div className={`absolute w-0 h-0 ${getArrowClasses()}`} />
          </div>
          {/* Overlay para móvil - solo se muestra en móvil */}
          {isMobile && (
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsVisible(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default InfoTooltip;