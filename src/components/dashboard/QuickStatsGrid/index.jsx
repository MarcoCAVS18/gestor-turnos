// src/components/dashboard/QuickStatsGrid/index.jsx

import React, ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** 
  Briefcase, Calendar, Clock, Target, 
  CalendarDays, CalendarRange,
  Timer, History,
  TrendingUp
***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import QuickStatCard from '../QuickStatCard';

const QuickStatsGrid = (***REMOVED*** stats, className ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors, works, deliveryWork ***REMOVED*** = useApp();
  
  const totalWorks = (works?.length || 0) + (deliveryWork?.length || 0);
  
  const detailedData = useMemo(() => ***REMOVED***
    // 1. Data for WORKS
    const traditionalCount = works?.length || 0;
    const deliveryCount = deliveryWork?.length || 0;
    const platformsSet = new Set(deliveryWork?.map(t => t.platform || t.name || "App").filter(Boolean));
    const platformsList = Array.from(platformsSet);

    // 2. Extract pre-calculated data from the useDashboardStats hook
    const ***REMOVED*** currentWeek, currentMonth ***REMOVED*** = stats;

    return ***REMOVED***
      works: ***REMOVED***
        traditional: traditionalCount,
        delivery: deliveryCount,
        platforms: platformsList
      ***REMOVED***,
      shifts: [
        ***REMOVED*** label: 'This Week', value: currentWeek?.totalShifts || 0, icon: CalendarDays, iconColor: '#3b82f6' ***REMOVED***,
        ***REMOVED*** label: 'This Month', value: currentMonth?.totalShifts || 0, icon: CalendarRange, iconColor: '#8b5cf6' ***REMOVED***
      ],
      hours: [
        ***REMOVED*** label: 'Current Week', value: `$***REMOVED***(currentWeek?.hoursWorked || 0).toFixed(1)***REMOVED***h`, icon: Timer, iconColor: '#10b981' ***REMOVED***,
        ***REMOVED*** label: 'Current Month', value: `$***REMOVED***(currentMonth?.hoursWorked || 0).toFixed(1)***REMOVED***h`, icon: History, iconColor: '#f59e0b' ***REMOVED***
      ],
      average: [
        ***REMOVED*** label: 'Per Hour', value: `$$***REMOVED***stats.averagePerHour.toFixed(0)***REMOVED***`, icon: Clock, iconColor: '#6366f1' ***REMOVED***,
        ***REMOVED*** label: 'Week Earn.', value: `$$***REMOVED***(currentWeek?.totalEarnings || 0).toLocaleString()***REMOVED***`, icon: TrendingUp, iconColor: '#ec4899' ***REMOVED***
      ]
    ***REMOVED***;
  ***REMOVED***, [stats, works, deliveryWork]);

  const cardsData = [
    ***REMOVED***
      id: 'works',
      type: 'works', // Changed from 'jobs' to match the prop in QuickStatCard
      icon: Briefcase,
      label: 'Works',
      value: totalWorks,
      subtitle: 'active',
      details: detailedData.works
    ***REMOVED***,
    ***REMOVED***
      id: 'shifts',
      type: 'general',
      icon: Calendar,
      label: 'Shifts',
      value: stats.totalShifts,
      subtitle: 'completed',
      details: detailedData.shifts
    ***REMOVED***,
    ***REMOVED***
      id: 'hours',
      type: 'general',
      icon: Clock,
      label: 'Hours',
      value: stats.hoursWorked.toFixed(0),
      subtitle: 'worked',
      details: detailedData.hours
    ***REMOVED***,
    ***REMOVED***
      id: 'avg',
      type: 'general',
      icon: Target,
      label: 'Average',
      value: `$$***REMOVED***stats.averagePerHour.toFixed(0)***REMOVED***`,
      subtitle: 'per hour',
      details: detailedData.average
    ***REMOVED***
  ];

  return (
    <div className=***REMOVED***`grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 $***REMOVED***className***REMOVED***`***REMOVED***>
      ***REMOVED***cardsData.map((stat) => (
        <QuickStatCard 
          key=***REMOVED***stat.id***REMOVED*** 
          ***REMOVED***...stat***REMOVED*** 
          color=***REMOVED***thematicColors?.base***REMOVED*** 
        />
      ))***REMOVED***
    </div>
  );
***REMOVED***;

export default QuickStatsGrid;