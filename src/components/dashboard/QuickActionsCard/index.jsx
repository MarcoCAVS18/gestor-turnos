// src/components/dashboard/ProjectionCard/index.jsx
import { BarChart3, PlusCircle } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';
import { Link } from 'react-router-dom';

const ProjectionCard = ({ monthlyProjection, hoursWorked, className }) => {
  const colors = useThemeColors();
  const { calculateMonthlyStats } = useApp();

  const renderContent = () => {
    if (monthlyProjection <= 0) {
      return (
        <Link to="/turnos" className="block w-full hover:bg-gray-50 rounded-lg p-4 transition-colors">
          <Flex variant="center" className="flex-col">
            <PlusCircle size={32} className="mb-2" style={{ color: colors.primary }} />
            <p className="font-semibold text-gray-700">Start seeing your monthly projection</p>
            <p className="text-sm text-gray-500">Add new shifts this month to calculate it.</p>
          </Flex>
        </Link>
      );
    }

    // Get data from the previous month using the new centralized function
    const now = new Date();
    const previousMonthStats = calculateMonthlyStats(now.getFullYear(), now.getMonth() - 1);

    // Calculate differences
    const getComparisonText = () => {
      if (previousMonthStats.shiftsCount === 0) {
        return 'Your first registered month';
      }

      const difference = monthlyProjection - previousMonthStats.totalEarnings;
      const percentage = ((difference / previousMonthStats.totalEarnings) * 100).toFixed(1);

      if (difference > 0) {
        return `${formatCurrency(Math.abs(difference))} more than last month (+${percentage}%)`;
      } else if (difference < 0) {
        return `${formatCurrency(Math.abs(difference))} less than last month (-${Math.abs(percentage)}%)`;
      } else {
        return 'Same as last month';
      }
    };

    return (
      <Flex variant="between" className="w-full">
        {/* Left text */}
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">
            If you maintain this pace throughout the month
          </p>
          <p className="text-xs text-gray-500">
            {getComparisonText()}
          </p>
        </div>
        
        {/* Right data */}
        <div className="text-right ml-4">
          <p 
            className="text-3xl font-bold mb-1" 
            style={{ color: colors.primary }}
          >
            {formatCurrency(monthlyProjection)}
          </p>
          <p className="text-sm text-gray-500">
            ~{(hoursWorked * 4.33).toFixed(0)} hours
          </p>
        </div>
      </Flex>
    );
  };

  return (
    <Card className={`${className} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center mb-4">
        <BarChart3 size={20} style={{ color: colors.primary }} className="mr-2" />
        <h3 className="text-lg font-semibold">Monthly projection</h3>
      </div>
      
      {/* Content */}
      <div className="flex-grow flex items-center">
        {renderContent()}
      </div>
    </Card>
  );
};

export default ProjectionCard;