// src/components/stats/PayslipCard/PayslipDropZone.jsx
// Zona para arrastrar y soltar PDFs (o hacer click para elegir).
// Dos variantes:
//   compact=false → bloque grande con ícono centrado (estado IDLE)
//   compact=true  → "botón" con altura uniforme alineable al lado de Manual

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';

const PayslipDropZone = ({ compact = false, onFiles, onClick }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files || []).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );
    if (files.length > 0 && onFiles) onFiles(files);
  };

  const sharedHandlers = {
    onDragOver: (e) => { e.preventDefault(); setDragActive(true); },
    onDragLeave: () => setDragActive(false),
    onDrop: handleDrop,
    onClick,
  };

  if (compact) {
    return (
      <div
        {...sharedHandlers}
        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed cursor-pointer transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
        style={{
          borderColor: dragActive ? colors.primary : undefined,
          backgroundColor: dragActive ? colors.transparent10 : 'transparent',
        }}
      >
        <Upload size={16} style={{ color: colors.primary }} />
        {t('payslip.dropzone.addMore')}
      </div>
    );
  }

  return (
    <div
      {...sharedHandlers}
      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors"
      style={{
        borderColor: dragActive ? colors.primary : undefined,
        backgroundColor: dragActive ? colors.transparent10 : 'transparent',
      }}
    >
      <Upload size={28} className="mx-auto mb-2" style={{ color: colors.primary }} />
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {t('payslip.dropzone.title')}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {t('payslip.dropzone.subtitle')}
      </p>
    </div>
  );
};

export default PayslipDropZone;
