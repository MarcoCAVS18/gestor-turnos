// src/constants/charts.js

import ***REMOVED*** TrendingUp, Clock, PieChart ***REMOVED*** from 'lucide-react';

// Configuration of available charts
export const CHART_CONFIGS = [
  ***REMOVED***
    id: 'evolution',
    title: 'Weekly Evolution',
    subtitle: 'Earnings Progress',
    icon: TrendingUp,
    type: 'line'
  ***REMOVED***,
  ***REMOVED***
    id: 'works',
    title: 'By Work',
    subtitle: 'Earnings Distribution',
    icon: PieChart,
    type: 'pie'
  ***REMOVED***,
  ***REMOVED***
    id: 'daily',
    title: 'Daily Hours',
    subtitle: 'Weekly Distribution',
    icon: Clock,
    type: 'area'
  ***REMOVED***
];

// Flat colors for pie chart
export const PIE_CHART_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#84CC16'  // Lime
];

// Recharts Configuration
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

// Settings for CSS charts
export const CSS_CHART_CONFIG = ***REMOVED***
  heights: ***REMOVED***
    container: 'h-80', // 320px total container
    chart: '280px'     // Internal height of charts
  ***REMOVED***,
  animation: ***REMOVED***
    duration: 'duration-500',
    easing: 'ease-out'
  ***REMOVED***
***REMOVED***;