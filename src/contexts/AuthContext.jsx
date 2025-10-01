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

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => ***REMOVED***
  return useContext(AuthContext);
***REMOVED***;

// Proveedor del contexto
export const AuthProvider = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profilePhotoURL, setProfilePhotoURL] = useState(getDefaultProfilePhoto());

  // Registrar usuario
  const signup = async (email, password, displayName) => ***REMOVED***
    try ***REMOVED***
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar perfil con displayName
      await updateProfile(userCredential.user, ***REMOVED*** displayName ***REMOVED***);
      
      // Crear documento de usuario en Firestore
      await setDoc(doc(db, 'usuarios', userCredential.user.uid), ***REMOVED***
        email,
        displayName,
        fechaCreacion: new Date(),
        ajustes: ***REMOVED***
          descuentoDefault: 15,
          moneda: '$',
          colorPrincipal: '#EC4899'
        ***REMOVED***
      ***REMOVED***);
      
      return userCredential.user;
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al registrar usuario: ' + error.message);
      throw error;
    ***REMOVED***
  ***REMOVED***;

  // Iniciar sesión con email y contraseña
  const login = async (email, password) => ***REMOVED***
    try ***REMOVED***
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al iniciar sesión: ' + error.message);
      throw error;
    ***REMOVED***
  ***REMOVED***;
  
  // Función para iniciar sesión con Google
  const loginWithGoogle = async () => ***REMOVED***
    try ***REMOVED***
      setError('');
      // Crear una nueva instancia del proveedor cada vez
      const provider = new GoogleAuthProvider();
      
      // Asegurarnos de que solicitamos permisos de perfil básico
      provider.addScope('profile');
      provider.addScope('email');
      
      // Configuración adicional
      provider.setCustomParameters(***REMOVED***
        'prompt': 'select_account'
      ***REMOVED***);
      
      // Usar signInWithPopup en lugar de signInWithRedirect para mejor manejo de errores
      const result = await signInWithPopup(auth, provider);
      
      // Verificar si es la primera vez que el usuario inicia sesión con Google
      const userDoc = await getDoc(doc(db, 'usuarios', result.user.uid));
      
      if (!userDoc.exists()) ***REMOVED***
        // Si es la primera vez, crear documento de usuario en Firestore
        await setDoc(doc(db, 'usuarios', result.user.uid), ***REMOVED***
          email: result.user.email,
          displayName: result.user.displayName || 'Usuario',
          fechaCreacion: new Date(),
          metodoRegistro: 'google',
          ajustes: ***REMOVED***
            descuentoDefault: 15,
            moneda: '$',
            colorPrincipal: '#EC4899'
          ***REMOVED***
        ***REMOVED***);
      ***REMOVED***
      
      return result.user;
    ***REMOVED*** catch (error) ***REMOVED***
      if (error.code === 'auth/popup-closed-by-user') ***REMOVED***
        setError('El proceso de inicio de sesión fue cancelado. Por favor, inténtalo de nuevo.');
      ***REMOVED*** else if (error.code === 'auth/popup-blocked') ***REMOVED***
        setError('El navegador ha bloqueado el popup. Por favor, permite ventanas emergentes e inténtalo de nuevo.');
      ***REMOVED*** else ***REMOVED***
        setError('Error al iniciar sesión con Google: ' + error.message);
      ***REMOVED***
      throw error;
    ***REMOVED***
  ***REMOVED***;

  // Cerrar sesión
  const logout = async () => ***REMOVED***
    try ***REMOVED***
      setError('');
      await signOut(auth);
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al cerrar sesión: ' + error.message);
      throw error;
    ***REMOVED***
  ***REMOVED***;

  // Restablecer contraseña
  const resetPassword = async (email) => ***REMOVED***
    try ***REMOVED***
      setError('');
      await sendPasswordResetEmail(auth, email);
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al restablecer contraseña: ' + error.message);
      throw error;
    ***REMOVED***
  ***REMOVED***;

  // Obtener datos del usuario
  const getUserData = async (userId) => ***REMOVED***
    try ***REMOVED***
      const userDoc = await getDoc(doc(db, 'usuarios', userId));
      if (userDoc.exists()) ***REMOVED***
        return userDoc.data();
      ***REMOVED*** else ***REMOVED***
        return null;
      ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al obtener datos del usuario: ' + error.message);
      throw error;
    ***REMOVED***
  ***REMOVED***;

  // Actualizar nombre del usuario
  const updateUserName = async (displayName) => ***REMOVED***
    try ***REMOVED***
      setError('');

      // Validar que hay un usuario y un displayName válido
      if (!currentUser) throw new Error('No hay usuario logueado');
      if (!displayName.trim()) throw new Error('El nombre no puede estar vacío');

      // Actualizar el displayName en Firebase Auth
      await updateProfile(currentUser, ***REMOVED*** displayName ***REMOVED***);

      // Actualizar en Firestore también
      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      await updateDoc(userDocRef, ***REMOVED***
        displayName,
        fechaActualizacion: new Date()
      ***REMOVED***);

      setCurrentUser(***REMOVED***...currentUser, displayName***REMOVED***);

      return true;
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al actualizar nombre: ' + error.message);
      throw error;
    ***REMOVED***
  ***REMOVED***;

  // Actualizar foto de perfil
  const updateProfilePhoto = async (file) => ***REMOVED***
    try ***REMOVED***
      setError('');

      if (!currentUser) throw new Error('No hay usuario logueado');

      // Subir imagen a Storage y obtener URL
      const photoURL = await uploadProfilePhoto(currentUser.uid, file);

      // Actualizar en Firebase Auth
      await updateProfile(currentUser, ***REMOVED*** photoURL ***REMOVED***);

      // Actualizar en Firestore
      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      await updateDoc(userDocRef, ***REMOVED***
        photoURL,
        fechaActualizacion: new Date()
      ***REMOVED***);

      // Actualizar estado local
      setProfilePhotoURL(photoURL);
      setCurrentUser(***REMOVED***...currentUser, photoURL***REMOVED***);

      return photoURL;
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al actualizar foto de perfil: ' + error.message);
      throw error;
    ***REMOVED***
  ***REMOVED***;

  // Eliminar foto de perfil
  const removeProfilePhoto = async () => ***REMOVED***
    try ***REMOVED***
      setError('');

      if (!currentUser) throw new Error('No hay usuario logueado');

      // Eliminar del Storage
      await deleteProfilePhoto(currentUser.uid);

      // Actualizar en Firebase Auth (volver a null)
      await updateProfile(currentUser, ***REMOVED*** photoURL: null ***REMOVED***);

      // Actualizar en Firestore
      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      await updateDoc(userDocRef, ***REMOVED***
        photoURL: null,
        fechaActualizacion: new Date()
      ***REMOVED***);

      // Volver al logo por defecto
      const defaultPhoto = getDefaultProfilePhoto();
      setProfilePhotoURL(defaultPhoto);
      setCurrentUser(***REMOVED***...currentUser, photoURL: null***REMOVED***);

      return true;
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al eliminar foto de perfil: ' + error.message);
      throw error;
    ***REMOVED***
  ***REMOVED***;

  // Cargar foto de perfil del usuario
  const loadProfilePhoto = async (user) => ***REMOVED***
    try ***REMOVED***
      if (!user) ***REMOVED***
        setProfilePhotoURL(getDefaultProfilePhoto());
        return;
      ***REMOVED***

      // Primero verificar si hay photoURL en Firebase Auth
      if (user.photoURL) ***REMOVED***
        setProfilePhotoURL(user.photoURL);
        return;
      ***REMOVED***

      // Si no, verificar en Firestore
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      if (userDoc.exists() && userDoc.data().photoURL) ***REMOVED***
        setProfilePhotoURL(userDoc.data().photoURL);
      ***REMOVED*** else ***REMOVED***
        setProfilePhotoURL(getDefaultProfilePhoto());
      ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al cargar foto de perfil:', error);
      setProfilePhotoURL(getDefaultProfilePhoto());
    ***REMOVED***
  ***REMOVED***;

  // Monitorear cambios en el estado de autenticación
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
        <div className="hidden">Cargando estado de autenticación...</div> 
      ) : (
        children
      )***REMOVED***
    </AuthContext.Provider>
  );
***REMOVED***;

export default AuthContext;