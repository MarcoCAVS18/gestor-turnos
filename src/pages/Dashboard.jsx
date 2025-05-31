// src/pages/Dashboard.jsx - VERSION COMPLETA

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** 
  Calendar, 
  Clock, 
  Briefcase,
  Target,
  Star,
  ChevronRight,
  Plus,
  Award,
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown
***REMOVED*** from 'lucide-react';

import Loader from '../components/other/Loader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
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

  // Calcular estadísticas completas
  const calcularEstadisticasCompletas = () => ***REMOVED***
    if (turnos.length === 0) ***REMOVED***
      return ***REMOVED***
        totalGanado: 0,
        horasTrabajadas: 0,
        promedioPorHora: 0,
        turnosTotal: 0,
        trabajoMasRentable: null,
        proximoTurno: null,
        turnosEstaSemana: 0,
        gananciasEstaSemana: 0,
        tendenciaSemanal: 0,
        trabajosFavoritos: [],
        proyeccionMensual: 0,
        diasTrabajados: 0
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

    // Proyección mensual
    const proyeccionMensual = gananciasEstaSemana * 4.33;

    return ***REMOVED***
      totalGanado,
      horasTrabajadas,
      promedioPorHora: horasTrabajadas > 0 ? totalGanado / horasTrabajadas : 0,
      turnosTotal: turnos.length,
      trabajoMasRentable,
      proximoTurno,
      turnosEstaSemana,
      gananciasEstaSemana,
      tendenciaSemanal,
      trabajosFavoritos,
      proyeccionMensual,
      diasTrabajados: fechasUnicas.size
    ***REMOVED***;
  ***REMOVED***;

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

  const stats = calcularEstadisticasCompletas();

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
      <Card>
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
              $***REMOVED***stats.totalGanado.toFixed(2)***REMOVED***
            </p>
          </div>
        </div>
      </Card>

      ***REMOVED***/* Estadísticas principales */***REMOVED***
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center mb-2">
            <Briefcase size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
            <span className="text-sm text-gray-600">Trabajos</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">***REMOVED***trabajos.length***REMOVED***</p>
          <p className="text-xs text-gray-500">activos</p>
        </Card>
        
        <Card>
          <div className="flex items-center mb-2">
            <Calendar size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
            <span className="text-sm text-gray-600">Turnos</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">***REMOVED***stats.turnosTotal***REMOVED***</p>
          <p className="text-xs text-gray-500">completados</p>
        </Card>
        
        <Card>
          <div className="flex items-center mb-2">
            <Clock size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
            <span className="text-sm text-gray-600">Horas</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">***REMOVED***stats.horasTrabajadas.toFixed(0)***REMOVED***</p>
          <p className="text-xs text-gray-500">trabajadas</p>
        </Card>
        
        <Card>
          <div className="flex items-center mb-2">
            <Target size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
            <span className="text-sm text-gray-600">Promedio</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">$***REMOVED***stats.promedioPorHora.toFixed(0)***REMOVED***</p>
          <p className="text-xs text-gray-500">por hora</p>
        </Card>
      </div>

      ***REMOVED***/* Esta semana - Usando Activity */***REMOVED***
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Activity size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
            Esta semana
          </h3>
          ***REMOVED***stats.tendenciaSemanal !== 0 && (
            <div className=***REMOVED***`flex items-center text-sm $***REMOVED***
              stats.tendenciaSemanal > 0 ? 'text-green-600' : 'text-red-600'
            ***REMOVED***`***REMOVED***>
              ***REMOVED***stats.tendenciaSemanal > 0 ? <TrendingUp size=***REMOVED***16***REMOVED*** className="mr-1" /> : <TrendingDown size=***REMOVED***16***REMOVED*** className="mr-1" />***REMOVED***
              ***REMOVED***stats.tendenciaSemanal.toFixed(1)***REMOVED***%
            </div>
          )***REMOVED***
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Turnos completados</p>
            <p className="text-xl font-bold">***REMOVED***stats.turnosEstaSemana***REMOVED***</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Ganancias</p>
            <p className="text-xl font-bold" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED***>
              $***REMOVED***stats.gananciasEstaSemana.toFixed(2)***REMOVED***
            </p>
          </div>
        </div>
      </Card>

      ***REMOVED***/* Próximo turno - Usando Star */***REMOVED***
      ***REMOVED***stats.proximoTurno && (
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Star size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
            Próximo turno
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">
                ***REMOVED***trabajos.find(t => t.id === stats.proximoTurno.trabajoId)?.nombre***REMOVED***
              </p>
              <p className="text-sm text-gray-600">
                ***REMOVED***formatearFecha(stats.proximoTurno.fecha)***REMOVED*** • ***REMOVED***stats.proximoTurno.horaInicio***REMOVED***
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
        </Card>
      )***REMOVED***

      ***REMOVED***/* Trabajo más rentable - Usando Award */***REMOVED***
      ***REMOVED***stats.trabajoMasRentable && (
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Award size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
            Trabajo más rentable
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-3"
                style=***REMOVED******REMOVED*** backgroundColor: stats.trabajoMasRentable.trabajo.color ***REMOVED******REMOVED***
              />
              <div>
                <p className="font-semibold text-gray-800">
                  ***REMOVED***stats.trabajoMasRentable.trabajo.nombre***REMOVED***
                </p>
                <p className="text-sm text-gray-600">
                  ***REMOVED***stats.trabajoMasRentable.turnos***REMOVED*** turnos • ***REMOVED***stats.trabajoMasRentable.horas.toFixed(1)***REMOVED***h
                </p>
              </div>
            </div>
            <p className="text-xl font-bold" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED***>
              $***REMOVED***stats.trabajoMasRentable.ganancia.toFixed(2)***REMOVED***
            </p>
          </div>
        </Card>
      )***REMOVED***

      ***REMOVED***/* Top trabajos favoritos - Usando BarChart3 */***REMOVED***
      ***REMOVED***stats.trabajosFavoritos.length > 0 && (
        <Card>
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
            ***REMOVED***stats.trabajosFavoritos.map((trabajoInfo, index) => (
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
        </Card>
      )***REMOVED***

      ***REMOVED***/* Proyección mensual */***REMOVED***
      ***REMOVED***stats.proyeccionMensual > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <BarChart3 size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** className="mr-2" />
            Proyección mensual
          </h3>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Si mantienes este ritmo durante todo el mes
            </p>
            <p className="text-3xl font-bold" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED***>
              $***REMOVED***stats.proyeccionMensual.toFixed(2)***REMOVED***
            </p>
            <p className="text-sm text-gray-500">
              ~***REMOVED***(stats.horasTrabajadas * 4.33).toFixed(0)***REMOVED*** horas
            </p>
          </div>
        </Card>
      )***REMOVED***

      ***REMOVED***/* Acciones rápidas */***REMOVED***
      <Card>
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
      </Card>
    </div>
  );
***REMOVED***;

export default Dashboard;