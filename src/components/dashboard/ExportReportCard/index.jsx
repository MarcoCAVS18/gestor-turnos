// src/components/dashboard/ExportReportCard/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Download, FileText, Image, FileSpreadsheet ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';
import New from '../../ui/New';
import Flex from '../../ui/Flex';

const ExportReportCard = (***REMOVED*** onExport ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => ***REMOVED***
    setIsExporting(true);
    
    try ***REMOVED***
      // Llamar a la función de exportación con el formato seleccionado
      await onExport(selectedFormat);
      
      // Esperar un momento para la animación
      setTimeout(() => ***REMOVED***
        setIsExporting(false);
      ***REMOVED***, 2000);
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al exportar:', error);
      setIsExporting(false);
    ***REMOVED***
  ***REMOVED***;

  return (
    <Card variant="transparent" className="relative overflow-hidden">
      <Flex variant="between">
        ***REMOVED***/* Lado izquierdo: Texto y selector de formato */***REMOVED***
        <div className="flex-1 pr-4">
          <Flex variant="center" className="gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Exportar Reporte</h3>
            <New size="xs" />
          </Flex>
          <p className="text-sm text-gray-700 mb-4">
            Descargá un resumen completo de tus estadísticas, turnos y actividad
          </p>

          ***REMOVED***/* Selector de formato */***REMOVED***
          <div className="flex gap-2 flex-wrap">
            <button
              onClick=***REMOVED***() => setSelectedFormat('pdf')***REMOVED***
              disabled=***REMOVED***isExporting***REMOVED***
              className=***REMOVED***`flex items-center gap-2 px-4 py-2 rounded-lg transition-all $***REMOVED***
                selectedFormat === 'pdf'
                  ? 'text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ***REMOVED***`***REMOVED***
              style=***REMOVED***selectedFormat === 'pdf' ? ***REMOVED*** backgroundColor: colors.primary ***REMOVED*** : ***REMOVED******REMOVED******REMOVED***
            >
              <FileText size=***REMOVED***16***REMOVED*** />
              <span className="text-sm font-medium">PDF</span>
            </button>

            <button
              onClick=***REMOVED***() => setSelectedFormat('png')***REMOVED***
              disabled=***REMOVED***isExporting***REMOVED***
              className=***REMOVED***`flex items-center gap-2 px-4 py-2 rounded-lg transition-all $***REMOVED***
                selectedFormat === 'png'
                  ? 'text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ***REMOVED***`***REMOVED***
              style=***REMOVED***selectedFormat === 'png' ? ***REMOVED*** backgroundColor: colors.primary ***REMOVED*** : ***REMOVED******REMOVED******REMOVED***
            >
              <Image size=***REMOVED***16***REMOVED*** />
              <span className="text-sm font-medium">PNG</span>
            </button>

            <button
              onClick=***REMOVED***() => setSelectedFormat('xlsx')***REMOVED***
              disabled=***REMOVED***isExporting***REMOVED***
              className=***REMOVED***`flex items-center gap-2 px-4 py-2 rounded-lg transition-all $***REMOVED***
                selectedFormat === 'xlsx'
                  ? 'text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ***REMOVED***`***REMOVED***
              style=***REMOVED***selectedFormat === 'xlsx' ? ***REMOVED*** backgroundColor: colors.primary ***REMOVED*** : ***REMOVED******REMOVED******REMOVED***
            >
              <FileSpreadsheet size=***REMOVED***16***REMOVED*** />
              <span className="text-sm font-medium">Excel</span>
            </button>
          </div>
        </div>

        ***REMOVED***/* Lado derecho: Botón de descarga con animación */***REMOVED***
        <div className="flex-shrink-0">
          <button
            onClick=***REMOVED***handleExport***REMOVED***
            disabled=***REMOVED***isExporting***REMOVED***
            className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-2 group"
            style=***REMOVED******REMOVED*** 
              borderColor: colors.primary,
              color: colors.primary
            ***REMOVED******REMOVED***
            onMouseEnter=***REMOVED***(e) => ***REMOVED***
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.color = 'white';
            ***REMOVED******REMOVED***
            onMouseLeave=***REMOVED***(e) => ***REMOVED***
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.primary;
            ***REMOVED******REMOVED***
          >
            ***REMOVED***!isExporting ? (
              <Download size=***REMOVED***24***REMOVED*** className="transition-colors" />
            ) : (
              <Flex variant="center" className="relative w-full h-full">
                ***REMOVED***/* Icono de descarga animado */***REMOVED***
                <div 
                  className="absolute"
                  style=***REMOVED******REMOVED***
                    animation: 'downloadAnimation 0.8s ease-in infinite',
                    color: colors.primary
                  ***REMOVED******REMOVED***
                >
                  <Download size=***REMOVED***24***REMOVED*** />
                </div>
                
                ***REMOVED***/* Círculo de progreso */***REMOVED***
                <div
                  className="absolute inset-0 rounded-full border-2 border-gray-300"
                  style=***REMOVED******REMOVED***
                    borderTopColor: colors.primary,
                    animation: 'spin 1s linear infinite'
                  ***REMOVED******REMOVED***
                />
              </Flex>
            )***REMOVED***
          </button>
        </div>
      </Flex>

      ***REMOVED***isExporting && (
        <div className="mt-4 pt-4 border-t border-gray-300 animate-fadeIn">
          <Flex variant="center" className="gap-2 text-sm">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
            />
            <span className="text-gray-800 font-medium">
              Generando tu reporte en ***REMOVED***selectedFormat.toUpperCase()***REMOVED***...
            </span>
          </Flex>
        </div>
      )***REMOVED***
      
      <style>***REMOVED***`
        @keyframes downloadAnimation ***REMOVED***
          0% ***REMOVED***
            opacity: 1;
            transform: translateY(0);
          ***REMOVED***
          100% ***REMOVED***
            opacity: 0;
            transform: translateY(30px);
          ***REMOVED***
        ***REMOVED***
        
        @keyframes spin ***REMOVED***
          to ***REMOVED***
            transform: rotate(360deg);
          ***REMOVED***
        ***REMOVED***
        
        @keyframes fadeIn ***REMOVED***
          from ***REMOVED***
            opacity: 0;
            height: 0;
          ***REMOVED***
          to ***REMOVED***
            opacity: 1;
            height: auto;
          ***REMOVED***
        ***REMOVED***
        
        .animate-fadeIn ***REMOVED***
          animation: fadeIn 0.3s ease-out;
        ***REMOVED***
      `***REMOVED***</style>
    </Card>
  );
***REMOVED***;

export default ExportReportCard;