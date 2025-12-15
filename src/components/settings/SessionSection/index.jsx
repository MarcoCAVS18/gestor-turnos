// src/components/settings/SessionSection/index.jsx

import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
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
      <div className="flex flex-col items-center justify-center flex-1 w-full gap-3 mt-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full max-w-xs flex items-center justify-center gap-2"
          icon={LogOut}
          themeColor={colors.primary}
        >
          Cerrar sesión
        </Button>

        <Link 
          to="/delete-account"
          className="text-xs text-gray-400 hover:text-gray-600 hover:underline transition-colors mt-1"
        >
          Eliminar cuenta
        </Link>
      </div>
    </SettingsSection>
  );
};

export default SessionSection;