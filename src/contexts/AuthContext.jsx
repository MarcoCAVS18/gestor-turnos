// src/contexts/AuthContext.jsx
import React, ***REMOVED*** createContext, useContext, useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
***REMOVED*** from 'firebase/auth';
import ***REMOVED*** auth, db ***REMOVED*** from '../services/firebase';
import ***REMOVED*** doc, setDoc, getDoc ***REMOVED*** from 'firebase/firestore';

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

  // Registrar usuario
  const signup = async (email, password, displayName) => ***REMOVED***
    try ***REMOVED***
      setError('');
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar perfil con displayName
      await updateProfile(userCredential.user, ***REMOVED*** displayName ***REMOVED***);
      
      // Crear documento de usuario en Firestore
      await setDoc(doc(db, 'usuarios', userCredential.user.uid), ***REMOVED***
        email,
        displayName,
        fechaCreacion: new Date(),
        ajustes: ***REMOVED***
          descuentoDefault: 15, // 15% de descuento por defecto
          moneda: '$',
          colorPrincipal: '#EC4899' // Rosa por defecto (pink-600)
        ***REMOVED***
      ***REMOVED***);
      
      return userCredential.user;
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al registrar usuario: ' + error.message);
      throw error;
    ***REMOVED***
  ***REMOVED***;

  // Iniciar sesión
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

  // Monitorear cambios en el estado de autenticación
  useEffect(() => ***REMOVED***
    const unsubscribe = onAuthStateChanged(auth, async (user) => ***REMOVED***
      setCurrentUser(user);
      setLoading(false);
    ***REMOVED***);

    return unsubscribe;
  ***REMOVED***, []);

  // Valores del contexto
  const value = ***REMOVED***
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    getUserData
  ***REMOVED***;

  return (
    <AuthContext.Provider value=***REMOVED***value***REMOVED***>
      ***REMOVED***!loading && children***REMOVED***
    </AuthContext.Provider>
  );
***REMOVED***;

export default AuthContext;