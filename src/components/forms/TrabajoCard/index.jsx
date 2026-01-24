// src/components/cards/WorkDetailsCard/index.jsx

import React from 'react';
import ***REMOVED*** Edit, Trash2, Share2, Info ***REMOVED*** from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import ***REMOVED*** useShare ***REMOVED*** from '../../../hooks/useShare';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/helpers';
import Flex from '../../ui/Flex';

const WorkDetailsCard = (***REMOVED*** 
  work, 
  shiftsCount = 0,
  onEdit, 
  onDelete,
  onToggleDetails 
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** sharing, messages, shareWork ***REMOVED*** = useShare();
  const [showDetails, setShowDetails] = React.useState(false);
  
  const isSharing = sharing[work.id] || false;
  const shareMessage = messages[work.id] || '';

  const handleToggleDetails = () => ***REMOVED***
    setShowDetails(!showDetails);
    if (onToggleDetails) ***REMOVED***
      onToggleDetails(work.id, !showDetails);
    ***REMOVED***
  ***REMOVED***;

  return (
    <Card
      borderColor=***REMOVED***work.color***REMOVED***
      borderPosition="left"
      className="transition-all hover:shadow-lg"
    >
      ***REMOVED***/* Header */***REMOVED***
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div 
              className="w-4 h-4 rounded-full mr-3"
              style=***REMOVED******REMOVED*** backgroundColor: work.color ***REMOVED******REMOVED***
            />
            <h3 className="text-lg font-semibold text-gray-800">
              ***REMOVED***work.name***REMOVED***
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            ***REMOVED***shiftsCount***REMOVED*** ***REMOVED***shiftsCount === 1 ? 'shift registered' : 'shifts registered'***REMOVED***
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
            onClick=***REMOVED***() => onEdit(work)***REMOVED***
            icon=***REMOVED***Edit***REMOVED***
          />
          <Button
            variant="ghost"
            size="sm"
            onClick=***REMOVED***() => shareWork(work)***REMOVED***
            loading=***REMOVED***isSharing***REMOVED***
            icon=***REMOVED***Share2***REMOVED***
          />
          <Button
            variant="ghost"
            size="sm"
            onClick=***REMOVED***() => onDelete(work)***REMOVED***
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
          <Flex variant="between">
            <span className="text-gray-600">Base rate:</span>
            <span className="font-medium">***REMOVED***formatCurrency(work.baseRate)***REMOVED***</span>
          </Flex>
          <Flex variant="between">
            <span className="text-gray-600">Day:</span>
            <span className="font-medium">***REMOVED***formatCurrency(work.rates?.day || 0)***REMOVED***</span>
          </Flex>
          <Flex variant="between">
            <span className="text-gray-600">Afternoon:</span>
            <span className="font-medium">***REMOVED***formatCurrency(work.rates?.afternoon || 0)***REMOVED***</span>
          </Flex>
        </div>
        <div className="space-y-2">
          <Flex variant="between">
            <span className="text-gray-600">Night:</span>
            <span className="font-medium">***REMOVED***formatCurrency(work.rates?.night || 0)***REMOVED***</span>
          </Flex>
          <Flex variant="between">
            <span className="text-gray-600">Saturday:</span>
            <span className="font-medium">***REMOVED***formatCurrency(work.rates?.saturday || 0)***REMOVED***</span>
          </Flex>
          <Flex variant="between">
            <span className="text-gray-600">Sunday:</span>
            <span className="font-medium">***REMOVED***formatCurrency(work.rates?.sunday || 0)***REMOVED***</span>
          </Flex>
        </div>
      </div>
      
      ***REMOVED***/* Description */***REMOVED***
      ***REMOVED***work.description && (showDetails || work.description.length < 100) && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">***REMOVED***work.description***REMOVED***</p>
        </div>
      )***REMOVED***
    </Card>
  );
***REMOVED***;

export default WorkDetailsCard;