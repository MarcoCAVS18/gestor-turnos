import React, ***REMOVED*** useState, useRef, useEffect ***REMOVED*** from 'react';
import ReactDOM from 'react-dom';
import './Popover.css';

const Popover = (***REMOVED*** children, content, title, footer, trigger = 'click', position = 'bottom' ***REMOVED***) => ***REMOVED***
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState(***REMOVED******REMOVED***);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  const handleToggle = () => ***REMOVED***
    setIsOpen(prev => !prev);
  ***REMOVED***;

  useEffect(() => ***REMOVED***
    if (isOpen && triggerRef.current) ***REMOVED***
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverNode = popoverRef.current;
      if (!popoverNode) return;

      // Force a reflow to get the correct dimensions of the popover
      popoverNode.style.opacity = '0';
      popoverNode.style.display = 'block';
      const popoverRect = popoverNode.getBoundingClientRect();
      popoverNode.style.display = '';
      popoverNode.style.opacity = '';


      let top, left;
      const offset = 10; // distance between trigger and popover

      switch (position) ***REMOVED***
        case 'top':
          top = triggerRect.top - popoverRect.height - offset;
          left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);
          break;
        case 'bottom':
          top = triggerRect.bottom + offset;
          left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height / 2) - (popoverRect.height / 2);
          left = triggerRect.left - popoverRect.width - offset;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height / 2) - (popoverRect.height / 2);
          left = triggerRect.right + offset;
          break;
        default:
          top = triggerRect.bottom + offset;
          left = triggerRect.left;
      ***REMOVED***

      setPopoverStyle(***REMOVED***
        top: `$***REMOVED***top + window.scrollY***REMOVED***px`,
        left: `$***REMOVED***left + window.scrollX***REMOVED***px`,
      ***REMOVED***);
    ***REMOVED***

    const handleClickOutside = (event) => ***REMOVED***
      if (
        isOpen &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target)
      ) ***REMOVED***
        setIsOpen(false);
      ***REMOVED***
    ***REMOVED***;

    document.addEventListener('mousedown', handleClickOutside);
    return () => ***REMOVED***
      document.removeEventListener('mousedown', handleClickOutside);
    ***REMOVED***;
  ***REMOVED***, [isOpen, position]);


  const popoverContent = isOpen && (
    <div ref=***REMOVED***popoverRef***REMOVED*** className=***REMOVED***`popover-content popover-$***REMOVED***position***REMOVED***`***REMOVED*** style=***REMOVED***popoverStyle***REMOVED***>
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
      <div ref=***REMOVED***triggerRef***REMOVED*** onClick=***REMOVED***trigger === 'click' ? handleToggle : null***REMOVED*** style=***REMOVED******REMOVED*** cursor: 'pointer' ***REMOVED******REMOVED***>
        ***REMOVED***children***REMOVED***
      </div>
      ***REMOVED***popoverContent ? ReactDOM.createPortal(popoverContent, document.body) : null***REMOVED***
    </>
  );
***REMOVED***;

export default Popover;