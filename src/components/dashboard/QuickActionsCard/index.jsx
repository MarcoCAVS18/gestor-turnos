// src/components/dashboard/QuickActionsCard/index.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const QuickActionsCard = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Acciones rápidas</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => navigate('/turnos')}
          variant="outline"
          className="flex items-center justify-center gap-2"
          icon={Plus}
        >
          Nuevo turno
        </Button>
        <Button
          onClick={() => navigate('/trabajos')}
          variant="outline"
          className="flex items-center justify-center gap-2"
          icon={Briefcase}
        >
          Nuevo trabajo
        </Button>
      </div>
    </Card>
  );
};

export default QuickActionsCard;