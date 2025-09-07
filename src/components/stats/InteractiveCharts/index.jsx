// src/components/stats/InteractiveCharts/index.jsx

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';
import { CHART_CONFIGS, PIE_CHART_COLORS, RECHARTS_CONFIG, CSS_CHART_CONFIG } from '../../../constants/charts';

const InteractiveCharts = ({ datosActuales, gananciaPorTrabajo = [] }) => {
  const colors = useThemeColors();
  const [currentChart, setCurrentChart] = useState(0);

  // Datos para evolución semanal (simulado - últimas 4 semanas)
  const evolutionData = [
    { semana: 'Hace 3 sem', ganancia: datosActuales.totalGanado * 0.7 },
    { semana: 'Hace 2 sem', ganancia: datosActuales.totalGanado * 0.85 },
    { semana: 'Sem pasada', ganancia: datosActuales.totalGanado * 0.92 },
    { semana: 'Esta semana', ganancia: datosActuales.totalGanado }
  ];

  // Datos para trabajos (preparados para gráfico de torta)
  const workData = gananciaPorTrabajo.slice(0, 5).map((trabajo, index) => {
    return {
      name: trabajo.nombre.length > 12 ? trabajo.nombre.substring(0, 12) + '...' : trabajo.nombre,
      value: trabajo.ganancia,
      color: trabajo.color || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
      fullName: trabajo.nombre
    };
  });

  // Datos para horas diarias
  const dailyData = datosActuales.gananciaPorDia ? 
    Object.entries(datosActuales.gananciaPorDia).map(([dia, datos]) => ({
      dia: dia.substring(0, 3),
      horas: datos.horas || 0,
      ganancia: datos.ganancia || 0
    })) : [];

  const nextChart = () => {
    setCurrentChart((prev) => (prev + 1) % CHART_CONFIGS.length);
  };

  const prevChart = () => {
    setCurrentChart((prev) => (prev - 1 + CHART_CONFIGS.length) % CHART_CONFIGS.length);
  };

  const currentChartConfig = CHART_CONFIGS[currentChart];

  // Renderizar gráfico según el tipo actual
  const renderChart = () => {
    switch (currentChart) {
      case 0: // Evolución semanal - Línea simple
        const maxEvolution = Math.max(...evolutionData.map(d => d.ganancia));
        return (
          <div className="space-y-3 h-full">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>$0</span>
              <span>{formatCurrency(maxEvolution)}</span>
            </div>
            <div className="flex items-end space-x-2" style={{ height: CSS_CHART_CONFIG.heights.chart }}>
              {evolutionData.map((data, index) => {
                const height = (data.ganancia / maxEvolution) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center h-full">
                    <div className="relative w-full mb-2 flex-1">
                      <div 
                        className={`absolute bottom-0 w-full rounded-t transition-all ${CSS_CHART_CONFIG.animation.duration}`}
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

      case 1: // Por trabajos - Gráfico de torta con Recharts
        if (workData.length === 0) {
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <currentChartConfig.icon size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Sin datos de trabajos</p>
              </div>
            </div>
          );
        }
        
        return (
          <div className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={workData}
                  cx="50%"
                  cy="50%"
                  innerRadius={RECHARTS_CONFIG.pie.innerRadius}
                  outerRadius={RECHARTS_CONFIG.pie.outerRadius}
                  paddingAngle={RECHARTS_CONFIG.pie.paddingAngle}
                  dataKey="value"
                >
                  {workData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    formatCurrency(value), 
                    props.payload.fullName
                  ]}
                  labelStyle={{ display: 'none' }}
                  contentStyle={RECHARTS_CONFIG.tooltip.contentStyle}
                />
                <Legend 
                  verticalAlign={RECHARTS_CONFIG.legend.verticalAlign}
                  height={RECHARTS_CONFIG.legend.height}
                  wrapperStyle={RECHARTS_CONFIG.legend.wrapperStyle}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        );

      case 2: // Horas diarias - Área simple
        const maxHours = Math.max(...dailyData.map(d => d.horas));
        return (
          <div className="space-y-3 h-full">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Horas por día</span>
              <span>{maxHours.toFixed(1)}h máximo</span>
            </div>
            <div className="flex items-end space-x-1" style={{ height: CSS_CHART_CONFIG.heights.chart }}>
              {dailyData.map((data, index) => {
                const height = maxHours > 0 ? (data.horas / maxHours) * 100 : 0;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center h-full">
                    <div className="relative w-full mb-2 flex-1">
                      <div 
                        className={`absolute bottom-0 w-full rounded-t transition-all ${CSS_CHART_CONFIG.animation.duration}`}
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
      <Card className="h-full flex flex-col">
        {/* Header con navegación - FIJO */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center">
            <BarChart3 size={18} style={{ color: colors.primary }} className="mr-2" />
            <div>
              <h4 className="font-medium">Gráficos Interactivos</h4>
              <p className="text-xs text-gray-500">Sin datos disponibles</p>
            </div>
          </div>
        </div>

        {/* Contenedor centrado */}
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <BarChart3 size={32} className="mx-auto mb-3 text-gray-300" />
            <h4 className="text-sm font-medium text-gray-600 mb-1">
              Sin datos para gráficos
            </h4>
            <p className="text-xs text-gray-500">
              Los gráficos aparecerán con más actividad
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const CurrentIcon = currentChartConfig.icon;

  return (
    <Card className="h-full flex flex-col">
      {/* Header con navegación - FIJO */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center">
          <CurrentIcon size={18} style={{ color: colors.primary }} className="mr-2" />
          <div>
            <h4 className="font-medium">{currentChartConfig.title}</h4>
            <p className="text-xs text-gray-500">{currentChartConfig.subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={prevChart}
            className="p-2 rounded transition-colors hover:bg-gray-100"
            style={{ color: colors.primary }}
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex space-x-1">
            {CHART_CONFIGS.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
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
            className="p-2 rounded transition-colors hover:bg-gray-100"
            style={{ color: colors.primary }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* CONTENEDOR UNIFICADO: Ocupa TODO el espacio hasta el header */}
      <div className="flex-1 bg-gray-50 rounded-lg p-4 flex flex-col">
        {/* Gráfico - Ocupa la mayor parte del espacio */}
        <div className="flex-1 min-h-0">
          {renderChart()}
        </div>
        
        {/* Indicador - Siempre al fondo del contenedor */}
        <div className="text-center pt-4">
          <p className="text-xs text-gray-400">
            {currentChart + 1} de {CHART_CONFIGS.length}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default InteractiveCharts;