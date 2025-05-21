// src/pages/Estadisticas.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** BarChart2, TrendingUp, DollarSign, Clock, Calendar ***REMOVED*** from 'lucide-react';

const Estadisticas = () => ***REMOVED***
  const ***REMOVED*** turnos, trabajos, calcularPago ***REMOVED*** = useApp();
  const [resumen, setResumen] = useState(***REMOVED***
    totalGanado: 0,
    horasTrabajadas: 0,
    trabajosMasRentables: [],
    turnosPorDia: ***REMOVED******REMOVED***,
    promedioHora: 0
  ***REMOVED***);
  const [resumenSemana, setResumenSemana] = useState(***REMOVED***
    total: 0,
    turnos: [],
    porDia: ***REMOVED******REMOVED***,
    semanaActual: true
  ***REMOVED***);
  
  // Obtener fechas de inicio y fin de la semana actual (lunes a domingo)
  const obtenerFechasSemana = () => ***REMOVED***
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0: domingo, 1-6: lunes a sábado
    
    // Ajuste para que la semana comience el lunes
    const diffInicio = diaSemana === 0 ? 6 : diaSemana - 1;
    
    // Fecha de inicio (lunes de la semana actual)
    const fechaInicio = new Date(hoy);
    fechaInicio.setDate(hoy.getDate() - diffInicio);
    fechaInicio.setHours(0, 0, 0, 0);
    
    // Fecha de fin (domingo de la semana actual)
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaInicio.getDate() + 6);
    fechaFin.setHours(23, 59, 59, 999);
    
    return ***REMOVED*** fechaInicio, fechaFin ***REMOVED***;
  ***REMOVED***;
  
  // Formatear fecha para mostrar
  const formatearFecha = (fecha) => ***REMOVED***
    return fecha.toLocaleDateString('es-ES', ***REMOVED*** 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    ***REMOVED***);
  ***REMOVED***;
  
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
      
      // Contar turnos por día
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
    
    // Calcular estadísticas de la semana actual
    const ***REMOVED*** fechaInicio, fechaFin ***REMOVED*** = obtenerFechasSemana();
    const fechaInicioISO = fechaInicio.toISOString().split('T')[0];
    const fechaFinISO = fechaFin.toISOString().split('T')[0];
    
    // Filtrar turnos de la semana actual
    const turnosSemana = turnos.filter(turno => ***REMOVED***
      return turno.fecha >= fechaInicioISO && turno.fecha <= fechaFinISO;
    ***REMOVED***);
    
    // Inicializar objeto para acumular ganancias por día
    const gananciaPorDia = ***REMOVED***
      "Lunes": 0,
      "Martes": 0,
      "Miércoles": 0,
      "Jueves": 0,
      "Viernes": 0,
      "Sábado": 0,
      "Domingo": 0
    ***REMOVED***;
    
    // Calcular ganancias por día
    let totalSemana = 0;
    
    turnosSemana.forEach(turno => ***REMOVED***
      const trabajo = trabajos.find(t => t.id === turno.trabajoId);
      if (!trabajo) return;
      
      const ***REMOVED*** totalConDescuento ***REMOVED*** = calcularPago(turno);
      totalSemana += totalConDescuento;
      
      // Sumar al día correspondiente
      const fecha = new Date(turno.fecha);
      const diaSemana = fecha.getDay(); // 0: domingo, 1-6: lunes a sábado
      const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const nombreDia = nombresDias[diaSemana];
      
      gananciaPorDia[nombreDia] += totalConDescuento;
    ***REMOVED***);
    
    setResumenSemana(***REMOVED***
      total: totalSemana,
      turnos: turnosSemana,
      porDia: gananciaPorDia,
      fechaInicio: formatearFecha(fechaInicio),
      fechaFin: formatearFecha(fechaFin)
    ***REMOVED***);
    
  ***REMOVED***, [turnos, trabajos, calcularPago]);
  
  // Función para renderizar el gráfico de distribución de horas
  const renderHorasPorTrabajoChart = () => ***REMOVED***
    // Si no hay datos suficientes, mostrar mensaje
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
      
      ***REMOVED***/* Nueva sección: Resumen de la semana actual */***REMOVED***
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="flex items-center mb-3">
          <Calendar size=***REMOVED***18***REMOVED*** className="text-pink-600 mr-2" />
          <h3 className="text-lg font-semibold">Semana Actual</h3>
        </div>
        
        <div className="text-sm text-gray-500 mb-3">
          ***REMOVED***resumenSemana.fechaInicio***REMOVED*** - ***REMOVED***resumenSemana.fechaFin***REMOVED***
        </div>
        
        <div className="text-3xl font-bold text-center mt-2 mb-4 text-pink-600">
          $***REMOVED***resumenSemana.total.toFixed(2)***REMOVED***
        </div>
        
        ***REMOVED***/* Gráfico de barras para ganancias por día de la semana */***REMOVED***
        <div className="mt-4">
          ***REMOVED***Object.entries(resumenSemana.porDia).map(([dia, ganancia]) => (
            <div key=***REMOVED***dia***REMOVED*** className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className=***REMOVED***`text-sm $***REMOVED***dia === 'Sábado' || dia === 'Domingo' ? 'font-semibold' : ''***REMOVED***`***REMOVED***>
                  ***REMOVED***dia***REMOVED***
                </span>
                <span className=***REMOVED***`text-sm font-medium $***REMOVED***ganancia > 0 ? 'text-pink-600' : 'text-gray-400'***REMOVED***`***REMOVED***>
                  $***REMOVED***ganancia.toFixed(2)***REMOVED***
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                ***REMOVED***ganancia > 0 && (
                  <div 
                    className=***REMOVED***`h-2 rounded-full $***REMOVED***dia === 'Sábado' || dia === 'Domingo' ? 'bg-pink-500' : 'bg-pink-400'***REMOVED***`***REMOVED*** 
                    style=***REMOVED******REMOVED*** width: `$***REMOVED***(ganancia / resumenSemana.total) * 100***REMOVED***%` ***REMOVED******REMOVED***
                  ></div>
                )***REMOVED***
              </div>
            </div>
          ))***REMOVED***
        </div>
        
        ***REMOVED***resumenSemana.turnos.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No hay turnos registrados esta semana
          </div>
        )***REMOVED***
      </div>
      
      ***REMOVED***/* Resumen General */***REMOVED***
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center mb-1">
            <DollarSign size=***REMOVED***16***REMOVED*** className="text-pink-600 mr-1" />
            <h3 className="text-gray-500">Total Ganado</h3>
          </div>
          <p className="text-2xl font-semibold">$***REMOVED***resumen.totalGanado.toFixed(2)***REMOVED***</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center mb-1">
            <Clock size=***REMOVED***16***REMOVED*** className="text-pink-600 mr-1" />
            <h3 className="text-gray-500">Horas Trabajadas</h3>
          </div>
          <p className="text-2xl font-semibold">***REMOVED***resumen.horasTrabajadas.toFixed(1)***REMOVED***h</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="flex items-center mb-3">
          <TrendingUp size=***REMOVED***18***REMOVED*** className="text-pink-600 mr-2" />
          <h3 className="text-lg font-semibold">Promedio por Hora</h3>
        </div>
        <p className="text-3xl font-semibold text-center mt-2">$***REMOVED***resumen.promedioHora.toFixed(2)***REMOVED***/h</p>
        <p className="text-center text-gray-500 text-sm mt-1">
          Basado en ***REMOVED***resumen.horasTrabajadas.toFixed(1)***REMOVED*** horas trabajadas
        </p>
      </div>
      
      <h3 className="text-lg font-semibold mb-3">
        <div className="flex items-center">
          <BarChart2 size=***REMOVED***18***REMOVED*** className="text-pink-600 mr-2" />
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