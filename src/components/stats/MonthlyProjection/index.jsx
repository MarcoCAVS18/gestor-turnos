// src/components/stats/MonthlyProjection/index.jsx

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';

const MonthlyProjection = ({ totalGanado = 0, horasTrabajadas = 0 }) => {
  const colors = useThemeColors();

  // Verificar que los datos sean válidos
  const totalSeguro = typeof totalGanado === 'number' && !isNaN(totalGanado) ? totalGanado : 0;
  const horasSeguras = typeof horasTrabajadas === 'number' && !isNaN(horasTrabajadas) ? horasTrabajadas : 0;

  const gananciaProyectada = totalSeguro * 4.33;
  const horasProyectadas = horasSeguras * 4.33;

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center mb-3">
        <TrendingUp size={18} style={{ color: colors.primary }} className="mr-2" />
        <h3 className="font-semibold">Proyección mensual</h3>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Si mantienes este ritmo durante todo el mes
        </p>
        <p 
          className="text-3xl font-bold" 
          style={{ color: colors.primary }}
        >
          {formatCurrency(gananciaProyectada)}
        </p>
        <p className="text-sm text-gray-500">
          ~{horasProyectadas.toFixed(0)} horas
        </p>
      </div>
    </div>
  );
};

export default MonthlyProjection;