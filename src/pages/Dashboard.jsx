// src/pages/Dashboard.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';
import ***REMOVED*** LayoutDashboard ***REMOVED*** from 'lucide-react';
// import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom'; // Uncomment when we have the route

import PageHeader from '../components/layout/PageHeader';
import ***REMOVED*** useDashboardStats ***REMOVED*** from '../hooks/useDashboardStats';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** generatePDFReport, generatePNGReport, generateXLSXReport ***REMOVED*** from '../services/exportService';
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

import Flex from '../components/ui/Flex';

const Dashboard = () => ***REMOVED***
  const ***REMOVED*** loading, calculatePayment ***REMOVED*** = useApp();
  const stats = useDashboardStats();
  // const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [showFeatureAnnouncement, setShowFeatureAnnouncement] = useState(true);

  const handleNavigateToLiveMode = () => ***REMOVED***
    console.log("Navigating to new Live Mode...");
    // navigate('/live'); // Here we will go to the full navigation page
  ***REMOVED***;

  const handleExport = async (format) => ***REMOVED***
    try ***REMOVED***
      if (format === 'pdf') ***REMOVED***
        await generatePDFReport(stats, stats.allShifts, stats.allWorks);
      ***REMOVED*** else if (format === 'png') ***REMOVED***
        await generatePNGReport(stats, stats.allShifts, stats.allWorks);
      ***REMOVED*** else if (format === 'xlsx') ***REMOVED***
        await generateXLSXReport(stats, stats.allShifts, stats.allWorks, calculatePayment);
      ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error exporting report:', error);
    ***REMOVED***
  ***REMOVED***;

  if (loading) ***REMOVED***
    return (
      <Flex variant="center" className="h-screen">
        <Loader />
      </Flex>
    );
  ***REMOVED***

  const headerVariants = ***REMOVED***
    hidden: ***REMOVED*** opacity: 0, y: -20 ***REMOVED***,
    visible: ***REMOVED*** opacity: 1, y: 0, transition: ***REMOVED*** duration: 0.3 ***REMOVED*** ***REMOVED***
  ***REMOVED***;

  return (
    <div className="px-4 py-6 space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="An overview of your activity and progress."
        icon=***REMOVED***LayoutDashboard***REMOVED***
      />

      <div className="space-y-6">
        ***REMOVED***/* --- DESKTOP TOP SECTION --- */***REMOVED***
        <div className="hidden lg:grid lg:grid-cols-5 lg:auto-rows-max lg:gap-6">
          ***REMOVED***showFeatureAnnouncement ? (
            <>
              ***REMOVED***/* --- WITH FEATURE --- */***REMOVED***
              <motion.div className="lg:col-span-4 h-full" variants=***REMOVED***headerVariants***REMOVED*** initial="hidden" animate="visible">
                <FeatureAnnouncementCard onClick=***REMOVED***handleNavigateToLiveMode***REMOVED*** className="h-full" />
              </motion.div>
              <motion.div className="lg:col-span-1 h-full" variants=***REMOVED***headerVariants***REMOVED*** initial="hidden" animate="visible">
                <WelcomeCard totalEarned=***REMOVED***stats.totalEarned***REMOVED*** isFeatureVisible=***REMOVED***true***REMOVED*** className="h-full" />
              </motion.div>
              
              <div className="lg:col-span-4 h-full">
                <QuickStatsGrid 
                  stats=***REMOVED***stats***REMOVED*** 
                  allShifts=***REMOVED***stats.allShifts***REMOVED***
                  allWorks=***REMOVED***stats.allWorks***REMOVED***
                  className="h-full" 
                />
              </div>
              <div className="lg:col-span-1 h-full">
                <ThisWeekSummaryCard stats=***REMOVED***stats***REMOVED*** className="h-full" />
              </div>
            </>
          ) : (
            <>
              ***REMOVED***/* --- WITHOUT FEATURE --- */***REMOVED***
              <motion.div className="lg:col-span-4" variants=***REMOVED***headerVariants***REMOVED*** initial="hidden" animate="visible">
                <WelcomeCard totalEarned=***REMOVED***stats.totalEarned***REMOVED*** />
              </motion.div>
      
              <div className="lg:col-span-4 lg:row-start-2">
                <QuickStatsGrid 
                  stats=***REMOVED***stats***REMOVED*** 
                  allShifts=***REMOVED***stats.allShifts***REMOVED***
                  allWorks=***REMOVED***stats.allWorks***REMOVED***
                />
              </div>

              <div className="lg:col-span-1 lg:col-start-5 lg:row-start-1 lg:row-span-2 h-full">
                <ThisWeekSummaryCard stats=***REMOVED***stats***REMOVED*** className="h-full"/>
              </div>
            </>
          )***REMOVED***
        </div>

        ***REMOVED***/* --- MOBILE SECTION --- */***REMOVED***
        <div className="block lg:hidden space-y-4">
          ***REMOVED***showFeatureAnnouncement && (
            <motion.div variants=***REMOVED***headerVariants***REMOVED*** initial="hidden" animate="visible">
              <FeatureAnnouncementCard onClick=***REMOVED***handleNavigateToLiveMode***REMOVED*** />
            </motion.div>
          )***REMOVED***
          <motion.div variants=***REMOVED***headerVariants***REMOVED*** initial="hidden" animate="visible">
            <WelcomeCard totalEarned=***REMOVED***stats.totalEarned***REMOVED*** />
          </motion.div>
          
          <QuickStatsGrid 
            stats=***REMOVED***stats***REMOVED*** 
            allShifts=***REMOVED***stats.allShifts***REMOVED***
            allWorks=***REMOVED***stats.allWorks***REMOVED***
          />
          
          <ThisWeekSummaryCard stats=***REMOVED***stats***REMOVED*** />
        </div>

        ***REMOVED***/* --- BOTTOM ROW (Common) --- */***REMOVED***
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:items-start">
          ***REMOVED***/* Recent Activity */***REMOVED***
          <div className="lg:col-span-1 h-full">
            <RecentActivityCard
              stats=***REMOVED***stats***REMOVED***
              allWorks=***REMOVED***stats.allWorks***REMOVED***
              allShifts=***REMOVED***stats.allShifts***REMOVED***
            />
          </div>

          ***REMOVED***/* Data Grids */***REMOVED***
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6 flex flex-col">
                <FavoriteWorksCard favoriteWorks=***REMOVED***stats.favoriteWorks***REMOVED*** />
                <TopWorkCard mostProfitableWork=***REMOVED***stats.mostProfitableWork***REMOVED*** />
                <NextShiftCard
                  nextShift=***REMOVED***stats.nextShift***REMOVED***
                  formatDate=***REMOVED***stats.formatDate***REMOVED***
                />
              </div>
              <div className="space-y-6 flex flex-col">
                  <ProjectionCard
                  monthlyProjection=***REMOVED***stats.monthlyProjection***REMOVED***
                  hoursWorked=***REMOVED***stats.hoursWorked***REMOVED***
                  className="flex-grow"
                />
                <ExportReportCard onExport=***REMOVED***handleExport***REMOVED*** />
                <QuickActionsCard className="flex-grow" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Flex variant="end">
        <FooterSection />
      </Flex>
    </div>
  );
***REMOVED***;

export default Dashboard;