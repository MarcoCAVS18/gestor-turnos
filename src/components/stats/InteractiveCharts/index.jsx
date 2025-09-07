// src/components/stats/InteractiveCharts/index.jsx

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BarChart3, TrendingUp, Clock } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';

const InteractiveCharts = ({ datosActuales, gananciaPorTrabajo = [] }) => {
  const colors = useThemeColors();
  const [currentChart, setCurrentChart] = useState(0);

  // Configuración de los gráficos
  const charts = [
    {
      id: 'evolution',
      title: 'Evolución Semanal',
      subtitle: 'Progreso de ganancias',
      icon: TrendingUp,
      type: 'line'
    },
    {
      id: 'works',
      title: 'Por Trabajos',
      subtitle: 'Distribución de ganancias',
      icon: BarChart3,
      type: 'bar'
    },
    {
      id: 'daily',
      title: 'Horas Diarias',
      subtitle: 'Distribución semanal',
      icon: Clock,
      type: 'area'
    }
  ];

  // Datos para evolución semanal (simulado - últimas 4 semanas)
  const evolutionData = [
    { semana: 'Hace 3 sem', ganancia: datosActuales.totalGanado * 0.7 },
    { semana: 'Hace 2 sem', ganancia: datosActuales.totalGanado * 0.85 },
    { semana: 'Sem pasada', ganancia: datosActuales.totalGanado * 0.92 },
    { semana: 'Esta semana', ganancia: datosActuales.totalGanado }
  ];

  // Datos para trabajos (usar gananciaPorTrabajo del hook)
  const workData = gananciaPorTrabajo.slice(0, 4).map(trabajo => ({
    name: trabajo.nombre.length > 10 ? trabajo.nombre.substring(0, 10) + '...' : trabajo.nombre,
    ganancia: trabajo.ganancia,
    color: trabajo.color
  }));

  // Datos para horas diarias
  const dailyData = datosActuales.gananciaPorDia ? 
    Object.entries(datosActuales.gananciaPorDia).map(([dia, datos]) => ({
      dia: dia.substring(0, 3),
      horas: datos.horas || 0,
      ganancia: datos.ganancia || 0
    })) : [];

  const nextChart = () => {
    setCurrentChart((prev) => (prev + 1) % charts.length);
  };

  const prevChart = () => {
    setCurrentChart((prev) => (prev - 1 + charts.length) % charts.length);
  };

  const currentChartConfig = charts[currentChart];

  // Renderizar gráfico simple con CSS
  const renderChart = () => {
    switch (currentChart) {
      case 0: // Evolución semanal - Línea simple
        const maxEvolution = Math.max(...evolutionData.map(d => d.ganancia));
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>$0</span>
              <span>{formatCurrency(maxEvolution)}</span>
            </div>
            <div className="flex items-end space-x-2 h-32">
              {evolutionData.map((data, index) => {
                const height = (data.ganancia / maxEvolution) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="relative w-full mb-2" style={{ height: '120px' }}>
                      <div 
                        className="absolute bottom-0 w-full rounded-t transition-all duration-500"
                        style={{ 
                          height: `${height}%`,
                          backgroundColor: colors.transparent20
                        }}
                      />
                      <div 
                        className="absolute bottom-0 w-2 h-2 rounded-full transform -translate-x-1/2 left-1/2"
                        style={{ 
                          bottom: `${height}%`,
                          backgroundColor: colors.primary
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 text-center">{data.semana}</span>
                    <span className="text-xs font-medium">{formatCurrency(data.ganancia)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 1: // Por trabajos - Barras
        const maxWork = Math.max(...workData.map(d => d.ganancia));
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Ganancias por trabajo</span>
              <span>{formatCurrency(maxWork)}</span>
            </div>
            <div className="space-y-3">
              {workData.map((trabajo, index) => {
                const width = (trabajo.ganancia / maxWork) * 100;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-16 text-xs text-gray-600 truncate">{trabajo.name}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                      <div 
                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${width}%`,
                          backgroundColor: trabajo.color
                        }}
                      />
                    </div>
                    <div className="w-16 text-xs font-medium text-right">
                      {formatCurrency(trabajo.ganancia)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 2: // Horas diarias - Área simple
        const maxHours = Math.max(...dailyData.map(d => d.horas));
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Horas por día</span>
              <span>{maxHours.toFixed(1)}h máximo</span>
            </div>
            <div className="flex items-end space-x-1 h-32">
              {dailyData.map((data, index) => {
                const height = maxHours > 0 ? (data.horas / maxHours) * 100 : 0;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="relative w-full mb-2" style={{ height: '120px' }}>
                      <div 
                        className="absolute bottom-0 w-full rounded-t transition-all duration-500"
                        style={{ 
                          height: `${height}%`,
                          background: `linear-gradient(to top, ${colors.primary}, ${colors.transparent20})`
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{data.dia}</span>
                    <span className="text-xs font-medium">{data.horas.toFixed(1)}h</span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Si no hay datos suficientes, mostrar estado vacío
  if (!datosActuales || datosActuales.totalGanado === 0) {
    return (
      <Card className="h-full">
        <div className="text-center py-8">
          <BarChart3 size={32} className="mx-auto mb-3 text-gray-300" />
          <h4 className="text-sm font-medium text-gray-600 mb-1">
            Sin datos para gráficos
          </h4>
          <p className="text-xs text-gray-500">
            Los gráficos aparecerán con más actividad
          </p>
        </div>
      </Card>
    );
  }

  const CurrentIcon = currentChartConfig.icon;

  return (
    <Card className="h-full">
      {/* Header con navegación */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <CurrentIcon size={16} style={{ color: colors.primary }} className="mr-1" />
          <div>
            <h4 className="font-medium text-sm">{currentChartConfig.title}</h4>
            <p className="text-xs text-gray-500">{currentChartConfig.subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={prevChart}
            className="p-1 rounded transition-colors hover:bg-gray-100"
            style={{ color: colors.primary }}
          >
            <ChevronLeft size={14} />
          </button>
          
          <div className="flex space-x-1">
            {charts.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentChart 
                    ? 'opacity-100' 
                    : 'opacity-30'
                }`}
                style={{ backgroundColor: colors.primary }}
              />
            ))}
          </div>
          
          <button
            onClick={nextChart}
            className="p-1 rounded transition-colors hover:bg-gray-100"
            style={{ color: colors.primary }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-40">
        {renderChart()}
      </div>

      {/* Indicador actual */}
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-400">
          {currentChart + 1} de {charts.length}
        </p>
      </div>
    </Card>
  );
};

export default InteractiveCharts;