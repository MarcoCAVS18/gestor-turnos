// src/services/export/utils/ChartRenderer.js

import React from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import {
  WeeklyEvolutionChart,
  WorkDistributionChart,
  DailyEarningsChart,
  ShiftTypeChart,
  PlatformComparisonChart,
  MonthlyTrendChart,
  KPIRow
} from './ExportCharts';
import logger from '../../../utils/logger';

/**
 * Renders a React component to an image (base64 PNG)
 * @param {React.Component} Component - The React component to render
 * @param {Object} props - Props to pass to the component
 * @param {Object} options - Rendering options
 * @returns {Promise<{base64: string, width: number, height: number}>}
 */
export const renderComponentToImage = async (Component, props, options = {}) => {
  const {
    width = 400,
    height = 300,
    scale = 2,
    backgroundColor = '#ffffff'
  } = options;

  return new Promise((resolve, reject) => {
    // Create temporary container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = `${width}px`;
    container.style.minHeight = `${height}px`;
    container.style.height = 'auto';
    container.style.backgroundColor = backgroundColor;
    container.style.fontFamily = "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    document.body.appendChild(container);

    // Create React root and render
    const root = createRoot(container);
    root.render(<Component {...props} width={width} height={height} />);

    // Wait for render to complete
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(container, {
          backgroundColor,
          scale,
          logging: false,
          useCORS: true,
          allowTaint: true
        });

        const base64 = canvas.toDataURL('image/png');

        // Cleanup
        root.unmount();
        document.body.removeChild(container);

        resolve({
          base64,
          width: canvas.width,
          height: canvas.height
        });
      } catch (error) {
        // Cleanup on error
        try {
          root.unmount();
          document.body.removeChild(container);
        } catch (e) {
          // Ignore cleanup errors
        }
        reject(error);
      }
    }, 1500); // Wait for charts to render
  });
};

/**
 * Generates all charts needed for the report
 * @param {Object} chartData - Data for all charts
 * @param {Object} colors - Custom colors for charts
 * @returns {Promise<Object>} Object containing all chart images
 */
export const generateAllCharts = async (chartData, colors = {}) => {
  const primaryColor = colors.primary || '#EC4899';
  const secondaryColor = colors.secondary || '#3B82F6';

  const charts = {};

  try {
    // Weekly Evolution Chart
    if (chartData.weeklyEvolution && chartData.weeklyEvolution.length > 0) {
      charts.weeklyEvolution = await renderComponentToImage(
        WeeklyEvolutionChart,
        { data: chartData.weeklyEvolution, primaryColor },
        { width: 500, height: 280 }
      );
    }

    // Work Distribution Chart
    if (chartData.workDistribution && chartData.workDistribution.length > 0) {
      charts.workDistribution = await renderComponentToImage(
        WorkDistributionChart,
        { data: chartData.workDistribution },
        { width: 400, height: 280 }
      );
    }

    // Daily Earnings Chart
    if (chartData.dailyEarnings && chartData.dailyEarnings.length > 0) {
      charts.dailyEarnings = await renderComponentToImage(
        DailyEarningsChart,
        { data: chartData.dailyEarnings, primaryColor },
        { width: 500, height: 280 }
      );
    }

    // Shift Type Distribution Chart
    if (chartData.shiftTypeDistribution && chartData.shiftTypeDistribution.length > 0) {
      charts.shiftTypeDistribution = await renderComponentToImage(
        ShiftTypeChart,
        { data: chartData.shiftTypeDistribution },
        { width: 400, height: 280 }
      );
    }

    // Platform Comparison Chart (only if delivery data exists)
    if (chartData.platformComparison && chartData.platformComparison.length > 0) {
      charts.platformComparison = await renderComponentToImage(
        PlatformComparisonChart,
        { data: chartData.platformComparison },
        { width: 550, height: 250 }
      );
    }

    // Monthly Trend Chart
    if (chartData.monthlyTrend && chartData.monthlyTrend.length > 0) {
      charts.monthlyTrend = await renderComponentToImage(
        MonthlyTrendChart,
        { data: chartData.monthlyTrend, primaryColor, secondaryColor },
        { width: 500, height: 280 }
      );
    }
  } catch (error) {
    logger.error('Error generating charts:', error);
  }

  return charts;
};

/**
 * Generates KPI row image
 * @param {Array} kpis - Array of KPI objects { label, value, color }
 * @returns {Promise<{base64: string, width: number, height: number}>}
 */
export const generateKPIRow = async (kpis) => {
  return renderComponentToImage(
    KPIRow,
    { kpis },
    { width: 600, height: 100 }
  );
};

/**
 * Generates a single chart by type
 * @param {string} chartType - Type of chart to generate
 * @param {Object} data - Data for the chart
 * @param {Object} options - Chart options
 * @returns {Promise<{base64: string, width: number, height: number}>}
 */
export const generateChart = async (chartType, data, options = {}) => {
  const chartComponents = {
    weeklyEvolution: WeeklyEvolutionChart,
    workDistribution: WorkDistributionChart,
    dailyEarnings: DailyEarningsChart,
    shiftType: ShiftTypeChart,
    platformComparison: PlatformComparisonChart,
    monthlyTrend: MonthlyTrendChart
  };

  const Component = chartComponents[chartType];
  if (!Component) {
    throw new Error(`Unknown chart type: ${chartType}`);
  }

  return renderComponentToImage(Component, { data, ...options }, options);
};

/**
 * Batch generates multiple charts with progress callback
 * @param {Object} chartData - Data for all charts
 * @param {Object} colors - Custom colors
 * @param {Function} onProgress - Progress callback (chartName, current, total)
 * @returns {Promise<Object>} Object containing all chart images
 */
export const generateChartsWithProgress = async (chartData, colors = {}, onProgress = null) => {
  const charts = {};
  const chartConfigs = [
    { key: 'weeklyEvolution', Component: WeeklyEvolutionChart, width: 500, height: 280 },
    { key: 'workDistribution', Component: WorkDistributionChart, width: 400, height: 280 },
    { key: 'dailyEarnings', Component: DailyEarningsChart, width: 500, height: 280 },
    { key: 'shiftTypeDistribution', Component: ShiftTypeChart, width: 400, height: 280 },
    { key: 'platformComparison', Component: PlatformComparisonChart, width: 550, height: 250 },
    { key: 'monthlyTrend', Component: MonthlyTrendChart, width: 500, height: 280 }
  ];

  const validCharts = chartConfigs.filter(config =>
    chartData[config.key] && chartData[config.key].length > 0
  );

  for (let i = 0; i < validCharts.length; i++) {
    const config = validCharts[i];

    if (onProgress) {
      onProgress(config.key, i + 1, validCharts.length);
    }

    try {
      const props = { data: chartData[config.key] };
      if (colors.primary) props.primaryColor = colors.primary;
      if (colors.secondary) props.secondaryColor = colors.secondary;

      charts[config.key] = await renderComponentToImage(
        config.Component,
        props,
        { width: config.width, height: config.height }
      );
    } catch (error) {
      logger.warn(`Failed to generate ${config.key} chart:`, error);
    }
  }

  return charts;
};

const ChartRendererModule = {
  renderComponentToImage,
  generateAllCharts,
  generateKPIRow,
  generateChart,
  generateChartsWithProgress
};

export default ChartRendererModule;
