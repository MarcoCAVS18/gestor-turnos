// src/services/profilePhotoService.js

import { storage } from './firebase';
import { ref, getDownloadURL, deleteObject, uploadBytesResumable } from 'firebase/storage';
import logger from '../utils/logger';

/**
 * Uploads a profile photo to Firebase Storage
 * @param {string} userId - User ID
 * @param {File} file - Image file
 * @returns {Promise<string>} - URL of the uploaded image
 */
export const uploadProfilePhoto = async (userId, file) => {
  try {
    // Validate file type - only allow specific image formats
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Only image files (JPG, PNG, GIF, WEBP) are allowed');
    }

    // Validate file extension
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!validExtensions.includes(fileExtension)) {
      throw new Error('Invalid file extension. Use JPG, PNG, GIF, or WEBP');
    }

    // Validate max size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('The image cannot exceed 5MB');
    }

    // Create reference in Storage
    const timestamp = Date.now();
    const fileName = `profile_${timestamp}.${fileExtension}`;
    const storagePath = `profile-photos/${userId}/${fileName}`;
    const storageRef = ref(storage, storagePath);

    // Metadata for the file
    const metadata = {
      contentType: file.type,
      customMetadata: {
        userId: userId,
        uploadedAt: new Date().toISOString()
      }
    };

    // Upload file with metadata
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Wait for upload to finish
    await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        () => {
          // Upload progress (optional for future progress bar)
        },
        (error) => {
          reject(error);
        },
        () => {
          resolve();
        }
      );
    });

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    logger.error('Error uploading profile photo:', error);
    throw error;
  }
};

/**
 * Deletes the user's profile photo from the URL
 * @param {string} photoURL - URL of the profile photo to delete
 */
export const deleteProfilePhoto = async (photoURL) => {
  // If there is no URL or it's the default logo, nothing to do
  if (!photoURL || photoURL.includes('logo.svg')) {
    return;
  }

  try {
    // Get the reference of the file from the URL
    const storageRef = ref(storage, photoURL);
    await deleteObject(storageRef);
  } catch (error) {
    // If the file is not found, it may have already been deleted.
    if (error.code === 'storage/object-not-found') {
      logger.warn('Profile photo not found in Storage, possibly already deleted:', photoURL);
    } else {
      logger.error('Error deleting profile photo:', error);
      throw error;
    }
  }
};

/**
 * Gets the URL of the default profile photo (logo)
 * @returns {string} - URL of the default logo
 */
export const getDefaultProfilePhoto = () => {
  return '/assets/SVG/logo.svg';
};