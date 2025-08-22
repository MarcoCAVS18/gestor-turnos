// src/components/calendar/CalendarDaySummary/index.jsx - Versión con validaciones defensivas

import React from 'react';
import ***REMOVED*** Plus, Clock, DollarSign ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const CalendarDaySummary = (***REMOVED*** fechaSeleccionada, turnos, formatearFecha, onNuevoTurno ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** todosLosTrabajos, calculatePayment, thematicColors ***REMOVED*** = useApp();

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

  const turnosSegurosDia = Array.isArray(turnos) ? turnos : [];

  // Calcular total del día de forma defensiva
  const totalDia = turnosSegurosDia.reduce((total, turno) => ***REMOVED***
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

  const horasTotal = turnosSegurosDia.reduce((total, turno) => ***REMOVED***
    if (!turno || !turno.horaInicio || !turno.horaFin) return total;
    
    try ***REMOVED***
      const [horaIni, minIni] = turno.horaInicio.split(':').map(Number);
      const [horaFin, minFin] = turno.horaFin.split(':').map(Number);
      
      let horas = (horaFin + minFin/60) - (horaIni + minIni/60);
      if (horas < 0) horas += 24;
      
      return total + horas;
    ***REMOVED*** catch (error) ***REMOVED***
      console.warn('Error calculando horas para turno:', turno.id, error);
      return total;
    ***REMOVED***
  ***REMOVED***, 0);

  return (
    <Card className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          ***REMOVED***formatearFecha ? formatearFecha(fechaSeleccionada) : fechaSeleccionada***REMOVED***
        </h3>
        <Button
          onClick=***REMOVED***() => onNuevoTurno?.(new Date(fechaSeleccionada + 'T00:00:00'))***REMOVED***
          size="sm"
          icon=***REMOVED***Plus***REMOVED***
          themeColor=***REMOVED***thematicColors?.base***REMOVED***
        >
          Agregar turno
        </Button>
      </div>

      ***REMOVED***turnosSegurosDia.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-4">No hay turnos programados para este día</p>
          <Button
            onClick=***REMOVED***() => onNuevoTurno?.(new Date(fechaSeleccionada + 'T00:00:00'))***REMOVED***
            themeColor=***REMOVED***thematicColors?.base***REMOVED***
          >
            Agregar primer turno
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          ***REMOVED***/* Resumen del día */***REMOVED***
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Clock size=***REMOVED***16***REMOVED*** className="text-blue-500 mr-2" />
                <span className="text-sm font-medium">
                  ***REMOVED***horasTotal.toFixed(1)***REMOVED*** horas
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign size=***REMOVED***16***REMOVED*** className="text-green-500 mr-2" />
                <span className="text-sm font-medium">
                  ***REMOVED***formatCurrency(totalDia)***REMOVED***
                </span>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              ***REMOVED***turnosSegurosDia.length***REMOVED*** turno***REMOVED***turnosSegurosDia.length !== 1 ? 's' : ''***REMOVED***
            </span>
          </div>

          ***REMOVED***/* Lista de turnos */***REMOVED***
          <div className="space-y-3">
            ***REMOVED***turnosSegurosDia.map((turno, index) => ***REMOVED***
              if (!turno) return null;
              
              // Buscar trabajo de forma defensiva
              const trabajo = todosLosTrabajos?.find(t => t && t.id === turno.trabajoId);
              
              return (
                <div key=***REMOVED***turno.id || index***REMOVED*** className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style=***REMOVED******REMOVED*** 
                        backgroundColor: trabajo?.color || trabajo?.colorAvatar || '#6B7280' 
                      ***REMOVED******REMOVED***
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        ***REMOVED***trabajo?.nombre || 'Trabajo eliminado'***REMOVED***
                      </h4>
                      <p className="text-sm text-gray-500">
                        ***REMOVED***turno.horaInicio || '--:--'***REMOVED*** - ***REMOVED***turno.horaFin || '--:--'***REMOVED***
                        ***REMOVED***turno.tipo === 'delivery' && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs">
                            Delivery
                          </span>
                        )***REMOVED***
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    ***REMOVED***turno.tipo === 'delivery' ? (
                      <span className="font-medium text-green-600">
                        ***REMOVED***formatCurrency(turno.gananciaTotal || 0)***REMOVED***
                      </span>
                    ) : (
                      <span className="font-medium" style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED***>
                        ***REMOVED***turno.horaInicio && turno.horaFin ? (
                          (() => ***REMOVED***
                            try ***REMOVED***
                              const resultado = calculatePayment ? calculatePayment(turno) : ***REMOVED*** totalWithDiscount: 0 ***REMOVED***;
                              return formatCurrency(resultado.totalWithDiscount || resultado.totalConDescuento || 0);
                            ***REMOVED*** catch (error) ***REMOVED***
                              return formatCurrency(0);
                            ***REMOVED***
                          ***REMOVED***)()
                        ) : (
                          formatCurrency(0)
                        )***REMOVED***
                      </span>
                    )***REMOVED***
                  </div>
                </div>
              );
            ***REMOVED***)***REMOVED***
          </div>
        </div>
      )***REMOVED***
    </Card>
  );
***REMOVED***;

export default CalendarDaySummary;