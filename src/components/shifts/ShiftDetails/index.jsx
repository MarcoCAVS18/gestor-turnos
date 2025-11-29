// src/components/shifts/ShiftDetails/index.jsx

import React from 'react';
import { Clock, DollarSign, Timer } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import InfoTooltip from '../../ui/InfoTooltip';
import { determinarTipoTurno, getTipoTurnoLabel } from '../../../utils/shiftDetailsUtils';
import { createSafeDate } from '../../../utils/time';
import Flex from '../../ui/Flex';

const ShiftDetails = ({ turno, trabajo, badges }) => {
  const { calculatePayment, shiftRanges } = useApp();
  const colors = useThemeColors();
  
  // Hooks SIEMPRE al inicio
  const calculationResults = React.useMemo(() => {
    if (!turno || !trabajo) return {
      total: 0,
      totalWithDiscount: 0,
      hours: 0,
      breakdown: null
    };
    
    return calculatePayment(turno);
  }, [turno, trabajo, calculatePayment]);

  const turnoInfo = React.useMemo(() => {
    if (!turno || !shiftRanges) return {
      tipoTurno: 'mixto',
      labelTipoTurno: 'Mixto'
    };
    
    const tipo = determinarTipoTurno(turno, shiftRanges);
    const label = getTipoTurnoLabel(tipo);
    
    return {
      tipoTurno: tipo,
      labelTipoTurno: label
    };
  }, [turno, shiftRanges]);

  const { total, totalWithDiscount, hours, breakdown } = calculationResults;

  const tooltipContent = React.useMemo(() => {
    if (!turno || !trabajo || hours <= 0) {
      return (
        <div className="text-xs text-center">
          <span>No hay información disponible</span>
        </div>
      );
    }

    return (
      <div className="space-y-2 text-xs text-left max-w-xs">
        <div className="font-semibold mb-2 border-b border-gray-600 pb-1">
          Desglose del Turno
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between gap-4">
            <span>Tipo de Turno:</span>
            <span className="font-semibold">{turnoInfo.labelTipoTurno}</span>
          </div>
          
          <div className="flex justify-between gap-4">
            <span>Duración:</span>
            <span className="font-semibold">{hours.toFixed(1)} horas</span>
          </div>
          
          <div className="flex justify-between gap-4">
            <span>Trabajo:</span>
            <span className="font-semibold">{trabajo.nombre}</span>
          </div>
          
          {breakdown && (
            <>
              <div className="border-t border-gray-600 pt-1 mt-2">
                <div className="font-medium mb-1">Desglose por horario:</div>
                {breakdown.diurno > 0 && (
                  <div className="flex justify-between gap-4">
                    <span>• Diurno:</span>
                    <span>${breakdown.diurno.toFixed(2)}</span>
                  </div>
                )}
                {breakdown.tarde > 0 && (
                  <div className="flex justify-between gap-4">
                    <span>• Tarde:</span>
                    <span>${breakdown.tarde.toFixed(2)}</span>
                  </div>
                )}
                {breakdown.noche > 0 && (
                  <div className="flex justify-between gap-4">
                    <span>• Noche:</span>
                    <span>${breakdown.noche.toFixed(2)}</span>
                  </div>
                )}
                {breakdown.sabado > 0 && (
                  <div className="flex justify-between gap-4">
                    <span>• Sábado:</span>
                    <span>${breakdown.sabado.toFixed(2)}</span>
                  </div>
                )}
                {breakdown.domingo > 0 && (
                  <div className="flex justify-between gap-4">
                    <span>• Domingo:</span>
                    <span>${breakdown.domingo.toFixed(2)}</span>
                  </div>
                )}
                {breakdown.delivery > 0 && (
                  <div className="flex justify-between gap-4">
                    <span>• Delivery:</span>
                    <span>${breakdown.delivery.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </>
          )}
          
          <div className="flex justify-between gap-4 border-t border-gray-600 pt-1.5 mt-2">
            <span className="font-semibold">Ganancia Bruta:</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between gap-4">
            <span className="font-semibold">Ganancia Neta:</span>
            <span className="font-bold text-base">${totalWithDiscount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between gap-4 text-yellow-200">
            <span>Promedio/hora:</span>
            <span>${hours > 0 ? (totalWithDiscount / hours).toFixed(2) : '0.00'}</span>
          </div>

          {turno.cruzaMedianoche && (
            <div className="border-t border-gray-600 pt-1.5 mt-2">
              <div className="flex items-center gap-1 text-blue-200">
                <Clock size={12} />
                <span className="text-xs">Turno nocturno</span>
              </div>
              {turno.fechaFin && (
                <div className="text-xs text-gray-300 mt-1">
                  Termina: {createSafeDate(turno.fechaFin).toLocaleDateString('es-ES')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }, [turno, trabajo, hours, total, totalWithDiscount, breakdown, turnoInfo]);

  // Early returns después de hooks
  if (!turno) {
    return (
      <div className="text-center py-2">
        <p className="text-xs text-gray-500">Turno no disponible</p>
      </div>
    );
  }

  if (!trabajo) {
    return (
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-400">
          <Clock size={14} className="mr-1.5" />
          <span>{turno.horaInicio} - {turno.horaFin}</span>
        </div>
        <p className="text-xs text-gray-500">Trabajo eliminado</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full max-w-full overflow-hidden">
      {/* HORARIO Y DURACIÓN - RESPONSIVO */}
      <div className="flex items-center text-sm text-gray-600 flex-wrap">
        <div className="flex items-center mr-2">
          <Clock size={14} className="mr-1.5 flex-shrink-0" />
          <span className="whitespace-nowrap">{turno.horaInicio} - {turno.horaFin}</span>
        </div>
        
        <span className="mx-2 text-gray-300 hidden sm:inline">•</span>
        
        <div className="flex items-center mt-1 sm:mt-0">
          <Timer size={14} className="mr-1 flex-shrink-0" />
          <span className="whitespace-nowrap">{hours.toFixed(1)}h</span>
        </div>

        {/* Indicador de turno nocturno */}
        {turno.cruzaMedianoche && (
          <>
            <span className="mx-2 text-gray-300 hidden sm:inline">•</span>
            <span 
              className="text-xs px-2 py-0.5 rounded-full mt-1 sm:mt-0"
              style={{ 
                backgroundColor: colors.transparent10,
                color: colors.primary 
              }}
            >
              🌙 Nocturno
            </span>
          </>
        )}
      </div>
      
      {/* GANANCIA CON TOOLTIP Y BADGES - RESPONSIVO */}
      <Flex variant="between">
        <Flex className="min-w-0">
          <DollarSign 
            size={14} 
            className="mr-1 flex-shrink-0" 
            style={{ color: colors.success || '#10B981' }}
          />
          <span 
            className="text-sm font-semibold mr-1"
            style={{ color: colors.primary }}
          >
            ${totalWithDiscount.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500 mr-2 whitespace-nowrap">total</span>
          
          <InfoTooltip 
            content={tooltipContent}
            size="xs"
            position="top"
            className="flex-shrink-0"
          />
        </Flex>
        
        {/* BADGES RESPONSIVOS */}
        {badges && (
          <Flex className="ml-2 min-w-0">
            {badges}
          </Flex>
        )}
      </Flex>

      {/* INFORMACIÓN ADICIONAL PARA MÓVIL */}
      {turno.observaciones && (
        <div 
          className="mt-2 p-2 rounded text-xs"
          style={{ 
            backgroundColor: colors.transparent5,
            color: '#6B7280'
          }}
        >
          <strong>Notas:</strong> {turno.observaciones}
        </div>
      )}
    </div>
  );
};

export default ShiftDetails;