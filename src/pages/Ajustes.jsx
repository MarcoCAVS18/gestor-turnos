// src/pages/Ajustes.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Settings, User, LogOut, Edit2, Save, Clock, Smile, Sun, Sunset, Moon } from 'lucide-react';

// Nueva importación estructurada
import Button from '../components/ui/Button';

const Ajustes = () => {
  const { currentUser, logout, getUserData, updateUserName } = useAuth();
  const { 
    colorPrincipal: appColor, 
    emojiUsuario: appEmoji, 
    descuentoDefault: appDescuento,
    rangosTurnos: appRangos,
    guardarPreferencias,
    coloresTemáticos
  } = useApp();
  
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [descuentoDefault, setDescuentoDefault] = useState(appDescuento);
  const [emojiInput, setEmojiInput] = useState(appEmoji);
  const [rangosTurnos, setRangosTurnos] = useState(appRangos || {
    diurnoInicio: 6,
    diurnoFin: 14,
    tardeInicio: 14,
    tardeFin: 20,
    nocheInicio: 20
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Actualizar estados cuando cambian en el contexto
  useEffect(() => {
    setEmojiInput(appEmoji);
    setDescuentoDefault(appDescuento);
    if (appRangos) {
      setRangosTurnos(appRangos);
    }
  }, [appEmoji, appDescuento, appRangos]);
  
  // Colores disponibles
  const colores = [
    { name: 'Rosa', value: '#EC4899' }, 
    { name: 'Índigo', value: '#6366F1' }, 
    { name: 'Rojo', value: '#EF4444' }, 
    { name: 'Verde', value: '#10B981' }, 
    { name: 'Púrpura', value: '#8B5CF6' }, 
    { name: 'Azul', value: '#3B82F6' } 
  ];

  // Emojis comunes para sugerir
  const emojisComunes = ['😊', '😎', '🚀', '💼', '⭐', '🔥', '💻', '📊'];
  
  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        setDisplayName(currentUser.displayName || '');
        
        try {
          const userData = await getUserData(currentUser.uid);
          if (userData && userData.ajustes) {
            setDescuentoDefault(userData.ajustes.descuentoDefault || 15);
            if (userData.ajustes.rangosTurnos) {
              setRangosTurnos(userData.ajustes.rangosTurnos);
            }
          }
        } catch (error) {
          // Error ya manejado
        }
      }
    };
    
    loadUserData();
  }, [currentUser, getUserData]);
  
  // Función para cambiar el color en tiempo real
  const cambiarColor = (nuevoColor) => {
    guardarPreferencias({
      colorPrincipal: nuevoColor
    });
  };
  
  // Función para cambiar el emoji en tiempo real
  const cambiarEmoji = (nuevoEmoji) => {
    setEmojiInput(nuevoEmoji);
    guardarPreferencias({
      emojiUsuario: nuevoEmoji
    });
  };
  
  // Manejar cambios en el input de emoji
  const handleEmojiChange = (e) => {
    const valor = e.target.value;
    setEmojiInput(valor);
    
    if (valor.trim() === '') {
      guardarPreferencias({
        emojiUsuario: '😊'
      });
    } else {
      guardarPreferencias({
        emojiUsuario: valor
      });
    }
  };
  
  // Validar rangos de turnos
  const validarRangos = (rangos) => {
    if (rangos.diurnoInicio >= rangos.diurnoFin) {
      return 'La hora de inicio del turno diurno debe ser menor a la hora de fin';
    }
    if (rangos.tardeInicio >= rangos.tardeFin) {
      return 'La hora de inicio del turno de tarde debe ser menor a la hora de fin';
    }
    if (rangos.diurnoFin > rangos.tardeInicio) {
      return 'El turno de tarde debe comenzar después o al mismo tiempo que termina el diurno';
    }
    if (rangos.tardeFin > rangos.nocheInicio) {
      return 'El turno de noche debe comenzar después o al mismo tiempo que termina la tarde';
    }
    return null;
  };
  
  // Guardar configuración
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      setMessage('');
      setError('');
      
      // Validar rangos
      const errorValidacion = validarRangos(rangosTurnos);
      if (errorValidacion) {
        setError(errorValidacion);
        setLoading(false);
        return;
      }
      
      // Guardar descuento y rangos
      await guardarPreferencias({
        descuentoDefault,
        rangosTurnos
      });
      
      setMessage('Configuración guardada correctamente');
      
      setTimeout(() => {
        setLoading(false);
      }, 800);
      
    } catch (error) {
      setError('Error al guardar ajustes: ' + error.message);
      setLoading(false);
    }
  };
  
  // Guardar nombre
  const handleSaveName = async () => {
    try {
      setLoading(true);
      setError('');
      
      await updateUserName(displayName);
      
      setEditingName(false);
      setMessage('Nombre actualizado correctamente');
      
    } catch (error) {
      setError('Error al actualizar nombre: ' + error.message);
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
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': coloresTemáticos?.base || appColor }}
                />
                <Button
                  onClick={handleSaveName}
                  disabled={loading}
                  size="sm"
                  className="!p-2"
                  icon={Save}
                />
              </div>
            ) : (
              <div className="flex items-center">
                <div className="text-gray-900">{displayName}</div>
                <button
                  onClick={() => setEditingName(true)}
                  className="ml-2 transition-colors"
                  style={{ color: coloresTemáticos?.base || appColor }}
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
                className="w-16 h-10 border border-gray-300 rounded-md shadow-sm px-3 focus:outline-none focus:ring-2 text-xl"
                style={{ '--tw-ring-color': coloresTemáticos?.base || appColor }}
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
                  className="w-8 h-8 rounded-md flex items-center justify-center text-lg hover:bg-gray-100 transition-colors"
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
      
      {/* Nueva sección: Configuración de rangos de turnos */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Rangos de Turnos</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Configura los rangos de horarios para la detección automática de tipos de turno.
        </p>
        
        <div className="space-y-4">
          {/* Turno Diurno */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Sun className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="font-medium">Turno Diurno</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hora de inicio</label>
                <select
                  value={rangosTurnos.diurnoInicio}
                  onChange={(e) => setRangosTurnos({
                    ...rangosTurnos,
                    diurnoInicio: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': coloresTemáticos?.base || appColor }}
                >
                  {Array.from({length: 24}, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hora de fin</label>
                <select
                  value={rangosTurnos.diurnoFin}
                  onChange={(e) => setRangosTurnos({
                    ...rangosTurnos,
                    diurnoFin: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': coloresTemáticos?.base || appColor }}
                >
                  {Array.from({length: 24}, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Turno Tarde */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Sunset className="h-5 w-5 text-orange-500 mr-2" />
              <h3 className="font-medium">Turno Tarde</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hora de inicio</label>
                <select
                  value={rangosTurnos.tardeInicio}
                  onChange={(e) => setRangosTurnos({
                    ...rangosTurnos,
                    tardeInicio: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': coloresTemáticos?.base || appColor }}
                >
                  {Array.from({length: 24}, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hora de fin</label>
                <select
                  value={rangosTurnos.tardeFin}
                  onChange={(e) => setRangosTurnos({
                    ...rangosTurnos,
                    tardeFin: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': coloresTemáticos?.base || appColor }}
                >
                  {Array.from({length: 24}, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Turno Noche */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Moon className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium">Turno Noche</h3>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Hora de inicio</label>
              <select
                value={rangosTurnos.nocheInicio}
                onChange={(e) => setRangosTurnos({
                  ...rangosTurnos,
                  nocheInicio: parseInt(e.target.value)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': coloresTemáticos?.base || appColor }}
              >
                {Array.from({length: 24}, (_, i) => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">El turno de noche se extiende hasta el final del día</p>
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
            Porcentaje de descuento
          </label>
          <div className="flex rounded-md shadow-sm">
            <input
              type="number"
              min="0"
              max="100"
              value={descuentoDefault}
              onChange={(e) => setDescuentoDefault(Number(e.target.value))}
              className="flex-1 px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': coloresTemáticos?.base || appColor }}
              placeholder="15"
            />
            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              %
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Este descuento se aplicará por defecto a todos tus turnos y trabajos. Podrás modificarlo más adelante.
          </p>
          
          <Button
            onClick={handleSaveSettings}
            disabled={loading}
            loading={loading}
            className="w-full mt-4"
          >
            Guardar cambios
          </Button>
        </div>
      </div>
      
      {/* Sección de sesión */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center mb-4">
          <LogOut className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Sesión</h2>
        </div>
        
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          icon={LogOut}
        >
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
};

export default Ajustes;