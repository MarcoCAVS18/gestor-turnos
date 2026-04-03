// src/components/layout/Navigation/index.jsx

import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useLiveModeContext } from '../../../contexts/LiveModeContext';
import { usePremium } from '../../../contexts/PremiumContext';
import LiveModeActiveModal from '../../modals/liveMode/LiveModeActiveModal';
import PremiumModal from '../../modals/premium/PremiumModal';
import logger from '../../../utils/logger';

import NavMobileBar from './NavMobileBar';
import NavSidebarHeader from './NavSidebarHeader';
import NavQuickActions from './NavQuickActions';
import NavMainLinks from './NavMainLinks';
import NavPremiumSection from './NavPremiumSection';

import './index.css';

const Navigation = memo(({ openNewWorkModal, openNewShiftModal }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { works, deliveryWork } = useApp();
  const { profilePhotoURL, updateProfilePhoto } = useAuth();
  const colors = useThemeColors();
  const { isActive: isLiveModeActive, formattedTime, isPaused, selectedWork: liveWork } = useLiveModeContext();
  const { isPremium } = usePremium();

  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
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

  const currentView = (() => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'dashboard';
    if (path === '/works') return 'works';
    if (path === '/shifts') return 'shifts';
    if (path === '/statistics') return 'statistics';
    if (path === '/calendar') return 'calendar';
    if (path === '/settings') return 'settings';
    return 'dashboard';
  })();

  const totalWorks = (works?.length || 0) + (deliveryWork?.length || 0);
  const hasWorks = totalWorks > 0;

  const navigateToView = useCallback((view) => {
    if (view === 'shifts' && !hasWorks) return;
    const routes = {
      dashboard: '/dashboard', works: '/works', shifts: '/shifts',
      statistics: '/statistics', calendar: '/calendar', settings: '/settings'
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(routes[view]);
  }, [navigate, hasWorks]);

  const getActiveTextStyle = useCallback((view) => (
    currentView === view ? { color: colors.primary } : { color: '#6B7280' }
  ), [currentView, colors.primary]);

  const getActiveDesktopStyle = useCallback((view) => {
    if (view === 'shifts' && !hasWorks) {
      return { backgroundColor: 'transparent', color: '#9CA3AF', cursor: 'not-allowed', opacity: 0.5 };
    }
    return currentView === view
      ? { backgroundColor: colors.primary, color: 'white' }
      : { backgroundColor: 'transparent', color: '#6B7280' };
  }, [currentView, colors.primary, hasWorks]);

  const calendarButtonStyle = {
    backgroundColor: colors.primary,
    borderColor: currentView === 'calendar' ? colors.primaryDark : 'white'
  };

  const handleShiftsMouseEnter = useCallback(() => { if (!hasWorks) setShowTooltip(true); }, [hasWorks]);
  const handleShiftsMouseLeave = useCallback(() => setShowTooltip(false), []);
  const handleLogoClick = useCallback(() => navigateToView('dashboard'), [navigateToView]);

  const handlePhotoUpload = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    window.dispatchEvent(new CustomEvent('profile-photo-loading-start'));
    try {
      await updateProfilePhoto(file);
    } catch (error) {
      logger.error('Error updating photo:', error);
    } finally {
      window.dispatchEvent(new CustomEvent('profile-photo-loading-end'));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [updateProfilePhoto]);

  const handleEditPhotoClick = useCallback((e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  }, []);

  return (
    <>
      <NavMobileBar
        navigateToView={navigateToView}
        currentView={currentView}
        colors={colors}
        t={t}
        calendarButtonStyle={calendarButtonStyle}
        getActiveTextStyle={getActiveTextStyle}
      />

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:flex-col w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 shadow-sm h-screen fixed left-0 top-0 z-30">
        <NavSidebarHeader
          fileInputRef={fileInputRef}
          handleLogoClick={handleLogoClick}
          profilePhotoURL={profilePhotoURL}
          isPhotoLoading={isPhotoLoading}
          showPhotoEdit={showPhotoEdit}
          setShowPhotoEdit={setShowPhotoEdit}
          handleEditPhotoClick={handleEditPhotoClick}
          handlePhotoUpload={handlePhotoUpload}
          colors={colors}
          t={t}
        />

        <NavQuickActions
          openNewShiftModal={openNewShiftModal}
          openNewWorkModal={openNewWorkModal}
          hasWorks={hasWorks}
          colors={colors}
          t={t}
        />

        <NavMainLinks
          navigateToView={navigateToView}
          currentView={currentView}
          hasWorks={hasWorks}
          colors={colors}
          t={t}
          showTooltip={showTooltip}
          handleShiftsMouseEnter={handleShiftsMouseEnter}
          handleShiftsMouseLeave={handleShiftsMouseLeave}
          getActiveDesktopStyle={getActiveDesktopStyle}
        />

        <NavPremiumSection
          isLiveModeActive={isLiveModeActive}
          isPaused={isPaused}
          formattedTime={formattedTime}
          liveWork={liveWork}
          isPremium={isPremium}
          colors={colors}
          t={t}
          onLiveModeClick={() => setIsLiveModalOpen(true)}
          onPremiumClick={() => setIsPremiumModalOpen(true)}
        />

        {/* SIDEBAR FOOTER */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800">
          <motion.button
            onClick={() => navigateToView('settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Settings size={20} />
            <span>{t('nav.settings')}</span>
          </motion.button>
        </div>
      </aside>

      <LiveModeActiveModal
        isOpen={isLiveModalOpen}
        onClose={() => setIsLiveModalOpen(false)}
      />

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </>
  );
});

Navigation.displayName = 'Navigation';
export default Navigation;
