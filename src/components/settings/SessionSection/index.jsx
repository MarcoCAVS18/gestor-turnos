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
      onError?.('Error logging out: ' + error.message);
    }
  };

  return (
    <SettingsSection icon={LogOut} title="Session" className={className}>
      <div className="flex flex-row items-center justify-between flex-1 w-full mt-4">
        <Link 
          to="/delete-account"
          className="text-xs text-gray-400 hover:text-gray-600 hover:underline transition-colors"
        >
          Delete account
        </Link>
        <Button
          onClick={handleLogout}
          variant="outline"
          icon={LogOut}
          themeColor={colors.primary}
        >
          Log out
        </Button>
      </div>
    </SettingsSection>
  );
};

export default SessionSection;