// src/components/stats/DailyBreakdownCard/index.jsx

import React from 'react';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';

const DailyBreakdownCard = ({ turnosPorDia = {}, trabajos = [] }) => {
  // Validar datos
  const datos = turnosPorDia && typeof turnosPorDia === 'object' ? turnosPorDia : {};
  const trabajosValidos = Array.isArray(trabajos) ? trabajos : [];
  
  // Si no hay datos, mostrar estado vacío
  if (Object.keys(datos).length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar size={20} className="mr-2" />
          Desglose Diario
        </h3>
        <div className="text-center py-8 text-gray-500">
          <Calendar size={48} className="mx-auto mb-3 opacity-30" />
          <p>No hay turnos registrados esta semana</p>
          <p className="text-sm">Los turnos aparecerán aquí una vez que agregues algunos</p>
        </div>
      </Card>
    );
  }

  // Función para calcular horas de un turno
  const calcularHoras = (turno) => {
    try {
      const [horaInicioH, horaInicioM] = turno.horaInicio.split(':').map(Number);
      const [horaFinH, horaFinM] = turno.horaFin.split(':').map(Number);
      
      const inicio = horaInicioH + horaInicioM / 60;
      let fin = horaFinH + horaFinM / 60;
      
      // Manejar turnos que cruzan medianoche
      if (fin < inicio) fin += 24;
      
      return Math.max(0, fin - inicio);
    } catch (error) {
      return 0;
    }
  };

  // Función para calcular ganancia de un turno
  const calcularGanancia = (turno) => {
    try {
      const trabajo = trabajosValidos.find(t => t.id === turno.trabajoId);
      if (!trabajo) return 0;

      const horas = calcularHoras(turno);
      const tarifa = trabajo.tarifaBase || trabajo.salario || 0;
      const descuento = trabajo.descuento || 0;
      
      const gananciaBase = horas * tarifa;
      const descuentoAmount = gananciaBase * (descuento / 100);
      
      return Math.max(0, gananciaBase - descuentoAmount);
    } catch (error) {
      return 0;
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
    } catch (error) {
      return fecha;
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Calendar size={20} className="mr-2" />
        Desglose Diario
      </h3>
      
      <div className="space-y-3">
        {Object.entries(datos).map(([fecha, turnos]) => {
          const horasTotal = turnos.reduce((total, turno) => total + calcularHoras(turno), 0);
          const gananciaTotal = turnos.reduce((total, turno) => total + calcularGanancia(turno), 0);

          return (
            <div key={fecha} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Calendar size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {formatearFecha(fecha)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {turnos.length} turno{turnos.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center text-purple-600">
                  <Clock size={14} className="mr-1" />
                  <span>{horasTotal.toFixed(1)}h</span>
                </div>
                <div className="flex items-center text-green-600">
                  <DollarSign size={14} className="mr-1" />
                  <span>{formatCurrency(gananciaTotal)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default DailyBreakdownCard;