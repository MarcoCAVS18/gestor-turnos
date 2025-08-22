// src/components/stats/ShiftTypeStats/index.jsx - REFACTORIZADO

import React from 'react';
import ***REMOVED*** Zap ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';

const ShiftTypeStats = (***REMOVED*** tiposDeTurno = ***REMOVED******REMOVED*** ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  // Verificar que tiposDeTurno sea válido
  const tiposValidos = tiposDeTurno && typeof tiposDeTurno === 'object' && !Array.isArray(tiposDeTurno) ? tiposDeTurno : ***REMOVED******REMOVED***;

  const colores = ***REMOVED***
    'diurno': '#10B981',
    'tarde': '#F59E0B',
    'noche': '#6366F1',
    'sabado': '#8B5CF6',
    'domingo': '#EF4444',
    'mixto': '#6B7280'
  ***REMOVED***;

  if (Object.keys(tiposValidos).length === 0) ***REMOVED***
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center mb-4">
          <Zap size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
          <h3 className="font-semibold">Tipos de turno</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Zap size=***REMOVED***48***REMOVED*** className="mx-auto mb-3 opacity-30" />
          <p>No hay datos de tipos de turno</p>
        </div>
      </div>
    );
  ***REMOVED***

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center mb-4">
        <Zap size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
        <h3 className="font-semibold">Tipos de turno</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        ***REMOVED***Object.entries(tiposValidos).map(([tipo, datos]) => ***REMOVED***
          const datosSeguro = ***REMOVED***
            turnos: (datos && typeof datos.turnos === 'number') ? datos.turnos : 0,
            horas: (datos && typeof datos.horas === 'number') ? datos.horas : 0,
            ganancia: (datos && typeof datos.ganancia === 'number') ? datos.ganancia : 0
          ***REMOVED***;

          const tipoMostrado = tipo === 'undefined' ? 'MIXTO' : tipo;

          return (
            <div key=***REMOVED***tipo***REMOVED*** className="text-center p-3 bg-gray-50 rounded-lg">
              <div
                className="w-3 h-3 rounded-full mx-auto mb-2"
                style=***REMOVED******REMOVED*** backgroundColor: colores[tipo] || '#6B7280' ***REMOVED******REMOVED***
              />
              <p className="text-xs text-gray-600 capitalize">***REMOVED***tipoMostrado***REMOVED***</p>
              <p className="font-semibold">***REMOVED***datosSeguro.turnos***REMOVED*** turnos</p>
              <p className="text-xs text-gray-500">***REMOVED***datosSeguro.horas.toFixed(1)***REMOVED***h</p>
            </div>
          );
        ***REMOVED***)***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default ShiftTypeStats;
