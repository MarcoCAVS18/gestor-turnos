import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** ArrowLeft, ChevronDown, Store, Bike ***REMOVED*** from 'lucide-react';
import ***REMOVED*** motion, AnimatePresence ***REMOVED*** from 'framer-motion';
import Card from '../../ui/Card'; // Ajusta la ruta según tu estructura

const QuickStatCard = (***REMOVED*** icon: Icon, label, value, subtitle, details, color, type ***REMOVED***) => ***REMOVED***
  const [showDetails, setShowDetails] = useState(false);

  const variants = ***REMOVED***
    initial: ***REMOVED*** opacity: 0, scale: 0.9, filter: 'blur(4px)' ***REMOVED***,
    animate: ***REMOVED*** opacity: 1, scale: 1, filter: 'blur(0px)' ***REMOVED***,
    exit: ***REMOVED*** opacity: 0, scale: 1.1, filter: 'blur(4px)' ***REMOVED***
  ***REMOVED***;

  return (
    <Card 
      // CLAVE: 'h-full' para llenar la celda del grid. 
      // 'min-h-[160px]' mantiene la altura base que te gustaba.
      className="p-0 h-full min-h-[160px] relative overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 border-b-4 select-none"
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
            // Padding reducido en móvil (p-2) vs escritorio (p-4)
            className="absolute inset-0 flex flex-col items-center justify-center p-2 md:p-4 text-center"
          >
            ***REMOVED***/* flex-grow asegura que el contenido se centre verticalmente aunque la tarjeta sea muy alta */***REMOVED***
            <div className="flex-grow flex flex-col items-center justify-center w-full">
              ***REMOVED***/* Círculo del icono responsive */***REMOVED***
              <div className="p-2 md:p-3 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors mb-1 md:mb-2">
                <Icon className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110 duration-300" style=***REMOVED******REMOVED*** color: color ***REMOVED******REMOVED*** />
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-xs md:text-sm text-gray-500 font-medium block">***REMOVED***label***REMOVED***</span>
                ***REMOVED***/* Texto más pequeño en móvil (xl) para que no rompa, grande en desktop (3xl) */***REMOVED***
                <p className="text-xl md:text-3xl font-black text-gray-800 tracking-tight leading-tight my-0.5 md:my-0">
                  ***REMOVED***value***REMOVED***
                </p>
                <p className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-wide">
                  ***REMOVED***subtitle***REMOVED***
                </p>
              </div>
            </div>

            ***REMOVED***/* "Ver más" pegado al fondo */***REMOVED***
            <div className="mt-auto pt-1 flex flex-col items-center opacity-60 group-hover:opacity-100 transition-opacity">
               <span className="text-[9px] md:text-[10px] text-gray-400 font-medium mb-0.5">Ver más</span>
               <ChevronDown size=***REMOVED***12***REMOVED*** className="text-gray-400 animate-bounce md:w-[14px] md:h-[14px]" />
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
            className="absolute inset-0 bg-gray-50 flex flex-col p-2 md:p-4 text-center"
          >
            <div className="flex items-center justify-between mb-2 pb-1 md:pb-2 border-b border-gray-200/50 shrink-0">
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider w-full text-center pl-4">Detalles</span>
              <ArrowLeft size=***REMOVED***14***REMOVED*** className="text-gray-400 absolute left-2 md:left-4 cursor-pointer hover:text-gray-600 md:w-[16px] md:h-[16px]" />
            </div>

            ***REMOVED***/* Contenedor scrollable por si el contenido excede la altura */***REMOVED***
            <div className="flex-grow flex flex-col justify-center items-center gap-2 w-full overflow-y-auto no-scrollbar">
              ***REMOVED***type === 'jobs' ? (
                <>
                  <div className="w-full flex items-center justify-between bg-white p-1.5 md:p-2 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Store className="w-3 h-3 md:w-[14px] md:h-[14px] text-blue-500" />
                      <span className="text-[10px] md:text-xs text-gray-600 font-medium">Tradicionales</span>
                    </div>
                    <span className="text-xs md:text-sm font-bold text-gray-800">***REMOVED***details.traditional***REMOVED***</span>
                  </div>
                  <div className="w-full bg-white p-1.5 md:p-2 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <Bike className="w-3 h-3 md:w-[14px] md:h-[14px] text-orange-500" />
                        <span className="text-[10px] md:text-xs text-gray-600 font-medium">Delivery</span>
                      </div>
                      <span className="text-xs md:text-sm font-bold text-gray-800">***REMOVED***details.delivery***REMOVED***</span>
                    </div>
                    ***REMOVED***details.platforms.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center mt-1 pt-1 border-t border-gray-50">
                        ***REMOVED***details.platforms.slice(0, 3).map((p, i) => (
                          <span key=***REMOVED***i***REMOVED*** className="text-[9px] md:text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full border border-orange-100 max-w-[70px] truncate">
                            ***REMOVED***p***REMOVED***
                          </span>
                        ))***REMOVED***
                         ***REMOVED***details.platforms.length > 3 && (
                           <span className="text-[9px] text-gray-400">+***REMOVED***details.platforms.length - 3***REMOVED***</span>
                        )***REMOVED***
                      </div>
                    )***REMOVED***
                  </div>
                </>
              ) : (
                details.map((item, idx) => (
                  <div key=***REMOVED***idx***REMOVED*** className="w-full flex items-center justify-between bg-white p-1.5 md:p-2.5 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      ***REMOVED***item.icon && <item.icon className="w-3 h-3 md:w-[14px] md:h-[14px]" style=***REMOVED******REMOVED*** color: item.iconColor || '#9ca3af' ***REMOVED******REMOVED*** />***REMOVED***
                      <span className="text-[10px] md:text-xs text-gray-600 font-medium truncate max-w-[80px] md:max-w-none text-left">***REMOVED***item.label***REMOVED***</span>
                    </div>
                    <span className="text-xs md:text-sm font-bold text-gray-800 whitespace-nowrap">***REMOVED***item.value***REMOVED***</span>
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

export default QuickStatCard;