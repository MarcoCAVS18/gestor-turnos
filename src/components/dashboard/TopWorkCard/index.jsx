// src/components/dashboard/TopWorkCard/index.jsx

import ***REMOVED*** Award ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';

const TopWorkCard = (***REMOVED*** trabajoMasRentable ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  if (!trabajoMasRentable) return null;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Award size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
        Trabajo más rentable
      </h3>
      <Flex variant="between">
        <div className="flex items-center">
          <div 
            className="w-4 h-4 rounded-full mr-3"
            style=***REMOVED******REMOVED*** backgroundColor: trabajoMasRentable.trabajo.color ***REMOVED******REMOVED***
          />
          <div>
            <p className="font-semibold text-gray-800">
              ***REMOVED***trabajoMasRentable.trabajo.nombre***REMOVED***
            </p>
            <p className="text-sm text-gray-600">
              ***REMOVED***trabajoMasRentable.turnos***REMOVED*** turnos • ***REMOVED***trabajoMasRentable.horas.toFixed(1)***REMOVED***h
            </p>
          </div>
        </div>
        <p 
          className="text-xl font-bold" 
          style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
        >
          ***REMOVED***formatCurrency(trabajoMasRentable.ganancia)***REMOVED***
        </p>
      </Flex>
    </Card>
  );
***REMOVED***;

export default TopWorkCard;