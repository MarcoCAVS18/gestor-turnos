import React, { useMemo } from 'react';
import { 
  Briefcase, Calendar, Clock, Target, 
  CalendarDays, CalendarRange,
  Timer, History,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import QuickStatCard from '../QuickStatCard';

const QuickStatsGrid = ({ stats, className }) => {
  const { thematicColors, trabajos, trabajosDelivery } = useApp();
  
  const totalTrabajos = (trabajos?.length || 0) + (trabajosDelivery?.length || 0);
  
  const detailedData = useMemo(() => {
    // 1. Datos para TRABAJOS
    const traditionalCount = trabajos?.length || 0;
    const deliveryCount = trabajosDelivery?.length || 0;
    const platformsSet = new Set(trabajosDelivery?.map(t => t.plataforma || t.nombre || "App").filter(Boolean));
    const platformsList = Array.from(platformsSet);

    // 2. Extraer datos pre-calculados del hook useDashboardStats
    const { semanaActual, mesActual } = stats;

    return {
      jobs: {
        traditional: traditionalCount,
        delivery: deliveryCount,
        platforms: platformsList
      },
      shifts: [
        { label: 'Esta Semana', value: semanaActual?.totalTurnos || 0, icon: CalendarDays, iconColor: '#3b82f6' },
        { label: 'Este Mes', value: mesActual?.totalTurnos || 0, icon: CalendarRange, iconColor: '#8b5cf6' }
      ],
      hours: [
        { label: 'Semana Actual', value: `${(semanaActual?.horasTrabajadas || 0).toFixed(1)}h`, icon: Timer, iconColor: '#10b981' },
        { label: 'Mes Actual', value: `${(mesActual?.horasTrabajadas || 0).toFixed(1)}h`, icon: History, iconColor: '#f59e0b' }
      ],
      average: [
        { label: 'Por Hora', value: `$${stats.promedioPorHora.toFixed(0)}`, icon: Clock, iconColor: '#6366f1' },
        { label: 'Gana. Sem.', value: `$${(semanaActual?.totalGanado || 0).toLocaleString()}`, icon: TrendingUp, iconColor: '#ec4899' }
      ]
    };
  }, [stats, trabajos, trabajosDelivery]);

  const cardsData = [
    {
      id: 'jobs',
      type: 'jobs',
      icon: Briefcase,
      label: 'Trabajos',
      value: totalTrabajos,
      subtitle: 'activos',
      details: detailedData.jobs
    },
    {
      id: 'shifts',
      type: 'general',
      icon: Calendar,
      label: 'Turnos',
      value: stats.turnosTotal,
      subtitle: 'completados',
      details: detailedData.shifts
    },
    {
      id: 'hours',
      type: 'general',
      icon: Clock,
      label: 'Horas',
      value: stats.horasTrabajadas.toFixed(0),
      subtitle: 'trabajadas',
      details: detailedData.hours
    },
    {
      id: 'avg',
      type: 'general',
      icon: Target,
      label: 'Promedio',
      value: `$${stats.promedioPorHora.toFixed(0)}`,
      subtitle: 'por hora',
      details: detailedData.average
    }
  ];

  return (
    // Se usa un solo GRID para todo. 
    // - Móvil: grid-cols-2 (dos columnas) con gap-3
    // - Desktop: grid-cols-4 con gap-6
    // CSS Grid asegura automáticamente que todas las celdas en una fila tengan la misma altura.
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 ${className}`}>
      {cardsData.map((stat) => (
        <QuickStatCard 
          key={stat.id} 
          {...stat} 
          color={thematicColors?.base} 
        />
      ))}
    </div>
  );
};

export default QuickStatsGrid;