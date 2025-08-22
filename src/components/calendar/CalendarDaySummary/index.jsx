// src/components/calendar/CalendarDaySummary/index.jsx - Versión limpia sin cuadrante innecesario

import React from 'react';
import { PlusCircle, Calendar } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { formatCurrency } from '../../../utils/currency';
import TarjetaTurno from '../../cards/TarjetaTurno';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const CalendarDaySummary = ({ 
  fechaSeleccionada, 
  turnos, 
  formatearFecha, 
  onNuevoTurno 
}) => {
  const { todosLosTrabajos, calculatePayment, thematicColors } = useApp();

  // Función para calcular total del día
  const calcularTotalDia = (turnosList) => {
    if (!Array.isArray(turnosList)) return 0;
    
    return turnosList.reduce((total, turno) => {
      if (!turno) return total;
      
      try {
        if (turno.tipo === 'delivery') {
          return total + (turno.gananciaTotal || 0);
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

  // Validar y filtrar turnos
  const turnosSegurosDia = Array.isArray(turnos) ? turnos.filter(turno => turno && turno.id) : [];
  const totalDia = calcularTotalDia(turnosSegurosDia);

  // SIEMPRE mostramos algo si hay día seleccionado
  if (!fechaSeleccionada) {
    return null;
  }

  return (
    <Card>
      {/* Solo mostrar header con información si HAY turnos */}
      {turnosSegurosDia.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Calendar size={20} style={{ color: thematicColors?.base || '#EC4899' }} />
              <div>
                <h3 className="font-semibold text-gray-800">
                  {formatearFecha ? formatearFecha(fechaSeleccionada) : fechaSeleccionada}
                </h3>
                <p className="text-sm text-gray-600">
                  {turnosSegurosDia.length} turno{turnosSegurosDia.length !== 1 ? 's' : ''} programado{turnosSegurosDia.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-lg font-bold" style={{ color: thematicColors?.base || '#EC4899' }}>
                  {formatCurrency(totalDia)}
                </p>
                <p className="text-xs text-gray-500">Total del día</p>
              </div>
              
              <Button
                onClick={() => onNuevoTurno?.(new Date(fechaSeleccionada + 'T12:00:00'))}
                size="sm"
                variant="outline"
                icon={PlusCircle}
                themeColor={thematicColors?.base}
              >
                Agregar
              </Button>
            </div>
          </div>
          
          {/* Grid de turnos - 3 columnas en desktop, 1 en móvil */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {turnosSegurosDia.map(turno => {
              const trabajo = obtenerTrabajo(turno.trabajoId);
              
              // Si no encontramos el trabajo, mostrar información limitada
              if (!trabajo) {
                return (
                  <div key={turno.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-gray-400 mr-2" />
                        <p className="font-medium text-gray-600 text-sm">Trabajo eliminado</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {turno.horaInicio} - {turno.horaFin}
                      </p>
                      <p className="text-sm font-medium text-gray-400">
                        {turno.tipo === 'delivery' ? formatCurrency(turno.gananciaTotal || 0) : '--'}
                      </p>
                    </div>
                  </div>
                );
              }
              
              return (
                <div key={turno.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <TarjetaTurno
                    turno={turno}
                    trabajo={trabajo}
                    onEdit={() => {}} 
                    onDelete={() => {}}
                    variant="compact"
                    showActions={false}
                  />
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Si NO hay turnos, mostrar estado vacío */
        <div className="text-center py-8">
          <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">
            Sin turnos para {formatearFecha ? formatearFecha(fechaSeleccionada) : fechaSeleccionada}
          </h4>
          <p className="text-gray-500 mb-4">
            ¿Trabajaste este día? Agrega un turno para registrar tus horas
          </p>
          <Button
            onClick={() => onNuevoTurno?.(new Date(fechaSeleccionada + 'T12:00:00'))}
            icon={PlusCircle}
            themeColor={thematicColors?.base}
          >
            Agregar turno
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CalendarDaySummary;