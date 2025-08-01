import React, { forwardRef } from 'react';
import { Calendar } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import TarjetaTurno from '../../cards/TarjetaTurno';
import TarjetaTurnoDelivery from '../../cards/TarjetaTurnoDelivery';

const DaySection = forwardRef(({ fecha, turnos, trabajos, onEditTurno, onDeleteTurno }, ref) => {
  const { thematicColors } = useApp();

  const fechaObj = new Date(fecha + 'T00:00:00');
  const diaSemana = fechaObj.toLocaleDateString('es-ES', { weekday: 'long' });
  const fechaFormateada = fechaObj.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div ref={ref} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200" style={{ backgroundColor: thematicColors?.transparent5 }}>
        <div className="flex items-center gap-2">
          <Calendar size={20} style={{ color: thematicColors?.base }} />
          <h3 className="font-semibold text-gray-900 capitalize">
            {diaSemana}, {fechaFormateada}
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {turnos.map(turno => {
          const trabajo = trabajos.find(t => t.id === turno.trabajoId);
          
          if (turno.tipo === 'delivery') {
            return (
              <TarjetaTurnoDelivery
                key={turno.id}
                turno={turno}
                trabajo={trabajo}
                onEdit={onEditTurno}
                onDelete={onDeleteTurno}
              />
            );
          }
          
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
    </div>
  );
});

export default DaySection;