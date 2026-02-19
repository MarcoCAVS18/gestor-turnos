# Plan de Migracion: GestAPP -> Orary

> Este documento detalla todos los pasos necesarios para completar la migracion del nombre de la aplicacion en servicios externos.
> Los cambios en el codebase ya fueron completados.

---

## Prioridades

- **P0 - Critico**: Debe hacerse ANTES del deploy. La app no funciona correctamente sin esto.
- **P1 - Alto**: Debe hacerse junto con el deploy o inmediatamente despues.
- **P2 - Medio**: Debe hacerse dentro de la primera semana post-deploy.
- **P3 - Bajo**: Puede hacerse cuando sea conveniente, no afecta funcionalidad.

---

## 1. Dominio y DNS

| Prioridad | Paso | Accion | Notas |
|-----------|------|--------|-------|
| **P0** | 1.1 | Comprar dominio `orary.app` | Google Domains, Namecheap, Cloudflare, etc. |
| **P0** | 1.2 | Configurar DNS para Firebase Hosting | Firebase Console > Hosting > Add custom domain |
| **P1** | 1.3 | Configurar emails (ver seccion 6) | `support@orary.app`, `privacy@orary.app` |
| **P2** | 1.4 | Configurar redirect `gestapp.com.au` -> `orary.app` | Mantener redirect minimo 6 meses para usuarios existentes |
| **P1** | 1.5 | Configurar SSL/TLS | Firebase lo maneja automaticamente para hosting |

---

## 2. Firebase Console

| Prioridad | Paso | Accion | Notas |
|-----------|------|--------|-------|
| **P1** | 2.1 | Cambiar **nombre publico del proyecto** a "Orary" | Firebase Console > Project Settings > General > Public-facing name |
| **P1** | 2.2 | Actualizar **support email** | Project Settings > General |
| **P0** | 2.3 | Agregar `orary.app` a **Authorized domains** en Auth | Auth > Settings > Authorized domains |
| **P1** | 2.4 | Actualizar **email templates** de Firebase Auth | Auth > Templates: cambiar "GestAPP" por "Orary" en verificacion, reset password, etc. |
| **P1** | 2.5 | Actualizar **sender name** del email de Auth | Auth > Templates > Email address: cambiar nombre del remitente a "Orary" |
| **P0** | 2.6 | Agregar custom domain en **Hosting** | Hosting > Add custom domain > `orary.app` |
| **P0** | 2.7 | CORS en `functions/index.js` | ✅ Ya completado - `orary.app` agregado |

---

## 3. Google Cloud / OAuth

| Prioridad | Paso | Accion | Notas |
|-----------|------|--------|-------|
| **P0** | 3.1 | Cambiar **App name** a "Orary" | Google Cloud Console > APIs & Services > OAuth consent screen |
| **P1** | 3.2 | Actualizar **App logo** | Subir nuevo logo si cambia |
| **P0** | 3.3 | Agregar `orary.app` a **Authorized domains** | OAuth consent screen > Authorized domains |
| **P1** | 3.4 | Actualizar URLs de **home page, privacy, terms** | `https://orary.app`, `https://orary.app/privacy`, `https://orary.app/terms` |
| **P0** | 3.5 | Actualizar **Authorized JavaScript origins** | Credentials > OAuth 2.0 Client > agregar `https://orary.app` |
| **P0** | 3.6 | Actualizar **Authorized redirect URIs** | Agregar URI con nuevo dominio |
| **P2** | 3.7 | Actualizar Google Calendar API scopes/consent | Si usas Google Calendar integration |

---

## 4. Stripe Dashboard

| Prioridad | Paso | Accion | Notas |
|-----------|------|--------|-------|
| **P1** | 4.1 | Cambiar **Business name** a "Orary" | Settings > Business settings |
| **P1** | 4.2 | Actualizar **Statement descriptor** | Lo que aparece en el extracto bancario del usuario |
| **P1** | 4.3 | Actualizar **Support URL** y **Support email** | `https://orary.app` y `support@orary.app` |
| **P1** | 4.4 | Cambiar nombre del producto a **"Orary Premium"** | Products > Editar producto |
| **P2** | 4.5 | Actualizar **Branding** (logo, icon, colores) | Settings > Branding |
| **P2** | 4.6 | Actualizar **Customer portal** links y branding | Settings > Customer portal |
| **P1** | 4.7 | Agregar webhook endpoint con nuevo dominio | Webhooks > Add endpoint (cuando dominio este listo) |
| **P2** | 4.8 | Verificar success/cancel URLs en checkout | Si estan hardcodeadas en el codigo |

---

## 5. Otros Servicios

| Prioridad | Paso | Accion | Notas |
|-----------|------|--------|-------|
| **P2** | 5.1 | **Google Search Console** | Agregar propiedad para `orary.app`, verificar sitemap |
| **P3** | 5.2 | **Google Analytics** (si usas) | Actualizar configuracion del sitio |
| **P3** | 5.3 | **Apple App Store** (si aplica) | Actualizar nombre de la app |
| **P3** | 5.4 | **Google Play Store** (si aplica) | Actualizar nombre de la app |
| **P3** | 5.5 | **Redes sociales** | Actualizar perfiles si existen |

---

## 6. Email Gratuito para Dominio Custom

### Opcion A: Cloudflare Email Routing (Recomendada - 100% Gratis)

La forma mas simple y gratuita. Cloudflare redirige los emails de tu dominio a tu Gmail personal.

**Setup:**
1. Transferir/configurar DNS de `orary.app` en Cloudflare (gratis)
2. Ir a Cloudflare Dashboard > Email > Email Routing
3. Crear reglas de reenvio:
   - `support@orary.app` -> `tu-email-personal@gmail.com`
   - `privacy@orary.app` -> `tu-email-personal@gmail.com`
   - `*@orary.app` (catch-all) -> `tu-email-personal@gmail.com`
4. Verificar tu email destino
5. Configurar **Send As** en Gmail para responder DESDE `support@orary.app`:
   - Gmail > Settings > Accounts > "Send mail as" > Add another email
   - Ingresar `support@orary.app`
   - Usar SMTP de Cloudflare o un servicio SMTP gratuito

**Ventajas:** Completamente gratis, sin limites de emails, facil setup, interfaz web sencilla.
**Desventaja:** No es un buzón real, es solo reenvio (pero con "Send As" en Gmail se ve profesional).

### Opcion B: Zoho Mail Free Tier

Zoho ofrece un plan gratuito con hasta 5 usuarios y buzon real.

**Setup:**
1. Crear cuenta en [Zoho Mail](https://www.zoho.com/mail/zohomail-pricing.html) (plan Free)
2. Verificar dominio `orary.app` agregando registros MX
3. Crear buzones: `support@orary.app`, `privacy@orary.app`
4. Acceder desde `mail.zoho.com` o la app de Zoho

**Ventajas:** Buzon real con interfaz web, 5GB storage, hasta 5 usuarios gratis.
**Desventaja:** La interfaz no es tan buena como Gmail, limite de 5 usuarios.

### Opcion C: ImprovMX (Free Tier)

Similar a Cloudflare pero dedicado solo a email forwarding.

**Setup:**
1. Registrarse en [ImprovMX](https://improvmx.com)
2. Agregar dominio y configurar DNS
3. Crear aliases y reenviar a Gmail

**Ventajas:** Muy simple, enfocado solo en forwarding.
**Desventaja:** Free tier limitado a 25 forwards/dia y 500 emails/mes.

### Recomendacion Final

**Usa Cloudflare Email Routing** - Es la opcion mas robusta y completamente gratuita:
- Sin limites de emails
- Setup en 10 minutos
- Si ya usas Cloudflare para DNS, es un click
- Combinado con Gmail "Send As" tenes envio + recepcion profesional gratis

---

## Orden Recomendado de Ejecucion

```
1. [P0] Comprar dominio orary.app
2. [P0] Configurar DNS (Cloudflare recomendado)
3. [P0] Configurar email routing (Cloudflare Email Routing)
4. [P0] Firebase: Authorized domains + Hosting custom domain
5. [P0] Google Cloud: OAuth consent screen + Authorized origins/redirects
6. [P1] Firebase: Nombre, templates, sender
7. [P1] Stripe: Nombre, producto, webhook
8. [P1] Deploy del nuevo codigo
9. [P2] Google Search Console
10. [P2] Redirect gestapp.com.au -> orary.app
11. [P2] Stripe: Branding, customer portal
12. [P3] Analytics, redes sociales, app stores
```

---

## Archivos del codebase ya actualizados

> Referencia de todos los archivos modificados durante el renaming.

| Archivo | Cambios |
|---------|---------|
| `public/index.html` | Meta tags, Open Graph, Twitter Card, structured data, title |
| `public/manifest.json` | short_name, name |
| `public/sitemap.xml` | Todas las URLs a orary.app |
| `public/robots.txt` | Sitemap URL |
| `src/pages/auth/Login.jsx` | Titulo h1 |
| `src/pages/auth/Register.jsx` | Titulo h1 |
| `src/pages/legal/DeleteAccount.jsx` | Alt texts, textos, email |
| `src/pages/legal/ClearEverything.jsx` | Alt texts, textos |
| `src/pages/legal/TermsOfService.jsx` | 13 ocurrencias + email |
| `src/pages/legal/PrivacyPolicy.jsx` | 11 ocurrencias + emails |
| `src/components/layout/Header/index.jsx` | Titulo del header |
| `src/components/layout/PageHeader/index.jsx` | Document title dinamico |
| `src/components/layout/Navigation/index.jsx` | Titulo en nav |
| `src/components/about/StorySection/index.jsx` | Texto "Orary was born" |
| `src/components/about/CreatorSection/index.jsx` | Texto "I built Orary" |
| `src/components/about/ClaudeSection/index.jsx` | Texto "features in Orary" |
| `src/components/about/HeroSection/index.jsx` | Alt del logo |
| `src/components/about/AboutFooter/index.jsx` | Copyright |
| `src/components/about/FeedbackSection/index.jsx` | Texto feedback |
| `src/components/dashboard/SuggestedActionCard/index.jsx` | "Enjoying Orary?" |
| `src/pages/Integrations.jsx` | Logo alt, titulo instalacion |
| `src/services/export/png/PNGDashboard.jsx` | Footer del export |
| `functions/index.js` | CORS origin |
| `docs/PREMIUM_ROADMAP.md` | Nombre y emails |
