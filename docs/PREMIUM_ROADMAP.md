# Premium System Roadmap

Este documento contiene el plan de implementación pendiente para el sistema Premium de Orary.

---

## 1. LockedFeatureCard - Contador de Sesiones

**Archivo:** `src/components/ui/LockedFeatureCard/index.jsx`

**Tarea:** Agregar contador visual de sesiones restantes para usuarios gratuitos.

**Implementación propuesta:**
```jsx
// Agregar prop para mostrar uso
<LockedFeatureCard
  title="Live Mode"
  usage={{ current: 3, limit: 5 }}  // 3 de 5 usadas
  onUpgrade={() => openPremiumModal()}
/>

// Mostrar en el card:
// "3/5 sesiones usadas este mes"
// Barra de progreso visual
```

**Consideraciones:**
- Obtener datos de `useLiveMode()` → `liveModeUsage`
- Mostrar barra de progreso con colores (verde → amarillo → rojo)
- Cuando llegue a 5/5, mostrar "Límite alcanzado"

---

## 2. PremiumModal - Mejoras de Diseño

**Archivo:** `src/components/modals/premium/PremiumModal/index.jsx`

### 2.1 Gradiente Animado con Efecto Reflejo Circular

**Tarea:** El gradiente del modal debe moverse de manera circular creando un efecto de reflejo.

**Implementación propuesta:**
```jsx
// CSS Keyframes para animación circular
const gradientAnimation = {
  '@keyframes rotateGradient': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  }
};

// O usando pseudo-elementos con rotación
<motion.div
  className="absolute inset-0 overflow-hidden"
  style={{
    background: `conic-gradient(
      from 0deg at 50% 50%,
      ${PREMIUM_COLORS.lighter} 0deg,
      ${PREMIUM_COLORS.light} 90deg,
      ${PREMIUM_COLORS.primary} 180deg,
      ${PREMIUM_COLORS.light} 270deg,
      ${PREMIUM_COLORS.lighter} 360deg
    )`,
  }}
  animate={{ rotate: 360 }}
  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
/>

// Capa interior para que el contenido no rote
<div className="absolute inset-1 bg-gradient-premium rounded-2xl" />
```

**Alternativa con CSS puro:**
```css
.premium-modal-bg {
  background: linear-gradient(
    135deg,
    #FFF3CD 0%,
    #F5C518 25%,
    #D4A000 50%,
    #F5C518 75%,
    #FFF3CD 100%
  );
  background-size: 400% 400%;
  animation: shimmer 4s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### 2.2 Reemplazar Crown por Logo de la App

**Tarea:** Cambiar el icono Crown decorativo por el logo de Orary.

**Ubicación actual (línea 66-74):**
```jsx
// ANTES
<Crown
  className="absolute -right-6 -bottom-6 opacity-[0.08]"
  size={140}
  ...
/>

// DESPUÉS
<img
  src="/assets/SVG/logo.svg"
  alt=""
  className="absolute -right-6 -bottom-6 opacity-[0.08]"
  style={{
    width: '140px',
    height: '140px',
    transform: 'rotate(-15deg)',
    filter: 'grayscale(100%)',
  }}
/>
```

### 2.3 Beneficios a Mostrar (ACTUALIZADO)

**ELIMINAR estos beneficios si existen:**
- ~~Early access to new features~~
- ~~No ads (future)~~

**Beneficios actuales (ya correctos):**
1. Unlimited Live Mode
2. Advanced Statistics
3. Priority Support
4. Data Export

---

## 3. Botones del PremiumModal

**Archivo:** `src/components/modals/premium/PremiumModal/index.jsx`

### 3.1 Botón Cancel → Ghost Variant

```jsx
// ANTES
<Button
  variant="solid"
  onClick={onClose}
  style={{
    backgroundColor: `${PREMIUM_COLORS.text}15`,
    color: PREMIUM_COLORS.text,
  }}
>
  Maybe Later
</Button>

// DESPUÉS
<Button
  variant="ghost"
  onClick={onClose}
  className="flex-1"
  style={{ color: PREMIUM_COLORS.text }}
>
  Maybe Later
</Button>
```

### 3.2 Crear Variante Premium Gold para Button

**Archivo:** `src/components/ui/Button/index.jsx`

**Tarea:** Agregar nueva variante `premium` al componente Button.

```jsx
// Agregar a las variantes existentes
const BUTTON_VARIANTS = {
  // ... existing variants ...
  premium: {
    base: 'font-semibold shadow-lg transition-all duration-300',
    idle: `
      bg-gradient-to-r from-[#D4A000] via-[#F5C518] to-[#D4A000]
      text-[#1a1a1a]
      border-none
      hover:shadow-xl
      hover:scale-[1.02]
    `,
    // Efecto shimmer en hover
    hover: 'bg-[length:200%_100%] animate-shimmer',
  },
};

// O como prop especial:
{variant === 'premium' && (
  <style>
    {`
      @keyframes shimmer {
        0% { background-position: 100% 0; }
        100% { background-position: -100% 0; }
      }
      .btn-premium:hover {
        animation: shimmer 1.5s infinite;
      }
    `}
  </style>
)}
```

**Uso en PremiumModal:**
```jsx
<Button
  variant="premium"
  onClick={handleLetsGo}
  icon={ArrowRight}
  iconPosition="right"
>
  Let's Go!
</Button>
```

---

## 4. Premium Button en Navigation (Desktop Only)

**Archivo:** `src/components/layout/Navigation/index.jsx`

### Especificaciones:
- **Solo visible en desktop** (usar `useIsMobile()`)
- **Ubicación:** Mismo lugar donde aparece Live Mode
- **Comportamiento:** Cuando Live Mode se activa, se reemplaza con animación fade de izquierda a derecha
- **No visible si el usuario ya es Premium**

### Implementación propuesta:

```jsx
import { AnimatePresence, motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { usePremium, PREMIUM_COLORS } from '../../contexts/PremiumContext';
import { useLiveMode } from '../../hooks/useLiveMode';

const Navigation = () => {
  const isMobile = useIsMobile();
  const { isPremium } = usePremium();
  const { isActive: isLiveModeActive } = useLiveMode();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Solo mostrar en desktop y si no es premium
  const showPremiumButton = !isMobile && !isPremium && !isLiveModeActive;

  return (
    <>
      {/* ... existing navigation ... */}

      {/* Desktop: Premium/LiveMode area */}
      {!isMobile && (
        <div className="relative h-10 w-32">
          <AnimatePresence mode="wait">
            {isLiveModeActive ? (
              <motion.div
                key="livemode"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                {/* Live Mode indicator */}
                <LiveModeIndicator />
              </motion.div>
            ) : !isPremium && (
              <motion.button
                key="premium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onClick={() => setShowPremiumModal(true)}
                className="absolute inset-0 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: PREMIUM_COLORS.lighter,
                  color: PREMIUM_COLORS.primary,
                }}
                whileHover={{ scale: 1.02 }}
              >
                <Crown size={18} style={{ color: PREMIUM_COLORS.gold }} />
                <span className="text-sm font-medium">Upgrade</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </>
  );
};
```

### Animación Fade Left-to-Right:
```jsx
// Cuando LiveMode se activa:
// Premium Button sale hacia la derecha (x: 20, opacity: 0)
// LiveMode Indicator entra desde la izquierda (x: -20 → x: 0)

// Cuando LiveMode se desactiva:
// LiveMode Indicator sale hacia la derecha
// Premium Button entra desde la izquierda
```

---

## 5. Página Premium - Nueva Distribución

**Archivo:** `src/pages/Premium.jsx`

### Layout Actual vs Propuesto:

**Actual:**
```
┌─────────────────────────────────┐
│ Header con user info            │
├─────────────────────────────────┤
│ Plan comparison (2 columns)     │
├─────────────────────────────────┤
│ Payment form                    │
└─────────────────────────────────┘
```

**Propuesto (decidir cuál prefieres):**

### Opción A: Hero + Cards
```
┌─────────────────────────────────┐
│ Hero Section                    │
│ - Logo grande + Crown           │
│ - "Unlock Premium"              │
│ - Price: $1.99/month            │
├─────────────────────────────────┤
│ Benefits Grid (2x2)             │
│ ┌─────────┐ ┌─────────┐         │
│ │ Benefit │ │ Benefit │         │
│ └─────────┘ └─────────┘         │
│ ┌─────────┐ ┌─────────┐         │
│ │ Benefit │ │ Benefit │         │
│ └─────────┘ └─────────┘         │
├─────────────────────────────────┤
│ CTA Button (Subscribe)          │
├─────────────────────────────────┤
│ Current plan status             │
└─────────────────────────────────┘
```

### Opción B: Side-by-Side (Desktop)
```
┌────────────────┬────────────────┐
│                │                │
│ Benefits       │ Pricing Card   │
│ List           │ - Price        │
│                │ - Features     │
│ - Unlimited    │ - CTA Button   │
│ - Statistics   │                │
│ - Priority     │ User Info      │
│ - Export       │ if Premium     │
│                │                │
└────────────────┴────────────────┘
```

### Opción C: Pricing Card Focus
```
┌─────────────────────────────────┐
│        Premium Crown Logo       │
│        $1.99/month              │
├─────────────────────────────────┤
│ ✓ Unlimited Live Mode           │
│ ✓ Advanced Statistics           │
│ ✓ Priority Support              │
│ ✓ Data Export                   │
├─────────────────────────────────┤
│     [ Subscribe Now ]           │
├─────────────────────────────────┤
│ Already Premium? Manage →       │
└─────────────────────────────────┘
```

**Decisión pendiente:** Elegir distribución preferida.

---

## 6. Integración de Pagos (Stripe)

### Instalación

```bash
# Cliente (React)
npm install @stripe/stripe-js @stripe/react-stripe-js

# Si usas backend propio (Node.js)
npm install stripe
```

### Configuración Inicial

**1. Crear cuenta en Stripe:**
- https://dashboard.stripe.com/register
- Obtener API keys (Publishable key + Secret key)

**2. Variables de entorno:**
```env
# .env.local
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
# Backend
STRIPE_SECRET_KEY=sk_test_xxxxx
```

**3. Crear producto en Stripe Dashboard:**
- Nombre: "Orary Premium"
- Precio: $2.99/mes (recurrente) - Precio de apertura
- Guardar `price_id` para usar en checkout

### Arquitectura de Pagos

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React App     │────▶│  Cloud Function │────▶│     Stripe      │
│   (Frontend)    │     │   (Backend)     │     │    (Payment)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │                        │
         │                      ▼                        │
         │              ┌─────────────────┐              │
         └─────────────▶│    Firestore    │◀─────────────┘
                        │  (User Data)    │   (Webhook)
                        └─────────────────┘
```

### Archivos a Crear

1. **`src/services/stripeService.js`**
   - `createCheckoutSession()` - Iniciar proceso de pago
   - `createPortalSession()` - Gestionar suscripción existente
   - `cancelSubscription()` - Cancelar suscripción

2. **Cloud Function (Firebase):**
   - `createCheckoutSession` - Crear sesión de Stripe
   - `stripeWebhook` - Recibir eventos de Stripe (pagos exitosos, cancelaciones)

3. **`src/pages/Premium.jsx`** (actualizar)
   - Integrar Stripe Elements para el formulario de pago
   - O usar Stripe Checkout (redirect)

### Modo Test de Stripe

**Tarjetas de prueba:**
```
Éxito:           4242 4242 4242 4242
Requiere auth:   4000 0025 0000 3155
Rechazada:       4000 0000 0000 9995

Cualquier fecha futura, cualquier CVC
```

---

## 7. Perfil de Test

**Tarea:** Crear mecanismo para tener un perfil de prueba Premium.

### Opción A: Flag en Firestore (RECOMENDADO)
```javascript
// En users/{uid}
{
  email: "marco@test.com",
  isPremiumTest: true,  // Flag manual para testing
  // ...
}
```

Modificar `premiumService.js`:
```javascript
export const checkPremiumStatus = async (userId) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const userData = userDoc.data();

  // Check test flag first
  if (userData?.isPremiumTest === true) {
    return { isPremium: true, isTest: true };
  }

  // Check real subscription
  // ...
};
```

### Opción B: Email whitelist
```javascript
const TEST_PREMIUM_EMAILS = [
  'marco@orary.app',
  'test@orary.app',
];

// En checkPremiumStatus:
if (TEST_PREMIUM_EMAILS.includes(userEmail)) {
  return { isPremium: true, isTest: true };
}
```

### Opción C: Development mode
```javascript
// Solo en desarrollo
if (process.env.NODE_ENV === 'development') {
  // Todos los usuarios son premium en dev
  return { isPremium: true, isTest: true };
}
```

**Decisión pendiente:** Elegir implementación para testing.

---

## 8. Revisión de Botones de Todos los Modales

### ConfirmActionModal (`src/components/modals/ConfirmActionModal/index.jsx`)

**Revisar:**
- [ ] Botón "Cancel" - usar variant ghost
- [ ] Botón de confirmación - verificar estados (loading, disabled)
- [ ] Hover states en todos los botones
- [ ] Responsive en móvil

### LiveModeStartModal

**Revisar:**
- [ ] Botón "Start Live" - deshabilitado cuando límite alcanzado
- [ ] Mensaje cuando no hay sesiones restantes
- [ ] Link a Premium cuando límite alcanzado

---

## 9. Checklist de Implementación

### Fase 1: UI/UX (Sin pagos) ✅ COMPLETADA
- [x] LockedFeatureCard con contador
- [x] PremiumModal - Gradiente animado circular
- [x] PremiumModal - Reemplazar Crown por logo (420px)
- [x] PremiumModal - Botón Cancel → ghost (gris oscuro)
- [x] Crear variante Button premium gold (sin animación)
- [x] Premium button en Navigation (desktop)
- [x] Animación fade LiveMode ↔ Premium
- [x] Nueva distribución página Premium (Opción A)
- [x] Perfil de test funcionando (isPremiumTest flag)

### Fase 2: Stripe Setup
- [ ] Crear cuenta Stripe
- [ ] Configurar productos y precios
- [ ] Instalar dependencias
- [ ] Configurar variables de entorno

### Fase 3: Backend (Cloud Functions)
- [ ] Crear función createCheckoutSession
- [ ] Crear webhook handler
- [ ] Configurar Stripe webhook en dashboard

### Fase 4: Frontend Integration
- [ ] Integrar Stripe Checkout/Elements
- [ ] Página de éxito post-pago
- [ ] Portal de gestión de suscripción

### Fase 5: Testing
- [ ] Probar flujo completo con tarjetas test
- [ ] Probar cancelación
- [ ] Probar webhooks
- [ ] Probar edge cases (pago fallido, etc.)

---

## Notas Técnicas

### Colores Premium (ya implementados)
```javascript
PREMIUM_COLORS = {
  primary: '#D4A000',   // Dark gold
  light: '#F5C518',     // Yellow
  lighter: '#FFF3CD',   // Light background
  gold: '#FFD700',      // Icon gold
  text: '#1a1a1a',      // Dark text
}
```

### Límites Actuales
- Live Mode: 5 sesiones/mes para usuarios gratuitos
- Premium: Ilimitado

### Firestore Structure
```
users/{uid}/
  isPremiumTest: boolean  // Para testing
  subscription: {
    status: 'active' | 'canceled' | 'past_due',
    plan: 'premium',
    stripeCustomerId: 'cus_xxx',
    stripeSubscriptionId: 'sub_xxx',
    currentPeriodEnd: Timestamp,
  }
  liveModeUsage: {
    monthlyCount: number,
    lastResetMonth: 'YYYY-MM',
  }
```

---

*Última actualización: 2026-02-05*
