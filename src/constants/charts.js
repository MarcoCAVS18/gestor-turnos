// src/constants/charts.js

import { TrendingUp, Clock, PieChart } from 'lucide-react';

// Configuration of available charts
export const CHART_CONFIGS = [
  {
    id: 'evolution',
    title: 'Weekly Evolution',
    subtitle: 'Earnings Progress',
    icon: TrendingUp,
    type: 'line'
  },
  {
    id: 'works',
    title: 'By Work',
    subtitle: 'Earnings Distribution',
    icon: PieChart,
    type: 'pie'
  },
  {
    id: 'daily',
    title: 'Daily Hours',
    subtitle: 'Weekly Distribution',
    icon: Clock,
    type: 'area'
  }
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
export const RECHARTS_CONFIG = {
  pie: {
    innerRadius: 40,
    outerRadius: 80,
    paddingAngle: 2
  },
  tooltip: {
    contentStyle: { 
      backgroundColor: 'white', 
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '12px'
    }
  },
  legend: {
    verticalAlign: 'bottom',
    height: 36,
    wrapperStyle: { fontSize: '11px' }
  }
};

// Settings for CSS charts
export const CSS_CHART_CONFIG = {
  heights: {
    container: 'h-80', // 320px total container
    chart: '280px'     // Internal height of charts
  },
  animation: {
    duration: 'duration-500',
    easing: 'ease-out'
  }
};