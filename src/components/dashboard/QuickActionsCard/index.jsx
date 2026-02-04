// src/components/dashboard/QuickActionsCard/index.jsx

import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase, Zap, Timer } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const QuickActionsCard = ({ className, onOpenLiveMode }) => {
  const colors = useThemeColors();
  const navigate = useNavigate();

  return (
    <Card className={`${className} flex flex-col`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Zap size={20} style={{ color: colors.primary }} className="mr-2" />
        Quick actions
      </h3>
      <div className="grid grid-cols-2 gap-2 flex-grow items-center">
        <Button
          onClick={() => navigate('/turnos')}
          variant="outline"
          className="flex items-center justify-center gap-2"
          icon={Plus}
          themeColor={colors.primary}
        >
          New shift
        </Button>
        <Button
          onClick={() => navigate('/trabajos')}
          variant="outline"
          className="flex items-center justify-center gap-2"
          icon={Briefcase}
          themeColor={colors.primary}
        >
          New work
        </Button>
        <Button
          onClick={onOpenLiveMode}
          variant="solid"
          className="col-span-2 flex items-center justify-center gap-2"
          icon={Timer}
          themeColor={colors.primary}
        >
          Live Mode
        </Button>
      </div>
    </Card>
  );
};

export default QuickActionsCard;
