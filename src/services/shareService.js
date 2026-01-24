// src/services/shareService.js

import ***REMOVED*** 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  addDoc,
  collection 
***REMOVED*** from 'firebase/firestore';
import ***REMOVED*** db ***REMOVED*** from './firebase';

/**
 * Generates a unique token to share a work
 * @returns ***REMOVED***string***REMOVED***
 */
const generateShareToken = () => ***REMOVED***
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
***REMOVED***;

/**
 * Cleans and validates work data before sharing
 * @param ***REMOVED***Object***REMOVED*** work - Data of the work to share
 * @returns ***REMOVED***Object***REMOVED*** - Clean work data
 */
const cleanWorkData = (work) => ***REMOVED***
  const cleanData = ***REMOVED******REMOVED***;
  
  // Mandatory fields with default values
  cleanData.name = work.name || 'Unnamed Work';
  cleanData.description = work.description || '';
  cleanData.color = work.color || '#EC4899'; // Default color
  
  // For traditional works - include base rate
  if (work.baseRate !== undefined && work.baseRate !== null) ***REMOVED***
    cleanData.baseRate = work.baseRate;
  ***REMOVED***
  
  // For traditional works - include ALL special rates
  if (work.rates && typeof work.rates === 'object') ***REMOVED***
    cleanData.rates = ***REMOVED******REMOVED***;
    
    if (work.rates.day !== undefined && work.rates.day !== null) ***REMOVED***
      cleanData.rates.day = work.rates.day;
    ***REMOVED***
    if (work.rates.afternoon !== undefined && work.rates.afternoon !== null) ***REMOVED***
      cleanData.rates.afternoon = work.rates.afternoon;
    ***REMOVED***
    if (work.rates.night !== undefined && work.rates.night !== null) ***REMOVED***
      cleanData.rates.night = work.rates.night;
    ***REMOVED***
    if (work.rates.saturday !== undefined && work.rates.saturday !== null) ***REMOVED***
      cleanData.rates.saturday = work.rates.saturday;
    ***REMOVED***
    if (work.rates.sunday !== undefined && work.rates.sunday !== null) ***REMOVED***
      cleanData.rates.sunday = work.rates.sunday;
    ***REMOVED***
    
    // If no valid rates, remove the rates object
    if (Object.keys(cleanData.rates).length === 0) ***REMOVED***
      delete cleanData.rates;
    ***REMOVED***
  ***REMOVED***
  
  // For delivery works
  if (work.type === 'delivery') ***REMOVED***
    cleanData.type = 'delivery';
    
    // Include platform if it exists
    if (work.platform) ***REMOVED***
      cleanData.platform = work.platform;
    ***REMOVED***
    
    // Include vehicle
    if (work.vehicle) ***REMOVED***
      cleanData.vehicle = work.vehicle;
    ***REMOVED***
    
    // For delivery, use avatarColor if it exists, otherwise use normal color
    if (work.avatarColor) ***REMOVED***
      cleanData.color = work.avatarColor;
    ***REMOVED***
    
    if (work.settings) ***REMOVED***
      cleanData.settings = work.settings;
    ***REMOVED***
  ***REMOVED***
  return cleanData;
***REMOVED***;

/**
 * Creates a link to share a work directly via email or messaging
 * @param ***REMOVED***string***REMOVED*** userId - ID of the user sharing
 * @param ***REMOVED***Object***REMOVED*** work - Data of the work to share
 * @returns ***REMOVED***Promise<string>***REMOVED*** - URL of the share link
 */
export const createShareLink = async (userId, work) => ***REMOVED***
  try ***REMOVED***    
    const token = generateShareToken();
    
    // Clean work data to avoid undefined
    const cleanWork = cleanWorkData(work);
        
    // Create temporary document in Firestore with work data
    const shareDocRef = doc(db, 'shared_works', token);
    
    const shareData = ***REMOVED***
      // Clean work data (no undefined values)
      workData: cleanWork,
      // Share metadata
      sharedBy: userId,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      active: true,
      usesCount: 0,
      usageLimit: 10
    ***REMOVED***;
        
    await setDoc(shareDocRef, shareData);
    
    // Generate full URL
    const baseUrl = window.location.origin || 'https://gestorwork.netlify.app';
    const shareLink = `$***REMOVED***baseUrl***REMOVED***/share/$***REMOVED***token***REMOVED***`;
    
    return shareLink;
    
  ***REMOVED*** catch (error) ***REMOVED***
    throw new Error('Could not create share link');
  ***REMOVED***
***REMOVED***;

/**
 * Function to share work using native mobile device APIs
 * @param ***REMOVED***string***REMOVED*** userId - ID of the user sharing
 * @param ***REMOVED***Object***REMOVED*** work - Data of the work to share
 */
export const shareWorkNative = async (userId, work) => ***REMOVED***
  try ***REMOVED***
    
    // Generate share link
    const link = await createShareLink(userId, work);
    
    // Personalized text for sharing based on type
    let message;
    if (work.type === 'delivery') ***REMOVED***
      message = `I'm sharing the details of my delivery work "$***REMOVED***work.name***REMOVED***"!`;
      if (work.platform) ***REMOVED***
        message += ` It's for $***REMOVED***work.platform***REMOVED***`;
      ***REMOVED***
      if (work.vehicle) ***REMOVED***
        message += ` using $***REMOVED***work.vehicle***REMOVED***`;
      ***REMOVED***
    ***REMOVED*** else ***REMOVED***
      message = `I'm sharing the details of my work "$***REMOVED***work.name***REMOVED***"!`;
      if (work.baseRate) ***REMOVED***
        message += ` With base rate of $$***REMOVED***work.baseRate***REMOVED***/hour`;
      ***REMOVED***
    ***REMOVED***
    
    const shareText = `$***REMOVED***message***REMOVED***\n\nVisit this link for more info:\n$***REMOVED***link***REMOVED***`;
    
    // Check if browser supports Web Share API
    if (navigator.share) ***REMOVED***
      try ***REMOVED***
        await navigator.share(***REMOVED***
          title: `Work: $***REMOVED***work.name***REMOVED***`,
          text: message,
          url: link
        ***REMOVED***);
        return true;
      ***REMOVED*** catch (error) ***REMOVED***
        // If user cancels or there is an error, use fallback
        if (error.name !== 'AbortError') ***REMOVED***
          return await copyToClipboard(shareText);
        ***REMOVED***
        // If user cancelled, do nothing more
        return false;
      ***REMOVED***
    ***REMOVED*** else ***REMOVED***
      // Fallback for browsers that don't support Web Share API
      return await copyToClipboard(shareText);
    ***REMOVED***
  ***REMOVED*** catch (error) ***REMOVED***
    throw error;
  ***REMOVED***
***REMOVED***;

/**
 * Gets shared work data using the token
 * @param ***REMOVED***string***REMOVED*** token - Token of the shared link
 * @returns ***REMOVED***Promise<Object|null>***REMOVED*** - Shared work data or null if not exists/expired
 */
export const getSharedWork = async (token) => ***REMOVED***
  try ***REMOVED***
    
    const shareDocRef = doc(db, 'shared_works', token);
    const shareDoc = await getDoc(shareDocRef);
    
    if (!shareDoc.exists()) ***REMOVED***
      throw new Error('The share link does not exist or has expired');
    ***REMOVED***
    
    const data = shareDoc.data();
    
    // Check if the link is still active
    if (!data.active) ***REMOVED***
      throw new Error('This share link is no longer active');
    ***REMOVED***
    
    // Check if it has expired
    const now = new Date();
    const expiresDate = data.expiresAt.toDate();
    
    if (now > expiresDate) ***REMOVED***
      // Mark as inactive
      await setDoc(shareDocRef, ***REMOVED*** ...data, active: false ***REMOVED***, ***REMOVED*** merge: true ***REMOVED***);
      throw new Error('This share link has expired');
    ***REMOVED***
    
    // Check usage limit
    if (data.usesCount >= data.usageLimit) ***REMOVED***
      await setDoc(shareDocRef, ***REMOVED*** ...data, active: false ***REMOVED***, ***REMOVED*** merge: true ***REMOVED***);
      throw new Error('This share link has reached its usage limit');
    ***REMOVED***
    
    
    return ***REMOVED***
      workData: data.workData,
      token: token,
      sharedBy: data.sharedBy,
      usesCount: data.usesCount
    ***REMOVED***;
    
  ***REMOVED*** catch (error) ***REMOVED***
    throw error;
  ***REMOVED***
***REMOVED***;

/**
 * Accepts a shared work and adds it to the user profile
 * @param ***REMOVED***string***REMOVED*** userId - ID of the user accepting
 * @param ***REMOVED***string***REMOVED*** token - Token of the shared link
 * @returns ***REMOVED***Promise<Object>***REMOVED*** - Data of the added work
 */
export const acceptSharedWork = async (userId, token) => ***REMOVED***
  try ***REMOVED***
    
    const shareDocRef = doc(db, 'shared_works', token);
    const shareDoc = await getDoc(shareDocRef);
    
    if (!shareDoc.exists()) ***REMOVED***
      throw new Error('The share link does not exist');
    ***REMOVED***
    
    const data = shareDoc.data();
    
    // Check that the user is not the same who shared it
    if (data.sharedBy === userId) ***REMOVED***
      throw new Error('You cannot add your own shared work');
    ***REMOVED***
    
    // Determine correct collection based on type
    const isDelivery = data.workData.type === 'delivery';
    const collectionName = isDelivery ? 'works-delivery' : 'works';
    const userWorksRef = collection(db, 'users', userId, collectionName);
    
    const newWork = ***REMOVED***
      ...data.workData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      origin: 'shared',
      sourceToken: token
    ***REMOVED***;
        
    const docRef = await addDoc(userWorksRef, newWork);
    
    // Increment usage counter
    await setDoc(shareDocRef, ***REMOVED***
      ...data,
      usesCount: data.usesCount + 1
    ***REMOVED***, ***REMOVED*** merge: true ***REMOVED***);
    
    
    return ***REMOVED***
      id: docRef.id,
      ...newWork
    ***REMOVED***;
    
  ***REMOVED*** catch (error) ***REMOVED***
    throw error;
  ***REMOVED***
***REMOVED***;

/**
 * Copies text to clipboard and shows a notification
 * @param ***REMOVED***string***REMOVED*** text - Text to copy
 * @returns ***REMOVED***Promise<boolean>***REMOVED*** - true if copied successfully
 */
export const copyToClipboard = async (text) => ***REMOVED***
  try ***REMOVED***
    if (navigator.clipboard && window.isSecureContext) ***REMOVED***
      // Use modern clipboard API
      await navigator.clipboard.writeText(text);
      
      // Show optional visual notification
      if (window.showToast) ***REMOVED***
        window.showToast('Link copied to clipboard');
      ***REMOVED*** else ***REMOVED***
      ***REMOVED***
      
      return true;
    ***REMOVED*** else ***REMOVED***
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
      
      if (result) ***REMOVED***
      ***REMOVED***
      
      return result;
    ***REMOVED***
  ***REMOVED*** catch (error) ***REMOVED***
    return false;
  ***REMOVED***
***REMOVED***;