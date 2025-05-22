// src/components/Header.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** PlusCircle, Settings ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useAuth ***REMOVED*** from '../contexts/AuthContext';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const Header = (***REMOVED*** abrirModalNuevoTrabajo, abrirModalNuevoTurno, vistaActual, setVistaActual ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  const ***REMOVED*** coloresTemáticos, emojiUsuario ***REMOVED*** = useApp();
  const navigate = useNavigate();
  
  // Estado local para el nombre de usuario para asegurar que se actualiza
  const [userName, setUserName] = useState('Usuario');
  
  // Actualizar el nombre cuando cambia currentUser
  useEffect(() => ***REMOVED***
    if (currentUser) ***REMOVED***
      setUserName(
        currentUser.displayName || 
        (currentUser.email ? currentUser.email.split('@')[0] : 'Usuario')
      );
    ***REMOVED***
  ***REMOVED***, [currentUser]);
  
  const handleSettingsClick = () => ***REMOVED***
    navigate('/ajustes');
    setVistaActual('ajustes');
  ***REMOVED***;

  return (
    <header 
      className="flex justify-between items-center px-4 py-3 text-white shadow-md"
      style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
    >
      <h1 className="text-xl font-semibold">
        Mi Gestión de Turnos - ***REMOVED***userName***REMOVED*** ***REMOVED***emojiUsuario || '😊'***REMOVED***
      </h1>
      <div className="flex gap-2">
        <button 
          onClick=***REMOVED***handleSettingsClick***REMOVED***
          className="bg-white rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
        >
          <Settings size=***REMOVED***24***REMOVED*** className="text-gray-700" />
        </button>
        
        ***REMOVED***vistaActual === 'trabajos' && (
          <button 
            onClick=***REMOVED***abrirModalNuevoTrabajo***REMOVED***
            className="bg-white rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
          >
            <PlusCircle size=***REMOVED***24***REMOVED*** className="text-gray-700" />
          </button>
        )***REMOVED***
        ***REMOVED***vistaActual === 'turnos' && (
          <button 
            onClick=***REMOVED***abrirModalNuevoTurno***REMOVED***
            className="bg-white rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
          >
            <PlusCircle size=***REMOVED***24***REMOVED*** className="text-gray-700" />
          </button>
        )***REMOVED***
      </div>
    </header>
  );
***REMOVED***;

export default Header;