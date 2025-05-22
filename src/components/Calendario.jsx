// src/components/Calendario.jsx - VERSIÓN CORREGIDA

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const Calendario = (***REMOVED*** onDiaSeleccionado ***REMOVED***) => ***REMOVED***
    const ***REMOVED*** turnos, coloresTemáticos ***REMOVED*** = useApp();
    const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const [fechaActual, setFechaActual] = useState(new Date());
    const [mesActual, setMesActual] = useState(fechaActual.getMonth());
    const [anioActual, setAnioActual] = useState(fechaActual.getFullYear());
    const [diasResaltados, setDiasResaltados] = useState([]);
    const [turnosVisibles, setTurnosVisibles] = useState([]);
    const [diaSeleccionadoActual, setDiaSeleccionadoActual] = useState(null);

    // Función para crear fecha local sin problemas de zona horaria
    const crearFechaLocal = (year, month, day) => ***REMOVED***
        // Crear fecha usando el constructor local (sin UTC)
        return new Date(year, month, day);
    ***REMOVED***;

    // Función para convertir fecha local a ISO
    const fechaLocalAISO = (fecha) => ***REMOVED***
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        return `$***REMOVED***year***REMOVED***-$***REMOVED***month***REMOVED***-$***REMOVED***day***REMOVED***`;
    ***REMOVED***;

    // Usar useEffect para actualizar la fecha actual periódicamente
    useEffect(() => ***REMOVED***
        const intervalo = setInterval(() => ***REMOVED***
            const nuevaFecha = new Date();
            setFechaActual(nuevaFecha);

            // Si cambia el día, recargar el calendario
            if (nuevaFecha.getDate() !== fechaActual.getDate()) ***REMOVED***
                setMesActual(nuevaFecha.getMonth());
                setAnioActual(nuevaFecha.getFullYear());
            ***REMOVED***
        ***REMOVED***, 60000);

        return () => clearInterval(intervalo);
    ***REMOVED***, [fechaActual]);

    // Usar useEffect para marcar los días con turnos
    useEffect(() => ***REMOVED***
        console.log('📅 Procesando turnos para el calendario:', turnos.length);
        
        const diasConTurnos = turnos.map(turno => ***REMOVED***
            console.log('🔍 Turno:', turno.fecha);
            return turno.fecha;
        ***REMOVED***);
        
        setDiasResaltados(diasConTurnos);

        const primerDiaMes = crearFechaLocal(anioActual, mesActual, 1);
        const ultimoDiaMes = crearFechaLocal(anioActual, mesActual + 1, 0);

        const primerDiaStr = fechaLocalAISO(primerDiaMes);
        const ultimoDiaStr = fechaLocalAISO(ultimoDiaMes);

        console.log('📊 Rango del mes:', ***REMOVED*** primerDiaStr, ultimoDiaStr ***REMOVED***);

        const turnosFiltrados = turnos.filter(turno => ***REMOVED***
            const turnoEnRango = turno.fecha >= primerDiaStr && turno.fecha <= ultimoDiaStr;
            if (turnoEnRango) ***REMOVED***
                console.log('✅ Turno en rango:', turno.fecha);
            ***REMOVED***
            return turnoEnRango;
        ***REMOVED***);

        console.log('📋 Turnos visibles en el mes:', turnosFiltrados.length);
        setTurnosVisibles(turnosFiltrados);
    ***REMOVED***, [turnos, mesActual, anioActual]);

    // Obtener días del mes actual
    const obtenerDiasDelMes = () => ***REMOVED***
        const primerDia = crearFechaLocal(anioActual, mesActual, 1);
        const ultimoDia = crearFechaLocal(anioActual, mesActual + 1, 0);

        // Ajustar para que la semana empiece en lunes (0 = lunes, 6 = domingo)
        let diaInicio = primerDia.getDay() - 1;
        if (diaInicio === -1) diaInicio = 6;

        const dias = [];

        // Días del mes anterior
        for (let i = diaInicio; i > 0; i--) ***REMOVED***
            const fecha = crearFechaLocal(anioActual, mesActual, -i + 1);
            dias.push(***REMOVED***
                fecha,
                dia: fecha.getDate(),
                mesActual: false,
                tieneTurnos: verificarTurnosEnFecha(fecha)
            ***REMOVED***);
        ***REMOVED***

        // Días del mes actual
        for (let i = 1; i <= ultimoDia.getDate(); i++) ***REMOVED***
            const fecha = crearFechaLocal(anioActual, mesActual, i);
            dias.push(***REMOVED***
                fecha,
                dia: i,
                mesActual: true,
                tieneTurnos: verificarTurnosEnFecha(fecha),
                esHoy: fechaEsHoy(fecha)
            ***REMOVED***);
        ***REMOVED***

        // Completar la última semana con días del mes siguiente
        const diasRestantes = 42 - dias.length; // 6 semanas * 7 días = 42
        for (let i = 1; i <= diasRestantes; i++) ***REMOVED***
            const fecha = crearFechaLocal(anioActual, mesActual + 1, i);
            dias.push(***REMOVED***
                fecha,
                dia: i,
                mesActual: false,
                tieneTurnos: verificarTurnosEnFecha(fecha)
            ***REMOVED***);
        ***REMOVED***

        return dias;
    ***REMOVED***;

    // Verificar si hay turnos en una fecha específica
    const verificarTurnosEnFecha = (fecha) => ***REMOVED***
        const fechaStr = fechaLocalAISO(fecha);
        const tieneTurnos = diasResaltados.includes(fechaStr);
        
        if (tieneTurnos) ***REMOVED***
            console.log('🎯 Día con turnos encontrado:', fechaStr);
        ***REMOVED***
        
        return tieneTurnos;
    ***REMOVED***;

    // Verificar si una fecha es hoy
    const fechaEsHoy = (fecha) => ***REMOVED***
        const hoy = fechaActual;
        return fecha.getDate() === hoy.getDate() &&
            fecha.getMonth() === hoy.getMonth() &&
            fecha.getFullYear() === hoy.getFullYear();
    ***REMOVED***;

    // Cambiar mes
    const cambiarMes = (incremento) => ***REMOVED***
        let nuevoMes = mesActual + incremento;
        let nuevoAnio = anioActual;

        if (nuevoMes < 0) ***REMOVED***
            nuevoMes = 11;
            nuevoAnio--;
        ***REMOVED*** else if (nuevoMes > 11) ***REMOVED***
            nuevoMes = 0;
            nuevoAnio++;
        ***REMOVED***

        setMesActual(nuevoMes);
        setAnioActual(nuevoAnio);
    ***REMOVED***;

    // Ir a fecha actual
    const irAHoy = () => ***REMOVED***
        const hoy = new Date();
        setFechaActual(hoy);
        setMesActual(hoy.getMonth());
        setAnioActual(hoy.getFullYear());
        
        // También destacamos visualmente el día actual
        const fechaStr = fechaLocalAISO(hoy);
        setDiaSeleccionadoActual(fechaStr);
        
        console.log('🏠 Navegando a hoy:', fechaStr);
        
        // Y si hay un handler de selección, lo invocamos
        if (onDiaSeleccionado) ***REMOVED***
            onDiaSeleccionado(hoy);
        ***REMOVED***
    ***REMOVED***;

    // Obtener nombre del mes
    const getNombreMes = () => ***REMOVED***
        return crearFechaLocal(anioActual, mesActual, 1).toLocaleDateString('es-ES', ***REMOVED*** month: 'long' ***REMOVED***);
    ***REMOVED***;

    // Ir a día seleccionado
    const irADia = (fecha) => ***REMOVED***
        const fechaStr = fechaLocalAISO(fecha);
        setDiaSeleccionadoActual(fechaStr);
        
        console.log('👆 Día seleccionado:', fechaStr);
        
        if (onDiaSeleccionado) ***REMOVED***
            onDiaSeleccionado(fecha);
        ***REMOVED***
    ***REMOVED***;

    // Obtener el resumen de turnos para el mes actual
    const obtenerResumenMes = () => ***REMOVED***
        const turnosPorTrabajo = ***REMOVED******REMOVED***;

        turnosVisibles.forEach(turno => ***REMOVED***
            if (!turnosPorTrabajo[turno.trabajoId]) ***REMOVED***
                turnosPorTrabajo[turno.trabajoId] = 0;
            ***REMOVED***
            turnosPorTrabajo[turno.trabajoId]++;
        ***REMOVED***);

        return ***REMOVED***
            totalTurnos: turnosVisibles.length,
            turnosPorTrabajo
        ***REMOVED***;
    ***REMOVED***;

    const resumenMes = obtenerResumenMes();
    const dias = obtenerDiasDelMes();
    
    // Fecha actual en formato ISO para comparaciones
    const fechaActualISO = fechaLocalAISO(fechaActual);

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div 
                className="p-4 text-white flex justify-between items-center"
                style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
            >
                <button
                    onClick=***REMOVED***() => cambiarMes(-1)***REMOVED***
                    className="text-white p-2 rounded-full transition-colors"
                    style=***REMOVED******REMOVED*** 
                        backgroundColor: 'transparent',
                        ':hover': ***REMOVED*** backgroundColor: coloresTemáticos?.dark || '#BE185D' ***REMOVED***
                    ***REMOVED******REMOVED***
                    onMouseEnter=***REMOVED***(e) => e.target.style.backgroundColor = coloresTemáticos?.dark || '#BE185D'***REMOVED***
                    onMouseLeave=***REMOVED***(e) => e.target.style.backgroundColor = 'transparent'***REMOVED***
                >
                    &lt;
                </button>
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold capitalize">
                        ***REMOVED***getNombreMes()***REMOVED*** ***REMOVED***anioActual***REMOVED***
                    </h3>
                    <button
                        onClick=***REMOVED***irAHoy***REMOVED***
                        className="text-xs px-3 py-1 rounded-full mt-1 transition-colors"
                        style=***REMOVED******REMOVED*** 
                            backgroundColor: coloresTemáticos?.dark || '#BE185D',
                            ':hover': ***REMOVED*** backgroundColor: coloresTemáticos?.darker || '#9F1239' ***REMOVED***
                        ***REMOVED******REMOVED***
                        onMouseEnter=***REMOVED***(e) => e.target.style.backgroundColor = coloresTemáticos?.darker || '#9F1239'***REMOVED***
                        onMouseLeave=***REMOVED***(e) => e.target.style.backgroundColor = coloresTemáticos?.dark || '#BE185D'***REMOVED***
                    >
                        Hoy
                    </button>
                </div>
                <button
                    onClick=***REMOVED***() => cambiarMes(1)***REMOVED***
                    className="text-white p-2 rounded-full transition-colors"
                    style=***REMOVED******REMOVED*** 
                        backgroundColor: 'transparent',
                        ':hover': ***REMOVED*** backgroundColor: coloresTemáticos?.dark || '#BE185D' ***REMOVED***
                    ***REMOVED******REMOVED***
                    onMouseEnter=***REMOVED***(e) => e.target.style.backgroundColor = coloresTemáticos?.dark || '#BE185D'***REMOVED***
                    onMouseLeave=***REMOVED***(e) => e.target.style.backgroundColor = 'transparent'***REMOVED***
                >
                    &gt;
                </button>
            </div>

            ***REMOVED***resumenMes.totalTurnos > 0 && (
                <div 
                    className="p-2 text-xs text-center font-medium"
                    style=***REMOVED******REMOVED*** 
                        backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)',
                        color: coloresTemáticos?.dark || '#BE185D'
                    ***REMOVED******REMOVED***
                >
                    ***REMOVED***resumenMes.totalTurnos***REMOVED*** ***REMOVED***resumenMes.totalTurnos === 1 ? 'turno' : 'turnos'***REMOVED*** este mes
                </div>
            )***REMOVED***

            <div className="grid grid-cols-7 bg-gray-100">
                ***REMOVED***diasSemana.map(dia => (
                    <div key=***REMOVED***dia***REMOVED*** className="py-2 text-center text-gray-600 text-sm font-medium">
                        ***REMOVED***dia***REMOVED***
                    </div>
                ))***REMOVED***
            </div>

            <div className="grid grid-cols-7">
                ***REMOVED***dias.map((dia, index) => ***REMOVED***
                    const fechaDiaISO = fechaLocalAISO(dia.fecha);
                    const esHoy = fechaDiaISO === fechaActualISO;
                    const esSeleccionado = fechaDiaISO === diaSeleccionadoActual;
                    
                    return (
                        <button
                            key=***REMOVED***index***REMOVED***
                            onClick=***REMOVED***() => irADia(dia.fecha)***REMOVED***
                            className=***REMOVED***`
                                p-2 text-center relative 
                                hover:bg-gray-50 
                                flex flex-col justify-center items-center
                                $***REMOVED***!dia.mesActual ? 'text-gray-400' : 'text-gray-800'***REMOVED***
                            `***REMOVED***
                            style=***REMOVED******REMOVED***
                                backgroundColor: esSeleccionado 
                                    ? coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)'
                                    : 'transparent'
                            ***REMOVED******REMOVED***
                        >
                            ***REMOVED***/* Círculo para día actual */***REMOVED***
                            ***REMOVED***esHoy && (
                                <div 
                                    className="absolute inset-0 m-auto rounded-full w-10 h-10 animate-pulse"
                                    style=***REMOVED******REMOVED*** 
                                        border: `2px solid $***REMOVED***coloresTemáticos?.base || '#EC4899'***REMOVED***`
                                    ***REMOVED******REMOVED***
                                ></div>
                            )***REMOVED***
                            
                            ***REMOVED***/* Contenedor para número del día */***REMOVED***
                            <div 
                                className="rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 transform"
                                style=***REMOVED******REMOVED***
                                    backgroundColor: esHoy 
                                        ? coloresTemáticos?.base || '#EC4899'
                                        : (esSeleccionado && !esHoy)
                                            ? coloresTemáticos?.transparent20 || 'rgba(236, 72, 153, 0.2)'
                                            : 'transparent',
                                    color: esHoy 
                                        ? coloresTemáticos?.textContrast || '#ffffff'
                                        : 'inherit',
                                    fontWeight: esHoy ? 'bold' : 'normal',
                                    transform: esHoy ? 'scale(1.1)' : 'scale(1)',
                                    boxShadow: esHoy 
                                        ? `0 4px 12px $***REMOVED***coloresTemáticos?.transparent50 || 'rgba(236, 72, 153, 0.5)'***REMOVED***`
                                        : 'none'
                                ***REMOVED******REMOVED***
                            >
                                <span>***REMOVED***dia.dia***REMOVED***</span>
                            </div>
                            
                            ***REMOVED***/* Indicador de turnos */***REMOVED***
                            ***REMOVED***dia.tieneTurnos && (
                                <div 
                                    className="absolute bottom-1 w-4 h-1 rounded"
                                    style=***REMOVED******REMOVED*** 
                                        backgroundColor: coloresTemáticos?.base || '#EC4899'
                                    ***REMOVED******REMOVED***
                                ></div>
                            )***REMOVED***
                        </button>
                    );
                ***REMOVED***)***REMOVED***
            </div>
        </div>
    );
***REMOVED***;

export default Calendario;