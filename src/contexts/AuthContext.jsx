// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { uploadProfilePhoto, deleteProfilePhoto, getDefaultProfilePhoto } from '../services/profilePhotoService';
import { hasProfanity } from '../utils/profanityFilter';
import logger from '../utils/logger';

// Create context
const AuthContext = createContext();

// Custom hook to use context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Context provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profilePhotoURL, setProfilePhotoURL] = useState(getDefaultProfilePhoto());
  const [resetAttempts, setResetAttempts] = useState({});

  // Register user
  const signup = async (email, password, displayName) => {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with displayName
      await updateProfile(userCredential.user, { displayName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        displayName,
        createdAt: new Date(),
        settings: {
          defaultDiscount: 15,
          currency: '$',
          primaryColor: '#EC4899'
        }
      });
      
      return userCredential.user;
    } catch (error) {
      logger.error('Signup error:', error);
      setError('Error creating account. Please try again.');
      throw error;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      logger.error('Login error:', error);
      setError('Incorrect email or password.');
      throw error;
    }
  };
  
  // Function to sign in with Google
  const loginWithGoogle = async () => {
    try {
      setError('');
      // Create a new provider instance each time
      const provider = new GoogleAuthProvider();
      
      // Ensure we request basic profile permissions
      provider.addScope('profile');
      provider.addScope('email');
      
      // Additional configuration
      provider.setCustomParameters({
        'prompt': 'select_account'
      });
      
      // Use signInWithPopup - Firebase handles => popup window correctly
      const result = await signInWithPopup(auth, provider);
      
      // Check if it's first time user signs in with Google
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // If first time, create user document in Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          displayName: result.user.displayName || 'User',
          createdAt: new Date(),
          signupMethod: 'google',
          settings: {
            defaultDiscount: 15,
            currency: '$',
            primaryColor: '#EC4899'
          }
        });
      }
      
      return result.user;
    } catch (error) {
      // Handle specific Google Auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup was blocked by the browser. Please allow popups for this site and try again.');
      } else if (error.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Google Sign-In. Please contact support.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setError('Sign in was cancelled. Please try again.');
      } else if (error.message && error.message.includes('Cross-Origin-Opener')) {
        // Handle Cross-Origin-Opener-Policy error
        setError('Browser blocked => Google sign-in window. Please check your popup blocker settings and try again.');
      } else {
        setError('Could not sign in with Google. Please try again.');
      }
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
    } catch (error) {
      logger.error('Logout error:', error);
      setError('Error signing out. Please try again.');
      throw error;
    }
  };

  // Reset password with rate limiting
  const resetPassword = async (email) => {
    const now = Date.now();
    const lastAttempt = resetAttempts[email] || 0;
    const COOLDOWN_MS = 60000; // 1 minute

    // Check if user is in cooldown period
    if (now - lastAttempt < COOLDOWN_MS) {
      const remainingSeconds = Math.ceil((COOLDOWN_MS - (now - lastAttempt)) / 1000);
      const errorMsg = `Please wait ${remainingSeconds} seconds before requesting another password reset`;
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    // Update last attempt time
    setResetAttempts(prev => ({ ...prev, [email]: now }));

    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      logger.error('Password reset error:', error);
      setError('Error sending reset email. Please try again.');
      throw error;
    }
  };

  // Get user data
  const getUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        return null;
      }
    } catch (error) {
      logger.error('Get user data error:', error);
      setError('Error loading user data. Please try again.');
      throw error;
    }
  };

  // Update user name
  const updateUserName = async (displayName) => {
    try {
      setError('');

      // Validate there is a user and a valid displayName
      if (!currentUser) throw new Error('No logged in user');
      if (!displayName.trim()) throw new Error('Name cannot be empty');
      if (hasProfanity(displayName)) throw new Error('Please choose an appropriate name');

      // Update displayName in Firebase Auth
      await updateProfile(currentUser, { displayName });

      // Update in Firestore as well
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        displayName,
        updatedAt: new Date()
      });

      setCurrentUser({...currentUser, displayName});

      return true;
    } catch (error) {
      logger.error('Update name error:', error);
      setError('Error updating name. Please try again.');
      throw error;
    }
  };

  // Update profile photo
  const updateProfilePhoto = async (file) => {
    try {
      setError('');

      if (!currentUser) throw new Error('No logged in user');

      // Upload image to Storage and get URL
      const photoURL = await uploadProfilePhoto(currentUser.uid, file);

      // Update in Firebase Auth
      await updateProfile(currentUser, { photoURL });

      // Update in Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        photoURL,
        updatedAt: new Date()
      });

      // Update local state
      setProfilePhotoURL(photoURL);
      setCurrentUser({...currentUser, photoURL});

      return photoURL;
    } catch (error) {
      logger.error('Update photo error:', error);
      setError('Error updating profile photo. Please try again.');
      throw error;
    }
  };

  // Remove profile photo
  const removeProfilePhoto = async () => {
    try {
      setError('');

      if (!currentUser) throw new Error('No logged in user');

      // Use profilePhotoURL from state as fallback (might be loaded from Firestore)
      const currentPhotoURL = currentUser.photoURL || profilePhotoURL;
      const defaultPhoto = getDefaultProfilePhoto();

      // If no photo or is already default, do nothing
      if (!currentPhotoURL || currentPhotoURL === defaultPhoto || currentPhotoURL.includes('logo.svg')) {
        return;
      }
  
      // Delete from Storage using => URL
      await deleteProfilePhoto(currentPhotoURL);
  
      // Update in Firebase Auth to null
      await updateProfile(currentUser, { photoURL: null });
  
      // Update in Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        photoURL: null,
        updatedAt: new Date()
      });
  
      // Force reload user state to get updated URL
      await auth.currentUser.reload();
      const updatedUser = auth.currentUser;

      // Revert to default logo and update state
      setProfilePhotoURL(defaultPhoto);
      setCurrentUser(updatedUser); // Use updated user
  
      return true;
    } catch (error) {
      logger.error('Remove photo error:', error);
      setError('Error removing profile photo. Please try again.');
      throw error;
    }
  };

  // Load user profile photo
  const loadProfilePhoto = async (user) => {
    try {
      if (!user) {
        setProfilePhotoURL(getDefaultProfilePhoto());
        return;
      }

      // First check if there is photoURL in Firebase Auth
      if (user.photoURL && user.photoURL.trim() !== '') {
        setProfilePhotoURL(user.photoURL);
        return;
      }

      // If not, check in Firestore
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists() && userDoc.data().photoURL && userDoc.data().photoURL.trim() !== '') {
          const photoURL = userDoc.data().photoURL;

          // Check if it's a default logo or a valid Storage URL
          if (photoURL.startsWith('/assets/SVG/logo.svg') || photoURL.startsWith('http')) {
            // It's a default logo or a valid URL, use it
            setProfilePhotoURL(photoURL);
          } else {
            // It might be an old Storage URL that no longer exists, use default
            logger.warn('Profile photo URL appears to be invalid, using default logo');
            setProfilePhotoURL(getDefaultProfilePhoto());
          }
        } else {
          setProfilePhotoURL(getDefaultProfilePhoto());
        }
      } catch (firestoreError) {
        // If there's any Firestore error, use default photo
        logger.warn('Error accessing Firestore for profile photo, using default:', firestoreError);
        setProfilePhotoURL(getDefaultProfilePhoto());
      }
    } catch (error) {
      // If there's any Storage-related error, use default photo
      logger.error('Error loading profile photo, using default logo:', error);

      // Log => specific error for debugging
      if (error.code === 'storage/unauthorized') {
        logger.error('Storage access unauthorized. Check Storage rules.');
      } else if (error.code === 'storage/object-not-found') {
        logger.warn('Profile photo file not found in Storage, using default logo.');
      } else if (error.message && error.message.includes('Missing or insufficient permissions')) {
        logger.warn('Storage permissions issue. Using default profile photo.');
      }

      // Always set to default photo on error to prevent blocking => app
      setProfilePhotoURL(getDefaultProfilePhoto());
    }
  };

  // Monitor authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      loadProfilePhoto(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    profilePhotoURL,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    getUserData,
    updateUserName,
    updateProfilePhoto,
    removeProfilePhoto
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="hidden">Loading authentication state...</div> 
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;