import React, { useEffect, useRef } from 'react';
import { useApp } from '../../../contexts/AppContext';
import { gsap } from 'gsap';

const Loader = ({ size = 65, fullScreen = false, onAnimationComplete }) => {
  const { coloresTemáticos } = useApp();
  const colorPrincipal = coloresTemáticos?.base || '#EC4899';
  const svgRef = useRef(null);
  
  const containerStyle = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '15%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999
  } : {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    paddingBottom: '150px' 
  };
  
  useEffect(() => {
    const svg = svgRef.current;
    
    // Seleccionar los elementos para animar
    const mainPath = svg.querySelector('.main-path');
    const circles = svg.querySelectorAll('.circle');
    
    // Configurar el estado inicial
    gsap.set(mainPath, { 
      strokeDasharray: mainPath.getTotalLength(),
      strokeDashoffset: mainPath.getTotalLength(),
      fill: 'transparent' 
    });
    
    gsap.set(circles, { 
      scale: 0,
      opacity: 0
    });
    
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.5,
      onComplete: () => {
        if (onAnimationComplete) onAnimationComplete();
      }
    });
    
    // Animar la forma principal de izquierda a derecha
    tl.to(mainPath, {
      duration: 1.5,
      strokeDashoffset: 0,
      ease: 'power2.inOut'
    });
    
    // Animar los círculos apareciendo con un efecto de rebote
    tl.to(circles, {
      duration: 0.8,
      scale: 1,
      opacity: 1,
      ease: 'back.out(1.7)',
      stagger: 0.15
    }, '-=0.3');
    
    // Rellenar la forma principal
    tl.to(mainPath, {
      duration: 0.8,
      fill: colorPrincipal,
      ease: 'power2.inOut'
    }, '-=0.4');
    
    // Mantener el logo visible por un momento
    tl.to({}, { duration: 2 });
    
    // Desvanecer todo para reiniciar la animación
    tl.to([mainPath, circles], {
      duration: 1,
      opacity: 0,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.set(mainPath, { 
          strokeDashoffset: mainPath.getTotalLength(),
          fill: 'transparent',
          opacity: 1
        });
        gsap.set(circles, { 
          scale: 0,
          opacity: 0
        });
      }
    });
    
    return () => {
      tl.kill();
    };
  }, [colorPrincipal, onAnimationComplete]);
  
  const svgSize = {
    width: size * 2.5,
    height: (size * 2.5 * 596) / 842
  };
  
  return (
    <div style={containerStyle}>
      <svg 
        ref={svgRef} 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 842 596"
        width={svgSize.width}
        height={svgSize.height}
      >
        <path 
          className="main-path"
          d="M197.04,232.9v37.77c0,5.64,13.1,21,17.89,24.51,23.71,17.41,40.65.55,63.95-3.63,29.05-5.22,56.13,3.29,79.14,20.85,5.32-1.71,8.95-5.94,13.93-8.62,32.99-17.77,64.17-18.96,97.17-.38,3.56,2,11.88,9.38,14.77,9.09,22.96-17.53,50.25-26.15,79.24-20.94,23.24,4.18,40.03,21.19,63.95,3.63,4.79-3.52,17.89-18.87,17.89-24.51v-37.77h23.85v35.12c0,21.65-21.34,45.67-40.74,53.35-38.08,15.09-56.72-10.82-89.79-7.62-12.39,1.2-31.49,8.97-38.94,18.96,6.97,10.42,11.94,22.66,14.04,35.07,3.93,23.21-1.06,47.66-29.43,48.1-44.68.69-33.54-59.75-16.68-84.09-19.99-19.73-52.08-23.43-77.05-11.04-6.05,3-9.91,7.13-15.53,10.36,2.49,7.56,7.18,13.34,9.79,21.12,7.65,22.8,10.39,60.18-21.31,63.39-47.88,4.84-39.33-57.08-20.54-82.9-7.61-10.12-26.17-17.72-38.94-18.96-33.98-3.29-51.34,22.85-89.79,7.62-19.39-7.68-40.74-31.7-40.74-53.35v-35.12h23.85ZM360.02,353.5c-2.32-2.23-4.5,5.03-4.97,6.27-2.37,6.25-8.73,30.43.36,32.17,19.57,3.75,7.82-29.3,4.61-38.44ZM489.57,390.27c4.28-4.5-.75-29.18-3.92-34.49-1.01-1.69-1.33-2.74-3.67-2.27-2.65,8.76-13.54,35.7-.05,39.23,1.93.55,6.55-1.31,7.65-2.47Z"
          stroke={colorPrincipal}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        <circle className="circle" cx="295" cy="165" r="45" fill={colorPrincipal} />
        <circle className="circle" cx="420" cy="165" r="45" fill={colorPrincipal} />
        <circle className="circle" cx="545" cy="165" r="45" fill={colorPrincipal} />
      </svg>
    </div>
  );
};

export default Loader;
