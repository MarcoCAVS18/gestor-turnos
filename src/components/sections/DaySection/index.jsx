import React, ***REMOVED*** forwardRef ***REMOVED*** from 'react';
import ***REMOVED*** Calendar ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import TarjetaTurno from '../../cards/TarjetaTurno';
import TarjetaTurnoDelivery from '../../cards/TarjetaTurnoDelivery';

const DaySection = forwardRef((***REMOVED*** fecha, turnos, trabajos, onEditTurno, onDeleteTurno ***REMOVED***, ref) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();

  const fechaObj = new Date(fecha + 'T00:00:00');
  const diaSemana = fechaObj.toLocaleDateString('es-ES', ***REMOVED*** weekday: 'long' ***REMOVED***);
  const fechaFormateada = fechaObj.toLocaleDateString('es-ES', ***REMOVED*** 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  ***REMOVED***);

  return (
    <div ref=***REMOVED***ref***REMOVED*** className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200" style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent5 ***REMOVED******REMOVED***>
        <div className="flex items-center gap-2">
          <Calendar size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** />
          <h3 className="font-semibold text-gray-900 capitalize">
            ***REMOVED***diaSemana***REMOVED***, ***REMOVED***fechaFormateada***REMOVED***
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        ***REMOVED***turnos.map(turno => ***REMOVED***
          const trabajo = trabajos.find(t => t.id === turno.trabajoId);
          
          if (turno.tipo === 'delivery') ***REMOVED***
            return (
              <TarjetaTurnoDelivery
                key=***REMOVED***turno.id***REMOVED***
                turno=***REMOVED***turno***REMOVED***
                trabajo=***REMOVED***trabajo***REMOVED***
                onEdit=***REMOVED***onEditTurno***REMOVED***
                onDelete=***REMOVED***onDeleteTurno***REMOVED***
              />
            );
          ***REMOVED***
          
          return (
            <TarjetaTurno
              key=***REMOVED***turno.id***REMOVED***
              turno=***REMOVED***turno***REMOVED***
              trabajo=***REMOVED***trabajo***REMOVED***
              onEdit=***REMOVED***onEditTurno***REMOVED***
              onDelete=***REMOVED***onDeleteTurno***REMOVED***
            />
          );
        ***REMOVED***)***REMOVED***
      </div>
    </div>
  );
***REMOVED***);

export default DaySection;