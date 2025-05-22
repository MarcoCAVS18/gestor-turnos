// src/components/Header.jsx

import React, { useState, useEffect } from 'react';
import { PlusCircle, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import DynamicButton from './DynamicButton';

const Header = ({ abrirModalNuevoTrabajo, abrirModalNuevoTurno, vistaActual, setVistaActual }) => {
  const { currentUser } = useAuth();
  const { coloresTemáticos, emojiUsuario } = useApp();
  
  // Estado local para el nombre de usuario para asegurar que se actualiza
  const [userName, setUserName] = useState('Usuario');
  
  // Actualizar el nombre cuando cambia currentUser
  useEffect(() => {
    if (currentUser) {
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
      style={{ backgroundColor: coloresTemáticos?.base || '#EC4899' }}
    >
      <h1 className="text-xl font-semibold">
        Mi Gestión de Turnos - {userName} {emojiUsuario || '😊'}
      </h1>
      <div className="flex gap-2">
        <DynamicButton
          onClick={handleSettingsClick}
          variant="ghost"
          size="sm"
          className="!bg-white !text-current rounded-full p-1 shadow-md"
          style={{ 
            color: coloresTemáticos?.base || '#EC4899'
          }}
        >
          <Settings size={24} />
        </DynamicButton>
        
        {vistaActual === 'trabajos' && (
          <DynamicButton
            onClick={abrirModalNuevoTrabajo}
            variant="ghost"
            size="sm"
            className="!bg-white !text-current rounded-full p-1 shadow-md"
            style={{ 
              color: coloresTemáticos?.base || '#EC4899'
            }}
          >
            <PlusCircle size={24} />
          </DynamicButton>
        )}
        {vistaActual === 'turnos' && (
          <DynamicButton
            onClick={abrirModalNuevoTurno}
            variant="ghost"
            size="sm"
            className="!bg-white !text-current rounded-full p-1 shadow-md"
            style={{ 
              color: coloresTemáticos?.base || '#EC4899'
            }}
          >
            <PlusCircle size={24} />
          </DynamicButton>
        )}
      </div>
    </header>
  );
};

export default Header;