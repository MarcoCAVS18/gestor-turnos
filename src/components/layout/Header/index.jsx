// src/components/layout/Header/index.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import Flex from '../../ui/Flex';

const Header = ({ setCurrentView }) => {
  const { thematicColors } = useApp();
  const { profilePhotoURL } = useAuth();
  const navigate = useNavigate();
  
  const handleSettingsClick = () => {
    navigate('/ajustes');
    setCurrentView('settings');
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
    setCurrentView('dashboard');
  };

  return (
    <header 
      className="flex justify-between items-center px-4 py-4 text-white shadow-md"
      style={{ backgroundColor: thematicColors?.base || '#EC4899' }}
    >
      {/* Logo and title on the left - clickable */}
      <Flex className="flex-1">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          {/* Logo SVG */}
          <Flex variant="center" className="w-14 h-14">
            <img
              src="/assets/SVG/logo.svg"
              alt="Logo"
              className="w-full h-full filter brightness-0 invert"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </Flex>

          {/* Title and subtitle */}
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
      
      {/* Profile/Settings button on the right */}
      <div className="flex gap-2">
        <button
          onClick={handleSettingsClick}
          className="rounded-full p-1 transition-all duration-200 hover:bg-white hover:bg-opacity-20"
          title="Settings"
        >
          {profilePhotoURL?.includes('logo.svg') ? (
            // If it is the default logo, show gear icon
            <Flex variant="center" className="w-10 h-10">
              <Settings className="h-6 w-6 text-white" />
            </Flex>
          ) : (
            // If has profile photo, show it
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img
                src={profilePhotoURL}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;