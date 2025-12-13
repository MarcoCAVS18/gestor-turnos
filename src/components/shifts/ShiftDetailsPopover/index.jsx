import React from 'react';
import Popover from '../../ui/Popover';
import { formatCurrency } from '../../../utils/currency';

const ShiftDetailsPopover = ({ 
  turno, 
  shiftData, 
  children, 
  anchorRef,
  // Nuevas props con valores por defecto para el nuevo diseño
  position = 'top', 
  fullWidth = true
}) => {
  const formatCreationDate = (timestamp) => {
    if (!timestamp || typeof timestamp.seconds !== 'number') return '';
    try {
      const date = new Date(timestamp.seconds * 1000);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (e) {
      console.error("Error formatting creation date:", e);
      return '';
    }
  };

  const hasNotes = turno.notas?.trim();
  const isDelivery = turno.tipo === 'delivery';

  // Determine if there is any content to show in the popover
  const hasContent = hasNotes || 
                     (isDelivery && shiftData && (shiftData.gananciaTotal > 0 || shiftData.gananciaBase > 0 || shiftData.propinas > 0 || shiftData.gastos > 0)) ||
                     (!isDelivery && shiftData && (shiftData.smokoApplied || shiftData.totalWithDiscount));

  if (!hasContent) {
      return <>{children}</>;
  }

  const content = (
    <div>
      {hasNotes && (
        <div className="mb-3 pb-2 border-b border-gray-100">
          <p className="font-semibold text-gray-700">Notas:</p>
          <p className="text-sm text-gray-600 break-words">{turno.notas}</p>
        </div>
      )}

      {isDelivery && shiftData ? (
        (() => {
          const gananciaBruta = shiftData.gananciaBase ?? 0;
          const propinas = shiftData.propinas || 0;
          const gastos = shiftData.gastos || 0;
          const gananciaNeta = (shiftData.gananciaTotal || 0) - gastos;

          return (
            <div>
              <p className="font-semibold text-gray-700 mb-1">Detalles Financieros:</p>
              <div className='text-sm text-gray-600 space-y-1'>
                <div className="flex justify-between"><span>Ganancia Bruta:</span> <span>{formatCurrency(gananciaBruta)}</span></div>
                {propinas > 0 && <div className="flex justify-between"><span>Propinas:</span> <span>{formatCurrency(propinas)}</span></div>}
                {gastos > 0 && <div className="flex justify-between"><span>Gastos:</span> <span className='text-red-500'>-{formatCurrency(gastos)}</span></div>}
                <div className="flex justify-between font-bold pt-1 border-t mt-1 border-gray-200"><span>Ganancia Neta:</span> <span className='text-green-600'>{formatCurrency(gananciaNeta)}</span></div>
              </div>
            </div>
          );
        })()
      ) : shiftData ? (
        <div className="space-y-2 text-sm">
          {shiftData.hoursBreakdown &&
            Object.entries(shiftData.hoursBreakdown)
              .filter(([, hours]) => hours > 0)
              .map(([type, hours]) => (
                <div key={type} className="flex justify-between text-gray-600">
                  <span>
                    {hours.toFixed(2)}hs en {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                  <span>
                    {formatCurrency(shiftData.breakdown[type] || 0)}
                  </span>
                </div>
              ))}

          <div className="pt-1 border-t border-gray-100" />

          <div className="flex justify-between font-semibold">
            <span>Ganancia Bruta</span>
            <span>{formatCurrency(shiftData.total || 0)}</span>
          </div>

          {shiftData.defaultDiscount > 0 && (
            <div className="flex justify-between text-red-500">
              <span>Descuento ({shiftData.defaultDiscount}%)</span>
              <span>
                -{formatCurrency((shiftData.total || 0) * (shiftData.defaultDiscount / 100))}
              </span>
            </div>
          )}

          {shiftData.smokoApplied && (
            <div className="flex justify-between text-red-500">
              <span>Descanso Smoko</span>
              <span>-{shiftData.smokoMinutes} min</span>
            </div>
          )}
          
          <div className="flex justify-between items-center font-bold text-base pt-1 border-t border-gray-200">
            <span className="text-gray-700">Ganancia neta</span>
            <span className="text-green-600">
              {formatCurrency(shiftData.totalWithDiscount || 0)}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );

  const footerContent = turno.fechaCreacion ? `Creado: ${formatCreationDate(turno.fechaCreacion)}` : '';

  return (
    <Popover 
        content={content} 
        title="Más información" 
        footer={footerContent}
        position={position}    // Usa la prop (por defecto 'top')
        trigger="click"
        anchorRef={anchorRef}  // Importante: usa la referencia de la tarjeta completa
        fullWidth={fullWidth}  // Usa la prop (por defecto true)
    >
      {children}
    </Popover>
  );
};

export default ShiftDetailsPopover;