// src/components/stats/InteractiveCharts/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** ChevronLeft, ChevronRight ***REMOVED*** from 'lucide-react';
import BaseChart from '../../charts/BaseChart'; 
import ***REMOVED*** useStats ***REMOVED*** from '../../../contexts/StatsContext';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../hooks/useIsMobile';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import ***REMOVED*** getRechartsConfig, CHART_CONFIGS as staticChartConfigs, PIE_CHART_COLORS ***REMOVED*** from '../../../config/chartConfig';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const InteractiveCharts = () => ***REMOVED***
  const ***REMOVED*** datosActuales, weeklyEvolutionData, thematicColors ***REMOVED*** = useStats();
  const [currentChartIndex, setCurrentChartIndex] = useState(0);
  const isMobile = useIsMobile();
  
  const chartConfigs = getRechartsConfig(thematicColors);

  // Datos para gráfico de torta (Top 5 trabajos)
  const workData = (datosActuales?.gananciaPorTrabajo || [])
    .slice(0, 5)
    .map((trabajo, index) => (***REMOVED***
      name: trabajo.nombre.length > 12 ? `$***REMOVED***trabajo.nombre.substring(0, 12)***REMOVED***...` : trabajo.nombre,
      value: trabajo.ganancia,
      color: trabajo.color || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
      fullName: trabajo.nombre,
    ***REMOVED***));

  // Datos para horas diarias
  const dailyData = datosActuales?.gananciaPorDia
    ? Object.entries(datosActuales.gananciaPorDia).map(([dia, datos]) => (***REMOVED***
        dia: dia.substring(0, 3),
        horas: datos.horas || 0,
        ganancia: datos.ganancia || 0,
      ***REMOVED***))
    : [];

  const nextChart = () => setCurrentChartIndex((prev) => (prev + 1) % staticChartConfigs.length);
  const prevChart = () => setCurrentChartIndex((prev) => (prev - 1 + staticChartConfigs.length) % staticChartConfigs.length);

  const currentChartConfig = staticChartConfigs[currentChartIndex];
  
  const renderChart = () => ***REMOVED***
    switch (currentChartIndex) ***REMOVED***
      case 0: // Evolución semanal - LineChart
        return (
          <BaseChart
            data=***REMOVED***weeklyEvolutionData***REMOVED***
            chartType="line"
            dataKeys=***REMOVED***[***REMOVED*** key: 'ganancia', stroke: chartConfigs.line.stroke ***REMOVED***]***REMOVED***
            nameKey="semana"
            valueFormatter=***REMOVED***(value) => formatCurrency(value)***REMOVED***
            tooltipFormatter=***REMOVED***(value) => [formatCurrency(value), 'Ganancia']***REMOVED***
            config=***REMOVED******REMOVED*** line: chartConfigs.line, grid: chartConfigs.grid, axis: chartConfigs.axis, tooltip: chartConfigs.tooltip ***REMOVED******REMOVED***
          />
        );

      case 1: // Por trabajos - PieChart
        return (
          <BaseChart
            data=***REMOVED***workData***REMOVED***
            chartType="pie"
            dataKeys="value" // For pie, dataKeys is the valueKey string
            nameKey="name"
            tooltipFormatter=***REMOVED***(value, name, props) => [formatCurrency(value), props.payload.fullName]***REMOVED***
            config=***REMOVED******REMOVED*** pie: chartConfigs.pie, tooltip: chartConfigs.tooltip, legend: chartConfigs.legend ***REMOVED******REMOVED***
            showLegend=***REMOVED***!isMobile***REMOVED***
          />
        );

      case 2: // Horas diarias - AreaChart
        return (
          <BaseChart
            data=***REMOVED***dailyData***REMOVED***
            chartType="area"
            dataKeys=***REMOVED***[***REMOVED*** key: 'horas', stroke: chartConfigs.area.stroke, fill: chartConfigs.area.fill ***REMOVED***]***REMOVED***
            nameKey="dia"
            valueFormatter=***REMOVED***(value) => `$***REMOVED***value***REMOVED***h`***REMOVED***
            tooltipFormatter=***REMOVED***(value) => [`$***REMOVED***value.toFixed(1)***REMOVED*** horas`, 'Horas']***REMOVED***
            config=***REMOVED******REMOVED*** area: chartConfigs.area, grid: chartConfigs.grid, axis: chartConfigs.axis, tooltip: chartConfigs.tooltip ***REMOVED******REMOVED***
          />
        );

      default: return null;
    ***REMOVED***
  ***REMOVED***;

  const isEmptyOverall = !datosActuales || datosActuales.totalGanado === 0;
  const CurrentIcon = currentChartConfig.icon;

  return (
    <Card className="h-full flex flex-col">
      <Flex variant="between" className="mb-4 flex-shrink-0">
        <Flex>
          <CurrentIcon size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors.primary ***REMOVED******REMOVED*** className="mr-2" />
          <div>
            <h4 className="font-medium">***REMOVED***currentChartConfig.title***REMOVED***</h4>
            <p className="text-xs text-gray-500">***REMOVED***currentChartConfig.subtitle***REMOVED***</p>
          </div>
        </Flex>
        <Flex className="space-x-2">
          <button onClick=***REMOVED***prevChart***REMOVED*** className="p-2 rounded transition-colors hover:bg-gray-100" style=***REMOVED******REMOVED*** color: thematicColors.primary ***REMOVED******REMOVED***>
            <ChevronLeft size=***REMOVED***16***REMOVED*** />
          </button>
          <div className="flex space-x-1">
            ***REMOVED***staticChartConfigs.map((_, index) => (
              <div key=***REMOVED***index***REMOVED*** className=***REMOVED***`w-2 h-2 rounded-full transition-colors $***REMOVED***index === currentChartIndex ? 'opacity-100' : 'opacity-30'***REMOVED***`***REMOVED*** style=***REMOVED******REMOVED*** backgroundColor: thematicColors.primary ***REMOVED******REMOVED***/>
            ))***REMOVED***
          </div>
          <button onClick=***REMOVED***nextChart***REMOVED*** className="p-2 rounded transition-colors hover:bg-gray-100" style=***REMOVED******REMOVED*** color: thematicColors.primary ***REMOVED******REMOVED***>
            <ChevronRight size=***REMOVED***16***REMOVED*** />
          </button>
        </Flex>
      </Flex>
      <div className="flex-1 bg-gray-50 rounded-lg p-2 min-h-0">
        ***REMOVED***isEmptyOverall ? (
          <Flex variant="center" className="h-full text-gray-500">
            <p>Sin datos para gráficos</p>
          </Flex>
        ) : renderChart()***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default InteractiveCharts;