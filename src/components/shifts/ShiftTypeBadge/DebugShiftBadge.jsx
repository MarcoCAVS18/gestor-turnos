// Ejemplo de debug para verificar que ShiftTypeBadge funciona
// Puedes agregar este componente temporalmente en cualquier página para probarlo

import React from 'react';
import ShiftTypeBadge from './index';

const DebugShiftBadge = () => ***REMOVED***
  // Turnos de ejemplo para probar
  const turnosEjemplo = [
    ***REMOVED*** horaInicio: '08:00', horaFin: '16:00', fecha: '2024-01-15' ***REMOVED***, // Lunes diurno
    ***REMOVED*** horaInicio: '14:00', horaFin: '22:00', fecha: '2024-01-15' ***REMOVED***, // Lunes tarde
    ***REMOVED*** horaInicio: '22:00', horaFin: '06:00', fecha: '2024-01-15', cruzaMedianoche: true ***REMOVED***, // Lunes noche
    ***REMOVED*** horaInicio: '09:00', horaFin: '17:00', fecha: '2024-01-13' ***REMOVED***, // Sábado
    ***REMOVED*** horaInicio: '09:00', horaFin: '17:00', fecha: '2024-01-14' ***REMOVED***, // Domingo
    ***REMOVED*** tipo: 'delivery', horaInicio: '18:00', horaFin: '23:00', fecha: '2024-01-15' ***REMOVED***, // Delivery
    ***REMOVED*** horaInicio: '06:00', horaFin: '23:00', fecha: '2024-01-15' ***REMOVED***, // Mixto
  ];

  return (
    <div className="p-4 space-y-4 bg-gray-100">
      <h2 className="text-lg font-bold">Debug ShiftTypeBadge</h2>
      <div className="space-y-2">
        ***REMOVED***turnosEjemplo.map((turno, index) => (
          <div key=***REMOVED***index***REMOVED*** className="flex items-center gap-4 p-2 bg-white rounded">
            <span className="text-sm w-32">
              ***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***
            </span>
            <span className="text-sm w-20">
              ***REMOVED***turno.fecha***REMOVED***
            </span>
            <ShiftTypeBadge turno=***REMOVED***turno***REMOVED*** size="sm" />
          </div>
        ))***REMOVED***
      </div>
      
      ***REMOVED***/* Test de badges directos */***REMOVED***
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Test badges directos:</h3>
        <div className="flex gap-2 flex-wrap">
          <ShiftTypeBadge tipoTurno="diurno" size="sm" />
          <ShiftTypeBadge tipoTurno="tarde" size="sm" />
          <ShiftTypeBadge tipoTurno="noche" size="sm" />
          <ShiftTypeBadge tipoTurno="sabado" size="sm" />
          <ShiftTypeBadge tipoTurno="domingo" size="sm" />
          <ShiftTypeBadge tipoTurno="delivery" size="sm" />
          <ShiftTypeBadge tipoTurno="mixto" size="sm" />
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default DebugShiftBadge;