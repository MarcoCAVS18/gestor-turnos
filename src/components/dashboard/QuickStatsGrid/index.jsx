import React, { useState, useMemo } from 'react';
import { 
  Briefcase, Calendar, Clock, Target, 
  ArrowLeft, ChevronDown, 
  Store, Bike, 
  CalendarDays, CalendarRange,
  Timer, History,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';

// --- COMPONENTE DE TARJETA INDIVIDUAL (Visual) ---
const QuickStatCard = ({ icon: Icon, label, value, subtitle, details, color, type }) => {
  const [showDetails, setShowDetails] = useState(false);

  const variants = {
    initial: { opacity: 0, scale: 0.9, filter: 'blur(4px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.1, filter: 'blur(4px)' }
  };

  return (
    <Card 
      className="p-0 h-full min-h-[160px] relative overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 border-b-4"
      style={{ borderBottomColor: showDetails ? 'transparent' : color }}
      onClick={() => setShowDetails(!showDetails)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!showDetails ? (
          // --- VISTA PRINCIPAL ---
          <motion.div
            key="summary"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
          >
            <div className="flex-grow flex flex-col items-center justify-center space-y-2">
              <div className="p-3 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                <Icon size={24} className="transition-transform group-hover:scale-110 duration-300" style={{ color: color }} />
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium block">{label}</span>
                <p className="text-3xl font-black text-gray-800 tracking-tight">{value}</p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{subtitle}</p>
              </div>
            </div>
            <div className="mt-auto pt-2 flex flex-col items-center opacity-60 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] text-gray-400 font-medium mb-0.5">Ver más</span>
               <ChevronDown size={14} className="text-gray-400 animate-bounce" />
            </div>
          </motion.div>
        ) : (
          // --- VISTA DETALLADA ---
          <motion.div
            key="details"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gray-50 flex flex-col p-4 text-center"
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200/50 shrink-0">
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider w-full text-center pl-4">Detalles</span>
              <ArrowLeft size={16} className="text-gray-400 absolute left-4 cursor-pointer hover:text-gray-600" />
            </div>

            <div className="flex-grow flex flex-col justify-center items-center gap-3 w-full">
              {type === 'jobs' ? (
                <>
                  <div className="w-full flex items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Store size={14} className="text-blue-500" />
                      <span className="text-xs text-gray-600 font-medium">Tradicionales</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{details.traditional}</span>
                  </div>
                  <div className="w-full bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Bike size={14} className="text-orange-500" />
                        <span className="text-xs text-gray-600 font-medium">Delivery</span>
                      </div>
                      <span className="text-sm font-bold text-gray-800">{details.delivery}</span>
                    </div>
                    {details.platforms.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center mt-1 pt-1 border-t border-gray-50">
                        {details.platforms.map((p, i) => (
                          <span key={i} className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full border border-orange-100">
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                details.map((item, idx) => (
                  <div key={idx} className="w-full flex items-center justify-between bg-white p-2.5 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon size={14} style={{ color: item.iconColor || '#9ca3af' }} />}
                      <span className="text-xs text-gray-600 font-medium">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{item.value}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

// --- COMPONENTE PRINCIPAL (GRID) ---
const QuickStatsGrid = ({ stats, className }) => {
  const { thematicColors, trabajos, trabajosDelivery } = useApp();
  
  const totalTrabajos = (trabajos?.length || 0) + (trabajosDelivery?.length || 0);
  
  // Preparar datos para las tarjetas usando los cálculos del hook
  const detailedData = useMemo(() => {
    // 1. Datos para TRABAJOS
    const traditionalCount = trabajos?.length || 0;
    const deliveryCount = trabajosDelivery?.length || 0;
    const platformsSet = new Set(trabajosDelivery?.map(t => t.plataforma || t.nombre || "App").filter(Boolean));
    const platformsList = Array.from(platformsSet);

    // 2. Extraer datos pre-calculados del hook useDashboardStats
    const { semanaActual, mesActual } = stats;

    return {
      jobs: {
        traditional: traditionalCount,
        delivery: deliveryCount,
        platforms: platformsList
      },
      shifts: [
        { label: 'Esta Semana', value: semanaActual?.totalTurnos || 0, icon: CalendarDays, iconColor: '#3b82f6' },
        { label: 'Este Mes', value: mesActual?.totalTurnos || 0, icon: CalendarRange, iconColor: '#8b5cf6' }
      ],
      hours: [
        { label: 'Semana Actual', value: `${(semanaActual?.horasTrabajadas || 0).toFixed(1)}h`, icon: Timer, iconColor: '#10b981' },
        { label: 'Mes Actual', value: `${(mesActual?.horasTrabajadas || 0).toFixed(1)}h`, icon: History, iconColor: '#f59e0b' }
      ],
      average: [
        { label: 'Por Hora', value: `$${stats.promedioPorHora.toFixed(0)}`, icon: Clock, iconColor: '#6366f1' },
        { label: 'Ganancia Sem.', value: `$${(semanaActual?.totalGanado || 0).toLocaleString()}`, icon: TrendingUp, iconColor: '#ec4899' }
      ]
    };
  }, [stats, trabajos, trabajosDelivery]);

  const cardsData = [
    {
      id: 'jobs',
      type: 'jobs',
      icon: Briefcase,
      label: 'Trabajos',
      value: totalTrabajos,
      subtitle: 'activos',
      details: detailedData.jobs
    },
    {
      id: 'shifts',
      type: 'general',
      icon: Calendar,
      label: 'Turnos',
      value: stats.turnosTotal,
      subtitle: 'completados',
      details: detailedData.shifts
    },
    {
      id: 'hours',
      type: 'general',
      icon: Clock,
      label: 'Horas',
      value: stats.horasTrabajadas.toFixed(0),
      subtitle: 'trabajadas',
      details: detailedData.hours
    },
    {
      id: 'avg',
      type: 'general',
      icon: Target,
      label: 'Promedio',
      value: `$${stats.promedioPorHora.toFixed(0)}`,
      subtitle: 'por hora',
      details: detailedData.average
    }
  ];

  return (
    <>
      <div className={`hidden lg:grid lg:grid-cols-4 gap-6 ${className}`}>
        {cardsData.map((stat) => (
          <QuickStatCard 
            key={stat.id} 
            {...stat} 
            color={thematicColors?.base} 
          />
        ))}
      </div>

      <div className="block lg:hidden">
        <div className="flex flex-wrap gap-3">
          {cardsData.map((stat) => (
            <div key={stat.id} className="w-[calc(50%-0.375rem)]">
              <QuickStatCard 
                {...stat} 
                color={thematicColors?.base} 
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default QuickStatsGrid;