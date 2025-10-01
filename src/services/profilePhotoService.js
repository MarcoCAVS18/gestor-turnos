// src/services/profilePhotoService.js

import { storage } from './firebase';
import { ref, getDownloadURL, deleteObject, uploadBytesResumable } from 'firebase/storage';

/**
 * Sube una foto de perfil al Storage de Firebase
 * @param {string} userId - ID del usuario
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} - URL de la imagen subida
 */
export const uploadProfilePhoto = async (userId, file) => {
  try {
    // Validar que el archivo sea una imagen
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }

    // Validar tamaño máximo (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('La imagen no puede superar los 5MB');
    }

    // Crear referencia en Storage
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile_${timestamp}.${fileExtension}`;
    const storagePath = `profile-photos/${userId}/${fileName}`;
    const storageRef = ref(storage, storagePath);

    // Metadata para el archivo
    const metadata = {
      contentType: file.type,
      customMetadata: {
        userId: userId,
        uploadedAt: new Date().toISOString()
      }
    };

    // Subir archivo con metadata
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Esperar a que termine la subida
    await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        () => {
          // Progreso de subida (opcional para barra de progreso futura)
        },
        (error) => {
          reject(error);
        },
        () => {
          resolve();
        }
      );
    });

    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Error al subir foto de perfil:', error);
    throw error;
  }
};

/**
 * Elimina la foto de perfil del usuario
 * @param {string} userId - ID del usuario
 */
export const deleteProfilePhoto = async (userId) => {
  try {
    // Intentar eliminar varios formatos comunes
    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    for (const ext of extensions) {
      try {
        const storageRef = ref(storage, `profile-photos/${userId}/profile.${ext}`);
        await deleteObject(storageRef);
      } catch (error) {
        // Si no existe el archivo con esta extensión, continuar
        if (error.code !== 'storage/object-not-found') {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('Error al eliminar foto de perfil:', error);
    throw error;
  }
};

/**
 * Obtiene la URL de la foto de perfil por defecto (logo)
 * @returns {string} - URL del logo por defecto
 */
export const getDefaultProfilePhoto = () => {
  return '/assets/SVG/logo.svg';
};
