// src/components/dashboard/QuickStatCard/index.jsx
import React from 'react';
import Card from '../../ui/Card';
import { useApp } from '../../../contexts/AppContext';

const QuickStatCard = ({ icon: Icon, label, value, subtitle }) => {
  const { thematicColors } = useApp();
  
  return (
    <Card className="p-4 text-center h-full">
      <div className="flex flex-col h-full">
        <div className="my-auto">
          <div className="flex flex-col items-center">
            <Icon size={20} className="mb-2" style={{ color: thematicColors?.base }} />
            <span className="text-sm text-gray-600 font-medium mb-1">{label}</span>
            <p className="text-2xl font-bold text-gray-800 mb-1">{value}</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuickStatCard;
