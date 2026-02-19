// src/components/layout/Navigation/index.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Briefcase, Calendar, BarChart2, CalendarDays, Settings, PlusCircle, Pencil, CircleDotDashed, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useLiveModeContext } from '../../../contexts/LiveModeContext';
import { usePremium, PREMIUM_COLORS } from '../../../contexts/PremiumContext';
import LiveModeActiveModal from '../../modals/liveMode/LiveModeActiveModal';
import PremiumModal from '../../modals/premium/PremiumModal';

import Flex from '../../ui/Flex';

import './index.css';


const Navigation = ({ openNewWorkModal, openNewShiftModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { works, deliveryWork } = useApp();
  const { profilePhotoURL, updateProfilePhoto } = useAuth();
  const colors = useThemeColors();
  const { isActive: isLiveModeActive, formattedTime, isPaused, selectedWork: liveWork } = useLiveModeContext();
  const { isPremium } = usePremium();
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  // Tooltip state
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPhotoEdit, setShowPhotoEdit] = useState(false);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleLoadingStart = () => setIsPhotoLoading(true);
    const handleLoadingEnd = () => setIsPhotoLoading(false);

    window.addEventListener('profile-photo-loading-start', handleLoadingStart);
    window.addEventListener('profile-photo-loading-end', handleLoadingEnd);

    return () => {
      window.removeEventListener('profile-photo-loading-start', handleLoadingStart);
      window.removeEventListener('profile-photo-loading-end', handleLoadingEnd);
    };
  }, []);
  
  const getCurrentView = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'dashboard';
    if (path === '/works') return 'works';
    if (path === '/shifts') return 'shifts';
    if (path === '/statistics') return 'statistics';
    if (path === '/calendar') return 'calendar';
    if (path === '/settings') return 'settings';
    return 'dashboard';
  };
  
  const currentView = getCurrentView();
  
  // Check if there are works created
  const totalWorks = (works?.length || 0) + (deliveryWork?.length || 0);
  const hasWorks = totalWorks > 0;
  
  const navigateToView = (view) => {
    // If trying to go to shifts but there are no works, do nothing on desktop
    if (view === 'shifts' && !hasWorks) {
      return;
    }
    
    const routes = {
      'dashboard': '/dashboard',
      'works': '/works',
      'shifts': '/shifts',
      'statistics': '/statistics',
      'calendar': '/calendar',
      'settings': '/settings'
    };
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    navigate(routes[view]);
  };
  
  const getActiveTextStyle = (view) => {
    return currentView === view 
      ? { color: colors.primary } 
      : { color: '#6B7280' };
  };

  const getActiveDesktopStyle = (view) => {
    // Special style for shifts when there are no works
    if (view === 'shifts' && !hasWorks) {
      return {
        backgroundColor: 'transparent',
        color: '#9CA3AF',
        cursor: 'not-allowed',
        opacity: 0.5
      };
    }

    return currentView === view
      ? {
          backgroundColor: colors.primary,
          color: 'white'
        }
      : {
          backgroundColor: 'transparent',
          color: '#6B7280'
        };
  };
  
  const calendarButtonStyle = {
    backgroundColor: colors.primary,
    borderColor: currentView === 'calendar' 
      ? colors.primaryDark
      : 'white'
  };

  // Handle shifts button hover
  const handleShiftsMouseEnter = () => {
    if (!hasWorks) {
      setShowTooltip(true);
    }
  };

  const handleShiftsMouseLeave = () => {
    setShowTooltip(false);
  };

  // Function to navigate to dashboard from logo
  const handleLogoClick = () => {
    navigateToView('dashboard');
  };

  // Handle profile photo upload from desktop
  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    window.dispatchEvent(new CustomEvent('profile-photo-loading-start'));
    try {
      await updateProfilePhoto(file);
    } catch (error) {
      console.error('Error updating photo:', error);
    } finally {
      window.dispatchEvent(new CustomEvent('profile-photo-loading-end'));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEditPhotoClick = (e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };
  
  return (
    <>
      {/* MOBILE NAVIGATION */}
      <nav className="navbar-container fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 px-4 py-6 md:hidden">
        <div className="grid grid-cols-5 items-center max-w-md mx-auto">
          <button
            onClick={() => navigateToView('dashboard')}
            className="flex flex-col items-center justify-center transition-colors duration-200"
            style={getActiveTextStyle('dashboard')}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>

          <button
            onClick={() => navigateToView('works')}
            className="flex flex-col items-center justify-center transition-colors duration-200"
            style={getActiveTextStyle('works')}
          >
            <Briefcase size={20} />
            <span className="text-xs mt-1">Works</span>
          </button>

          <div className="flex justify-center items-start -mt-6">
            <motion.button
              onClick={() => navigateToView('calendar')}
              className="text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 transition-all duration-200"
              style={calendarButtonStyle}
              whileTap={{ scale: 0.95 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 8px 25px ${colors.transparent50}`
              }}
            >
              <CalendarDays size={28} />
            </motion.button>
          </div>

          <button
            onClick={() => navigateToView('shifts')}
            className="flex flex-col items-center justify-center transition-colors duration-200"
            style={getActiveTextStyle('shifts')}
          >
            <Calendar size={20} />
            <span className="text-xs mt-1">Shifts</span>
          </button>

          <button
            onClick={() => navigateToView('statistics')}
            className="flex flex-col items-center justify-center transition-colors duration-200"
            style={getActiveTextStyle('statistics')}
          >
            <BarChart2 size={20} />
            <span className="text-xs mt-1">Statistics</span>
          </button>
        </div>
      </nav>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:flex-col w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 shadow-sm h-screen fixed left-0 top-0 z-30">
        
        {/* SIDEBAR HEADER - WITH PROFILE PHOTO */}
        <div className="p-6 border-b border-gray-100 dark:border-slate-800">
          {/* Hidden input for photo upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-4 hover:opacity-80 transition-opacity w-full text-left"
          >
            {/* Profile photo or Logo with hover edit */}
            <div
              className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg group"
              onMouseEnter={() => setShowPhotoEdit(true)}
              onMouseLeave={() => setShowPhotoEdit(false)}
              style={{
                backgroundColor: profilePhotoURL?.includes('logo.svg') ? colors.primary : 'transparent'
              }}
            >
              <img
                src={profilePhotoURL}
                alt="Profile"
                className={`w-full h-full ${
                  profilePhotoURL?.includes('logo.svg')
                    ? 'object-contain p-2 filter brightness-0 invert'
                    : 'object-cover'
                } ${isPhotoLoading && !profilePhotoURL?.includes('logo.svg') ? 'opacity-70 blur-sm' : ''}`}
                style={
                  profilePhotoURL?.includes('logo.svg')
                    ? { filter: 'brightness(0) invert(1)' }
                    : {}
                }
              />

              {/* Overlay with edit icon on hover */}
              {showPhotoEdit && (
                <Flex variant="center"
                  onClick={handleEditPhotoClick}
                  className="absolute inset-0 bg-black bg-opacity-50 cursor-pointer transition-opacity"
                  style={{ backgroundColor: colors.transparent50 }}
                >
                  <Pencil className="text-white" size={20} />
                </Flex>
              )}
            </div>

            {/* Title and subtitle */}
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Orary.
              </h1>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-light">
                Your work and shift manager
              </p>
            </div>
          </button>
        </div>

        {/* QUICK ACTIONS */}
        {(openNewShiftModal || openNewWorkModal) && (
          <div className="p-4 border-b border-gray-100 dark:border-slate-800">
            <div className="space-y-2">
              {openNewShiftModal && hasWorks && (
                <button
                  onClick={openNewShiftModal}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-lg transform hover:scale-105 btn-primary text-white"
                  style={{ 
                    backgroundColor: colors.primary
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.primaryDark;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = colors.primary;
                  }}
                >
                  <PlusCircle size={20} />
                  <span>New Shift</span>
                </button>
              )}
              {openNewWorkModal && (
                <button
                  onClick={openNewWorkModal}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md bg-white dark:bg-slate-800"
                  style={{
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: colors.primary,
                    color: colors.primary
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.transparent10;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '';
                  }}
                >
                  <Briefcase size={20} />
                  <span>New Work</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* MAIN NAVIGATION */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <motion.button
              onClick={() => navigateToView('dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
              style={getActiveDesktopStyle('dashboard')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </motion.button>

            <motion.button
              onClick={() => navigateToView('works')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
              style={getActiveDesktopStyle('works')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Briefcase size={20} />
              <span>Works</span>
            </motion.button>

            <motion.button
              onClick={() => navigateToView('calendar')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
              style={getActiveDesktopStyle('calendar')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CalendarDays size={20} />
              <span>Calendar</span>
              <div 
                className="w-2 h-2 rounded-full ml-auto"
                style={{ 
                  backgroundColor: currentView === 'calendar' ? 'white' : colors.primary 
                }}
              />
            </motion.button>

            {/* Shifts button with validation and tooltip */}
            <div className="relative">
              <motion.button
                onClick={() => navigateToView('shifts')}
                onMouseEnter={handleShiftsMouseEnter}
                onMouseLeave={handleShiftsMouseLeave}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all"
                style={getActiveDesktopStyle('shifts')}
                whileHover={hasWorks ? { scale: 1.02 } : {}}
                whileTap={hasWorks ? { scale: 0.98 } : {}}
              >
                <Calendar size={20} />
                <span>Shifts</span>
                {!hasWorks && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  </div>
                )}
              </motion.button>

              {/* Tooltip for when there are no jobs */}
              {showTooltip && !hasWorks && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50">
                  <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                    First create a job to add shifts
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
                  </div>
                </div>
              )}
            </div>

            <motion.button
              onClick={() => navigateToView('statistics')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
              style={getActiveDesktopStyle('statistics')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <BarChart2 size={20} />
              <span>Statistics</span>
            </motion.button>
          </div>
        </nav>

        {/* PREMIUM / LIVE MODE SECTION - Desktop only */}
        <div className="px-4 pb-2">
          <AnimatePresence mode="wait">
            {isLiveModeActive ? (
              // Live Mode Indicator
              <motion.button
                key="livemode"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                onClick={() => setIsLiveModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all"
                style={{
                  backgroundColor: colors.transparent10,
                  color: colors.primary,
                }}
                whileHover={{ scale: 1.02, backgroundColor: colors.transparent20 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={isPaused ? {} : { rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <CircleDotDashed size={20} className="text-red-500" />
                </motion.div>
                <div className="flex-1 text-left">
                  <p className="text-xs text-gray-500 font-normal">
                    {isPaused ? 'Paused' : 'Live Mode'}
                  </p>
                  <p className="font-semibold font-mono text-sm">
                    {formattedTime?.formatted || '00:00:00'}
                  </p>
                </div>
                {liveWork && (
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: liveWork.color || colors.primary }}
                  />
                )}
              </motion.button>
            ) : !isPremium ? (
              // Premium Upgrade Button (only for free users)
              <motion.button
                key="premium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                onClick={() => setIsPremiumModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all"
                style={{
                  backgroundColor: PREMIUM_COLORS.lighter,
                  color: PREMIUM_COLORS.primary,
                  border: `1px solid ${PREMIUM_COLORS.light}`,
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: `0 4px 12px ${PREMIUM_COLORS.primary}30`,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Crown size={20} style={{ color: PREMIUM_COLORS.gold }} />
                <div className="flex-1 text-left">
                  <p className="text-xs opacity-70 font-normal">
                    Unlock all features
                  </p>
                  <p className="font-semibold text-sm">
                    Upgrade to Premium
                  </p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Crown size={16} style={{ color: PREMIUM_COLORS.gold }} />
                </motion.div>
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800">
          <motion.button
            onClick={() => navigateToView('settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Settings size={20} />
            <span>Settings</span>
          </motion.button>
        </div>
      </aside>

      {/* Live Mode Active Modal */}
      <LiveModeActiveModal
        isOpen={isLiveModalOpen}
        onClose={() => setIsLiveModalOpen(false)}
      />

      {/* Premium Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </>
  );
};
export default Navigation;