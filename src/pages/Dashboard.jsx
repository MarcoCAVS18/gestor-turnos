// src/pages/Dashboard.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';

import PageHeader from '../components/layout/PageHeader';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useApp } from '../contexts/AppContext';
import { generatePDFReport, generatePNGReport, generateXLSXReport } from '../services/exportService';
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

import FeatureAnnouncementCard from '../components/dashboard/FeatureAnnouncementCard';
import LiveModeStartModal from '../components/modals/liveMode/LiveModeStartModal';
import LiveModeActiveModal from '../components/modals/liveMode/LiveModeActiveModal';

import Flex from '../components/ui/Flex';
import { useLiveMode } from '../hooks/useLiveMode';

const Dashboard = () => {
  const { loading, calculatePayment } = useApp();
  const stats = useDashboardStats();
  const { isActive } = useLiveMode();

  // eslint-disable-next-line no-unused-vars
  const [showFeatureAnnouncement, setShowFeatureAnnouncement] = useState(true);

  // Live Mode modal states
  const [isLiveStartModalOpen, setIsLiveStartModalOpen] = useState(false);
  const [isLiveActiveModalOpen, setIsLiveActiveModalOpen] = useState(false);

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
      if (format === 'pdf') {
        await generatePDFReport(stats, stats.allShifts, stats.allWorks);
      } else if (format === 'png') {
        await generatePNGReport(stats, stats.allShifts, stats.allWorks);
      } else if (format === 'xlsx') {
        await generateXLSXReport(stats, stats.allShifts, stats.allWorks, calculatePayment);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
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
          {showFeatureAnnouncement ? (
            <>
              {/* --- WITH FEATURE --- */}
              <motion.div className="lg:col-span-4 h-full" variants={headerVariants} initial="hidden" animate="visible">
                <FeatureAnnouncementCard onClick={handleOpenLiveMode} onShowActive={handleShowActiveLiveMode} className="h-full" />
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
            </>
          ) : (
            <>
              {/* --- WITHOUT FEATURE --- */}
              <motion.div className="lg:col-span-4" variants={headerVariants} initial="hidden" animate="visible">
                <WelcomeCard totalEarned={stats.totalEarned} />
              </motion.div>
      
              <div className="lg:col-span-4 lg:row-start-2">
                <QuickStatsGrid 
                  stats={stats} 
                  allShifts={stats.allShifts}
                  allWorks={stats.allWorks}
                />
              </div>

              <div className="lg:col-span-1 lg:col-start-5 lg:row-start-1 lg:row-span-2 h-full">
                <ThisWeekSummaryCard stats={stats} className="h-full"/>
              </div>
            </>
          )}
        </div>

        {/* --- MOBILE SECTION --- */}
        <div className="block lg:hidden space-y-4">
          {showFeatureAnnouncement && (
            <motion.div variants={headerVariants} initial="hidden" animate="visible">
              <FeatureAnnouncementCard onClick={handleOpenLiveMode} onShowActive={handleShowActiveLiveMode} />
            </motion.div>
          )}
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
                <TopWorkCard mostProfitableWork={stats.mostProfitableWork} />
                <NextShiftCard
                  nextShift={stats.nextShift}
                  formatDate={stats.formatDate}
                />
              </div>
              <div className="space-y-6 flex flex-col">
                  <ProjectionCard
                  monthlyProjection={stats.monthlyProjection}
                  hoursWorked={stats.hoursWorked}
                  className="flex-grow"
                />
                <ExportReportCard onExport={handleExport} />
                <QuickActionsCard className="flex-grow" />
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