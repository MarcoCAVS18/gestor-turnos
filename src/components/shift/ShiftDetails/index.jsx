// src/components/shift/ShiftDetails/index.jsx

import React from 'react';
import ***REMOVED*** Clock, DollarSign, Timer ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const ShiftDetails = (***REMOVED*** turno, trabajo ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** calcularPago ***REMOVED*** = useApp();
  const ***REMOVED*** totalConDescuento, horas ***REMOVED*** = calcularPago(turno);

  return (
    <div className="space-y-1">
      ***REMOVED***/* Horario */***REMOVED***
      <div className="flex items-center">
        <Clock size=***REMOVED***14***REMOVED*** className="text-blue-500 mr-1" />
        <span className="text-sm font-medium">
          ***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***
        </span>
      </div>
      
      ***REMOVED***/* Duración */***REMOVED***
      <div className="flex items-center">
        <Timer size=***REMOVED***14***REMOVED*** className="text-green-500 mr-1" />
        <span className="text-sm text-gray-600">***REMOVED***horas.toFixed(1)***REMOVED*** horas</span>
      </div>
      
      ***REMOVED***/* Ganancia */***REMOVED***
      <div className="flex items-center">
        <DollarSign size=***REMOVED***14***REMOVED*** className="text-yellow-500 mr-1" />
        <span className="text-sm font-medium">$***REMOVED***totalConDescuento.toFixed(2)***REMOVED***</span>
        <span className="text-xs text-gray-500 ml-1">total</span>
      </div>
    </div>
  );
***REMOVED***;

export default ShiftDetails;