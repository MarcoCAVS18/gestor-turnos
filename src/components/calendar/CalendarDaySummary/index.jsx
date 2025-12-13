// src/components/calendar/CalendarDaySummary/index.jsx

import React, { useMemo } from 'react';
import { PlusCircle, Calendar, Clock, DollarSign, SearchX } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { formatCurrency } from '../../../utils/currency';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { createSafeDate } from '../../../utils/time';
import TarjetaTurno from '../../cards/shift/TarjetaTurno';
import TarjetaTurnoDelivery from '../../cards/shift/TarjetaTurnoDelivery';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';
import { getShiftGrossEarnings } from '../../../utils/shiftUtils';

const CalendarDaySummary = ({ 
  fechaSeleccionada, 
  turnos, 
  formatearFecha, 
  onNuevoTurno,
  onEdit,
  onDelete
}) => {
  const { todosLosTrabajos, calculatePayment, thematicColors } = useApp();
  const isMobile = useIsMobile();

  // Función para calcular total del día
  const calcularTotalDia = (turnosList) => {
    if (!Array.isArray(turnosList)) return 0;
    
    return turnosList.reduce((total, turno) => {
      if (!turno) return total;
      
      try {
        if (turno.tipo === 'delivery') {
          return total + getShiftGrossEarnings(turno);
        } else {
          const resultado = calculatePayment ? calculatePayment(turno) : { totalWithDiscount: 0 };
          return total + (resultado.totalWithDiscount || resultado.totalConDescuento || 0);
        }
      } catch (error) {
        console.warn('Error calculando pago para turno:', turno.id, error);
        return total;
      }
    }, 0);
  };

  // Función para obtener trabajo de forma segura
  const obtenerTrabajo = (trabajoId) => {
    if (!todosLosTrabajos || !Array.isArray(todosLosTrabajos)) return null;
    return todosLosTrabajos.find(t => t && t.id === trabajoId) || null;
  };

  const shortFormattedDate = useMemo(() => {
    if (!fechaSeleccionada) return '';

    const dateObj = createSafeDate(fechaSeleccionada);
    
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    
    let prefix = '';
    if (dateObj.toDateString() === hoy.toDateString()) {
        prefix = 'Hoy, ';
    } else if (dateObj.toDateString() === ayer.toDateString()) {
        prefix = 'Ayer, ';
    }

    const formatted = dateObj.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
    
    return prefix + formatted;
  }, [fechaSeleccionada]);



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
      
      {turnosSegurosDia.length > 0 ? (
        <Card className="overflow-hidden" padding="none">
          {/* Header del día */}
          <div 
            className="px-4 py-3 border-b rounded-t-xl"
            style={{ backgroundColor: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)' }}
          >
            <Flex variant="between" className="flex items-center">
              <div className="flex items-center">
                <Calendar size={18} style={{ color: thematicColors?.base || '#EC4899' }} className="mr-2" />
                <h3 className="font-semibold">
                  {isMobile ? shortFormattedDate : (formatearFecha ? formatearFecha(fechaSeleccionada) : fechaSeleccionada)}
                </h3>
              </div>
              <div className="flex items-center text-sm">
                <Clock size={14} className="mr-1 text-blue-500" />
                <span className="mr-3">{turnosSegurosDia.length} turno{turnosSegurosDia.length !== 1 ? 's' : ''}</span>
                <DollarSign size={14} className="mr-1 text-green-500" />
                <span className="font-medium">{formatCurrency(totalDia)}</span>
              </div>
            </Flex>
          </div>
          
          {/* Grid de turnos - 3 columnas */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {turnosSegurosDia.map(turno => {
              const trabajo = obtenerTrabajo(turno.trabajoId);
              
              // Si no encontramos el trabajo, mostrar información limitada
              if (!trabajo) {
                return (
                  <div key={turno.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <Flex variant="between">
                      <div>
                        <p className="font-medium text-gray-600">Trabajo eliminado</p>
                        <p className="text-sm text-gray-500">
                          {turno.horaInicio} - {turno.horaFin}
                        </p>
                      </div>
                      <span className="text-sm text-gray-400">
                        {turno.tipo === 'delivery' ? formatCurrency(turno.gananciaTotal || 0) : '--'}
                      </span>
                    </Flex>
                  </div>
                );
              }
              
              // Determinar qué componente usar
              const TarjetaComponent = (turno.tipo === 'delivery' || trabajo.tipo === 'delivery') 
                ? TarjetaTurnoDelivery 
                : TarjetaTurno;
              
              return (
                <div key={turno.id} className="w-full">
                  <TarjetaComponent
                    turno={turno}
                    trabajo={trabajo}
                    fecha={fechaSeleccionada}
                    onEdit={() => onEdit(turno)}
                    onDelete={() => onDelete(turno)}
                    variant="compact"
                  />
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="text-center py-6">
          <SearchX size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">
            No hay turnos para {
              formatearFecha ? (
                (() => {
                  const formattedDate = formatearFecha(fechaSeleccionada);
                  if (formattedDate.startsWith('Hoy') || formattedDate.startsWith('Ayer')) {
                    return formattedDate;
                  }
                  return `el ${formattedDate}`;
                })()
              ) : 'esta fecha'
            }
          </p>
          <Button
            onClick={() => onNuevoTurno?.(new Date(fechaSeleccionada + 'T12:00:00'))}
            className="flex items-center gap-2 mx-auto"
            icon={PlusCircle}
            themeColor={thematicColors?.base}
          >
            Agregar turno
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CalendarDaySummary;