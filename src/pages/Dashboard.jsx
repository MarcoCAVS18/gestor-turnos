// src/pages/Dashboard.jsx

import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';
import ***REMOVED*** LayoutDashboard ***REMOVED*** from 'lucide-react';
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

const Dashboard = () => ***REMOVED***
  const ***REMOVED*** loading, calculatePayment ***REMOVED*** = useApp();
  const stats = useDashboardStats();

  // Función para manejar la exportación
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


      ***REMOVED***/* Layout responsivo principal */***REMOVED***
      <div className="space-y-6">

        ***REMOVED***/* DESKTOP: Grid de 3 columnas principales */***REMOVED***
        <div className="hidden lg:grid lg:grid-cols-5 lg:gap-6">

          ***REMOVED***/* CONTENEDOR 1: Stats + Acciones (4 columnas) */***REMOVED***
          <div className="lg:col-span-4 space-y-6">
            ***REMOVED***/* QuickStatsGrid maneja su propio layout desktop */***REMOVED***
            <motion.div variants=***REMOVED***headerVariants***REMOVED*** initial="hidden" animate="visible">
              <WelcomeCard totalGanado=***REMOVED***stats.totalGanado***REMOVED*** />
            </motion.div>
            <QuickStatsGrid stats=***REMOVED***stats***REMOVED*** />


          </div>

          ***REMOVED***/* CONTENEDOR 2: Esta semana vertical (1 columna) */***REMOVED***
          <div className="lg:col-span-1">
            <ThisWeekSummaryCard stats=***REMOVED***stats***REMOVED*** />
          </div>
        </div>

        ***REMOVED***/* MÓVIL: Stack vertical */***REMOVED***
        <div className="block lg:hidden space-y-4">
          ***REMOVED***/* QuickStatsGrid maneja su propio layout móvil 2x2 */***REMOVED***
          <motion.div variants=***REMOVED***headerVariants***REMOVED*** initial="hidden" animate="visible">
            <WelcomeCard totalGanado=***REMOVED***stats.totalGanado***REMOVED*** />
          </motion.div>
          <QuickStatsGrid stats=***REMOVED***stats***REMOVED*** />

          ***REMOVED***/* Esta semana */***REMOVED***
          <ThisWeekSummaryCard stats=***REMOVED***stats***REMOVED*** />

          ***REMOVED***/* Acciones rápidas */***REMOVED***
          <QuickActionsCard />
        </div>

        ***REMOVED***/* Segunda fila: Reorganizada con grilla anidada que ahora incluye Proyección */***REMOVED***
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:items-start">
          ***REMOVED***/* Columna Izquierda: Actividad Reciente */***REMOVED***
          <div className="lg:col-span-1 h-full">
            <RecentActivityCard
              stats=***REMOVED***stats***REMOVED***
              todosLosTrabajos=***REMOVED***stats.todosLosTrabajos***REMOVED***
              todosLosTurnos=***REMOVED***stats.todosLosTurnos***REMOVED***
            />
          </div>

          ***REMOVED***/* Columna Derecha: Grilla anidada de 2 columnas + fila inferior */***REMOVED***
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
              ***REMOVED***/* Top Left: Favorite Works */***REMOVED***
              <FavoriteWorksCard trabajosFavoritos=***REMOVED***stats.trabajosFavoritos***REMOVED*** className="flex-grow" />

              ***REMOVED***/* Top Right: Export Report Card + Next Shift Card */***REMOVED***
              <div className="flex flex-col gap-6">
                <NextShiftCard
                  proximoTurno=***REMOVED***stats.proximoTurno***REMOVED***
                  formatearFecha=***REMOVED***stats.formatearFecha***REMOVED***
                />
                <ExportReportCard onExport=***REMOVED***handleExport***REMOVED*** className="flex-grow" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
              ***REMOVED***/* Bottom Left: Top Work */***REMOVED***
              <TopWorkCard trabajoMasRentable=***REMOVED***stats.trabajoMasRentable***REMOVED*** className="flex-grow" />

              ***REMOVED***/* Bottom Right: Quick Actions */***REMOVED***
              <QuickActionsCard className="flex-grow" />
            </div>

            ***REMOVED***/* Fila inferior para Proyección */***REMOVED***
            <div>
              <ProjectionCard
                proyeccionMensual=***REMOVED***stats.proyeccionMensual***REMOVED***
                horasTrabajadas=***REMOVED***stats.horasTrabajadas***REMOVED***
              />
            </div>
          </div>
        </div>
      </div>

      ***REMOVED***/* Footer */***REMOVED***
      <div className="flex justify-center mt-8">
        <FooterSection />
      </div>
    </div>
  );
***REMOVED***;

export default Dashboard;