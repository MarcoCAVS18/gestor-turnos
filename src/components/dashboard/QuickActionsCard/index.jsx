// src/components/dashboard/QuickActionsCard/index.jsx

import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const QuickActionsCard = ({ className }) => {
  const colors = useThemeColors();
  const navigate = useNavigate();

  return (
    <Card className={`${className} flex flex-col`}>
      <h3 className="text-lg font-semibold mb-4">Acciones rápidas</h3>
      <div className="grid grid-cols-2 gap-3 flex-grow items-center">
        <Button
          onClick={() => navigate('/turnos')}
          variant="outline"
          className="flex items-center justify-center gap-2"
          icon={Plus}
          themeColor={colors.primary}
        >
          Nuevo turno
        </Button>
        <Button
          onClick={() => navigate('/trabajos')}
          variant="outline"
          className="flex items-center justify-center gap-2"
          icon={Briefcase}
          themeColor={colors.primary}
        >
          Nuevo trabajo
        </Button>
      </div>
    </Card>
  );
};

export default QuickActionsCard;