// src/components/more/MoreMenuRow/index.jsx
// Fila del hub "Más": icono + label + chevron, estilo lista agrupada iOS.

import React from 'react';
import { ChevronRight } from 'lucide-react';

const MoreMenuRow = ({ icon: Icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-4 px-4 py-4 text-left transition-colors active:bg-gray-50 dark:active:bg-slate-800"
  >
    <Icon size={20} className="flex-shrink-0 text-gray-500 dark:text-slate-400" />
    <span className="flex-1 font-medium text-gray-900 dark:text-white">{label}</span>
    <ChevronRight size={18} className="text-gray-400 dark:text-slate-500" />
  </button>
);

export default MoreMenuRow;
