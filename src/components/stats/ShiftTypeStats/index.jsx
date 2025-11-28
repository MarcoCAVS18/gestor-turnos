// src/components/stats/ShiftTypeStats/index.jsx
import React from 'react';
import ***REMOVED*** Zap ***REMOVED*** from 'lucide-react';
import ***REMOVED*** TURN_TYPE_COLORS ***REMOVED*** from '../../../constants/colors';
import ***REMOVED*** formatTurnosCount, pluralizeTiposDeTurno, calculateTotalTurnos ***REMOVED*** from '../../../utils/pluralization';
import BaseStatsCard from '../../cards/base/BaseStatsCard';

const ShiftTypeStats = (***REMOVED*** datosActuales, loading, className = '' ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** tiposDeTurno ***REMOVED*** = datosActuales;

  const tiposValidos = tiposDeTurno && typeof tiposDeTurno === 'object' && !Array.isArray(tiposDeTurno) ? tiposDeTurno : ***REMOVED******REMOVED***;
  const totalTurnos = calculateTotalTurnos(tiposValidos);
  const tituloPlural = pluralizeTiposDeTurno(totalTurnos);
  const isEmpty = Object.keys(tiposValidos).length === 0;

  const getColorForType = (tipo) => ***REMOVED***
    const colorMap = ***REMOVED***
      'diurno': TURN_TYPE_COLORS.Diurno,
      'tarde': TURN_TYPE_COLORS.Tarde,
      'noche': TURN_TYPE_COLORS.Nocturno,
      'nocturno': TURN_TYPE_COLORS.Nocturno,
      'sabado': TURN_TYPE_COLORS.Sábado,
      'domingo': TURN_TYPE_COLORS.Domingo,
      'mixto': '#6B7280'
    ***REMOVED***;
    return colorMap[tipo.toLowerCase()] || '#6B7280';
  ***REMOVED***;

  return (
    <BaseStatsCard
      icon=***REMOVED***Zap***REMOVED***
      title=***REMOVED***tituloPlural***REMOVED***
      loading=***REMOVED***loading***REMOVED***
      empty=***REMOVED***isEmpty***REMOVED***
      emptyText="Agrega turnos para ver esta estadística."
      className=***REMOVED***className***REMOVED***
    >
      <div className="w-full h-full overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 min-h-full items-start">
          ***REMOVED***Object.entries(tiposValidos).map(([tipo, datos]) => ***REMOVED***
            const datosSeguro = ***REMOVED***
              turnos: (datos && typeof datos.turnos === 'number') ? datos.turnos : 0,
              horas: (datos && typeof datos.horas === 'number') ? datos.horas : 0,
              ganancia: (datos && typeof datos.ganancia === 'number') ? datos.ganancia : 0
            ***REMOVED***;

            const tipoMostrado = tipo === 'undefined' ? 'MIXTO' : tipo.toUpperCase();
            const colorTipo = getColorForType(tipo);

            return (
              <div key=***REMOVED***tipo***REMOVED*** className="text-center p-2 bg-gray-50 rounded-lg">
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style=***REMOVED******REMOVED*** backgroundColor: colorTipo ***REMOVED******REMOVED***
                />
                <p className="text-xs text-gray-600 capitalize">***REMOVED***tipoMostrado***REMOVED***</p>
                <p className="font-semibold text-sm">***REMOVED***formatTurnosCount(datosSeguro.turnos)***REMOVED***</p>
                <p className="text-xs text-gray-500">***REMOVED***datosSeguro.horas.toFixed(1)***REMOVED***h</p>
              </div>
            );
          ***REMOVED***)***REMOVED***
        </div>
      </div>
    </BaseStatsCard>
  );
***REMOVED***;

export default ShiftTypeStats;