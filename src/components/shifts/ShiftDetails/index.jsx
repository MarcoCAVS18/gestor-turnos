// src/components/shifts/ShiftDetails/index.jsx

import React from 'react';
import ***REMOVED*** Clock, DollarSign, Timer ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import InfoTooltip from '../../ui/InfoTooltip'; 
import ***REMOVED*** determinarTipoTurno, getTipoTurnoLabel ***REMOVED*** from '../../../utils/shiftDetailsUtils';

const ShiftDetails = (***REMOVED*** turno, trabajo, badges ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** calculatePayment, shiftRanges ***REMOVED*** = useApp();
  const colors = useThemeColors();
  
  // Hooks SIEMPRE al inicio
  const calculationResults = React.useMemo(() => ***REMOVED***
    if (!turno || !trabajo) return ***REMOVED***
      total: 0,
      totalWithDiscount: 0,
      hours: 0,
      breakdown: null
    ***REMOVED***;
    
    return calculatePayment(turno);
  ***REMOVED***, [turno, trabajo, calculatePayment]);

  const turnoInfo = React.useMemo(() => ***REMOVED***
    if (!turno || !shiftRanges) return ***REMOVED***
      tipoTurno: 'mixto',
      labelTipoTurno: 'Mixto'
    ***REMOVED***;
    
    const tipo = determinarTipoTurno(turno, shiftRanges);
    const label = getTipoTurnoLabel(tipo);
    
    return ***REMOVED***
      tipoTurno: tipo,
      labelTipoTurno: label
    ***REMOVED***;
  ***REMOVED***, [turno, shiftRanges]);

  const ***REMOVED*** total, totalWithDiscount, hours, breakdown ***REMOVED*** = calculationResults;

  const tooltipContent = React.useMemo(() => ***REMOVED***
    if (!turno || !trabajo || hours <= 0) ***REMOVED***
      return (
        <div className="text-xs text-center">
          <span>No hay información disponible</span>
        </div>
      );
    ***REMOVED***

    return (
      <div className="space-y-2 text-xs text-left max-w-xs">
        <div className="font-semibold mb-2 border-b border-gray-600 pb-1">
          Desglose del Turno
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between gap-4">
            <span>Tipo de Turno:</span>
            <span className="font-semibold">***REMOVED***turnoInfo.labelTipoTurno***REMOVED***</span>
          </div>
          
          <div className="flex justify-between gap-4">
            <span>Duración:</span>
            <span className="font-semibold">***REMOVED***hours.toFixed(1)***REMOVED*** horas</span>
          </div>
          
          <div className="flex justify-between gap-4">
            <span>Trabajo:</span>
            <span className="font-semibold">***REMOVED***trabajo.nombre***REMOVED***</span>
          </div>
          
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

          ***REMOVED***turno.cruzaMedianoche && (
            <div className="border-t border-gray-600 pt-1.5 mt-2">
              <div className="flex items-center gap-1 text-blue-200">
                <Clock size=***REMOVED***12***REMOVED*** />
                <span className="text-xs">Turno nocturno</span>
              </div>
              ***REMOVED***turno.fechaFin && (
                <div className="text-xs text-gray-300 mt-1">
                  Termina: ***REMOVED***new Date(turno.fechaFin + 'T00:00:00').toLocaleDateString('es-ES')***REMOVED***
                </div>
              )***REMOVED***
            </div>
          )***REMOVED***
        </div>
      </div>
    );
  ***REMOVED***, [turno, trabajo, hours, total, totalWithDiscount, breakdown, turnoInfo]);

  // Early returns después de hooks
  if (!turno) ***REMOVED***
    return (
      <div className="text-center py-2">
        <p className="text-xs text-gray-500">Turno no disponible</p>
      </div>
    );
  ***REMOVED***

  if (!trabajo) ***REMOVED***
    return (
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-400">
          <Clock size=***REMOVED***14***REMOVED*** className="mr-1.5" />
          <span>***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***</span>
        </div>
        <p className="text-xs text-gray-500">Trabajo eliminado</p>
      </div>
    );
  ***REMOVED***

  return (
    <div className="space-y-2 w-full max-w-full overflow-hidden">
      ***REMOVED***/* HORARIO Y DURACIÓN - RESPONSIVO */***REMOVED***
      <div className="flex items-center text-sm text-gray-600 flex-wrap">
        <div className="flex items-center mr-2">
          <Clock size=***REMOVED***14***REMOVED*** className="mr-1.5 flex-shrink-0" />
          <span className="whitespace-nowrap">***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***</span>
        </div>
        
        <span className="mx-2 text-gray-300 hidden sm:inline">•</span>
        
        <div className="flex items-center mt-1 sm:mt-0">
          <Timer size=***REMOVED***14***REMOVED*** className="mr-1 flex-shrink-0" />
          <span className="whitespace-nowrap">***REMOVED***hours.toFixed(1)***REMOVED***h</span>
        </div>

        ***REMOVED***/* Indicador de turno nocturno */***REMOVED***
        ***REMOVED***turno.cruzaMedianoche && (
          <>
            <span className="mx-2 text-gray-300 hidden sm:inline">•</span>
            <span 
              className="text-xs px-2 py-0.5 rounded-full mt-1 sm:mt-0"
              style=***REMOVED******REMOVED*** 
                backgroundColor: colors.transparent10,
                color: colors.primary 
              ***REMOVED******REMOVED***
            >
              🌙 Nocturno
            </span>
          </>
        )***REMOVED***
      </div>
      
      ***REMOVED***/* GANANCIA CON TOOLTIP Y BADGES - RESPONSIVO */***REMOVED***
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0">
          <DollarSign 
            size=***REMOVED***14***REMOVED*** 
            className="mr-1 flex-shrink-0" 
            style=***REMOVED******REMOVED*** color: colors.success || '#10B981' ***REMOVED******REMOVED***
          />
          <span 
            className="text-sm font-semibold mr-1"
            style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
          >
            $***REMOVED***totalWithDiscount.toFixed(2)***REMOVED***
          </span>
          <span className="text-xs text-gray-500 mr-2 whitespace-nowrap">total</span>
          
          <InfoTooltip 
            content=***REMOVED***tooltipContent***REMOVED***
            size="xs"
            position="top"
            className="flex-shrink-0"
          />
        </div>
        
        ***REMOVED***/* BADGES RESPONSIVOS */***REMOVED***
        ***REMOVED***badges && (
          <div className="flex items-center ml-2 min-w-0">
            ***REMOVED***badges***REMOVED***
          </div>
        )***REMOVED***
      </div>

      ***REMOVED***/* INFORMACIÓN ADICIONAL PARA MÓVIL */***REMOVED***
      ***REMOVED***turno.observaciones && (
        <div 
          className="mt-2 p-2 rounded text-xs"
          style=***REMOVED******REMOVED*** 
            backgroundColor: colors.transparent5,
            color: '#6B7280'
          ***REMOVED******REMOVED***
        >
          <strong>Notas:</strong> ***REMOVED***turno.observaciones***REMOVED***
        </div>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default ShiftDetails;