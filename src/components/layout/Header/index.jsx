// src/components/layout/Header/index.jsx - Header mejorado con logo grande

import React from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Settings ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const Header = (***REMOVED*** setVistaActual ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  const navigate = useNavigate();
  
  const handleSettingsClick = () => ***REMOVED***
    navigate('/ajustes');
    setVistaActual('ajustes');
  ***REMOVED***;

  const handleLogoClick = () => ***REMOVED***
    navigate('/dashboard');
    setVistaActual('dashboard');
  ***REMOVED***;

  return (
    <header 
      className="flex justify-between items-center px-4 py-4 text-white shadow-md"
      style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED***
    >
      ***REMOVED***/* Logo y título centrados - clickeable */***REMOVED***
      <div className="flex items-center justify-center flex-1">
        <button 
          onClick=***REMOVED***handleLogoClick***REMOVED***
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          ***REMOVED***/* Logo SVG más grande */***REMOVED***
          <div className="w-20 h-20 flex items-center justify-center">
            <img 
              src="/assets/SVG/logo.svg" 
              alt="Logo" 
              className="w-full h-full filter brightness-0 invert"
              style=***REMOVED******REMOVED*** filter: 'brightness(0) invert(1)' ***REMOVED******REMOVED***
            />
          </div>
          
          ***REMOVED***/* Título */***REMOVED***
          <h1 className="text-xl font-semibold">
            Mi Gestión de Turnos
          </h1>
        </button>
      </div>
      
      ***REMOVED***/* Botón de settings a la derecha */***REMOVED***
      <div className="flex gap-2">
        <button
          onClick=***REMOVED***handleSettingsClick***REMOVED***
          className="text-white rounded-lg p-3 transition-all duration-200 hover:bg-white hover:bg-opacity-20"
          title="Configuración"
        >
          <Settings className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
***REMOVED***;

export default Header;