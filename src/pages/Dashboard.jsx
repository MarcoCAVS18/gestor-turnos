// src/pages/Dashboard.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';
import ***REMOVED*** LayoutDashboard ***REMOVED*** from 'lucide-react';
// import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom'; // Descomentamos cuando tengamos la ruta

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

// Importamos la nueva tarjeta de anuncio
import FeatureAnnouncementCard from '../components/dashboard/FeatureAnnouncementCard';

const Dashboard = () => ***REMOVED***
  const ***REMOVED*** loading, calculatePayment ***REMOVED*** = useApp();
  const stats = useDashboardStats();
  // const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [showFeatureAnnouncement, setShowFeatureAnnouncement] = useState(true);

  const handleNavigateToLiveMode = () => ***REMOVED***
    console.log("Navegando al nuevo Modo Live...");
    // navigate('/live'); // Aquí iremos a la página de navegación completa
  ***REMOVED***;

  const handleExport = async (format) => ***REMOVED***
    try ***REMOVED***
      if (format === 'pdf') ***REMOVED***
        await generatePDFReport(stats, stats.todosLosTurnos, stats.todosLosTrabajos);
      ***REMOVED*** else if (format === 'png') ***REMOVED***
        await generatePNGReport(stats, stats.todosLosTurnos, stats.todosLosTrabajos);
      ***REMOVED*** else if (format === 'xlsx') ***REMOVED***
        await generateXLSXReport(stats, stats.todosLosTurnos, stats.todosLosTrabajos, calculatePayment);
      ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al exportar reporte:', error);
    ***REMOVED***
  ***REMOVED***;

  if (loading) ***REMOVED***
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
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
        subtitle="Una vista general de tu actividad y progreso."
        icon=***REMOVED***LayoutDashboard***REMOVED***
      />

      <div className="space-y-6">
        ***REMOVED***/* --- SECCIÓN SUPERIOR DESKTOP --- */***REMOVED***
        <div className="hidden lg:grid lg:grid-cols-5 lg:auto-rows-max lg:gap-6">
          ***REMOVED***showFeatureAnnouncement ? (
            <>
              ***REMOVED***/* --- CON FEATURE --- */***REMOVED***
              <motion.div className="lg:col-span-4 h-full" variants=***REMOVED***headerVariants***REMOVED*** initial="hidden" animate="visible">
                <FeatureAnnouncementCard onClick=***REMOVED***handleNavigateToLiveMode***REMOVED*** className="h-full" />
              </motion.div>
              <motion.div className="lg:col-span-1 h-full" variants=***REMOVED***headerVariants***REMOVED*** initial="hidden" animate="visible">
                <WelcomeCard totalGanado=***REMOVED***stats.totalGanado***REMOVED*** isFeatureVisible=***REMOVED***true***REMOVED*** className="h-full" />
              </motion.div>
              
              <div className="lg:col-span-4 h-full">
                ***REMOVED***/* MODIFICADO: Se pasan los datos crudos para la vista detallada */***REMOVED***
                <QuickStatsGrid 
                  stats=***REMOVED***stats***REMOVED*** 
                  todosLosTurnos=***REMOVED***stats.todosLosTurnos***REMOVED***
                  todosLosTrabajos=***REMOVED***stats.todosLosTrabajos***REMOVED***
                  className="h-full" 
                />
              </div>
              <div className="lg:col-span-1 h-full">
                <ThisWeekSummaryCard stats=***REMOVED***stats***REMOVED*** className="h-full" />
              </div>
            </>
          ) : (
            <>
              ***REMOVED***/* --- SIN FEATURE --- */***REMOVED***
              <motion.div className="lg:col-span-4" variants=***REMOVED***headerVariants***REMOVED*** initial="hidden" animate="visible">
                <WelcomeCard totalGanado=***REMOVED***stats.totalGanado***REMOVED*** />
              </motion.div>
      
              <div className="lg:col-span-4 lg:row-start-2">
                ***REMOVED***/* MODIFICADO: Se pasan los datos crudos para la vista detallada */***REMOVED***
                <QuickStatsGrid 
                  stats=***REMOVED***stats***REMOVED*** 
                  todosLosTurnos=***REMOVED***stats.todosLosTurnos***REMOVED***
                  todosLosTrabajos=***REMOVED***stats.todosLosTrabajos***REMOVED***
                />
              </div>

              <div className="lg:col-span-1 lg:col-start-5 lg:row-start-1 lg:row-span-2 h-full">
                <ThisWeekSummaryCard stats=***REMOVED***stats***REMOVED*** className="h-full"/>
              </div>
            </>
          )***REMOVED***
        </div>

        ***REMOVED***/* --- SECCIÓN MÓVIL --- */***REMOVED***
        <div className="block lg:hidden space-y-4">
          ***REMOVED***showFeatureAnnouncement && (
            <motion.div variants=***REMOVED***headerVariants***REMOVED*** initial="hidden" animate="visible">
              <FeatureAnnouncementCard onClick=***REMOVED***handleNavigateToLiveMode***REMOVED*** />
            </motion.div>
          )***REMOVED***
          <motion.div variants=***REMOVED***headerVariants***REMOVED*** initial="hidden" animate="visible">
            <WelcomeCard totalGanado=***REMOVED***stats.totalGanado***REMOVED*** />
          </motion.div>
          
          ***REMOVED***/* MODIFICADO: Se pasan los datos crudos para la vista detallada */***REMOVED***
          <QuickStatsGrid 
            stats=***REMOVED***stats***REMOVED*** 
            todosLosTurnos=***REMOVED***stats.todosLosTurnos***REMOVED***
            todosLosTrabajos=***REMOVED***stats.todosLosTrabajos***REMOVED***
          />
          
          <ThisWeekSummaryCard stats=***REMOVED***stats***REMOVED*** />
        </div>

        ***REMOVED***/* --- FILA INFERIOR (Común) --- */***REMOVED***
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:items-start">
          ***REMOVED***/* Actividad Reciente */***REMOVED***
          <div className="lg:col-span-1 h-full">
            <RecentActivityCard
              stats=***REMOVED***stats***REMOVED***
              todosLosTrabajos=***REMOVED***stats.todosLosTrabajos***REMOVED***
              todosLosTurnos=***REMOVED***stats.todosLosTurnos***REMOVED***
            />
          </div>

          ***REMOVED***/* Grillas de datos */***REMOVED***
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6 flex flex-col">
                <FavoriteWorksCard trabajosFavoritos=***REMOVED***stats.trabajosFavoritos***REMOVED*** />
                <TopWorkCard trabajoMasRentable=***REMOVED***stats.trabajoMasRentable***REMOVED*** />
                <NextShiftCard
                  proximoTurno=***REMOVED***stats.proximoTurno***REMOVED***
                  formatearFecha=***REMOVED***stats.formatearFecha***REMOVED***
                />
              </div>
              <div className="space-y-6 flex flex-col">
                  <ProjectionCard
                  proyeccionMensual=***REMOVED***stats.proyeccionMensual***REMOVED***
                  horasTrabajadas=***REMOVED***stats.horasTrabajadas***REMOVED***
                  className="flex-grow"
                />
                <ExportReportCard onExport=***REMOVED***handleExport***REMOVED*** />
                <QuickActionsCard className="flex-grow" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <FooterSection />
      </div>
    </div>
  );
***REMOVED***;

export default Dashboard;