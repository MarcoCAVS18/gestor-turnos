// src/components/stats/WeeklyComparison/index.jsx

import React from 'react';
import ***REMOVED*** TrendingUp, TrendingDown, Minus ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';

const WeeklyComparison = (***REMOVED*** datosActuales = ***REMOVED******REMOVED***, datosAnteriores = ***REMOVED******REMOVED*** ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  const horasActuales = datosActuales.horasTrabajadas || 0;
  const horasAnteriores = datosAnteriores.horasTrabajadas || 0;
  
  const turnosActuales = datosActuales.totalTurnos || 0;
  const turnosAnteriores = datosAnteriores.totalTurnos || 0;

  const gananciaActual = (datosActuales && typeof datosActuales.totalGanado === 'number' && !isNaN(datosActuales.totalGanado)) ? datosActuales.totalGanado : 0;
  const gananciaAnterior = (datosAnteriores && typeof datosAnteriores.totalGanado === 'number' && !isNaN(datosAnteriores.totalGanado)) ? datosAnteriores.totalGanado : 0;

  // NUEVA ESTADÍSTICA: Días trabajados
  const diasActuales = datosActuales.diasTrabajados || 0;
  const diasAnteriores = datosAnteriores.diasTrabajados || 0;

  const calcularCambio = (actual, anterior) => ***REMOVED***
    if (anterior === 0) return actual > 0 ? 100 : 0;
    return ((actual - anterior) / anterior) * 100;
  ***REMOVED***;

  const cambioHoras = calcularCambio(horasActuales, horasAnteriores);
  const cambioTurnos = calcularCambio(turnosActuales, turnosAnteriores);
  const cambioGanancia = calcularCambio(gananciaActual, gananciaAnterior);
  const cambioDias = calcularCambio(diasActuales, diasAnteriores);

  const getIcono = (cambio) => ***REMOVED***
    if (cambio > 0) return TrendingUp;
    if (cambio < 0) return TrendingDown;
    return Minus;
  ***REMOVED***;

  const getColor = (cambio) => ***REMOVED***
    if (cambio > 0) return colors.success || '#10B981';
    if (cambio < 0) return colors.danger || '#EF4444';
    return colors.neutral || '#6B7280';
  ***REMOVED***;

  const comparaciones = [
    ***REMOVED***
      label: 'Ganancia vs semana anterior',
      cambio: cambioGanancia,
      valor: `$***REMOVED***Math.abs(cambioGanancia).toFixed(1)***REMOVED***%`,
      valorAbsoluto: formatCurrency(Math.abs(gananciaActual - gananciaAnterior))
    ***REMOVED***,
    ***REMOVED***
      label: 'Horas vs semana anterior',
      cambio: cambioHoras,
      valor: `$***REMOVED***Math.abs(cambioHoras).toFixed(1)***REMOVED***%`,
      valorAbsoluto: `$***REMOVED***Math.abs(horasActuales - horasAnteriores).toFixed(1)***REMOVED***h`
    ***REMOVED***,
    ***REMOVED***
      label: 'Turnos vs semana anterior',
      cambio: cambioTurnos,
      valor: `$***REMOVED***Math.abs(cambioTurnos).toFixed(1)***REMOVED***%`,
      valorAbsoluto: `$***REMOVED***Math.abs(turnosActuales - turnosAnteriores)***REMOVED*** turnos`
    ***REMOVED***,
    ***REMOVED***
      label: 'Días vs semana anterior',
      cambio: cambioDias,
      valor: `$***REMOVED***Math.abs(cambioDias).toFixed(1)***REMOVED***%`,
      valorAbsoluto: `$***REMOVED***Math.abs(diasActuales - diasAnteriores)***REMOVED*** días`
    ***REMOVED***
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 h-full flex flex-col">
      <h3 className="font-semibold mb-4">Comparación semanal</h3>
      
      <div className="space-y-3 flex-1 flex flex-col justify-center">
        ***REMOVED***comparaciones.map((comp, index) => ***REMOVED***
          const Icono = getIcono(comp.cambio);
          const color = getColor(comp.cambio);
          
          return (
            <div key=***REMOVED***index***REMOVED*** className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <span className="text-sm text-gray-600">***REMOVED***comp.label***REMOVED***</span>
                ***REMOVED***comp.valorAbsoluto && (
                  <p className="text-xs text-gray-500 mt-1">
                    Diferencia: ***REMOVED***comp.valorAbsoluto***REMOVED***
                  </p>
                )***REMOVED***
              </div>
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