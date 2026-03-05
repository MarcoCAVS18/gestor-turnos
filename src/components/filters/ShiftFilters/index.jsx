// src/components/filters/ShiftFilters/index.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Briefcase, Truck } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { getAvailableShiftTypes } from '../../../utils/shiftTypesConfig';

const ShiftFilters = ({ onFiltersChange, activeFilters = {} }) => {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const { works, deliveryWork, shiftsByDate, shiftRanges } = useApp();

  // Get translated day labels based on current language
  const getDayLabels = () => {
    if (i18n.language === 'es') {
      return ['L', 'M', 'M', 'J', 'V', 'S', 'D']; // Spanish: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo
    } else if (i18n.language === 'fr') {
      return ['L', 'M', 'M', 'J', 'V', 'S', 'D']; // French: Lundi, Mardi, Mercredi, Jeudi, Vendredi, Samedi, Dimanche
    }
    return ['M', 'T', 'W', 'T', 'F', 'S', 'S']; // English: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
  };

  const DAYS = [
    { id: 1, label: getDayLabels()[0] },
    { id: 2, label: getDayLabels()[1] },
    { id: 3, label: getDayLabels()[2] },
    { id: 4, label: getDayLabels()[3] },
    { id: 5, label: getDayLabels()[4] },
    { id: 6, label: getDayLabels()[5] },
    { id: 0, label: getDayLabels()[6] },
  ];

  const allWorks = [
    ...works.map(t => ({ ...t, type: t.type || 'traditional' })),
    ...deliveryWork.map(t => ({ ...t, type: 'delivery' })),
  ];

  const shiftTypes = getAvailableShiftTypes(shiftsByDate, shiftRanges, { base: colors.primary }, t);

  const hasActiveFilters =
    (activeFilters.work && activeFilters.work !== 'all') ||
    (activeFilters.weekDays?.length > 0) ||
    (activeFilters.shiftType && activeFilters.shiftType !== 'all');

  const handleFilterChange = (type, value) => {
    onFiltersChange({ ...activeFilters, [type]: value });
  };

  const toggleDay = (dayId) => {
    const current = activeFilters.weekDays || [];
    const next = current.includes(dayId)
      ? current.filter(d => d !== dayId)
      : [...current, dayId];
    handleFilterChange('weekDays', next);
  };

  const clearAllFilters = () => {
    onFiltersChange({ work: 'all', weekDays: [], shiftType: 'all' });
  };

  const selectedWork = allWorks.find(w => w.id === activeFilters.work);
  const workActive = activeFilters.work && activeFilters.work !== 'all';

  return (
    <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2">

      {/* ── Work select ── */}
      {allWorks.length > 0 && (
        <>
          <div className="relative flex-shrink-0">
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              {selectedWork?.type === 'delivery'
                ? <Truck size={13} className="text-green-600" />
                : <Briefcase size={13} style={{ color: workActive ? colors.primary : '#9CA3AF' }} />
              }
            </div>
            <select
              value={activeFilters.work || 'all'}
              onChange={(e) => handleFilterChange('work', e.target.value)}
              className="pl-7 pr-6 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 dark:text-gray-200 text-gray-700 appearance-none cursor-pointer focus:outline-none border"
              style={{
                borderColor: workActive ? colors.primary : undefined,
              }}
            >
              <option value="all">{t('shifts.filters.allWorks')}</option>
              {allWorks.map(work => (
                <option key={work.id} value={work.id}>
                  {work.name}{work.type === 'delivery' ? ` (${t('common.delivery')})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-200 dark:bg-slate-700 flex-shrink-0" />
        </>
      )}

      {/* ── Day-of-week circles ── */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {DAYS.map((day, idx) => {
          const isActive = (activeFilters.weekDays || []).includes(day.id);
          return (
            <button
              key={idx}
              onClick={() => toggleDay(day.id)}
              className={`w-7 h-7 rounded-full text-[11px] font-semibold transition-all flex items-center justify-center border ${
                isActive
                  ? 'text-white'
                  : 'text-gray-400 dark:text-gray-500 border-gray-200 dark:border-slate-600'
              }`}
              style={isActive ? {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              } : undefined}
            >
              {day.label}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-gray-200 dark:bg-slate-700 flex-shrink-0" />

      {/* ── Shift type chips ── */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {shiftTypes.map(type => {
          const Icon = type.icon;
          const isSelected = (activeFilters.shiftType || 'all') === type.id;
          return (
            <button
              key={type.id}
              onClick={() => handleFilterChange('shiftType', type.id)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
                isSelected ? '' : 'border-gray-200 dark:border-slate-600 text-gray-400 dark:text-gray-500'
              }`}
              style={isSelected ? {
                backgroundColor: `${type.color}18`,
                borderColor: type.color,
                color: type.color,
              } : undefined}
            >
              <Icon size={11} style={{ color: isSelected ? type.color : undefined }} />
              {type.label}
            </button>
          );
        })}
      </div>

      {/* ── Clear button ── */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
        >
          <X size={12} />
          {t('shifts.filters.clear')}
        </button>
      )}
    </div>
  );
};

export default ShiftFilters;
