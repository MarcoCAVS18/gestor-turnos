import React, ***REMOVED*** useMemo, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Clock, Sun, Moon, Sunset, Sunrise, BarChart2, PlusCircle ***REMOVED*** from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';
import Popover from '../../ui/Popover';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import ***REMOVED*** calculateWeeklyHourlyDeliveryStats ***REMOVED*** from '../../../services/calculationService';

const AnalisisHorarioDelivery = (***REMOVED*** turnos = [], className = "" ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const navigate = useNavigate();

  // 1. Calcular estadísticas base
  const weeklyHourlyStats = useMemo(() => ***REMOVED***
    return calculateWeeklyHourlyDeliveryStats(turnos);
  ***REMOVED***, [turnos]);

  // 2. Determinar el valor MÁXIMO de ganancia TOTAL (acumulada)
  const maxTotalProfit = useMemo(() => ***REMOVED***
    let max = 0;
    weeklyHourlyStats.forEach(day => ***REMOVED***
      day.hourlyData.forEach(hour => ***REMOVED***
        if (hour.totalProfit > max) ***REMOVED***
          max = hour.totalProfit;
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***);
    return max;
  ***REMOVED***, [weeklyHourlyStats]);

  // 3. Calcular mejor momento
  const mejorMomento = useMemo(() => ***REMOVED***
    let bestDay = null;
    let bestHour = null;
    let maxAvgProfit = 0;

    weeklyHourlyStats.forEach(dayStat => ***REMOVED***
      dayStat.hourlyData.forEach(hourStat => ***REMOVED***
        if (hourStat.averageProfitPerHour > maxAvgProfit) ***REMOVED***
          maxAvgProfit = hourStat.averageProfitPerHour;
          bestDay = dayStat.day;
          bestHour = hourStat.hour;
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***);
    return ***REMOVED*** day: bestDay, hour: bestHour, averageProfitPerHour: maxAvgProfit ***REMOVED***;
  ***REMOVED***, [weeklyHourlyStats]);

  // 4. FUNCIÓN DE COLOR
  const getHeatmapColor = useCallback((value) => ***REMOVED***
    if (!value || value <= 0 || maxTotalProfit === 0) ***REMOVED***
      return '#f1f5f9'; 
    ***REMOVED***
    const intensity = value / maxTotalProfit;
    const opacity = 0.15 + (intensity * 0.85);

    let baseColor = colors.primary;
    if (!baseColor || typeof baseColor !== 'string' || !baseColor.startsWith('#')) ***REMOVED***
      baseColor = '#4f46e5';
    ***REMOVED***

    const hexToRgb = (hex) => ***REMOVED***
      hex = hex.replace(/^#/, '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      if (hex.length !== 6) return ***REMOVED*** r: 79, g: 70, b: 229 ***REMOVED***;
      const bigint = parseInt(hex, 16);
      return ***REMOVED*** r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 ***REMOVED***;
    ***REMOVED***;

    const rgb = hexToRgb(baseColor);
    return `rgba($***REMOVED***rgb.r***REMOVED***, $***REMOVED***rgb.g***REMOVED***, $***REMOVED***rgb.b***REMOVED***, $***REMOVED***opacity.toFixed(2)***REMOVED***)`;

  ***REMOVED***, [maxTotalProfit, colors.primary]);

  const hasData = useMemo(() => weeklyHourlyStats.some(day => day.hourlyData.some(hour => hour.totalHours > 0)), [weeklyHourlyStats]);

  if (!hasData) ***REMOVED***
    return (
      <Card className=***REMOVED***`flex flex-col $***REMOVED***className***REMOVED***`***REMOVED***>
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <Clock size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
          Rentabilidad Horaria
        </h3>
        <div className="flex-grow flex flex-col items-center justify-center py-8 text-center px-4">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <BarChart2 size=***REMOVED***32***REMOVED*** className="text-gray-300" />
          </div>
          <p className="text-gray-600 font-medium mb-1">No hay datos esta semana</p>
          <Button onClick=***REMOVED***() => navigate('/turnos')***REMOVED*** variant="outline" themeColor=***REMOVED***colors.primary***REMOVED*** className="flex items-center gap-2 mt-4">
            <PlusCircle size=***REMOVED***16***REMOVED*** /> Agregar turno
          </Button>
        </div>
      </Card>
    );
  ***REMOVED***

  const getHourIcon = (hour) => ***REMOVED***
    if (hour >= 6 && hour < 12) return Sunrise;
    if (hour >= 12 && hour < 16) return Sun;
    if (hour >= 16 && hour < 20) return Sunset;
    return Moon;
  ***REMOVED***;

  const MejorMomentoIcon = mejorMomento.day !== null ? getHourIcon(mejorMomento.hour) : Clock;
  const getDayLabel = (dayName) => dayName.substring(0, 3);

  return (
    <Card className=***REMOVED***`flex flex-col $***REMOVED***className***REMOVED***`***REMOVED***>
      <div className="flex-none">
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <Clock size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
          Rentabilidad Horaria
        </h3>
      </div>

      <div className="flex-grow flex flex-col space-y-6">
        ***REMOVED***/* Mejor Momento Card */***REMOVED***
        ***REMOVED***mejorMomento.day !== null && mejorMomento.averageProfitPerHour > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <Flex variant="between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                  <MejorMomentoIcon size=***REMOVED***24***REMOVED*** />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Mejor momento</p>
                  <p className="font-bold text-gray-800 text-lg">
                    ***REMOVED***mejorMomento.day***REMOVED*** ***REMOVED***mejorMomento.hour***REMOVED***:00 - ***REMOVED***mejorMomento.hour + 1***REMOVED***:00
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-green-600">
                  ***REMOVED***formatCurrency(mejorMomento.averageProfitPerHour)***REMOVED***
                </span>
                <p className="text-xs text-gray-400">/hora</p>
              </div>
            </Flex>
          </div>
        )***REMOVED***

        ***REMOVED***/* CSS GRID HEATMAP */***REMOVED***
        <div className="w-full overflow-x-auto pb-2 relative">
          <div className="w-full min-w-[600px]">
            ***REMOVED***/* Grid Container */***REMOVED***
            <div
              className="grid gap-x-[2px] gap-y-1" 
              style=***REMOVED******REMOVED*** gridTemplateColumns: '40px repeat(24, 1fr)' ***REMOVED******REMOVED***
            >
              ***REMOVED***/* Header Row (Hours) */***REMOVED***
              <div className="text-xs text-gray-400 text-center self-end pb-1">#</div>
              ***REMOVED***Array.from(***REMOVED*** length: 24 ***REMOVED***).map((_, i) => (
                <div key=***REMOVED***i***REMOVED*** className="text-[10px] text-gray-400 text-center pb-1">
                  ***REMOVED***i % 3 === 0 ? `$***REMOVED***i***REMOVED***h` : ''***REMOVED***
                </div>
              ))***REMOVED***

              ***REMOVED***/* Body Rows */***REMOVED***
              ***REMOVED***weeklyHourlyStats.map((dayStat) => (
                <React.Fragment key=***REMOVED***dayStat.day***REMOVED***>
                  ***REMOVED***/* Day Label */***REMOVED***
                  <div className="text-[11px] font-medium text-gray-500 self-center capitalize">
                    ***REMOVED***getDayLabel(dayStat.day)***REMOVED***
                  </div>

                  ***REMOVED***/* Hour Cells */***REMOVED***
                  ***REMOVED***dayStat.hourlyData.map((hourStat) => (
                    <Popover
                      key=***REMOVED***`$***REMOVED***dayStat.day***REMOVED***-$***REMOVED***hourStat.hour***REMOVED***`***REMOVED***
                      trigger="hover"
                      position="top"
                      content=***REMOVED***
                        <div className="p-2">
                          <p className="font-bold mb-1">***REMOVED***dayStat.day***REMOVED*** ***REMOVED***hourStat.hour***REMOVED***:00</p>
                          ***REMOVED***hourStat.totalHours > 0 ? (
                            <>
                              <div className="flex justify-between text-xs gap-4">
                                <span className="text-gray-400">Rentabilidad:</span>
                                <span className="font-medium text-green-600">***REMOVED***formatCurrency(hourStat.averageProfitPerHour)***REMOVED***/h</span>
                              </div>
                              <div className="flex justify-between text-xs gap-4 mt-1">
                                <span className="text-gray-400">Total Ganado:</span>
                                <span>***REMOVED***formatCurrency(hourStat.totalProfit)***REMOVED***</span>
                              </div>
                              <div className="flex justify-between text-xs gap-4">
                                <span className="text-gray-400">Horas:</span>
                                <span>***REMOVED***hourStat.totalHours.toFixed(1)***REMOVED***h</span>
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-400 italic text-xs">Sin datos registrados</span>
                          )***REMOVED***
                        </div>
                      ***REMOVED***
                    >
                      <div
                        className=***REMOVED***`w-full h-10 rounded-sm transition-all duration-200 cursor-default $***REMOVED***hourStat.totalHours > 0 ? 'hover:scale-110 hover:shadow-md hover:z-10 relative' : ''***REMOVED***`***REMOVED***
                        style=***REMOVED******REMOVED***
                          backgroundColor: getHeatmapColor(hourStat.totalProfit)
                        ***REMOVED******REMOVED***
                      ></div>
                    </Popover>
                  ))***REMOVED***
                </React.Fragment>
              ))***REMOVED***
            </div>

            <div className="flex items-center justify-end gap-2 text-xs text-gray-400 mt-4 border-t border-gray-100 pt-3">
                <span>Menos $</span>
                <div className="flex gap-0.5">
                  <div className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200"></div>
                  <div className="w-3 h-3 rounded-sm" style=***REMOVED******REMOVED*** backgroundColor: getHeatmapColor(maxTotalProfit * 0.2) ***REMOVED******REMOVED***></div>
                  <div className="w-3 h-3 rounded-sm" style=***REMOVED******REMOVED*** backgroundColor: getHeatmapColor(maxTotalProfit * 0.4) ***REMOVED******REMOVED***></div>
                  <div className="w-3 h-3 rounded-sm" style=***REMOVED******REMOVED*** backgroundColor: getHeatmapColor(maxTotalProfit * 0.6) ***REMOVED******REMOVED***></div>
                  <div className="w-3 h-3 rounded-sm" style=***REMOVED******REMOVED*** backgroundColor: getHeatmapColor(maxTotalProfit * 0.8) ***REMOVED******REMOVED***></div>
                  <div className="w-3 h-3 rounded-sm" style=***REMOVED******REMOVED*** backgroundColor: getHeatmapColor(maxTotalProfit) ***REMOVED******REMOVED***></div>
                </div>
                <span>Más $</span>
              </div>
          </div>
        </div>
      </div>
    </Card>
  );
***REMOVED***;

export default AnalisisHorarioDelivery;