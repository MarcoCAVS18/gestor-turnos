// src/pages/Dashboard.jsx - VERSIÓN TEMPORAL CON DEBUGGING

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import TarjetaResumen from '../components/TarjetaResumen';
import ResumenDia from '../components/ResumenDia';
import Loader from '../components/Loader';
import DebugPanel from '../components/DebugPanel'; // ← AÑADIR ESTO
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const Dashboard = () => ***REMOVED***
  const ***REMOVED*** trabajos, turnos, turnosPorFecha, cargando ***REMOVED*** = useApp();
  const [showLoading, setShowLoading] = useState(true);
  
  // Efecto para controlar el tiempo de carga
  useEffect(() => ***REMOVED***
    let timer;
    
    if (cargando) ***REMOVED***
      setShowLoading(true);
    ***REMOVED*** else ***REMOVED***
      timer = setTimeout(() => ***REMOVED***
        setShowLoading(false);
      ***REMOVED***, 2000);
    ***REMOVED***
    
    return () => ***REMOVED***
      if (timer) clearTimeout(timer);
    ***REMOVED***;
  ***REMOVED***, [cargando]);
  
  if (showLoading) ***REMOVED***
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  ***REMOVED***
  
  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <TarjetaResumen titulo="Trabajos" valor=***REMOVED***trabajos.length***REMOVED*** />
        <TarjetaResumen titulo="Turnos" valor=***REMOVED***turnos.length***REMOVED*** />
      </div>
      
      <h3 className="text-lg font-semibold mb-3">Turnos Recientes</h3>
      ***REMOVED***Object.entries(turnosPorFecha).length > 0 ? (
        Object.entries(turnosPorFecha)
          .slice(0, 2)
          .map(([fecha, turnosDia]) => (
            <ResumenDia 
              key=***REMOVED***fecha***REMOVED*** 
              fecha=***REMOVED***fecha***REMOVED*** 
              turnos=***REMOVED***turnosDia***REMOVED*** 
            />
          ))
      ) : (
        <div className="text-center py-8 bg-white rounded-xl shadow-md">
          <p className="text-gray-500">No hay turnos recientes</p>
        </div>
      )***REMOVED***
      
      ***REMOVED***/* Panel de debugging - TEMPORAL */***REMOVED***
      <DebugPanel />
    </div>
  );
***REMOVED***;

export default Dashboard;