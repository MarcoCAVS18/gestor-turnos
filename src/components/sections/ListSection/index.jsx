// src/components/sections/ListSection/index.jsx

import React from 'react';
import PageHeader from '../../layout/PageHeader';
import EmptyState from '../../states/EmptyState';

const ListSection = (***REMOVED***
  title,
  subtitle,
  action,
  items = [], // <--- ¡La clave está aquí! Asegura que 'items' siempre sea un array
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

      ***REMOVED***/* Ahora, 'items.length' es seguro porque 'items' está garantizado como un array */***REMOVED***
      ***REMOVED***items.length > 0 ? (
        <div className="space-y-4">
          ***REMOVED***/* Asegúrate de que renderItem devuelve un elemento con una 'key' única,
              como 'item.id', para un rendimiento óptimo de React. */***REMOVED***
          ***REMOVED***items.map(renderItem)***REMOVED***
        </div>
      ) : (
        <EmptyState ***REMOVED***...emptyState***REMOVED*** />
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default ListSection;