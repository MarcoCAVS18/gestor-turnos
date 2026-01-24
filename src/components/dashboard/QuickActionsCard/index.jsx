// src/components/dashboard/ProjectionCard/index.jsx
import ***REMOVED*** BarChart3, PlusCircle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';
import ***REMOVED*** Link ***REMOVED*** from 'react-router-dom';

const ProjectionCard = (***REMOVED*** monthlyProjection, hoursWorked, className ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const ***REMOVED*** calculateMonthlyStats ***REMOVED*** = useApp();

  const renderContent = () => ***REMOVED***
    if (monthlyProjection <= 0) ***REMOVED***
      return (
        <Link to="/turnos" className="block w-full hover:bg-gray-50 rounded-lg p-4 transition-colors">
          <Flex variant="center" className="flex-col">
            <PlusCircle size=***REMOVED***32***REMOVED*** className="mb-2" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** />
            <p className="font-semibold text-gray-700">Start seeing your monthly projection</p>
            <p className="text-sm text-gray-500">Add new shifts this month to calculate it.</p>
          </Flex>
        </Link>
      );
    ***REMOVED***

    // Get data from the previous month using the new centralized function
    const now = new Date();
    const previousMonthStats = calculateMonthlyStats(now.getFullYear(), now.getMonth() - 1);

    // Calculate differences
    const getComparisonText = () => ***REMOVED***
      if (previousMonthStats.shiftsCount === 0) ***REMOVED***
        return 'Your first registered month';
      ***REMOVED***

      const difference = monthlyProjection - previousMonthStats.totalEarnings;
      const percentage = ((difference / previousMonthStats.totalEarnings) * 100).toFixed(1);

      if (difference > 0) ***REMOVED***
        return `$***REMOVED***formatCurrency(Math.abs(difference))***REMOVED*** more than last month (+$***REMOVED***percentage***REMOVED***%)`;
      ***REMOVED*** else if (difference < 0) ***REMOVED***
        return `$***REMOVED***formatCurrency(Math.abs(difference))***REMOVED*** less than last month (-$***REMOVED***Math.abs(percentage)***REMOVED***%)`;
      ***REMOVED*** else ***REMOVED***
        return 'Same as last month';
      ***REMOVED***
    ***REMOVED***;

    return (
      <Flex variant="between" className="w-full">
        ***REMOVED***/* Left text */***REMOVED***
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">
            If you maintain this pace throughout the month
          </p>
          <p className="text-xs text-gray-500">
            ***REMOVED***getComparisonText()***REMOVED***
          </p>
        </div>
        
        ***REMOVED***/* Right data */***REMOVED***
        <div className="text-right ml-4">
          <p 
            className="text-3xl font-bold mb-1" 
            style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
          >
            ***REMOVED***formatCurrency(monthlyProjection)***REMOVED***
          </p>
          <p className="text-sm text-gray-500">
            ~***REMOVED***(hoursWorked * 4.33).toFixed(0)***REMOVED*** hours
          </p>
        </div>
      </Flex>
    );
  ***REMOVED***;

  return (
    <Card className=***REMOVED***`$***REMOVED***className***REMOVED*** flex flex-col`***REMOVED***>
      ***REMOVED***/* Header */***REMOVED***
      <div className="flex items-center mb-4">
        <BarChart3 size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
        <h3 className="text-lg font-semibold">Monthly projection</h3>
      </div>
      
      ***REMOVED***/* Content */***REMOVED***
      <div className="flex-grow flex items-center">
        ***REMOVED***renderContent()***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default ProjectionCard;