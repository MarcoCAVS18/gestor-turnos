// src/components/modals/ConfirmDeleteProfilePhotoModal/index.jsx
import React from 'react';
import BaseModal from '../base/BaseModal';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { getDefaultProfilePhoto } from '../../../services/profilePhotoService';
import Flex from '../../ui/Flex';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Button from '../../ui/Button'; // Import Button component

const ConfirmDeleteProfilePhotoModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const { profilePhotoURL } = useAuth();
  const defaultPhoto = getDefaultProfilePhoto();
  const colors = useThemeColors();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Foto de Perfil"
      showActions={false}
      loading={loading}
    >
      <form id="delete-profile-photo-form" onSubmit={onConfirm}>
        <Flex variant="center" className="my-6">
          {/* Current Profile Photo */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center">
            <img
              src={profilePhotoURL}
              alt="Current Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <ArrowRight size={24} className="mx-4 text-gray-500" />

          {/* Default Logo */}
          <div
            className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <img
              src={defaultPhoto}
              alt="Default Logo"
              className="w-full h-full object-contain p-4 filter brightness-0 invert opacity-90"
            />
          </div>
        </Flex>

        <p className="text-center text-sm text-gray-600 mb-4">
          ¿Estás seguro de que quieres eliminar tu foto de perfil? Se reemplazará por el logo por defecto.
        </p>
        
        {/* Custom Actions Footer */}
        <div
          className="border-t p-4 mt-auto"
          style={{ borderTopColor: colors.transparent20 }}
        >
          <div className="w-full flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              themeColor={colors.primary}

            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="delete-profile-photo-form"
              loading={loading}
              loadingText="Eliminando..."
              disabled={loading}
              bgColor={colors.primary}
            >
              Confirmar Eliminación
            </Button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default ConfirmDeleteProfilePhotoModal;
