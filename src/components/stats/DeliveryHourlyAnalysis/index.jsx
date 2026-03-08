// src/components/stats/DeliveryHourlyAnalysis/index.jsx

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Sun, Moon, Sunset, Sunrise, BarChart2, PlusCircle, Crown, TrendingUp } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';
import Popover from '../../ui/Popover';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { usePremium, PREMIUM_COLORS } from '../../../contexts/PremiumContext';
import { formatCurrency } from '../../../utils/currency';
import { calculateWeeklyHourlyDeliveryStats } from '../../../services/calculationService';

// Reactive dark mode detector — watches the `dark` class on <html>
const useIsDark = () => {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(el.classList.contains('dark'));
    });
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
};

const DeliveryHourlyAnalysis = ({ shifts = [], className = "" }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const navigate = useNavigate();
  const { isPremium } = usePremium();
  const isDark = useIsDark();

  const weeklyHourlyStats = useMemo(() => {
    return calculateWeeklyHourlyDeliveryStats(shifts);
  }, [shifts]);

  const maxTotalProfit = useMemo(() => {
    let max = 0;
    weeklyHourlyStats.forEach(day => {
      day.hourlyData.forEach(hour => {
        if (hour.totalProfit > max) max = hour.totalProfit;
      });
    });
    return max;
  }, [weeklyHourlyStats]);

  const bestMoment = useMemo(() => {
    let bestDay = null;
    let bestHour = null;
    let maxAvgProfit = 0;

    weeklyHourlyStats.forEach(dayStat => {
      dayStat.hourlyData.forEach(hourStat => {
        if (hourStat.averageProfitPerHour > maxAvgProfit) {
          maxAvgProfit = hourStat.averageProfitPerHour;
          bestDay = dayStat.day;
          bestHour = hourStat.hour;
        }
      });
    });
    return { day: bestDay, hour: bestHour, averageProfitPerHour: maxAvgProfit };
  }, [weeklyHourlyStats]);

  // Empty cell colour adapts to dark / light mode.
  // Dark: slate-700 (#334155) — one shade lighter than the card's slate-800 bg, clearly visible.
  // Light: slate-100 (#f1f5f9) — subtle against white card.
  const emptyCell = isDark ? '#334155' : '#f1f5f9';

  const getHeatmapColor = useCallback((value) => {
    if (!value || value <= 0 || maxTotalProfit === 0) return emptyCell;

    const intensity = value / maxTotalProfit;
    const opacity = 0.15 + (intensity * 0.85);

    let baseColor = colors.primary;
    if (!baseColor || typeof baseColor !== 'string' || !baseColor.startsWith('#')) {
      baseColor = '#4f46e5';
    }

    const hexToRgb = (hex) => {
      hex = hex.replace(/^#/, '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      if (hex.length !== 6) return { r: 79, g: 70, b: 229 };
      const bigint = parseInt(hex, 16);
      return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
    };

    const rgb = hexToRgb(baseColor);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity.toFixed(2)})`;
  }, [maxTotalProfit, colors.primary, emptyCell]);

  const insights = useMemo(() => {
    const dayTotals = weeklyHourlyStats.map(day => ({
      day: day.day,
      totalProfit: day.hourlyData.reduce((sum, h) => sum + (h.totalProfit || 0), 0),
      totalHours: day.hourlyData.reduce((sum, h) => sum + (h.totalHours || 0), 0),
    })).filter(d => d.totalHours > 0);

    if (dayTotals.length === 0) return null;

    const bestDay = dayTotals.reduce((a, b) => a.totalProfit > b.totalProfit ? a : b);
    const worstDay = dayTotals.length > 1
      ? dayTotals.reduce((a, b) => a.totalProfit < b.totalProfit ? a : b)
      : null;
    const activeDays = dayTotals.length;
    const totalHoursAll = dayTotals.reduce((sum, d) => sum + d.totalHours, 0);

    const PERIODS = [
      { key: 'morning', hours: [6, 7, 8, 9, 10, 11] },
      { key: 'afternoon', hours: [12, 13, 14, 15] },
      { key: 'evening', hours: [16, 17, 18, 19] },
      { key: 'night', hours: [20, 21, 22, 23, 0, 1, 2, 3, 4, 5] },
    ];

    const periodStats = PERIODS.map(period => {
      let totalProfit = 0;
      let totalHours = 0;
      weeklyHourlyStats.forEach(day => {
        day.hourlyData.forEach(hourStat => {
          if (period.hours.includes(hourStat.hour)) {
            totalProfit += hourStat.totalProfit || 0;
            totalHours += hourStat.totalHours || 0;
          }
        });
      });
      const avgRate = totalHours > 0 ? totalProfit / totalHours : 0;
      return { key: period.key, totalProfit, totalHours, avgRate };
    }).filter(p => p.totalHours > 0);

    const bestPeriod = periodStats.length > 0
      ? periodStats.reduce((a, b) => a.avgRate > b.avgRate ? a : b)
      : null;

    return { bestDay, worstDay, activeDays, totalHoursAll, bestPeriod };
  }, [weeklyHourlyStats]);

  const hasData = useMemo(() => weeklyHourlyStats.some(day => day.hourlyData.some(hour => hour.totalHours > 0)), [weeklyHourlyStats]);

  if (!isPremium) {
    return (
      <Card className={`flex flex-col ${className} relative overflow-hidden`}>
        {/* Blur overlay — sits above blurred content, below CTA */}
        <div className="absolute inset-0 backdrop-blur-[3px] bg-white/70 dark:bg-slate-800/70 z-10 rounded-xl pointer-events-none" />

        {/* Blurred background preview (non-interactive) */}
        <div className="opacity-40 pointer-events-none select-none" aria-hidden="true">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center mb-4">
            <Clock size={20} style={{ color: colors.primary }} className="mr-2" />
            {t('stats.deliveryHourlyAnalysis.title')}
          </h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-slate-700 dark:to-slate-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 h-16" />
            <div className="grid gap-x-[2px] gap-y-1" style={{ gridTemplateColumns: '40px repeat(12, 1fr)' }}>
              {Array.from({ length: 7 }).map((_, row) => (
                <React.Fragment key={row}>
                  <div className="h-6 bg-gray-200 dark:bg-slate-600 rounded-sm" />
                  {Array.from({ length: 12 }).map((_, col) => (
                    <div key={col} className="h-6 rounded-sm" style={{ backgroundColor: emptyCell }} />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Premium CTA — centred on top of blur */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${PREMIUM_COLORS.gold}33, ${PREMIUM_COLORS.gold}66)` }}
          >
            <Crown size={32} style={{ color: PREMIUM_COLORS.gold }} />
          </div>

          <div>
            <p className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1">
              {t('stats.deliveryHourlyAnalysis.title')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {t('stats.deliveryHourlyAnalysis.premiumDesc')}
            </p>
          </div>

          <button
            onClick={() => navigate('/premium')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-md transition-transform hover:scale-105 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${PREMIUM_COLORS.gold}, #f59e0b)`,
              color: '#1a1100',
            }}
          >
            <Crown size={15} />
            {t('stats.deliveryHourlyAnalysis.unlockPremium')}
          </button>
        </div>
      </Card>
    );
  }

  if (!hasData) {
    return (
      <Card className={`flex flex-col ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center mb-4">
          <Clock size={20} style={{ color: colors.primary }} className="mr-2" />
          {t('stats.deliveryHourlyAnalysis.title')}
        </h3>
        <div className="flex-grow flex flex-col items-center justify-center py-8 px-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-full mb-4">
            <BarChart2 size={32} className="text-gray-300 dark:text-gray-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">{t('stats.deliveryHourlyAnalysis.noData')}</p>
          <Button
            onClick={() => navigate('/shifts')}
            variant="outline"
            themeColor={colors.primary}
            icon={PlusCircle}
            iconPosition="left"
            className="mt-4"
          >
            {t('stats.deliveryHourlyAnalysis.addShift')}
          </Button>
        </div>
      </Card>
    );
  }

  const getHourIcon = (hour) => {
    if (hour >= 6 && hour < 12) return Sunrise;
    if (hour >= 12 && hour < 16) return Sun;
    if (hour >= 16 && hour < 20) return Sunset;
    return Moon;
  };

  const BestMomentIcon = bestMoment.day !== null ? getHourIcon(bestMoment.hour) : Clock;
  const getDayLabel = (dayName) => t(`stats.days.${dayName}`);

  return (
    <Card className={`flex flex-col ${className}`}>
      <div className="flex-none">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center mb-4">
          <Clock size={20} style={{ color: colors.primary }} className="mr-2" />
          {t('stats.deliveryHourlyAnalysis.title')}
        </h3>
      </div>

      <div className="flex-grow flex flex-col space-y-6">
        {/* Best Moment Card */}
        {bestMoment.day !== null && bestMoment.averageProfitPerHour > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-white dark:from-slate-700 dark:to-slate-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
            <Flex variant="between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600">
                  <BestMomentIcon size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">{t('stats.deliveryHourlyAnalysis.bestMoment')}</p>
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-lg">
                    {t(`stats.daysFull.${bestMoment.day}`)} {bestMoment.hour}:00 - {bestMoment.hour + 1}:00
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    {formatCurrency(bestMoment.averageProfitPerHour)} {t('stats.deliveryHourlyAnalysis.perHour')}
                  </p>
                </div>
              </div>
            </Flex>
          </div>
        )}

        {/* Heatmap */}
        <div className="w-full overflow-x-auto pb-2 relative">
          <div className="w-full min-w-[600px]">
            <div
              className="grid gap-x-[2px] gap-y-1"
              style={{ gridTemplateColumns: '40px repeat(24, 1fr)' }}
            >
              <div className="text-[10px] text-gray-400 dark:text-gray-500 text-center self-end pb-1">#</div>
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="text-[10px] text-gray-400 dark:text-gray-500 text-center pb-1">
                  {i % 3 === 0 ? `${i}h` : ''}
                </div>
              ))}

              {weeklyHourlyStats.map((dayStat) => (
                <React.Fragment key={dayStat.day}>
                  <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400 self-center capitalize">
                    {getDayLabel(dayStat.day)}
                  </div>

                  {dayStat.hourlyData.map((hourStat) => (
                    <Popover
                      key={`${dayStat.day}-${hourStat.hour}`}
                      trigger="hover"
                      position="top"
                      content={
                        <div className="p-2">
                          <p className="font-bold mb-1">{dayStat.day} {hourStat.hour}:00</p>
                          {hourStat.totalHours > 0 ? (
                            <>
                              <div className="flex justify-between text-xs gap-4">
                                <span className="text-gray-400">{t('stats.deliveryHourlyAnalysis.profitability')}</span>
                                <span className="font-medium text-green-600">{formatCurrency(hourStat.averageProfitPerHour)}{t('stats.deliveryHourlyAnalysis.perH')}</span>
                              </div>
                              <div className="flex justify-between text-xs gap-4 mt-1">
                                <span className="text-gray-400">{t('stats.deliveryHourlyAnalysis.totalEarned')}</span>
                                <span>{formatCurrency(hourStat.totalProfit)}</span>
                              </div>
                              <div className="flex justify-between text-xs gap-4">
                                <span className="text-gray-400">{t('stats.deliveryHourlyAnalysis.hours')}</span>
                                <span>{hourStat.totalHours.toFixed(1)}h</span>
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-400 italic text-xs">{t('stats.deliveryHourlyAnalysis.noDataRecorded')}</span>
                          )}
                        </div>
                      }
                    >
                      <div
                        className={`w-full h-10 rounded-sm transition-all duration-200 cursor-default ${hourStat.totalHours > 0 ? 'hover:scale-110 hover:shadow-md hover:z-10 relative' : ''}`}
                        style={{ backgroundColor: getHeatmapColor(hourStat.totalProfit) }}
                      />
                    </Popover>
                  ))}
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 text-xs text-gray-400 dark:text-gray-500 mt-4 border-t border-gray-100 dark:border-gray-700 pt-3">
              <span>{t('stats.deliveryHourlyAnalysis.lessEarnings')}</span>
              <div className="flex gap-0.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: emptyCell }} />
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getHeatmapColor(maxTotalProfit * 0.2) }} />
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getHeatmapColor(maxTotalProfit * 0.4) }} />
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getHeatmapColor(maxTotalProfit * 0.6) }} />
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getHeatmapColor(maxTotalProfit * 0.8) }} />
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getHeatmapColor(maxTotalProfit) }} />
              </div>
              <span>{t('stats.deliveryHourlyAnalysis.moreEarnings')}</span>
            </div>
          </div>
        </div>

        {/* Personalized Insights */}
        {insights && (
          <div className="rounded-xl border border-gray-200 dark:border-slate-600 bg-gradient-to-br from-gray-50 to-white dark:from-slate-700/40 dark:to-slate-800/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${colors.primary}22` }}>
                <TrendingUp size={14} style={{ color: colors.primary }} />
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t('stats.deliveryHourlyAnalysis.insights.title')}
              </p>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('stats.deliveryHourlyAnalysis.insights.recommendation', {
                bestDay: t(`stats.daysFull.${insights.bestDay.day}`),
                bestPeriod: insights.bestPeriod
                  ? t(`stats.deliveryHourlyAnalysis.insights.periods.${insights.bestPeriod.key}`)
                  : '',
                bestRate: formatCurrency(bestMoment.averageProfitPerHour),
                activeDays: insights.activeDays,
              })}
              {(insights.worstDay && insights.activeDays >= 3 && insights.worstDay.day !== insights.bestDay.day)
                ? ` ${t('stats.deliveryHourlyAnalysis.insights.avoidNote', { worstDay: t(`stats.daysFull.${insights.worstDay.day}`) })}`
                : ''}
            </p>

            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 border-t border-gray-100 dark:border-slate-600 pt-2">
              {t('stats.deliveryHourlyAnalysis.insights.activeDays', {
                count: insights.activeDays,
                hours: insights.totalHoursAll.toFixed(1),
              })}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DeliveryHourlyAnalysis;
