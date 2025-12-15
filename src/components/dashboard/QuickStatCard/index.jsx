// src/components/dashboard/QuickStatCard/index.jsx
import React from 'react';
import Card from '../../ui/Card';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const QuickStatCard = (***REMOVED*** icon: Icon, label, value, subtitle ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  
  return (
    <Card className="p-4 text-center h-full">
      <div className="flex flex-col h-full">
        <div className="my-auto">
          <div className="flex flex-col items-center">
            <Icon size=***REMOVED***20***REMOVED*** className="mb-2" style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** />
            <span className="text-sm text-gray-600 font-medium mb-1">***REMOVED***label***REMOVED***</span>
            <p className="text-2xl font-bold text-gray-800 mb-1">***REMOVED***value***REMOVED***</p>
            <p className="text-xs text-gray-500">***REMOVED***subtitle***REMOVED***</p>
          </div>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default QuickStatCard;
