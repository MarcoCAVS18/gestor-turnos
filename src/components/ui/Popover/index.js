import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Popover.css';

const Popover = ({ children, content, title, footer, trigger = 'click', position = 'bottom' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState({});
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    if (isOpen && triggerRef.current) {
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

      switch (position) {
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
      }

      setPopoverStyle({
        top: `${top + window.scrollY}px`,
        left: `${left + window.scrollX}px`,
      });
    }

    const handleClickOutside = (event) => {
      if (
        isOpen &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, position]);


  const popoverContent = isOpen && (
    <div ref={popoverRef} className={`popover-content popover-${position}`} style={popoverStyle}>
      <div className="popover-arrow" />
      {title && <div className="popover-title">{title}</div>}
      <div className="popover-body">
        {content}
      </div>
      {footer && <div className="popover-footer">{footer}</div>}
    </div>
  );

  return (
    <>
      <div ref={triggerRef} onClick={trigger === 'click' ? handleToggle : null} style={{ cursor: 'pointer' }}>
        {children}
      </div>
      {popoverContent ? ReactDOM.createPortal(popoverContent, document.body) : null}
    </>
  );
};

export default Popover;