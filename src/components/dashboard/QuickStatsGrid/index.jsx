import React, ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** 
  Briefcase, Calendar, Clock, Target, 
  CalendarDays, CalendarRange,
  Timer, History,
  TrendingUp
***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import QuickStatCard from '../QuickStatCard';

const QuickStatsGrid = (***REMOVED*** stats, className ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors, trabajos, trabajosDelivery ***REMOVED*** = useApp();
  
  const totalTrabajos = (trabajos?.length || 0) + (trabajosDelivery?.length || 0);
  
  const detailedData = useMemo(() => ***REMOVED***
    // 1. Datos para TRABAJOS
    const traditionalCount = trabajos?.length || 0;
    const deliveryCount = trabajosDelivery?.length || 0;
    const platformsSet = new Set(trabajosDelivery?.map(t => t.plataforma || t.nombre || "App").filter(Boolean));
    const platformsList = Array.from(platformsSet);

    // 2. Extraer datos pre-calculados del hook useDashboardStats
    const ***REMOVED*** semanaActual, mesActual ***REMOVED*** = stats;

    return ***REMOVED***
      jobs: ***REMOVED***
        traditional: traditionalCount,
        delivery: deliveryCount,
        platforms: platformsList
      ***REMOVED***,
      shifts: [
        ***REMOVED*** label: 'Esta Semana', value: semanaActual?.totalTurnos || 0, icon: CalendarDays, iconColor: '#3b82f6' ***REMOVED***,
        ***REMOVED*** label: 'Este Mes', value: mesActual?.totalTurnos || 0, icon: CalendarRange, iconColor: '#8b5cf6' ***REMOVED***
      ],
      hours: [
        ***REMOVED*** label: 'Semana Actual', value: `$***REMOVED***(semanaActual?.horasTrabajadas || 0).toFixed(1)***REMOVED***h`, icon: Timer, iconColor: '#10b981' ***REMOVED***,
        ***REMOVED*** label: 'Mes Actual', value: `$***REMOVED***(mesActual?.horasTrabajadas || 0).toFixed(1)***REMOVED***h`, icon: History, iconColor: '#f59e0b' ***REMOVED***
      ],
      average: [
        ***REMOVED*** label: 'Por Hora', value: `$$***REMOVED***stats.promedioPorHora.toFixed(0)***REMOVED***`, icon: Clock, iconColor: '#6366f1' ***REMOVED***,
        ***REMOVED*** label: 'Gana. Sem.', value: `$$***REMOVED***(semanaActual?.totalGanado || 0).toLocaleString()***REMOVED***`, icon: TrendingUp, iconColor: '#ec4899' ***REMOVED***
      ]
    ***REMOVED***;
  ***REMOVED***, [stats, trabajos, trabajosDelivery]);

  const cardsData = [
    ***REMOVED***
      id: 'jobs',
      type: 'jobs',
      icon: Briefcase,
      label: 'Trabajos',
      value: totalTrabajos,
      subtitle: 'activos',
      details: detailedData.jobs
    ***REMOVED***,
    ***REMOVED***
      id: 'shifts',
      type: 'general',
      icon: Calendar,
      label: 'Turnos',
      value: stats.turnosTotal,
      subtitle: 'completados',
      details: detailedData.shifts
    ***REMOVED***,
    ***REMOVED***
      id: 'hours',
      type: 'general',
      icon: Clock,
      label: 'Horas',
      value: stats.horasTrabajadas.toFixed(0),
      subtitle: 'trabajadas',
      details: detailedData.hours
    ***REMOVED***,
    ***REMOVED***
      id: 'avg',
      type: 'general',
      icon: Target,
      label: 'Promedio',
      value: `$$***REMOVED***stats.promedioPorHora.toFixed(0)***REMOVED***`,
      subtitle: 'por hora',
      details: detailedData.average
    ***REMOVED***
  ];

  return (
    // Se usa un solo GRID para todo. 
    // - Móvil: grid-cols-2 (dos columnas) con gap-3
    // - Desktop: grid-cols-4 con gap-6
    // CSS Grid asegura automáticamente que todas las celdas en una fila tengan la misma altura.
    <div className=***REMOVED***`grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 $***REMOVED***className***REMOVED***`***REMOVED***>
      ***REMOVED***cardsData.map((stat) => (
        <QuickStatCard 
          key=***REMOVED***stat.id***REMOVED*** 
          ***REMOVED***...stat***REMOVED*** 
          color=***REMOVED***thematicColors?.base***REMOVED*** 
        />
      ))***REMOVED***
    </div>
  );
***REMOVED***;

export default QuickStatsGrid;