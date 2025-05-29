// src/pages/Ajustes.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from '../contexts/AuthContext';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** Settings, User, LogOut, Edit2, Save, Clock, Smile, Sun, Sunset, Moon ***REMOVED*** from 'lucide-react';

// Nueva importación estructurada
import Button from '../components/ui/Button';

const Ajustes = () => ***REMOVED***
  const ***REMOVED*** currentUser, logout, getUserData, updateUserName ***REMOVED*** = useAuth();
  const ***REMOVED*** 
    colorPrincipal: appColor, 
    emojiUsuario: appEmoji, 
    descuentoDefault: appDescuento,
    rangosTurnos: appRangos,
    guardarPreferencias,
    coloresTemáticos
  ***REMOVED*** = useApp();
  
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [descuentoDefault, setDescuentoDefault] = useState(appDescuento);
  const [emojiInput, setEmojiInput] = useState(appEmoji);
  const [rangosTurnos, setRangosTurnos] = useState(appRangos || ***REMOVED***
    diurnoInicio: 6,
    diurnoFin: 14,
    tardeInicio: 14,
    tardeFin: 20,
    nocheInicio: 20
  ***REMOVED***);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Actualizar estados cuando cambian en el contexto
  useEffect(() => ***REMOVED***
    setEmojiInput(appEmoji);
    setDescuentoDefault(appDescuento);
    if (appRangos) ***REMOVED***
      setRangosTurnos(appRangos);
    ***REMOVED***
  ***REMOVED***, [appEmoji, appDescuento, appRangos]);
  
  // Colores disponibles
  const colores = [
    ***REMOVED*** name: 'Rosa', value: '#EC4899' ***REMOVED***, 
    ***REMOVED*** name: 'Índigo', value: '#6366F1' ***REMOVED***, 
    ***REMOVED*** name: 'Rojo', value: '#EF4444' ***REMOVED***, 
    ***REMOVED*** name: 'Verde', value: '#10B981' ***REMOVED***, 
    ***REMOVED*** name: 'Púrpura', value: '#8B5CF6' ***REMOVED***, 
    ***REMOVED*** name: 'Azul', value: '#3B82F6' ***REMOVED*** 
  ];

  // Emojis comunes para sugerir
  const emojisComunes = ['😊', '😎', '🚀', '💼', '⭐', '🔥', '💻', '📊'];
  
  // Cargar datos del usuario
  useEffect(() => ***REMOVED***
    const loadUserData = async () => ***REMOVED***
      if (currentUser) ***REMOVED***
        setDisplayName(currentUser.displayName || '');
        
        try ***REMOVED***
          const userData = await getUserData(currentUser.uid);
          if (userData && userData.ajustes) ***REMOVED***
            setDescuentoDefault(userData.ajustes.descuentoDefault || 15);
            if (userData.ajustes.rangosTurnos) ***REMOVED***
              setRangosTurnos(userData.ajustes.rangosTurnos);
            ***REMOVED***
          ***REMOVED***
        ***REMOVED*** catch (error) ***REMOVED***
          // Error ya manejado
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***;
    
    loadUserData();
  ***REMOVED***, [currentUser, getUserData]);
  
  // Función para cambiar el color en tiempo real
  const cambiarColor = (nuevoColor) => ***REMOVED***
    guardarPreferencias(***REMOVED***
      colorPrincipal: nuevoColor
    ***REMOVED***);
  ***REMOVED***;
  
  // Función para cambiar el emoji en tiempo real
  const cambiarEmoji = (nuevoEmoji) => ***REMOVED***
    setEmojiInput(nuevoEmoji);
    guardarPreferencias(***REMOVED***
      emojiUsuario: nuevoEmoji
    ***REMOVED***);
  ***REMOVED***;
  
  // Manejar cambios en el input de emoji
  const handleEmojiChange = (e) => ***REMOVED***
    const valor = e.target.value;
    setEmojiInput(valor);
    
    if (valor.trim() === '') ***REMOVED***
      guardarPreferencias(***REMOVED***
        emojiUsuario: '😊'
      ***REMOVED***);
    ***REMOVED*** else ***REMOVED***
      guardarPreferencias(***REMOVED***
        emojiUsuario: valor
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;
  
  // Validar rangos de turnos
  const validarRangos = (rangos) => ***REMOVED***
    if (rangos.diurnoInicio >= rangos.diurnoFin) ***REMOVED***
      return 'La hora de inicio del turno diurno debe ser menor a la hora de fin';
    ***REMOVED***
    if (rangos.tardeInicio >= rangos.tardeFin) ***REMOVED***
      return 'La hora de inicio del turno de tarde debe ser menor a la hora de fin';
    ***REMOVED***
    if (rangos.diurnoFin > rangos.tardeInicio) ***REMOVED***
      return 'El turno de tarde debe comenzar después o al mismo tiempo que termina el diurno';
    ***REMOVED***
    if (rangos.tardeFin > rangos.nocheInicio) ***REMOVED***
      return 'El turno de noche debe comenzar después o al mismo tiempo que termina la tarde';
    ***REMOVED***
    return null;
  ***REMOVED***;
  
  // Guardar configuración
  const handleSaveSettings = async () => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      setMessage('');
      setError('');
      
      // Validar rangos
      const errorValidacion = validarRangos(rangosTurnos);
      if (errorValidacion) ***REMOVED***
        setError(errorValidacion);
        setLoading(false);
        return;
      ***REMOVED***
      
      // Guardar descuento y rangos
      await guardarPreferencias(***REMOVED***
        descuentoDefault,
        rangosTurnos
      ***REMOVED***);
      
      setMessage('Configuración guardada correctamente');
      
      setTimeout(() => ***REMOVED***
        setLoading(false);
      ***REMOVED***, 800);
      
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al guardar ajustes: ' + error.message);
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;
  
  // Guardar nombre
  const handleSaveName = async () => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      setError('');
      
      await updateUserName(displayName);
      
      setEditingName(false);
      setMessage('Nombre actualizado correctamente');
      
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al actualizar nombre: ' + error.message);
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
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value=***REMOVED***displayName***REMOVED***
                  onChange=***REMOVED***(e) => setDisplayName(e.target.value)***REMOVED***
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style=***REMOVED******REMOVED*** '--tw-ring-color': coloresTemáticos?.base || appColor ***REMOVED******REMOVED***
                />
                <Button
                  onClick=***REMOVED***handleSaveName***REMOVED***
                  disabled=***REMOVED***loading***REMOVED***
                  size="sm"
                  className="!p-2"
                  icon=***REMOVED***Save***REMOVED***
                />
              </div>
            ) : (
              <div className="flex items-center">
                <div className="text-gray-900">***REMOVED***displayName***REMOVED***</div>
                <button
                  onClick=***REMOVED***() => setEditingName(true)***REMOVED***
                  className="ml-2 transition-colors"
                  style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || appColor ***REMOVED******REMOVED***
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
                className="w-16 h-10 border border-gray-300 rounded-md shadow-sm px-3 focus:outline-none focus:ring-2 text-xl"
                style=***REMOVED******REMOVED*** '--tw-ring-color': coloresTemáticos?.base || appColor ***REMOVED******REMOVED***
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
                  className="w-8 h-8 rounded-md flex items-center justify-center text-lg hover:bg-gray-100 transition-colors"
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
      
      ***REMOVED***/* Nueva sección: Configuración de rangos de turnos */***REMOVED***
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Rangos de Turnos</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Configura los rangos de horarios para la detección automática de tipos de turno.
        </p>
        
        <div className="space-y-4">
          ***REMOVED***/* Turno Diurno */***REMOVED***
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Sun className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="font-medium">Turno Diurno</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hora de inicio</label>
                <select
                  value=***REMOVED***rangosTurnos.diurnoInicio***REMOVED***
                  onChange=***REMOVED***(e) => setRangosTurnos(***REMOVED***
                    ...rangosTurnos,
                    diurnoInicio: parseInt(e.target.value)
                  ***REMOVED***)***REMOVED***
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style=***REMOVED******REMOVED*** '--tw-ring-color': coloresTemáticos?.base || appColor ***REMOVED******REMOVED***
                >
                  ***REMOVED***Array.from(***REMOVED***length: 24***REMOVED***, (_, i) => (
                    <option key=***REMOVED***i***REMOVED*** value=***REMOVED***i***REMOVED***>***REMOVED***i.toString().padStart(2, '0')***REMOVED***:00</option>
                  ))***REMOVED***
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hora de fin</label>
                <select
                  value=***REMOVED***rangosTurnos.diurnoFin***REMOVED***
                  onChange=***REMOVED***(e) => setRangosTurnos(***REMOVED***
                    ...rangosTurnos,
                    diurnoFin: parseInt(e.target.value)
                  ***REMOVED***)***REMOVED***
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style=***REMOVED******REMOVED*** '--tw-ring-color': coloresTemáticos?.base || appColor ***REMOVED******REMOVED***
                >
                  ***REMOVED***Array.from(***REMOVED***length: 24***REMOVED***, (_, i) => (
                    <option key=***REMOVED***i***REMOVED*** value=***REMOVED***i***REMOVED***>***REMOVED***i.toString().padStart(2, '0')***REMOVED***:00</option>
                  ))***REMOVED***
                </select>
              </div>
            </div>
          </div>
          
          ***REMOVED***/* Turno Tarde */***REMOVED***
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Sunset className="h-5 w-5 text-orange-500 mr-2" />
              <h3 className="font-medium">Turno Tarde</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hora de inicio</label>
                <select
                  value=***REMOVED***rangosTurnos.tardeInicio***REMOVED***
                  onChange=***REMOVED***(e) => setRangosTurnos(***REMOVED***
                    ...rangosTurnos,
                    tardeInicio: parseInt(e.target.value)
                  ***REMOVED***)***REMOVED***
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style=***REMOVED******REMOVED*** '--tw-ring-color': coloresTemáticos?.base || appColor ***REMOVED******REMOVED***
                >
                  ***REMOVED***Array.from(***REMOVED***length: 24***REMOVED***, (_, i) => (
                    <option key=***REMOVED***i***REMOVED*** value=***REMOVED***i***REMOVED***>***REMOVED***i.toString().padStart(2, '0')***REMOVED***:00</option>
                  ))***REMOVED***
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hora de fin</label>
                <select
                  value=***REMOVED***rangosTurnos.tardeFin***REMOVED***
                  onChange=***REMOVED***(e) => setRangosTurnos(***REMOVED***
                    ...rangosTurnos,
                    tardeFin: parseInt(e.target.value)
                  ***REMOVED***)***REMOVED***
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style=***REMOVED******REMOVED*** '--tw-ring-color': coloresTemáticos?.base || appColor ***REMOVED******REMOVED***
                >
                  ***REMOVED***Array.from(***REMOVED***length: 24***REMOVED***, (_, i) => (
                    <option key=***REMOVED***i***REMOVED*** value=***REMOVED***i***REMOVED***>***REMOVED***i.toString().padStart(2, '0')***REMOVED***:00</option>
                  ))***REMOVED***
                </select>
              </div>
            </div>
          </div>
          
          ***REMOVED***/* Turno Noche */***REMOVED***
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Moon className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium">Turno Noche</h3>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Hora de inicio</label>
              <select
                value=***REMOVED***rangosTurnos.nocheInicio***REMOVED***
                onChange=***REMOVED***(e) => setRangosTurnos(***REMOVED***
                  ...rangosTurnos,
                  nocheInicio: parseInt(e.target.value)
                ***REMOVED***)***REMOVED***
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style=***REMOVED******REMOVED*** '--tw-ring-color': coloresTemáticos?.base || appColor ***REMOVED******REMOVED***
              >
                ***REMOVED***Array.from(***REMOVED***length: 24***REMOVED***, (_, i) => (
                  <option key=***REMOVED***i***REMOVED*** value=***REMOVED***i***REMOVED***>***REMOVED***i.toString().padStart(2, '0')***REMOVED***:00</option>
                ))***REMOVED***
              </select>
              <p className="text-xs text-gray-500 mt-1">El turno de noche se extiende hasta el final del día</p>
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
            Porcentaje de descuento
          </label>
          <div className="flex rounded-md shadow-sm">
            <input
              type="number"
              min="0"
              max="100"
              value=***REMOVED***descuentoDefault***REMOVED***
              onChange=***REMOVED***(e) => setDescuentoDefault(Number(e.target.value))***REMOVED***
              className="flex-1 px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2"
              style=***REMOVED******REMOVED*** '--tw-ring-color': coloresTemáticos?.base || appColor ***REMOVED******REMOVED***
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
            onClick=***REMOVED***handleSaveSettings***REMOVED***
            disabled=***REMOVED***loading***REMOVED***
            loading=***REMOVED***loading***REMOVED***
            className="w-full mt-4"
          >
            Guardar cambios
          </Button>
        </div>
      </div>
      
      ***REMOVED***/* Sección de sesión */***REMOVED***
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center mb-4">
          <LogOut className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Sesión</h2>
        </div>
        
        <Button
          onClick=***REMOVED***handleLogout***REMOVED***
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          icon=***REMOVED***LogOut***REMOVED***
        >
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
***REMOVED***;

export default Ajustes;