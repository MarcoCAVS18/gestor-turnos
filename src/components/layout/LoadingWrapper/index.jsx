// src/components/layout/LoadingWrapper/index.jsx

import React, { useState, useEffect } from 'react';
import Loader from '../../other/Loader';
import { useIsMobile } from '../../../hooks/useIsMobile';

const LoadingWrapper = ({
  loading,
  delay = 3000,
  children,
  className = ''
}) => {
  const [showLoading, setShowLoading] = useState(true);
  const isMobile = useIsMobile();

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
      <div className={`
        flex justify-center items-center 
        ${isMobile ? 'h-screen pb-24 pt-16' : 'h-screen'} 
        ${className}
      `}>
        <Loader fullScreen={false} />
      </div>
    );
  }

  return children;
};

export default LoadingWrapper;