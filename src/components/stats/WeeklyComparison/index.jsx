// src/components/stats/WeeklyComparison/index.jsx

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const WeeklyComparison = ({ datosActuales, datosAnteriores, thematicColors, className = '' }) => {
  const horasActuales = datosActuales?.horasTrabajadas || 0;
  const horasAnteriores = datosAnteriores?.horasTrabajadas || 0;
  
  const turnosActuales = datosActuales?.totalTurnos || 0;
  const turnosAnteriores = datosAnteriores?.totalTurnos || 0;

  const gananciaActual = (datosActuales && typeof datosActuales.totalGanado === 'number' && !isNaN(datosActuales.totalGanado)) ? datosActuales.totalGanado : 0;
  const gananciaAnterior = (datosAnteriores && typeof datosAnteriores.totalGanado === 'number' && !isNaN(datosAnteriores.totalGanado)) ? datosAnteriores.totalGanado : 0;

  const diasActuales = datosActuales?.diasTrabajados || 0;
  const diasAnteriores = datosAnteriores?.diasTrabajados || 0;

  const promedioPorHoraActual = datosActuales?.promedioPorHora || 0;
  const promedioPorHoraAnterior = datosAnteriores?.promedioPorHora || 0;

  const calcularCambio = (actual, anterior) => {
    if (anterior === 0) return actual > 0 ? 100 : 0;
    return ((actual - anterior) / anterior) * 100;
  };

  const cambioHoras = calcularCambio(horasActuales, horasAnteriores);
  const cambioTurnos = calcularCambio(turnosActuales, turnosAnteriores);
  const cambioGanancia = calcularCambio(gananciaActual, gananciaAnterior);
  const cambioDias = calcularCambio(diasActuales, diasAnteriores);
  const cambioPromedioPorHora = calcularCambio(promedioPorHoraActual, promedioPorHoraAnterior);

  const getIcono = (cambio) => {
    if (cambio > 0) return TrendingUp;
    if (cambio < 0) return TrendingDown;
    return Minus;
  };

  const getColor = (cambio) => {
    if (cambio > 0) return thematicColors.success || '#10B981';
    if (cambio < 0) return thematicColors.danger || '#EF4444';
    return thematicColors.neutral || '#6B7280';
  };

  const comparaciones = [
    { label: 'Ganancia vs semana anterior', cambio: cambioGanancia, valor: `${Math.abs(cambioGanancia).toFixed(1)}%`, valorAbsoluto: formatCurrency(Math.abs(gananciaActual - gananciaAnterior)) },
    { label: 'Horas vs semana anterior', cambio: cambioHoras, valor: `${Math.abs(cambioHoras).toFixed(1)}%`, valorAbsoluto: `${Math.abs(horasActuales - horasAnteriores).toFixed(1)}h` },
    { label: 'Promedio por hora', cambio: cambioPromedioPorHora, valor: `${Math.abs(cambioPromedioPorHora).toFixed(1)}%`, valorAbsoluto: formatCurrency(Math.abs(promedioPorHoraActual - promedioPorHoraAnterior)) },
    { label: 'Turnos vs semana anterior', cambio: cambioTurnos, valor: `${Math.abs(cambioTurnos).toFixed(1)}%`, valorAbsoluto: `${Math.abs(turnosActuales - turnosAnteriores)} turnos` },
    { label: 'Días vs semana anterior', cambio: cambioDias, valor: `${Math.abs(cambioDias).toFixed(1)}%`, valorAbsoluto: `${Math.abs(diasActuales - diasAnteriores)} días` }
  ];
  
  return (
    <Card className={`p-4 flex flex-col ${className}`}>
      <h3 className="font-semibold mb-4">Comparación semanal</h3>
      
      <div className="flex-1 flex flex-col justify-between">
        {comparaciones.map((comp, index) => {
          const Icono = getIcono(comp.cambio);
          const color = getColor(comp.cambio);
          
          return (
            <Flex variant="between" key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <span className="text-sm text-gray-600">{comp.label}</span>
                {comp.valorAbsoluto && (
                  <p className="text-xs text-gray-500 mt-1">
                    Diferencia: {comp.valorAbsoluto}
                  </p>
                )}
              </div>
              <div className="flex items-center" style={{ color }}>
                <Icono size={16} className="mr-1" />
                <span className="text-sm font-medium">{comp.valor}</span>
              </div>
            </Flex>
          );
        })}
      </div>
    </Card>
  );
};

export default WeeklyComparison;