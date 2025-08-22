// src/components/calendar/CalendarSummary/index.jsx - Resumen estadísticas del mes

import React from 'react';
import { Calendar, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { formatCurrency } from '../../../utils/currency';

const CalendarSummary = ({ 
  totalTurnos, 
  thematicColors,
  mesActual,
  anioActual 
}) => {
  const { todosLosTrabajos, calculatePayment, turnosPorFecha } = useApp();

  // Calcular estadísticas del mes actual
  const calcularEstadisticasMes = () => {
    if (!turnosPorFecha) return { totalGanado: 0, horasTrabajadas: 0, diasTrabajados: 0 };

    let totalGanado = 0;
    let horasTrabajadas = 0;
    const diasConTurnos = new Set();

    // Obtener el primer y último día del mes
    const primerDia = new Date(anioActual, mesActual, 1);
    const ultimoDia = new Date(anioActual, mesActual + 1, 0);
    
    Object.entries(turnosPorFecha).forEach(([fecha, turnos]) => {
      const fechaObj = new Date(fecha + 'T00:00:00');
      
      // Solo procesar turnos del mes actual
      if (fechaObj >= primerDia && fechaObj <= ultimoDia) {
        diasConTurnos.add(fecha);
        
        turnos.forEach(turno => {
          if (!turno) return;
          
          // Calcular horas
          try {
            const [horaIni, minIni] = turno.horaInicio.split(':').map(Number);
            const [horaFin, minFin] = turno.horaFin.split(':').map(Number);
            let horas = (horaFin + minFin/60) - (horaIni + minIni/60);
            if (horas < 0) horas += 24;
            horasTrabajadas += horas;
          } catch (error) {
            console.warn('Error calculando horas:', error);
          }

          // Calcular ganancia
          try {
            if (turno.tipo === 'delivery') {
              totalGanado += turno.gananciaTotal || 0;
            } else {
              const resultado = calculatePayment ? calculatePayment(turno) : { totalWithDiscount: 0 };
              totalGanado += resultado.totalWithDiscount || resultado.totalConDescuento || 0;
            }
          } catch (error) {
            console.warn('Error calculando ganancia:', error);
          }
        });
      }
    });

    return {
      totalGanado,
      horasTrabajadas,
      diasTrabajados: diasConTurnos.size
    };
  };

  const estadisticas = calcularEstadisticasMes();
  const promedioPorDia = estadisticas.diasTrabajados > 0 ? estadisticas.totalGanado / estadisticas.diasTrabajados : 0;

  const obtenerNombreMes = () => {
    return new Date(anioActual, mesActual, 1).toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div 
      className="px-4 py-3 border-b"
      style={{ backgroundColor: thematicColors?.transparent5 || 'rgba(236, 72, 153, 0.05)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Calendar size={16} style={{ color: thematicColors?.base || '#EC4899' }} className="mr-2" />
            <span className="text-sm font-medium text-gray-700">
              {obtenerNombreMes()}
            </span>
          </div>
          
          <div className="flex items-center">
            <TrendingUp size={16} className="text-blue-500 mr-2" />
            <span className="text-sm font-medium">
              {totalTurnos} turno{totalTurnos !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Clock size={16} className="text-orange-500 mr-1" />
            <span className="text-sm font-medium">
              {estadisticas.horasTrabajadas.toFixed(1)}h
            </span>
          </div>
          
          <div className="flex items-center">
            <DollarSign size={16} className="text-green-500 mr-1" />
            <span className="text-sm font-medium">
              {formatCurrency(estadisticas.totalGanado)}
            </span>
          </div>

          {estadisticas.diasTrabajados > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Promedio/día</p>
              <p className="text-sm font-semibold" style={{ color: thematicColors?.base }}>
                {formatCurrency(promedioPorDia)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Información adicional en segunda línea si hay datos */}
      {estadisticas.diasTrabajados > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>
              {estadisticas.diasTrabajados} día{estadisticas.diasTrabajados !== 1 ? 's' : ''} trabajado{estadisticas.diasTrabajados !== 1 ? 's' : ''}
            </span>
            <span>
              {estadisticas.horasTrabajadas > 0 && 
                `Promedio: ${(estadisticas.horasTrabajadas / estadisticas.diasTrabajados).toFixed(1)}h/día`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarSummary;