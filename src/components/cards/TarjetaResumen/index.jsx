import React from 'react';
import Card from '../../ui/Card';

const TarjetaResumen = (***REMOVED*** titulo, valor, color, icon: Icon ***REMOVED***) => ***REMOVED***
  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-500 text-sm">***REMOVED***titulo***REMOVED***</h3>
        ***REMOVED***Icon && <Icon size=***REMOVED***20***REMOVED*** className="text-gray-400" />***REMOVED***
      </div>
      <p 
        className="text-2xl font-semibold"
        style=***REMOVED******REMOVED*** color: color || '#374151' ***REMOVED******REMOVED***
      >
        ***REMOVED***valor***REMOVED***
      </p>
    </Card>
  );
***REMOVED***;

export default TarjetaResumen;