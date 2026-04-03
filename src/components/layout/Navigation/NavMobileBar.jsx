// src/components/layout/Navigation/NavMobileBar.jsx

import React, { memo } from 'react';
import { Home, Briefcase, Calendar, BarChart2, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

const NavMobileBar = memo(({ navigateToView, currentView, colors, t, calendarButtonStyle, getActiveTextStyle }) => {
  return (
    <nav
      className="navbar-container fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 px-4 pt-3 md:hidden"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        <button
          onClick={() => navigateToView('dashboard')}
          className="flex flex-col items-center justify-center transition-colors duration-200"
          style={getActiveTextStyle('dashboard')}
        >
          <Home size={20} />
          <span className="text-xs mt-1">{t('nav.home')}</span>
        </button>

        <button
          onClick={() => navigateToView('works')}
          className="flex flex-col items-center justify-center transition-colors duration-200"
          style={getActiveTextStyle('works')}
        >
          <Briefcase size={20} />
          <span className="text-xs mt-1">{t('nav.works')}</span>
        </button>

        <div className="flex justify-center items-start -mt-6">
          <motion.button
            onClick={() => navigateToView('calendar')}
            className="text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 transition-all duration-200"
            style={calendarButtonStyle}
            whileTap={{ scale: 0.95 }}
            whileHover={{
              scale: 1.05,
              boxShadow: `0 8px 25px ${colors.transparent50}`
            }}
          >
            <CalendarDays size={28} />
          </motion.button>
        </div>

        <button
          onClick={() => navigateToView('shifts')}
          className="flex flex-col items-center justify-center transition-colors duration-200"
          style={getActiveTextStyle('shifts')}
        >
          <Calendar size={20} />
          <span className="text-xs mt-1">{t('nav.shifts')}</span>
        </button>

        <button
          onClick={() => navigateToView('statistics')}
          className="flex flex-col items-center justify-center transition-colors duration-200"
          style={getActiveTextStyle('statistics')}
        >
          <BarChart2 size={20} />
          <span className="text-xs mt-1">{t('nav.statistics')}</span>
        </button>
      </div>
    </nav>
  );
});

NavMobileBar.displayName = 'NavMobileBar';
export default NavMobileBar;
