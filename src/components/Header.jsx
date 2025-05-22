// src/components/Header.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** PlusCircle, Settings ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useAuth ***REMOVED*** from '../contexts/AuthContext';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import DynamicButton from './DynamicButton';

const Header = (***REMOVED*** abrirModalNuevoTrabajo, abrirModalNuevoTurno, vistaActual, setVistaActual ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  const ***REMOVED*** coloresTemáticos, emojiUsuario ***REMOVED*** = useApp();
  
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
        <DynamicButton
          onClick=***REMOVED***handleSettingsClick***REMOVED***
          variant="ghost"
          size="sm"
          className="!bg-white !text-current rounded-full p-1 shadow-md"
          style=***REMOVED******REMOVED*** 
            color: coloresTemáticos?.base || '#EC4899'
          ***REMOVED******REMOVED***
        >
          <Settings size=***REMOVED***24***REMOVED*** />
        </DynamicButton>
        
        ***REMOVED***vistaActual === 'trabajos' && (
          <DynamicButton
            onClick=***REMOVED***abrirModalNuevoTrabajo***REMOVED***
            variant="ghost"
            size="sm"
            className="!bg-white !text-current rounded-full p-1 shadow-md"
            style=***REMOVED******REMOVED*** 
              color: coloresTemáticos?.base || '#EC4899'
            ***REMOVED******REMOVED***
          >
            <PlusCircle size=***REMOVED***24***REMOVED*** />
          </DynamicButton>
        )***REMOVED***
        ***REMOVED***vistaActual === 'turnos' && (
          <DynamicButton
            onClick=***REMOVED***abrirModalNuevoTurno***REMOVED***
            variant="ghost"
            size="sm"
            className="!bg-white !text-current rounded-full p-1 shadow-md"
            style=***REMOVED******REMOVED*** 
              color: coloresTemáticos?.base || '#EC4899'
            ***REMOVED******REMOVED***
          >
            <PlusCircle size=***REMOVED***24***REMOVED*** />
          </DynamicButton>
        )***REMOVED***
      </div>
    </header>
  );
***REMOVED***;

export default Header;