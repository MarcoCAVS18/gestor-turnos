// src/components/dashboard/TopWorkCard/index.jsx

import { Award } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const TopWorkCard = ({ mostProfitableWork }) => {
  const colors = useThemeColors();

  if (!mostProfitableWork) return null;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Award size={20} style={{ color: colors.primary }} className="mr-2" />
        Most profitable work
      </h3>
      <Flex variant="between">
        <div className="flex items-center">
          <div 
            className="w-4 h-4 rounded-full mr-3"
            style={{ backgroundColor: mostProfitableWork.work.color }}
          />
          <div>
            <p className="font-semibold text-gray-800">
              {mostProfitableWork.work.name}
            </p>
            <p className="text-sm text-gray-600">
              {mostProfitableWork.shifts} shifts • {mostProfitableWork.hours.toFixed(1)}h
            </p>
          </div>
        </div>
        <p 
          className="text-xl font-bold" 
          style={{ color: colors.primary }}
        >
          {formatCurrency(mostProfitableWork.earnings)}
        </p>
      </Flex>
    </Card>
  );
};

export default TopWorkCard;