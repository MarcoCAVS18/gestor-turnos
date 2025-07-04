// src/components/shift/ShiftDetails/index.jsx

import React from 'react';
import { Clock, DollarSign, Timer } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';

const ShiftDetails = ({ turno, trabajo, badges }) => {
  const { calculatePayment } = useApp();
  const { totalWithDiscount, hours  } = calculatePayment(turno);

  return (
    <div className="space-y-1">
      {/* Horario */}
      <div className="flex items-center">
        <Clock size={14} className="text-blue-500 mr-1" />
        <span className="text-sm font-medium">
          {turno.horaInicio} - {turno.horaFin}
        </span>
      </div>
      
      {/* Duración */}
      <div className="flex items-center">
        <Timer size={14} className="text-green-500 mr-1" />
        <span className="text-sm text-gray-600">{hours.toFixed(1)} horas</span>
      </div>
      
      {/* Ganancia y Badges en la misma línea */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <DollarSign size={14} className="text-yellow-500 mr-1" />
          <span className="text-sm font-medium">${totalWithDiscount.toFixed(2)}</span>
          <span className="text-xs text-gray-500 ml-1">total</span>
        </div>
        
        {/* Badges alineados a la derecha */}
        {badges && (
          <div className="ml-auto">
            {badges}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftDetails;