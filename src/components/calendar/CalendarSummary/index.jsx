// src/components/calendar/CalendarSummary/index.jsx - Resumen estadísticas del mes

import React from 'react';
import ***REMOVED*** Calendar, Clock, DollarSign, TrendingUp ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';

const CalendarSummary = (***REMOVED*** 
  totalTurnos, 
  thematicColors,
  mesActual,
  anioActual 
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** todosLosTrabajos, calculatePayment, turnosPorFecha ***REMOVED*** = useApp();

  // Calcular estadísticas del mes actual
  const calcularEstadisticasMes = () => ***REMOVED***
    if (!turnosPorFecha) return ***REMOVED*** totalGanado: 0, horasTrabajadas: 0, diasTrabajados: 0 ***REMOVED***;

    let totalGanado = 0;
    let horasTrabajadas = 0;
    const diasConTurnos = new Set();

    // Obtener el primer y último día del mes
    const primerDia = new Date(anioActual, mesActual, 1);
    const ultimoDia = new Date(anioActual, mesActual + 1, 0);
    
    Object.entries(turnosPorFecha).forEach(([fecha, turnos]) => ***REMOVED***
      const fechaObj = new Date(fecha + 'T00:00:00');
      
      // Solo procesar turnos del mes actual
      if (fechaObj >= primerDia && fechaObj <= ultimoDia) ***REMOVED***
        diasConTurnos.add(fecha);
        
        turnos.forEach(turno => ***REMOVED***
          if (!turno) return;
          
          // Calcular horas
          try ***REMOVED***
            const [horaIni, minIni] = turno.horaInicio.split(':').map(Number);
            const [horaFin, minFin] = turno.horaFin.split(':').map(Number);
            let horas = (horaFin + minFin/60) - (horaIni + minIni/60);
            if (horas < 0) horas += 24;
            horasTrabajadas += horas;
          ***REMOVED*** catch (error) ***REMOVED***
            console.warn('Error calculando horas:', error);
          ***REMOVED***

          // Calcular ganancia
          try ***REMOVED***
            if (turno.tipo === 'delivery') ***REMOVED***
              totalGanado += turno.gananciaTotal || 0;
            ***REMOVED*** else ***REMOVED***
              const resultado = calculatePayment ? calculatePayment(turno) : ***REMOVED*** totalWithDiscount: 0 ***REMOVED***;
              totalGanado += resultado.totalWithDiscount || resultado.totalConDescuento || 0;
            ***REMOVED***
          ***REMOVED*** catch (error) ***REMOVED***
            console.warn('Error calculando ganancia:', error);
          ***REMOVED***
        ***REMOVED***);
      ***REMOVED***
    ***REMOVED***);

    return ***REMOVED***
      totalGanado,
      horasTrabajadas,
      diasTrabajados: diasConTurnos.size
    ***REMOVED***;
  ***REMOVED***;

  const estadisticas = calcularEstadisticasMes();
  const promedioPorDia = estadisticas.diasTrabajados > 0 ? estadisticas.totalGanado / estadisticas.diasTrabajados : 0;

  const obtenerNombreMes = () => ***REMOVED***
    return new Date(anioActual, mesActual, 1).toLocaleDateString('es-ES', ***REMOVED*** 
      month: 'long', 
      year: 'numeric' 
    ***REMOVED***);
  ***REMOVED***;

  return (
    <div 
      className="px-4 py-3 border-b"
      style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent5 || 'rgba(236, 72, 153, 0.05)' ***REMOVED******REMOVED***
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Calendar size=***REMOVED***16***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
            <span className="text-sm font-medium text-gray-700">
              ***REMOVED***obtenerNombreMes()***REMOVED***
            </span>
          </div>
          
          <div className="flex items-center">
            <TrendingUp size=***REMOVED***16***REMOVED*** className="text-blue-500 mr-2" />
            <span className="text-sm font-medium">
              ***REMOVED***totalTurnos***REMOVED*** turno***REMOVED***totalTurnos !== 1 ? 's' : ''***REMOVED***
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Clock size=***REMOVED***16***REMOVED*** className="text-orange-500 mr-1" />
            <span className="text-sm font-medium">
              ***REMOVED***estadisticas.horasTrabajadas.toFixed(1)***REMOVED***h
            </span>
          </div>
          
          <div className="flex items-center">
            <DollarSign size=***REMOVED***16***REMOVED*** className="text-green-500 mr-1" />
            <span className="text-sm font-medium">
              ***REMOVED***formatCurrency(estadisticas.totalGanado)***REMOVED***
            </span>
          </div>

          ***REMOVED***estadisticas.diasTrabajados > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Promedio/día</p>
              <p className="text-sm font-semibold" style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED***>
                ***REMOVED***formatCurrency(promedioPorDia)***REMOVED***
              </p>
            </div>
          )***REMOVED***
        </div>
      </div>

      ***REMOVED***/* Información adicional en segunda línea si hay datos */***REMOVED***
      ***REMOVED***estadisticas.diasTrabajados > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>
              ***REMOVED***estadisticas.diasTrabajados***REMOVED*** día***REMOVED***estadisticas.diasTrabajados !== 1 ? 's' : ''***REMOVED*** trabajado***REMOVED***estadisticas.diasTrabajados !== 1 ? 's' : ''***REMOVED***
            </span>
            <span>
              ***REMOVED***estadisticas.horasTrabajadas > 0 && 
                `Promedio: $***REMOVED***(estadisticas.horasTrabajadas / estadisticas.diasTrabajados).toFixed(1)***REMOVED***h/día`
              ***REMOVED***
            </span>
          </div>
        </div>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default CalendarSummary;