import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Sun, Moon, Sunset, Sunrise, BarChart2, PlusCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Flex from '../ui/Flex';
import Popover from '../ui/Popover';
import { useThemeColors } from '../../hooks/useThemeColors';
import { formatCurrency } from '../../utils/currency';
import { calculateWeeklyHourlyDeliveryStats } from '../../services/calculationService';

const AnalisisHorarioDelivery = ({ turnos = [], className = "" }) => {
  const colors = useThemeColors();
  const navigate = useNavigate();

  // 1. Calcular estadísticas base
  const weeklyHourlyStats = useMemo(() => {
    return calculateWeeklyHourlyDeliveryStats(turnos);
  }, [turnos]);

  // 2. Determinar el valor MÁXIMO de ganancia TOTAL (acumulada)
  const maxTotalProfit = useMemo(() => {
    let max = 0;
    weeklyHourlyStats.forEach(day => {
      day.hourlyData.forEach(hour => {
        if (hour.totalProfit > max) {
          max = hour.totalProfit;
        }
      });
    });
    return max;
  }, [weeklyHourlyStats]);

  // 3. Calcular mejor momento
  const mejorMomento = useMemo(() => {
    let bestDay = null;
    let bestHour = null;
    let maxAvgProfit = 0;

    weeklyHourlyStats.forEach(dayStat => {
      dayStat.hourlyData.forEach(hourStat => {
        if (hourStat.averageProfitPerHour > maxAvgProfit) {
          maxAvgProfit = hourStat.averageProfitPerHour;
          bestDay = dayStat.day;
          bestHour = hourStat.hour;
        }
      });
    });
    return { day: bestDay, hour: bestHour, averageProfitPerHour: maxAvgProfit };
  }, [weeklyHourlyStats]);

  // 4. FUNCIÓN DE COLOR
  const getHeatmapColor = useCallback((value) => {
    if (!value || value <= 0 || maxTotalProfit === 0) {
      return '#f1f5f9'; 
    }
    const intensity = value / maxTotalProfit;
    const opacity = 0.15 + (intensity * 0.85);

    let baseColor = colors.primary;
    if (!baseColor || typeof baseColor !== 'string' || !baseColor.startsWith('#')) {
      baseColor = '#4f46e5';
    }

    const hexToRgb = (hex) => {
      hex = hex.replace(/^#/, '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      if (hex.length !== 6) return { r: 79, g: 70, b: 229 };
      const bigint = parseInt(hex, 16);
      return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
    };

    const rgb = hexToRgb(baseColor);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity.toFixed(2)})`;

  }, [maxTotalProfit, colors.primary]);

  const hasData = useMemo(() => weeklyHourlyStats.some(day => day.hourlyData.some(hour => hour.totalHours > 0)), [weeklyHourlyStats]);

  if (!hasData) {
    return (
      <Card className={`flex flex-col ${className}`}>
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <Clock size={20} style={{ color: colors.primary }} className="mr-2" />
          Rentabilidad Horaria
        </h3>
        <div className="flex-grow flex flex-col items-center justify-center py-8 text-center px-4">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <BarChart2 size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-600 font-medium mb-1">No hay datos esta semana</p>
          <Button onClick={() => navigate('/turnos')} variant="outline" themeColor={colors.primary} className="flex items-center gap-2 mt-4">
            <PlusCircle size={16} /> Agregar turno
          </Button>
        </div>
      </Card>
    );
  }

  const getHourIcon = (hour) => {
    if (hour >= 6 && hour < 12) return Sunrise;
    if (hour >= 12 && hour < 16) return Sun;
    if (hour >= 16 && hour < 20) return Sunset;
    return Moon;
  };

  const MejorMomentoIcon = mejorMomento.day !== null ? getHourIcon(mejorMomento.hour) : Clock;
  const getDayLabel = (dayName) => dayName.substring(0, 3);

  return (
    <Card className={`flex flex-col ${className}`}>
      <div className="flex-none">
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <Clock size={20} style={{ color: colors.primary }} className="mr-2" />
          Rentabilidad Horaria
        </h3>
      </div>

      <div className="flex-grow flex flex-col space-y-6">
        {/* Mejor Momento Card */}
        {mejorMomento.day !== null && mejorMomento.averageProfitPerHour > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <Flex variant="between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                  <MejorMomentoIcon size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Mejor momento</p>
                  <p className="font-bold text-gray-800 text-lg">
                    {mejorMomento.day} {mejorMomento.hour}:00 - {mejorMomento.hour + 1}:00
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(mejorMomento.averageProfitPerHour)}
                </span>
                <p className="text-xs text-gray-400">/hora</p>
              </div>
            </Flex>
          </div>
        )}

        {/* CSS GRID HEATMAP */}
        <div className="w-full overflow-x-auto pb-2 relative">
          <div className="w-full min-w-[600px]">
            {/* Grid Container */}
            <div
              className="grid gap-x-[2px] gap-y-1" 
              style={{ gridTemplateColumns: '40px repeat(24, 1fr)' }}
            >
              {/* Header Row (Hours) */}
              <div className="text-xs text-gray-400 text-center self-end pb-1">#</div>
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="text-[10px] text-gray-400 text-center pb-1">
                  {i % 3 === 0 ? `${i}h` : ''}
                </div>
              ))}

              {/* Body Rows */}
              {weeklyHourlyStats.map((dayStat) => (
                <React.Fragment key={dayStat.day}>
                  {/* Day Label */}
                  <div className="text-[11px] font-medium text-gray-500 self-center capitalize">
                    {getDayLabel(dayStat.day)}
                  </div>

                  {/* Hour Cells */}
                  {dayStat.hourlyData.map((hourStat) => (
                    <Popover
                      key={`${dayStat.day}-${hourStat.hour}`}
                      trigger="hover"
                      position="top"
                      content={
                        <div className="p-2">
                          <p className="font-bold mb-1">{dayStat.day} {hourStat.hour}:00</p>
                          {hourStat.totalHours > 0 ? (
                            <>
                              <div className="flex justify-between text-xs gap-4">
                                <span className="text-gray-400">Rentabilidad:</span>
                                <span className="font-medium text-green-600">{formatCurrency(hourStat.averageProfitPerHour)}/h</span>
                              </div>
                              <div className="flex justify-between text-xs gap-4 mt-1">
                                <span className="text-gray-400">Total Ganado:</span>
                                <span>{formatCurrency(hourStat.totalProfit)}</span>
                              </div>
                              <div className="flex justify-between text-xs gap-4">
                                <span className="text-gray-400">Horas:</span>
                                <span>{hourStat.totalHours.toFixed(1)}h</span>
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-400 italic text-xs">Sin datos registrados</span>
                          )}
                        </div>
                      }
                    >
                      <div
                        className={`w-full h-10 rounded-sm transition-all duration-200 cursor-default ${hourStat.totalHours > 0 ? 'hover:scale-110 hover:shadow-md hover:z-10 relative' : ''}`}
                        style={{
                          backgroundColor: getHeatmapColor(hourStat.totalProfit)
                        }}
                      ></div>
                    </Popover>
                  ))}
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 text-xs text-gray-400 mt-4 border-t border-gray-100 pt-3">
                <span>Menos $</span>
                <div className="flex gap-0.5">
                  <div className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200"></div>
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getHeatmapColor(maxTotalProfit * 0.2) }}></div>
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getHeatmapColor(maxTotalProfit * 0.4) }}></div>
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getHeatmapColor(maxTotalProfit * 0.6) }}></div>
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getHeatmapColor(maxTotalProfit * 0.8) }}></div>
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getHeatmapColor(maxTotalProfit) }}></div>
                </div>
                <span>Más $</span>
              </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AnalisisHorarioDelivery;