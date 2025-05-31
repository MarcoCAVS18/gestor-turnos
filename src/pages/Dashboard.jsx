// src/pages/Dashboard.jsx - VERSION COMPLETA

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
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
} from 'lucide-react';

import Loader from '../components/other/Loader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useApp } from '../contexts/AppContext';

const Dashboard = () => {
  const { 
    trabajos, 
    turnos, 
    cargando, 
    calcularPago, 
    coloresTemáticos, 
    emojiUsuario 
  } = useApp();
  
  const [showLoading, setShowLoading] = useState(true);
  const navigate = useNavigate();
  
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

  // Calcular estadísticas completas
  const calcularEstadisticasCompletas = () => {
    if (turnos.length === 0) {
      return {
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
      };
    }

    let totalGanado = 0;
    let horasTrabajadas = 0;
    const gananciaPorTrabajo = {};
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

    turnos.forEach(turno => {
      const trabajo = trabajos.find(t => t.id === turno.trabajoId);
      if (!trabajo) return;

      const { totalConDescuento, horas } = calcularPago(turno);
      totalGanado += totalConDescuento;
      horasTrabajadas += horas;
      fechasUnicas.add(turno.fecha);

      // Estadísticas por trabajo
      if (!gananciaPorTrabajo[trabajo.id]) {
        gananciaPorTrabajo[trabajo.id] = {
          trabajo,
          ganancia: 0,
          horas: 0,
          turnos: 0
        };
      }
      gananciaPorTrabajo[trabajo.id].ganancia += totalConDescuento;
      gananciaPorTrabajo[trabajo.id].horas += horas;
      gananciaPorTrabajo[trabajo.id].turnos += 1;

      // Estadísticas semanales
      const fechaTurno = new Date(turno.fecha + 'T00:00:00');
      if (fechaTurno >= inicioSemana) {
        turnosEstaSemana++;
        gananciasEstaSemana += totalConDescuento;
      } else if (fechaTurno >= inicioSemanaAnterior && fechaTurno < inicioSemana) {
        gananciasSemanaAnterior += totalConDescuento;
      }
    });

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
      .sort((a, b) => {
        if (a.fecha === b.fecha) {
          return a.horaInicio.localeCompare(b.horaInicio);
        }
        return a.fecha.localeCompare(b.fecha);
      });
    
    const proximoTurno = turnosFuturos[0] || null;

    // Top 3 trabajos favoritos
    const trabajosFavoritos = Object.values(gananciaPorTrabajo)
      .sort((a, b) => b.turnos - a.turnos)
      .slice(0, 3);

    // Proyección mensual
    const proyeccionMensual = gananciasEstaSemana * 4.33;

    return {
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
    };
  };

  // Función para formatear fecha
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T00:00:00');
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);
    
    const fechaLocal = fecha.toDateString();
    const hoyLocal = hoy.toDateString();
    const mañanaLocal = mañana.toDateString();
    
    if (fechaLocal === hoyLocal) return 'Hoy';
    if (fechaLocal === mañanaLocal) return 'Mañana';
    
    return fecha.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const stats = calcularEstadisticasCompletas();

  if (showLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6 space-y-6">
      {/* Saludo personalizado */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Buenas! {emojiUsuario}
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
              style={{ color: coloresTemáticos?.base || '#EC4899' }}
            >
              ${stats.totalGanado.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center mb-2">
            <Briefcase size={18} style={{ color: coloresTemáticos?.base }} className="mr-2" />
            <span className="text-sm text-gray-600">Trabajos</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{trabajos.length}</p>
          <p className="text-xs text-gray-500">activos</p>
        </Card>
        
        <Card>
          <div className="flex items-center mb-2">
            <Calendar size={18} style={{ color: coloresTemáticos?.base }} className="mr-2" />
            <span className="text-sm text-gray-600">Turnos</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.turnosTotal}</p>
          <p className="text-xs text-gray-500">completados</p>
        </Card>
        
        <Card>
          <div className="flex items-center mb-2">
            <Clock size={18} style={{ color: coloresTemáticos?.base }} className="mr-2" />
            <span className="text-sm text-gray-600">Horas</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.horasTrabajadas.toFixed(0)}</p>
          <p className="text-xs text-gray-500">trabajadas</p>
        </Card>
        
        <Card>
          <div className="flex items-center mb-2">
            <Target size={18} style={{ color: coloresTemáticos?.base }} className="mr-2" />
            <span className="text-sm text-gray-600">Promedio</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">${stats.promedioPorHora.toFixed(0)}</p>
          <p className="text-xs text-gray-500">por hora</p>
        </Card>
      </div>

      {/* Esta semana - Usando Activity */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Activity size={20} style={{ color: coloresTemáticos?.base }} className="mr-2" />
            Esta semana
          </h3>
          {stats.tendenciaSemanal !== 0 && (
            <div className={`flex items-center text-sm ${
              stats.tendenciaSemanal > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.tendenciaSemanal > 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
              {stats.tendenciaSemanal.toFixed(1)}%
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Turnos completados</p>
            <p className="text-xl font-bold">{stats.turnosEstaSemana}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Ganancias</p>
            <p className="text-xl font-bold" style={{ color: coloresTemáticos?.base }}>
              ${stats.gananciasEstaSemana.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>

      {/* Próximo turno - Usando Star */}
      {stats.proximoTurno && (
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Star size={20} style={{ color: coloresTemáticos?.base }} className="mr-2" />
            Próximo turno
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">
                {trabajos.find(t => t.id === stats.proximoTurno.trabajoId)?.nombre}
              </p>
              <p className="text-sm text-gray-600">
                {formatearFecha(stats.proximoTurno.fecha)} • {stats.proximoTurno.horaInicio}
              </p>
            </div>
            <Button
              onClick={() => navigate('/calendario')}
              size="sm"
              className="flex items-center gap-1"
              icon={ChevronRight}
            >
              Ver
            </Button>
          </div>
        </Card>
      )}

      {/* Trabajo más rentable - Usando Award */}
      {stats.trabajoMasRentable && (
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Award size={20} style={{ color: coloresTemáticos?.base }} className="mr-2" />
            Trabajo más rentable
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: stats.trabajoMasRentable.trabajo.color }}
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {stats.trabajoMasRentable.trabajo.nombre}
                </p>
                <p className="text-sm text-gray-600">
                  {stats.trabajoMasRentable.turnos} turnos • {stats.trabajoMasRentable.horas.toFixed(1)}h
                </p>
              </div>
            </div>
            <p className="text-xl font-bold" style={{ color: coloresTemáticos?.base }}>
              ${stats.trabajoMasRentable.ganancia.toFixed(2)}
            </p>
          </div>
        </Card>
      )}

      {/* Top trabajos favoritos - Usando BarChart3 */}
      {stats.trabajosFavoritos.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <BarChart3 size={20} style={{ color: coloresTemáticos?.base }} className="mr-2" />
              Trabajos favoritos
            </h3>
            <Button
              onClick={() => navigate('/estadisticas')}
              size="sm"
              variant="ghost"
              className="flex items-center gap-1"
              icon={ChevronRight}
            >
              Ver más
            </Button>
          </div>
          
          <div className="space-y-3">
            {stats.trabajosFavoritos.map((trabajoInfo, index) => (
              <div key={trabajoInfo.trabajo.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-400 mr-3">
                    #{index + 1}
                  </span>
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: trabajoInfo.trabajo.color }}
                  />
                  <div>
                    <p className="font-medium text-gray-800">{trabajoInfo.trabajo.nombre}</p>
                    <p className="text-xs text-gray-500">{trabajoInfo.turnos} turnos</p>
                  </div>
                </div>
                <p className="text-sm font-semibold" style={{ color: coloresTemáticos?.base }}>
                  ${trabajoInfo.ganancia.toFixed(0)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Proyección mensual */}
      {stats.proyeccionMensual > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <BarChart3 size={20} style={{ color: coloresTemáticos?.base }} className="mr-2" />
            Proyección mensual
          </h3>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Si mantienes este ritmo durante todo el mes
            </p>
            <p className="text-3xl font-bold" style={{ color: coloresTemáticos?.base }}>
              ${stats.proyeccionMensual.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              ~{(stats.horasTrabajadas * 4.33).toFixed(0)} horas
            </p>
          </div>
        </Card>
      )}

      {/* Acciones rápidas */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Acciones rápidas</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => navigate('/turnos')}
            variant="outline"
            className="flex items-center justify-center gap-2"
            icon={Plus}
          >
            Nuevo turno
          </Button>
          <Button
            onClick={() => navigate('/trabajos')}
            variant="outline"
            className="flex items-center justify-center gap-2"
            icon={Briefcase}
          >
            Nuevo trabajo
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;