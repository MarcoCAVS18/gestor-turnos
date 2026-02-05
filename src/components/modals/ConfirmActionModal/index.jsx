// src/components/modals/ConfirmActionModal/index.jsx
// Modal reutilizable para acciones de confirmación

import React, { useState, useEffect } from 'react';
import BaseModal from '../base/BaseModal';
import { ArrowRight, Trash2, RefreshCw, AlertTriangle, Crown, LogOut, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { getDefaultProfilePhoto } from '../../../services/profilePhotoService';
import Flex from '../../ui/Flex';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Button from '../../ui/Button';

const VARIANTS = {
  'delete-photo': {
    title: 'Delete Profile Photo',
    confirmText: 'Confirm Deletion',
    confirmLoadingText: 'Deleting...',
    cancelText: 'Cancel',
    icon: Trash2,
    isDanger: false,
  },
  'clear-data': {
    title: 'Clear All Data',
    confirmText: 'Clear Data',
    confirmLoadingText: 'Clearing...',
    cancelText: 'Cancel',
    icon: RefreshCw,
    isDanger: false,
  },
  'delete-account': {
    title: 'Delete Account',
    confirmText: 'Delete Account',
    confirmLoadingText: 'Deleting...',
    cancelText: 'Cancel',
    icon: Trash2,
    isDanger: true,
  },
};

const ConfirmActionModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  variant = 'delete-photo',
  isPremium = false,
  reAuthError = null,
}) => {
  const { profilePhotoURL, currentUser } = useAuth();
  const defaultPhoto = getDefaultProfilePhoto();
  const colors = useThemeColors();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const config = VARIANTS[variant] || VARIANTS['delete-photo'];
  const dangerColor = '#EF4444';

  // Detect if user signed in with Google
  const isGoogleUser = currentUser?.providerData?.some(
    (provider) => provider.providerId === 'google.com'
  );

  // Reset password when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setShowPassword(false);
    }
  }, [isOpen]);

  const renderDeletePhotoContent = () => (
    <>
      <Flex variant="center" className="flex-col sm:flex-row my-4 sm:my-6 gap-3 sm:gap-0">
        {/* Current Profile Photo */}
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
          <img
            src={profilePhotoURL}
            alt="Current Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <ArrowRight size={20} className="mx-2 sm:mx-4 text-gray-500 rotate-90 sm:rotate-0 flex-shrink-0" />

        {/* Default Logo */}
        <div
          className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: colors.primary }}
        >
          <img
            src={defaultPhoto}
            alt="Default Logo"
            className="w-full h-full object-contain p-3 sm:p-4 filter brightness-0 invert opacity-90"
          />
        </div>
      </Flex>

      <p className="text-center text-xs sm:text-sm text-gray-600 mb-4 px-2">
        Are you sure you want to delete your profile photo? It will be replaced by the default logo.
      </p>
    </>
  );

  const renderClearDataContent = () => (
    <div className="py-2">
      {/* Warning Icon */}
      <Flex variant="center" className="mb-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${colors.primary}15` }}
        >
          <RefreshCw size={32} style={{ color: colors.primary }} />
        </div>
      </Flex>

      {/* Main Message */}
      <p className="text-center text-sm text-gray-700 mb-4 px-2">
        This will clear all your <strong>works</strong>, <strong>shifts</strong>, and <strong>settings</strong>.
        Your account credentials will remain intact.
      </p>

      {/* Session Warning */}
      <div
        className="flex items-center gap-3 p-3 rounded-lg mb-4"
        style={{ backgroundColor: `${colors.primary}10` }}
      >
        <LogOut size={20} style={{ color: colors.primary }} />
        <p className="text-xs sm:text-sm text-gray-600">
          Your session will be closed after clearing. You can log in again with the same credentials.
        </p>
      </div>

      {/* Premium Warning */}
      {isPremium && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <Crown size={20} className="text-amber-500 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-amber-700">
            Your <strong>Premium subscription</strong> will be cancelled automatically.
          </p>
        </div>
      )}
    </div>
  );

  const renderDeleteAccountContent = () => (
    <div className="py-2">
      {/* Danger Icon */}
      <Flex variant="center" className="mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-100">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
      </Flex>

      {/* Main Warning */}
      <p className="text-center text-sm text-gray-700 mb-4 px-2">
        <strong className="text-red-600">This action is irreversible.</strong> All your data, including
        works, shifts, and account information will be permanently deleted.
      </p>

      {/* Re-authentication Section */}
      <div className="mb-4">
        {isGoogleUser ? (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <Lock size={20} className="text-blue-500 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-blue-700">
              Click the button below to confirm with your <strong>Google account</strong>.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock size={16} className="text-gray-500" />
              Enter your password to confirm
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Re-auth Error */}
      {reAuthError && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
          <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-red-700">{reAuthError}</p>
        </div>
      )}

      {/* Farewell Message */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 mb-4">
        <p className="text-xs sm:text-sm text-gray-600 text-center w-full">
          We hope to see you again! You can create a new account anytime.
        </p>
      </div>

      {/* Premium Warning */}
      {isPremium && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <Crown size={20} className="text-amber-500 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-amber-700">
            Your <strong>Premium subscription</strong> will be cancelled automatically.
          </p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (variant) {
      case 'delete-photo':
        return renderDeletePhotoContent();
      case 'clear-data':
        return renderClearDataContent();
      case 'delete-account':
        return renderDeleteAccountContent();
      default:
        return renderDeletePhotoContent();
    }
  };

  const buttonColor = config.isDanger ? dangerColor : colors.primary;

  // Handle form submit with re-auth data for delete-account
  const handleSubmit = (e) => {
    e.preventDefault();
    if (variant === 'delete-account') {
      onConfirm(e, { password, isGoogleUser });
    } else {
      onConfirm(e);
    }
  };

  // For delete-account, disable button if email/password user hasn't entered password
  const isDeleteButtonDisabled = variant === 'delete-account' && !isGoogleUser && !password.trim();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title}
      icon={config.icon}
      showActions={false}
      loading={loading}
    >
      <form id={`confirm-${variant}-form`} onSubmit={handleSubmit}>
        {renderContent()}

        {/* Custom Actions Footer */}
        <div
          className="border-t p-3 sm:p-4 mt-4"
          style={{ borderTopColor: colors.transparent20 }}
        >
          <div className="w-full flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              themeColor={colors.primary}
              className="w-full sm:w-auto"
            >
              {config.cancelText}
            </Button>
            <Button
              type="submit"
              form={`confirm-${variant}-form`}
              loading={loading}
              loadingText={config.confirmLoadingText}
              disabled={loading || isDeleteButtonDisabled}
              bgColor={buttonColor}
              className="w-full sm:w-auto"
            >
              {config.confirmText}
            </Button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default ConfirmActionModal;
