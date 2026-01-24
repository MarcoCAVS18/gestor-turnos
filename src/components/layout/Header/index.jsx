// src/components/layout/Header/index.jsx

import React from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Settings ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import Flex from '../../ui/Flex';

const Header = (***REMOVED*** setCurrentView ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  const ***REMOVED*** profilePhotoURL ***REMOVED*** = useAuth();
  const navigate = useNavigate();
  
  const handleSettingsClick = () => ***REMOVED***
    navigate('/ajustes');
    setCurrentView('settings');
  ***REMOVED***;

  const handleLogoClick = () => ***REMOVED***
    navigate('/dashboard');
    setCurrentView('dashboard');
  ***REMOVED***;

  return (
    <header 
      className="flex justify-between items-center px-4 py-4 text-white shadow-md"
      style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED***
    >
      ***REMOVED***/* Logo and title on the left - clickable */***REMOVED***
      <Flex className="flex-1">
        <button
          onClick=***REMOVED***handleLogoClick***REMOVED***
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          ***REMOVED***/* Logo SVG */***REMOVED***
          <Flex variant="center" className="w-14 h-14">
            <img
              src="/assets/SVG/logo.svg"
              alt="Logo"
              className="w-full h-full filter brightness-0 invert"
              style=***REMOVED******REMOVED*** filter: 'brightness(0) invert(1)' ***REMOVED******REMOVED***
            />
          </Flex>

          ***REMOVED***/* Title and subtitle */***REMOVED***
          <div className="text-left">
            <h1 className="text-2xl font-bold tracking-tight">
              GestAPP.
            </h1>
            <p className="text-xs opacity-90 font-light">
              Your work and shift manager
            </p>
          </div>
        </button>
      </Flex>
      
      ***REMOVED***/* Profile/Settings button on the right */***REMOVED***
      <div className="flex gap-2">
        <button
          onClick=***REMOVED***handleSettingsClick***REMOVED***
          className="rounded-full p-1 transition-all duration-200 hover:bg-white hover:bg-opacity-20"
          title="Settings"
        >
          ***REMOVED***profilePhotoURL?.includes('logo.svg') ? (
            // If it is the default logo, show gear icon
            <Flex variant="center" className="w-10 h-10">
              <Settings className="h-6 w-6 text-white" />
            </Flex>
          ) : (
            // If has profile photo, show it
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img
                src=***REMOVED***profilePhotoURL***REMOVED***
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          )***REMOVED***
        </button>
      </div>
    </header>
  );
***REMOVED***;

export default Header;