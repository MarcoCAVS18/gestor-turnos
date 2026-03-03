// src/pages/Statistics.jsx

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/layout/PageHeader';
import { Bike, BarChart } from 'lucide-react';
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

// Delivery Components
import DeliverySummary from '../components/stats/DeliverySummary';
import VehicleEfficiency from '../components/stats/VehicleEfficiency';
import FuelEfficiency from '../components/stats/FuelEfficiency';
import PlatformComparison from '../components/stats/PlatformComparison';
import DeliveryHourlyAnalysis from '../components/stats/DeliveryHourlyAnalysis';

const Statistics = () => {
  const { t } = useTranslation();
  const {
    loading,
    currentData,
    previousData,
    weekOffset,
    setWeekOffset,
    deliveryEnabled,
    deliveryStats,
    weeklyHoursGoal,
    thematicColors,
    smokoEnabled,
    smokoMinutes,
    allShifts,
  } = useStats();

  const isMobile = useIsMobile();
  const hasDelivery = deliveryEnabled && deliveryStats.shiftsCompleted > 0;

  // All delivery shifts (for FuelEfficiency scatter chart)
  const allDeliveryShifts = useMemo(() => {
    return (allShifts || []).filter(s => s.type === 'delivery');
  }, [allShifts]);

  // Filter actual shifts of the selected week ---
  const currentWeekShifts = useMemo(() => {
    if (!currentData.weekStart || !currentData.weekEnd || !allShifts) return [];

    // Convert week start and end dates to Date objects
    const start = new Date(currentData.weekStart);
    start.setHours(0, 0, 0, 0);

    const end = new Date(currentData.weekEnd);
    end.setHours(23, 59, 59, 999);

    // Filter shifts that fall in this range
    return allShifts.filter(shift => {
      const shiftDate = new Date(shift.startDate || shift.date);
      return shiftDate >= start && shiftDate <= end;
    });
  }, [allShifts, currentData.weekStart, currentData.weekEnd]);
  // ------------------------------------------------------------------

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
      <div className="px-4 py-6 space-y-6">
        <PageHeader
          title={t('statistics.title')}
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

        {/* --- DELIVERY SECTION --- */}
        {hasDelivery && (
          <>
            <PageHeader
              title={t('statistics.deliveryTitle')}
              subtitle={t('statistics.deliverySubtitle')}
              icon={Bike}
              className="pt-8"
            />

            <div className="space-y-6">
              {/* DESKTOP */}
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 items-stretch">
                <div className="flex flex-col gap-6 h-full">
                  <div className="flex-none">
                    <DeliverySummary deliveryStats={deliveryStats} />
                  </div>
                  <div className="flex-grow flex flex-col">
                    <DeliveryHourlyAnalysis
                      shifts={currentData.shifts || []}
                      className="h-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-6 h-full">
                  <PlatformComparison deliveryStats={deliveryStats} />
                  <VehicleEfficiency vehicleStats={deliveryStats.statsByVehicle} />
                  <div className="flex-grow flex flex-col">
                    <FuelEfficiency deliveryStats={deliveryStats} shifts={allDeliveryShifts} className="h-full" />
                  </div>
                </div>
              </div>

              {/* MOBILE */}
              <div className="block lg:hidden space-y-6">
                <DeliverySummary deliveryStats={deliveryStats} />
                <DeliveryHourlyAnalysis shifts={currentWeekShifts} />
                <PlatformComparison deliveryStats={deliveryStats} />
                <VehicleEfficiency vehicleStats={deliveryStats.statsByVehicle} />
                <FuelEfficiency deliveryStats={deliveryStats} shifts={allDeliveryShifts} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Statistics;