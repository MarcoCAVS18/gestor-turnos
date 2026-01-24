// src/components/sections/StatsSection/index.jsx

import React from 'react';
import WeekNavigator from '../../stats/WeekNavigator';
import StatsProgressBar from '../../stats/StatsProgressBar';
import WeeklyStatsGrid from '../../stats/WeeklyStatsGrid';
import WorkDistributionChart from '../../stats/WorkDistributionChart';
import DailyBreakdownCard from '../../stats/DailyBreakdownCard';

const StatsSection = (***REMOVED*** weekStatsData = ***REMOVED******REMOVED***, works = [] ***REMOVED***) => ***REMOVED***
  const ***REMOVED***
    currentWeek = 0,
    weeklyHours = 0,
    totalEarnings = 0,
    workDistribution = [],
    shiftsPerDay = ***REMOVED******REMOVED***,
    averageHoursPerDay = 0,
    mostFrequentWork = null
  ***REMOVED*** = weekStatsData;

  return (
    <div className="space-y-6">
      <WeekNavigator currentWeek=***REMOVED***currentWeek***REMOVED*** />
      
      ***REMOVED***/* Progress bar */***REMOVED***
      <StatsProgressBar 
        weeklyHours=***REMOVED***weeklyHours***REMOVED***
        hoursGoal=***REMOVED***40***REMOVED***
        totalEarnings=***REMOVED***totalEarnings***REMOVED***
      />
      
      ***REMOVED***/* Weekly stats grid */***REMOVED***
      <WeeklyStatsGrid 
        weeklyHours=***REMOVED***weeklyHours***REMOVED***
        totalEarnings=***REMOVED***totalEarnings***REMOVED***
        averageHoursPerDay=***REMOVED***averageHoursPerDay***REMOVED***
        mostFrequentWork=***REMOVED***mostFrequentWork***REMOVED***
      />
      
      ***REMOVED***/* Distribution chart */***REMOVED***
      <WorkDistributionChart 
        workDistribution=***REMOVED***workDistribution***REMOVED***
      />
      
      ***REMOVED***/* Daily breakdown */***REMOVED***
      <DailyBreakdownCard 
        shiftsPerDay=***REMOVED***shiftsPerDay***REMOVED***
        works=***REMOVED***works***REMOVED***
      />
    </div>
  );
***REMOVED***;

export default StatsSection;