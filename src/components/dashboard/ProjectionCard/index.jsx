// src/components/dashboard/ProjectionCard/index.jsx

import ***REMOVED*** BarChart3, PlusCircle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';
import ***REMOVED*** Link ***REMOVED*** from 'react-router-dom';

const ProjectionCard = (***REMOVED*** proyeccionMensual, horasTrabajadas, className ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const ***REMOVED*** calculateMonthlyStats ***REMOVED*** = useApp();

  const renderContent = () => ***REMOVED***
    if (proyeccionMensual <= 0) ***REMOVED***
      return (
        <Link to="/turnos" className="block hover:bg-gray-50 rounded-lg p-4 transition-colors">
          <Flex variant="center" className="text-center flex-col">
            <PlusCircle size=***REMOVED***32***REMOVED*** className="mb-2" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** />
            <p className="font-semibold text-gray-700">Comienza a ver tu proyección mensual</p>
            <p className="text-sm text-gray-500">Agrega nuevos turnos este mes para calcularla.</p>
          </Flex>
        </Link>
      );
    ***REMOVED***

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
      <Flex variant="between" className="w-full">
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
      </Flex>
    );
  ***REMOVED***;

  return (
    <Card className=***REMOVED***`$***REMOVED***className***REMOVED*** flex flex-col`***REMOVED***>
      ***REMOVED***/* Header */***REMOVED***
      <div className="flex items-center mb-4">
        <BarChart3 size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
        <h3 className="text-lg font-semibold">Proyección mensual</h3>
      </div>
      
      ***REMOVED***/* Content */***REMOVED***
      <div className="flex-grow flex items-center">
        ***REMOVED***renderContent()***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default ProjectionCard;