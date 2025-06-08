// src/components/stats/DailyBreakdownCard/index.jsx

import React from 'react';
import ***REMOVED*** Calendar, Clock, DollarSign ***REMOVED*** from 'lucide-react';
import Card from '../../ui/Card';

const DailyBreakdownCard = (***REMOVED*** turnosPorDia = ***REMOVED******REMOVED***, trabajos = [] ***REMOVED***) => ***REMOVED***
  // Validar datos
  const datos = turnosPorDia && typeof turnosPorDia === 'object' ? turnosPorDia : ***REMOVED******REMOVED***;
  const trabajosValidos = Array.isArray(trabajos) ? trabajos : [];
  
  // Si no hay datos, mostrar estado vacío
  if (Object.keys(datos).length === 0) ***REMOVED***
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar size=***REMOVED***20***REMOVED*** className="mr-2" />
          Desglose Diario
        </h3>
        <div className="text-center py-8 text-gray-500">
          <Calendar size=***REMOVED***48***REMOVED*** className="mx-auto mb-3 opacity-30" />
          <p>No hay turnos registrados esta semana</p>
          <p className="text-sm">Los turnos aparecerán aquí una vez que agregues algunos</p>
        </div>
      </Card>
    );
  ***REMOVED***

  // Función para calcular horas de un turno
  const calcularHoras = (turno) => ***REMOVED***
    try ***REMOVED***
      const [horaInicioH, horaInicioM] = turno.horaInicio.split(':').map(Number);
      const [horaFinH, horaFinM] = turno.horaFin.split(':').map(Number);
      
      const inicio = horaInicioH + horaInicioM / 60;
      let fin = horaFinH + horaFinM / 60;
      
      // Manejar turnos que cruzan medianoche
      if (fin < inicio) fin += 24;
      
      return Math.max(0, fin - inicio);
    ***REMOVED*** catch (error) ***REMOVED***
      return 0;
    ***REMOVED***
  ***REMOVED***;

  // Función para calcular ganancia de un turno
  const calcularGanancia = (turno) => ***REMOVED***
    try ***REMOVED***
      const trabajo = trabajosValidos.find(t => t.id === turno.trabajoId);
      if (!trabajo) return 0;

      const horas = calcularHoras(turno);
      const tarifa = trabajo.tarifaBase || trabajo.salario || 0;
      const descuento = trabajo.descuento || 0;
      
      const gananciaBase = horas * tarifa;
      const descuentoAmount = gananciaBase * (descuento / 100);
      
      return Math.max(0, gananciaBase - descuentoAmount);
    ***REMOVED*** catch (error) ***REMOVED***
      return 0;
    ***REMOVED***
  ***REMOVED***;

  // Formatear fecha
  const formatearFecha = (fecha) => ***REMOVED***
    try ***REMOVED***
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', ***REMOVED*** 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      ***REMOVED***);
    ***REMOVED*** catch (error) ***REMOVED***
      return fecha;
    ***REMOVED***
  ***REMOVED***;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Calendar size=***REMOVED***20***REMOVED*** className="mr-2" />
        Desglose Diario
      </h3>
      
      <div className="space-y-3">
        ***REMOVED***Object.entries(datos).map(([fecha, turnos]) => ***REMOVED***
          const horasTotal = turnos.reduce((total, turno) => total + calcularHoras(turno), 0);
          const gananciaTotal = turnos.reduce((total, turno) => total + calcularGanancia(turno), 0);

          return (
            <div key=***REMOVED***fecha***REMOVED*** className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Calendar size=***REMOVED***16***REMOVED*** className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    ***REMOVED***formatearFecha(fecha)***REMOVED***
                  </p>
                  <p className="text-sm text-gray-500">
                    ***REMOVED***turnos.length***REMOVED*** turno***REMOVED***turnos.length !== 1 ? 's' : ''***REMOVED***
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center text-purple-600">
                  <Clock size=***REMOVED***14***REMOVED*** className="mr-1" />
                  <span>***REMOVED***horasTotal.toFixed(1)***REMOVED***h</span>
                </div>
                <div className="flex items-center text-green-600">
                  <DollarSign size=***REMOVED***14***REMOVED*** className="mr-1" />
                  <span>$***REMOVED***gananciaTotal.toFixed(2)***REMOVED***</span>
                </div>
              </div>
            </div>
          );
        ***REMOVED***)***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default DailyBreakdownCard;