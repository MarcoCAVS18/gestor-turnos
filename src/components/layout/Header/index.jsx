// src/components/layout/Header/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Settings ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const Header = (***REMOVED*** setVistaActual ***REMOVED***) => ***REMOVED***
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
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold leading-tight p-2">
          Mi Gestión de Turnos
        </h1>
        <p className="text-sm opacity-90 leading-tight pl-2">
          ***REMOVED***userName***REMOVED*** ***REMOVED***emojiUsuario || '😊'***REMOVED***
        </p>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick=***REMOVED***handleSettingsClick***REMOVED***
          className="text-white rounded-lg p-3 transition-all duration-200"
          onMouseEnter=***REMOVED***(e) => ***REMOVED***
            const baseColor = coloresTemáticos?.base || '#EC4899';
            const hex = baseColor.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            
            const lighterR = Math.min(255, r + 60);
            const lighterG = Math.min(255, g + 60);
            const lighterB = Math.min(255, b + 60);
            
            const lighterColor = `rgb($***REMOVED***lighterR***REMOVED***, $***REMOVED***lighterG***REMOVED***, $***REMOVED***lighterB***REMOVED***, 0.3)`;
            e.target.style.backgroundColor = lighterColor;
          ***REMOVED******REMOVED***
          onMouseLeave=***REMOVED***(e) => ***REMOVED***
            e.target.style.backgroundColor = 'transparent';
          ***REMOVED******REMOVED***
        >
          <Settings className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
***REMOVED***;

export default Header;