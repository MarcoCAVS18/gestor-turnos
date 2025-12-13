// src/services/exportService.js

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx-js-style';
import { getShiftGrossEarnings } from '../utils/shiftUtils';

// Función para formatear moneda
const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`;
};

// Función para formatear fecha
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Función para formatear hora
const formatTime = (time) => {
  return time || 'N/A';
};

// Función para calcular horas trabajadas
const calculateHours = (horaInicio, horaFin) => {
  if (!horaInicio || !horaFin) return 0;

  const [inicioHoras, inicioMinutos] = horaInicio.split(':').map(Number);
  const [finHoras, finMinutos] = horaFin.split(':').map(Number);

  const inicioEnMinutos = inicioHoras * 60 + inicioMinutos;
  const finEnMinutos = finHoras * 60 + finMinutos;

  const diferenciaMinutos = finEnMinutos - inicioEnMinutos;
  return (diferenciaMinutos / 60).toFixed(2);
};

/**
 * Generar reporte en formato PDF
 */
export const generatePDFReport = async (stats, turnos, trabajos) => {
  const doc = new jsPDF();
  
  // Configuración de fuente y colores
  const primaryColor = [236, 72, 153];
  const textColor = [50, 50, 50];
  const grayColor = [128, 128, 128];
  
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  
  // Título principal
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.text('Reporte de Actividad', margin, yPosition);
  
  yPosition += 8;
  
  // Fecha del reporte
  doc.setFontSize(10);
  doc.setTextColor(...grayColor);
  doc.text(`Generado el ${formatDate(new Date())}`, margin, yPosition);
  
  yPosition += 15;
  
  // Línea divisoria
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  
  yPosition += 10;
  
  // SECCIÓN: Resumen General
  doc.setFontSize(16);
  doc.setTextColor(...textColor);
  doc.text('Resumen General', margin, yPosition);
  
  yPosition += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(...textColor);
  
  const resumenData = [
    ['Total Ganado:', formatCurrency(stats.totalGanado || 0)],
    ['Horas Trabajadas:', `${(stats.horasTrabajadas || 0).toFixed(1)}h`],
    ['Total de Turnos:', stats.turnosTotal || 0],
    ['Promedio por Hora:', formatCurrency(stats.promedioPorHora || 0)]
  ];
  
  resumenData.forEach(([label, value]) => {
    doc.text(label, margin + 5, yPosition);
    doc.setFont(undefined, 'bold');
    doc.text(String(value), margin + 70, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 7;
  });
  
  yPosition += 8;
  
  // SECCIÓN: Esta Semana
  doc.setFontSize(16);
  doc.text('Esta Semana', margin, yPosition);
  
  yPosition += 10;
  
  doc.setFontSize(11);
  
  const semanaData = [
    ['Ganancias:', formatCurrency(stats.gananciasEstaSemana || 0)],
    ['Turnos:', stats.turnosEstaSemana || 0],
    ['Días Trabajados:', stats.diasTrabajados || 0]
  ];
  
  semanaData.forEach(([label, value]) => {
    doc.text(label, margin + 5, yPosition);
    doc.setFont(undefined, 'bold');
    doc.text(String(value), margin + 70, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 7;
  });
  
  yPosition += 8;
  
  // SECCIÓN: Trabajo Más Rentable
  if (stats.trabajoMasRentable) {
    doc.setFontSize(16);
    doc.text('Trabajo Más Rentable', margin, yPosition);
    
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.text(stats.trabajoMasRentable.trabajo.nombre, margin + 5, yPosition);
    yPosition += 7;
    doc.setFont(undefined, 'bold');
    doc.text(formatCurrency(stats.trabajoMasRentable.ganancia), margin + 5, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 5;
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    doc.text(`${stats.trabajoMasRentable.turnos} turnos • ${stats.trabajoMasRentable.horas.toFixed(1)}h`, margin + 5, yPosition);
    doc.setTextColor(...textColor);
    
    yPosition += 10;
  }
  
  // SECCIÓN: Últimos Turnos
  yPosition += 5;
  doc.setFontSize(16);
  doc.text('Últimos Turnos', margin, yPosition);
  
  yPosition += 10;
  
  // Mostrar últimos 5 turnos
  const ultimosTurnos = turnos.slice(0, 5);
  
  doc.setFontSize(9);
  ultimosTurnos.forEach((turno) => {
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return;
    
    // Nombre del trabajo
    doc.setFont(undefined, 'bold');
    doc.text(trabajo.nombre, margin + 5, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 5;
    
    // Detalles del turno
    doc.setTextColor(...grayColor);
    const fecha = turno.fechaInicio || turno.fecha;
    doc.text(`${formatDate(fecha)} • ${turno.horaInicio} - ${turno.horaFin}`, margin + 5, yPosition);
    doc.setTextColor(...textColor);
    
    yPosition += 8;
    
    // Verificar si necesitamos nueva página
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
  });
  
  // Pie de página
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Descargar PDF
  doc.save(`reporte-${new Date().toISOString().split('T')[0]}.pdf`);
};

// Función auxiliar para calcular ganancia correcta
const calcularGananciaCorrecta = (turno, trabajo, calculatePayment) => {
  if (!turno || !trabajo) return 0;

  if (turno.tipo === 'delivery' || trabajo.tipo === 'delivery') {
    return getShiftGrossEarnings(turno);
  }

  if (typeof calculatePayment === 'function') {
    const resultado = calculatePayment(turno);
    return resultado.totalWithDiscount || resultado.totalConDescuento || 0;
  }

  const horas = calculateHours(turno.horaInicio, turno.horaFin);
  return horas * (trabajo.tarifaBase || 0);
};

// Estilos para el Excel
const estilos = {
  // Encabezado principal (títulos de secciones)
  encabezadoPrincipal: {
    font: { bold: true, size: 14, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "EC4899" } }, // Rosa
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  },

  // Encabezado de tabla
  encabezadoTabla: {
    font: { bold: true, size: 11, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "4472C4" } }, // Azul
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  },

  // Subtítulo (resumen del mes)
  subtitulo: {
    font: { bold: true, size: 12, color: { rgb: "1F2937" } },
    fill: { fgColor: { rgb: "E5E7EB" } }, // Gris claro
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      bottom: { style: "thin", color: { rgb: "9CA3AF" } }
    }
  },

  // Celda normal (fila par - blanca)
  celdaNormalPar: {
    font: { size: 10, color: { rgb: "1F2937" } },
    fill: { fgColor: { rgb: "FFFFFF" } },
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "E5E7EB" } },
      bottom: { style: "thin", color: { rgb: "E5E7EB" } },
      left: { style: "thin", color: { rgb: "E5E7EB" } },
      right: { style: "thin", color: { rgb: "E5E7EB" } }
    }
  },

  // Celda normal (fila impar - gris claro)
  celdaNormalImpar: {
    font: { size: 10, color: { rgb: "1F2937" } },
    fill: { fgColor: { rgb: "F9FAFB" } }, // Gris muy claro
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "E5E7EB" } },
      bottom: { style: "thin", color: { rgb: "E5E7EB" } },
      left: { style: "thin", color: { rgb: "E5E7EB" } },
      right: { style: "thin", color: { rgb: "E5E7EB" } }
    }
  },

  // Celda de moneda
  celdaMoneda: {
    numFmt: "$#,##0.00"
  },

  // Celda de número decimal
  celdaDecimal: {
    numFmt: "0.00"
  },

  // Celda centrada
  celdaCentrada: {
    alignment: { horizontal: "center", vertical: "center" }
  },

  // Etiqueta (para resumen)
  etiqueta: {
    font: { bold: true, size: 11, color: { rgb: "374151" } },
    alignment: { horizontal: "left", vertical: "center" }
  },

  // Valor (para resumen)
  valor: {
    font: { size: 11, color: { rgb: "1F2937" } },
    alignment: { horizontal: "right", vertical: "center" }
  }
};

// Función para aplicar estilo a una celda
const aplicarEstilo = (worksheet, celda, estilo) => {
  if (!worksheet[celda]) {
    worksheet[celda] = { t: 's', v: '' };
  }
  worksheet[celda].s = estilo;
};

// Función para aplicar estilo a un rango de celdas
const aplicarEstiloRango = (worksheet, rangoInicio, rangoFin, estilo) => {
  const colInicio = rangoInicio.charCodeAt(0);
  const colFin = rangoFin.charCodeAt(0);
  const filaInicio = parseInt(rangoInicio.substring(1));
  const filaFin = parseInt(rangoFin.substring(1));

  for (let col = colInicio; col <= colFin; col++) {
    for (let fila = filaInicio; fila <= filaFin; fila++) {
      const celda = String.fromCharCode(col) + fila;
      aplicarEstilo(worksheet, celda, estilo);
    }
  }
};

// Función para combinar celdas
const combinarCeldas = (worksheet, rango) => {
  if (!worksheet['!merges']) {
    worksheet['!merges'] = [];
  }

  const match = rango.match(/([A-Z]+)(\d+):([A-Z]+)(\d+)/);
  if (match) {
    const [, colInicio, filaInicio, colFin, filaFin] = match;
    worksheet['!merges'].push({
      s: { c: colInicio.charCodeAt(0) - 65, r: parseInt(filaInicio) - 1 },
      e: { c: colFin.charCodeAt(0) - 65, r: parseInt(filaFin) - 1 }
    });
  }
};

/**
 * Generar reporte en formato XLSX
 */
export const generateXLSXReport = async (stats, turnos, trabajos, calculatePayment) => {
  const workbook = XLSX.utils.book_new();

  const resumenSheet = [
    ['REPORTE DE ACTIVIDAD'],
    [`Generado el ${formatDate(new Date())}`],
    [],
    ['RESUMEN GENERAL'],
    ['Total Ganado', formatCurrency(stats.totalGanado || 0)],
    ['Horas Trabajadas', `${(stats.horasTrabajadas || 0).toFixed(1)}h`],
    ['Total de Turnos', stats.turnosTotal || 0],
    ['Promedio por Hora', formatCurrency(stats.promedioPorHora || 0)],
    [],
    ['ESTA SEMANA'],
    ['Ganancias', formatCurrency(stats.gananciasEstaSemana || 0)],
    ['Turnos', stats.turnosEstaSemana || 0],
    ['Días Trabajados', stats.diasTrabajados || 0],
    [],
    ...(stats.trabajoMasRentable ? [
      ['TRABAJO MÁS RENTABLE'],
      ['Nombre', stats.trabajoMasRentable.trabajo.nombre],
      ['Ganancia', formatCurrency(stats.trabajoMasRentable.ganancia)],
      ['Turnos', stats.trabajoMasRentable.turnos],
      ['Horas', `${stats.trabajoMasRentable.horas.toFixed(1)}h`]
    ] : [])
  ];

  const wsResumen = XLSX.utils.aoa_to_sheet(resumenSheet);

  wsResumen['A1'].s = {
    font: { bold: true, size: 16, color: { rgb: "EC4899" } },
    alignment: { horizontal: "center", vertical: "center" }
  };

  wsResumen['A2'].s = {
    font: { size: 10, color: { rgb: "6B7280" }, italic: true },
    alignment: { horizontal: "center", vertical: "center" }
  };

  ['A4', 'A10', 'A15'].forEach(celda => {
    if (wsResumen[celda]) {
      wsResumen[celda].s = estilos.subtitulo;
    }
  });

  [[5, 8], [11, 13], [16, 19]].forEach(([inicio, fin]) => {
    for (let i = inicio; i <= fin; i++) {
      const celdaA = `A${i}`;
      const celdaB = `B${i}`;
      if (wsResumen[celdaA]) {
        wsResumen[celdaA].s = estilos.etiqueta;
      }
      if (wsResumen[celdaB]) {
        wsResumen[celdaB].s = estilos.valor;
      }
    }
  });

  wsResumen['!cols'] = [
    { wch: 25 },
    { wch: 20 }
  ];

  combinarCeldas(wsResumen, 'A1:B1');
  combinarCeldas(wsResumen, 'A2:B2');

  XLSX.utils.book_append_sheet(workbook, wsResumen, 'Resumen');

  const turnosPorMes = {};

  const formatFecha = (fecha) => {
    if (!fecha) return '';
    if (fecha.seconds) {
      return formatDate(new Date(fecha.seconds * 1000));
    }
    return formatDate(new Date(fecha));
  };

  turnos.forEach((turno) => {
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return;

    const fecha = new Date(turno.fechaInicio || turno.fecha);
    const mesAnio = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });

    if (!turnosPorMes[mesAnio]) {
      turnosPorMes[mesAnio] = { tradicionales: [], delivery: [] };
    }

    const esDelivery = turno.tipo === 'delivery' || trabajo.tipo === 'delivery';

    const ganancia = calcularGananciaCorrecta(turno, trabajo, calculatePayment);
    let horas = 0;
    let breakdown = null;

    if (esDelivery) {
      horas = parseFloat(calculateHours(turno.horaInicio, turno.horaFin));
    } else if (typeof calculatePayment === 'function') {
      const resultado = calculatePayment(turno);
      horas = resultado.hours || 0;
      breakdown = resultado.breakdown || null;
    } else {
      horas = parseFloat(calculateHours(turno.horaInicio, turno.horaFin));
    }

    const turnoBase = {
      id: turno.id || '',
      fecha: formatDate(fecha),
      diaSemana: fecha.toLocaleDateString('es-ES', { weekday: 'long' }),
      empresa: trabajo.nombre,
      horaInicio: formatTime(turno.horaInicio),
      horaFin: formatTime(turno.horaFin),
      horasTrabajadas: horas,
      cruzaMedianoche: turno.cruzaMedianoche ? 'Sí' : 'No',
      fechaFin: turno.fechaFin ? formatDate(new Date(turno.fechaFin)) : '',
      gananciaTotal: ganancia,
      observaciones: turno.observaciones || turno.notas || turno.descripcion || '',
      fechaCreacion: formatFecha(turno.fechaCreacion),
      fechaActualizacion: formatFecha(turno.fechaActualizacion)
    };

    if (esDelivery) {
      const turnoDelivery = {
        ...turnoBase,
        plataforma: trabajo.plataforma || '',
        vehiculo: trabajo.vehiculo || '',
        numeroPedidos: turno.numeroPedidos || 0,
        propinas: turno.propinas || 0,
        kilometros: turno.kilometros || 0,
        gastoCombustible: turno.gastoCombustible || 0,
        gananciaBase: turno.gananciaBase || 0,
        gananciaNeta: ganancia - (turno.gastoCombustible || 0),
        promedioPorPedido: turno.numeroPedidos > 0 ? ganancia / turno.numeroPedidos : 0
      };
      turnosPorMes[mesAnio].delivery.push(turnoDelivery);
    } else {
      const turnoTradicional = {
        ...turnoBase,
        tarifa: trabajo.tarifa || trabajo.tarifaBase || 0,
        breakdown: breakdown
      };
      turnosPorMes[mesAnio].tradicionales.push(turnoTradicional);
    }
  });

  const mesesOrdenados = Object.keys(turnosPorMes).sort((a, b) => {
    const [mesA, anioA] = a.split(' de ');
    const [mesB, anioB] = b.split(' de ');
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const fechaA = new Date(parseInt(anioA), meses.indexOf(mesA.toLowerCase()));
    const fechaB = new Date(parseInt(anioB), meses.indexOf(mesB.toLowerCase()));
    return fechaB - fechaA;
  });

  mesesOrdenados.forEach((mesAnio) => {
    const { tradicionales, delivery } = turnosPorMes[mesAnio];
    const todosTurnos = [...tradicionales, ...delivery];

    const totalHorasMes = todosTurnos.reduce((sum, t) => sum + t.horasTrabajadas, 0);
    const totalGananciasMes = todosTurnos.reduce((sum, t) => sum + t.gananciaTotal, 0);
    const totalPedidos = delivery.reduce((sum, t) => sum + t.numeroPedidos, 0);
    const totalPropinas = delivery.reduce((sum, t) => sum + t.propinas, 0);
    const totalGastos = delivery.reduce((sum, t) => sum + t.gastoCombustible, 0);

    const mesData = [
      [mesAnio.toUpperCase()],
      [],
      ['RESUMEN DEL MES'],
      ['Total de Turnos', todosTurnos.length],
      ['Turnos Tradicionales', tradicionales.length],
      ['Turnos Delivery', delivery.length],
      ['Total Horas Trabajadas', `${totalHorasMes.toFixed(2)}h`],
      ['Total Ganado', formatCurrency(totalGananciasMes)],
      ['Promedio por Turno', formatCurrency(todosTurnos.length > 0 ? totalGananciasMes / todosTurnos.length : 0)],
      ['Promedio por Hora', formatCurrency(totalHorasMes > 0 ? totalGananciasMes / totalHorasMes : 0)],
      ...(delivery.length > 0 ? [
        ['Total Pedidos', totalPedidos],
        ['Total Propinas', formatCurrency(totalPropinas)],
        ['Total Gastos', formatCurrency(totalGastos)],
        ['Ganancia Neta', formatCurrency(totalGananciasMes - totalGastos)]
      ] : []),
      []
    ];

    if (tradicionales.length > 0) {
      mesData.push(
        ['TURNOS TRADICIONALES'],
        [],
        [
          'ID Turno',
          'Fecha',
          'Día Semana',
          'Empresa',
          'Hora Inicio',
          'Hora Fin',
          'Horas Trabajadas',
          'Cruza Medianoche',
          'Fecha Fin',
          'Tarifa/Hora',
          'Ganancia Total',
          'Diurno',
          'Tarde',
          'Noche',
          'Sábado',
          'Domingo',
          'Observaciones',
          'Fecha Creación',
          'Fecha Actualización'
        ]
      );

      tradicionales.forEach((turno) => {
        const breakdown = turno.breakdown || {};
        mesData.push([
          turno.id,
          turno.fecha,
          turno.diaSemana,
          turno.empresa,
          turno.horaInicio,
          turno.horaFin,
          turno.horasTrabajadas,
          turno.cruzaMedianoche,
          turno.fechaFin,
          formatCurrency(turno.tarifa),
          formatCurrency(turno.gananciaTotal),
          breakdown.diurno ? formatCurrency(breakdown.diurno) : '',
          breakdown.tarde ? formatCurrency(breakdown.tarde) : '',
          breakdown.noche ? formatCurrency(breakdown.noche) : '',
          breakdown.sabado ? formatCurrency(breakdown.sabado) : '',
          breakdown.domingo ? formatCurrency(breakdown.domingo) : '',
          turno.observaciones,
          turno.fechaCreacion,
          turno.fechaActualizacion
        ]);
      });

      mesData.push([]);
    }

    if (delivery.length > 0) {
      mesData.push(
        ['TURNOS DELIVERY'],
        [],
        [
          'ID Turno',
          'Fecha',
          'Día Semana',
          'Empresa',
          'Plataforma',
          'Vehículo',
          'Hora Inicio',
          'Hora Fin',
          'Horas Trabajadas',
          'Cruza Medianoche',
          'Fecha Fin',
          'Nº Pedidos',
          'Ganancia Total',
          'Ganancia Base',
          'Propinas',
          'Kilómetros',
          'Gasto Combustible',
          'Ganancia Neta',
          'Promedio/Pedido',
          'Observaciones',
          'Fecha Creación',
          'Fecha Actualización'
        ]
      );

      delivery.forEach((turno) => {
        mesData.push([
          turno.id,
          turno.fecha,
          turno.diaSemana,
          turno.empresa,
          turno.plataforma,
          turno.vehiculo,
          turno.horaInicio,
          turno.horaFin,
          turno.horasTrabajadas,
          turno.cruzaMedianoche,
          turno.fechaFin,
          turno.numeroPedidos,
          formatCurrency(turno.gananciaTotal),
          formatCurrency(turno.gananciaBase),
          formatCurrency(turno.propinas),
          turno.kilometros,
          formatCurrency(turno.gastoCombustible),
          formatCurrency(turno.gananciaNeta),
          formatCurrency(turno.promedioPorPedido),
          turno.observaciones,
          turno.fechaCreacion,
          turno.fechaActualizacion
        ]);
      });
    }

    const wsMes = XLSX.utils.aoa_to_sheet(mesData);

    // Aplicar estilos y combinar celdas
    aplicarEstilo(wsMes, 'A1', estilos.encabezadoPrincipal);
    combinarCeldas(wsMes, 'A1:V1');

    let filaActual = 3; // Inicia después del título y espacio
    aplicarEstilo(wsMes, `A${filaActual}`, estilos.subtitulo);
    combinarCeldas(wsMes, `A${filaActual}:D${filaActual}`);

    filaActual += 1;
    aplicarEstiloRango(wsMes, `A${filaActual}`, `B${filaActual + 6}`, estilos.etiqueta);
    aplicarEstiloRango(wsMes, `C${filaActual}`, `D${filaActual + 6}`, estilos.valor);

    if (delivery.length > 0) {
      aplicarEstiloRango(wsMes, `A${filaActual + 7}`, `B${filaActual + 10}`, estilos.etiqueta);
      aplicarEstiloRango(wsMes, `C${filaActual + 7}`, `D${filaActual + 10}`, estilos.valor);
      filaActual += 12;
    } else {
      filaActual += 8;
    }

    if (tradicionales.length > 0) {
      aplicarEstilo(wsMes, `A${filaActual}`, estilos.encabezadoPrincipal);
      combinarCeldas(wsMes, `A${filaActual}:S${filaActual}`);
      filaActual += 2;
      aplicarEstiloRango(wsMes, `A${filaActual}`, `S${filaActual}`, estilos.encabezadoTabla);
      filaActual += tradicionales.length + 1;
    }

    if (delivery.length > 0) {
      if(tradicionales.length > 0) filaActual += 1;
      aplicarEstilo(wsMes, `A${filaActual}`, estilos.encabezadoPrincipal);
      combinarCeldas(wsMes, `A${filaActual}:V${filaActual}`);
      filaActual += 2;
      aplicarEstiloRango(wsMes, `A${filaActual}`, `V${filaActual}`, estilos.encabezadoTabla);
    }
    
    wsMes['!cols'] = [
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 10 },
      { wch: 15 },
      { wch: 12 },
      { wch: 10 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 10 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 }
    ];

    const nombreHoja = mesAnio.substring(0, 31);
    XLSX.utils.book_append_sheet(workbook, wsMes, nombreHoja);
  });

  XLSX.writeFile(workbook, `reporte-detallado-${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Generar reporte en formato TXT
 */
export const generateTXTReport = async (stats, turnos, trabajos) => {
  const fecha = new Date().toISOString().split('T')[0];
  let contenido = '';

  // Encabezado
  contenido += '═'.repeat(80) + '\n';
  contenido += 'REPORTE DE ACTIVIDAD\n';
  contenido += `Generado el ${formatDate(new Date())}\n`;
  contenido += '═'.repeat(80) + '\n\n';

  // Resumen General
  contenido += 'RESUMEN GENERAL\n';
  contenido += '─'.repeat(80) + '\n';
  contenido += `Total Ganado:           ${formatCurrency(stats.totalGanado || 0)}\n`;
  contenido += `Horas Trabajadas:       ${(stats.horasTrabajadas || 0).toFixed(1)}h\n`;
  contenido += `Total de Turnos:        ${stats.turnosTotal || 0}\n`;
  contenido += `Promedio por Hora:      ${formatCurrency(stats.promedioPorHora || 0)}\n\n`;

  // Esta Semana
  contenido += 'ESTA SEMANA\n';
  contenido += '─'.repeat(80) + '\n';
  contenido += `Ganancias:              ${formatCurrency(stats.gananciasEstaSemana || 0)}\n`;
  contenido += `Turnos:                 ${stats.turnosEstaSemana || 0}\n`;
  contenido += `Días Trabajados:        ${stats.diasTrabajados || 0}\n\n`;

  // Trabajo Más Rentable
  if (stats.trabajoMasRentable) {
    contenido += 'TRABAJO MÁS RENTABLE\n';
    contenido += '─'.repeat(80) + '\n';
    contenido += `Nombre:                 ${stats.trabajoMasRentable.trabajo.nombre}\n`;
    contenido += `Ganancia:               ${formatCurrency(stats.trabajoMasRentable.ganancia)}\n`;
    contenido += `Turnos:                 ${stats.trabajoMasRentable.turnos}\n`;
    contenido += `Horas:                  ${stats.trabajoMasRentable.horas.toFixed(1)}h\n\n`;
  }

  // Detalle de Turnos
  contenido += 'DETALLE DE TURNOS\n';
  contenido += '═'.repeat(80) + '\n';
  contenido += 'Fecha        Trabajo                   Inicio   Fin      Horas    Ganancia    \n';
  contenido += '─'.repeat(80) + '\n';

  turnos.forEach((turno) => {
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return;

    const fechaFormato = formatDate(turno.fechaInicio || turno.fecha);
    const horas = calculateHours(turno.horaInicio, turno.horaFin);
    let ganancia = 0;
    if (turno.tipo === 'delivery') {
      ganancia = getShiftGrossEarnings(turno);
    } else {
      // For non-delivery shifts, we can't be sure without calculatePayment.
      // We'll use gananciaTotal if it exists.
      ganancia = turno.gananciaTotal || 0;
    }

    const fechaPad = fechaFormato.padEnd(12, ' ');
    const trabajoPad = trabajo.nombre.substring(0, 24).padEnd(25, ' ');
    const inicioPad = formatTime(turno.horaInicio).padEnd(8, ' ');
    const finPad = formatTime(turno.horaFin).padEnd(8, ' ');
    const horasPad = String(horas).padEnd(8, ' ');
    const gananciaPad = formatCurrency(ganancia).padEnd(12, ' ');

    contenido += `${fechaPad} ${trabajoPad} ${inicioPad} ${finPad} ${horasPad} ${gananciaPad}\n`;
  });

  contenido += '═'.repeat(80) + '\n';

  // Crear blob y descargar
  const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reporte-${fecha}.txt`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Generar reporte en formato PNG
 */
export const generatePNGReport = async (stats, turnos, trabajos) => {
  // Crear un elemento temporal en el DOM
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '800px';
  container.style.padding = '40px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  
  // Contenido HTML del reporte
  container.innerHTML = `
    <div style="max-width: 800px;">
      <!-- Header -->
      <div style="margin-bottom: 30px;">
        <h1 style="color: #EC4899; font-size: 32px; margin-bottom: 8px;">Reporte de Actividad</h1>
        <p style="color: #6B7280; font-size: 14px;">Generado el ${formatDate(new Date())}</p>
      </div>
      
      <div style="height: 2px; background: linear-gradient(to right, #EC4899, transparent); margin-bottom: 30px;"></div>
      
      <!-- Resumen General -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">Resumen General</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 5px;">Total Ganado</p>
            <p style="color: #1F2937; font-size: 24px; font-weight: bold;">${formatCurrency(stats.totalGanado || 0)}</p>
          </div>
          <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 5px;">Horas Trabajadas</p>
            <p style="color: #1F2937; font-size: 24px; font-weight: bold;">${(stats.horasTrabajadas || 0).toFixed(1)}h</p>
          </div>
          <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 5px;">Total Turnos</p>
            <p style="color: #1F2937; font-size: 24px; font-weight: bold;">${stats.turnosTotal || 0}</p>
          </div>
          <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 5px;">Promedio/Hora</p>
            <p style="color: #1F2937; font-size: 24px; font-weight: bold;">${formatCurrency(stats.promedioPorHora || 0)}</p>
          </div>
        </div>
      </div>
      
      <!-- Esta Semana -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">Esta Semana</h2>
        <div style="background: #FDF2F8; padding: 20px; border-radius: 8px; border-left: 4px solid #EC4899;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #6B7280;">Ganancias:</span>
            <span style="color: #1F2937; font-weight: bold;">${formatCurrency(stats.gananciasEstaSemana || 0)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #6B7280;">Turnos:</span>
            <span style="color: #1F2937; font-weight: bold;">${stats.turnosEstaSemana || 0}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6B7280;">Días Trabajados:</span>
            <span style="color: #1F2937; font-weight: bold;">${stats.diasTrabajados || 0}</span>
          </div>
        </div>
      </div>
      
      <!-- Trabajo Más Rentable -->
      ${stats.trabajoMasRentable ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">Trabajo Más Rentable</h2>
          <div style="background: #FFFBEB; padding: 20px; border-radius: 8px; border-left: 4px solid #F59E0B;">
            <p style="color: #1F2937; font-size: 18px; font-weight: bold; margin-bottom: 5px;">${stats.trabajoMasRentable.trabajo.nombre}</p>
            <p style="color: #F59E0B; font-size: 24px; font-weight: bold; margin-bottom: 5px;">${formatCurrency(stats.trabajoMasRentable.ganancia)}</p>
            <p style="color: #6B7280; font-size: 12px;">${stats.trabajoMasRentable.turnos} turnos • ${stats.trabajoMasRentable.horas.toFixed(1)}h</p>
          </div>
        </div>
      ` : ''}
      
      <!-- Últimos Turnos -->
      <div>
        <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">Últimos Turnos</h2>
        <div style="space-y: 10px;">
          ${turnos.slice(0, 5).map(turno => {
            const trabajo = trabajos.find(t => t.id === turno.trabajoId);
            if (!trabajo) return '';
            const fecha = turno.fechaInicio || turno.fecha;
            return `
              <div style="background: #F9FAFB; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                <p style="color: #1F2937; font-weight: bold; margin-bottom: 5px;">${trabajo.nombre}</p>
                <p style="color: #6B7280; font-size: 14px;">${formatDate(fecha)} • ${turno.horaInicio} - ${turno.horaFin}</p>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(container);
  
  try {
    // Generar canvas desde el HTML
    const canvas = await html2canvas(container, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false
    });
    
    // Convertir a imagen y descargar
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
      URL.revokeObjectURL(url);
    });
  } finally {
    // Limpiar el elemento temporal
    document.body.removeChild(container);
  }
};