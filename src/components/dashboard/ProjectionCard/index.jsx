// src/components/dashboard/ProjectionCard/index.jsx

import { BarChart3 } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const ProjectionCard = ({ proyeccionMensual, horasTrabajadas }) => {
  const colors = useThemeColors();
  const { turnos } = useApp();

  if (proyeccionMensual <= 0) return null;

  // Obtener datos del mes anterior
  const obtenerDatosMesAnterior = () => {
    const ahora = new Date();
    const mesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
    const inicioMesAnterior = new Date(mesAnterior.getFullYear(), mesAnterior.getMonth(), 1);
    const finMesAnterior = new Date(mesAnterior.getFullYear(), mesAnterior.getMonth() + 1, 0, 23, 59, 59);

    const turnosMesAnterior = turnos.filter(turno => {
      const fecha = turno.fecha?.toDate ? turno.fecha.toDate() : new Date(turno.fecha);
      return fecha >= inicioMesAnterior && fecha <= finMesAnterior;
    });

    const totalGanado = turnosMesAnterior.reduce((sum, turno) => sum + (turno.ganancia || 0), 0);

    return {
      existe: turnosMesAnterior.length > 0,
      ganancia: totalGanado
    };
  };

  const mesAnterior = obtenerDatosMesAnterior();
  
  // Calcular diferencias
  const obtenerTextoComparacion = () => {
    if (!mesAnterior.existe) {
      return 'Tu primer mes registrado';
    }

    const diferencia = proyeccionMensual - mesAnterior.ganancia;
    const porcentaje = ((diferencia / mesAnterior.ganancia) * 100).toFixed(1);
    
    if (diferencia > 0) {
      return `${formatCurrency(Math.abs(diferencia))} más que el mes anterior (+${porcentaje}%)`;
    } else if (diferencia < 0) {
      return `${formatCurrency(Math.abs(diferencia))} menos que el mes anterior (-${Math.abs(porcentaje)}%)`;
    } else {
      return 'Igual que el mes anterior';
    }
  };

  return (
    <Card className="h-full">
      {/* Header */}
      <div className="flex items-center mb-4">
        <BarChart3 size={20} style={{ color: colors.primary }} className="mr-2" />
        <h3 className="text-lg font-semibold">Proyección mensual</h3>
      </div>
      
      {/* Content - Layout horizontal */}
      <div className="flex items-center justify-between">
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
      </div>
    </Card>
  );
};

export default ProjectionCard;