# i18n — Seguimiento de Traducción de Componentes

> **Estado actual:** Fase 2 completa
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
| `src/pages/Landing.jsx` | ✅ Traducido | — |
| `src/pages/Integrations.jsx` | ✅ Traducido | — |

---

## Layout

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/layout/Navigation/index.jsx` | ✅ Traducido | — |
| `src/components/layout/AuthLayout/index.jsx` | ✅ Traducido | — |

---

## Dashboard Components

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/dashboard/WelcomeCard/index.jsx` | ✅ Traducido | — |
| `src/components/dashboard/LiveModeCard/index.jsx` | ✅ Traducido | — |
| `src/components/dashboard/FavoriteWorksCard/index.jsx` | ✅ Traducido | — |
| `src/components/dashboard/QuickStatsGrid/index.jsx` | ✅ Traducido | — |
| `src/components/dashboard/ExportReportCard/index.jsx` | ✅ Traducido | — |

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
| `src/components/settings/ProfileSection/index.jsx` | ✅ Traducido | — |
| `src/components/settings/SessionSection/index.jsx` | ✅ Traducido | — |

---

## Stats Components

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/stats/WeeklyComparison/index.jsx` | ✅ Traducido | — |
| `src/components/stats/DailyDistribution/index.jsx` | ✅ Traducido | — |
| `src/components/stats/MostProductiveDay/index.jsx` | ✅ Traducido | — |
| `src/components/stats/InteractiveCharts/index.jsx` | ✅ Traducido | — |
| `src/components/stats/WeeklyStatsGrid/index.jsx` | ✅ Traducido | — |
| `src/components/stats/StatsProgressBar/index.jsx` | ✅ Traducido | — |
| `src/components/stats/ShiftTypeStats/index.jsx` | ✅ Traducido | — |
| `src/components/stats/SmokoStatusCard/index.jsx` | ✅ Traducido | — |
| `src/components/stats/DeliverySummary/index.jsx` | ✅ Traducido | — |
| `src/components/stats/PlatformComparison/index.jsx` | ✅ Traducido | — |
| `src/components/stats/VehicleEfficiency/index.jsx` | ✅ Traducido | — |
| `src/components/stats/FuelEfficiency/index.jsx` | ✅ Traducido | — |
| `src/components/stats/DeliveryHourlyAnalysis/index.jsx` | ✅ Traducido | — |

---

## Forms

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/forms/shift/ShiftForm/index.jsx` | ✅ Traducido | — |
| `src/components/forms/shift/BulkShiftOptions/WeeklyPattern.jsx` | ✅ Traducido | — |
| `src/components/forms/work/WorkForm/index.jsx` | ✅ Traducido | — |
| `src/components/forms/work/DeliveryWorkForm/index.jsx` | ✅ Traducido | — |

---

## Modals

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/modals/shift/BulkShiftConfirmModal/index.jsx` | ✅ Traducido | — |
| `src/components/modals/shift/ShiftModal/index.jsx` | ✅ Traducido | — |
| `src/components/modals/work/WorkModal/index.jsx` | ✅ Traducido | — |
| `src/components/modals/liveMode/LiveModeFinishConfirmModal/index.jsx` | ✅ Traducido | — |

---

## Cards / Work

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/cards/work/WorkCard/index.jsx` | ✅ Traducido | — |
| `src/components/cards/work/DeliveryWorkCard/index.jsx` | ✅ Traducido | — |

---

## Shifts Components

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/shifts/ShiftsEmptyState/index.jsx` | ✅ Traducido | — |
| `src/components/shifts/WeeklyShiftsSection/index.jsx` | ✅ Traducido | — |
| `src/components/filters/ShiftFilters/index.jsx` | ✅ Traducido | — |

---

## Australia 88

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/australia88/Australia88DashboardCard/index.jsx` | ✅ Traducido | — |
| `src/components/australia88/Australia88StatsCard/` | ✅ Traducido | — |

---

## About / Feedback

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/about/FeedbackSection/index.jsx` | ✅ Traducido | — |

---

## Otros / Alerts

| Archivo | Estado | Strings pendientes |
|---------|--------|--------------------|
| `src/components/alerts/DeleteAlert/index.jsx` | ✅ Traducido | — |
| `src/components/work/ShareMessages/index.jsx` | ✅ Traducido | — |

---

## Resumen de progreso

| Categoría | ✅ Hecho | ❌ Pendiente |
|-----------|---------|------------|
| Infraestructura | 8 | 0 |
| Páginas | 6 | 0 |
| Layout | 2 | 0 |
| Dashboard | 5 | 0 |
| Settings | 8 | 0 |
| Stats | 13 | 0 |
| Forms | 4 | 0 |
| Modals | 4 | 0 |
| Cards | 2 | 0 |
| Shifts | 3 | 0 |
| Australia 88 | 2 | 0 |
| About | 1 | 0 |
| Otros | 2 | 0 |
| **TOTAL** | **60** | **0** |

---

## Notas

- ✅ **Fase 2 completada:** Todos los componentes identificados en el plan han sido traducidos.
- Los strings del **Popover de Delivery** (contenido HTML con `<strong>`) se mantienen en inglés por ahora — requieren el componente `<Trans>` de react-i18next.
- Los **labels de gráficos** en `src/config/chartConfig.js` ya están traducidos mediante las claves `stats.charts.*`.
- Strings dinámicos con nombre de trabajos (ej: `"${work.name}" is currently active`) se mantienen parcialmente hardcoded — solo el texto fijo se traduce.

---

## Claves de traducción agregadas recientemente

### `dashboard.export`
- `formats.pdf` / `formats.png` / `formats.excel`

### `forms.shift.bulk.dayLabels`
- `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, `Sun`

### `forms.shift.validation`
- `positiveNumber`, `endAfterStart`

### `forms.work`
- `companyName`, `workColor`, `customColor`, `baseHourlyRate`, `ratesByShiftType`, `descriptionOptional`, `descriptionPlaceholder`

### `australia88`
- `formLabel`, `qualifiesDescription`, `regionalWork`, `notSure`, `checkHomeAffairs`

### `about.feedback`
- Todas las claves de feedback ya estaban definidas y se actualizó el componente para usarlas correctamente.
