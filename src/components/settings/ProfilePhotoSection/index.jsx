// src/components/settings/ProfilePhotoSection/index.jsx

import React, ***REMOVED*** useState, useRef ***REMOVED*** from 'react';
import ***REMOVED*** Camera, Trash2, Upload ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const ProfilePhotoSection = (***REMOVED*** onError, onSuccess, className ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** profilePhotoURL, updateProfilePhoto, removeProfilePhoto ***REMOVED*** = useAuth();
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => ***REMOVED***
    const file = event.target.files?.[0];
    if (!file) return;

    try ***REMOVED***
      setUploading(true);

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) ***REMOVED***
        onError?.('Por favor selecciona una imagen válida');
        return;
      ***REMOVED***

      // Validar tamaño (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) ***REMOVED***
        onError?.('La imagen no puede superar los 5MB');
        return;
      ***REMOVED***

      await updateProfilePhoto(file);
      onSuccess?.('Foto de perfil actualizada correctamente');
    ***REMOVED*** catch (error) ***REMOVED***
      onError?.('Error al subir la foto: ' + error.message);
    ***REMOVED*** finally ***REMOVED***
      setUploading(false);
      // Limpiar el input
      if (fileInputRef.current) ***REMOVED***
        fileInputRef.current.value = '';
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***;

  const handleRemovePhoto = async () => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      await removeProfilePhoto();
      onSuccess?.('Foto de perfil eliminada correctamente');
    ***REMOVED*** catch (error) ***REMOVED***
      onError?.('Error al eliminar la foto: ' + error.message);
    ***REMOVED*** finally ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  const handleButtonClick = () => ***REMOVED***
    fileInputRef.current?.click();
  ***REMOVED***;

  const isDefaultPhoto = profilePhotoURL?.includes('logo.svg');

  return (
    <SettingsSection icon=***REMOVED***Camera***REMOVED*** title="Foto de perfil" className=***REMOVED***className***REMOVED***>
      <div className="space-y-4">
        ***REMOVED***/* Vista previa de la foto */***REMOVED***
        <div className="flex items-center gap-6">
          <div
            className="relative w-24 h-24 rounded-full overflow-hidden border-4"
            style=***REMOVED******REMOVED***
              borderColor: colors.transparent20,
              backgroundColor: isDefaultPhoto ? colors.primary : 'transparent'
            ***REMOVED******REMOVED***
          >
            <img
              src=***REMOVED***profilePhotoURL***REMOVED***
              alt="Foto de perfil"
              className=***REMOVED***`w-full h-full $***REMOVED***
                isDefaultPhoto
                  ? 'object-contain p-4 filter brightness-0 invert'
                  : 'object-cover'
              ***REMOVED***`***REMOVED***
              style=***REMOVED***
                isDefaultPhoto
                  ? ***REMOVED*** filter: 'brightness(0) invert(1)' ***REMOVED***
                  : ***REMOVED******REMOVED***
              ***REMOVED***
            />
          </div>

          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">
              ***REMOVED***isDefaultPhoto ? 'Logo por defecto' : 'Tu foto de perfil'***REMOVED***
            </h3>
            <p className="text-sm text-gray-500">
              JPG, PNG o GIF. Máximo 5MB.
            </p>
          </div>
        </div>

        ***REMOVED***/* Input de archivo oculto */***REMOVED***
        <input
          ref=***REMOVED***fileInputRef***REMOVED***
          type="file"
          accept="image/*"
          onChange=***REMOVED***handleFileSelect***REMOVED***
          className="hidden"
        />

        ***REMOVED***/* Botones de acción */***REMOVED***
        <div className="flex gap-3">
          <Button
            onClick=***REMOVED***handleButtonClick***REMOVED***
            disabled=***REMOVED***uploading || loading***REMOVED***
            loading=***REMOVED***uploading***REMOVED***
            icon=***REMOVED***Upload***REMOVED***
            themeColor=***REMOVED***colors.primary***REMOVED***
            className="flex-1"
          >
            ***REMOVED***uploading ? 'Subiendo...' : isDefaultPhoto ? 'Subir foto' : 'Cambiar foto'***REMOVED***
          </Button>

          ***REMOVED***!isDefaultPhoto && (
            <Button
              onClick=***REMOVED***handleRemovePhoto***REMOVED***
              disabled=***REMOVED***uploading || loading***REMOVED***
              loading=***REMOVED***loading***REMOVED***
              icon=***REMOVED***Trash2***REMOVED***
              variant="outline"
              themeColor=***REMOVED***colors.primary***REMOVED***
              className="flex-1"
            >
              Eliminar foto
            </Button>
          )***REMOVED***
        </div>

        ***REMOVED***/* Información adicional */***REMOVED***
        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
          <p>• Tu foto de perfil se mostrará en lugar del logo</p>
          <p>• En móvil, reemplazará el ícono de configuración en el menú</p>
          <p>• En escritorio, podrás cambiarla haciendo hover sobre el logo</p>
        </div>
      </div>
    </SettingsSection>
  );
***REMOVED***;

export default ProfilePhotoSection;
