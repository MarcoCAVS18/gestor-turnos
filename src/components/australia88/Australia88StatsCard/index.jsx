// src/components/australia88/Australia88StatsCard/index.jsx
//
// Full-detail Working Holiday Visa tracker for the Statistics page.
// More complete than Australia88DashboardCard which lives on the Dashboard.
//
// Rendered by MostProductiveDay (thin orchestrator) when:
//   isAustraliaMode === true  AND  hasEligibleWorks === true
//
// Design: "Visa Ledger" — compact 3-stat row + per-week breakdown table (last 3 weeks).
// No progress bar (Dashboard card already shows one).
// Each week row shows colored dots: 1 filled dot = 1 visa day earned (max 7/week).
//
// Self-contained: calls useAustralia88() internally — no prop drilling needed.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { Globe, CalendarDays, Target, CheckCircle2 } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useAustralia88 } from '../../../hooks/useAustralia88';
import Badge from '../../ui/Badge';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

// ── Constants ────────────────────────────────────────────────────────────────

const MAX_VISA_DAYS_PER_WEEK = 7;
const WEEKS_TO_SHOW = 3; // How many recent weeks to list in the ledger

// ── Sub-components ───────────────────────────────────────────────────────────

/**
 * Renders up to 7 small dots representing visa days in one week.
 * Filled dots (colored) = earned. Empty dots (gray) = not earned.
 */
const VisaDots = ({ days, color }) => (
  <div className="flex items-center gap-[3px]">
    {Array.from({ length: MAX_VISA_DAYS_PER_WEEK }).map((_, i) =>
      i < days ? (
        <div
          key={i}
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
      ) : (
        <div
          key={i}
          className="w-2 h-2 rounded-full flex-shrink-0 bg-gray-200 dark:bg-gray-700"
        />
      )
    )}
  </div>
);

/**
 * Formats the week date range compactly.
 * Same month: "Nov 4–10". Different months: "Oct 28 – Nov 3".
 */
const formatWeekShort = (weekStart, weekEnd) => {
  const startMonth = weekStart.toLocaleDateString('en-AU', { month: 'short' });
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();

  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `${startMonth} ${startDay}–${endDay}`;
  }

  const endMonth = weekEnd.toLocaleDateString('en-AU', { month: 'short' });
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
};

/**
 * One stat box in the 3-stat row.
 * Shows a labeled number with an optional unit suffix.
 */
const StatBox = ({ icon: Icon, label, value, suffix, color, highlight }) => (
  <div
    className={`rounded-xl p-3 ${highlight ? '' : 'bg-gray-50 dark:bg-gray-800/50'}`}
    style={highlight ? { backgroundColor: `${color}15` } : {}}
  >
    <Flex variant="center" className="gap-1 mb-1">
      <Icon size={11} style={{ color: highlight ? color : undefined }} className={!highlight ? 'text-gray-400' : ''} />
      <p
        className={`text-[10px] uppercase tracking-wide font-medium ${!highlight ? 'text-gray-500 dark:text-gray-400' : ''}`}
        style={highlight ? { color } : {}}
      >
        {label}
      </p>
    </Flex>
    <p
      className={`text-xl font-extrabold tabular-nums leading-none ${!highlight ? 'text-gray-700 dark:text-gray-200' : ''}`}
      style={highlight ? { color } : {}}
    >
      {value}
      {suffix && (
        <span className={`text-xs font-normal ml-0.5 ${!highlight ? 'text-gray-500' : ''}`}>
          {suffix}
        </span>
      )}
    </p>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

const Australia88StatsCard = ({ className = '' }) => {
  const colors = useThemeColors();
  const {
    totalVisaDays,
    currentWeekVisaDays,
    weeklyBreakdown,
    year1Complete,
    year2Active,
    year2Complete,
    year2Days,
  } = useAustralia88();

  // Local toggle: only shown when user has Year 2 data
  const [viewYear, setViewYear] = useState(year2Active ? 2 : 1);
  React.useEffect(() => { setViewYear(year2Active ? 2 : 1); }, [year2Active]);

  const showYearToggle = year2Active;
  const y1Days = Math.min(totalVisaDays, 88);
  const displayDays    = viewYear === 2 ? year2Days : y1Days;
  const daysRemaining  = 88 - displayDays;
  const isComplete     = viewYear === 2 ? year2Complete : year1Complete;

  // Most recent weeks at the top of the ledger
  const recentWeeks = [...weeklyBreakdown]
    .sort((a, b) => b.weekStart - a.weekStart)
    .slice(0, WEEKS_TO_SHOW);

  return (
    <Card className={`flex flex-col ${className}`}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Flex variant="between" className="mb-4 flex-nowrap gap-2">
        <h3 className="text-base font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100 truncate">
          <Globe size={18} className="flex-shrink-0" style={{ color: colors.primary }} />
          <span className="truncate">Working Holiday Visa</span>
        </h3>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Year toggle — only shown when user has Year 2 data */}
          {showYearToggle && (
            <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: colors.border }}>
              {[1, 2].map(y => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setViewYear(y)}
                  className="px-2 py-0.5 text-[10px] font-semibold transition-colors"
                  style={viewYear === y
                    ? { backgroundColor: colors.primary, color: '#fff' }
                    : { backgroundColor: 'transparent', color: colors.textSecondary }
                  }
                >
                  Year {y}
                </button>
              ))}
            </div>
          )}

          {/* Milestone badge */}
          <Badge
            variant="theme"
            size="xs"
            rounded
            className="whitespace-nowrap"
            style={{
              color: colors.primary,
              backgroundColor: isComplete ? colors.transparent20 : colors.transparent10,
            }}
          >
            {isComplete
              ? `✓ Year ${viewYear} done`
              : `Year ${viewYear} · Goal 88d`}
          </Badge>
        </div>
      </Flex>

      {/* ── Compact 3-stat row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <StatBox
          icon={CalendarDays}
          label={year2Active ? 'Year 2' : 'Total'}
          value={displayDays}
          suffix="d"
          color={colors.primary}
          highlight
        />

        <StatBox
          icon={CalendarDays}
          label="This week"
          value={`+${currentWeekVisaDays}`}
          suffix="d"
          color={colors.primary}
          highlight={false}
        />

        <StatBox
          icon={isComplete ? CheckCircle2 : Target}
          label={isComplete ? 'Done' : 'Left'}
          value={isComplete ? '✓' : daysRemaining}
          suffix={isComplete ? '' : 'd'}
          color={colors.primary}
          highlight={isComplete}
        />
      </div>

      {/* ── Week ledger ────────────────────────────────────────────────────── */}
      {recentWeeks.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-800 pt-3">

          {/* Ledger header */}
          <Flex variant="between" className="mb-2 px-1">
            <span className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500 font-medium">
              Recent weeks
            </span>
            <span className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500 font-medium">
              Hours · Days
            </span>
          </Flex>

          {/* One row per week */}
          <div className="space-y-1.5">
            {recentWeeks.map(week => (
              <div
                key={week.weekKey}
                className="flex items-center gap-2 px-1 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
              >
                {/* Week date range */}
                <span className="text-xs text-gray-500 dark:text-gray-400 w-24 flex-shrink-0 tabular-nums">
                  {formatWeekShort(week.weekStart, week.weekEnd)}
                </span>

                {/* Hours worked */}
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300 w-12 flex-shrink-0 tabular-nums">
                  {week.hours.toFixed(1)}h
                </span>

                {/* Dot grid — the visual centerpiece of the ledger */}
                <VisaDots days={week.visaDays} color={colors.primary} />

                {/* Day count number */}
                <span
                  className="text-xs font-bold ml-auto flex-shrink-0 tabular-nums"
                  style={{ color: week.visaDays > 0 ? colors.primary : colors.textSecondary }}
                >
                  {week.visaDays}d
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </Card>
  );
};

export default Australia88StatsCard;
