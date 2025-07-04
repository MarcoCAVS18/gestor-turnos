// src/components/dashboard/WeeklyStatsCard/index.jsx

import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const WeeklyStatsCard = ({ stats }) => {
  const { thematicColors } = useApp();

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
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
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Turnos completados</p>
          <p className="text-xl font-bold">{stats.turnosEstaSemana}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Ganancias</p>
          <p 
            className="text-xl font-bold" 
            style={{ color: thematicColors?.base }}
          >
            ${stats.gananciasEstaSemana.toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default WeeklyStatsCard;