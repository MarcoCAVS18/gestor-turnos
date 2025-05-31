// src/components/sections/StatsSection/index.jsx

import React from 'react';
import StatCard from '../../cards/StatCard';

const StatsSection = ({ 
  title, 
  stats, 
  columns = 2, 
  cardSize = 'md',
  className = '' 
}) => {
  const getGridClasses = () => {
    const grids = {
      1: 'grid-cols-1',
      2: 'grid-cols-2', 
      3: 'grid-cols-3',
      4: 'grid-cols-4'
    };
    return grids[columns] || grids[2];
  };

  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}
      
      <div className={`grid ${getGridClasses()} gap-4`}>
        {stats.map((stat, index) => (
          <StatCard
            key={stat.key || index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            trend={stat.trend}
            trendLabel={stat.trendLabel}
            size={cardSize}
            onClick={stat.onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsSection;