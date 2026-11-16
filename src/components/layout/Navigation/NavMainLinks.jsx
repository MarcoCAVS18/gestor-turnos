// src/components/layout/Navigation/NavMainLinks.jsx

import React, { memo } from 'react';
import { Home, Briefcase, Calendar, BarChart2, CalendarDays, FileText, Bike, Crown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PREMIUM_COLORS } from '../../../contexts/PremiumContext';

const NavMainLinks = memo(({
  navigateToView,
  currentView,
  currentPath,
  hasWorks,
  deliveryEnabled,
  australia88Enabled,
  isPremium,
  colors,
  t,
  showTooltip,
  handleShiftsMouseEnter,
  handleShiftsMouseLeave,
  getActiveDesktopStyle,
}) => {
  const isStatisticsActive = currentView === 'statistics';

  // Estilo para sub-ítems del sidebar (menores, indentados).
  // "/statistics" sin sufijo solo puede verse un instante antes del redirect
  // desktop al semanal, así que el semanal lo cubre también.
  const getSubItemStyle = (path) => {
    const isActive = path === '/statistics/weekly'
      ? (currentPath === '/statistics/weekly' || currentPath === '/statistics')
      : currentPath === path;
    return {
      color: isActive ? colors.primary : '#6B7280',
      backgroundColor: isActive ? `${colors.primary}15` : 'transparent',
    };
  };

  return (
    <nav className="flex-1 min-h-0 overflow-y-auto p-4">
      <div className="space-y-2">
        <motion.button
          onClick={() => navigateToView('dashboard')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
          style={getActiveDesktopStyle('dashboard')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Home size={20} />
          <span>{t('nav.dashboard')}</span>
        </motion.button>

        <motion.button
          onClick={() => navigateToView('works')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
          style={getActiveDesktopStyle('works')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Briefcase size={20} />
          <span>{t('nav.works')}</span>
        </motion.button>

        <motion.button
          onClick={() => navigateToView('calendar')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
          style={getActiveDesktopStyle('calendar')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <CalendarDays size={20} />
          <span>{t('nav.calendar')}</span>
          <div
            className="w-2 h-2 rounded-full ml-auto"
            style={{
              backgroundColor: currentView === 'calendar' ? 'white' : colors.primary
            }}
          />
        </motion.button>

        {/* Shifts button with validation and tooltip */}
        <div className="relative">
          <motion.button
            onClick={() => navigateToView('shifts')}
            onMouseEnter={handleShiftsMouseEnter}
            onMouseLeave={handleShiftsMouseLeave}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all"
            style={getActiveDesktopStyle('shifts')}
            disabled={!hasWorks}
            aria-disabled={!hasWorks}
            aria-describedby={!hasWorks ? 'shifts-disabled-tooltip' : undefined}
            whileHover={hasWorks ? { scale: 1.02 } : {}}
            whileTap={hasWorks ? { scale: 0.98 } : {}}
          >
            <Calendar size={20} />
            <span>{t('nav.shifts')}</span>
            {!hasWorks && (
              <div className="ml-auto">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
              </div>
            )}
          </motion.button>

          {!hasWorks && (
            <div
              id="shifts-disabled-tooltip"
              role="tooltip"
              className={`absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50 transition-opacity ${showTooltip ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                {t('nav.shiftsDisabledTooltip')}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
              </div>
            </div>
          )}
        </div>

        {/* Statistics + sub-menú expandible */}
        <div>
          <motion.button
            onClick={() => navigateToView('statistics')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
            style={getActiveDesktopStyle('statistics')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BarChart2 size={20} />
            <span>{t('nav.statistics')}</span>
          </motion.button>

          {/* Sub-ítems — aparecen solo cuando Statistics está activo */}
          <AnimatePresence>
            {isStatisticsActive && (
              <motion.div
                key="stats-submenu"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="mt-1 ml-3 pl-3 border-l-2 border-gray-200 dark:border-slate-700 space-y-1">
                  {/* Resúmenes: mismo estilo que sus hermanos (Recibos/Delivery) */}
                  <button
                    onClick={() => navigateToView('statistics/weekly')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-800"
                    style={getSubItemStyle('/statistics')}
                  >
                    <BarChart2 size={15} />
                    <span>{t('statsHub.title')}</span>
                  </button>

                  {/* Subclases: sin icono, con un tab extra para diferenciarse del padre */}
                  <div className="ml-5 space-y-0.5">
                    <button
                      onClick={() => navigateToView('statistics/hours')}
                      className="w-full flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-800"
                      style={getSubItemStyle('/statistics/hours')}
                    >
                      <span>{t('yourHours.title')}</span>
                    </button>

                    <button
                      onClick={() => navigateToView('statistics/weekly')}
                      className="w-full flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-800"
                      style={getSubItemStyle('/statistics/weekly')}
                    >
                      <span>{t('statsHub.weekly')}</span>
                    </button>

                    {/* Mensual: corona pequeña a la derecha (solo free) con hover
                        "Desbloquea Premium"; free navega a gestión de cuenta */}
                    <button
                      onClick={() => navigateToView(isPremium ? 'statistics/monthly' : 'premium')}
                      className="group/crown w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-800"
                      style={getSubItemStyle('/statistics/monthly')}
                    >
                      <span>{t('statsHub.monthly')}</span>
                      {!isPremium && (
                        <span className="relative flex items-center">
                          <Crown size={12} style={{ color: PREMIUM_COLORS.gold }} />
                          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-800 text-white text-xs px-2 py-1 opacity-0 group-hover/crown:opacity-100 transition-opacity pointer-events-none z-50">
                            {t('statsHub.unlockPremium')}
                          </span>
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Recibos y registros: mismo patrón que Resúmenes — parent
                      neutro que abre Documentos, con sus dos subclases */}
                  <button
                    onClick={() => navigateToView('statistics/payslips')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-800"
                    style={{ color: '#6B7280', backgroundColor: 'transparent' }}
                  >
                    <FileText size={15} />
                    <span>{t('payslip.title')}</span>
                  </button>

                  <div className="ml-5 space-y-0.5">
                    <button
                      onClick={() => navigateToView('statistics/payslips')}
                      className="w-full flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-800"
                      style={getSubItemStyle('/statistics/payslips')}
                    >
                      <span>{t('payslipNav.documents')}</span>
                    </button>

                    <button
                      onClick={() => navigateToView('statistics/payslips/calculations')}
                      className="w-full flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-800"
                      style={getSubItemStyle('/statistics/payslips/calculations')}
                    >
                      <span>{t('payslipNav.calculations')}</span>
                    </button>
                  </div>

                  {deliveryEnabled && (
                    <button
                      onClick={() => navigateToView('statistics/delivery')}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-800"
                      style={getSubItemStyle('/statistics/delivery')}
                    >
                      <Bike size={15} />
                      <span>{t('statistics.delivery.tab')}</span>
                    </button>
                  )}

                  {australia88Enabled && (
                    <button
                      onClick={() => navigateToView('statistics/australia88')}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-800"
                      style={getSubItemStyle('/statistics/australia88')}
                    >
                      <Globe size={15} />
                      <span>{t('australia88.visaTitle')}</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
});

NavMainLinks.displayName = 'NavMainLinks';
export default NavMainLinks;
