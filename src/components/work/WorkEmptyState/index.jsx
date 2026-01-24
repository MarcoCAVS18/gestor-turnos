// src/components/work/WorkEmptyState/index.jsx

import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const WorkEmptyState = ({ onNewWork }) => {
  const colors = useThemeColors();

  return (
    <Card>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Flex variant="center" className="mb-4">
          <div className="p-4 rounded-full mb-3">
            <Briefcase size={32} className="mx-auto text-gray-300" />
          </div>
          <div>
            <p className="text-gray-600 font-medium mb-2">No works yet</p>
            <p className="text-sm text-gray-500 mb-4">Create your first work to start managing your income</p>
            <button
              onClick={onNewWork}
              className="px-6 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              style={{ color: colors.primary, borderColor: colors.primary }} 
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = colors.primary;
              }}
            >
              <Plus size={16} className="mr-2" />
              Add Work
            </button>
          </div>
        </Flex>
      </div>
    </Card>
  );
};

export default WorkEmptyState;