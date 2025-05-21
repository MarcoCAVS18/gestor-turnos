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

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Registrar usuario
  const signup = async (email, password, displayName) => {
    try {
      setError('');
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar perfil con displayName
      await updateProfile(userCredential.user, { displayName });
      
      // Crear documento de usuario en Firestore
      await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
        email,
        displayName,
        fechaCreacion: new Date(),
        ajustes: {
          descuentoDefault: 15,
          moneda: '$',
          colorPrincipal: '#EC4899'
        }
      });
      
      return userCredential.user;
    } catch (error) {
      setError('Error al registrar usuario: ' + error.message);
      throw error;
    }
  };

  // Iniciar sesión con email y contraseña
  const login = async (email, password) => {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setError('Error al iniciar sesión: ' + error.message);
      throw error;
    }
  };
  
  // Función para iniciar sesión con Google
  const loginWithGoogle = async () => {
    try {
      setError('');
      // Crear una nueva instancia del proveedor cada vez
      const provider = new GoogleAuthProvider();
      
      // Asegurarnos de que solicitamos permisos de perfil básico
      provider.addScope('profile');
      provider.addScope('email');
      
      // Configuración adicional
      provider.setCustomParameters({
        'prompt': 'select_account'
      });
      
      // Usar signInWithPopup en lugar de signInWithRedirect para mejor manejo de errores
      const result = await signInWithPopup(auth, provider);
      
      // Verificar si es la primera vez que el usuario inicia sesión con Google
      const userDoc = await getDoc(doc(db, 'usuarios', result.user.uid));
      
      if (!userDoc.exists()) {
        // Si es la primera vez, crear documento de usuario en Firestore
        await setDoc(doc(db, 'usuarios', result.user.uid), {
          email: result.user.email,
          displayName: result.user.displayName || 'Usuario',
          fechaCreacion: new Date(),
          metodoRegistro: 'google',
          ajustes: {
            descuentoDefault: 15,
            moneda: '$',
            colorPrincipal: '#EC4899'
          }
        });
      }
      
      return result.user;
    } catch (error) {
      console.error('Error completo al iniciar sesión con Google:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError('El proceso de inicio de sesión fue cancelado. Por favor, inténtalo de nuevo.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('El navegador ha bloqueado el popup. Por favor, permite ventanas emergentes e inténtalo de nuevo.');
      } else {
        setError('Error al iniciar sesión con Google: ' + error.message);
      }
      throw error;
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
    } catch (error) {
      setError('Error al cerrar sesión: ' + error.message);
      throw error;
    }
  };

  // Restablecer contraseña
  const resetPassword = async (email) => {
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError('Error al restablecer contraseña: ' + error.message);
      throw error;
    }
  };

  // Obtener datos del usuario
  const getUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'usuarios', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        return null;
      }
    } catch (error) {
      setError('Error al obtener datos del usuario: ' + error.message);
      throw error;
    }
  };

  // Añadir esta función al AuthProvider
const updateUserName = async (displayName) => {
    try {
      setError('');
      
      // Validar que hay un usuario y un displayName válido
      if (!currentUser) throw new Error('No hay usuario logueado');
      if (!displayName.trim()) throw new Error('El nombre no puede estar vacío');
      
      // Actualizar el displayName en Firebase Auth
      await updateProfile(currentUser, { displayName });
      
      // Actualizar en Firestore también
      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      await updateDoc(userDocRef, { 
        displayName, 
        fechaActualizacion: new Date() 
      });
      
      setCurrentUser({...currentUser, displayName});
      
      return true;
    } catch (error) {
      console.error('Error al actualizar nombre:', error);
      setError('Error al actualizar nombre: ' + error.message);
      throw error;
    }
  };

  // Monitorear cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Valores del contexto
  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    getUserData,
    updateUserName
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="hidden">Cargando estado de autenticación...</div> 
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;