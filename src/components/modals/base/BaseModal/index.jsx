// src/components/modals/base/BaseModal/index.jsx
// Componente base unificado para todos los modales

import React, ***REMOVED*** useEffect ***REMOVED*** from 'react';
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../../hooks/useIsMobile';
import LoadingSpinner from '../../../ui/LoadingSpinner/LoadingSpinner';
import Flex from '../../../ui/Flex';

const BaseModal = (***REMOVED***
  isOpen,
  onClose,
  title,
  subtitle,
  loading = false,
  loadingText = 'Guardando...',
  showFooter = false,
  footerText = 'Desliza hacia abajo para cerrar',
  maxWidth = 'lg', // 'sm' | 'md' | 'lg' | 'xl'
  children
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
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

  // Configurar tamaño máximo según prop
  const maxWidthClasses = ***REMOVED***
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  ***REMOVED***;

  const modalConfig = ***REMOVED***
    mobileFullScreen: isMobile,
    zIndex: 9999
  ***REMOVED***;

  return (
    <Flex variant="center"
      className="fixed inset-0 bg-black bg-opacity-50 p-4"
      style=***REMOVED******REMOVED*** zIndex: modalConfig.zIndex ***REMOVED******REMOVED***
    >
      <div
        className=***REMOVED***`
          bg-white shadow-2xl w-full relative
          $***REMOVED***isMobile
            ? 'h-full max-w-none rounded-none'
            : `$***REMOVED***maxWidthClasses[maxWidth]***REMOVED*** max-h-[90vh] rounded-xl`
          ***REMOVED***
          $***REMOVED***isMobile ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'***REMOVED***
        `***REMOVED***
      >

        ***REMOVED***/* Header */***REMOVED***
        <Flex variant="between"
          className=***REMOVED***`
            sticky top-0 bg-white border-b z-10
            $***REMOVED***isMobile ? 'px-4 py-4 min-h-[60px]' : 'p-4'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED***
            borderBottomColor: colors.transparent20
          ***REMOVED******REMOVED***
        >
          <div className="flex-1 pr-4 min-w-0">
            <h2
              className=***REMOVED***`font-semibold truncate $***REMOVED***isMobile ? 'text-lg' : 'text-xl'***REMOVED***`***REMOVED***
              style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
            >
              ***REMOVED***title***REMOVED***
            </h2>

            ***REMOVED***/* Subtitle opcional */***REMOVED***
            ***REMOVED***subtitle && (
              <p className="text-sm font-normal text-gray-600 mt-1">
                ***REMOVED***subtitle***REMOVED***
              </p>
            )***REMOVED***
          </div>

          <button
            onClick=***REMOVED***onClose***REMOVED***
            className="flex-shrink-0 p-2 rounded-lg transition-colors"
            style=***REMOVED******REMOVED***
              backgroundColor: 'transparent',
              color: colors.primary
            ***REMOVED******REMOVED***
            onMouseEnter=***REMOVED***(e) => ***REMOVED***
              e.target.style.backgroundColor = colors.transparent10;
            ***REMOVED******REMOVED***
            onMouseLeave=***REMOVED***(e) => ***REMOVED***
              e.target.style.backgroundColor = 'transparent';
            ***REMOVED******REMOVED***
            disabled=***REMOVED***loading***REMOVED***
          >
            <X size=***REMOVED***isMobile ? 24 : 20***REMOVED*** />
          </button>
        </Flex>

        ***REMOVED***/* Content con scroll optimizado */***REMOVED***
        <div className=***REMOVED***`
          $***REMOVED***isMobile ? 'flex-1 overflow-y-auto px-4 py-6' : 'p-4'***REMOVED***
        `***REMOVED***>
          ***REMOVED***children***REMOVED***
        </div>

        ***REMOVED***/* Footer fijo en móvil (opcional) */***REMOVED***
        ***REMOVED***isMobile && showFooter && !loading && (
          <div
            className="sticky bottom-0 bg-white border-t p-4"
            style=***REMOVED******REMOVED***
              borderTopColor: colors.transparent20
            ***REMOVED******REMOVED***
          >
            <div className="text-xs text-gray-500 text-center">
              ***REMOVED***footerText***REMOVED***
            </div>
          </div>
        )***REMOVED***

        ***REMOVED***/* Indicador de carga */***REMOVED***
        ***REMOVED***loading && (
          <Flex variant="center"
            className="absolute inset-0 bg-black bg-opacity-30"
            style=***REMOVED******REMOVED*** zIndex: modalConfig.zIndex + 1 ***REMOVED******REMOVED***
          >
            <Flex
              className="bg-white rounded-lg p-4 space-x-3"
              style=***REMOVED******REMOVED***
                borderColor: colors.primary,
                borderWidth: '2px'
              ***REMOVED******REMOVED***
            >
              <LoadingSpinner 
                style=***REMOVED******REMOVED*** borderColor: colors.primary ***REMOVED******REMOVED***
                color="border-transparent"
              />
              <span
                className="font-medium"
                style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
              >
                ***REMOVED***loadingText***REMOVED***
              </span>
            </Flex>
          </Flex>
        )***REMOVED***
      </div>
    </Flex>
  );
***REMOVED***;

export default BaseModal;
