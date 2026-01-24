// src/components/dashboard/QuickStatsGrid/index.jsx

import React, { useMemo } from 'react';
import { 
  Briefcase, Calendar, Clock, Target, 
  CalendarDays, CalendarRange,
  Timer, History,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import QuickStatCard from '../QuickStatCard';

const QuickStatsGrid = ({ stats, className }) => {
  const { thematicColors, works, deliveryWork } = useApp();
  
  const totalWorks = (works?.length || 0) + (deliveryWork?.length || 0);
  
  const detailedData = useMemo(() => {
    // 1. Data for WORKS
    const traditionalCount = works?.length || 0;
    const deliveryCount = deliveryWork?.length || 0;
    const platformsSet = new Set(deliveryWork?.map(t => t.platform || t.name || "App").filter(Boolean));
    const platformsList = Array.from(platformsSet);

    // 2. Extract pre-calculated data from the useDashboardStats hook
    const { currentWeek, currentMonth } = stats;

    return {
      works: {
        traditional: traditionalCount,
        delivery: deliveryCount,
        platforms: platformsList
      },
      shifts: [
        { label: 'This Week', value: currentWeek?.totalShifts || 0, icon: CalendarDays, iconColor: '#3b82f6' },
        { label: 'This Month', value: currentMonth?.totalShifts || 0, icon: CalendarRange, iconColor: '#8b5cf6' }
      ],
      hours: [
        { label: 'Current Week', value: `${(currentWeek?.hoursWorked || 0).toFixed(1)}h`, icon: Timer, iconColor: '#10b981' },
        { label: 'Current Month', value: `${(currentMonth?.hoursWorked || 0).toFixed(1)}h`, icon: History, iconColor: '#f59e0b' }
      ],
      average: [
        { label: 'Per Hour', value: `$${stats.averagePerHour.toFixed(0)}`, icon: Clock, iconColor: '#6366f1' },
        { label: 'Week Earn.', value: `$${(currentWeek?.totalEarnings || 0).toLocaleString()}`, icon: TrendingUp, iconColor: '#ec4899' }
      ]
    };
  }, [stats, works, deliveryWork]);

  const cardsData = [
    {
      id: 'works',
      type: 'works', // Changed from 'jobs' to match the prop in QuickStatCard
      icon: Briefcase,
      label: 'Works',
      value: totalWorks,
      subtitle: 'active',
      details: detailedData.works
    },
    {
      id: 'shifts',
      type: 'general',
      icon: Calendar,
      label: 'Shifts',
      value: stats.totalShifts,
      subtitle: 'completed',
      details: detailedData.shifts
    },
    {
      id: 'hours',
      type: 'general',
      icon: Clock,
      label: 'Hours',
      value: stats.hoursWorked.toFixed(0),
      subtitle: 'worked',
      details: detailedData.hours
    },
    {
      id: 'avg',
      type: 'general',
      icon: Target,
      label: 'Average',
      value: `$${stats.averagePerHour.toFixed(0)}`,
      subtitle: 'per hour',
      details: detailedData.average
    }
  ];

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 ${className}`}>
      {cardsData.map((stat) => (
        <QuickStatCard 
          key={stat.id} 
          {...stat} 
          color={thematicColors?.base} 
        />
      ))}
    </div>
  );
};

export default QuickStatsGrid;