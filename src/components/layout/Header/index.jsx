// src/components/layout/Header/index.jsx

import React from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Settings ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import Flex from '../../ui/Flex';

const Header = (***REMOVED*** setVistaActual ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  const ***REMOVED*** profilePhotoURL ***REMOVED*** = useAuth();
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
      ***REMOVED***/* Logo y título a la izquierda - clickeable */***REMOVED***
      <Flex className="flex-1">
        <button
          onClick=***REMOVED***handleLogoClick***REMOVED***
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          ***REMOVED***/* Logo SVG */***REMOVED***
          <Flex variant="center" className="w-14 h-14">
            <img
              src="/assets/SVG/logo.svg"
              alt="Logo"
              className="w-full h-full filter brightness-0 invert"
              style=***REMOVED******REMOVED*** filter: 'brightness(0) invert(1)' ***REMOVED******REMOVED***
            />
          </Flex>

          ***REMOVED***/* Título y subtítulo */***REMOVED***
          <div className="text-left">
            <h1 className="text-2xl font-bold tracking-tight">
              GestAPP.
            </h1>
            <p className="text-xs opacity-90 font-light">
              Tu gestor de trabajos y turnos
            </p>
          </div>
        </button>
      </Flex>
      
      ***REMOVED***/* Botón de perfil/settings a la derecha */***REMOVED***
      <div className="flex gap-2">
        <button
          onClick=***REMOVED***handleSettingsClick***REMOVED***
          className="rounded-full p-1 transition-all duration-200 hover:bg-white hover:bg-opacity-20"
          title="Configuración"
        >
          ***REMOVED***profilePhotoURL?.includes('logo.svg') ? (
            // Si es el logo por defecto, mostrar ícono de engranaje
            <Flex variant="center" className="w-10 h-10">
              <Settings className="h-6 w-6 text-white" />
            </Flex>
          ) : (
            // Si tiene foto de perfil, mostrarla
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img
                src=***REMOVED***profilePhotoURL***REMOVED***
                alt="Perfil"
                className="w-full h-full object-cover"
              />
            </div>
          )***REMOVED***
        </button>
      </div>
    </header>
  );
***REMOVED***;

export default Header;