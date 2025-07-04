// src/components/dashboard/NextShiftCard/index.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronRight } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const NextShiftCard = ({ proximoTurno, formatearFecha }) => {
  const { trabajos, thematicColors } = useApp();
  const navigate = useNavigate();

  if (!proximoTurno) return null;

  const trabajo = trabajos.find(t => t.id === proximoTurno.trabajoId);
  if (!trabajo) return null;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Star size={20} style={{ color: thematicColors?.base }} className="mr-2" />
        Próximo turno
      </h3>
      <div className="flex items-center justify-between">
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
        >
          Ver
        </Button>
      </div>
    </Card>
  );
};

export default NextShiftCard;