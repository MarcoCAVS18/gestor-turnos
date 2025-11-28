// src/components/stats/WeeklyStatsGrid/index.jsx
import React from 'react';
import { DollarSign, Clock, Target, Activity } from 'lucide-react';
import Card from '../../ui/Card';
import LoadingSpinner from '../../ui/LoadingSpinner/LoadingSpinner';

const WeeklyStatsGrid = ({ datosActuales, thematicColors, loading, className = '' }) => {
  const datosSeguro = {
    totalGanado: (datosActuales && typeof datosActuales.totalGanado === 'number' && !isNaN(datosActuales.totalGanado)) ? datosActuales.totalGanado : 0,
    horasTrabajadas: (datosActuales && typeof datosActuales.horasTrabajadas === 'number') ? datosActuales.horasTrabajadas : 0,
    diasTrabajados: (datosActuales && typeof datosActuales.diasTrabajados === 'number') ? datosActuales.diasTrabajados : 0,
    totalTurnos: (datosActuales && typeof datosActuales.totalTurnos === 'number') ? datosActuales.totalTurnos : 0
  };

  const stats = [
    { icon: DollarSign, label: 'Total ganado', value: `${datosSeguro.totalGanado.toFixed(2)}` },
    { icon: Clock, label: 'Horas trabajadas', value: `${datosSeguro.horasTrabajadas.toFixed(1)}h` },
    { icon: Target, label: 'Total turnos', value: datosSeguro.totalTurnos },
    { icon: Activity, label: 'Días trabajados', value: `${datosSeguro.diasTrabajados}/7` }
  ];

  if (loading) {
    return (
      <Card className={`p-4 flex items-center justify-center h-48 ${className}`}>
        <LoadingSpinner />
      </Card>
    );
  }

  return (
    <Card variant="transparent" padding="none" className={`flex flex-col ${className}`}>
      <div className="grid grid-cols-2 gap-4 flex-1">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg flex flex-col justify-center">
              <div className="flex items-center justify-center mb-2">
                <Icon size={18} style={{ color: thematicColors?.base }} className="mr-1" />
                <span className="text-sm text-gray-600">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: thematicColors?.base }}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default WeeklyStatsGrid;