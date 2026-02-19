# OPTIMIZACIONES.md

Este documento contiene el backlog activo de mejoras, auditorías y refactors pendientes del proyecto.
Todas las tareas listadas aquí deben considerarse requerimientos activos.

📌 IMPORTANTE
- Todas las tareas anteriores ya fueron completadas.
- Este archivo representa las tareas actuales pendientes.
- Mantener consistencia visual, evitar duplicación y respetar la arquitectura del proyecto.
- Priorizar reutilización de componentes UI existentes.
- Evitar queries innecesarias y reducir costos operativos.
- No introducir breaking changes sin migración clara.

---

## 1. ✅ Auditoría completa de costos (Firebase + APIs + Stripe)

### Implementado

**PremiumContext: 3 reads → 1 read por sesión** — `loadSubscriptionAndUsage()` combina init + subscription + liveModeUsage en 1 lectura.

**canUseLiveMode: 2 reads → 1 read** — Usa `loadSubscriptionAndUsage()` en vez de 2 llamadas separadas.

**Feedback query limitado** — `limit(50)` en vez de leer toda la colección (solo se muestran 10).

**Bulk shifts con writeBatch** — `addBulkShiftsService()` usa batch writes (1 round-trip por 500 docs vs N individuales).

**Stripe:** 3 endpoints limpios, sin redundancia.

**6 listeners activos:** Todos con cleanup correcto en useEffect return.

**Archivos:** premiumService.js, PremiumContext.jsx, firebaseService.js, DataContext.jsx

---

## 2. Reestructurar FeatureAnnouncementCard (mantener Live Mode)

### Contexto
El componente `FeatureAnnouncementCard` seguirá existiendo exactamente igual para Live Mode y jamás será reemplazado.

### Problema
Debe revisarse la estructura del proyecto para que este componente no quede ubicado de manera desordenada o inconsistente.

### Objetivo
Asegurar que su ubicación y organización sea coherente con la arquitectura general del proyecto.

### Requerimientos
- El componente dejará de llamarse `FeatureAnnouncementCard` (renombrar).
- Mantener funcionalidad intacta (Live Mode).
- Reubicarlo correctamente dentro de una estructura limpia.
- Reutilizar componentes UI claves (Card, Button, etc).

---

## 3. About: agregar ID (#) al componente Feedback para navegación directa

### Objetivo
Agregar un identificador (`id`) al componente principal de Feedback dentro de la página About, para permitir navegación directa mediante anchor.

### Contexto
El nuevo componente de Recomendaciones del Dashboard debe redirigir al usuario hacia About y automáticamente hacer scroll hasta la sección de Feedback.

### Requerimientos
- Agregar un `id` fijo al contenedor principal del componente Feedback (ej: `id="feedback"`).
- Al clickear la RecomendacionesCard del Dashboard:
  - navegar hacia `/about`
  - realizar scroll automático hacia el componente Feedback usando el ID.
- El scroll debe ser suave (smooth).
- Debe funcionar correctamente en Desktop y Mobile.
- Validar que funcione incluso si la página tarda en renderizar (evitar que el scroll falle por timing).

### Resultado esperado
El usuario hace click en la RecomendacionesCard y automáticamente termina en About, posicionado directamente en la sección de Feedback.

---

## 4. Crear componente interactivo de Recomendaciones en Dashboard

### Objetivo
Crear una nueva Card interactiva de SuggestedActionCard dentro del Dashboard.

### Ubicación requerida
- Debe colocarse en la segunda columna del Dashboard.
- Debe ubicarse exactamente en el contenedor donde actualmente están:
  - `TopWorkCard`
  - `NextShiftCard`
- El nuevo componente debe ser cuadrado.
- No es necesario dividir en dos columnas perfectas: lo importante es que sea cuadrado.

### Comportamiento
- Debe poder cerrarse (tener una cruz en una esquina).
- Si el usuario lo cierra:
  - `TopWorkCard` y `NextShiftCard` deben volver a ocupar el ancho completo del contenedor compartido con `FavoriteWorksCard`.

### Diseño
- Similar a `FeatureAnnouncementCard` respecto al background (ver variantes en `Card.jsx`).
- Contenido centrado.
- Texto blanco.
- Ícono grande estilo "Like", ligeramente rotado, ubicado en la parte superior.
- No usar la prop `title`.
- Toda la Card debe ser clickeable.

### Acción
Al hacer click, debe redirigir al usuario hacia la sección de Feedback (About).

### Nota
Este componente será reutilizable para futuras recomendaciones.

---

## 5. Fix Layout Desktop: navegación no ocupa el alto total

### Problema
En la última modificación se perdió el comportamiento donde la navegación en Desktop (Nav) ocupa el alto completo de la pantalla.

### Objetivo
Restaurar comportamiento correcto del layout.

### Requerimientos
- El Nav debe alcanzar el 100% del viewport height.
- Verificar comportamiento con scroll.
- No romper responsive.

---

## 6. Normalizar tamaños de Cards de trabajos

### Problema
Las Cards de trabajos no son consistentes en tamaño comparadas con:
- la tarjeta premium blureada
- tarjetas de delivery
- dot de delivery cuando no existen trabajos creados

### Objetivo
Unificar tamaños para consistencia visual.

### Requerimientos
- Ajustar tamaños y spacing de las cards.
- Mantener consistencia entre:
  - normal jobs
  - delivery jobs
  - premium locked state (blurred)
  - placeholders (dots)
- Verificar responsive.

---

## 7. Fix CustomizationSection: emojis en una sola línea con scroll horizontal

### Problema
En `CustomizationSection`, los emojis son muchos y en responsive generan problemas de layout.

### Objetivo
Mostrar los emojis en una sola línea con scroll horizontal.

### Requerimientos
- Implementar scroll X similar a `DeliveryPlatformsSection`.
- Mantener UX limpia.
- Debe funcionar correctamente en mobile y desktop.
- Evitar overflow visual feo o saltos de layout.

---

## 8. ✅ Verificación de cuentas y seguridad en formularios de pago (Stripe)

### Implementado

**Diagnóstico del tooltip "autocompletado inhabilitado":** Es un comportamiento esperado de localhost (HTTP). En producción, Firebase Hosting sirve HTTPS automáticamente — el tooltip NO aparece en producción.

**Content-Security-Policy agregado** en firebase.json — Whitelist para Stripe (js.stripe.com, api.stripe.com), Firebase (googleapis, firebaseio, cloudfunctions), Google Auth (identitytoolkit, securetoken). `object-src 'none'` y `base-uri 'self'` para prevenir inyección.

**HSTS reforzado** — Agregado `preload` a Strict-Transport-Security para elegibilidad en HSTS preload list.

**Source maps deshabilitados** — `GENERATE_SOURCEMAP=false` en .env para no exponer código fuente en producción.

**Autocomplete attributes** — Agregados `autoComplete` semánticos al formulario de pago (cc-name, billing country, billing postal-code, billing address-level2, billing street-address) + `autoComplete="on"` en el `<form>`.

**Console.log limpiados** — Removidos 3 console.log que exponían payment method IDs y subscription results en producción.

**Archivos:** firebase.json, .env, Premium.jsx

---

## 9. ✅ Refactor de Premium Page: modularizar código

### Implementado

**Premium.jsx: 1135 líneas → 44 líneas** — Ahora es solo un orquestador que decide qué vista mostrar.

**Carpeta `components/premium/` creada** con 12 archivos:
- `constants.js` — PREMIUM_BENEFITS, COUNTRIES, CARD_ELEMENT_STYLE, STATUS_CONFIG, formatDate
- `PaymentForm.jsx` — Formulario Stripe con CardElements y billing details
- `SuccessCelebration.jsx` — Modal de confetti post-pago
- `SubscriptionStatusCard.jsx` — Estado de suscripción (premium users)
- `AccountCard.jsx` — Cuenta del usuario (variante premium/free)
- `BenefitsRow.jsx` — Grid de beneficios (variante premium/free)
- `PaymentMethodCard.jsx` — Método de pago + total invertido
- `ManageSubscriptionCard.jsx` — Gestión y cancelación
- `HeroCard.jsx` — Hero card con precio (free users)
- `SecurityCard.jsx` — Garantías
- `PremiumUserView.jsx` — Layout completo para usuarios premium
- `FreeUserView.jsx` — Layout completo para usuarios free

**RecentInvoices component** — Nuevo componente que muestra las últimas 5 facturas del usuario con:
- Loading skeleton
- Empty state si no hay facturas
- Links para descargar PDF y ver online
- Hover actions (Download/View)

**Cloud Function `getInvoices`** — Nuevo endpoint GET que consulta `stripe.invoices.list()` con autenticación.

**`stripeService.getInvoices()`** — Nueva función frontend para consultar el endpoint.

**Archivos:** Premium.jsx, components/premium/*, functions/index.js, stripeService.js

---

## 10. ✅ Mejorar GoalsSection (más interactivo)

### Implementado

**StatsProgressBar mejorado:**
- Milestone badges animados: "Almost there!" (75%), "Goal reached!" (100%), "Overachiever!" (150%)
- Celebración visual con Trophy icon animado (rotate + scale spring animation)
- Mensajes dinámicos según exceso (exceeded goal, incredible work)
- Sparkle dots animados
- Gradiente emerald/teal de fondo en celebration card
- Porcentaje visible bajo la barra

**GoalsSection Settings mejorado:**
- Circular progress ring con animación SVG (framer motion)
- Quick preset buttons: Part-time (20h), Standard (38h), Full-time (40h), Extended (50h)
- Weekday average display (~8h on weekdays)
- Empty state con dashed border y CTA centrado
- AnimatePresence para transiciones suaves entre estados
- Dark mode support completo

**Archivos:** StatsProgressBar/index.jsx, GoalsSection/index.jsx

---

## 11. InteractiveCharts: mejorar PieCharts

### Problemas
- El PieChart debería tener animación de armado hasta completarse.
- El bloque donde aparece título del trabajo con su color está demasiado cerca del gráfico.

### Objetivo
Mejorar animación y layout.

### ✅ Implementado

**Animación PieChart habilitada** — `isAnimationActive` cambiado de `false` a `true` con `animationDuration: 1000ms`, `animationEasing: ease-out`.

**Legend spacing mejorado** — `height: 36 → 48`, `paddingTop: 12px` para separar leyenda del gráfico.

**Pie chart refinado** — `innerRadius: 55%`, `outerRadius: 90%` (donut más grueso), `paddingAngle: 3`, `cornerRadius: 3` para bordes redondeados.

**Archivos:** BaseChart/index.jsx, chartConfig.js

---

## 12. ✅ DailyDistribution: rediseño UI/UX

### Implementado

**Rediseño completo:**
- Barras de progreso animadas (framer motion) proporcionales al día con más earnings
- Click en cada día expande detalles (hours, earnings, shifts, $/h rate)
- Busiest day destacado con TrendingUp icon y color primario
- Summary footer con "X active days" y total
- Day abbreviations responsivas (Mon, Tue, etc.)
- Dark mode completo, sin scroll horizontal

**Archivo:** DailyDistribution/index.jsx

---

## 13. ✅ ShiftTypeStats: verificar colores de los shift types

### Problema encontrado

**Bug crítico:** `TURN_TYPE_COLORS` usaba claves capitalizadas en inglés ('Day', 'Afternoon') pero `getColorForType` en ShiftTypeStats accedía con claves españolas ('diurno', 'tarde', 'noche', 'nocturno', 'sabado', 'domingo') que **nunca matcheaban** → todos los colores caían al fallback gris `#6B7280`.

Además los colores estaban desalineados con `shiftTypesConfig.js` (la fuente de verdad). Por ejemplo, 'Day' era `#10B981` (verde) en colors.js pero `#F59E0B` (amarillo) en shiftTypesConfig.

### Implementado

**`TURN_TYPE_COLORS` corregido** — Claves lowercase (`day`, `afternoon`, `night`, `saturday`, `sunday`, `delivery`, `mixed`) alineadas con los shift type IDs reales. Colores sincronizados con `shiftTypesConfig.js`.

**`ShiftTypeStats.getColorForType` simplificado** — Ahora usa `TURN_TYPE_COLORS[key]` directamente con fallback `#6B7280`. Maneja `'undefined' → 'mixed'`.

**`ShiftTypeBadge.getColorAndConfig` corregido** — Ya no accede a `TURN_TYPE_COLORS.Day` (undefined con las nuevas claves). Ahora usa `TURN_TYPE_COLORS[shiftType]` dinámicamente.

**Archivos:** colors.js, ShiftTypeStats/index.jsx, ShiftTypeBadge/index.jsx

---

## 14. Analizar opciones de hosting (Australia y Nueva Zelanda)

### Objetivo
Analizar las mejores opciones de hosting según el proyecto, priorizando rendimiento y costos de renovación.

### Requerimientos
- Foco en países:
  - Australia
  - Nueva Zelanda
- Considerar costo de renovación como factor clave.
- Evitar proveedores tipo GoDaddy (descartado).
- Buscar alternativas similares a NIC.AR pero para AU/NZ.
- Evaluar:
  - hosting web
  - dominios
  - CDN
  - soporte SSL
  - integración con Firebase si aplica

### Resultado esperado
Documento comparativo con opciones recomendadas.
