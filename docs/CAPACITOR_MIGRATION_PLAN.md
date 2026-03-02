# Plan de Migración a Capacitor (iOS & Android)

> **Estrategia**: Web app + App nativa en paralelo. El hosting de Firebase se conserva intacto.
> **Stack actual**: React 19, Firebase, Stripe, Tailwind, Framer Motion, Recharts

---

## Resumen Ejecutivo

Capacitor actúa como un **wrapper nativo** alrededor de nuestra React app. El mismo código fuente genera tres productos:

| Plataforma | Distribución | Estado actual |
|---|---|---|
| Web | Firebase Hosting | ✅ En producción |
| Android | Google Play Store | 🔲 Por migrar |
| iOS | Apple App Store | 🔲 Por migrar |

No se reescribe nada. El flujo es: `react-scripts build` → Capacitor copia el `build/` → genera proyectos Xcode / Android Studio nativos.

---

## Fases del Plan

### Fase 1 — Setup Base (1-2 días)

**Objetivo**: Capacitor instalado y la app corriendo en simulador.

#### 1.1 Instalación

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
npx cap init
```

Valores a ingresar en `cap init`:
- App name: `Orary` (o el nombre de marca final)
- App ID: `com.Orary.app` (debe coincidir con App Store / Play Store)

#### 1.2 Configurar `capacitor.config.ts`

```ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.orary.app',
  appName: 'Orary',
  webDir: 'build',           // output de react-scripts build
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#EC4899',  // pink brand color
      showSpinner: false
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
```

#### 1.3 Agregar plataformas

```bash
npm run build           # siempre buildear antes de agregar plataformas
npx cap add android
npx cap add ios
npx cap sync            # copia build/ a las plataformas nativas
```

#### 1.4 Primer test en simulador

```bash
npx cap open android    # abre Android Studio
npx cap open ios        # abre Xcode
```

---

### Fase 2 — Compatibilidad y Adaptaciones (2-3 días)

**Objetivo**: Resolver todos los puntos de conflicto entre la web app actual y el entorno nativo.

#### 2.1 Content Security Policy (CSP)

**Problema crítico**: El `firebase.json` actual tiene una CSP muy estricta pensada para el browser. En Capacitor (especialmente Android), las peticiones se hacen desde un contexto diferente.

**Solución**: Separar la CSP en dos lugares:

1. `firebase.json` → solo afecta la **web** (se deja igual o se relaja mínimamente)
2. `capacitor.config.ts` → manejo nativo con `allowNavigation` si hace falta

```ts
// capacitor.config.ts - agregar si hay problemas de fetch en Android
server: {
  androidScheme: 'https',
  allowNavigation: [
    '*.googleapis.com',
    '*.firebaseapp.com',
    '*.stripe.com'
  ]
}
```

#### 2.2 Stripe

**Problema**: `@stripe/stripe-js` usa iframes y redirecciones. En WebView nativo puede comportarse diferente.

**Opciones** (en orden de preferencia):

| Opción | Pros | Contras |
|---|---|---|
| Stripe Checkout (redirect) | Sin trabajo extra | Sale de la app al browser |
| `@capacitor-community/stripe` | Nativo, mejor UX | Más configuración |
| In-App Purchases (Apple) | Obligatorio para subs iOS | Requiere revisión Apple, comisión 30% |

> ⚠️ **Importante**: Apple exige que las suscripciones dentro de una app iOS **deben** usar In-App Purchases. Si Stripe cobra suscripciones, necesitaremos implementar `@capacitor-community/in-app-purchases` para iOS.

**Acción recomendada para Fase 2**: probar Stripe Checkout redirect. Si Apple lo rechaza, implementar IAP en Fase 3.

#### 2.3 Firebase Auth

Firebase Auth funciona bien en Capacitor, pero el **Google Sign-In** necesita ajuste:

```bash
npm install @codetrix-studio/capacitor-google-auth
```

```ts
// En AuthContext.jsx - detectar plataforma
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

const signInWithGoogle = async () => {
  if (Capacitor.isNativePlatform()) {
    const result = await GoogleAuth.signIn();
    const credential = GoogleAuthProvider.credential(result.authentication.idToken);
    return signInWithCredential(auth, credential);
  } else {
    // flujo web actual
    return signInWithPopup(auth, new GoogleAuthProvider());
  }
};
```

#### 2.4 Deep Links / URL Scheme

Para que links externos (ej: reseteo de contraseña por email) abran la app:

- Android: `com.shiftmanager.app://` en `AndroidManifest.xml`
- iOS: Associated Domains en Xcode

#### 2.5 Exports (Excel / PDF)

`html2canvas`, `jspdf`, `xlsx-js-style` funcionan en WebView. Sin embargo, el **guardado de archivos** necesita el plugin nativo:

```bash
npm install @capacitor/filesystem @capacitor/share
```

```js
// En export/index.js - detectar plataforma para guardar
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

if (Capacitor.isNativePlatform()) {
  // guardar en Documents y abrir share sheet
  await Filesystem.writeFile({ path: 'report.xlsx', data: base64, directory: Directory.Documents });
  await Share.share({ title: 'Reporte', url: filePath });
} else {
  // download actual (blob URL)
}
```

---

### Fase 3 — Funciones Nativas Premium (3-4 días)

**Objetivo**: Agregar valor nativo que la web no puede ofrecer.

#### 3.1 Push Notifications

```bash
npm install @capacitor/push-notifications
```

Casos de uso:
- Recordatorio de carga de turno ("No olvidés cargar tu turno de hoy")
- Alerta cuando el pago del mes supera un umbral
- Notificación de festivos próximos

Configuración:
- Android: Firebase Cloud Messaging (ya tenemos Firebase)
- iOS: APNs (requiere Apple Developer Account)

#### 3.2 Splash Screen + App Icon

```bash
npm install @capacitor/splash-screen @capacitor/status-bar
```

Herramienta recomendada para generar todos los tamaños de íconos:

```bash
npx @capacitor/assets generate
# requiere: assets/icon.png (1024x1024) y assets/splash.png (2048x2048)
```

#### 3.3 Haptic Feedback

```bash
npm install @capacitor/haptics
```

```js
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// En acciones importantes (guardar turno, completar onboarding)
await Haptics.impact({ style: ImpactStyle.Medium });
```

#### 3.4 Biometría (Opcional - Feature Premium)

```bash
npm install capacitor-biometric-auth
```

Permite login con Face ID / Touch ID / Huella dactilar.

#### 3.5 Status Bar y Safe Areas

En iOS, el notch y la Dynamic Island requieren padding extra. Tailwind con `env(safe-area-inset-*)` resuelve la mayoría, pero hay que probar en dispositivo real.

```css
/* En index.css */
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

### Fase 4 — In-App Purchases iOS (Obligatorio para subs en iOS)

> Solo necesario si Apple rechaza el modelo actual de Stripe para suscripciones.

```bash
npm install @capacitor-community/in-app-purchases
```

**Productos a crear en App Store Connect**:
- `com.shiftmanager.premium.monthly` — suscripción mensual
- `com.shiftmanager.premium.yearly` — suscripción anual

El backend (Firebase Functions) debe validar los recibos con el API de Apple.

**Flujo**:
1. App solicita productos a Apple
2. Usuario compra
3. App recibe recibo → lo envía al backend
4. Backend valida con Apple → activa premium en Firestore

---

### Fase 5 — App Store Submission (2-3 días)

#### 5.1 Google Play Store

**Requisitos**:
- Google Play Developer Account ($25 único)
- `release` keystore firmado
- Target SDK >= 34 (Android 14)
- Privacy Policy URL
- Screenshots: teléfono (mínimo 2), tablet (recomendado)

**Build de producción**:
```bash
npm run build && npx cap sync
# En Android Studio: Build → Generate Signed Bundle → AAB
```

**Categoría recomendada**: Business → Productivity

#### 5.2 Apple App Store

**Requisitos**:
- Apple Developer Program ($99/año)
- Mac con Xcode
- Certificados de distribución y provisioning profiles
- Screenshots: iPhone 6.9", 6.5", iPad Pro 12.9" (si se soporta)
- Privacy Nutrition Labels
- App Review Information (cuenta de prueba)

**Build de producción**:
```bash
npm run build && npx cap sync
# En Xcode: Product → Archive → Distribute App
```

**Categoría recomendada**: Business o Productivity

#### 5.3 Checklist previo a submission

- [ ] Íconos en todos los tamaños requeridos
- [ ] Splash screen en todos los tamaños
- [ ] Privacy Policy accesible desde la app
- [ ] Terms of Service accesible desde la app
- [ ] Cuenta demo para reviewers de Apple (sin Google OAuth)
- [ ] Descripción en inglés y español
- [ ] Screenshots con dispositivos reales o simulador en tamaños exactos
- [ ] No referencias a otras plataformas (no mencionar "Android" en la app de iOS y viceversa)
- [ ] App funciona offline o muestra mensaje claro cuando no hay conexión

---

### Fase 6 — CI/CD Multi-plataforma (Opcional pero recomendado)

Herramientas:

| Herramienta | Uso |
|---|---|
| **Fastlane** | Automatizar build, firma y upload a stores |
| **GitHub Actions** | Trigger en push a `main` |
| **Codemagic** | CI/CD especializado en Flutter/Capacitor (alternativa hosted) |

```yaml
# .github/workflows/release.yml (esquema básico)
on:
  push:
    branches: [main]
jobs:
  web:
    # firebase deploy --only hosting
  android:
    # npm run build → cap sync → gradle assembleRelease → upload to Play
  ios:
    runs-on: macos-latest
    # npm run build → cap sync → xcodebuild archive → upload to TestFlight
```

---

## Estructura de Archivos Final

```
gestor-turnos/
├── src/                          # código React (sin cambios)
├── public/                       # web assets (sin cambios)
├── build/                        # output de react-scripts build
├── android/                      # proyecto Android Studio (generado por Capacitor)
│   └── app/src/main/
│       ├── AndroidManifest.xml
│       └── res/                  # íconos, splash
├── ios/                          # proyecto Xcode (generado por Capacitor)
│   └── App/
│       ├── App/
│       └── Assets.xcassets/      # íconos, splash
├── assets/                       # fuentes para generación de íconos
│   ├── icon.png                  # 1024x1024
│   └── splash.png                # 2048x2048
├── capacitor.config.ts           # configuración central de Capacitor
├── docs/
│   └── CAPACITOR_MIGRATION_PLAN.md
└── package.json
```

---

## Detección de Plataforma en el Código

Patrón estándar a usar en cualquier componente:

```js
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();       // true en iOS y Android
const platform = Capacitor.getPlatform();             // 'ios' | 'android' | 'web'

// Ejemplo en AuthContext, exports, notificaciones
if (platform === 'ios') {
  // lógica específica iOS (IAP, Face ID)
} else if (platform === 'android') {
  // lógica específica Android
} else {
  // lógica web actual
}
```

---

## Puntos de Atención Críticos

### 1. Stripe en iOS
Apple puede rechazar la app si detecta que las suscripciones premium se manejan fuera del sistema IAP. Preparar implementación de IAP como plan B antes de someter la app.

### 2. CSP Headers
Los headers de seguridad en `firebase.json` solo aplican a la web. No afectan la app nativa, pero hay que asegurarse de que las peticiones a Firebase, Stripe y demás servicios funcionen desde el WebView nativo.

### 3. Google OAuth en iOS
El flujo `signInWithPopup` no funciona igual en WebView. **Hay que** usar `@codetrix-studio/capacitor-google-auth` o equivalente antes de someter a App Store.

### 4. Permisos Obligatorios
Declarar en `Info.plist` (iOS) y `AndroidManifest.xml` los permisos que se usen:
- Push Notifications → siempre
- Camera/Photos → solo si se agrega captura de recibos
- Location → solo si se activa geolocalización de turnos

### 5. App Size
Nuestro bundle React es relativamente grande (recharts, jspdf, xlsx, etc.). Considerar **lazy loading** por rutas para reducir el tiempo de carga inicial en la app nativa.

---

## Roadmap Sugerido

```
Semana 1: Fase 1 + Fase 2 (setup + compatibilidad)
Semana 2: Fase 3 (funciones nativas) + testing en dispositivos reales
Semana 3: Fase 4 si es necesario (IAP) + preparar assets de stores
Semana 4: Fase 5 (submission) — primero Play Store, luego App Store
```

> El ciclo de revisión de Apple puede tardar 1-7 días. Play Store suele ser 1-3 días para la primera versión.

---

## Recursos

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Capacitor Community Plugins](https://github.com/capacitor-community)
- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy Center](https://support.google.com/googleplay/android-developer/topic/9858052)
- [Fastlane](https://fastlane.tools/)
- [Codemagic CI/CD](https://codemagic.io/)
