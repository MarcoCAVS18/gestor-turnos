// src/components/dashboard/NextShiftCard/index.jsx

import React from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Star, ChevronRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const NextShiftCard = (***REMOVED*** proximoTurno, formatearFecha ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** trabajos ***REMOVED*** = useApp();
  const colors = useThemeColors();
  const navigate = useNavigate();

  if (!proximoTurno) return null;

  const trabajo = trabajos.find(t => t.id === proximoTurno.trabajoId);
  if (!trabajo) return null;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Star size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
        Próximo turno
      </h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-800">***REMOVED***trabajo.nombre***REMOVED***</p>
          <p className="text-sm text-gray-600">
            ***REMOVED***formatearFecha(proximoTurno.fecha)***REMOVED*** • ***REMOVED***proximoTurno.horaInicio***REMOVED***
          </p>
        </div>
        <Button
          onClick=***REMOVED***() => navigate('/calendario')***REMOVED***
          size="sm"
          className="flex items-center gap-1"
          icon=***REMOVED***ChevronRight***REMOVED***
          themeColor=***REMOVED***colors.primary***REMOVED***
        >
          Ver
        </Button>
      </div>
    </Card>
  );
***REMOVED***;

export default NextShiftCard;