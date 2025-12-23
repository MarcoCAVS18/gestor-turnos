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
 * Elimina la foto de perfil del usuario desde la URL
 * @param ***REMOVED***string***REMOVED*** photoURL - URL de la foto de perfil a eliminar
 */
export const deleteProfilePhoto = async (photoURL) => ***REMOVED***
  // Si no hay URL, no hay nada que hacer
  if (!photoURL || photoURL.includes('logo.svg')) ***REMOVED***
    console.log('No hay foto de perfil para eliminar o es la por defecto.');
    return;
  ***REMOVED***

  try ***REMOVED***
    // Obtener la referencia del archivo a partir de la URL
    const storageRef = ref(storage, photoURL);
    await deleteObject(storageRef);
  ***REMOVED*** catch (error) ***REMOVED***
    // Si el archivo no se encuentra, puede que ya haya sido eliminado.
    if (error.code === 'storage/object-not-found') ***REMOVED***
      console.warn('La foto de perfil no se encontró en Storage, posiblemente ya fue eliminada:', photoURL);
    ***REMOVED*** else ***REMOVED***
      console.error('Error al eliminar foto de perfil:', error);
      throw error;
    ***REMOVED***
  ***REMOVED***
***REMOVED***;

/**
 * Obtiene la URL de la foto de perfil por defecto (logo)
 * @returns ***REMOVED***string***REMOVED*** - URL del logo por defecto
 */
export const getDefaultProfilePhoto = () => ***REMOVED***
  return '/assets/SVG/logo.svg';
***REMOVED***;
