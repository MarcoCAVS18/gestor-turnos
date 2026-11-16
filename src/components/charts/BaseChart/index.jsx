import React from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar } from 'recharts';
import Flex from '../../ui/Flex';
import { getRechartsConfig, PIE_CHART_COLORS } from '../../../config/chartConfig';
import { useThemeColors } from '../../../hooks/useThemeColors';

const BaseChart = ({
  data,
  chartType,
  dataKeys,
  nameKey,
  valueFormatter,
  tooltipFormatter,
  customTooltipContent,
  config = {},
  pieOuterRadius = '80%',
  pieInnerRadius = '60%',
  showLegend = true,
  margin = { top: 5, right: 20, left: -10, bottom: 5 }
}) => {
  const { t } = useTranslation();
  const thematicColors = useThemeColors();
  const baseConfig = getRechartsConfig(thematicColors);

  // Merge base config with any overrides
  const chartConfig = {
    ...baseConfig,
    ...config,
    axis: { ...baseConfig.axis, ...config.axis },
    tooltip: { ...baseConfig.tooltip, ...config.tooltip },
    legend: { ...baseConfig.legend, ...config.legend },
  };

  if (!data || data.length === 0) {
    // This empty state is simple; more complex empty states can be handled by the parent component
    return (
      <Flex variant="center" className="h-full text-gray-500">
        <p>{t('stats.charts.noData')}</p>
      </Flex>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data} margin={margin}>
            <CartesianGrid {...chartConfig.grid} />
            <XAxis dataKey={nameKey} tick={chartConfig.axis.tick} />
            <YAxis tickFormatter={valueFormatter} tick={chartConfig.axis.tick} />
            {showLegend && <Legend {...chartConfig.legend} />}
            <Tooltip
              formatter={tooltipFormatter}
              content={customTooltipContent || chartConfig.customTooltip}
              {...chartConfig.tooltip}
            />
            {dataKeys.map((item, index) => (
              <Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.name || item.key}
                stroke={item.stroke || thematicColors.primary || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                {...chartConfig.line}
              />
            ))}
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data} margin={margin}>
            <CartesianGrid {...chartConfig.grid} />
            <XAxis dataKey={nameKey} tick={chartConfig.axis.tick} />
            <YAxis tickFormatter={valueFormatter} tick={chartConfig.axis.tick} />
            {showLegend && <Legend {...chartConfig.legend} />}
            <Tooltip
              formatter={tooltipFormatter}
              content={customTooltipContent || chartConfig.customTooltip}
              {...chartConfig.tooltip}
            />
            {dataKeys.map((item, index) => (
              <Area
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.name || item.key}
                stroke={item.stroke || thematicColors.primary || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                fill={item.fill || thematicColors.transparent20 || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                {...chartConfig.area}
              />
            ))}
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKeys} // For pie, dataKeys is a string for the value
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              outerRadius={pieOuterRadius}
              innerRadius={pieInnerRadius}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
              {...chartConfig.pie}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
              ))}
            </Pie>
            {showLegend && <Legend {...chartConfig.legend} />}
            <Tooltip
              formatter={tooltipFormatter}
              content={customTooltipContent || chartConfig.customTooltip}
              {...chartConfig.tooltip}
            />
          </PieChart>
        );
      case 'bar':
        return (
          <BarChart data={data} margin={margin}>
            <CartesianGrid {...chartConfig.grid} vertical={false} />
            <XAxis dataKey={nameKey} tick={chartConfig.axis.tick} />
            <YAxis tickFormatter={valueFormatter} tick={chartConfig.axis.tick} allowDecimals={false} />
            {showLegend && dataKeys.length > 1 && <Legend {...chartConfig.legend} />}
            <Tooltip
              cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
              formatter={tooltipFormatter}
              content={customTooltipContent || chartConfig.customTooltip}
              {...chartConfig.tooltip}
            />
            {dataKeys.map((item, index) => {
              const barColor = item.fill || thematicColors.primary || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length];
              return (
                <Bar
                  key={item.key}
                  dataKey={item.key}
                  name={item.name || item.key}
                  fill={barColor}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                  isAnimationActive
                  animationDuration={500}
                  animationEasing="ease-out"
                  activeBar={{ fill: barColor, stroke: barColor, strokeWidth: 1, fillOpacity: 0.75 }}
                />
              );
            })}
          </BarChart>
        );
      case 'radialBar':
        return (
          <RadialBarChart
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              dataKey={dataKeys} // Single value field, like pie
              cornerRadius={6}
              background={{ fill: 'rgba(148, 163, 184, 0.12)' }}
              isAnimationActive
              animationDuration={800}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || thematicColors.primary || PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
              ))}
            </RadialBar>
            <Tooltip
              formatter={tooltipFormatter}
              content={customTooltipContent || chartConfig.customTooltip}
              {...chartConfig.tooltip}
            />
          </RadialBarChart>
        );
      default:
        return (
          <Flex variant="center" className="h-full text-gray-500">
            <p>{t('errors.somethingWentWrong')}</p>
          </Flex>
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {renderChart()}
    </ResponsiveContainer>
  );
};

export default BaseChart;