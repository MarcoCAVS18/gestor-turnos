// src/components/settings/ProfilePhotoSection/index.jsx

import React, { useState, useRef } from 'react';
import { Camera, Trash2, Upload } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const ProfilePhotoSection = ({ onError, onSuccess, className }) => {
  const { profilePhotoURL, updateProfilePhoto, removeProfilePhoto } = useAuth();
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        onError?.('Por favor selecciona una imagen válida');
        return;
      }

      // Validar tamaño (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        onError?.('La imagen no puede superar los 5MB');
        return;
      }

      await updateProfilePhoto(file);
      onSuccess?.('Foto de perfil actualizada correctamente');
    } catch (error) {
      onError?.('Error al subir la foto: ' + error.message);
    } finally {
      setUploading(false);
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setLoading(true);
      await removeProfilePhoto();
      onSuccess?.('Foto de perfil eliminada correctamente');
    } catch (error) {
      onError?.('Error al eliminar la foto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const isDefaultPhoto = profilePhotoURL?.includes('logo.svg');

  return (
    <SettingsSection icon={Camera} title="Foto de perfil" className={className}>
      <div className="space-y-4">
        {/* Vista previa de la foto */}
        <div className="flex items-center gap-6">
          <div
            className="relative w-24 h-24 rounded-full overflow-hidden border-4"
            style={{
              borderColor: colors.transparent20,
              backgroundColor: isDefaultPhoto ? colors.primary : 'transparent'
            }}
          >
            <img
              src={profilePhotoURL}
              alt="Foto de perfil"
              className={`w-full h-full ${
                isDefaultPhoto
                  ? 'object-contain p-4 filter brightness-0 invert'
                  : 'object-cover'
              }`}
              style={
                isDefaultPhoto
                  ? { filter: 'brightness(0) invert(1)' }
                  : {}
              }
            />
          </div>

          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">
              {isDefaultPhoto ? 'Logo por defecto' : 'Tu foto de perfil'}
            </h3>
            <p className="text-sm text-gray-500">
              JPG, PNG o GIF. Máximo 5MB.
            </p>
          </div>
        </div>

        {/* Input de archivo oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Botones de acción */}
        <div className="flex gap-3">
          <Button
            onClick={handleButtonClick}
            disabled={uploading || loading}
            loading={uploading}
            icon={Upload}
            themeColor={colors.primary}
            className="flex-1"
          >
            {uploading ? 'Subiendo...' : isDefaultPhoto ? 'Subir foto' : 'Cambiar foto'}
          </Button>

          {!isDefaultPhoto && (
            <Button
              onClick={handleRemovePhoto}
              disabled={uploading || loading}
              loading={loading}
              icon={Trash2}
              variant="outline"
              themeColor={colors.primary}
              className="flex-1"
            >
              Eliminar foto
            </Button>
          )}
        </div>

        {/* Información adicional */}
        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
          <p>• Tu foto de perfil se mostrará en lugar del logo</p>
          <p>• En móvil, reemplazará el ícono de configuración en el menú</p>
          <p>• En escritorio, podrás cambiarla haciendo hover sobre el logo</p>
        </div>
      </div>
    </SettingsSection>
  );
};

export default ProfilePhotoSection;
