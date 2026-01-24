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

// Create the context
const AuthContext = createContext();

// Custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Context provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profilePhotoURL, setProfilePhotoURL] = useState(getDefaultProfilePhoto());

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
      setError('Error registering user: ' + error.message);
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
      setError('Error signing in: ' + error.message);
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
      
      // Use signInWithPopup instead of signInWithRedirect for better error handling
      const result = await signInWithPopup(auth, provider);
      
      // Check if it's the first time the user signs in with Google
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
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign in process was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('The browser blocked the popup. Please allow popups and try again.');
      } else {
        setError('Error signing in with Google: ' + error.message);
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
      setError('Error signing out: ' + error.message);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError('Error resetting password: ' + error.message);
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
      setError('Error getting user data: ' + error.message);
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
      setError('Error updating name: ' + error.message);
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
      setError('Error updating profile photo: ' + error.message);
      throw error;
    }
  };

  // Remove profile photo
  const removeProfilePhoto = async () => {
    try {
      setError('');
  
      if (!currentUser) throw new Error('No logged in user');
      
      const currentPhotoURL = currentUser.photoURL;
  
      // If no photo, do nothing
      if (!currentPhotoURL) return;
  
      // Delete from Storage using the URL
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
      const defaultPhoto = getDefaultProfilePhoto();
      setProfilePhotoURL(defaultPhoto);
      setCurrentUser(updatedUser); // Use updated user
  
      return true;
    } catch (error) {
      setError('Error removing profile photo: ' + error.message);
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
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().photoURL && userDoc.data().photoURL.trim() !== '') {
        setProfilePhotoURL(userDoc.data().photoURL);
      } else {
        setProfilePhotoURL(getDefaultProfilePhoto());
      }
    } catch (error) {
      console.error('Error loading profile photo:', error);
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