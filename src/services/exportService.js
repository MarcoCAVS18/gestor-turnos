// src/services/exportService.js

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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