// src/components/Calendario.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const Calendario = (***REMOVED*** onDiaSeleccionado ***REMOVED***) => ***REMOVED***
    const ***REMOVED*** turnos ***REMOVED*** = useApp();
    const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const [fechaActual, setFechaActual] = useState(new Date());
    const [mesActual, setMesActual] = useState(fechaActual.getMonth());
    const [anioActual, setAnioActual] = useState(fechaActual.getFullYear());
    const [diasResaltados, setDiasResaltados] = useState([]);
    const [turnosVisibles, setTurnosVisibles] = useState([]);

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
        const diasConTurnos = turnos.map(turno => turno.fecha);
        setDiasResaltados(diasConTurnos);

        const primerDiaMes = new Date(anioActual, mesActual, 1);
        const ultimoDiaMes = new Date(anioActual, mesActual + 1, 0);

        const primerDiaStr = primerDiaMes.toISOString().split('T')[0];
        const ultimoDiaStr = ultimoDiaMes.toISOString().split('T')[0];

        const turnosFiltrados = turnos.filter(turno => ***REMOVED***
            return turno.fecha >= primerDiaStr && turno.fecha <= ultimoDiaStr;
        ***REMOVED***);

        setTurnosVisibles(turnosFiltrados);
    ***REMOVED***, [turnos, mesActual, anioActual]);

    // Obtener días del mes actual
    const obtenerDiasDelMes = () => ***REMOVED***
        const primerDia = new Date(anioActual, mesActual, 1);
        const ultimoDia = new Date(anioActual, mesActual + 1, 0);

        // Ajustar para que la semana empiece en lunes (0 = lunes, 6 = domingo)
        let diaInicio = primerDia.getDay() - 1;
        if (diaInicio === -1) diaInicio = 6;

        const dias = [];

        // Días del mes anterior
        for (let i = diaInicio; i > 0; i--) ***REMOVED***
            const fecha = new Date(anioActual, mesActual, -i + 1);
            dias.push(***REMOVED***
                fecha,
                dia: fecha.getDate(),
                mesActual: false,
                tieneTurnos: verificarTurnosEnFecha(fecha)
            ***REMOVED***);
        ***REMOVED***

        // Días del mes actual
        for (let i = 1; i <= ultimoDia.getDate(); i++) ***REMOVED***
            const fecha = new Date(anioActual, mesActual, i);
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
            const fecha = new Date(anioActual, mesActual + 1, i);
            dias.push(***REMOVED***
                fecha,
                dia: i,
                mesActual: false,
                tieneTurnos: verificarTurnosEnFecha(fecha)
            ***REMOVED***);
        ***REMOVED***

        return dias;
    ***REMOVED***;

    // Verificar si hay turnos en una fecha específica (usando diasResaltados)
    const verificarTurnosEnFecha = (fecha) => ***REMOVED***
        const fechaStr = fecha.toISOString().split('T')[0];
        return diasResaltados.includes(fechaStr);
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
    ***REMOVED***;

    // Obtener nombre del mes
    const getNombreMes = () => ***REMOVED***
        return new Date(anioActual, mesActual, 1).toLocaleDateString('es-ES', ***REMOVED*** month: 'long' ***REMOVED***);
    ***REMOVED***;

    // Ir a día seleccionado
    const irADia = (fecha) => ***REMOVED***
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

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-indigo-700 text-white flex justify-between items-center">
                <button
                    onClick=***REMOVED***() => cambiarMes(-1)***REMOVED***
                    className="text-white hover:bg-indigo-600 p-2 rounded-full"
                >
                    &lt;
                </button>
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold capitalize">
                        ***REMOVED***getNombreMes()***REMOVED*** ***REMOVED***anioActual***REMOVED***
                    </h3>
                    <button
                        onClick=***REMOVED***irAHoy***REMOVED***
                        className="text-xs bg-indigo-800 px-2 py-1 rounded-full mt-1 hover:bg-indigo-900"
                    >
                        Hoy
                    </button>
                </div>
                <button
                    onClick=***REMOVED***() => cambiarMes(1)***REMOVED***
                    className="text-white hover:bg-indigo-600 p-2 rounded-full"
                >
                    &gt;
                </button>
            </div>

            ***REMOVED***resumenMes.totalTurnos > 0 && (
                <div className="bg-indigo-50 p-2 text-xs text-center text-indigo-700">
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
                ***REMOVED***dias.map((dia, index) => (
                    <button
                        key=***REMOVED***index***REMOVED***
                        onClick=***REMOVED***() => irADia(dia.fecha)***REMOVED***
                        className=***REMOVED***`p-2 text-center relative hover:bg-gray-50 h-14 flex flex-col justify-center items-center $***REMOVED***!dia.mesActual ? 'text-gray-400' :
                                dia.esHoy ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-800'
                            ***REMOVED***`***REMOVED***
                    >
                        <span>***REMOVED***dia.dia***REMOVED***</span>
                        ***REMOVED***dia.tieneTurnos && (
                            <div className="absolute bottom-1 w-4 h-1 rounded bg-indigo-500"></div>
                        )***REMOVED***
                    </button>
                ))***REMOVED***
            </div>
        </div>
    );
***REMOVED***;

export default Calendario;