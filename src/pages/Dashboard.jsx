// src/pages/Dashboard.jsx

import React, ***REMOVED*** useState, useEffect, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** 
  Calendar, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Briefcase,
  Target,
  Star,
  ChevronRight,
  Plus,
  Award,
  Activity,
  BarChart3
***REMOVED*** from 'lucide-react';

// Nuevas importaciones
import Loader from '../components/other/Loader';
import Button from '../components/ui/Button';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const Dashboard = () => ***REMOVED***
  const ***REMOVED*** 
    trabajos, 
    turnos, 
    cargando, 
    calcularPago, 
    coloresTemáticos,
    emojiUsuario 
  ***REMOVED*** = useApp();
  const [showLoading, setShowLoading] = useState(true);
  const navigate = useNavigate();
  
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

  // Calcular estadísticas avanzadas
  const estadisticas = useMemo(() => ***REMOVED***
    if (turnos.length === 0) ***REMOVED***
      return ***REMOVED***
        totalGanado: 0,
        horasTrabajadas: 0,
        promedioPorHora: 0,
        trabajoMasRentable: null,
        diasTrabajados: 0,
        turnosEstaSemana: 0,
        gananciasEstaSemana: 0,
        tendenciaSemanal: 0,
        proximoTurno: null,
        trabajosFavoritos: []
      ***REMOVED***;
    ***REMOVED***

    let totalGanado = 0;
    let horasTrabajadas = 0;
    const gananciaPorTrabajo = ***REMOVED******REMOVED***;
    const fechasUnicas = new Set();
    
    // Calcular fecha de inicio de esta semana
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1); // Lunes
    inicioSemana.setHours(0, 0, 0, 0);
    
    const inicioSemanaAnterior = new Date(inicioSemana);
    inicioSemanaAnterior.setDate(inicioSemana.getDate() - 7);
    
    let turnosEstaSemana = 0;
    let gananciasEstaSemana = 0;
    let gananciasSemanaAnterior = 0;

    turnos.forEach(turno => ***REMOVED***
      const trabajo = trabajos.find(t => t.id === turno.trabajoId);
      if (!trabajo) return;

      const ***REMOVED*** totalConDescuento, horas ***REMOVED*** = calcularPago(turno);
      totalGanado += totalConDescuento;
      horasTrabajadas += horas;
      fechasUnicas.add(turno.fecha);

      // Estadísticas por trabajo
      if (!gananciaPorTrabajo[trabajo.id]) ***REMOVED***
        gananciaPorTrabajo[trabajo.id] = ***REMOVED***
          trabajo,
          ganancia: 0,
          horas: 0,
          turnos: 0
        ***REMOVED***;
      ***REMOVED***
      gananciaPorTrabajo[trabajo.id].ganancia += totalConDescuento;
      gananciaPorTrabajo[trabajo.id].horas += horas;
      gananciaPorTrabajo[trabajo.id].turnos += 1;

      // Estadísticas semanales
      const fechaTurno = new Date(turno.fecha + 'T00:00:00');
      if (fechaTurno >= inicioSemana) ***REMOVED***
        turnosEstaSemana++;
        gananciasEstaSemana += totalConDescuento;
      ***REMOVED*** else if (fechaTurno >= inicioSemanaAnterior && fechaTurno < inicioSemana) ***REMOVED***
        gananciasSemanaAnterior += totalConDescuento;
      ***REMOVED***
    ***REMOVED***);

    // Encontrar trabajo más rentable
    const trabajoMasRentable = Object.values(gananciaPorTrabajo)
      .sort((a, b) => b.ganancia - a.ganancia)[0] || null;

    // Calcular tendencia semanal
    const tendenciaSemanal = gananciasSemanaAnterior > 0 
      ? ((gananciasEstaSemana - gananciasSemanaAnterior) / gananciasSemanaAnterior) * 100 
      : 0;

    // Encontrar próximo turno
    const hoyStr = hoy.toISOString().split('T')[0];
    const turnosFuturos = turnos.filter(turno => turno.fecha >= hoyStr)
      .sort((a, b) => ***REMOVED***
        if (a.fecha === b.fecha) ***REMOVED***
          return a.horaInicio.localeCompare(b.horaInicio);
        ***REMOVED***
        return a.fecha.localeCompare(b.fecha);
      ***REMOVED***);
    
    const proximoTurno = turnosFuturos[0] || null;

    // Top 3 trabajos favoritos
    const trabajosFavoritos = Object.values(gananciaPorTrabajo)
      .sort((a, b) => b.turnos - a.turnos)
      .slice(0, 3);

    return ***REMOVED***
      totalGanado,
      horasTrabajadas,
      promedioPorHora: horasTrabajadas > 0 ? totalGanado / horasTrabajadas : 0,
      trabajoMasRentable,
      diasTrabajados: fechasUnicas.size,
      turnosEstaSemana,
      gananciasEstaSemana,
      tendenciaSemanal,
      proximoTurno,
      trabajosFavoritos
    ***REMOVED***;
  ***REMOVED***, [turnos, trabajos, calcularPago]);

  // Función para formatear fecha
  const formatearFecha = (fechaStr) => ***REMOVED***
    const fecha = new Date(fechaStr + 'T00:00:00');
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);
    
    const fechaLocal = fecha.toDateString();
    const hoyLocal = hoy.toDateString();
    const mañanaLocal = mañana.toDateString();
    
    if (fechaLocal === hoyLocal) return 'Hoy';
    if (fechaLocal === mañanaLocal) return 'Mañana';
    
    return fecha.toLocaleDateString('es-ES', ***REMOVED*** 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    ***REMOVED***);
  ***REMOVED***;

  if (showLoading) ***REMOVED***
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  ***REMOVED***
  
  return (
    <div className="px-4 py-6 space-y-6">
      ***REMOVED***/* Saludo personalizado */***REMOVED***
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Buenas! ***REMOVED***emojiUsuario***REMOVED***
            </h1>
            <p className="text-gray-600 mt-1">
              Aca tenes un resumen<br />
              de tu actividad
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total ganado</p>
            <p 
              className="text-2xl font-bold"
              style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
            >
              $***REMOVED***estadisticas.totalGanado.toFixed(2)***REMOVED***
            </p>
          </div>
        </div>
      </div>

      ***REMOVED***/* Estadísticas principales */***REMOVED***
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-2">
            <Briefcase size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
            <span className="text-sm text-gray-600">Trabajos</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">***REMOVED***trabajos.length***REMOVED***</p>
          <p className="text-xs text-gray-500">activos</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-2">
            <Calendar size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
            <span className="text-sm text-gray-600">Turnos</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">***REMOVED***turnos.length***REMOVED***</p>
          <p className="text-xs text-gray-500">completados</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-2">
            <Clock size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
            <span className="text-sm text-gray-600">Horas</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">***REMOVED***estadisticas.horasTrabajadas.toFixed(0)***REMOVED***</p>
          <p className="text-xs text-gray-500">trabajadas</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-2">
            <Target size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
            <span className="text-sm text-gray-600">Promedio</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">$***REMOVED***estadisticas.promedioPorHora.toFixed(0)***REMOVED***</p>
          <p className="text-xs text-gray-500">por hora</p>
        </div>
      </div>

      ***REMOVED***/* Esta semana */***REMOVED***
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Activity size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
            Esta semana
          </h3>
          ***REMOVED***estadisticas.tendenciaSemanal !== 0 && (
            <div className=***REMOVED***`flex items-center text-sm $***REMOVED***
              estadisticas.tendenciaSemanal > 0 ? 'text-green-600' : 'text-red-600'
            ***REMOVED***`***REMOVED***>
              ***REMOVED***estadisticas.tendenciaSemanal > 0 ? 
                <TrendingUp size=***REMOVED***16***REMOVED*** className="mr-1" /> : 
                <TrendingDown size=***REMOVED***16***REMOVED*** className="mr-1" />
              ***REMOVED***
              ***REMOVED***estadisticas.tendenciaSemanal.toFixed(1)***REMOVED***%
            </div>
          )***REMOVED***
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Turnos completados</p>
            <p className="text-xl font-bold">***REMOVED***estadisticas.turnosEstaSemana***REMOVED***</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Ganancias</p>
            <p className="text-xl font-bold" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED***>
              $***REMOVED***estadisticas.gananciasEstaSemana.toFixed(2)***REMOVED***
            </p>
          </div>
        </div>
      </div>

      ***REMOVED***/* Próximo turno */***REMOVED***
      ***REMOVED***estadisticas.proximoTurno && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Star size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
            Próximo turno
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">
                ***REMOVED***trabajos.find(t => t.id === estadisticas.proximoTurno.trabajoId)?.nombre***REMOVED***
              </p>
              <p className="text-sm text-gray-600">
                ***REMOVED***formatearFecha(estadisticas.proximoTurno.fecha)***REMOVED*** • ***REMOVED***estadisticas.proximoTurno.horaInicio***REMOVED***
              </p>
            </div>
            <Button
              onClick=***REMOVED***() => navigate('/calendario')***REMOVED***
              size="sm"
              className="flex items-center gap-1"
              icon=***REMOVED***ChevronRight***REMOVED***
            >
              Ver
            </Button>
          </div>
        </div>
      )***REMOVED***

      ***REMOVED***/* Trabajo más rentable */***REMOVED***
      ***REMOVED***estadisticas.trabajoMasRentable && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Award size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
            Trabajo más rentable
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-3"
                style=***REMOVED******REMOVED*** backgroundColor: estadisticas.trabajoMasRentable.trabajo.color ***REMOVED******REMOVED***
              />
              <div>
                <p className="font-semibold text-gray-800">
                  ***REMOVED***estadisticas.trabajoMasRentable.trabajo.nombre***REMOVED***
                </p>
                <p className="text-sm text-gray-600">
                  ***REMOVED***estadisticas.trabajoMasRentable.turnos***REMOVED*** turnos • ***REMOVED***estadisticas.trabajoMasRentable.horas.toFixed(1)***REMOVED***h
                </p>
              </div>
            </div>
            <p className="text-xl font-bold" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED***>
              $***REMOVED***estadisticas.trabajoMasRentable.ganancia.toFixed(2)***REMOVED***
            </p>
          </div>
        </div>
      )***REMOVED***

      ***REMOVED***/* Top trabajos favoritos */***REMOVED***
      ***REMOVED***estadisticas.trabajosFavoritos.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <BarChart3 size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
              Trabajos favoritos
            </h3>
            <Button
              onClick=***REMOVED***() => navigate('/estadisticas')***REMOVED***
              size="sm"
              variant="ghost"
              className="flex items-center gap-1"
              icon=***REMOVED***ChevronRight***REMOVED***
            >
              Ver más
            </Button>
          </div>
          
          <div className="space-y-3">
            ***REMOVED***estadisticas.trabajosFavoritos.map((trabajoInfo, index) => (
              <div key=***REMOVED***trabajoInfo.trabajo.id***REMOVED*** className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-400 mr-3">
                    #***REMOVED***index + 1***REMOVED***
                  </span>
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style=***REMOVED******REMOVED*** backgroundColor: trabajoInfo.trabajo.color ***REMOVED******REMOVED***
                  />
                  <div>
                    <p className="font-medium text-gray-800">***REMOVED***trabajoInfo.trabajo.nombre***REMOVED***</p>
                    <p className="text-xs text-gray-500">***REMOVED***trabajoInfo.turnos***REMOVED*** turnos</p>
                  </div>
                </div>
                <p className="text-sm font-semibold" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED***>
                  $***REMOVED***trabajoInfo.ganancia.toFixed(0)***REMOVED***
                </p>
              </div>
            ))***REMOVED***
          </div>
        </div>
      )***REMOVED***

      ***REMOVED***/* Acciones rápidas */***REMOVED***
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Acciones rápidas</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick=***REMOVED***() => navigate('/turnos')***REMOVED***
            variant="outline"
            className="flex items-center justify-center gap-2"
            icon=***REMOVED***Plus***REMOVED***
          >
            Nuevo turno
          </Button>
          <Button
            onClick=***REMOVED***() => navigate('/trabajos')***REMOVED***
            variant="outline"
            className="flex items-center justify-center gap-2"
            icon=***REMOVED***Briefcase***REMOVED***
          >
            Nuevo trabajo
          </Button>
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default Dashboard;