// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import PageHeader from '../components/layout/PageHeader';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { exportReport, preloadExportResources } from '../services/export';
import Loader from '../components/other/Loader';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import QuickStatsGrid from '../components/dashboard/QuickStatsGrid';
import ThisWeekSummaryCard from '../components/dashboard/ThisWeekSummaryCard';
import RecentActivityCard from '../components/dashboard/RecentActivityCard';
import NextShiftCard from '../components/dashboard/NextShiftCard';
import TopWorkCard from '../components/dashboard/TopWorkCard';
import FavoriteWorksCard from '../components/dashboard/FavoriteWorksCard';
import ProjectionCard from '../components/dashboard/ProjectionCard';
import QuickActionsCard from '../components/dashboard/QuickActionsCard';
import ExportReportCard from '../components/dashboard/ExportReportCard';
import NovedadesCard from '../components/dashboard/NovedadesCard';
import FooterSection from '../components/settings/FooterSection';

import LiveModeCard from '../components/dashboard/LiveModeCard';
import SuggestedActionCard from '../components/dashboard/SuggestedActionCard';
import LiveModeStartModal from '../components/modals/liveMode/LiveModeStartModal';
import LiveModeActiveModal from '../components/modals/liveMode/LiveModeActiveModal';
import DemoModal from '../components/demos/DemoModal';

import Flex from '../components/ui/Flex';
import { useLiveMode } from '../hooks/useLiveMode';
import logger from '../utils/logger';
import Australia88Ticker from '../components/australia88/Australia88Ticker';

const Dashboard = () => {
  const { t } = useTranslation();
  const { loading, calculatePayment, shiftRanges, settings, isPremium, premium } = useApp();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const stats = useDashboardStats();
  const { isActive } = useLiveMode();

  const [showSuggestion, setShowSuggestion] = useState(true);

  // Live Mode modal states
  const [isLiveStartModalOpen, setIsLiveStartModalOpen] = useState(false);
  const [isLiveActiveModalOpen, setIsLiveActiveModalOpen] = useState(false);

  // Preload export resources when component mounts
  useEffect(() => {
    preloadExportResources().catch(err => {
      logger.warn('Could not preload export resources:', err);
    });
  }, []);

  const handleOpenLiveMode = () => {
    if (isActive) {
      setIsLiveActiveModalOpen(true);
    } else {
      setIsLiveStartModalOpen(true);
    }
  };

  const handleShowActiveLiveMode = () => {
    setIsLiveActiveModalOpen(true);
  };

  const handleExport = async (format) => {
    try {
      // Prepare export options
      const exportOptions = {
        shiftRanges,
        userSettings: settings,
        deliveryShifts: stats.allShifts?.filter(s => s.type === 'delivery') || [],
        deliveryWorks: stats.allWorks?.filter(w => w.type === 'delivery') || [],
        userInfo: {
          name: currentUser?.displayName || currentUser?.email || 'User',
          isPremium,
          premiumSince: premium?.subscription?.startDate || null
        }
      };

      // Export using new professional system
      await exportReport(
        format,
        stats,
        stats.allShifts || [],
        stats.allWorks || [],
        calculatePayment,
        exportOptions
      );
    } catch (error) {
      logger.error('Export error:', error);
      // Export error - silently handled in UI
    }
  };

  if (loading) {
    return (
      <Flex variant="center" className="h-screen">
        <Loader />
      </Flex>
    );
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <Helmet>
        <title>Dashboard - Orary</title>
        <meta name="description" content="View your shift summary, earnings overview, and quick stats at a glance." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* Australia 88 — scrolling ticker, only visible when AU mode is active */}
      <Australia88Ticker />

      <PageHeader
        title={t('nav.dashboard')}
        subtitle={t('dashboard.subtitle')}
        icon={LayoutDashboard}
      />

      <div className="space-y-6">
        {/* --- DESKTOP TOP SECTION --- */}
        <div className="hidden lg:grid lg:grid-cols-5 lg:auto-rows-max lg:gap-6">
          <motion.div className="lg:col-span-4 h-full" variants={headerVariants} initial="hidden" animate="visible">
            <LiveModeCard onClick={handleOpenLiveMode} onShowActive={handleShowActiveLiveMode} className="h-full" />
          </motion.div>
          <motion.div className="lg:col-span-1 h-full" variants={headerVariants} initial="hidden" animate="visible">
            <WelcomeCard totalEarned={stats.totalEarned} isFeatureVisible={true} className="h-full" />
          </motion.div>

          <div className="lg:col-span-4 h-full">
            <QuickStatsGrid
              stats={stats}
              allShifts={stats.allShifts}
              allWorks={stats.allWorks}
              className="h-full"
            />
          </div>
          <div className="lg:col-span-1 h-full">
            <ThisWeekSummaryCard stats={stats} className="h-full" />
          </div>
        </div>

        {/* --- MOBILE SECTION --- */}
        <div className="block lg:hidden space-y-4">
          <motion.div variants={headerVariants} initial="hidden" animate="visible">
            <LiveModeCard onClick={handleOpenLiveMode} onShowActive={handleShowActiveLiveMode} />
          </motion.div>
          <motion.div variants={headerVariants} initial="hidden" animate="visible">
            <WelcomeCard totalEarned={stats.totalEarned} />
          </motion.div>
          
          <QuickStatsGrid 
            stats={stats} 
            allShifts={stats.allShifts}
            allWorks={stats.allWorks}
          />
          
          <ThisWeekSummaryCard stats={stats} />
        </div>

        {/* --- BOTTOM ROW (Common) --- */}
        {/*
          lg layout (per design sketch):
            ┌──────────┬───────────────────────┐
            │ Activity │ Working Holiday Visa   │   (WHV spans the 2 middle cols)
            │ Recent   ├───────────┬───────────┤
            │ (rows    │ Top work  │ Enjoying  │   (Suggested is tall: rows 2-3)
            ├──────────┴───────────┤  Orary?   │
            │ Next shift (cols 1-2)│           │
            └──────────────────────┴───────────┘   + right column (utilities) untouched
          Left region is a 3-col / 3-row grid; the right column keeps the utility
          cards unchanged.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT region — 2D grid of the five content cards */}
          <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] gap-6">

            {/* Actividad reciente — col 1, spans the top two rows so it matches the
                bottom of the WHV + Top-work stack (Trabajo más rentable). */}
            <div className="lg:col-start-1 lg:row-start-1 lg:row-span-2">
              <RecentActivityCard
                stats={stats}
                allWorks={stats.allWorks}
                allShifts={stats.allShifts}
                calculatePayment={calculatePayment}
              />
            </div>

            {/* Working Holiday Visa / favorite works — row 1, spans cols 2-3 */}
            <div className="lg:col-start-2 lg:row-start-1 lg:col-span-2 lg:self-start">
              <FavoriteWorksCard favoriteWorks={stats.favoriteWorks} />
            </div>

            {/* Trabajo más rentable — col 2, row 2 */}
            <div className="lg:col-start-2 lg:row-start-2 lg:self-start">
              <TopWorkCard mostProfitableWork={stats.mostProfitableWork} />
            </div>

            {/* ¿Disfrutando Orary? — col 3, spans rows 2-3 (tall) */}
            <AnimatePresence>
              {showSuggestion && (
                <motion.div
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="lg:col-start-3 lg:row-start-2 lg:row-span-2"
                >
                  <SuggestedActionCard onClose={() => setShowSuggestion(false)} className="h-full" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Próximo turno — row 3, spans cols 1-2; grows to the bottom */}
            <div className="lg:col-start-1 lg:row-start-3 lg:col-span-2 flex">
              <NextShiftCard
                nextShift={stats.nextShift}
                formatDate={stats.formatDate}
                className="w-full h-full"
              />
            </div>

          </div>

          {/* RIGHT region — utilities */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ProjectionCard
              monthlyProjection={stats.monthlyProjection}
              hoursWorked={stats.hoursWorked}
            />
            <ExportReportCard onExport={handleExport} />
            {/* Novedades — solid white, flips to "Próximamente" on click; fills the
                remaining height on desktop so the column ends level with the left region */}
            <NovedadesCard className="lg:flex-grow" />
            {/* Quick actions only on mobile/tablet — hidden on desktop */}
            <QuickActionsCard className="lg:hidden" onOpenLiveMode={handleOpenLiveMode} />
          </div>

        </div>
      </div>

      <Flex variant="end">
        <FooterSection />
      </Flex>

      {/* Welcome Demo — shown once after first login */}
      <DemoModal onComplete={() => { navigate('/settings'); }} />

      {/* Live Mode Modals */}
      <LiveModeStartModal
        isOpen={isLiveStartModalOpen}
        onClose={() => setIsLiveStartModalOpen(false)}
      />
      <LiveModeActiveModal
        isOpen={isLiveActiveModalOpen}
        onClose={() => setIsLiveActiveModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
