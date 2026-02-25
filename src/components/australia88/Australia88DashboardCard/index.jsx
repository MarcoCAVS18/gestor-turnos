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
// This component is intentionally minimal (Dashboard surface).
// The full weekly breakdown lives in Australia88StatsCard (Statistics page).
//
// Props: all come from useAustralia88() — keep this component pure/dumb.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ChevronRight, CalendarDays, Target, CheckCircle2 } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useIsMobile } from '../../../hooks/useIsMobile';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';
import ProgressBar from '../../ui/ProgressBar';

const Australia88DashboardCard = ({
  totalVisaDays,
  currentWeekVisaDays,
  milestone,
  progressPercent,
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const colors = useThemeColors();

  const milestoneTarget = milestone === 'complete' ? 176 : milestone;
  const daysRemaining = milestone === 'complete' ? 0 : milestoneTarget - totalVisaDays;
  const isComplete = milestone === 'complete';

  return (
    <Card className="flex flex-col h-full overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Flex variant="between" className="mb-3 flex-nowrap gap-2">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100 truncate">
          <Globe size={16} className="flex-shrink-0" style={{ color: colors.primary }} />
          <span className="truncate">Working Holiday Visa</span>
        </h3>

        <Button
          onClick={() => navigate('/statistics')}
          size="sm"
          variant="ghost"
          animatedChevron
          collapsed={isMobile}
          className="flex-shrink-0 whitespace-nowrap text-gray-400 hover:text-gray-600"
          themeColor={colors.primary}
          icon={ChevronRight}
          iconPosition="right"
        >
          Details
        </Button>
      </Flex>

      {/* ── Body: split on desktop, stacked on mobile ──────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5 flex-grow min-h-0">

        {/* Left / Top — accumulated days + progress bar */}
        <div className="sm:flex-1 text-center mb-3 sm:mb-0">
          <p
            className="text-4xl font-extrabold tabular-nums leading-none"
            style={{ color: colors.primary }}
          >
            {totalVisaDays}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isComplete ? 'Both extensions complete!' : `days · goal ${milestoneTarget}`}
          </p>

          <div className="mt-3">
            <ProgressBar value={progressPercent} color={colors.primary} height="6px" />
            <Flex variant="between" className="mt-1">
              <span className="text-[10px] text-gray-400">0</span>
              <span className="text-[10px] text-gray-400">{milestoneTarget}</span>
            </Flex>
          </div>
        </div>

        {/* Divider — only on desktop */}
        <div className="hidden sm:block w-px self-stretch bg-gray-100 dark:bg-gray-700" />

        {/* Right / Bottom — stats */}
        <div className="grid grid-cols-2 gap-2 sm:flex-1">

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
                This week
              </p>
            </div>
            <p className="text-base font-bold" style={{ color: colors.primary }}>
              +{currentWeekVisaDays}
              <span className="text-xs font-normal ml-0.5">d</span>
            </p>
          </div>

          {/* Remaining / complete */}
          <div
            className={`rounded-lg p-2 text-center ${
              isComplete ? '' : 'bg-gray-50 dark:bg-gray-800/50'
            }`}
            style={isComplete ? { backgroundColor: `${colors.primary}15` } : {}}
          >
            {isComplete ? (
              <>
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <CheckCircle2 size={10} style={{ color: colors.primary }} />
                  <p
                    className="text-[10px] uppercase tracking-wide font-medium"
                    style={{ color: colors.primary }}
                  >
                    Complete
                  </p>
                </div>
                <CheckCircle2
                  size={18}
                  className="mx-auto mt-0.5"
                  style={{ color: colors.primary }}
                />
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Target size={10} className="text-gray-500" />
                  <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">
                    Remaining
                  </p>
                </div>
                <p className="text-base font-bold text-gray-700 dark:text-gray-200">
                  {daysRemaining}
                  <span className="text-xs font-normal ml-0.5">d</span>
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
