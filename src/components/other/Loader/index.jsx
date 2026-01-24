// src/components/other/Loader/index.jsx

import React, ***REMOVED*** useEffect, useRef ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../hooks/useIsMobile';
import ***REMOVED*** gsap ***REMOVED*** from 'gsap';
import './index.css';

const Loader = (***REMOVED*** size = 40, fullScreen = false, onAnimationComplete ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  const primaryColor = thematicColors?.base || '#EC4899';
  const svgRef = useRef(null);
  const isMobile = useIsMobile();

  // Determine appropriate CSS classes
  const getContainerClass = () => ***REMOVED***
    if (fullScreen) ***REMOVED***
      return 'loader-container-fullscreen';
    ***REMOVED*** else ***REMOVED***
      const baseClass = 'loader-container-normal';
      return isMobile ? `$***REMOVED***baseClass***REMOVED*** loader-with-mobile-nav` : baseClass;
    ***REMOVED***
  ***REMOVED***;

  useEffect(() => ***REMOVED***
    const svg = svgRef.current;
    if (!svg) return;

    // Select elements to animate
    const mainPath = svg.querySelector('.main-path');
    const circles = svg.querySelectorAll('.circle');

    if (!mainPath || circles.length === 0) return;

    // Set initial state
    gsap.set(mainPath, ***REMOVED***
      strokeDasharray: mainPath.getTotalLength(),
      strokeDashoffset: mainPath.getTotalLength(),
      fill: 'transparent',
      stroke: primaryColor,
      strokeWidth: 32
    ***REMOVED***);

    gsap.set(circles, ***REMOVED***
      scale: 0,
      opacity: 0
    ***REMOVED***);

    const tl = gsap.timeline(***REMOVED***
      repeat: -1,
      repeatDelay: 0.5,
      onComplete: () => ***REMOVED***
        if (onAnimationComplete) onAnimationComplete();
      ***REMOVED***
    ***REMOVED***);

    // Animate main shape from left to right
    tl.to(mainPath, ***REMOVED***
      duration: 1.5,
      strokeDashoffset: 0,
      ease: 'power2.inOut'
    ***REMOVED***);

    // Small pause so the full line is visible
    tl.to(***REMOVED******REMOVED***, ***REMOVED*** duration: 0.3 ***REMOVED***);

    // Animate circles appearing with a bounce effect
    tl.to(circles, ***REMOVED***
      duration: 0.8,
      scale: 1,
      opacity: 1,
      ease: 'back.out(1.7)',
      stagger: 0.15
    ***REMOVED***, '-=0.3');

    // Fill main shape
    tl.to(mainPath, ***REMOVED***
      duration: 0.8,
      fill: primaryColor,
      ease: 'power2.inOut'
    ***REMOVED***, '-=0.4');

    // Keep logo visible for a moment
    tl.to(***REMOVED******REMOVED***, ***REMOVED*** duration: 6 ***REMOVED***);

    // Fade everything out to restart animation
    tl.to([mainPath, circles], ***REMOVED***
      duration: 1,
      opacity: 0,
      ease: 'power2.inOut',
      onComplete: () => ***REMOVED***
        gsap.set(mainPath, ***REMOVED***
          strokeDashoffset: mainPath.getTotalLength(),
          fill: 'transparent',
          opacity: 1,
          stroke: primaryColor,
          strokeWidth: 8
        ***REMOVED***);
        gsap.set(circles, ***REMOVED***
          scale: 0,
          opacity: 0
        ***REMOVED***);
      ***REMOVED***
    ***REMOVED***);

    return () => ***REMOVED***
      tl.kill();
    ***REMOVED***;
  ***REMOVED***, [primaryColor, onAnimationComplete]);

  const svgSize = ***REMOVED***
    width: size * 3, 
    height: (size * 3 * 596) / 842 + 120 
  ***REMOVED***;

  return (
    <div className=***REMOVED***getContainerClass()***REMOVED***>
      <svg
        ref=***REMOVED***svgRef***REMOVED***
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 842 716" 
        width=***REMOVED***svgSize.width***REMOVED***
        height=***REMOVED***svgSize.height***REMOVED***
        style=***REMOVED******REMOVED*** overflow: 'visible' ***REMOVED******REMOVED*** 
      >
        <path
          className="main-path"
          d="M644.96,232.9v37.77c0,5.64-13.1,21-17.89,24.51-23.71,17.41-40.65.55-63.95-3.63-29.05-5.22-56.13,3.29-79.14,20.85-5.32-1.71-8.95-5.94-13.93-8.62-32.99-17.77-64.17-18.96-97.17-.38-3.56,2-11.88,9.38-14.77,9.09-22.96-17.53-50.25-26.15-79.24-20.94-23.24,4.18-40.03,21.19-63.95,3.63-4.79-3.52-17.89-18.87-17.89-24.51v-37.77h-23.85v35.12c0,21.65,21.34,45.67,40.74,53.35,38.08,15.09,56.72-10.82,89.79-7.62,12.39,1.2,31.49,8.97,38.94,18.96-6.97,10.42-11.94,22.66-14.04,35.07-3.93,23.21,1.06,47.66,29.43,48.1,44.68.69,33.54-59.75,16.68-84.09,19.99-19.73,52.08-23.43,77.05-11.04,6.05,3,9.91,7.13,15.53,10.36-2.49,7.56-7.18,13.34-9.79,21.12-7.65,22.8-10.39,60.18,21.31,63.39,47.88,4.84,39.33-57.08,20.54-82.9,7.61-10.12,26.17-17.72,38.94-18.96,33.98-3.29,51.34,22.85,89.79,7.62,19.39-7.68,40.74-31.7,40.74-53.35v-35.12h-23.85ZM481.98,353.5c2.32-2.23,4.5,5.03,4.97,6.27,2.37,6.25,8.73,30.43-.36,32.17-19.57,3.75-7.82-29.3-4.61-38.44ZM352.43,390.27c-4.28-4.5.75-29.18,3.92-34.49,1.01-1.69,1.33-2.74,3.67-2.27,2.65,8.76,13.54,35.7.05,39.23-1.93.55-6.55-1.31-7.65-2.47Z"
          stroke=***REMOVED***primaryColor***REMOVED***
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="rotate(180, 421, 358) scale(1, -1) translate(0, -620)" 
        />

        ***REMOVED***/* Circles with adjusted position to be visible */***REMOVED***
        <circle className="circle" cx="547" cy="250" r="45" fill=***REMOVED***primaryColor***REMOVED*** />
        <circle className="circle" cx="422" cy="250" r="45" fill=***REMOVED***primaryColor***REMOVED*** />
        <circle className="circle" cx="297" cy="250" r="45" fill=***REMOVED***primaryColor***REMOVED*** />
      </svg>
    </div>
  );
***REMOVED***;

export default Loader;