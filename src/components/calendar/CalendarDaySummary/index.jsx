// src/components/calendar/CalendarDaySummary/index.jsx - Versión con validaciones defensivas

import React from 'react';
import { Plus, Clock, DollarSign } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const CalendarDaySummary = ({ fechaSeleccionada, turnos, formatearFecha, onNuevoTurno }) => {
  const { todosLosTrabajos, calculatePayment, thematicColors } = useApp();

  if (!fechaSeleccionada) {
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
  }

  const turnosSegurosDia = Array.isArray(turnos) ? turnos : [];

  // Calcular total del día de forma defensiva
  const totalDia = turnosSegurosDia.reduce((total, turno) => {
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

  const horasTotal = turnosSegurosDia.reduce((total, turno) => {
    if (!turno || !turno.horaInicio || !turno.horaFin) return total;
    
    try {
      const [horaIni, minIni] = turno.horaInicio.split(':').map(Number);
      const [horaFin, minFin] = turno.horaFin.split(':').map(Number);
      
      let horas = (horaFin + minFin/60) - (horaIni + minIni/60);
      if (horas < 0) horas += 24;
      
      return total + horas;
    } catch (error) {
      console.warn('Error calculando horas para turno:', turno.id, error);
      return total;
    }
  }, 0);

  return (
    <Card className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {formatearFecha ? formatearFecha(fechaSeleccionada) : fechaSeleccionada}
        </h3>
        <Button
          onClick={() => onNuevoTurno?.(new Date(fechaSeleccionada + 'T00:00:00'))}
          size="sm"
          icon={Plus}
          themeColor={thematicColors?.base}
        >
          Agregar turno
        </Button>
      </div>

      {turnosSegurosDia.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-4">No hay turnos programados para este día</p>
          <Button
            onClick={() => onNuevoTurno?.(new Date(fechaSeleccionada + 'T00:00:00'))}
            themeColor={thematicColors?.base}
          >
            Agregar primer turno
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Resumen del día */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Clock size={16} className="text-blue-500 mr-2" />
                <span className="text-sm font-medium">
                  {horasTotal.toFixed(1)} horas
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign size={16} className="text-green-500 mr-2" />
                <span className="text-sm font-medium">
                  {formatCurrency(totalDia)}
                </span>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {turnosSegurosDia.length} turno{turnosSegurosDia.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Lista de turnos */}
          <div className="space-y-3">
            {turnosSegurosDia.map((turno, index) => {
              if (!turno) return null;
              
              // Buscar trabajo de forma defensiva
              const trabajo = todosLosTrabajos?.find(t => t && t.id === turno.trabajoId);
              
              return (
                <div key={turno.id || index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ 
                        backgroundColor: trabajo?.color || trabajo?.colorAvatar || '#6B7280' 
                      }}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {trabajo?.nombre || 'Trabajo eliminado'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {turno.horaInicio || '--:--'} - {turno.horaFin || '--:--'}
                        {turno.tipo === 'delivery' && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs">
                            Delivery
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {turno.tipo === 'delivery' ? (
                      <span className="font-medium text-green-600">
                        {formatCurrency(turno.gananciaTotal || 0)}
                      </span>
                    ) : (
                      <span className="font-medium" style={{ color: thematicColors?.base }}>
                        {turno.horaInicio && turno.horaFin ? (
                          (() => {
                            try {
                              const resultado = calculatePayment ? calculatePayment(turno) : { totalWithDiscount: 0 };
                              return formatCurrency(resultado.totalWithDiscount || resultado.totalConDescuento || 0);
                            } catch (error) {
                              return formatCurrency(0);
                            }
                          })()
                        ) : (
                          formatCurrency(0)
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};

export default CalendarDaySummary;