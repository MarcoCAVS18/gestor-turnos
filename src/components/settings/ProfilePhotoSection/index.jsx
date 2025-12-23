// src/components/settings/ProfilePhotoSection/index.jsx

import React, ***REMOVED*** useState, useRef ***REMOVED*** from 'react';
import ***REMOVED*** Camera, Trash2 ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';
import ConfirmDeleteProfilePhotoModal from '../../modals/ConfirmDeleteProfilePhotoModal'; // Import the new modal

const ProfilePhotoSection = (***REMOVED*** className ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** profilePhotoURL, updateProfilePhoto, removeProfilePhoto ***REMOVED*** = useAuth();
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State for the new modal
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => ***REMOVED***
    const file = event.target.files?.[0];
    if (!file) return;

    window.dispatchEvent(new CustomEvent('profile-photo-loading-start'));
    setUploading(true);
    try ***REMOVED***
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) ***REMOVED***
        return;
      ***REMOVED***

      // Validar tamaño (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) ***REMOVED***
        return;
      ***REMOVED***

      await updateProfilePhoto(file);
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al subir la foto: ' + error.message);
    ***REMOVED*** finally ***REMOVED***
      setUploading(false);
      window.dispatchEvent(new CustomEvent('profile-photo-loading-end'));
      // Limpiar el input
      if (fileInputRef.current) ***REMOVED***
        fileInputRef.current.value = '';
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***;

  const handleRemovePhoto = (e) => ***REMOVED***
    e.stopPropagation(); // Evitar que se abra el selector de archivos
    setShowConfirmModal(true); // Open the custom confirmation modal
  ***REMOVED***;

  const handleConfirmDelete = async (e) => ***REMOVED***
    e.preventDefault(); // Prevent form submission
    window.dispatchEvent(new CustomEvent('profile-photo-loading-start'));
    setLoading(true);
    try ***REMOVED***
      await removeProfilePhoto();
      setShowConfirmModal(false); // Close modal on success
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al eliminar la foto: ' + error.message);
    ***REMOVED*** finally ***REMOVED***
      setLoading(false);
      window.dispatchEvent(new CustomEvent('profile-photo-loading-end'));
    ***REMOVED***
  ***REMOVED***;

  const handleCloseConfirmModal = () => ***REMOVED***
    setShowConfirmModal(false);
  ***REMOVED***;

  const handleContainerClick = () => ***REMOVED***
    if (!uploading && !loading) ***REMOVED***
      fileInputRef.current?.click();
    ***REMOVED***
  ***REMOVED***;

  const isDefaultPhoto = profilePhotoURL?.includes('logo.svg');

  return (
    <Card variant="transparent" className=***REMOVED***className***REMOVED***>
      <div className="flex flex-col items-center justify-center py-2">
        
        ***REMOVED***/* Contenedor interactivo del avatar */***REMOVED***
        <div 
          className="relative group cursor-pointer"
          onClick=***REMOVED***handleContainerClick***REMOVED***
        >
          ***REMOVED***/* Círculo principal */***REMOVED***
          <div 
            className=***REMOVED***`
              relative w-32 h-32 lg:mt-6 rounded-full overflow-hidden border-4 shadow-lg transition-all duration-300
              $***REMOVED***uploading ? 'opacity-70 blur-sm' : 'group-hover:shadow-xl'***REMOVED***
            `***REMOVED***
            style=***REMOVED******REMOVED*** 
              borderColor: 'white',
              backgroundColor: isDefaultPhoto ? colors.primary : '#f3f4f6'
            ***REMOVED******REMOVED***
          >
            <img
              src=***REMOVED***profilePhotoURL***REMOVED***
              alt="Foto de perfil"
              className=***REMOVED***`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 $***REMOVED***
                isDefaultPhoto ? 'p-6 filter brightness-0 invert opacity-90' : ''
              ***REMOVED***`***REMOVED***
            />
            
            ***REMOVED***/* Overlay al hacer hover (Desktop) */***REMOVED***
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Camera className="text-white w-8 h-8 drop-shadow-md" />
            </div>

            ***REMOVED***/* Spinner de carga */***REMOVED***
            ***REMOVED***(uploading || loading) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-20">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )***REMOVED***
          </div>

          ***REMOVED***/* Badge de cámara (Visible siempre, estilo "Google/Instagram") */***REMOVED***
          <div 
            className="absolute bottom-1 right-1 bg-white p-2.5 rounded-full shadow-md border border-gray-100 text-gray-600 transition-all duration-200 group-hover:scale-110 group-hover:text-primary z-10"
            style=***REMOVED******REMOVED*** color: uploading ? colors.primary : undefined ***REMOVED******REMOVED***
          >
            <Camera size=***REMOVED***18***REMOVED*** />
          </div>
        </div>

        ***REMOVED***/* Textos y acciones */***REMOVED***
        <div className="mt-4 text-center space-y-2">
          <h3 className="font-medium text-gray-900">
            ***REMOVED***isDefaultPhoto ? 'Añade una foto' : 'Tu foto de perfil'***REMOVED***
          </h3>
          <p className="text-xs text-gray-500 max-w-[200px] mx-auto">
            Personaliza tu perfil con una foto tuya.
          </p>
          
          ***REMOVED***/* Botón de eliminar discreto */***REMOVED***
          ***REMOVED***!isDefaultPhoto && (
            <button 
              onClick=***REMOVED***handleRemovePhoto***REMOVED***
              disabled=***REMOVED***loading || uploading***REMOVED***
              className="mt-2 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-full transition-colors flex items-center gap-1.5 mx-auto"
            >
              <Trash2 size=***REMOVED***12***REMOVED*** />
              Eliminar foto
            </button>
          )***REMOVED***
        </div>

        ***REMOVED***/* Input oculto */***REMOVED***
        <input
          ref=***REMOVED***fileInputRef***REMOVED***
          type="file"
          accept="image/*"
          onChange=***REMOVED***handleFileSelect***REMOVED***
          className="hidden"
        />
      </div>

      ***REMOVED***/* Confirmation Modal */***REMOVED***
      <ConfirmDeleteProfilePhotoModal
        isOpen=***REMOVED***showConfirmModal***REMOVED***
        onClose=***REMOVED***handleCloseConfirmModal***REMOVED***
        onConfirm=***REMOVED***handleConfirmDelete***REMOVED***
        loading=***REMOVED***loading***REMOVED***
      />
    </Card>
  );
***REMOVED***;

export default ProfilePhotoSection;