// src/components/shifts/WeeklyShiftsSection/index.jsx
// Collapsible weekly group for the Shifts page.
// Shows a compact header (week range · shift count · hours) that toggles
// an animated body listing shifts grouped by day.

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import ShiftCard from '../../cards/shift/ShiftCard';
import DeliveryShiftCard from '../../cards/shift/DeliveryShiftCard';
import { createSafeDate } from '../../../utils/time';

const WeeklyShiftsSection = ({
  weekRange,
  shifts,
  totalShifts,
  totalHours,
  isCurrentWeek,
  isFuture,
  isOpen,
  onToggle,
  allJobs,
  onEdit,
  onDelete,
  thematicColors,
}) => {
  const { t, i18n } = useTranslation();
  // Sort dates chronologically (Monday → Sunday) within the week
  const dates = Object.keys(shifts || {}).sort((a, b) =>
    new Date(a) - new Date(b)
  );

  if (!dates.length) return null;

  const accent = thematicColors?.base || '#EC4899';

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-shadow ${
        isOpen
          ? 'shadow-sm border-gray-200 dark:border-slate-700'
          : 'border-gray-100 dark:border-slate-800'
      }`}
    >
      {/* ── Collapsible header ── */}
      <button
        onClick={onToggle}
        className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
          isOpen
            ? 'bg-white dark:bg-slate-800'
            : 'bg-gray-50/60 dark:bg-slate-800/40 hover:bg-gray-50 dark:hover:bg-slate-800/70'
        }`}
        style={isCurrentWeek && isOpen ? { backgroundColor: `${accent}08` } : undefined}
      >
        {/* Chevron — vertically centred with the first line */}
        <ChevronRight
          size={15}
          className="flex-shrink-0 transition-transform duration-200 mt-0.5"
          style={{
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            color: isCurrentWeek ? accent : '#9CA3AF',
          }}
        />

        {/* Two-line content block */}
        <div className="flex-1 min-w-0">
          {/* Line 1: full week range — never truncated */}
          <span
            className={`font-medium text-sm block leading-snug ${
              isCurrentWeek ? '' : 'text-gray-700 dark:text-gray-300'
            }`}
            style={isCurrentWeek ? { color: accent } : undefined}
          >
            {weekRange}
          </span>

          {/* Line 2: badges + stats */}
          <div className="flex items-center gap-1.5 mt-0.5">
            {isCurrentWeek && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: accent }}
              >
                {t('calendar.now')}
              </span>
            )}
            {isFuture && !isCurrentWeek && (
              <span className="text-[10px] font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                {t('calendar.upcoming')}
              </span>
            )}
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {totalShifts} {totalShifts === 1 ? t('common.shift') : t('common.shifts')} · {totalHours.toFixed(1)}h
            </span>
          </div>
        </div>
      </button>

      {/* ── Animated body ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
              {dates.map((date, idx) => {
                const dateObj = createSafeDate(date);
                const locale = i18n.language === 'es' ? 'es-ES' : i18n.language === 'fr' ? 'fr-FR' : 'en-US';
                const dayLabel = dateObj.toLocaleDateString(locale, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'short',
                });
                const dayShifts = shifts[date] || [];

                return (
                  <div key={date}>
                    {/* Day label separator */}
                    <div
                      className={`flex items-center gap-3 px-4 ${idx === 0 ? 'pt-3' : 'pt-4'} pb-2`}
                    >
                      <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {dayLabel}
                      </span>
                      <div className="flex-1 h-px bg-gray-100 dark:bg-slate-700" />
                    </div>

                    {/* Shift cards — single column on mobile, grid on desktop */}
                    <div className="px-4 pb-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                      {dayShifts.map(shift => {
                        const work = allJobs.find(w => w.id === shift.workId);
                        if (shift.type === 'delivery') {
                          return (
                            <DeliveryShiftCard
                              key={shift.id}
                              shift={shift}
                              work={work}
                              onEdit={onEdit}
                              onDelete={onDelete}
                            />
                          );
                        }
                        return (
                          <ShiftCard
                            key={shift.id}
                            shift={shift}
                            work={work}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeeklyShiftsSection;
