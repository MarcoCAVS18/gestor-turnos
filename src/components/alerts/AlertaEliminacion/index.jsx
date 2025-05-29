import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../../ui/Button';

const AlertaEliminacion = ({
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
}) => {
  
  if (!visible) return null;

  const tituloFinal = titulo || `¿Eliminar ${tipo}?`;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full animate-fadeIn">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
            {tituloFinal}
          </h3>
          
          {detalles.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-sm space-y-1">
                {detalles.map((detalle, index) => (
                  <p 
                    key={index}
                    className={index === 0 ? "font-medium text-gray-900" : "text-gray-600"}
                  >
                    {detalle}
                  </p>
                ))}
              </div>
            </div>
          )}
          
          {advertencia && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">⚠️ Advertencia:</span> {advertencia}
              </p>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
              disabled={eliminando}
            >
              {textoCancelar}
            </Button>
            <Button
              onClick={onConfirm}
              variant="danger"
              className="flex-1"
              loading={eliminando}
            >
              {textoConfirmar}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertaEliminacion;