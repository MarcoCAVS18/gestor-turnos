// src/components/filters/ShiftFilters/index.jsx

import React, { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeColors } from '../../../hooks/useThemeColors';
import WorkFilter from '../WorkFilter';
import WeekDayFilter from '../WeekDayFilter';
import ShiftTypeFilter from '../ShiftTypeFilter';
import Flex from '../../ui/Flex';

/** Removable chip for active filters */
const ActiveChip = ({ label, onRemove, color }) => (
  <span
    className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border"
    style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}
  >
    {label}
    {onRemove && (
      <button onClick={onRemove} className="hover:opacity-70 transition-opacity">
        <X size={10} />
      </button>
    )}
  </span>
);

/** Filter grid — shared between mobile collapsible and desktop always-visible panels */
const FilterGrid = ({ activeFilters, handleFilterChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 2xl:gap-6">
    {/* Work spans both sm columns so it sits above the other two */}
    <div className="sm:col-span-2 lg:col-span-1">
      <WorkFilter
        value={activeFilters.work || 'all'}
        onChange={(v) => handleFilterChange('work', v)}
      />
    </div>

    <WeekDayFilter
      value={activeFilters.weekDays || []}
      onChange={(v) => handleFilterChange('weekDays', v)}
    />

    <ShiftTypeFilter
      value={activeFilters.shiftType || 'all'}
      onChange={(v) => handleFilterChange('shiftType', v)}
    />
  </div>
);

const ShiftFilters = ({ onFiltersChange, activeFilters = {} }) => {
  const colors = useThemeColors();
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = Object.values(activeFilters).some(filter =>
    Array.isArray(filter) ? filter.length > 0 : filter && filter !== 'all'
  );

  const activeCount = [
    activeFilters.work && activeFilters.work !== 'all' ? 1 : 0,
    activeFilters.weekDays?.length || 0,
    activeFilters.shiftType && activeFilters.shiftType !== 'all' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const handleFilterChange = (type, value) => {
    onFiltersChange({ ...activeFilters, [type]: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({ work: 'all', weekDays: [], shiftType: 'all' });
  };

  const clearFilter = (type) => {
    onFiltersChange({ ...activeFilters, [type]: type === 'weekDays' ? [] : 'all' });
  };

  const panelStyle = {
    backgroundColor: colors.transparent5,
    borderColor: colors.transparent20
  };

  return (
    <div className="mb-6">
      {/* ── Header row: toggle (mobile) + active chips ── */}
      <Flex variant="between" className="gap-3 flex-wrap mb-1">

        {/* Toggle button — hidden on xl+ where panel is always shown */}
        <button
          onClick={() => setShowFilters(v => !v)}
          className={`xl:hidden inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-medium
            ${showFilters
              ? ''
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800'
            }`}
          style={showFilters ? {
            borderColor: colors.primary,
            backgroundColor: colors.transparent10,
            color: colors.primary
          } : {}}
        >
          <SlidersHorizontal size={15} />
          <span>Filters</span>
          {activeCount > 0 && (
            <span
              className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: colors.primary }}
            >
              {activeCount}
            </span>
          )}
        </button>

        {/* Active filter chips — always visible */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            {activeFilters.work && activeFilters.work !== 'all' && (
              <ActiveChip label="Work" color={colors.primary} onRemove={() => clearFilter('work')} />
            )}
            {activeFilters.weekDays?.length > 0 && (
              <ActiveChip
                label={`${activeFilters.weekDays.length} day${activeFilters.weekDays.length > 1 ? 's' : ''}`}
                color={colors.primary}
                onRemove={() => clearFilter('weekDays')}
              />
            )}
            {activeFilters.shiftType && activeFilters.shiftType !== 'all' && (
              <ActiveChip
                label={activeFilters.shiftType}
                color={colors.primary}
                onRemove={() => clearFilter('shiftType')}
              />
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors inline-flex items-center gap-1"
            >
              <X size={11} />
              Clear all
            </button>
          </div>
        )}
      </Flex>

      {/* ── Mobile/tablet: animated collapsible panel ── */}
      <AnimatePresence initial={false}>
        {showFilters && (
          <motion.div
            key="filters-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden xl:hidden"
          >
            <div className="rounded-xl border p-4 mt-3" style={panelStyle}>
              <FilterGrid activeFilters={activeFilters} handleFilterChange={handleFilterChange} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop xl+: always visible ── */}
      <div className="hidden xl:block rounded-xl border p-4 mt-3" style={panelStyle}>
        <FilterGrid activeFilters={activeFilters} handleFilterChange={handleFilterChange} />
      </div>
    </div>
  );
};

export default ShiftFilters;