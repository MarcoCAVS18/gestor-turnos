// src/components/stats/StatsProgressBar/index.jsx
import React from 'react';
import { Clock, DollarSign, Target } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const StatsProgressBar = ({ className = '', datosActuales, weeklyHoursGoal }) => {
  const { horasTrabajadas, totalGanado } = datosActuales;
  const colors = useThemeColors();
  
  const metaHoras = weeklyHoursGoal || 40;
  const porcentaje = metaHoras > 0 ? (horasTrabajadas / metaHoras) * 100 : 0;
  const porcentajeLimitado = Math.min(Math.max(porcentaje, 0), 100);
  
  const getColorProgreso = () => {
    if (porcentaje >= 100) return '#10B981';
    if (porcentaje >= 75) return colors.primary; 
    if (porcentaje >= 50) return '#F59E0B'; 
    return '#EF4444';
  };

  return (
    <Card className={`${className} ${!weeklyHoursGoal ? 'opacity-60' : ''} flex flex-col`}>
      <div className="flex-1 flex flex-col justify-between">
        {/* Header */}
        <Flex variant="between">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <Target size={18} className="mr-2" style={{ color: colors.primary }} />
            Progreso Semanal
          </h3>
          <span className="text-sm text-gray-500">
            Meta: {metaHoras}h
          </span>
        </Flex>

        {/* Barra de progreso */}
        <div className="space-y-2">
          <Flex variant="between" className="text-sm">
            <span className="font-medium">{horasTrabajadas.toFixed(1)} horas trabajadas</span>
            <span className="text-gray-500">{porcentajeLimitado.toFixed(1)}%</span>
          </Flex>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${porcentajeLimitado}%`,
                backgroundColor: getColorProgreso()
              }}
            />
          </div>
        </div>

        {/* Stats adicionales */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <Flex>
            <Clock size={16} className="text-blue-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Horas restantes</p>
              <p className="font-medium">
                {Math.max(0, metaHoras - horasTrabajadas).toFixed(1)}h
              </p>
            </div>
          </Flex>
          
          <Flex>
            <DollarSign size={16} className="text-green-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Ganancia total</p>
              <p className="font-medium">{formatCurrency(totalGanado)}</p>
            </div>
          </Flex>
        </div>

        {porcentaje >= 100 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium">
              ¡Meta cumplida! Has superado las {metaHoras} horas esta semana.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsProgressBar;