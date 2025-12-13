import React from 'react';
import Popover from '../../ui/Popover';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';

const ShiftDetailsPopover = (***REMOVED*** 
  turno, 
  shiftData, 
  children, 
  anchorRef,
  // Nuevas props con valores por defecto para el nuevo diseño
  position = 'top', 
  fullWidth = true
***REMOVED***) => ***REMOVED***
  const formatCreationDate = (timestamp) => ***REMOVED***
    if (!timestamp || typeof timestamp.seconds !== 'number') return '';
    try ***REMOVED***
      const date = new Date(timestamp.seconds * 1000);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `$***REMOVED***day***REMOVED***/$***REMOVED***month***REMOVED***/$***REMOVED***year***REMOVED*** $***REMOVED***hours***REMOVED***:$***REMOVED***minutes***REMOVED***`;
    ***REMOVED*** catch (e) ***REMOVED***
      console.error("Error formatting creation date:", e);
      return '';
    ***REMOVED***
  ***REMOVED***;

  const hasNotes = turno.notas?.trim();
  const isDelivery = turno.tipo === 'delivery';

  // Determine if there is any content to show in the popover
  const hasContent = hasNotes || 
                     (isDelivery && shiftData && (shiftData.gananciaTotal > 0 || shiftData.gananciaBase > 0 || shiftData.propinas > 0 || shiftData.gastos > 0)) ||
                     (!isDelivery && shiftData && (shiftData.smokoApplied || shiftData.totalWithDiscount));

  if (!hasContent) ***REMOVED***
      return <>***REMOVED***children***REMOVED***</>;
  ***REMOVED***

  const content = (
    <div>
      ***REMOVED***hasNotes && (
        <div className="mb-3 pb-2 border-b border-gray-100">
          <p className="font-semibold text-gray-700">Notas:</p>
          <p className="text-sm text-gray-600 break-words">***REMOVED***turno.notas***REMOVED***</p>
        </div>
      )***REMOVED***

      ***REMOVED***isDelivery && shiftData ? (
        (() => ***REMOVED***
          const gananciaBruta = shiftData.gananciaBase ?? 0;
          const propinas = shiftData.propinas || 0;
          const gastos = shiftData.gastos || 0;
          const gananciaNeta = (shiftData.gananciaTotal || 0) - gastos;

          return (
            <div>
              <p className="font-semibold text-gray-700 mb-1">Detalles Financieros:</p>
              <div className='text-sm text-gray-600 space-y-1'>
                <div className="flex justify-between"><span>Ganancia Bruta:</span> <span>***REMOVED***formatCurrency(gananciaBruta)***REMOVED***</span></div>
                ***REMOVED***propinas > 0 && <div className="flex justify-between"><span>Propinas:</span> <span>***REMOVED***formatCurrency(propinas)***REMOVED***</span></div>***REMOVED***
                ***REMOVED***gastos > 0 && <div className="flex justify-between"><span>Gastos:</span> <span className='text-red-500'>-***REMOVED***formatCurrency(gastos)***REMOVED***</span></div>***REMOVED***
                <div className="flex justify-between font-bold pt-1 border-t mt-1 border-gray-200"><span>Ganancia Neta:</span> <span className='text-green-600'>***REMOVED***formatCurrency(gananciaNeta)***REMOVED***</span></div>
              </div>
            </div>
          );
        ***REMOVED***)()
      ) : shiftData ? (
        <div className="space-y-2 text-sm">
          ***REMOVED***shiftData.hoursBreakdown &&
            Object.entries(shiftData.hoursBreakdown)
              .filter(([, hours]) => hours > 0)
              .map(([type, hours]) => (
                <div key=***REMOVED***type***REMOVED*** className="flex justify-between text-gray-600">
                  <span>
                    ***REMOVED***hours.toFixed(2)***REMOVED***hs en ***REMOVED***type.charAt(0).toUpperCase() + type.slice(1)***REMOVED***
                  </span>
                  <span>
                    ***REMOVED***formatCurrency(shiftData.breakdown[type] || 0)***REMOVED***
                  </span>
                </div>
              ))***REMOVED***

          <div className="pt-1 border-t border-gray-100" />

          <div className="flex justify-between font-semibold">
            <span>Ganancia Bruta</span>
            <span>***REMOVED***formatCurrency(shiftData.total || 0)***REMOVED***</span>
          </div>

          ***REMOVED***shiftData.defaultDiscount > 0 && (
            <div className="flex justify-between text-red-500">
              <span>Descuento (***REMOVED***shiftData.defaultDiscount***REMOVED***%)</span>
              <span>
                -***REMOVED***formatCurrency((shiftData.total || 0) * (shiftData.defaultDiscount / 100))***REMOVED***
              </span>
            </div>
          )***REMOVED***

          ***REMOVED***shiftData.smokoApplied && (
            <div className="flex justify-between text-red-500">
              <span>Descanso Smoko</span>
              <span>-***REMOVED***shiftData.smokoMinutes***REMOVED*** min</span>
            </div>
          )***REMOVED***
          
          <div className="flex justify-between items-center font-bold text-base pt-1 border-t border-gray-200">
            <span className="text-gray-700">Ganancia neta</span>
            <span className="text-green-600">
              ***REMOVED***formatCurrency(shiftData.totalWithDiscount || 0)***REMOVED***
            </span>
          </div>
        </div>
      ) : null***REMOVED***
    </div>
  );

  const footerContent = turno.fechaCreacion ? `Creado: $***REMOVED***formatCreationDate(turno.fechaCreacion)***REMOVED***` : '';

  return (
    <Popover 
        content=***REMOVED***content***REMOVED*** 
        title="Más información" 
        footer=***REMOVED***footerContent***REMOVED***
        position=***REMOVED***position***REMOVED***    // Usa la prop (por defecto 'top')
        trigger="click"
        anchorRef=***REMOVED***anchorRef***REMOVED***  // Importante: usa la referencia de la tarjeta completa
        fullWidth=***REMOVED***fullWidth***REMOVED***  // Usa la prop (por defecto true)
    >
      ***REMOVED***children***REMOVED***
    </Popover>
  );
***REMOVED***;

export default ShiftDetailsPopover;