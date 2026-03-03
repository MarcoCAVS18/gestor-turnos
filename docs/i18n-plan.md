# i18n — Seguimiento de Traducción de Componentes

> **Estado actual:** Fase 2 en progreso
> **Idiomas:** EN · ES · FR
> **Framework:** `react-i18next` + JSON locales en `src/locales/`

---

## Infraestructura (Fase 1 — ✅ Completa)

| Archivo | Estado |
|---------|--------|
| `src/i18n.js` | ✅ Configurado |
| `src/index.js` | ✅ `import './i18n'` agregado |
| `src/locales/en/translation.json` | ✅ Completo |
| `src/locales/es/translation.json` | ✅ Completo |
| `src/locales/fr/translation.json` | ✅ Completo |
| `src/contexts/ConfigContext.jsx` | ✅ `userEmoji` → `language` + `i18n.changeLanguage()` |
| `src/services/firebaseService.js` | ✅ prefMap + defaults actualizados |
| `src/constants/app.js` | ✅ `COMMON_EMOJIS` eliminado |

---

## Páginas

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/pages/Dashboard.jsx` | ✅ Traducido | — |
| `src/pages/Shifts.jsx` | ✅ Traducido | — |
| `src/pages/Works.jsx` | ✅ Traducido | — |
| `src/pages/Statistics.jsx` | ✅ Traducido | — |
| `src/pages/Settings.jsx` | ✅ Sin strings (composición) | — |
| `src/pages/Landing.jsx` | ❌ Pendiente | "Get Started Free", "Sign in", "already have an account?", privacy links |
| `src/pages/Integrations.jsx` | ❌ Pendiente | ~50 strings: notificaciones, biometric, instrucciones PWA iOS/Android |

---

## Layout

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/layout/Navigation/index.jsx` | ✅ Traducido | — |
| `src/components/layout/AuthLayout/index.jsx` | ❌ Pendiente | Verificar |

---

## Dashboard Components

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/dashboard/WelcomeCard/index.jsx` | ✅ Traducido | — |
| `src/components/dashboard/LiveModeCard/index.jsx` | ✅ Traducido | — |
| `src/components/dashboard/FavoriteWorksCard/index.jsx` | ✅ Traducido | — |
| `src/components/dashboard/QuickStatsGrid/index.jsx` | ❌ Pendiente | "This Week", "This Month", "Per Hour", "Works", "Shifts", "Hours", "Average", "active", "completed", "worked" |
| `src/components/dashboard/ExportReportCard/index.jsx` | ❌ Pendiente | "Export Report", descripción, "PDF", "PNG", "Excel", "Premium" |

---

## Settings Sections

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/settings/CustomizationSection/index.jsx` | ✅ Traducido | — |
| `src/components/settings/SmokoSection/index.jsx` | ✅ Traducido | — |
| `src/components/settings/PreferencesSection/index.jsx` | ✅ Traducido | — |
| `src/components/settings/TurnRangeSection/index.jsx` | ✅ Traducido | — |
| `src/components/settings/HolidaySettingsSection/index.jsx` | ✅ Traducido | — |
| `src/components/settings/DeliverySection/index.jsx` | ✅ Traducido | — |
| `src/components/settings/ProfileSection/index.jsx` | ❌ Pendiente | "Profile", "Email", "Name" |
| `src/components/settings/SessionSection/index.jsx` | ❌ Pendiente | "Account", "Log out", "Terms of Service", "Privacy Policy", "Clear Everything", "Delete Account", "Manage Premium", "Upgrade to Premium" |

---

## Stats Components

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/stats/WeeklyComparison/index.jsx` | ❌ Pendiente | Verificar labels |
| `src/components/stats/DailyDistribution/index.jsx` | ❌ Pendiente | Verificar labels |
| `src/components/stats/MostProductiveDay/index.jsx` | ❌ Pendiente | Verificar labels |
| `src/components/stats/InteractiveCharts/index.jsx` | ❌ Pendiente | Verificar labels de gráficos |
| `src/components/stats/WeeklyStatsGrid/index.jsx` | ❌ Pendiente | Verificar |
| `src/components/stats/StatsProgressBar/index.jsx` | ❌ Pendiente | Verificar |
| `src/components/stats/ShiftTypeStats/index.jsx` | ❌ Pendiente | Verificar |
| `src/components/stats/SmokoStatusCard/index.jsx` | ❌ Pendiente | Verificar |
| `src/components/stats/DeliverySummary/index.jsx` | ❌ Pendiente | Verificar |
| `src/components/stats/PlatformComparison/index.jsx` | ❌ Pendiente | Verificar |
| `src/components/stats/VehicleEfficiency/index.jsx` | ❌ Pendiente | Verificar |
| `src/components/stats/FuelEfficiency/index.jsx` | ❌ Pendiente | Verificar |
| `src/components/stats/DeliveryHourlyAnalysis/index.jsx` | ❌ Pendiente | Verificar |

---

## Forms

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/forms/shift/ShiftForm/index.jsx` | ❌ Pendiente | "Work", "Select work", "Traditional Works", "Delivery Works", "Start date", "End date", "Break", "Notes (optional)", mensajes de validación |
| `src/components/forms/shift/BulkShiftOptions/WeeklyPattern.jsx` | ❌ Pendiente | "Select days of the week", "Mon"–"Sun", "Repeat for", "week/weeks", "Select at least one day" |
| `src/components/forms/work/WorkForm/index.jsx` | ❌ Pendiente | Verificar labels del formulario |
| `src/components/forms/work/DeliveryWorkForm/index.jsx` | ❌ Pendiente | Verificar labels del formulario |

---

## Modals

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/modals/shift/BulkShiftConfirmModal/index.jsx` | ❌ Pendiente | Verificar |
| `src/components/modals/shift/ShiftModal/index.jsx` | ❌ Pendiente | Verificar |
| `src/components/modals/work/WorkModal/index.jsx` | ❌ Pendiente | Verificar |
| `src/components/modals/liveMode/LiveModeFinishConfirmModal/index.jsx` | ❌ Pendiente | Verificar |

---

## Cards / Work

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/cards/work/WorkCard/index.jsx` | ❌ Pendiente | "Base rate:", "Night", "Saturday", "Sunday", "Holiday" |
| `src/components/cards/work/DeliveryWorkCard/index.jsx` | ❌ Pendiente | Verificar |

---

## Shifts Components

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/shifts/ShiftsEmptyState/index.jsx` | ❌ Pendiente | Verificar empty state strings |
| `src/components/shifts/WeeklyShiftsSection/index.jsx` | ❌ Pendiente | Verificar labels de semana |
| `src/components/filters/ShiftFilters/index.jsx` | ❌ Pendiente | Verificar filtros |

---

## Australia 88

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/australia88/Australia88DashboardCard/index.jsx` | ❌ Pendiente | "Working Holiday Visa", "Details", "Complete", "Remaining", "This week", "Year X complete!" |
| `src/components/australia88/Australia88StatsCard/` | ❌ Pendiente | Verificar |

---

## About / Feedback

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/about/FeedbackSection/index.jsx` | ❌ Pendiente | ~25 strings: "Your feedback matters", "How would you rate...", "What people are saying", tiempo relativo ("m ago", "h ago"), botones Send/Update |

---

## Otros / Alerts

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/alerts/DeleteAlert/index.jsx` | ❌ Pendiente | Verificar "Delete", "Cancel", "Are you sure?" |
| `src/components/work/ShareMessages/index.jsx` | ❌ Pendiente | Verificar |

---

## Resumen de progreso

| Categoría | ✅ Hecho | ❌ Pendiente |
|-----------|---------|------------|
| Infraestructura | 8 | 0 |
| Páginas | 4 | 2 |
| Layout | 1 | 1 |
| Dashboard | 3 | 2 |
| Settings | 6 | 2 |
| Stats | 0 | 13 |
| Forms | 0 | 4 |
| Modals | 0 | 4 |
| Cards | 0 | 2 |
| Shifts | 0 | 3 |
| Australia 88 | 0 | 2 |
| About | 0 | 1 |
| Otros | 0 | 2 |
| **TOTAL** | **22** | **38** |

---

## Notas

- Los strings del **Popover de Delivery** (contenido HTML con `<strong>`) se mantienen en inglés por ahora — requieren el componente `<Trans>` de react-i18next.
- `src/pages/Integrations.jsx` es el archivo con más strings (~50), prioridad baja ya que es pantalla secundaria.
- Los **labels de gráficos** en `src/config/chartConfig.js` también pueden necesitar traducción.
- Strings dinámicos con nombre de trabajos (ej: `"${work.name}" is currently active`) se mantienen parcialmente hardcoded — solo el texto fijo se traduce.
