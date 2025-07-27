// src/components/layout/Header/index.jsx - Header mejorado con logo grande

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';

const Header = ({ setVistaActual }) => {
  const { thematicColors } = useApp();
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
      {/* Logo y título centrados - clickeable */}
      <div className="flex items-center justify-center flex-1">
        <button 
          onClick={handleLogoClick}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          {/* Logo SVG más grande */}
          <div className="w-20 h-20 flex items-center justify-center">
            <img 
              src="/assets/SVG/logo.svg" 
              alt="Logo" 
              className="w-full h-full filter brightness-0 invert"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
          
          {/* Título */}
          <h1 className="text-xl font-semibold">
            Mi Gestión de Turnos
          </h1>
        </button>
      </div>
      
      {/* Botón de settings a la derecha */}
      <div className="flex gap-2">
        <button
          onClick={handleSettingsClick}
          className="text-white rounded-lg p-3 transition-all duration-200 hover:bg-white hover:bg-opacity-20"
          title="Configuración"
        >
          <Settings className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;