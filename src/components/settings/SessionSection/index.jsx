// src/components/settings/SessionSection/index.jsx

import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const SessionSection = ({ onError }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      onError?.('Error al cerrar sesión: ' + error.message);
    }
  };

  return (
    <SettingsSection icon={LogOut} title="Sesión">
      <Button
        onClick={handleLogout}
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        icon={LogOut}
      >
        Cerrar sesión
      </Button>
    </SettingsSection>
  );
};

export default SessionSection;