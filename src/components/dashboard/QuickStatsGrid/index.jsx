// src/components/dashboard/QuickStatsGrid/index.jsx

import React from 'react';
import { Briefcase, Calendar, Clock, Target } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const QuickStatCard = ({ icon: Icon, label, value, subtitle }) => {
  const { coloresTemáticos } = useApp();
  
  return (
    <Card>
      <div className="flex items-center mb-2">
        <Icon size={18} style={{ color: coloresTemáticos?.base }} className="mr-2" />
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </Card>
  );
};

const QuickStatsGrid = ({ stats }) => {
  const { trabajos } = useApp();
  
  const statsData = [
    {
      icon: Briefcase,
      label: 'Trabajos',
      value: trabajos.length,
      subtitle: 'activos'
    },
    {
      icon: Calendar,
      label: 'Turnos',
      value: stats.turnosTotal,
      subtitle: 'completados'
    },
    {
      icon: Clock,
      label: 'Horas',
      value: stats.horasTrabajadas.toFixed(0),
      subtitle: 'trabajadas'
    },
    {
      icon: Target,
      label: 'Promedio',
      value: `$${stats.promedioPorHora.toFixed(0)}`,
      subtitle: 'por hora'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {statsData.map((stat, index) => (
        <QuickStatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default QuickStatsGrid;