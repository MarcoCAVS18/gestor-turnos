// src/components/dashboard/ProjectionCard/index.jsx

import { BarChart3, PlusCircle } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';
import { Link } from 'react-router-dom';

const ProjectionCard = ({ proyeccionMensual, horasTrabajadas, className }) => {
  const colors = useThemeColors();
  const { calculateMonthlyStats } = useApp();

  const renderContent = () => {
    if (proyeccionMensual <= 0) {
      return (
        <Link to="/turnos" className="block w-full hover:bg-gray-50 rounded-lg p-4 transition-colors">
          <Flex variant="center" className="flex-col">
            <PlusCircle size={32} className="mb-2" style={{ color: colors.primary }} />
            <p className="font-semibold text-gray-700">Comienza a ver tu proyección mensual</p>
            <p className="text-sm text-gray-500">Agrega nuevos turnos este mes para calcularla.</p>
          </Flex>
        </Link>
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

      const diferencia = proyeccionMensual - previousMonthStats.totalEarnings;
      const porcentaje = ((diferencia / previousMonthStats.totalEarnings) * 100).toFixed(1);

      if (diferencia > 0) {
        return `${formatCurrency(Math.abs(diferencia))} más que el mes anterior (+${porcentaje}%)`;
      } else if (diferencia < 0) {
        return `${formatCurrency(Math.abs(diferencia))} menos que el mes anterior (-${Math.abs(porcentaje)}%)`;
      } else {
        return 'Igual que el mes anterior';
      }
    };

    return (
      <Flex variant="between" className="w-full">
        {/* Texto izquierdo */}
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">
            Si mantienes este ritmo durante todo el mes
          </p>
          <p className="text-xs text-gray-500">
            {obtenerTextoComparacion()}
          </p>
        </div>
        
        {/* Datos derecha */}
        <div className="text-right ml-4">
          <p 
            className="text-3xl font-bold mb-1" 
            style={{ color: colors.primary }}
          >
            {formatCurrency(proyeccionMensual)}
          </p>
          <p className="text-sm text-gray-500">
            ~{(horasTrabajadas * 4.33).toFixed(0)} horas
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
        <h3 className="text-lg font-semibold">Proyección mensual</h3>
      </div>
      
      {/* Content */}
      <div className="flex-grow flex items-center">
        {renderContent()}
      </div>
    </Card>
  );
};

export default ProjectionCard;