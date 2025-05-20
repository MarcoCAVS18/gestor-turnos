// src/components/Header.jsx - Versión completa
import React, { useState, useEffect } from 'react';
import { PlusCircle, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

const Header = ({ abrirModalNuevoTrabajo, abrirModalNuevoTurno, vistaActual, setVistaActual }) => {
  const { currentUser } = useAuth();
  const { colorPrincipal, emojiUsuario } = useApp();
  
  // Estado local para el nombre de usuario para asegurar que se actualiza
  const [userName, setUserName] = useState('Usuario');
  
  // Actualizar el nombre cuando cambia currentUser
  useEffect(() => {
    if (currentUser) {
      // Usar displayName si existe, o el email, o 'Usuario' como fallback
      setUserName(
        currentUser.displayName || 
        (currentUser.email ? currentUser.email.split('@')[0] : 'Usuario')
      );
    }
  }, [currentUser]);
  
  const handleSettingsClick = () => {
    setVistaActual('ajustes');
  };

  return (
    <header 
      className="flex justify-between items-center px-4 py-3 text-white shadow-md"
      style={{ backgroundColor: colorPrincipal }}
    >
      <h1 className="text-xl font-semibold">
        Mi Gestión de Turnos - {userName} {emojiUsuario || '😊'}
      </h1>
      <div className="flex gap-2">
        <button 
          onClick={handleSettingsClick}
          className="bg-white rounded-full p-1 shadow-md hover:bg-opacity-90 transition-colors"
          style={{ color: colorPrincipal }}
        >
          <Settings size={24} />
        </button>
        
        {vistaActual === 'trabajos' && (
          <button 
            onClick={abrirModalNuevoTrabajo}
            className="bg-white rounded-full p-1 shadow-md hover:bg-opacity-90 transition-colors"
            style={{ color: colorPrincipal }}
          >
            <PlusCircle size={24} />
          </button>
        )}
        {vistaActual === 'turnos' && (
          <button 
            onClick={abrirModalNuevoTurno}
            className="bg-white rounded-full p-1 shadow-md hover:bg-opacity-90 transition-colors"
            style={{ color: colorPrincipal }}
          >
            <PlusCircle size={24} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;