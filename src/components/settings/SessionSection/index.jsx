// src/components/settings/SessionSection/index.jsx

import React from 'react';
import ***REMOVED*** LogOut ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useNavigate, Link ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const SessionSection = (***REMOVED*** onError, className = '' ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** logout ***REMOVED*** = useAuth();
  const colors = useThemeColors();
  const navigate = useNavigate();

  const handleLogout = async () => ***REMOVED***
    try ***REMOVED***
      await logout();
      navigate('/login');
    ***REMOVED*** catch (error) ***REMOVED***
      onError?.('Error al cerrar sesión: ' + error.message);
    ***REMOVED***
  ***REMOVED***;

  return (
    <SettingsSection icon=***REMOVED***LogOut***REMOVED*** title="Sesión" className=***REMOVED***className***REMOVED***>
      <div className="flex flex-col items-center justify-center flex-1 w-full gap-3 mt-4">
        <Button
          onClick=***REMOVED***handleLogout***REMOVED***
          variant="outline"
          className="w-full max-w-xs flex items-center justify-center gap-2"
          icon=***REMOVED***LogOut***REMOVED***
          themeColor=***REMOVED***colors.primary***REMOVED***
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
***REMOVED***;

export default SessionSection;