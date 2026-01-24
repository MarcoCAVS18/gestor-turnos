// src/components/cards/WorkDetailsCard/index.jsx

import React from 'react';
import { Edit, Trash2, Share2, Info } from 'lucide-react';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import { useShare } from '../../../../hooks/useShare';
import { formatCurrency } from '../../../../utils/helpers';
import Flex from '../../../ui/Flex';

const WorkDetailsCard = ({ 
  work, 
  shiftsCount = 0,
  onEdit, 
  onDelete,
  onToggleDetails 
}) => {
  const { sharing, messages, shareWork } = useShare();
  const [showDetails, setShowDetails] = React.useState(false);
  
  const isSharing = sharing[work.id] || false;
  const shareMessage = messages[work.id] || '';

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
    if (onToggleDetails) {
      onToggleDetails(work.id, !showDetails);
    }
  };

  return (
    <Card
      borderColor={work.color}
      borderPosition="left"
      className="transition-all hover:shadow-lg"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div 
              className="w-4 h-4 rounded-full mr-3"
              style={{ backgroundColor: work.color }}
            />
            <h3 className="text-lg font-semibold text-gray-800">
              {work.name}
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            {shiftsCount} {shiftsCount === 1 ? 'shift registered' : 'shifts registered'}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleDetails}
            icon={Info}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(work)}
            icon={Edit}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => shareWork(work)}
            loading={isSharing}
            icon={Share2}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(work)}
            icon={Trash2}
          />
        </div>
      </div>
      
      {/* Share Message */}
      {shareMessage && (
        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">{shareMessage}</p>
        </div>
      )}
      
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <Flex variant="between">
            <span className="text-gray-600">Base rate:</span>
            <span className="font-medium">{formatCurrency(work.baseRate)}</span>
          </Flex>
          <Flex variant="between">
            <span className="text-gray-600">Day:</span>
            <span className="font-medium">{formatCurrency(work.rates?.day || 0)}</span>
          </Flex>
          <Flex variant="between">
            <span className="text-gray-600">Afternoon:</span>
            <span className="font-medium">{formatCurrency(work.rates?.afternoon || 0)}</span>
          </Flex>
        </div>
        <div className="space-y-2">
          <Flex variant="between">
            <span className="text-gray-600">Night:</span>
            <span className="font-medium">{formatCurrency(work.rates?.night || 0)}</span>
          </Flex>
          <Flex variant="between">
            <span className="text-gray-600">Saturday:</span>
            <span className="font-medium">{formatCurrency(work.rates?.saturday || 0)}</span>
          </Flex>
          <Flex variant="between">
            <span className="text-gray-600">Sunday:</span>
            <span className="font-medium">{formatCurrency(work.rates?.sunday || 0)}</span>
          </Flex>
        </div>
      </div>
      
      {/* Description */}
      {work.description && (showDetails || work.description.length < 100) && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">{work.description}</p>
        </div>
      )}
    </Card>
  );
};

export default WorkDetailsCard;