import React from 'react';
import { Clock, DollarSign, Timer } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import InfoTooltip from '../../ui/InfoTooltip'; 

const ShiftDetails = ({ turno, trabajo, badges }) => {
  const { calculatePayment, defaultDiscount } = useApp();
  
  // Obtenemos todos los datos necesarios del cálculo
  const { total, totalWithDiscount, hours } = calculatePayment(turno);

  // Creamos el contenido para el tooltip como un elemento JSX
  const tooltipContent = (
    <div className="space-y-1.5 text-xs text-left">
      <div className="flex justify-between gap-4">
        <span>Ganancia Bruta:</span>
        <span className="font-semibold">${total.toFixed(2)}</span>
      </div>
      { /* Mostramos el descuento solo si es mayor a cero */}
      {defaultDiscount > 0 && (
        <div className="flex justify-between gap-4">
          <span>Descuento ({defaultDiscount}%):</span>
          <span className="text-red-400 font-semibold">-${(total - totalWithDiscount).toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between gap-4 border-t border-gray-600 pt-1 mt-1">
        <span>Ganancia Neta:</span>
        <span className="font-bold text-base">${totalWithDiscount.toFixed(2)}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      {/*  Horario y duración */}
      <div className="flex items-center text-sm text-gray-600">
        <Clock size={14} className="mr-1.5" />
        <span>{turno.horaInicio} - {turno.horaFin}</span>
        <span className="mx-2 text-gray-300">•</span>
        <Timer size={14} className="mr-1" />
        <span>{hours.toFixed(1)}h</span>
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