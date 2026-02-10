// src/components/layout/Header/index.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import { usePremium } from '../../../contexts/PremiumContext';
import Flex from '../../ui/Flex';

const Header = () => {
  const { thematicColors } = useApp();
  const { profilePhotoURL } = useAuth();
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  const [showSettingsIcon, setShowSettingsIcon] = useState(false);

  const hasCustomPhoto = profilePhotoURL && !profilePhotoURL.includes('logo.svg');

  // Animation: periodically show settings icon instead of profile photo
  useEffect(() => {
    if (!hasCustomPhoto) return;

    const interval = setInterval(() => {
      setShowSettingsIcon(true);
      // Show gear icon for 2 seconds, then return to photo
      setTimeout(() => {
        setShowSettingsIcon(false);
      }, 2000);
    }, 12000); // Every 12 seconds

    return () => clearInterval(interval);
  }, [hasCustomPhoto]);

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
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
          {/* Logo SVG - Premium or Regular */}
          <Flex variant="center" className="w-14 h-14">
            <img
              src={isPremium ? "/assets/SVG/premium.svg" : "/assets/SVG/logo.svg"}
              alt={isPremium ? "Premium Logo" : "Logo"}
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
          {!hasCustomPhoto ? (
            // If it is the default logo, show gear icon
            <Flex variant="center" className="w-10 h-10">
              <Settings className="h-6 w-6 text-white" />
            </Flex>
          ) : (
            // If has profile photo, show animated container
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg relative">
              {/* Profile photo */}
              <img
                src={profilePhotoURL}
                alt="Profile"
                className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${
                  showSettingsIcon ? 'opacity-0' : 'opacity-100'
                }`}
              />
              {/* Settings icon overlay */}
              <Flex
                variant="center"
                className={`w-full h-full absolute inset-0 bg-white/20 transition-opacity duration-500 ${
                  showSettingsIcon ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Settings className="h-5 w-5 text-white" />
              </Flex>
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;