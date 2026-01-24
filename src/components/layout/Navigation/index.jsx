// src/components/layout/Navigation/index.jsx

import React, ***REMOVED*** useState, useRef, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useNavigate, useLocation ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Home, Briefcase, Calendar, BarChart2, CalendarDays, Settings, PlusCircle, Pencil ***REMOVED*** from 'lucide-react';
import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';

import Flex from '../../ui/Flex';

import './index.css';


const Navigation = (***REMOVED*** openNewWorkModal, openNewShiftModal ***REMOVED***) => ***REMOVED***
  const navigate = useNavigate();
  const location = useLocation();
  const ***REMOVED*** works, deliveryWorks ***REMOVED*** = useApp();
  const ***REMOVED*** profilePhotoURL, updateProfilePhoto ***REMOVED*** = useAuth();
  const colors = useThemeColors();
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  // Tooltip state
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPhotoEdit, setShowPhotoEdit] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => ***REMOVED***
    const handleLoadingStart = () => setIsPhotoLoading(true);
    const handleLoadingEnd = () => setIsPhotoLoading(false);

    window.addEventListener('profile-photo-loading-start', handleLoadingStart);
    window.addEventListener('profile-photo-loading-end', handleLoadingEnd);

    return () => ***REMOVED***
      window.removeEventListener('profile-photo-loading-start', handleLoadingStart);
      window.removeEventListener('profile-photo-loading-end', handleLoadingEnd);
    ***REMOVED***;
  ***REMOVED***, []);
  
  const getCurrentView = () => ***REMOVED***
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'dashboard';
    if (path === '/works') return 'works';
    if (path === '/shifts') return 'shifts';
    if (path === '/statistics') return 'statistics';
    if (path === '/calendar') return 'calendar';
    if (path === '/settings') return 'settings';
    return 'dashboard';
  ***REMOVED***;
  
  const currentView = getCurrentView();
  
  // Check if there are works created
  const totalWorks = (works?.length || 0) + (deliveryWorks?.length || 0);
  const hasWorks = totalWorks > 0;
  
  const navigateToView = (view) => ***REMOVED***
    // If trying to go to shifts but there are no works, do nothing on desktop
    if (view === 'shifts' && !hasWorks) ***REMOVED***
      return;
    ***REMOVED***
    
    const routes = ***REMOVED***
      'dashboard': '/dashboard',
      'works': '/works',
      'shifts': '/shifts',
      'statistics': '/statistics',
      'calendar': '/calendar',
      'settings': '/settings'
    ***REMOVED***;
    
    window.scrollTo(***REMOVED*** top: 0, behavior: 'smooth' ***REMOVED***);
    
    navigate(routes[view]);
  ***REMOVED***;
  
  const getActiveTextStyle = (view) => ***REMOVED***
    return currentView === view 
      ? ***REMOVED*** color: colors.primary ***REMOVED*** 
      : ***REMOVED*** color: '#6B7280' ***REMOVED***;
  ***REMOVED***;

  const getActiveDesktopStyle = (view) => ***REMOVED***
    // Special style for shifts when there are no works
    if (view === 'shifts' && !hasWorks) ***REMOVED***
      return ***REMOVED***
        backgroundColor: 'transparent',
        color: '#9CA3AF',
        cursor: 'not-allowed',
        opacity: 0.5
      ***REMOVED***;
    ***REMOVED***

    return currentView === view
      ? ***REMOVED***
          backgroundColor: colors.primary,
          color: 'white'
        ***REMOVED***
      : ***REMOVED***
          backgroundColor: 'transparent',
          color: '#6B7280'
        ***REMOVED***;
  ***REMOVED***;
  
  const calendarButtonStyle = ***REMOVED***
    backgroundColor: colors.primary,
    borderColor: currentView === 'calendar' 
      ? colors.primaryDark
      : 'white'
  ***REMOVED***;

  // Handle shifts button hover
  const handleShiftsMouseEnter = () => ***REMOVED***
    if (!hasWorks) ***REMOVED***
      setShowTooltip(true);
    ***REMOVED***
  ***REMOVED***;

  const handleShiftsMouseLeave = () => ***REMOVED***
    setShowTooltip(false);
  ***REMOVED***;

  // Function to navigate to dashboard from logo
  const handleLogoClick = () => ***REMOVED***
    navigateToView('dashboard');
  ***REMOVED***;

  // Handle profile photo upload from desktop
  const handlePhotoUpload = async (event) => ***REMOVED***
    const file = event.target.files?.[0];
    if (!file) return;

    window.dispatchEvent(new CustomEvent('profile-photo-loading-start'));
    try ***REMOVED***
      await updateProfilePhoto(file);
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error updating photo:', error);
    ***REMOVED*** finally ***REMOVED***
      window.dispatchEvent(new CustomEvent('profile-photo-loading-end'));
      if (fileInputRef.current) ***REMOVED***
        fileInputRef.current.value = '';
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***;

  const handleEditPhotoClick = (e) => ***REMOVED***
    e.stopPropagation();
    fileInputRef.current?.click();
  ***REMOVED***;
  
  return (
    <>
      ***REMOVED***/* MOBILE NAVIGATION */***REMOVED***
      <nav className="navbar-container fixed bottom-0 left-0 right-0 bg-white px-4 py-6 md:hidden">
        <div className="grid grid-cols-5 items-center max-w-md mx-auto">
          <button
            onClick=***REMOVED***() => navigateToView('dashboard')***REMOVED***
            className="flex flex-col items-center justify-center transition-colors duration-200"
            style=***REMOVED***getActiveTextStyle('dashboard')***REMOVED***
          >
            <Home size=***REMOVED***20***REMOVED*** />
            <span className="text-xs mt-1">Home</span>
          </button>

          <button
            onClick=***REMOVED***() => navigateToView('works')***REMOVED***
            className="flex flex-col items-center justify-center transition-colors duration-200"
            style=***REMOVED***getActiveTextStyle('works')***REMOVED***
          >
            <Briefcase size=***REMOVED***20***REMOVED*** />
            <span className="text-xs mt-1">Works</span>
          </button>

          <div className="flex justify-center items-start -mt-6">
            <motion.button
              onClick=***REMOVED***() => navigateToView('calendar')***REMOVED***
              className="text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 transition-all duration-200"
              style=***REMOVED***calendarButtonStyle***REMOVED***
              whileTap=***REMOVED******REMOVED*** scale: 0.95 ***REMOVED******REMOVED***
              whileHover=***REMOVED******REMOVED*** 
                scale: 1.05,
                boxShadow: `0 8px 25px $***REMOVED***colors.transparent50***REMOVED***`
              ***REMOVED******REMOVED***
            >
              <CalendarDays size=***REMOVED***28***REMOVED*** />
            </motion.button>
          </div>

          <button
            onClick=***REMOVED***() => navigateToView('shifts')***REMOVED***
            className="flex flex-col items-center justify-center transition-colors duration-200"
            style=***REMOVED***getActiveTextStyle('shifts')***REMOVED***
          >
            <Calendar size=***REMOVED***20***REMOVED*** />
            <span className="text-xs mt-1">Shifts</span>
          </button>

          <button
            onClick=***REMOVED***() => navigateToView('statistics')***REMOVED***
            className="flex flex-col items-center justify-center transition-colors duration-200"
            style=***REMOVED***getActiveTextStyle('statistics')***REMOVED***
          >
            <BarChart2 size=***REMOVED***20***REMOVED*** />
            <span className="text-xs mt-1">Statistics</span>
          </button>
        </div>
      </nav>

      ***REMOVED***/* DESKTOP SIDEBAR */***REMOVED***
      <aside className="hidden md:flex md:flex-col w-72 bg-white border-r border-gray-200 shadow-sm h-screen fixed left-0 top-0 z-30">
        
        ***REMOVED***/* SIDEBAR HEADER - WITH PROFILE PHOTO */***REMOVED***
        <div className="p-6 border-b border-gray-100">
          ***REMOVED***/* Hidden input for photo upload */***REMOVED***
          <input
            ref=***REMOVED***fileInputRef***REMOVED***
            type="file"
            accept="image/*"
            onChange=***REMOVED***handlePhotoUpload***REMOVED***
            className="hidden"
          />

          <button
            onClick=***REMOVED***handleLogoClick***REMOVED***
            className="flex items-center space-x-4 hover:opacity-80 transition-opacity w-full text-left"
          >
            ***REMOVED***/* Profile photo or Logo with hover edit */***REMOVED***
            <div
              className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg group"
              onMouseEnter=***REMOVED***() => setShowPhotoEdit(true)***REMOVED***
              onMouseLeave=***REMOVED***() => setShowPhotoEdit(false)***REMOVED***
              style=***REMOVED******REMOVED***
                backgroundColor: profilePhotoURL?.includes('logo.svg') ? colors.primary : 'transparent'
              ***REMOVED******REMOVED***
            >
              <img
                src=***REMOVED***profilePhotoURL***REMOVED***
                alt="Profile"
                className=***REMOVED***`w-full h-full $***REMOVED***
                  profilePhotoURL?.includes('logo.svg')
                    ? 'object-contain p-2 filter brightness-0 invert'
                    : 'object-cover'
                ***REMOVED*** $***REMOVED***isPhotoLoading && !profilePhotoURL?.includes('logo.svg') ? 'opacity-70 blur-sm' : ''***REMOVED***`***REMOVED***
                style=***REMOVED***
                  profilePhotoURL?.includes('logo.svg')
                    ? ***REMOVED*** filter: 'brightness(0) invert(1)' ***REMOVED***
                    : ***REMOVED******REMOVED***
                ***REMOVED***
              />

              ***REMOVED***/* Overlay with edit icon on hover */***REMOVED***
              ***REMOVED***showPhotoEdit && (
                <Flex variant="center"
                  onClick=***REMOVED***handleEditPhotoClick***REMOVED***
                  className="absolute inset-0 bg-black bg-opacity-50 cursor-pointer transition-opacity"
                  style=***REMOVED******REMOVED*** backgroundColor: colors.transparent50 ***REMOVED******REMOVED***
                >
                  <Pencil className="text-white" size=***REMOVED***20***REMOVED*** />
                </Flex>
              )***REMOVED***
            </div>

            ***REMOVED***/* Title and subtitle */***REMOVED***
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                GestAPP.
              </h1>
              <p className="text-xs text-gray-500 font-light">
                Your work and shift manager
              </p>
            </div>
          </button>
        </div>

        ***REMOVED***/* QUICK ACTIONS */***REMOVED***
        ***REMOVED***(openNewShiftModal || openNewWorkModal) && (
          <div className="p-4 border-b border-gray-100">
            <div className="space-y-2">
              ***REMOVED***openNewShiftModal && hasWorks && (
                <button
                  onClick=***REMOVED***openNewShiftModal***REMOVED***
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-lg transform hover:scale-105 btn-primary text-white"
                  style=***REMOVED******REMOVED*** 
                    backgroundColor: colors.primary
                  ***REMOVED******REMOVED***
                  onMouseEnter=***REMOVED***(e) => ***REMOVED***
                    e.target.style.backgroundColor = colors.primaryDark;
                  ***REMOVED******REMOVED***
                  onMouseLeave=***REMOVED***(e) => ***REMOVED***
                    e.target.style.backgroundColor = colors.primary;
                  ***REMOVED******REMOVED***
                >
                  <PlusCircle size=***REMOVED***20***REMOVED*** />
                  <span>New Shift</span>
                </button>
              )***REMOVED***
              ***REMOVED***openNewWorkModal && (
                <button
                  onClick=***REMOVED***openNewWorkModal***REMOVED***
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md bg-white"
                  style=***REMOVED******REMOVED*** 
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: colors.primary,
                    color: colors.primary
                  ***REMOVED******REMOVED***
                  onMouseEnter=***REMOVED***(e) => ***REMOVED***
                    e.target.style.backgroundColor = colors.transparent10;
                  ***REMOVED******REMOVED***
                  onMouseLeave=***REMOVED***(e) => ***REMOVED***
                    e.target.style.backgroundColor = '#ffffff';
                  ***REMOVED******REMOVED***
                >
                  <Briefcase size=***REMOVED***20***REMOVED*** />
                  <span>New Work</span>
                </button>
              )***REMOVED***
            </div>
          </div>
        )***REMOVED***

        ***REMOVED***/* MAIN NAVIGATION */***REMOVED***
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <motion.button
              onClick=***REMOVED***() => navigateToView('dashboard')***REMOVED***
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
              style=***REMOVED***getActiveDesktopStyle('dashboard')***REMOVED***
              whileHover=***REMOVED******REMOVED*** scale: 1.02 ***REMOVED******REMOVED***
              whileTap=***REMOVED******REMOVED*** scale: 0.98 ***REMOVED******REMOVED***
            >
              <Home size=***REMOVED***20***REMOVED*** />
              <span>Dashboard</span>
            </motion.button>

            <motion.button
              onClick=***REMOVED***() => navigateToView('works')***REMOVED***
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
              style=***REMOVED***getActiveDesktopStyle('works')***REMOVED***
              whileHover=***REMOVED******REMOVED*** scale: 1.02 ***REMOVED******REMOVED***
              whileTap=***REMOVED******REMOVED*** scale: 0.98 ***REMOVED******REMOVED***
            >
              <Briefcase size=***REMOVED***20***REMOVED*** />
              <span>Works</span>
            </motion.button>

            <motion.button
              onClick=***REMOVED***() => navigateToView('calendar')***REMOVED***
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
              style=***REMOVED***getActiveDesktopStyle('calendar')***REMOVED***
              whileHover=***REMOVED******REMOVED*** scale: 1.02 ***REMOVED******REMOVED***
              whileTap=***REMOVED******REMOVED*** scale: 0.98 ***REMOVED******REMOVED***
            >
              <CalendarDays size=***REMOVED***20***REMOVED*** />
              <span>Calendar</span>
              <div 
                className="w-2 h-2 rounded-full ml-auto"
                style=***REMOVED******REMOVED*** 
                  backgroundColor: currentView === 'calendar' ? 'white' : colors.primary 
                ***REMOVED******REMOVED***
              />
            </motion.button>

            ***REMOVED***/* Shifts button with validation and tooltip */***REMOVED***
            <div className="relative">
              <motion.button
                onClick=***REMOVED***() => navigateToView('shifts')***REMOVED***
                onMouseEnter=***REMOVED***handleShiftsMouseEnter***REMOVED***
                onMouseLeave=***REMOVED***handleShiftsMouseLeave***REMOVED***
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all"
                style=***REMOVED***getActiveDesktopStyle('shifts')***REMOVED***
                whileHover=***REMOVED***hasWorks ? ***REMOVED*** scale: 1.02 ***REMOVED*** : ***REMOVED******REMOVED******REMOVED***
                whileTap=***REMOVED***hasWorks ? ***REMOVED*** scale: 0.98 ***REMOVED*** : ***REMOVED******REMOVED******REMOVED***
              >
                <Calendar size=***REMOVED***20***REMOVED*** />
                <span>Shifts</span>
                ***REMOVED***!hasWorks && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  </div>
                )***REMOVED***
              </motion.button>

              ***REMOVED***/* Tooltip for when there are no jobs */***REMOVED***
              ***REMOVED***showTooltip && !hasWorks && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50">
                  <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                    First create a job to add shifts
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
                  </div>
                </div>
              )***REMOVED***
            </div>

            <motion.button
              onClick=***REMOVED***() => navigateToView('statistics')***REMOVED***
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
              style=***REMOVED***getActiveDesktopStyle('statistics')***REMOVED***
              whileHover=***REMOVED******REMOVED*** scale: 1.02 ***REMOVED******REMOVED***
              whileTap=***REMOVED******REMOVED*** scale: 0.98 ***REMOVED******REMOVED***
            >
              <BarChart2 size=***REMOVED***20***REMOVED*** />
              <span>Statistics</span>
            </motion.button>
          </div>
        </nav>

        ***REMOVED***/* SIDEBAR FOOTER */***REMOVED***
        <div className="p-4 border-t border-gray-100">
          <motion.button
            onClick=***REMOVED***() => navigateToView('settings')***REMOVED***
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:bg-gray-50 text-gray-600"
            whileHover=***REMOVED******REMOVED*** scale: 1.02 ***REMOVED******REMOVED***
            whileTap=***REMOVED******REMOVED*** scale: 0.98 ***REMOVED******REMOVED***
          >
            <Settings size=***REMOVED***20***REMOVED*** />
            <span>Settings</span>
          </motion.button>
        </div>
      </aside>
    </>
  );
***REMOVED***;
export default Navigation;