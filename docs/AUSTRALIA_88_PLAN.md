# Australia 88 Days — Working Holiday Visa Tracker

## Que es esta feature?

Los usuarios con Working Holiday Visa en Australia necesitan acumular **88 dias** de trabajo calificado para extender el primer ano, y **176 dias** para el segundo. La app ya registra shifts (horas) y works (empleos). Esta feature agrega el tracking automatico de dias de visa basado en horas semanales trabajadas en empleos elegibles.

**Acceso:** Gratis para todos los usuarios.
**Activacion:** Cuando `holidayCountry === 'AU'` en los settings del usuario.

---

## Calculo de Dias de Visa

Los dias se calculan **por semana** (lunes a domingo) sumando horas de todos los empleos elegibles:

| Horas semanales       | Dias de visa |
|-----------------------|--------------|
| 35.25 h o mas         | 7 dias       |
| 28.25 h – 35 h        | 5 dias       |
| 21.25 h – 28 h        | 4 dias       |
| 14.25 h – 28 h        | 3 dias       |
| 7.25 h – 14 h         | 2 dias       |
| 4 h – 7 h             | 1 dia        |
| Menos de 4 h          | 0 dias       |

> Los dias de distintas semanas se **suman**. Un usuario puede tener multiples empleos elegibles y se cuentan juntos por semana.

---

## Hitos (Milestones)

- **88 dias** → Extension ano 1 completada
- **176 dias** → Extension ano 2 completada
- Despues de 176 dias: el tercer ano no se puede extender (mostrar felicitacion)

No necesitamos rastrear en que ano esta el usuario. Solo acumulamos dias y mostramos el hito siguiente.

---

## Flujo de Activacion

```
Usuario nuevo
  └─→ Ve modals de bienvenida (DemoModal)
        └─→ Al cerrar: solicitar geolocalizacion (navigator.geolocation)
              ├─→ Si acepta: reverse geocoding via bigdatacloud.net
              │     └─→ Si pais = AU: guardar holidayCountry = 'AU' en settings
              └─→ Si rechaza: Australia88Bar muestra CTA → Settings > Ubicacion

Usuario existente con holidayCountry = 'AU'
  └─→ Modo Australia activo desde el inicio de sesion
```

---

## Arquitectura de la Implementacion

### Nuevos archivos a crear

```
src/
├── services/
│   └── australia88Service.js          # Logica pura de calculo (sin React)
├── hooks/
│   └── useAustralia88.js              # Hook que conecta servicio + contextos
└── components/
    ├── dashboard/
    │   └── Australia88Bar/
    │       └── index.jsx              # Banner de progreso en Dashboard
    └── stats/
        └── Australia88WeekCard/
            └── index.jsx              # Flip card en Statistics
```

### Archivos existentes a modificar

| Archivo | Cambio |
|---------|--------|
| `src/services/firebaseService.js` | +3 lineas en `addJob` para persistir `australia88Eligible` |
| `src/components/forms/work/WorkForm/index.jsx` | Toggle condicional + campo en formData |
| `src/contexts/ConfigContext.jsx` | Nueva funcion `requestAustraliaGeodetection` |
| `src/pages/Dashboard.jsx` | Agregar `Australia88Bar` + conectar `DemoModal.onComplete` |
| `src/pages/Statistics.jsx` | Agregar `Australia88WeekCard` en columna derecha |
| `src/components/settings/HolidaySettingsSection/index.jsx` | Subtitulo explicativo |

---

## Detalle de Cada Componente

### 1. `australia88Service.js` — Servicio Puro

```javascript
// Funciones exportadas:
getVisaDaysFromWeeklyHours(hours)       // → 0 a 7
getMondayOfWeek(date)                   // → Date (lunes de esa semana)
groupShiftsByWeek(shifts)               // → Map<weekKey, shifts[]>
calculateTotalVisaDays(shifts, works)   // → { totalDays, weeklyBreakdown, currentMilestone }
```

- Solo cuenta shifts de works con `australia88Eligible === true` (igualdad estricta)
- `weeklyBreakdown` es un array `[{ weekKey, weekStart, weekEnd, hours, visaDays }]` ordenado cronologicamente
- `currentMilestone` es `88`, `176`, o `'complete'`
- Usa `createSafeDate()` del utils existente para parsear fechas de Firebase

### 2. `useAustralia88.js` — Hook React

```javascript
const {
  isAustraliaMode,       // boolean — holidayCountry === 'AU'
  totalVisaDays,         // number — dias acumulados totales
  currentWeekVisaDays,   // number — dias ganados esta semana (semana actual)
  milestone,             // 88 | 176 | 'complete'
  progressPercent,       // 0-100, relativo al hito actual
  weeklyBreakdown,       // array de semanas para la tabla
} = useAustralia88();
```

- Consume `DataContext` (shifts, works) y `ConfigContext` (holidayCountry)
- Memoizado — solo recalcula cuando cambian shifts o works
- Si `!isAustraliaMode` retorna ceros inmediatamente (sin calculo)
- `progressPercent` para el segundo hito (176) es relativo a los 88 dias adicionales (no 176 totales)

### 3. `Australia88Bar` — Banner en Dashboard

Tres estados:

**Estado A — holidayCountry no configurado:**
```
🦘  Activa Australia 88 → Settings > Ubicacion                    [X]
```
- Click en la barra navega a `/settings`

**Estado B — Australia mode activo:**
```
🦘  Working Holiday Visa                             X / 88 dias  [X]
████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (barra animada)
Solo 8 dias para completar el Ano 1
```

**Estado C — holidayCountry seteado pero no es 'AU':**
- No se renderiza

**Comportamiento:**
- Dismissible por sesion via `sessionStorage` (key: `au88_bar_dismissed`)
- Colores: gradiente azul-verde (`#005A9C → #0073CF → #00843D`)
- Animacion de entrada: `opacity + y: -8 → 0` via Framer Motion
- Barra de progreso animada con `motion.div` de width 0 → X%

**Ubicacion en Dashboard.jsx:**
- Importar y colocar justo debajo de `<PageHeader />`, antes de los grids

### 4. `Australia88WeekCard` — Flip Card en Statistics

Usa el **mismo patron exacto de animacion que `WelcomeCard`**:
- `AnimatePresence mode="wait"` con dos `motion.div`
- Variants: `{ initial: opacity 0 + scale 0.95 + blur 4px, animate: normal, exit: opacity 0 + scale 1.05 + blur 4px }`
- Duracion: 0.25s
- Auto-flip cada 10 segundos via `setInterval` + `useRef`
- Click manual → flip inmediato + reset del timer

**Cara frontal (frente):**
```
🦘  Working Holiday Visa
    Esta semana
    3 dias           ← numero grande
    Total acumulado: 47 dias
```

**Cara trasera (reverso):**
```
🦘  Total acumulado
    47 / 88 dias     ← numero grande
    ████████████░░░░  ← mini progress bar
    Sem 4: 35.5h → +5d
    Sem 3: 28.0h → +4d
    Sem 2: 7.0h  → +1d
    Sem 1: 0h    → +0d
```

**Retorna `null` si `!isAustraliaMode`** (no necesita wrapper condicional en Statistics.jsx)

**Ubicacion en Statistics.jsx:**
- Desktop: en la columna derecha (1/3), despues de `SmokoStatusCard`
- Mobile: en el stack vertical, despues de los charts de la semana

### 5. Toggle en WorkForm

Solo visible cuando `isAustraliaMode === true`, despues del campo Description:

```
[ ] Este trabajo califica para la extension de Working Holiday Visa
    Solo para trabajos en zona regional o critica de Australia
```

- Checkbox nativo con `accentColor` del theme del usuario
- Campo `australia88Eligible: boolean` en el formData (default: `false`)

### 6. Geolocalizacion en ConfigContext

```javascript
const requestAustraliaGeodetection = async () => {
  if (holidayCountry || geoDetectionDone) return;
  // navigator.geolocation.getCurrentPosition(...)
  // fetch 'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=...&longitude=...&localityLanguage=en'
  // if (data.countryCode === 'AU') savePreferences({ holidayCountry: 'AU' })
}
```

- Se llama desde `Dashboard.jsx` en el `onComplete` callback de `DemoModal`
- `DemoModal` ya acepta el prop `onComplete` (actualmente no conectado)
- API de bigdatacloud.net no requiere API key para nivel pais

### 7. Subtitulo en HolidaySettingsSection

Agregar arriba del selector de pais:
```
Selecciona tu ubicacion para detectar feriados automaticamente y activar
el seguimiento de dias Working Holiday Visa (Australia).
```

---

## Flujo de Datos Completo

```
Firestore works { australia88Eligible: true }
  ↓ DataContext.works[]
  ↓
australia88Service.calculateTotalVisaDays(shifts, works)
  ↓
useAustralia88 hook
  ├── isAustraliaMode (de ConfigContext.holidayCountry)
  ├── totalVisaDays
  ├── currentWeekVisaDays
  ├── milestone
  ├── progressPercent
  └── weeklyBreakdown
        ↓                          ↓
  Australia88Bar            Australia88WeekCard
  (Dashboard.jsx)           (Statistics.jsx)

ConfigContext.requestAustraliaGeodetection()
  ← llamado desde DemoModal.onComplete en Dashboard.jsx
  → si AU → savePreferences({ holidayCountry: 'AU' })
  → ConfigContext actualiza holidayCountry
  → isAustraliaMode se vuelve true en toda la app
```

---

## Edge Cases Importantes

| Caso | Comportamiento |
|------|---------------|
| Work sin campo `australia88Eligible` (campo ausente) | No cuenta (strict `=== true`). Sin necesidad de migracion |
| Shift sin `startTime`/`endTime` | Contribuye 0 horas, no da error |
| Usuario deniega geolocalizacion | `holidayCountry` queda null → bar muestra CTA de settings |
| Usuario setea `holidayCountry = 'AU'` manualmente | Modo Australia activo inmediatamente |
| Total > 88 dias | `progressPercent` se calcula vs 176, denominador cambia a 176 |
| Total > 176 dias | Mensaje de felicitacion, barra al 100%, milestone = 'complete' |
| Semanas con 0 horas elegibles | No aparecen en `weeklyBreakdown` (las semanas sin eligible shifts no se agregan) |
| `addJob` en firebaseService | Agregar explicitamente `australia88Eligible` al jobData (no se spread automaticamente) |

---

## Orden de Implementacion Recomendado

```
Fase 1 — Base (sin dependencias entre si):
  1. src/services/australia88Service.js
  2. src/hooks/useAustralia88.js

Fase 2 — Data layer:
  3. src/services/firebaseService.js (addJob)
  4. src/components/forms/work/WorkForm/index.jsx

Fase 3 — ConfigContext:
  5. src/contexts/ConfigContext.jsx (requestAustraliaGeodetection)

Fase 4 — UI (paralelo una vez que fase 1-3 este lista):
  6. src/components/dashboard/Australia88Bar/index.jsx
  7. src/pages/Dashboard.jsx (agregar bar + conectar DemoModal)
  8. src/components/stats/Australia88WeekCard/index.jsx
  9. src/pages/Statistics.jsx (agregar card)
 10. src/components/settings/HolidaySettingsSection/index.jsx (subtitulo)
```

---

## Checklist de Verificacion

- [ ] `getVisaDaysFromWeeklyHours(35.25)` → 7
- [ ] `getVisaDaysFromWeeklyHours(4)` → 1
- [ ] `getVisaDaysFromWeeklyHours(3.9)` → 0
- [ ] Crear work con toggle activado → `australia88Eligible: true` en Firestore
- [ ] Editar work → toggle refleja el valor guardado
- [ ] Con `holidayCountry !== 'AU'`: toggle, bar y card NO se muestran
- [ ] Con shifts de prueba en multiples semanas → suma correcta en bar y card
- [ ] Dismiss la bar → navegar y volver → sigue dismissida
- [ ] Nueva pestana → bar reaparece (sessionStorage limpia)
- [ ] Emular geolocalizacion Sydney en DevTools → `holidayCountry = 'AU'` se persiste en Firestore
- [ ] Geolocalizacion denegada → bar muestra fallback CTA
- [ ] Con 88 dias exactos → milestone cambia a 176, progress vuelve a 0%
- [ ] Con 176 dias → mensaje de felicitacion, progress 100%

---

## Referencias de Archivos Clave

- Work creation form: [src/components/forms/work/WorkForm/index.jsx](../src/components/forms/work/WorkForm/index.jsx)
- WelcomeCard (patron de animacion flip): [src/components/dashboard/WelcomeCard/index.jsx](../src/components/dashboard/WelcomeCard/index.jsx)
- Config context: [src/contexts/ConfigContext.jsx](../src/contexts/ConfigContext.jsx)
- Firebase service: [src/services/firebaseService.js](../src/services/firebaseService.js)
- Dashboard page: [src/pages/Dashboard.jsx](../src/pages/Dashboard.jsx)
- Statistics page: [src/pages/Statistics.jsx](../src/pages/Statistics.jsx)
- BaseAnnouncementCard (base para el bar): [src/components/cards/base/BaseAnnouncementCard/index.jsx](../src/components/cards/base/BaseAnnouncementCard/index.jsx)
