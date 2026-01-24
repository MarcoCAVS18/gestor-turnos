// src/components/dashboard/ExportReportCard/index.jsx

import React, { useState } from 'react';
import { Download, FileText, Image, FileSpreadsheet } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Card from '../../ui/Card';
import Flex from '../../ui/Flex';
// import './index.css'; // <--- Descomenta esta línea cuando hayas creado el archivo CSS correctamente

const ExportReportCard = ({ onExport }) => {
  const colors = useThemeColors();
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Call the export function with the selected format
      await onExport(selectedFormat);
      
      // Wait a moment for the animation
      setTimeout(() => {
        setIsExporting(false);
      }, 2000);
    } catch (error) {
      console.error('Error exporting:', error);
      setIsExporting(false);
    }
  };

  return (
    <Card variant="transparent" className="relative overflow-hidden">
      <Flex variant="between">
        {/* Left side: Text and format selector */}
        <div className="flex-1 pr-4">
          <Flex variant="start" className="gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Export Report</h3>
          </Flex>
          <p className="text-sm text-gray-700 mb-4">
            Download a complete summary of your statistics, shifts, and activity
          </p>

          {/* Format selector */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedFormat('pdf')}
              disabled={isExporting}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedFormat === 'pdf'
                  ? 'text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              style={selectedFormat === 'pdf' ? { backgroundColor: colors.primary } : {}}
            >
              <FileText size={16} />
              <span className="text-sm font-medium">PDF</span>
            </button>

            <button
              onClick={() => setSelectedFormat('png')}
              disabled={isExporting}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedFormat === 'png'
                  ? 'text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              style={selectedFormat === 'png' ? { backgroundColor: colors.primary } : {}}
            >
              <Image size={16} />
              <span className="text-sm font-medium">PNG</span>
            </button>

            <button
              onClick={() => setSelectedFormat('xlsx')}
              disabled={isExporting}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedFormat === 'xlsx'
                  ? 'text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              style={selectedFormat === 'xlsx' ? { backgroundColor: colors.primary } : {}}
            >
              <FileSpreadsheet size={16} />
              <span className="text-sm font-medium">Excel</span>
            </button>
          </div>
        </div>

        {/* Right side: Download button with animation */}
        <div className="flex-shrink-0">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-2 group"
            style={{ 
              borderColor: colors.primary,
              color: colors.primary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.primary;
            }}
          >
            {!isExporting ? (
              <Download size={24} className="transition-colors" />
            ) : (
              <Flex variant="center" className="relative w-full h-full">
                {/* Animated download icon */}
                <div 
                  className="absolute"
                  style={{
                    animation: 'downloadAnimation 0.8s ease-in infinite',
                    color: colors.primary
                  }}
                >
                  <Download size={24} />
                </div>
                
                {/* Progress circle */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-gray-300"
                  style={{
                    borderTopColor: colors.primary,
                    animation: 'spin 1s linear infinite'
                  }}
                />
              </Flex>
            )}
          </button>
        </div>
      </Flex>

      {isExporting && (
        <div className="mt-4 pt-4 border-t border-gray-300 animate-fadeIn">
          <Flex variant="center" className="gap-2 text-sm">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: colors.primary }}
            />
            <span className="text-gray-800 font-medium">
              Generating your report in {selectedFormat.toUpperCase()}...
            </span>
          </Flex>
        </div>
      )}
      
      <style>{`
        @keyframes downloadAnimation {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(30px);
          }
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            height: 0;
          }
          to {
            opacity: 1;
            height: auto;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </Card>
  );
};

export default ExportReportCard;