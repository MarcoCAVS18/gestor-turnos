// src/components/australia88/Australia88ProgressSummary/index.jsx
// Header summary for the dedicated WHV statistics page: big number for the
// currently active year (Year 1 caps at 88; Year 2 resets to 0 and caps at
// 179 (6 months) — it's a fresh, independent count, not Year 1's total continuing on),
// its progress bar, and a stat row with Year 1 status, this week, and days
// remaining. Self-contained: calls useAustralia88() internally.

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, CalendarDays, Target, CheckCircle2 } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useAustralia88 } from '../../../hooks/useAustralia88';
import Card from '../../ui/Card';
import ProgressBar from '../../ui/ProgressBar';
import Australia88ActivateYear2 from '../Australia88ActivateYear2';
import { YEAR1_TARGET_DAYS, YEAR2_TARGET_DAYS, roundVisaDays } from '../../../services/australia88Service';

const StatBox = ({ icon: Icon, label, value, highlight, colors }) => (
  <div
    className={`rounded-xl p-3 text-center ${highlight ? '' : 'bg-gray-50 dark:bg-gray-800/50'}`}
    style={{ backgroundColor: highlight ? `${colors.primary}15` : undefined }}
  >
    <div className="flex items-center justify-center gap-1 mb-1">
      <Icon size={11} style={{ color: highlight ? colors.primary : undefined }} className={highlight ? '' : 'text-gray-400'} />
      <p
        className="text-[10px] uppercase tracking-wide font-medium"
        style={{ color: highlight ? colors.primary : undefined }}
      >
        {label}
      </p>
    </div>
    <p className="text-lg font-bold" style={{ color: highlight ? colors.primary : undefined }}>
      {value}
    </p>
  </div>
);

const Australia88ProgressSummary = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const {
    totalVisaDays,
    currentWeekVisaDays,
    year1Complete,
    year2Active,
    year2Complete,
    year2Days,
  } = useAustralia88();

  // The year currently being tracked — Year 2 only once explicitly declared.
  // Year 2's goal is 179 (6 months), not 88 (see Australia88DashboardCard header note).
  const activeYear = year2Active ? 2 : 1;
  const activeGoal = year2Active ? YEAR2_TARGET_DAYS : YEAR1_TARGET_DAYS;
  const y1Days = Math.min(totalVisaDays, 88);
  const displayDays = year2Active ? year2Days : y1Days;
  const isCompleteForView = year2Active ? year2Complete : year1Complete;
  const daysRemaining = roundVisaDays(Math.max(0, activeGoal - displayDays));
  const progressPercent = Math.min(100, Math.round((displayDays / activeGoal) * 100));

  return (
    <Card className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
      {/* Big number + progress */}
      <div className="flex flex-col items-center lg:items-start lg:flex-1 text-center lg:text-left gap-3">
        <div className="flex items-center gap-2">
          <Globe size={16} style={{ color: colors.primary }} />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {t('australia88.visaTitle')}
          </span>
        </div>
        <p
          className="text-7xl font-extrabold tabular-nums leading-none"
          style={{ color: colors.primary }}
        >
          {displayDays}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isCompleteForView
            ? t('australia88.yearComplete', { year: activeYear })
            : t('australia88.yearGoal', { year: activeYear, goal: activeGoal })}
        </p>

        {!isCompleteForView && (
          <div className="w-full max-w-xs">
            <ProgressBar value={progressPercent} color={colors.primary} height="8px" />
          </div>
        )}

        {/* Let the user declare Year 2 right here instead of going to Settings */}
        {!year2Active && year1Complete && <Australia88ActivateYear2 />}
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-3 lg:flex-1">
        <StatBox
          icon={year1Complete ? CheckCircle2 : Target}
          label={t('australia88.stats.year1Label')}
          value={`${y1Days}/88`}
          highlight={false}
          colors={colors}
        />
        <StatBox
          icon={CalendarDays}
          label={t('australia88.thisWeek')}
          value={`+${currentWeekVisaDays}`}
          highlight
          colors={colors}
        />
        <StatBox
          icon={Target}
          label={t('australia88.remaining')}
          value={isCompleteForView ? '—' : daysRemaining}
          highlight={false}
          colors={colors}
        />
      </div>
    </Card>
  );
};

export default Australia88ProgressSummary;
