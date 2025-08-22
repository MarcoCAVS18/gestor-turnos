// src/components/calendar/CalendarDaySummary/index.jsx - Versión limpia sin cuadrante innecesario

import React from 'react';
import ***REMOVED*** PlusCircle, Calendar ***REMOVED*** from 'lucide-react';
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

  // Validar y filtrar turnos
  const turnosSegurosDia = Array.isArray(turnos) ? turnos.filter(turno => turno && turno.id) : [];
  const totalDia = calcularTotalDia(turnosSegurosDia);

  // SIEMPRE mostramos algo si hay día seleccionado
  if (!fechaSeleccionada) ***REMOVED***
    return null;
  ***REMOVED***

  return (
    <Card>
      ***REMOVED***/* Solo mostrar header con información si HAY turnos */***REMOVED***
      ***REMOVED***turnosSegurosDia.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Calendar size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED*** />
              <div>
                <h3 className="font-semibold text-gray-800">
                  ***REMOVED***formatearFecha ? formatearFecha(fechaSeleccionada) : fechaSeleccionada***REMOVED***
                </h3>
                <p className="text-sm text-gray-600">
                  ***REMOVED***turnosSegurosDia.length***REMOVED*** turno***REMOVED***turnosSegurosDia.length !== 1 ? 's' : ''***REMOVED*** programado***REMOVED***turnosSegurosDia.length !== 1 ? 's' : ''***REMOVED***
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-lg font-bold" style=***REMOVED******REMOVED*** color: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED***>
                  ***REMOVED***formatCurrency(totalDia)***REMOVED***
                </p>
                <p className="text-xs text-gray-500">Total del día</p>
              </div>
              
              <Button
                onClick=***REMOVED***() => onNuevoTurno?.(new Date(fechaSeleccionada + 'T12:00:00'))***REMOVED***
                size="sm"
                variant="outline"
                icon=***REMOVED***PlusCircle***REMOVED***
                themeColor=***REMOVED***thematicColors?.base***REMOVED***
              >
                Agregar
              </Button>
            </div>
          </div>
          
          ***REMOVED***/* Grid de turnos - 3 columnas en desktop, 1 en móvil */***REMOVED***
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            ***REMOVED***turnosSegurosDia.map(turno => ***REMOVED***
              const trabajo = obtenerTrabajo(turno.trabajoId);
              
              // Si no encontramos el trabajo, mostrar información limitada
              if (!trabajo) ***REMOVED***
                return (
                  <div key=***REMOVED***turno.id***REMOVED*** className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-gray-400 mr-2" />
                        <p className="font-medium text-gray-600 text-sm">Trabajo eliminado</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        ***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***
                      </p>
                      <p className="text-sm font-medium text-gray-400">
                        ***REMOVED***turno.tipo === 'delivery' ? formatCurrency(turno.gananciaTotal || 0) : '--'***REMOVED***
                      </p>
                    </div>
                  </div>
                );
              ***REMOVED***
              
              return (
                <div key=***REMOVED***turno.id***REMOVED*** className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <TarjetaTurno
                    turno=***REMOVED***turno***REMOVED***
                    trabajo=***REMOVED***trabajo***REMOVED***
                    onEdit=***REMOVED***() => ***REMOVED******REMOVED******REMOVED*** 
                    onDelete=***REMOVED***() => ***REMOVED******REMOVED******REMOVED***
                    variant="compact"
                    showActions=***REMOVED***false***REMOVED***
                  />
                </div>
              );
            ***REMOVED***)***REMOVED***
          </div>
        </>
      ) : (
        /* Si NO hay turnos, mostrar estado vacío */
        <div className="text-center py-8">
          <Calendar size=***REMOVED***48***REMOVED*** className="mx-auto mb-4 text-gray-300" />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">
            Sin turnos para ***REMOVED***formatearFecha ? formatearFecha(fechaSeleccionada) : fechaSeleccionada***REMOVED***
          </h4>
          <p className="text-gray-500 mb-4">
            ¿Trabajaste este día? Agrega un turno para registrar tus horas
          </p>
          <Button
            onClick=***REMOVED***() => onNuevoTurno?.(new Date(fechaSeleccionada + 'T12:00:00'))***REMOVED***
            icon=***REMOVED***PlusCircle***REMOVED***
            themeColor=***REMOVED***thematicColors?.base***REMOVED***
          >
            Agregar turno
          </Button>
        </div>
      )***REMOVED***
    </Card>
  );
***REMOVED***;

export default CalendarDaySummary;