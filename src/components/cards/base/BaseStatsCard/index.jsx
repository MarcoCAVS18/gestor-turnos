// src/components/cards/base/BaseStatsCard/index.jsx
import React from 'react';
import Card from '../../../ui/Card';
import LoadingSpinner from '../../../ui/LoadingSpinner/LoadingSpinner';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import Flex from '../../../ui/Flex';

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
  const primaryColor = colors ? colors.primary : '#121212';

  return (
    <Card className={`flex flex-col ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 flex items-center flex-shrink-0">
          {IconComponent && <IconComponent size={20} style={{ color: primaryColor }} className="mr-2" />}
          {title}
        </h3>
      )}

      <Flex variant="center" className="flex-1 min-h-0">
        {loading ? (
          <Flex variant="center" className="py-8">
            <LoadingSpinner />
          </Flex>
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
      </Flex>
    </Card>
  );
};

export default BaseStatsCard;
