// src/services/profilePhotoService.js

import ***REMOVED*** storage ***REMOVED*** from './firebase';
import ***REMOVED*** ref, getDownloadURL, deleteObject, uploadBytesResumable ***REMOVED*** from 'firebase/storage';

/**
 * Sube una foto de perfil al Storage de Firebase
 * @param ***REMOVED***string***REMOVED*** userId - ID del usuario
 * @param ***REMOVED***File***REMOVED*** file - Archivo de imagen
 * @returns ***REMOVED***Promise<string>***REMOVED*** - URL de la imagen subida
 */
export const uploadProfilePhoto = async (userId, file) => ***REMOVED***
  try ***REMOVED***
    // Validar que el archivo sea una imagen
    if (!file.type.startsWith('image/')) ***REMOVED***
      throw new Error('El archivo debe ser una imagen');
    ***REMOVED***

    // Validar tamaño máximo (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) ***REMOVED***
      throw new Error('La imagen no puede superar los 5MB');
    ***REMOVED***

    // Crear referencia en Storage
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile_$***REMOVED***timestamp***REMOVED***.$***REMOVED***fileExtension***REMOVED***`;
    const storagePath = `profile-photos/$***REMOVED***userId***REMOVED***/$***REMOVED***fileName***REMOVED***`;
    const storageRef = ref(storage, storagePath);

    // Metadata para el archivo
    const metadata = ***REMOVED***
      contentType: file.type,
      customMetadata: ***REMOVED***
        userId: userId,
        uploadedAt: new Date().toISOString()
      ***REMOVED***
    ***REMOVED***;

    // Subir archivo con metadata
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Esperar a que termine la subida
    await new Promise((resolve, reject) => ***REMOVED***
      uploadTask.on(
        'state_changed',
        () => ***REMOVED***
          // Progreso de subida (opcional para barra de progreso futura)
        ***REMOVED***,
        (error) => ***REMOVED***
          reject(error);
        ***REMOVED***,
        () => ***REMOVED***
          resolve();
        ***REMOVED***
      );
    ***REMOVED***);

    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  ***REMOVED*** catch (error) ***REMOVED***
    console.error('Error al subir foto de perfil:', error);
    throw error;
  ***REMOVED***
***REMOVED***;

/**
 * Elimina la foto de perfil del usuario
 * @param ***REMOVED***string***REMOVED*** userId - ID del usuario
 */
export const deleteProfilePhoto = async (userId) => ***REMOVED***
  try ***REMOVED***
    // Intentar eliminar varios formatos comunes
    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    for (const ext of extensions) ***REMOVED***
      try ***REMOVED***
        const storageRef = ref(storage, `profile-photos/$***REMOVED***userId***REMOVED***/profile.$***REMOVED***ext***REMOVED***`);
        await deleteObject(storageRef);
      ***REMOVED*** catch (error) ***REMOVED***
        // Si no existe el archivo con esta extensión, continuar
        if (error.code !== 'storage/object-not-found') ***REMOVED***
          throw error;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED*** catch (error) ***REMOVED***
    console.error('Error al eliminar foto de perfil:', error);
    throw error;
  ***REMOVED***
***REMOVED***;

/**
 * Obtiene la URL de la foto de perfil por defecto (logo)
 * @returns ***REMOVED***string***REMOVED*** - URL del logo por defecto
 */
export const getDefaultProfilePhoto = () => ***REMOVED***
  return '/assets/SVG/logo.svg';
***REMOVED***;
