// src/components/stats/InteractiveCharts/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** ChevronLeft, ChevronRight, BarChart3 ***REMOVED*** from 'lucide-react';
import ***REMOVED*** PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend ***REMOVED*** from 'recharts';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';
import ***REMOVED*** CHART_CONFIGS, PIE_CHART_COLORS, RECHARTS_CONFIG, CSS_CHART_CONFIG ***REMOVED*** from '../../../constants/charts';

const InteractiveCharts = (***REMOVED*** datosActuales, gananciaPorTrabajo = [] ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const [currentChart, setCurrentChart] = useState(0);

  // Datos para evolución semanal (simulado - últimas 4 semanas)
  const evolutionData = [
    ***REMOVED*** semana: 'Hace 3 sem', ganancia: datosActuales.totalGanado * 0.7 ***REMOVED***,
    ***REMOVED*** semana: 'Hace 2 sem', ganancia: datosActuales.totalGanado * 0.85 ***REMOVED***,
    ***REMOVED*** semana: 'Sem pasada', ganancia: datosActuales.totalGanado * 0.92 ***REMOVED***,
    ***REMOVED*** semana: 'Esta semana', ganancia: datosActuales.totalGanado ***REMOVED***
  ];

  // Datos para trabajos (preparados para gráfico de torta)
  const workData = gananciaPorTrabajo.slice(0, 5).map((trabajo, index) => ***REMOVED***
    return ***REMOVED***
      name: trabajo.nombre.length > 12 ? trabajo.nombre.substring(0, 12) + '...' : trabajo.nombre,
      value: trabajo.ganancia,
      color: trabajo.color || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
      fullName: trabajo.nombre
    ***REMOVED***;
  ***REMOVED***);

  // Datos para horas diarias
  const dailyData = datosActuales.gananciaPorDia ? 
    Object.entries(datosActuales.gananciaPorDia).map(([dia, datos]) => (***REMOVED***
      dia: dia.substring(0, 3),
      horas: datos.horas || 0,
      ganancia: datos.ganancia || 0
    ***REMOVED***)) : [];

  const nextChart = () => ***REMOVED***
    setCurrentChart((prev) => (prev + 1) % CHART_CONFIGS.length);
  ***REMOVED***;

  const prevChart = () => ***REMOVED***
    setCurrentChart((prev) => (prev - 1 + CHART_CONFIGS.length) % CHART_CONFIGS.length);
  ***REMOVED***;

  const currentChartConfig = CHART_CONFIGS[currentChart];

  // Renderizar gráfico según el tipo actual
  const renderChart = () => ***REMOVED***
    switch (currentChart) ***REMOVED***
      case 0: // Evolución semanal - Línea simple
        const maxEvolution = Math.max(...evolutionData.map(d => d.ganancia));
        return (
          <div className="space-y-3 h-full">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>$0</span>
              <span>***REMOVED***formatCurrency(maxEvolution)***REMOVED***</span>
            </div>
            <div className="flex items-end space-x-2" style=***REMOVED******REMOVED*** height: CSS_CHART_CONFIG.heights.chart ***REMOVED******REMOVED***>
              ***REMOVED***evolutionData.map((data, index) => ***REMOVED***
                const height = (data.ganancia / maxEvolution) * 100;
                return (
                  <div key=***REMOVED***index***REMOVED*** className="flex-1 flex flex-col items-center h-full">
                    <div className="relative w-full mb-2 flex-1">
                      <div 
                        className=***REMOVED***`absolute bottom-0 w-full rounded-t transition-all $***REMOVED***CSS_CHART_CONFIG.animation.duration***REMOVED***`***REMOVED***
                        style=***REMOVED******REMOVED*** 
                          height: `$***REMOVED***height***REMOVED***%`,
                          backgroundColor: colors.transparent20
                        ***REMOVED******REMOVED***
                      />
                      <div 
                        className="absolute bottom-0 w-2 h-2 rounded-full transform -translate-x-1/2 left-1/2"
                        style=***REMOVED******REMOVED*** 
                          bottom: `$***REMOVED***height***REMOVED***%`,
                          backgroundColor: colors.primary
                        ***REMOVED******REMOVED***
                      />
                    </div>
                    <span className="text-xs text-gray-600 text-center">***REMOVED***data.semana***REMOVED***</span>
                    <span className="text-xs font-medium">***REMOVED***formatCurrency(data.ganancia)***REMOVED***</span>
                  </div>
                );
              ***REMOVED***)***REMOVED***
            </div>
          </div>
        );

      case 1: // Por trabajos - Gráfico de torta con Recharts
        if (workData.length === 0) ***REMOVED***
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <currentChartConfig.icon size=***REMOVED***32***REMOVED*** className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Sin datos de trabajos</p>
              </div>
            </div>
          );
        ***REMOVED***
        
        return (
          <div className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data=***REMOVED***workData***REMOVED***
                  cx="50%"
                  cy="50%"
                  innerRadius=***REMOVED***RECHARTS_CONFIG.pie.innerRadius***REMOVED***
                  outerRadius=***REMOVED***RECHARTS_CONFIG.pie.outerRadius***REMOVED***
                  paddingAngle=***REMOVED***RECHARTS_CONFIG.pie.paddingAngle***REMOVED***
                  dataKey="value"
                >
                  ***REMOVED***workData.map((entry, index) => (
                    <Cell key=***REMOVED***`cell-$***REMOVED***index***REMOVED***`***REMOVED*** fill=***REMOVED***entry.color***REMOVED*** />
                  ))***REMOVED***
                </Pie>
                <Tooltip 
                  formatter=***REMOVED***(value, name, props) => [
                    formatCurrency(value), 
                    props.payload.fullName
                  ]***REMOVED***
                  labelStyle=***REMOVED******REMOVED*** display: 'none' ***REMOVED******REMOVED***
                  contentStyle=***REMOVED***RECHARTS_CONFIG.tooltip.contentStyle***REMOVED***
                />
                <Legend 
                  verticalAlign=***REMOVED***RECHARTS_CONFIG.legend.verticalAlign***REMOVED***
                  height=***REMOVED***RECHARTS_CONFIG.legend.height***REMOVED***
                  wrapperStyle=***REMOVED***RECHARTS_CONFIG.legend.wrapperStyle***REMOVED***
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
              <span>***REMOVED***maxHours.toFixed(1)***REMOVED***h máximo</span>
            </div>
            <div className="flex items-end space-x-1" style=***REMOVED******REMOVED*** height: CSS_CHART_CONFIG.heights.chart ***REMOVED******REMOVED***>
              ***REMOVED***dailyData.map((data, index) => ***REMOVED***
                const height = maxHours > 0 ? (data.horas / maxHours) * 100 : 0;
                return (
                  <div key=***REMOVED***index***REMOVED*** className="flex-1 flex flex-col items-center h-full">
                    <div className="relative w-full mb-2 flex-1">
                      <div 
                        className=***REMOVED***`absolute bottom-0 w-full rounded-t transition-all $***REMOVED***CSS_CHART_CONFIG.animation.duration***REMOVED***`***REMOVED***
                        style=***REMOVED******REMOVED*** 
                          height: `$***REMOVED***height***REMOVED***%`,
                          background: `linear-gradient(to top, $***REMOVED***colors.primary***REMOVED***, $***REMOVED***colors.transparent20***REMOVED***)`
                        ***REMOVED******REMOVED***
                      />
                    </div>
                    <span className="text-xs text-gray-600">***REMOVED***data.dia***REMOVED***</span>
                    <span className="text-xs font-medium">***REMOVED***data.horas.toFixed(1)***REMOVED***h</span>
                  </div>
                );
              ***REMOVED***)***REMOVED***
            </div>
          </div>
        );

      default:
        return null;
    ***REMOVED***
  ***REMOVED***;

  // Si no hay datos suficientes, mostrar estado vacío
  if (!datosActuales || datosActuales.totalGanado === 0) ***REMOVED***
    return (
      <Card className="h-full flex flex-col">
        ***REMOVED***/* Header con navegación - FIJO */***REMOVED***
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center">
            <BarChart3 size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
            <div>
              <h4 className="font-medium">Gráficos Interactivos</h4>
              <p className="text-xs text-gray-500">Sin datos disponibles</p>
            </div>
          </div>
        </div>

        ***REMOVED***/* Contenedor centrado */***REMOVED***
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <BarChart3 size=***REMOVED***32***REMOVED*** className="mx-auto mb-3 text-gray-300" />
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
  ***REMOVED***

  const CurrentIcon = currentChartConfig.icon;

  return (
    <Card className="h-full flex flex-col">
      ***REMOVED***/* Header con navegación - FIJO */***REMOVED***
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center">
          <CurrentIcon size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
          <div>
            <h4 className="font-medium">***REMOVED***currentChartConfig.title***REMOVED***</h4>
            <p className="text-xs text-gray-500">***REMOVED***currentChartConfig.subtitle***REMOVED***</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick=***REMOVED***prevChart***REMOVED***
            className="p-2 rounded transition-colors hover:bg-gray-100"
            style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
          >
            <ChevronLeft size=***REMOVED***16***REMOVED*** />
          </button>
          
          <div className="flex space-x-1">
            ***REMOVED***CHART_CONFIGS.map((_, index) => (
              <div
                key=***REMOVED***index***REMOVED***
                className=***REMOVED***`w-2 h-2 rounded-full transition-colors $***REMOVED***
                  index === currentChart 
                    ? 'opacity-100' 
                    : 'opacity-30'
                ***REMOVED***`***REMOVED***
                style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
              />
            ))***REMOVED***
          </div>
          
          <button
            onClick=***REMOVED***nextChart***REMOVED***
            className="p-2 rounded transition-colors hover:bg-gray-100"
            style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
          >
            <ChevronRight size=***REMOVED***16***REMOVED*** />
          </button>
        </div>
      </div>

      ***REMOVED***/* CONTENEDOR UNIFICADO: Ocupa TODO el espacio hasta el header */***REMOVED***
      <div className="flex-1 bg-gray-50 rounded-lg p-4 flex flex-col">
        ***REMOVED***/* Gráfico - Ocupa la mayor parte del espacio */***REMOVED***
        <div className="flex-1 min-h-0">
          ***REMOVED***renderChart()***REMOVED***
        </div>
        
        ***REMOVED***/* Indicador - Siempre al fondo del contenedor */***REMOVED***
        <div className="text-center pt-4">
          <p className="text-xs text-gray-400">
            ***REMOVED***currentChart + 1***REMOVED*** de ***REMOVED***CHART_CONFIGS.length***REMOVED***
          </p>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default InteractiveCharts;