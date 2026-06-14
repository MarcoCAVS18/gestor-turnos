// src/components/stats/PayslipCard/ui.jsx
// Sub-componentes visuales puros y reutilizables dentro de PayslipCard.
// No tienen lógica de negocio — solo reciben props y renderizan.

import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Métrica compacta para el hero (label arriba + valor abajo, sin border).
 */
export const MiniStat = ({ label, value }) => (
  <div className="text-center min-w-0">
    <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400 truncate">
      {label}
    </p>
    <p className="text-sm font-semibold mt-0.5 text-gray-900 dark:text-white truncate">
      {value}
    </p>
  </div>
);

/**
 * Donut SVG basado en stroke-dasharray. Muestra el % de "neto" del bruto
 * en el color primario, el resto en gris. En el centro va el número del %.
 *
 * Animación: el arco se "dibuja" desde 0 hasta el valor real al montar
 * (similar al easing que usan los charts de Recharts en InteractiveCharts).
 * El número del centro hace fade-in tras la animación del arco.
 */
export const DonutChart = ({ netPct, primaryColor }) => {
  const safePct = Math.max(0, Math.min(100, netPct || 0));
  const r = 15.91549430918954; // r para circunferencia = 100
  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        {/* Pista (tax) */}
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke="#E5E7EB"
          className="dark:stroke-slate-700"
          strokeWidth="3.5"
        />
        {/* Progreso (neto) — animado desde 0 hasta safePct */}
        <motion.circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke={primaryColor}
          strokeWidth="3.5"
          strokeDashoffset="0"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 100` }}
          animate={{ strokeDasharray: `${safePct} ${100 - safePct}` }}
          transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      {/* Número centrado — aparece después del arco */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4, ease: 'easeOut' }}
      >
        <span
          className="text-base sm:text-lg font-bold leading-none"
          style={{ color: primaryColor }}
        >
          {safePct.toFixed(0)}%
        </span>
      </motion.div>
    </div>
  );
};

/**
 * Acordeón con header (ícono + título + subtítulo + chevron) y body que
 * solo se renderiza cuando está expandido.
 */
export const Accordion = ({
  icon: Icon,
  title,
  subtitle,
  expanded,
  onToggle,
  primaryColor,
  children,
}) => (
  <div className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50"
      aria-expanded={expanded}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${primaryColor}15` }}
      >
        {Icon && <Icon size={15} style={{ color: primaryColor }} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {subtitle}
          </p>
        )}
      </div>
      <ChevronRight
        size={16}
        className="flex-shrink-0 text-gray-400 transition-transform"
        style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
      />
    </button>
    {expanded && <div className="p-3 pt-0">{children}</div>}
  </div>
);
