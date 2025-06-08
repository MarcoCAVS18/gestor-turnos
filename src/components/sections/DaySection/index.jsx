// src/components/sections/DaySection/index.jsx

import React from 'react';
import ***REMOVED*** Calendar ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useUtils ***REMOVED*** from '../../../hooks/useUtils';
import TarjetaTurno from '../../cards/TarjetaTurno';
import Card from '../../ui/Card';

const DaySection = (***REMOVED*** fecha, turnos, trabajos, onEditTurno, onDeleteTurno ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** formatDate, isToday, isYesterday ***REMOVED*** = useUtils();
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();
  
  const formatearFechaEncabezado = (fechaStr) => ***REMOVED***
    if (isToday(fechaStr)) return 'Hoy';
    if (isYesterday(fechaStr)) return 'Ayer';
    return formatDate(fechaStr, 'full');
  ***REMOVED***;
  
  const obtenerTrabajo = (trabajoId) => ***REMOVED***
    return trabajos.find(trabajo => trabajo.id === trabajoId);
  ***REMOVED***;

  return (
    <Card className="overflow-hidden" padding="none">
      ***REMOVED***/* Header del día */***REMOVED***
      <div 
        className="px-4 py-3 border-b flex justify-between items-center"
        style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)' ***REMOVED******REMOVED***
      >
        <div className="flex items-center">
          <Calendar size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
          <h3 className="font-semibold text-gray-800 capitalize">
            ***REMOVED***formatearFechaEncabezado(fecha)***REMOVED***
          </h3>
          <span className="ml-2 text-sm text-gray-500">
            (***REMOVED***new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', ***REMOVED*** 
              day: '2-digit', 
              month: '2-digit' 
            ***REMOVED***)***REMOVED***)
          </span>
        </div>
      </div>
      
      ***REMOVED***/* Lista de turnos usando variant="compact" */***REMOVED***
      <div className="p-4 space-y-3">
        ***REMOVED***turnos.map(turno => ***REMOVED***
          const trabajo = obtenerTrabajo(turno.trabajoId);
          if (!trabajo) return null;
          
          return (
            <TarjetaTurno
              key=***REMOVED***turno.id***REMOVED***
              turno=***REMOVED***turno***REMOVED***
              trabajo=***REMOVED***trabajo***REMOVED***
              onEdit=***REMOVED***onEditTurno***REMOVED***
              onDelete=***REMOVED***onDeleteTurno***REMOVED***
              variant="compact" 
            />
          );
        ***REMOVED***)***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default DaySection;