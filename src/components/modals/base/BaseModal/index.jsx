// src/components/modals/base/BaseModal/index.jsx
// Componente base unificado para todos los modales

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import LoadingSpinner from '../../../ui/LoadingSpinner/LoadingSpinner';
import Flex from '../../../ui/Flex';

const BaseModal = ({
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
}) => {
  const colors = useThemeColors();
  const isMobile = useIsMobile();

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

  // Configurar tamaño máximo según prop
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  const modalConfig = {
    mobileFullScreen: isMobile,
    zIndex: 9999
  };

  return (
    <Flex variant="center"
      className="fixed inset-0 bg-black bg-opacity-50 p-4"
      style={{ zIndex: modalConfig.zIndex }}
    >
      <div
        className={`
          bg-white shadow-2xl w-full relative
          ${isMobile
            ? 'h-full max-w-none rounded-none'
            : `${maxWidthClasses[maxWidth]} max-h-[90vh] rounded-xl`
          }
          ${isMobile ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}
        `}
      >

        {/* Header */}
        <Flex variant="between"
          className={`
            sticky top-0 bg-white border-b z-10
            ${isMobile ? 'px-4 py-4 min-h-[60px]' : 'p-4'}
          `}
          style={{
            borderBottomColor: colors.transparent20
          }}
        >
          <div className="flex-1 pr-4 min-w-0">
            <h2
              className={`font-semibold truncate ${isMobile ? 'text-lg' : 'text-xl'}`}
              style={{ color: colors.primary }}
            >
              {title}
            </h2>

            {/* Subtitle opcional */}
            {subtitle && (
              <p className="text-sm font-normal text-gray-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'transparent',
              color: colors.primary
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.transparent10;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
            disabled={loading}
          >
            <X size={isMobile ? 24 : 20} />
          </button>
        </Flex>

        {/* Content con scroll optimizado */}
        <div className={`
          ${isMobile ? 'flex-1 overflow-y-auto px-4 py-6' : 'p-4'}
        `}>
          {children}
        </div>

        {/* Footer fijo en móvil (opcional) */}
        {isMobile && showFooter && !loading && (
          <div
            className="sticky bottom-0 bg-white border-t p-4"
            style={{
              borderTopColor: colors.transparent20
            }}
          >
            <div className="text-xs text-gray-500 text-center">
              {footerText}
            </div>
          </div>
        )}

        {/* Indicador de carga */}
        {loading && (
          <Flex variant="center"
            className="absolute inset-0 bg-black bg-opacity-30"
            style={{ zIndex: modalConfig.zIndex + 1 }}
          >
            <Flex
              className="bg-white rounded-lg p-4 space-x-3"
              style={{
                borderColor: colors.primary,
                borderWidth: '2px'
              }}
            >
              <LoadingSpinner 
                style={{ borderColor: colors.primary }}
                color="border-transparent"
              />
              <span
                className="font-medium"
                style={{ color: colors.primary }}
              >
                {loadingText}
              </span>
            </Flex>
          </Flex>
        )}
      </div>
    </Flex>
  );
};

export default BaseModal;
