import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Settings } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useApp } from '../../../contexts/AppContext';
import Button from '../../ui/Button';

const Header = ({ abrirModalNuevoTrabajo, abrirModalNuevoTurno, vistaActual, setVistaActual }) => {
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
      <h1 className="text-xl font-semibold">
        Mi Gestión de Turnos - {userName} {emojiUsuario || '😊'}
      </h1>
      
      <div className="flex gap-2">
        <Button
          onClick={handleSettingsClick}
          variant="ghost"
          size="sm"
          className="bg-white hover:bg-gray-50 text-gray-700 rounded-full p-2 shadow-md"
          icon={Settings}
        />
        
        {vistaActual === 'trabajos' && (
          <Button
            onClick={abrirModalNuevoTrabajo}
            variant="ghost"
            size="sm"
            className="bg-white hover:bg-gray-50 text-gray-700 rounded-full p-2 shadow-md"
            icon={PlusCircle}
          />
        )}
        
        {vistaActual === 'turnos' && (
          <Button
            onClick={abrirModalNuevoTurno}
            variant="ghost"
            size="sm"
            className="bg-white hover:bg-gray-50 text-gray-700 rounded-full p-2 shadow-md"
            icon={PlusCircle}
          />
        )}
      </div>
    </header>
  );
};

export default Header;