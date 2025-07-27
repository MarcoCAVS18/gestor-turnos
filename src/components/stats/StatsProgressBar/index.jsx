// src/components/stats/StatsProgressBar/index.jsx

import React from 'react';
import { Clock, DollarSign, Target } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';

const StatsProgressBar = ({ 
  horasSemanales = 0,
  metaHoras = 40,
  gananciaTotal = 0,
  className = '' 
}) => {
  const colors = useThemeColors();
  
  // Calcular porcentaje de progreso
  const porcentaje = metaHoras > 0 ? (horasSemanales / metaHoras) * 100 : 0;
  const porcentajeLimitado = Math.min(Math.max(porcentaje, 0), 100);
  
  const getColorProgreso = () => {
    if (porcentaje >= 100) return '#10B981';
    if (porcentaje >= 75) return colors.primary; 
    if (porcentaje >= 50) return '#F59E0B'; 
    return '#EF4444';
  };

  return (
    <Card className={className}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <Target size={18} className="mr-2" style={{ color: colors.primary }} />
            Progreso Semanal
          </h3>
          <span className="text-sm text-gray-500">
            Meta: {metaHoras}h
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{horasSemanales.toFixed(1)} horas trabajadas</span>
            <span className="text-gray-500">{porcentajeLimitado.toFixed(1)}%</span>
          </div>
          
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
          <div className="flex items-center">
            <Clock size={16} className="text-blue-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Horas restantes</p>
              <p className="font-medium">
                {Math.max(0, metaHoras - horasSemanales).toFixed(1)}h
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <DollarSign size={16} className="text-green-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Ganancia total</p>
              <p className="font-medium">{formatCurrency(gananciaTotal)}</p>
            </div>
          </div>
        </div>

        {porcentaje >= 100 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium">
              🎉 ¡Meta cumplida! Has superado las {metaHoras} horas esta semana.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsProgressBar;