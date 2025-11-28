// src/services/exportService.js

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx-js-style';

// Función para formatear moneda
const formatCurrency = (amount) => ***REMOVED***
  return `$$***REMOVED***amount.toFixed(2)***REMOVED***`;
***REMOVED***;

// Función para formatear fecha
const formatDate = (date) => ***REMOVED***
  return new Date(date).toLocaleDateString('es-ES', ***REMOVED***
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  ***REMOVED***);
***REMOVED***;

// Función para formatear hora
const formatTime = (time) => ***REMOVED***
  return time || 'N/A';
***REMOVED***;

// Función para calcular horas trabajadas
const calculateHours = (horaInicio, horaFin) => ***REMOVED***
  if (!horaInicio || !horaFin) return 0;

  const [inicioHoras, inicioMinutos] = horaInicio.split(':').map(Number);
  const [finHoras, finMinutos] = horaFin.split(':').map(Number);

  const inicioEnMinutos = inicioHoras * 60 + inicioMinutos;
  const finEnMinutos = finHoras * 60 + finMinutos;

  const diferenciaMinutos = finEnMinutos - inicioEnMinutos;
  return (diferenciaMinutos / 60).toFixed(2);
***REMOVED***;

/**
 * Generar reporte en formato PDF
 */
export const generatePDFReport = async (stats, turnos, trabajos) => ***REMOVED***
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
  doc.text(`Generado el $***REMOVED***formatDate(new Date())***REMOVED***`, margin, yPosition);
  
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
    ['Horas Trabajadas:', `$***REMOVED***(stats.horasTrabajadas || 0).toFixed(1)***REMOVED***h`],
    ['Total de Turnos:', stats.turnosTotal || 0],
    ['Promedio por Hora:', formatCurrency(stats.promedioPorHora || 0)]
  ];
  
  resumenData.forEach(([label, value]) => ***REMOVED***
    doc.text(label, margin + 5, yPosition);
    doc.setFont(undefined, 'bold');
    doc.text(String(value), margin + 70, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 7;
  ***REMOVED***);
  
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
  
  semanaData.forEach(([label, value]) => ***REMOVED***
    doc.text(label, margin + 5, yPosition);
    doc.setFont(undefined, 'bold');
    doc.text(String(value), margin + 70, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 7;
  ***REMOVED***);
  
  yPosition += 8;
  
  // SECCIÓN: Trabajo Más Rentable
  if (stats.trabajoMasRentable) ***REMOVED***
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
    doc.text(`$***REMOVED***stats.trabajoMasRentable.turnos***REMOVED*** turnos • $***REMOVED***stats.trabajoMasRentable.horas.toFixed(1)***REMOVED***h`, margin + 5, yPosition);
    doc.setTextColor(...textColor);
    
    yPosition += 10;
  ***REMOVED***
  
  // SECCIÓN: Últimos Turnos
  yPosition += 5;
  doc.setFontSize(16);
  doc.text('Últimos Turnos', margin, yPosition);
  
  yPosition += 10;
  
  // Mostrar últimos 5 turnos
  const ultimosTurnos = turnos.slice(0, 5);
  
  doc.setFontSize(9);
  ultimosTurnos.forEach((turno) => ***REMOVED***
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
    doc.text(`$***REMOVED***formatDate(fecha)***REMOVED*** • $***REMOVED***turno.horaInicio***REMOVED*** - $***REMOVED***turno.horaFin***REMOVED***`, margin + 5, yPosition);
    doc.setTextColor(...textColor);
    
    yPosition += 8;
    
    // Verificar si necesitamos nueva página
    if (yPosition > 250) ***REMOVED***
      doc.addPage();
      yPosition = 20;
    ***REMOVED***
  ***REMOVED***);
  
  // Pie de página
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) ***REMOVED***
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text(
      `Página $***REMOVED***i***REMOVED*** de $***REMOVED***totalPages***REMOVED***`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      ***REMOVED*** align: 'center' ***REMOVED***
    );
  ***REMOVED***
  
  // Descargar PDF
  doc.save(`reporte-$***REMOVED***new Date().toISOString().split('T')[0]***REMOVED***.pdf`);
***REMOVED***;

// Función auxiliar para calcular ganancia correcta
const calcularGananciaCorrecta = (turno, trabajo, calculatePayment) => ***REMOVED***
  if (!turno || !trabajo) return 0;

  if (turno.tipo === 'delivery' || trabajo.tipo === 'delivery') ***REMOVED***
    return turno.gananciaTotal || 0;
  ***REMOVED***

  if (typeof calculatePayment === 'function') ***REMOVED***
    const resultado = calculatePayment(turno);
    return resultado.totalWithDiscount || resultado.totalConDescuento || 0;
  ***REMOVED***

  const horas = calculateHours(turno.horaInicio, turno.horaFin);
  return horas * (trabajo.tarifaBase || 0);
***REMOVED***;

// Estilos para el Excel
const estilos = ***REMOVED***
  // Encabezado principal (títulos de secciones)
  encabezadoPrincipal: ***REMOVED***
    font: ***REMOVED*** bold: true, size: 14, color: ***REMOVED*** rgb: "FFFFFF" ***REMOVED*** ***REMOVED***,
    fill: ***REMOVED*** fgColor: ***REMOVED*** rgb: "EC4899" ***REMOVED*** ***REMOVED***, // Rosa
    alignment: ***REMOVED*** horizontal: "center", vertical: "center" ***REMOVED***,
    border: ***REMOVED***
      top: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "000000" ***REMOVED*** ***REMOVED***,
      bottom: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "000000" ***REMOVED*** ***REMOVED***,
      left: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "000000" ***REMOVED*** ***REMOVED***,
      right: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "000000" ***REMOVED*** ***REMOVED***
    ***REMOVED***
  ***REMOVED***,

  // Encabezado de tabla
  encabezadoTabla: ***REMOVED***
    font: ***REMOVED*** bold: true, size: 11, color: ***REMOVED*** rgb: "FFFFFF" ***REMOVED*** ***REMOVED***,
    fill: ***REMOVED*** fgColor: ***REMOVED*** rgb: "4472C4" ***REMOVED*** ***REMOVED***, // Azul
    alignment: ***REMOVED*** horizontal: "center", vertical: "center", wrapText: true ***REMOVED***,
    border: ***REMOVED***
      top: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "000000" ***REMOVED*** ***REMOVED***,
      bottom: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "000000" ***REMOVED*** ***REMOVED***,
      left: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "000000" ***REMOVED*** ***REMOVED***,
      right: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "000000" ***REMOVED*** ***REMOVED***
    ***REMOVED***
  ***REMOVED***,

  // Subtítulo (resumen del mes)
  subtitulo: ***REMOVED***
    font: ***REMOVED*** bold: true, size: 12, color: ***REMOVED*** rgb: "1F2937" ***REMOVED*** ***REMOVED***,
    fill: ***REMOVED*** fgColor: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***, // Gris claro
    alignment: ***REMOVED*** horizontal: "left", vertical: "center" ***REMOVED***,
    border: ***REMOVED***
      bottom: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "9CA3AF" ***REMOVED*** ***REMOVED***
    ***REMOVED***
  ***REMOVED***,

  // Celda normal (fila par - blanca)
  celdaNormalPar: ***REMOVED***
    font: ***REMOVED*** size: 10, color: ***REMOVED*** rgb: "1F2937" ***REMOVED*** ***REMOVED***,
    fill: ***REMOVED*** fgColor: ***REMOVED*** rgb: "FFFFFF" ***REMOVED*** ***REMOVED***,
    alignment: ***REMOVED*** horizontal: "left", vertical: "center" ***REMOVED***,
    border: ***REMOVED***
      top: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***,
      bottom: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***,
      left: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***,
      right: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***
    ***REMOVED***
  ***REMOVED***,

  // Celda normal (fila impar - gris claro)
  celdaNormalImpar: ***REMOVED***
    font: ***REMOVED*** size: 10, color: ***REMOVED*** rgb: "1F2937" ***REMOVED*** ***REMOVED***,
    fill: ***REMOVED*** fgColor: ***REMOVED*** rgb: "F9FAFB" ***REMOVED*** ***REMOVED***, // Gris muy claro
    alignment: ***REMOVED*** horizontal: "left", vertical: "center" ***REMOVED***,
    border: ***REMOVED***
      top: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***,
      bottom: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***,
      left: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***,
      right: ***REMOVED*** style: "thin", color: ***REMOVED*** rgb: "E5E7EB" ***REMOVED*** ***REMOVED***
    ***REMOVED***
  ***REMOVED***,

  // Celda de moneda
  celdaMoneda: ***REMOVED***
    numFmt: "$#,##0.00"
  ***REMOVED***,

  // Celda de número decimal
  celdaDecimal: ***REMOVED***
    numFmt: "0.00"
  ***REMOVED***,

  // Celda centrada
  celdaCentrada: ***REMOVED***
    alignment: ***REMOVED*** horizontal: "center", vertical: "center" ***REMOVED***
  ***REMOVED***,

  // Etiqueta (para resumen)
  etiqueta: ***REMOVED***
    font: ***REMOVED*** bold: true, size: 11, color: ***REMOVED*** rgb: "374151" ***REMOVED*** ***REMOVED***,
    alignment: ***REMOVED*** horizontal: "left", vertical: "center" ***REMOVED***
  ***REMOVED***,

  // Valor (para resumen)
  valor: ***REMOVED***
    font: ***REMOVED*** size: 11, color: ***REMOVED*** rgb: "1F2937" ***REMOVED*** ***REMOVED***,
    alignment: ***REMOVED*** horizontal: "right", vertical: "center" ***REMOVED***
  ***REMOVED***
***REMOVED***;

// Función para aplicar estilo a una celda
const aplicarEstilo = (worksheet, celda, estilo) => ***REMOVED***
  if (!worksheet[celda]) ***REMOVED***
    worksheet[celda] = ***REMOVED*** t: 's', v: '' ***REMOVED***;
  ***REMOVED***
  worksheet[celda].s = estilo;
***REMOVED***;

// Función para aplicar estilo a un rango de celdas
const aplicarEstiloRango = (worksheet, rangoInicio, rangoFin, estilo) => ***REMOVED***
  const colInicio = rangoInicio.charCodeAt(0);
  const colFin = rangoFin.charCodeAt(0);
  const filaInicio = parseInt(rangoInicio.substring(1));
  const filaFin = parseInt(rangoFin.substring(1));

  for (let col = colInicio; col <= colFin; col++) ***REMOVED***
    for (let fila = filaInicio; fila <= filaFin; fila++) ***REMOVED***
      const celda = String.fromCharCode(col) + fila;
      aplicarEstilo(worksheet, celda, estilo);
    ***REMOVED***
  ***REMOVED***
***REMOVED***;

// Función para combinar celdas
const combinarCeldas = (worksheet, rango) => ***REMOVED***
  if (!worksheet['!merges']) ***REMOVED***
    worksheet['!merges'] = [];
  ***REMOVED***

  const match = rango.match(/([A-Z]+)(\d+):([A-Z]+)(\d+)/);
  if (match) ***REMOVED***
    const [, colInicio, filaInicio, colFin, filaFin] = match;
    worksheet['!merges'].push(***REMOVED***
      s: ***REMOVED*** c: colInicio.charCodeAt(0) - 65, r: parseInt(filaInicio) - 1 ***REMOVED***,
      e: ***REMOVED*** c: colFin.charCodeAt(0) - 65, r: parseInt(filaFin) - 1 ***REMOVED***
    ***REMOVED***);
  ***REMOVED***
***REMOVED***;

/**
 * Generar reporte en formato XLSX
 */
export const generateXLSXReport = async (stats, turnos, trabajos, calculatePayment) => ***REMOVED***
  const workbook = XLSX.utils.book_new();

  const resumenSheet = [
    ['REPORTE DE ACTIVIDAD'],
    [`Generado el $***REMOVED***formatDate(new Date())***REMOVED***`],
    [],
    ['RESUMEN GENERAL'],
    ['Total Ganado', formatCurrency(stats.totalGanado || 0)],
    ['Horas Trabajadas', `$***REMOVED***(stats.horasTrabajadas || 0).toFixed(1)***REMOVED***h`],
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
      ['Horas', `$***REMOVED***stats.trabajoMasRentable.horas.toFixed(1)***REMOVED***h`]
    ] : [])
  ];

  const wsResumen = XLSX.utils.aoa_to_sheet(resumenSheet);

  wsResumen['A1'].s = ***REMOVED***
    font: ***REMOVED*** bold: true, size: 16, color: ***REMOVED*** rgb: "EC4899" ***REMOVED*** ***REMOVED***,
    alignment: ***REMOVED*** horizontal: "center", vertical: "center" ***REMOVED***
  ***REMOVED***;

  wsResumen['A2'].s = ***REMOVED***
    font: ***REMOVED*** size: 10, color: ***REMOVED*** rgb: "6B7280" ***REMOVED***, italic: true ***REMOVED***,
    alignment: ***REMOVED*** horizontal: "center", vertical: "center" ***REMOVED***
  ***REMOVED***;

  ['A4', 'A10', 'A15'].forEach(celda => ***REMOVED***
    if (wsResumen[celda]) ***REMOVED***
      wsResumen[celda].s = estilos.subtitulo;
    ***REMOVED***
  ***REMOVED***);

  [[5, 8], [11, 13], [16, 19]].forEach(([inicio, fin]) => ***REMOVED***
    for (let i = inicio; i <= fin; i++) ***REMOVED***
      const celdaA = `A$***REMOVED***i***REMOVED***`;
      const celdaB = `B$***REMOVED***i***REMOVED***`;
      if (wsResumen[celdaA]) ***REMOVED***
        wsResumen[celdaA].s = estilos.etiqueta;
      ***REMOVED***
      if (wsResumen[celdaB]) ***REMOVED***
        wsResumen[celdaB].s = estilos.valor;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);

  wsResumen['!cols'] = [
    ***REMOVED*** wch: 25 ***REMOVED***,
    ***REMOVED*** wch: 20 ***REMOVED***
  ];

  if (!wsResumen['!merges']) wsResumen['!merges'] = [];
  wsResumen['!merges'].push(
    ***REMOVED*** s: ***REMOVED*** c: 0, r: 0 ***REMOVED***, e: ***REMOVED*** c: 1, r: 0 ***REMOVED*** ***REMOVED***,
    ***REMOVED*** s: ***REMOVED*** c: 0, r: 1 ***REMOVED***, e: ***REMOVED*** c: 1, r: 1 ***REMOVED*** ***REMOVED***
  );

  XLSX.utils.book_append_sheet(workbook, wsResumen, 'Resumen');

  const turnosPorMes = ***REMOVED******REMOVED***;

  const formatFecha = (fecha) => ***REMOVED***
    if (!fecha) return '';
    if (fecha.seconds) ***REMOVED***
      return formatDate(new Date(fecha.seconds * 1000));
    ***REMOVED***
    return formatDate(new Date(fecha));
  ***REMOVED***;

  turnos.forEach((turno) => ***REMOVED***
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return;

    const fecha = new Date(turno.fechaInicio || turno.fecha);
    const mesAnio = fecha.toLocaleDateString('es-ES', ***REMOVED*** year: 'numeric', month: 'long' ***REMOVED***);

    if (!turnosPorMes[mesAnio]) ***REMOVED***
      turnosPorMes[mesAnio] = ***REMOVED*** tradicionales: [], delivery: [] ***REMOVED***;
    ***REMOVED***

    const esDelivery = turno.tipo === 'delivery' || trabajo.tipo === 'delivery';

    let ganancia = 0;
    let horas = 0;
    let breakdown = null;

    if (esDelivery) ***REMOVED***
      ganancia = turno.gananciaTotal || 0;
      horas = parseFloat(calculateHours(turno.horaInicio, turno.horaFin));
    ***REMOVED*** else ***REMOVED***
      if (typeof calculatePayment === 'function') ***REMOVED***
        const resultado = calculatePayment(turno);
        ganancia = resultado.totalWithDiscount || 0;
        horas = resultado.hours || 0;
        breakdown = resultado.breakdown || null;
      ***REMOVED*** else ***REMOVED***
        horas = parseFloat(calculateHours(turno.horaInicio, turno.horaFin));
        ganancia = horas * (trabajo.tarifaBase || 0);
      ***REMOVED***
    ***REMOVED***

    const turnoBase = ***REMOVED***
      id: turno.id || '',
      fecha: formatDate(fecha),
      diaSemana: fecha.toLocaleDateString('es-ES', ***REMOVED*** weekday: 'long' ***REMOVED***),
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
    ***REMOVED***;

    if (esDelivery) ***REMOVED***
      const turnoDelivery = ***REMOVED***
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
      ***REMOVED***;
      turnosPorMes[mesAnio].delivery.push(turnoDelivery);
    ***REMOVED*** else ***REMOVED***
      const turnoTradicional = ***REMOVED***
        ...turnoBase,
        tarifa: trabajo.tarifa || trabajo.tarifaBase || 0,
        breakdown: breakdown
      ***REMOVED***;
      turnosPorMes[mesAnio].tradicionales.push(turnoTradicional);
    ***REMOVED***
  ***REMOVED***);

  const mesesOrdenados = Object.keys(turnosPorMes).sort((a, b) => ***REMOVED***
    const [mesA, anioA] = a.split(' de ');
    const [mesB, anioB] = b.split(' de ');
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const fechaA = new Date(parseInt(anioA), meses.indexOf(mesA.toLowerCase()));
    const fechaB = new Date(parseInt(anioB), meses.indexOf(mesB.toLowerCase()));
    return fechaB - fechaA;
  ***REMOVED***);

  mesesOrdenados.forEach((mesAnio) => ***REMOVED***
    const ***REMOVED*** tradicionales, delivery ***REMOVED*** = turnosPorMes[mesAnio];
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
      ['Total Horas Trabajadas', `$***REMOVED***totalHorasMes.toFixed(2)***REMOVED***h`],
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

    if (tradicionales.length > 0) ***REMOVED***
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

      tradicionales.forEach((turno) => ***REMOVED***
        const breakdown = turno.breakdown || ***REMOVED******REMOVED***;
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
      ***REMOVED***);

      mesData.push([]);
    ***REMOVED***

    if (delivery.length > 0) ***REMOVED***
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

      delivery.forEach((turno) => ***REMOVED***
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
      ***REMOVED***);
    ***REMOVED***

    const wsMes = XLSX.utils.aoa_to_sheet(mesData);

    wsMes['!cols'] = [
      ***REMOVED*** wch: 15 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 20 ***REMOVED***,
      ***REMOVED*** wch: 15 ***REMOVED***,
      ***REMOVED*** wch: 15 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 10 ***REMOVED***,
      ***REMOVED*** wch: 15 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 10 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 10 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 12 ***REMOVED***,
      ***REMOVED*** wch: 30 ***REMOVED***,
      ***REMOVED*** wch: 15 ***REMOVED***,
      ***REMOVED*** wch: 15 ***REMOVED***
    ];

    const nombreHoja = mesAnio.substring(0, 31);
    XLSX.utils.book_append_sheet(workbook, wsMes, nombreHoja);
  ***REMOVED***);

  XLSX.writeFile(workbook, `reporte-detallado-$***REMOVED***new Date().toISOString().split('T')[0]***REMOVED***.xlsx`);
***REMOVED***;

/**
 * Generar reporte en formato TXT
 */
export const generateTXTReport = async (stats, turnos, trabajos) => ***REMOVED***
  const fecha = new Date().toISOString().split('T')[0];
  let contenido = '';

  // Encabezado
  contenido += '═'.repeat(80) + '\n';
  contenido += 'REPORTE DE ACTIVIDAD\n';
  contenido += `Generado el $***REMOVED***formatDate(new Date())***REMOVED***\n`;
  contenido += '═'.repeat(80) + '\n\n';

  // Resumen General
  contenido += 'RESUMEN GENERAL\n';
  contenido += '─'.repeat(80) + '\n';
  contenido += `Total Ganado:           $***REMOVED***formatCurrency(stats.totalGanado || 0)***REMOVED***\n`;
  contenido += `Horas Trabajadas:       $***REMOVED***(stats.horasTrabajadas || 0).toFixed(1)***REMOVED***h\n`;
  contenido += `Total de Turnos:        $***REMOVED***stats.turnosTotal || 0***REMOVED***\n`;
  contenido += `Promedio por Hora:      $***REMOVED***formatCurrency(stats.promedioPorHora || 0)***REMOVED***\n\n`;

  // Esta Semana
  contenido += 'ESTA SEMANA\n';
  contenido += '─'.repeat(80) + '\n';
  contenido += `Ganancias:              $***REMOVED***formatCurrency(stats.gananciasEstaSemana || 0)***REMOVED***\n`;
  contenido += `Turnos:                 $***REMOVED***stats.turnosEstaSemana || 0***REMOVED***\n`;
  contenido += `Días Trabajados:        $***REMOVED***stats.diasTrabajados || 0***REMOVED***\n\n`;

  // Trabajo Más Rentable
  if (stats.trabajoMasRentable) ***REMOVED***
    contenido += 'TRABAJO MÁS RENTABLE\n';
    contenido += '─'.repeat(80) + '\n';
    contenido += `Nombre:                 $***REMOVED***stats.trabajoMasRentable.trabajo.nombre***REMOVED***\n`;
    contenido += `Ganancia:               $***REMOVED***formatCurrency(stats.trabajoMasRentable.ganancia)***REMOVED***\n`;
    contenido += `Turnos:                 $***REMOVED***stats.trabajoMasRentable.turnos***REMOVED***\n`;
    contenido += `Horas:                  $***REMOVED***stats.trabajoMasRentable.horas.toFixed(1)***REMOVED***h\n\n`;
  ***REMOVED***

  // Detalle de Turnos
  contenido += 'DETALLE DE TURNOS\n';
  contenido += '═'.repeat(80) + '\n';
  contenido += 'Fecha        Trabajo                   Inicio   Fin      Horas    Ganancia    \n';
  contenido += '─'.repeat(80) + '\n';

  turnos.forEach((turno) => ***REMOVED***
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return;

    const fechaFormato = formatDate(turno.fechaInicio || turno.fecha);
    const horas = calculateHours(turno.horaInicio, turno.horaFin);
    const ganancia = turno.ganancia || 0;

    const fechaPad = fechaFormato.padEnd(12, ' ');
    const trabajoPad = trabajo.nombre.substring(0, 24).padEnd(25, ' ');
    const inicioPad = formatTime(turno.horaInicio).padEnd(8, ' ');
    const finPad = formatTime(turno.horaFin).padEnd(8, ' ');
    const horasPad = String(horas).padEnd(8, ' ');
    const gananciaPad = formatCurrency(ganancia).padEnd(12, ' ');

    contenido += `$***REMOVED***fechaPad***REMOVED*** $***REMOVED***trabajoPad***REMOVED*** $***REMOVED***inicioPad***REMOVED*** $***REMOVED***finPad***REMOVED*** $***REMOVED***horasPad***REMOVED*** $***REMOVED***gananciaPad***REMOVED***\n`;
  ***REMOVED***);

  contenido += '═'.repeat(80) + '\n';

  // Crear blob y descargar
  const blob = new Blob([contenido], ***REMOVED*** type: 'text/plain;charset=utf-8' ***REMOVED***);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reporte-$***REMOVED***fecha***REMOVED***.txt`;
  link.click();
  URL.revokeObjectURL(url);
***REMOVED***;

/**
 * Generar reporte en formato PNG
 */
export const generatePNGReport = async (stats, turnos, trabajos) => ***REMOVED***
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
        <p style="color: #6B7280; font-size: 14px;">Generado el $***REMOVED***formatDate(new Date())***REMOVED***</p>
      </div>
      
      <div style="height: 2px; background: linear-gradient(to right, #EC4899, transparent); margin-bottom: 30px;"></div>
      
      <!-- Resumen General -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">Resumen General</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 5px;">Total Ganado</p>
            <p style="color: #1F2937; font-size: 24px; font-weight: bold;">$***REMOVED***formatCurrency(stats.totalGanado || 0)***REMOVED***</p>
          </div>
          <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 5px;">Horas Trabajadas</p>
            <p style="color: #1F2937; font-size: 24px; font-weight: bold;">$***REMOVED***(stats.horasTrabajadas || 0).toFixed(1)***REMOVED***h</p>
          </div>
          <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 5px;">Total Turnos</p>
            <p style="color: #1F2937; font-size: 24px; font-weight: bold;">$***REMOVED***stats.turnosTotal || 0***REMOVED***</p>
          </div>
          <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 5px;">Promedio/Hora</p>
            <p style="color: #1F2937; font-size: 24px; font-weight: bold;">$***REMOVED***formatCurrency(stats.promedioPorHora || 0)***REMOVED***</p>
          </div>
        </div>
      </div>
      
      <!-- Esta Semana -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">Esta Semana</h2>
        <div style="background: #FDF2F8; padding: 20px; border-radius: 8px; border-left: 4px solid #EC4899;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #6B7280;">Ganancias:</span>
            <span style="color: #1F2937; font-weight: bold;">$***REMOVED***formatCurrency(stats.gananciasEstaSemana || 0)***REMOVED***</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #6B7280;">Turnos:</span>
            <span style="color: #1F2937; font-weight: bold;">$***REMOVED***stats.turnosEstaSemana || 0***REMOVED***</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6B7280;">Días Trabajados:</span>
            <span style="color: #1F2937; font-weight: bold;">$***REMOVED***stats.diasTrabajados || 0***REMOVED***</span>
          </div>
        </div>
      </div>
      
      <!-- Trabajo Más Rentable -->
      $***REMOVED***stats.trabajoMasRentable ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">Trabajo Más Rentable</h2>
          <div style="background: #FFFBEB; padding: 20px; border-radius: 8px; border-left: 4px solid #F59E0B;">
            <p style="color: #1F2937; font-size: 18px; font-weight: bold; margin-bottom: 5px;">$***REMOVED***stats.trabajoMasRentable.trabajo.nombre***REMOVED***</p>
            <p style="color: #F59E0B; font-size: 24px; font-weight: bold; margin-bottom: 5px;">$***REMOVED***formatCurrency(stats.trabajoMasRentable.ganancia)***REMOVED***</p>
            <p style="color: #6B7280; font-size: 12px;">$***REMOVED***stats.trabajoMasRentable.turnos***REMOVED*** turnos • $***REMOVED***stats.trabajoMasRentable.horas.toFixed(1)***REMOVED***h</p>
          </div>
        </div>
      ` : ''***REMOVED***
      
      <!-- Últimos Turnos -->
      <div>
        <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">Últimos Turnos</h2>
        <div style="space-y: 10px;">
          $***REMOVED***turnos.slice(0, 5).map(turno => ***REMOVED***
            const trabajo = trabajos.find(t => t.id === turno.trabajoId);
            if (!trabajo) return '';
            const fecha = turno.fechaInicio || turno.fecha;
            return `
              <div style="background: #F9FAFB; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                <p style="color: #1F2937; font-weight: bold; margin-bottom: 5px;">$***REMOVED***trabajo.nombre***REMOVED***</p>
                <p style="color: #6B7280; font-size: 14px;">$***REMOVED***formatDate(fecha)***REMOVED*** • $***REMOVED***turno.horaInicio***REMOVED*** - $***REMOVED***turno.horaFin***REMOVED***</p>
              </div>
            `;
          ***REMOVED***).join('')***REMOVED***
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(container);
  
  try ***REMOVED***
    // Generar canvas desde el HTML
    const canvas = await html2canvas(container, ***REMOVED***
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false
    ***REMOVED***);
    
    // Convertir a imagen y descargar
    canvas.toBlob((blob) => ***REMOVED***
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-$***REMOVED***new Date().toISOString().split('T')[0]***REMOVED***.png`;
      link.click();
      URL.revokeObjectURL(url);
    ***REMOVED***);
  ***REMOVED*** finally ***REMOVED***
    // Limpiar el elemento temporal
    document.body.removeChild(container);
  ***REMOVED***
***REMOVED***;