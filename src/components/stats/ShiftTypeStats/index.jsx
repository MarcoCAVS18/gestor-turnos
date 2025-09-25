// src/components/stats/ShiftTypeStats/index.jsx

import React from 'react';
import ***REMOVED*** Zap ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** TURN_TYPE_COLORS ***REMOVED*** from '../../../constants/colors';
import ***REMOVED*** formatTurnosCount, pluralizeTiposDeTurno, calculateTotalTurnos ***REMOVED*** from '../../../utils/pluralization';

const ShiftTypeStats = (***REMOVED*** tiposDeTurno = ***REMOVED******REMOVED*** ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  // Verificar que tiposDeTurno sea válido
  const tiposValidos = tiposDeTurno && typeof tiposDeTurno === 'object' && !Array.isArray(tiposDeTurno) ? tiposDeTurno : ***REMOVED******REMOVED***;

  // Calcular total de turnos para el título dinámico
  const totalTurnos = calculateTotalTurnos(tiposValidos);
  const tituloPlural = pluralizeTiposDeTurno(totalTurnos);

  // Mapeo de tipos a las constantes de colores
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
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center mb-4">
        <Zap size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
        <h3 className="font-semibold">***REMOVED***tituloPlural***REMOVED***</h3>
      </div>

      ***REMOVED***Object.keys(tiposValidos).length === 0 ? (
        // Estado vacío cuando no hay datos
        <div className="text-center py-8">
          <Zap size=***REMOVED***48***REMOVED*** className="mx-auto mb-3 opacity-30" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** />
          <h4 className="text-sm font-medium text-gray-600 mb-1">
            Sin datos de tipos de turno
          </h4>
          <p className="text-xs text-gray-500">
            Agrega turnos para ver esta estadística
          </p>
        </div>
      ) : (
        // Estado con datos
        <div className="grid grid-cols-2 gap-4">
          ***REMOVED***Object.entries(tiposValidos).map(([tipo, datos]) => ***REMOVED***
            const datosSeguro = ***REMOVED***
              turnos: (datos && typeof datos.turnos === 'number') ? datos.turnos : 0,
              horas: (datos && typeof datos.horas === 'number') ? datos.horas : 0,
              ganancia: (datos && typeof datos.ganancia === 'number') ? datos.ganancia : 0
            ***REMOVED***;

            const tipoMostrado = tipo === 'undefined' ? 'MIXTO' : tipo.toUpperCase();
            const colorTipo = getColorForType(tipo);

            return (
              <div key=***REMOVED***tipo***REMOVED*** className="text-center p-3 bg-gray-50 rounded-lg">
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style=***REMOVED******REMOVED*** backgroundColor: colorTipo ***REMOVED******REMOVED***
                />
                <p className="text-xs text-gray-600 capitalize">***REMOVED***tipoMostrado***REMOVED***</p>
                <p className="font-semibold">***REMOVED***formatTurnosCount(datosSeguro.turnos)***REMOVED***</p>
                <p className="text-xs text-gray-500">***REMOVED***datosSeguro.horas.toFixed(1)***REMOVED***h</p>
              </div>
            );
          ***REMOVED***)***REMOVED***
        </div>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default ShiftTypeStats;