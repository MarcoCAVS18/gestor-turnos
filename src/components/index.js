// src/components/index.js - EXPORTACIONES CENTRALIZADAS

// UI Components
export { default as Button } from './ui/Button';
export { default as Input } from './ui/Input';
export { default as Modal } from './ui/Modal';
export { default as Card } from './ui/Card';

// Layout Components  
export { default as Header } from './layout/Header';
export { default as Navegacion } from './layout/Navegacion';
export { default as PageHeader } from './layout/PageHeader';
export { default as LoadingWrapper } from './layout/LoadingWrapper';

// Card Components
export { default as StatCard } from './cards/StatCard';
export { default as TarjetaResumen } from './cards/TarjetaResumen';
export { default as TarjetaTrabajo } from './cards/TarjetaTrabajo';
export { default as TarjetaTurno } from './cards/TarjetaTurno';
export { default as Turno } from './cards/Turno';
export { default as TrabajoCard } from './forms/TrabajoCard';

// Form Components
export { default as TrabajoForm } from './forms/TrabajoForm';
export { default as TurnoForm } from './forms/TurnoForm';

// Modal Components
export { default as ModalTrabajo } from './modals/ModalTrabajo';
export { default as ModalTurno } from './modals/ModalTurno';

// Alert Components
export { default as AlertaEliminacion } from './alerts/AlertaEliminacion';

// Calendar Components
export { default as Calendario } from './calendar/Calendario';

// Summary Components
export { default as ResumenDia } from './summaries/ResumenDia';

// Section Components
export { default as StatsSection } from './sections/StatsSection';
export { default as ListSection } from './sections/ListSection';

// State Components
export { default as EmptyState } from './states/EmptyState';

// Other Components
export { default as Loader } from './other/Loader';
export { default as DebugPanel } from './other/DebugPanel';

// Legacy Components (mantener por compatibilidad)
export { default as DynamicButton } from './DynamicButton';

// Auth Components
export { default as PrivateRoute } from './auth/PrivateRoute';