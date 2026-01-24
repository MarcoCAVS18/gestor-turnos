// src/components/index.js

// UI Components
export { default as Button } from './ui/Button';
export { default as Input } from './ui/Input';
export { default as ThemeInput } from './ui/ThemeInput';
export { default as Modal } from './ui/Modal';
export { default as Card } from './ui/Card';
export { default as ActionsMenu } from './ui/ActionsMenu';
export { default as NotificationBanner } from './ui/NotificationBanner';
export { default as ProgressBar } from './ui/ProgressBar';

// Layout Components  
export { default as Header } from './layout/Header';
export { default as Navigation } from './layout/Navegacion';
export { default as PageHeader } from './layout/PageHeader';
export { default as LoadingWrapper } from './layout/LoadingWrapper';

// Card Components
export { default as StatCard } from './cards/StatCard';
export { default as WorkCard } from './cards/work/WorkCard';
export { default as ShiftCard } from './cards/shift/ShiftCard';
export { default as WorkDetailsCard } from './forms/TrabajoCard';

// Work Components
export { default as WorkAvatar } from './work/WorkAvatar';
export { default as WorkRates } from './work/WorkRates';

// Shift Components
export { default as ShiftDetails } from './shift/ShiftDetails';
export { default as ShiftTypeBadge } from './shift/ShiftTypeBadge';

// Form Components
export { default as WorkForm } from './forms/work/TrabajoForm';
export { default as ShiftForm } from './forms/shift/TurnoForm';

// Modal Components
export { default as WorkModal } from './modals/work/WorkModal';
export { default as ShiftModal } from './modals/shift/ShiftModal';

// Alert Components
export { default as DeleteAlert } from './alerts/DeleteAlert';

// Calendar Components
export { default as Calendario } from './calendar/Calendar';
export { default as CalendarDaySummary } from './calendar/CalendarDaySummary';

// Section Components
export { default as StatsSection } from './sections/StatsSection';
export { default as ListSection } from './sections/ListSection';
export { default as DaySection } from './sections/DaySection';

// Settings Components
export { default as SettingsSection } from './settings/SettingsSection';
export { default as ProfileSection } from './settings/ProfileSection';
export { default as CustomizationSection } from './settings/CustomizationSection';
export { default as TurnRangeSection } from './settings/TurnRangeSection';
export { default as PreferencesSection } from './settings/PreferencesSection';
export { default as SessionSection } from './settings/SessionSection';
export { default as FooterSection } from './settings/FooterSection';

// Stats Components
export { default as WeekNavigator } from './stats/WeekNavigator';
export { default as StatsProgressBar } from './stats/StatsProgressBar';
export { default as WeeklyStatsGrid } from './stats/WeeklyStatsGrid';
export { default as WorkDistributionChart } from './stats/WorkDistributionChart';
export { default as DailyBreakdownCard } from './stats/DailyBreakdownCard';

// Delivery Stats Components
export { default as ResumenDelivery } from './stats/ResumenDelivery';
export { default as EficienciaVehiculos } from './stats/EficienciaVehiculos';
export { default as ComparacionPlataformas } from './stats/ComparacionPlataformas';
export { default as SeguimientoCombustible } from './stats/SeguimientoCombustible';

// Dashboard Components
export { default as WelcomeCard } from './dashboard/WelcomeCard';
export { default as QuickStatsGrid } from './dashboard/QuickStatsGrid';
export { default as WeeklyStatsCard } from './dashboard/WeeklyStatsCard';
export { default as NextShiftCard } from './dashboard/NextShiftCard';
export { default as TopWorkCard } from './dashboard/TopWorkCard';
export { default as FavoriteWorksCard } from './dashboard/FavoriteWorksCard';
export { default as ProjectionCard } from './dashboard/ProjectionCard';
export { default as QuickActionsCard } from './dashboard/QuickActionsCard';

// Shared Components
export { default as WorkPreviewCard } from './shared/WorkPreviewCard';

// State Components
export { default as EmptyState } from './states/EmptyState';

// Other Components
export { default as Loader } from './other/Loader';
export { default as DebugPanel } from './other/DebugPanel';

// Legacy Components
export { default as DynamicButton } from './DynamicButton';

// Auth Components
export { default as PrivateRoute } from './auth/PrivateRoute';