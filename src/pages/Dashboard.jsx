// src/pages/Dashboard.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';
// import { useNavigate } from 'react-router-dom'; // Descomentamos cuando tengamos la ruta

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

import Flex from '../components/ui/Flex';

const Dashboard = () => {
  const { loading, calculatePayment } = useApp();
  const stats = useDashboardStats();
  // const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [showFeatureAnnouncement, setShowFeatureAnnouncement] = useState(true);

  const handleNavigateToLiveMode = () => {
    console.log("Navegando al nuevo Modo Live...");
    // navigate('/live'); // Aquí iremos a la página de navegación completa
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
        subtitle="Una vista general de tu actividad y progreso."
        icon={LayoutDashboard}
      />

      <div className="space-y-6">
        {/* --- SECCIÓN SUPERIOR DESKTOP --- */}
        <div className="hidden lg:grid lg:grid-cols-5 lg:auto-rows-max lg:gap-6">
          {showFeatureAnnouncement ? (
            <>
              {/* --- CON FEATURE --- */}
              <motion.div className="lg:col-span-4 h-full" variants={headerVariants} initial="hidden" animate="visible">
                <FeatureAnnouncementCard onClick={handleNavigateToLiveMode} className="h-full" />
              </motion.div>
              <motion.div className="lg:col-span-1 h-full" variants={headerVariants} initial="hidden" animate="visible">
                <WelcomeCard totalGanado={stats.totalGanado} isFeatureVisible={true} className="h-full" />
              </motion.div>
              
              <div className="lg:col-span-4 h-full">
                {/* MODIFICADO: Se pasan los datos crudos para la vista detallada */}
                <QuickStatsGrid 
                  stats={stats} 
                  todosLosTurnos={stats.todosLosTurnos}
                  todosLosTrabajos={stats.todosLosTrabajos}
                  className="h-full" 
                />
              </div>
              <div className="lg:col-span-1 h-full">
                <ThisWeekSummaryCard stats={stats} className="h-full" />
              </div>
            </>
          ) : (
            <>
              {/* --- SIN FEATURE --- */}
              <motion.div className="lg:col-span-4" variants={headerVariants} initial="hidden" animate="visible">
                <WelcomeCard totalGanado={stats.totalGanado} />
              </motion.div>
      
              <div className="lg:col-span-4 lg:row-start-2">
                {/* MODIFICADO: Se pasan los datos crudos para la vista detallada */}
                <QuickStatsGrid 
                  stats={stats} 
                  todosLosTurnos={stats.todosLosTurnos}
                  todosLosTrabajos={stats.todosLosTrabajos}
                />
              </div>

              <div className="lg:col-span-1 lg:col-start-5 lg:row-start-1 lg:row-span-2 h-full">
                <ThisWeekSummaryCard stats={stats} className="h-full"/>
              </div>
            </>
          )}
        </div>

        {/* --- SECCIÓN MÓVIL --- */}
        <div className="block lg:hidden space-y-4">
          {showFeatureAnnouncement && (
            <motion.div variants={headerVariants} initial="hidden" animate="visible">
              <FeatureAnnouncementCard onClick={handleNavigateToLiveMode} />
            </motion.div>
          )}
          <motion.div variants={headerVariants} initial="hidden" animate="visible">
            <WelcomeCard totalGanado={stats.totalGanado} />
          </motion.div>
          
          {/* MODIFICADO: Se pasan los datos crudos para la vista detallada */}
          <QuickStatsGrid 
            stats={stats} 
            todosLosTurnos={stats.todosLosTurnos}
            todosLosTrabajos={stats.todosLosTrabajos}
          />
          
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
                <NextShiftCard
                  proximoTurno={stats.proximoTurno}
                  formatearFecha={stats.formatearFecha}
                />
              </div>
              <div className="space-y-6 flex flex-col">
                  <ProjectionCard
                  proyeccionMensual={stats.proyeccionMensual}
                  horasTrabajadas={stats.horasTrabajadas}
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
    </div>
  );
};

export default Dashboard;