// src/services/shareService.js

import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  addDoc,
  collection 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Generates a unique token to share a work
 * @returns {string}
 */
const generateShareToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
};

/**
 * Cleans and validates work data before sharing
 * @param {Object} work - Data of the work to share
 * @returns {Object} - Clean work data
 */
const cleanWorkData = (work) => {
  const cleanData = {};
  
  // Mandatory fields with default values
  cleanData.name = work.name || 'Unnamed Work';
  cleanData.description = work.description || '';
  cleanData.color = work.color || '#EC4899'; // Default color
  
  // For traditional works - include base rate
  if (work.baseRate !== undefined && work.baseRate !== null) {
    cleanData.baseRate = work.baseRate;
  }
  
  // For traditional works - include ALL special rates
  if (work.rates && typeof work.rates === 'object') {
    cleanData.rates = {};
    
    if (work.rates.day !== undefined && work.rates.day !== null) {
      cleanData.rates.day = work.rates.day;
    }
    if (work.rates.afternoon !== undefined && work.rates.afternoon !== null) {
      cleanData.rates.afternoon = work.rates.afternoon;
    }
    if (work.rates.night !== undefined && work.rates.night !== null) {
      cleanData.rates.night = work.rates.night;
    }
    if (work.rates.saturday !== undefined && work.rates.saturday !== null) {
      cleanData.rates.saturday = work.rates.saturday;
    }
    if (work.rates.sunday !== undefined && work.rates.sunday !== null) {
      cleanData.rates.sunday = work.rates.sunday;
    }
    
    // If no valid rates, remove the rates object
    if (Object.keys(cleanData.rates).length === 0) {
      delete cleanData.rates;
    }
  }
  
  // For delivery works
  if (work.type === 'delivery') {
    cleanData.type = 'delivery';
    
    // Include platform if it exists
    if (work.platform) {
      cleanData.platform = work.platform;
    }
    
    // Include vehicle
    if (work.vehicle) {
      cleanData.vehicle = work.vehicle;
    }
    
    // For delivery, use avatarColor if it exists, otherwise use normal color
    if (work.avatarColor) {
      cleanData.color = work.avatarColor;
    }
    
    if (work.settings) {
      cleanData.settings = work.settings;
    }
  }
  return cleanData;
};

/**
 * Creates a link to share a work directly via email or messaging
 * @param {string} userId - ID of the user sharing
 * @param {Object} work - Data of the work to share
 * @returns {Promise<string>} - URL of the share link
 */
export const createShareLink = async (userId, work) => {
  try {
    console.log('📤 Creating share link for work:', { userId, workId: work?.id, workName: work?.name });

    if (!userId) {
      throw new Error('User ID is required to share work');
    }
    if (!work) {
      throw new Error('Work data is required to share');
    }

    const token = generateShareToken();

    // Clean work data to avoid undefined
    const cleanWork = cleanWorkData(work);
    console.log('✅ Cleaned work data:', cleanWork);

    // Create temporary document in Firestore with work data
    const shareDocRef = doc(db, 'shared_works', token);

    const shareData = {
      // Clean work data (no undefined values)
      workData: cleanWork,
      // Share metadata
      sharedBy: userId,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      active: true,
      usesCount: 0,
      usageLimit: 10
    };

    console.log('💾 Saving share data to Firestore...');
    await setDoc(shareDocRef, shareData);

    // Generate full URL
    const baseUrl = window.location.origin || 'https://gestorwork.netlify.app';
    const shareLink = `${baseUrl}/share/${token}`;

    console.log('✅ Share link created successfully:', shareLink);
    return shareLink;

  } catch (error) {
    console.error('❌ Error creating share link:', error);
    throw new Error(`Could not create share link: ${error.message}`);
  }
};

/**
 * Function to share work using native mobile device APIs
 * @param {string} userId - ID of the user sharing
 * @param {Object} work - Data of the work to share
 */
export const shareWorkNative = async (userId, work) => {
  try {
    
    // Generate share link
    const link = await createShareLink(userId, work);
    
    // Personalized text for sharing based on type
    let message;
    if (work.type === 'delivery') {
      message = `I'm sharing the details of my delivery work "${work.name}"!`;
      if (work.platform) {
        message += ` It's for ${work.platform}`;
      }
      if (work.vehicle) {
        message += ` using ${work.vehicle}`;
      }
    } else {
      message = `I'm sharing the details of my work "${work.name}"!`;
      if (work.baseRate) {
        message += ` With base rate of $${work.baseRate}/hour`;
      }
    }
    
    const shareText = `${message}\n\nVisit this link for more info:\n${link}`;
    
    // Check if browser supports Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Work: ${work.name}`,
          text: message,
          url: link
        });
        return true;
      } catch (error) {
        // If user cancels or there is an error, use fallback
        if (error.name !== 'AbortError') {
          return await copyToClipboard(shareText);
        }
        // If user cancelled, do nothing more
        return false;
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      return await copyToClipboard(shareText);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Gets shared work data using the token
 * @param {string} token - Token of the shared link
 * @returns {Promise<Object|null>} - Shared work data or null if not exists/expired
 */
export const getSharedWork = async (token) => {
  try {
    
    const shareDocRef = doc(db, 'shared_works', token);
    const shareDoc = await getDoc(shareDocRef);
    
    if (!shareDoc.exists()) {
      throw new Error('The share link does not exist or has expired');
    }
    
    const data = shareDoc.data();
    
    // Check if the link is still active
    if (!data.active) {
      throw new Error('This share link is no longer active');
    }
    
    // Check if it has expired
    const now = new Date();
    const expiresDate = data.expiresAt.toDate();
    
    if (now > expiresDate) {
      // Mark as inactive
      await setDoc(shareDocRef, { ...data, active: false }, { merge: true });
      throw new Error('This share link has expired');
    }
    
    // Check usage limit
    if (data.usesCount >= data.usageLimit) {
      await setDoc(shareDocRef, { ...data, active: false }, { merge: true });
      throw new Error('This share link has reached its usage limit');
    }
    
    
    return {
      workData: data.workData,
      token: token,
      sharedBy: data.sharedBy,
      usesCount: data.usesCount
    };
    
  } catch (error) {
    throw error;
  }
};

/**
 * Accepts a shared work and adds it to the user profile
 * @param {string} userId - ID of the user accepting
 * @param {string} token - Token of the shared link
 * @returns {Promise<Object>} - Data of the added work
 */
export const acceptSharedWork = async (userId, token) => {
  try {
    
    const shareDocRef = doc(db, 'shared_works', token);
    const shareDoc = await getDoc(shareDocRef);
    
    if (!shareDoc.exists()) {
      throw new Error('The share link does not exist');
    }
    
    const data = shareDoc.data();
    
    // Check that the user is not the same who shared it
    if (data.sharedBy === userId) {
      throw new Error('You cannot add your own shared work');
    }
    
    // Determine correct collection based on type
    const isDelivery = data.workData.type === 'delivery';
    const collectionName = isDelivery ? 'works-delivery' : 'works';
    const userWorksRef = collection(db, 'users', userId, collectionName);
    
    const newWork = {
      ...data.workData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      origin: 'shared',
      sourceToken: token
    };
        
    const docRef = await addDoc(userWorksRef, newWork);
    
    // Increment usage counter
    await setDoc(shareDocRef, {
      ...data,
      usesCount: data.usesCount + 1
    }, { merge: true });
    
    
    return {
      id: docRef.id,
      ...newWork
    };
    
  } catch (error) {
    throw error;
  }
};

/**
 * Copies text to clipboard and shows a notification
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - true if copied successfully
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Use modern clipboard API
      await navigator.clipboard.writeText(text);
      
      // Show optional visual notification
      if (window.showToast) {
        window.showToast('Link copied to clipboard');
      } else {
      }
      
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (result) {
      }
      
      return result;
    }
  } catch (error) {
    return false;
  }
};