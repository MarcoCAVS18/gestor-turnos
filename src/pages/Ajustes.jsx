// src/pages/Ajustes.jsx
import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from '../contexts/AuthContext';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** doc, updateDoc ***REMOVED*** from 'firebase/firestore';
import ***REMOVED*** db ***REMOVED*** from '../firebase/config';
import ***REMOVED*** Settings, User, LogOut, Edit2, Save, Clock ***REMOVED*** from 'lucide-react';
import Header from '../components/Header';
import Navegacion from '../components/Navegacion';

const Ajustes = () => ***REMOVED***
  const ***REMOVED*** currentUser, logout, getUserData ***REMOVED*** = useAuth();
  const ***REMOVED*** userSettings ***REMOVED*** = useApp();
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
    ***REMOVED*** name: 'Rosa', value: '#EC4899' ***REMOVED***, // pink-600
    ***REMOVED*** name: 'Índigo', value: '#6366F1' ***REMOVED***, // indigo-500
    ***REMOVED*** name: 'Rojo', value: '#EF4444' ***REMOVED***, // red-500
    ***REMOVED*** name: 'Verde', value: '#10B981' ***REMOVED***, // emerald-500
    ***REMOVED*** name: 'Púrpura', value: '#8B5CF6' ***REMOVED***, // violet-500
    ***REMOVED*** name: 'Azul', value: '#3B82F6' ***REMOVED*** // blue-500
  ];
  
  // Cargar datos del usuario
  useEffect(() => ***REMOVED***
    const loadUserData = async () => ***REMOVED***
      if (currentUser) ***REMOVED***
        setDisplayName(currentUser.displayName || '');
        
        try ***REMOVED***
          const userData = await getUserData(currentUser.uid);
          if (userData && userData.ajustes) ***REMOVED***
            setDescuentoDefault(userData.ajustes.descuentoDefault || 15);
            setColorPrincipal(userData.ajustes.colorPrincipal || '#EC4899');
          ***REMOVED***
        ***REMOVED*** catch (error) ***REMOVED***
          console.error('Error al cargar datos del usuario:', error);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***;
    
    loadUserData();
  ***REMOVED***, [currentUser, getUserData]);
  
  // Guardar ajustes
  const handleSaveSettings = async () => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      setMessage('');
      setError('');
      
      // Actualizar documento en Firestore
      const userRef = doc(db, 'usuarios', currentUser.uid);
      await updateDoc(userRef, ***REMOVED***
        'ajustes.descuentoDefault': descuentoDefault,
        'ajustes.colorPrincipal': colorPrincipal
      ***REMOVED***);
      
      setMessage('Ajustes guardados correctamente');
      
      // Recargar la página para aplicar los cambios
      setTimeout(() => ***REMOVED***
        window.location.reload();
      ***REMOVED***, 1500);
      
    ***REMOVED*** catch (error) ***REMOVED***
      setError('Error al guardar ajustes: ' + error.message);
      console.error(error);
    ***REMOVED*** finally ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;
  
  // Guardar nombre
  const handleSaveName = async () => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      
      // Actualizar documento en Firestore
      const userRef = doc(db, 'usuarios', currentUser.uid);
      await updateDoc(userRef, ***REMOVED***
        displayName: displayName
      ***REMOVED***);
      
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
    <div className="font-poppins bg-gray-100 min-h-screen pb-20">
      <Header 
        vistaActual="ajustes" 
      />
      
      <main className="max-w-md mx-auto px-4 py-6">
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  />
                  <button
                    onClick=***REMOVED***handleSaveName***REMOVED***
                    disabled=***REMOVED***loading***REMOVED***
                    className="ml-2 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="text-gray-900">***REMOVED***displayName***REMOVED***</div>
                  <button
                    onClick=***REMOVED***() => setEditingName(true)***REMOVED***
                    className="ml-2 text-pink-600 hover:text-pink-800"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              )***REMOVED***
            </div>
          </div>
        </div>
        
        ***REMOVED***/* Sección de preferencias */***REMOVED***
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
                  value=***REMOVED***descuentoDefault***REMOVED***
                  onChange=***REMOVED***(e) => setDescuentoDefault(Number(e.target.value))***REMOVED***
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
                ***REMOVED***colores.map((color) => (
                  <button
                    key=***REMOVED***color.value***REMOVED***
                    onClick=***REMOVED***() => setColorPrincipal(color.value)***REMOVED***
                    className=***REMOVED***`p-3 flex flex-col items-center rounded-lg border transition-all $***REMOVED***
                      colorPrincipal === color.value 
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
            
            <button
              onClick=***REMOVED***handleSaveSettings***REMOVED***
              disabled=***REMOVED***loading***REMOVED***
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
            >
              ***REMOVED***loading ? 'Guardando...' : 'Guardar cambios'***REMOVED***
            </button>
          </div>
        </div>
        
        ***REMOVED***/* Sección de sesión */***REMOVED***
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Sesión</h2>
          </div>
          
          <button
            onClick=***REMOVED***handleLogout***REMOVED***
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
***REMOVED***;

export default Ajustes;