// src/components/stats/MostProductiveDay/index.jsx
import React from 'react';
import ***REMOVED*** Award ***REMOVED*** from 'lucide-react';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import ***REMOVED*** formatHoursDecimal ***REMOVED*** from '../../../utils/time';
import BaseStatsCard from '../../cards/base/BaseStatsCard';

const MostProductiveDay = (***REMOVED*** datosActuales, loading, thematicColors, className = '' ***REMOVED***) => ***REMOVED***
  const diaMasProductivo = datosActuales?.diaMasProductivo;
  
  const isEmpty = !diaMasProductivo || diaMasProductivo.dia === 'Ninguno' || !diaMasProductivo.ganancia || diaMasProductivo.ganancia <= 0;

  return (
    <BaseStatsCard
      icon=***REMOVED***Award***REMOVED*** // Pass the component directly
      title="Día más productivo"
      loading=***REMOVED***loading***REMOVED***
      empty=***REMOVED***isEmpty***REMOVED***
      emptyMessage="Sin datos suficientes esta semana."
      className=***REMOVED***className***REMOVED***
    >
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-lg" style=***REMOVED******REMOVED*** color: thematicColors?.primary ***REMOVED******REMOVED***>
              ***REMOVED***diaMasProductivo.dia***REMOVED***
            </p>
            <p className="text-xs text-gray-600">
              ***REMOVED***diaMasProductivo.turnos || 0***REMOVED*** turnos • ***REMOVED***formatHoursDecimal(diaMasProductivo.horas || 0)***REMOVED***
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">
              ***REMOVED***formatCurrency(diaMasProductivo.ganancia)***REMOVED***
            </p>
          </div>
        </div>
      </div>
    </BaseStatsCard>
  );
***REMOVED***;

export default MostProductiveDay;