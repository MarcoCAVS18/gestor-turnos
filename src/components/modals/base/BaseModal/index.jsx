// src/components/modals/base/BaseModal/index.jsx
// Unified base component for all modals

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import Flex from '../../../ui/Flex';
import Button from '../../../ui/Button';

const BaseModal = ({
  isOpen,
  onClose,
  title,
  icon: Icon,
  subtitle,
  loading = false,
  maxWidth = 'lg', // 'sm' | 'md' | 'lg' | 'xl'
  children,
  showActions = false,
  onCancel,
  saveText = 'Save',
  saveLoadingText,
  cancelText = 'Cancel',
  formId,
  isSaveDisabled = false, 
}) => {
  const colors = useThemeColors();
  const isMobile = useIsMobile();

  // Prevent body scroll when modal is open
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

  // Generate loading text by default
  const generateLoadingText = (text) => {
    if (text.endsWith('ing')) {
      return text + '...';
    }
    // Special cases
    if (text.toLowerCase().includes('create')) return 'Creating...';
    return `${text}...`;
  };

  const finalSaveLoadingText = saveLoadingText || generateLoadingText(saveText);

  // Set max width according to prop
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
          ${isMobile ? 'overflow-hidden flex flex-col' : ''}
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
            {typeof title === 'string' ? (
              <div className="flex items-center">
                {Icon && <Icon className="mr-2 h-5 w-5" style={{ color: colors.primary }} />}
                <h2
                  className={`font-semibold truncate ${isMobile ? 'text-lg' : 'text-xl'}`}
                  style={{ color: colors.primary }}
                >
                  {title}
                </h2>
              </div>
            ) : (
              title
            )}

            {/* Optional subtitle */}
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

        {/* Content with optimized scroll */}
        <div className={`
          ${isMobile ? 'flex-1 overflow-y-auto px-4 py-6' : 'p-4 overflow-y-auto'}
        `}>
          {children}
        </div>
        
        {/* Actions Footer */}
        {showActions && (
          <div
            className={`
              border-t
              ${isMobile
                ? 'sticky bottom-0 bg-white p-4'
                : 'p-4 mt-auto'
              }
            `}
            style={{ borderTopColor: colors.transparent20 }}
          >
            <div className={`
              w-full
              ${isMobile ? 'flex flex-col-reverse gap-2' : 'flex justify-end gap-3'}
            `}>
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                isMobile={isMobile}
                themeColor={colors.primary}
                className={isMobile ? '' : 'flex-none'}
              >
                {cancelText}
              </Button>
              <Button
                type="submit"
                form={formId}
                loading={loading}
                loadingText={finalSaveLoadingText}
                disabled={loading || isSaveDisabled}
                isMobile={isMobile}
                themeColor={colors.primary}
                className={isMobile ? '' : 'flex-none'}
              >
                {saveText}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Flex>
  );
};

export default BaseModal;