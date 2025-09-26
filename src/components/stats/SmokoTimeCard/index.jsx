// src/components/stats/SmokoTimeCard/index.jsx

import React from 'react';
import { Clock } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';

const SmokoTimeCard = () => {
  const { smokoMinutes, smokoEnabled } = useApp();
  const colors = useThemeColors();

  // Formatear tiempo para mostrar
  const formatearTiempo = (minutos) => {
    if (!minutos || minutos === 0) return '0 MIN';
    
    if (minutos < 60) {
      return `${minutos} MIN`;
    }
    
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    
    if (minutosRestantes === 0) {
      return `${horas}H`;
    }
    
    return `${horas}H ${minutosRestantes}M`;
  };

  return (
    <Card className="h-full flex flex-col justify-center">
      {/* Header con ícono y título al estilo de otros componentes de stats */}
      <div className="flex items-center mb-4">
        <Clock size={18} style={{ color: colors.primary }} className="mr-2" />
        <h3 className="font-semibold">Tiempo de Descanso</h3>
      </div>

      {/* Tiempo principal centrado */}
      <div className="text-center flex-1 flex items-center justify-center">
        <p 
          className={`text-4xl font-bold ${
            smokoEnabled ? '' : 'text-gray-600'
          }`}
          style={smokoEnabled ? { color: colors.primary } : {}}
        >
          {formatearTiempo(smokoMinutes || 0)}
        </p>
      </div>
    </Card>
  );
};

export default SmokoTimeCard;