// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';

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
import FooterSection from '../components/settings/FooterSection';

import LiveModeCard from '../components/dashboard/LiveModeCard';
import SuggestedActionCard from '../components/dashboard/SuggestedActionCard';
import LiveModeStartModal from '../components/modals/liveMode/LiveModeStartModal';
import LiveModeActiveModal from '../components/modals/liveMode/LiveModeActiveModal';

import Flex from '../components/ui/Flex';
import { useLiveMode } from '../hooks/useLiveMode';
import logger from '../utils/logger';

const Dashboard = () => {
  const { loading, calculatePayment, shiftRanges, settings, isPremium, premium } = useApp();
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
      <PageHeader
        title="Dashboard"
        subtitle="An overview of your activity and progress."
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:items-start">
          {/* Recent Activity */}
          <div className="lg:col-span-1 h-full">
            <RecentActivityCard
              stats={stats}
              allWorks={stats.allWorks}
              allShifts={stats.allShifts}
              calculatePayment={calculatePayment}
            />
          </div>

          {/* Data Grids */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6 flex flex-col">
                <FavoriteWorksCard favoriteWorks={stats.favoriteWorks} />
                {/* Desktop: animated layout */}
                <LayoutGroup>
                  <div className={`hidden md:grid gap-6 ${showSuggestion ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <motion.div layout transition={{ duration: 0.4, ease: 'easeInOut' }} className="flex flex-col gap-6">
                      <motion.div layout transition={{ duration: 0.4, ease: 'easeInOut' }}>
                        <TopWorkCard mostProfitableWork={stats.mostProfitableWork} />
                      </motion.div>
                      <motion.div layout transition={{ duration: 0.4, ease: 'easeInOut' }}>
                        <NextShiftCard
                          nextShift={stats.nextShift}
                          formatDate={stats.formatDate}
                        />
                      </motion.div>
                    </motion.div>
                    <AnimatePresence>
                      {showSuggestion && (
                        <motion.div
                          layout
                          initial={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <SuggestedActionCard onClose={() => setShowSuggestion(false)} className="h-full" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </LayoutGroup>

                {/* Mobile: stacked */}
                <div className="md:hidden space-y-6">
                  <TopWorkCard mostProfitableWork={stats.mostProfitableWork} />
                  <NextShiftCard
                    nextShift={stats.nextShift}
                    formatDate={stats.formatDate}
                  />
                  <AnimatePresence>
                    {showSuggestion && (
                      <motion.div
                        initial={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <SuggestedActionCard onClose={() => setShowSuggestion(false)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="space-y-6 flex flex-col">
                  <ProjectionCard
                  monthlyProjection={stats.monthlyProjection}
                  hoursWorked={stats.hoursWorked}
                  className="flex-grow"
                />
                <ExportReportCard onExport={handleExport} />
                <QuickActionsCard className="flex-grow" onOpenLiveMode={handleOpenLiveMode} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Flex variant="end">
        <FooterSection />
      </Flex>

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