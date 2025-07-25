// src/components/dashboard/QuickStatsGrid/index.jsx - Versión mejorada

import { Briefcase, Calendar, Clock, Target } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const QuickStatCard = ({ icon: Icon, label, value, subtitle }) => {
  const { thematicColors } = useApp();
  
  return (
    <Card className="h-full aspect-square lg:aspect-auto flex flex-col justify-center text-center p-6">
      {/* Icono y label */}
      <div className="flex items-center justify-center mb-4">
        <Icon size={24} style={{ color: thematicColors?.base }} className="mr-2" />
        <span className="text-sm text-gray-600 font-medium">{label}</span>
      </div>
      
      {/* Valor principal */}
      <p className="text-3xl font-bold text-gray-800 mb-2">{value}</p>
      
      {/* Subtítulo */}
      <p className="text-xs text-gray-500">{subtitle}</p>
    </Card>
  );
};

const QuickStatsGrid = ({ stats }) => {
  const { trabajos, trabajosDelivery } = useApp();
  
  const totalTrabajos = trabajos.length + trabajosDelivery.length;
  
  const statsData = [
    {
      icon: Briefcase,
      label: 'Trabajos',
      value: totalTrabajos,
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {statsData.map((stat, index) => (
        <QuickStatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default QuickStatsGrid;