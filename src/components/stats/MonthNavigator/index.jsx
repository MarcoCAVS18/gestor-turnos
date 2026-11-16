// src/components/stats/MonthNavigator/index.jsx
// Navegador de mes para las páginas de Resúmenes (espejo de WeekNavigator).
// No permite navegar a meses futuros (botón derecho deshabilitado en offset 0).

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';

const MonthNavigator = ({ monthOffset = 0, onMonthChange, year, month }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  const changeMonth = typeof onMonthChange === 'function' ? onMonthChange : () => {};

  const getMonthTitle = () => {
    if (monthOffset === 0) return t('monthNavigator.thisMonth');
    if (monthOffset === -1) return t('monthNavigator.lastMonth');
    return t('monthNavigator.monthsAgo', { count: Math.abs(monthOffset) });
  };

  const monthLabel = (() => {
    try {
      return new Date(year, month, 1).toLocaleDateString(
        t('common.locale', 'en-US'),
        { month: 'long', year: 'numeric' }
      );
    } catch (error) {
      return '';
    }
  })();

  const renderNavButton = (direction) => {
    const isNext = direction === 'right';
    const disabled = isNext && monthOffset >= 0;
    return (
      <button
        onClick={() => changeMonth(monthOffset + (isNext ? 1 : -1))}
        disabled={disabled}
        aria-disabled={disabled}
        className={`p-2 rounded-full transition-colors ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        style={{ backgroundColor: colors.transparent10, color: colors.primary }}
      >
        {isNext ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    );
  };

  return (
    <div className="rounded-xl p-4">
      <div className="flex flex-row items-center justify-between">
        {renderNavButton('left')}

        <div className="text-center">
          <h2 className="text-xl font-semibold">{getMonthTitle()}</h2>
          <p className="text-sm text-gray-600 dark:text-slate-400 capitalize">{monthLabel}</p>
        </div>

        {renderNavButton('right')}
      </div>
    </div>
  );
};

export default MonthNavigator;
