// src/pages/Estadisticas.jsx

import React, ***REMOVED*** useState, useEffect, useMemo, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED***
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
***REMOVED*** from 'lucide-react';

const Estadisticas = () => ***REMOVED***
  const ***REMOVED*** turnos, trabajos, calcularPago, coloresTemáticos ***REMOVED*** = useApp();
  const [semanaActual, setSemanaActual] = useState(0);
  const [animacionActiva, setAnimacionActiva] = useState(false);

  // Función para obtener fechas de una semana específica
  const obtenerFechasSemana = useCallback((offsetSemanas = 0) => ***REMOVED***
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

    return ***REMOVED*** fechaInicio, fechaFin ***REMOVED***;
  ***REMOVED***, []);

  // Función para obtener datos de una semana específica
  const obtenerDatosSemana = useCallback((offsetSemanas = 0) => ***REMOVED***
    const ***REMOVED*** fechaInicio, fechaFin ***REMOVED*** = obtenerFechasSemana(offsetSemanas);
    const fechaInicioISO = fechaInicio.toISOString().split('T')[0];
    const fechaFinISO = fechaFin.toISOString().split('T')[0];

    // Filtrar turnos de la semana específica
    const turnosSemana = turnos.filter(turno => ***REMOVED***
      return turno.fecha >= fechaInicioISO && turno.fecha <= fechaFinISO;
    ***REMOVED***);

    // Calcular estadísticas
    let totalGanado = 0;
    let horasTrabajadas = 0;
    const gananciaPorDia = ***REMOVED***
      "Lunes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
      "Martes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
      "Miércoles": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
      "Jueves": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
      "Viernes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
      "Sábado": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
      "Domingo": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***
    ***REMOVED***;

    const gananciaPorTrabajo = ***REMOVED******REMOVED***;
    const tiposDeTurno = ***REMOVED******REMOVED***;

    turnosSemana.forEach(turno => ***REMOVED***
      const trabajo = trabajos.find(t => t.id === turno.trabajoId);
      if (!trabajo) return;

      const ***REMOVED*** totalConDescuento, horas ***REMOVED*** = calcularPago(turno);
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
      if (!gananciaPorTrabajo[trabajo.id]) ***REMOVED***
        gananciaPorTrabajo[trabajo.id] = ***REMOVED***
          nombre: trabajo.nombre,
          color: trabajo.color,
          ganancia: 0,
          horas: 0,
          turnos: 0
        ***REMOVED***;
      ***REMOVED***
      gananciaPorTrabajo[trabajo.id].ganancia += totalConDescuento;
      gananciaPorTrabajo[trabajo.id].horas += horas;
      gananciaPorTrabajo[trabajo.id].turnos += 1;

      // Estadísticas por tipo de turno
      if (!tiposDeTurno[turno.tipo]) ***REMOVED***
        tiposDeTurno[turno.tipo] = ***REMOVED*** turnos: 0, horas: 0, ganancia: 0 ***REMOVED***;
      ***REMOVED***
      tiposDeTurno[turno.tipo].turnos += 1;
      tiposDeTurno[turno.tipo].horas += horas;
      tiposDeTurno[turno.tipo].ganancia += totalConDescuento;
    ***REMOVED***);

    // Calcular métricas adicionales
    const diasTrabajados = Object.values(gananciaPorDia).filter(dia => dia.turnos > 0).length;
    const promedioHorasPorDia = diasTrabajados > 0 ? horasTrabajadas / diasTrabajados : 0;
    const promedioPorHora = horasTrabajadas > 0 ? totalGanado / horasTrabajadas : 0;

    // Encontrar el día más productivo
    const diaMasProductivo = Object.entries(gananciaPorDia).reduce((max, [dia, datos]) => ***REMOVED***
      return datos.ganancia > max.ganancia ? ***REMOVED*** dia, ...datos ***REMOVED*** : max;
    ***REMOVED***, ***REMOVED*** dia: 'Ninguno', ganancia: 0, horas: 0, turnos: 0 ***REMOVED***);

    return ***REMOVED***
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
    ***REMOVED***;
  ***REMOVED***, [turnos, trabajos, calcularPago, obtenerFechasSemana]);

  // Efecto para activar animaciones cuando cambia la semana
  useEffect(() => ***REMOVED***
    setAnimacionActiva(true);
    const timer = setTimeout(() => setAnimacionActiva(false), 1000);
    return () => clearTimeout(timer);
  ***REMOVED***, [semanaActual]);

  // Obtener datos de la semana actual y anterior para comparación
  const datosSemanaActual = useMemo(() => obtenerDatosSemana(semanaActual), [obtenerDatosSemana, semanaActual]);
  const datosSemanaAnterior = useMemo(() => obtenerDatosSemana(semanaActual - 1), [obtenerDatosSemana, semanaActual]);

  // Calcular comparaciones
  const comparaciones = useMemo(() => ***REMOVED***
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

    return ***REMOVED***
      ganancias: cambioGanancias,
      horas: cambioHoras,
      turnos: cambioTurnos,
      promedio: cambioPromedio
    ***REMOVED***;
  ***REMOVED***, [datosSemanaActual, datosSemanaAnterior]);

  // Formatear fecha para mostrar
  const formatearFecha = (fecha) => ***REMOVED***
    return fecha.toLocaleDateString('es-ES', ***REMOVED***
      day: 'numeric',
      month: 'long'
    ***REMOVED***);
  ***REMOVED***;

  // Obtener título de la semana
  const obtenerTituloSemana = () => ***REMOVED***
    if (semanaActual === 0) return 'Esta semana';
    if (semanaActual === -1) return 'Semana pasada';
    if (semanaActual === 1) return 'Próxima semana';
    if (semanaActual > 1) return `En $***REMOVED***semanaActual***REMOVED*** semanas`;
    return `Hace $***REMOVED***Math.abs(semanaActual)***REMOVED*** semanas`;
  ***REMOVED***;

  // Componente para mostrar cambio porcentual
  const CambioPorcentual = (***REMOVED*** valor, mostrarPositivo = true ***REMOVED***) => ***REMOVED***
    const esPositivo = valor > 0;
    const esNegativo = valor < 0;

    if (valor === 0) return <span className="text-gray-500">Sin cambios</span>;

    return (
      <span className=***REMOVED***`flex items-center text-sm $***REMOVED***esPositivo ? 'text-green-600' : esNegativo ? 'text-red-600' : 'text-gray-500'
        ***REMOVED***`***REMOVED***>
        ***REMOVED***esPositivo ? <TrendingUp size=***REMOVED***14***REMOVED*** className="mr-1" /> : <TrendingDown size=***REMOVED***14***REMOVED*** className="mr-1" />***REMOVED***
        ***REMOVED***esPositivo && mostrarPositivo ? '+' : ''***REMOVED******REMOVED***valor.toFixed(1)***REMOVED***%
      </span>
    );
  ***REMOVED***;

  // Componente para barra de progreso animada
  const BarraProgreso = (***REMOVED*** valor, maximo, color, label, sublabel ***REMOVED***) => ***REMOVED***
    const porcentaje = maximo > 0 ? (valor / maximo) * 100 : 0;

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">***REMOVED***label***REMOVED***</span>
          <div className="text-right">
            <span className="text-sm font-bold" style=***REMOVED******REMOVED*** color ***REMOVED******REMOVED***>
              $***REMOVED***valor.toFixed(2)***REMOVED***
            </span>
            ***REMOVED***sublabel && (
              <p className="text-xs text-gray-500">***REMOVED***sublabel***REMOVED***</p>
            )***REMOVED***
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className=***REMOVED***`h-3 rounded-full transition-all duration-1000 ease-out $***REMOVED***animacionActiva ? 'animate-pulse' : ''***REMOVED***`***REMOVED***
            style=***REMOVED******REMOVED***
              width: `$***REMOVED***Math.min(porcentaje, 100)***REMOVED***%`,
              backgroundColor: color
            ***REMOVED******REMOVED***
          />
        </div>
      </div>
    );
  ***REMOVED***;

  return (
    <div className="px-4 py-6 space-y-6">
      ***REMOVED***/* Header con navegación de semanas */***REMOVED***
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick=***REMOVED***() => setSemanaActual(semanaActual - 1)***REMOVED***
            className="p-2 rounded-full transition-colors"
            style=***REMOVED******REMOVED***
              backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)',
              color: coloresTemáticos?.base || '#EC4899'
            ***REMOVED******REMOVED***
          >
            <ChevronLeft size=***REMOVED***20***REMOVED*** />
          </button>

          <div className="text-center">
            <h2 className="text-xl font-semibold">***REMOVED***obtenerTituloSemana()***REMOVED***</h2>
            <p className="text-sm text-gray-600">
              ***REMOVED***formatearFecha(datosSemanaActual.fechaInicio)***REMOVED*** - ***REMOVED***formatearFecha(datosSemanaActual.fechaFin)***REMOVED***
            </p>
          </div>

          <button
            onClick=***REMOVED***() => setSemanaActual(semanaActual + 1)***REMOVED***
            className="p-2 rounded-full transition-colors"
            style=***REMOVED******REMOVED***
              backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)',
              color: coloresTemáticos?.base || '#EC4899'
            ***REMOVED******REMOVED***
          >
            <ChevronRight size=***REMOVED***20***REMOVED*** />
          </button>
        </div>

        ***REMOVED***/* Estadísticas principales con comparación */***REMOVED***
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <DollarSign size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-1" />
              <span className="text-sm text-gray-600">Total ganado</span>
            </div>
            <p className="text-2xl font-bold" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***>
              $***REMOVED***datosSemanaActual.totalGanado.toFixed(2)***REMOVED***
            </p>
            <CambioPorcentual valor=***REMOVED***comparaciones.ganancias***REMOVED*** />
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Clock size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-1" />
              <span className="text-sm text-gray-600">Horas trabajadas</span>
            </div>
            <p className="text-2xl font-bold" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***>
              ***REMOVED***datosSemanaActual.horasTrabajadas.toFixed(1)***REMOVED***h
            </p>
            <CambioPorcentual valor=***REMOVED***comparaciones.horas***REMOVED*** />
          </div>
        </div>
      </div>

      ***REMOVED***/* Métricas avanzadas */***REMOVED***
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-3">
            <Target size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
            <h3 className="font-semibold">Eficiencia</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600">Promedio por hora</p>
              <p className="text-lg font-bold" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***>
                $***REMOVED***datosSemanaActual.promedioPorHora.toFixed(2)***REMOVED***/h
              </p>
              <CambioPorcentual valor=***REMOVED***comparaciones.promedio***REMOVED*** />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-3">
            <Activity size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
            <h3 className="font-semibold">Actividad</h3>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-600">Días trabajados</p>
              <p className="text-lg font-bold" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***>
                ***REMOVED***datosSemanaActual.diasTrabajados***REMOVED***/7
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Promedio horas/día</p>
              <p className="text-sm font-medium">
                ***REMOVED***datosSemanaActual.promedioHorasPorDia.toFixed(1)***REMOVED***h
              </p>
            </div>
          </div>
        </div>
      </div>

      ***REMOVED***/* Día más productivo */***REMOVED***
      ***REMOVED***datosSemanaActual.diaMasProductivo.ganancia > 0 && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-3">
            <Award size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
            <h3 className="font-semibold">Día más productivo</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">***REMOVED***datosSemanaActual.diaMasProductivo.dia***REMOVED***</p>
              <p className="text-sm text-gray-600">
                ***REMOVED***datosSemanaActual.diaMasProductivo.turnos***REMOVED*** turnos · ***REMOVED***datosSemanaActual.diaMasProductivo.horas.toFixed(1)***REMOVED***h
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***>
                $***REMOVED***datosSemanaActual.diaMasProductivo.ganancia.toFixed(2)***REMOVED***
              </p>
            </div>
          </div>
        </div>
      )***REMOVED***

      ***REMOVED***/* Distribución por día mejorada */***REMOVED***
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center mb-4">
          <Calendar size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
          <h3 className="font-semibold">Distribución semanal</h3>
        </div>

        <div className="space-y-3">
          ***REMOVED***Object.entries(datosSemanaActual.gananciaPorDia).map(([dia, datos]) => (
            <BarraProgreso
              key=***REMOVED***dia***REMOVED***
              valor=***REMOVED***datos.ganancia***REMOVED***
              maximo=***REMOVED***datosSemanaActual.totalGanado***REMOVED***
              color=***REMOVED***dia === 'Sábado' || dia === 'Domingo'
                ? coloresTemáticos?.dark || '#BE185D'
                : coloresTemáticos?.base || '#EC4899'
              ***REMOVED***
              label=***REMOVED***dia***REMOVED***
              sublabel=***REMOVED***datos.turnos > 0 ? `$***REMOVED***datos.turnos***REMOVED*** turnos · $***REMOVED***datos.horas.toFixed(1)***REMOVED***h` : 'Sin actividad'***REMOVED***
            />
          ))***REMOVED***
        </div>
      </div>

      ***REMOVED***/* Estadísticas por trabajo */***REMOVED***
      ***REMOVED***datosSemanaActual.gananciaPorTrabajo.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-4">
            <BarChart2 size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
            <h3 className="font-semibold">Por trabajo</h3>
          </div>

          <div className="space-y-3">
            ***REMOVED***datosSemanaActual.gananciaPorTrabajo.map((trabajo, index) => (
              <BarraProgreso
                key=***REMOVED***index***REMOVED***
                valor=***REMOVED***trabajo.ganancia***REMOVED***
                maximo=***REMOVED***datosSemanaActual.totalGanado***REMOVED***
                color=***REMOVED***trabajo.color***REMOVED***
                label=***REMOVED***trabajo.nombre***REMOVED***
                sublabel=***REMOVED***`$***REMOVED***trabajo.turnos***REMOVED*** turnos · $***REMOVED***trabajo.horas.toFixed(1)***REMOVED***h`***REMOVED***
              />
            ))***REMOVED***
          </div>
        </div>
      )***REMOVED***

      ***REMOVED***/* Distribución por tipo de turno */***REMOVED***
      ***REMOVED***Object.keys(datosSemanaActual.tiposDeTurno).length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-4">
            <Zap size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
            <h3 className="font-semibold">Tipos de turno</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            ***REMOVED***Object.entries(datosSemanaActual.tiposDeTurno).map(([tipo, datos]) => ***REMOVED***
              const colores = ***REMOVED***
                'diurno': '#10B981',
                'tarde': '#F59E0B',
                'noche': '#6366F1',
                'sabado': '#8B5CF6',
                'domingo': '#EF4444',
                'mixto': '#6B7280'
              ***REMOVED***;

                const tipoMostrado = tipo === 'undefined' ? 'MIXTO' : tipo;

              return (
                <div key=***REMOVED***tipo***REMOVED*** className="text-center p-3 bg-gray-50 rounded-lg">
                  <div
                    className="w-3 h-3 rounded-full mx-auto mb-2"
                    style=***REMOVED******REMOVED*** backgroundColor: colores[tipo] || '#6B7280' ***REMOVED******REMOVED***
                  />
                  <p className="text-xs text-gray-600 capitalize">***REMOVED***tipoMostrado***REMOVED***</p>
                  <p className="font-semibold">***REMOVED***datos.turnos***REMOVED*** turnos</p>
                  <p className="text-xs text-gray-500">***REMOVED***datos.horas.toFixed(1)***REMOVED***h</p>
                </div>
              );
            ***REMOVED***)***REMOVED***
          </div>
        </div>
      )***REMOVED***

      ***REMOVED***/* Proyección mensual - Solo mostrar para semana actual */***REMOVED***
      ***REMOVED***datosSemanaActual.totalGanado > 0 && semanaActual === 0 && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center mb-3">
            <TrendingUp size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
            <h3 className="font-semibold">Proyección mensual</h3>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Si mantienes este ritmo durante todo el mes
            </p>
            <p className="text-3xl font-bold" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***>
              $***REMOVED***(datosSemanaActual.totalGanado * 4.33).toFixed(2)***REMOVED***
            </p>
            <p className="text-sm text-gray-500">
              ~***REMOVED***(datosSemanaActual.horasTrabajadas * 4.33).toFixed(0)***REMOVED*** horas
            </p>
          </div>
        </div>
      )***REMOVED***

      ***REMOVED***/* Mensaje informativo para semanas futuras sin datos */***REMOVED***
      ***REMOVED***semanaActual > 0 && datosSemanaActual.totalTurnos === 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Calendar size=***REMOVED***48***REMOVED*** className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Sin turnos programados</h3>
          <p className="text-gray-500">
            ***REMOVED***semanaActual === 1 ? 'Aún no tienes turnos para la próxima semana' : `No hay turnos programados para esta semana`***REMOVED***
          </p>
        </div>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default Estadisticas;