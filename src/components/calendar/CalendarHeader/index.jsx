// src/components/calendar/CalendarHeader/index.jsx

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarHeader = ({ 
  mesActual, 
  anioActual, 
  onCambiarMes, 
  onIrAHoy, 
  thematicColors 
}) => {
  const getNombreMes = () => {
    return new Date(anioActual, mesActual, 1).toLocaleDateString('es-ES', { month: 'long' });
  };

  return (
    <div
      className="p-4 text-white flex justify-between items-center"
      style={{ backgroundColor: thematicColors?.base || '#EC4899' }}
    >
      <button
        onClick={() => onCambiarMes(-1)}
        className="text-white p-2 rounded-full transition-colors hover:bg-black hover:bg-opacity-20"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold capitalize">
          {getNombreMes()} {anioActual}
        </h3>
        <button
          onClick={onIrAHoy}
          className="text-xs px-3 py-1 rounded-full mt-1 transition-colors bg-white bg-opacity-20 hover:bg-opacity-30"
        >
          Hoy
        </button>
      </div>
      
      <button
        onClick={() => onCambiarMes(1)}
        className="text-white p-2 rounded-full transition-colors hover:bg-black hover:bg-opacity-20"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default CalendarHeader;