// src/pages/Ajustes.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Settings, User, LogOut, Edit2, Save, Clock } from 'lucide-react';
import Header from '../components/Header';
import Navegacion from '../components/Navegacion';

const Ajustes = () => {
  const { currentUser, logout, getUserData } = useAuth();
  const { userSettings } = useApp();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [descuentoDefault, setDescuentoDefault] = useState(userSettings.descuentoDefault);
  const [colorPrincipal, setColorPrincipal] = useState(userSettings.colorPrincipal);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Colores disponibles
  const colores = [
    { name: 'Rosa', value: '#EC4899' }, // pink-600
    { name: 'Índigo', value: '#6366F1' }, // indigo-500
    { name: 'Rojo', value: '#EF4444' }, // red-500
    { name: 'Verde', value: '#10B981' }, // emerald-500
    { name: 'Púrpura', value: '#8B5CF6' }, // violet-500
    { name: 'Azul', value: '#3B82F6' } // blue-500
  ];
  
  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        setDisplayName(currentUser.displayName || '');
        
        try {
          const userData = await getUserData(currentUser.uid);
          if (userData && userData.ajustes) {
            setDescuentoDefault(userData.ajustes.descuentoDefault || 15);
            setColorPrincipal(userData.ajustes.colorPrincipal || '#EC4899');
          }
        } catch (error) {
          console.error('Error al cargar datos del usuario:', error);
        }
      }
    };
    
    loadUserData();
  }, [currentUser, getUserData]);
  
  // Guardar ajustes
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      setMessage('');
      setError('');
      
      // Actualizar documento en Firestore
      const userRef = doc(db, 'usuarios', currentUser.uid);
      await updateDoc(userRef, {
        'ajustes.descuentoDefault': descuentoDefault,
        'ajustes.colorPrincipal': colorPrincipal
      });
      
      setMessage('Ajustes guardados correctamente');
      
      // Recargar la página para aplicar los cambios
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      setError('Error al guardar ajustes: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Guardar nombre
  const handleSaveName = async () => {
    try {
      setLoading(true);
      
      // Actualizar documento en Firestore
      const userRef = doc(db, 'usuarios', currentUser.uid);
      await updateDoc(userRef, {
        displayName: displayName
      });
      
      setEditingName(false);
      setMessage('Nombre actualizado correctamente');
      
    } catch (error) {
      setError('Error al actualizar nombre: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Cerrar sesión
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Error al cerrar sesión: ' + error.message);
      console.error(error);
    }
  };
  
  return (
    <div className="font-poppins bg-gray-100 min-h-screen pb-20">
      <Header 
        vistaActual="ajustes" 
      />
      
      <main className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6">Ajustes</h1>
        
        {message && (
          <div className="bg-green-50 text-green-800 p-3 rounded-md mb-4">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {/* Sección de perfil */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Perfil</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 text-gray-900">{currentUser?.email}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              {editingName ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={loading}
                    className="ml-2 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="text-gray-900">{displayName}</div>
                  <button
                    onClick={() => setEditingName(true)}
                    className="ml-2 text-pink-600 hover:text-pink-800"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sección de preferencias */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center mb-4">
            <Settings className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Preferencias</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descuento por defecto
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={descuentoDefault}
                  onChange={(e) => setDescuentoDefault(Number(e.target.value))}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  %
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Este descuento se aplicará por defecto a todos tus turnos.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color principal
              </label>
              <div className="grid grid-cols-3 gap-3">
                {colores.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setColorPrincipal(color.value)}
                    className={`p-3 flex flex-col items-center rounded-lg border transition-all ${
                      colorPrincipal === color.value 
                        ? 'border-gray-600 shadow-md' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-full mb-1" 
                      style={{ backgroundColor: color.value }}
                    ></div>
                    <span className="text-xs">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
        
        {/* Sección de sesión */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Sesión</h2>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </button>
        </div>
      </main>
      
      <Navegacion vistaActual="ajustes" />
    </div>
  );
};

export default Ajustes;