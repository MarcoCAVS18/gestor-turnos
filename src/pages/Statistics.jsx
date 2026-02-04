// src/pages/Statistics.jsx

import React, { useMemo } from 'react';
import PageHeader from '../components/layout/PageHeader';
import { Bike, BarChart } from 'lucide-react';
import { useStats } from '../contexts/StatsContext';
import LoadingWrapper from '../components/layout/LoadingWrapper';
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
import UnusedDeliverySection from '../components/stats/UnusedDeliverySection';

const Statistics = () => {
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

  // Check if vehicle/fuel components have actual data
  const hasVehicleData = useMemo(() => {
    if (!deliveryStats?.statsByVehicle) return false;
    const vehicles = Object.values(deliveryStats.statsByVehicle);
    return vehicles.some(v => v.totalExpenses > 0 || v.totalKilometers > 0);
  }, [deliveryStats]);

  const hasFuelData = useMemo(() => {
    return (deliveryStats?.totalExpenses > 0 || deliveryStats?.totalKilometers > 0);
  }, [deliveryStats]);

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
    <LoadingWrapper loading={loading}>
      <div className="px-4 py-6 space-y-6">
        <PageHeader
          title="Statistics"
          subtitle="Analyze your performance and projections"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96">
            <InteractiveCharts currentData={currentData} earningsByWork={currentData.earningsByWork || []} />
          </div>
          <DailyDistribution currentData={currentData} thematicColors={thematicColors} loading={loading} />
        </div>

        {/* --- DELIVERY SECTION --- */}
        {hasDelivery && (
          <>
            <PageHeader
              title="Delivery Statistics"
              subtitle="Analyze your delivery earnings and efficiency"
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

                  {/* Show Vehicle and Fuel if they have data */}
                  {hasVehicleData && (
                    <VehicleEfficiency vehicleStats={deliveryStats.statsByVehicle} />
                  )}
                  {hasFuelData && (
                    <FuelEfficiency deliveryStats={deliveryStats} />
                  )}

                  {/* Collapsible section for unused components */}
                  {(!hasVehicleData || !hasFuelData) && (
                    <UnusedDeliverySection>
                      {!hasVehicleData && (
                        <VehicleEfficiency vehicleStats={deliveryStats.statsByVehicle} />
                      )}
                      {!hasFuelData && (
                        <FuelEfficiency deliveryStats={deliveryStats} />
                      )}
                    </UnusedDeliverySection>
                  )}
                </div>
              </div>

              {/* MOBILE */}
              <div className="block lg:hidden space-y-6">
                <DeliverySummary deliveryStats={deliveryStats} />
                <DeliveryHourlyAnalysis shifts={currentWeekShifts} />
                <PlatformComparison deliveryStats={deliveryStats} />

                {/* Show Vehicle and Fuel if they have data */}
                {hasVehicleData && (
                  <VehicleEfficiency vehicleStats={deliveryStats.statsByVehicle} />
                )}
                {hasFuelData && (
                  <FuelEfficiency deliveryStats={deliveryStats} />
                )}

                {/* Collapsible section for unused components */}
                {(!hasVehicleData || !hasFuelData) && (
                  <UnusedDeliverySection>
                    {!hasVehicleData && (
                      <VehicleEfficiency vehicleStats={deliveryStats.statsByVehicle} />
                    )}
                    {!hasFuelData && (
                      <FuelEfficiency deliveryStats={deliveryStats} />
                    )}
                  </UnusedDeliverySection>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </LoadingWrapper>
  );
};

export default Statistics;