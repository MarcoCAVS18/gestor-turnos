// src/components/layout/Header/index.jsx - Header mejorado con logo grande

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';

const Header = ({ setVistaActual }) => {
  const { thematicColors } = useApp();
  const { profilePhotoURL } = useAuth();
  const navigate = useNavigate();
  
  const handleSettingsClick = () => {
    navigate('/ajustes');
    setVistaActual('ajustes');
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
    setVistaActual('dashboard');
  };

  return (
    <header 
      className="flex justify-between items-center px-4 py-4 text-white shadow-md"
      style={{ backgroundColor: thematicColors?.base || '#EC4899' }}
    >
      {/* Logo y título a la izquierda - clickeable */}
      <div className="flex items-center flex-1">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          {/* Logo SVG */}
          <div className="w-14 h-14 flex items-center justify-center">
            <img
              src="/assets/SVG/logo.svg"
              alt="Logo"
              className="w-full h-full filter brightness-0 invert"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>

          {/* Título y subtítulo */}
          <div className="text-left">
            <h1 className="text-2xl font-bold tracking-tight">
              GestAPP.
            </h1>
            <p className="text-xs opacity-90 font-light">
              Tu gestor de trabajos y turnos
            </p>
          </div>
        </button>
      </div>
      
      {/* Botón de perfil/settings a la derecha */}
      <div className="flex gap-2">
        <button
          onClick={handleSettingsClick}
          className="rounded-full p-1 transition-all duration-200 hover:bg-white hover:bg-opacity-20"
          title="Configuración"
        >
          {profilePhotoURL?.includes('logo.svg') ? (
            // Si es el logo por defecto, mostrar ícono de engranaje
            <div className="w-10 h-10 flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
          ) : (
            // Si tiene foto de perfil, mostrarla
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img
                src={profilePhotoURL}
                alt="Perfil"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;