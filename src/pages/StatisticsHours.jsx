// src/pages/StatisticsHours.jsx
// "Tus horas" (/statistics/hours) — total de horas del mes contra la meta
// mensual derivada del goal semanal (weeklyGoal × díasDelMes / 7), con
// desglose semana por semana. Ver STATS_EXPANSION_ROADMAP.

import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Clock, Check, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import MonthNavigator from '../components/stats/MonthNavigator';
import { useMonthlyStats } from '../hooks/useMonthlyStats';
import { useThemeColors } from '../hooks/useThemeColors';
import { createSafeDate } from '../utils/time';

const GREEN = '#10B981';
const RED = '#EF4444';

// "194 h 30 min" — formato legible estilo registro de horas
const formatHM = (hours) => {
  const totalMin = Math.round((hours || 0) * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
};

const StatisticsHours = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const {
    monthOffset,
    setMonthOffset,
    year,
    month,
    monthlyData,
    previousMonthData,
    monthWeeks,
    monthlyHoursGoal,
    goalProgress,
    goalMet,
  } = useMonthlyStats();

  const locale = t('common.locale', 'en-US');
  const formatDay = (key) => {
    const d = createSafeDate(key);
    if (!d || isNaN(d.getTime())) return key;
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  };
  const formatDate = (d) => d.toLocaleDateString(locale, { day: 'numeric', month: 'short' });

  const totalHours = monthlyData?.totalHours || 0;
  const hasGoal = monthlyHoursGoal !== null;

  // Rangos legibles del mes visible y el anterior ("1 jul – 31 jul")
  const monthRange = `${formatDate(new Date(year, month, 1))} – ${formatDate(new Date(year, month + 1, 0))}`;
  const prevDate = new Date(year, month - 1, 1);
  const prevRange = `${formatDate(prevDate)} – ${formatDate(new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 0))}`;

  // Diferencia vs mes anterior
  const prevHours = previousMonthData?.totalHours || 0;
  const diff = totalHours - prevHours;
  const DiffIcon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;
  const diffColor = diff > 0 ? GREEN : diff < 0 ? RED : '#9CA3AF';

  return (
    <>
      <Helmet>
        <title>{`${t('yourHours.title')} - Orary`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="px-4 py-6 space-y-6">
        <PageHeader
          icon={Clock}
          title={t('yourHours.title')}
          subtitle={t('yourHours.subtitle')}
        />

        <MonthNavigator
          monthOffset={monthOffset}
          onMonthChange={setMonthOffset}
          year={year}
          month={month}
        />

        {/* Hero: horas del mes vs meta */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 space-y-4"
        >
          <div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {formatHM(totalHours)}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              {t('yourHours.totalLabel')} ({monthRange})
            </p>
          </div>

          {/* Comparación vs mes anterior */}
          <div className="flex items-center justify-between gap-4 py-4 border-t border-b border-gray-100 dark:border-slate-800">
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatHM(prevHours)}
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                {t('yourHours.prevMonth')}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500">{prevRange}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold flex items-center justify-end gap-1.5" style={{ color: diffColor }}>
                <DiffIcon size={17} />
                {diff > 0 ? '+' : diff < 0 ? '-' : ''}{formatHM(Math.abs(diff))}
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                {t('yourHours.difference')}
              </p>
            </div>
          </div>

          {hasGoal && (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-slate-400">
                {t('yourHours.goalLabel')}
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-slate-300">
                {formatHM(monthlyHoursGoal)}
              </p>
            </div>
          )}

          {hasGoal ? (
            <>
              <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: goalMet ? GREEN : colors.primary }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round((goalProgress || 0) * 100)}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                style={
                  goalMet
                    ? { backgroundColor: `${GREEN}1A`, color: GREEN }
                    : { backgroundColor: colors.transparent10, color: colors.primary }
                }
              >
                {goalMet ? <Check size={15} /> : <X size={15} />}
                {goalMet ? t('yourHours.goalMet') : t('yourHours.goalNotMet')}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {t('yourHours.noGoal')}{' '}
              <Link to="/settings" className="font-medium underline" style={{ color: colors.primary }}>
                {t('nav.settings')}
              </Link>
            </p>
          )}
        </motion.div>

        {/* Desglose semana por semana — variante transparente (sin card blanca)
            para variar la textura visual respecto del hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <h2 className="px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            {t('yourHours.weeks')}
          </h2>
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {monthWeeks.map((week) => (
              <div key={week.start} className="flex items-center gap-3 px-1 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDay(week.start)} – {formatDay(week.end)}
                  </p>
                  {week.isPartial && (
                    <p className="text-xs text-gray-400 dark:text-slate-500">
                      {t('yourHours.partial')}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-300 whitespace-nowrap">
                  <span className="font-semibold">{week.totalHours.toFixed(1)}h</span>
                  {week.goal !== null && (
                    <span className="text-gray-400 dark:text-slate-500"> / {week.goal.toFixed(0)}h</span>
                  )}
                </p>
                {week.goalMet !== null && (
                  week.goalMet ? (
                    <Check size={17} style={{ color: GREEN }} className="flex-shrink-0" />
                  ) : (
                    <X size={17} className="flex-shrink-0 text-gray-300 dark:text-slate-600" />
                  )
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Nota explicativa */}
        <p className="px-1 text-[11px] text-gray-400 dark:text-gray-500 italic leading-relaxed">
          {t('yourHours.note')}
        </p>
      </div>
    </>
  );
};

export default StatisticsHours;
