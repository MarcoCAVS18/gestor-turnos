// src/components/dashboard/ProjectionCard/index.jsx

import { BarChart3, Briefcase, Timer, ArrowRight } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';
import { useNavigate } from 'react-router-dom';

const ProjectionCard = ({ monthlyProjection, hoursWorked, className }) => {
  const colors = useThemeColors();
  const { calculateMonthlyStats } = useApp();
  const navigate = useNavigate();

  const renderContent = () => {
    if (!monthlyProjection || monthlyProjection <= 0) {
      return (
        <div className="w-full">
          <div className="grid grid-cols-2 gap-4">
            {/* Step 1: Add works */}
            <button
              onClick={() => navigate('/works')}
              className="text-left p-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  1
                </div>
                <Briefcase size={16} className="text-gray-400 group-hover:text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Add your works</p>
              <p className="text-xs text-gray-500 mt-1">This unlocks Shifts page</p>
              <ArrowRight size={14} className="text-gray-300 mt-2 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Step 2: Add shifts or use Live Mode */}
            <div className="p-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-gray-300 text-white">
                  2
                </div>
                <Timer size={16} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500">Track your shifts</p>
              <p className="text-xs text-gray-400 mt-1">Add manually or use Live Mode</p>
            </div>
          </div>
        </div>
      );
    }

    // Obtener datos del mes anterior usando la nueva función centralizada
    const now = new Date();
    const previousMonthStats = calculateMonthlyStats(now.getFullYear(), now.getMonth() - 1);

    // Calcular diferencias
    const obtenerTextoComparacion = () => {
      if (previousMonthStats.shiftsCount === 0) {
        return 'Tu primer mes registrado';
      }

      const diferencia = monthlyProjection - previousMonthStats.totalEarnings;
      const porcentaje = ((diferencia / previousMonthStats.totalEarnings) * 100).toFixed(1);

      if (diferencia > 0) {
        return `${formatCurrency(Math.abs(diferencia))} more than last month (+${porcentaje}%)`;
      } else if (diferencia < 0) {
        return `${formatCurrency(Math.abs(diferencia))} less than last month (-${Math.abs(porcentaje)}%)`;
      } else {
        return 'Same as last month';
      }
    };

    return (
      <Flex variant="between" className="w-full">
        {/* Left text */}
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">
            If you keep this pace throughout the month
          </p>
          <p className="text-xs text-gray-500">
            {obtenerTextoComparacion()}
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
            ~{((hoursWorked || 0) * 4.33).toFixed(0)} hours
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