// src/constants/charts.js

import ***REMOVED*** TrendingUp, Clock, PieChart ***REMOVED*** from 'lucide-react';

// Configuración de los gráficos disponibles
export const CHART_CONFIGS = [
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
    icon: PieChart,
    type: 'pie'
  ***REMOVED***,
  ***REMOVED***
    id: 'daily',
    title: 'Horas Diarias',
    subtitle: 'Distribución semanal',
    icon: Clock,
    type: 'area'
  ***REMOVED***
];

// Colores planos para gráfico de torta
export const PIE_CHART_COLORS = [
  '#3B82F6', // Azul
  '#10B981', // Verde
  '#F59E0B', // Amarillo
  '#EF4444', // Rojo
  '#8B5CF6', // Púrpura
  '#06B6D4', // Cian
  '#84CC16'  // Lima
];

// Configuración de Recharts
export const RECHARTS_CONFIG = ***REMOVED***
  pie: ***REMOVED***
    innerRadius: 40,
    outerRadius: 80,
    paddingAngle: 2
  ***REMOVED***,
  tooltip: ***REMOVED***
    contentStyle: ***REMOVED*** 
      backgroundColor: 'white', 
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '12px'
    ***REMOVED***
  ***REMOVED***,
  legend: ***REMOVED***
    verticalAlign: 'bottom',
    height: 36,
    wrapperStyle: ***REMOVED*** fontSize: '11px' ***REMOVED***
  ***REMOVED***
***REMOVED***;

// Configuraciones para gráficos CSS
export const CSS_CHART_CONFIG = ***REMOVED***
  heights: ***REMOVED***
    container: 'h-80', // 320px contenedor total
    chart: '280px'     // Altura interna de gráficos
  ***REMOVED***,
  animation: ***REMOVED***
    duration: 'duration-500',
    easing: 'ease-out'
  ***REMOVED***
***REMOVED***;