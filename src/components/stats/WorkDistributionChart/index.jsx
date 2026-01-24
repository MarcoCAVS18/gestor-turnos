// src/components/stats/WorkDistributionChart/index.jsx

import React from 'react';
import { PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const WorkDistributionChart = ({ worksDistribution = [] }) => {
  // Verify that worksDistribution is an array
  const data = Array.isArray(worksDistribution) ? worksDistribution : [];
  
  if (data.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Work Distribution</h3>
        <Flex variant="center" className="h-64 text-gray-500">
          <div className="text-center">
            <p className="text-sm">No data to display</p>
            <p className="text-sm">Add some shifts to see the distribution</p>
          </div>
        </Flex>
      </Card>
    );
  }

  // Predefined colors for the chart
  const COLORS = [
    '#EC4899', '#3B82F6', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EF4444', '#06B6D4', '#84CC16'
  ];

  // Ensure all data has color
  const dataWithColor = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length]
  }));

  const renderLabel = (entry) => {
    return entry.percentage > 5 ? `${entry.percentage}%` : '';
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.hours.toFixed(1)} hrs ({data.percentage}%)
          </p>
          <p className="text-sm font-medium text-green-600">
            {data.earnings.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <h3 className="text del text-lg font-semibold mb-4">Work Distribution</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart
            data={dataWithColor}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="hours"
            >
              {dataWithColor.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total works:</span>
            <span className="font-medium ml-1">{dataWithColor.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Total hours:</span>
            <span className="font-medium ml-1">
              {data.reduce((sum, item) => sum + item.hours, 0).toFixed(1)}h
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WorkDistributionChart;