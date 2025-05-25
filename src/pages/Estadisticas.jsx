// src/pages/Estadisticas.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  BarChart2, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Clock, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Target,
  Award,
  Activity,
  Zap
} from 'lucide-react';

const Estadisticas = () => {
  const { turnos, trabajos, calcularPago, coloresTemáticos } = useApp();
  const [semanaActual, setSemanaActual] = useState(0);
  const [animacionActiva, setAnimacionActiva] = useState(false);
  
  // Función para obtener fechas de una semana específica
  const obtenerFechasSemana = useCallback((offsetSemanas = 0) => {
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    
    // Ajuste para que la semana comience el lunes
    const diffInicio = diaSemana === 0 ? 6 : diaSemana - 1;
    
    // Fecha de inicio (lunes de la semana específica)
    const fechaInicio = new Date(hoy);
    fechaInicio.setDate(hoy.getDate() - diffInicio + (offsetSemanas * 7));
    fechaInicio.setHours(0, 0, 0, 0);
    
    // Fecha de fin (domingo de la semana específica)
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaInicio.getDate() + 6);
    fechaFin.setHours(23, 59, 59, 999);
    
    return { fechaInicio, fechaFin };
  }, []);

  // Función para obtener datos de una semana específica
  const obtenerDatosSemana = useCallback((offsetSemanas = 0) => {
    const { fechaInicio, fechaFin } = obtenerFechasSemana(offsetSemanas);
    const fechaInicioISO = fechaInicio.toISOString().split('T')[0];
    const fechaFinISO = fechaFin.toISOString().split('T')[0];
    
    // Filtrar turnos de la semana específica
    const turnosSemana = turnos.filter(turno => {
      return turno.fecha >= fechaInicioISO && turno.fecha <= fechaFinISO;
    });
    
    // Calcular estadísticas
    let totalGanado = 0;
    let horasTrabajadas = 0;
    const gananciaPorDia = {
      "Lunes": { ganancia: 0, horas: 0, turnos: 0 },
      "Martes": { ganancia: 0, horas: 0, turnos: 0 },
      "Miércoles": { ganancia: 0, horas: 0, turnos: 0 },
      "Jueves": { ganancia: 0, horas: 0, turnos: 0 },
      "Viernes": { ganancia: 0, horas: 0, turnos: 0 },
      "Sábado": { ganancia: 0, horas: 0, turnos: 0 },
      "Domingo": { ganancia: 0, horas: 0, turnos: 0 }
    };
    
    const gananciaPorTrabajo = {};
    const tiposDeTurno = {};
    
    turnosSemana.forEach(turno => {
      const trabajo = trabajos.find(t => t.id === turno.trabajoId);
      if (!trabajo) return;
      
      const { totalConDescuento, horas } = calcularPago(turno);
      totalGanado += totalConDescuento;
      horasTrabajadas += horas;
      
      // Estadísticas por día
      const fecha = new Date(turno.fecha);
      const diaSemana = fecha.getDay();
      const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const nombreDia = nombresDias[diaSemana];
      
      gananciaPorDia[nombreDia].ganancia += totalConDescuento;
      gananciaPorDia[nombreDia].horas += horas;
      gananciaPorDia[nombreDia].turnos += 1;
      
      // Estadísticas por trabajo
      if (!gananciaPorTrabajo[trabajo.id]) {
        gananciaPorTrabajo[trabajo.id] = {
          nombre: trabajo.nombre,
          color: trabajo.color,
          ganancia: 0,
          horas: 0,
          turnos: 0
        };
      }
      gananciaPorTrabajo[trabajo.id].ganancia += totalConDescuento;
      gananciaPorTrabajo[trabajo.id].horas += horas;
      gananciaPorTrabajo[trabajo.id].turnos += 1;
      
      // Estadísticas por tipo de turno
      if (!tiposDeTurno[turno.tipo]) {
        tiposDeTurno[turno.tipo] = { turnos: 0, horas: 0, ganancia: 0 };
      }
      tiposDeTurno[turno.tipo].turnos += 1;
      tiposDeTurno[turno.tipo].horas += horas;
      tiposDeTurno[turno.tipo].ganancia += totalConDescuento;
    });
    
    // Calcular métricas adicionales
    const diasTrabajados = Object.values(gananciaPorDia).filter(dia => dia.turnos > 0).length;
    const promedioHorasPorDia = diasTrabajados > 0 ? horasTrabajadas / diasTrabajados : 0;
    const promedioPorHora = horasTrabajadas > 0 ? totalGanado / horasTrabajadas : 0;
    
    // Encontrar el día más productivo
    const diaMasProductivo = Object.entries(gananciaPorDia).reduce((max, [dia, datos]) => {
      return datos.ganancia > max.ganancia ? { dia, ...datos } : max;
    }, { dia: 'Ninguno', ganancia: 0, horas: 0, turnos: 0 });
    
    return {
      fechaInicio,
      fechaFin,
      totalGanado,
      horasTrabajadas,
      totalTurnos: turnosSemana.length,
      gananciaPorDia,
      gananciaPorTrabajo: Object.values(gananciaPorTrabajo).sort((a, b) => b.ganancia - a.ganancia),
      tiposDeTurno,
      diasTrabajados,
      promedioHorasPorDia,
      promedioPorHora,
      diaMasProductivo
    };
  }, [turnos, trabajos, calcularPago, obtenerFechasSemana]);

  // Efecto para activar animaciones cuando cambia la semana
  useEffect(() => {
    setAnimacionActiva(true);
    const timer = setTimeout(() => setAnimacionActiva(false), 1000);
    return () => clearTimeout(timer);
  }, [semanaActual]);

  // Obtener datos de la semana actual y anterior para comparación
  const datosSemanaActual = useMemo(() => obtenerDatosSemana(semanaActual), [obtenerDatosSemana, semanaActual]);
  const datosSemanaAnterior = useMemo(() => obtenerDatosSemana(semanaActual - 1), [obtenerDatosSemana, semanaActual]);

  // Calcular comparaciones
  const comparaciones = useMemo(() => {
    const cambioGanancias = datosSemanaAnterior.totalGanado > 0 
      ? ((datosSemanaActual.totalGanado - datosSemanaAnterior.totalGanado) / datosSemanaAnterior.totalGanado) * 100
      : 0;
    
    const cambioHoras = datosSemanaAnterior.horasTrabajadas > 0
      ? ((datosSemanaActual.horasTrabajadas - datosSemanaAnterior.horasTrabajadas) / datosSemanaAnterior.horasTrabajadas) * 100
      : 0;
    
    const cambioTurnos = datosSemanaAnterior.totalTurnos > 0
      ? ((datosSemanaActual.totalTurnos - datosSemanaAnterior.totalTurnos) / datosSemanaAnterior.totalTurnos) * 100
      : 0;

    const cambioPromedio = datosSemanaAnterior.promedioPorHora > 0
      ? ((datosSemanaActual.promedioPorHora - datosSemanaAnterior.promedioPorHora) / datosSemanaAnterior.promedioPorHora) * 100
      : 0;

    return {
      ganancias: cambioGanancias,
      horas: cambioHoras,
      turnos: cambioTurnos,
      promedio: cambioPromedio
    };
  }, [datosSemanaActual, datosSemanaAnterior]);

  // Formatear fecha para mostrar
  const formatearFecha = (fecha) => {
    return fecha.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long' 
    });
  };

  // Obtener título de la semana
  const obtenerTituloSemana = () => {
    if (semanaActual === 0) return 'Esta semana';
    if (semanaActual === -1) return 'Semana pasada';
    if (semanaActual === 1) return 'Próxima semana';
    if (semanaActual > 1) return `En ${semanaActual} semanas`;
    return `Hace ${Math.abs(semanaActual)} semanas`;
  };

  // Componente para mostrar cambio porcentual
  const CambioPorcentual = ({ valor, mostrarPositivo = true }) => {
    const esPositivo = valor > 0;
    const esNegativo = valor < 0;
    
    if (valor === 0) return <span className="text-gray-500">Sin cambios</span>;
    
    return (
      <span className={`flex items-center text-sm ${
        esPositivo ? 'text-green-600' : esNegativo ? 'text-red-600' : 'text-gray-500'
      }`}>
        {esPositivo ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
        {esPositivo && mostrarPositivo ? '+' : ''}{valor.toFixed(1)}%
      </span>
    );
  };

  // Componente para barra de progreso animada
  const BarraProgreso = ({ valor, maximo, color, label, sublabel }) => {
    const porcentaje = maximo > 0 ? (valor / maximo) * 100 : 0;
    
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <div className="text-right">
            <span className="text-sm font-bold" style={{ color }}>
              ${valor.toFixed(2)}
            </span>
            {sublabel && (
              <p className="text-xs text-gray-500">{sublabel}</p>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ease-out ${animacionActiva ? 'animate-pulse' : ''}`}
            style={{ 
              width: `${Math.min(porcentaje, 100)}%`,
              backgroundColor: color 
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header con navegación de semanas */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSemanaActual(semanaActual - 1)}
            className="p-2 rounded-full transition-colors"
            style={{ 
              backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)',
              color: coloresTemáticos?.base || '#EC4899'
            }}
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold">{obtenerTituloSemana()}</h2>
            <p className="text-sm text-gray-600">
              {formatearFecha(datosSemanaActual.fechaInicio)} - {formatearFecha(datosSemanaActual.fechaFin)}
            </p>
          </div>
          
          <button
            onClick={() => setSemanaActual(semanaActual + 1)}
            className="p-2 rounded-full transition-colors"
            style={{ 
              backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)',
              color: coloresTemáticos?.base || '#EC4899'
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Estadísticas principales con comparación */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <DollarSign size={18} style={{ color: coloresTemáticos?.base || '#EC4899' }} className="mr-1" />
              <span className="text-sm text-gray-600">Total ganado</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: coloresTemáticos?.base || '#EC4899' }}>
              ${datosSemanaActual.totalGanado.toFixed(2)}
            </p>
            <CambioPorcentual valor={comparaciones.ganancias} />
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Clock size={18} style={{ color: coloresTemáticos?.base || '#EC4899' }} className="mr-1" />
              <span className="text-sm text-gray-600">Horas trabajadas</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: coloresTemáticos?.base || '#EC4899' }}>
              {datosSemanaActual.horasTrabajadas.toFixed(1)}h
            </p>
            <CambioPorcentual valor={comparaciones.horas} />
          </div>
        </div>
      </div>

      {/* Métricas avanzadas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-3">
            <Target size={18} style={{ color: coloresTemáticos?.base || '#EC4899' }} className="mr-2" />
            <h3 className="font-semibold">Eficiencia</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600">Promedio por hora</p>
              <p className="text-lg font-bold" style={{ color: coloresTemáticos?.base || '#EC4899' }}>
                ${datosSemanaActual.promedioPorHora.toFixed(2)}/h
              </p>
              <CambioPorcentual valor={comparaciones.promedio} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-3">
            <Activity size={18} style={{ color: coloresTemáticos?.base || '#EC4899' }} className="mr-2" />
            <h3 className="font-semibold">Actividad</h3>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-600">Días trabajados</p>
              <p className="text-lg font-bold" style={{ color: coloresTemáticos?.base || '#EC4899' }}>
                {datosSemanaActual.diasTrabajados}/7
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Promedio horas/día</p>
              <p className="text-sm font-medium">
                {datosSemanaActual.promedioHorasPorDia.toFixed(1)}h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Día más productivo */}
      {datosSemanaActual.diaMasProductivo.ganancia > 0 && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-3">
            <Award size={18} style={{ color: coloresTemáticos?.base || '#EC4899' }} className="mr-2" />
            <h3 className="font-semibold">Día más productivo</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">{datosSemanaActual.diaMasProductivo.dia}</p>
              <p className="text-sm text-gray-600">
                {datosSemanaActual.diaMasProductivo.turnos} turnos · {datosSemanaActual.diaMasProductivo.horas.toFixed(1)}h
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold" style={{ color: coloresTemáticos?.base || '#EC4899' }}>
                ${datosSemanaActual.diaMasProductivo.ganancia.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Distribución por día mejorada */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center mb-4">
          <Calendar size={18} style={{ color: coloresTemáticos?.base || '#EC4899' }} className="mr-2" />
          <h3 className="font-semibold">Distribución semanal</h3>
        </div>
        
        <div className="space-y-3">
          {Object.entries(datosSemanaActual.gananciaPorDia).map(([dia, datos]) => (
            <BarraProgreso
              key={dia}
              valor={datos.ganancia}
              maximo={datosSemanaActual.totalGanado}
              color={dia === 'Sábado' || dia === 'Domingo' 
                ? coloresTemáticos?.dark || '#BE185D'
                : coloresTemáticos?.base || '#EC4899'
              }
              label={dia}
              sublabel={datos.turnos > 0 ? `${datos.turnos} turnos · ${datos.horas.toFixed(1)}h` : 'Sin actividad'}
            />
          ))}
        </div>
      </div>

      {/* Estadísticas por trabajo */}
      {datosSemanaActual.gananciaPorTrabajo.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-4">
            <BarChart2 size={18} style={{ color: coloresTemáticos?.base || '#EC4899' }} className="mr-2" />
            <h3 className="font-semibold">Por trabajo</h3>
          </div>
          
          <div className="space-y-3">
            {datosSemanaActual.gananciaPorTrabajo.map((trabajo, index) => (
              <BarraProgreso
                key={index}
                valor={trabajo.ganancia}
                maximo={datosSemanaActual.totalGanado}
                color={trabajo.color}
                label={trabajo.nombre}
                sublabel={`${trabajo.turnos} turnos · ${trabajo.horas.toFixed(1)}h`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Distribución por tipo de turno */}
      {Object.keys(datosSemanaActual.tiposDeTurno).length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-4">
            <Zap size={18} style={{ color: coloresTemáticos?.base || '#EC4899' }} className="mr-2" />
            <h3 className="font-semibold">Tipos de turno</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(datosSemanaActual.tiposDeTurno).map(([tipo, datos]) => {
              const colores = {
                'diurno': '#10B981',
                'tarde': '#F59E0B',
                'noche': '#6366F1',
                'sabado': '#8B5CF6',
                'domingo': '#EF4444'
              };
              
              return (
                <div key={tipo} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div 
                    className="w-3 h-3 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: colores[tipo] || '#6B7280' }}
                  />
                  <p className="text-xs text-gray-600 capitalize">{tipo}</p>
                  <p className="font-semibold">{datos.turnos} turnos</p>
                  <p className="text-xs text-gray-500">{datos.horas.toFixed(1)}h</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Proyección mensual - Solo mostrar para semana actual */}
      {datosSemanaActual.totalGanado > 0 && semanaActual === 0 && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-3">
            <TrendingUp size={18} style={{ color: coloresTemáticos?.base || '#EC4899' }} className="mr-2" />
            <h3 className="font-semibold">Proyección mensual</h3>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Si mantienes este ritmo durante todo el mes
            </p>
            <p className="text-3xl font-bold" style={{ color: coloresTemáticos?.base || '#EC4899' }}>
              ${(datosSemanaActual.totalGanado * 4.33).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              ~{(datosSemanaActual.horasTrabajadas * 4.33).toFixed(0)} horas
            </p>
          </div>
        </div>
      )}

      {/* Mensaje informativo para semanas futuras sin datos */}
      {semanaActual > 0 && datosSemanaActual.totalTurnos === 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Sin turnos programados</h3>
          <p className="text-gray-500">
            {semanaActual === 1 ? 'Aún no tienes turnos para la próxima semana' : `No hay turnos programados para esta semana`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Estadisticas;