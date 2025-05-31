// src/components/states/EmptyState/index.jsx

import React from 'react';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

const EmptyState = (***REMOVED*** 
  icon: Icon, 
  title, 
  description, 
  action,
  className = '' 
***REMOVED***) => ***REMOVED***
  return (
    <Card className=***REMOVED***`text-center py-12 $***REMOVED***className***REMOVED***`***REMOVED***>
      ***REMOVED***Icon && <Icon size=***REMOVED***48***REMOVED*** className="mx-auto text-gray-400 mb-4" />***REMOVED***
      <h3 className="text-lg font-semibold text-gray-600 mb-2">***REMOVED***title***REMOVED***</h3>
      <p className="text-gray-500 mb-6">***REMOVED***description***REMOVED***</p>
      ***REMOVED***action && (
        <Button 
          onClick=***REMOVED***action.onClick***REMOVED***
          className="flex items-center gap-2"
          icon=***REMOVED***action.icon***REMOVED***
          variant=***REMOVED***action.variant || 'primary'***REMOVED***
        >
          ***REMOVED***action.label***REMOVED***
        </Button>
      )***REMOVED***
    </Card>
  );
***REMOVED***;

export default EmptyState;