// src/components/sections/ListSection/index.jsx

import React from 'react';
import PageHeader from '../../layout/PageHeader';
import EmptyState from '../../states/EmptyState';

const ListSection = (***REMOVED*** 
  title,
  subtitle,
  action,
  items,
  emptyState,
  renderItem,
  className = '' 
***REMOVED***) => ***REMOVED***
  return (
    <div className=***REMOVED***`px-4 py-6 $***REMOVED***className***REMOVED***`***REMOVED***>
      <PageHeader 
        title=***REMOVED***title***REMOVED***
        subtitle=***REMOVED***subtitle***REMOVED***
        action=***REMOVED***action***REMOVED***
      />
      
      ***REMOVED***items.length > 0 ? (
        <div className="space-y-4">
          ***REMOVED***items.map(renderItem)***REMOVED***
        </div>
      ) : (
        <EmptyState ***REMOVED***...emptyState***REMOVED*** />
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default ListSection;