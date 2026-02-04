// src/components/modals/ConfirmDeleteProfilePhotoModal/index.jsx

import React from 'react';
import BaseModal from '../base/BaseModal';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { getDefaultProfilePhoto } from '../../../services/profilePhotoService';
import Flex from '../../ui/Flex';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Button from '../../ui/Button'; 

const ConfirmDeleteProfilePhotoModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const { profilePhotoURL } = useAuth();
  const defaultPhoto = getDefaultProfilePhoto();
  const colors = useThemeColors();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Profile Photo"
      showActions={false}
      loading={loading}
    >
      <form id="delete-profile-photo-form" onSubmit={onConfirm}>
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

        {/* Custom Actions Footer */}
        <div
          className="border-t p-3 sm:p-4 mt-auto"
          style={{ borderTopColor: colors.transparent20 }}
        >
          <div className="w-full flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              themeColor={colors.primary}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="delete-profile-photo-form"
              loading={loading}
              loadingText="Deleting..."
              disabled={loading}
              bgColor={colors.primary}
              className="w-full sm:w-auto"
            >
              Confirm Deletion
            </Button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default ConfirmDeleteProfilePhotoModal;