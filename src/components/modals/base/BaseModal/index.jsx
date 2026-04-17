// src/components/modals/base/BaseModal/index.jsx
// Unified base component for all modals

import React, { useEffect, useRef } from 'react';
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
  const modalRef = useRef(null);

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

  // Focus trap + Escape key + restore focus on close
  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement;
    const modal = modalRef.current;
    if (!modal) return;

    const focusable = modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { last?.focus(); e.preventDefault(); }
      } else {
        if (document.activeElement === last) { first?.focus(); e.preventDefault(); }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

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

  return (
    <Flex variant="center"
      className="fixed inset-0 bg-black bg-opacity-50 p-4"
      style={{ zIndex: 9999 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="base-modal-title"
        className={`
          bg-white shadow-2xl w-full relative
          ${maxWidthClasses[maxWidth]} max-h-[90vh] rounded-2xl
          overflow-hidden flex flex-col
        `}
      >

        {/* Header */}
        <Flex variant="between"
          className="sticky top-0 bg-white border-b z-10 p-4 min-h-[60px]"
          style={{ borderBottomColor: colors.transparent20 }}
        >
          <div className="flex-1 pr-4 min-w-0">
            {typeof title === 'string' ? (
              <div className="flex items-center">
                {Icon && <Icon className="mr-2 h-5 w-5" style={{ color: colors.primary }} />}
                <h2
                  id="base-modal-title"
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
            aria-label="Close"
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
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>

        {/* Actions Footer */}
        {showActions && (
          <div
            className="border-t bg-white p-4"
            style={{ borderTopColor: colors.transparent20 }}
          >
            <div className="flex justify-end gap-3">
              <Button
                variant="cancel"
                onClick={onCancel}
                disabled={loading}
                className="flex-none"
              >
                {cancelText}
              </Button>
              <Button
                type="submit"
                form={formId}
                loading={loading}
                loadingText={finalSaveLoadingText}
                disabled={loading || isSaveDisabled}
                themeColor={colors.primary}
                className="flex-none"
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