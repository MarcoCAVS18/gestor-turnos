// src/components/dashboard/ThisWeekSummaryCard/index.jsx 

import React from 'react';
import ***REMOVED*** Calendar, TrendingUp, Target, ArrowRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Flex from '../../ui/Flex';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Card from '../../ui/Card';
import ProgressBar from '../../ui/ProgressBar';
import Button from '../../ui/Button';

const ThisWeekSummaryCard = (***REMOVED*** stats, className ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const navigate = useNavigate();
  const ***REMOVED*** weeklyHoursGoal ***REMOVED*** = useApp(); 

  // Get data for this week from stats
  const currentWeek = stats.currentWeek || ***REMOVED******REMOVED***;
  const totalWeek = currentWeek.totalEarnings || 0;
  const hoursWeek = currentWeek.hoursWorked || 0;
  const shiftsWeek = currentWeek.totalShifts || 0; 

  // Use the user's goal or show call-to-action if there is no goal
  const goalHours = weeklyHoursGoal;
  const hasHoursGoal = goalHours && goalHours > 0;

  // Calculate progress only if there is a goal
  const progressHours = hasHoursGoal ? (hoursWeek / goalHours) * 100 : 0;
  const limitedProgress = Math.min(Math.max(progressHours, 0), 100);

  // Function to navigate to settings
  const goToSettings = () => ***REMOVED***
    navigate('/ajustes');
  ***REMOVED***;

  const getProgressBarColor = (progress) => ***REMOVED***
    if (progress >= 75) return '#10B981';
    if (progress >= 50) return colors.primary;
    return '#F59E0B';
  ***REMOVED***;

  return (
    <Card className=***REMOVED***className***REMOVED***>
      <div className="flex flex-col h-full">
        <div> ***REMOVED***/* Content wrapper */***REMOVED***
          <Flex variant="between" className="mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Calendar size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-2" />
              This week
            </h3>
          </Flex>

          <div className="space-y-4">
            ***REMOVED***/* Main earnings */***REMOVED***
            <div className="text-center">
              <p
                className="text-2xl font-bold"
                style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
              >
                ***REMOVED***formatCurrency(totalWeek)***REMOVED***
              </p>
              <p className="text-sm text-gray-600">Total earned</p>
            </div>

            ***REMOVED***/* Hours progress - Only if there is a goal */***REMOVED***
            ***REMOVED***hasHoursGoal ? (
              <div className="space-y-2">
                <Flex variant="between" className="text-sm">
                  <span className="text-gray-600">Progress: </span>
                  <span className="font-medium">***REMOVED***hoursWeek.toFixed(1)***REMOVED***h / ***REMOVED***goalHours***REMOVED***h</span>
                </Flex>

                <ProgressBar
                  value=***REMOVED***limitedProgress***REMOVED***
                  color=***REMOVED***getProgressBarColor(limitedProgress)***REMOVED***
                />
              </div>
            ) : (
              <div className="text-center">
                <Flex variant="center" className="mb-2">
                  <Target size=***REMOVED***16***REMOVED*** className="text-gray-400 mr-1" />
                  <span className="text-lg font-semibold text-gray-700">***REMOVED***hoursWeek.toFixed(1)***REMOVED***h</span>
                </Flex>
                <div
                  className="p-2 rounded-lg border border-dashed transition-all duration-200"
                  style=***REMOVED******REMOVED***
                    borderColor: colors.transparent30,
                    backgroundColor: colors.transparent5
                  ***REMOVED******REMOVED***
                >
                  <p className="text-xs text-gray-600 mb-1">
                    No weekly goal yet?
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    Setting one helps you stay on track
                  </p>
                  <Button
                    onClick=***REMOVED***goToSettings***REMOVED***
                    variant="ghost-animated"
                    size="sm"
                    icon=***REMOVED***ArrowRight***REMOVED***
                    iconPosition="right"
                    themeColor=***REMOVED***colors.primary***REMOVED***
                    className="-ml-2"
                  >
                    Set up
                  </Button>
                </div>
              </div>
            )***REMOVED***

            ***REMOVED***/* Basic stats - Show shifts completed */***REMOVED***
            <Flex variant="between" className=" text-sm">
              <div className="text-center">
                <p className="font-semibold text-gray-800">***REMOVED***shiftsWeek***REMOVED***</p>
                <p className="text-xs text-gray-500">shifts</p>
              </div>
              
              ***REMOVED***hasHoursGoal && (
                <div className="text-center">
                  <p className="font-semibold text-gray-800">***REMOVED***Math.ceil(limitedProgress)***REMOVED***%</p>
                  <p className="text-xs text-gray-500">goal</p>
                </div>
              )***REMOVED***
              
              <div className="text-center">
                <p className="font-semibold text-gray-800">***REMOVED***hoursWeek.toFixed(1)***REMOVED***h</p>
                <p className="text-xs text-gray-500">hours</p>
              </div>
            </Flex>

            ***REMOVED***/* Motivational message */***REMOVED***
            ***REMOVED***totalWeek > 0 && hasHoursGoal && (
              <div className="text-center p-2 rounded-lg" style=***REMOVED******REMOVED*** backgroundColor: colors.transparent10 ***REMOVED******REMOVED***>
                <Flex variant="center">
                  <TrendingUp size=***REMOVED***12***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-1" />
                  <p className="text-xs font-medium" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                    ***REMOVED***limitedProgress >= 75 ? 'Excellent progress!' : 'Good pace!'***REMOVED***
                  </p>
                </Flex>
              </div>
            )***REMOVED***
          </div>
        </div>
        <div className="flex-grow" /> 
      </div>
    </Card>
  );
***REMOVED***;

export default ThisWeekSummaryCard;