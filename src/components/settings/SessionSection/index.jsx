// src/components/settings/SessionSection/index.jsx - REFACTORIZADO

import React from 'react';
import ***REMOVED*** LogOut ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';

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
      <Flex variant="center" className="flex-1">
        <Button
          onClick=***REMOVED***handleLogout***REMOVED***
          variant="outline"
          className="w-full max-w-xs flex items-center justify-center gap-2"
          icon=***REMOVED***LogOut***REMOVED***
          themeColor=***REMOVED***colors.primary***REMOVED***
        >
          Cerrar sesión
        </Button>
      </Flex>
    </SettingsSection>
  );
***REMOVED***;

export default SessionSection;
