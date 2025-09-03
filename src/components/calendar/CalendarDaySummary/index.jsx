// src/components/calendar/CalendarDaySummary/index.jsx - Corregido sin duplicaciones

import React from 'react';
import ***REMOVED*** PlusCircle, Calendar, Clock, DollarSign ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import TarjetaTurno from '../../cards/TarjetaTurno';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const CalendarDaySummary = (***REMOVED*** 
  fechaSeleccionada, 
  turnos, 
  formatearFecha, 
  onNuevoTurno 
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** todosLosTrabajos, calculatePayment, thematicColors ***REMOVED*** = useApp();

  // Función para calcular total del día
  const calcularTotalDia = (turnosList) => ***REMOVED***
    if (!Array.isArray(turnosList)) return 0;
    
    return turnosList.reduce((total, turno) => ***REMOVED***
      if (!turno) return total;
      
      try ***REMOVED***
        if (turno.tipo === 'delivery') ***REMOVED***
          return total + (turno.gananciaTotal || 0);
        ***REMOVED*** else ***REMOVED***
          const resultado = calculatePayment ? calculatePayment(turno) : ***REMOVED*** totalWithDiscount: 0 ***REMOVED***;
          return total + (resultado.totalWithDiscount || resultado.totalConDescuento || 0);
        ***REMOVED***
      ***REMOVED*** catch (error) ***REMOVED***
        console.warn('Error calculando pago para turno:', turno.id, error);
        return total;
      ***REMOVED***
    ***REMOVED***, 0);
  ***REMOVED***;

  // Función para obtener trabajo de forma segura
  const obtenerTrabajo = (trabajoId) => ***REMOVED***
    if (!todosLosTrabajos || !Array.isArray(todosLosTrabajos)) return null;
    return todosLosTrabajos.find(t => t && t.id === trabajoId) || null;
  ***REMOVED***;

  // Validar que tenemos fecha seleccionada
  if (!fechaSeleccionada) ***REMOVED***
    return (
      <Card className="mt-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Selecciona un día
          </h3>
          <p className="text-gray-500">
            Haz clic en cualquier día del calendario para ver los turnos
          </p>
        </div>
      </Card>
    );
  ***REMOVED***

  // Validar y filtrar turnos
  const turnosSegurosDia = Array.isArray(turnos) ? turnos.filter(turno => turno && turno.id) : [];
  const totalDia = calcularTotalDia(turnosSegurosDia);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">
          Turnos del día seleccionado
        </h3>
        <Button
          onClick=***REMOVED***() => onNuevoTurno?.(new Date(fechaSeleccionada + 'T12:00:00'))***REMOVED***
          size="sm"
          className="flex items-center gap-1"
          icon=***REMOVED***PlusCircle***REMOVED***
          themeColor=***REMOVED***thematicColors?.base***REMOVED***
        >
          Nuevo
        </Button>
      </div>
      
      ***REMOVED***turnosSegurosDia.length > 0 ? (
        <Card className="overflow-hidden" padding="none">
          ***REMOVED***/* Header del día */***REMOVED***
          <div 
            className="px-4 py-3 border-b rounded-t-xl"
            style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)' ***REMOVED******REMOVED***
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
                <h3 className="font-semibold">
                  ***REMOVED***formatearFecha ? formatearFecha(fechaSeleccionada) : fechaSeleccionada***REMOVED***
                </h3>
              </div>
              <div className="flex items-center text-sm">
                <Clock size=***REMOVED***14***REMOVED*** className="mr-1 text-blue-500" />
                <span className="mr-3">***REMOVED***turnosSegurosDia.length***REMOVED*** turno***REMOVED***turnosSegurosDia.length !== 1 ? 's' : ''***REMOVED***</span>
                <DollarSign size=***REMOVED***14***REMOVED*** className="mr-1 text-green-500" />
                <span className="font-medium">***REMOVED***formatCurrency(totalDia)***REMOVED***</span>
              </div>
            </div>
          </div>
          
          ***REMOVED***/* Grid de turnos - 3 columnas */***REMOVED***
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ***REMOVED***turnosSegurosDia.map(turno => ***REMOVED***
              const trabajo = obtenerTrabajo(turno.trabajoId);
              
              // Si no encontramos el trabajo, mostrar información limitada
              if (!trabajo) ***REMOVED***
                return (
                  <div key=***REMOVED***turno.id***REMOVED*** className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-600">Trabajo eliminado</p>
                        <p className="text-sm text-gray-500">
                          ***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***
                        </p>
                      </div>
                      <span className="text-sm text-gray-400">
                        ***REMOVED***turno.tipo === 'delivery' ? formatCurrency(turno.gananciaTotal || 0) : '--'***REMOVED***
                      </span>
                    </div>
                  </div>
                );
              ***REMOVED***
              
              return (
                <div key=***REMOVED***turno.id***REMOVED*** className="w-full">
                  <TarjetaTurno
                    turno=***REMOVED***turno***REMOVED***
                    trabajo=***REMOVED***trabajo***REMOVED***
                    onEdit=***REMOVED***() => ***REMOVED******REMOVED******REMOVED*** 
                    onDelete=***REMOVED***() => ***REMOVED******REMOVED******REMOVED***
                    variant="compact"
                  />
                </div>
              );
            ***REMOVED***)***REMOVED***
          </div>
        </Card>
      ) : (
        <Card className="text-center py-6">
          <Calendar size=***REMOVED***48***REMOVED*** className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">
            No hay turnos para ***REMOVED***formatearFecha ? formatearFecha(fechaSeleccionada) : 'esta fecha'***REMOVED***
          </p>
          <Button
            onClick=***REMOVED***() => onNuevoTurno?.(new Date(fechaSeleccionada + 'T12:00:00'))***REMOVED***
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