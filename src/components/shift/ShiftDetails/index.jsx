import React from 'react';
import ***REMOVED*** Clock, DollarSign, Timer ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import InfoTooltip from '../../ui/InfoTooltip'; 

const ShiftDetails = (***REMOVED*** turno, trabajo, badges ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** calculatePayment, shiftRanges ***REMOVED*** = useApp();
  
  // Obtenemos todos los datos necesarios del cálculo
  const ***REMOVED*** total, totalWithDiscount, hours, breakdown ***REMOVED*** = calculatePayment(turno);

  // Función para determinar tipo de turno por rangos
  const getTipoTurnoByHour = (hora) => ***REMOVED***
    const ranges = shiftRanges || ***REMOVED***
      dayStart: 6, dayEnd: 14,
      afternoonStart: 14, afternoonEnd: 20,
      nightStart: 20
    ***REMOVED***;

    if (hora >= ranges.dayStart && hora < ranges.dayEnd) ***REMOVED***
      return 'Diurno';
    ***REMOVED*** else if (hora >= ranges.afternoonStart && hora < ranges.afternoonEnd) ***REMOVED***
      return 'Tarde';
    ***REMOVED*** else ***REMOVED***
      return 'Noche';
    ***REMOVED***
  ***REMOVED***;

  // Determinar si es un turno mixto
  const determinarTipoTurno = () => ***REMOVED***
    if (turno.tipo === 'delivery') return 'Delivery';
    
    const [horaInicio, minutoInicio] = turno.horaInicio.split(':').map(Number);
    const [horaFin, minutoFin] = turno.horaFin.split(':').map(Number);
    
    const inicioMinutos = horaInicio * 60 + minutoInicio;
    let finMinutos = horaFin * 60 + minutoFin;
    
    // Si cruza medianoche
    if (finMinutos <= inicioMinutos) ***REMOVED***
      finMinutos += 24 * 60;
    ***REMOVED***
    
    const tiposEncontrados = new Set();
    
    // Revisar cada hora del turno para ver si cambia de tipo
    for (let minutos = inicioMinutos; minutos < finMinutos; minutos += 60) ***REMOVED***
      const horaActual = Math.floor((minutos % (24 * 60)) / 60);
      const tipo = getTipoTurnoByHour(horaActual);
      tiposEncontrados.add(tipo);
    ***REMOVED***
    
    // Si hay más de un tipo, es mixto
    if (tiposEncontrados.size > 1) ***REMOVED***
      return `Mixto ($***REMOVED***Array.from(tiposEncontrados).join(', ')***REMOVED***)`;
    ***REMOVED***
    
    return Array.from(tiposEncontrados)[0] || 'Noche';
  ***REMOVED***;

  const tipoTurno = determinarTipoTurno();

  // Crear el contenido para el tooltip con información detallada por tipo de turno
  const tooltipContent = (
    <div className="space-y-2 text-xs text-left max-w-xs">
      <div className="font-semibold mb-2 border-b border-gray-600 pb-1">
        Desglose del Turno
      </div>
      
      <div className="space-y-1.5">
        <div className="flex justify-between gap-4">
          <span>Tipo de Turno:</span>
          <span className="font-semibold">***REMOVED***tipoTurno***REMOVED***</span>
        </div>
        
        <div className="flex justify-between gap-4">
          <span>Duración:</span>
          <span className="font-semibold">***REMOVED***hours.toFixed(1)***REMOVED*** horas</span>
        </div>
        
        ***REMOVED***/* Mostrar desglose por tipo de turno si está disponible */***REMOVED***
        ***REMOVED***breakdown && (
          <>
            <div className="border-t border-gray-600 pt-1 mt-2">
              <div className="font-medium mb-1">Desglose por horario:</div>
              ***REMOVED***breakdown.diurno > 0 && (
                <div className="flex justify-between gap-4">
                  <span>• Diurno:</span>
                  <span>$***REMOVED***breakdown.diurno.toFixed(2)***REMOVED***</span>
                </div>
              )***REMOVED***
              ***REMOVED***breakdown.tarde > 0 && (
                <div className="flex justify-between gap-4">
                  <span>• Tarde:</span>
                  <span>$***REMOVED***breakdown.tarde.toFixed(2)***REMOVED***</span>
                </div>
              )***REMOVED***
              ***REMOVED***breakdown.noche > 0 && (
                <div className="flex justify-between gap-4">
                  <span>• Noche:</span>
                  <span>$***REMOVED***breakdown.noche.toFixed(2)***REMOVED***</span>
                </div>
              )***REMOVED***
              ***REMOVED***breakdown.sabado > 0 && (
                <div className="flex justify-between gap-4">
                  <span>• Sábado:</span>
                  <span>$***REMOVED***breakdown.sabado.toFixed(2)***REMOVED***</span>
                </div>
              )***REMOVED***
              ***REMOVED***breakdown.domingo > 0 && (
                <div className="flex justify-between gap-4">
                  <span>• Domingo:</span>
                  <span>$***REMOVED***breakdown.domingo.toFixed(2)***REMOVED***</span>
                </div>
              )***REMOVED***
              ***REMOVED***breakdown.delivery > 0 && (
                <div className="flex justify-between gap-4">
                  <span>• Delivery:</span>
                  <span>$***REMOVED***breakdown.delivery.toFixed(2)***REMOVED***</span>
                </div>
              )***REMOVED***
            </div>
          </>
        )***REMOVED***
        
        <div className="flex justify-between gap-4 border-t border-gray-600 pt-1.5 mt-2">
          <span className="font-semibold">Ganancia Bruta:</span>
          <span className="font-bold">$***REMOVED***total.toFixed(2)***REMOVED***</span>
        </div>
        
        <div className="flex justify-between gap-4">
          <span className="font-semibold">Ganancia Neta:</span>
          <span className="font-bold text-base">$***REMOVED***totalWithDiscount.toFixed(2)***REMOVED***</span>
        </div>
        
        <div className="flex justify-between gap-4 text-yellow-200">
          <span>Promedio/hora:</span>
          <span>$***REMOVED***hours > 0 ? (totalWithDiscount / hours).toFixed(2) : '0.00'***REMOVED***</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      ***REMOVED***/* Horario y duración */***REMOVED***
      <div className="flex items-center text-sm text-gray-600">
        <Clock size=***REMOVED***14***REMOVED*** className="mr-1.5" />
        <span>***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***</span>
        <span className="mx-2 text-gray-300">•</span>
        <Timer size=***REMOVED***14***REMOVED*** className="mr-1" />
        <span>***REMOVED***hours.toFixed(1)***REMOVED***h</span>
        ***REMOVED***tipoTurno.includes('Mixto') && (
          <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
            Mixto
          </span>
        )***REMOVED***
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