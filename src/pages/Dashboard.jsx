// src/pages/Dashboard.jsx - VERSIÓN TEMPORAL CON DEBUGGING

import React, { useState, useEffect } from 'react';
import TarjetaResumen from '../components/TarjetaResumen';
import ResumenDia from '../components/ResumenDia';
import Loader from '../components/Loader';
import DebugPanel from '../components/DebugPanel'; // ← AÑADIR ESTO
import { useApp } from '../contexts/AppContext';

const Dashboard = () => {
  const { trabajos, turnos, turnosPorFecha, cargando } = useApp();
  const [showLoading, setShowLoading] = useState(true);
  
  // Efecto para controlar el tiempo de carga
  useEffect(() => {
    let timer;
    
    if (cargando) {
      setShowLoading(true);
    } else {
      timer = setTimeout(() => {
        setShowLoading(false);
      }, 2000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [cargando]);
  
  if (showLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <TarjetaResumen titulo="Trabajos" valor={trabajos.length} />
        <TarjetaResumen titulo="Turnos" valor={turnos.length} />
      </div>
      
      <h3 className="text-lg font-semibold mb-3">Turnos Recientes</h3>
      {Object.entries(turnosPorFecha).length > 0 ? (
        Object.entries(turnosPorFecha)
          .slice(0, 2)
          .map(([fecha, turnosDia]) => (
            <ResumenDia 
              key={fecha} 
              fecha={fecha} 
              turnos={turnosDia} 
            />
          ))
      ) : (
        <div className="text-center py-8 bg-white rounded-xl shadow-md">
          <p className="text-gray-500">No hay turnos recientes</p>
        </div>
      )}
      
      {/* Panel de debugging - TEMPORAL */}
      <DebugPanel />
    </div>
  );
};

export default Dashboard;