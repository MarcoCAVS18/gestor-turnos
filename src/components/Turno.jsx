// src/components/Turno.jsx

import React from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const Turno = (***REMOVED*** turno, trabajo ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** calcularPago ***REMOVED*** = useApp();
  const ***REMOVED*** horas, total, totalConDescuento ***REMOVED*** = calcularPago(turno);
  
  return (
    <div 
      className="p-4 mb-3 rounded-lg relative pl-6"
      style=***REMOVED******REMOVED*** 
        backgroundColor: `$***REMOVED***trabajo.color***REMOVED***15`, 
        borderColor: trabajo.color,
        borderWidth: '1px'
      ***REMOVED******REMOVED***
    >
      <div 
        className="absolute top-0 left-0 bottom-0 w-2 rounded-l-lg"
        style=***REMOVED******REMOVED*** backgroundColor: trabajo.color ***REMOVED******REMOVED***
      />
      
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800">***REMOVED***trabajo.nombre***REMOVED***</h4>
          <p className="text-gray-600 text-sm">
            ***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED*** (***REMOVED***horas.toFixed(1)***REMOVED***h)
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Tarifa: $***REMOVED***trabajo.tarifas[turno.tipo].toFixed(2)***REMOVED***
          </p>
          <p className="text-sm line-through text-gray-500">
            $***REMOVED***total.toFixed(2)***REMOVED***
          </p>
          <p className="font-semibold">
            $***REMOVED***totalConDescuento.toFixed(2)***REMOVED***
          </p>
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default Turno;