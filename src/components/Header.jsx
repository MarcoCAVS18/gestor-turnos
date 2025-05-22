// src/components/Header.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

const Header = ({ abrirModalNuevoTrabajo, abrirModalNuevoTurno, vistaActual, setVistaActual }) => {
  const { currentUser } = useAuth();
  const { coloresTemáticos, emojiUsuario } = useApp();
  const navigate = useNavigate();
  
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
    navigate('/ajustes');
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
        <button 
          onClick={handleSettingsClick}
          className="bg-white rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
        >
          <Settings size={24} className="text-gray-700" />
        </button>
        
        {vistaActual === 'trabajos' && (
          <button 
            onClick={abrirModalNuevoTrabajo}
            className="bg-white rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
          >
            <PlusCircle size={24} className="text-gray-700" />
          </button>
        )}
        {vistaActual === 'turnos' && (
          <button 
            onClick={abrirModalNuevoTurno}
            className="bg-white rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
          >
            <PlusCircle size={24} className="text-gray-700" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;