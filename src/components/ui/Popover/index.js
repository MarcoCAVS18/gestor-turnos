import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Popover.css';

const Popover = ({
  children,
  content,
  title,
  footer,
  trigger = 'click',
  position = 'bottom',
  anchorRef,
  fullWidth,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState({});
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    const positioningRef = anchorRef || triggerRef;

    if (isOpen && positioningRef.current) {
      const anchorRect = positioningRef.current.getBoundingClientRect();
      const popoverNode = popoverRef.current;
      if (!popoverNode) return;
      
      popoverNode.style.opacity = '0';
      popoverNode.style.display = 'block';
      if (fullWidth) {
        popoverNode.style.width = `${anchorRect.width}px`;
      }
      const popoverRect = popoverNode.getBoundingClientRect();
      popoverNode.style.display = '';
      popoverNode.style.opacity = '';

      let top, left;
      const offset = 10;

      switch (position) {
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
      }
      
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      if (left < 0) {
        left = 10;
      } else if (left + popoverRect.width > screenWidth) {
        left = screenWidth - popoverRect.width - 10;
      }

      if (top < 0) {
        top = 10;
      } else if (top + popoverRect.height > screenHeight) {
        top = screenHeight - popoverRect.height - 10;
      }

      setPopoverStyle({
        top: `${top + window.scrollY}px`,
        left: `${left + window.scrollX}px`,
        width: fullWidth ? `${anchorRect.width}px` : 'auto'
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
    window.addEventListener('resize', () => setIsOpen(false));
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', () => setIsOpen(false));
    };
  }, [isOpen, position, anchorRef, fullWidth]);


  const popoverContent = isOpen && (
    <div ref={popoverRef} className={`popover-content popover-${position} ${className}`} style={popoverStyle}>
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
      <div ref={triggerRef} onClick={handleToggle} style={{ cursor: 'pointer' }}>
        {children}
      </div>
      {popoverContent ? ReactDOM.createPortal(popoverContent, document.body) : null}
    </>
  );
};

export default Popover;