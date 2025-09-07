// src/components/stats/InteractiveCharts/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** ChevronLeft, ChevronRight, BarChart3, TrendingUp, Clock ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';

const InteractiveCharts = (***REMOVED*** datosActuales, gananciaPorTrabajo = [] ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const [currentChart, setCurrentChart] = useState(0);

  // Configuración de los gráficos
  const charts = [
    ***REMOVED***
      id: 'evolution',
      title: 'Evolución Semanal',
      subtitle: 'Progreso de ganancias',
      icon: TrendingUp,
      type: 'line'
    ***REMOVED***,
    ***REMOVED***
      id: 'works',
      title: 'Por Trabajos',
      subtitle: 'Distribución de ganancias',
      icon: BarChart3,
      type: 'bar'
    ***REMOVED***,
    ***REMOVED***
      id: 'daily',
      title: 'Horas Diarias',
      subtitle: 'Distribución semanal',
      icon: Clock,
      type: 'area'
    ***REMOVED***
  ];

  // Datos para evolución semanal (simulado - últimas 4 semanas)
  const evolutionData = [
    ***REMOVED*** semana: 'Hace 3 sem', ganancia: datosActuales.totalGanado * 0.7 ***REMOVED***,
    ***REMOVED*** semana: 'Hace 2 sem', ganancia: datosActuales.totalGanado * 0.85 ***REMOVED***,
    ***REMOVED*** semana: 'Sem pasada', ganancia: datosActuales.totalGanado * 0.92 ***REMOVED***,
    ***REMOVED*** semana: 'Esta semana', ganancia: datosActuales.totalGanado ***REMOVED***
  ];

  // Datos para trabajos (usar gananciaPorTrabajo del hook)
  const workData = gananciaPorTrabajo.slice(0, 4).map(trabajo => (***REMOVED***
    name: trabajo.nombre.length > 10 ? trabajo.nombre.substring(0, 10) + '...' : trabajo.nombre,
    ganancia: trabajo.ganancia,
    color: trabajo.color
  ***REMOVED***));

  // Datos para horas diarias
  const dailyData = datosActuales.gananciaPorDia ? 
    Object.entries(datosActuales.gananciaPorDia).map(([dia, datos]) => (***REMOVED***
      dia: dia.substring(0, 3),
      horas: datos.horas || 0,
      ganancia: datos.ganancia || 0
    ***REMOVED***)) : [];

  const nextChart = () => ***REMOVED***
    setCurrentChart((prev) => (prev + 1) % charts.length);
  ***REMOVED***;

  const prevChart = () => ***REMOVED***
    setCurrentChart((prev) => (prev - 1 + charts.length) % charts.length);
  ***REMOVED***;

  const currentChartConfig = charts[currentChart];

  // Renderizar gráfico simple con CSS
  const renderChart = () => ***REMOVED***
    switch (currentChart) ***REMOVED***
      case 0: // Evolución semanal - Línea simple
        const maxEvolution = Math.max(...evolutionData.map(d => d.ganancia));
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>$0</span>
              <span>***REMOVED***formatCurrency(maxEvolution)***REMOVED***</span>
            </div>
            <div className="flex items-end space-x-2 h-32">
              ***REMOVED***evolutionData.map((data, index) => ***REMOVED***
                const height = (data.ganancia / maxEvolution) * 100;
                return (
                  <div key=***REMOVED***index***REMOVED*** className="flex-1 flex flex-col items-center">
                    <div className="relative w-full mb-2" style=***REMOVED******REMOVED*** height: '120px' ***REMOVED******REMOVED***>
                      <div 
                        className="absolute bottom-0 w-full rounded-t transition-all duration-500"
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

      case 1: // Por trabajos - Barras
        const maxWork = Math.max(...workData.map(d => d.ganancia));
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Ganancias por trabajo</span>
              <span>***REMOVED***formatCurrency(maxWork)***REMOVED***</span>
            </div>
            <div className="space-y-3">
              ***REMOVED***workData.map((trabajo, index) => ***REMOVED***
                const width = (trabajo.ganancia / maxWork) * 100;
                return (
                  <div key=***REMOVED***index***REMOVED*** className="flex items-center space-x-3">
                    <div className="w-16 text-xs text-gray-600 truncate">***REMOVED***trabajo.name***REMOVED***</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                      <div 
                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                        style=***REMOVED******REMOVED*** 
                          width: `$***REMOVED***width***REMOVED***%`,
                          backgroundColor: trabajo.color
                        ***REMOVED******REMOVED***
                      />
                    </div>
                    <div className="w-16 text-xs font-medium text-right">
                      ***REMOVED***formatCurrency(trabajo.ganancia)***REMOVED***
                    </div>
                  </div>
                );
              ***REMOVED***)***REMOVED***
            </div>
          </div>
        );

      case 2: // Horas diarias - Área simple
        const maxHours = Math.max(...dailyData.map(d => d.horas));
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Horas por día</span>
              <span>***REMOVED***maxHours.toFixed(1)***REMOVED***h máximo</span>
            </div>
            <div className="flex items-end space-x-1 h-32">
              ***REMOVED***dailyData.map((data, index) => ***REMOVED***
                const height = maxHours > 0 ? (data.horas / maxHours) * 100 : 0;
                return (
                  <div key=***REMOVED***index***REMOVED*** className="flex-1 flex flex-col items-center">
                    <div className="relative w-full mb-2" style=***REMOVED******REMOVED*** height: '120px' ***REMOVED******REMOVED***>
                      <div 
                        className="absolute bottom-0 w-full rounded-t transition-all duration-500"
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
      <Card className="h-full">
        <div className="text-center py-8">
          <BarChart3 size=***REMOVED***32***REMOVED*** className="mx-auto mb-3 text-gray-300" />
          <h4 className="text-sm font-medium text-gray-600 mb-1">
            Sin datos para gráficos
          </h4>
          <p className="text-xs text-gray-500">
            Los gráficos aparecerán con más actividad
          </p>
        </div>
      </Card>
    );
  ***REMOVED***

  const CurrentIcon = currentChartConfig.icon;

  return (
    <Card className="h-full">
      ***REMOVED***/* Header con navegación */***REMOVED***
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <CurrentIcon size=***REMOVED***16***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-1" />
          <div>
            <h4 className="font-medium text-sm">***REMOVED***currentChartConfig.title***REMOVED***</h4>
            <p className="text-xs text-gray-500">***REMOVED***currentChartConfig.subtitle***REMOVED***</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick=***REMOVED***prevChart***REMOVED***
            className="p-1 rounded transition-colors hover:bg-gray-100"
            style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
          >
            <ChevronLeft size=***REMOVED***14***REMOVED*** />
          </button>
          
          <div className="flex space-x-1">
            ***REMOVED***charts.map((_, index) => (
              <div
                key=***REMOVED***index***REMOVED***
                className=***REMOVED***`w-1.5 h-1.5 rounded-full transition-colors $***REMOVED***
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
            className="p-1 rounded transition-colors hover:bg-gray-100"
            style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
          >
            <ChevronRight size=***REMOVED***14***REMOVED*** />
          </button>
        </div>
      </div>

      ***REMOVED***/* Gráfico */***REMOVED***
      <div className="h-40">
        ***REMOVED***renderChart()***REMOVED***
      </div>

      ***REMOVED***/* Indicador actual */***REMOVED***
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-400">
          ***REMOVED***currentChart + 1***REMOVED*** de ***REMOVED***charts.length***REMOVED***
        </p>
      </div>
    </Card>
  );
***REMOVED***;

export default InteractiveCharts;