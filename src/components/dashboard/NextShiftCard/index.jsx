// src/components/dashboard/NextShiftCard/index.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronRight, CalendarX } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';

const NextShiftCard = ({ proximoTurno, formatearFecha }) => {
  const { trabajos } = useApp();
  const colors = useThemeColors();
  const navigate = useNavigate();

  const trabajo = proximoTurno ? trabajos.find(t => t.id === proximoTurno.trabajoId) : null;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Star size={20} style={{ color: colors.primary }} className="mr-2" />
        Próximo turno
      </h3>
      
      {proximoTurno && trabajo ? (
        <Flex variant="between">
          <div>
            <p className="font-semibold text-gray-800">{trabajo.nombre}</p>
            <p className="text-sm text-gray-600">
              {formatearFecha(proximoTurno.fecha)} • {proximoTurno.horaInicio}
            </p>
          </div>
          <Button
            onClick={() => navigate('/calendario')}
            size="sm"
            className="flex items-center gap-1"
            icon={ChevronRight}
            themeColor={colors.primary}
          >
            Ver
          </Button>
        </Flex>
      ) : (
        <Flex variant="center" className="text-center text-gray-500 py-4">
          <CalendarX size={24} className="mr-2" />
          <p>No tienes turnos futuros disponibles.</p>
        </Flex>
      )}
    </Card>
  );
};

export default NextShiftCard;