// src/components/layout/Navigation/NavMainLinks.jsx

import React, { memo } from 'react';
import { Home, Briefcase, Calendar, BarChart2, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

const NavMainLinks = memo(({
  navigateToView,
  currentView,
  hasWorks,
  colors,
  t,
  showTooltip,
  handleShiftsMouseEnter,
  handleShiftsMouseLeave,
  getActiveDesktopStyle,
}) => {
  return (
    <nav className="flex-1 p-4">
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

          {showTooltip && !hasWorks && (
            <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50">
              <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                {t('nav.shiftsDisabledTooltip')}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
              </div>
            </div>
          )}
        </div>

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
      </div>
    </nav>
  );
});

NavMainLinks.displayName = 'NavMainLinks';
export default NavMainLinks;
