// src/components/layout/Header/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** PlusCircle, Settings ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Button from '../../ui/Button';

const Header = (***REMOVED*** abrirModalNuevoTrabajo, abrirModalNuevoTurno, vistaActual, setVistaActual ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  const ***REMOVED*** coloresTemáticos, emojiUsuario ***REMOVED*** = useApp();
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState('Usuario');
  
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
        <Button
          onClick=***REMOVED***handleSettingsClick***REMOVED***
          variant="ghost"
          size="sm"
          className="bg-white hover:bg-gray-50 text-gray-700 rounded-full p-2 shadow-md"
          icon=***REMOVED***Settings***REMOVED***
        />
        
        ***REMOVED***vistaActual === 'trabajos' && (
          <Button
            onClick=***REMOVED***abrirModalNuevoTrabajo***REMOVED***
            variant="ghost"
            size="sm"
            className="bg-white hover:bg-gray-50 text-gray-700 rounded-full p-2 shadow-md"
            icon=***REMOVED***PlusCircle***REMOVED***
          />
        )***REMOVED***
        
        ***REMOVED***vistaActual === 'turnos' && (
          <Button
            onClick=***REMOVED***abrirModalNuevoTurno***REMOVED***
            variant="ghost"
            size="sm"
            className="bg-white hover:bg-gray-50 text-gray-700 rounded-full p-2 shadow-md"
            icon=***REMOVED***PlusCircle***REMOVED***
          />
        )***REMOVED***
      </div>
    </header>
  );
***REMOVED***;

export default Header;