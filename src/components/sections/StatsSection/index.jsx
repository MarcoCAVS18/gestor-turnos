// src/components/sections/StatsSection/index.jsx

import React from 'react';
import StatCard from '../../cards/StatCard';

const StatsSection = (***REMOVED*** 
  title, 
  stats, 
  columns = 2, 
  cardSize = 'md',
  className = '' 
***REMOVED***) => ***REMOVED***
  const getGridClasses = () => ***REMOVED***
    const grids = ***REMOVED***
      1: 'grid-cols-1',
      2: 'grid-cols-2', 
      3: 'grid-cols-3',
      4: 'grid-cols-4'
    ***REMOVED***;
    return grids[columns] || grids[2];
  ***REMOVED***;

  return (
    <div className=***REMOVED***className***REMOVED***>
      ***REMOVED***title && (
        <h3 className="text-lg font-semibold mb-4">***REMOVED***title***REMOVED***</h3>
      )***REMOVED***
      
      <div className=***REMOVED***`grid $***REMOVED***getGridClasses()***REMOVED*** gap-4`***REMOVED***>
        ***REMOVED***stats.map((stat, index) => (
          <StatCard
            key=***REMOVED***stat.key || index***REMOVED***
            title=***REMOVED***stat.title***REMOVED***
            value=***REMOVED***stat.value***REMOVED***
            subtitle=***REMOVED***stat.subtitle***REMOVED***
            icon=***REMOVED***stat.icon***REMOVED***
            trend=***REMOVED***stat.trend***REMOVED***
            trendLabel=***REMOVED***stat.trendLabel***REMOVED***
            size=***REMOVED***cardSize***REMOVED***
            onClick=***REMOVED***stat.onClick***REMOVED***
          />
        ))***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default StatsSection;