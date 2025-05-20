// src/pages/Estadisticas.jsx
import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** BarChart2, TrendingUp, DollarSign, Clock ***REMOVED*** from 'lucide-react';

const Estadisticas = () => ***REMOVED***
  const ***REMOVED*** turnos, trabajos, calcularPago ***REMOVED*** = useApp();
  const [resumen, setResumen] = useState(***REMOVED***
    totalGanado: 0,
    horasTrabajadas: 0,
    trabajosMasRentables: [],
    turnosPorDia: ***REMOVED******REMOVED***,
    promedioHora: 0
  ***REMOVED***);
  
  useEffect(() => ***REMOVED***
    if (turnos.length === 0 || trabajos.length === 0) return;
    
    // Calcular estadísticas
    let totalGanado = 0;
    let horasTrabajadas = 0;
    const gananciaPorTrabajo = ***REMOVED******REMOVED***;
    const horasPorTrabajo = ***REMOVED******REMOVED***;
    const turnosPorDia = ***REMOVED***
      "Lunes": 0,
      "Martes": 0,
      "Miércoles": 0,
      "Jueves": 0,
      "Viernes": 0,
      "Sábado": 0,
      "Domingo": 0
    ***REMOVED***;
    
    turnos.forEach(turno => ***REMOVED***
      const trabajo = trabajos.find(t => t.id === turno.trabajoId);
      if (!trabajo) return;
      
      const ***REMOVED*** totalConDescuento, horas ***REMOVED*** = calcularPago(turno);
      
      // Acumular totales
      totalGanado += totalConDescuento;
      horasTrabajadas += horas;
      
      // Acumular por trabajo
      if (!gananciaPorTrabajo[trabajo.id]) ***REMOVED***
        gananciaPorTrabajo[trabajo.id] = ***REMOVED***
          id: trabajo.id,
          nombre: trabajo.nombre,
          color: trabajo.color,
          ganancia: 0,
          horas: 0
        ***REMOVED***;
        
        // Inicializar horas por trabajo
        horasPorTrabajo[trabajo.id] = 0;
      ***REMOVED***
      gananciaPorTrabajo[trabajo.id].ganancia += totalConDescuento;
      gananciaPorTrabajo[trabajo.id].horas += horas;
      horasPorTrabajo[trabajo.id] += horas;
      
      const diaSemana = new Date(turno.fecha).getDay(); // 0 = domingo, 6 = sábado
      const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      turnosPorDia[nombresDias[diaSemana]]++;
    ***REMOVED***);
    
    // Convertir el objeto en array y ordenar por ganancia
    const trabajosMasRentables = Object.values(gananciaPorTrabajo).sort((a, b) => b.ganancia - a.ganancia);
    
    // Calcular promedio por hora
    const promedioHora = horasTrabajadas > 0 ? totalGanado / horasTrabajadas : 0;
    
    // Generar datos para el gráfico de distribución de horas por trabajo
    const datosDistribucionHoras = Object.entries(horasPorTrabajo).map(([id, horas]) => ***REMOVED***
      const trabajo = trabajos.find(t => t.id === id);
      return ***REMOVED***
        nombre: trabajo ? trabajo.nombre : 'Desconocido',
        horas,
        color: trabajo ? trabajo.color : '#999',
        porcentaje: (horas / horasTrabajadas) * 100
      ***REMOVED***;
    ***REMOVED***).sort((a, b) => b.horas - a.horas);
    
    setResumen(***REMOVED***
      totalGanado,
      horasTrabajadas,
      trabajosMasRentables,
      turnosPorDia,
      promedioHora,
      datosDistribucionHoras,
      horasPorTrabajo
    ***REMOVED***);
  ***REMOVED***, [turnos, trabajos, calcularPago]);
  
  const renderHorasPorTrabajoChart = () => ***REMOVED***
    if (!resumen.horasPorTrabajo || Object.keys(resumen.horasPorTrabajo).length === 0) ***REMOVED***
      return (
        <div className="p-4 text-center text-gray-500">
          Aún no hay datos suficientes
        </div>
      );
    ***REMOVED***
    
    // Mostrar gráfico de distribución de horas por trabajo
    return (
      <div className="p-4">
        ***REMOVED***resumen.datosDistribucionHoras.map((item, index) => (
          <div key=***REMOVED***index***REMOVED*** className="mb-3 last:mb-0">
            <div className="flex justify-between mb-1">
              <span className="text-sm">***REMOVED***item.nombre***REMOVED***</span>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">***REMOVED***item.horas.toFixed(1)***REMOVED***h</span>
                <span className="text-xs text-gray-500">(***REMOVED***item.porcentaje.toFixed(1)***REMOVED***%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full" 
                style=***REMOVED******REMOVED*** 
                  width: `$***REMOVED***item.porcentaje***REMOVED***%`,
                  backgroundColor: item.color 
                ***REMOVED******REMOVED***
              ></div>
            </div>
          </div>
        ))***REMOVED***
      </div>
    );
  ***REMOVED***;
  
  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center mb-1">
            <DollarSign size=***REMOVED***16***REMOVED*** className="text-indigo-600 mr-1" />
            <h3 className="text-gray-500">Total Ganado</h3>
          </div>
          <p className="text-2xl font-semibold">$***REMOVED***resumen.totalGanado.toFixed(2)***REMOVED***</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center mb-1">
            <Clock size=***REMOVED***16***REMOVED*** className="text-indigo-600 mr-1" />
            <h3 className="text-gray-500">Horas Trabajadas</h3>
          </div>
          <p className="text-2xl font-semibold">***REMOVED***resumen.horasTrabajadas.toFixed(1)***REMOVED***h</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="flex items-center mb-3">
          <TrendingUp size=***REMOVED***18***REMOVED*** className="text-indigo-600 mr-2" />
          <h3 className="text-lg font-semibold">Promedio por Hora</h3>
        </div>
        <p className="text-3xl font-semibold text-center mt-2">$***REMOVED***resumen.promedioHora.toFixed(2)***REMOVED***/h</p>
        <p className="text-center text-gray-500 text-sm mt-1">
          Basado en ***REMOVED***resumen.horasTrabajadas.toFixed(1)***REMOVED*** horas trabajadas
        </p>
      </div>
      
      <h3 className="text-lg font-semibold mb-3">
        <div className="flex items-center">
          <BarChart2 size=***REMOVED***18***REMOVED*** className="text-indigo-600 mr-2" />
          <span>Distribución de Horas por Trabajo</span>
        </div>
      </h3>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        ***REMOVED***renderHorasPorTrabajoChart()***REMOVED***
      </div>
      
      <h3 className="text-lg font-semibold mb-3">Trabajos Más Rentables</h3>
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        ***REMOVED***resumen.trabajosMasRentables.length > 0 ? (
          <div className="divide-y">
            ***REMOVED***resumen.trabajosMasRentables.map(trabajo => (
              <div key=***REMOVED***trabajo.id***REMOVED*** className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style=***REMOVED******REMOVED*** backgroundColor: trabajo.color ***REMOVED******REMOVED*** 
                  />
                  <span>***REMOVED***trabajo.nombre***REMOVED***</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">$***REMOVED***trabajo.ganancia.toFixed(2)***REMOVED***</p>
                  <p className="text-gray-500 text-sm">***REMOVED***trabajo.horas.toFixed(1)***REMOVED***h</p>
                </div>
              </div>
            ))***REMOVED***
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            Aún no hay datos suficientes
          </div>
        )***REMOVED***
      </div>
      
      <h3 className="text-lg font-semibold mb-3">Turnos por Día</h3>
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        ***REMOVED***Object.entries(resumen.turnosPorDia).map(([dia, cantidad]) => (
          <div key=***REMOVED***dia***REMOVED*** className="flex justify-between py-2 border-b last:border-0">
            <span>***REMOVED***dia***REMOVED***</span>
            <span className="font-semibold">***REMOVED***cantidad***REMOVED***</span>
          </div>
        ))***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default Estadisticas;