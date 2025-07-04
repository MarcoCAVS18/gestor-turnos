// src/components/dashboard/ProjectionCard/index.jsx

import ***REMOVED*** BarChart3 ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const ProjectionCard = (***REMOVED*** proyeccionMensual, horasTrabajadas ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();

  if (proyeccionMensual <= 0) return null;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <BarChart3 size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** className="mr-2" />
        Proyección mensual
      </h3>
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Si mantienes este ritmo durante todo el mes
        </p>
        <p 
          className="text-3xl font-bold" 
          style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED***
        >
          $***REMOVED***proyeccionMensual.toFixed(2)***REMOVED***
        </p>
        <p className="text-sm text-gray-500">
          ~***REMOVED***(horasTrabajadas * 4.33).toFixed(0)***REMOVED*** horas
        </p>
      </div>
    </Card>
  );
***REMOVED***;

export default ProjectionCard;