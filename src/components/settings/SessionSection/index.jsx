// src/components/settings/SessionSection/index.jsx - REFACTORIZADO

import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const SessionSection = ({ onError, className = '' }) => {
  const { logout } = useAuth();
  const colors = useThemeColors();
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
    <SettingsSection icon={LogOut} title="Sesión" className={className}>
      <div className="flex-1 flex items-center justify-center">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full max-w-xs flex items-center justify-center gap-2"
          icon={LogOut}
          themeColor={colors.primary}
        >
          Cerrar sesión
        </Button>
      </div>
    </SettingsSection>
  );
};

export default SessionSection;
