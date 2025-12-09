// src/components/modals/base/BaseModal/index.jsx
// Componente base unificado para todos los modales

import React, ***REMOVED*** useEffect ***REMOVED*** from 'react';
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../../hooks/useIsMobile';
import Flex from '../../../ui/Flex';
import Button from '../../../ui/Button';

const BaseModal = (***REMOVED***
  isOpen,
  onClose,
  title,
  subtitle,
  loading = false,
  maxWidth = 'lg', // 'sm' | 'md' | 'lg' | 'xl'
  children,
  showActions = false,
  onCancel,
  saveText = 'Guardar',
  cancelText = 'Cancelar',
  formId,
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
          $***REMOVED***isMobile ? 'overflow-hidden flex flex-col' : ''***REMOVED***
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
          $***REMOVED***isMobile ? 'flex-1 overflow-y-auto px-4 py-6' : 'p-4 overflow-y-auto'***REMOVED***
        `***REMOVED***>
          ***REMOVED***children***REMOVED***
        </div>
        
        ***REMOVED***/* Actions Footer */***REMOVED***
        ***REMOVED***showActions && (
          <div
            className=***REMOVED***`
              border-t
              $***REMOVED***isMobile
                ? 'sticky bottom-0 bg-white p-4'
                : 'p-4 mt-auto'
              ***REMOVED***
            `***REMOVED***
            style=***REMOVED******REMOVED*** borderTopColor: colors.transparent20 ***REMOVED******REMOVED***
          >
            <div className=***REMOVED***`
              w-full
              $***REMOVED***isMobile ? 'flex flex-col-reverse gap-2' : 'flex justify-end gap-3'***REMOVED***
            `***REMOVED***>
              <Button
                variant="secondary"
                onClick=***REMOVED***onCancel***REMOVED***
                disabled=***REMOVED***loading***REMOVED***
                isMobile=***REMOVED***isMobile***REMOVED***
                className=***REMOVED***isMobile ? '' : 'flex-none'***REMOVED***
              >
                ***REMOVED***cancelText***REMOVED***
              </Button>
              <Button
                type="submit"
                form=***REMOVED***formId***REMOVED***
                loading=***REMOVED***loading***REMOVED***
                isMobile=***REMOVED***isMobile***REMOVED***
                className=***REMOVED***isMobile ? '' : 'flex-none'***REMOVED***
              >
                ***REMOVED***saveText***REMOVED***
              </Button>
            </div>
          </div>
        )***REMOVED***
      </div>
    </Flex>
  );
***REMOVED***;

export default BaseModal;
