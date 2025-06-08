// src/components/settings/GoalsSection/index.jsx

import React, { useState } from 'react';
import { Target, Save, X } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';

const GoalsSection = () => {
  const { metaHorasSemanales, actualizarMetaHorasSemanales, coloresTemáticos } = useApp();
  const [editando, setEditando] = useState(false);
  const [nuevaMeta, setNuevaMeta] = useState(metaHorasSemanales || '');

  const handleGuardar = () => {
    const meta = parseFloat(nuevaMeta);
    if (meta > 0 && meta <= 168) {
      actualizarMetaHorasSemanales(meta);
      setEditando(false);
    }
  };

  const handleCancelar = () => {
    setNuevaMeta(metaHorasSemanales || '');
    setEditando(false);
  };

  const handleEliminar = () => {
    actualizarMetaHorasSemanales(null);
    setNuevaMeta('');
    setEditando(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Target size={20} style={{ color: coloresTemáticos?.base }} className="mr-2" />
        <h3 className="text-lg font-semibold">Metas Semanales</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta de horas por semana
          </label>
          
          {!editando ? (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                {metaHorasSemanales ? (
                  <>
                    <span className="text-lg font-semibold" style={{ color: coloresTemáticos?.base }}>
                      {metaHorasSemanales} horas
                    </span>
                    <p className="text-sm text-gray-500">
                      ~{(metaHorasSemanales / 7).toFixed(1)} horas por día
                    </p>
                  </>
                ) : (
                  <span className="text-gray-500">No configurada</span>
                )}
              </div>
              <button
                onClick={() => setEditando(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)',
                  color: coloresTemáticos?.base || '#EC4899'
                }}
              >
                {metaHorasSemanales ? 'Editar' : 'Configurar'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={nuevaMeta}
                  onChange={(e) => setNuevaMeta(e.target.value)}
                  placeholder="Ej: 40"
                  min="1"
                  max="168"
                  step="0.5"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': coloresTemáticos?.base || '#EC4899' }}
                />
                <span className="text-sm text-gray-500">horas</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleGuardar}
                  disabled={!nuevaMeta || parseFloat(nuevaMeta) <= 0}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                  style={{ backgroundColor: coloresTemáticos?.base || '#EC4899' }}
                >
                  <Save size={16} className="mr-1" />
                  Guardar
                </button>
                
                <button
                  onClick={handleCancelar}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)',
                    color: coloresTemáticos?.base || '#EC4899'
                  }}
                >
                  <X size={16} className="mr-1" />
                  Cancelar
                </button>

                {metaHorasSemanales && (
                  <button
                    onClick={handleEliminar}
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 transition-colors"
                  >
                    <X size={16} className="mr-1" />
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Consejo:</strong> Configura una meta realista para ver tu progreso semanal 
            en la barra de progreso de Estadísticas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoalsSection;