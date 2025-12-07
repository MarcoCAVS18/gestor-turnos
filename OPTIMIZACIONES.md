# Optimizaciones del Proyecto

Este archivo documenta las áreas de mejora y optimización identificadas en el código del proyecto.

## 1. Refactorizar `firebaseService.js`

El archivo `src/services/firebaseService.js` contiene una cantidad significativa de código duplicado para manejar las entidades "normales" y de "delivery".

- **Problema:** Las funciones para CRUD (Crear, Leer, Actualizar, Eliminar) y suscripciones de datos para `trabajos` y `turnos` son casi idénticas a sus contrapartes `trabajos-delivery` y `turnos-delivery`. Esto aumenta la verbosidad, la posibilidad de errores y la dificultad de mantenimiento.

- **Solución Propuesta:**
  - Crear funciones genéricas para las operaciones CRUD. Por ejemplo, `addJob(userUid, newJob, isDelivery)` en lugar de `addJob` y `addDeliveryJob`.
  - Unificar las funciones de suscripción de datos (`subscribeToNormalData` y `subscribeToDeliveryData`) en una sola función que pueda manejar ambos tipos de datos, o al menos reutilizar la lógica común.
  - Esto reducirá las líneas de código y centralizará la lógica de interacción con Firestore.

## 2. Eliminar Archivo de Backup Redundante

- **Problema:** Existe un archivo `src/services/exportService.backup.js` que es una copia idéntica de `src/services/exportService.js`.
- **Solución Propuesta:** Eliminar el archivo `exportService.backup.js` para evitar confusiones y mantener el codebase limpio.

## 3. Centralizar Funciones de Utilidad

- **Problema:** El archivo `src/services/exportService.js` define funciones de utilidad como `formatCurrency`, `formatDate`, `formatTime`, y `calculateHours`. Estas funciones podrían ser útiles en otras partes de la aplicación.
- **Solución Propuesta:** Mover estas funciones a los archivos correspondientes en la carpeta `src/utils/` para promover la reutilización de código. Por ejemplo:
  - `formatCurrency` a `src/utils/currency.js`.
  - `formatDate` y `formatTime` a `src/utils/time/`.
  - `calculateHours` a `src/utils/time/` o `src/utils/shiftUtils.js`.

## 4. Refactorizar el hook `useCombinedStats`

- **Problema:** El hook `useCombinedStats` en `src/hooks/useCombinedStats.js` contiene una lógica de cálculo muy extensa y compleja dentro de un `useMemo` para `deliveryStats`. Esto hace que el hook sea difícil de leer, entender y mantener.
- **Solución Propuesta:**
  - Extraer la lógica de cálculo de `deliveryStats` a una nueva función pura en `src/utils/statsCalculations.js`. Esta nueva función (por ejemplo, `calculateDeliveryStats`) recibiría los datos necesarios como argumentos y devolvería el objeto de estadísticas.
  - El hook `useCombinedStats` importaría y llamaría a esta nueva función dentro del `useMemo`, manteniendo el hook limpio y centrado en la gestión del estado y los memos, no en la lógica de negocio compleja.

## 5. Eliminar `calcularHoras` redundante en `useCalculations`

- **Problema:** El hook `useCalculations` exporta una función `calcularHoras` que es simplemente un `useCallback` que envuelve a la función `calculateShiftHours` del `utils/time`.
- **Solución Propuesta:**
  - Eliminar la función `calcularHoras` del hook `useCalculations`.
  - Los componentes que necesiten esta funcionalidad pueden importar `calculateShiftHours` directamente desde `src/utils/time`, ya que es una función pura sin dependencias del estado del hook. Esto simplifica el hook y evita una capa de indirección innecesaria.