// src/pages/Shifts.jsx

import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';
import { useTurnManager } from '../hooks/useTurnManager';
import { useDeleteManager } from '../hooks/useDeleteManager';
import { useShiftFilters } from '../hooks/useFilterTurnos';
import { createSafeDate } from '../utils/time';
import PageHeader from '../components/layout/PageHeader';
import { List, Plus, Search } from 'lucide-react';
import ShiftsEmptyState from '../components/shifts/ShiftsEmptyState';
import ShiftFilters from '../components/filters/ShiftFilters';
import ShiftModal from '../components/modals/shift/ShiftModal';
import DeleteAlert from '../components/alerts/DeleteAlert';
import WeeklyShiftsSection from '../components/shifts/WeeklyShiftsSection';
import { generateShiftDetails } from '../utils/shiftDetailsUtils';
import Flex from '../components/ui/Flex';
import logger from '../utils/logger';

const Shifts = () => {
  const { t } = useTranslation();
  const {
    deleteShift,
    deleteDeliveryShift,
    thematicColors,
    shiftsByDate,
    works,
    deliveryWork
  } = useApp();

  // Hook for filter management
  const {
    filters,
    updateFilters,
    filteredShifts,
    hasActiveFilters
  } = useShiftFilters(shiftsByDate);

  // Specialized hooks for modal management
  const { isModalOpen, selectedShift, openNewModal, openEditModal, closeModal } = useTurnManager();

  // Delete function
  const handleDeleteShift = async (shift) => {
    try {
      if (shift.type === 'delivery') {
        await deleteDeliveryShift(shift.id);
      } else {
        await deleteShift(shift.id);
      }
    } catch (error) {
      logger.error('Error deleting shift:', error);
    }
  };

  const deleteManager = useDeleteManager(handleDeleteShift);

  const shiftsToDisplay = hasActiveFilters ? filteredShifts : shiftsByDate;
  const allJobs = useMemo(() => [...works, ...deliveryWork], [works, deliveryWork]);

  // Get Monday of a given date string.
  // Uses local date parts (not toISOString/UTC) to avoid timezone off-by-one.
  const getMondayOfWeek = (dateStr) => {
    const date = createSafeDate(dateStr);
    const weekDay = date.getDay();
    const daysUntilMonday = weekDay === 0 ? -6 : 1 - weekDay;
    const monday = new Date(date);
    monday.setDate(date.getDate() + daysUntilMonday);
    const y = monday.getFullYear();
    const m = String(monday.getMonth() + 1).padStart(2, '0');
    const d = String(monday.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Today's Monday (week key for the current week).
  // Build date string from local parts to avoid UTC timezone shift.
  const todayMonday = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return getMondayOfWeek(`${y}-${m}-${d}`);
  }, []);

  // Format "Mon 3 Mar – Sun 9 Mar 2026"
  const formatWeekRange = (mondayDate) => {
    const monday = createSafeDate(mondayDate);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const mondayStr = monday.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    const sundayStr = sunday.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    return `${mondayStr} – ${sundayStr}`;
  };

  // Group shifts by week, compute totals
  const shiftsByWeek = useMemo(() => {
    const weeks = {};
    Object.entries(shiftsToDisplay || {}).forEach(([date, shifts]) => {
      const mondayDate = getMondayOfWeek(date);
      if (!weeks[mondayDate]) weeks[mondayDate] = {};
      weeks[mondayDate][date] = shifts;
    });

    return Object.keys(weeks).map(mondayDate => {
      const weekShifts = weeks[mondayDate];
      const allShifts = Object.values(weekShifts).flat();
      const totalHours = allShifts.reduce((sum, s) => {
        if (!s.startTime || !s.endTime) return sum;
        const [sh, sm] = s.startTime.split(':').map(Number);
        const [eh, em] = s.endTime.split(':').map(Number);
        let h = (eh + em / 60) - (sh + sm / 60);
        if (h < 0) h += 24;
        return sum + h;
      }, 0);

      return {
        mondayDate,
        weekRange: formatWeekRange(mondayDate),
        shifts: weekShifts,
        totalShifts: allShifts.length,
        totalHours,
      };
    });
  }, [shiftsToDisplay]);

  // Split into future / current / past
  const { futureWeeks, currentWeekData, pastWeeks } = useMemo(() => ({
    // Closest future week at top → sort ascending and then reverse so closest is last
    // We want: furthest future first, closest future just above current week
    futureWeeks: shiftsByWeek
      .filter(w => w.mondayDate > todayMonday)
      .sort((a, b) => a.mondayDate.localeCompare(b.mondayDate)), // closest last → renders just above current
    currentWeekData: shiftsByWeek.find(w => w.mondayDate === todayMonday),
    pastWeeks: shiftsByWeek
      .filter(w => w.mondayDate < todayMonday)
      .sort((a, b) => b.mondayDate.localeCompare(a.mondayDate)), // most recent first
  }), [shiftsByWeek, todayMonday]);

  // Current week is open by default; others are closed
  const [openWeeks, setOpenWeeks] = useState(() => new Set([todayMonday]));

  const toggleWeek = useCallback((mondayDate) => {
    setOpenWeeks(prev => {
      const next = new Set(prev);
      if (next.has(mondayDate)) next.delete(mondayDate);
      else next.add(mondayDate);
      return next;
    });
  }, []);

  const hasShifts = shiftsByWeek.length > 0;

  // Ordered flat list: future (furthest→closest) → current → past (recent→oldest)
  const orderedWeeks = useMemo(() => [
    ...futureWeeks,
    ...(currentWeekData ? [{ ...currentWeekData, isCurrentWeek: true }] : []),
    ...pastWeeks,
  ], [futureWeeks, currentWeekData, pastWeeks]);

  return (
    <>
      <div className="px-4 py-6 pb-32 space-y-4">
        <PageHeader
          title={t('shifts.title')}
          subtitle={t('shifts.subtitle')}
          icon={List}
          action={{ onClick: openNewModal, icon: Plus, label: t('shifts.addShift') }}
        />

        {/* Filter system */}
        {(Object.keys(shiftsByDate || {}).length > 0) && (
          <ShiftFilters
            onFiltersChange={updateFilters}
            activeFilters={filters}
          />
        )}

        {/* Main content */}
        {!hasShifts && !hasActiveFilters ? (
          <ShiftsEmptyState
            allJobs={allJobs}
            onNewShift={openNewModal}
            thematicColors={thematicColors}
          />
        ) : !hasShifts && hasActiveFilters ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-12 text-center">
            <Flex
              variant="center"
              className="p-4 rounded-full w-20 h-20 mx-auto mb-4"
              style={{ backgroundColor: thematicColors?.transparent10 }}
            >
              <Search size={32} style={{ color: thematicColors?.base }} />
            </Flex>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('shifts.noMatchingFilters')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {t('shifts.noMatchingFiltersDesc')}
            </p>
            <button
              onClick={() => updateFilters({ work: 'all', weekDays: [], shiftType: 'all' })}
              className="text-white px-6 py-3 rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: thematicColors?.base }}
            >
              {t('shifts.clearFilters')}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Future weeks label */}
            {futureWeeks.length > 0 && (
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1 pt-1">
                {t('shifts.upcoming')}
              </p>
            )}

            {orderedWeeks.map((week) => (
              <WeeklyShiftsSection
                key={week.mondayDate}
                weekRange={week.weekRange}
                shifts={week.shifts}
                totalShifts={week.totalShifts}
                totalHours={week.totalHours}
                isCurrentWeek={!!week.isCurrentWeek}
                isFuture={week.mondayDate > todayMonday}
                isOpen={openWeeks.has(week.mondayDate)}
                onToggle={() => toggleWeek(week.mondayDate)}
                allJobs={allJobs}
                onEditShift={openEditModal}
                onDeleteShift={(shift) => deleteManager.startDeletion(shift)}
                thematicColors={thematicColors}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ShiftModal
        isOpen={isModalOpen}
        onClose={closeModal}
        shift={selectedShift}
      />

      <DeleteAlert
        visible={deleteManager.showDeleteModal}
        onCancel={() => deleteManager.cancelDeletion()}
        onConfirm={() => deleteManager.confirmDeletion()}
        deleting={deleteManager.deleting}
        type="shift"
        details={generateShiftDetails(deleteManager.itemToDelete, allJobs)}
      />
    </>
  );
};

export default Shifts;
