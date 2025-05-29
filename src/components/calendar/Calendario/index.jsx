// src/components/calendar/Calendario/index.jsx

import React, { useState, useEffect } from 'react';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const Calendario = ({ onDiaSeleccionado }) => {
    const { turnos, trabajos, coloresTemáticos } = useApp();
    const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const [fechaActual, setFechaActual] = useState(new Date());
    const [mesActual, setMesActual] = useState(fechaActual.getMonth());
    const [anioActual, setAnioActual] = useState(fechaActual.getFullYear());
    const [diasResaltados, setDiasResaltados] = useState([]);
    const [turnosVisibles, setTurnosVisibles] = useState([]);
    const [diaSeleccionadoActual, setDiaSeleccionadoActual] = useState(null);

    // Función para crear fecha local sin problemas de zona horaria
    const crearFechaLocal = (year, month, day) => {
        return new Date(year, month, day);
    };

    // Función para convertir fecha local a ISO
    const fechaLocalAISO = (fecha) => {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

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

        const primerDiaMes = crearFechaLocal(anioActual, mesActual, 1);
        const ultimoDiaMes = crearFechaLocal(anioActual, mesActual + 1, 0);

        const primerDiaStr = fechaLocalAISO(primerDiaMes);
        const ultimoDiaStr = fechaLocalAISO(ultimoDiaMes);

        const turnosFiltrados = turnos.filter(turno => {
            return turno.fecha >= primerDiaStr && turno.fecha <= ultimoDiaStr;
        });

        setTurnosVisibles(turnosFiltrados);
    }, [turnos, mesActual, anioActual]);

    // Obtener días del mes actual
    const obtenerDiasDelMes = () => {
        const primerDia = crearFechaLocal(anioActual, mesActual, 1);
        const ultimoDia = crearFechaLocal(anioActual, mesActual + 1, 0);

        // Ajustar para que la semana empiece en lunes (0 = lunes, 6 = domingo)
        let diaInicio = primerDia.getDay() - 1;
        if (diaInicio === -1) diaInicio = 6;

        const dias = [];

        // Días del mes anterior
        for (let i = diaInicio; i > 0; i--) {
            const fecha = crearFechaLocal(anioActual, mesActual, -i + 1);
            dias.push({
                fecha,
                dia: fecha.getDate(),
                mesActual: false,
                tieneTurnos: verificarTurnosEnFecha(fecha),
                turnosDelDia: obtenerTurnosDelDia(fecha)
            });
        }

        // Días del mes actual
        for (let i = 1; i <= ultimoDia.getDate(); i++) {
            const fecha = crearFechaLocal(anioActual, mesActual, i);
            dias.push({
                fecha,
                dia: i,
                mesActual: true,
                tieneTurnos: verificarTurnosEnFecha(fecha),
                turnosDelDia: obtenerTurnosDelDia(fecha),
                esHoy: fechaEsHoy(fecha)
            });
        }

        // Completar la última semana con días del mes siguiente
        const diasRestantes = 42 - dias.length; // 6 semanas * 7 días = 42
        for (let i = 1; i <= diasRestantes; i++) {
            const fecha = crearFechaLocal(anioActual, mesActual + 1, i);
            dias.push({
                fecha,
                dia: i,
                mesActual: false,
                tieneTurnos: verificarTurnosEnFecha(fecha),
                turnosDelDia: obtenerTurnosDelDia(fecha)
            });
        }

        return dias;
    };

    // Verificar si hay turnos en una fecha específica
    const verificarTurnosEnFecha = (fecha) => {
        const fechaStr = fechaLocalAISO(fecha);
        return diasResaltados.includes(fechaStr);
    };

    // Obtener los turnos de un día específico
    const obtenerTurnosDelDia = (fecha) => {
        const fechaStr = fechaLocalAISO(fecha);
        return turnos.filter(turno => turno.fecha === fechaStr);
    };

    // Obtener colores únicos de trabajos para un día
    const obtenerColoresTrabajos = (turnosDelDia) => {
        const coloresUnicos = new Set();

        turnosDelDia.forEach(turno => {
            const trabajo = trabajos.find(t => t.id === turno.trabajoId);
            if (trabajo) {
                coloresUnicos.add(trabajo.color);
            }
        });

        return Array.from(coloresUnicos).slice(0, 3);
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
        const fechaStr = fechaLocalAISO(hoy);
        setDiaSeleccionadoActual(fechaStr);

        // Y si hay un handler de selección, lo invocamos
        if (onDiaSeleccionado) {
            onDiaSeleccionado(hoy);
        }
    };

    // Obtener nombre del mes
    const getNombreMes = () => {
        return crearFechaLocal(anioActual, mesActual, 1).toLocaleDateString('es-ES', { month: 'long' });
    };

    // Ir a día seleccionado
    const irADia = (fecha) => {
        const fechaStr = fechaLocalAISO(fecha);
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
    const fechaActualISO = fechaLocalAISO(fechaActual);

    return (
        <Card className="overflow-hidden">
            <div
                className="p-4 text-white flex justify-between items-center"
                style={{ backgroundColor: coloresTemáticos?.base || '#EC4899' }}
            >
                <button
                    onClick={() => cambiarMes(-1)}
                    className="text-white p-2 rounded-full transition-colors hover:bg-black hover:bg-opacity-20"
                >
                    &lt;
                </button>
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold capitalize">
                        {getNombreMes()} {anioActual}
                    </h3>
                    <button
                        onClick={irAHoy}
                        className="text-xs px-3 py-1 rounded-full mt-1 transition-colors bg-white bg-opacity-20 hover:bg-opacity-30"
                    >
                        Hoy
                    </button>
                </div>
                <button
                    onClick={() => cambiarMes(1)}
                    className="text-white p-2 rounded-full transition-colors hover:bg-black hover:bg-opacity-20"
                >
                    &gt;
                </button>
            </div>

            {resumenMes.totalTurnos > 0 && (
                <div
                    className="p-2 text-xs text-center font-medium"
                    style={{
                        backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)',
                        color: coloresTemáticos?.dark || '#BE185D'
                    }}
                >
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
                    const fechaDiaISO = fechaLocalAISO(dia.fecha);
                    const esHoy = fechaDiaISO === fechaActualISO;
                    const esSeleccionado = fechaDiaISO === diaSeleccionadoActual;
                    const coloresTrabajos = obtenerColoresTrabajos(dia.turnosDelDia);

                    return (
                        <button
                            key={index}
                            onClick={() => irADia(dia.fecha)}
                            className={`
                                p-2 text-center relative 
                                hover:bg-gray-50 
                                flex flex-col justify-center items-center
                                ${!dia.mesActual ? 'text-gray-400' : 'text-gray-800'}
                            `}
                            style={{
                                backgroundColor: esSeleccionado
                                    ? coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)'
                                    : 'transparent'
                            }}
                        >
                            {/* Círculo para día actual */}
                            {esHoy && (
                                <div
                                    className="absolute inset-0 m-auto rounded-full w-10 h-10 animate-pulse"
                                    style={{
                                        border: `2px solid ${coloresTemáticos?.base || '#EC4899'}`
                                    }}
                                ></div>
                            )}

                            {/* Contenedor para número del día */}
                            <div
                                className="rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 transform"
                                style={{
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
                                        ? `0 4px 12px ${coloresTemáticos?.transparent50 || 'rgba(236, 72, 153, 0.5)'}`
                                        : 'none'
                                }}
                            >
                                <span>{dia.dia}</span>
                            </div>

                            {/* Indicadores de turnos con colores de trabajos */}
                            {dia.tieneTurnos && (
                                <div className="absolute bottom-1 flex justify-center gap-1">
                                    {coloresTrabajos.length === 1 ? (
                                        // Un solo trabajo: línea completa
                                        <div
                                            className="w-4 h-1 rounded"
                                            style={{ backgroundColor: coloresTrabajos[0] }}
                                        />
                                    ) : coloresTrabajos.length === 2 ? (
                                        // Dos trabajos: dos líneas
                                        <>
                                            <div
                                                className="w-2 h-1 rounded"
                                                style={{ backgroundColor: coloresTrabajos[0] }}
                                            />
                                            <div
                                                className="w-2 h-1 rounded"
                                                style={{ backgroundColor: coloresTrabajos[1] }}
                                            />
                                        </>
                                    ) : coloresTrabajos.length >= 3 ? (
                                        // Tres o más trabajos: tres pequeñas líneas
                                        <>
                                            <div
                                                className="w-1 h-1 rounded-full"
                                                style={{ backgroundColor: coloresTrabajos[0] }}
                                            />
                                            <div
                                                className="w-1 h-1 rounded-full"
                                                style={{ backgroundColor: coloresTrabajos[1] }}
                                            />
                                            <div
                                                className="w-1 h-1 rounded-full"
                                                style={{ backgroundColor: coloresTrabajos[2] }}
                                            />
                                        </>
                                    ) : null}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </Card>
    );
};

export default Calendario;