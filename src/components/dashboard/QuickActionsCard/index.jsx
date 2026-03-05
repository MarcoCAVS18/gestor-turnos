// src/components/dashboard/QuickActionsCard/index.jsx

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Briefcase, Zap, Timer } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const QuickActionsCard = ({ className, onOpenLiveMode }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const navigate = useNavigate();

  return (
    <Card className={`${className} flex flex-col`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Zap size={20} style={{ color: colors.primary }} className="mr-2" />
        {t('dashboard.quickActions.title')}
      </h3>
      <div className="grid grid-cols-2 gap-2 flex-grow items-center">
        <Button
          onClick={() => navigate('/shifts')}
          variant="outline"
          className="flex items-center justify-center gap-2"
          icon={Plus}
          themeColor={colors.primary}
        >
          {t('dashboard.quickActions.newShift')}
        </Button>
        <Button
          onClick={() => navigate('/works')}
          variant="outline"
          className="flex items-center justify-center gap-2"
          icon={Briefcase}
          themeColor={colors.primary}
        >
          {t('dashboard.quickActions.newWork')}
        </Button>
        <Button
          onClick={onOpenLiveMode}
          variant="solid"
          className="col-span-2 flex items-center justify-center gap-2"
          icon={Timer}
          themeColor={colors.primary}
        >
          {t('common.liveMode')}
        </Button>
      </div>
    </Card>
  );
};

export default QuickActionsCard;
