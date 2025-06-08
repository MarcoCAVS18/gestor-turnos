// src/components/work/WorkAvatar/index.jsx

import React from 'react';

const WorkAvatar = ({ nombre, color, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl'
  };

  return (
    <div 
      className={`${sizes[size]} rounded-lg flex items-center justify-center`}
      style={{ backgroundColor: color }}
    >
      <span className="text-white font-bold">
        {nombre.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

export default WorkAvatar;