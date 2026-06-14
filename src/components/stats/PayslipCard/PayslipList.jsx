// src/components/stats/PayslipCard/PayslipList.jsx
// Lista de payslips cargados (con badge país a la derecha) + fila de
// botones "Agregar más" (drop zone compacto) + "Manual".
// Cada payslip muestra nombre de archivo, período corto y monto bruto.
// Botones edit/eliminar inline.

import { useTranslation } from 'react-i18next';
import { FileText, Plus, Edit2, Trash2, AlertCircle, ChevronLeft } from 'lucide-react';
import Badge from '../../ui/Badge';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { isComplete, formatPeriodShort } from './helpers';
import PayslipDropZone from './PayslipDropZone';

const PayslipList = ({
  payslips,
  countryLabel,
  formatMoney,
  onEdit,
  onRemove,
  onManualAdd,
  onManualCancel, // se llama cuando el usuario clickea "Volver" para cerrar el form manual
  isManualOpen = false, // true cuando el form de carga manual está visible en el slot del hero
  onPickFiles,    // abre el file picker (para el dropzone compacto)
  onFilesDropped, // recibe los archivos arrastrados
}) => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {t('payslip.list.title')}
        </p>
        {countryLabel && (
          <Badge
            variant="theme"
            size="sm"
            style={{ backgroundColor: colors.transparent10, color: colors.primary }}
          >
            {countryLabel}
          </Badge>
        )}
      </div>

      {/* Cada item mide ~52px con padding/border. Limitamos visualmente a ~3
          items (max-h-[12rem]) y habilitamos scroll para que la lista no
          empuje al resto del layout cuando se cargan muchos recibos.
          pr-1 evita que la scrollbar tape el border-right de los items. */}
      <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {payslips.map((p) => {
          const complete = isComplete(p);
          return (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 p-2 rounded-lg border border-gray-200 dark:border-slate-700"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white truncate">
                  <FileText size={14} className="flex-shrink-0" style={{ color: colors.primary }} />
                  {p.fileName ? (
                    <span className="truncate">{p.fileName}</span>
                  ) : (
                    <span>{t('payslip.manualEntry')}</span>
                  )}
                </div>
                {complete ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {formatPeriodShort(p.periodStart, p.periodEnd)} · {formatMoney(p.gross)}
                  </p>
                ) : (
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {t('payslip.list.incomplete')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onEdit(p.id)}
                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500"
                  aria-label={t('payslip.list.edit')}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500"
                  aria-label={t('payslip.list.remove')}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Dos botones equivalentes en una fila — mismo alto y ancho.
          El botón "Manual" se transforma en "Volver" cuando el form manual
          está abierto, para que el usuario pueda cerrarlo sin perder de vista
          el bloque que está editando. */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <PayslipDropZone compact onClick={onPickFiles} onFiles={onFilesDropped} />
        {isManualOpen ? (
          <button
            type="button"
            onClick={onManualCancel}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors"
            style={{
              borderColor: colors.primary,
              color: colors.primary,
              backgroundColor: colors.transparent10,
            }}
          >
            <ChevronLeft size={16} />
            {t('common.back')}
          </button>
        ) : (
          <button
            type="button"
            onClick={onManualAdd}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <Plus size={16} style={{ color: colors.primary }} />
            {t('payslip.addManual')}
          </button>
        )}
      </div>
    </div>
  );
};

export default PayslipList;
