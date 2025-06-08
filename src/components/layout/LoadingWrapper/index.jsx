// src/components/layout/LoadingWrapper/index.jsx

import React, { useState, useEffect } from 'react';
import Loader from '../../other/Loader';

const LoadingWrapper = ({ 
  loading, 
  delay = 3000, 
  children, 
  className = '' 
}) => {
  const [showLoading, setShowLoading] = useState(true);
  
  useEffect(() => {
    let timer;
    
    if (loading) {
      setShowLoading(true);
    } else {
      timer = setTimeout(() => {
        setShowLoading(false);
      }, delay);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading, delay]);

  if (showLoading) {
    return (
      <div className={`flex justify-center items-center h-screen ${className}`}>
        <Loader />
      </div>
    );
  }

  return children;
};

export default LoadingWrapper;