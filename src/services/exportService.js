// src/services/exportService.js

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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