import React from 'react';
import ***REMOVED*** Calendar, Clock, DollarSign ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import BaseStatsCard from '../../cards/base/BaseStatsCard';
import ***REMOVED*** calculateShiftHours, calculateShiftEarnings ***REMOVED*** from '../../../utils/statsCalculations';
import Flex from '../../ui/Flex';

const DailyBreakdownCard = (***REMOVED*** turnosPorDia = ***REMOVED******REMOVED***, trabajos = [] ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  // Validar datos
  const datos = turnosPorDia && typeof turnosPorDia === 'object' ? turnosPorDia : ***REMOVED******REMOVED***;
  const trabajosValidos = Array.isArray(trabajos) ? trabajos : [];

  const isEmpty = Object.keys(datos).length === 0;

  // Formatear fecha
  const formatearFecha = (fecha) => ***REMOVED***
    try ***REMOVED***
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', ***REMOVED***
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      ***REMOVED***);
    ***REMOVED*** catch (error) ***REMOVED***
      return fecha;
    ***REMOVED***
  ***REMOVED***;

  return (
    <BaseStatsCard
      title="Desglose Diario"
      icon=***REMOVED***Calendar***REMOVED***
      empty=***REMOVED***isEmpty***REMOVED***
      emptyMessage="No hay turnos registrados esta semana"
      emptyDescription="Los turnos aparecerán aquí una vez que agregues algunos"
    >
      <div className="space-y-3">
        ***REMOVED***Object.entries(datos).map(([fecha, turnos]) => ***REMOVED***
          const horasTotal = turnos.reduce((total, turno) => total + calculateShiftHours(turno), 0);
          const gananciaTotal = turnos.reduce((total, turno) => total + calculateShiftEarnings(turno, trabajosValidos), 0);

          return (
            <Flex variant="between" key=***REMOVED***fecha***REMOVED*** className="p-3 bg-gray-50 rounded-lg">
              <Flex>
                <Flex variant="center"
                  className="w-10 h-10 rounded-full mr-3"
                  style=***REMOVED******REMOVED*** backgroundColor: colors.transparent10 ***REMOVED******REMOVED***
                >
                  <Calendar size=***REMOVED***16***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** />
                </Flex>
                <div>
                  <p className="font-medium text-gray-800">
                    ***REMOVED***formatearFecha(fecha)***REMOVED***
                  </p>
                  <p className="text-sm text-gray-500">
                    ***REMOVED***turnos.length***REMOVED*** turno***REMOVED***turnos.length !== 1 ? 's' : ''***REMOVED***
                  </p>
                </div>
              </Flex>

              <Flex className="space-x-4 text-sm">
                <Flex className="text-purple-600">
                  <Clock size=***REMOVED***14***REMOVED*** className="mr-1" />
                  <span>***REMOVED***horasTotal.toFixed(1)***REMOVED***h</span>
                </Flex>
                <Flex className="text-green-600">
                  <DollarSign size=***REMOVED***14***REMOVED*** className="mr-1" />
                  <span>***REMOVED***formatCurrency(gananciaTotal)***REMOVED***</span>
                </Flex>
              </Flex>
            </Flex>
          );
        ***REMOVED***)***REMOVED***
      </div>
    </BaseStatsCard>
  );
***REMOVED***;

export default DailyBreakdownCard;