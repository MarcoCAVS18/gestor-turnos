// src/components/calendar/CalendarDaySummary/index.jsx

import React from 'react';
import ***REMOVED*** PlusCircle, Calendar ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import TarjetaTurno from '../../cards/TarjetaTurno';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

const CalendarDaySummary = (***REMOVED*** 
  fechaSeleccionada, 
  turnos, 
  formatearFecha, 
  onNuevoTurno 
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** trabajos, calcularPago, coloresTemáticos ***REMOVED*** = useApp();

  const calcularTotalDia = (turnosList) => ***REMOVED***
    return turnosList.reduce((total, turno) => ***REMOVED***
      const ***REMOVED*** totalConDescuento ***REMOVED*** = calcularPago(turno);
      return total + totalConDescuento;
    ***REMOVED***, 0);
  ***REMOVED***;

  const obtenerTrabajo = (trabajoId) => ***REMOVED***
    return trabajos.find(t => t.id === trabajoId);
  ***REMOVED***;

  if (!fechaSeleccionada) return null;

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">
          Turnos del día seleccionado
        </h3>
        <Button
          onClick=***REMOVED***() => onNuevoTurno(new Date(fechaSeleccionada + 'T12:00:00'))***REMOVED***
          size="sm"
          className="flex items-center gap-1"
          icon=***REMOVED***PlusCircle***REMOVED***
        >
          Nuevo
        </Button>
      </div>
      
      ***REMOVED***turnos.length > 0 ? (
        <Card className="overflow-hidden" padding="none">
          ***REMOVED***/* Header del día */***REMOVED***
          <div 
            className="px-4 py-3 border-b rounded-t-xl"
            style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)' ***REMOVED******REMOVED***
          >
            <div className="flex items-center">
              <Calendar size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
              <h3 className="font-semibold">***REMOVED***formatearFecha(fechaSeleccionada)***REMOVED***</h3>
            </div>
          </div>
          
          ***REMOVED***/* Lista de turnos */***REMOVED***
          <div className="p-4 space-y-3">
            ***REMOVED***turnos.map(turno => ***REMOVED***
              const trabajo = obtenerTrabajo(turno.trabajoId);
              if (!trabajo) return null;
              
              return (
                <TarjetaTurno
                  key=***REMOVED***turno.id***REMOVED***
                  turno=***REMOVED***turno***REMOVED***
                  trabajo=***REMOVED***trabajo***REMOVED***
                  onEdit=***REMOVED***() => ***REMOVED******REMOVED******REMOVED*** 
                  onDelete=***REMOVED***() => ***REMOVED******REMOVED******REMOVED*** 
                />
              );
            ***REMOVED***)***REMOVED***
            
            ***REMOVED***/* Total del día */***REMOVED***
            <div 
              className="flex justify-between px-4 py-3 rounded-lg mt-4"
              style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.transparent5 || 'rgba(0,0,0,0.05)' ***REMOVED******REMOVED***
            >
              <span className="font-semibold">Total del día:</span>
              <span 
                className="font-semibold"
                style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
              >
                $***REMOVED***calcularTotalDia(turnos).toFixed(2)***REMOVED***
              </span>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="text-center py-6">
          <Calendar size=***REMOVED***48***REMOVED*** className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">No hay turnos para esta fecha</p>
          <Button
            onClick=***REMOVED***() => onNuevoTurno(new Date(fechaSeleccionada + 'T12:00:00'))***REMOVED***
            className="flex items-center gap-2"
            icon=***REMOVED***PlusCircle***REMOVED***
          >
            Agregar turno
          </Button>
        </Card>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default CalendarDaySummary;