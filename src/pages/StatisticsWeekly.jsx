// src/pages/StatisticsWeekly.jsx
// Resumen semanal — contenido idéntico al viejo /statistics, mudado aquí
// cuando /statistics pasó a ser el hub Resúmenes (STATS_EXPANSION_ROADMAP).

import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/layout/PageHeader';
import { BarChart } from 'lucide-react';
import { useStats } from '../contexts/StatsContext';
import WeekNavigator from '../components/stats/WeekNavigator';
import StatsProgressBar from '../components/stats/StatsProgressBar';
import WeeklyStatsGrid from '../components/stats/WeeklyStatsGrid';
import WeeklyComparison from '../components/stats/WeeklyComparison';
import DailyDistribution from '../components/stats/DailyDistribution';
import ShiftTypeStats from '../components/stats/ShiftTypeStats';
import InteractiveCharts from '../components/stats/InteractiveCharts';
import { useIsMobile } from '../hooks/useIsMobile';
import MostProductiveDay from '../components/stats/MostProductiveDay';

// Break Card
import SmokoStatusCard from '../components/stats/SmokoStatusCard';


const StatisticsWeekly = () => {
  const { t } = useTranslation();
  const {
    loading,
    currentData,
    previousData,
    weekOffset,
    setWeekOffset,
    weeklyHoursGoal,
    thematicColors,
    smokoEnabled,
    smokoMinutes,
  } = useStats();

  const isMobile = useIsMobile();

  const weekNavigatorComponent = (
    <WeekNavigator
      weekOffset={weekOffset}
      onWeekChange={setWeekOffset}
      weekStart={currentData.weekStart}
      weekEnd={currentData.weekEnd}
    />
  );

  return (
    <>
      <Helmet>
        <title>{`${t('statsHub.weekly')} - Orary`}</title>
        <meta name="description" content="Analyze your income trends, hours worked, and earnings breakdowns with detailed charts and reports." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="px-4 py-6 space-y-6">
        <PageHeader
          title={t('statsHub.weekly')}
          subtitle={t('statistics.subtitle')}
          icon={BarChart}
          rightContent={
            !isMobile ? (
              <div className="lg:w-2/5 lg:max-w-md">{weekNavigatorComponent}</div>
            ) : undefined
          }
        />

        {isMobile && (
          <div className="lg:hidden -mt-4">
            <WeekNavigator
              weekOffset={weekOffset}
              onWeekChange={setWeekOffset}
              weekStart={currentData.weekStart}
              weekEnd={currentData.weekEnd}
              variant="transparent"
            />
          </div>
        )}

        {/* --- MAIN LAYOUT (GENERAL) --- */}
        <div className="space-y-6">

          {/* DESKTOP: 3 column grid (2/3 + 1/3) */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 lg:items-stretch">
            {/* LEFT SECTION (2/3): Weekly Comparison + Shift Types side by side, Weekly Progress below */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-6 flex-1">
                <WeeklyComparison currentData={currentData} previousData={previousData} thematicColors={thematicColors} className="h-full" />
                <ShiftTypeStats currentData={currentData} loading={loading} className="h-full" />
              </div>
              <StatsProgressBar currentData={currentData} weeklyHoursGoal={weeklyHoursGoal} />
            </div>

            {/* RIGHT SECTION (1/3): Stats Grid, Most Productive Day, Break Cards */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <WeeklyStatsGrid currentData={currentData} thematicColors={thematicColors} loading={loading} className="flex-1" />
              <MostProductiveDay currentData={currentData} thematicColors={thematicColors} loading={loading} />
              <SmokoStatusCard
                smokoEnabled={smokoEnabled}
                thematicColors={thematicColors}
                loading={loading}
                shiftsWithBreak={currentData?.shifts?.filter(s => s.hadBreak || s.smoko)?.length || 0}
                smokoMinutes={smokoMinutes}
              />
            </div>
          </div>

          {/* MOBILE */}
          <div className="block lg:hidden space-y-6">
            <StatsProgressBar currentData={currentData} weeklyHoursGoal={weeklyHoursGoal} />
            <WeeklyStatsGrid currentData={currentData} thematicColors={thematicColors} loading={loading} />
            <MostProductiveDay currentData={currentData} thematicColors={thematicColors} loading={loading} />
            <SmokoStatusCard
              smokoEnabled={smokoEnabled}
              thematicColors={thematicColors}
              loading={loading}
              shiftsWithBreak={currentData?.shifts?.filter(s => s.hadBreak || s.smoko)?.length || 0}
              smokoMinutes={smokoMinutes}
            />
            <WeeklyComparison currentData={currentData} previousData={previousData} thematicColors={thematicColors} />
            <ShiftTypeStats currentData={currentData} loading={loading} />
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">
          <div className="min-h-[24rem]">
            <InteractiveCharts />
          </div>
          <DailyDistribution currentData={currentData} thematicColors={thematicColors} loading={loading} />
        </div>

      </div>
    </>
  );
};

export default StatisticsWeekly;