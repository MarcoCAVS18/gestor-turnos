// src/components/calendar/CalendarDaySummary/index.jsx

import React from 'react';
import ***REMOVED*** PlusCircle, Calendar ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import TarjetaTurno from '../../cards/TarjetaTurno';
import TarjetaTurnoDelivery from '../../cards/TarjetaTurnoDelivery';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

const CalendarDaySummary = (***REMOVED*** 
  fechaSeleccionada, 
  turnos, 
  formatearFecha, 
  onNuevoTurno 
***REMOVED***) => ***REMOVED***
  // Obtener TODOS los trabajos (tradicionales + delivery)
  const ***REMOVED*** trabajos, trabajosDelivery, calcularPago, thematicColors ***REMOVED*** = useApp();

  const calcularTotalDia = (turnosList) => ***REMOVED***
    if (!Array.isArray(turnosList) || turnosList.length === 0) ***REMOVED***
      return 0;
    ***REMOVED***

    return turnosList.reduce((total, turno) => ***REMOVED***
      try ***REMOVED***
        if (turno.tipo === 'delivery') ***REMOVED***
          const gananciaTotal = turno.gananciaTotal || 0;
          return total + gananciaTotal;
        ***REMOVED*** else ***REMOVED***
          if (typeof calcularPago === 'function') ***REMOVED***
            const ***REMOVED*** totalConDescuento ***REMOVED*** = calcularPago(turno);
            return total + totalConDescuento;
          ***REMOVED*** else ***REMOVED***
            return total;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED*** catch (error) ***REMOVED***
        return total;
      ***REMOVED***
    ***REMOVED***, 0);
  ***REMOVED***;

  // Función para buscar trabajo en ambos tipos
  const obtenerTrabajo = (trabajoId) => ***REMOVED***
    // Primero buscar en trabajos tradicionales
    let trabajo = trabajos?.find(t => t.id === trabajoId);
    
    // Si no se encuentra, buscar en trabajos de delivery
    if (!trabajo) ***REMOVED***
      trabajo = trabajosDelivery?.find(t => t.id === trabajoId);
    ***REMOVED***
    
    return trabajo;
  ***REMOVED***;

  if (!fechaSeleccionada) return null;

  const turnosValidos = Array.isArray(turnos) ? turnos : [];
  const totalDia = calcularTotalDia(turnosValidos);

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
          themeColor=***REMOVED***thematicColors?.base***REMOVED***
        >
          Nuevo
        </Button>
      </div>
      
      ***REMOVED***turnosValidos.length > 0 ? (
        <Card className="overflow-hidden" padding="none">
          ***REMOVED***/* Header del día */***REMOVED***
          <div 
            className="px-4 py-3 border-b rounded-t-xl"
            style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)' ***REMOVED******REMOVED***
          >
            <div className="flex items-center">
              <Calendar size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
              <h3 className="font-semibold">***REMOVED***formatearFecha(fechaSeleccionada)***REMOVED***</h3>
            </div>
          </div>
          
          ***REMOVED***/* Lista de turnos */***REMOVED***
          <div className="p-4 space-y-3">
            ***REMOVED***turnosValidos.map(turno => ***REMOVED***
              const trabajo = obtenerTrabajo(turno.trabajoId);
              if (!trabajo) ***REMOVED***
                return (
                  <div key=***REMOVED***turno.id***REMOVED*** className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">
                      Trabajo no encontrado
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ID: ***REMOVED***turno.trabajoId***REMOVED***
                    </p>
                    <p className="text-xs text-gray-500">
                      ***REMOVED***turno.fecha***REMOVED*** • ***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***
                    </p>
                    ***REMOVED***turno.tipo === 'delivery' && (
                      <p className="text-xs text-blue-600 mt-1">
                        Turno de Delivery • Ganancia: $***REMOVED***turno.gananciaTotal || 0***REMOVED***
                      </p>
                    )***REMOVED***
                  </div>
                );
              ***REMOVED***

              // Renderizar según el tipo de turno
              if (turno.tipo === 'delivery' || trabajo.tipo === 'delivery') ***REMOVED***
                return (
                  <TarjetaTurnoDelivery
                    key=***REMOVED***turno.id***REMOVED***
                    turno=***REMOVED***turno***REMOVED***
                    trabajo=***REMOVED***trabajo***REMOVED***
                    onEdit=***REMOVED***() => ***REMOVED******REMOVED******REMOVED*** 
                    onDelete=***REMOVED***() => ***REMOVED******REMOVED******REMOVED*** 
                  />
                );
              ***REMOVED***
              
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
              style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent5 || 'rgba(0,0,0,0.05)' ***REMOVED******REMOVED***
            >
              <span className="font-semibold">Total del día:</span>
              <span 
                className="font-semibold"
                style=***REMOVED******REMOVED*** color: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED***
              >
                $***REMOVED***totalDia.toFixed(2)***REMOVED***
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
            themeColor=***REMOVED***thematicColors?.base***REMOVED***
          >
            Agregar turno
          </Button>
        </Card>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default CalendarDaySummary;