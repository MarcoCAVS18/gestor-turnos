# Firestore Indexes Required

Este archivo contiene los índices compuestos que **DEBES crear manualmente** en Firestore Console para optimizar las queries y reducir costos.

## 🔴 CRÍTICO: Crear estos índices ANTES de ir a producción

Sin estos índices, las queries serán más lentas y potencialmente más costosas.

---

## Cómo crear los índices

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Firestore Database** → **Indexes** (pestaña superior)
4. Click en **"Create Index"** para cada uno de estos:

---

## Index 1: shifts - userId + type + date

**Collection:** `shifts`

| Field | Order |
|-------|-------|
| userId | Ascending |
| type | Ascending |
| date | Descending |

**Query scope:** Collection

**Usado por:**
- `subscribeToNormalData` - Listeners de turnos regulares
- `subscribeToDeliveryData` - Listeners de turnos delivery

**Impacto:** Sin este índice, las queries de turnos serán 5-10% más lentas

---

## Index 2: shifts - userId + workId

**Collection:** `shifts`

| Field | Order |
|-------|-------|
| userId | Ascending |
| workId | Ascending |

**Query scope:** Collection

**Usado por:**
- `deleteJob` - Eliminar todos los turnos asociados a un trabajo

**Impacto:** Crítico para eliminación eficiente de trabajos

---

## Index 3: works - userId + type

**Collection:** `works`

| Field | Order |
|-------|-------|
| userId | Ascending |
| type | Ascending |

**Query scope:** Collection

**Usado por:**
- `subscribeToNormalData` - Listeners de trabajos regulares
- `subscribeToDeliveryData` - Listeners de trabajos delivery

**Impacto:** Optimiza carga inicial de trabajos

---

## Index 4: liveSessions - userId + status

**Collection:** `liveSessions`

| Field | Order |
|-------|-------|
| userId | Ascending |
| status | Ascending |

**Query scope:** Collection

**Usado por:**
- `subscribeToLiveSession` - Live mode real-time tracking

**Impacto:** Necesario para live mode funcional

---

## Verificación

Una vez creados, los índices tardan unos minutos en estar activos. Puedes verificar su estado en la pestaña "Indexes" de Firestore Console.

**Estado esperado:** ✅ "Enabled" (verde)

Si ves errores en la consola del navegador sobre índices faltantes, Firestore te dará un link directo para crearlos.

---

## Costos

Los índices tienen un costo de storage mínimo (~$0.18/GB/mes), pero **ahorran mucho más** al hacer las queries más eficientes.

**Estimación:** 4 índices para 10,000 documentos ≈ **$0.05-0.10/mes**
**Ahorro en queries:** **$5-20/mes** (queries 10x más rápidas = menos reads)

---

## Auto-creación (alternativa futura)

Si quieres automatizar esto en el futuro, puedes usar:
```bash
firebase deploy --only firestore:indexes
```

Con un archivo `firestore.indexes.json` en la raíz del proyecto.
