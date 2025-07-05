import React from 'react';
import { Clock, DollarSign, Timer } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import InfoTooltip from '../../ui/InfoTooltip'; 

const ShiftDetails = ({ turno, trabajo, badges }) => {
  const { calculatePayment, shiftRanges } = useApp();
  
  // Obtenemos todos los datos necesarios del cálculo
  const { total, totalWithDiscount, hours, breakdown } = calculatePayment(turno);

  // Función para determinar tipo de turno por rangos
  const getTipoTurnoByHour = (hora) => {
    const ranges = shiftRanges || {
      dayStart: 6, dayEnd: 14,
      afternoonStart: 14, afternoonEnd: 20,
      nightStart: 20
    };

    if (hora >= ranges.dayStart && hora < ranges.dayEnd) {
      return 'Diurno';
    } else if (hora >= ranges.afternoonStart && hora < ranges.afternoonEnd) {
      return 'Tarde';
    } else {
      return 'Noche';
    }
  };

  // Determinar si es un turno mixto
  const determinarTipoTurno = () => {
    if (turno.tipo === 'delivery') return 'Delivery';
    
    const [horaInicio, minutoInicio] = turno.horaInicio.split(':').map(Number);
    const [horaFin, minutoFin] = turno.horaFin.split(':').map(Number);
    
    const inicioMinutos = horaInicio * 60 + minutoInicio;
    let finMinutos = horaFin * 60 + minutoFin;
    
    // Si cruza medianoche
    if (finMinutos <= inicioMinutos) {
      finMinutos += 24 * 60;
    }
    
    const tiposEncontrados = new Set();
    
    // Revisar cada hora del turno para ver si cambia de tipo
    for (let minutos = inicioMinutos; minutos < finMinutos; minutos += 60) {
      const horaActual = Math.floor((minutos % (24 * 60)) / 60);
      const tipo = getTipoTurnoByHour(horaActual);
      tiposEncontrados.add(tipo);
    }
    
    // Si hay más de un tipo, es mixto
    if (tiposEncontrados.size > 1) {
      return `Mixto (${Array.from(tiposEncontrados).join(', ')})`;
    }
    
    return Array.from(tiposEncontrados)[0] || 'Noche';
  };

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
          <span className="font-semibold">{tipoTurno}</span>
        </div>
        
        <div className="flex justify-between gap-4">
          <span>Duración:</span>
          <span className="font-semibold">{hours.toFixed(1)} horas</span>
        </div>
        
        {/* Mostrar desglose por tipo de turno si está disponible */}
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
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      {/* Horario y duración */}
      <div className="flex items-center text-sm text-gray-600">
        <Clock size={14} className="mr-1.5" />
        <span>{turno.horaInicio} - {turno.horaFin}</span>
        <span className="mx-2 text-gray-300">•</span>
        <Timer size={14} className="mr-1" />
        <span>{hours.toFixed(1)}h</span>
        {tipoTurno.includes('Mixto') && (
          <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
            Mixto
          </span>
        )}
      </div>
      
      {/* Ganancia simplificada con tooltip y badges */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <DollarSign size={14} className="mr-1 text-green-600" />
          <span className="text-sm font-semibold text-gray-800">${totalWithDiscount.toFixed(2)}</span>
          <span className="text-xs text-gray-500 ml-1">total</span>
          
          <InfoTooltip 
            content={tooltipContent}
            size="xs"
            position="top"
            className="ml-2"
          />
        </div>
        
        {badges && (
          <div>
            {badges}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftDetails;