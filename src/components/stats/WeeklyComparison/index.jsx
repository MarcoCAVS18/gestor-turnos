// src/components/stats/WeeklyComparison/index.jsx

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const WeeklyComparison = ({ datosActuales = {}, datosAnteriores = {} }) => {

  const horasActuales = datosActuales.horasTrabajadas || 0;
  const horasAnteriores = datosAnteriores.horasTrabajadas || 0;
  
  const turnosActuales = datosActuales.totalTurnos || 0;
  const turnosAnteriores = datosAnteriores.totalTurnos || 0;

  const gananciaActual = (datosActuales && typeof datosActuales.totalGanado === 'number' && !isNaN(datosActuales.totalGanado)) ? datosActuales.totalGanado : 0;
  const gananciaAnterior = (datosAnteriores && typeof datosAnteriores.totalGanado === 'number' && !isNaN(datosAnteriores.totalGanado)) ? datosAnteriores.totalGanado : 0;

  const calcularCambio = (actual, anterior) => {
    if (anterior === 0) return actual > 0 ? 100 : 0;
    return ((actual - anterior) / anterior) * 100;
  };

  const cambioHoras = calcularCambio(horasActuales, horasAnteriores);
  const cambioTurnos = calcularCambio(turnosActuales, turnosAnteriores);
  const cambioGanancia = calcularCambio(gananciaActual, gananciaAnterior);

  const getIcono = (cambio) => {
    if (cambio > 0) return TrendingUp;
    if (cambio < 0) return TrendingDown;
    return Minus;
  };

  const getColor = (cambio) => {
    if (cambio > 0) return '#10B981';
    if (cambio < 0) return '#EF4444';
    return '#6B7280';
  };

  const comparaciones = [
    {
      label: 'Ganancia vs semana anterior',
      cambio: cambioGanancia,
      valor: `${Math.abs(cambioGanancia).toFixed(1)}%`
    },
    {
      label: 'Horas vs semana anterior',
      cambio: cambioHoras,
      valor: `${Math.abs(cambioHoras).toFixed(1)}%`
    },
    {
      label: 'Turnos vs semana anterior',
      cambio: cambioTurnos,
      valor: `${Math.abs(cambioTurnos).toFixed(1)}%`
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="font-semibold mb-4">Comparación semanal</h3>
      
      <div className="space-y-3">
        {comparaciones.map((comp, index) => {
          const Icono = getIcono(comp.cambio);
          const color = getColor(comp.cambio);
          
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">{comp.label}</span>
              <div className="flex items-center" style={{ color }}>
                <Icono size={16} className="mr-1" />
                <span className="text-sm font-medium">{comp.valor}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyComparison;