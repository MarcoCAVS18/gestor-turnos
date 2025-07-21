// src/components/calendar/CalendarDaySummary/index.jsx

import React from 'react';
import ***REMOVED*** PlusCircle, Calendar, Moon, Sun ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** obtenerTipoTurnoEnFecha ***REMOVED*** from '../../../utils/calendarUtils';
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
  // Obtener TODOS los trabajos (tradicionales + delivery) y la función de cálculo
  const ***REMOVED*** trabajos, trabajosDelivery, calculatePayment, thematicColors ***REMOVED*** = useApp();

  const calcularTotalDia = (turnosList) => ***REMOVED***
    if (!Array.isArray(turnosList) || turnosList.length === 0) ***REMOVED***
      return 0;
    ***REMOVED***

    return turnosList.reduce((total, turno) => ***REMOVED***
      try ***REMOVED***
        if (turno.tipo === 'delivery') ***REMOVED***
          // Para turnos de delivery, usar gananciaTotal directamente
          const gananciaTotal = turno.gananciaTotal || 0;
          return total + gananciaTotal;
        ***REMOVED*** else ***REMOVED***
          // Para turnos tradicionales, usar calculatePayment
          if (typeof calculatePayment === 'function') ***REMOVED***
            const resultado = calculatePayment(turno);
            const ganancia = resultado.totalWithDiscount || resultado.totalConDescuento || 0;
            return total + ganancia;
          ***REMOVED*** else ***REMOVED***
            console.warn('calculatePayment no está disponible');
            return total;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED*** catch (error) ***REMOVED***
        console.error('Error calculando pago para turno:', turno.id, error);
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

  // Agrupar turnos por tipo (normales vs nocturnos)
  const turnosAgrupados = turnosValidos.reduce((grupos, turno) => ***REMOVED***
    const tipoTurno = obtenerTipoTurnoEnFecha(turno, fechaSeleccionada);
    
    if (tipoTurno === 'inicio-nocturno') ***REMOVED***
      grupos.inicianHoy.push(turno);
    ***REMOVED*** else if (tipoTurno === 'fin-nocturno') ***REMOVED***
      grupos.terminanHoy.push(turno);
    ***REMOVED*** else ***REMOVED***
      grupos.completos.push(turno);
    ***REMOVED***
    
    return grupos;
  ***REMOVED***, ***REMOVED*** completos: [], inicianHoy: [], terminanHoy: [] ***REMOVED***);

  // NUEVO: Función mejorada para manejar el click de nuevo turno
  const handleNuevoTurno = () => ***REMOVED***
    // Convertir fechaSeleccionada (string) a Date object
    const fechaDate = new Date(fechaSeleccionada + 'T12:00:00');
    onNuevoTurno(fechaDate);
  ***REMOVED***;

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">
          Turnos del día seleccionado
        </h3>
        <Button
          onClick=***REMOVED***handleNuevoTurno***REMOVED***
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
          <div className="p-4 space-y-4">
            
            ***REMOVED***/* Turnos que terminan hoy (empezaron ayer) */***REMOVED***
            ***REMOVED***turnosAgrupados.terminanHoy.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Moon size=***REMOVED***16***REMOVED*** className="text-blue-600 mr-2" />
                  <h4 className="text-sm font-medium text-blue-800">Turnos que terminan hoy</h4>
                </div>
                <div className="space-y-2 ml-6">
                  ***REMOVED***turnosAgrupados.terminanHoy.map(turno => ***REMOVED***
                    const trabajo = obtenerTrabajo(turno.trabajoId);
                    if (!trabajo) return null;

                    return (
                      <div key=***REMOVED***turno.id***REMOVED*** className="border-l-2 border-blue-300 pl-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">***REMOVED***trabajo.nombre***REMOVED***</p>
                            <p className="text-xs text-gray-600">
                              Empezó: ***REMOVED***new Date(turno.fechaInicio + 'T00:00:00').toLocaleDateString('es-ES', ***REMOVED*** 
                                weekday: 'short', day: 'numeric', month: 'short' 
                              ***REMOVED***)***REMOVED*** ***REMOVED***turno.horaInicio***REMOVED*** - Termina: ***REMOVED***turno.horaFin***REMOVED***
                            </p>
                          </div>
                          ***REMOVED***turno.tipo === 'delivery' && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              $***REMOVED***turno.gananciaTotal || 0***REMOVED***
                            </span>
                          )***REMOVED***
                        </div>
                      </div>
                    );
                  ***REMOVED***)***REMOVED***
                </div>
              </div>
            )***REMOVED***

            ***REMOVED***/* Turnos completos en el día */***REMOVED***
            ***REMOVED***turnosAgrupados.completos.length > 0 && (
              <div>
                ***REMOVED***(turnosAgrupados.terminanHoy.length > 0 || turnosAgrupados.inicianHoy.length > 0) && (
                  <div className="flex items-center mb-2">
                    <Sun size=***REMOVED***16***REMOVED*** className="text-orange-600 mr-2" />
                    <h4 className="text-sm font-medium text-orange-800">Turnos completos del día</h4>
                  </div>
                )***REMOVED***
                <div className="space-y-3">
                  ***REMOVED***turnosAgrupados.completos.map(turno => ***REMOVED***
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
                </div>
              </div>
            )***REMOVED***

            ***REMOVED***/* Turnos que inician hoy (terminan mañana) */***REMOVED***
            ***REMOVED***turnosAgrupados.inicianHoy.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Moon size=***REMOVED***16***REMOVED*** className="text-purple-600 mr-2" />
                  <h4 className="text-sm font-medium text-purple-800">Turnos nocturnos (terminan mañana)</h4>
                </div>
                <div className="space-y-2 ml-6">
                  ***REMOVED***turnosAgrupados.inicianHoy.map(turno => ***REMOVED***
                    const trabajo = obtenerTrabajo(turno.trabajoId);
                    if (!trabajo) return null;

                    return (
                      <div key=***REMOVED***turno.id***REMOVED*** className="border-l-2 border-purple-300 pl-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">***REMOVED***trabajo.nombre***REMOVED***</p>
                            <p className="text-xs text-gray-600">
                              Inicia: ***REMOVED***turno.horaInicio***REMOVED*** - Termina: ***REMOVED***new Date(turno.fechaFin + 'T00:00:00').toLocaleDateString('es-ES', ***REMOVED*** 
                                weekday: 'short', day: 'numeric', month: 'short' 
                              ***REMOVED***)***REMOVED*** ***REMOVED***turno.horaFin***REMOVED***
                            </p>
                          </div>
                          ***REMOVED***turno.tipo === 'delivery' && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              $***REMOVED***turno.gananciaTotal || 0***REMOVED***
                            </span>
                          )***REMOVED***
                        </div>
                      </div>
                    );
                  ***REMOVED***)***REMOVED***
                </div>
              </div>
            )***REMOVED***
            
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
            onClick=***REMOVED***handleNuevoTurno***REMOVED***
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