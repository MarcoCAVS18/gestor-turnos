// src/components/stats/WeeklyComparison/index.jsx

import React from 'react';
import ***REMOVED*** TrendingUp, TrendingDown, Minus ***REMOVED*** from 'lucide-react';

const WeeklyComparison = (***REMOVED*** datosActuales = ***REMOVED******REMOVED***, datosAnteriores = ***REMOVED******REMOVED*** ***REMOVED***) => ***REMOVED***

  const horasActuales = datosActuales.horasTrabajadas || 0;
  const horasAnteriores = datosAnteriores.horasTrabajadas || 0;
  
  const turnosActuales = datosActuales.totalTurnos || 0;
  const turnosAnteriores = datosAnteriores.totalTurnos || 0;

  const gananciaActual = (datosActuales && typeof datosActuales.totalGanado === 'number' && !isNaN(datosActuales.totalGanado)) ? datosActuales.totalGanado : 0;
  const gananciaAnterior = (datosAnteriores && typeof datosAnteriores.totalGanado === 'number' && !isNaN(datosAnteriores.totalGanado)) ? datosAnteriores.totalGanado : 0;

  const calcularCambio = (actual, anterior) => ***REMOVED***
    if (anterior === 0) return actual > 0 ? 100 : 0;
    return ((actual - anterior) / anterior) * 100;
  ***REMOVED***;

  const cambioHoras = calcularCambio(horasActuales, horasAnteriores);
  const cambioTurnos = calcularCambio(turnosActuales, turnosAnteriores);
  const cambioGanancia = calcularCambio(gananciaActual, gananciaAnterior);

  const getIcono = (cambio) => ***REMOVED***
    if (cambio > 0) return TrendingUp;
    if (cambio < 0) return TrendingDown;
    return Minus;
  ***REMOVED***;

  const getColor = (cambio) => ***REMOVED***
    if (cambio > 0) return '#10B981';
    if (cambio < 0) return '#EF4444';
    return '#6B7280';
  ***REMOVED***;

  const comparaciones = [
    ***REMOVED***
      label: 'Ganancia vs semana anterior',
      cambio: cambioGanancia,
      valor: `$***REMOVED***Math.abs(cambioGanancia).toFixed(1)***REMOVED***%`
    ***REMOVED***,
    ***REMOVED***
      label: 'Horas vs semana anterior',
      cambio: cambioHoras,
      valor: `$***REMOVED***Math.abs(cambioHoras).toFixed(1)***REMOVED***%`
    ***REMOVED***,
    ***REMOVED***
      label: 'Turnos vs semana anterior',
      cambio: cambioTurnos,
      valor: `$***REMOVED***Math.abs(cambioTurnos).toFixed(1)***REMOVED***%`
    ***REMOVED***
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="font-semibold mb-4">Comparación semanal</h3>
      
      <div className="space-y-3">
        ***REMOVED***comparaciones.map((comp, index) => ***REMOVED***
          const Icono = getIcono(comp.cambio);
          const color = getColor(comp.cambio);
          
          return (
            <div key=***REMOVED***index***REMOVED*** className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">***REMOVED***comp.label***REMOVED***</span>
              <div className="flex items-center" style=***REMOVED******REMOVED*** color ***REMOVED******REMOVED***>
                <Icono size=***REMOVED***16***REMOVED*** className="mr-1" />
                <span className="text-sm font-medium">***REMOVED***comp.valor***REMOVED***</span>
              </div>
            </div>
          );
        ***REMOVED***)***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default WeeklyComparison;