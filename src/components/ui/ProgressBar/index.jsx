// src/components/ui/ProgressBar/index.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ value, color, height = 'h-2' }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const cappedValue = Math.min(100, Math.max(0, value));
      setWidth(cappedValue);
    }, 100); 

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={`w-full bg-gray-100 rounded-full ${height}`}>
      <div
        className="h-full rounded-full"
        style={{
          width: `${width}%`,
          backgroundColor: color,
          transition: 'width 1.5s ease-in-out',
        }}
      ></div>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  color: PropTypes.string,
  height: PropTypes.string,
};

export default ProgressBar;
