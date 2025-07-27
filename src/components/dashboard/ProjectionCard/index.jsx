// src/components/dashboard/ProjectionCard/index.jsx

import ***REMOVED*** BarChart3 ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';

const ProjectionCard = (***REMOVED*** proyeccionMensual, horasTrabajadas ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  if (proyeccionMensual <= 0) return null;

  return (
    <Card className="h-full flex flex-col">
      ***REMOVED***/* Header */***REMOVED***
      <h3 className="text-lg font-semibold mb-6 flex items-center">
        <BarChart3 size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
        Proyección mensual
      </h3>
      
      ***REMOVED***/* Content - Layout vertical centrado */***REMOVED***
      <div className="flex-1 flex flex-col justify-center text-center space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Si mantienes este ritmo durante todo el mes
          </p>
          <p 
            className="text-4xl font-bold mb-2" 
            style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
          >
            ***REMOVED***formatCurrency(proyeccionMensual)***REMOVED***
          </p>
          <p className="text-sm text-gray-500">
            ~***REMOVED***(horasTrabajadas * 4.33).toFixed(0)***REMOVED*** horas
          </p>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default ProjectionCard;