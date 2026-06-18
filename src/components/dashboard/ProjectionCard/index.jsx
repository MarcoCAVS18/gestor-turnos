// src/components/dashboard/ProjectionCard/index.jsx

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Briefcase, Timer, ArrowRight, Check } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';
import { useNavigate, Link } from 'react-router-dom';

const ProjectionCard = memo(({ monthlyProjection, hoursWorked, className }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { calculateMonthlyStats, works, deliveryWork } = useApp();
  const navigate = useNavigate();

  // Check if user has any works
  const hasWorks = (works?.length > 0) || (deliveryWork?.length > 0);

  const renderContent = () => {
    if (!monthlyProjection || monthlyProjection <= 0) {
      return (
        <div className="w-full">
          <div className="grid grid-cols-2 gap-4">
            {/* Step 1: Add works */}
            {hasWorks ? (
              // Step 1 completed
              <div
                className="p-3 rounded-xl border-2 border-dashed bg-green-50/50 dark:bg-green-900/15"
                style={{ borderColor: '#10B98150' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-green-500">
                    <Check size={14} />
                  </div>
                  <Briefcase size={16} className="text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">{t('dashboard.projection.worksAdded')}</p>
                <p className="text-xs text-green-600 dark:text-green-400/80 mt-1">{t('dashboard.projection.stepCompleted')}</p>
              </div>
            ) : (
              // Step 1 active
              <button
                onClick={() => navigate('/works')}
                className="text-left p-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    1
                  </div>
                  <Briefcase size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                  {t('dashboard.projection.addWorks')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('dashboard.projection.unlocksShifts')}
                </p>
                <ArrowRight
                  size={14}
                  className="text-gray-300 dark:text-gray-500 mt-2 group-hover:text-gray-500 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all"
                />
              </button>
            )}

            {/* Step 2: Add shifts or use Live Mode */}
            {hasWorks ? (
              // Step 2 active (works exist, no shifts yet)
              <button
                onClick={() => navigate('/shifts')}
                className="text-left p-3 rounded-xl border-2 border-dashed hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all group"
                style={{ borderColor: colors.primary }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    2
                  </div>
                  <Timer size={16} style={{ color: colors.primary }} />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                  {t('dashboard.projection.trackShifts')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('dashboard.projection.addOrLive')}
                </p>
                <ArrowRight size={14} className="mt-2 group-hover:translate-x-1 transition-all" style={{ color: colors.primary }} />
              </button>
            ) : (
              // Step 2 disabled (no works yet)
              <div className="p-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/40">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-gray-300 dark:bg-slate-600 text-white">
                    2
                  </div>
                  <Timer size={16} className="text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('dashboard.projection.trackShifts')}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('dashboard.projection.addOrLive')}</p>
              </div>
            )}
          </div>

          {/* Helper for users who don't know where to start → Blogary */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
            {t('dashboard.projection.lostHelp')}{' '}
            <Link
              to="/blog"
              className="font-medium hover:underline"
              style={{ color: colors.primary }}
            >
              {t('dashboard.projection.lostHelpLink')}
            </Link>
          </p>
        </div>
      );
    }

    const now = new Date();
    const previousMonthStats = calculateMonthlyStats(now.getFullYear(), now.getMonth() - 1);

    const getComparisonText = () => {
      if (previousMonthStats.shiftsCount === 0) {
        return t('dashboard.projection.firstMonth');
      }

      const diff = monthlyProjection - previousMonthStats.totalEarnings;
      const percent = ((diff / previousMonthStats.totalEarnings) * 100).toFixed(1);

      if (diff > 0) {
        return t('dashboard.projection.moreThanLast', { amount: formatCurrency(Math.abs(diff)), percent });
      } else if (diff < 0) {
        return t('dashboard.projection.lessThanLast', { amount: formatCurrency(Math.abs(diff)), percent: Math.abs(percent) });
      } else {
        return t('dashboard.projection.sameAsLast');
      }
    };

    return (
      <Flex variant="between" className="w-full">
        {/* Left text */}
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            {t('dashboard.projection.keepPace')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getComparisonText()}
          </p>
        </div>

        {/* Right data */}
        <div className="text-right ml-4">
          <p
            className="text-3xl font-bold mb-1"
            style={{ color: colors.primary }}
          >
            {formatCurrency(monthlyProjection)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ~{((hoursWorked || 0) * 4.33).toFixed(0)} {t('common.hours').toLowerCase()}
          </p>
        </div>
      </Flex>
    );
  };

  // Cuando todavía no hay proyección (onboarding), el título "Projection" no
  // tiene sentido — usamos un título de setup. Ícono también cambia.
  const showSetupMode = !monthlyProjection || monthlyProjection <= 0;
  const HeaderIcon = showSetupMode ? Briefcase : BarChart3;
  const headerTitle = showSetupMode
    ? t('dashboard.projection.setupTitle')
    : t('dashboard.projection.title');

  return (
    <Card className={`${className} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center mb-4">
        <HeaderIcon size={20} style={{ color: colors.primary }} className="mr-2" />
        <h3 className="text-lg font-semibold dark:text-white">{headerTitle}</h3>
      </div>

      {/* Content */}
      <div className="flex-grow flex items-center">
        {renderContent()}
      </div>
    </Card>
  );
});

ProjectionCard.displayName = 'ProjectionCard';
export default ProjectionCard;
