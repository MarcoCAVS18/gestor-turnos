// src/components/native/NativeSplash/index.jsx
//
// Animated splash screen for native iOS/Android builds.
// Rendered on top of everything for ~3s when the app first opens,
// then fades out revealing the actual app.
//
// Uses the same SVG path and GSAP animation as Loader/index.jsx
// but is standalone (no useApp/AppProvider dependency) so it can
// live at the root of App.js before any context providers.

import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { gsap } from 'gsap';

const PINK = '#EC4899';
const BG = '#111827'; // matches capacitor.config.ts backgroundColor and bg-gray-900

const NativeSplashInner = () => {
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);
  const svgRef = useRef(null);

  // Configure status bar on mount (dark background → light icons)
  useEffect(() => {
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    StatusBar.setBackgroundColor({ color: BG }).catch(() => {});
  }, []);

  // GSAP animation — same sequence as Loader but runs once then fades out
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const mainPath = svg.querySelector('.ns-main-path');
    const circles = svg.querySelectorAll('.ns-circle');
    if (!mainPath || circles.length === 0) return;

    const totalLength = mainPath.getTotalLength();

    gsap.set(mainPath, {
      strokeDasharray: totalLength,
      strokeDashoffset: totalLength,
      fill: 'transparent',
      stroke: PINK,
      strokeWidth: 32
    });
    gsap.set(circles, { scale: 0, opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        // Start fade-out, then remove from DOM
        setHiding(true);
        setTimeout(() => setGone(true), 600);
      }
    });

    // Draw the logo path
    tl.to(mainPath, { duration: 1.5, strokeDashoffset: 0, ease: 'power2.inOut' });
    tl.to({}, { duration: 0.2 });

    // Circles pop in
    tl.to(circles, {
      duration: 0.8,
      scale: 1,
      opacity: 1,
      ease: 'back.out(1.7)',
      stagger: 0.15
    }, '-=0.2');

    // Fill the logo
    tl.to(mainPath, { duration: 0.8, fill: PINK, ease: 'power2.inOut' }, '-=0.4');

    // Hold for a moment before fading out
    tl.to({}, { duration: 0.6 });

    return () => tl.kill();
  }, []);

  if (gone) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: hiding ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
        pointerEvents: 'none'
      }}
    >
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 842 716"
        width={180}
        height={160}
        style={{ overflow: 'visible' }}
      >
        <path
          className="ns-main-path"
          d="M644.96,232.9v37.77c0,5.64-13.1,21-17.89,24.51-23.71,17.41-40.65.55-63.95-3.63-29.05-5.22-56.13,3.29-79.14,20.85-5.32-1.71-8.95-5.94-13.93-8.62-32.99-17.77-64.17-18.96-97.17-.38-3.56,2-11.88,9.38-14.77,9.09-22.96-17.53-50.25-26.15-79.24-20.94-23.24,4.18-40.03,21.19-63.95,3.63-4.79-3.52-17.89-18.87-17.89-24.51v-37.77h-23.85v35.12c0,21.65,21.34,45.67,40.74,53.35,38.08,15.09,56.72-10.82,89.79-7.62,12.39,1.2,31.49,8.97,38.94,18.96-6.97,10.42-11.94,22.66-14.04,35.07-3.93,23.21,1.06,47.66,29.43,48.1,44.68.69,33.54-59.75,16.68-84.09,19.99-19.73,52.08-23.43,77.05-11.04,6.05,3,9.91,7.13,15.53,10.36-2.49,7.56-7.18,13.34-9.79,21.12-7.65,22.8-10.39,60.18,21.31,63.39,47.88,4.84,39.33-57.08,20.54-82.9,7.61-10.12,26.17-17.72,38.94-18.96,33.98-3.29,51.34,22.85,89.79,7.62,19.39-7.68,40.74-31.7,40.74-53.35v-35.12h-23.85ZM481.98,353.5c2.32-2.23,4.5,5.03,4.97,6.27,2.37,6.25,8.73,30.43-.36,32.17-19.57,3.75-7.82-29.3-4.61-38.44ZM352.43,390.27c-4.28-4.5.75-29.18,3.92-34.49,1.01-1.69,1.33-2.74,3.67-2.27,2.65,8.76,13.54,35.7.05,39.23-1.93.55-6.55-1.31-7.65-2.47Z"
          stroke={PINK}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="rotate(180, 421, 358) scale(1, -1) translate(0, -620)"
        />
        <circle className="ns-circle" cx="547" cy="250" r="45" fill={PINK} />
        <circle className="ns-circle" cx="422" cy="250" r="45" fill={PINK} />
        <circle className="ns-circle" cx="297" cy="250" r="45" fill={PINK} />
      </svg>
    </div>
  );
};

// Only mount on native — zero overhead on web
const NativeSplash = () => {
  if (!Capacitor.isNativePlatform()) return null;
  return <NativeSplashInner />;
};

export default NativeSplash;
