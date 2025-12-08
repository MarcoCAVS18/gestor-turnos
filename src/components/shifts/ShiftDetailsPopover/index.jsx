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
                     (isDelivery && shiftData && (shiftData.gananciaTotal > 0 || shiftData.propinas > 0 || shiftData.gastos > 0)) ||
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
        <div>
            <p className="font-semibold text-gray-700 mb-1">Detalles Financieros:</p>
            <div className='text-sm text-gray-600 space-y-1'>
                <div className="flex justify-between"><span>Ganancia Bruta:</span> <span>***REMOVED***formatCurrency(shiftData.gananciaTotal)***REMOVED***</span></div>
                ***REMOVED***shiftData.propinas > 0 && <div className="flex justify-between"><span>Propinas:</span> <span>***REMOVED***formatCurrency(shiftData.propinas)***REMOVED***</span></div>***REMOVED***
                ***REMOVED***shiftData.gastos > 0 && <div className="flex justify-between"><span>Gastos:</span> <span className='text-red-500'>-***REMOVED***formatCurrency(shiftData.gastos)***REMOVED***</span></div>***REMOVED***
                <div className="flex justify-between font-bold pt-1 border-t mt-1 border-gray-200"><span>Ganancia Neta:</span> <span className='text-green-600'>***REMOVED***formatCurrency(shiftData.totalWithDiscount)***REMOVED***</span></div>
            </div>
        </div>
      ) : shiftData ? (
        <div className="space-y-2">
          ***REMOVED***shiftData.smokoApplied && (
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Descuento Smoko:</span>
              <span className="text-sm text-red-600">-***REMOVED***shiftData.smokoMinutes***REMOVED*** min</span>
            </div>
          )***REMOVED***
          <div className="flex justify-between items-center pt-1 border-t mt-1 border-gray-200">
            <span className="font-semibold text-gray-700">Ganancia neta:</span>
            <span className="text-lg text-green-600 font-bold">***REMOVED***formatCurrency(shiftData.totalWithDiscount || 0)***REMOVED***</span>
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