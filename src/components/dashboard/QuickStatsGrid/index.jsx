// src/components/dashboard/QuickStatsGrid/index.jsx - Versión mejorada

import ***REMOVED*** Briefcase, Calendar, Clock, Target ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const QuickStatCard = (***REMOVED*** icon: Icon, label, value, subtitle ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  
  return (
    <Card className="h-full aspect-square lg:aspect-auto flex flex-col justify-center text-center p-6">
      ***REMOVED***/* Icono y label */***REMOVED***
      <div className="flex items-center justify-center mb-4">
        <Icon size=***REMOVED***24***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** className="mr-2" />
        <span className="text-sm text-gray-600 font-medium">***REMOVED***label***REMOVED***</span>
      </div>
      
      ***REMOVED***/* Valor principal */***REMOVED***
      <p className="text-3xl font-bold text-gray-800 mb-2">***REMOVED***value***REMOVED***</p>
      
      ***REMOVED***/* Subtítulo */***REMOVED***
      <p className="text-xs text-gray-500">***REMOVED***subtitle***REMOVED***</p>
    </Card>
  );
***REMOVED***;

const QuickStatsGrid = (***REMOVED*** stats ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** trabajos, trabajosDelivery ***REMOVED*** = useApp();
  
  const totalTrabajos = trabajos.length + trabajosDelivery.length;
  
  const statsData = [
    ***REMOVED***
      icon: Briefcase,
      label: 'Trabajos',
      value: totalTrabajos,
      subtitle: 'activos'
    ***REMOVED***,
    ***REMOVED***
      icon: Calendar,
      label: 'Turnos',
      value: stats.turnosTotal,
      subtitle: 'completados'
    ***REMOVED***,
    ***REMOVED***
      icon: Clock,
      label: 'Horas',
      value: stats.horasTrabajadas.toFixed(0),
      subtitle: 'trabajadas'
    ***REMOVED***,
    ***REMOVED***
      icon: Target,
      label: 'Promedio',
      value: `$$***REMOVED***stats.promedioPorHora.toFixed(0)***REMOVED***`,
      subtitle: 'por hora'
    ***REMOVED***
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      ***REMOVED***statsData.map((stat, index) => (
        <QuickStatCard key=***REMOVED***index***REMOVED*** ***REMOVED***...stat***REMOVED*** />
      ))***REMOVED***
    </div>
  );
***REMOVED***;

export default QuickStatsGrid;