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
  const [isMobile, setIsMobile] = useState(false);
  
  // Detectar si estamos en móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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