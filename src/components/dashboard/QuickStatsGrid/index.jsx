import React, ***REMOVED*** useState, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** 
  Briefcase, Calendar, Clock, Target, 
  ArrowLeft, ChevronDown, 
  Store, Bike, 
  CalendarDays, CalendarRange,
  Timer, History,
  TrendingUp
***REMOVED*** from 'lucide-react';
import ***REMOVED*** motion, AnimatePresence ***REMOVED*** from 'framer-motion';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';

// --- COMPONENTE DE TARJETA INDIVIDUAL (Visual) ---
const QuickStatCard = (***REMOVED*** icon: Icon, label, value, subtitle, details, color, type ***REMOVED***) => ***REMOVED***
  const [showDetails, setShowDetails] = useState(false);

  const variants = ***REMOVED***
    initial: ***REMOVED*** opacity: 0, scale: 0.9, filter: 'blur(4px)' ***REMOVED***,
    animate: ***REMOVED*** opacity: 1, scale: 1, filter: 'blur(0px)' ***REMOVED***,
    exit: ***REMOVED*** opacity: 0, scale: 1.1, filter: 'blur(4px)' ***REMOVED***
  ***REMOVED***;

  return (
    <Card 
      className="p-0 h-full min-h-[160px] relative overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 border-b-4"
      style=***REMOVED******REMOVED*** borderBottomColor: showDetails ? 'transparent' : color ***REMOVED******REMOVED***
      onClick=***REMOVED***() => setShowDetails(!showDetails)***REMOVED***
    >
      <AnimatePresence mode="wait" initial=***REMOVED***false***REMOVED***>
        ***REMOVED***!showDetails ? (
          // --- VISTA PRINCIPAL ---
          <motion.div
            key="summary"
            variants=***REMOVED***variants***REMOVED***
            initial="initial"
            animate="animate"
            exit="exit"
            transition=***REMOVED******REMOVED*** duration: 0.2 ***REMOVED******REMOVED***
            className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
          >
            <div className="flex-grow flex flex-col items-center justify-center space-y-2">
              <div className="p-3 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                <Icon size=***REMOVED***24***REMOVED*** className="transition-transform group-hover:scale-110 duration-300" style=***REMOVED******REMOVED*** color: color ***REMOVED******REMOVED*** />
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium block">***REMOVED***label***REMOVED***</span>
                <p className="text-3xl font-black text-gray-800 tracking-tight">***REMOVED***value***REMOVED***</p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">***REMOVED***subtitle***REMOVED***</p>
              </div>
            </div>
            <div className="mt-auto pt-2 flex flex-col items-center opacity-60 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] text-gray-400 font-medium mb-0.5">Ver más</span>
               <ChevronDown size=***REMOVED***14***REMOVED*** className="text-gray-400 animate-bounce" />
            </div>
          </motion.div>
        ) : (
          // --- VISTA DETALLADA ---
          <motion.div
            key="details"
            variants=***REMOVED***variants***REMOVED***
            initial="initial"
            animate="animate"
            exit="exit"
            transition=***REMOVED******REMOVED*** duration: 0.2 ***REMOVED******REMOVED***
            className="absolute inset-0 bg-gray-50 flex flex-col p-4 text-center"
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200/50 shrink-0">
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider w-full text-center pl-4">Detalles</span>
              <ArrowLeft size=***REMOVED***16***REMOVED*** className="text-gray-400 absolute left-4 cursor-pointer hover:text-gray-600" />
            </div>

            <div className="flex-grow flex flex-col justify-center items-center gap-3 w-full">
              ***REMOVED***type === 'jobs' ? (
                <>
                  <div className="w-full flex items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Store size=***REMOVED***14***REMOVED*** className="text-blue-500" />
                      <span className="text-xs text-gray-600 font-medium">Tradicionales</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">***REMOVED***details.traditional***REMOVED***</span>
                  </div>
                  <div className="w-full bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Bike size=***REMOVED***14***REMOVED*** className="text-orange-500" />
                        <span className="text-xs text-gray-600 font-medium">Delivery</span>
                      </div>
                      <span className="text-sm font-bold text-gray-800">***REMOVED***details.delivery***REMOVED***</span>
                    </div>
                    ***REMOVED***details.platforms.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center mt-1 pt-1 border-t border-gray-50">
                        ***REMOVED***details.platforms.map((p, i) => (
                          <span key=***REMOVED***i***REMOVED*** className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full border border-orange-100">
                            ***REMOVED***p***REMOVED***
                          </span>
                        ))***REMOVED***
                      </div>
                    )***REMOVED***
                  </div>
                </>
              ) : (
                details.map((item, idx) => (
                  <div key=***REMOVED***idx***REMOVED*** className="w-full flex items-center justify-between bg-white p-2.5 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                      ***REMOVED***item.icon && <item.icon size=***REMOVED***14***REMOVED*** style=***REMOVED******REMOVED*** color: item.iconColor || '#9ca3af' ***REMOVED******REMOVED*** />***REMOVED***
                      <span className="text-xs text-gray-600 font-medium">***REMOVED***item.label***REMOVED***</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">***REMOVED***item.value***REMOVED***</span>
                  </div>
                ))
              )***REMOVED***
            </div>
          </motion.div>
        )***REMOVED***
      </AnimatePresence>
    </Card>
  );
***REMOVED***;

// --- COMPONENTE PRINCIPAL (GRID) ---
const QuickStatsGrid = (***REMOVED*** stats, className ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors, trabajos, trabajosDelivery ***REMOVED*** = useApp();
  
  const totalTrabajos = (trabajos?.length || 0) + (trabajosDelivery?.length || 0);
  
  // Preparar datos para las tarjetas usando los cálculos del hook
  const detailedData = useMemo(() => ***REMOVED***
    // 1. Datos para TRABAJOS
    const traditionalCount = trabajos?.length || 0;
    const deliveryCount = trabajosDelivery?.length || 0;
    const platformsSet = new Set(trabajosDelivery?.map(t => t.plataforma || t.nombre || "App").filter(Boolean));
    const platformsList = Array.from(platformsSet);

    // 2. Extraer datos pre-calculados del hook useDashboardStats
    const ***REMOVED*** semanaActual, mesActual ***REMOVED*** = stats;

    return ***REMOVED***
      jobs: ***REMOVED***
        traditional: traditionalCount,
        delivery: deliveryCount,
        platforms: platformsList
      ***REMOVED***,
      shifts: [
        ***REMOVED*** label: 'Esta Semana', value: semanaActual?.totalTurnos || 0, icon: CalendarDays, iconColor: '#3b82f6' ***REMOVED***,
        ***REMOVED*** label: 'Este Mes', value: mesActual?.totalTurnos || 0, icon: CalendarRange, iconColor: '#8b5cf6' ***REMOVED***
      ],
      hours: [
        ***REMOVED*** label: 'Semana Actual', value: `$***REMOVED***(semanaActual?.horasTrabajadas || 0).toFixed(1)***REMOVED***h`, icon: Timer, iconColor: '#10b981' ***REMOVED***,
        ***REMOVED*** label: 'Mes Actual', value: `$***REMOVED***(mesActual?.horasTrabajadas || 0).toFixed(1)***REMOVED***h`, icon: History, iconColor: '#f59e0b' ***REMOVED***
      ],
      average: [
        ***REMOVED*** label: 'Por Hora', value: `$$***REMOVED***stats.promedioPorHora.toFixed(0)***REMOVED***`, icon: Clock, iconColor: '#6366f1' ***REMOVED***,
        ***REMOVED*** label: 'Ganancia Sem.', value: `$$***REMOVED***(semanaActual?.totalGanado || 0).toLocaleString()***REMOVED***`, icon: TrendingUp, iconColor: '#ec4899' ***REMOVED***
      ]
    ***REMOVED***;
  ***REMOVED***, [stats, trabajos, trabajosDelivery]);

  const cardsData = [
    ***REMOVED***
      id: 'jobs',
      type: 'jobs',
      icon: Briefcase,
      label: 'Trabajos',
      value: totalTrabajos,
      subtitle: 'activos',
      details: detailedData.jobs
    ***REMOVED***,
    ***REMOVED***
      id: 'shifts',
      type: 'general',
      icon: Calendar,
      label: 'Turnos',
      value: stats.turnosTotal,
      subtitle: 'completados',
      details: detailedData.shifts
    ***REMOVED***,
    ***REMOVED***
      id: 'hours',
      type: 'general',
      icon: Clock,
      label: 'Horas',
      value: stats.horasTrabajadas.toFixed(0),
      subtitle: 'trabajadas',
      details: detailedData.hours
    ***REMOVED***,
    ***REMOVED***
      id: 'avg',
      type: 'general',
      icon: Target,
      label: 'Promedio',
      value: `$$***REMOVED***stats.promedioPorHora.toFixed(0)***REMOVED***`,
      subtitle: 'por hora',
      details: detailedData.average
    ***REMOVED***
  ];

  return (
    <>
      <div className=***REMOVED***`hidden lg:grid lg:grid-cols-4 gap-6 $***REMOVED***className***REMOVED***`***REMOVED***>
        ***REMOVED***cardsData.map((stat) => (
          <QuickStatCard 
            key=***REMOVED***stat.id***REMOVED*** 
            ***REMOVED***...stat***REMOVED*** 
            color=***REMOVED***thematicColors?.base***REMOVED*** 
          />
        ))***REMOVED***
      </div>

      <div className="block lg:hidden">
        <div className="flex flex-wrap gap-3">
          ***REMOVED***cardsData.map((stat) => (
            <div key=***REMOVED***stat.id***REMOVED*** className="w-[calc(50%-0.375rem)]">
              <QuickStatCard 
                ***REMOVED***...stat***REMOVED*** 
                color=***REMOVED***thematicColors?.base***REMOVED*** 
              />
            </div>
          ))***REMOVED***
        </div>
      </div>
    </>
  );
***REMOVED***;

export default QuickStatsGrid;