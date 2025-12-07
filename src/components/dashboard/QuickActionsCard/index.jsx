// src/components/dashboard/QuickActionsCard/index.jsx

import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Plus, Briefcase ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const QuickActionsCard = (***REMOVED*** className ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const navigate = useNavigate();

  return (
    <Card className=***REMOVED***`$***REMOVED***className***REMOVED*** flex flex-col`***REMOVED***>
      <h3 className="text-lg font-semibold mb-4">Acciones rápidas</h3>
      <div className="grid grid-cols-2 gap-3 flex-grow items-center">
        <Button
          onClick=***REMOVED***() => navigate('/turnos')***REMOVED***
          variant="outline"
          className="flex items-center justify-center gap-2"
          icon=***REMOVED***Plus***REMOVED***
          themeColor=***REMOVED***colors.primary***REMOVED***
        >
          Nuevo turno
        </Button>
        <Button
          onClick=***REMOVED***() => navigate('/trabajos')***REMOVED***
          variant="outline"
          className="flex items-center justify-center gap-2"
          icon=***REMOVED***Briefcase***REMOVED***
          themeColor=***REMOVED***colors.primary***REMOVED***
        >
          Nuevo trabajo
        </Button>
      </div>
    </Card>
  );
***REMOVED***;

export default QuickActionsCard;