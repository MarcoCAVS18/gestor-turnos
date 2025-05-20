// src/pages/Dashboard.jsx
import React from 'react';
import TarjetaResumen from '../components/TarjetaResumen';
import ResumenDia from '../components/ResumenDia';
import { useApp } from '../contexts/AppContext';

const Dashboard = () => {
  const { trabajos, turnos, turnosPorFecha, cargando } = useApp();
  
  if (cargando) {
    return (
      <div className="px-4 py-6 text-center">
        <p>Cargando datos...</p>
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
    </div>
  );
};

export default Dashboard;