// src/components/stats/SmokoStatusCard/index.jsx

import React from 'react';
import { Coffee } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';

const SmokoStatusCard = () => {
  const { smokoEnabled } = useApp();
  const colors = useThemeColors();

  return (
    <Card className="h-full flex flex-col justify-center">
      {/* Header con ícono y título al estilo de otros componentes de stats */}
      <div className="flex items-center mb-4">
        <Coffee size={18} style={{ color: colors.primary }} className="mr-2" />
        <h3 className="font-semibold">Descanso</h3>
      </div>

      {/* Estado principal centrado */}
      <div className="text-center flex-1 flex items-center justify-center">
        <p 
          className={`text-4xl font-bold ${
            smokoEnabled ? '' : 'text-gray-600'
          }`}
          style={smokoEnabled ? { color: colors.primary } : {}}
        >
          {smokoEnabled ? 'ACTIVADO' : 'DESACTIVADO'}
        </p>
      </div>
    </Card>
  );
};

export default SmokoStatusCard;