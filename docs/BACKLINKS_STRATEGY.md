# Orary — Backlink & Community Strategy

> **Objetivo:** Conseguir visibilidad orgánica, backlinks de calidad y primeros usuarios reales sin presupuesto de ads.
> **Tono:** Personal, honesto, humano. Soy el desarrollador, lo hice porque lo necesitaba, lo comparto porque puede ayudar a otros.

---

## Reglas generales antes de empezar

1. **Cuenta de Reddit nueva = cuenta muerta.** Crear una cuenta el día 1 y postear links el día 2 es la forma más rápida de ser shadowbanned. Ver el plan de calentamiento abajo.
2. **El link va al final, siempre.** O mejor: en un comentario cuando alguien lo pida.
3. **Nunca copiar-pegar el mismo texto** en dos subreddits. Automod detecta contenido duplicado.
4. **Registrar en directorios primero** — no tienen restricciones y generan backlinks de DA 90+ desde el día uno.
5. **Responder todos los comentarios** durante las primeras 2–4 horas de cualquier post. El engagement temprano es lo que decide si un post sube o muere.

---

## Fase 0: Directorios (Hacer primero, sin esperas)

Estos no tienen reglas anti-spam. Hacerlos todos la primera semana. Generan backlinks de alta autoridad aunque nadie los vea.

| Directorio | DA | Prioridad | URL |
|---|---|---|---|
| **G2** | 92 | Máxima | g2.com/products/new |
| **Capterra** | 92 | Máxima | capterra.com/vendors |
| **Crunchbase** | 91 | Máxima | crunchbase.com/add-new |
| **Trustpilot** | 93 | Máxima | business.trustpilot.com |
| **AlternativeTo** | 82 | Alta | alternativeto.net/add |
| **SaaSHub** | 67 | Alta | saashub.com/new |
| **BetaList** | 36 | Alta | betalist.com/submit *(submit pronto — tiene queue de semanas)* |
| **Indie Hackers** | 42 | Alta | indiehackers.com/product/new |
| **SideProjectors** | — | Media | sideprojectors.com |
| **Startupbase** | — | Media | startupbase.io |
| **F6S** | — | Media | f6s.com |
| **Launching Next** | — | Media | launchingnext.com |
| **Dev Hunt** | — | Media | devhunt.org |
| **WebCatalog** | 43 | Media | webcatalog.io |
| **Crozdesk** | — | Baja | crozdesk.com |

**En AlternativeTo listar Orary como alternativa a:** Deputy, When I Work, Shiftboard, Clockify, TSheets.

---

### Descripción estándar para directorios

```
Orary is a free shift management and earnings tracker for casual workers, 
delivery drivers, and working holiday visa holders.

Track your shifts, calculate your exact take-home pay based on your real 
rates (including penalties, superannuation, and tips), and see your income 
stats across weeks, months, and jobs — all in one place.

Built for workers who juggle multiple jobs, irregular hours, or delivery 
platforms. Includes a live shift timer, delivery earnings tracking, 
calendar view, and a 88-day regional work counter for Australian WHV holders.

Free to use. No ads. Optional premium for exports and advanced analytics.
```

---

## Fase 1: Plan de calentamiento en Reddit (21 días)

**Días 1–7:** Solo leer. Unirse a los subreddits de abajo. No comentar nada todavía.

**Días 8–14:** Comentar 2–3 veces por día. Respuestas genuinas de 4–6 oraciones. Nunca mencionar Orary. Objetivos de subreddits para comentarios iniciales:
- r/ShiftWork — cualquier hilo sobre horarios o pagos
- r/AusFinance — preguntas sobre casual employment
- r/doordash_drivers — consejos sobre earnings
- r/SideProject — dar feedback a proyectos de otros

**Días 15–21:** Primer post de texto sin links en r/SideProject o r/buildinpublic.

**A partir del día 22:** Empezar a postear con links, según el calendario de abajo.

---

## Fase 2: Posts en comunidades de devs

### r/SideProject

**Cuándo:** Día 22+. El subreddit más amigable para lanzamientos.
**Regla clave:** Posts genuinos de "I built X" son el contenido principal de este sub. Link al final o en comentario.

---

**Título:**
```
I built a free shift tracker after losing track of how much I was actually making across 3 jobs
```

**Cuerpo:**
```
For about two years I was juggling multiple casual jobs — some hospitality, 
some retail. Every fortnight I'd try to reconcile my payslips with what I 
thought I'd earned and something never added up.

I tried spreadsheets. I tried generic time trackers. None of them understood 
penalty rates, different rates for the same job depending on what day it was, 
or the fact that I was also doing some weekend delivery work on the side.

So I built something for myself. Then a few friends started using it. Then 
I cleaned it up and put it online.

It's called Orary. It lets you:
- Track shifts across multiple jobs with different hourly rates and penalty rates
- Track delivery earnings separately (per platform, per vehicle)
- See a live timer when you clock in
- Get a real breakdown of what you'll earn before the payslip arrives
- Export to PDF/Excel if you need it for tax

It's free. The premium version is $2.99 AUD/month and unlocks the export stuff, 
but the core tracking is free and always will be.

It's my first project I'd actually call "serious" — I'm a solo dev and this 
took way longer than I expected. Happy to talk through any of the technical 
decisions if anyone's curious.

[Link in the comments if anyone wants to try it]
```

---

### r/buildinpublic

**Cuándo:** Día 22+. Orientado a compartir el proceso, no solo el producto.

---

**Título:**
```
6 months building Orary in public — what worked, what didn't, what's next
```

**Cuerpo:**
```
I started building Orary as a personal tool to track my shifts and earnings 
across multiple casual jobs. Six months later it's a real web app with paying 
users (a few, but real ones).

What I thought would take 2 months took 6. Shipping the payment system alone 
took way longer than the entire core feature set. Firebase Auth has a dozen 
edge cases I didn't expect. The export feature is 80% of the codebase.

What actually worked:
- Building for a specific pain (my own)
- Talking to delivery workers early — they had completely different needs than 
  hourly workers and I almost missed that market entirely
- Keeping the free tier genuinely useful

What I'd do differently:
- Ship earlier and uglier
- Spend less time on animations (I love Framer Motion too much)
- Not try to support 3 languages on day one

Current state: free tier + $2.99 AUD/month premium. Core features free forever.

What's next: figuring out whether to push harder on the Australian WHV market 
(there's a specific use case around the 88-day regional work rule that I built 
a tracker for) or lean into the delivery worker angle.

Happy to share what I know if you're building something in the same space — 
or if you're a casual/delivery worker and want to give feedback.
```

---

### r/shamelessplug

**Cuándo:** Cualquier momento, no tiene restricciones.
**Regla:** No referral links, nada corporativo. Posts personales OK.

---

**Título:**
```
I made a free shift + earnings tracker for casual workers and delivery drivers — orary.app
```

**Cuerpo:**
```
Solo dev here. Built this because I needed it and nothing else did quite what 
I wanted.

Orary tracks your shifts, calculates earnings with penalty rates and super, 
tracks delivery income separately, and gives you a full breakdown before your 
payslip arrives.

Free for core features. $2.99 AUD/month if you want PDF/Excel exports.

If you work odd hours, multiple jobs, or drive for any delivery platform — 
give it a try and let me know what's missing. Still improving it every week.

https://orary.app
```

---

### Hacker News — Show HN

**Cuándo:** Lanzamiento principal (coordinar con Product Hunt el mismo día).
**Reglas críticas:**
- Estar presente para responder las primeras 6 horas sin excepción
- Admitir limitaciones abiertamente — HN premia la honestidad intelectual
- No usar exclamaciones ni superlatives
- Título en minúsculas salvo nombres propios

---

**Título:**
```
Show HN: Orary – free shift tracker and earnings calculator for casual workers
```

**Cuerpo (primer comentario):**
```
I built Orary because I spent too long trying to reconcile spreadsheets 
with payslips that never matched.

The core problem: casual workers (hospitality, retail, delivery) have 
variable rates depending on day/time/role, often across multiple employers. 
Generic time trackers don't understand Australian penalty rates or 
superannuation. Delivery workers have completely different data (tips, 
platform fees, vehicle costs) that don't map to hourly shifts at all.

What Orary does:
- Shift tracking with per-job rate configurations (base, afternoon, night, 
  weekend, public holiday)
- Delivery earnings tracking (per platform, per vehicle type)
- Live shift timer
- Stats dashboard with weekly/monthly breakdowns
- PDF and Excel export (premium)
- 88-day regional work counter for Australian working holiday visa holders

Stack: React, Firebase, Stripe for subscriptions. Hosted on Firebase Hosting.

What I know is missing: native mobile app, calendar sync, proper offline 
support. Working on all three.

Happy to answer any technical questions or talk through decisions I made 
that might look odd.

https://orary.app
```

---

### Product Hunt

**Tagline:**
```
Track your shifts, know your real earnings — before the payslip arrives
```

**Description:**
```
Orary is a free shift management and earnings tracker for casual workers, 
delivery drivers, and working holiday visa holders.

Built because nothing else handled the reality of casual work: multiple 
jobs, variable rates, penalty rates, superannuation, delivery earnings 
from different platforms, and trying to figure out what you'll actually 
take home.

Core features (free):
→ Shift tracking across multiple jobs with custom rate configurations
→ Delivery earnings tracking (per platform, per vehicle)
→ Live shift timer with auto-calculated earnings
→ Weekly and monthly stats dashboard
→ 88-day regional work counter for Australian WHV holders

Premium ($2.99 AUD/month):
→ PDF and Excel exports with full breakdowns
→ Advanced analytics and charts

Solo built. First serious project. Made it because I needed it.
```

---

## Fase 3: Comunidades de trabajadores

> **Importante:** En estos subreddits NO postear directamente. La estrategia es responder preguntas existentes de forma genuina y mencionar Orary como herramienta que uso yo, no como producto que vendo.

### r/doordash_drivers / r/UberEATS / r/couriersofreddit

**Cuándo alguien pregunta** "how do you track your actual hourly rate?" o "how do you know if a shift is worth it?" responder con algo así:

```
I track everything in a separate app — I got tired of DoorDash's own 
stats not accounting for the time I spend waiting between orders, or the 
difference between what a shift feels like and what I actually made per hour.

I actually ended up building my own tracker for this (I'm a developer) 
that handles delivery earnings separately from hourly shifts. It does the 
per-platform, per-vehicle breakdown and gives you a real picture of what 
your actual hourly rate is once you factor in wait time and costs.

It's at orary.app if you want to try it — it's free. Still adding features 
but the core earnings tracking works well.
```

---

### r/personalfinance / r/AusFinance

**Cuándo alguien pregunta** sobre cómo trackear ingresos irregulares para impuestos, o cómo comparar gigs:

```
For irregular income across multiple casual jobs or gigs the thing that 
helped me most was tracking every single shift in real time rather than 
trying to reconstruct it at tax time.

I use an app called Orary (full disclosure: I built it) that tracks per-job 
rates including penalties and super contributions, plus delivery earnings 
separately. By the end of each week I know exactly what I've made and how 
it breaks down — which makes tax prep significantly less painful.

If you want something pre-built that someone else maintains, there are 
other options but I haven't found one that handles Australian penalty 
rates and delivery gigs in the same place.
```

---

### r/InternetIsBeautiful

**Cuándo:** Cuenta con karma suficiente (100+). Solo funciona si la cuenta tiene historial genuino.
**Regla:** Solo herramientas gratuitas. No productos de pago. Orary tiene free tier así que aplica.

---

**Título:**
```
[OC] A free tool I built to track real earnings across multiple jobs and 
delivery platforms — with penalty rates, super, and WHV 88-day tracking
```

**Cuerpo:**
```
I got tired of payslips that never matched what I thought I'd earned.

Built Orary to track shifts across multiple casual jobs (with different 
penalty rates per day/time), delivery earnings per platform, and generate 
a real breakdown of take-home pay before the payslip arrives.

Also added an 88-day regional work counter for Australian working holiday 
visa holders — that was a frequent request from friends on WHV.

It's free. No ads. (There's a $2.99/month optional premium for exports 
but core tracking is free forever.)

https://orary.app

Made it because I needed it and nothing else did exactly what I wanted.
Feedback welcome — still building it.
```

---

## Fase 4: Comunidades de WHV / Backpackers Australia y NZ

Esta es la audiencia más específica y de mayor conversión para la funcionalidad del contador de 88 días.

### Subreddits WHV

**r/AusBackpackers / r/WorkingHoliday**

Responder preguntas del tipo "how do I track my 88 days?" con:

```
I went through this on my WHV. The confusion is partly because the 
definition of "eligible work" is surprisingly strict — regional area, 
approved industry, and it has to be paid.

What helped me was keeping a proper log from day one with the exact 
dates, employer name, and type of work. I ended up building a tracker 
for this into an app I was already making for shift/earnings tracking 
(Orary — orary.app). The 88-day counter is free.

It won't tell you if your specific employer is approved (that's an 
immigration question) but it keeps the count accurate and gives you 
a running total so you're not scrambling at the end trying to reconstruct 
6 months of farm work from bank statements.
```

---

### Facebook Groups

**Grupos objetivo:**
- Backpacker Jobs Australia (2025–2026)
- Working Holiday Australia (WHV Net AU)
- Australia Backpackers
- New Zealand Backpackers
- 2nd Year Visa Jobs

**Estrategia:** Unirse, leer durante 1–2 semanas, responder preguntas sobre 88 días orgánicamente. Cuando alguien pregunta directamente cómo trackear días o earnings, compartir el link. **No crear posts de promoción directa** — los grupos de Facebook son aún más agresivos que Reddit con eso.

**Mensaje para comentario en Facebook (cuando alguien pregunta cómo contar 88 días):**

```
Hola! I went through the exact same stress trying to count mine. 
What helped most was keeping a running log from the start with dates, 
employer, and location.

I actually built an 88-day tracker into an app I was making for tracking 
my shift earnings — it's free and you can see the running count at any 
time: orary.app

Doesn't tell you if your employer is government-approved (check immi.gov.au 
for that) but it keeps the count straight which was the part that was 
stressing me out.

Good luck with it! The second year is worth the grind 🌾
```

---

### Sitios y blogs para outreach (guest posts / menciones)

Estos sitios rankean muy bien en Google para búsquedas de WHV. Un link desde cualquiera de ellos vale más que 50 Reddit posts.

| Sitio | Por qué | Cómo acercarse |
|---|---|---|
| **the88thday.com** | Blog dedicado exclusivamente a la regla de 88 días | Email directo: "I built a free 88-day tracker, interested in a mention or guest post?" |
| **clueless.travel** | Guía WHV Australia muy popular en Google | Mismo approach — ofrecerles un artículo de "how to track your 88 days digitally" |
| **australia-backpackersguide.com** | Calcula los 88 días manualmente — Orary lo hace automático | Contactar ofreciendo la herramienta como complemento a su contenido |
| **backpackerjobboard.com.au** | Job board + comunidad de backpackers | Preguntar por listing o mención en su sección de herramientas |
| **backpackerjobsnow.com** | Similar | Mismo approach |

**Template de email de outreach:**

```
Subject: Free tool for tracking 88-day regional work — worth mentioning to your readers?

Hi [name],

I've been reading [site name] — your guide on [specific article] is exactly 
what I wish I'd had when I was figuring out my WHV requirements.

I'm a solo developer and I built a free 88-day regional work counter into 
an app called Orary (orary.app) that I originally made to track casual 
earnings. A lot of WHV holders use it to keep a running count alongside 
their shift and earnings tracking.

It's completely free. I'm not asking for anything in return — I just thought 
it might be genuinely useful to mention to your readers who are actively 
trying to count their days.

If you want to try it or have any questions, happy to help.

Marco
orary.app
```

---

## Resumen del calendario

| Semana | Acción |
|---|---|
| **Semana 1** | Registrar en todos los directorios (G2, Capterra, Crunchbase, Trustpilot, AlternativeTo, BetaList) |
| **Semana 1–3** | Calentamiento de cuenta Reddit — solo comentarios genuinos sin links |
| **Semana 2** | Unirse a Facebook groups de backpackers Australia/NZ — solo leer |
| **Semana 3** | Posts en r/SideProject, r/shamelessplug, r/buildinpublic |
| **Semana 3** | Posts en r/betatests, r/TestMyApp, r/alphaandbetausers |
| **Semana 4** | Lanzamiento coordinado Product Hunt + Hacker News Show HN |
| **Semana 4+** | Responder preguntas en r/doordash_drivers, r/AusFinance, r/AusBackpackers |
| **Semana 4+** | Outreach por email a the88thday.com, clueless.travel, australia-backpackersguide.com |
| **Cuando karma >= 100** | r/InternetIsBeautiful post |

---

## Anti-spam checklist antes de cada post

- [ ] ¿La cuenta tiene más de 21 días?
- [ ] ¿Hay historial de comentarios genuinos en el subreddit?
- [ ] ¿El texto es original (no copiado de otro subreddit)?
- [ ] ¿El link está al final o en un comentario, no al inicio del post?
- [ ] ¿El post habla del problema primero y del producto después?
- [ ] ¿Hay disclosure "(I'm the dev)" en algún punto?
- [ ] ¿El título no empieza con "Check out" / "Download" / "Free app"?
- [ ] ¿Hay disponibilidad para responder comentarios durante las próximas 2–4 horas?

---

*Documento generado: Abril 2026 — actualizar fechas y stats de subreddits cada 6 meses.*
