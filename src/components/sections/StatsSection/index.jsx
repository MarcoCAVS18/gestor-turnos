// src/components/sections/StatsSection/index.jsx

import React from 'react';
import WeekNavigator from '../../stats/WeekNavigator';
import StatsProgressBar from '../../stats/StatsProgressBar';
import WeeklyStatsGrid from '../../stats/WeeklyStatsGrid';
import WorkDistributionChart from '../../stats/WorkDistributionChart';
import DailyBreakdownCard from '../../stats/DailyBreakdownCard';

const StatsSection = ({ weekStatsData = {}, works = [] }) => {
  const {
    currentWeek = 0,
    weeklyHours = 0,
    totalEarnings = 0,
    workDistribution = [],
    shiftsPerDay = {},
    averageHoursPerDay = 0,
    mostFrequentWork = null
  } = weekStatsData;

  return (
    <div className="space-y-6">
      <WeekNavigator currentWeek={currentWeek} />
      
      {/* Progress bar */}
      <StatsProgressBar 
        weeklyHours={weeklyHours}
        hoursGoal={40}
        totalEarnings={totalEarnings}
      />
      
      {/* Weekly stats grid */}
      <WeeklyStatsGrid 
        weeklyHours={weeklyHours}
        totalEarnings={totalEarnings}
        averageHoursPerDay={averageHoursPerDay}
        mostFrequentWork={mostFrequentWork}
      />
      
      {/* Distribution chart */}
      <WorkDistributionChart 
        workDistribution={workDistribution}
      />
      
      {/* Daily breakdown */}
      <DailyBreakdownCard 
        shiftsPerDay={shiftsPerDay}
        works={works}
      />
    </div>
  );
};

export default StatsSection;