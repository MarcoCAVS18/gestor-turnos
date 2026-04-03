// src/components/dashboard/QuickStatsGrid/index.jsx

import { useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Briefcase, Calendar, Clock, Target,
  CalendarDays, CalendarRange,
  Timer, History,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import QuickStatCard from '../QuickStatCard';

const QuickStatsGrid = memo(({ stats, className }) => {
  const { t } = useTranslation();
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
        { label: t('dashboard.quickStats.thisWeek'), value: currentWeek?.totalShifts || 0, icon: CalendarDays, iconColor: '#3b82f6' },
        { label: t('dashboard.quickStats.thisMonth'), value: currentMonth?.totalShifts || 0, icon: CalendarRange, iconColor: '#8b5cf6' }
      ],
      hours: [
        { label: t('dashboard.quickStats.currentWeek'), value: `${(currentWeek?.hoursWorked || 0).toFixed(1)}h`, icon: Timer, iconColor: '#10b981' },
        { label: t('dashboard.quickStats.currentMonth'), value: `${(currentMonth?.hoursWorked || 0).toFixed(1)}h`, icon: History, iconColor: '#f59e0b' }
      ],
      average: [
        { label: t('dashboard.quickStats.perHour'), value: `$${stats.averagePerHour.toFixed(0)}`, icon: Clock, iconColor: '#6366f1' },
        { label: t('dashboard.quickStats.weekEarnings'), value: `$${(currentWeek?.totalEarned || 0).toLocaleString()}`, icon: TrendingUp, iconColor: '#ec4899' }
      ]
    };
  }, [stats, works, deliveryWork, t]);

  const cardsData = [
    {
      id: 'works',
      type: 'jobs',
      icon: Briefcase,
      label: t('dashboard.quickStats.works'),
      value: totalWorks,
      subtitle: t('dashboard.quickStats.active'),
      details: detailedData.works
    },
    {
      id: 'shifts',
      type: 'general',
      icon: Calendar,
      label: t('dashboard.quickStats.shifts'),
      value: stats.totalShifts,
      subtitle: t('dashboard.quickStats.completed'),
      details: detailedData.shifts
    },
    {
      id: 'hours',
      type: 'general',
      icon: Clock,
      label: t('dashboard.quickStats.hours'),
      value: stats.hoursWorked.toFixed(0),
      subtitle: t('dashboard.quickStats.worked'),
      details: detailedData.hours
    },
    {
      id: 'avg',
      type: 'general',
      icon: Target,
      label: t('dashboard.quickStats.average'),
      value: `$${stats.averagePerHour.toFixed(0)}`,
      subtitle: t('dashboard.quickStats.perHour'),
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
});

QuickStatsGrid.displayName = 'QuickStatsGrid';
export default QuickStatsGrid;