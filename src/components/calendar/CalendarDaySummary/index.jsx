// src/components/calendar/CalendarDaySummary/index.jsx - Versión corregida

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
  const ***REMOVED*** todosLosTrabajos, calcularPago, coloresTemáticos ***REMOVED*** = useApp();

  console.log('📅 CalendarDaySummary - Datos recibidos:', ***REMOVED***
    fechaSeleccionada,
    turnosCount: turnos?.length || 0,
    trabajosCount: todosLosTrabajos?.length || 0,
    tieneCalcularPago: typeof calcularPago === 'function'
  ***REMOVED***);

  const calcularTotalDia = (turnosList) => ***REMOVED***
    if (!Array.isArray(turnosList) || turnosList.length === 0) ***REMOVED***
      return 0;
    ***REMOVED***

    return turnosList.reduce((total, turno) => ***REMOVED***
      try ***REMOVED***
        if (turno.tipo === 'delivery') ***REMOVED***
          // Para turnos de delivery, usar directamente la ganancia total
          const gananciaTotal = turno.gananciaTotal || 0;
          console.log('📅 Turno delivery en calendario:', ***REMOVED***
            id: turno.id,
            gananciaTotal,
            propinas: turno.propinas || 0
          ***REMOVED***);
          return total + gananciaTotal;
        ***REMOVED*** else ***REMOVED***
          // Para turnos tradicionales, usar calcularPago
          if (typeof calcularPago === 'function') ***REMOVED***
            const ***REMOVED*** totalConDescuento ***REMOVED*** = calcularPago(turno);
            console.log('📅 Turno tradicional en calendario:', ***REMOVED***
              id: turno.id,
              totalConDescuento
            ***REMOVED***);
            return total + totalConDescuento;
          ***REMOVED*** else ***REMOVED***
            console.warn('⚠️ calcularPago no es una función válida');
            return total;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED*** catch (error) ***REMOVED***
        console.error('❌ Error calculando turno:', turno.id, error);
        return total;
      ***REMOVED***
    ***REMOVED***, 0);
  ***REMOVED***;

  const obtenerTrabajo = (trabajoId) => ***REMOVED***
    const trabajo = todosLosTrabajos?.find(t => t.id === trabajoId);
    if (!trabajo) ***REMOVED***
      console.warn('⚠️ Trabajo no encontrado en calendario:', trabajoId);
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
        >
          Nuevo
        </Button>
      </div>
      
      ***REMOVED***turnosValidos.length > 0 ? (
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
            ***REMOVED***turnosValidos.map(turno => ***REMOVED***
              const trabajo = obtenerTrabajo(turno.trabajoId);
              if (!trabajo) ***REMOVED***
                // Mostrar un placeholder si no se encuentra el trabajo
                return (
                  <div key=***REMOVED***turno.id***REMOVED*** className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">
                      ⚠️ Trabajo no encontrado (ID: ***REMOVED***turno.trabajoId***REMOVED***)
                    </p>
                    <p className="text-xs text-gray-500">
                      ***REMOVED***turno.fecha***REMOVED*** • ***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***
                    </p>
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
              style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.transparent5 || 'rgba(0,0,0,0.05)' ***REMOVED******REMOVED***
            >
              <span className="font-semibold">Total del día:</span>
              <span 
                className="font-semibold"
                style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
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
          >
            Agregar turno
          </Button>
        </Card>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default CalendarDaySummary;