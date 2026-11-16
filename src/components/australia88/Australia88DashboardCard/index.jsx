// src/components/australia88/Australia88DashboardCard/index.jsx
//
// Compact Working Holiday Visa 88-day tracker for the Dashboard page.
//
// Rendered by FavoriteWorksCard when:
//   holidayCountry === 'AU'  AND  at least one work has australia88Eligible === true
//
// Layout:
//   Mobile  → stacked: day count → progress bar → stats row
//   Desktop → split:   left = day count + progress bar | right = stats
//
// WHV logic: Year 1 view shows the running total capped at 88 (0–88) — extra
// days beyond 88 stay shown as Year 1, they don't auto-promote to Year 2.
// Year 2 only appears once the user declares it in Settings (after their
// Year 2 visa is approved); its counter resets to 0 and counts up to 179 (6 months)
// (the Year 3 extension needs ~6 months of fresh work during Year 2 — see
// the app's second/third-year application guide blog post).
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Globe, ChevronRight, CalendarDays, Target, CheckCircle2 } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useAustralia88 } from '../../../hooks/useAustralia88';
import { checkVisaMilestone } from '../../../services/native/nativeNotifications';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';
import ProgressBar from '../../ui/ProgressBar';
import Australia88ActivateYear2 from '../Australia88ActivateYear2';
import { YEAR1_TARGET_DAYS, YEAR2_TARGET_DAYS } from '../../../services/australia88Service';

const Australia88DashboardCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const colors = useThemeColors();
  const {
    totalVisaDays,
    currentWeekVisaDays,
    year1Complete,
    year2Active,
    year2Complete,
    year2Days,
  } = useAustralia88();

  // Local toggle: only relevant when year2Active (user has earned beyond 88 days)
  const [viewYear, setViewYear] = useState(year2Active ? 2 : 1);

  // Sync viewYear when year2Active changes (e.g. first time user hits 88 days)
  React.useEffect(() => {
    setViewYear(year2Active ? 2 : 1);
  }, [year2Active]);

  // Fire a one-time milestone notification when crossing 70/80/85 of the
  // active year's goal (88 for Year 1, 179 for Year 2). Native-only; no-op
  // on web. This card only renders for AU users. Before Year 2 is declared,
  // extra days beyond 88 don't trigger a phantom Year 2 alert.
  React.useEffect(() => {
    if (year2Active) {
      if (year2Days < YEAR2_TARGET_DAYS) checkVisaMilestone(year2Days, YEAR2_TARGET_DAYS);
    } else if (totalVisaDays < 88) {
      checkVisaMilestone(totalVisaDays, 88);
    }
  }, [totalVisaDays, year2Active, year2Days]);

  const showYearToggle = year2Active;

  // Derived display values based on which year is being viewed
  const y1Days = Math.min(totalVisaDays, 88);
  const displayDays = viewYear === 2 ? year2Days : y1Days;
  const yearGoal = viewYear === 2 ? YEAR2_TARGET_DAYS : YEAR1_TARGET_DAYS; // Year 2's goal is 6 months, not 88; see header note
  const daysRemaining = yearGoal - displayDays;
  const progressPercent = Math.min(100, Math.round((displayDays / yearGoal) * 100));
  const isCompleteForView = viewYear === 2 ? year2Complete : year1Complete;

  // Sub-label beneath the big number
  const goalLabel = isCompleteForView
    ? t('australia88.yearComplete', { year: viewYear })
    : t('australia88.yearGoal', { year: viewYear, goal: yearGoal });

  // Show progress bar while the viewed year is still in progress
  const showProgressBar = !isCompleteForView;

  const isComplete = year2Complete;

  // Year 1 is done and Year 2 hasn't been declared yet — offer the switch
  // right in the "Complete" stat box instead of its checkmark icon.
  const canActivateYear2 = viewYear === 1 && year1Complete && !year2Active;

  return (
    <Card className="flex flex-col overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Flex variant="between" className="mb-3 flex-nowrap gap-2">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100 truncate">
          <Globe size={16} className="flex-shrink-0" style={{ color: colors.primary }} />
          <span className="truncate">{isMobile ? t('australia88.visaTitleShort') : t('australia88.visaTitle')}</span>
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
                  Y{y}
                </button>
              ))}
            </div>
          )}

          <Button
            onClick={() => navigate('/statistics/australia88')}
            size="sm"
            variant="ghost"
            animatedChevron
            collapsed={isMobile}
            className="whitespace-nowrap text-gray-400 hover:text-gray-600"
            themeColor={colors.primary}
            icon={ChevronRight}
            iconPosition="right"
          >
            {t('australia88.details')}
          </Button>
        </div>
      </Flex>

      {/* ── Body: split on desktop, stacked on mobile ──────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5">

        {/* Left / Top — accumulated days + progress bar */}
        <div className="sm:flex-1 text-center mb-4 sm:mb-0">
          <p
            className="text-6xl sm:text-7xl font-extrabold tabular-nums leading-none"
            style={{ color: colors.primary }}
          >
            {displayDays}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {goalLabel}
          </p>

          {showProgressBar && (
            <div className="mt-3">
              <ProgressBar value={progressPercent} color={colors.primary} height="6px" />
            </div>
          )}
        </div>

        {/* Divider — only on desktop */}
        <div className="hidden sm:block w-px self-stretch bg-gray-100 dark:bg-gray-700" />

        {/* Right / Bottom — stats stacked one below the other */}
        <div className="flex flex-col gap-2 sm:flex-1">

          {/* This week */}
          <div
            className="rounded-lg p-2 text-center"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <CalendarDays size={10} style={{ color: colors.primary }} />
              <p
                className="text-[10px] uppercase tracking-wide font-medium"
                style={{ color: colors.primary }}
              >
                {t('australia88.thisWeek')}
              </p>
            </div>
            <p className="text-base font-bold" style={{ color: colors.primary }}>
              +{currentWeekVisaDays}
              <span className="text-xs font-normal ml-0.5">{t('australia88.daysUnit')}</span>
            </p>
          </div>

          {/* Remaining / complete */}
          <div
            className={`rounded-lg p-2 text-center ${
              isComplete ? '' : 'bg-gray-50 dark:bg-gray-800/50'
            }`}
            style={isComplete ? { backgroundColor: `${colors.primary}15` } : {}}
          >
            {isCompleteForView ? (
              <>
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <CheckCircle2 size={10} style={{ color: colors.primary }} />
                  <p
                    className="text-[10px] uppercase tracking-wide font-medium"
                    style={{ color: colors.primary }}
                  >
                    {t('australia88.complete')}
                  </p>
                </div>
                {canActivateYear2 ? (
                  <Australia88ActivateYear2 className="mt-0.5" />
                ) : (
                  <CheckCircle2
                    size={18}
                    className="mx-auto mt-0.5"
                    style={{ color: colors.primary }}
                  />
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Target size={10} className="text-gray-500" />
                  <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">
                    {t('australia88.remaining')}
                  </p>
                </div>
                <p className="text-base font-bold text-gray-700 dark:text-gray-200">
                  {daysRemaining}
                  <span className="text-xs font-normal ml-0.5">{t('australia88.daysUnit')}</span>
                </p>
              </>
            )}
          </div>

        </div>
      </div>

    </Card>
  );
};

export default Australia88DashboardCard;
