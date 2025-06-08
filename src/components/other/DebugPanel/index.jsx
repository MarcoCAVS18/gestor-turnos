// src/components/other/DebugPanel/index.jsx

import React from 'react';
import { useApp } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../ui/Button';

const DebugPanel = () => {
  const { trabajos, turnos, cargando, debugFirestore } = useApp();
  const { currentUser } = useAuth();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
      <h3 className="text-lg font-bold mb-2">Debug Panel</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Usuario:</strong> {currentUser?.email || 'No autenticado'}
        </div>
        <div>
          <strong>UID:</strong> {currentUser?.uid || 'N/A'}
        </div>
        <div>
          <strong>Cargando:</strong> {cargando ? ' Sí' : ' No'}
        </div>
        <div>
          <strong>Trabajos en estado:</strong> {trabajos.length}
        </div>
        <div>
          <strong>Turnos en estado:</strong> {turnos.length}
        </div>
        
        {trabajos.length > 0 && (
          <div>
            <strong>Lista trabajos:</strong>
            <ul className="ml-2">
              {trabajos.map(trabajo => (
                <li key={trabajo.id} className="text-xs">
                  • {trabajo.nombre}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="pt-2 border-t border-gray-600">
          <Button
            onClick={debugFirestore}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-xs"
          >
            Debug Firestore
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;