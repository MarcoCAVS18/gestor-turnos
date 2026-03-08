// src/components/stats/DeliverySummary/index.jsx

import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency, formatHours } from '../../../utils/statsCalculations';
import Card from '../../ui/Card';

const DeliverySummary = ({ deliveryStats }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  if (!deliveryStats) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Package size={20} style={{ color: colors.primary }} />
          {t('stats.deliverySummary.title')}
        </h3>
        <div className="flex flex-col items-end text-right">
          <span className="text-xs text-gray-500 dark:text-gray-400">{t('stats.deliverySummary.totalEarnings')}</span>
          <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(deliveryStats.totalEarned)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('stats.deliverySummary.totalShifts')}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{deliveryStats.shiftsCompleted}</p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('stats.deliverySummary.totalHours')}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatHours(deliveryStats.totalHours)}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">{t('stats.deliverySummary.totalOrders')}</span>
          <span className="font-semibold text-gray-800 dark:text-gray-100">{deliveryStats.totalOrders}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">{t('stats.deliverySummary.totalTips')}</span>
          <span className="font-semibold text-gray-800 dark:text-gray-100">{formatCurrency(deliveryStats.totalTips)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">{t('stats.deliverySummary.netEarnings')}</span>
          <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(deliveryStats.netEarnings)}</span>
        </div>
      </div>
    </Card>
  );
};

export default DeliverySummary;
