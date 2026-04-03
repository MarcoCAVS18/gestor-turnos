// src/components/layout/Navigation/NavQuickActions.jsx

import React, { memo } from 'react';
import { Briefcase, PlusCircle } from 'lucide-react';

const NavQuickActions = memo(({ openNewShiftModal, openNewWorkModal, hasWorks, colors, t }) => {
  if (!openNewShiftModal && !openNewWorkModal) return null;

  return (
    <div className="p-4 border-b border-gray-100 dark:border-slate-800">
      <div className="space-y-2">
        {openNewShiftModal && hasWorks && (
          <button
            onClick={openNewShiftModal}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-lg transform hover:scale-105 btn-primary text-white"
            style={{ backgroundColor: colors.primary }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = colors.primaryDark; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = colors.primary; }}
          >
            <PlusCircle size={20} />
            <span>{t('nav.newShift')}</span>
          </button>
        )}
        {openNewWorkModal && (
          <button
            onClick={openNewWorkModal}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md bg-white dark:bg-slate-800"
            style={{
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: colors.primary,
              color: colors.primary
            }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = colors.transparent10; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = ''; }}
          >
            <Briefcase size={20} />
            <span>{t('nav.newWork')}</span>
          </button>
        )}
      </div>
    </div>
  );
});

NavQuickActions.displayName = 'NavQuickActions';
export default NavQuickActions;
