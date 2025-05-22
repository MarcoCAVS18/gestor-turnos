// src/components/AlertaEliminacion.jsx - COMPONENTE REUTILIZABLE

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import DynamicButton from './DynamicButton';

const AlertaEliminacion = ({
  visible,
  onCancel,
  onConfirm,
  eliminando = false,
  tipo = 'elemento', // 'turno', 'trabajo', etc.
  titulo,
  detalles = [], // Array de strings con los detalles
  advertencia, // Mensaje adicional de advertencia
  textoConfirmar = 'Eliminar',
  textoCancelar = 'Cancelar'
}) => {
  
  if (!visible) return null;

  // Generar título automático si no se proporciona
  const tituloFinal = titulo || `¿Eliminar ${tipo}?`;
  
  // Generar texto del botón de confirmación con estado de carga
  const textoBotonConfirmar = eliminando ? 'Eliminando...' : textoConfirmar;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full animate-fadeIn">
        <div className="p-6">
          {/* Icono de advertencia */}
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          
          {/* Título */}
          <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
            {tituloFinal}
          </h3>
          
          {/* Información del elemento */}
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
          
          {/* Mensaje de advertencia adicional */}
          {advertencia && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">⚠️ Advertencia:</span> {advertencia}
              </p>
            </div>
          )}
          
          {/* Botones */}
          <div className="flex gap-3">
            <DynamicButton
              onClick={onCancel}
              variant="outline"
              className="flex-1"
              disabled={eliminando}
            >
              {textoCancelar}
            </DynamicButton>
            <button
              onClick={onConfirm}
              disabled={eliminando}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {textoBotonConfirmar}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertaEliminacion;