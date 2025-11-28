// src/components/ui/Modal/index.jsx

import React, ***REMOVED*** useEffect ***REMOVED*** from 'react';
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';
import Button from '../Button';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../hooks/useIsMobile';

const Modal = (***REMOVED***
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
  showCloseButton = true,
  mobileFullScreen = false // Nueva prop para control móvil
***REMOVED***) => ***REMOVED***
  const isMobile = useIsMobile();

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => ***REMOVED***
    if (isOpen) ***REMOVED***
      document.body.style.overflow = 'hidden';
    ***REMOVED*** else ***REMOVED***
      document.body.style.overflow = 'unset';
    ***REMOVED***
    
    return () => ***REMOVED***
      document.body.style.overflow = 'unset';
    ***REMOVED***;
  ***REMOVED***, [isOpen]);

  if (!isOpen) return null;

  const getSizeClasses = () => ***REMOVED***
    if (isMobile) ***REMOVED***
      // En móvil, usar clases específicas
      return mobileFullScreen 
        ? 'w-full h-full max-w-none max-h-none' 
        : 'w-full max-w-none mx-4 max-h-[90vh]';
    ***REMOVED***
    
    // En desktop, usar tamaños normales
    const sizes = ***REMOVED***
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl'
    ***REMOVED***;
    return sizes[size] || sizes.md;
  ***REMOVED***;

  const getContainerClasses = () => ***REMOVED***
    if (isMobile) ***REMOVED***
      return mobileFullScreen
        ? 'fixed inset-0 z-50' // Pantalla completa
        : 'fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4'; // Desde abajo
    ***REMOVED***
    return 'fixed inset-0 z-50 overflow-y-auto flex min-h-screen items-center justify-center p-4';
  ***REMOVED***;

  const getModalClasses = () => ***REMOVED***
    const baseClasses = 'relative bg-white shadow-xl';
    
    if (isMobile) ***REMOVED***
      return mobileFullScreen
        ? `$***REMOVED***baseClasses***REMOVED*** w-full h-full` // Sin bordes redondeados en pantalla completa
        : `$***REMOVED***baseClasses***REMOVED*** w-full rounded-t-xl md:rounded-xl`; // Bordes redondeados solo arriba
    ***REMOVED***
    
    return `$***REMOVED***baseClasses***REMOVED*** rounded-xl w-full`;
  ***REMOVED***;

  return (
    <div className=***REMOVED***getContainerClasses()***REMOVED***>
      ***REMOVED***/* Overlay */***REMOVED***
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick=***REMOVED***onClose***REMOVED***
      />
      
      ***REMOVED***/* Modal */***REMOVED***
      <div className=***REMOVED***`$***REMOVED***getModalClasses()***REMOVED*** $***REMOVED***getSizeClasses()***REMOVED*** $***REMOVED***className***REMOVED***`***REMOVED***>
        ***REMOVED***/* Header */***REMOVED***
        ***REMOVED***(title || showCloseButton) && (
          <div className=***REMOVED***`
            flex items-center justify-between p-4 border-b border-gray-200
            $***REMOVED***isMobile ? 'sticky top-0 bg-white z-10' : ''***REMOVED***
            $***REMOVED***isMobile && mobileFullScreen ? 'pt-6' : ''***REMOVED***
          `***REMOVED***>
            <div className="flex items-center flex-1">
              ***REMOVED***title && (
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 truncate">
                  ***REMOVED***title***REMOVED***
                </h2>
              )***REMOVED***
            </div>
            
            ***REMOVED***showCloseButton && (
              <button
                onClick=***REMOVED***onClose***REMOVED***
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X size=***REMOVED***isMobile ? 24 : 20***REMOVED*** />
              </button>
            )***REMOVED***
          </div>
        )***REMOVED***
        
        ***REMOVED***/* Content */***REMOVED***
        <div className=***REMOVED***`
          $***REMOVED***(title || showCloseButton) ? 'p-4 md:p-6' : 'p-4 md:p-6'***REMOVED***
          $***REMOVED***isMobile && mobileFullScreen ? 'flex-1 overflow-y-auto' : ''***REMOVED***
          $***REMOVED***isMobile && !mobileFullScreen ? 'max-h-[70vh] overflow-y-auto' : ''***REMOVED***
        `***REMOVED***>
          ***REMOVED***children***REMOVED***
        </div>
        
        ***REMOVED***/* Footer */***REMOVED***
        ***REMOVED***footer && (
          <div className=***REMOVED***`
            flex justify-end gap-3 p-4 md:p-6 border-t border-gray-200
            $***REMOVED***isMobile ? 'sticky bottom-0 bg-white' : ''***REMOVED***
            $***REMOVED***isMobile && mobileFullScreen ? 'pb-6' : ''***REMOVED***
          `***REMOVED***>
            ***REMOVED***footer***REMOVED***
          </div>
        )***REMOVED***
        
        ***REMOVED***/* Indicador de arrastrar en móvil (solo si no es pantalla completa) */***REMOVED***
        ***REMOVED***isMobile && !mobileFullScreen && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>
        )***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default Modal;