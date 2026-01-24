// src/pages/Statistics.jsx

import React, ***REMOVED*** useMemo ***REMOVED*** from 'react';
import PageHeader from '../components/layout/PageHeader';
import ***REMOVED*** Truck, BarChart ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useStats ***REMOVED*** from '../contexts/StatsContext';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import WeekNavigator from '../components/stats/WeekNavigator';
import StatsProgressBar from '../components/stats/StatsProgressBar';
import WeeklyStatsGrid from '../components/stats/WeeklyStatsGrid';
import WeeklyComparison from '../components/stats/WeeklyComparison';
import DailyDistribution from '../components/stats/DailyDistribution';
import ShiftTypeStats from '../components/stats/ShiftTypeStats';
import InteractiveCharts from '../components/stats/InteractiveCharts';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../hooks/useIsMobile';
import MostProductiveDay from '../components/stats/MostProductiveDay';

// Smoko Cards
import SmokoStatusCard from '../components/stats/SmokoStatusCard';
import SmokoTimeCard from '../components/stats/SmokoTimeCard';

// Delivery Components
import DeliverySummary from '../components/stats/DeliverySummary';
import VehicleEfficiency from '../components/stats/VehicleEfficiency';
import FuelEfficiency from '../components/stats/FuelEfficiency';
import PlatformComparison from '../components/stats/PlatformComparison';
import DeliveryHourlyAnalysis from '../components/stats/DeliveryHourlyAnalysis';

const Statistics = () => ***REMOVED***
  const ***REMOVED***
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
  ***REMOVED*** = useStats();

  const isMobile = useIsMobile();
  const hasDelivery = deliveryEnabled && deliveryStats.shiftsCompleted > 0;

  // Filter actual shifts of the selected week ---
  const currentWeekShifts = useMemo(() => ***REMOVED***
    if (!currentData.weekStart || !currentData.weekEnd || !allShifts) return [];

    // Convert week start and end dates to Date objects
    const start = new Date(currentData.weekStart);
    start.setHours(0, 0, 0, 0);

    const end = new Date(currentData.weekEnd);
    end.setHours(23, 59, 59, 999);

    // Filter shifts that fall in this range
    return allShifts.filter(shift => ***REMOVED***
      const shiftDate = new Date(shift.startDate || shift.date);
      return shiftDate >= start && shiftDate <= end;
    ***REMOVED***);
  ***REMOVED***, [allShifts, currentData.weekStart, currentData.weekEnd]);
  // ------------------------------------------------------------------

  const weekNavigatorComponent = (
    <WeekNavigator
      weekOffset=***REMOVED***weekOffset***REMOVED***
      onWeekChange=***REMOVED***setWeekOffset***REMOVED***
      weekStart=***REMOVED***currentData.weekStart***REMOVED***
      weekEnd=***REMOVED***currentData.weekEnd***REMOVED***
    />
  );

  return (
    <LoadingWrapper loading=***REMOVED***loading***REMOVED***>
      <div className="px-4 py-6 space-y-6">
        <PageHeader
          title="Statistics"
          subtitle="Analyze your performance and projections"
          icon=***REMOVED***BarChart***REMOVED***
          rightContent=***REMOVED***
            !isMobile ? (
              <div className="lg:w-2/5 lg:max-w-md">***REMOVED***weekNavigatorComponent***REMOVED***</div>
            ) : undefined
          ***REMOVED***
        />

        ***REMOVED***isMobile && (
          <div className="lg:hidden -mt-4">
            <WeekNavigator
              weekOffset=***REMOVED***weekOffset***REMOVED***
              onWeekChange=***REMOVED***setWeekOffset***REMOVED***
              weekStart=***REMOVED***currentData.weekStart***REMOVED***
              weekEnd=***REMOVED***currentData.weekEnd***REMOVED***
              variant="transparent"
            />
          </div>
        )***REMOVED***

        ***REMOVED***/* --- MAIN LAYOUT (GENERAL) --- */***REMOVED***
        <div className="space-y-6">

          ***REMOVED***/* DESKTOP: 3 column grid */***REMOVED***
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
            ***REMOVED***/* COLUMN 1 */***REMOVED***
            <div className="lg:col-span-1 flex flex-col gap-6">
              <StatsProgressBar className="flex-grow" currentData=***REMOVED***currentData***REMOVED*** weeklyHoursGoal=***REMOVED***weeklyHoursGoal***REMOVED*** />
              <ShiftTypeStats className="flex-grow" currentData=***REMOVED***currentData***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
            </div>

            ***REMOVED***/* COLUMN 2 */***REMOVED***
            <div className="lg:col-span-1">
              <WeeklyComparison className="h-full" currentData=***REMOVED***currentData***REMOVED*** previousData=***REMOVED***previousData***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** />
            </div>

            ***REMOVED***/* COLUMN 3 */***REMOVED***
            <div className="lg:col-span-1 flex flex-col gap-6">
              <WeeklyStatsGrid className="flex-grow" currentData=***REMOVED***currentData***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
              <MostProductiveDay className="flex-grow" currentData=***REMOVED***currentData***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
              <div className="flex-grow grid grid-cols-2 gap-4">
                <SmokoStatusCard className="h-full" smokoEnabled=***REMOVED***smokoEnabled***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
                <SmokoTimeCard className="h-full" smokoEnabled=***REMOVED***smokoEnabled***REMOVED*** smokoMinutes=***REMOVED***smokoMinutes***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
              </div>
            </div>
          </div>

          ***REMOVED***/* MOBILE */***REMOVED***
          <div className="block lg:hidden space-y-6">
            <StatsProgressBar currentData=***REMOVED***currentData***REMOVED*** weeklyHoursGoal=***REMOVED***weeklyHoursGoal***REMOVED*** />
            <WeeklyStatsGrid currentData=***REMOVED***currentData***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
            <MostProductiveDay currentData=***REMOVED***currentData***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
            <div className="grid grid-cols-2 gap-4">
              <SmokoStatusCard smokoEnabled=***REMOVED***smokoEnabled***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
              <SmokoTimeCard smokoEnabled=***REMOVED***smokoEnabled***REMOVED*** smokoMinutes=***REMOVED***smokoMinutes***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
            </div>
            <WeeklyComparison currentData=***REMOVED***currentData***REMOVED*** previousData=***REMOVED***previousData***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** />
            <ShiftTypeStats currentData=***REMOVED***currentData***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
          </div>
        </div>

        ***REMOVED***/* CHARTS */***REMOVED***
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96">
            <InteractiveCharts currentData=***REMOVED***currentData***REMOVED*** earningsByWork=***REMOVED***currentData.earningsByWork || []***REMOVED*** />
          </div>
          <DailyDistribution currentData=***REMOVED***currentData***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
        </div>

        ***REMOVED***/* --- DELIVERY SECTION --- */***REMOVED***
        ***REMOVED***hasDelivery && (
          <>
            <PageHeader
              title="Delivery Statistics"
              subtitle="Analyze your delivery earnings and efficiency"
              icon=***REMOVED***Truck***REMOVED***
              className="pt-8"
            />

            <div className="space-y-6">
              ***REMOVED***/* DESKTOP */***REMOVED***
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 items-stretch">
                <div className="flex flex-col gap-6 h-full">
                  <div className="flex-none">
                    <DeliverySummary deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                  </div>
                  <div className="flex-grow flex flex-col">
                    ***REMOVED***/* HERE IS THE KEY CHANGE: We pass currentWeekShifts */***REMOVED***
                    <DeliveryHourlyAnalysis
                      shifts=***REMOVED***currentData.shifts || []***REMOVED***
                      className="h-full"
                    />
                  </div>
                  <div className="flex-none">
                    <FuelEfficiency deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                  </div>
                </div>
                <div className="flex flex-col gap-6 h-full">
                  <VehicleEfficiency vehicleStats=***REMOVED***deliveryStats.statsByVehicle***REMOVED*** />
                  <PlatformComparison deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                </div>
              </div>

              ***REMOVED***/* MOBILE */***REMOVED***
              <div className="block lg:hidden space-y-6">
                <DeliverySummary deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                <DeliveryHourlyAnalysis shifts=***REMOVED***currentWeekShifts***REMOVED*** />
                <VehicleEfficiency vehicleStats=***REMOVED***deliveryStats.statsByVehicle***REMOVED*** />
                <PlatformComparison deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                <FuelEfficiency deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
              </div>
            </div>
          </>
        )***REMOVED***
      </div>
    </LoadingWrapper>
  );
***REMOVED***;

export default Statistics;