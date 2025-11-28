// src/components/cards/base/BaseStatsCard/index.jsx
import React from 'react';
import Card from '../../../ui/Card';
import LoadingSpinner from '../../../ui/LoadingSpinner/LoadingSpinner'; // Corrected path
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';

const BaseStatsCard = (***REMOVED***
  title,
  icon: IconComponent,
  loading = false,
  empty = false,
  emptyMessage = 'No hay datos para mostrar',
  emptyDescription = 'Los datos aparecerán aquí una vez que se registren',
  children,
  className = ''
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const primaryColor = colors ? colors.primary : '#000000';

  return (
    <Card className=***REMOVED***`flex flex-col $***REMOVED***className***REMOVED***`***REMOVED***>
      ***REMOVED***title && (
        <h3 className="text-lg font-semibold mb-4 flex items-center flex-shrink-0">
          ***REMOVED***IconComponent && <IconComponent size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: primaryColor ***REMOVED******REMOVED*** className="mr-2" />***REMOVED***
          ***REMOVED***title***REMOVED***
        </h3>
      )***REMOVED***

      <div className="flex-1 flex items-center justify-center min-h-0">
        ***REMOVED***loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : empty ? (
          <div className="text-center py-8 text-gray-500">
            ***REMOVED***IconComponent && <IconComponent size=***REMOVED***48***REMOVED*** className="mx-auto mb-3 opacity-30" />***REMOVED***
            <p>***REMOVED***emptyMessage***REMOVED***</p>
            <p className="text-sm">***REMOVED***emptyDescription***REMOVED***</p>
          </div>
        ) : (
          <div className="w-full h-full">
            ***REMOVED***children***REMOVED***
          </div>
        )***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default BaseStatsCard;
