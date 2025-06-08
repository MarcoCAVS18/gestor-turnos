// src/components/cards/TrabajoCard/index.jsx

import React from 'react';
import ***REMOVED*** Edit, Trash2, Share2, Info ***REMOVED*** from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import ***REMOVED*** useShare ***REMOVED*** from '../../../hooks/useShare';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/helpers';

const TrabajoCard = (***REMOVED*** 
  trabajo, 
  turnosCount = 0,
  onEdit, 
  onDelete,
  onToggleDetails 
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** sharing, messages, shareWork ***REMOVED*** = useShare();
  const [showDetails, setShowDetails] = React.useState(false);
  
  const isSharing = sharing[trabajo.id] || false;
  const shareMessage = messages[trabajo.id] || '';

  const handleToggleDetails = () => ***REMOVED***
    setShowDetails(!showDetails);
    if (onToggleDetails) ***REMOVED***
      onToggleDetails(trabajo.id, !showDetails);
    ***REMOVED***
  ***REMOVED***;

  return (
    <Card
      borderColor=***REMOVED***trabajo.color***REMOVED***
      borderPosition="left"
      className="transition-all hover:shadow-lg"
    >
      ***REMOVED***/* Header */***REMOVED***
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div 
              className="w-4 h-4 rounded-full mr-3"
              style=***REMOVED******REMOVED*** backgroundColor: trabajo.color ***REMOVED******REMOVED***
            />
            <h3 className="text-lg font-semibold text-gray-800">
              ***REMOVED***trabajo.nombre***REMOVED***
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            ***REMOVED***turnosCount***REMOVED*** ***REMOVED***turnosCount === 1 ? 'turno registrado' : 'turnos registrados'***REMOVED***
          </p>
        </div>
        
        ***REMOVED***/* Action Buttons */***REMOVED***
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick=***REMOVED***handleToggleDetails***REMOVED***
            icon=***REMOVED***Info***REMOVED***
          />
          <Button
            variant="ghost"
            size="sm"
            onClick=***REMOVED***() => onEdit(trabajo)***REMOVED***
            icon=***REMOVED***Edit***REMOVED***
          />
          <Button
            variant="ghost"
            size="sm"
            onClick=***REMOVED***() => shareWork(trabajo)***REMOVED***
            loading=***REMOVED***isSharing***REMOVED***
            icon=***REMOVED***Share2***REMOVED***
          />
          <Button
            variant="ghost"
            size="sm"
            onClick=***REMOVED***() => onDelete(trabajo)***REMOVED***
            icon=***REMOVED***Trash2***REMOVED***
          />
        </div>
      </div>
      
      ***REMOVED***/* Share Message */***REMOVED***
      ***REMOVED***shareMessage && (
        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">***REMOVED***shareMessage***REMOVED***</p>
        </div>
      )***REMOVED***
      
      ***REMOVED***/* Basic Info */***REMOVED***
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Tarifa base:</span>
            <span className="font-medium">***REMOVED***formatCurrency(trabajo.tarifaBase)***REMOVED***</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Diurno:</span>
            <span className="font-medium">***REMOVED***formatCurrency(trabajo.tarifas?.diurno || 0)***REMOVED***</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Tarde:</span>
            <span className="font-medium">***REMOVED***formatCurrency(trabajo.tarifas?.tarde || 0)***REMOVED***</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Noche:</span>
            <span className="font-medium">***REMOVED***formatCurrency(trabajo.tarifas?.noche || 0)***REMOVED***</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Sábado:</span>
            <span className="font-medium">***REMOVED***formatCurrency(trabajo.tarifas?.sabado || 0)***REMOVED***</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Domingo:</span>
            <span className="font-medium">***REMOVED***formatCurrency(trabajo.tarifas?.domingo || 0)***REMOVED***</span>
          </div>
        </div>
      </div>
      
      ***REMOVED***/* Description */***REMOVED***
      ***REMOVED***trabajo.descripcion && (showDetails || trabajo.descripcion.length < 100) && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">***REMOVED***trabajo.descripcion***REMOVED***</p>
        </div>
      )***REMOVED***
    </Card>
  );
***REMOVED***;

export default TrabajoCard;