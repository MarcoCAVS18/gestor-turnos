// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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
          descuentoDefault: 15, // 15% de descuento por defecto
          moneda: '$',
          colorPrincipal: '#EC4899' // Rosa por defecto (pink-600)
        }
      });
      
      return userCredential.user;
    } catch (error) {
      setError('Error al registrar usuario: ' + error.message);
      throw error;
    }
  };

  // Iniciar sesión
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

  // Monitorear cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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
    logout,
    resetPassword,
    getUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;