// src/components/stats/InteractiveCharts/index.jsx

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BaseChart from '../../charts/BaseChart'; // Import BaseChart
import { useStats } from '../../../contexts/StatsContext';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { formatCurrency } from '../../../utils/currency';
import { getRechartsConfig, CHART_CONFIGS as staticChartConfigs, PIE_CHART_COLORS } from '../../../config/chartConfig';
import Card from '../../ui/Card';

const InteractiveCharts = () => {
  const { datosActuales, weeklyEvolutionData, thematicColors } = useStats();
  const [currentChartIndex, setCurrentChartIndex] = useState(0);
  const isMobile = useIsMobile();
  
  const chartConfigs = getRechartsConfig(thematicColors);

  // Datos para gráfico de torta (Top 5 trabajos)
  const workData = (datosActuales?.gananciaPorTrabajo || [])
    .slice(0, 5)
    .map((trabajo, index) => ({
      name: trabajo.nombre.length > 12 ? `${trabajo.nombre.substring(0, 12)}...` : trabajo.nombre,
      value: trabajo.ganancia,
      color: trabajo.color || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
      fullName: trabajo.nombre,
    }));

  // Datos para horas diarias
  const dailyData = datosActuales?.gananciaPorDia
    ? Object.entries(datosActuales.gananciaPorDia).map(([dia, datos]) => ({
        dia: dia.substring(0, 3),
        horas: datos.horas || 0,
        ganancia: datos.ganancia || 0,
      }))
    : [];

  const nextChart = () => setCurrentChartIndex((prev) => (prev + 1) % staticChartConfigs.length);
  const prevChart = () => setCurrentChartIndex((prev) => (prev - 1 + staticChartConfigs.length) % staticChartConfigs.length);

  const currentChartConfig = staticChartConfigs[currentChartIndex];
  
  const renderChart = () => {
    switch (currentChartIndex) {
      case 0: // Evolución semanal - LineChart
        return (
          <BaseChart
            data={weeklyEvolutionData}
            chartType="line"
            dataKeys={[{ key: 'ganancia', stroke: chartConfigs.line.stroke }]}
            nameKey="semana"
            valueFormatter={(value) => formatCurrency(value)}
            tooltipFormatter={(value) => [formatCurrency(value), 'Ganancia']}
            config={{ line: chartConfigs.line, grid: chartConfigs.grid, axis: chartConfigs.axis, tooltip: chartConfigs.tooltip }}
          />
        );

      case 1: // Por trabajos - PieChart
        return (
          <BaseChart
            data={workData}
            chartType="pie"
            dataKeys="value" // For pie, dataKeys is the valueKey string
            nameKey="name"
            tooltipFormatter={(value, name, props) => [formatCurrency(value), props.payload.fullName]}
            config={{ pie: chartConfigs.pie, tooltip: chartConfigs.tooltip, legend: chartConfigs.legend }}
            showLegend={!isMobile}
          />
        );

      case 2: // Horas diarias - AreaChart
        return (
          <BaseChart
            data={dailyData}
            chartType="area"
            dataKeys={[{ key: 'horas', stroke: chartConfigs.area.stroke, fill: chartConfigs.area.fill }]}
            nameKey="dia"
            valueFormatter={(value) => `${value}h`}
            tooltipFormatter={(value) => [`${value.toFixed(1)} horas`, 'Horas']}
            config={{ area: chartConfigs.area, grid: chartConfigs.grid, axis: chartConfigs.axis, tooltip: chartConfigs.tooltip }}
          />
        );

      default: return null;
    }
  };

  const isEmptyOverall = !datosActuales || datosActuales.totalGanado === 0;
  const CurrentIcon = currentChartConfig.icon;

  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center">
          <CurrentIcon size={18} style={{ color: thematicColors.primary }} className="mr-2" />
          <div>
            <h4 className="font-medium">{currentChartConfig.title}</h4>
            <p className="text-xs text-gray-500">{currentChartConfig.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={prevChart} className="p-2 rounded transition-colors hover:bg-gray-100" style={{ color: thematicColors.primary }}>
            <ChevronLeft size={16} />
          </button>
          <div className="flex space-x-1">
            {staticChartConfigs.map((_, index) => (
              <div key={index} className={`w-2 h-2 rounded-full transition-colors ${index === currentChartIndex ? 'opacity-100' : 'opacity-30'}`} style={{ backgroundColor: thematicColors.primary }}/>
            ))}
          </div>
          <button onClick={nextChart} className="p-2 rounded transition-colors hover:bg-gray-100" style={{ color: thematicColors.primary }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50 rounded-lg p-2 min-h-0">
        {isEmptyOverall ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Sin datos para gráficos</p>
          </div>
        ) : renderChart()}
      </div>
    </Card>
  );
};

export default InteractiveCharts;