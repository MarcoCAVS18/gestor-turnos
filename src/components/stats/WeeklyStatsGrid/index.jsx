// src/components/stats/WeeklyStatsGrid/index.jsx

import React from 'react';
import { DollarSign, Clock, Target, Activity } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';

const WeeklyStatsGrid = ({ datos = {} }) => {
  const { thematicColors } = useApp();

  const datosSeguro = {
    totalGanado: (datos && typeof datos.totalGanado === 'number' && !isNaN(datos.totalGanado)) ? datos.totalGanado : 0,
    horasTrabajadas: (datos && typeof datos.horasTrabajadas === 'number') ? datos.horasTrabajadas : 0,
    diasTrabajados: (datos && typeof datos.diasTrabajados === 'number') ? datos.diasTrabajados : 0,
    totalTurnos: (datos && typeof datos.totalTurnos === 'number') ? datos.totalTurnos : 0
  };

  const stats = [
    {
      icon: DollarSign,
      label: 'Total ganado',
      value: `${datosSeguro.totalGanado.toFixed(2)}`,
      color: thematicColors?.base || '#EC4899'
    },
    {
      icon: Clock,
      label: 'Horas trabajadas',
      value: `${datosSeguro.horasTrabajadas.toFixed(1)}h`,
      color: thematicColors?.base || '#EC4899'
    },
    {
      icon: Target,
      label: 'Total turnos',
      value: datosSeguro.totalTurnos,
      color: thematicColors?.base || '#EC4899'
    },
    {
      icon: Activity,
      label: 'Días trabajados',
      value: `${datosSeguro.diasTrabajados}/7`,
      color: thematicColors?.base || '#EC4899'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Icon size={18} style={{ color: stat.color }} className="mr-1" />
              <span className="text-sm text-gray-600">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyStatsGrid;
