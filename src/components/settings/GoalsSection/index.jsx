// src/components/settings/GoalsSection/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Target, Save, X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const GoalsSection = () => ***REMOVED***
  const ***REMOVED*** metaHorasSemanales, actualizarMetaHorasSemanales, coloresTemáticos ***REMOVED*** = useApp();
  const [editando, setEditando] = useState(false);
  const [nuevaMeta, setNuevaMeta] = useState(metaHorasSemanales || '');

  const handleGuardar = () => ***REMOVED***
    const meta = parseFloat(nuevaMeta);
    if (meta > 0 && meta <= 168) ***REMOVED***
      actualizarMetaHorasSemanales(meta);
      setEditando(false);
    ***REMOVED***
  ***REMOVED***;

  const handleCancelar = () => ***REMOVED***
    setNuevaMeta(metaHorasSemanales || '');
    setEditando(false);
  ***REMOVED***;

  const handleEliminar = () => ***REMOVED***
    actualizarMetaHorasSemanales(null);
    setNuevaMeta('');
    setEditando(false);
  ***REMOVED***;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center mb-4">
        <Target size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
        <h3 className="text-lg font-semibold">Metas Semanales</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta de horas por semana
          </label>
          
          ***REMOVED***!editando ? (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                ***REMOVED***metaHorasSemanales ? (
                  <>
                    <span className="text-lg font-semibold" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED***>
                      ***REMOVED***metaHorasSemanales***REMOVED*** horas
                    </span>
                    <p className="text-sm text-gray-500">
                      ~***REMOVED***(metaHorasSemanales / 7).toFixed(1)***REMOVED*** horas por día
                    </p>
                  </>
                ) : (
                  <span className="text-gray-500">No configurada</span>
                )***REMOVED***
              </div>
              <button
                onClick=***REMOVED***() => setEditando(true)***REMOVED***
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style=***REMOVED******REMOVED***
                  backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)',
                  color: coloresTemáticos?.base || '#EC4899'
                ***REMOVED******REMOVED***
              >
                ***REMOVED***metaHorasSemanales ? 'Editar' : 'Configurar'***REMOVED***
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value=***REMOVED***nuevaMeta***REMOVED***
                  onChange=***REMOVED***(e) => setNuevaMeta(e.target.value)***REMOVED***
                  placeholder="Ej: 40"
                  min="1"
                  max="168"
                  step="0.5"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style=***REMOVED******REMOVED*** '--tw-ring-color': coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
                />
                <span className="text-sm text-gray-500">horas</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick=***REMOVED***handleGuardar***REMOVED***
                  disabled=***REMOVED***!nuevaMeta || parseFloat(nuevaMeta) <= 0***REMOVED***
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                  style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
                >
                  <Save size=***REMOVED***16***REMOVED*** className="mr-1" />
                  Guardar
                </button>
                
                <button
                  onClick=***REMOVED***handleCancelar***REMOVED***
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style=***REMOVED******REMOVED***
                    backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)',
                    color: coloresTemáticos?.base || '#EC4899'
                  ***REMOVED******REMOVED***
                >
                  <X size=***REMOVED***16***REMOVED*** className="mr-1" />
                  Cancelar
                </button>

                ***REMOVED***metaHorasSemanales && (
                  <button
                    onClick=***REMOVED***handleEliminar***REMOVED***
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 transition-colors"
                  >
                    <X size=***REMOVED***16***REMOVED*** className="mr-1" />
                    Eliminar
                  </button>
                )***REMOVED***
              </div>
            </div>
          )***REMOVED***
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>💡 Consejo:</strong> Configura una meta realista para ver tu progreso semanal 
            en la barra de progreso de Estadísticas.
          </p>
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default GoalsSection;