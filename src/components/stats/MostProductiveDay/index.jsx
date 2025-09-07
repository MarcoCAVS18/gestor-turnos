// src/components/stats/MostProductiveDay/index.jsx

import React from 'react';
import { Award } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';

const MostProductiveDay = ({ diaMasProductivo }) => {
  const colors = useThemeColors();

  // Función para formatear horas
  const formatearHoras = (horas) => {
    if (horas === 0) return '0h';
    if (horas < 1) {
      const minutos = Math.round(horas * 60);
      return `${minutos}min`;
    }
    const horasEnteras = Math.floor(horas);
    const minutos = Math.round((horas - horasEnteras) * 60);
    
    if (minutos === 0) {
      return `${horasEnteras}h`;
    }
    return `${horasEnteras}h ${minutos}min`;
  };

  // Si no hay datos válidos, no mostrar el componente
  if (!diaMasProductivo || diaMasProductivo.dia === 'Ninguno' || !diaMasProductivo.ganancia || diaMasProductivo.ganancia <= 0) {
    return (
      <div className="text-center py-4">
        <Award size={24} className="mx-auto mb-2 text-gray-300" />
        <p className="text-sm text-gray-500">Sin datos suficientes</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-3">
        <Award size={18} style={{ color: colors.primary }} className="mr-2" />
        <h4 className="font-medium text-sm">Día más productivo</h4>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-lg">{diaMasProductivo.dia}</p>
          <p className="text-xs text-gray-600">
            {diaMasProductivo.turnos || 0} turnos • {formatearHoras(diaMasProductivo.horas || 0)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(diaMasProductivo.ganancia)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MostProductiveDay;