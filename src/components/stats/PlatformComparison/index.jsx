// src/components/stats/PlatformComparison/index.jsx

import React, { useState, useMemo } from 'react';
import { BarChart3, Package, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';
import WorkAvatar from '../../work/WorkAvatar';
import {
  calculateAveragePerOrder,
  calculateAveragePerHour,
  calculateNetEarnings,
  sortPlatforms
} from '../../../utils/statsCalculations';
import Flex from '../../ui/Flex';
import ProgressBar from '../../ui/ProgressBar';

const PlatformComparison = ({ deliveryStats }) => {
  const colors = useThemeColors();
  const [sortBy, setSortBy] = useState('totalEarned');

  const platforms = useMemo(() => Object.values(deliveryStats.shiftsByPlatform), [deliveryStats]);

  const platformsWithMetrics = useMemo(() => platforms.map(platform => ({
    ...platform,
    averagePerOrder: calculateAveragePerOrder(platform),
    averagePerHour: calculateAveragePerHour(platform),
    netEarnings: calculateNetEarnings(platform)
  })), [platforms]);

  const sortedPlatforms = useMemo(() => sortPlatforms(platformsWithMetrics, sortBy), [platformsWithMetrics, sortBy]);

  const totals = useMemo(() => {
    const initialTotals = {
      totalEarned: 0,
      totalOrders: 0,
      totalTips: 0,
    };
    
    platformsWithMetrics.forEach(p => {
      initialTotals.totalEarned += p.totalEarned;
      initialTotals.totalOrders += p.totalOrders;
      initialTotals.totalTips += p.totalTips;
    });

    initialTotals.maxAveragePerHour = Math.max(...platformsWithMetrics.map(p => p.averagePerHour), 0);
    
    return initialTotals;
  }, [platformsWithMetrics]);

  const summaryInfo = useMemo(() => {
    const bestPlatform = sortedPlatforms[0];
    if (!bestPlatform) return { bestLabel: '', bestValue: '', avgLabel: '', avgValue: '' };

    switch (sortBy) {
      case 'totalOrders':
        return {
          bestLabel: 'Most orders',
          bestValue: bestPlatform.name,
          avgLabel: 'Total orders',
          avgValue: totals.totalOrders
        };
      case 'averagePerHour':
        return {
          bestLabel: 'Best avg/hour',
          bestValue: bestPlatform.name,
          avgLabel: 'Overall avg',
          avgValue: formatCurrency(totals.totalEarned / (platforms.reduce((acc, p) => acc + p.totalHours, 0) || 1))
        };
      case 'totalTips':
        return {
          bestLabel: 'Most tips',
          bestValue: bestPlatform.name,
          avgLabel: 'Total tips',
          avgValue: formatCurrency(totals.totalTips)
        };
      default:
        return {
          bestLabel: 'Most profitable',
          bestValue: bestPlatform.name,
          avgLabel: 'Total earned',
          avgValue: formatCurrency(totals.totalEarned)
        };
    }
  }, [sortBy, sortedPlatforms, totals, platforms]);

  if (platforms.length === 0) {
    return (
      <Card>
        <div className="text-center py-6">
          <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No platform data
          </h3>
          <p className="text-gray-500">
            Data will appear when registering shifts
          </p>
        </div>
      </Card>
    );
  }

  const getMetricDetails = (platform) => {
    let mainStat, percentage, label, icon, progressColor;
    switch (sortBy) {
      case 'totalOrders':
        mainStat = platform.totalOrders;
        percentage = totals.totalOrders > 0 ? (platform.totalOrders / totals.totalOrders) * 100 : 0;
        label = 'orders';
        icon = <Package size={18} className="text-blue-500" />;
        progressColor = '#3b82f6'; // blue-500
        return { mainStat, percentage, label, icon, progressColor, formattedMainStat: mainStat };
      case 'averagePerHour':
        mainStat = platform.averagePerHour;
        percentage = totals.maxAveragePerHour > 0 ? (mainStat / totals.maxAveragePerHour) * 100 : 0;
        label = '/hour';
        icon = <Clock size={18} className="text-purple-500" />;
        progressColor = '#8b5cf6'; // purple-500
        return { mainStat, percentage, label, icon, progressColor, formattedMainStat: formatCurrency(mainStat) };
      case 'totalTips':
        mainStat = platform.totalTips;
        percentage = totals.totalTips > 0 ? (platform.totalTips / totals.totalTips) * 100 : 0;
        label = 'tips';
        icon = <TrendingUp size={18} className="text-orange-500" />;
        progressColor = '#f97316'; // orange-500
        return { mainStat, percentage, label, icon, progressColor, formattedMainStat: formatCurrency(mainStat) };
      case 'totalEarned':
      default:
        mainStat = platform.totalEarned;
        percentage = totals.totalEarned > 0 ? (platform.totalEarned / totals.totalEarned) * 100 : 0;
        label = 'earnings';
        icon = <DollarSign size={18} className="text-green-500" />;
        progressColor = '#22c55e'; // green-500
        return { mainStat, percentage, label, icon, progressColor, formattedMainStat: formatCurrency(mainStat) };
    }
  };

  const getSortButtonClass = (sortType) => {
    return `px-2 py-1 rounded transition-colors text-sm ${
      sortBy === sortType 
        ? 'text-white' 
        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
    }`;
  };

  return (
    <Card>
      <Flex variant="between" className="mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <BarChart3 size={20} style={{ color: colors.primary }} className="mr-2" />
          Platform Comparison
        </h3>
      </Flex>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSortBy('totalEarned')}
            className={getSortButtonClass('totalEarned')}
            style={{ backgroundColor: sortBy === 'totalEarned' ? colors.primary : undefined }}
          >
            Earnings
          </button>
          <button
            onClick={() => setSortBy('totalOrders')}
            className={getSortButtonClass('totalOrders')}
            style={{ backgroundColor: sortBy === 'totalOrders' ? colors.primary : undefined }}
          >
            Orders
          </button>
          <button
            onClick={() => setSortBy('averagePerHour')}
            className={getSortButtonClass('averagePerHour')}
            style={{ backgroundColor: sortBy === 'averagePerHour' ? colors.primary : undefined }}
          >
            Per hour
          </button>
          <button
            onClick={() => setSortBy('totalTips')}
            className={getSortButtonClass('totalTips')}
            style={{ backgroundColor: sortBy === 'totalTips' ? colors.primary : undefined }}
          >
            Tips
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sortedPlatforms.map((platform) => {
          const { formattedMainStat, percentage, icon, progressColor } = getMetricDetails(platform);
          
          return (
            <div 
              key={platform.name}
              className="p-3 rounded-lg border border-gray-200/80 bg-white"
            >
              <Flex variant="start-between" className="mb-2">
                <Flex>
                  <div className="mr-3 flex-shrink-0">
                    <WorkAvatar name={platform.name} color={platform.color} size='md' />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {platform.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {platform.shifts} shifts
                    </p>
                  </div>
                </Flex>
                <div className="text-right">
                  <Flex variant="center" className="gap-1 justify-end">
                    {icon}
                    <p className="text-lg font-bold" style={{ color: platform.color || colors.primary }}>
                      {formattedMainStat}
                    </p>
                  </Flex>
                  <p className="text-sm font-medium text-gray-500">{percentage.toFixed(1)}%</p>
                </div>
              </Flex>

              <div className="mb-2">
                <ProgressBar
                  value={percentage}
                  color={progressColor}
                />
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs">
                <StatItem icon={DollarSign} value={formatCurrency(platform.averagePerOrder)} label="/order" color="text-green-500" />
                <StatItem icon={Package} value={platform.totalOrders} label="orders" color="text-blue-500" />
                <StatItem icon={Clock} value={formatCurrency(platform.averagePerHour)} label="/hour" color="text-purple-500" />
                <StatItem icon={TrendingUp} value={formatCurrency(platform.totalTips)} label="tips" color="text-orange-500" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm text-center">
          <div>
            <p className="text-gray-500">{summaryInfo.bestLabel}</p>
            <p className="font-semibold text-gray-700" style={{ color: colors.primary }}>
              {summaryInfo.bestValue}
            </p>
          </div>
          <div>
            <p className="text-gray-500">{summaryInfo.avgLabel}</p>
            <p className="font-semibold text-gray-700" style={{ color: colors.primary }}>
              {summaryInfo.avgValue}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

const StatItem = ({ icon: Icon, value, label, color }) => (
  <div className="text-center p-2 bg-gray-50/80 rounded-lg">
    <Flex variant="center" className="mb-1">
      <Icon size={12} className={`mr-1 ${color}`} />
      <span className="font-medium text-gray-700">{value}</span>
    </Flex>
    <p className="text-gray-600">{label}</p>
  </div>
);

export default PlatformComparison;