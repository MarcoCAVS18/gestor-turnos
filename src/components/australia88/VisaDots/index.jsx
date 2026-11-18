// src/components/australia88/VisaDots/index.jsx
// Renders up to 7 small dots representing visa days earned in one week.
// Filled dots (colored) = earned. Faded dot = part of a day (part-time days
// count pro rata). Empty dots (gray) = not earned.
// Shared by Australia88StatsCard and Australia88WeeklyChart.

import React from 'react';

const MAX_VISA_DAYS_PER_WEEK = 7;

const VisaDots = ({ days, color }) => (
  <div className="flex items-center gap-[3px]">
    {Array.from({ length: MAX_VISA_DAYS_PER_WEEK }).map((_, i) =>
      i < days ? (
        <div
          key={i}
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: color, opacity: i + 1 <= days ? 1 : 0.4 }}
        />
      ) : (
        <div
          key={i}
          className="w-2 h-2 rounded-full flex-shrink-0 bg-gray-200 dark:bg-gray-700"
        />
      )
    )}
  </div>
);

export default VisaDots;
