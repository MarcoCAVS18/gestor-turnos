// src/components/dashboard/WeeklyStatsCard/index.jsx - Versión vertical mejorada

import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const WeeklyStatsCard = ({ stats }) => {
  const { thematicColors } = useApp();

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <Activity size={20} style={{ color: thematicColors?.base }} className="mr-2" />
          Esta semana
        </h3>
        {stats.tendenciaSemanal !== 0 && (
          <div className={`flex items-center text-sm ${
            stats.tendenciaSemanal > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {stats.tendenciaSemanal > 0 ? (
              <TrendingUp size={16} className="mr-1" />
            ) : (
              <TrendingDown size={16} className="mr-1" />
            )}
            {stats.tendenciaSemanal.toFixed(1)}%
          </div>
        )}
      </div>
      
      {/* Stats - Layout vertical */}
      <div className="flex-1 space-y-8">
        {/* Turnos completados */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Turnos completados</p>
          <p className="text-3xl font-bold text-gray-800">{stats.turnosEstaSemana}</p>
        </div>
        
        {/* Separador visual */}
        <div className="w-full h-px bg-gray-200"></div>
        
        {/* Ganancias */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Ganancias</p>
          <p 
            className="text-3xl font-bold" 
            style={{ color: thematicColors?.base }}
          >
            ${stats.gananciasEstaSemana.toFixed(0)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default WeeklyStatsCard;