// src/components/Calendario.jsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

const Calendario = ({ onDiaSeleccionado }) => {
    const { turnos } = useApp();
    const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const [fechaActual, setFechaActual] = useState(new Date());
    const [mesActual, setMesActual] = useState(fechaActual.getMonth());
    const [anioActual, setAnioActual] = useState(fechaActual.getFullYear());
    const [diasResaltados, setDiasResaltados] = useState([]);
    const [turnosVisibles, setTurnosVisibles] = useState([]);
    const [diaSeleccionadoActual, setDiaSeleccionadoActual] = useState(null);

    // Usar useEffect para actualizar la fecha actual periódicamente
    useEffect(() => {
        const intervalo = setInterval(() => {
            const nuevaFecha = new Date();
            setFechaActual(nuevaFecha);

            // Si cambia el día, recargar el calendario
            if (nuevaFecha.getDate() !== fechaActual.getDate()) {
                setMesActual(nuevaFecha.getMonth());
                setAnioActual(nuevaFecha.getFullYear());
            }
        }, 60000);

        return () => clearInterval(intervalo);
    }, [fechaActual]);

    // Usar useEffect para marcar los días con turnos
    useEffect(() => {
        const diasConTurnos = turnos.map(turno => turno.fecha);
        setDiasResaltados(diasConTurnos);

        const primerDiaMes = new Date(anioActual, mesActual, 1);
        const ultimoDiaMes = new Date(anioActual, mesActual + 1, 0);

        const primerDiaStr = primerDiaMes.toISOString().split('T')[0];
        const ultimoDiaStr = ultimoDiaMes.toISOString().split('T')[0];

        const turnosFiltrados = turnos.filter(turno => {
            return turno.fecha >= primerDiaStr && turno.fecha <= ultimoDiaStr;
        });

        setTurnosVisibles(turnosFiltrados);
    }, [turnos, mesActual, anioActual]);

    // Obtener días del mes actual
    const obtenerDiasDelMes = () => {
        const primerDia = new Date(anioActual, mesActual, 1);
        const ultimoDia = new Date(anioActual, mesActual + 1, 0);

        // Ajustar para que la semana empiece en lunes (0 = lunes, 6 = domingo)
        let diaInicio = primerDia.getDay() - 1;
        if (diaInicio === -1) diaInicio = 6;

        const dias = [];

        // Días del mes anterior
        for (let i = diaInicio; i > 0; i--) {
            const fecha = new Date(anioActual, mesActual, -i + 1);
            dias.push({
                fecha,
                dia: fecha.getDate(),
                mesActual: false,
                tieneTurnos: verificarTurnosEnFecha(fecha)
            });
        }

        // Días del mes actual
        for (let i = 1; i <= ultimoDia.getDate(); i++) {
            const fecha = new Date(anioActual, mesActual, i);
            dias.push({
                fecha,
                dia: i,
                mesActual: true,
                tieneTurnos: verificarTurnosEnFecha(fecha),
                esHoy: fechaEsHoy(fecha)
            });
        }

        // Completar la última semana con días del mes siguiente
        const diasRestantes = 42 - dias.length; // 6 semanas * 7 días = 42
        for (let i = 1; i <= diasRestantes; i++) {
            const fecha = new Date(anioActual, mesActual + 1, i);
            dias.push({
                fecha,
                dia: i,
                mesActual: false,
                tieneTurnos: verificarTurnosEnFecha(fecha)
            });
        }

        return dias;
    };

    // Verificar si hay turnos en una fecha específica (usando diasResaltados)
    const verificarTurnosEnFecha = (fecha) => {
        const fechaStr = fecha.toISOString().split('T')[0];
        return diasResaltados.includes(fechaStr);
    };

    // Verificar si una fecha es hoy
    const fechaEsHoy = (fecha) => {
        const hoy = fechaActual;
        return fecha.getDate() === hoy.getDate() &&
            fecha.getMonth() === hoy.getMonth() &&
            fecha.getFullYear() === hoy.getFullYear();
    };

    // Cambiar mes
    const cambiarMes = (incremento) => {
        let nuevoMes = mesActual + incremento;
        let nuevoAnio = anioActual;

        if (nuevoMes < 0) {
            nuevoMes = 11;
            nuevoAnio--;
        } else if (nuevoMes > 11) {
            nuevoMes = 0;
            nuevoAnio++;
        }

        setMesActual(nuevoMes);
        setAnioActual(nuevoAnio);
    };

    // Ir a fecha actual
    const irAHoy = () => {
        const hoy = new Date();
        setFechaActual(hoy);
        setMesActual(hoy.getMonth());
        setAnioActual(hoy.getFullYear());
        
        // También destacamos visualmente el día actual
        const fechaStr = hoy.toISOString().split('T')[0];
        setDiaSeleccionadoActual(fechaStr);
        
        // Y si hay un handler de selección, lo invocamos
        if (onDiaSeleccionado) {
            onDiaSeleccionado(hoy);
        }
    };

    // Obtener nombre del mes
    const getNombreMes = () => {
        return new Date(anioActual, mesActual, 1).toLocaleDateString('es-ES', { month: 'long' });
    };

    // Ir a día seleccionado
    const irADia = (fecha) => {
        const fechaStr = fecha.toISOString().split('T')[0];
        setDiaSeleccionadoActual(fechaStr);
        
        if (onDiaSeleccionado) {
            onDiaSeleccionado(fecha);
        }
    };

    // Obtener el resumen de turnos para el mes actual
    const obtenerResumenMes = () => {
        const turnosPorTrabajo = {};

        turnosVisibles.forEach(turno => {
            if (!turnosPorTrabajo[turno.trabajoId]) {
                turnosPorTrabajo[turno.trabajoId] = 0;
            }
            turnosPorTrabajo[turno.trabajoId]++;
        });

        return {
            totalTurnos: turnosVisibles.length,
            turnosPorTrabajo
        };
    };

    const resumenMes = obtenerResumenMes();
    const dias = obtenerDiasDelMes();
    
    // Fecha actual en formato ISO para comparaciones
    const fechaActualISO = fechaActual.toISOString().split('T')[0];

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-pink-600 text-white flex justify-between items-center">
                <button
                    onClick={() => cambiarMes(-1)}
                    className="text-white hover:bg-pink-700 p-2 rounded-full"
                >
                    &lt;
                </button>
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold capitalize">
                        {getNombreMes()} {anioActual}
                    </h3>
                    <button
                        onClick={irAHoy}
                        className="text-xs bg-pink-800 px-3 py-1 rounded-full mt-1 hover:bg-pink-900 transition-colors"
                    >
                        Hoy
                    </button>
                </div>
                <button
                    onClick={() => cambiarMes(1)}
                    className="text-white hover:bg-pink-700 p-2 rounded-full"
                >
                    &gt;
                </button>
            </div>

            {resumenMes.totalTurnos > 0 && (
                <div className="bg-pink-50 p-2 text-xs text-center text-pink-700 font-medium">
                    {resumenMes.totalTurnos} {resumenMes.totalTurnos === 1 ? 'turno' : 'turnos'} este mes
                </div>
            )}

            <div className="grid grid-cols-7 bg-gray-100">
                {diasSemana.map(dia => (
                    <div key={dia} className="py-2 text-center text-gray-600 text-sm font-medium">
                        {dia}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {dias.map((dia, index) => {
                    const fechaDiaISO = dia.fecha.toISOString().split('T')[0];
                    const esHoy = fechaDiaISO === fechaActualISO;
                    const esSeleccionado = fechaDiaISO === diaSeleccionadoActual;
                    
                    return (
                        <button
                            key={index}
                            onClick={() => irADia(dia.fecha)}
                            className={`
                                p-2 text-center relative 
                                hover:bg-gray-50 
                                flex flex-col justify-center items-center
                                ${!dia.mesActual ? 'text-gray-400' : 'text-gray-800'}
                                ${esSeleccionado ? 'bg-pink-100' : ''}
                            `}
                        >
                            {/* Círculo para día actual */}
                            <div className={`
                                ${esHoy ? 'absolute inset-0 m-auto rounded-full border-2 border-pink-500 w-10 h-10 animate-pulse' : ''}
                            `}></div>
                            
                            {/* Contenedor para número del día */}
                            <div className={`
                                rounded-full w-8 h-8 flex items-center justify-center
                                ${esHoy ? 'bg-pink-500 text-white font-bold shadow-lg' : ''}
                                ${esSeleccionado && !esHoy ? 'bg-pink-200' : ''}
                                transition-all duration-200
                                transform ${esHoy ? 'scale-110' : ''}
                            `}>
                                <span className={esHoy ? 'text-white' : ''}>{dia.dia}</span>
                            </div>
                            
                            {/* Indicador de turnos */}
                            {dia.tieneTurnos && (
                                <div className="absolute bottom-1 w-4 h-1 rounded bg-pink-500"></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendario;