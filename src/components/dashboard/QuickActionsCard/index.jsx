// src/components/dashboard/QuickActionsCard/index.jsx - Con colores temáticos

import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Plus, Briefcase ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const QuickActionsCard = () => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  const navigate = useNavigate();

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Acciones rápidas</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick=***REMOVED***() => navigate('/turnos')***REMOVED***
          variant="outline"
          className="flex items-center justify-center gap-2"
          icon=***REMOVED***Plus***REMOVED***
          themeColor=***REMOVED***thematicColors?.base***REMOVED***
        >
          Nuevo turno
        </Button>
        <Button
          onClick=***REMOVED***() => navigate('/trabajos')***REMOVED***
          variant="outline"
          className="flex items-center justify-center gap-2"
          icon=***REMOVED***Briefcase***REMOVED***
          themeColor=***REMOVED***thematicColors?.base***REMOVED***
        >
          Nuevo trabajo
        </Button>
      </div>
    </Card>
  );
***REMOVED***;

export default QuickActionsCard;