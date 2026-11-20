// src/pages/StatisticsMonthly.jsx
// Resumen mensual (/statistics/monthly) — PREMIUM (STATS_EXPANSION_ROADMAP).
// Free: teaser con candado → PremiumModal. Premium: cards del mes, comparación
// vs mes anterior y tendencia de 6 meses (motor: useMonthlyStats).

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  CalendarRange,
  Clock,
  DollarSign,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import MonthNavigator from '../components/stats/MonthNavigator';
import BaseChart from '../components/charts/BaseChart';
import Button from '../components/ui/Button';
import PremiumModal from '../components/modals/premium/PremiumModal';
import { useMonthlyStats } from '../hooks/useMonthlyStats';
import { usePremium, PREMIUM_COLORS } from '../contexts/PremiumContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { formatCurrency } from '../utils/currency';
import AnimatedNumber from '../components/ui/AnimatedNumber';

const StatCard = ({ icon: Icon, label, value, colors, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25, delay }}
    className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-4"
  >
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center mb-2"
      style={{ backgroundColor: colors.transparent10, color: colors.primary }}
    >
      <Icon size={18} />
    </div>
    <p className="text-xl font-bold text-gray-900 dark:text-white truncate">{value}</p>
    <p className="text-xs text-gray-500 dark:text-slate-400">{label}</p>
  </motion.div>
);

const DeltaRow = ({ label, current, previous, formatter }) => {
  const delta = current - previous;
  const pct = previous > 0 ? (delta / previous) * 100 : null;
  const Icon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const color = delta > 0 ? '#10B981' : delta < 0 ? '#EF4444' : '#9CA3AF';

  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-gray-600 dark:text-slate-300">{label}</span>
      <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color }}>
        <Icon size={15} />
        {formatter(Math.abs(delta))}
        {pct !== null && (
          <span className="text-xs font-normal text-gray-400 dark:text-slate-500">
            ({pct > 0 ? '+' : pct < 0 ? '-' : ''}{Math.abs(pct).toFixed(0)}%)
          </span>
        )}
      </span>
    </div>
  );
};

const StatisticsMonthly = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { isPremium } = usePremium();
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const {
    monthOffset,
    setMonthOffset,
    year,
    month,
    monthlyData,
    previousMonthData,
    monthlyTrend,
  } = useMonthlyStats();

  const locale = t('common.locale', 'en-US');

  // Free: teaser + candado, sin datos
  if (!isPremium) {
    return (
      <>
        <Helmet>
          <title>{`${t('monthlySummary.title')} - Orary`}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="px-4 py-6 space-y-6">
          <PageHeader
            icon={CalendarRange}
            title={t('monthlySummary.title')}
            subtitle={t('monthlySummary.subtitle')}
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-8 text-center space-y-4"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
              style={{ backgroundColor: PREMIUM_COLORS.lighter }}
            >
              <Crown size={26} style={{ color: PREMIUM_COLORS.gold }} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {t('monthlySummary.premiumTitle')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
              {t('monthlySummary.premiumDesc')}
            </p>
            <Button
              onClick={() => setIsPremiumModalOpen(true)}
              themeColor={PREMIUM_COLORS.primary}
              className="mx-auto"
            >
              {t('monthlySummary.premiumCta')}
            </Button>
          </motion.div>
        </div>

        <PremiumModal
          isOpen={isPremiumModalOpen}
          onClose={() => setIsPremiumModalOpen(false)}
        />
      </>
    );
  }

  const trendData = monthlyTrend.map((m) => ({
    name: new Date(m.year, m.month, 1).toLocaleDateString(locale, { month: 'short' }),
    earnings: Math.round((m.totalEarnings || 0) * 100) / 100,
  }));

  return (
    <>
      <Helmet>
        <title>{`${t('monthlySummary.title')} - Orary`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="px-4 py-6 space-y-6">
        <PageHeader
          icon={CalendarRange}
          title={t('monthlySummary.title')}
          subtitle={t('monthlySummary.subtitle')}
        />

        <MonthNavigator
          monthOffset={monthOffset}
          onMonthChange={setMonthOffset}
          year={year}
          month={month}
        />

        {/* Cards del mes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Clock}
            label={t('monthlySummary.hours')}
            value={<AnimatedNumber value={monthlyData?.totalHours || 0} format="hours" suffix="h" />}
            colors={colors}
          />
          <StatCard
            icon={DollarSign}
            label={t('monthlySummary.earnings')}
            value={<AnimatedNumber value={monthlyData?.totalEarnings || 0} format="currency" />}
            colors={colors}
            delay={0.05}
          />
          <StatCard
            icon={Briefcase}
            label={t('monthlySummary.shifts')}
            value={<AnimatedNumber value={monthlyData?.shiftsCount || 0} />}
            colors={colors}
            delay={0.1}
          />
          <StatCard
            icon={TrendingUp}
            label={t('monthlySummary.perHour')}
            value={<AnimatedNumber value={monthlyData?.averageEarningsPerHour || 0} format="currency" />}
            colors={colors}
            delay={0.15}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">
          {/* Comparación vs mes anterior */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5"
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
              {t('monthlySummary.vsPrevious')}
            </h2>
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              <DeltaRow
                label={t('monthlySummary.hours')}
                current={monthlyData?.totalHours || 0}
                previous={previousMonthData?.totalHours || 0}
                formatter={(v) => `${v.toFixed(1)}h`}
              />
              <DeltaRow
                label={t('monthlySummary.earnings')}
                current={monthlyData?.totalEarnings || 0}
                previous={previousMonthData?.totalEarnings || 0}
                formatter={(v) => formatCurrency(v)}
              />
              <DeltaRow
                label={t('monthlySummary.shifts')}
                current={monthlyData?.shiftsCount || 0}
                previous={previousMonthData?.shiftsCount || 0}
                formatter={(v) => `${Math.round(v)}`}
              />
            </div>
          </motion.div>

          {/* Tendencia 6 meses */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5"
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
              {t('monthlySummary.trend')}
            </h2>
            <div className="h-56">
              <BaseChart
                data={trendData}
                chartType="area"
                dataKeys={[{ key: 'earnings', name: t('monthlySummary.earnings') }]}
                nameKey="name"
                valueFormatter={(value) => formatCurrency(value)}
                tooltipFormatter={(value) => [formatCurrency(value), t('monthlySummary.earnings')]}
                showLegend={false}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default StatisticsMonthly;
