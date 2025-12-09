// src/pages/Dashboard.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';
// import { useNavigate } from 'react-router-dom'; // Descomenta cuando tengas la ruta

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

// Importamos la nueva tarjeta de anuncio
import FeatureAnnouncementCard from '../components/dashboard/FeatureAnnouncementCard';

const Dashboard = () => {
  const { loading, calculatePayment } = useApp();
  const stats = useDashboardStats();
  // const navigate = useNavigate();

  const handleNavigateToLiveMode = () => {
    console.log("Navegando al nuevo Modo Live...");
    // navigate('/live'); // Aquí irás a tu nueva página de navegación completa
  };

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

      <div className="space-y-6">

        {/* --- SECCIÓN DESKTOP --- */}
        <div className="hidden lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-4 space-y-6">
            
            {/* Feature Announcement Card: Hero Element */}
            <motion.div variants={headerVariants} initial="hidden" animate="visible">
                <FeatureAnnouncementCard onClick={handleNavigateToLiveMode} />
            </motion.div>

            <motion.div variants={headerVariants} initial="hidden" animate="visible">
              <WelcomeCard totalGanado={stats.totalGanado} />
            </motion.div>
            
            <QuickStatsGrid stats={stats} />
          </div>

          <div className="lg:col-span-1">
            <ThisWeekSummaryCard stats={stats} />
          </div>
        </div>

        {/* --- SECCIÓN MÓVIL --- */}
        <div className="block lg:hidden space-y-4">
          
          {/* Feature Announcement Card: Hero Element Mobile */}
          <motion.div variants={headerVariants} initial="hidden" animate="visible">
              <FeatureAnnouncementCard onClick={handleNavigateToLiveMode} />
          </motion.div>

          <motion.div variants={headerVariants} initial="hidden" animate="visible">
            <WelcomeCard totalGanado={stats.totalGanado} />
          </motion.div>
          
          <QuickStatsGrid stats={stats} />
          <ThisWeekSummaryCard stats={stats} />
        </div>

        {/* --- FILA INFERIOR (Común) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:items-start">
          {/* Actividad Reciente */}
          <div className="lg:col-span-1 h-full">
            <RecentActivityCard
              stats={stats}
              todosLosTrabajos={stats.todosLosTrabajos}
              todosLosTurnos={stats.todosLosTurnos}
            />
          </div>

          {/* Grillas de datos */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6 flex flex-col">
                <FavoriteWorksCard trabajosFavoritos={stats.trabajosFavoritos} />
                <TopWorkCard trabajoMasRentable={stats.trabajoMasRentable} />
                <ProjectionCard
                  proyeccionMensual={stats.proyeccionMensual}
                  horasTrabajadas={stats.horasTrabajadas}
                  className="flex-grow"
                />
              </div>
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

      <div className="flex justify-center mt-8">
        <FooterSection />
      </div>
    </div>
  );
};

export default Dashboard;