// src/components/ui/Modal/index.jsx

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Button from '../Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
  showCloseButton = true,
  mobileFullScreen = false // Nueva prop para control móvil
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si estamos en móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getSizeClasses = () => {
    if (isMobile) {
      // En móvil, usar clases específicas
      return mobileFullScreen 
        ? 'w-full h-full max-w-none max-h-none' 
        : 'w-full max-w-none mx-4 max-h-[90vh]';
    }
    
    // En desktop, usar tamaños normales
    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl'
    };
    return sizes[size] || sizes.md;
  };

  const getContainerClasses = () => {
    if (isMobile) {
      return mobileFullScreen
        ? 'fixed inset-0 z-50' // Pantalla completa
        : 'fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4'; // Desde abajo
    }
    return 'fixed inset-0 z-50 overflow-y-auto flex min-h-screen items-center justify-center p-4';
  };

  const getModalClasses = () => {
    const baseClasses = 'relative bg-white shadow-xl';
    
    if (isMobile) {
      return mobileFullScreen
        ? `${baseClasses} w-full h-full` // Sin bordes redondeados en pantalla completa
        : `${baseClasses} w-full rounded-t-xl md:rounded-xl`; // Bordes redondeados solo arriba
    }
    
    return `${baseClasses} rounded-xl w-full`;
  };

  return (
    <div className={getContainerClasses()}>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`${getModalClasses()} ${getSizeClasses()} ${className}`}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={`
            flex items-center justify-between p-4 border-b border-gray-200
            ${isMobile ? 'sticky top-0 bg-white z-10' : ''}
            ${isMobile && mobileFullScreen ? 'pt-6' : ''}
          `}>
            <div className="flex items-center flex-1">
              {title && (
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 truncate">
                  {title}
                </h2>
              )}
            </div>
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={isMobile ? 24 : 20} />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className={`
          ${(title || showCloseButton) ? 'p-4 md:p-6' : 'p-4 md:p-6'}
          ${isMobile && mobileFullScreen ? 'flex-1 overflow-y-auto' : ''}
          ${isMobile && !mobileFullScreen ? 'max-h-[70vh] overflow-y-auto' : ''}
        `}>
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className={`
            flex justify-end gap-3 p-4 md:p-6 border-t border-gray-200
            ${isMobile ? 'sticky bottom-0 bg-white' : ''}
            ${isMobile && mobileFullScreen ? 'pb-6' : ''}
          `}>
            {footer}
          </div>
        )}
        
        {/* Indicador de arrastrar en móvil (solo si no es pantalla completa) */}
        {isMobile && !mobileFullScreen && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;