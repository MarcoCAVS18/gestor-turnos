// src/components/other/DebugPanel/index.jsx

import React from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import Button from '../../ui/Button';

const DebugPanel = () => ***REMOVED***
  const ***REMOVED*** trabajos, turnos, cargando, debugFirestore ***REMOVED*** = useApp();
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  
  // Verificar si el debug mode está habilitado
  const debugEnabled = process.env.REACT_APP_DEBUG_MODE === 'true';
  const environment = process.env.REACT_APP_ENVIRONMENT || 'production';
  
  // No renderizar si el debug no está habilitado
  if (!debugEnabled) ***REMOVED***
    return null;
  ***REMOVED***
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
      <h3 className="text-lg font-bold mb-2">Debug Panel</h3>
      
      <div className="mb-2 text-xs text-yellow-400">
        Entorno: ***REMOVED***environment***REMOVED***
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Usuario:</strong> ***REMOVED***currentUser?.email || 'No autenticado'***REMOVED***
        </div>
        <div>
          <strong>UID:</strong> ***REMOVED***currentUser?.uid || 'N/A'***REMOVED***
        </div>
        <div>
          <strong>Cargando:</strong> ***REMOVED***cargando ? ' Sí' : ' No'***REMOVED***
        </div>
        <div>
          <strong>Trabajos en estado:</strong> ***REMOVED***trabajos.length***REMOVED***
        </div>
        <div>
          <strong>Turnos en estado:</strong> ***REMOVED***turnos.length***REMOVED***
        </div>
        
        ***REMOVED***trabajos.length > 0 && (
          <div>
            <strong>Lista trabajos:</strong>
            <ul className="ml-2">
              ***REMOVED***trabajos.map(trabajo => (
                <li key=***REMOVED***trabajo.id***REMOVED*** className="text-xs">
                  • ***REMOVED***trabajo.nombre***REMOVED***
                </li>
              ))***REMOVED***
            </ul>
          </div>
        )***REMOVED***
        
        <div className="pt-2 border-t border-gray-600">
          <Button
            onClick=***REMOVED***debugFirestore***REMOVED***
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-xs"
          >
            Debug Firestore
          </Button>
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default DebugPanel;