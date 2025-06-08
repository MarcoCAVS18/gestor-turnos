// src/components/ui/ActionsMenu/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** MoreVertical ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const ActionsMenu = (***REMOVED*** actions = [] ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();
  const [isOpen, setIsOpen] = useState(false);

  if (actions.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick=***REMOVED***(e) => ***REMOVED***
          e.stopPropagation();
          setIsOpen(!isOpen);
        ***REMOVED******REMOVED***
        className="p-2 rounded-lg transition-colors flex-shrink-0"
        style=***REMOVED******REMOVED*** 
          backgroundColor: isOpen ? coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)' : 'transparent',
          color: isOpen ? coloresTemáticos?.base || '#EC4899' : '#6B7280'
        ***REMOVED******REMOVED***
      >
        <MoreVertical size=***REMOVED***16***REMOVED*** />
      </button>

      ***REMOVED***isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick=***REMOVED***() => setIsOpen(false)***REMOVED***
          />
          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border z-20 py-1 min-w-[140px]">
            ***REMOVED***actions.map((action, index) => (
              <button
                key=***REMOVED***index***REMOVED***
                onClick=***REMOVED***(e) => ***REMOVED***
                  e.stopPropagation();
                  setIsOpen(false);
                  action.onClick();
                ***REMOVED******REMOVED***
                className=***REMOVED***`w-full px-3 py-2 text-left text-sm flex items-center transition-colors $***REMOVED***
                  action.variant === 'danger' 
                    ? 'hover:bg-red-50 text-red-600' 
                    : 'hover:bg-gray-50'
                ***REMOVED***`***REMOVED***
              >
                ***REMOVED***action.icon && <action.icon size=***REMOVED***14***REMOVED*** className="mr-2" />***REMOVED***
                ***REMOVED***action.label***REMOVED***
              </button>
            ))***REMOVED***
          </div>
        </>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default ActionsMenu;