// src/components/stats/InteractiveCharts/index.jsx

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BaseChart from '../../charts/BaseChart'; 
import { useStats } from '../../../contexts/StatsContext';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { formatCurrency } from '../../../utils/currency';
import { getRechartsConfig, CHART_CONFIGS as staticChartConfigs, PIE_CHART_COLORS } from '../../../config/chartConfig';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const InteractiveCharts = () => {
  const { currentData, weeklyEvolutionData, thematicColors } = useStats();
  const [currentChartIndex, setCurrentChartIndex] = useState(0);
  const isMobile = useIsMobile();
  
  const chartConfigs = getRechartsConfig(thematicColors);

  // Data for Pie Chart (Top 5 works)
  const workData = (currentData?.earningsByWork || [])
    .slice(0, 5)
    .map((work, index) => ({
      name: work.name.length > 12 ? `${work.name.substring(0, 12)}...` : work.name,
      value: work.earnings,
      color: work.color || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
      fullName: work.name,
    }));

  // Data for daily hours
  const dailyData = currentData?.earningsByDay
    ? Object.entries(currentData.earningsByDay).map(([day, data]) => ({
        day: day.substring(0, 3),
        hours: data.hours || 0,
        earnings: data.earnings || 0,
      }))
    : [];

  const nextChart = () => setCurrentChartIndex((prev) => (prev + 1) % staticChartConfigs.length);
  const prevChart = () => setCurrentChartIndex((prev) => (prev - 1 + staticChartConfigs.length) % staticChartConfigs.length);

  const currentChartConfig = staticChartConfigs[currentChartIndex];
  
  const renderChart = () => {
    switch (currentChartIndex) {
      case 0: // Weekly Evolution - LineChart
        return (
          <BaseChart
            data={weeklyEvolutionData}
            chartType="line"
            dataKeys={[{ key: 'earnings', stroke: chartConfigs.line.stroke }]}
            nameKey="week"
            valueFormatter={(value) => formatCurrency(value)}
            tooltipFormatter={(value) => [formatCurrency(value), 'Earnings']}
            config={{ line: chartConfigs.line, grid: chartConfigs.grid, axis: chartConfigs.axis, tooltip: chartConfigs.tooltip }}
          />
        );

      case 1: // By Works - PieChart
        return (
          <BaseChart
            data={workData}
            chartType="pie"
            dataKeys="value" // For pie, dataKeys is a string for the valueKey
            nameKey="name"
            tooltipFormatter={(value, name, props) => [formatCurrency(value), props.payload.fullName]}
            config={{ pie: chartConfigs.pie, tooltip: chartConfigs.tooltip, legend: chartConfigs.legend }}
            showLegend={!isMobile}
          />
        );

      case 2: // Daily Hours - AreaChart
        return (
          <BaseChart
            data={dailyData}
            chartType="area"
            dataKeys={[{ key: 'hours', stroke: chartConfigs.area.stroke, fill: chartConfigs.area.fill }]}
            nameKey="day"
            valueFormatter={(value) => `${value}h`}
            tooltipFormatter={(value) => [`${value.toFixed(1)} hours`, 'Hours']}
            config={{ area: chartConfigs.area, grid: chartConfigs.grid, axis: chartConfigs.axis, tooltip: chartConfigs.tooltip }}
          />
        );

      default: return null;
    }
  };

  const isEmptyOverall = !currentData || currentData.totalEarned === 0;
  const CurrentIcon = currentChartConfig.icon;

  return (
    <Card className="h-full flex flex-col">
      <Flex variant="between" className="mb-4 flex-shrink-0">
        <Flex>
          <CurrentIcon size={18} style={{ color: thematicColors.primary }} className="mr-2" />
          <div>
            <h4 className="font-medium">{currentChartConfig.title}</h4>
            <p className="text-xs text-gray-500">{currentChartConfig.subtitle}</p>
          </div>
        </Flex>
        <Flex className="space-x-2">
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
        </Flex>
      </Flex>
      <div className="flex-1 bg-gray-50 rounded-lg p-2 min-h-0">
        {isEmptyOverall ? (
          <Flex variant="center" className="h-full text-gray-500">
            <p>No data for charts</p>
          </Flex>
        ) : renderChart()}
      </div>
    </Card>
  );
};

export default InteractiveCharts;