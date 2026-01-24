// src/components/stats/PlatformComparison/index.jsx

import React, ***REMOVED*** useState, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** BarChart3, Package, Clock, DollarSign, TrendingUp ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';
import WorkAvatar from '../../work/WorkAvatar';
import ***REMOVED***
  calculateAveragePerOrder,
  calculateAveragePerHour,
  calculateNetEarnings,
  sortPlatforms
***REMOVED*** from '../../../utils/statsCalculations';
import Flex from '../../ui/Flex';
import ProgressBar from '../../ui/ProgressBar';

const PlatformComparison = (***REMOVED*** deliveryStats ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const [sortBy, setSortBy] = useState('totalEarned');

  const platforms = useMemo(() => Object.values(deliveryStats.shiftsByPlatform), [deliveryStats]);

  const platformsWithMetrics = useMemo(() => platforms.map(platform => (***REMOVED***
    ...platform,
    averagePerOrder: calculateAveragePerOrder(platform),
    averagePerHour: calculateAveragePerHour(platform),
    netEarnings: calculateNetEarnings(platform)
  ***REMOVED***)), [platforms]);

  const sortedPlatforms = useMemo(() => sortPlatforms(platformsWithMetrics, sortBy), [platformsWithMetrics, sortBy]);

  const totals = useMemo(() => ***REMOVED***
    const initialTotals = ***REMOVED***
      totalEarned: 0,
      totalOrders: 0,
      totalTips: 0,
    ***REMOVED***;
    
    platformsWithMetrics.forEach(p => ***REMOVED***
      initialTotals.totalEarned += p.totalEarned;
      initialTotals.totalOrders += p.totalOrders;
      initialTotals.totalTips += p.totalTips;
    ***REMOVED***);

    initialTotals.maxAveragePerHour = Math.max(...platformsWithMetrics.map(p => p.averagePerHour), 0);
    
    return initialTotals;
  ***REMOVED***, [platformsWithMetrics]);

  const summaryInfo = useMemo(() => ***REMOVED***
    const bestPlatform = sortedPlatforms[0];
    if (!bestPlatform) return ***REMOVED*** bestLabel: '', bestValue: '', avgLabel: '', avgValue: '' ***REMOVED***;

    switch (sortBy) ***REMOVED***
      case 'totalOrders':
        return ***REMOVED***
          bestLabel: 'Most orders',
          bestValue: bestPlatform.name,
          avgLabel: 'Total orders',
          avgValue: totals.totalOrders
        ***REMOVED***;
      case 'averagePerHour':
        return ***REMOVED***
          bestLabel: 'Best avg/hour',
          bestValue: bestPlatform.name,
          avgLabel: 'Overall avg',
          avgValue: formatCurrency(totals.totalEarned / (platforms.reduce((acc, p) => acc + p.totalHours, 0) || 1))
        ***REMOVED***;
      case 'totalTips':
        return ***REMOVED***
          bestLabel: 'Most tips',
          bestValue: bestPlatform.name,
          avgLabel: 'Total tips',
          avgValue: formatCurrency(totals.totalTips)
        ***REMOVED***;
      default:
        return ***REMOVED***
          bestLabel: 'Most profitable',
          bestValue: bestPlatform.name,
          avgLabel: 'Total earned',
          avgValue: formatCurrency(totals.totalEarned)
        ***REMOVED***;
    ***REMOVED***
  ***REMOVED***, [sortBy, sortedPlatforms, totals, platforms]);

  if (platforms.length === 0) ***REMOVED***
    return (
      <Card>
        <div className="text-center py-6">
          <BarChart3 size=***REMOVED***48***REMOVED*** className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No platform data
          </h3>
          <p className="text-gray-500">
            Data will appear when registering shifts
          </p>
        </div>
      </Card>
    );
  ***REMOVED***

  const getMetricDetails = (platform) => ***REMOVED***
    let mainStat, percentage, label, icon, progressColor;
    switch (sortBy) ***REMOVED***
      case 'totalOrders':
        mainStat = platform.totalOrders;
        percentage = totals.totalOrders > 0 ? (platform.totalOrders / totals.totalOrders) * 100 : 0;
        label = 'orders';
        icon = <Package size=***REMOVED***18***REMOVED*** className="text-blue-500" />;
        progressColor = '#3b82f6'; // blue-500
        return ***REMOVED*** mainStat, percentage, label, icon, progressColor, formattedMainStat: mainStat ***REMOVED***;
      case 'averagePerHour':
        mainStat = platform.averagePerHour;
        percentage = totals.maxAveragePerHour > 0 ? (mainStat / totals.maxAveragePerHour) * 100 : 0;
        label = '/hour';
        icon = <Clock size=***REMOVED***18***REMOVED*** className="text-purple-500" />;
        progressColor = '#8b5cf6'; // purple-500
        return ***REMOVED*** mainStat, percentage, label, icon, progressColor, formattedMainStat: formatCurrency(mainStat) ***REMOVED***;
      case 'totalTips':
        mainStat = platform.totalTips;
        percentage = totals.totalTips > 0 ? (platform.totalTips / totals.totalTips) * 100 : 0;
        label = 'tips';
        icon = <TrendingUp size=***REMOVED***18***REMOVED*** className="text-orange-500" />;
        progressColor = '#f97316'; // orange-500
        return ***REMOVED*** mainStat, percentage, label, icon, progressColor, formattedMainStat: formatCurrency(mainStat) ***REMOVED***;
      case 'totalEarned':
      default:
        mainStat = platform.totalEarned;
        percentage = totals.totalEarned > 0 ? (platform.totalEarned / totals.totalEarned) * 100 : 0;
        label = 'earnings';
        icon = <DollarSign size=***REMOVED***18***REMOVED*** className="text-green-500" />;
        progressColor = '#22c55e'; // green-500
        return ***REMOVED*** mainStat, percentage, label, icon, progressColor, formattedMainStat: formatCurrency(mainStat) ***REMOVED***;
    ***REMOVED***
  ***REMOVED***;

  const getSortButtonClass = (sortType) => ***REMOVED***
    return `px-2 py-1 rounded transition-colors text-sm $***REMOVED***
      sortBy === sortType 
        ? 'text-white' 
        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
    ***REMOVED***`;
  ***REMOVED***;

  return (
    <Card>
      <Flex variant="between" className="mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <BarChart3 size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
          Platform Comparison
        </h3>
      </Flex>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick=***REMOVED***() => setSortBy('totalEarned')***REMOVED***
            className=***REMOVED***getSortButtonClass('totalEarned')***REMOVED***
            style=***REMOVED******REMOVED*** backgroundColor: sortBy === 'totalEarned' ? colors.primary : undefined ***REMOVED******REMOVED***
          >
            Earnings
          </button>
          <button
            onClick=***REMOVED***() => setSortBy('totalOrders')***REMOVED***
            className=***REMOVED***getSortButtonClass('totalOrders')***REMOVED***
            style=***REMOVED******REMOVED*** backgroundColor: sortBy === 'totalOrders' ? colors.primary : undefined ***REMOVED******REMOVED***
          >
            Orders
          </button>
          <button
            onClick=***REMOVED***() => setSortBy('averagePerHour')***REMOVED***
            className=***REMOVED***getSortButtonClass('averagePerHour')***REMOVED***
            style=***REMOVED******REMOVED*** backgroundColor: sortBy === 'averagePerHour' ? colors.primary : undefined ***REMOVED******REMOVED***
          >
            Per hour
          </button>
          <button
            onClick=***REMOVED***() => setSortBy('totalTips')***REMOVED***
            className=***REMOVED***getSortButtonClass('totalTips')***REMOVED***
            style=***REMOVED******REMOVED*** backgroundColor: sortBy === 'totalTips' ? colors.primary : undefined ***REMOVED******REMOVED***
          >
            Tips
          </button>
        </div>
      </div>

      <div className="space-y-3">
        ***REMOVED***sortedPlatforms.map((platform) => ***REMOVED***
          const ***REMOVED*** formattedMainStat, percentage, icon, progressColor ***REMOVED*** = getMetricDetails(platform);
          
          return (
            <div 
              key=***REMOVED***platform.name***REMOVED***
              className="p-3 rounded-lg border border-gray-200/80 bg-white"
            >
              <Flex variant="start-between" className="mb-2">
                <Flex>
                  <div className="mr-3 flex-shrink-0">
                    <WorkAvatar name=***REMOVED***platform.name***REMOVED*** color=***REMOVED***platform.color***REMOVED*** size='md' />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      ***REMOVED***platform.name***REMOVED***
                    </h4>
                    <p className="text-sm text-gray-500">
                      ***REMOVED***platform.shifts***REMOVED*** shifts
                    </p>
                  </div>
                </Flex>
                <div className="text-right">
                  <Flex variant="center" className="gap-1 justify-end">
                    ***REMOVED***icon***REMOVED***
                    <p className="text-lg font-bold" style=***REMOVED******REMOVED*** color: platform.color || colors.primary ***REMOVED******REMOVED***>
                      ***REMOVED***formattedMainStat***REMOVED***
                    </p>
                  </Flex>
                  <p className="text-sm font-medium text-gray-500">***REMOVED***percentage.toFixed(1)***REMOVED***%</p>
                </div>
              </Flex>

              <div className="mb-2">
                <ProgressBar
                  value=***REMOVED***percentage***REMOVED***
                  color=***REMOVED***progressColor***REMOVED***
                />
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs">
                <StatItem icon=***REMOVED***DollarSign***REMOVED*** value=***REMOVED***formatCurrency(platform.averagePerOrder)***REMOVED*** label="/order" color="text-green-500" />
                <StatItem icon=***REMOVED***Package***REMOVED*** value=***REMOVED***platform.totalOrders***REMOVED*** label="orders" color="text-blue-500" />
                <StatItem icon=***REMOVED***Clock***REMOVED*** value=***REMOVED***formatCurrency(platform.averagePerHour)***REMOVED*** label="/hour" color="text-purple-500" />
                <StatItem icon=***REMOVED***TrendingUp***REMOVED*** value=***REMOVED***formatCurrency(platform.totalTips)***REMOVED*** label="tips" color="text-orange-500" />
              </div>
            </div>
          );
        ***REMOVED***)***REMOVED***
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm text-center">
          <div>
            <p className="text-gray-500">***REMOVED***summaryInfo.bestLabel***REMOVED***</p>
            <p className="font-semibold text-gray-700" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
              ***REMOVED***summaryInfo.bestValue***REMOVED***
            </p>
          </div>
          <div>
            <p className="text-gray-500">***REMOVED***summaryInfo.avgLabel***REMOVED***</p>
            <p className="font-semibold text-gray-700" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
              ***REMOVED***summaryInfo.avgValue***REMOVED***
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

const StatItem = (***REMOVED*** icon: Icon, value, label, color ***REMOVED***) => (
  <div className="text-center p-2 bg-gray-50/80 rounded-lg">
    <Flex variant="center" className="mb-1">
      <Icon size=***REMOVED***12***REMOVED*** className=***REMOVED***`mr-1 $***REMOVED***color***REMOVED***`***REMOVED*** />
      <span className="font-medium text-gray-700">***REMOVED***value***REMOVED***</span>
    </Flex>
    <p className="text-gray-600">***REMOVED***label***REMOVED***</p>
  </div>
);

export default PlatformComparison;