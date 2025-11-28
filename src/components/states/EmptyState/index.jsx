// src/components/states/EmptyState/index.jsx

import React from 'react';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

const EmptyStateContent = (***REMOVED*** icon: Icon, title, description, action ***REMOVED***) => (
  <>
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
  </>
);

const EmptyState = (***REMOVED*** 
  icon: Icon, 
  title, 
  description, 
  action,
  className = '',
  contained = false 
***REMOVED***) => ***REMOVED***
  if (contained) ***REMOVED***
    return (
      <div className=***REMOVED***`text-center $***REMOVED***className***REMOVED***`***REMOVED***>
        <EmptyStateContent icon=***REMOVED***Icon***REMOVED*** title=***REMOVED***title***REMOVED*** description=***REMOVED***description***REMOVED*** action=***REMOVED***action***REMOVED*** />
      </div>
    );
  ***REMOVED***

  return (
    <Card className=***REMOVED***`text-center py-12 $***REMOVED***className***REMOVED***`***REMOVED***>
      <EmptyStateContent icon=***REMOVED***Icon***REMOVED*** title=***REMOVED***title***REMOVED*** description=***REMOVED***description***REMOVED*** action=***REMOVED***action***REMOVED*** />
    </Card>
  );
***REMOVED***;

export default EmptyState;