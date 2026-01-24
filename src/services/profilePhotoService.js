// src/services/profilePhotoService.js

import ***REMOVED*** storage ***REMOVED*** from './firebase';
import ***REMOVED*** ref, getDownloadURL, deleteObject, uploadBytesResumable ***REMOVED*** from 'firebase/storage';

/**
 * Uploads a profile photo to Firebase Storage
 * @param ***REMOVED***string***REMOVED*** userId - User ID
 * @param ***REMOVED***File***REMOVED*** file - Image file
 * @returns ***REMOVED***Promise<string>***REMOVED*** - URL of the uploaded image
 */
export const uploadProfilePhoto = async (userId, file) => ***REMOVED***
  try ***REMOVED***
    // Validate that the file is an image
    if (!file.type.startsWith('image/')) ***REMOVED***
      throw new Error('The file must be an image');
    ***REMOVED***

    // Validate max size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) ***REMOVED***
      throw new Error('The image cannot exceed 5MB');
    ***REMOVED***

    // Create reference in Storage
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile_$***REMOVED***timestamp***REMOVED***.$***REMOVED***fileExtension***REMOVED***`;
    const storagePath = `profile-photos/$***REMOVED***userId***REMOVED***/$***REMOVED***fileName***REMOVED***`;
    const storageRef = ref(storage, storagePath);

    // Metadata for the file
    const metadata = ***REMOVED***
      contentType: file.type,
      customMetadata: ***REMOVED***
        userId: userId,
        uploadedAt: new Date().toISOString()
      ***REMOVED***
    ***REMOVED***;

    // Upload file with metadata
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Wait for upload to finish
    await new Promise((resolve, reject) => ***REMOVED***
      uploadTask.on(
        'state_changed',
        () => ***REMOVED***
          // Upload progress (optional for future progress bar)
        ***REMOVED***,
        (error) => ***REMOVED***
          reject(error);
        ***REMOVED***,
        () => ***REMOVED***
          resolve();
        ***REMOVED***
      );
    ***REMOVED***);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  ***REMOVED*** catch (error) ***REMOVED***
    console.error('Error uploading profile photo:', error);
    throw error;
  ***REMOVED***
***REMOVED***;

/**
 * Deletes the user's profile photo from the URL
 * @param ***REMOVED***string***REMOVED*** photoURL - URL of the profile photo to delete
 */
export const deleteProfilePhoto = async (photoURL) => ***REMOVED***
  // If there is no URL, there is nothing to do
  if (!photoURL || photoURL.includes('logo.svg')) ***REMOVED***
    console.log('No profile photo to delete or it is the default one.');
    return;
  ***REMOVED***

  try ***REMOVED***
    // Get the reference of the file from the URL
    const storageRef = ref(storage, photoURL);
    await deleteObject(storageRef);
  ***REMOVED*** catch (error) ***REMOVED***
    // If the file is not found, it may have already been deleted.
    if (error.code === 'storage/object-not-found') ***REMOVED***
      console.warn('Profile photo not found in Storage, possibly already deleted:', photoURL);
    ***REMOVED*** else ***REMOVED***
      console.error('Error deleting profile photo:', error);
      throw error;
    ***REMOVED***
  ***REMOVED***
***REMOVED***;

/**
 * Gets the URL of the default profile photo (logo)
 * @returns ***REMOVED***string***REMOVED*** - URL of the default logo
 */
export const getDefaultProfilePhoto = () => ***REMOVED***
  return '/assets/SVG/logo.svg';
***REMOVED***;