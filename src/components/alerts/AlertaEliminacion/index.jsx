import React from 'react';
import ***REMOVED*** AlertTriangle ***REMOVED*** from 'lucide-react';
import Button from '../../ui/Button';

const AlertaEliminacion = (***REMOVED***
  visible,
  onCancel,
  onConfirm,
  eliminando = false,
  tipo = 'elemento',
  titulo,
  detalles = [],
  advertencia,
  textoConfirmar = 'Eliminar',
  textoCancelar = 'Cancelar'
***REMOVED***) => ***REMOVED***
  
  if (!visible) return null;

  const tituloFinal = titulo || `¿Eliminar $***REMOVED***tipo***REMOVED***?`;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full animate-fadeIn">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <AlertTriangle size=***REMOVED***24***REMOVED*** className="text-red-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
            ***REMOVED***tituloFinal***REMOVED***
          </h3>
          
          ***REMOVED***detalles.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-sm space-y-1">
                ***REMOVED***detalles.map((detalle, index) => (
                  <p 
                    key=***REMOVED***index***REMOVED***
                    className=***REMOVED***index === 0 ? "font-medium text-gray-900" : "text-gray-600"***REMOVED***
                  >
                    ***REMOVED***detalle***REMOVED***
                  </p>
                ))***REMOVED***
              </div>
            </div>
          )***REMOVED***
          
          ***REMOVED***advertencia && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">⚠️ Advertencia:</span> ***REMOVED***advertencia***REMOVED***
              </p>
            </div>
          )***REMOVED***
          
          <div className="flex gap-3">
            <Button
              onClick=***REMOVED***onCancel***REMOVED***
              variant="outline"
              className="flex-1"
              disabled=***REMOVED***eliminando***REMOVED***
            >
              ***REMOVED***textoCancelar***REMOVED***
            </Button>
            <Button
              onClick=***REMOVED***onConfirm***REMOVED***
              variant="danger"
              className="flex-1"
              loading=***REMOVED***eliminando***REMOVED***
            >
              ***REMOVED***textoConfirmar***REMOVED***
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default AlertaEliminacion;