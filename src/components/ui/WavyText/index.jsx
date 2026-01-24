// src/components/ui/WavyText/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import './index.css';

const WavyText = (***REMOVED*** text, color, initialDelay = 0 ***REMOVED***) => ***REMOVED***
  const [isAnimating, setIsAnimating] = useState(false);
  const [isThemedColor, setIsThemedColor] = useState(true);

  useEffect(() => ***REMOVED***
    let interval;
    const timeout = setTimeout(() => ***REMOVED***
      setIsAnimating(true); // Trigger first animation
      interval = setInterval(() => ***REMOVED***
        setIsAnimating(true);
      ***REMOVED***, 5000); // Trigger subsequent animations
    ***REMOVED***, initialDelay);

    return () => ***REMOVED***
      clearTimeout(timeout);
      clearInterval(interval);
    ***REMOVED***;
  ***REMOVED***, [initialDelay]);

  useEffect(() => ***REMOVED***
    if (isAnimating) ***REMOVED***
      const animationDuration = 1500; 
      const delayIncrement = 100; 
      const totalDuration = animationDuration + (text.length * delayIncrement);

      const timeout = setTimeout(() => ***REMOVED***
        setIsAnimating(false);
        setIsThemedColor(prev => !prev);
      ***REMOVED***, totalDuration);

      return () => clearTimeout(timeout);
    ***REMOVED***
  ***REMOVED***, [isAnimating, text]);

  return (
    <div className=***REMOVED***`wavy-text $***REMOVED***isAnimating ? 'wavy-text--animating' : ''***REMOVED***`***REMOVED***>
      ***REMOVED***text.split('').map((char, index) => (
        <span
          key=***REMOVED***index***REMOVED***
          style=***REMOVED******REMOVED***
            animationDelay: `$***REMOVED***index * 0.1***REMOVED***s`,
            color: isThemedColor ? color : '#000',
          ***REMOVED******REMOVED***
        >
          ***REMOVED***char***REMOVED***
        </span>
      ))***REMOVED***
    </div>
  );
***REMOVED***;

export default WavyText;
