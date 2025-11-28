// src/components/cards/base/BaseStatsCard/index.jsx
import React from 'react';
import Card from '../../../ui/Card';
import LoadingSpinner from '../../../ui/LoadingSpinner/LoadingSpinner'; // Corrected path
import { useThemeColors } from '../../../../hooks/useThemeColors';

const BaseStatsCard = ({
  title,
  icon: IconComponent,
  loading = false,
  empty = false,
  emptyMessage = 'No hay datos para mostrar',
  emptyDescription = 'Los datos aparecerán aquí una vez que se registren',
  children,
  className = ''
}) => {
  const colors = useThemeColors();
  const primaryColor = colors ? colors.primary : '#000000';

  return (
    <Card className={`flex flex-col ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 flex items-center flex-shrink-0">
          {IconComponent && <IconComponent size={20} style={{ color: primaryColor }} className="mr-2" />}
          {title}
        </h3>
      )}

      <div className="flex-1 flex items-center justify-center min-h-0">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : empty ? (
          <div className="text-center py-8 text-gray-500">
            {IconComponent && <IconComponent size={48} className="mx-auto mb-3 opacity-30" />}
            <p>{emptyMessage}</p>
            <p className="text-sm">{emptyDescription}</p>
          </div>
        ) : (
          <div className="w-full h-full">
            {children}
          </div>
        )}
      </div>
    </Card>
  );
};

export default BaseStatsCard;
