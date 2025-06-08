// src/components/sections/DaySection/index.jsx

import React from 'react';
import { Calendar } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useUtils } from '../../../hooks/useUtils';
import TarjetaTurno from '../../cards/TarjetaTurno';
import Card from '../../ui/Card';

const DaySection = ({ fecha, turnos, trabajos, onEditTurno, onDeleteTurno }) => {
  const { formatDate, isToday, isYesterday } = useUtils();
  const { coloresTemáticos } = useApp();
  
  const formatearFechaEncabezado = (fechaStr) => {
    if (isToday(fechaStr)) return 'Hoy';
    if (isYesterday(fechaStr)) return 'Ayer';
    return formatDate(fechaStr, 'full');
  };
  
  const obtenerTrabajo = (trabajoId) => {
    return trabajos.find(trabajo => trabajo.id === trabajoId);
  };

  return (
    <Card className="overflow-hidden" padding="none">
      {/* Header del día */}
      <div 
        className="px-4 py-3 border-b flex justify-between items-center"
        style={{ backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)' }}
      >
        <div className="flex items-center">
          <Calendar size={18} style={{ color: coloresTemáticos?.base || '#EC4899' }} className="mr-2" />
          <h3 className="font-semibold text-gray-800 capitalize">
            {formatearFechaEncabezado(fecha)}
          </h3>
          <span className="ml-2 text-sm text-gray-500">
            ({new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', { 
              day: '2-digit', 
              month: '2-digit' 
            })})
          </span>
        </div>
      </div>
      
      {/* Lista de turnos */}
      <div className="p-4 space-y-3">
        {turnos.map(turno => {
          const trabajo = obtenerTrabajo(turno.trabajoId);
          if (!trabajo) return null;
          
          return (
            <TarjetaTurno
              key={turno.id}
              turno={turno}
              trabajo={trabajo}
              onEdit={onEditTurno}
              onDelete={onDeleteTurno}
            />
          );
        })}
      </div>
    </Card>
  );
};

export default DaySection;