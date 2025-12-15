// src/components/dashboard/QuickStatsGrid/index.jsx 

import React from 'react';
import { Briefcase, Calendar, Clock, Target } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const QuickStatCard = ({ icon: Icon, label, value, subtitle }) => {
  const { thematicColors } = useApp();
  
  return (
    <Card className="p-4 text-center h-full">
      <div className="flex flex-col h-full">
        <div className="my-auto">
          <div className="flex flex-col items-center">
            <Icon size={20} className="mb-2" style={{ color: thematicColors?.base }} />
            <span className="text-sm text-gray-600 font-medium mb-1">{label}</span>
            <p className="text-2xl font-bold text-gray-800 mb-1">{value}</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

const QuickStatsGrid = ({ stats, className }) => {
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
    <>
      {/* DESKTOP: Grid normal 4 columnas CON GAP */}
      <div className={`hidden lg:grid lg:grid-cols-4 gap-6 ${className}`}>
        {statsData.map((stat, index) => (
          <QuickStatCard key={index} {...stat} />
        ))}
      </div>

      {/* MÓVIL: Flexbox 2x2 que funciona */}
      <div className="block lg:hidden">
        <div className="flex flex-wrap gap-3">
          {statsData.map((stat, index) => (
            <div key={index} className="w-[calc(50%-0.375rem)]">
              <QuickStatCard {...stat} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default QuickStatsGrid;