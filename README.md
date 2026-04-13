<div align="center">

<img src="public/assets/SVG/logo.svg" alt="Orary Logo" width="90" height="90" />

# Orary

**Professional shift management & earnings tracker**

Track your work shifts, calculate earnings automatically, and analyze your income with detailed statistics — built for workers worldwide.

[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Capacitor](https://img.shields.io/badge/Capacitor_8-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20ES%20%7C%20FR-orange?style=for-the-badge)](https://www.i18next.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Live App](https://orary.app) · [Report a Bug](https://github.com/MarcoCAVS18/gestor-turnos/issues) · [Request Feature](https://github.com/MarcoCAVS18/gestor-turnos/issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Environment Variables](#environment-variables)
  - [Firebase Setup](#firebase-setup)
- [Docker](#docker)
- [Mobile (iOS & Android)](#mobile-ios--android)
- [Export System](#export-system)
- [Data Models](#data-models)
- [Custom Hooks Reference](#custom-hooks-reference)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [Developer](#developer)

---

## Overview

Orary is a full-stack web and mobile application that helps workers manage their shifts, track earnings, and understand their income patterns. It supports both **traditional hourly jobs** and **delivery / gig work**, with intelligent rate calculations per shift type, real-time live sessions, bulk shift creation, and professional PDF/Excel report exports.

Originally built as a personal tool for managing work in Australia, it evolved into a complete platform deployed on [orary.app](https://orary.app) — featuring a Premium subscription tier, native mobile apps via Capacitor, multi-language support (EN / ES / FR), and a cross-platform work-sharing system.

---

## Features

### Core (Free)

| Feature | Description |
|---|---|
| **Dashboard** | Real-time stats: current week earnings, hours, upcoming shifts, and quick actions |
| **Works Management** | Create jobs with custom hex colors, per-shift-type rates (day / afternoon / night / Saturday / Sunday / holidays) |
| **Shift Tracking** | Log shifts with automatic earnings calculation; midnight-crossing shifts handled correctly |
| **Bulk Shift Creation** | Generate multiple shifts at once using weekly patterns, specific dates, or date ranges |
| **Interactive Calendar** | Monthly calendar with color-coded shift indicators per job |
| **Shift Filters** | Filter by work, weekday, or shift type (day / afternoon / night) |
| **Delivery Mode** | Track gig work (Uber Eats, DoorDash, etc.) with orders, km, fuel costs, and tips |
| **Statistics** | Interactive Recharts graphs — earnings over time, hours per work, rate breakdowns |
| **Australia 88 Days** | Automatic Working Holiday Visa day tracker based on weekly hours in eligible jobs |
| **Multi-currency** | Live exchange rates for international workers via Frankfurter API |
| **Holiday Detection** | Automatic public holiday identification with country-aware rate application |
| **Break Tracking (Smoko)** | Configurable unpaid break deduction per shift |
| **Shared Work** | Share job stats via unique shareable links — viewable without an account |
| **Profile Customization** | Theme color, emoji avatar, weekly hours goal, discount settings |
| **i18n** | Full UI in English, Spanish, and French |
| **PWA** | Installable on any device from the browser |

### Premium ($1.99/month via Stripe)

| Feature | Description |
|---|---|
| **Live Mode** | Real-time session timer showing earnings tick up as you work (unlimited sessions) |
| **Advanced Statistics** | Monthly breakdowns, trend comparisons, per-work analytics |
| **Data Export** | Professional Excel (.xlsx) and PDF reports with charts and branding |
| **Priority Support** | Direct support channel |

### Platform & Security

- **Biometric login** — Face ID / Touch ID on native apps via Capacitor
- **Google Sign-In** — one-tap authentication on web and mobile
- **Rate-limited Cloud Functions** — abuse prevention via Firestore-backed sliding window limiter
- **Profanity filtering** — applied on user-generated content
- **HTTPS + HSTS + CSP** — strict security headers via Firebase Hosting configuration
- **Firestore security rules** — strict per-user data isolation
- **Content Security Policy** — allowlisted Stripe, Firebase, and Google domains
- **Push notifications** — shift reminders on native apps
- **Haptic feedback** — tactile response on native interactions
- **Pre-rendered HTML** — Puppeteer-based SEO pre-render for public pages

---

## Tech Stack

### Frontend

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion v12 |
| Animations (advanced) | GSAP v3 |
| Icons | Lucide React |
| Charts | Recharts v3 |
| Internationalization | i18next + react-i18next (EN / ES / FR) |
| SEO | react-helmet-async |
| Testing | Testing Library (React + Jest DOM) |

### Backend & Cloud

| Layer | Technology |
|---|---|
| Database | Firebase Firestore |
| Authentication | Firebase Auth (Email/Password, Google OAuth) |
| Hosting | Firebase Hosting |
| Cloud Functions | Firebase Functions v2 (Node.js) |
| File Storage | Firebase Storage |
| Payments | Stripe (Checkout + Webhooks + Customer Portal) |
| Public Holidays | date-holidays (country-aware) |
| Exchange Rates | Frankfurter API (live) |

### Export

| Format | Library |
|---|---|
| Excel (.xlsx) | xlsx-js-style |
| PDF | jsPDF v3 |
| Chart-to-image | html2canvas |

### Mobile (Capacitor 8)

| Plugin | Feature |
|---|---|
| `@capacitor/android` + `@capacitor/ios` | Native wrappers |
| `@capgo/capacitor-native-biometric` | Face ID / Fingerprint login |
| `@capawesome/capacitor-google-sign-in` | Google Auth on native |
| `@capacitor/share` | Native OS share sheet |
| `@capacitor/local-notifications` | Shift reminders |
| `@capacitor/filesystem` | Export file saving to device |
| `@capacitor/haptics` | Tactile feedback |
| `@capacitor/splash-screen` | Native splash screen |
| `@capacitor/status-bar` | Status bar styling |
| `@capacitor/browser` | In-app browser for OAuth flows |

### Dev & Build

| Tool | Use |
|---|---|
| react-scripts 5 | Build system (CRA) |
| TypeScript | Capacitor config typing |
| Puppeteer | SEO pre-rendering |
| ESLint | Code linting |
| PostCSS + Autoprefixer | CSS processing |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│   React 19  ·  React Router v7  ·  Tailwind  ·  Framer     │
├──────────────┬──────────────────────────────────────────────┤
│  Web (PWA)   │            Native (Capacitor 8)              │
│  orary.app   │        iOS App  ·  Android App               │
├──────────────┴──────────────────────────────────────────────┤
│                     State Management                        │
│    React Context API  ·  Custom Hooks  ·  Local Storage     │
├──────────────────────────────┬──────────────────────────────┤
│         Firebase             │          Stripe              │
│  Firestore · Auth · Storage  │  Checkout · Webhooks · Portal│
├──────────────────────────────┴──────────────────────────────┤
│                   Cloud Functions (Node.js)                  │
│  createCheckoutSession · stripeWebhook · userCalendar       │
│  sendEmail · rateLimiter · CORS guard                       │
└─────────────────────────────────────────────────────────────┘
```

### Context / Provider Hierarchy

The app uses a layered Context API. Each context has a dedicated hook for consumption:

```
AppContext              → Root aggregator — exposes works, shifts, calculatePayment, theme
├── AuthContext         → Firebase user session (currentUser, signIn, signOut)
├── DataContext         → Regular works & shifts (Firestore real-time listeners)
├── DeliveryContext     → Delivery works & shifts (Firestore real-time listeners)
├── StatsContext        → Computed statistics (memoized from DataContext)
├── PremiumContext      → Stripe subscription status (isPremium, plan details)
├── LiveModeContext     → Real-time session (start/stop, earnings counter, usage limit)
├── ConfigContext       → User settings, theme color, locale, shiftRanges
└── CalculationsContext → Payment calculation engine (rates × hours × shift type)
```

### Payment Calculation Engine

`calculationService.js` handles the full rate matrix:
- Splits shifts that cross midnight into per-day segments
- Applies the correct rate for each segment: day / afternoon / night / Saturday / Sunday / holiday
- Integrates with `holidayService.js` for automatic holiday detection by country
- Supports a configurable discount (default 15%) for tax estimates

---

## Project Structure

```
gestor-turnos/
├── public/
│   ├── assets/
│   │   ├── SVG/           # Logos: logo.svg, logo-white.svg, premium.svg, bimi.svg
│   │   ├── images/        # Static images
│   │   ├── icons/         # App icons (PWA + native)
│   │   └── videos/        # Background video (landing/auth)
│   ├── index.html         # HTML shell with SEO meta, OG tags, structured data
│   ├── manifest.json      # PWA manifest
│   ├── sitemap.xml        # Auto-generated sitemap
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── about/         # About page sections (Story, Creator, Claude, Hero, Footer)
│   │   ├── alerts/        # Toast / notification components
│   │   ├── australia88/   # 88-day visa ticker widget
│   │   ├── auth/          # Login / register UI
│   │   ├── calendar/      # Monthly calendar with shift indicators
│   │   ├── cards/         # Reusable data display cards
│   │   ├── charts/        # Recharts wrappers (earnings, hours, breakdowns)
│   │   ├── dashboard/     # Stat cards, quick actions, suggested action card
│   │   ├── delivery/      # Delivery shift cards and forms
│   │   ├── demos/         # Feature demo/preview components
│   │   ├── filters/       # Date + work + shift-type filter bar
│   │   ├── forms/         # Work form, shift form, delivery form, bulk shift form
│   │   ├── icons/         # Custom SVG icon components
│   │   ├── layout/        # Header, Navigation, PageHeader (with dynamic title)
│   │   ├── modals/        # All modals: live mode, premium, confirm, bulk, shift, work
│   │   ├── native/        # Capacitor native bridges (biometric, notifications)
│   │   ├── premium/       # Locked feature cards, premium gates
│   │   ├── sections/      # Reusable page section wrappers
│   │   ├── settings/      # Settings panels (theme, rates, breaks, holidays)
│   │   ├── shared/        # Shared work view components (public, no auth)
│   │   ├── shifts/        # Shift list, shift card, swipe-to-delete
│   │   ├── stats/         # Statistics widgets and Australia88 week card
│   │   ├── ui/            # Base UI library: Button, Input, Badge, Modal, Skeleton…
│   │   └── work/          # Work card with share + delete actions
│   ├── contexts/
│   │   ├── AppContext.jsx          # Root aggregator
│   │   ├── AuthContext.jsx         # Firebase Auth
│   │   ├── CalculationsContext.jsx # Payment engine wiring
│   │   ├── ConfigContext.jsx       # Settings + theme
│   │   ├── DataContext.jsx         # Regular data streams
│   │   ├── DeliveryContext.jsx     # Delivery data streams
│   │   ├── LiveModeContext.jsx     # Live session state
│   │   ├── PremiumContext.jsx      # Stripe subscription
│   │   └── StatsContext.jsx        # Computed stats
│   ├── hooks/
│   │   ├── useAustralia88.js       # 88-day visa progress data
│   │   ├── useCalendarState.js     # Month navigation + day selection
│   │   ├── useClearProfile.js      # Wipe all user data flow
│   │   ├── useDashboardStats.js    # Current week / month summary
│   │   ├── useDeleteManager.js     # Delete confirmation modal flow
│   │   ├── useFilterTurnos.js      # Shift filter state (work / day / type)
│   │   ├── useFormValidation.js    # Reusable field-level validation
│   │   ├── useIsMobile.js          # Responsive breakpoint detection
│   │   ├── useLiveMode.js          # Live Mode session access
│   │   ├── useLocalStorage.js      # Typed localStorage wrapper
│   │   ├── useModalManager.js      # Work + shift modal open/close state
│   │   ├── useShare.js             # Native share sheet + link generation
│   │   ├── useSharedWork.js        # Accept shared work via URL token
│   │   ├── useSwipeActions.js      # Touch swipe detection for mobile lists
│   │   ├── useThemeColors.js       # Dynamic theme color derivation
│   │   ├── useTurnManager.js       # Shift modal state management
│   │   ├── useUtils.js             # Currency + hours formatters (i18n-aware)
│   │   └── useWorks.js             # Works list with share + delete integration
│   ├── pages/
│   │   ├── auth/                   # Login, Register
│   │   ├── legal/                  # PrivacyPolicy, TermsOfService, DeleteAccount, ClearEverything
│   │   ├── About.jsx
│   │   ├── CalendarView.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Integrations.jsx        # PWA / native app install guide
│   │   ├── Landing.jsx             # Public landing page (SEO, background video)
│   │   ├── NotFound.jsx
│   │   ├── Premium.jsx
│   │   ├── ServerError.jsx
│   │   ├── Settings.jsx
│   │   ├── SharedWork.jsx          # Public work view via share token
│   │   ├── Shifts.jsx
│   │   ├── Statistics.jsx
│   │   └── Works.jsx
│   ├── services/
│   │   ├── export/                 # Professional export system
│   │   │   ├── index.js            # Public API: exportReport(type, …)
│   │   │   ├── ExportService.js    # Orchestrator
│   │   │   ├── data/               # ReportDataBuilder — normalises shift data
│   │   │   ├── excel/              # ExcelExporter (xlsx-js-style, multi-sheet)
│   │   │   ├── pdf/                # PDFExporter (jsPDF, cover + charts + tables)
│   │   │   ├── png/                # PNGDashboard (html2canvas snapshot)
│   │   │   └── utils/              # ExportCharts — Recharts → PNG via html2canvas
│   │   ├── australia88Service.js   # 88-day visa day calculation logic
│   │   ├── biometricService.js     # Face ID / fingerprint auth bridge
│   │   ├── bulkShiftService.js     # Pattern-based bulk shift generation
│   │   ├── calculationService.js   # Rate × hours × shift-type engine
│   │   ├── currencyService.js      # Live exchange rates (Frankfurter API)
│   │   ├── firebase.js             # Firebase app initialization
│   │   ├── firebaseService.js      # Firestore CRUD operations
│   │   ├── holidayService.js       # Public holiday detection (date-holidays)
│   │   ├── liveSessionService.js   # Live Mode sessions (Firestore real-time)
│   │   ├── native/                 # Capacitor plugin wrappers
│   │   ├── premiumService.js       # Stripe subscription status checks
│   │   ├── profilePhotoService.js  # Profile photo upload (Firebase Storage)
│   │   ├── shareService.js         # Shareable link generation + acceptance
│   │   └── stripeService.js        # Stripe Checkout / Customer Portal
│   ├── config/            # App-wide constants and configuration
│   ├── constants/         # Shared constant values (delivery platforms, etc.)
│   ├── locales/
│   │   ├── en/translation.json    # English
│   │   ├── es/translation.json    # Spanish
│   │   └── fr/translation.json    # French
│   ├── styles/            # Global CSS overrides
│   ├── utils/
│   │   ├── analytics.js           # Event tracking helpers
│   │   ├── arrayUtils.js          # Array manipulation utilities
│   │   ├── calendarUtils.js       # Date grid generation
│   │   ├── colorUtils.js          # Hex color manipulation + theme derivation
│   │   ├── currency.js            # Currency formatting (Intl.NumberFormat)
│   │   ├── helpers.js             # General-purpose helpers
│   │   ├── logger.js              # Environment-aware console logger
│   │   ├── pluralization.js       # i18n-aware plural forms
│   │   ├── profanityFilter.js     # User content filtering (bad-words)
│   │   ├── shiftDetailsUtils.js   # Shift type classification (day/afternoon/night)
│   │   ├── shiftTypesConfig.js    # Shift type definitions and labels
│   │   ├── shiftUtils.js          # Earnings computation from shift data
│   │   ├── statsCalculations.js   # Aggregate statistics computation
│   │   ├── time/                  # Date parsing, formatting, range helpers
│   │   └── workUtils.js           # Work display helpers
│   ├── App.js             # Router setup and provider tree composition
│   ├── i18n.js            # i18next initialization (EN / ES / FR, auto-detect)
│   └── index.js           # React entry point
├── functions/             # Firebase Cloud Functions (Node.js)
│   ├── index.js           # All functions: payments, webhooks, calendar, email, rate limiting
│   ├── emailService.js    # Transactional email logic
│   └── email-templates/   # HTML email templates
├── android/               # Android Studio project (Capacitor-generated)
├── ios/                   # Xcode project (Capacitor-generated)
├── docs/                  # Internal planning documents
│   ├── AUSTRALIA_88_PLAN.md
│   ├── CAPACITOR_MIGRATION_PLAN.md
│   ├── FIRESTORE_STRUCTURE.md
│   ├── FIRESTORE_INDEXES.md
│   ├── OPTIMIZACIONES.md
│   ├── ORARY_MIGRATION_PLAN.md
│   ├── PREMIUM_ROADMAP.md
│   └── SECURITY_AUDIT.md
├── scripts/
│   └── prerender.js       # Puppeteer-based SEO pre-renderer
├── capacitor.config.ts    # Capacitor: appId, plugins, splash, status bar
├── firebase.json          # Firebase Hosting + Functions + security headers
├── firestore.rules        # Firestore per-user security rules
├── firestore.indexes.json # Composite index definitions
├── storage.rules          # Firebase Storage security rules
├── tailwind.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| Firebase CLI | Latest (`npm i -g firebase-tools`) |
| Java JDK | 17+ *(Android builds only)* |
| Xcode | 14+ *(iOS builds only, macOS required)* |

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/MarcoCAVS18/gestor-turnos.git
cd gestor-turnos

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# → Fill in your Firebase and Stripe keys (see next section)

# 4. Start the development server
npm start
# → http://localhost:3000
```

### Environment Variables

Create `.env.local` in the project root:

```env
# ─── Firebase ────────────────────────────────────────────────
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# ─── Stripe ──────────────────────────────────────────────────
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...

# ─── Google Sign-In ──────────────────────────────────────────
REACT_APP_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

Create `functions/.env` for Cloud Functions secrets:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

> **Never commit `.env.local` or `functions/.env`** — they are already listed in `.gitignore`.

### Firebase Setup

#### 1. Create a Firebase project and log in

```bash
firebase login
firebase init
# Select: Firestore, Functions, Hosting, Storage
```

#### 2. Deploy security rules

```bash
firebase deploy --only firestore:rules,storage
```

#### 3. Deploy Firestore indexes

```bash
firebase deploy --only firestore:indexes
```

#### 4. Deploy Cloud Functions

```bash
cd functions && npm install
cd ..
firebase deploy --only functions
```

#### 5. Enable Auth providers

In Firebase Console → **Authentication → Sign-in method**, enable:
- Email/Password
- Google

Add your domain (e.g. `orary.app`) and `localhost` to **Authorized Domains**.

#### 6. (Optional) Firebase Emulators for local development

```bash
firebase emulators:start --only auth,firestore,functions,storage
```

Update `src/services/firebase.js` to connect to emulators when `NODE_ENV === 'development'`.

---

## Docker

Run Orary locally without installing Node.js globally, or build a production image to self-host.

### Development container

```dockerfile
# Dockerfile.dev
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -f Dockerfile.dev -t orary-dev .
docker run -p 3000:3000 --env-file .env.local \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/public:/app/public \
  orary-dev
# → http://localhost:3000 with hot reload
```

### Production image

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production=false
COPY . .

# Inject build-time env vars
ARG REACT_APP_FIREBASE_API_KEY
ARG REACT_APP_FIREBASE_PROJECT_ID
ARG REACT_APP_FIREBASE_AUTH_DOMAIN
ARG REACT_APP_FIREBASE_STORAGE_BUCKET
ARG REACT_APP_FIREBASE_MESSAGING_SENDER_ID
ARG REACT_APP_FIREBASE_APP_ID
ARG REACT_APP_STRIPE_PUBLISHABLE_KEY

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  # SPA routing — all paths serve index.html
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Long cache for hashed static assets
  location /static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

```bash
# Build
docker build \
  --build-arg REACT_APP_FIREBASE_API_KEY=AIza... \
  --build-arg REACT_APP_FIREBASE_PROJECT_ID=my-project \
  --build-arg REACT_APP_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com \
  --build-arg REACT_APP_FIREBASE_STORAGE_BUCKET=my-project.appspot.com \
  --build-arg REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789 \
  --build-arg REACT_APP_FIREBASE_APP_ID=1:123:web:abc \
  --build-arg REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_... \
  -t orary:latest .

# Run
docker run -p 8080:80 orary:latest
# → http://localhost:8080
```

### Docker Compose (app + Firebase emulators)

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src
      - ./public:/app/public
    env_file:
      - .env.local
    depends_on:
      - emulators

  emulators:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - .:/app
    ports:
      - "4000:4000"   # Emulator Suite UI
      - "5001:5001"   # Cloud Functions
      - "8080:8080"   # Firestore
      - "9099:9099"   # Authentication
      - "9199:9199"   # Storage
    command: >
      sh -c "npm install -g firebase-tools &&
             firebase emulators:start
               --only auth,firestore,functions,storage
               --project demo-orary"
```

```bash
docker compose up
# App → http://localhost:3000
# Emulator UI → http://localhost:4000
```

---

## Mobile (iOS & Android)

Orary uses [Capacitor 8](https://capacitorjs.com) to package the same React codebase as native iOS and Android apps. The Capacitor config is in `capacitor.config.ts`.

```typescript
// capacitor.config.ts (summary)
{
  appId: 'app.orary',
  appName: 'Orary',
  webDir: 'build',
  server: { androidScheme: 'https' },
  plugins: {
    SplashScreen: { launchShowDuration: 500, backgroundColor: '#111827' },
    StatusBar: { style: 'DARK', overlaysWebView: true }
  }
}
```

### Build workflow

```bash
# 1. Build the React app
npm run build

# 2. Sync web assets into native projects
npx cap sync

# 3. Open in the native IDE
npx cap open android   # Android Studio
npx cap open ios       # Xcode (macOS only)
```

### Android

**Requirements:** Android Studio Electric Eel+, JDK 17, Android SDK 34+

```bash
# Debug APK
cd android && ./gradlew assembleDebug

# Release AAB (Google Play)
./gradlew bundleRelease
```

The release keystore (`orary-release.jks`) must be present at the repo root. Signing credentials are injected via environment variables in the build config.

```groovy
// android/app/build.gradle
signingConfigs {
  release {
    storeFile file('../../orary-release.jks')
    storePassword System.getenv("KEYSTORE_PASSWORD")
    keyAlias     "orary"
    keyPassword  System.getenv("KEY_PASSWORD")
  }
}
```

### iOS

**Requirements:** Xcode 14+, macOS, Apple Developer account

```bash
npx cap open ios
# In Xcode: set bundle ID to "app.orary", configure signing, then Product → Archive
```

---

## Export System

The professional export system in `src/services/export/` generates full business-quality reports from shift data.

### Usage

```javascript
import { exportReport } from '@/services/export';

// Generate an Excel report
await exportReport('excel', stats, shifts, works, calculatePayment, {
  shiftRanges,
  userSettings,
  deliveryShifts,
  deliveryWorks,
});

// Supported types: 'excel' | 'pdf' | 'png'
```

### Excel Report (`xlsx-js-style`)

- Cover sheet with branding (logo + blue `#4472C4` accent)
- Per-month breakdown sheets
- Earnings-by-work summary table
- Delivery stats sheet (if applicable)
- Professional column widths, cell borders, and font styling

### PDF Report (`jsPDF`)

- Cover page with logo (pink `#EC4899` accent)
- Charts rendered to PNG via Recharts + `html2canvas`
- Detailed shift tables with type and rate annotations
- Monthly analytics section
- Branded footer on each page

### PNG Dashboard Snapshot

- Captures the current dashboard view via `html2canvas`
- Useful for quick sharing to social or messaging apps

---

## Data Models

### `users/{userId}`

```javascript
{
  email: string,
  displayName: string,
  photoURL?: string,            // Firebase Storage URL
  createdAt: Timestamp,
  settings: {
    primaryColor: string,       // Hex (default '#EC4899')
    userEmoji: string,          // Profile emoji
    defaultDiscount: number,    // Tax discount % (default 15)
    weeklyHoursGoal: number | null,
    deliveryEnabled: boolean,
    smokoEnabled: boolean,      // Break deduction
    smokoMinutes: number,       // Break duration (default 30)
    shiftRanges: {
      dayStart: number,         // Hour, default 6
      dayEnd: number,           // Hour, default 14
      afternoonStart: number,
      afternoonEnd: number,
      nightStart: number
    }
  },
  subscription: {
    status: 'active' | 'canceled' | 'past_due',
    stripeCustomerId: string,
    stripeSubscriptionId: string,
    currentPeriodEnd: Timestamp
  },
  liveModeUsage: {
    monthlyCount: number,       // Sessions used this month (free: max 5)
    lastResetMonth: string      // 'YYYY-MM'
  }
}
```

### `works/{workId}`

```javascript
// Regular (hourly) work
{
  userId: string,
  name: string,
  type: 'regular',
  color: string,                // Hex color for UI
  baseRate: number,
  rates: {
    day: number,
    afternoon: number,
    night: number,
    saturday: number,
    sunday: number,
    holidays: number
  },
  active: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

// Delivery / gig work
{
  userId: string,
  name: string,
  type: 'delivery',
  platform: string,             // 'Uber Eats', 'DoorDash', etc.
  vehicle: string,              // 'Bicycle' | 'Motorcycle' | 'Car'
  avatarColor: string,          // Hex (default '#10B981')
  active: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `shifts/{shiftId}`

```javascript
// Regular shift
{
  userId: string,
  workId: string,
  type: 'regular',
  date: string,                 // YYYY-MM-DD (primary sort key)
  startDate: string,            // YYYY-MM-DD
  endDate: string,              // YYYY-MM-DD
  startTime: string,            // HH:mm
  endTime: string,              // HH:mm
  crossesMidnight: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

// Delivery shift
{
  userId: string,
  workId: string,
  type: 'delivery',
  date: string,
  startTime: string,
  endTime: string,
  crossesMidnight: boolean,
  baseEarnings: number,
  tips: number,
  totalEarnings: number,        // baseEarnings + tips
  netEarnings: number,          // totalEarnings - fuelExpense
  orderCount: number,
  kilometers: number,
  fuelExpense: number,
  platform: string,             // Denormalized from work
  vehicle: string,              // Denormalized from work
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## Custom Hooks Reference

| Hook | Description |
|---|---|
| `useAustralia88` | Computes Working Holiday Visa day progress from weekly hours in eligible jobs |
| `useCalendarState` | Manages month navigation, day selection, and auto-update every minute |
| `useClearProfile` | Orchestrates the "wipe all my data" user flow with loading/error state |
| `useDashboardStats` | Derives current week and month earnings + hours summary for the Dashboard |
| `useDeleteManager` | Manages the confirmation modal flow before any delete operation |
| `useShiftFilters` | Filter state for shifts list — by work, weekday, and shift type |
| `useFormValidation` | Generic field-level validation engine with rule arrays |
| `useIsMobile` | Detects mobile viewport via configurable breakpoint (default 768px) |
| `useLiveMode` | Access Live Mode session state — start, stop, elapsed, earnings counter |
| `useLocalStorage` | Typed wrapper around `localStorage` with JSON serialization and error handling |
| `useModalManager` | Work and shift modal open/close state with selected item tracking |
| `useShare` | Triggers native OS share sheet or clipboard fallback for work links |
| `useSharedWork` | Reads and accepts a shared work via URL token; handles auth state |
| `useSwipeActions` | Touch event handler for swipe-to-reveal actions on mobile lists |
| `useThemeColors` | Derives full color palette (primary, dark, light, text) from the user's chosen hex |
| `useTurnManager` | Shift modal state: new / edit mode, selected shift, initial date |
| `useUtils` | i18n-aware `formatCurrency` and `formatHours` helpers |
| `useWorks` | Aggregates works list with share, delete, and modal management |

---

## Scripts

```bash
npm start              # Development server → http://localhost:3000
npm run build          # Production build → /build
npm run build:prod     # Production build + Puppeteer SEO pre-render
npm run prerender      # Run pre-renderer only (requires existing /build)
npm test               # Run test suite (Testing Library + Jest)
npm run eject          # Eject from CRA (irreversible — avoid unless necessary)
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit following conventional commits: `git commit -m 'feat: add your feature'`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request against `main`

Please keep PRs focused — one feature or fix per PR. Run `npm run build` before submitting to catch any compilation errors.

---

## Developer

**Marco Piermatei**

- GitHub: [@MarcoCAVS18](https://github.com/MarcoCAVS18)
- Email: [marcopiermatei1@gmail.com](mailto:marcopiermatei1@gmail.com)
- App: [orary.app](https://orary.app)

> Built with [Claude Code](https://claude.ai/code) — AI-assisted development by Anthropic.

---

<div align="center">

**[orary.app](https://orary.app)** · © 2026 Orary · MIT License

</div>
