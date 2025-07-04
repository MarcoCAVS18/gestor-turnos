// src/components/dashboard/QuickStatsGrid/index.jsx

import ***REMOVED*** Briefcase, Calendar, Clock, Target ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const QuickStatCard = (***REMOVED*** icon: Icon, label, value, subtitle ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  
  return (
    <Card>
      <div className="flex items-center mb-2">
        <Icon size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** className="mr-2" />
        <span className="text-sm text-gray-600">***REMOVED***label***REMOVED***</span>
      </div>
      <p className="text-2xl font-bold text-gray-800">***REMOVED***value***REMOVED***</p>
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
    <div className="grid grid-cols-2 gap-4">
      ***REMOVED***statsData.map((stat, index) => (
        <QuickStatCard key=***REMOVED***index***REMOVED*** ***REMOVED***...stat***REMOVED*** />
      ))***REMOVED***
    </div>
  );
***REMOVED***;

export default QuickStatsGrid;