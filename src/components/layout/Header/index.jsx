// src/components/layout/Header/index.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useApp } from '../../../contexts/AppContext';

const Header = ({ setVistaActual }) => {
  const { currentUser } = useAuth();
  const { coloresTemáticos, emojiUsuario } = useApp();
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState('Usuario');
  
  useEffect(() => {
    if (currentUser) {
      setUserName(
        currentUser.displayName || 
        (currentUser.email ? currentUser.email.split('@')[0] : 'Usuario')
      );
    }
  }, [currentUser]);
  
  const handleSettingsClick = () => {
    navigate('/ajustes');
    setVistaActual('ajustes');
  };

  return (
    <header 
      className="flex justify-between items-center px-4 py-3 text-white shadow-md"
      style={{ backgroundColor: coloresTemáticos?.base || '#EC4899' }}
    >
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold leading-tight p-2">
          Mi Gestión de Turnos
        </h1>
        <p className="text-sm opacity-90 leading-tight pl-2">
          {userName} {emojiUsuario || '😊'}
        </p>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleSettingsClick}
          className="text-white rounded-lg p-3 transition-all duration-200"
          onMouseEnter={(e) => {
            const baseColor = coloresTemáticos?.base || '#EC4899';
            const hex = baseColor.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            
            const lighterR = Math.min(255, r + 60);
            const lighterG = Math.min(255, g + 60);
            const lighterB = Math.min(255, b + 60);
            
            const lighterColor = `rgb(${lighterR}, ${lighterG}, ${lighterB}, 0.3)`;
            e.target.style.backgroundColor = lighterColor;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          <Settings className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;