// src/components/ui/Popover/index.js

import React, ***REMOVED*** useState, useRef, useLayoutEffect, useEffect ***REMOVED*** from 'react'; 
import ReactDOM from 'react-dom';
import './index.css';

const Popover = (***REMOVED***
  children,
  content,
  title,
  footer,
  trigger = 'click',
  position = 'bottom',
  anchorRef,
  fullWidth,
  className = ''
***REMOVED***) => ***REMOVED***
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState(***REMOVED******REMOVED***);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  const setIsOpenState = (state) => setIsOpen(state);

  const handleMouseEnter = () => ***REMOVED***
    if (trigger === 'hover') ***REMOVED***
      setIsOpenState(true);
    ***REMOVED***
  ***REMOVED***;

  const handleMouseLeave = () => ***REMOVED***
    if (trigger === 'hover') ***REMOVED***
      setIsOpenState(false);
    ***REMOVED***
  ***REMOVED***;

  const handleClick = (e) => ***REMOVED***
    if (trigger === 'click') ***REMOVED***
      e.stopPropagation();
      setIsOpenState(prev => !prev);
    ***REMOVED***
  ***REMOVED***;

  useLayoutEffect(() => ***REMOVED***
    const positioningRef = anchorRef || triggerRef;

    if (isOpen && positioningRef.current) ***REMOVED***
      const anchorRect = positioningRef.current.getBoundingClientRect();
      const popoverNode = popoverRef.current;
      
      if (!popoverNode) return;
      
      popoverNode.style.visibility = 'hidden';
      popoverNode.style.display = 'block';
      
      if (fullWidth) ***REMOVED***
        popoverNode.style.width = `$***REMOVED***anchorRect.width***REMOVED***px`;
      ***REMOVED***
      
      const popoverRect = popoverNode.getBoundingClientRect();

      let top, left;
      const offset = 10;

      switch (position) ***REMOVED***
        case 'top':
          top = anchorRect.top - popoverRect.height - offset;

          left = anchorRect.left + (anchorRect.width / 2) - (popoverRect.width / 2);
          break;
        case 'bottom':
          top = anchorRect.bottom + offset;
          left = anchorRect.left + (anchorRect.width / 2) - (popoverRect.width / 2);
          break;
        case 'bottom-start':
            top = anchorRect.bottom + offset;
            left = anchorRect.left;
            break;
        case 'left':
          top = anchorRect.top + (anchorRect.height / 2) - (popoverRect.height / 2);
          left = anchorRect.left - popoverRect.width - offset;
          break;
        case 'right':
          top = anchorRect.top + (anchorRect.height / 2) - (popoverRect.height / 2);
          left = anchorRect.right + offset;
          break;
        default:
          top = anchorRect.bottom + offset;
          left = anchorRect.left;
      ***REMOVED***
      
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      if (left < 0) ***REMOVED***
        left = 10;
      ***REMOVED*** else if (left + popoverRect.width > screenWidth) ***REMOVED***
        left = screenWidth - popoverRect.width - 10;
      ***REMOVED***

      if (top < 0) ***REMOVED***
        top = 10;
      ***REMOVED*** else if (top + popoverRect.height > screenHeight) ***REMOVED***
        top = screenHeight - popoverRect.height - 10;
      ***REMOVED***

      setPopoverStyle(***REMOVED***
        top: `$***REMOVED***top + window.scrollY***REMOVED***px`,
        left: `$***REMOVED***left + window.scrollX***REMOVED***px`,
        width: fullWidth ? `$***REMOVED***anchorRect.width***REMOVED***px` : 'auto',
        visibility: 'visible',
        opacity: 1
      ***REMOVED***);
      
      popoverNode.style.display = '';
      popoverNode.style.visibility = ''; 
    ***REMOVED***
  ***REMOVED***, [isOpen, position, anchorRef, fullWidth, trigger]);

  useEffect(() => ***REMOVED***
    const handleClickOutside = (event) => ***REMOVED***

      if (trigger === 'hover') return; 

      if (
        isOpen &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target)
      ) ***REMOVED***
        setIsOpenState(false);
      ***REMOVED***
    ***REMOVED***;

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', () => setIsOpenState(false));
    return () => ***REMOVED***
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', () => setIsOpenState(false));
    ***REMOVED***;
  ***REMOVED***, [isOpen, trigger]);

  const popoverContent = isOpen && (
    <div 
        ref=***REMOVED***popoverRef***REMOVED*** 
        className=***REMOVED***`popover-content popover-$***REMOVED***position***REMOVED*** $***REMOVED***className***REMOVED***`***REMOVED*** 
        style=***REMOVED******REMOVED***...popoverStyle***REMOVED******REMOVED*** 
    >
      <div className="popover-arrow" />
      ***REMOVED***title && <div className="popover-title">***REMOVED***title***REMOVED***</div>***REMOVED***
      <div className="popover-body">
        ***REMOVED***content***REMOVED***
      </div>
      ***REMOVED***footer && <div className="popover-footer">***REMOVED***footer***REMOVED***</div>***REMOVED***
    </div>
  );

  return (
    <>
      <div 
        ref=***REMOVED***triggerRef***REMOVED*** 
        onClick=***REMOVED***handleClick***REMOVED*** 
        onMouseEnter=***REMOVED***handleMouseEnter***REMOVED***
        onMouseLeave=***REMOVED***handleMouseLeave***REMOVED***
        style=***REMOVED******REMOVED*** cursor: 'pointer', display: 'inline-flex' ***REMOVED******REMOVED***
      >
        ***REMOVED***children***REMOVED***
      </div>
      ***REMOVED***popoverContent ? ReactDOM.createPortal(popoverContent, document.body) : null***REMOVED***
    </>
  );
***REMOVED***;

export default Popover;