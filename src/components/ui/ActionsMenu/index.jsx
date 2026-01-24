// src/components/ui/ActionsMenu/index.jsx

import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';

const ActionsMenu = ({ actions = [] }) => {
  const colors = useThemeColors();
  const [isOpen, setIsOpen] = useState(false);

  if (actions.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 rounded-lg transition-colors flex-shrink-0"
        style={{ 
          backgroundColor: isOpen ? colors.transparent10 : 'transparent',
          color: isOpen ? colors.primary : '#6B7280'
        }}
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border z-20 py-1 min-w-[140px]">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  if (!action.disabled) {
                    action.onClick();
                  }
                }}
                disabled={action.disabled} 
                className={`w-full px-3 py-2 text-left text-sm flex items-center transition-colors ${
                  action.disabled 
                    ? 'opacity-50 cursor-not-allowed'
                    : action.variant === 'danger' 
                      ? 'hover:bg-red-50 text-red-600' 
                      : 'hover:bg-gray-50'
                }`}
              >
                {action.icon && <action.icon size={14} className="mr-2" />}
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ActionsMenu;
