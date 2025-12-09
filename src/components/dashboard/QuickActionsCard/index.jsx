// src/components/dashboard/QuickActionsCard/index.jsx

import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Plus, Briefcase, Zap ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import New from '../../ui/New';

const QuickActionsCard = (***REMOVED*** className ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const navigate = useNavigate();

  return (
    <Card className=***REMOVED***`$***REMOVED***className***REMOVED*** flex flex-col`***REMOVED***>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Zap size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
        Acciones rápidas
      </h3>
      <div className="grid grid-cols-2 gap-2 flex-grow items-center">
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
        <Button
          onClick=***REMOVED***() => ***REMOVED***
          ***REMOVED******REMOVED***
          variant="solid"
          className="col-span-2 flex items-center justify-center gap-2"
          themeColor=***REMOVED***colors.primary***REMOVED***
        >
          Modo Live - Clock in and Clock out
          <New />
        </Button>
      </div>
    </Card>
  );
***REMOVED***;

export default QuickActionsCard;