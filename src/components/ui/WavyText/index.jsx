// src/components/ui/WavyText/index.jsx

import React, { useState, useEffect } from 'react';
import './index.css';

const WavyText = ({ text, color, initialDelay = 0 }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isThemedColor, setIsThemedColor] = useState(true);

  useEffect(() => {
    let interval;
    const timeout = setTimeout(() => {
      setIsAnimating(true); // Trigger first animation
      interval = setInterval(() => {
        setIsAnimating(true);
      }, 5000); // Trigger subsequent animations
    }, initialDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [initialDelay]);

  useEffect(() => {
    if (isAnimating) {
      const animationDuration = 1500; 
      const delayIncrement = 100; 
      const totalDuration = animationDuration + (text.length * delayIncrement);

      const timeout = setTimeout(() => {
        setIsAnimating(false);
        setIsThemedColor(prev => !prev);
      }, totalDuration);

      return () => clearTimeout(timeout);
    }
  }, [isAnimating, text]);

  return (
    <div className={`wavy-text ${isAnimating ? 'wavy-text--animating' : ''}`}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          style={{
            animationDelay: `${index * 0.1}s`,
            color: isThemedColor ? color : '#000',
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default WavyText;
