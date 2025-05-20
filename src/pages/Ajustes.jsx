// src/pages/Ajustes.jsx - Versión completa
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Settings, User, LogOut, Edit2, Save, Clock, Smile } from 'lucide-react';

const Ajustes = () => {
  const { currentUser, logout, getUserData, updateUserName } = useAuth();
  const { 
    colorPrincipal: appColor, 
    emojiUsuario: appEmoji, 
    descuentoDefault: appDescuento,
    guardarPreferencias 
  } = useApp();
  
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [descuentoDefault, setDescuentoDefault] = useState(appDescuento);
  const [emojiInput, setEmojiInput] = useState(appEmoji);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Actualizar el emoji local cuando cambia en el contexto
  useEffect(() => {
    setEmojiInput(appEmoji);
  }, [appEmoji]);
  
  // Actualizar otros estados cuando cambian en el contexto
  useEffect(() => {
    setDescuentoDefault(appDescuento);
  }, [appDescuento]);
  
  // Colores disponibles
  const colores = [
    { name: 'Rosa', value: '#EC4899' }, // pink-600
    { name: 'Índigo', value: '#6366F1' }, // indigo-500
    { name: 'Rojo', value: '#EF4444' }, // red-500
    { name: 'Verde', value: '#10B981' }, // emerald-500
    { name: 'Púrpura', value: '#8B5CF6' }, // violet-500
    { name: 'Azul', value: '#3B82F6' } // blue-500
  ];

  // Emojis comunes para sugerir
  const emojisComunes = ['😊', '😎', '🚀', '💼', '⭐', '🔥', '💻', '📊', '💰', '✨'];
  
  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        setDisplayName(currentUser.displayName || '');
        
        try {
          const userData = await getUserData(currentUser.uid);
          if (userData && userData.ajustes) {
            setDescuentoDefault(userData.ajustes.descuentoDefault || 15);
          }
        } catch (error) {
          console.error('Error al cargar datos del usuario:', error);
        }
      }
    };
    
    loadUserData();
  }, [currentUser, getUserData]);
  
  // Función para cambiar el color en tiempo real
  const cambiarColor = (nuevoColor) => {
    // Actualizar inmediatamente en el contexto
    guardarPreferencias({
      colorPrincipal: nuevoColor
    });
  };
  
  // Función para cambiar el emoji en tiempo real
  const cambiarEmoji = (nuevoEmoji) => {
    setEmojiInput(nuevoEmoji);
    
    // Actualizar inmediatamente en el contexto
    guardarPreferencias({
      emojiUsuario: nuevoEmoji
    });
  };
  
  // Manejar cambios en el input de emoji
  const handleEmojiChange = (e) => {
    const valor = e.target.value;
    setEmojiInput(valor);
    
    // Solo actualizar en el contexto al terminar de escribir
    if (valor.trim() === '') {
      // Si está vacío, usar un emoji predeterminado
      guardarPreferencias({
        emojiUsuario: '😊'
      });
    } else {
      guardarPreferencias({
        emojiUsuario: valor
      });
    }
  };
  
  // Guardar descuento
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      setMessage('');
      setError('');
      
      // Guardar el descuento
      await guardarPreferencias({
        descuentoDefault
      });
      
      setMessage('Configuración guardada correctamente');
      
      setTimeout(() => {
        setLoading(false);
      }, 800);
      
    } catch (error) {
      setError('Error al guardar ajustes: ' + error.message);
      console.error(error);
      setLoading(false);
    }
  };
  
  // Guardar nombre
  const handleSaveName = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Usar la función actualizada para cambiar el nombre en Firebase
      await updateUserName(displayName);
      
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
    <div className="py-6">
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                  style={{ '--tw-ring-color': appColor }}
                />
                <button
                  onClick={handleSaveName}
                  disabled={loading}
                  className="ml-2 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ backgroundColor: appColor }}
                >
                  <Save className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="text-gray-900">{displayName}</div>
                <button
                  onClick={() => setEditingName(true)}
                  className="ml-2"
                  style={{ color: appColor }}
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Sección de personalización visual */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center mb-4">
          <Settings className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Personalización</h2>
        </div>
        
        <div className="space-y-6">
          {/* Selección de emoji */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu emoji personal
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={emojiInput}
                onChange={handleEmojiChange}
                className="w-16 h-10 border border-gray-300 rounded-md shadow-sm px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 text-xl"
                style={{ '--tw-ring-color': appColor }}
              />
              <p className="ml-3 text-sm text-gray-500">
                <Smile className="inline h-4 w-4 mb-1 mr-1" />
                Escribe o pega tu emoji favorito
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {emojisComunes.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => cambiarEmoji(emoji)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-lg hover:bg-gray-100"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          {/* Selección de color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color principal
            </label>
            <div className="grid grid-cols-3 gap-3">
              {colores.map((color) => (
                <button
                  key={color.value}
                  onClick={() => cambiarColor(color.value)}
                  className={`p-3 flex flex-col items-center rounded-lg border transition-all ${
                    appColor === color.value 
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
        </div>
      </div>
      
      {/* Sección de descuento */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Configuración de trabajo</h2>
        </div>
        
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
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
              style={{ '--tw-ring-color': appColor }}
            />
            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              %
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Este descuento se aplicará por defecto a todos tus turnos.
          </p>
          
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
            style={{ 
              backgroundColor: appColor,
              '--tw-ring-color': appColor 
            }}
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
      
      {/* Sección de sesión */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center mb-4">
          <LogOut className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Sesión</h2>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ '--tw-ring-color': appColor }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Ajustes;