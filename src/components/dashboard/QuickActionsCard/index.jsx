// src/components/dashboard/QuickActionsCard/index.jsx

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Briefcase, Timer, ChevronRight, Zap } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';

const QuickActionsCard = ({ className, onOpenLiveMode }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const navigate = useNavigate();

  return (
    <Card className={`${className} flex flex-col`}>
      {/* Header */}
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Zap size={20} style={{ color: colors.primary }} className="mr-2" />
        {t('dashboard.quickActions.title')}
      </h3>

      <div className="flex flex-col gap-2 flex-grow justify-center">
        {/* New Shift */}
        <button
          onClick={() => navigate('/shifts')}
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            borderColor: `${colors.primary}35`,
            backgroundColor: `${colors.primary}0A`,
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: `${colors.primary}20` }}
          >
            <Clock size={15} style={{ color: colors.primary }} />
          </div>
          <span className="text-sm font-medium flex-1" style={{ color: colors.text }}>
            {t('dashboard.quickActions.newShift')}
          </span>
          <ChevronRight
            size={14}
            className="opacity-40 group-hover:opacity-80 transition-opacity"
            style={{ color: colors.primary }}
          />
        </button>

        {/* New Work */}
        <button
          onClick={() => navigate('/works')}
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            borderColor: colors.border,
            backgroundColor: 'transparent',
          }}
        >
          <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-slate-700">
            <Briefcase size={15} style={{ color: colors.textSecondary }} />
          </div>
          <span className="text-sm font-medium flex-1" style={{ color: colors.text }}>
            {t('dashboard.quickActions.newWork')}
          </span>
          <ChevronRight
            size={14}
            className="opacity-40 group-hover:opacity-80 transition-opacity"
            style={{ color: colors.textSecondary }}
          />
        </button>

        {/* Live Mode */}
        <button
          onClick={onOpenLiveMode}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] mt-0.5"
          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}cc)` }}
        >
          <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-white/20">
            <Timer size={15} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-white flex-1">
            {t('common.liveMode')}
          </span>
          {/* Pulse dot */}
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
        </button>
      </div>
    </Card>
  );
};

export default QuickActionsCard;
