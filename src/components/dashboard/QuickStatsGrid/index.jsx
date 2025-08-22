// src/components/dashboard/QuickStatsGrid/index.jsx - Versión corregida

import React from 'react';
import ***REMOVED*** Briefcase, Calendar, Clock, Target ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const QuickStatCard = (***REMOVED*** icon: Icon, label, value, subtitle ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  
  return (
    <Card className="p-4 text-center">
      <div className="flex flex-col items-center">
        <Icon size=***REMOVED***20***REMOVED*** className="mb-2" style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** />
        <span className="text-sm text-gray-600 font-medium mb-1">***REMOVED***label***REMOVED***</span>
        <p className="text-2xl font-bold text-gray-800 mb-1">***REMOVED***value***REMOVED***</p>
        <p className="text-xs text-gray-500">***REMOVED***subtitle***REMOVED***</p>
      </div>
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
    <>
      ***REMOVED***/* DESKTOP: Grid normal 4 columnas CON GAP */***REMOVED***
      <div className="hidden lg:grid lg:grid-cols-4 gap-6">
        ***REMOVED***statsData.map((stat, index) => (
          <QuickStatCard key=***REMOVED***index***REMOVED*** ***REMOVED***...stat***REMOVED*** />
        ))***REMOVED***
      </div>

      ***REMOVED***/* MÓVIL: Flexbox 2x2 que funciona */***REMOVED***
      <div className="block lg:hidden">
        <div className="flex flex-wrap gap-3">
          ***REMOVED***statsData.map((stat, index) => (
            <div key=***REMOVED***index***REMOVED*** className="w-[calc(50%-0.375rem)]">
              <QuickStatCard ***REMOVED***...stat***REMOVED*** />
            </div>
          ))***REMOVED***
        </div>
      </div>
    </>
  );
***REMOVED***;

export default QuickStatsGrid;