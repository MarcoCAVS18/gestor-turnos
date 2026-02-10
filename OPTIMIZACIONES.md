# OPTIMIZACIONES.md

Este documento define las tareas pendientes de optimización y mejoras del proyecto.
Todas las tareas listadas aquí deben ser tratadas como requerimientos activos.

📌 IMPORTANTE:
- Estas tareas NO están hechas.
- Deben ejecutarse en orden lógico.
- Mantener consistencia de UI/UX y evitar breaking changes.
- Si se requiere refactor, hacerlo con código limpio y reutilizable.
- No dejar TODOs sin resolver.

---

## 1. Fix WeekNavigator: rango de fechas incorrecto ✅

### Problema
En `WeekNavigator` las fechas NO se procesan correctamente.
El título cambia correctamente (ej: "Last week", "2 weeks ago"), pero el rango de fechas mostrado queda fijo:

Ejemplo incorrecto:
`February 9 - February 9`

Este rango se repite para todas las semanas cuando debería actualizarse según el rango real.

### Objetivo
- Corregir el cálculo del rango de fechas mostrado.
- El rango debe reflejar el inicio y fin real de la semana seleccionada.

### Requerimientos
- Debe actualizarse correctamente al navegar semanas hacia atrás y hacia adelante.
- Validar el comportamiento en semanas que cruzan meses (ej: Jan 29 - Feb 4).
- Validar que el formato sea consistente y legible.

**Commit:** `33ebceb` - fix week navigator date range display

---

## 2. Mejoras UI Dark Mode: agregar una variante de background adicional ✅

### Problema
En Dark Mode hay backgrounds que se confunden entre sí.
Algunos componentes renderizan contenedores con el mismo color que el fondo general, lo que genera poca separación visual.

Esto ocurre principalmente en:
- `ShiftCard` (detalles internos)
- Contenedores secundarios dentro de cards
- Secciones con background nested

### Objetivo
Agregar una variante adicional de color (ej: `surface2`, `cardSecondary`, etc.) para mejorar contraste.

### Requerimientos
- Definir un nuevo color reutilizable (en theme/config global).
- Aplicarlo en contenedores secundarios donde actualmente se pierde contraste.
- Mantener consistencia visual y no romper Light Mode.
- Revisar UI general en:
  - ShiftCard
  - Cards de estadísticas
  - Modales
  - Contenedores internos

**Implementación:**
- Agregados colores `surface`, `surface2`, `surface3`, `surfaceHover` en `colorUtils.js` y `useThemeColors.js`
- Nuevas variantes de Card: `variant="surface"`, `variant="surface2"`, `variant="surface3"`
- Estos colores proporcionan mejor contraste en Dark Mode sin afectar Light Mode

**Commit:** `e284b9c` - add surface color variants for better dark mode contrast

---

## 3. Revisar Live Mode + guardado de turnos (shift saving) ✅

### Problema
El comportamiento del Live Mode y el guardado de turnos necesita ser revisado.

Se sospecha que:
- Lunes a viernes (day / afternoon / night) funciona correctamente.
- Sábado, domingo calculamos que no funciona correctamente.
- Revisar holidays

**Problema crítico identificado:**
Un turno que cruza medianoche (ej: Viernes 9pm - Sábado 3am) NO dividía el cálculo por tipo de día.
- Antes: TODO el turno se calculaba con el rate del día de inicio (viernes weekday)
- Ahora: Se divide en segmentos y cada uno usa su rate correcto (viernes night + sábado saturday)

### Objetivo
Analizar y corregir toda la lógica de guardado y cálculo para shifts según el día.

### Requerimientos
- Validar cálculos en: ✅
  - Weekdays ✅
  - Saturday ✅
  - Sunday ✅
  - Holidays ✅
- Confirmar que el modo Live Mode calcula correctamente horas y rate. ✅
- Revisar lógica de detección de tipo de día. ✅
- Revisar que los shifts se persistan correctamente en Firestore. ✅

### ✅ Implementación Completada

**Cambios realizados en calculationService.js:**

1. **Nueva función `splitShiftIntoSegments`:**
   - Divide turnos que cruzan medianoche en segmentos por día
   - Cada segmento tiene su propia fecha para detectar el tipo de día correcto
   - Maneja turnos de 24+ horas (múltiples días)

2. **Refactorización de `calculatePayment`:**
   - Procesa cada segmento con su propio tipo de día
   - Prioridad correcta: Holiday > Sunday > Saturday > Weekday
   - Weekdays aplican day/afternoon/night rates según hora del día
   - Smoko se aplica al turno completo, no a cada segmento

**Ejemplos de casos cubiertos:**
- Viernes 9pm - Sábado 3am: 3hrs night (viernes) + 3hrs saturday = correcto ✅
- Sábado 11pm - Domingo 2am: 1hr saturday + 2hrs sunday = correcto ✅
- Viernes 11pm - Sábado 1am (holiday): 1hr night + 1hr holiday = correcto ✅

**Archivos modificados:**
- [calculationService.js](src/services/calculationService.js) - lógica completa de segmentación

**Commit:** [pendiente]

---

## 4. Analizar el uso del campo Base Price al guardar trabajos ✅

### Problema
Existe un campo "Base Price" al guardar un trabajo.
Se debe verificar si realmente se utiliza en cálculos o lógica de negocio.

### Objetivo
Determinar si el campo se usa o es redundante.

### Requerimientos
- Buscar en todo el proyecto dónde se utiliza "Base Price".
- Si no se utiliza:
  - evaluar eliminarlo del modelo
  - eliminarlo de formularios y validaciones
  - limpiar Firestore si corresponde
- Si se utiliza:
  - documentar claramente su función
  - asegurar que esté bien integrado en cálculos

### ✅ Hallazgos y Conclusión

**Aclaración:** El campo real es `baseRate`, NO `basePrice`.

**Resultado:** El campo `baseRate` **SÍ SE UTILIZA ACTIVAMENTE** y **NO DEBE ELIMINARSE**.

**Usos encontrados (38 referencias):**
- ✅ Lógica de cálculos de pago (fallback rate)
- ✅ Persistencia en Firestore
- ✅ Validación requerida en formularios
- ✅ Visualización en múltiples componentes UI
- ✅ Exports y reportes

**Reporte completo:** Ver `REPORT_BASE_RATE_ANALYSIS.md`

**Campo candidato para investigación futura:** `baseRatePerOrder` en delivery works (parece no usarse).

---

## 5. Implementar creación masiva de turnos (Bulk Shift Creation)

### Objetivo
Crear funcionalidad para que el usuario pueda crear un turno y replicarlo en múltiples días sin hacerlo manualmente uno por uno.

### UX/UI esperado
Cuando el usuario crea un shift, debe poder elegir:
- múltiples días de la semana
- múltiples fechas específicas (opcional)
- rango de fechas (opcional)

Ejemplo:
"Crear este turno todos los lunes, martes y miércoles por 4 semanas".

### Requerimientos técnicos
- Diseñar una UI intuitiva dentro del flujo actual de creación de shift.
- Mantener compatibilidad con la estructura actual de shifts.
- Validar que el guardado masivo no genere duplicados involuntarios.
- Agregar confirmación final antes de crear múltiples shifts.
- Asegurar que el usuario pueda cancelar o editar antes de confirmar.

---

## 6. Integrar feriados automáticos por país + estado/provincia ✅

### Problema
Actualmente el usuario debe configurar manualmente el valor de hora Holiday.
Pero la app no detecta automáticamente qué días son feriados.

### Objetivo
Implementar un sistema automático que detecte feriados según país y región.

### Requerimientos
- Usar una API o librería completamente gratuita que permita obtener feriados globales. ✅
- Permitir que el usuario configure:
  - país ✅
  - estado/provincia/región (cuando aplique) ✅
- Guardar estas preferencias en el perfil del usuario. ✅
- Al calcular shifts, detectar si el día es Holiday y aplicar el rate correspondiente. ✅
- Podemos utilizar la solicitud del usuario de saber su ubicacion para realizar proceso rapidamente. ✅
- Crear un componente UI para selección de país y región. ✅

Notas importantes:
- Algunos feriados dependen de regiones específicas.
- Debe existir fallback si no hay región disponible.

### ✅ Implementación Completada

**Librería utilizada:** `date-holidays` (completamente gratuita, offline, 100+ países)

**Backend:**
- holidayService.js con detección automática y geolocalización
- Integración en calculationService para aplicar rates automáticamente
- Campos en perfil de usuario: holidayCountry, holidayRegion, useAutoHolidays
- Actualización de ConfigContext, CalculationsContext, StatsContext

**UI:**
- HolidaySettingsSection en Settings con selector de país/región
- Botón de geolocalización para autodetección
- HolidayBadge para mostrar en shift cards
- Integración completa en ShiftCard y DeliveryShiftCard

**Commits:**
- `4ac1150` - implement automatic holiday detection backend
- `e7e93b2` - add holiday settings UI and holiday badges

---

## 7. Crear páginas de error (404 y Server Error) ✅

### Objetivo
Crear páginas dedicadas para:
- 404 Not Found
- Error de servidor / app no disponible

### Assets disponibles
Existen SVGs grandes ya creados en:
`assets/SVG/`

Nombres:
- `404.svg`
- `error.svg`

### Requerimientos
- Crear pages accesibles desde routing.
- Aplicar estilo consistente con la app.
- Asegurar que funcionen en Dark y Light mode.
- Agregar botón para volver al Home.

**Commit:** `bc0e694` - add 404 and server error pages

---

## 8. Eliminar todos los emojis del proyecto ✅

### Objetivo
Eliminar absolutamente todos los emojis visibles en el proyecto.

### Requerimientos
- Buscar emojis en:
  - textos UI
  - botones
  - mensajes de error
  - labels
  - placeholders
  - componentes premium
- Reemplazar por texto limpio o iconografía consistente (lucide-react con color si aplica).
- No romper traducciones o estilos.

**Commit:** `80a2307` - remove all visible emojis from UI

---

## 9. Logo Premium en Header ✅

### Objetivo
Existe un nuevo SVG premium (logo premium).
Cuando el usuario sea Premium, debe reemplazarse el logo normal por el premium.

### Requerimientos
- Detectar correctamente el estado Premium del usuario.
- En el header principal:
  - si user es premium => mostrar `premium.svg`
  - si no => mostrar logo normal
- Asegurar que el SVG se adapte responsive.
- Mantener compatibilidad con Dark/Light.

**Commit:** `19f5eab` - show premium logo in header for premium users

---

## 10. Stripe: solicitar datos de facturación (Billing Details)

### Objetivo
Definir si el sistema debe solicitar datos de facturación completos mediante Stripe.

### Requerimientos
- Evaluar implementación actual del formulario de tarjeta.
- Si corresponde solicitar billing details:
  - agregar campos de dirección
  - ciudad, postal code, país, etc.
- Determinar dónde se guardan esos datos.
- Ajustar UI del checkout para que sea clara y profesional.

---

## 11. Mejorar página Premium para usuarios Premium

### Problema
La página Premium actual no es completa para usuarios que ya son premium.

### Objetivo
Crear una sección completa de gestión de cuenta premium.

### Requerimientos
La página debe permitir:
- visualizar estado de suscripción
- ver factura / invoice
- cancelar suscripción
- mostrar fecha de expiración (si cancela, sigue activa hasta fin de ciclo)
- acceso a historial de pagos (si está disponible en Stripe)

Debe ser clara, limpia y tipo "Account management".

---

## 12. Auditoría total de seguridad + limpieza de footer + nueva página humana

### Objetivo
Realizar un análisis general de seguridad del proyecto y mejorar credibilidad.

### Requerimientos
- Revisar seguridad general:
  - Firestore rules
  - auth flows
  - protección de endpoints
  - validaciones en frontend
  - evitar fugas de datos sensibles
- Eliminar eventualmente botones de Github y Twitter del footer.
- Crear nueva página estilo "About / Who am I":
  - texto humano y sincero
  - explicar qué es el proyecto
  - explicar objetivos
  - motivación real
  - contacto para soporte o sugerencias
  - tono amigable y transparente

---

## 13. Auditoría SEO completa

### Objetivo
Optimizar el sitio para posicionamiento en buscadores.

### Requerimientos
- Revisar estructura SEO:
  - meta tags
  - title dinámico por página
  - description
  - open graph
  - sitemap
  - robots.txt
- Buscar palabras clave recomendadas según el propósito del sitio.
- Preparar contenido mínimo para posicionamiento real.
- Asegurar performance (Core Web Vitals).
- Optimizar indexabilidad de páginas públicas.

## 14. Mejorar exportación en PNG (Report Export)

### Problema
Actualmente los exports en PNG presentan múltiples problemas de contenido y diseño:

- No existe una separación correcta en el título (layout inconsistente).
- Falta información del usuario en el export.
- Los gráficos **Weekly Evolution** y **Hours by Shift Type** se renderizan vacíos.
- Los datos del bloque **Summary** están incompletos.
- La tabla **TopWorks** también está incompleta o no refleja correctamente la data real.
- El diseño general se ve como una hoja A4 exportada a imagen, lo cual no es necesario ni ideal.

### Objetivo
Mejorar completamente el export en PNG para que sea:
- visualmente atractivo
- consistente con el diseño de la app (estilo cards)
- dinámico según el contenido
- correcto en datos y gráficos

### Requerimientos
- Corregir el layout del título (padding/margin/separación correcta).
- Agregar información del usuario en el export:
  - nombre del usuario
  - desde cuándo es premium (si aplica)
  - estado premium / free
  - NO utilizar fotografía ni avatar.
- Corregir render de gráficos:
  - Weekly Evolution debe mostrar data real
  - Hours by Shift Type debe mostrar data real
  - validar que el export capture correctamente charts canvas/SVG.
- Completar datos del Summary:
  - validar cálculo de totales
  - validar horas y earnings
  - validar breakdown por tipo de shift
- Completar correctamente TopWorks:
  - validar que muestre trabajos reales
  - validar orden, horas y total generado
- Mejorar estilos generales:
  - aplicar look similar a cards reales de la app
  - spacing limpio y moderno
  - jerarquía visual clara (títulos, subtítulos, bloques)
- El export NO debe forzarse a formato A4.
  - el PNG puede adaptarse al contenido
  - la distribución de elementos puede variar para que no parezca un PDF convertido en imagen
- Validar export en Dark y Light mode.

---

## 15. Auditoría de costos Firebase (Storage + Firestore + Services)

### Problema
Se necesita analizar el comportamiento de Firebase y todos sus servicios utilizados para evitar llamadas innecesarias que puedan generar costos elevados en producción.

Existe riesgo de:
- lecturas repetidas en Firestore
- suscripciones activas sin cleanup
- re-renders que disparan queries innecesarias
- uso incorrecto de Storage
- duplicación de requests por usuario

### Objetivo
Realizar auditoría completa del consumo de Firebase y optimizar para minimizar costos sin afectar UX.

### Requerimientos
- Analizar uso de:
  - Firestore reads/writes
  - listeners en tiempo real (onSnapshot)
  - Firebase Storage (uploads/downloads)
  - Firebase Auth
  - cualquier otro servicio activo
- Detectar llamadas repetidas o innecesarias.
- Verificar que todas las suscripciones tengan cleanup correcto.
- Reducir lecturas redundantes:
  - caching local cuando aplique
  - evitar re-fetch por renders
  - usar paginación donde sea necesario
- Confirmar que queries estén bien indexadas y optimizadas.
- Identificar potenciales puntos donde se generan costos por uso indebido.
- Documentar recomendaciones y cambios aplicados.
- Asegurar que la app sea escalable sin costos inesperados.


---

📌 FINAL CHECKLIST GLOBAL
Antes de cerrar estas tareas:
- Verificar que no existan errores en consola
- Revisar funcionamiento en mobile y desktop
- Revisar Light/Dark mode
- Confirmar que Firestore no tenga writes duplicados
- Confirmar que los cálculos de shifts son correctos en todos los escenarios
