// src/contexts/AuthContext.jsx

import React, ***REMOVED*** createContext, useContext, useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
***REMOVED*** from 'firebase/auth';
import ***REMOVED*** auth, db ***REMOVED*** from '../services/firebase';
import ***REMOVED*** doc, setDoc, getDoc, updateDoc ***REMOVED*** from 'firebase/firestore';
import ***REMOVED*** uploadProfilePhoto, deleteProfilePhoto, getDefaultProfilePhoto ***REMOVED*** from '../services/profilePhotoService';

// Create the context
const AuthContext = createContext();

// Custom hook to use the context
export const useAuth = () => ***REMOVED***
  return useContext(AuthContext);
***REMOVED***;

// Context provider
export const AuthProvider = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profilePhotoURL, setProfilePhotoURL] = useState(getDefaultProfilePhoto());

  // Register user
  const signup = async (email, password, displayName) => ***REMOVED***
    try ***REMOVED***
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with displayName
      await updateProfile(userCredential.user, ***REMOVED*** displayName ***REMOVED***);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), ***REMOVED***
        email,
        displayName,
        createdAt: new Date(),
        settings: ***REMOVED***
          defaultDiscount: 15,
          currency: '$',
          primaryColor: '#EC4899'
        ***REMOVED***
      ***REMOVED***);
      
      return userCredential.user;
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error registering user: ' + error.message);
      throw error;
    ***REMOVED***
  ***REMOVED***;

  // Sign in with email and password
  const login = async (email, password) => ***REMOVED***
    try ***REMOVED***
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error signing in: ' + error.message);
      throw error;
    ***REMOVED***
  ***REMOVED***;
  
  // Function to sign in with Google
  const loginWithGoogle = async () => ***REMOVED***
    try ***REMOVED***
      setError('');
      // Create a new provider instance each time
      const provider = new GoogleAuthProvider();
      
      // Ensure we request basic profile permissions
      provider.addScope('profile');
      provider.addScope('email');
      
      // Additional configuration
      provider.setCustomParameters(***REMOVED***
        'prompt': 'select_account'
      ***REMOVED***);
      
      // Use signInWithPopup instead of signInWithRedirect for better error handling
      const result = await signInWithPopup(auth, provider);
      
      // Check if it's the first time the user signs in with Google
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) ***REMOVED***
        // If first time, create user document in Firestore
        await setDoc(doc(db, 'users', result.user.uid), ***REMOVED***
          email: result.user.email,
          displayName: result.user.displayName || 'User',
          createdAt: new Date(),
          signupMethod: 'google',
          settings: ***REMOVED***
            defaultDiscount: 15,
            currency: '$',
            primaryColor: '#EC4899'
          ***REMOVED***
        ***REMOVED***);
      ***REMOVED***
      
      return result.user;
    ***REMOVED*** catch (error) ***REMOVED***
      if (error.code === 'auth/popup-closed-by-user') ***REMOVED***
        setError('Sign in process was cancelled. Please try again.');
      ***REMOVED*** else if (error.code === 'auth/popup-blocked') ***REMOVED***
        setError('The browser blocked the popup. Please allow popups and try again.');
      ***REMOVED*** else ***REMOVED***
        setError('Error signing in with Google: ' + error.message);
      ***REMOVED***
      throw error;
    ***REMOVED***
  ***REMOVED***;

  // Sign out
  const logout = async () => ***REMOVED***
    try ***REMOVED***
      setError('');
      await signOut(auth);
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error signing out: ' + error.message);
      throw error;
    ***REMOVED***
  ***REMOVED***;

  // Reset password
  const resetPassword = async (email) => ***REMOVED***
    try ***REMOVED***
      setError('');
      await sendPasswordResetEmail(auth, email);
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error resetting password: ' + error.message);
      throw error;
    ***REMOVED***
  ***REMOVED***;

  // Get user data
  const getUserData = async (userId) => ***REMOVED***
    try ***REMOVED***
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) ***REMOVED***
        return userDoc.data();
      ***REMOVED*** else ***REMOVED***
        return null;
      ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error getting user data: ' + error.message);
      throw error;
    ***REMOVED***
  ***REMOVED***;

  // Update user name
  const updateUserName = async (displayName) => ***REMOVED***
    try ***REMOVED***
      setError('');

      // Validate there is a user and a valid displayName
      if (!currentUser) throw new Error('No logged in user');
      if (!displayName.trim()) throw new Error('Name cannot be empty');

      // Update displayName in Firebase Auth
      await updateProfile(currentUser, ***REMOVED*** displayName ***REMOVED***);

      // Update in Firestore as well
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, ***REMOVED***
        displayName,
        updatedAt: new Date()
      ***REMOVED***);

      setCurrentUser(***REMOVED***...currentUser, displayName***REMOVED***);

      return true;
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error updating name: ' + error.message);
      throw error;
    ***REMOVED***
  ***REMOVED***;

  // Update profile photo
  const updateProfilePhoto = async (file) => ***REMOVED***
    try ***REMOVED***
      setError('');

      if (!currentUser) throw new Error('No logged in user');

      // Upload image to Storage and get URL
      const photoURL = await uploadProfilePhoto(currentUser.uid, file);

      // Update in Firebase Auth
      await updateProfile(currentUser, ***REMOVED*** photoURL ***REMOVED***);

      // Update in Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, ***REMOVED***
        photoURL,
        updatedAt: new Date()
      ***REMOVED***);

      // Update local state
      setProfilePhotoURL(photoURL);
      setCurrentUser(***REMOVED***...currentUser, photoURL***REMOVED***);

      return photoURL;
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error updating profile photo: ' + error.message);
      throw error;
    ***REMOVED***
  ***REMOVED***;

  // Remove profile photo
  const removeProfilePhoto = async () => ***REMOVED***
    try ***REMOVED***
      setError('');
  
      if (!currentUser) throw new Error('No logged in user');
      
      const currentPhotoURL = currentUser.photoURL;
  
      // If no photo, do nothing
      if (!currentPhotoURL) return;
  
      // Delete from Storage using the URL
      await deleteProfilePhoto(currentPhotoURL);
  
      // Update in Firebase Auth to null
      await updateProfile(currentUser, ***REMOVED*** photoURL: null ***REMOVED***);
  
      // Update in Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, ***REMOVED***
        photoURL: null,
        updatedAt: new Date()
      ***REMOVED***);
  
      // Force reload user state to get updated URL
      await auth.currentUser.reload();
      const updatedUser = auth.currentUser;
  
      // Revert to default logo and update state
      const defaultPhoto = getDefaultProfilePhoto();
      setProfilePhotoURL(defaultPhoto);
      setCurrentUser(updatedUser); // Use updated user
  
      return true;
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error removing profile photo: ' + error.message);
      throw error;
    ***REMOVED***
  ***REMOVED***;

  // Load user profile photo
  const loadProfilePhoto = async (user) => ***REMOVED***
    try ***REMOVED***
      if (!user) ***REMOVED***
        setProfilePhotoURL(getDefaultProfilePhoto());
        return;
      ***REMOVED***

      // First check if there is photoURL in Firebase Auth
      if (user.photoURL && user.photoURL.trim() !== '') ***REMOVED***
        setProfilePhotoURL(user.photoURL);
        return;
      ***REMOVED***

      // If not, check in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().photoURL && userDoc.data().photoURL.trim() !== '') ***REMOVED***
        setProfilePhotoURL(userDoc.data().photoURL);
      ***REMOVED*** else ***REMOVED***
        setProfilePhotoURL(getDefaultProfilePhoto());
      ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error loading profile photo:', error);
      setProfilePhotoURL(getDefaultProfilePhoto());
    ***REMOVED***
  ***REMOVED***;

  // Monitor authentication state changes
  useEffect(() => ***REMOVED***
    const unsubscribe = onAuthStateChanged(auth, (user) => ***REMOVED***
      setCurrentUser(user);
      loadProfilePhoto(user);
      setLoading(false);
    ***REMOVED***);

    return unsubscribe;
  ***REMOVED***, []);

  const value = ***REMOVED***
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
  ***REMOVED***;

  return (
    <AuthContext.Provider value=***REMOVED***value***REMOVED***>
      ***REMOVED***loading ? (
        <div className="hidden">Loading authentication state...</div> 
      ) : (
        children
      )***REMOVED***
    </AuthContext.Provider>
  );
***REMOVED***;

export default AuthProvider;