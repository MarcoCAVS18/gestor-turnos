// src/components/stats/DailyDistribution/index.jsx
import React from 'react';
import ***REMOVED*** Calendar, Clock, DollarSign ***REMOVED*** from 'lucide-react';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import ***REMOVED*** formatHoursDecimal ***REMOVED*** from '../../../utils/time';
import BaseStatsCard from '../../cards/base/BaseStatsCard';

const DailyDistribution = (***REMOVED*** datosActuales, loading, thematicColors ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** gananciaPorDia, totalGanado ***REMOVED*** = datosActuales;

  const isEmpty = !totalGanado || totalGanado === 0;

  return (
    <BaseStatsCard
      icon=***REMOVED***Calendar***REMOVED***
      title="Distribución Semanal"
      loading=***REMOVED***loading***REMOVED***
      empty=***REMOVED***isEmpty***REMOVED***
      emptyMessage="No hay datos de ganancias esta semana."
    >
      <div className="w-full">
        ***REMOVED***/* Wrapper para habilitar scroll horizontal en móvil */***REMOVED***
        <div className="lg:overflow-x-hidden overflow-x-auto">
          <div className="space-y-2 lg:w-full min-w-[30rem]">
            ***REMOVED***Object.entries(gananciaPorDia).map(([dia, datos]) => (
              <div key=***REMOVED***dia***REMOVED*** className="p-2 bg-gray-50 rounded-lg">
                ***REMOVED***/* Usar grid para un mejor control de las columnas */***REMOVED***
                <div className="grid grid-cols-4 gap-x-2 items-center">
                  <span className="text-sm font-medium text-gray-700 col-span-1 truncate">***REMOVED***dia***REMOVED***</span>
                  
                  <div className="flex items-center justify-end col-span-1">
                    <DollarSign size=***REMOVED***14***REMOVED*** className="mr-1 flex-shrink-0" style=***REMOVED******REMOVED*** color: thematicColors?.primary ***REMOVED******REMOVED*** />
                    <span className="text-sm font-bold text-right" style=***REMOVED******REMOVED*** color: thematicColors?.primary ***REMOVED******REMOVED***>
                      ***REMOVED***formatCurrency(datos.ganancia)***REMOVED***
                    </span>
                  </div>

                  <div className="flex items-center justify-end col-span-1">
                    <Clock size=***REMOVED***14***REMOVED*** className="mr-1 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 text-right whitespace-nowrap">
                      ***REMOVED***formatHoursDecimal(datos.horas)***REMOVED***
                    </span>
                  </div>

                  <div className="text-sm text-gray-500 text-right col-span-1 whitespace-nowrap">
                    ***REMOVED***datos.turnos***REMOVED*** turno***REMOVED***datos.turnos !== 1 ? 's' : ''***REMOVED***
                  </div>
                </div>
              </div>
            ))***REMOVED***
          </div>
        </div>
      </div>
    </BaseStatsCard>
  );
***REMOVED***;

export default DailyDistribution;