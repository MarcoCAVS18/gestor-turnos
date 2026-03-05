// src/components/stats/MonthlyProjection/index.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import BaseStatsCard from '../../cards/base/BaseStatsCard';

const MonthlyProjection = ({ totalEarned = 0, hoursWorked = 0 }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  // Validate data
  const safeTotal = typeof totalEarned === 'number' && !isNaN(totalEarned) ? totalEarned : 0;
  const safeHours = typeof hoursWorked === 'number' && !isNaN(hoursWorked) ? hoursWorked : 0;

  const projectedEarnings = safeTotal * 4.33;
  const projectedHours = safeHours * 4.33;

  const isEmpty = safeTotal === 0 && safeHours === 0;

  return (
    <BaseStatsCard
      icon={TrendingUp}
      title={t('stats.monthlyProjection.title')}
      empty={isEmpty}
      emptyMessage={t('stats.monthlyProjection.empty')}
      emptyDescription={t('stats.monthlyProjection.emptyDesc')}
    >
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          {t('stats.monthlyProjection.description')}
        </p>
        <p
          className="text-3xl font-bold"
          style={{ color: colors.primary }}
        >
          {formatCurrency(projectedEarnings)}
        </p>
        <p className="text-sm text-gray-500">
          ~{projectedHours.toFixed(0)} {t('stats.monthlyProjection.hours')}
        </p>
      </div>
    </BaseStatsCard>
  );
};

export default MonthlyProjection;
