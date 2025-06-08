// src/components/shared/WorkPreviewCard/index.jsx

import React from 'react';
import ***REMOVED*** Briefcase, DollarSign, Percent ***REMOVED*** from 'lucide-react';
import Card from '../../ui/Card';

const WorkPreviewCard = (***REMOVED*** trabajo ***REMOVED***) => ***REMOVED***
  if (!trabajo) return null;

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
            style=***REMOVED******REMOVED*** backgroundColor: trabajo.color ***REMOVED******REMOVED***
          >
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">***REMOVED***trabajo.nombre***REMOVED***</h2>
            <p className="text-gray-600">***REMOVED***trabajo.descripcion***REMOVED***</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <DollarSign className="h-5 w-5 text-green-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Salario por hora</p>
            <p className="font-semibold">$***REMOVED***trabajo.salario***REMOVED***</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Percent className="h-5 w-5 text-blue-500 mr-2" />
          <div>
            <p className="text-sm text-gray-600">Descuento</p>
            <p className="font-semibold">***REMOVED***trabajo.descuento***REMOVED***%</p>
          </div>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default WorkPreviewCard;