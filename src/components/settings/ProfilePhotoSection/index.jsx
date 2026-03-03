// src/components/settings/ProfilePhotoSection/index.jsx

import React, { useState, useRef } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';
import ConfirmDeleteProfilePhotoModal from '../../modals/ConfirmDeleteProfilePhotoModal';
import logger from '../../../utils/logger';

const ProfilePhotoSection = ({ className }) => {
  const { profilePhotoURL, updateProfilePhoto, removeProfilePhoto } = useAuth();
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    window.dispatchEvent(new CustomEvent('profile-photo-loading-start'));
    setUploading(true);
    try {
      if (!file.type.startsWith('image/')) {
        return;
      }

      // Max 5 MB
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return;
      }

      await updateProfilePhoto(file);
    } catch (error) {
      logger.error('Error uploading photo: ' + error.message);
    } finally {
      setUploading(false);
      window.dispatchEvent(new CustomEvent('profile-photo-loading-end'));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setShowConfirmModal(true); // Open the custom confirmation modal
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault(); // Prevent form submission
    window.dispatchEvent(new CustomEvent('profile-photo-loading-start'));
    setLoading(true);
    try {
      await removeProfilePhoto();
      setShowConfirmModal(false); // Close modal on success
    } catch (error) {
      logger.error('Error removing photo: ' + error.message);
    } finally {
      setLoading(false);
      window.dispatchEvent(new CustomEvent('profile-photo-loading-end'));
    }
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleContainerClick = () => {
    if (!uploading && !loading) {
      fileInputRef.current?.click();
    }
  };

  const isDefaultPhoto = profilePhotoURL?.includes('logo.svg');

  return (
    <Card variant="transparent" className={className}>
      <div className="flex flex-col items-center justify-center py-2">
        
        {/* Avatar container */}
        <div
          className="relative group cursor-pointer"
          onClick={handleContainerClick}
        >
          {/* Avatar circle */}
          <div
            className={`
              relative w-32 h-32 lg:mt-6 rounded-full overflow-hidden border-4 shadow-lg transition-all duration-300
              ${uploading ? 'opacity-70 blur-sm' : 'group-hover:shadow-xl'}
            `}
            style={{
              borderColor: 'white',
              backgroundColor: isDefaultPhoto ? colors.primary : '#f3f4f6'
            }}
          >
            <img
              src={profilePhotoURL}
              alt="User avatar"
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                isDefaultPhoto ? 'p-6 filter brightness-0 invert opacity-90' : ''
              }`}
              onError={(e) => { e.target.style.display = 'none'; }}
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Camera className="text-white w-8 h-8 drop-shadow-md" />
            </div>

            {/* Loading spinner */}
            {(uploading || loading) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-20">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Camera badge */}
          <div
            className="absolute bottom-1 right-1 bg-white p-2.5 rounded-full shadow-md border border-gray-100 text-gray-600 transition-all duration-200 group-hover:scale-110 group-hover:text-primary z-10"
            style={{ color: uploading ? colors.primary : undefined }}
          >
            <Camera size={18} />
          </div>
        </div>

        {/* Text and actions */}
        <div className="mt-4 text-center space-y-2">
          <h3 className="font-medium text-gray-900">
            {isDefaultPhoto ? 'Add a photo' : 'Your profile photo'}
          </h3>
          <p className="text-xs text-gray-500 max-w-[200px] mx-auto">
            Personalize your profile with a photo.
          </p>

          {!isDefaultPhoto && (
            <button
              onClick={handleRemovePhoto}
              disabled={loading || uploading}
              className="mt-2 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-full transition-colors flex items-center gap-1.5 mx-auto"
            >
              <Trash2 size={12} />
              Remove photo
            </button>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmDeleteProfilePhotoModal
        isOpen={showConfirmModal}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
    </Card>
  );
};

export default ProfilePhotoSection;