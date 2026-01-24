// src/components/icons/MotorbikeIcon.jsx

import React from 'react';

const MotorbikeIcon = ({ size = 24, className = "", ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M15 6l-1 6-5 4" />
    <path d="M5.5 17.5V11l2-4.5 3.5 3L15 6h4" />
  </svg>
);

export default MotorbikeIcon;