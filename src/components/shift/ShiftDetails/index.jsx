import React from 'react';
import ***REMOVED*** Clock, DollarSign, Timer ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import InfoTooltip from '../../ui/InfoTooltip'; 

const ShiftDetails = (***REMOVED*** turno, trabajo, badges ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** calculatePayment, defaultDiscount ***REMOVED*** = useApp();
  
  // Obtenemos todos los datos necesarios del cálculo
  const ***REMOVED*** total, totalWithDiscount, hours ***REMOVED*** = calculatePayment(turno);

  // Creamos el contenido para el tooltip como un elemento JSX
  const tooltipContent = (
    <div className="space-y-1.5 text-xs text-left">
      <div className="flex justify-between gap-4">
        <span>Ganancia Bruta:</span>
        <span className="font-semibold">$***REMOVED***total.toFixed(2)***REMOVED***</span>
      </div>
      ***REMOVED*** /* Mostramos el descuento solo si es mayor a cero */***REMOVED***
      ***REMOVED***defaultDiscount > 0 && (
        <div className="flex justify-between gap-4">
          <span>Descuento (***REMOVED***defaultDiscount***REMOVED***%):</span>
          <span className="text-red-400 font-semibold">-$***REMOVED***(total - totalWithDiscount).toFixed(2)***REMOVED***</span>
        </div>
      )***REMOVED***
      <div className="flex justify-between gap-4 border-t border-gray-600 pt-1 mt-1">
        <span>Ganancia Neta:</span>
        <span className="font-bold text-base">$***REMOVED***totalWithDiscount.toFixed(2)***REMOVED***</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      ***REMOVED***/*  Horario y duración */***REMOVED***
      <div className="flex items-center text-sm text-gray-600">
        <Clock size=***REMOVED***14***REMOVED*** className="mr-1.5" />
        <span>***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***</span>
        <span className="mx-2 text-gray-300">•</span>
        <Timer size=***REMOVED***14***REMOVED*** className="mr-1" />
        <span>***REMOVED***hours.toFixed(1)***REMOVED***h</span>
      </div>
      
      ***REMOVED***/* Ganancia simplificada con tooltip y badges */***REMOVED***
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <DollarSign size=***REMOVED***14***REMOVED*** className="mr-1 text-green-600" />
          <span className="text-sm font-semibold text-gray-800">$***REMOVED***totalWithDiscount.toFixed(2)***REMOVED***</span>
          <span className="text-xs text-gray-500 ml-1">total</span>
          
          <InfoTooltip 
            content=***REMOVED***tooltipContent***REMOVED***
            size="xs"
            position="top"
            className="ml-2"
          />
        </div>
        
        ***REMOVED***badges && (
          <div>
            ***REMOVED***badges***REMOVED***
          </div>
        )***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default ShiftDetails;