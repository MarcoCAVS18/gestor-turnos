// src/components/dashboard/ProjectionCard/index.jsx

import ***REMOVED*** BarChart3 ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const ProjectionCard = (***REMOVED*** proyeccionMensual, horasTrabajadas ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const ***REMOVED*** calculateMonthlyStats ***REMOVED*** = useApp();

  if (proyeccionMensual <= 0) return null;

  // Obtener datos del mes anterior usando la nueva función centralizada
  const now = new Date();
  const previousMonthStats = calculateMonthlyStats(now.getFullYear(), now.getMonth() - 1);

  // Calcular diferencias
  const obtenerTextoComparacion = () => ***REMOVED***
    if (previousMonthStats.shiftsCount === 0) ***REMOVED***
      return 'Tu primer mes registrado';
    ***REMOVED***

    const diferencia = proyeccionMensual - previousMonthStats.totalEarnings;
    const porcentaje = ((diferencia / previousMonthStats.totalEarnings) * 100).toFixed(1);

    if (diferencia > 0) ***REMOVED***
      return `$***REMOVED***formatCurrency(Math.abs(diferencia))***REMOVED*** más que el mes anterior (+$***REMOVED***porcentaje***REMOVED***%)`;
    ***REMOVED*** else if (diferencia < 0) ***REMOVED***
      return `$***REMOVED***formatCurrency(Math.abs(diferencia))***REMOVED*** menos que el mes anterior (-$***REMOVED***Math.abs(porcentaje)***REMOVED***%)`;
    ***REMOVED*** else ***REMOVED***
      return 'Igual que el mes anterior';
    ***REMOVED***
  ***REMOVED***;

  return (
    <Card className="h-full">
      ***REMOVED***/* Header */***REMOVED***
      <div className="flex items-center mb-4">
        <BarChart3 size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
        <h3 className="text-lg font-semibold">Proyección mensual</h3>
      </div>
      
      ***REMOVED***/* Content - Layout horizontal */***REMOVED***
      <div className="flex items-center justify-between">
        ***REMOVED***/* Texto izquierdo */***REMOVED***
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">
            Si mantienes este ritmo durante todo el mes
          </p>
          <p className="text-xs text-gray-500">
            ***REMOVED***obtenerTextoComparacion()***REMOVED***
          </p>
        </div>
        
        ***REMOVED***/* Datos derecha */***REMOVED***
        <div className="text-right ml-4">
          <p 
            className="text-3xl font-bold mb-1" 
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