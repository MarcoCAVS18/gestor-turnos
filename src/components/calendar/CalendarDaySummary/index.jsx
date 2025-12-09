// src/components/calendar/CalendarDaySummary/index.jsx

import React, ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** PlusCircle, Calendar, Clock, DollarSign, SearchX ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../hooks/useIsMobile';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../../../utils/time';
import TarjetaTurno from '../../cards/shift/TarjetaTurno';
import TarjetaTurnoDelivery from '../../cards/shift/TarjetaTurnoDelivery';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';

const CalendarDaySummary = (***REMOVED*** 
  fechaSeleccionada, 
  turnos, 
  formatearFecha, 
  onNuevoTurno,
  onEdit,
  onDelete
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** todosLosTrabajos, calculatePayment, thematicColors ***REMOVED*** = useApp();
  const isMobile = useIsMobile();

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

  const shortFormattedDate = useMemo(() => ***REMOVED***
    if (!fechaSeleccionada) return '';

    const dateObj = createSafeDate(fechaSeleccionada);
    
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    
    let prefix = '';
    if (dateObj.toDateString() === hoy.toDateString()) ***REMOVED***
        prefix = 'Hoy, ';
    ***REMOVED*** else if (dateObj.toDateString() === ayer.toDateString()) ***REMOVED***
        prefix = 'Ayer, ';
    ***REMOVED***

    const formatted = dateObj.toLocaleDateString('es-ES', ***REMOVED***
      month: 'short',
      day: 'numeric'
    ***REMOVED***);
    
    return prefix + formatted;
  ***REMOVED***, [fechaSeleccionada]);



  // Validar y filtrar turnos
  const turnosSegurosDia = Array.isArray(turnos) ? turnos.filter(turno => turno && turno.id) : [];
  const totalDia = calcularTotalDia(turnosSegurosDia);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">
          Turnos del día seleccionado
        </h3>
      </div>
      
      ***REMOVED***turnosSegurosDia.length > 0 ? (
        <Card className="overflow-hidden" padding="none">
          ***REMOVED***/* Header del día */***REMOVED***
          <div 
            className="px-4 py-3 border-b rounded-t-xl"
            style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)' ***REMOVED******REMOVED***
          >
            <Flex variant="between" className="flex items-center">
              <div className="flex items-center">
                <Calendar size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
                <h3 className="font-semibold">
                  ***REMOVED***isMobile ? shortFormattedDate : (formatearFecha ? formatearFecha(fechaSeleccionada) : fechaSeleccionada)***REMOVED***
                </h3>
              </div>
              <div className="flex items-center text-sm">
                <Clock size=***REMOVED***14***REMOVED*** className="mr-1 text-blue-500" />
                <span className="mr-3">***REMOVED***turnosSegurosDia.length***REMOVED*** turno***REMOVED***turnosSegurosDia.length !== 1 ? 's' : ''***REMOVED***</span>
                <DollarSign size=***REMOVED***14***REMOVED*** className="mr-1 text-green-500" />
                <span className="font-medium">***REMOVED***formatCurrency(totalDia)***REMOVED***</span>
              </div>
            </Flex>
          </div>
          
          ***REMOVED***/* Grid de turnos - 3 columnas */***REMOVED***
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ***REMOVED***turnosSegurosDia.map(turno => ***REMOVED***
              const trabajo = obtenerTrabajo(turno.trabajoId);
              
              // Si no encontramos el trabajo, mostrar información limitada
              if (!trabajo) ***REMOVED***
                return (
                  <div key=***REMOVED***turno.id***REMOVED*** className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <Flex variant="between">
                      <div>
                        <p className="font-medium text-gray-600">Trabajo eliminado</p>
                        <p className="text-sm text-gray-500">
                          ***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***
                        </p>
                      </div>
                      <span className="text-sm text-gray-400">
                        ***REMOVED***turno.tipo === 'delivery' ? formatCurrency(turno.gananciaTotal || 0) : '--'***REMOVED***
                      </span>
                    </Flex>
                  </div>
                );
              ***REMOVED***
              
              // Determinar qué componente usar
              const TarjetaComponent = (turno.tipo === 'delivery' || trabajo.tipo === 'delivery') 
                ? TarjetaTurnoDelivery 
                : TarjetaTurno;
              
              return (
                <div key=***REMOVED***turno.id***REMOVED*** className="w-full">
                  <TarjetaComponent
                    turno=***REMOVED***turno***REMOVED***
                    trabajo=***REMOVED***trabajo***REMOVED***
                    fecha=***REMOVED***fechaSeleccionada***REMOVED***
                    onEdit=***REMOVED***() => onEdit(turno)***REMOVED***
                    onDelete=***REMOVED***() => onDelete(turno)***REMOVED***
                    variant="compact"
                  />
                </div>
              );
            ***REMOVED***)***REMOVED***
          </div>
        </Card>
      ) : (
        <Card className="text-center py-6">
          <SearchX size=***REMOVED***48***REMOVED*** className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">
            No hay turnos para ***REMOVED***
              formatearFecha ? (
                (() => ***REMOVED***
                  const formattedDate = formatearFecha(fechaSeleccionada);
                  if (formattedDate.startsWith('Hoy') || formattedDate.startsWith('Ayer')) ***REMOVED***
                    return formattedDate;
                  ***REMOVED***
                  return `el $***REMOVED***formattedDate***REMOVED***`;
                ***REMOVED***)()
              ) : 'esta fecha'
            ***REMOVED***
          </p>
          <Button
            onClick=***REMOVED***() => onNuevoTurno?.(new Date(fechaSeleccionada + 'T12:00:00'))***REMOVED***
            className="flex items-center gap-2 mx-auto"
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