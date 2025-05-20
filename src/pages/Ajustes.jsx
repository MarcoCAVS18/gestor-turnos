// src/pages/Ajustes.jsx - Versión completa
import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from '../contexts/AuthContext';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** Settings, User, LogOut, Edit2, Save, Clock, Smile ***REMOVED*** from 'lucide-react';

const Ajustes = () => ***REMOVED***
  const ***REMOVED*** currentUser, logout, getUserData, updateUserName ***REMOVED*** = useAuth();
  const ***REMOVED*** 
    colorPrincipal: appColor, 
    emojiUsuario: appEmoji, 
    descuentoDefault: appDescuento,
    guardarPreferencias 
  ***REMOVED*** = useApp();
  
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [descuentoDefault, setDescuentoDefault] = useState(appDescuento);
  const [emojiInput, setEmojiInput] = useState(appEmoji);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Actualizar el emoji local cuando cambia en el contexto
  useEffect(() => ***REMOVED***
    setEmojiInput(appEmoji);
  ***REMOVED***, [appEmoji]);
  
  // Actualizar otros estados cuando cambian en el contexto
  useEffect(() => ***REMOVED***
    setDescuentoDefault(appDescuento);
  ***REMOVED***, [appDescuento]);
  
  // Colores disponibles
  const colores = [
    ***REMOVED*** name: 'Rosa', value: '#EC4899' ***REMOVED***, // pink-600
    ***REMOVED*** name: 'Índigo', value: '#6366F1' ***REMOVED***, // indigo-500
    ***REMOVED*** name: 'Rojo', value: '#EF4444' ***REMOVED***, // red-500
    ***REMOVED*** name: 'Verde', value: '#10B981' ***REMOVED***, // emerald-500
    ***REMOVED*** name: 'Púrpura', value: '#8B5CF6' ***REMOVED***, // violet-500
    ***REMOVED*** name: 'Azul', value: '#3B82F6' ***REMOVED*** // blue-500
  ];

  // Emojis comunes para sugerir
  const emojisComunes = ['😊', '😎', '🚀', '💼', '⭐', '🔥', '💻', '📊', '💰', '✨'];
  
  // Cargar datos del usuario
  useEffect(() => ***REMOVED***
    const loadUserData = async () => ***REMOVED***
      if (currentUser) ***REMOVED***
        setDisplayName(currentUser.displayName || '');
        
        try ***REMOVED***
          const userData = await getUserData(currentUser.uid);
          if (userData && userData.ajustes) ***REMOVED***
            setDescuentoDefault(userData.ajustes.descuentoDefault || 15);
          ***REMOVED***
        ***REMOVED*** catch (error) ***REMOVED***
          console.error('Error al cargar datos del usuario:', error);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***;
    
    loadUserData();
  ***REMOVED***, [currentUser, getUserData]);
  
  // Función para cambiar el color en tiempo real
  const cambiarColor = (nuevoColor) => ***REMOVED***
    // Actualizar inmediatamente en el contexto
    guardarPreferencias(***REMOVED***
      colorPrincipal: nuevoColor
    ***REMOVED***);
  ***REMOVED***;
  
  // Función para cambiar el emoji en tiempo real
  const cambiarEmoji = (nuevoEmoji) => ***REMOVED***
    setEmojiInput(nuevoEmoji);
    
    // Actualizar inmediatamente en el contexto
    guardarPreferencias(***REMOVED***
      emojiUsuario: nuevoEmoji
    ***REMOVED***);
  ***REMOVED***;
  
  // Manejar cambios en el input de emoji
  const handleEmojiChange = (e) => ***REMOVED***
    const valor = e.target.value;
    setEmojiInput(valor);
    
    // Solo actualizar en el contexto al terminar de escribir
    if (valor.trim() === '') ***REMOVED***
      // Si está vacío, usar un emoji predeterminado
      guardarPreferencias(***REMOVED***
        emojiUsuario: '😊'
      ***REMOVED***);
    ***REMOVED*** else ***REMOVED***
      guardarPreferencias(***REMOVED***
        emojiUsuario: valor
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;
  
  // Guardar descuento
  const handleSaveSettings = async () => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      setMessage('');
      setError('');
      
      // Guardar el descuento
      await guardarPreferencias(***REMOVED***
        descuentoDefault
      ***REMOVED***);
      
      setMessage('Configuración guardada correctamente');
      
      setTimeout(() => ***REMOVED***
        setLoading(false);
      ***REMOVED***, 800);
      
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al guardar ajustes: ' + error.message);
      console.error(error);
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;
  
  // Guardar nombre
  const handleSaveName = async () => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      setError('');
      
      // Usar la función actualizada para cambiar el nombre en Firebase
      await updateUserName(displayName);
      
      setEditingName(false);
      setMessage('Nombre actualizado correctamente');
      
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al actualizar nombre: ' + error.message);
      console.error(error);
    ***REMOVED*** finally ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;
  
  // Cerrar sesión
  const handleLogout = async () => ***REMOVED***
    try ***REMOVED***
      await logout();
      navigate('/login');
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al cerrar sesión: ' + error.message);
      console.error(error);
    ***REMOVED***
  ***REMOVED***;
  
  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold mb-6">Ajustes</h1>
      
      ***REMOVED***message && (
        <div className="bg-green-50 text-green-800 p-3 rounded-md mb-4">
          ***REMOVED***message***REMOVED***
        </div>
      )***REMOVED***
      
      ***REMOVED***error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          ***REMOVED***error***REMOVED***
        </div>
      )***REMOVED***
      
      ***REMOVED***/* Sección de perfil */***REMOVED***
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center mb-4">
          <User className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Perfil</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 text-gray-900">***REMOVED***currentUser?.email***REMOVED***</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            ***REMOVED***editingName ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value=***REMOVED***displayName***REMOVED***
                  onChange=***REMOVED***(e) => setDisplayName(e.target.value)***REMOVED***
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                  style=***REMOVED******REMOVED*** '--tw-ring-color': appColor ***REMOVED******REMOVED***
                />
                <button
                  onClick=***REMOVED***handleSaveName***REMOVED***
                  disabled=***REMOVED***loading***REMOVED***
                  className="ml-2 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style=***REMOVED******REMOVED*** backgroundColor: appColor ***REMOVED******REMOVED***
                >
                  <Save className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="text-gray-900">***REMOVED***displayName***REMOVED***</div>
                <button
                  onClick=***REMOVED***() => setEditingName(true)***REMOVED***
                  className="ml-2"
                  style=***REMOVED******REMOVED*** color: appColor ***REMOVED******REMOVED***
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            )***REMOVED***
          </div>
        </div>
      </div>
      
      ***REMOVED***/* Sección de personalización visual */***REMOVED***
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center mb-4">
          <Settings className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Personalización</h2>
        </div>
        
        <div className="space-y-6">
          ***REMOVED***/* Selección de emoji */***REMOVED***
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu emoji personal
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value=***REMOVED***emojiInput***REMOVED***
                onChange=***REMOVED***handleEmojiChange***REMOVED***
                className="w-16 h-10 border border-gray-300 rounded-md shadow-sm px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 text-xl"
                style=***REMOVED******REMOVED*** '--tw-ring-color': appColor ***REMOVED******REMOVED***
              />
              <p className="ml-3 text-sm text-gray-500">
                <Smile className="inline h-4 w-4 mb-1 mr-1" />
                Escribe o pega tu emoji favorito
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              ***REMOVED***emojisComunes.map(emoji => (
                <button
                  key=***REMOVED***emoji***REMOVED***
                  onClick=***REMOVED***() => cambiarEmoji(emoji)***REMOVED***
                  className="w-8 h-8 rounded-md flex items-center justify-center text-lg hover:bg-gray-100"
                >
                  ***REMOVED***emoji***REMOVED***
                </button>
              ))***REMOVED***
            </div>
          </div>
          
          ***REMOVED***/* Selección de color */***REMOVED***
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color principal
            </label>
            <div className="grid grid-cols-3 gap-3">
              ***REMOVED***colores.map((color) => (
                <button
                  key=***REMOVED***color.value***REMOVED***
                  onClick=***REMOVED***() => cambiarColor(color.value)***REMOVED***
                  className=***REMOVED***`p-3 flex flex-col items-center rounded-lg border transition-all $***REMOVED***
                    appColor === color.value 
                      ? 'border-gray-600 shadow-md' 
                      : 'border-gray-200'
                  ***REMOVED***`***REMOVED***
                >
                  <div 
                    className="w-8 h-8 rounded-full mb-1" 
                    style=***REMOVED******REMOVED*** backgroundColor: color.value ***REMOVED******REMOVED***
                  ></div>
                  <span className="text-xs">***REMOVED***color.name***REMOVED***</span>
                </button>
              ))***REMOVED***
            </div>
          </div>
        </div>
      </div>
      
      ***REMOVED***/* Sección de descuento */***REMOVED***
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
              value=***REMOVED***descuentoDefault***REMOVED***
              onChange=***REMOVED***(e) => setDescuentoDefault(Number(e.target.value))***REMOVED***
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
              style=***REMOVED******REMOVED*** '--tw-ring-color': appColor ***REMOVED******REMOVED***
            />
            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              %
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Este descuento se aplicará por defecto a todos tus turnos.
          </p>
          
          <button
            onClick=***REMOVED***handleSaveSettings***REMOVED***
            disabled=***REMOVED***loading***REMOVED***
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
            style=***REMOVED******REMOVED*** 
              backgroundColor: appColor,
              '--tw-ring-color': appColor 
            ***REMOVED******REMOVED***
          >
            ***REMOVED***loading ? 'Guardando...' : 'Guardar cambios'***REMOVED***
          </button>
        </div>
      </div>
      
      ***REMOVED***/* Sección de sesión */***REMOVED***
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center mb-4">
          <LogOut className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Sesión</h2>
        </div>
        
        <button
          onClick=***REMOVED***handleLogout***REMOVED***
          className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style=***REMOVED******REMOVED*** '--tw-ring-color': appColor ***REMOVED******REMOVED***
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
***REMOVED***;

export default Ajustes;