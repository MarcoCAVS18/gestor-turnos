// src/pages/Dashboard.jsx

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

const Dashboard = () => {
  const { loading, calculatePayment } = useApp();
  const stats = useDashboardStats();

  // Función para manejar la exportación
  const handleExport = async (format) => {
    try {
      if (format === 'pdf') {
        await generatePDFReport(stats, stats.todosLosTurnos, stats.todosLosTrabajos);
      } else if (format === 'png') {
        await generatePNGReport(stats, stats.todosLosTurnos, stats.todosLosTrabajos);
      } else if (format === 'xlsx') {
        await generateXLSXReport(stats, stats.todosLosTurnos, stats.todosLosTrabajos, calculatePayment);
      }
    } catch (error) {
      console.error('Error al exportar reporte:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
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
        subtitle="Una vista general de tu actividad y progreso."
        icon={LayoutDashboard}
      />


      {/* Layout responsivo principal */}
      <div className="space-y-6">

        {/* DESKTOP: Grid de 3 columnas principales */}
        <div className="hidden lg:grid lg:grid-cols-5 lg:gap-6">

          {/* CONTENEDOR 1: Stats + Acciones (4 columnas) */}
          <div className="lg:col-span-4 space-y-6">
            {/* QuickStatsGrid maneja su propio layout desktop */}
            <motion.div variants={headerVariants} initial="hidden" animate="visible">
              <WelcomeCard totalGanado={stats.totalGanado} />
            </motion.div>
            <QuickStatsGrid stats={stats} />


          </div>

          {/* CONTENEDOR 2: Esta semana vertical (1 columna) */}
          <div className="lg:col-span-1">
            <ThisWeekSummaryCard stats={stats} />
          </div>
        </div>

        {/* MÓVIL: Stack vertical */}
        <div className="block lg:hidden space-y-4">
          {/* QuickStatsGrid maneja su propio layout móvil 2x2 */}
          <motion.div variants={headerVariants} initial="hidden" animate="visible">
            <WelcomeCard totalGanado={stats.totalGanado} />
          </motion.div>
          <QuickStatsGrid stats={stats} />

          {/* Esta semana */}
          <ThisWeekSummaryCard stats={stats} />

          {/* Acciones rápidas */}
          <QuickActionsCard />
        </div>

        {/* Segunda fila: Reorganizada con grilla anidada que ahora incluye Proyección */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:items-start">
          {/* Columna Izquierda: Actividad Reciente */}
          <div className="lg:col-span-1 h-full">
            <RecentActivityCard
              stats={stats}
              todosLosTrabajos={stats.todosLosTrabajos}
              todosLosTurnos={stats.todosLosTurnos}
            />
          </div>

          {/* Columna Derecha: Reorganizada en 2 columnas */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna Izquierda */}
              <div className="space-y-6 flex flex-col">
                <FavoriteWorksCard trabajosFavoritos={stats.trabajosFavoritos} />
                <TopWorkCard trabajoMasRentable={stats.trabajoMasRentable} />
                <ProjectionCard
                  proyeccionMensual={stats.proyeccionMensual}
                  horasTrabajadas={stats.horasTrabajadas}
                  className="flex-grow"
                />
              </div>
              {/* Columna Derecha */}
              <div className="space-y-6 flex flex-col">
                <NextShiftCard
                  proximoTurno={stats.proximoTurno}
                  formatearFecha={stats.formatearFecha}
                />
                <ExportReportCard onExport={handleExport} />
                <QuickActionsCard className="flex-grow" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center mt-8">
        <FooterSection />
      </div>
    </div>
  );
};

export default Dashboard;